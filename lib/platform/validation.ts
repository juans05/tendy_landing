export function uuid(value: unknown): value is string { return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value); }
const text = (value: unknown, max: number, required = true) => {
  if (typeof value !== 'string' || value.trim().length > max || (required && !value.trim())) throw new Error('Revisa los textos obligatorios.');
  return value.trim();
};
const numeric = (value: unknown) => {
  if (value === null || value === '') return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0 || n > 1000000) throw new Error('Revisa los precios y cantidades.');
  return n;
};
export function validateAdminItem(kind: string, input: Record<string, unknown>) {
  if (kind === 'products') {
    const price = numeric(input.price), member = numeric(input.member_price), stock = numeric(input.stock);
    if ((price !== null && price <= 0) || (member !== null && (price === null || member <= 0 || member > price)) || (stock !== null && !Number.isInteger(stock))) throw new Error('El precio socio debe ser positivo y no superar al regular. El stock debe ser entero.');
    const image = text(input.image_url || '', 1000, false);
    const local = /^\/images\/[a-zA-Z0-9._-]+\.(webp|png|jpg|jpeg)$/.test(image);
    const base = process.env.SUPABASE_URL;
    if (image && !local && !(base && image.startsWith(`${base}/storage/v1/object/public/catalog/`) && !image.includes('..'))) throw new Error('Sube la foto usando el botón del formulario.');
    if (input.published === true && (!image || price === null || stock === null)) throw new Error('Antes de publicar, completa foto, precio regular y stock.');
    return { name: text(input.name,120), category: text(input.category,60), description: text(input.description,600), age: text(input.age,100), image_url: image || null, price, member_price: member, stock, published: input.published === true, featured: input.featured === true };
  }
  if (kind === 'campaigns') {
    const start = new Date(String(input.starts_at)), end = new Date(String(input.ends_at));
    if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) throw new Error('Revisa las fechas de la campaña.');
    return { title: text(input.title,120), description: text(input.description,600), conditions: text(input.conditions,2000), starts_at: start.toISOString(), ends_at: end.toISOString(), published: input.published === true };
  }
  if (kind === 'orders') {
    if (!uuid(input.user_id) || !['confirmado','preparando','enviado','entregado','cancelado'].includes(String(input.status))) throw new Error('Selecciona un socio y un estado válido.');
    const total = numeric(input.total);
    if (total === null) throw new Error('Ingresa el total del pedido.');
    return { user_id: input.user_id, description: text(input.description,600), total, status: input.status };
  }
  throw new Error('Tipo de registro inválido.');
}
