const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const siteUrl = configuredUrl ? new URL(configuredUrl).origin : undefined;
export const seoTitle = 'Club Tendy Perú | Membresía de juguetes desde S/ 14.90 al mes';
export const seoDescription = 'Conoce el Club Fundadores de Tendy Perú: precios de socio en juguetes seleccionados, novedades y promociones por S/ 14.90 al mes. Explora el catálogo y gestiona tu membresía en Mi Club.';
