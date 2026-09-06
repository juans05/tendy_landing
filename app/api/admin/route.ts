import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { currentUser, isAdmin, sameOrigin, supabase } from '@/lib/platform/server';
import { uuid, validateAdminItem } from '@/lib/platform/validation';
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Origen inválido.' }, { status: 403 });
  const user = await currentUser();
  if (!user || !(await isAdmin(user.id))) return NextResponse.json({ error: 'Acceso solo para administradores.' }, { status: 403 });
  const data = await request.json().catch(() => null);
  if (!data || !['products','campaigns','orders'].includes(data.kind) || (data.id && !uuid(data.id))) return NextResponse.json({ error: 'Registro inválido.' }, { status: 400 });
  let item;
  try { item = validateAdminItem(data.kind, data.item || {}); }
  catch (err) { return NextResponse.json({ error: err instanceof Error ? err.message : 'Revisa los datos.' }, { status: 400 }); }
  try {
    const result = await supabase(`/rest/v1/${data.kind}${data.id ? `?id=eq.${data.id}` : ''}`, { method: data.id ? 'PATCH' : 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(item) });
    revalidatePath('/'); revalidatePath('/catalogo');
    return NextResponse.json({ ok: true, result });
  } catch { return NextResponse.json({ error: 'No se pudo guardar el registro. Comprueba la conexión e inténtalo de nuevo.' }, { status: 502 }); }
}
