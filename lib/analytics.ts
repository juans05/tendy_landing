import { getUtmParams } from './utm';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type AnalyticsEvent = 'ViewContent' | 'ClickWhatsApp' | 'Lead' | 'SubmitApplication' | 'MembershipInterest';

export function trackEvent(name: AnalyticsEvent, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;

  const payload = { ...params, ...getUtmParams() };

  if (typeof window.gtag === 'function') {
    window.gtag('event', name, payload);
  }

  if (typeof window.fbq === 'function') {
    window.fbq('trackCustom', name, payload);
  }
}

export function shouldLoadGTM(id?: string): boolean {
  return Boolean(id && id.trim().length > 0);
}

export function shouldLoadGA(id?: string): boolean {
  return Boolean(id && id.trim().length > 0);
}

export function shouldLoadPixel(id?: string): boolean {
  return Boolean(id && id.trim().length > 0);
}
