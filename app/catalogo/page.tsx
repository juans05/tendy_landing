import { PlatformShell } from '@/components/platform/PlatformShell';
import { Catalog } from '@/components/store/Catalog';
import { getCatalog } from '@/lib/platform/catalog';
export const metadata = { title: 'Juguetes y precios de socio | Tendy Perú', alternates: { canonical: '/catalogo' } };
export const dynamic = 'force-dynamic';
export default async function CatalogPage() {
  const { products } = await getCatalog();
  return <PlatformShell><div className="catalog-intro"><span className="status-pill">EL MUNDO TENDY</span><h1>Juguetes para cada imaginación.</h1></div><Catalog products={products} /></PlatformShell>;
}
