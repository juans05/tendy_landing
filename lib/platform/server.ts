import { createHash, createHmac } from 'node:crypto';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export function platformReady() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
export function paymentsReady() {
  return platformReady() && Boolean(process.env.MP_ACCESS_TOKEN && process.env.MP_WEBHOOK_SECRET && process.env.MP_COLLECTOR_ID && process.env.NEXT_PUBLIC_SITE_URL);
}
export async function supabase<T>(path: string, init: RequestInit = {}): Promise<T> {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!process.env.SUPABASE_URL || !key) throw new Error('Platform not configured');
  const response = await fetch(`${process.env.SUPABASE_URL}${path}`, {
    ...init, cache: 'no-store', signal: AbortSignal.timeout(12000),
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...init.headers },
  });
  if (!response.ok) throw new Error(`Database request failed: ${response.status}`);
  const body = await response.text();
  return (body ? JSON.parse(body) : null) as T;
}
export function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}
// Peppered so a leaked auth_codes row alone (without server secrets) can't be brute-forced offline.
export function hashCode(code: string) {
  return createHmac('sha256', process.env.SUPABASE_SERVICE_ROLE_KEY || '').update(code).digest('hex');
}
export async function currentUser() {
  const token = (await cookies()).get('tendy_access')?.value;
  if (!platformReady() || !token) return null;
  try {
    const rows = await supabase<{ member_id: string; members: { email: string } }[]>(
      `/rest/v1/sessions?token_hash=eq.${hashToken(token)}&expires_at=gt.${encodeURIComponent(new Date().toISOString())}&select=member_id,members(email)&limit=1`,
    );
    const row = rows[0];
    return row ? { id: row.member_id, email: row.members.email, token } : null;
  } catch { return null; }
}
export async function isAdmin(userId: string) {
  const records = await supabase<{ user_id: string }[]>(`/rest/v1/admins?user_id=eq.${encodeURIComponent(userId)}&select=user_id`);
  return records.length > 0;
}
export function sameOrigin(request: NextRequest) {
  const expected = process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).origin : request.nextUrl.origin;
  return request.headers.get('origin') === expected;
}
export const privateMetadata = { robots: { index: false, follow: false }, referrer: 'no-referrer' as const };
