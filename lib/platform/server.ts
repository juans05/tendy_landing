import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export function platformReady() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
export function paymentsReady() {
  return platformReady() && Boolean(process.env.MP_ACCESS_TOKEN && process.env.MP_WEBHOOK_SECRET && process.env.MP_COLLECTOR_ID && process.env.NEXT_PUBLIC_SITE_URL);
}
export async function supabase<T>(path: string, init: RequestInit = {}, accessToken?: string): Promise<T> {
  const key = accessToken ? process.env.SUPABASE_ANON_KEY : process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!process.env.SUPABASE_URL || !key) throw new Error('Platform not configured');
  const response = await fetch(`${process.env.SUPABASE_URL}${path}`, {
    ...init, cache: 'no-store', signal: AbortSignal.timeout(12000),
    headers: { apikey: key, Authorization: `Bearer ${accessToken || key}`, 'Content-Type': 'application/json', ...init.headers },
  });
  if (!response.ok) throw new Error(`Database request failed: ${response.status}`);
  const body = await response.text();
  return (body ? JSON.parse(body) : null) as T;
}
export async function authRequest<T>(path: string, body: unknown): Promise<T> {
  const key = process.env.SUPABASE_ANON_KEY;
  if (!key || !platformReady()) throw new Error('Auth unavailable');
  const response = await fetch(`${process.env.SUPABASE_URL}/auth/v1/${path}`, {
    method: 'POST', headers: { apikey: key, 'Content-Type': 'application/json' },
    body: JSON.stringify(body), cache: 'no-store', signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error(`Auth request failed: ${response.status}`);
  return response.json();
}
export async function currentUser() {
  const token = (await cookies()).get('tendy_access')?.value;
  if (!platformReady() || !token) return null;
  try {
    const user = await supabase<{ id: string; email?: string }>('/auth/v1/user', {}, token);
    return user.id && user.email ? { id: user.id, email: user.email, token } : null;
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
