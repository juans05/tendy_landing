import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pricing } from './Pricing';
import { trackEvent } from '@/lib/analytics';
import { content } from '@/lib/content';

vi.mock('@/lib/analytics', () => ({ trackEvent: vi.fn() }));

describe('Pricing', () => {
  beforeEach(() => {
    vi.mocked(trackEvent).mockClear();
  });

  it('shows all four plan prices', () => {
    render(<Pricing />);
    content.pricing.planes.forEach((plan) => {
      expect(screen.getByText(plan.precio)).toBeInTheDocument();
    });
  });

  it('marks the annual plan as recommended', () => {
    render(<Pricing />);
    expect(screen.getByText('Recomendado por Tendy ✦')).toBeInTheDocument();
  });

  it('fires MembershipInterest with the plan id when a CTA is clicked', async () => {
    render(<Pricing />);
    const ctas = screen.getAllByRole('link', { name: content.pricing.cta });
    expect(ctas).toHaveLength(4);
    await userEvent.click(ctas[3]);
    expect(trackEvent).toHaveBeenCalledWith('MembershipInterest', { origen: 'pricing_cta', plan: 'anual' });
  });

  it('shows the no-permanence and free-cancellation copy', () => {
    render(<Pricing />);
    expect(screen.getByText(content.pricing.sinPermanencia)).toBeInTheDocument();
    expect(screen.getByText(content.pricing.cancelacion)).toBeInTheDocument();
  });
});
