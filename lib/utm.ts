const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

type UtmKey = (typeof UTM_KEYS)[number];

export type UtmParams = Partial<Record<UtmKey, string>>;

const STORAGE_KEY = 'tendy_utm_params';

export function captureUtmParams(search: string): UtmParams {
  const params = new URLSearchParams(search);
  const found: UtmParams = {};

  UTM_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) found[key] = value;
  });

  if (Object.keys(found).length > 0 && typeof window !== 'undefined') {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found));
  }

  return found;
}

export function getUtmParams(): UtmParams {
  if (typeof window === 'undefined') return {};

  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return {};

  try {
    return JSON.parse(raw) as UtmParams;
  } catch {
    return {};
  }
}
