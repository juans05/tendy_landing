import { NextRequest, NextResponse } from 'next/server';
import { currentUser, isAdmin, sameOrigin, supabase } from '@/lib/platform/server';
import { mp, reconcile } from '@/lib/platform/payments';
import { uuid } from '@/lib/platform/validation';
import type { Subscription } from '@/lib/platform/types';
export async function POST(request: NextRequest) {
 if (!sameOrigin(request)) return NextResponse.json({error:'Origen inválido.'},{status:403});
 const user=await currentUser();
 if(!user || !(await isAdmin(user.id))) return NextResponse.json({error:'No autorizado.'},{status:403});
 const data=await request.json().catch(()=>null);
 if(!uuid(data?.id)) return NextResponse.json({error:'Suscripción inválida.'},{status:400});
 try {
  const rows=await supabase<Subscription[]>(`/rest/v1/subscriptions?id=eq.${data.id}&limit=1`);
  const sub=rows[0]; if(!sub) return NextResponse.json({error:'No existe la suscripción.'},{status:404});
  let providerId=sub.mp_id;
  if(!providerId) {
    const result=await mp<{results:{id:string;external_reference:string;init_point?:string}[]}>(`/preapproval/search?external_reference=${sub.id}`);
    const matches=result.results.filter(r=>r.external_reference===sub.id);
    if(matches.length!==1) return NextResponse.json({error:'No hay un resultado único. Revisa esta referencia en MercadoPago antes de liberar un nuevo intento.'},{status:409});
    providerId=matches[0].id;
  }
  await reconcile(providerId);
  return NextResponse.json({ok:true});
 } catch { return NextResponse.json({error:'No pudimos conciliar la suscripción. Intenta más tarde.'},{status:502}); }
}
