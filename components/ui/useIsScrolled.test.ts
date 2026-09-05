import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useIsScrolled } from './useIsScrolled';

function scrollTo(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
  window.dispatchEvent(new Event('scroll'));
}

describe('useIsScrolled', () => {
  it('is false before any scrolling', () => {
    const { result } = renderHook(() => useIsScrolled(10));
    expect(result.current).toBe(false);
  });

  it('becomes true once scrollY passes the threshold', () => {
    const { result } = renderHook(() => useIsScrolled(10));
    act(() => scrollTo(50));
    expect(result.current).toBe(true);
  });

  it('goes back to false when scrolled back up', () => {
    const { result } = renderHook(() => useIsScrolled(10));
    act(() => scrollTo(50));
    act(() => scrollTo(0));
    expect(result.current).toBe(false);
  });
});
