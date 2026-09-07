import { sendEmail } from './email';

export interface ClaimInput {
  tipo: 'reclamo' | 'queja';
  nombre: string;
  tipoDocumento: 'DNI' | 'CE' | 'Pasaporte';
  numeroDocumento: string;
  domicilio: string;
  telefono: string;
  email: string;
  apoderado?: string;
  bienTipo: 'producto' | 'servicio';
  bienDescripcion: string;
  montoReclamado?: string;
  detalle: string;
  pedido: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidClaim(data: unknown): data is ClaimInput {
  if (!data || typeof data !== 'object') return false;
  const c = data as Record<string, unknown>;
  const required: (keyof ClaimInput)[] = ['nombre', 'numeroDocumento', 'domicilio', 'telefono', 'email', 'bienDescripcion', 'detalle', 'pedido'];
  if (!required.every((key) => typeof c[key] === 'string' && (c[key] as string).trim().length > 0)) return false;
  if (c.tipo !== 'reclamo' && c.tipo !== 'queja') return false;
  if (c.tipoDocumento !== 'DNI' && c.tipoDocumento !== 'CE' && c.tipoDocumento !== 'Pasaporte') return false;
  if (c.bienTipo !== 'producto' && c.bienTipo !== 'servicio') return false;
  return EMAIL_RE.test(c.email as string);
}

export function buildClaimCode(date = new Date()): string {
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TENDY-${stamp}-${random}`;
}

export function formatClaim(input: ClaimInput, code: string, date: Date): string {
  const lines = [
    'Libro de Reclamaciones — Tendy Perú',
    `Código: ${code}`,
    `Fecha: ${date.toLocaleString('es-PE')}`,
    `Tipo: ${input.tipo === 'reclamo' ? 'Reclamo' : 'Queja'}`,
    '',
    'Datos del consumidor',
    `Nombre: ${input.nombre}`,
    `Documento: ${input.tipoDocumento} ${input.numeroDocumento}`,
    `Domicilio: ${input.domicilio}`,
    `Teléfono: ${input.telefono}`,
    `Correo: ${input.email}`,
  ];

  if (input.apoderado) lines.push(`Padre/madre/apoderado: ${input.apoderado}`);

  lines.push(
    '',
    'Bien contratado',
    `Tipo: ${input.bienTipo === 'producto' ? 'Producto' : 'Servicio'}`,
    `Descripción: ${input.bienDescripcion}`,
  );

  if (input.montoReclamado) lines.push(`Monto reclamado: S/ ${input.montoReclamado}`);

  lines.push('', 'Detalle', input.detalle, '', 'Pedido del consumidor', input.pedido);

  return lines.join('\n');
}

export async function submitClaim(input: ClaimInput): Promise<{ code: string }> {
  const businessEmail = process.env.RECLAMOS_EMAIL;
  if (!businessEmail) throw new Error('RECLAMOS_EMAIL no configurado');

  const code = buildClaimCode();
  const date = new Date();
  const body = formatClaim(input, code, date);

  await sendEmail(businessEmail, `Nuevo ${input.tipo} — ${code}`, body);
  await sendEmail(
    input.email,
    `Confirmación de tu ${input.tipo} — ${code}`,
    `Hemos recibido tu ${input.tipo} en el Libro de Reclamaciones de Tendy Perú.\n\nCódigo: ${code}\nTe responderemos en un plazo no mayor a 30 días calendario.\n\n${body}`,
  );

  return { code };
}
