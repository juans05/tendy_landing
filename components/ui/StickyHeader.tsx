'use client';
import { useState } from 'react';
import Image from 'next/image';
import { content } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';
import { useIsScrolled } from './useIsScrolled';

export function StickyHeader() {
  const scrolled = useIsScrolled();
  const [menuOpen, setMenuOpen] = useState(false);
  const href = buildWhatsAppLink(content.whatsappCta.mensajePrellenado);

  return (
    <header
      className={`fixed top-0 z-40 w-full transition-shadow duration-200 ${scrolled ? 'bg-white shadow-md' : 'bg-white/90'}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#top" className="flex items-center gap-2 text-lg font-extrabold text-brand-black">
          <Image src="/images/mascot.png" alt="" width={36} height={36} className="h-9 w-9" aria-hidden />
          {content.marca.nombre}
        </a>
        <nav className="hidden items-center gap-6 sm:flex">
          {content.header.links.map((link) => (
            <a key={link.label} href={link.href} className="text-sm font-medium text-gray-700 hover:text-brand-black">
              {link.label}
            </a>
          ))}
          <Button
            href={href}
            variant="primary"
            fullWidthOnMobile={false}
            onClick={() => {
              trackEvent('ClickWhatsApp', { ubicacion: 'header_cta' });
              trackEvent('MembershipInterest', { origen: 'header_cta' });
            }}
          >
            {content.header.ctaLabel}
          </Button>
        </nav>
        <button
          type="button"
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
          className="text-2xl text-brand-black sm:hidden"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
      {menuOpen && (
        <nav className="flex flex-col gap-3 border-t border-gray-100 bg-white px-4 py-4 sm:hidden">
          {content.header.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-gray-700"
            >
              {link.label}
            </a>
          ))}
          <Button
            href={href}
            variant="primary"
            onClick={() => {
              trackEvent('ClickWhatsApp', { ubicacion: 'header_cta' });
              trackEvent('MembershipInterest', { origen: 'header_cta' });
              setMenuOpen(false);
            }}
          >
            {content.header.ctaLabel}
          </Button>
        </nav>
      )}
    </header>
  );
}
