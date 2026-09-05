import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Hero } from './Hero';
import { trackEvent } from '@/lib/analytics';

vi.mock('@/lib/analytics', () => ({ trackEvent: vi.fn() }));

describe('Hero', () => {
  beforeEach(() => {
    vi.mocked(trackEvent).mockClear();
  });

  it('fires ViewContent on mount', () => {
    render(<Hero />);
    expect(trackEvent).toHaveBeenCalledWith('ViewContent', { seccion: 'hero' });
  });

  it('shows the founder price and no-permanence copy', () => {
    render(<Hero />);
    expect(screen.getByText('S/14.90 / mes')).toBeInTheDocument();
    expect(screen.getByText('Sin permanencia durante el piloto.')).toBeInTheDocument();
  });

  it('fires MembershipInterest and links to WhatsApp when the main CTA is clicked', async () => {
    render(<Hero />);
    const cta = screen.getByRole('link', { name: 'QUIERO SER MIEMBRO' });
    expect(cta).toHaveAttribute('href', expect.stringContaining('https://wa.me/'));
    await userEvent.click(cta);
    expect(trackEvent).toHaveBeenCalledWith('MembershipInterest', { origen: 'hero_cta_principal' });
  });
});
