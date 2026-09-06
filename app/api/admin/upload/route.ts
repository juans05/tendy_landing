import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { currentUser, isAdmin, sameOrigin, supabase } from '@/lib/platform/server';
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Origen inválido.' }, { status: 403 });
  const user = await currentUser();
  if (!user || !(await isAdmin(user.id))) return NextResponse.json({ error: 'No autorizado.' }, { status: 403 });
  if (Number(request.headers.get('content-length') || 0) > 2200000) return NextResponse.json({ error: 'La imagen debe pesar menos de 2 MB.' }, { status: 413 });
  const data = await request.formData();
  const file = data.get('image');
  if (!(file instanceof File) || file.size > 2000000 || file.size < 12) return NextResponse.json({ error: 'Sube una imagen JPG, PNG o WebP de hasta 2 MB.' }, { status: 400 });
  const bytes = Buffer.from(await file.arrayBuffer());
  let ext = '', type = '';
  if (bytes.subarray(0,3).equals(Buffer.from([255,216,255]))) { ext = 'jpg'; type = 'image/jpeg'; }
  else if (bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) { ext = 'png'; type = 'image/png'; }
  else if (bytes.toString('ascii',0,4) === 'RIFF' && bytes.toString('ascii',8,12) === 'WEBP') { ext = 'webp'; type = 'image/webp'; }
  if (!ext) return NextResponse.json({ error: 'Formato de imagen no permitido.' }, { status: 400 });
  const name = `${randomUUID()}.${ext}`;
  try {
    await supabase(`/storage/v1/object/catalog/${name}`, { method: 'POST', headers: { 'Content-Type': type, 'Cache-Control': 'max-age=31536000' }, body: bytes });
    return NextResponse.json({ url: `${process.env.SUPABASE_URL}/storage/v1/object/public/catalog/${name}` });
  } catch { return NextResponse.json({ error: 'No se pudo subir la imagen.' }, { status: 502 }); }
}
