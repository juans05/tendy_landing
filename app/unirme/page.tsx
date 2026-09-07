import { redirect } from 'next/navigation';
import { PlatformShell } from '@/components/platform/PlatformShell';
import { SubscribeCheckout } from '@/components/store/SubscribeCheckout';
import { currentUser, paymentsReady, privateMetadata, supabase } from '@/lib/platform/server';
import { accessUntil, type Payment, type Subscription } from '@/lib/platform/types';
export const metadata = { ...privateMetadata, title: 'Únete al Club | Tendy Perú' };
export default async function JoinPage({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const params = await searchParams;
  const user = await currentUser();
  if (!user) redirect('/ingresar?continuar=unirme');
  const [payments, subscriptions] = await Promise.all([
    supabase<Payment[]>(`/rest/v1/payments?user_id=eq.${user.id}&order=period_end.desc&limit=100`),
    supabase<Subscription[]>(`/rest/v1/subscriptions?user_id=eq.${user.id}&status=neq.cancelled&limit=1`),
  ]);
  if (accessUntil(payments) || subscriptions.some(s => ['authorized','creating','paused'].includes(s.status))) redirect('/mi-club');
  const errors: Record<string,string> = { 'no-disponible': 'El pago todavía no está disponible.', condiciones: 'Acepta las condiciones para continuar.', pendiente: 'Estamos verificando tu solicitud. Entra a Mi Club antes de iniciar otro pago.' };
  return <PlatformShell><div className="checkout-layout"><div className="checkout-steps"><span>✓ Tu cuenta</span><strong>02 Membresía</strong><span>03 Mi Club</span></div>{params.estado && errors[params.estado] && <p role="alert" className="notice-box">{errors[params.estado]}</p>}<SubscribeCheckout ready={paymentsReady()} email={user.email} /></div></PlatformShell>;
}
