import { createHmac, timingSafeEqual } from 'node:crypto';
import { supabase } from './server';
import { monthlyPlan, nextMonth, type Payment, type Subscription } from './types';

export async function mp<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!process.env.MP_ACCESS_TOKEN) throw new Error('Payments not configured');
  const response = await fetch(`https://api.mercadopago.com${path}`, {
    ...init, cache: 'no-store', signal: AbortSignal.timeout(12000),
    headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`, 'Content-Type': 'application/json', ...init.headers },
  });
  if (!response.ok) throw new Error(`Payment provider failed: ${response.status}`);
  return response.json();
}
export function validSignature(id: string, requestId: string, signature: string, secret: string) {
  const parts = Object.fromEntries(signature.split(',').map(part => part.trim().split('=')));
  if (!id || !requestId || !/^\d+$/.test(parts.ts || '') || !/^[a-f0-9]{64}$/i.test(parts.v1 || '') || !secret) return false;
  const expected = createHmac('sha256', secret).update(`id:${id.toLowerCase()};request-id:${requestId};ts:${parts.ts};`).digest();
  return timingSafeEqual(expected, Buffer.from(parts.v1, 'hex'));
}
interface ProviderSubscription {
  id: string; external_reference: string; status: string; collector_id: number;
  next_payment_date?: string; last_modified: string; init_point?: string;
  auto_recurring: { transaction_amount: number; currency_id: string; frequency: number; frequency_type: string };
}
interface Invoice {
  id: number; preapproval_id: string; debit_date: string; payment?: { id: number };
}
export interface ProviderPayment {
  id: number; status: string; transaction_amount: number; currency_id: string;
  collector_id: number; live_mode: boolean; date_approved: string | null; date_created: string;
  date_last_updated: string; transaction_amount_refunded?: number;
}
export function paymentRecord(payment: ProviderPayment, subscription: Subscription, debitDate: string): Payment {
  if (payment.currency_id !== 'PEN' || Math.round(Number(payment.transaction_amount) * 100) !== 1490) throw new Error('Unexpected amount');
  if (String(payment.collector_id) !== process.env.MP_COLLECTOR_ID) throw new Error('Unexpected collector');
  if (payment.live_mode !== (process.env.MP_LIVE_MODE === 'true')) throw new Error('Unexpected payment mode');
  const start = new Date(debitDate);
  if (!Number.isFinite(start.getTime()) || start.getTime() > Date.now() + 5 * 60 * 1000) throw new Error('Invalid billing date');
  if (!Number.isFinite(Date.parse(payment.date_last_updated))) throw new Error('Invalid payment timestamp');
  return {
    id: String(payment.id), subscription_id: subscription.id, user_id: subscription.user_id,
    status: Number(payment.transaction_amount_refunded || 0) > 0 ? 'refunded' : payment.status,
    amount: Number(payment.transaction_amount), paid_at: payment.date_approved || payment.date_created,
    period_end: nextMonth(start.toISOString()), updated_at: payment.date_last_updated,
  };
}
export async function syncSubscription(providerId: string) {
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(providerId)) throw new Error('Invalid subscription');
  const provider = await mp<ProviderSubscription>(`/preapproval/${providerId}`);
  if (!/^[0-9a-f-]{36}$/i.test(provider.external_reference || '')) return null;
  const rows = await supabase<Subscription[]>(`/rest/v1/subscriptions?id=eq.${provider.external_reference}&limit=1`);
  const subscription = rows[0];
  if (!subscription) return null;
  if (subscription.mp_id && subscription.mp_id !== provider.id) throw new Error('Subscription mismatch');
  const terms = provider.auto_recurring;
  if (String(provider.collector_id) !== process.env.MP_COLLECTOR_ID || terms.currency_id !== monthlyPlan.currency || Number(terms.transaction_amount) !== monthlyPlan.price || terms.frequency !== 1 || terms.frequency_type !== 'months') throw new Error('Subscription terms mismatch');
  if (!['pending','authorized','paused','cancelled'].includes(provider.status) || !Number.isFinite(Date.parse(provider.last_modified))) throw new Error('Invalid subscription state');
  const stamp = encodeURIComponent(provider.last_modified);
  let checkout: string | undefined;
  if (provider.init_point) {
    const url = new URL(provider.init_point);
    if (url.protocol === 'https:' && ['www.mercadopago.com.pe', 'www.mercadopago.com', 'mercadopago.com.pe'].includes(url.hostname)) checkout = url.toString();
  }
  await supabase(`/rest/v1/subscriptions?id=eq.${subscription.id}&or=(provider_updated_at.is.null,provider_updated_at.lte.${stamp})`, {
    method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ mp_id: provider.id, status: provider.status, ...(checkout ? { init_point: checkout } : {}), next_payment_date: provider.next_payment_date || null, provider_updated_at: provider.last_modified }),
  });
  return { ...subscription, mp_id: provider.id };
}
export async function syncInvoice(invoice: Invoice) {
  const subscription = await syncSubscription(invoice.preapproval_id);
  if (!subscription || !invoice.payment?.id) return;
  const payment = await mp<ProviderPayment>(`/v1/payments/${invoice.payment.id}`);
  await supabase('/rest/v1/rpc/record_payment', { method: 'POST', body: JSON.stringify({ p_payment: paymentRecord(payment, subscription, invoice.debit_date) }) });
}
export async function reconcile(providerId: string) {
  await syncSubscription(providerId);
  // Paginated reconciliation handles renewals and previously missed notifications.
  for (let offset = 0; ; offset += 50) {
    const invoices = await mp<{ results: Invoice[]; paging: { total: number } }>(`/authorized_payments/search?preapproval_id=${encodeURIComponent(providerId)}&limit=50&offset=${offset}`);
    for (const invoice of invoices.results) await syncInvoice(invoice);
    if (offset + invoices.results.length >= invoices.paging.total || !invoices.results.length) break;
    if (offset >= 450) throw new Error('Reconciliation needs operator review');
  }
}
export async function handlePaymentNotification(type: string, id: string) {
  if (type === 'subscription_preapproval') { await syncSubscription(id); return; }
  if (type === 'subscription_authorized_payment') { await syncInvoice(await mp<Invoice>(`/authorized_payments/${id}`)); return; }
  if (type === 'payment') {
    const invoices = await mp<{ results: Invoice[] }>(`/authorized_payments/search?payment_id=${encodeURIComponent(id)}`);
    for (const invoice of invoices.results) await syncInvoice(invoice);
  }
}
