import { NextRequest } from 'next/server';
import { createSubscription, isPlanId } from '@/lib/mercadopago';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function errorRedirect(request: NextRequest, message: string) {
  const url = request.nextUrl.clone();
  url.pathname = '/';
  url.hash = 'membresia';
  url.searchParams.set('checkout_error', message);
  return Response.redirect(url, 303);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const plan = formData.get('plan');
  const email = formData.get('email');

  if (!isPlanId(plan)) return errorRedirect(request, 'Plan inválido.');
  if (typeof email !== 'string' || !EMAIL_RE.test(email)) return errorRedirect(request, 'Ingresa un correo válido.');

  try {
    const backUrl = `${request.nextUrl.origin}/#membresia`;
    const { initPoint } = await createSubscription(plan, email, backUrl);
    return Response.redirect(initPoint, 303);
  } catch (error) {
    console.error('[mercadopago] error al crear la suscripción', error);
    return errorRedirect(request, 'No pudimos iniciar el pago. Intenta de nuevo o escríbenos por WhatsApp.');
  }
}
