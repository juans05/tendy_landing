import { monthlyPlan } from './platform/types';
export type PlanId = 'monthly';
export const PLANS = { monthly: { label: 'Mensual', price: monthlyPlan.price, frequency: 1, frequencyType: 'months' } } as const;
export function isPlanId(value: unknown): value is PlanId { return value === 'monthly'; }
export function buildPreapprovalPayload(plan: PlanId, email: string, backUrl: string, reference: string) {
  if (!isPlanId(plan)) throw new Error('Unsupported plan');
  return {
    reason: 'Club Tendy Perú - Fundadores mensual', external_reference: reference,
    payer_email: email, back_url: backUrl,
    auto_recurring: { frequency: 1, frequency_type: 'months', transaction_amount: monthlyPlan.price, currency_id: monthlyPlan.currency },
    status: 'pending',
  };
}
