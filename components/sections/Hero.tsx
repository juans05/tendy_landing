'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { FloatingDecor } from '@/components/ui/FloatingDecor';
import { useParallax } from '@/components/ui/useParallax';
import { content } from '@/lib/content';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

export function Hero() {
  useEffect(() => {
    trackEvent('ViewContent', { seccion: 'hero' });
  }, []);

  const whatsappHref = buildWhatsAppLink(content.whatsappCta.mensajePrellenado);
  const parallaxOffset = useParallax(0.08);

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-b from-brand-blue to-blue-900 px-4 pb-16 pt-28 text-white sm:pt-32"
    >
      <FloatingDecor />
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <span className="mb-4 inline-block rounded-full bg-brand-yellow px-4 py-1 text-sm font-bold text-brand-blue">
            {content.hero.badge}
          </span>
          <h1 className="mb-4 text-3xl font-extrabold leading-tight sm:text-5xl">{content.hero.headline}</h1>
          <p className="mb-6 max-w-2xl text-base text-blue-100 sm:text-lg">{content.hero.subtitulo}</p>
          <p className="mb-1 text-2xl font-bold text-brand-yellow">{content.hero.precio}</p>
          <p className="mb-8 text-sm text-blue-200">{content.hero.sinPermanencia}</p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button
              href={whatsappHref}
              variant="primary"
              onClick={() => {
                trackEvent('ClickWhatsApp', { ubicacion: 'hero_cta_principal' });
                trackEvent('MembershipInterest', { origen: 'hero_cta_principal' });
              }}
            >
              {content.hero.ctaPrincipal}
            </Button>
            <Button href="#beneficios" variant="outlineLight">
              {content.hero.ctaSecundario}
            </Button>
          </div>
          <p className="mt-4 text-xs text-blue-200">{content.hero.microcopy}</p>
        </div>
        <div
          className="relative mx-auto w-full max-w-md lg:max-w-none"
          style={{ transform: `translateY(${parallaxOffset}px)` }}
        >
          <div className="overflow-hidden rounded-3xl border-4 border-brand-yellow/40 shadow-2xl">
            <Image
              src="/images/hero-family.png"
              alt="Familia feliz abriendo una caja de juguetes"
              width={928}
              height={1152}
              priority
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
