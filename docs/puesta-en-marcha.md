# Tendy: publicación y medición

> Actualización: consultar [Plataforma Club Tendy](./plataforma-club.md) para la implementación vigente. Las notas inferiores describen versiones previas; el catálogo ahora se administra en Supabase y existe una única membresía mensual.

La portada es una vitrina de categorías con imágenes referenciales, no un inventario confirmado. Sustituir los datos de `components/store/Catalog.tsx` por fotos, nombres, edades y precios aprobados antes de anunciar productos disponibles. No se agregan ofertas ni reseñas ficticias al marcado estructurado.

Copiar `.env.example` a `.env.local` y configurar:

- `NEXT_PUBLIC_WHATSAPP_NUMBER`: número comercial internacional, solo dígitos. Sin un número real los botones muestran un aviso y no abren WhatsApp.
- `NEXT_PUBLIC_SITE_URL`: origen HTTPS final, sin rutas. Activa indexación, URLs absolutas, sitemap y datos de organización. Sin dominio la web permanece en noindex.
- `NEXT_PUBLIC_GA_ID`: identificador G-… para GA4 directo; o `NEXT_PUBLIC_GTM_ID`: GTM-… para gestión mediante Tag Manager. Si ambos existen se carga únicamente GTM: configurar GA4 allí.
- `NEXT_PUBLIC_META_PIXEL_ID`: opcional, solo números.
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`: token de Search Console.
- `MP_ACCESS_TOKEN`: access token privado de MercadoPago (nunca `NEXT_PUBLIC_`). Sin él, el botón de pago en línea redirige con un aviso de error y no crea la suscripción.
- `RESEND_API_KEY`, `RECLAMOS_FROM_EMAIL`, `RECLAMOS_EMAIL`: envío del Libro de Reclamaciones por correo (Resend). `RECLAMOS_FROM_EMAIL` debe ser un remitente de un dominio verificado en Resend; `RECLAMOS_EMAIL` es la casilla del negocio que recibe cada reclamo. Sin estas variables, el formulario muestra un error y no se envía.

Reconstruir después de cambiar variables públicas. Ejecutar `npm test`, `npm run typecheck`, `npm run build`.

La analítica se carga solo después de aceptar. Se registran visitas mediante la etiqueta, `ClickWhatsApp` con `ubicacion` y `select_category` con `category`; los parámetros UTM se conservan por sesión. Un clic es una intención de contacto, no una venta ni una conversación confirmada. Con GTM crear activadores de evento personalizado para esos nombres y etiquetas GA4. No duplicar GA4 ni Meta entre el contenedor y la integración directa. No incluir datos personales en UTMs.

Verificar aceptación/rechazo en el navegador y eventos en GA4 DebugView o GTM Preview antes de publicar; requiere cuentas e IDs reales. En Search Console verificar propiedad y enviar `/sitemap.xml`. Revisar datos comerciales, texto de privacidad y términos con el responsable del negocio.

Las cinco imágenes de portada/vitrina se convierten a WebP (aprox. 169 KB en conjunto frente a 4.68 MB de originales); Next Image entrega tamaños adaptativos, carga diferida salvo la imagen principal. La página se prerenderiza; no usa carruseles, librerías de animación ni vídeo.

## Revisión de marca y membresía

Referencia: logo y header entregados en `app/img`, y estudio de viabilidad de septiembre de 2026. Se conserva la marca original Tendy Perú (naranja, negro, blanco). La oferta principal vuelve a ser la membresía, con vitrina complementaria. Se usa el precio piloto sugerido de S/ 14.90, ya presente en el proyecto. No se publican cifras financieras internas, supuestos de rentabilidad ni escasez artificial. No se promete ahorro garantizado, una caja mensual ni delivery ilimitado.

La fuente de contenido del Club es `lib/club.ts`. El estudio propone 10–20 miembros y validación de 60 días; esos objetivos operativos no son una cuenta de cupos ni promesas públicas. Puntos dobles, fechas especiales y delivery especial se describen como campañas condicionadas, pendientes de reglas comerciales. Confirmar productos elegibles, tasas/vencimiento/canje de puntos, zonas/mínimos de envío, vigencia y renovación antes de captar pagos.

Los guantes Spider Hero y las máquinas de peluches aparecen como productos reales en el estudio, pero no contiene fotos de catálogo ni precios de venta actuales verificables. No se sustituyeron sus fotos con ilustraciones inventadas: la vitrina sigue explícitamente referencial hasta recibir imágenes y disponibilidad reales.

`MembershipInterest` registra los clics en los CTA "Quiero ser fundador" (que llevan al pago, no a WhatsApp), con ubicación, plan Fundadores, valor 14.90 y moneda PEN. No equivale a una membresía vendida hasta que MercadoPago confirme el pago.

## Pago en línea con MercadoPago

La membresía se contrata solo por suscripción: la tarjeta en `#pagar` (`components/store/SubscribeCheckout.tsx`, dentro de `#membresia`) tiene un checkbox mensual/anual y un botón que crea una suscripción recurrente real (`preapproval`) en MercadoPago: mensual a S/ 14.90, o anual a S/ 163.90 (11 meses, un mes de descuento). Todos los CTA "Quiero ser fundador" (`JoinLink`) apuntan a `#pagar` en vez de abrir WhatsApp; WhatsApp queda solo para soporte y consultas (`ContactLink`). Los precios salen de `lib/mercadopago.ts`, que toma `club.price` como fuente única. El envío del formulario es una petición POST normal (sin JavaScript) a `app/api/mercadopago/subscribe/route.ts`, que valida plan y correo, llama a la API de MercadoPago con `MP_ACCESS_TOKEN` y redirige al `init_point` (checkout hospedado por MercadoPago) o de vuelta a `#membresia` con `?checkout_error=` si algo falla.

No hay webhook ni base de datos: el alta y el estado de la suscripción se confirman en el panel de MercadoPago, igual que hoy se confirman las altas por WhatsApp. Si se necesita que la web reconozca automáticamente a un socio activo, eso requiere agregar un webhook de `preapproval`/`payment` y persistencia, pendiente de definir.

Avatar: generado con la herramienta integrada de imágenes, basado en la bolsa naranja del logo. Prompt: personaje 3D de vinilo con cuerpo de bolsa naranja, lateral carbón, asa naranja, letra t blanca, expresión amigable, saludando y sosteniendo un pequeño regalo. Segunda pasada: conservar el personaje y reemplazar el fondo cuadriculado por crema uniforme #FFFAF4. Archivo de uso web: `public/images/tendy-avatar.webp`.
