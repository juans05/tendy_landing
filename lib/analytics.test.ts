import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { shouldLoadGA, shouldLoadGTM, shouldLoadPixel, trackEvent } from './analytics';

describe('trackEvent', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    window.gtag = vi.fn();
    window.fbq = vi.fn();
  });

  afterEach(() => {
    delete window.gtag;
    delete window.fbq;
  });

  it('forwards the event to gtag and fbq when both are present', () => {
    trackEvent('ClickWhatsApp', { ubicacion: 'hero' });
    expect(window.gtag).toHaveBeenCalledWith('event', 'ClickWhatsApp', expect.objectContaining({ ubicacion: 'hero' }));
    expect(window.fbq).toHaveBeenCalledWith('trackCustom', 'ClickWhatsApp', expect.objectContaining({ ubicacion: 'hero' }));
  });

  it('does not throw when gtag/fbq are missing', () => {
    delete window.gtag;
    delete window.fbq;
    expect(() => trackEvent('ViewContent')).not.toThrow();
  });
});

describe('shouldLoad* helpers', () => {
  it('treats undefined or empty strings as disabled', () => {
    expect(shouldLoadGTM(undefined)).toBe(false);
    expect(shouldLoadGA('')).toBe(false);
    expect(shouldLoadPixel('   ')).toBe(false);
  });

  it('treats a non-empty id as enabled', () => {
    expect(shouldLoadGTM('GTM-ABC123')).toBe(true);
    expect(shouldLoadGA('G-ABC123')).toBe(true);
    expect(shouldLoadPixel('123456')).toBe(true);
  });
});
