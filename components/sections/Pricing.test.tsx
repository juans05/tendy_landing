import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pricing } from './Pricing';
import { trackEvent } from '@/lib/analytics';

vi.mock('@/lib/analytics', () => ({ trackEvent: vi.fn() }));

describe('Pricing', () => {
  beforeEach(() => {
    vi.mocked(trackEvent).mockClear();
  });

  it('shows the founder price', () => {
    render(<Pricing />);
    expect(screen.getByText('S/ 14.90')).toBeInTheDocument();
  });

  it('fires MembershipInterest when the CTA is clicked', async () => {
    render(<Pricing />);
    await userEvent.click(screen.getByRole('link', { name: 'QUIERO UNIRME' }));
    expect(trackEvent).toHaveBeenCalledWith('MembershipInterest', { origen: 'pricing_cta' });
  });

  it('shows the no-permanence and free-cancellation copy', () => {
    render(<Pricing />);
    expect(screen.getByText('Sin permanencia durante el piloto.')).toBeInTheDocument();
    expect(screen.getByText('Puedes solicitar la cancelación de tu membresía cuando quieras.')).toBeInTheDocument();
  });
});
