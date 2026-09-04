# Club VIP Fundadores Landing (Tendy) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first Next.js landing page that converts visitors into WhatsApp conversations for the "Club VIP Fundadores" toy-store membership pilot.

**Architecture:** Single Next.js 14 (App Router) + TypeScript + Tailwind app, no backend/DB. All copy lives in one typed `lib/content.ts` object. WhatsApp links and the optional lead form both funnel through `lib/whatsapp.ts` (link + message builder), with `lib/analytics.ts` firing GA4/Meta Pixel events and `lib/utm.ts` capturing UTM params for those events.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Vitest + @testing-library/react (unit/component tests for stateful logic only).

**Spec:** `docs/superpowers/specs/2026-09-04-club-vip-fundadores-landing-design.md`

## Global Constraints

- No backend, no database, no CMS, no login, no payment gateway, no member dashboard, no mobile app (per spec "Fuera de alcance").
- Form submissions redirect to WhatsApp with a prefilled message — never persisted anywhere else.
- Never collect: child's DNI, child's full name, school, permanent address, exact birth date, other sensitive data.
- Never use false scarcity copy (e.g. "Últimos 3 cupos") or forbidden phrases: "descuento en todos los juguetes", "delivery gratis ilimitado", "juguete gratis todos los meses", "20% de descuento permanente".
- Required phrases must appear verbatim somewhere in content: "Sin permanencia durante el piloto.", "S/ 14.90", "S/14.90".
- Brand name: **Tendy**. WhatsApp number: env var `NEXT_PUBLIC_WHATSAPP_NUMBER`, placeholder `51999999999` until the real number is supplied.
- Mobile-first; breakpoints to sanity-check visually: 360, 390, 430, 768, 1024, 1440px. CTAs full-width on mobile.
- Only one pricing plan shown (no plan comparison beyond the "cliente normal vs miembro VIP" table).
- No invented testimonials — placeholder text only until `content.testimonios.visible` is flipped to `true`.
- All copy in `lib/content.ts`, never hardcoded inline in a component.
- Analytics/tracking scripts (GTM/GA4/Meta Pixel) must be no-ops when their env var is unset — the site must fully work with zero tracking configured.

---

