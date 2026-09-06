import { describe, expect, it } from 'vitest';
import { buildPreapprovalPayload, isPlanId, PLANS } from './mercadopago';

describe('PLANS', () => {
  it('prices the annual plan as 11 months, saving one month', () => {
    expect(PLANS.monthly.price).toBe(14.9);
    expect(PLANS.annual.price).toBe(163.9);
    expect(PLANS.annual.savings).toBe(14.9);
  });
});

describe('isPlanId', () => {
  it('accepts only monthly and annual', () => {
    expect(isPlanId('monthly')).toBe(true);
    expect(isPlanId('annual')).toBe(true);
    expect(isPlanId('weekly')).toBe(false);
    expect(isPlanId(undefined)).toBe(false);
  });
});

describe('buildPreapprovalPayload', () => {
  it('builds a monthly recurring payload in PEN', () => {
    const payload = buildPreapprovalPayload('monthly', 'ana@example.com', 'https://tendy.pe/#membresia');
    expect(payload.payer_email).toBe('ana@example.com');
    expect(payload.back_url).toBe('https://tendy.pe/#membresia');
    expect(payload.auto_recurring).toEqual({ frequency: 1, frequency_type: 'months', transaction_amount: 14.9, currency_id: 'PEN' });
  });

  it('builds an annual recurring payload charged once every 12 months', () => {
    const payload = buildPreapprovalPayload('annual', 'ana@example.com', 'https://tendy.pe/#membresia');
    expect(payload.auto_recurring).toEqual({ frequency: 12, frequency_type: 'months', transaction_amount: 163.9, currency_id: 'PEN' });
  });
});
