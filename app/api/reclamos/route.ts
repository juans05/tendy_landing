import { NextRequest, NextResponse } from 'next/server';
import { isValidClaim, submitClaim } from '@/lib/reclamos';

export async function POST(request: NextRequest) {
  const data = await request.json().catch(() => null);

  if (!isValidClaim(data)) {
    return NextResponse.json({ error: 'Completa los campos obligatorios con un correo válido.' }, { status: 400 });
  }

  try {
    const { code } = await submitClaim(data);
    return NextResponse.json({ code });
  } catch (error) {
    console.error('[reclamos] error al enviar el reclamo', error);
    return NextResponse.json({ error: 'No pudimos registrar tu reclamo. Intenta de nuevo o escríbenos por WhatsApp.' }, { status: 502 });
  }
}
