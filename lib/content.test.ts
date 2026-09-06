import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { content } from './content';

const CONTENT_SOURCE = readFileSync(join(__dirname, 'content.ts'), 'utf-8');
const PRIVACY_SOURCE = readFileSync(join(__dirname, '..', 'app', 'privacidad', 'page.tsx'), 'utf-8');
const TERMS_SOURCE = readFileSync(join(__dirname, '..', 'app', 'terminos', 'page.tsx'), 'utf-8');
const SOURCE = (CONTENT_SOURCE + PRIVACY_SOURCE + TERMS_SOURCE).toLowerCase();

const FORBIDDEN_PHRASES = [
  'descuento en todos los juguetes',
  'delivery gratis ilimitado',
  'juguete gratis todos los meses',
  '20% de descuento permanente',
  'últimos 3 cupos',
];

describe('content compliance', () => {
  it('never contains forbidden marketing phrases', () => {
    FORBIDDEN_PHRASES.forEach((phrase) => {
      expect(SOURCE).not.toContain(phrase.toLowerCase());
    });
  });

  it('always states no-permanence during the pilot', () => {
    expect(SOURCE).toContain('sin permanencia durante el piloto.'.toLowerCase());
  });

  it('shows the correct founder pricing', () => {
    expect(content.pricing.planes.find((plan) => plan.id === 'mensual')?.precio).toBe('S/ 14.90');
    expect(content.hero.precio).toBe('S/14.90 / mes');
  });

  it('has exactly 6 benefits and 6 faq items', () => {
    expect(content.beneficios.items).toHaveLength(6);
    expect(content.faq.items).toHaveLength(6);
  });

  it('defaults testimonials to hidden with no invented entries', () => {
    expect(content.testimonios.visible).toBe(false);
    expect(content.testimonios.items).toHaveLength(0);
  });
});
