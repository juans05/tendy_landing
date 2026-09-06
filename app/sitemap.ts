import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo';
export default function sitemap(): MetadataRoute.Sitemap {
 return siteUrl ? ['', '/catalogo', '/privacidad', '/terminos'].map(path => ({ url: `${siteUrl}${path}`, changeFrequency: path ? 'yearly' : 'weekly', priority: path ? 0.3 : 1 })) : [];
}
