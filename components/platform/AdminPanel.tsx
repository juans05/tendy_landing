'use client';
import { useState } from 'react';
import type { Product, Campaign, Subscription, Payment } from '@/lib/platform/types';
import { money } from '@/lib/platform/types';
type Order = { id:string; user_id:string; description:string; total:number; status:string };
type Editor = Record<string, string | number | boolean | null>;
const productDefaults: Editor = { name:'',category:'',description:'',image_url:'',price:'',member_price:'',stock:'',age:'',published:false,featured:false };
const campaignDefaults: Editor = { title:'',description:'',conditions:'',starts_at:'',ends_at:'',published:false };
const orderDefaults: Editor = { user_id:'',description:'',total:'',status:'confirmado' };
const labels: Record<string,string> = { name:'Nombre del juguete',category:'Categoría',description:'Descripción',image_url:'Foto del producto',price:'Precio regular (S/)',member_price:'Precio socio (S/, opcional)',stock:'Unidades disponibles',age:'Edad recomendada por el fabricante',title:'Título',conditions:'Condiciones de la campaña',starts_at:'Inicio (hora de tu equipo)',ends_at:'Fin (hora de tu equipo)',user_id:'UUID del cliente',total:'Total del pedido (S/)',status:'Estado' };
export function AdminPanel({ products, campaigns, subscriptions, payments, orders, available = true }: { products:Product[]; campaigns:Campaign[]; subscriptions:Subscription[]; payments:Payment[]; orders:Order[]; available?:boolean }) {
  const [tab,setTab] = useState('products');
  const [editor,setEditor] = useState<Editor | null>(null);
  const [id,setId] = useState<string | null>(null);
  const [busy,setBusy] = useState(false);
  const [message,setMessage] = useState('');
  const tabs = { products:'Juguetes',campaigns:'Campañas',subscriptions:'Socios',payments:'Pagos',orders:'Pedidos' };
  function edit(row?: object) {
    const defaults = tab === 'products' ? productDefaults : tab === 'campaigns' ? campaignDefaults : orderDefaults;
    const values = { ...defaults, ...row } as Editor;
    for (const key of ['starts_at','ends_at']) if (values[key]) {
      const date = new Date(String(values[key]));
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      values[key] = date.toISOString().slice(0,16);
    }
    setId(row && 'id' in row ? String(row.id) : null); setEditor(values); setMessage('');
  }
  async function upload(file?: File) {
    if (!file) return;
    setBusy(true); setMessage('');
    try { const form = new FormData(); form.set('image',file); const r = await fetch('/api/admin/upload',{method:'POST',body:form}); const data = await r.json(); if (!r.ok) throw new Error(data.error); setEditor(current => ({...current,image_url:data.url})); }
    catch(err) { setMessage(err instanceof Error ? err.message : 'Error al subir la foto.'); }
    finally { setBusy(false); }
  }
  async function save(event:React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      const item = {...editor};
      if (tab === 'campaigns') for (const key of ['starts_at','ends_at']) item[key] = new Date(String(item[key])).toISOString();
      const r = await fetch('/api/admin',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({kind:tab,id,item})});
      const data = await r.json(); if(!r.ok) throw new Error(data.error);
      window.location.reload();
    } catch(err) { setMessage(err instanceof Error ? err.message : 'No se pudo guardar.'); }
    finally { setBusy(false); }
  }
  async function reconcile(id:string) {
    setBusy(true); setMessage('');
    try {
      const r=await fetch('/api/admin/reconcile',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});
      const data=await r.json(); if(!r.ok) throw new Error(data.error);
      window.location.reload();
    } catch(err) { setMessage(err instanceof Error ? err.message : 'No se pudo verificar.'); }
    finally { setBusy(false); }
  }
  const defaults = tab === 'products' ? productDefaults : tab === 'campaigns' ? campaignDefaults : orderDefaults;
  return <><div className="admin-tabs" role="group" aria-label="Secciones de administración">{Object.entries(tabs).map(([key,label]) => <button key={key} aria-pressed={tab===key} onClick={()=>{setTab(key);setEditor(null);setMessage('');}}>{label}</button>)}</div>
    <div className="admin-toolbar"><h2>{tabs[tab as keyof typeof tabs]}</h2>{['products','campaigns','orders'].includes(tab) && <button className="button button-small" disabled={!available} onClick={()=>edit()}>+ Nuevo registro</button>}</div>
    {editor && <form className="admin-editor platform-form" onSubmit={save}><h3>{id?'Editar':'Nuevo'} registro</h3><div className="editor-grid">{Object.keys(defaults).map(key => typeof defaults[key] === 'boolean' ? <label key={key} className="check-label"><input type="checkbox" checked={Boolean(editor[key])} onChange={e=>setEditor({...editor,[key]:e.target.checked})}/><span>{key==='published'?'Publicado y visible para clientes':'Destacado en portada'}</span></label> : <label key={key}>{labels[key]}{['description','conditions'].includes(key) ? <textarea required maxLength={key==='conditions'?2000:600} value={String(editor[key] ?? '')} onChange={e=>setEditor({...editor,[key]:e.target.value})}/> : key==='status' ? <select value={String(editor[key])} onChange={e=>setEditor({...editor,[key]:e.target.value})}>{['confirmado','preparando','enviado','entregado','cancelado'].map(s=><option key={s}>{s}</option>)}</select> : key==='image_url' ? <><input readOnly value={String(editor[key]??'')} placeholder="Sube una foto JPG, PNG o WebP"/><input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={e=>upload(e.target.files?.[0])}/><small>Máximo 2 MB. Recomendado: WebP menor de 200 KB.</small></> : <input required={!['price','member_price','stock'].includes(key)} type={['price','member_price','stock','total'].includes(key)?'number':key.endsWith('_at')?'datetime-local':'text'} min="0" step={key==='stock'?'1':'0.01'} value={String(editor[key]??'')} onChange={e=>setEditor({...editor,[key]:e.target.value})}/>}</label>)}</div>{message&&<p role="alert" className="form-error">{message}</p>}<div className="form-actions"><button className="button" disabled={busy}>{busy?'Guardando…':'Guardar cambios'}</button><button type="button" className="text-link" onClick={()=>setEditor(null)}>Cerrar editor</button></div></form>}
    <div className="table-wrap"><table><thead><tr>{(tab==='products'?['Producto','Regular / Socio','Stock','Visibilidad','']:tab==='campaigns'?['Campaña','Fin','Visibilidad','']:tab==='subscriptions'?['Cliente (UUID)','Suscripción','Estado','Creación']:tab==='payments'?['Cliente (UUID)','Pago','Importe','Estado']:['Cliente (UUID)','Pedido','Total','Estado','']).map((h,i)=><th key={i}>{h}</th>)}</tr></thead><tbody>
      {tab==='products' && products.map(p=><tr key={p.id}><td>{p.name}</td><td>{p.price===null?'—':money(p.price)} / {p.member_price===null?'—':money(p.member_price)}</td><td>{p.stock??'Por confirmar'}</td><td>{p.published?'Publicado':'Borrador'}</td><td><button onClick={()=>edit(p)}>Editar</button></td></tr>)}
      {tab==='campaigns' && campaigns.map(c=><tr key={c.id}><td>{c.title}</td><td>{new Date(c.ends_at).toLocaleDateString('es-PE')}</td><td>{c.published?'Publicada':'Borrador'}</td><td><button onClick={()=>edit(c)}>Editar</button></td></tr>)}
      {tab==='subscriptions' && subscriptions.map(s=><tr key={s.id}><td className="uuid-cell">{s.user_id}</td><td className="uuid-cell">{s.mp_id||s.id}</td><td>{s.status}</td><td>{new Date(s.created_at).toLocaleDateString('es-PE')}<br/><button disabled={busy} onClick={()=>reconcile(s.id)}>Verificar en MercadoPago</button></td></tr>)}
      {tab==='payments' && payments.map(p=><tr key={p.id}><td className="uuid-cell">{p.user_id}</td><td>{p.id}</td><td>{money(p.amount)}</td><td>{p.status}</td></tr>)}
      {tab==='orders' && orders.map(o=><tr key={o.id}><td className="uuid-cell">{o.user_id}</td><td>{o.description}</td><td>{money(o.total)}</td><td>{o.status}</td><td><button onClick={()=>edit(o)}>Editar</button></td></tr>)}
    </tbody></table>{(tab==='products'?products:tab==='campaigns'?campaigns:tab==='subscriptions'?subscriptions:tab==='payments'?payments:orders).length===0&&<p className="table-empty">Aún no hay registros en esta sección.</p>}</div>{!editor&&message&&<p className="form-error" role="alert">{message}</p>}<p className="form-hint">Los pagos y estados de suscripción se verifican con MercadoPago. No se editan manualmente desde este panel.</p></>;
}
