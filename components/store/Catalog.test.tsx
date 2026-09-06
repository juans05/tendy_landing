import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Catalog } from './Catalog';
import type { Product } from '@/lib/platform/types';
const base = { description:'Descripción del juguete',image_url:null,price:60,member_price:50,age:'6 años',stock:2,published:true,featured:false };
const products:Product[] = [{...base,id:'a',name:'Guantes',category:'Aventura'}, {...base,id:'b',name:'Máquina',category:'Diversión',price:null,member_price:null}];
describe('Catalog', () => {
 it('filters and searches products without making up prices', async () => {
  render(<Catalog products={products}/>);
  expect(screen.getAllByRole('article')).toHaveLength(2);
  expect(screen.getByText('S/ 60.00')).toBeInTheDocument();
  expect(screen.getByText('S/ 50.00')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button',{name:'Aventura'}));
  expect(screen.getAllByRole('article')).toHaveLength(1);
  await userEvent.click(screen.getByRole('button',{name:'✳ Todos'}));
  await userEvent.type(screen.getByRole('searchbox'),'Máquina');
  expect(screen.getAllByRole('article')).toHaveLength(1);
  expect(screen.getByText('Consulta el precio y la disponibilidad')).toBeInTheDocument();
 });
 it('shows an empty state for unknown searches', async () => {
  render(<Catalog products={products}/>);
  await userEvent.type(screen.getByRole('searchbox'),'inexistente');
  expect(screen.getByText('No encontramos ese juguete.')).toBeInTheDocument();
 });
 it('does not send visitors to a placeholder WhatsApp number', async () => {
  render(<Catalog products={products}/>);
  await userEvent.click(screen.getAllByRole('link',{name:/Consultar producto/})[0]);
  expect(screen.getByRole('status')).toHaveTextContent('disponible pronto');
 });
});
