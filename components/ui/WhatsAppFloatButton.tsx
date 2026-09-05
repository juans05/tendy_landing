'use client';
import { useEffect, useState } from 'react';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';
import { content } from '@/lib/content';

export function WhatsAppFloatButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), content.floatingWhatsApp.delayMs);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const href = buildWhatsAppLink(content.whatsappCta.mensajePrellenado);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('ClickWhatsApp', { ubicacion: 'boton_flotante' })}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-green-500 px-4 py-3 text-white shadow-lg hover:bg-green-600"
    >
      <span aria-hidden>💬</span>
      <span className="hidden sm:inline text-sm font-medium">{content.floatingWhatsApp.microcopy}</span>
    </a>
  );
}
