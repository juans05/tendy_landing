const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '51999999999';

if (WHATSAPP_NUMBER === '51999999999' && process.env.NODE_ENV === 'production') {
  console.warn('[tendy] NEXT_PUBLIC_WHATSAPP_NUMBER no configurado — los CTAs apuntan al número placeholder.');
}

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export interface FormularioData {
  nombre: string;
  whatsapp: string;
  rangoEdad?: string;
  preferencias?: string[];
}

export function buildFormMessage(data: FormularioData): string {
  const lineas = [
    'Hola 👋 Quiero información del Club VIP Fundadores.',
    `Nombre: ${data.nombre}`,
    `WhatsApp: ${data.whatsapp}`,
  ];

  if (data.rangoEdad) {
    lineas.push(`Rango de edad de interés: ${data.rangoEdad}`);
  }

  if (data.preferencias && data.preferencias.length > 0) {
    lineas.push(`Preferencias: ${data.preferencias.join(', ')}`);
  }

  return lineas.join('\n');
}
