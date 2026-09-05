import { beforeEach, describe, expect, it } from 'vitest';
import { captureUtmParams, getUtmParams } from './utm';

describe('utm capture', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('extracts known utm params from a query string', () => {
    const found = captureUtmParams('?utm_source=facebook&utm_medium=cpc&other=1');
    expect(found).toEqual({ utm_source: 'facebook', utm_medium: 'cpc' });
  });

  it('ignores unrelated query params', () => {
    const found = captureUtmParams('?foo=bar');
    expect(found).toEqual({});
  });

  it('persists captured params for later retrieval', () => {
    captureUtmParams('?utm_source=instagram&utm_campaign=lanzamiento');
    expect(getUtmParams()).toEqual({ utm_source: 'instagram', utm_campaign: 'lanzamiento' });
  });

  it('returns an empty object when nothing was captured', () => {
    expect(getUtmParams()).toEqual({});
  });
});
