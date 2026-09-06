import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { JoinLink } from './JoinLink';
import { trackEvent } from '@/lib/analytics';
vi.mock('@/lib/analytics', () => ({ trackEvent: vi.fn() }));
describe('membership contact', () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.clearAllMocks(); });
  it('includes the plan in the message and tracks membership interest, not a purchase', async () => {
    vi.stubEnv('NEXT_PUBLIC_WHATSAPP_NUMBER', '51912345678');
    render(<JoinLink location="plan" />);
    const link = screen.getByRole('link', { name: 'Quiero ser fundador' });
    expect(decodeURIComponent(link.getAttribute('href')!)).toContain('S/ 14.90');
    await userEvent.click(link);
    expect(trackEvent).toHaveBeenCalledWith('MembershipInterest', { ubicacion: 'plan', plan: 'fundadores', value: 14.9, currency: 'PEN' });
    expect(trackEvent).toHaveBeenCalledWith('ClickWhatsApp', { ubicacion: 'plan' });
  });
  it('does not report a lead when the business number is missing', async () => {
    vi.stubEnv('NEXT_PUBLIC_WHATSAPP_NUMBER', '');
    render(<JoinLink location="hero" />);
    await userEvent.click(screen.getByRole('link', { name: 'Quiero ser fundador' }));
    expect(screen.getByRole('status')).toHaveTextContent('disponible pronto');
    expect(trackEvent).not.toHaveBeenCalled();
  });
});
