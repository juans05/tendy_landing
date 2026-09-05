'use client';
import { content } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { FloatingDecor } from '@/components/ui/FloatingDecor';
import { GradientGlow } from '@/components/ui/GradientGlow';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

export function CtaFinal() {
  const href = buildWhatsAppLink(content.whatsappCta.mensajePrellenado);

  return (
    <section className="relative overflow-hidden bg-brand-black px-4 py-16 text-center text-white">
      <GradientGlow />
      <FloatingDecor />
      <div className="relative mx-auto max-w-2xl">
        <h2 className="mb-4 text-2xl font-bold sm:text-3xl">{content.ctaFinal.titulo}</h2>
        <p className="mb-4 text-neutral-300">{content.ctaFinal.texto}</p>
        <p className="mb-6 text-2xl font-bold text-brand-orange">{content.ctaFinal.precio}</p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            href={href}
            variant="primary"
            onClick={() => {
              trackEvent('ClickWhatsApp', { ubicacion: 'cta_final_principal' });
              trackEvent('MembershipInterest', { origen: 'cta_final' });
            }}
          >
            {content.ctaFinal.ctaPrincipal}
          </Button>
          <Button
            href={href}
            variant="outlineLight"
            onClick={() => trackEvent('ClickWhatsApp', { ubicacion: 'cta_final_secundario' })}
          >
            {content.ctaFinal.ctaSecundario}
          </Button>
        </div>
      </div>
    </section>
  );
}
