import { describe, expect, it } from 'vitest';
import { buildFormMessage, buildWhatsAppLink } from './whatsapp';

describe('buildWhatsAppLink', () => {
  it('builds a wa.me link with the configured number and encoded message', () => {
    const link = buildWhatsAppLink('Hola mundo');
    expect(link).toContain('https://wa.me/');
    expect(link).toContain('text=Hola%20mundo');
  });
});

describe('buildFormMessage', () => {
  it('includes name and whatsapp always', () => {
    const message = buildFormMessage({ nombre: 'Ana', whatsapp: '987654321' });
    expect(message).toContain('Nombre: Ana');
    expect(message).toContain('WhatsApp: 987654321');
  });

  it('includes age range and preferences only when provided', () => {
    const message = buildFormMessage({
      nombre: 'Luis',
      whatsapp: '911223344',
      rangoEdad: '6 a 8 años',
      preferencias: ['Juegos', 'Carritos'],
    });
    expect(message).toContain('Rango de edad de interés: 6 a 8 años');
    expect(message).toContain('Preferencias: Juegos, Carritos');
  });

  it('omits optional lines when not provided', () => {
    const message = buildFormMessage({ nombre: 'Sol', whatsapp: '900111222' });
    expect(message).not.toContain('Rango de edad');
    expect(message).not.toContain('Preferencias');
  });
});
