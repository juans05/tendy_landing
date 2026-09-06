import { getUtmParams } from './utm';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type AnalyticsEvent = 'ViewContent' | 'ClickWhatsApp' | 'Lead' | 'SubmitApplication' | 'MembershipInterest' | 'select_category';

export function trackEvent(name: AnalyticsEvent, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;

  const configured = process.env.NEXT_PUBLIC_GTM_ID || process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (configured) {
    try { if (window.localStorage.getItem('tendy_consent') !== 'accepted') return; } catch { return; }
  }
  const payload = { ...params, ...getUtmParams() };

  if (process.env.NEXT_PUBLIC_GTM_ID) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ...payload, event: name });
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', name, payload);
  }

  if (typeof window.fbq === 'function') {
    window.fbq('trackCustom', name, payload);
  }
}

export function shouldLoadGTM(id?: string): boolean {
  return Boolean(id && /^GTM-[A-Z0-9]+$/.test(id));
}

export function shouldLoadGA(id?: string): boolean {
  return Boolean(id && /^G-[A-Z0-9]+$/.test(id));
}

export function shouldLoadPixel(id?: string): boolean {
  return Boolean(id && /^\d+$/.test(id));
}
