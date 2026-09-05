'use client';
import { content } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

export function Fundadores() {
  const href = buildWhatsAppLink(content.whatsappCta.mensajePrellenado);

  return (
    <section className="bg-brand-blue px-4 py-16 text-white">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="mb-4 text-2xl font-bold sm:text-3xl">{content.fundadores.titulo}</h2>
        <p className="mb-2 text-blue-100">{content.fundadores.texto1}</p>
        <p className="mb-6 text-blue-100">{content.fundadores.texto2}</p>
        <Button
          href={href}
          variant="primary"
          onClick={() => {
            trackEvent('ClickWhatsApp', { ubicacion: 'fundadores_cta' });
            trackEvent('MembershipInterest', { origen: 'fundadores_cta' });
          }}
        >
          {content.fundadores.cta}
        </Button>
      </div>
    </section>
  );
}
