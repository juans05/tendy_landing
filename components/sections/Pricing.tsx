'use client';
import { content } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

export function Pricing() {
  const href = buildWhatsAppLink(content.whatsappCta.mensajePrellenado);

  return (
    <section id="precio" className="px-4 py-16">
      <div className="mx-auto max-w-md rounded-3xl border-4 border-brand-orange bg-white p-8 text-center shadow-xl">
        <span className="mb-4 inline-block rounded-full bg-brand-black px-4 py-1 text-xs font-bold text-white">
          {content.pricing.badge}
        </span>
        <h3 className="mb-2 text-2xl font-bold text-brand-black">{content.pricing.titulo}</h3>
        <p className="mb-1 text-5xl font-extrabold text-brand-black">{content.pricing.precio}</p>
        <p className="mb-6 text-sm text-gray-500">{content.pricing.periodo}</p>
        <ul className="mb-6 space-y-2 text-left">
          {content.pricing.lista.map((item) => (
            <li key={item} className="flex items-start gap-2 text-gray-700">
              <span className="text-green-500" aria-hidden>
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
        <Button
          href={href}
          onClick={() => {
            trackEvent('ClickWhatsApp', { ubicacion: 'pricing_cta' });
            trackEvent('MembershipInterest', { origen: 'pricing_cta' });
          }}
        >
          {content.pricing.cta}
        </Button>
        <p className="mt-4 text-xs text-gray-500">{content.pricing.sinPermanencia}</p>
        <p className="mt-1 text-xs text-gray-500">{content.pricing.cancelacion}</p>
      </div>
    </section>
  );
}
