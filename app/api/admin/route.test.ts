// @vitest-environment node
import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('next/cache',()=>({revalidatePath:vi.fn()}));
vi.mock('@/lib/platform/server',()=>({currentUser:vi.fn(),isAdmin:vi.fn(),sameOrigin:vi.fn(),supabase:vi.fn()}));
import { currentUser,isAdmin,sameOrigin,supabase } from '@/lib/platform/server';
import { POST } from './route';
const request=()=>new NextRequest('https://tendy.pe/api/admin',{method:'POST',headers:{origin:'https://tendy.pe','Content-Type':'application/json'},body:JSON.stringify({kind:'products',item:{}})});
describe('admin authorization',()=>{
 beforeEach(()=>{vi.clearAllMocks();vi.mocked(sameOrigin).mockReturnValue(true);});
 it('denies unsigned visitors before any mutation',async()=>{
  vi.mocked(currentUser).mockResolvedValue(null);
  expect((await POST(request())).status).toBe(403);
  expect(supabase).not.toHaveBeenCalled();
 });
 it('denies ordinary members even with forged client-side roles',async()=>{
  vi.mocked(currentUser).mockResolvedValue({id:'user',email:'user@example.com',token:'token'});
  vi.mocked(isAdmin).mockResolvedValue(false);
  expect((await POST(request())).status).toBe(403);
  expect(supabase).not.toHaveBeenCalled();
 });
 it('rejects cross-site mutation requests',async()=>{
  vi.mocked(sameOrigin).mockReturnValue(false);
  expect((await POST(request())).status).toBe(403);
  expect(currentUser).not.toHaveBeenCalled();
 });
});
