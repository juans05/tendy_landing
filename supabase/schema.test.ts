// @vitest-environment node
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
const userA='11111111-1111-4111-8111-111111111111';
const userB='22222222-2222-4222-8222-222222222222';
const subA='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const subB='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
let db:PGlite;
beforeAll(async()=>{
 db=new PGlite();
 await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
 create schema storage; create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);`);
 await db.exec(readFileSync('supabase/schema.sql','utf8'));
 await db.exec(`insert into members(id,email) values('${userA}','a@test.dev'),('${userB}','b@test.dev');`);
},30000);
afterAll(async()=>{await db?.close();});
describe('real Postgres schema and access rules',()=>{
 it('reserves one recurring checkout per user, even when called again with another ID',async()=>{
  const first=await db.query<{id:string}>('select * from reserve_subscription($1,$2)',[subA,userA]);
  const duplicate=await db.query<{id:string}>('select * from reserve_subscription($1,$2)',[subB,userA]);
  expect(first.rows[0].id).toBe(subA);
  expect(duplicate.rows[0].id).toBe(subA);
  expect((await db.query('select * from subscriptions')).rows).toHaveLength(1);
 });
 it('deduplicates payment callbacks and does not overwrite a refund with an older approval',async()=>{
  const record={id:'123',subscription_id:subA,user_id:userA,status:'approved',amount:14.9,paid_at:'2026-01-01T00:00:00Z',period_end:'2026-02-01T00:00:00Z',updated_at:'2026-01-01T00:00:00Z'};
  await db.query('select record_payment($1)',[JSON.stringify(record)]);
  await db.query('select record_payment($1)',[JSON.stringify(record)]);
  expect((await db.query('select * from payments')).rows).toHaveLength(1);
  await db.query('select record_payment($1)',[JSON.stringify({...record,status:'refunded',updated_at:'2026-01-02T00:00:00Z'})]);
  await db.query('select record_payment($1)',[JSON.stringify(record)]);
  expect((await db.query<{status:string}>('select status from payments')).rows[0].status).toBe('refunded');
 });
 it('keeps members, subscriptions, payments and orders server-only: no authenticated or anon access',async()=>{
  await db.exec('set role authenticated');
  await expect(db.query('select * from payments')).rejects.toThrow();
  await expect(db.query('select * from subscriptions')).rejects.toThrow();
  await expect(db.query('select * from orders')).rejects.toThrow();
  await expect(db.query('select * from members')).rejects.toThrow();
  await expect(db.query('insert into admins(user_id) values($1)',[userB])).rejects.toThrow();
  await expect(db.query('select record_payment($1)',['{}'])).rejects.toThrow();
  await db.exec('reset role');
 });
 it('accepts a correct login code once, then rejects reuse',async()=>{
  await db.query(`insert into auth_codes(email,code_hash,expires_at) values('once@test.dev','the-hash',now() + interval '10 minutes')`);
  const first=await db.query<{verify_auth_code:boolean}>('select verify_auth_code($1,$2)',['once@test.dev','the-hash']);
  expect(first.rows[0].verify_auth_code).toBe(true);
  const second=await db.query<{verify_auth_code:boolean}>('select verify_auth_code($1,$2)',['once@test.dev','the-hash']);
  expect(second.rows[0].verify_auth_code).toBe(false);
 });
 it('atomically caps guesses at 5, so the limit cannot be bypassed even by the right code afterward',async()=>{
  await db.query(`insert into auth_codes(email,code_hash,expires_at) values('guess@test.dev','right-hash',now() + interval '10 minutes')`);
  for (let i=0;i<5;i++) {
   const wrong=await db.query<{verify_auth_code:boolean}>('select verify_auth_code($1,$2)',['guess@test.dev','wrong-hash']);
   expect(wrong.rows[0].verify_auth_code).toBe(false);
  }
  const tooLate=await db.query<{verify_auth_code:boolean}>('select verify_auth_code($1,$2)',['guess@test.dev','right-hash']);
  expect(tooLate.rows[0].verify_auth_code).toBe(false);
 });
 it('rejects an expired code even with the right hash',async()=>{
  await db.query(`insert into auth_codes(email,code_hash,expires_at) values('expired@test.dev','the-hash',now() - interval '1 minute')`);
  const result=await db.query<{verify_auth_code:boolean}>('select verify_auth_code($1,$2)',['expired@test.dev','the-hash']);
  expect(result.rows[0].verify_auth_code).toBe(false);
 });
 it('keeps drafts private and prevents anonymous writes or checkout reservations',async()=>{
  await db.exec("insert into products(name,category) values('Draft toy','Toys');");
  await db.exec('set role anon');
  expect((await db.query('select * from products')).rows).toHaveLength(0);
  await expect(db.query("update products set published=true")).rejects.toThrow();
  await expect(db.query('select * from reserve_subscription($1,$2)',[subB,userB])).rejects.toThrow();
  await db.exec('reset role');
 });
});
