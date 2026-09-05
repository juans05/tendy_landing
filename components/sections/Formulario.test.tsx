import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Formulario } from './Formulario';
import { trackEvent } from '@/lib/analytics';

vi.mock('@/lib/analytics', () => ({ trackEvent: vi.fn() }));

describe('Formulario', () => {
  beforeEach(() => {
    vi.mocked(trackEvent).mockClear();
    window.open = vi.fn();
  });

  it('does not submit when required fields are missing', async () => {
    render(<Formulario />);
    await userEvent.click(screen.getByRole('button', { name: 'QUIERO INFORMACIÓN' }));
    expect(trackEvent).not.toHaveBeenCalled();
    expect(window.open).not.toHaveBeenCalled();
  });

  it('does not submit when the authorization checkbox is unchecked', async () => {
    render(<Formulario />);
    await userEvent.type(screen.getByLabelText('Nombre'), 'Ana');
    await userEvent.type(screen.getByLabelText('WhatsApp'), '987654321');
    await userEvent.click(screen.getByRole('button', { name: 'QUIERO INFORMACIÓN' }));
    expect(trackEvent).not.toHaveBeenCalled();
  });

  it('submits to WhatsApp and fires Lead + SubmitApplication when valid', async () => {
    render(<Formulario />);
    await userEvent.type(screen.getByLabelText('Nombre'), 'Ana');
    await userEvent.type(screen.getByLabelText('WhatsApp'), '987654321');
    await userEvent.click(screen.getByLabelText(/Autorizo que me contacten/));
    await userEvent.click(screen.getByRole('button', { name: 'QUIERO INFORMACIÓN' }));

    expect(trackEvent).toHaveBeenCalledWith('Lead', { origen: 'formulario' });
    expect(trackEvent).toHaveBeenCalledWith('SubmitApplication', { origen: 'formulario' });
    expect(window.open).toHaveBeenCalledWith(expect.stringContaining('https://wa.me/'), '_blank', 'noopener,noreferrer');
  });
});
