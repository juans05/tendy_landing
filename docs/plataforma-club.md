# Plataforma Club Tendy

Esta guía reemplaza las instrucciones anteriores sobre planes y cobros. La aplicación ahora requiere un servidor Next.js: no se puede exportar como sitio estático.

## Funciones implementadas

- Una membresía mensual de S/ 14.90; acceso por correo y código de un solo uso.
- Catálogo público con fotos, stock y precios normal/socio administrables.
- Mi Club con vigencia calculada desde pagos aprobados, campañas, historial de pagos y pedidos registrados por el operador.
- Panel protegido en `/admin` para productos y campañas, registro manual de pedidos y consulta/conciliación de suscripciones y pagos.
- Cobro recurrente mediante MercadoPago, cancelación y webhook firmado. Volver del checkout no activa la membresía.

Sin configuración se muestra una vista previa honesta. No hay clientes, compras ni precios de juguetes inventados. No incluye carrito con despacho automatizado, sorteos ni sistema de puntos.

## Conectar Supabase

1. Crear un proyecto y ejecutar `supabase/schema.sql` en su editor SQL. Contiene tablas, permisos, políticas de acceso, funciones de conciliación y bucket público `catalog`.
2. Copiar `.env.example` a `.env.local`. Completar `SUPABASE_URL`, `SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY`. La última es exclusivamente del servidor: nunca compartirla en el navegador ni subir el archivo a Git.
3. Habilitar acceso por correo, configurar un remitente SMTP y las plantillas de confirmación/magic link para mostrar `{{ .Token }}`. Esta web verifica el código en su propio formulario; no depende del enlace de la plantilla.
4. Registrarse en la web y obtener el UUID del usuario en Supabase Authentication. Asignar al responsable mediante `insert into public.admins (user_id) values ('UUID_DEL_RESPONSABLE');`. Los usuarios no pueden asignarse permisos.
5. Las sesiones duran hasta una hora; al vencer se vuelve a pedir código. Se registra aceptación de términos del adulto. No se solicitan datos del menor.

## Conectar y verificar MercadoPago

Completar `MP_ACCESS_TOKEN`, `MP_COLLECTOR_ID`, `MP_WEBHOOK_SECRET`, `MP_LIVE_MODE` y `NEXT_PUBLIC_SITE_URL`. Usar `false` para pruebas y `true` únicamente con credenciales y pagos reales. El dominio debe ser el origen HTTPS del despliegue.

Configurar notificaciones en `/api/mercadopago/webhook` para suscripciones, pagos autorizados y pagos. Verificar con la cuenta del comercio que los eventos de suscripciones entreguen `x-signature`, `x-request-id` y `data.id` compatibles con la firma. No desactivar la verificación si la configuración de suscripciones del proveedor requiere otro mecanismo: resolver esa integración antes de producción.

Antes de habilitar ventas, probar con el proveedor: afiliación aprobada/rechazada, renovación, cancelación, reembolso y notificaciones duplicadas. Confirmar que un retorno de checkout sin pago no habilite beneficios y que un reembolso retire el período correspondiente. Estas pruebas externas necesitan cuentas configuradas y no se han ejecutado localmente.

Las reservas impiden crear cobros duplicados. Si MercadoPago no responde después de crear una suscripción, el intento queda pendiente de verificación: usar «Verificar en MercadoPago» en el panel. Si no existe un resultado único, revisar la referencia en el proveedor antes de liberar otro intento. Nunca borrar reservas para reintentar sin comprobar el cobro. Los registros se actualizan según la fecha del proveedor, no según el orden de llegada de los avisos.

## Contenido y publicación

Cargar desde el panel fotos y precios reales; publicar requiere fotografía, precio y stock definido. Las imágenes aceptadas son JPEG, PNG y WebP de hasta 2 MB. Publicar campañas con vigencia y condiciones concretas. El precio socio se muestra públicamente para explicar el valor del club; el operador debe comprobar la vigencia al tramitar un pedido.

Configurar WhatsApp, datos comerciales, remitente del Libro de Reclamaciones y dominio antes de anunciar la web. Configurar GA4 o GTM y Meta con los IDs del negocio; comprobar consentimiento y eventos en sus herramientas. Un clic de afiliación no representa una compra confirmada. Las áreas privadas tienen `noindex`; catálogo y portada usan sitemap y metadatos existentes.

Ejecutar `npm test`, `npm run build` y `npm run typecheck`. Publicar en alojamiento compatible con Node/Next.js, configurar secretos allí y repetir las pruebas del recorrido con una cuenta de prueba. Supervisar entregas fallidas del webhook y conciliar desde el panel cuando sea necesario.

Validación local: 75 pruebas aprobadas y compilación de producción correcta. Next.js se actualizó a 15.5.25; PostCSS de Next se fija en 8.5.28 mediante override por los avisos de seguridad de la versión transitiva. `npm audit --omit=dev` no reporta vulnerabilidades. La auditoría completa todavía incluye avisos en herramientas de desarrollo; no exponer los servidores de pruebas a Internet.
