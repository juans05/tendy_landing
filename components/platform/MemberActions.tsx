'use client';
import { useState } from 'react';
export function MemberActions({ canCancel, canSync }: { canCancel: boolean; canSync: boolean }) {
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState('');
  async function action(kind: string) {
    setBusy(true); setMessage('');
    try {
      const response = await fetch(kind === 'logout' ? '/api/auth' : '/api/membership', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: kind, confirmed: kind === 'cancel' }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      if (kind === 'logout') window.location.assign('/'); else window.location.assign(`/mi-club?estado=${kind === 'cancel' ? 'cancelada' : 'actualizado'}`);
    } catch (err) { setMessage(err instanceof Error ? err.message : 'Inténtalo de nuevo.'); }
    finally { setBusy(false); }
  }
  return <div className="member-actions">{canSync && <button className="button button-small" disabled={busy} onClick={() => action('sync')}>{busy ? 'Actualizando…' : 'Actualizar mi estado ↻'}</button>}{canCancel && <button className="text-link" disabled={busy} onClick={() => setConfirm(true)}>Detener renovación</button>}<button className="text-link" disabled={busy} onClick={() => action('logout')}>Cerrar sesión</button>
    {confirm && <div className="cancel-box" role="group" aria-label="Confirmar cancelación"><h3>¿Detener los próximos cobros?</h3><p>Conservas el acceso hasta que termine tu periodo pagado. Esta acción no solicita un reembolso.</p><button className="button button-small" disabled={busy} onClick={() => action('cancel')}>Sí, detener renovación</button><button className="text-link" disabled={busy} onClick={() => setConfirm(false)}>Conservar membresía</button></div>}
    {message && <p role="alert" className="form-error">{message}</p>}</div>;
}
