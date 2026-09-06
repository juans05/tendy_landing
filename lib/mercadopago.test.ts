import { describe, expect, it } from 'vitest';
import { buildPreapprovalPayload, isPlanId, PLANS } from './mercadopago';
import { club } from './club';

describe('monthly membership checkout', () => {
  it('uses the same price as the public offer', () => {
    expect(PLANS.monthly.price).toBe(Number(club.price));
    expect(PLANS.monthly.price).toBe(14.9);
  });
  it('rejects every plan except monthly', () => {
    expect(isPlanId('monthly')).toBe(true);
    for (const value of ['annual','trimestral','weekly',undefined]) expect(isPlanId(value)).toBe(false);
  });
  it('binds recurring payments to the reserved subscription, not an email or browser-supplied amount', () => {
    const payload = buildPreapprovalPayload('monthly','ana@example.com','https://tendy.pe/mi-club','subscription-uuid');
    expect(payload.external_reference).toBe('subscription-uuid');
    expect(payload.auto_recurring).toEqual({frequency:1,frequency_type:'months',transaction_amount:14.9,currency_id:'PEN'});
    expect(payload.status).toBe('pending');
  });
});
