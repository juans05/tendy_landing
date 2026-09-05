'use client';
import { content } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

export function WhatsappCta() {
  const href = buildWhatsAppLink(content.whatsappCta.mensajePrellenado);

  return (
    <section id="whatsapp" className="px-4 py-16 text-center">
      <h2 className="mb-2 text-2xl font-bold text-brand-blue">{content.whatsappCta.titulo}</h2>
      <p className="mb-6 text-gray-600">{content.whatsappCta.texto}</p>
      <Button
        href={href}
        variant="secondary"
        onClick={() => trackEvent('ClickWhatsApp', { ubicacion: 'whatsapp_cta_seccion' })}
      >
        {content.whatsappCta.boton}
      </Button>
    </section>
  );
}
