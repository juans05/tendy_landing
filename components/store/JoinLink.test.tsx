import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { JoinLink } from './JoinLink';
import { trackEvent } from '@/lib/analytics';
vi.mock('@/lib/analytics', () => ({ trackEvent: vi.fn() }));
describe('JoinLink', () => {
  it('links to checkout and tracks membership interest, not a purchase', async () => {
    render(<JoinLink location="plan" />);
    const link = screen.getByRole('link', { name: 'Quiero ser fundador' });
    expect(link.getAttribute('href')).toBe('/unirme');
    link.addEventListener('click', event => event.preventDefault());
    await userEvent.click(link);
    expect(trackEvent).toHaveBeenCalledWith('MembershipInterest', { ubicacion: 'plan', plan: 'fundadores', value: 14.9, currency: 'PEN' });
  });
});

