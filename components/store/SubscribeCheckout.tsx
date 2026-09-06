'use client';
import { useEffect, useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { PLANS } from '@/lib/mercadopago';

export function SubscribeCheckout() {
  const [annual, setAnnual] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const plan = annual ? 'annual' : 'monthly';
  const config = PLANS[plan];

  useEffect(() => {
    const message = new URLSearchParams(window.location.search).get('checkout_error');
    if (message) setError(message);
  }, []);

  return (
    <article className="membership-card checkout-card">
      <div className="plan-ribbon">✦ PAGO EN LÍNEA</div>
      <div className="plan-card-inner">
        <h3>Activa tu membresía con MercadoPago</h3>
        <label className="plan-switch">
          <input type="checkbox" checked={annual} onChange={(event) => setAnnual(event.target.checked)} />
          Pagar anual <span className="mini-tag">Ahorra S/ {PLANS.annual.savings?.toFixed(2)}</span>
        </label>
        <div className="plan-price"><span>S/</span><strong>{config.price.toFixed(2)}</strong><span>/ {plan === 'monthly' ? 'mes' : 'año'}</span></div>
        {error && <p className="checkout-error" role="alert">{error}</p>}
        <form method="POST" action="/api/mercadopago/subscribe" onSubmit={() => trackEvent('MembershipInterest', { ubicacion: 'checkout_mp', plan, value: config.price, currency: 'PEN' })}>
          <input type="hidden" name="plan" value={plan} />
          <label className="checkout-email">Correo para tu suscripción
            <input type="email" name="email" required placeholder="tu@correo.com" />
          </label>
          <button type="submit" className="button">Pagar con MercadoPago <span>↗</span></button>
        </form>
        <p className="plan-footnote">Pago seguro procesado por MercadoPago. Se cobra {plan === 'monthly' ? 'cada mes' : 'cada año'} de forma automática; puedes cancelar cuando quieras desde tu cuenta MercadoPago.</p>
      </div>
    </article>
  );
}
