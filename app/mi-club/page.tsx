import { redirect } from 'next/navigation';
import Image from 'next/image';
import { PlatformShell } from '@/components/platform/PlatformShell';
import { MemberActions } from '@/components/platform/MemberActions';
import { currentUser, isAdmin, privateMetadata, supabase } from '@/lib/platform/server';
import { getCatalog } from '@/lib/platform/catalog';
import { accessUntil, money, type Subscription, type Payment } from '@/lib/platform/types';
export const metadata = { ...privateMetadata, title: 'Mi Club | Tendy Perú' };
const date = (value: string) => new Date(value).toLocaleDateString('es-PE', { timeZone: 'America/Lima', day: 'numeric', month: 'short', year: 'numeric' });
export default async function MemberPage({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const params = await searchParams;
  const user = await currentUser();
  if (!user) redirect('/ingresar');
  const [subscriptions, payments, orders, admin, catalog] = await Promise.all([
    supabase<Subscription[]>(`/rest/v1/subscriptions?user_id=eq.${user.id}&order=created_at.desc&limit=10`),
    supabase<Payment[]>(`/rest/v1/payments?user_id=eq.${user.id}&order=paid_at.desc&limit=100`),
    supabase<{id:string;description:string;total:number;status:string;created_at:string}[]>(`/rest/v1/orders?user_id=eq.${user.id}&order=created_at.desc&limit=50`),
    isAdmin(user.id), getCatalog(),
  ]);
  const sub = subscriptions[0];
  const until = accessUntil(payments);
  const pending = sub && ['creating','pending'].includes(sub.status);
  return <PlatformShell admin={admin}><div className="dashboard-heading"><div><div className="eyebrow">QUÉ BUENO TENERTE AQUÍ</div><h1>Tu mundo <em>Tendy.</em></h1><p>{user.email}</p></div>{admin && <a className="button button-small" href="/admin">Administrar tienda ↗</a>}</div>
    {params.estado === 'verificando' && <p className="notice-box" role="status">Bienvenido de vuelta. Estamos esperando la confirmación de MercadoPago. Usa “Actualizar mi estado” para consultar el cobro; no necesitas volver a pagar.</p>}
    {params.estado === 'cancelada' && <p className="notice-box" role="status">La renovación fue cancelada. Tu periodo pagado conserva su vigencia.</p>}
    <div className="dashboard-grid"><section className="digital-card"><span className="status-pill">{until ? 'MEMBRESÍA ACTIVA' : pending ? 'ACTIVACIÓN PENDIENTE' : 'TU CUENTA TENDY'}</span><h2>{until ? 'Más motivos para sonreír.' : 'Tu próximo paso: ser del Club.'}</h2><p>Club Fundadores · S/ 14.90 al mes</p><div className="card-details"><span>{until ? 'ACCESO HASTA' : 'ESTADO'}<strong>{until ? date(until) : pending ? 'Esperando confirmación' : 'Sin periodo activo'}</strong></span><span>RENOVACIÓN<strong>{sub?.status === 'cancelled' ? 'Desactivada' : sub?.next_payment_date ? date(sub.next_payment_date) : 'Por confirmar'}</strong></span></div><small>El estado se verifica con tus pagos; esta tarjeta no sustituye la validación de la tienda.</small><Image src="/images/tendy-avatar.webp" alt="" width={150} height={150} /></section><section className="dashboard-panel"><h3>Tu membresía, bajo tu control.</h3><p>{until ? 'Consulta productos participantes y aprovecha las campañas vigentes durante tu periodo activo.' : 'Activa tu membresía para acceder a los beneficios participantes. Crear una cuenta no genera cobros.'}</p>{!until && !sub && <a className="button" href="/unirme">Activar mi membresía ↗</a>}{!until && sub?.status === 'cancelled' && <a className="button" href="/unirme">Volver al Club ↗</a>}{sub?.status === 'pending' && <a className="button" href="/unirme">Continuar mi afiliación ↗</a>}{sub?.status === 'creating' && <p className="notice-box">Tu solicitud está en verificación. Si permanece así, contacta con Tendy antes de intentar otro pago.</p>}<MemberActions canCancel={Boolean(sub?.mp_id && sub.status !== 'cancelled')} canSync={Boolean(sub?.mp_id)} /></section></div>
    <section className="dashboard-section"><div className="catalog-heading"><h2>Para disfrutar <em>hoy.</em></h2><a href="/catalogo" className="text-link">Ver juguetes ↗</a></div><div className="campaign-grid">{catalog.campaigns.map(c => <article key={c.id} className="campaign-card"><span className="status-pill">HASTA {date(c.ends_at)}</span><h3>{c.title}</h3><p>{c.description}</p><details><summary>Ver condiciones</summary><p>{c.conditions}</p></details><a href="/catalogo" className="text-link">Ver productos ↗</a></article>)}</div>{!catalog.campaigns.length && <div className="empty-state"><h3>Las próximas campañas aparecerán aquí.</h3><p>Consulta el catálogo para conocer los productos con precio de socio.</p></div>}</section>
    <section className="dashboard-section"><h2>Mis pagos</h2><div className="table-wrap"><table><thead><tr><th>Fecha</th><th>Importe</th><th>Estado</th><th>Periodo hasta</th></tr></thead><tbody>{payments.map(p => <tr key={p.id}><td>{date(p.paid_at)}</td><td>{money(p.amount)}</td><td>{({ approved:'Aprobado',rejected:'Rechazado',refunded:'Devuelto',charged_back:'Revertido',pending:'Pendiente' } as Record<string,string>)[p.status] || 'En revisión'}</td><td>{p.status === 'approved' ? date(p.period_end) : '—'}</td></tr>)}</tbody></table>{!payments.length && <p className="table-empty">Todavía no hay pagos registrados.</p>}</div></section>
    <section className="dashboard-section"><h2>Mis pedidos</h2><p className="muted">Pedidos confirmados por el equipo de Tendy. Una consulta por WhatsApp todavía no es un pedido.</p><div className="table-wrap"><table><thead><tr><th>Pedido</th><th>Total</th><th>Estado</th></tr></thead><tbody>{orders.map(order => <tr key={order.id}><td>{order.description}</td><td>{money(order.total)}</td><td>{order.status}</td></tr>)}</tbody></table>{!orders.length && <p className="table-empty">Cuando confirmes tu primer pedido, lo encontrarás aquí.</p>}</div></section>
  </PlatformShell>;
}
