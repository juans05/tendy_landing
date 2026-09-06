import { NextRequest, NextResponse } from 'next/server';
import { currentUser, sameOrigin, supabase } from '@/lib/platform/server';
import { mp, reconcile, syncSubscription } from '@/lib/platform/payments';
import type { Subscription } from '@/lib/platform/types';
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Origen inválido.' }, { status: 403 });
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'Vuelve a iniciar sesión.' }, { status: 401 });
  const data = await request.json().catch(() => null);
  if (!['sync','cancel'].includes(data?.action)) return NextResponse.json({ error: 'Acción inválida.' }, { status: 400 });
  try {
    const subscriptions = await supabase<Subscription[]>(`/rest/v1/subscriptions?user_id=eq.${user.id}&order=created_at.desc&limit=1`);
    const sub = subscriptions[0];
    if (!sub?.mp_id) return NextResponse.json({ error: 'Aún no hay una suscripción que actualizar. Si acabas de pagar, espera un momento.' }, { status: 409 });
    if (data.action === 'cancel') {
      if (data.confirmed !== true) return NextResponse.json({ error: 'Confirma la cancelación.' }, { status: 400 });
      await mp(`/preapproval/${sub.mp_id}`, { method: 'PUT', body: JSON.stringify({ status: 'cancelled' }) });
      await syncSubscription(sub.mp_id);
    } else await reconcile(sub.mp_id);
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: 'No pudimos actualizar tu membresía. Vuelve a intentarlo o contacta con Tendy.' }, { status: 502 }); }
}
