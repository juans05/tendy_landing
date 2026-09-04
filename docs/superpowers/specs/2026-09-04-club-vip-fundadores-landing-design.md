# Club VIP Fundadores — Landing Page (Tendy)

## Objetivo

Landing comercial de alta conversión para validar el piloto "Club VIP Fundadores" de Tendy (juguetería peruana, ~1 mes operando). Meta única: click a WhatsApp → conversación → alta de miembro. Sin plataforma de membresías, sin login, sin pasarela de pago recurrente, sin app.

## Contenido

El copy completo (headlines, textos de cada sección, FAQ, beneficios, comparación, pricing, formulario, footer) está definido íntegramente en el brief original del usuario (sesión de brainstorming) y se traslada tal cual a `lib/content.ts`. Este documento no repite ese copy — solo fija arquitectura y decisiones técnicas.

Secciones (en orden): Header sticky → Hero → Qué es el Club → Beneficios (grid 6 cards) → Comparación (cliente normal vs miembro VIP) → Pricing (1 plan) → Cómo funciona (4 pasos) → Club Fundadores → WhatsApp CTA block → Formulario opcional → FAQ (acordeón) → Testimonios (oculto/placeholder) → CTA final → Footer → Botón flotante WhatsApp (aparece a los ~3s).

Páginas adicionales: `/privacidad`, `/terminos`.

## Stack

Next.js 14 (App Router) + TypeScript + Tailwind CSS. Sin backend, sin base de datos, sin CMS.

## Estructura de archivos

```
app/
  page.tsx
  privacidad/page.tsx
  terminos/page.tsx
  layout.tsx              # metadata SEO/OG, fonts, scripts GTM/GA/Pixel
components/
  sections/                # un componente por sección listada arriba
  ui/                      # Button, Card, Accordion, StickyHeader, WhatsAppFloatButton
lib/
  content.ts               # todo el copy, tipado, editable sin tocar JSX
  whatsapp.ts               # construye link wa.me + mensaje prellenado + UTMs
  analytics.ts               # helpers gtag()/fbq() para los eventos
  utm.ts                      # captura utm_* de la URL, persiste en sessionStorage
public/
  images/                   # placeholders/SVG (ver "Imágenes")
```

## Decisiones clave

### 1. Formulario (Sección 9) → WhatsApp, sin backend

Al enviar el formulario corto (nombre, WhatsApp, rango de edad opcional, preferencias opcionales, checkbox de autorización), no se persiste en ninguna base de datos ni se llama a ningún endpoint propio. Se dispara el evento `SubmitApplication`, se arma un mensaje de WhatsApp prellenado con los datos capturados (vía `lib/whatsapp.ts`), y se redirige a `wa.me` con ese mensaje. Esto es intencional: cumple "no complicar el proceso con registros extensos" sin construir almacenamiento. Si en el futuro se necesita guardar leads (hoja de cálculo, CRM), es una ampliación posterior, no parte de este piloto.

### 2. Contenido editable centralizado

Todo el copy vive en `lib/content.ts` como un objeto TypeScript tipado (headline, subtítulos, beneficios, FAQ, pricing, etc.). Los componentes de sección solo leen de ahí. Objetivo: permitir cambiar textos para pruebas A/B (ej. headline alternativa del hero) sin tocar componentes.

### 3. Testimonios ocultables

`content.ts` incluye `testimonios.visible: boolean` (default `false`) que muestra el placeholder "Pronto conocerás experiencias de nuestros miembros fundadores." en vez de testimonios inventados. Cuando existan testimonios reales, se listan en `content.ts` y se cambia el flag.

### 4. Imágenes

Sin fotos reales por ahora. Hero y secciones usan gradientes de marca (azul intenso / amarillo cálido / blanco, acentos celeste/coral/verde/morado), iconografía SVG inline (cajas de regalo, estrellas, confeti moderado) y formas geométricas — nada de imágenes externas ni stock. Cero dependencias de red para assets, carga rápida por diseño. Reemplazar por fotos reales es un cambio de contenido posterior, no de arquitectura.

### 5. Tracking

- Google Tag Manager opcional (`NEXT_PUBLIC_GTM_ID`); si está vacío, no se inyecta.
- GA4 (`NEXT_PUBLIC_GA_ID`) y Meta Pixel (`NEXT_PUBLIC_META_PIXEL_ID`) opcionales, mismo criterio.
- Eventos: `ViewContent` (al cargar hero), `ClickWhatsApp` (cualquier botón que abra WhatsApp), `Lead` (checkbox de autorización marcado o submit de formulario), `SubmitApplication` (envío del formulario), `MembershipInterest` (click en CTA "Quiero ser miembro"/"Quiero unirme"/"Quiero ser fundador").
- UTMs (`utm_source/medium/campaign/content/term`) se leen de la URL en el primer render, se guardan en `sessionStorage`, y se anexan como parámetros al link de WhatsApp y se incluyen en el payload de cada evento de analítica.

### 6. Variables de entorno

`.env.example`:
```
NEXT_PUBLIC_WHATSAPP_NUMBER=51999999999   # placeholder, reemplazar antes de publicar
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_GTM_ID=
```
El sitio debe funcionar completamente (salvo el número real de WhatsApp) sin ninguna de estas variables configuradas.

## Fuera de alcance (explícito)

Dashboard de miembros, app móvil, sistema de puntos, pasarela de pago recurrente, perfiles de menores, login, ecommerce completo, almacenamiento de leads en base de datos/CRM, testimonios inventados, escasez falsa ("últimos cupos").

## Responsive

Mobile-first. Breakpoints objetivo: 360, 390, 430, 768, 1024, 1440px. CTAs full-width en móvil.

## Despliegue

Solo entorno de desarrollo local (`npm run dev`) por ahora. Sin configuración de despliegue específica (Vercel u otro) en este piloto.
