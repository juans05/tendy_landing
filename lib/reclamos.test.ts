import { describe, expect, it } from 'vitest';
import { buildClaimCode, formatClaim, isValidClaim, type ClaimInput } from './reclamos';

const baseClaim: ClaimInput = {
  tipo: 'reclamo',
  nombre: 'Ana Torres',
  tipoDocumento: 'DNI',
  numeroDocumento: '12345678',
  domicilio: 'Av. Siempre Viva 123, Lima',
  telefono: '987654321',
  email: 'ana@example.com',
  bienTipo: 'producto',
  bienDescripcion: 'Membresía Fundadores',
  detalle: 'El cobro se duplicó este mes.',
  pedido: 'Reembolso del cobro duplicado.',
};

describe('buildClaimCode', () => {
  it('encodes the date and a random suffix', () => {
    const code = buildClaimCode(new Date('2026-09-06T10:00:00'));
    expect(code).toMatch(/^TENDY-20260906-\d{4}$/);
  });
});

describe('isValidClaim', () => {
  it('accepts a fully filled claim', () => {
    expect(isValidClaim(baseClaim)).toBe(true);
  });

  it('rejects a missing required field', () => {
    const { detalle, ...rest } = baseClaim;
    expect(isValidClaim(rest)).toBe(false);
  });

  it('rejects an invalid email', () => {
    expect(isValidClaim({ ...baseClaim, email: 'no-es-un-correo' })).toBe(false);
  });

  it('rejects an invalid tipo', () => {
    expect(isValidClaim({ ...baseClaim, tipo: 'sugerencia' })).toBe(false);
  });
});

describe('formatClaim', () => {
  it('includes the required fields and omits optional ones when absent', () => {
    const text = formatClaim(baseClaim, 'TENDY-20260906-1234', new Date('2026-09-06T10:00:00'));
    expect(text).toContain('Nombre: Ana Torres');
    expect(text).toContain('Documento: DNI 12345678');
    expect(text).not.toContain('Padre/madre/apoderado');
    expect(text).not.toContain('Monto reclamado');
  });

  it('includes the guardian and claimed amount when provided', () => {
    const text = formatClaim({ ...baseClaim, apoderado: 'Luis Torres', montoReclamado: '14.90' }, 'TENDY-20260906-1234', new Date('2026-09-06T10:00:00'));
    expect(text).toContain('Padre/madre/apoderado: Luis Torres');
    expect(text).toContain('Monto reclamado: S/ 14.90');
  });
});
