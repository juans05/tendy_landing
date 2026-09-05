import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { WhatsAppFloatButton } from './WhatsAppFloatButton';

describe('WhatsAppFloatButton', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('is not rendered immediately', () => {
    render(<WhatsAppFloatButton />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('appears after the configured delay', () => {
    render(<WhatsAppFloatButton />);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByRole('link')).toBeInTheDocument();
  });
});
