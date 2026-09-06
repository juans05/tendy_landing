'use client';
import { content } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

export function Pricing() {
  return (
    <section id="precio" className="px-4 py-16">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="mb-2 text-3xl font-bold text-brand-black">{content.pricing.titulo}</h2>
        <p className="mx-auto mb-10 max-w-xl text-gray-500">{content.pricing.subtitulo}</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.pricing.planes.map((plan) => {
            const mensaje = `Hola 👋 Quiero unirme al Club VIP Fundadores con el plan ${plan.nombre} (${plan.precio} ${plan.periodo.toLowerCase()}). ¿Me confirman los beneficios y cómo activarlo?`;
            const href = buildWhatsAppLink(mensaje);

            return (
              <div
                key={plan.id}
                className={`flex flex-col rounded-3xl p-6 text-left shadow-xl ${
                  plan.recomendado
                    ? 'border-4 border-brand-orange bg-brand-black text-white'
                    : 'border-4 border-gray-100 bg-white text-brand-black'
                }`}
              >
                {plan.recomendado && (
                  <span className="mb-3 text-center text-xs font-bold uppercase tracking-wide text-brand-orange">
                    Recomendado por Tendy ✦
                  </span>
                )}
                <div className="mb-4 flex items-center justify-between gap-2">
                  <h3 className="text-xl font-extrabold">{plan.nombre}</h3>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                      plan.recomendado ? 'bg-brand-orange text-brand-black' : 'bg-brand-black text-white'
                    }`}
                  >
                    {plan.badge}
                  </span>
                </div>
                <p
                  className={`mb-4 border-b pb-4 text-sm ${
                    plan.recomendado ? 'border-white/20 text-white/70' : 'border-gray-100 text-gray-500'
                  }`}
                >
                  {plan.subtitulo}
                </p>
                <ul className="mb-6 flex-1 space-y-2 text-sm">
                  {content.pricing.lista.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-green-500" aria-hidden>
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className={`mb-4 rounded-2xl p-4 text-center ${plan.recomendado ? 'bg-white/10' : 'bg-gray-50'}`}>
                  <p className="text-3xl font-extrabold">
                    <span>{plan.precio}</span>
                    <span className="ml-1 text-sm font-normal">/ {plan.periodo}</span>
                  </p>
                  {plan.equivalencia && (
                    <p className="mt-1 text-xs font-semibold text-brand-orange">{plan.equivalencia}</p>
                  )}
                </div>
                <Button
                  href={href}
                  variant={plan.recomendado ? 'primary' : 'secondary'}
                  onClick={() => {
                    trackEvent('ClickWhatsApp', { ubicacion: 'pricing_cta', plan: plan.id });
                    trackEvent('MembershipInterest', { origen: 'pricing_cta', plan: plan.id });
                  }}
                >
                  {content.pricing.cta}
                </Button>
              </div>
            );
          })}
        </div>
        <p className="mt-8 text-xs text-gray-500">{content.pricing.sinPermanencia}</p>
        <p className="mt-1 text-xs text-gray-500">{content.pricing.cancelacion}</p>
      </div>
    </section>
  );
}
