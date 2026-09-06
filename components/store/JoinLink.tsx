'use client';
import { trackEvent } from '@/lib/analytics';
import { PLANS } from '@/lib/mercadopago';

export function JoinLink({ location, children = 'Quiero ser fundador', className = 'button' }: { location: string; children?: React.ReactNode; className?: string }) {
  return (
    <a
      href="/unirme"
      className={className}
      onClick={() => trackEvent('MembershipInterest', { ubicacion: location, plan: 'fundadores', value: PLANS.monthly.price, currency: 'PEN' })}
    >
      {children}
    </a>
  );
}
