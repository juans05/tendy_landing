import { club } from './club';

export type PlanId = 'monthly' | 'annual';

const MONTHLY_PRICE = Number(club.price);
const ANNUAL_PRICE = Number((MONTHLY_PRICE * 11).toFixed(2));

export const PLANS: Record<PlanId, { label: string; price: number; frequency: number; frequencyType: 'months'; savings?: number }> = {
  monthly: { label: 'Mensual', price: MONTHLY_PRICE, frequency: 1, frequencyType: 'months' },
  annual: { label: 'Anual', price: ANNUAL_PRICE, frequency: 12, frequencyType: 'months', savings: Number((MONTHLY_PRICE * 12 - ANNUAL_PRICE).toFixed(2)) },
};

export function isPlanId(value: unknown): value is PlanId {
  return value === 'monthly' || value === 'annual';
}

export function buildPreapprovalPayload(plan: PlanId, email: string, backUrl: string) {
  const config = PLANS[plan];
  return {
    reason: `Club Tendy Perú - Membresía Fundadores (${config.label})`,
    external_reference: `tendy-${plan}-${Date.now()}`,
    payer_email: email,
    back_url: backUrl,
    auto_recurring: {
      frequency: config.frequency,
      frequency_type: config.frequencyType,
      transaction_amount: config.price,
      currency_id: 'PEN',
    },
    status: 'pending',
  };
}

export async function createSubscription(plan: PlanId, email: string, backUrl: string): Promise<{ initPoint: string }> {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) throw new Error('MP_ACCESS_TOKEN no configurado');

  const response = await fetch('https://api.mercadopago.com/preapproval', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(buildPreapprovalPayload(plan, email, backUrl)),
  });

  if (!response.ok) {
    throw new Error(`MercadoPago rechazó la suscripción (${response.status}): ${await response.text()}`);
  }

  const data = (await response.json()) as { init_point?: string };
  if (!data.init_point) throw new Error('MercadoPago no devolvió init_point');
  return { initPoint: data.init_point };
}
