import { NextRequest, NextResponse } from 'next/server';
import { handlePaymentNotification, validSignature } from '@/lib/platform/payments';
import { paymentsReady } from '@/lib/platform/server';
export async function POST(request: NextRequest) {
  if (!paymentsReady()) return NextResponse.json({ error: 'Unavailable' }, { status: 503 });
  const id = request.nextUrl.searchParams.get('data.id') || '';
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(id) || !validSignature(id, request.headers.get('x-request-id') || '', request.headers.get('x-signature') || '', process.env.MP_WEBHOOK_SECRET || '')) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (String(body?.data?.id) !== id) return NextResponse.json({ error: 'Mismatched event' }, { status: 400 });
  try {
    await handlePaymentNotification(String(body?.type), id);
    return NextResponse.json({ received: true });
  } catch {
    // Non-2xx requests are retried by the provider. Do not log sensitive payment payloads.
    return NextResponse.json({ error: 'Retry later' }, { status: 503 });
  }
}
