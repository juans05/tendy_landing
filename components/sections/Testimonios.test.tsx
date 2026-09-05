import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Testimonios } from './Testimonios';

describe('Testimonios', () => {
  it('shows the placeholder when not visible', () => {
    render(<Testimonios visible={false} placeholder="Pronto conocerás experiencias..." />);
    expect(screen.getByText('Pronto conocerás experiencias...')).toBeInTheDocument();
  });

  it('shows real testimonials when visible with items', () => {
    render(<Testimonios visible items={[{ nombre: 'Ana', texto: 'Excelente club' }]} />);
    expect(screen.getByText('Excelente club', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Ana')).toBeInTheDocument();
  });
});
