import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StickyHeader } from './StickyHeader';

describe('StickyHeader', () => {
  it('does not duplicate nav links before the mobile menu opens', () => {
    render(<StickyHeader />);
    expect(screen.getAllByText('Beneficios')).toHaveLength(1);
    expect(screen.getByLabelText('Abrir menú')).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens the mobile menu when the hamburger button is clicked', async () => {
    render(<StickyHeader />);
    await userEvent.click(screen.getByLabelText('Abrir menú'));
    expect(screen.getAllByText('Beneficios')).toHaveLength(2);
    expect(screen.getByLabelText('Abrir menú')).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes the mobile menu on a second click', async () => {
    render(<StickyHeader />);
    const button = screen.getByLabelText('Abrir menú');
    await userEvent.click(button);
    await userEvent.click(button);
    expect(screen.getAllByText('Beneficios')).toHaveLength(1);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});
