import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion } from './Accordion';

const ITEMS = [
  { question: '¿Uno?', answer: 'Respuesta uno' },
  { question: '¿Dos?', answer: 'Respuesta dos' },
];

describe('Accordion', () => {
  it('starts with every answer collapsed', () => {
    render(<Accordion items={ITEMS} />);
    expect(screen.queryByText('Respuesta uno')).not.toBeInTheDocument();
    expect(screen.queryByText('Respuesta dos')).not.toBeInTheDocument();
  });

  it('opens an answer when its question is clicked', async () => {
    render(<Accordion items={ITEMS} />);
    await userEvent.click(screen.getByText('¿Uno?'));
    expect(screen.getByText('Respuesta uno')).toBeInTheDocument();
  });

  it('closes the answer when clicked again', async () => {
    render(<Accordion items={ITEMS} />);
    await userEvent.click(screen.getByText('¿Uno?'));
    await userEvent.click(screen.getByText('¿Uno?'));
    expect(screen.queryByText('Respuesta uno')).not.toBeInTheDocument();
  });

  it('only keeps one answer open at a time', async () => {
    render(<Accordion items={ITEMS} />);
    await userEvent.click(screen.getByText('¿Uno?'));
    await userEvent.click(screen.getByText('¿Dos?'));
    expect(screen.queryByText('Respuesta uno')).not.toBeInTheDocument();
    expect(screen.getByText('Respuesta dos')).toBeInTheDocument();
  });
});
