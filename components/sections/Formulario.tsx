'use client';
import { FormEvent, useState } from 'react';
import { content } from '@/lib/content';
import { buildFormMessage, buildWhatsAppLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';

export interface FormularioState {
  nombre: string;
  whatsapp: string;
  rangoEdad: string;
  preferencias: string[];
  autorizado: boolean;
}

const INITIAL_STATE: FormularioState = {
  nombre: '',
  whatsapp: '',
  rangoEdad: '',
  preferencias: [],
  autorizado: false,
};

export function isFormValid(state: FormularioState): boolean {
  return state.nombre.trim().length > 0 && state.whatsapp.trim().length > 0 && state.autorizado;
}

export function Formulario() {
  const [state, setState] = useState<FormularioState>(INITIAL_STATE);

  function togglePreferencia(pref: string) {
    setState((prev) => ({
      ...prev,
      preferencias: prev.preferencias.includes(pref)
        ? prev.preferencias.filter((p) => p !== pref)
        : [...prev.preferencias, pref],
    }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isFormValid(state)) return;

    trackEvent('Lead', { origen: 'formulario' });
    trackEvent('SubmitApplication', { origen: 'formulario' });

    const message = buildFormMessage({
      nombre: state.nombre,
      whatsapp: state.whatsapp,
      rangoEdad: state.rangoEdad || undefined,
      preferencias: state.preferencias,
    });

    window.open(buildWhatsAppLink(message), '_blank', 'noopener,noreferrer');
    setState(INITIAL_STATE);
  }

  return (
    <section id="formulario" className="bg-gray-50 px-4 py-16">
      <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-md">
        <h2 className="text-2xl font-bold text-brand-black">{content.formulario.titulo}</h2>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="nombre">
            {content.formulario.campos.nombre}
          </label>
          <input
            id="nombre"
            type="text"
            required
            value={state.nombre}
            onChange={(e) => setState((prev) => ({ ...prev, nombre: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="whatsapp">
            {content.formulario.campos.whatsapp}
          </label>
          <input
            id="whatsapp"
            type="tel"
            required
            value={state.whatsapp}
            onChange={(e) => setState((prev) => ({ ...prev, whatsapp: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="rangoEdad">
            {content.formulario.rangoEdadLabel}
          </label>
          <select
            id="rangoEdad"
            value={state.rangoEdad}
            onChange={(e) => setState((prev) => ({ ...prev, rangoEdad: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          >
            <option value="">Selecciona una opción</option>
            {content.formulario.rangoEdad.map((rango) => (
              <option key={rango} value={rango}>
                {rango}
              </option>
            ))}
          </select>
        </div>
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-gray-700">{content.formulario.preferenciasLabel}</legend>
          <div className="grid grid-cols-2 gap-2">
            {content.formulario.preferencias.map((pref) => (
              <label key={pref} className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={state.preferencias.includes(pref)} onChange={() => togglePreferencia(pref)} />
                {pref}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="flex items-start gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            required
            checked={state.autorizado}
            onChange={(e) => setState((prev) => ({ ...prev, autorizado: e.target.checked }))}
          />
          {content.formulario.autorizacion}
        </label>
        <a href="/privacidad" className="block text-sm text-brand-black underline">
          {content.formulario.linkPrivacidad}
        </a>
        <Button type="submit">{content.formulario.boton}</Button>
      </form>
    </section>
  );
}