### Task 1: Project scaffold

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.js`, `next-env.d.ts`, `tailwind.config.ts`, `postcss.config.js`, `.gitignore`, `.env.example`, `vitest.config.ts`, `vitest.setup.ts`
- Create: `app/globals.css`
- Create: `app/layout.tsx` (minimal placeholder, replaced fully in Task 17)
- Create: `app/page.tsx` (minimal placeholder, replaced fully in Task 18)

**Interfaces:**
- Produces: `@/*` path alias resolving to the project root (used by every later import), Tailwind color tokens `brand.blue`, `brand.yellow`, `accent.sky`, `accent.coral`, `accent.green`, `accent.purple`, font CSS variable `--font-sans`.

- [ ] **Step 1: Initialize git and Next.js project files**

```bash
cd /d/Tendy_landing
git init
```

Create `package.json`:

```json
{
  "name": "tendy-club-vip-landing",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "6.4.8",
    "@testing-library/react": "16.0.0",
    "@testing-library/user-event": "14.5.2",
    "@types/node": "20.14.9",
    "@types/react": "18.3.3",
    "@types/react-dom": "18.3.0",
    "@vitejs/plugin-react": "4.3.1",
    "autoprefixer": "10.4.19",
    "jsdom": "24.1.0",
    "postcss": "8.4.39",
    "tailwindcss": "3.4.4",
    "typescript": "5.5.3",
    "vitest": "1.6.0"
  }
}
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Create `next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {};
module.exports = nextConfig;
```

Create `next-env.d.ts`:

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

Create `postcss.config.js`:

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

Create `tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#14235E',
          yellow: '#FFC94A',
        },
        accent: {
          sky: '#4FC3E8',
          coral: '#FF6F61',
          green: '#3BB273',
          purple: '#7C5CFC',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
```

Create `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}
```

Create `.env.example`:

```
NEXT_PUBLIC_WHATSAPP_NUMBER=51999999999
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_GTM_ID=
```

Create `.gitignore`:

```
node_modules
.next
.env
.env.local
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
```

Create `vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

Create placeholder `app/layout.tsx` (fully implemented in Task 17):

```tsx
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-PE">
      <body>{children}</body>
    </html>
  );
}
```

Create placeholder `app/page.tsx` (fully implemented in Task 18):

```tsx
export default function HomePage() {
  return <main>Tendy Club VIP Fundadores</main>;
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Expected: installs without errors, creates `package-lock.json`.

- [ ] **Step 3: Verify scaffold builds and typechecks**

Run: `npm run typecheck`
Expected: exits 0, no errors.

Run: `npm run build`
Expected: build succeeds, produces `.next/` output.

Run: `npm test`
Expected: `vitest run` exits 0 (no test files yet is fine — Vitest reports "No test files found" but exit code 0 with `--passWithNoTests` behavior; if it exits non-zero for zero tests, add `"test": "vitest run --passWithNoTests"` to `package.json` scripts).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js + Tailwind + Vitest project"
```

---

### Task 2: Content model (`lib/content.ts`) + compliance test

**Files:**
- Create: `lib/content.ts`
- Test: `lib/content.test.ts`

**Interfaces:**
- Produces: `content` (default-exported-by-name const, typed, `as const`), types `Beneficio`, `FaqItem`, `PasoComoFunciona`. Every later component imports `{ content }` from `@/lib/content`.

- [ ] **Step 1: Write the failing test**

Create `lib/content.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { content } from './content';

const SOURCE = readFileSync(join(__dirname, 'content.ts'), 'utf-8').toLowerCase();

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
    expect(content.pricing.precio).toBe('S/ 14.90');
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/content.test.ts`
Expected: FAIL — `lib/content.ts` does not exist yet (module not found).

- [ ] **Step 3: Write the content model**

Create `lib/content.ts`:

```ts
export interface Beneficio {
  icon: string;
  titulo: string;
  descripcion: string;
}

export interface FaqItem {
  pregunta: string;
  respuesta: string;
}

export interface PasoComoFunciona {
  numero: number;
  titulo: string;
  descripcion: string;
}

export const content = {
  marca: { nombre: 'Tendy', anioCopyright: 2026 },
  seo: {
    title: 'Club VIP de Juguetes | Beneficios exclusivos',
    description:
      'Únete a nuestro Club VIP de juguetes y accede a precios especiales, promociones privadas, novedades y beneficios exclusivos.',
  },
  header: {
    links: [
      { label: 'Beneficios', href: '#beneficios' },
      { label: 'Cómo funciona', href: '#como-funciona' },
      { label: 'Preguntas frecuentes', href: '#faq' },
    ],
    ctaLabel: 'Quiero ser miembro',
  },
  hero: {
    badge: 'CLUB VIP FUNDADORES',
    headline: 'Convierte cada compra en más beneficios 🎁',
    headlineAlt: 'Únete al Club VIP de Juguetes',
    subtitulo:
      'Accede a precios especiales, promociones privadas, novedades antes que todos y beneficios creados para nuestros clientes.',
    precio: 'S/14.90 / mes',
    sinPermanencia: 'Sin permanencia durante el piloto.',
    ctaPrincipal: 'QUIERO SER MIEMBRO',
    ctaSecundario: 'Ver beneficios',
    microcopy: 'Te atenderemos directamente por WhatsApp.',
  },
  queEsElClub: {
    titulo: 'Más que comprar juguetes. Queremos premiar que vuelvas.',
    texto:
      'Nuestro Club VIP está diseñado para clientes que quieren acceder a beneficios especiales cada vez que buscan un juguete o regalo.',
    puntos: [
      'No necesitas comprar todos los meses para formar parte.',
      'La membresía te da acceso a beneficios, campañas y oportunidades exclusivas.',
    ],
  },
  beneficios: {
    titulo: 'Todo esto por ser miembro',
    items: [
      { icon: 'tag', titulo: 'Precio Socio', descripcion: 'Accede a precios especiales en juguetes seleccionados.' },
      {
        icon: 'star',
        titulo: 'Puntos Dobles',
        descripcion: 'En campañas seleccionadas podrás acumular más beneficios por tus compras.',
      },
      {
        icon: 'rocket',
        titulo: 'Antes que todos',
        descripcion: 'Conoce nuevos juguetes y lanzamientos antes de nuestras campañas generales.',
      },
      {
        icon: 'gift',
        titulo: 'Promociones privadas',
        descripcion: 'Accede a promociones creadas exclusivamente para miembros.',
      },
      {
        icon: 'truck',
        titulo: 'Beneficios de delivery',
        descripcion: 'Accede a condiciones especiales de envío en determinadas compras, zonas o campañas.',
      },
      {
        icon: 'trophy',
        titulo: 'Sorteos y sorpresas',
        descripcion: 'Participa en dinámicas especiales disponibles para los miembros del club.',
      },
    ] as Beneficio[],
    disclaimer: 'Los beneficios pueden variar según producto, campaña, disponibilidad y condiciones comerciales.',
  },
  comparacion: {
    titulo: 'Comprar normalmente vs. pertenecer al Club',
    clienteNormal: {
      titulo: 'CLIENTE NORMAL',
      items: [
        { texto: 'Puede comprar cualquier producto', incluido: true },
        { texto: 'Accede a promociones públicas', incluido: true },
        { texto: 'No tiene Precio Socio', incluido: false },
        { texto: 'No tiene acceso anticipado', incluido: false },
        { texto: 'No participa en beneficios exclusivos del Club', incluido: false },
      ],
    },
    miembroVip: {
      titulo: 'MIEMBRO VIP',
      items: [
        { texto: 'Compra normalmente', incluido: true },
        { texto: 'Precio Socio en productos seleccionados', incluido: true },
        { texto: 'Acceso anticipado', incluido: true },
        { texto: 'Promociones privadas', incluido: true },
        { texto: 'Puntos dobles en campañas', incluido: true },
        { texto: 'Sorteos', incluido: true },
        { texto: 'Beneficios especiales', incluido: true },
      ],
    },
  },
  pricing: {
    badge: 'PLAN FUNDADORES',
    titulo: 'Club VIP',
    precio: 'S/ 14.90',
    periodo: 'al mes',
    lista: [
      'Precios especiales',
      'Promociones exclusivas',
      'Puntos dobles en campañas seleccionadas',
      'Acceso anticipado',
      'Sorteos',
      'Beneficios especiales de delivery',
    ],
    cta: 'QUIERO UNIRME',
    sinPermanencia: 'Sin permanencia durante el piloto.',
    cancelacion: 'Puedes solicitar la cancelación de tu membresía cuando quieras.',
  },
  comoFunciona: {
    titulo: 'Comenzar es muy fácil',
    pasos: [
      { numero: 1, titulo: 'Solicita información', descripcion: 'Haz clic y escríbenos por WhatsApp.' },
      {
        numero: 2,
        titulo: 'Confirma tu membresía',
        descripcion: 'Nuestro equipo te explicará las condiciones del programa.',
      },
      {
        numero: 3,
        titulo: 'Activa tus beneficios',
        descripcion: 'Una vez confirmado tu registro podrás acceder a los beneficios disponibles.',
      },
      {
        numero: 4,
        titulo: 'Disfruta el Club',
        descripcion: 'Compra productos participantes y accede a promociones exclusivas.',
      },
    ] as PasoComoFunciona[],
  },
  fundadores: {
    titulo: 'Queremos construir el Club contigo',
    texto1:
      'Estamos comenzando nuestro programa de membresía y queremos trabajar con nuestro primer grupo de clientes fundadores.',
    texto2: 'Durante esta etapa mediremos cuáles beneficios son realmente más valorados por nuestros clientes.',
    cta: 'QUIERO SER FUNDADOR',
  },
  whatsappCta: {
    titulo: '¿Tienes alguna duda?',
    texto: 'Habla directamente con nosotros por WhatsApp.',
    boton: 'HABLAR POR WHATSAPP',
    mensajePrellenado:
      'Hola 👋 Vi información sobre el Club VIP Fundadores de juguetes y quisiera conocer cómo funciona la membresía de S/14.90.',
  },
  formulario: {
    titulo: 'Quiero recibir información',
    campos: { nombre: 'Nombre', whatsapp: 'WhatsApp' },
    rangoEdad: ['3 a 5 años', '6 a 8 años', '9 a 12 años', '13+ años', 'Prefiero no indicar'],
    preferencias: ['Juguetes educativos', 'Juguetes electrónicos', 'Juegos', 'Carritos', 'Muñecas', 'Creatividad', 'Otros'],
    autorizacion: 'Autorizo que me contacten por WhatsApp para brindarme información sobre el Club y promociones.',
    linkPrivacidad: 'Política de privacidad',
    boton: 'QUIERO INFORMACIÓN',
  },
  faq: {
    titulo: 'Preguntas frecuentes',
    items: [
      {
        pregunta: '¿La membresía incluye un juguete todos los meses?',
        respuesta:
          'No. El Club ofrece beneficios, promociones, precios especiales y ventajas exclusivas. Algunos regalos, sorteos o promociones especiales podrán realizarse de acuerdo con cada campaña.',
      },
      {
        pregunta: '¿Todos los juguetes tienen Precio Socio?',
        respuesta: 'No. El Precio Socio se aplica únicamente a productos seleccionados.',
      },
      {
        pregunta: '¿El delivery es siempre gratis?',
        respuesta: 'No. Los beneficios de delivery dependen del monto, ubicación, producto o campaña correspondiente.',
      },
      { pregunta: '¿Puedo cancelar?', respuesta: 'Sí. Durante el piloto no existe obligación de permanencia.' },
      {
        pregunta: '¿Cómo recibo los beneficios?',
        respuesta: 'Principalmente a través de WhatsApp y nuestros canales oficiales.',
      },
      {
        pregunta: '¿Puedo comprar aunque no sea miembro?',
        respuesta: 'Sí. La tienda continuará atendiendo normalmente. El Club simplemente brinda beneficios adicionales.',
      },
    ] as FaqItem[],
  },
  testimonios: {
    visible: false,
    placeholder: 'Pronto conocerás experiencias de nuestros miembros fundadores.',
    items: [] as { nombre: string; texto: string }[],
  },
  ctaFinal: {
    titulo: 'Cada juguete crea un momento. Queremos que cada compra también te dé beneficios.',
    texto: 'Forma parte de nuestro primer grupo de miembros y descubre una nueva manera de comprar juguetes.',
    precio: 'S/14.90 / mes',
    ctaPrincipal: 'QUIERO SER MIEMBRO',
    ctaSecundario: 'TENGO UNA PREGUNTA',
  },
  footer: {
    links: [
      { label: 'Inicio', href: '#top' },
      { label: 'Beneficios', href: '#beneficios' },
      { label: 'Preguntas frecuentes', href: '#faq' },
      { label: 'Términos del Club', href: '/terminos' },
      { label: 'Política de privacidad', href: '/privacidad' },
      { label: 'Contáctanos', href: '#whatsapp' },
    ],
    redes: [
      { label: 'Facebook', href: 'https://facebook.com' },
      { label: 'Instagram', href: 'https://instagram.com' },
      { label: 'TikTok', href: 'https://tiktok.com' },
      { label: 'WhatsApp', href: '#whatsapp' },
    ],
    copyright: (anio: number, nombre: string) => `© ${anio} ${nombre}. Todos los derechos reservados.`,
  },
  floatingWhatsApp: {
    microcopy: '¿Tienes dudas?',
    delayMs: 3000,
  },
} as const;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/content.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/content.ts lib/content.test.ts
git commit -m "feat: add typed content model with compliance guardrail tests"
```

---

### Task 3: UTM capture (`lib/utm.ts`)

**Files:**
- Create: `lib/utm.ts`
- Test: `lib/utm.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `UtmParams` type, `captureUtmParams(search: string): UtmParams`, `getUtmParams(): UtmParams`. Consumed by `lib/analytics.ts` (Task 5) and `components/ui/UtmCapture.tsx` (Task 17).

- [ ] **Step 1: Write the failing test**

Create `lib/utm.test.ts`:

```ts
import { beforeEach, describe, expect, it } from 'vitest';
import { captureUtmParams, getUtmParams } from './utm';

describe('utm capture', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('extracts known utm params from a query string', () => {
    const found = captureUtmParams('?utm_source=facebook&utm_medium=cpc&other=1');
    expect(found).toEqual({ utm_source: 'facebook', utm_medium: 'cpc' });
  });

  it('ignores unrelated query params', () => {
    const found = captureUtmParams('?foo=bar');
    expect(found).toEqual({});
  });

  it('persists captured params for later retrieval', () => {
    captureUtmParams('?utm_source=instagram&utm_campaign=lanzamiento');
    expect(getUtmParams()).toEqual({ utm_source: 'instagram', utm_campaign: 'lanzamiento' });
  });

  it('returns an empty object when nothing was captured', () => {
    expect(getUtmParams()).toEqual({});
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/utm.test.ts`
Expected: FAIL — module `./utm` not found.

- [ ] **Step 3: Write minimal implementation**

Create `lib/utm.ts`:

```ts
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

type UtmKey = (typeof UTM_KEYS)[number];

export type UtmParams = Partial<Record<UtmKey, string>>;

const STORAGE_KEY = 'tendy_utm_params';

export function captureUtmParams(search: string): UtmParams {
  const params = new URLSearchParams(search);
  const found: UtmParams = {};

  UTM_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) found[key] = value;
  });

  if (Object.keys(found).length > 0 && typeof window !== 'undefined') {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found));
  }

  return found;
}

export function getUtmParams(): UtmParams {
  if (typeof window === 'undefined') return {};

  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return {};

  try {
    return JSON.parse(raw) as UtmParams;
  } catch {
    return {};
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/utm.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/utm.ts lib/utm.test.ts
git commit -m "feat: capture and persist UTM params"
```

---

### Task 4: WhatsApp link builder (`lib/whatsapp.ts`)

**Files:**
- Create: `lib/whatsapp.ts`
- Test: `lib/whatsapp.test.ts`

**Interfaces:**
- Consumes: nothing (reads `process.env.NEXT_PUBLIC_WHATSAPP_NUMBER` directly).
- Produces: `buildWhatsAppLink(message: string): string`, `FormularioData` type, `buildFormMessage(data: FormularioData): string`. Consumed by every section with a WhatsApp CTA (Tasks 9, 10, 12, 13, 14, 16, 17) and by `Formulario` (Task 14).

- [ ] **Step 1: Write the failing test**

Create `lib/whatsapp.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/whatsapp.test.ts`
Expected: FAIL — module `./whatsapp` not found.

- [ ] **Step 3: Write minimal implementation**

Create `lib/whatsapp.ts`:

```ts
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '51999999999';

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export interface FormularioData {
  nombre: string;
  whatsapp: string;
  rangoEdad?: string;
  preferencias?: string[];
}

export function buildFormMessage(data: FormularioData): string {
  const lineas = [
    'Hola 👋 Quiero información del Club VIP Fundadores.',
    `Nombre: ${data.nombre}`,
    `WhatsApp: ${data.whatsapp}`,
  ];

  if (data.rangoEdad) {
    lineas.push(`Rango de edad de interés: ${data.rangoEdad}`);
  }

  if (data.preferencias && data.preferencias.length > 0) {
    lineas.push(`Preferencias: ${data.preferencias.join(', ')}`);
  }

  return lineas.join('\n');
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/whatsapp.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/whatsapp.ts lib/whatsapp.test.ts
git commit -m "feat: build WhatsApp links and prefilled form messages"
```

---

### Task 5: Analytics helpers (`lib/analytics.ts`)

**Files:**
- Create: `lib/analytics.ts`
- Test: `lib/analytics.test.ts`

**Interfaces:**
- Consumes: `getUtmParams` from `@/lib/utm` (Task 3).
- Produces: `AnalyticsEvent` type (`'ViewContent' | 'ClickWhatsApp' | 'Lead' | 'SubmitApplication' | 'MembershipInterest'`), `trackEvent(name: AnalyticsEvent, params?: Record<string, unknown>): void`, `shouldLoadGTM(id?: string): boolean`, `shouldLoadGA(id?: string): boolean`, `shouldLoadPixel(id?: string): boolean`. Consumed by every CTA component and by `app/layout.tsx` (Task 17).

- [ ] **Step 1: Write the failing test**

Create `lib/analytics.test.ts`:

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { shouldLoadGA, shouldLoadGTM, shouldLoadPixel, trackEvent } from './analytics';

describe('trackEvent', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    window.gtag = vi.fn();
    window.fbq = vi.fn();
  });

  afterEach(() => {
    delete window.gtag;
    delete window.fbq;
  });

  it('forwards the event to gtag and fbq when both are present', () => {
    trackEvent('ClickWhatsApp', { ubicacion: 'hero' });
    expect(window.gtag).toHaveBeenCalledWith('event', 'ClickWhatsApp', expect.objectContaining({ ubicacion: 'hero' }));
    expect(window.fbq).toHaveBeenCalledWith('trackCustom', 'ClickWhatsApp', expect.objectContaining({ ubicacion: 'hero' }));
  });

  it('does not throw when gtag/fbq are missing', () => {
    delete window.gtag;
    delete window.fbq;
    expect(() => trackEvent('ViewContent')).not.toThrow();
  });
});

describe('shouldLoad* helpers', () => {
  it('treats undefined or empty strings as disabled', () => {
    expect(shouldLoadGTM(undefined)).toBe(false);
    expect(shouldLoadGA('')).toBe(false);
    expect(shouldLoadPixel('   ')).toBe(false);
  });

  it('treats a non-empty id as enabled', () => {
    expect(shouldLoadGTM('GTM-ABC123')).toBe(true);
    expect(shouldLoadGA('G-ABC123')).toBe(true);
    expect(shouldLoadPixel('123456')).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/analytics.test.ts`
Expected: FAIL — module `./analytics` not found.

- [ ] **Step 3: Write minimal implementation**

Create `lib/analytics.ts`:

```ts
import { getUtmParams } from './utm';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type AnalyticsEvent = 'ViewContent' | 'ClickWhatsApp' | 'Lead' | 'SubmitApplication' | 'MembershipInterest';

export function trackEvent(name: AnalyticsEvent, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;

  const payload = { ...params, ...getUtmParams() };

  if (typeof window.gtag === 'function') {
    window.gtag('event', name, payload);
  }

  if (typeof window.fbq === 'function') {
    window.fbq('trackCustom', name, payload);
  }
}

export function shouldLoadGTM(id?: string): boolean {
  return Boolean(id && id.trim().length > 0);
}

export function shouldLoadGA(id?: string): boolean {
  return Boolean(id && id.trim().length > 0);
}

export function shouldLoadPixel(id?: string): boolean {
  return Boolean(id && id.trim().length > 0);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/analytics.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/analytics.ts lib/analytics.test.ts
git commit -m "feat: add analytics event tracking and env-gated script helpers"
```

---

### Task 6: UI primitives — Button, Card, Icon

**Files:**
- Create: `components/ui/Button.tsx`
- Create: `components/ui/Card.tsx`
- Create: `components/ui/Icon.tsx`
- Test: `components/ui/Button.test.tsx`

**Interfaces:**
- Produces: `Button` (props: `children, href?, onClick?, variant? ('primary'|'secondary'|'outline'|'outlineLight'), fullWidthOnMobile? (default true), type? ('button'|'submit', default 'button'), className?`), `Card` (props: `children, className?`), `Icon` (props: `name: string, className?`). Consumed by every section component from Task 9 onward.

- [ ] **Step 1: Write the failing test**

Create `components/ui/Button.test.tsx`:

```tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders as a button and calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Click me' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders as a link when href is provided', () => {
    render(<Button href="/foo">Ir</Button>);
    const link = screen.getByRole('link', { name: 'Ir' });
    expect(link).toHaveAttribute('href', '/foo');
  });

  it('opens external links in a new tab', () => {
    render(<Button href="https://wa.me/123">WhatsApp</Button>);
    const link = screen.getByRole('link', { name: 'WhatsApp' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('uses type=submit when requested', () => {
    render(<Button type="submit">Enviar</Button>);
    expect(screen.getByRole('button', { name: 'Enviar' })).toHaveAttribute('type', 'submit');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/ui/Button.test.tsx`
Expected: FAIL — module `./Button` not found.

- [ ] **Step 3: Write minimal implementation**

Create `components/ui/Button.tsx`:

```tsx
'use client';
import { ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'outlineLight';

export interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  fullWidthOnMobile?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-brand-yellow text-brand-blue hover:bg-yellow-400',
  secondary: 'bg-brand-blue text-white hover:bg-blue-900',
  outline: 'border-2 border-brand-blue text-brand-blue bg-transparent hover:bg-brand-blue hover:text-white',
  outlineLight: 'border-2 border-white text-white bg-transparent hover:bg-white hover:text-brand-blue',
};

export function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  fullWidthOnMobile = true,
  type = 'button',
  className = '',
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center rounded-full px-6 py-3 font-bold text-base transition-colors duration-200 ${VARIANT_CLASSES[variant]} ${fullWidthOnMobile ? 'w-full sm:w-auto' : ''} ${className}`;

  if (href) {
    const isExternal = href.startsWith('http');
    return (
      <a
        href={href}
        onClick={onClick}
        className={classes}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
```

Create `components/ui/Card.tsx`:

```tsx
import { ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-white shadow-md p-6 ${className}`}>{children}</div>;
}
```

Create `components/ui/Icon.tsx`:

```tsx
type IconName = 'tag' | 'star' | 'rocket' | 'gift' | 'truck' | 'trophy';

const PATHS: Record<IconName, string> = {
  tag: 'M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3.24L4 3a1 1 0 0 0-1 1l.24 5.59a2 2 0 0 0 .58 1.41l9.59 9.59a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.83ZM7 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z',
  star: 'M12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2Z',
  rocket: 'M12 2c2.5 2 4 5.5 4 9 0 2-1 4-2 5l-2 3-2-3c-1-1-2-3-2-5 0-3.5 1.5-7 4-9Zm-3 14-2 5 4-2 4 2-2-5',
  gift: 'M20 12v9H4v-9M2 7h20v5H2V7Zm10-5c-1.5 0-3 1.5-3 3v2h3V2Zm0 0c1.5 0 3 1.5 3 3v2h-3V2Z',
  truck: 'M3 6h11v9H3V6Zm11 3h4l3 3v3h-7V9ZM6.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  trophy: 'M8 4h8v4a4 4 0 0 1-8 0V4Zm-4 1h4v2a4 4 0 0 1-4-4Zm16 0h-4v2a4 4 0 0 0 4-4ZM10 14h4v3h-4v-3Zm-2 5h8v2H8v-2Z',
};

export function Icon({ name, className = 'h-8 w-8' }: { name: string; className?: string }) {
  const path = PATHS[name as IconName];
  if (!path) return null;

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className} aria-hidden>
      <path d={path} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/ui/Button.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add components/ui/Button.tsx components/ui/Button.test.tsx components/ui/Card.tsx components/ui/Icon.tsx
git commit -m "feat: add Button, Card and Icon UI primitives"
```

---

### Task 7: Accordion (FAQ)

**Files:**
- Create: `components/ui/Accordion.tsx`
- Test: `components/ui/Accordion.test.tsx`

**Interfaces:**
- Produces: `AccordionItem` type (`{ question: string; answer: string }`), `Accordion` (props: `{ items: AccordionItem[] }`). Consumed by `Faq` section (Task 15).

- [ ] **Step 1: Write the failing test**

Create `components/ui/Accordion.test.tsx`:

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion } from './Accordion';

const ITEMS = [
  { question: '¿Uno?', answer: 'Respuesta uno' },
  { question: '¿Dos?', answer: 'Respuesta dos' },
];

describe('Accordion', () => {
  it('starts with every answer collapsed', () => {
    render(<Accordion items={ITEMS} />);
    expect(screen.queryByText('Respuesta uno')).not.toBeInTheDocument();
    expect(screen.queryByText('Respuesta dos')).not.toBeInTheDocument();
  });

  it('opens an answer when its question is clicked', async () => {
    render(<Accordion items={ITEMS} />);
    await userEvent.click(screen.getByText('¿Uno?'));
    expect(screen.getByText('Respuesta uno')).toBeInTheDocument();
  });

  it('closes the answer when clicked again', async () => {
    render(<Accordion items={ITEMS} />);
    await userEvent.click(screen.getByText('¿Uno?'));
    await userEvent.click(screen.getByText('¿Uno?'));
    expect(screen.queryByText('Respuesta uno')).not.toBeInTheDocument();
  });

  it('only keeps one answer open at a time', async () => {
    render(<Accordion items={ITEMS} />);
    await userEvent.click(screen.getByText('¿Uno?'));
    await userEvent.click(screen.getByText('¿Dos?'));
    expect(screen.queryByText('Respuesta uno')).not.toBeInTheDocument();
    expect(screen.getByText('Respuesta dos')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/ui/Accordion.test.tsx`
Expected: FAIL — module `./Accordion` not found.

- [ ] **Step 3: Write minimal implementation**

Create `components/ui/Accordion.tsx`:

```tsx
'use client';
import { useState } from 'react';

export interface AccordionItem {
  question: string;
  answer: string;
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setOpenIndex((current) => (current === index ? null : index));
  }

  return (
    <div className="divide-y divide-gray-200">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between py-4 text-left font-semibold text-brand-blue"
            >
              <span>{item.question}</span>
              <span aria-hidden>{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && <p className="pb-4 text-gray-600">{item.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/ui/Accordion.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add components/ui/Accordion.tsx components/ui/Accordion.test.tsx
git commit -m "feat: add single-open FAQ accordion"
```

---

### Task 8: Sticky header (scroll hook + mobile menu)

**Files:**
- Create: `components/ui/useIsScrolled.ts`
- Create: `components/ui/StickyHeader.tsx`
- Test: `components/ui/useIsScrolled.test.ts`
- Test: `components/ui/StickyHeader.test.tsx`

**Interfaces:**
- Consumes: `content` (Task 2), `Button` (Task 6), `buildWhatsAppLink` (Task 4), `trackEvent` (Task 5).
- Produces: `useIsScrolled(threshold?: number): boolean`, `StickyHeader` (no props). Consumed by `app/page.tsx` (Task 18).

- [ ] **Step 1: Write the failing tests**

Create `components/ui/useIsScrolled.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useIsScrolled } from './useIsScrolled';

function scrollTo(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
  window.dispatchEvent(new Event('scroll'));
}

describe('useIsScrolled', () => {
  it('is false before any scrolling', () => {
    const { result } = renderHook(() => useIsScrolled(10));
    expect(result.current).toBe(false);
  });

  it('becomes true once scrollY passes the threshold', () => {
    const { result } = renderHook(() => useIsScrolled(10));
    act(() => scrollTo(50));
    expect(result.current).toBe(true);
  });

  it('goes back to false when scrolled back up', () => {
    const { result } = renderHook(() => useIsScrolled(10));
    act(() => scrollTo(50));
    act(() => scrollTo(0));
    expect(result.current).toBe(false);
  });
});
```

Create `components/ui/StickyHeader.test.tsx`:

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StickyHeader } from './StickyHeader';

describe('StickyHeader', () => {
  it('hides the mobile menu by default', () => {
    render(<StickyHeader />);
    expect(screen.queryByRole('navigation', { hidden: true })).toBeTruthy();
    expect(screen.getByLabelText('Abrir menú')).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens the mobile menu when the hamburger button is clicked', async () => {
    render(<StickyHeader />);
    await userEvent.click(screen.getByLabelText('Abrir menú'));
    expect(screen.getByLabelText('Abrir menú')).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes the mobile menu on a second click', async () => {
    render(<StickyHeader />);
    const button = screen.getByLabelText('Abrir menú');
    await userEvent.click(button);
    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run components/ui/useIsScrolled.test.ts components/ui/StickyHeader.test.tsx`
Expected: FAIL — modules not found.

- [ ] **Step 3: Write minimal implementation**

Create `components/ui/useIsScrolled.ts`:

```ts
'use client';
import { useEffect, useState } from 'react';

export function useIsScrolled(threshold = 10): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > threshold);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return scrolled;
}
```

Create `components/ui/StickyHeader.tsx`:

```tsx
'use client';
import { useState } from 'react';
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
        <a href="#top" className="text-lg font-extrabold text-brand-blue">
          {content.marca.nombre}
        </a>
        <nav className="hidden items-center gap-6 sm:flex">
          {content.header.links.map((link) => (
            <a key={link.label} href={link.href} className="text-sm font-medium text-gray-700 hover:text-brand-blue">
              {link.label}
            </a>
          ))}
          <Button
            href={href}
            variant="primary"
            fullWidthOnMobile={false}
            onClick={() => trackEvent('MembershipInterest', { origen: 'header_cta' })}
          >
            {content.header.ctaLabel}
          </Button>
        </nav>
        <button
          type="button"
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
          className="text-2xl text-brand-blue sm:hidden"
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
          <Button href={href} variant="primary">
            {content.header.ctaLabel}
          </Button>
        </nav>
      )}
    </header>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run components/ui/useIsScrolled.test.ts components/ui/StickyHeader.test.tsx`
Expected: PASS (3 + 3 tests).

- [ ] **Step 5: Commit**

```bash
git add components/ui/useIsScrolled.ts components/ui/useIsScrolled.test.ts components/ui/StickyHeader.tsx components/ui/StickyHeader.test.tsx
git commit -m "feat: add sticky header with scroll shadow and mobile menu"
```

---

### Task 9: Floating WhatsApp button

**Files:**
- Create: `components/ui/WhatsAppFloatButton.tsx`
- Test: `components/ui/WhatsAppFloatButton.test.tsx`

**Interfaces:**
- Consumes: `content` (Task 2), `buildWhatsAppLink` (Task 4), `trackEvent` (Task 5).
- Produces: `WhatsAppFloatButton` (no props). Consumed by `app/layout.tsx` (Task 17).

- [ ] **Step 1: Write the failing test**

Create `components/ui/WhatsAppFloatButton.test.tsx`:

```tsx
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WhatsAppFloatButton } from './WhatsAppFloatButton';

describe('WhatsAppFloatButton', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('is not rendered immediately', () => {
    render(<WhatsAppFloatButton />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('appears after the configured delay', () => {
    render(<WhatsAppFloatButton />);
    vi.advanceTimersByTime(3000);
    expect(screen.getByRole('link')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/ui/WhatsAppFloatButton.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

Create `components/ui/WhatsAppFloatButton.tsx`:

```tsx
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/ui/WhatsAppFloatButton.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add components/ui/WhatsAppFloatButton.tsx components/ui/WhatsAppFloatButton.test.tsx
git commit -m "feat: add floating WhatsApp button appearing after 3s"
```

---

### Task 10: Hero section

**Files:**
- Create: `components/sections/Hero.tsx`
- Test: `components/sections/Hero.test.tsx`

**Interfaces:**
- Consumes: `content` (Task 2), `Button` (Task 6), `buildWhatsAppLink` (Task 4), `trackEvent` (Task 5).
- Produces: `Hero` (no props). Consumed by `app/page.tsx` (Task 18).

- [ ] **Step 1: Write the failing test**

Create `components/sections/Hero.test.tsx`:

```tsx
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Hero } from './Hero';
import { trackEvent } from '@/lib/analytics';

vi.mock('@/lib/analytics', () => ({ trackEvent: vi.fn() }));

describe('Hero', () => {
  beforeEach(() => {
    vi.mocked(trackEvent).mockClear();
  });

  it('fires ViewContent on mount', () => {
    render(<Hero />);
    expect(trackEvent).toHaveBeenCalledWith('ViewContent', { seccion: 'hero' });
  });

  it('shows the founder price and no-permanence copy', () => {
    render(<Hero />);
    expect(screen.getByText('S/14.90 / mes')).toBeInTheDocument();
    expect(screen.getByText('Sin permanencia durante el piloto.')).toBeInTheDocument();
  });

  it('fires MembershipInterest and links to WhatsApp when the main CTA is clicked', async () => {
    render(<Hero />);
    const cta = screen.getByRole('link', { name: 'QUIERO SER MIEMBRO' });
    expect(cta).toHaveAttribute('href', expect.stringContaining('https://wa.me/'));
    await userEvent.click(cta);
    expect(trackEvent).toHaveBeenCalledWith('MembershipInterest', { origen: 'hero_cta_principal' });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/sections/Hero.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

Create `components/sections/Hero.tsx`:

```tsx
'use client';
import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { content } from '@/lib/content';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

export function Hero() {
  useEffect(() => {
    trackEvent('ViewContent', { seccion: 'hero' });
  }, []);

  const whatsappHref = buildWhatsAppLink(content.whatsappCta.mensajePrellenado);

  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-b from-brand-blue to-blue-900 px-4 pt-28 pb-16 text-white sm:pt-32">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <span className="mb-4 inline-block rounded-full bg-brand-yellow px-4 py-1 text-sm font-bold text-brand-blue">
          {content.hero.badge}
        </span>
        <h1 className="mb-4 text-3xl font-extrabold leading-tight sm:text-5xl">{content.hero.headline}</h1>
        <p className="mb-6 max-w-2xl text-base text-blue-100 sm:text-lg">{content.hero.subtitulo}</p>
        <p className="mb-1 text-2xl font-bold text-brand-yellow">{content.hero.precio}</p>
        <p className="mb-8 text-sm text-blue-200">{content.hero.sinPermanencia}</p>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button href={whatsappHref} variant="primary" onClick={() => trackEvent('MembershipInterest', { origen: 'hero_cta_principal' })}>
            {content.hero.ctaPrincipal}
          </Button>
          <Button href="#beneficios" variant="outlineLight">
            {content.hero.ctaSecundario}
          </Button>
        </div>
        <p className="mt-4 text-xs text-blue-200">{content.hero.microcopy}</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/sections/Hero.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add components/sections/Hero.tsx components/sections/Hero.test.tsx
git commit -m "feat: add hero section with tracked WhatsApp CTA"
```

---

### Task 11: Static informational sections (QueEsElClub, Beneficios, Comparacion)

**Files:**
- Create: `components/sections/QueEsElClub.tsx`
- Create: `components/sections/Beneficios.tsx`
- Create: `components/sections/Comparacion.tsx`

**Interfaces:**
- Consumes: `content` (Task 2), `Card` and `Icon` (Task 6).
- Produces: `QueEsElClub`, `Beneficios`, `Comparacion` (all no props). Consumed by `app/page.tsx` (Task 18).

No dedicated unit tests — these are pure presentational mappings over `content.ts` with no branching logic. Verified via `npm run typecheck` (Step 2) and the manual browser walkthrough in Task 20.

- [ ] **Step 1: Implement the three sections**

Create `components/sections/QueEsElClub.tsx`:

```tsx
import { content } from '@/lib/content';

export function QueEsElClub() {
  return (
    <section id="que-es" className="px-4 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-2xl font-bold text-brand-blue sm:text-3xl">{content.queEsElClub.titulo}</h2>
        <p className="mb-6 text-gray-600">{content.queEsElClub.texto}</p>
        <ul className="space-y-2 text-left text-gray-700">
          {content.queEsElClub.puntos.map((punto) => (
            <li key={punto} className="flex items-start gap-2">
              <span className="text-accent-green" aria-hidden>
                ✓
              </span>
              {punto}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

Create `components/sections/Beneficios.tsx`:

```tsx
import { content } from '@/lib/content';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

export function Beneficios() {
  return (
    <section id="beneficios" className="bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-8 text-center text-2xl font-bold text-brand-blue sm:text-3xl">{content.beneficios.titulo}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.beneficios.items.map((item) => (
            <Card key={item.titulo}>
              <Icon name={item.icon} className="mb-3 h-8 w-8 text-accent-coral" />
              <h3 className="mb-2 text-lg font-bold text-brand-blue">{item.titulo}</h3>
              <p className="text-sm text-gray-600">{item.descripcion}</p>
            </Card>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-gray-500">{content.beneficios.disclaimer}</p>
      </div>
    </section>
  );
}
```

Create `components/sections/Comparacion.tsx`:

```tsx
import { content } from '@/lib/content';

export function Comparacion() {
  const { clienteNormal, miembroVip } = content.comparacion;

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-8 text-center text-2xl font-bold text-brand-blue sm:text-3xl">{content.comparacion.titulo}</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 p-6">
            <h3 className="mb-4 text-center font-bold text-gray-500">{clienteNormal.titulo}</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {clienteNormal.items.map((item) => (
                <li key={item.texto} className="flex items-start gap-2">
                  <span aria-hidden>{item.incluido ? '✓' : '✗'}</span>
                  {item.texto}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border-4 border-brand-yellow bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-center font-bold text-brand-blue">{miembroVip.titulo}</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {miembroVip.items.map((item) => (
                <li key={item.texto} className="flex items-start gap-2">
                  <span className="text-green-500" aria-hidden>
                    ✓
                  </span>
                  {item.texto}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add components/sections/QueEsElClub.tsx components/sections/Beneficios.tsx components/sections/Comparacion.tsx
git commit -m "feat: add QueEsElClub, Beneficios and Comparacion sections"
```

---

### Task 12: Pricing section

**Files:**
- Create: `components/sections/Pricing.tsx`
- Test: `components/sections/Pricing.test.tsx`

**Interfaces:**
- Consumes: `content` (Task 2), `Button` (Task 6), `buildWhatsAppLink` (Task 4), `trackEvent` (Task 5).
- Produces: `Pricing` (no props). Consumed by `app/page.tsx` (Task 18).

- [ ] **Step 1: Write the failing test**

Create `components/sections/Pricing.test.tsx`:

```tsx
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pricing } from './Pricing';
import { trackEvent } from '@/lib/analytics';

vi.mock('@/lib/analytics', () => ({ trackEvent: vi.fn() }));

describe('Pricing', () => {
  beforeEach(() => {
    vi.mocked(trackEvent).mockClear();
  });

  it('shows the founder price', () => {
    render(<Pricing />);
    expect(screen.getByText('S/ 14.90')).toBeInTheDocument();
  });

  it('fires MembershipInterest when the CTA is clicked', async () => {
    render(<Pricing />);
    await userEvent.click(screen.getByRole('link', { name: 'QUIERO UNIRME' }));
    expect(trackEvent).toHaveBeenCalledWith('MembershipInterest', { origen: 'pricing_cta' });
  });

  it('shows the no-permanence and free-cancellation copy', () => {
    render(<Pricing />);
    expect(screen.getByText('Sin permanencia durante el piloto.')).toBeInTheDocument();
    expect(screen.getByText('Puedes solicitar la cancelación de tu membresía cuando quieras.')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/sections/Pricing.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

Create `components/sections/Pricing.tsx`:

```tsx
'use client';
import { content } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

export function Pricing() {
  const href = buildWhatsAppLink(content.whatsappCta.mensajePrellenado);

  return (
    <section id="precio" className="px-4 py-16">
      <div className="mx-auto max-w-md rounded-3xl border-4 border-brand-yellow bg-white p-8 text-center shadow-xl">
        <span className="mb-4 inline-block rounded-full bg-brand-blue px-4 py-1 text-xs font-bold text-white">
          {content.pricing.badge}
        </span>
        <h3 className="mb-2 text-2xl font-bold text-brand-blue">{content.pricing.titulo}</h3>
        <p className="mb-1 text-5xl font-extrabold text-brand-blue">{content.pricing.precio}</p>
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
        <Button href={href} onClick={() => trackEvent('MembershipInterest', { origen: 'pricing_cta' })}>
          {content.pricing.cta}
        </Button>
        <p className="mt-4 text-xs text-gray-500">{content.pricing.sinPermanencia}</p>
        <p className="mt-1 text-xs text-gray-500">{content.pricing.cancelacion}</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/sections/Pricing.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add components/sections/Pricing.tsx components/sections/Pricing.test.tsx
git commit -m "feat: add single-plan pricing section"
```

---

### Task 13: Secondary CTA sections (ComoFunciona, Fundadores, WhatsappCta)

**Files:**
- Create: `components/sections/ComoFunciona.tsx`
- Create: `components/sections/Fundadores.tsx`
- Create: `components/sections/WhatsappCta.tsx`

**Interfaces:**
- Consumes: `content` (Task 2), `Button` (Task 6), `buildWhatsAppLink` (Task 4).
- Produces: `ComoFunciona`, `Fundadores`, `WhatsappCta` (all no props). Consumed by `app/page.tsx` (Task 18).

No dedicated tests — each reuses the already-tested `Button`/`buildWhatsAppLink` and adds no new branching logic. Verified via typecheck + manual walkthrough (Task 20).

- [ ] **Step 1: Implement the three sections**

Create `components/sections/ComoFunciona.tsx`:

```tsx
import { content } from '@/lib/content';

export function ComoFunciona() {
  return (
    <section id="como-funciona" className="bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-8 text-center text-2xl font-bold text-brand-blue sm:text-3xl">{content.comoFunciona.titulo}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.comoFunciona.pasos.map((paso) => (
            <div key={paso.numero} className="text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand-yellow font-bold text-brand-blue">
                {paso.numero}
              </div>
              <h3 className="mb-1 font-bold text-brand-blue">{paso.titulo}</h3>
              <p className="text-sm text-gray-600">{paso.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

Create `components/sections/Fundadores.tsx`:

```tsx
import { content } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { buildWhatsAppLink } from '@/lib/whatsapp';

export function Fundadores() {
  const href = buildWhatsAppLink(content.whatsappCta.mensajePrellenado);

  return (
    <section className="bg-brand-blue px-4 py-16 text-white">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="mb-4 text-2xl font-bold sm:text-3xl">{content.fundadores.titulo}</h2>
        <p className="mb-2 text-blue-100">{content.fundadores.texto1}</p>
        <p className="mb-6 text-blue-100">{content.fundadores.texto2}</p>
        <Button href={href} variant="primary">
          {content.fundadores.cta}
        </Button>
      </div>
    </section>
  );
}
```

Create `components/sections/WhatsappCta.tsx`:

```tsx
import { content } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { buildWhatsAppLink } from '@/lib/whatsapp';

export function WhatsappCta() {
  const href = buildWhatsAppLink(content.whatsappCta.mensajePrellenado);

  return (
    <section id="whatsapp" className="px-4 py-16 text-center">
      <h2 className="mb-2 text-2xl font-bold text-brand-blue">{content.whatsappCta.titulo}</h2>
      <p className="mb-6 text-gray-600">{content.whatsappCta.texto}</p>
      <Button href={href} variant="secondary">
        {content.whatsappCta.boton}
      </Button>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add components/sections/ComoFunciona.tsx components/sections/Fundadores.tsx components/sections/WhatsappCta.tsx
git commit -m "feat: add ComoFunciona, Fundadores and WhatsappCta sections"
```

---

### Task 14: Optional lead form

**Files:**
- Create: `components/sections/Formulario.tsx`
- Test: `components/sections/Formulario.test.tsx`

**Interfaces:**
- Consumes: `content` (Task 2), `Button` (Task 6), `buildFormMessage` and `buildWhatsAppLink` (Task 4), `trackEvent` (Task 5).
- Produces: `FormularioState` type, `isFormValid(state: FormularioState): boolean`, `Formulario` (no props). Consumed by `app/page.tsx` (Task 18).

- [ ] **Step 1: Write the failing test**

Create `components/sections/Formulario.test.tsx`:

```tsx
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Formulario } from './Formulario';
import { trackEvent } from '@/lib/analytics';

vi.mock('@/lib/analytics', () => ({ trackEvent: vi.fn() }));

describe('Formulario', () => {
  beforeEach(() => {
    vi.mocked(trackEvent).mockClear();
    window.open = vi.fn();
  });

  it('does not submit when required fields are missing', async () => {
    render(<Formulario />);
    await userEvent.click(screen.getByRole('button', { name: 'QUIERO INFORMACIÓN' }));
    expect(trackEvent).not.toHaveBeenCalled();
    expect(window.open).not.toHaveBeenCalled();
  });

  it('does not submit when the authorization checkbox is unchecked', async () => {
    render(<Formulario />);
    await userEvent.type(screen.getByLabelText('Nombre'), 'Ana');
    await userEvent.type(screen.getByLabelText('WhatsApp'), '987654321');
    await userEvent.click(screen.getByRole('button', { name: 'QUIERO INFORMACIÓN' }));
    expect(trackEvent).not.toHaveBeenCalled();
  });

  it('submits to WhatsApp and fires Lead + SubmitApplication when valid', async () => {
    render(<Formulario />);
    await userEvent.type(screen.getByLabelText('Nombre'), 'Ana');
    await userEvent.type(screen.getByLabelText('WhatsApp'), '987654321');
    await userEvent.click(screen.getByLabelText(/Autorizo que me contacten/));
    await userEvent.click(screen.getByRole('button', { name: 'QUIERO INFORMACIÓN' }));

    expect(trackEvent).toHaveBeenCalledWith('Lead', { origen: 'formulario' });
    expect(trackEvent).toHaveBeenCalledWith('SubmitApplication', { origen: 'formulario' });
    expect(window.open).toHaveBeenCalledWith(expect.stringContaining('https://wa.me/'), '_blank', 'noopener,noreferrer');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/sections/Formulario.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

Create `components/sections/Formulario.tsx`:

```tsx
'use client';
import { FormEvent, useState } from 'react';
import { content } from '@/lib/content';
import { buildFormMessage, buildWhatsAppLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';

export interface FormularioState {
  nombre: string;
  whatsapp: string;
  rangoEdad: string;
  preferencias: string[];
  autorizado: boolean;
}

const INITIAL_STATE: FormularioState = {
  nombre: '',
  whatsapp: '',
  rangoEdad: '',
  preferencias: [],
  autorizado: false,
};

export function isFormValid(state: FormularioState): boolean {
  return state.nombre.trim().length > 0 && state.whatsapp.trim().length > 0 && state.autorizado;
}

export function Formulario() {
  const [state, setState] = useState<FormularioState>(INITIAL_STATE);

  function togglePreferencia(pref: string) {
    setState((prev) => ({
      ...prev,
      preferencias: prev.preferencias.includes(pref)
        ? prev.preferencias.filter((p) => p !== pref)
        : [...prev.preferencias, pref],
    }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isFormValid(state)) return;

    trackEvent('Lead', { origen: 'formulario' });
    trackEvent('SubmitApplication', { origen: 'formulario' });

    const message = buildFormMessage({
      nombre: state.nombre,
      whatsapp: state.whatsapp,
      rangoEdad: state.rangoEdad || undefined,
      preferencias: state.preferencias,
    });

    window.open(buildWhatsAppLink(message), '_blank', 'noopener,noreferrer');
    setState(INITIAL_STATE);
  }

  return (
    <section id="formulario" className="bg-gray-50 px-4 py-16">
      <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-md">
        <h2 className="text-2xl font-bold text-brand-blue">{content.formulario.titulo}</h2>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="nombre">
            {content.formulario.campos.nombre}
          </label>
          <input
            id="nombre"
            type="text"
            value={state.nombre}
            onChange={(e) => setState((prev) => ({ ...prev, nombre: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="whatsapp">
            {content.formulario.campos.whatsapp}
          </label>
          <input
            id="whatsapp"
            type="tel"
            value={state.whatsapp}
            onChange={(e) => setState((prev) => ({ ...prev, whatsapp: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="rangoEdad">
            Rango de edad de interés
          </label>
          <select
            id="rangoEdad"
            value={state.rangoEdad}
            onChange={(e) => setState((prev) => ({ ...prev, rangoEdad: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          >
            <option value="">Selecciona una opción</option>
            {content.formulario.rangoEdad.map((rango) => (
              <option key={rango} value={rango}>
                {rango}
              </option>
            ))}
          </select>
        </div>
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-gray-700">Preferencias</legend>
          <div className="grid grid-cols-2 gap-2">
            {content.formulario.preferencias.map((pref) => (
              <label key={pref} className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={state.preferencias.includes(pref)} onChange={() => togglePreferencia(pref)} />
                {pref}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="flex items-start gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={state.autorizado}
            onChange={(e) => setState((prev) => ({ ...prev, autorizado: e.target.checked }))}
          />
          {content.formulario.autorizacion}
        </label>
        <a href="/privacidad" className="block text-sm text-brand-blue underline">
          {content.formulario.linkPrivacidad}
        </a>
        <Button type="submit">{content.formulario.boton}</Button>
      </form>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/sections/Formulario.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add components/sections/Formulario.tsx components/sections/Formulario.test.tsx
git commit -m "feat: add optional lead form redirecting to WhatsApp"
```

---

### Task 15: FAQ and Testimonios sections

**Files:**
- Create: `components/sections/Faq.tsx`
- Create: `components/sections/Testimonios.tsx`
- Test: `components/sections/Testimonios.test.tsx`

**Interfaces:**
- Consumes: `content` (Task 2), `Accordion` (Task 7), `Card` (Task 6).
- Produces: `Faq` (no props), `Testimonios` (props: `{ visible?: boolean; items?: { nombre: string; texto: string }[]; placeholder?: string }`, all defaulting from `content.testimonios`). Consumed by `app/page.tsx` (Task 18).

- [ ] **Step 1: Write the failing test (Testimonios only — Faq is a thin wrapper over the already-tested Accordion)**

Create `components/sections/Testimonios.test.tsx`:

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Testimonios } from './Testimonios';

describe('Testimonios', () => {
  it('shows the placeholder when not visible', () => {
    render(<Testimonios visible={false} placeholder="Pronto conocerás experiencias..." />);
    expect(screen.getByText('Pronto conocerás experiencias...')).toBeInTheDocument();
  });

  it('shows real testimonials when visible with items', () => {
    render(<Testimonios visible items={[{ nombre: 'Ana', texto: 'Excelente club' }]} />);
    expect(screen.getByText('Excelente club', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Ana')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/sections/Testimonios.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

Create `components/sections/Testimonios.tsx`:

```tsx
import { content } from '@/lib/content';
import { Card } from '@/components/ui/Card';

interface TestimoniosProps {
  visible?: boolean;
  items?: { nombre: string; texto: string }[];
  placeholder?: string;
}

export function Testimonios({
  visible = content.testimonios.visible,
  items = content.testimonios.items as { nombre: string; texto: string }[],
  placeholder = content.testimonios.placeholder,
}: TestimoniosProps = {}) {
  if (!visible) {
    return (
      <section className="px-4 py-12 text-center">
        <p className="text-gray-500">{placeholder}</p>
      </section>
    );
  }

  return (
    <section className="px-4 py-12">
      <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
        {items.map((t) => (
          <Card key={t.nombre}>
            <p className="mb-2 text-gray-700">&ldquo;{t.texto}&rdquo;</p>
            <p className="text-sm font-semibold text-brand-blue">{t.nombre}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
```

Create `components/sections/Faq.tsx`:

```tsx
import { content } from '@/lib/content';
import { Accordion } from '@/components/ui/Accordion';

export function Faq() {
  const items = content.faq.items.map((item) => ({ question: item.pregunta, answer: item.respuesta }));

  return (
    <section id="faq" className="px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-8 text-center text-2xl font-bold text-brand-blue sm:text-3xl">{content.faq.titulo}</h2>
        <Accordion items={items} />
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/sections/Testimonios.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add components/sections/Faq.tsx components/sections/Testimonios.tsx components/sections/Testimonios.test.tsx
git commit -m "feat: add FAQ accordion section and hideable testimonials section"
```

---

### Task 16: Closing sections (CtaFinal, Footer)

**Files:**
- Create: `components/sections/CtaFinal.tsx`
- Create: `components/sections/Footer.tsx`

**Interfaces:**
- Consumes: `content` (Task 2), `Button` (Task 6), `buildWhatsAppLink` (Task 4), `trackEvent` (Task 5).
- Produces: `CtaFinal`, `Footer` (both no props). Consumed by `app/page.tsx` (Task 18).

No dedicated tests — both reuse already-tested primitives with no new logic. Verified via typecheck + manual walkthrough (Task 20).

- [ ] **Step 1: Implement both sections**

Create `components/sections/CtaFinal.tsx`:

```tsx
'use client';
import { content } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

export function CtaFinal() {
  const href = buildWhatsAppLink(content.whatsappCta.mensajePrellenado);

  return (
    <section className="bg-brand-blue px-4 py-16 text-center text-white">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-4 text-2xl font-bold sm:text-3xl">{content.ctaFinal.titulo}</h2>
        <p className="mb-4 text-blue-100">{content.ctaFinal.texto}</p>
        <p className="mb-6 text-2xl font-bold text-brand-yellow">{content.ctaFinal.precio}</p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button href={href} variant="primary" onClick={() => trackEvent('MembershipInterest', { origen: 'cta_final' })}>
            {content.ctaFinal.ctaPrincipal}
          </Button>
          <Button href={href} variant="outlineLight">
            {content.ctaFinal.ctaSecundario}
          </Button>
        </div>
      </div>
    </section>
  );
}
```

Create `components/sections/Footer.tsx`:

```tsx
import { content } from '@/lib/content';

export function Footer() {
  return (
    <footer className="bg-gray-900 px-4 py-10 text-gray-300">
      <div className="mx-auto max-w-5xl">
        <p className="mb-4 text-lg font-bold text-white">{content.marca.nombre}</p>
        <nav className="mb-4 flex flex-wrap gap-4 text-sm">
          {content.footer.links.map((link) => (
            <a key={link.label} href={link.href} className="hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="mb-4 flex gap-4 text-sm">
          {content.footer.redes.map((red) => (
            <a key={red.label} href={red.href} className="hover:text-white">
              {red.label}
            </a>
          ))}
        </div>
        <p className="text-xs text-gray-500">{content.footer.copyright(content.marca.anioCopyright, content.marca.nombre)}</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add components/sections/CtaFinal.tsx components/sections/Footer.tsx
git commit -m "feat: add closing CTA and footer sections"
```

---

### Task 17: Root layout — SEO, fonts, tracking scripts, UTM capture

**Files:**
- Create: `components/ui/UtmCapture.tsx`
- Modify: `app/layout.tsx` (replace Task 1 placeholder)

**Interfaces:**
- Consumes: `content` (Task 2), `shouldLoadGTM/GA/Pixel` (Task 5), `captureUtmParams` (Task 3), `WhatsAppFloatButton` (Task 9).
- Produces: default export `RootLayout`, `metadata` export. No further tasks depend on new exports beyond what already exists.

No dedicated automated test — `next/script` injection and `<html>/<head>` metadata are not practically testable under jsdom/RTL for a full layout; the logic branches it depends on (`shouldLoadGTM/GA/Pixel`) are already unit-tested in Task 5. Verified via `npm run build` and the manual walkthrough in Task 20.

- [ ] **Step 1: Add the UTM capture component**

Create `components/ui/UtmCapture.tsx`:

```tsx
'use client';
import { useEffect } from 'react';
import { captureUtmParams } from '@/lib/utm';

export function UtmCapture() {
  useEffect(() => {
    captureUtmParams(window.location.search);
  }, []);

  return null;
}
```

- [ ] **Step 2: Replace the layout placeholder**

Replace the full contents of `app/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { content } from '@/lib/content';
import { shouldLoadGA, shouldLoadGTM, shouldLoadPixel } from '@/lib/analytics';
import { UtmCapture } from '@/components/ui/UtmCapture';
import { WhatsAppFloatButton } from '@/components/ui/WhatsAppFloatButton';

const nunito = Nunito({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: content.seo.title,
  description: content.seo.description,
  openGraph: {
    title: content.seo.title,
    description: content.seo.description,
    type: 'website',
    locale: 'es_PE',
  },
};

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-PE" className={nunito.variable}>
      <body className="bg-white font-sans text-gray-900">
        {shouldLoadGTM(GTM_ID) && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}
        {shouldLoadGA(GA_ID) && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${GA_ID}');`}
            </Script>
          </>
        )}
        {shouldLoadPixel(PIXEL_ID) && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${PIXEL_ID}');fbq('track', 'PageView');`}
          </Script>
        )}
        <UtmCapture />
        {children}
        <WhatsAppFloatButton />
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify the build still succeeds**

Run: `npm run build`
Expected: succeeds with no tracking env vars set (all three `shouldLoad*` branches are `false`, so no scripts render).

- [ ] **Step 4: Commit**

```bash
git add components/ui/UtmCapture.tsx app/layout.tsx
git commit -m "feat: wire SEO metadata, UTM capture and env-gated tracking scripts into layout"
```

---

### Task 18: Compose the home page

**Files:**
- Modify: `app/page.tsx` (replace Task 1 placeholder)

**Interfaces:**
- Consumes: every section component from Tasks 8–16 in the exact order defined by the spec.
- Produces: default export `HomePage`.

- [ ] **Step 1: Replace the page placeholder**

Replace the full contents of `app/page.tsx`:

```tsx
import { StickyHeader } from '@/components/ui/StickyHeader';
import { Hero } from '@/components/sections/Hero';
import { QueEsElClub } from '@/components/sections/QueEsElClub';
import { Beneficios } from '@/components/sections/Beneficios';
import { Comparacion } from '@/components/sections/Comparacion';
import { Pricing } from '@/components/sections/Pricing';
import { ComoFunciona } from '@/components/sections/ComoFunciona';
import { Fundadores } from '@/components/sections/Fundadores';
import { WhatsappCta } from '@/components/sections/WhatsappCta';
import { Formulario } from '@/components/sections/Formulario';
import { Faq } from '@/components/sections/Faq';
import { Testimonios } from '@/components/sections/Testimonios';
import { CtaFinal } from '@/components/sections/CtaFinal';
import { Footer } from '@/components/sections/Footer';

export default function HomePage() {
  return (
    <>
      <StickyHeader />
      <main>
        <Hero />
        <QueEsElClub />
        <Beneficios />
        <Comparacion />
        <Pricing />
        <ComoFunciona />
        <Fundadores />
        <WhatsappCta />
        <Formulario />
        <Faq />
        <Testimonios />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Build and run the full test suite**

Run: `npm run build`
Expected: succeeds.

Run: `npm test`
Expected: all tests from Tasks 2–16 pass.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: compose the Club VIP Fundadores landing page"
```

---

### Task 19: Legal pages — Privacidad and Términos

**Files:**
- Create: `app/privacidad/page.tsx`
- Create: `app/terminos/page.tsx`

**Interfaces:**
- Consumes: `content.marca.nombre` (Task 2).
- Produces: default exports `PrivacidadPage`, `TerminosPage`, routed at `/privacidad` and `/terminos`.

No dedicated tests — static legal copy with no logic. Verified via the manual walkthrough in Task 20 (pages render, links from footer/form work).

- [ ] **Step 1: Create the privacy policy page**

Create `app/privacidad/page.tsx`:

```tsx
import { content } from '@/lib/content';

export const metadata = { title: `Política de privacidad | ${content.marca.nombre}` };

export default function PrivacidadPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-gray-700">
      <h1 className="mb-6 text-3xl font-bold text-brand-blue">Política de Privacidad</h1>

      <p className="mb-4">
        En {content.marca.nombre} nos tomamos en serio la protección de tus datos personales, conforme a la Ley
        N° 29733 de Protección de Datos Personales del Perú y su reglamento.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-bold text-brand-blue">¿Qué datos recopilamos?</h2>
      <p className="mb-4">
        A través de nuestro formulario del Club VIP Fundadores solicitamos únicamente tu nombre, tu número de
        WhatsApp y, de forma opcional, un rango de edad de interés y tus preferencias de producto. No solicitamos
        ni almacenamos DNI, nombre completo, colegio, dirección permanente ni fecha exacta de nacimiento de
        ningún menor de edad.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-bold text-brand-blue">¿Para qué usamos tus datos?</h2>
      <p className="mb-4">
        Usamos tus datos exclusivamente para contactarte por WhatsApp y brindarte información sobre el Club VIP
        Fundadores y sus promociones. No usamos tus datos con ningún otro fin.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-bold text-brand-blue">Base legal</h2>
      <p className="mb-4">
        Tratamos tus datos en base a la autorización expresa que otorgas al marcar la casilla correspondiente en
        nuestro formulario.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-bold text-brand-blue">¿Compartimos tus datos?</h2>
      <p className="mb-4">
        No compartimos, vendemos ni cedemos tus datos personales a terceros, salvo obligación legal.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-bold text-brand-blue">¿Cuánto tiempo conservamos tus datos?</h2>
      <p className="mb-4">
        Conservamos tus datos mientras mantengas una relación con el Club o hasta que solicites su eliminación.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-bold text-brand-blue">Tus derechos</h2>
      <p className="mb-4">
        Puedes ejercer tus derechos de acceso, rectificación, cancelación y oposición (derechos ARCO)
        escribiéndonos directamente por WhatsApp.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-bold text-brand-blue">Cambios a esta política</h2>
      <p className="mb-4">
        Podemos actualizar esta política durante la etapa piloto. Cualquier cambio relevante será comunicado a
        través de nuestros canales oficiales.
      </p>
    </main>
  );
}
```

- [ ] **Step 2: Create the club terms page**

Create `app/terminos/page.tsx`:

```tsx
import { content } from '@/lib/content';

export const metadata = { title: `Términos del Club | ${content.marca.nombre}` };

export default function TerminosPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-gray-700">
      <h1 className="mb-6 text-3xl font-bold text-brand-blue">Términos del Club VIP Fundadores</h1>

      <p className="mb-4">
        El Club VIP Fundadores es un programa piloto de {content.marca.nombre}. Estos términos aplican durante la
        etapa piloto y pueden actualizarse conforme el programa evoluciona.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-bold text-brand-blue">Membresía</h2>
      <p className="mb-4">
        La membresía tiene un costo de S/ 14.90 al mes durante la etapa piloto. Sin permanencia durante el piloto:
        puedes solicitar la cancelación de tu membresía cuando quieras, escribiéndonos por WhatsApp.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-bold text-brand-blue">Beneficios</h2>
      <p className="mb-4">
        Los beneficios del Club (Precio Socio, puntos dobles, acceso anticipado, promociones privadas, beneficios
        de delivery y sorteos) están sujetos a disponibilidad, producto, campaña y condiciones comerciales
        vigentes en cada momento. No garantizan un descuento en todos los productos ni delivery gratuito
        ilimitado.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-bold text-brand-blue">Etapa piloto</h2>
      <p className="mb-4">
        Durante esta etapa mediremos qué beneficios son más valorados por nuestros miembros fundadores.
        {' '}
        {content.marca.nombre} puede modificar, ampliar o finalizar el programa piloto, informando previamente a
        los miembros activos por WhatsApp.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-bold text-brand-blue">Cancelación</h2>
      <p className="mb-4">
        Puedes cancelar tu membresía en cualquier momento solicitándolo por WhatsApp, sin penalidad.
      </p>
    </main>
  );
}
```

- [ ] **Step 3: Typecheck and build**

Run: `npm run typecheck && npm run build`
Expected: both succeed.

- [ ] **Step 4: Commit**

```bash
git add app/privacidad/page.tsx app/terminos/page.tsx
git commit -m "feat: add privacy policy and club terms pages"
```

---

### Task 20: Final verification

**Files:** none created — verification only.

- [ ] **Step 1: Full automated check**

Run: `npm run typecheck`
Expected: exits 0.

Run: `npm test`
Expected: all suites from Tasks 2–16 pass (content compliance, utm, whatsapp, analytics, Button, Accordion, useIsScrolled, StickyHeader, WhatsAppFloatButton, Hero, Pricing, Formulario, Testimonios).

Run: `npm run build`
Expected: production build succeeds with zero env vars set.

- [ ] **Step 2: Manual browser walkthrough**

Use the `run` skill to start `npm run dev` and drive the app in a browser:
- Confirm the sticky header gains a shadow on scroll and the hamburger menu opens/closes on mobile width (390px).
- Confirm the floating WhatsApp button appears ~3s after load.
- Click the hero "QUIERO SER MIEMBRO" CTA and confirm it opens `https://wa.me/51999999999?text=...` with the prefilled message.
- Open the FAQ and confirm only one answer is open at a time.
- Submit the form with a name, WhatsApp number and the authorization checkbox checked, and confirm it opens a WhatsApp link containing those values.
- Visit `/privacidad` and `/terminos` and confirm they render.
- Resize to 360px, 768px, 1024px, 1440px and confirm no horizontal overflow and CTAs stay full-width on mobile.

- [ ] **Step 3: Update `.env.local` note for the user**

No code change — remind the user (in your final report, not a file) to create `.env.local` from `.env.example` and set the real `NEXT_PUBLIC_WHATSAPP_NUMBER` before sharing the site externally.

- [ ] **Step 4: Final commit (only if Step 1/2 required fixes)**

If any fix was needed during verification:

```bash
git add -A
git commit -m "fix: address issues found during final verification"
```
