import { describe, expect, it } from 'vitest';
import { club } from './club';
import { monthlyPlan } from './platform/types';
describe('club offer', () => {
  it('uses one monthly price across the public offer and billing', () => {
    expect(Number(club.price)).toBe(monthlyPlan.price);
    expect(club.steps.map(s=>s.text).join(' ')).toContain('Mi Club');
    expect(club.faqs.find(f=>f.question.includes('Cuánto'))?.answer).not.toContain('anual');
  });
});
