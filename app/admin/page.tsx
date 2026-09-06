import { redirect } from 'next/navigation';
import { PlatformShell } from '@/components/platform/PlatformShell';
import { AdminPanel } from '@/components/platform/AdminPanel';
import { currentUser, isAdmin, platformReady, privateMetadata, supabase } from '@/lib/platform/server';
import type { Product, Campaign, Subscription, Payment } from '@/lib/platform/types';
export const metadata = { ...privateMetadata, title: 'Administración | Tendy Perú' };
export const dynamic = 'force-dynamic';
export default async function AdminPage({ searchParams }: { searchParams: Promise<{ pagina?:string }> }) {
  if (!platformReady()) return <PlatformShell><div className="dashboard-heading"><div><div className="eyebrow">TENDY PERÚ · ADMINISTRACIÓN</div><h1>Tu tienda,<br /><em>en tus manos.</em></h1></div></div><p className="notice-box">Vista previa sin conexión. Configura la plataforma y autoriza tu cuenta de administrador para gestionar productos, campañas, miembros y pedidos. Los controles de escritura están desactivados.</p><AdminPanel available={false} products={[]} campaigns={[]} subscriptions={[]} payments={[]} orders={[]} /></PlatformShell>;
  const user = await currentUser();
  if (!user) redirect('/ingresar');
  if (!(await isAdmin(user.id))) return <PlatformShell><div className="empty-state"><h1>Acceso reservado.</h1><p>Esta sección es exclusiva del equipo de Tendy.</p><a href="/mi-club" className="button">Volver a Mi Club</a></div></PlatformShell>;
  const params = await searchParams;
  const page = Math.min(10000, Math.max(1, parseInt(params.pagina || '1',10) || 1));
  const pagination = `limit=100&offset=${(page-1)*100}`;
  const [products,campaigns,subscriptions,payments,orders] = await Promise.all([
    supabase<Product[]>(`/rest/v1/products?order=name.asc&${pagination}`),
    supabase<Campaign[]>(`/rest/v1/campaigns?order=starts_at.desc&${pagination}`),
    supabase<Subscription[]>(`/rest/v1/subscriptions?order=created_at.desc&${pagination}`),
    supabase<Payment[]>(`/rest/v1/payments?order=paid_at.desc&${pagination}`),
    supabase<{id:string;user_id:string;description:string;total:number;status:string}[]>(`/rest/v1/orders?order=created_at.desc&${pagination}`),
  ]);
  return <PlatformShell admin><div className="dashboard-heading"><div><div className="eyebrow">TENDY PERÚ · ADMINISTRACIÓN</div><h1>Haz crecer <em>la alegría.</em></h1><p>Gestiona tu catálogo y tu Club desde aquí.</p></div></div><AdminPanel products={products} campaigns={campaigns} subscriptions={subscriptions} payments={payments} orders={orders}/><div className="pagination">{page>1&&<a href={`/admin?pagina=${page-1}`}>← Anterior</a>}<span>Página {page} · Hasta 100 registros por sección</span>{[products,campaigns,subscriptions,payments,orders].some(rows=>rows.length===100)&&<a href={`/admin?pagina=${page+1}`}>Siguiente →</a>}</div></PlatformShell>;
}
