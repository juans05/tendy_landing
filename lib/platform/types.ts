export interface Product {
  id: string; name: string; category: string; description: string; image_url: string | null;
  price: number | null; member_price: number | null; age: string; stock: number | null;
  published: boolean; featured: boolean;
}
export interface Campaign {
  id: string; title: string; description: string; conditions: string;
  starts_at: string; ends_at: string; published: boolean;
}
export interface Subscription {
  id: string; user_id: string; mp_id: string | null; status: string; init_point: string | null;
  next_payment_date: string | null; created_at: string;
}
export interface Payment {
  id: string; subscription_id: string; user_id: string; status: string; amount: number;
  paid_at: string; period_end: string; updated_at: string;
}
export const monthlyPlan = { id: 'monthly', name: 'Club Fundadores', price: 14.9, currency: 'PEN' } as const;
export const money = (value: number) => `S/ ${Number(value).toFixed(2)}`;

export function accessUntil(payments: Payment[], now = Date.now()): string | null {
  return payments.filter(p => p.status === 'approved' && Date.parse(p.period_end) > now)
    .sort((a, b) => Date.parse(b.period_end) - Date.parse(a.period_end))[0]?.period_end ?? null;
}
export function nextMonth(date: string): string {
  const source = new Date(date);
  if (!Number.isFinite(source.getTime())) throw new Error('Invalid date');
  const result = new Date(source);
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + 1);
  const lastDay = new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)).getUTCDate();
  result.setUTCDate(Math.min(source.getUTCDate(), lastDay));
  return result.toISOString();
}
