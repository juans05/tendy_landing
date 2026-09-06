// @vitest-environment node
import { createHmac } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('./server', () => ({ supabase: vi.fn() }));
import { paymentRecord, validSignature } from './payments';
import { accessUntil, nextMonth, type Subscription } from './types';
const sub: Subscription = { id:'123',user_id:'adult',mp_id:'mp123',status:'authorized',init_point:null,next_payment_date:null,created_at:'2026-01-01' };
const payment = { id:1,status:'approved',transaction_amount:14.9,currency_id:'PEN',collector_id:123,live_mode:false,date_approved:'2026-01-31T12:00:00Z',date_created:'2026-01-31T12:00:00Z',date_last_updated:'2026-01-31T12:00:00Z' };
describe('verified membership payments', () => {
  beforeEach(() => { vi.stubEnv('MP_COLLECTOR_ID','123'); vi.stubEnv('MP_LIVE_MODE','false'); });
  afterEach(() => { vi.unstubAllEnvs(); });
  it('verifies the provider signature and rejects altered IDs, request IDs and invalid signatures', () => {
    const secret='test-secret';
    const sig=createHmac('sha256',secret).update('id:abc123;request-id:request1;ts:123;').digest('hex');
    expect(validSignature('ABC123','request1',`ts=123,v1=${sig}`,secret)).toBe(true);
    expect(validSignature('other','request1',`ts=123,v1=${sig}`,secret)).toBe(false);
    expect(validSignature('abc123','request2',`ts=123,v1=${sig}`,secret)).toBe(false);
    expect(validSignature('abc123','request1','ts=123,v1=bad',secret)).toBe(false);
  });
  it('clamps month-end billing dates, including leap years', () => {
    expect(nextMonth('2026-01-31T12:00:00Z')).toBe('2026-02-28T12:00:00.000Z');
    expect(nextMonth('2028-01-31T12:00:00Z')).toBe('2028-02-29T12:00:00.000Z');
  });
  it('grants access only to approved, unexpired billing periods', () => {
    const record=paymentRecord(payment,sub,'2026-01-31T12:00:00Z');
    const now=Date.parse('2026-02-01T00:00:00Z');
    expect(accessUntil([record],now)).toBe('2026-02-28T12:00:00.000Z');
    expect(accessUntil([{...record,status:'pending'}],now)).toBeNull();
    expect(accessUntil([{...record,status:'refunded'}],now)).toBeNull();
    expect(accessUntil([record],Date.parse('2026-03-01'))).toBeNull();
  });
  it('never grants membership for another merchant, amount, mode or future billing date', () => {
    for (const change of [{collector_id:999},{transaction_amount:1},{currency_id:'USD'},{live_mode:true}]) expect(()=>paymentRecord({...payment,...change},sub,'2026-01-31')).toThrow();
    expect(()=>paymentRecord(payment,sub,'2099-01-01')).toThrow();
  });
  it('revokes a partially refunded period even if the provider status still says approved', () => {
    expect(paymentRecord({...payment,transaction_amount_refunded:1},sub,'2026-01-31').status).toBe('refunded');
  });
});
