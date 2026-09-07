import { randomBytes, randomInt } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { hashToken, platformReady, sameOrigin, supabase } from '@/lib/platform/server';
import { sendEmail } from '@/lib/email';

const CODE_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;
const SESSION_TTL_SECONDS = 3600;

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Origen inválido.' }, { status: 403 });
  const data = await request.json().catch(() => null);
  if (data?.action === 'logout') {
    const token = request.cookies.get('tendy_access')?.value;
    if (token) { try { await supabase(`/rest/v1/sessions?token_hash=eq.${hashToken(token)}`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } }); } catch { /* Expired session: still clear local cookie. */ } }
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
      const existing = await supabase<{ created_at: string }[]>(`/rest/v1/auth_codes?email=eq.${encodeURIComponent(email)}&select=created_at&limit=1`);
      if (existing[0] && Date.now() - Date.parse(existing[0].created_at) < RESEND_COOLDOWN_MS) {
        return NextResponse.json({ error: 'Espera un minuto antes de pedir otro código.' }, { status: 429 });
      }
      const code = String(randomInt(100000, 1000000));
      await supabase('/rest/v1/auth_codes?on_conflict=email', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify({ email, code_hash: hashToken(code), expires_at: new Date(Date.now() + CODE_TTL_MS).toISOString(), attempts: 0, created_at: new Date().toISOString() }),
      });
      await sendEmail(email, 'Tu código de acceso — Club Tendy Perú', `Tu código de acceso es: ${code}\n\nVence en 10 minutos y solo se puede usar una vez. Si no lo solicitaste, ignora este correo.`);
      return NextResponse.json({ ok: true });
    }
    if (data?.action !== 'verify' || data.accepted !== true || !/^\d{6}$/.test(String(data?.code))) return NextResponse.json({ error: 'Revisa el código recibido y acepta las condiciones.' }, { status: 400 });
    const codeRows = await supabase<{ code_hash: string; expires_at: string; attempts: number }[]>(`/rest/v1/auth_codes?email=eq.${encodeURIComponent(email)}&select=code_hash,expires_at,attempts&limit=1`);
    const record = codeRows[0];
    if (!record || Date.parse(record.expires_at) < Date.now() || record.attempts >= MAX_ATTEMPTS) throw new Error('Expired or missing code');
    if (record.code_hash !== hashToken(String(data.code))) {
      await supabase(`/rest/v1/auth_codes?email=eq.${encodeURIComponent(email)}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ attempts: record.attempts + 1 }) });
      throw new Error('Invalid code');
    }
    await supabase(`/rest/v1/auth_codes?email=eq.${encodeURIComponent(email)}`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } });
    let member = (await supabase<{ id: string }[]>(`/rest/v1/members?email=eq.${encodeURIComponent(email)}&select=id&limit=1`))[0];
    if (!member) member = (await supabase<{ id: string }[]>('/rest/v1/members', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ email }) }))[0];
    await supabase('/rest/v1/member_consents?on_conflict=user_id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify({ user_id: member.id, version: '2026-09-06', accepted_at: new Date().toISOString() }) });
    const token = randomBytes(32).toString('base64url');
    await supabase('/rest/v1/sessions', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ member_id: member.id, token_hash: hashToken(token), expires_at: new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString() }) });
    const response = NextResponse.json({ ok: true });
    response.cookies.set('tendy_access', token, { httpOnly: true, secure: request.nextUrl.protocol === 'https:', sameSite: 'lax', path: '/', maxAge: SESSION_TTL_SECONDS });
    return response;
  } catch { return NextResponse.json({ error: data?.action === 'verify' ? 'El código venció o no es correcto. Solicita uno nuevo.' : 'No pudimos enviar el código. Espera un minuto antes de volver a intentarlo.' }, { status: 400 }); }
}
