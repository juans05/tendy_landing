'use client';
import { useState } from 'react';
import type { ClaimInput } from '@/lib/reclamos';

const initialState: ClaimInput = {
  tipo: 'reclamo',
  nombre: '',
  tipoDocumento: 'DNI',
  numeroDocumento: '',
  domicilio: '',
  telefono: '',
  email: '',
  apoderado: '',
  bienTipo: 'producto',
  bienDescripcion: '',
  montoReclamado: '',
  detalle: '',
  pedido: '',
};

export function ClaimsBookForm() {
  const [form, setForm] = useState<ClaimInput>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);

  function update<K extends keyof ClaimInput>(key: K, value: ClaimInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/reclamos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No pudimos registrar tu reclamo.');
      setCode(data.code);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos registrar tu reclamo.');
    } finally {
      setSubmitting(false);
    }
  }

  if (code) {
    return (
      <div className="rounded-2xl border border-brand-orange/30 bg-orange-50 p-6">
        <h2 className="mb-2 text-xl font-bold text-brand-black">¡Reclamo registrado!</h2>
        <p>Tu código es <strong>{code}</strong>. Te enviamos una constancia a tu correo. Te responderemos en un plazo no mayor a 30 días calendario.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <fieldset className="grid gap-2">
        <legend className="mb-1 font-bold text-brand-black">Tipo</legend>
        <label className="flex items-center gap-2">
          <input type="radio" name="tipo" checked={form.tipo === 'reclamo'} onChange={() => update('tipo', 'reclamo')} />
          Reclamo (disconformidad con un producto o servicio)
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="tipo" checked={form.tipo === 'queja'} onChange={() => update('tipo', 'queja')} />
          Queja (malestar en la atención, no relacionado al producto/servicio)
        </label>
      </fieldset>

      <fieldset className="grid gap-3">
        <legend className="mb-1 font-bold text-brand-black">Datos del consumidor</legend>
        <input required placeholder="Nombre completo" className="rounded-lg border p-3" value={form.nombre} onChange={(e) => update('nombre', e.target.value)} />
        <div className="grid grid-cols-[1fr_2fr] gap-3">
          <select className="rounded-lg border p-3" value={form.tipoDocumento} onChange={(e) => update('tipoDocumento', e.target.value as ClaimInput['tipoDocumento'])}>
            <option value="DNI">DNI</option>
            <option value="CE">Carné de extranjería</option>
            <option value="Pasaporte">Pasaporte</option>
          </select>
          <input required placeholder="Número de documento" className="rounded-lg border p-3" value={form.numeroDocumento} onChange={(e) => update('numeroDocumento', e.target.value)} />
        </div>
        <input required placeholder="Domicilio" className="rounded-lg border p-3" value={form.domicilio} onChange={(e) => update('domicilio', e.target.value)} />
        <input required placeholder="Teléfono" className="rounded-lg border p-3" value={form.telefono} onChange={(e) => update('telefono', e.target.value)} />
        <input required type="email" placeholder="Correo electrónico" className="rounded-lg border p-3" value={form.email} onChange={(e) => update('email', e.target.value)} />
        <input placeholder="Si eres menor de edad: nombre del padre, madre o apoderado (opcional)" className="rounded-lg border p-3" value={form.apoderado} onChange={(e) => update('apoderado', e.target.value)} />
      </fieldset>

      <fieldset className="grid gap-3">
        <legend className="mb-1 font-bold text-brand-black">Bien contratado</legend>
        <div className="grid grid-cols-[1fr_2fr] gap-3">
          <select className="rounded-lg border p-3" value={form.bienTipo} onChange={(e) => update('bienTipo', e.target.value as ClaimInput['bienTipo'])}>
            <option value="producto">Producto</option>
            <option value="servicio">Servicio</option>
          </select>
          <input required placeholder="Descripción (ej. Membresía Fundadores, juguete X)" className="rounded-lg border p-3" value={form.bienDescripcion} onChange={(e) => update('bienDescripcion', e.target.value)} />
        </div>
        <input placeholder="Monto reclamado en soles (opcional)" className="rounded-lg border p-3" value={form.montoReclamado} onChange={(e) => update('montoReclamado', e.target.value)} />
      </fieldset>

      <fieldset className="grid gap-3">
        <legend className="mb-1 font-bold text-brand-black">Detalle</legend>
        <textarea required placeholder="Detalle del reclamo o queja" className="rounded-lg border p-3" rows={4} value={form.detalle} onChange={(e) => update('detalle', e.target.value)} />
        <textarea required placeholder="¿Qué solicitas como solución?" className="rounded-lg border p-3" rows={3} value={form.pedido} onChange={(e) => update('pedido', e.target.value)} />
      </fieldset>

      {error && <p className="font-bold text-red-600">{error}</p>}

      <button type="submit" disabled={submitting} className="justify-self-start rounded-full bg-brand-black px-8 py-3 font-bold text-white disabled:opacity-60">
        {submitting ? 'Enviando…' : 'Enviar reclamo'}
      </button>
    </form>
  );
}
