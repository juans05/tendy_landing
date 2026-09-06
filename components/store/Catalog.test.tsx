import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Catalog } from './Catalog';
describe('Catalog', () => {
 it('filters categories and restores all ideas', async () => {
  render(<Catalog />);
  expect(screen.getAllByRole('article')).toHaveLength(4);
  await userEvent.click(screen.getByRole('button', { name: 'Vehículos' }));
  expect(screen.getAllByRole('article')).toHaveLength(2);
  expect(screen.queryByText('Un mundo de colores')).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /Todos los juguetes/ }));
  expect(screen.getAllByRole('article')).toHaveLength(4);
 });
 it('does not send visitors to a placeholder WhatsApp number', async () => {
  render(<Catalog />);
  await userEvent.click(screen.getAllByRole('link', { name: /Consultar modelos/ })[0]);
  expect(screen.getByRole('status')).toHaveTextContent('disponible pronto');
 });
});
