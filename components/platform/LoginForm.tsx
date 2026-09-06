'use client';
import { useState } from 'react';
export function LoginForm({ available, destination }: { available: boolean; destination: string }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const response = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: sent ? 'verify' : 'send', email, code, accepted }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      if (sent) window.location.assign(destination); else setSent(true);
    } catch (err) { setError(err instanceof Error ? err.message : 'No pudimos conectar. Inténtalo de nuevo.'); }
    finally { setBusy(false); }
  }
  return <form className="platform-form" onSubmit={submit}>
    {!available && <p className="notice-box" role="status">El acceso al Club estará disponible pronto. Puedes explorar los juguetes mientras terminamos la apertura.</p>}
    <label>Tu correo electrónico<input type="email" autoComplete="email" required maxLength={254} value={email} readOnly={sent} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.com" /></label>
    {sent ? <><p className="muted">Revisa tu correo e ingresa el código. También revisa la carpeta de spam.</p><label>Código de acceso<input autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6,8}" required value={code} onChange={e => setCode(e.target.value)} placeholder="Código recibido" /></label><button type="button" className="text-link" disabled={busy} onClick={() => { setSent(false); setCode(''); }}>Cambiar correo o solicitar otro código</button></> : <label className="check-label"><input type="checkbox" required checked={accepted} onChange={e => setAccepted(e.target.checked)} /><span>Soy mayor de edad y acepto los <a href="/terminos">términos</a> y la <a href="/privacidad">política de privacidad</a>. Crear una cuenta no activa ningún cobro.</span></label>}
    {error && <p role="alert" className="form-error">{error}</p>}
    <button className="button" disabled={!available || busy}>{busy ? 'Un momento…' : sent ? 'Entrar a mi Club ↗' : 'Recibir código de acceso ↗'}</button>
    <p className="form-hint">Sin contraseñas que recordar. No solicitamos datos personales de tus hijos.</p>
  </form>;
}
