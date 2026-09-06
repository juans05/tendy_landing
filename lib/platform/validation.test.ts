import { describe, expect, it } from 'vitest';
import { validateAdminItem } from './validation';
const product={name:'Guantes',category:'Aventura',description:'Juguete',age:'6 años',price:60,member_price:50,stock:1,image_url:'/images/toy-car.webp',published:true};
describe('catalog and campaign validation', () => {
  it('rejects invalid discounts, negative stock and incomplete public listings', () => {
    expect(()=>validateAdminItem('products',product)).not.toThrow();
    for(const changes of [{member_price:70},{stock:-1},{stock:1.5},{price:null},{image_url:''},{image_url:'https://evil.test/track.svg'}]) expect(()=>validateAdminItem('products',{...product,...changes})).toThrow();
  });
  it('allows drafts with no invented prices or inventory', () => {
    expect(validateAdminItem('products',{...product,price:null,member_price:null,image_url:'',stock:null,published:false})).toMatchObject({price:null,member_price:null,stock:null});
  });
  it('rejects campaigns without a valid period or conditions', () => {
    expect(()=>validateAdminItem('campaigns',{title:'Campaña',description:'Descripción',conditions:'',starts_at:'2026-01-01',ends_at:'2026-02-01'})).toThrow();
    expect(()=>validateAdminItem('campaigns',{title:'Campaña',description:'Descripción',conditions:'Reglas',starts_at:'2026-03-01',ends_at:'2026-02-01'})).toThrow();
  });
});
