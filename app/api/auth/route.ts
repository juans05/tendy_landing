import { NextRequest, NextResponse } from 'next/server';
import { authRequest, currentUser, platformReady, sameOrigin, supabase } from '@/lib/platform/server';

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Origen inválido.' }, { status: 403 });
  const data = await request.json().catch(() => null);
  if (data?.action === 'logout') {
    const user = await currentUser();
    if (user) {
      try { await supabase('/auth/v1/logout', { method: 'POST' }, user.token); } catch { /* Expired token: still clear local session. */ }
    }
    const response = NextResponse.json({ ok: true });
    response.cookies.delete('tendy_access');
    return response;
  }
  if (!platformReady()) return NextResponse.json({ error: 'Estamos preparando el acceso al Club. Vuelve pronto.' }, { status: 503 });
  const email = String(data?.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return NextResponse.json({ error: 'Ingresa un correo válido.' }, { status: 400 });
  try {
    if (data?.action === 'send') {
      if (data.accepted !== true) return NextResponse.json({ error: 'Debes aceptar los términos y confirmar que eres mayor de edad.' }, { status: 400 });
      await authRequest('otp', { email, create_user: true });
      return NextResponse.json({ ok: true });
    }
    if (data?.action !== 'verify' || data.accepted !== true || !/^\d{6,8}$/.test(String(data?.code))) return NextResponse.json({ error: 'Revisa el código recibido y acepta las condiciones.' }, { status: 400 });
    const session = await authRequest<{ access_token: string; expires_in: number; user: { id:string } }>('verify', { email, token: data.code, type: 'email' });
    if (!session.access_token) throw new Error('Missing session');
    await supabase('/rest/v1/member_consents?on_conflict=user_id', { method:'POST', headers:{Prefer:'resolution=merge-duplicates,return=minimal'}, body:JSON.stringify({user_id:session.user.id,version:'2026-09-06',accepted_at:new Date().toISOString()}) });
    const response = NextResponse.json({ ok: true });
    response.cookies.set('tendy_access', session.access_token, { httpOnly: true, secure: request.nextUrl.protocol === 'https:', sameSite: 'lax', path: '/', maxAge: Math.min(session.expires_in || 3600, 3600) });
    return response;
  } catch { return NextResponse.json({ error: data?.action === 'verify' ? 'El código venció o no es correcto. Solicita uno nuevo.' : 'No pudimos enviar el código. Espera un minuto antes de volver a intentarlo.' }, { status: 400 }); }
}
