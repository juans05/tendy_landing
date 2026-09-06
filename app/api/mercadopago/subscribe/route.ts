import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { buildPreapprovalPayload, isPlanId } from '@/lib/mercadopago';
import { currentUser, paymentsReady, sameOrigin, supabase } from '@/lib/platform/server';
import { mp } from '@/lib/platform/payments';
import type { Subscription } from '@/lib/platform/types';

function back(request: NextRequest, reason: string) {
  return NextResponse.redirect(new URL(`/unirme?estado=${reason}`, request.url), 303);
}
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return new Response('Origen inválido', { status: 403 });
  const user = await currentUser();
  if (!user) return NextResponse.redirect(new URL('/ingresar?continuar=unirme', request.url), 303);
  if (!paymentsReady()) return back(request, 'no-disponible');
  const form = await request.formData();
  if (!isPlanId(form.get('plan')) || form.get('terms') !== 'on') return back(request, 'condiciones');
  try {
    const candidate = randomUUID();
    const rows = await supabase<Subscription[]>('/rest/v1/rpc/reserve_subscription', { method: 'POST', body: JSON.stringify({ p_id: candidate, p_user: user.id }) });
    const sub = rows[0];
    if (!sub) return back(request, 'pendiente');
    if (sub.id !== candidate) {
      if (sub.status === 'pending' && sub.init_point) return NextResponse.redirect(checkoutUrl(sub.init_point), 303);
      return NextResponse.redirect(new URL('/mi-club', request.url), 303);
    }
    // An uncertain provider result leaves the reservation locked. Never retry by creating a second recurring charge.
    const returnUrl = `${new URL(process.env.NEXT_PUBLIC_SITE_URL!).origin}/mi-club?estado=verificando`;
    const result = await mp<{ id: string; init_point: string }>('/preapproval', { method: 'POST', headers: { 'X-Idempotency-Key': sub.id }, body: JSON.stringify(buildPreapprovalPayload('monthly', user.email, returnUrl, sub.id)) });
    const destination = checkoutUrl(result.init_point);
    if (!/^[a-zA-Z0-9_-]{1,100}$/.test(result.id)) throw new Error('Invalid provider ID');
    await supabase(`/rest/v1/subscriptions?id=eq.${sub.id}&status=eq.creating`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ mp_id: result.id, init_point: destination, status: 'pending' }) });
    return NextResponse.redirect(destination, 303);
  } catch { return back(request, 'pendiente'); }
}
function checkoutUrl(value: string) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || !['www.mercadopago.com.pe','www.mercadopago.com','mercadopago.com.pe'].includes(url.hostname)) throw new Error('Invalid checkout URL');
  return url.toString();
}
