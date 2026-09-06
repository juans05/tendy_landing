import Image from 'next/image';
import { redirect } from 'next/navigation';
import { PlatformShell } from '@/components/platform/PlatformShell';
import { LoginForm } from '@/components/platform/LoginForm';
import { currentUser, platformReady, privateMetadata } from '@/lib/platform/server';
export const metadata = { ...privateMetadata, title: 'Entra a tu Club | Tendy Perú' };
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ continuar?: string }> }) {
  const params = await searchParams;
  const destination = params.continuar === 'unirme' ? '/unirme' : '/mi-club';
  if (await currentUser()) redirect(destination);
  return <PlatformShell><div className="auth-grid"><section className="auth-story"><div className="eyebrow">TU FAMILIA TIENE UN LUGAR AQUÍ</div><h1>La alegría<br />de ser <em>parte.</em></h1><p>Tu membresía, tus beneficios y sus próximas sonrisas. Todo en un mismo lugar.</p><Image src="/images/tendy-avatar.webp" alt="Tendy te da la bienvenida" width={340} height={340} priority /></section><section className="auth-card"><span className="status-pill">MI CLUB TENDY</span><h2>¡Qué bueno verte!</h2><p>Entra o crea tu cuenta con tu correo.</p><LoginForm available={platformReady()} destination={destination} /></section></div></PlatformShell>;
}
