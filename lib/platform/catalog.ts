import { platformReady, supabase } from './server';
import type { Campaign, Product } from './types';

// Names supplied in the business study. Prices and inventory remain unconfirmed.
export const referenceProducts: Product[] = [
  { id: 'spider-hero', name: 'Guantes Spider Hero', category: 'Aventura', description: 'Consulta las presentaciones de una y dos unidades y descubre cuál va con su próxima aventura.', image_url: null, price: null, member_price: null, age: 'Consultar edad recomendada', stock: null, published: true, featured: true },
  { id: 'maquina-peluches', name: 'Máquina de peluches', category: 'Diversión', description: 'Una idea para sorprender. Consulta los modelos, medidas y accesorios de cada presentación.', image_url: null, price: null, member_price: null, age: 'Consultar edad recomendada', stock: null, published: true, featured: true },
];
export async function getCatalog() {
  if (!platformReady()) return { products: referenceProducts, campaigns: [] as Campaign[], available: false };
  try {
    const now = encodeURIComponent(new Date().toISOString());
    const [products, campaigns] = await Promise.all([
      supabase<Product[]>('/rest/v1/products?published=eq.true&order=featured.desc,name.asc&limit=100'),
      supabase<Campaign[]>(`/rest/v1/campaigns?published=eq.true&starts_at=lte.${now}&ends_at=gte.${now}&order=ends_at.asc&limit=20`),
    ]);
    return { products, campaigns, available: true };
  } catch { return { products: referenceProducts, campaigns: [] as Campaign[], available: false }; }
}
