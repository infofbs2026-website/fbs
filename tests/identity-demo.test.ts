import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ viewer: vi.fn(), admin: vi.fn(), upload: vi.fn(), remove: vi.fn(), rpc: vi.fn() }));
vi.mock('@/lib/auth', () => ({ requireViewer: mocks.viewer }));
vi.mock('@/lib/rate-limit', () => ({ rateLimit: vi.fn() }));
vi.mock('@/lib/supabase/server', () => ({ createAdminClient: mocks.admin, createSessionClient: vi.fn() }));
vi.mock('@/lib/api', async (original) => ({ ...await original<typeof import('@/lib/api')>(), assertOrigin: vi.fn() }));
import { POST } from '@/app/api/v1/identity/route';

function form(image = new File([new Uint8Array([255,216,255,1,2,3])], 'front.jpg', { type: 'image/jpeg' })) {
  const data = new FormData();
  for (const [key, value] of Object.entries({ fullName:'اسم كامل', nationalId:'1234567890', birthDate:'2000-01-01', phone:'0500000000', email:'member@example.com', city:'الرياض' })) data.set(key, value);
  data.set('front', image); data.set('back', image);
  return new Request('http://localhost/api/v1/identity', { method: 'POST', body: data });
}
beforeEach(() => {
  vi.clearAllMocks();
  mocks.viewer.mockResolvedValue({ id:'10000000-0000-4000-8000-000000000001', verified:true });
  mocks.upload.mockResolvedValue({ error:null });
  mocks.remove.mockResolvedValue({ error:null });
  mocks.rpc.mockResolvedValue({ data:{status:'PENDING'}, error:null });
  mocks.admin.mockReturnValue({ storage:{from:() => ({ upload:mocks.upload, remove:mocks.remove })}, rpc:mocks.rpc });
});
describe('identity submission', () => {
  it('uploads both private images and persists the submission for the signed-in user', async () => {
    const response = await POST(form());
    expect(response.status).toBe(201);
    expect(mocks.upload).toHaveBeenCalledTimes(2);
    expect(mocks.rpc).toHaveBeenCalledWith('fbs_submit_identity', expect.objectContaining({p_user_id:'10000000-0000-4000-8000-000000000001'}));
    expect(mocks.remove).not.toHaveBeenCalled();
  });
  it('rejects a file with misleading image content before uploading', async () => {
    const response = await POST(form(new File(['not-an-image'], 'front.jpg', {type:'image/jpeg'})));
    expect(response.status).toBe(400);
    expect(mocks.upload).not.toHaveBeenCalled();
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
  it('does not report success when saving fails', async () => {
    mocks.rpc.mockResolvedValue({ data:null, error:{message:'database unavailable'} });
    const response = await POST(form());
    expect(response.status).toBe(503);
    expect(mocks.remove).not.toHaveBeenCalled();
  });
  it('cleans up the first file if the second upload fails', async () => {
    mocks.upload.mockResolvedValueOnce({error:null}).mockResolvedValueOnce({error:{message:'unavailable'}});
    const response = await POST(form());
    expect(response.status).toBe(503);
    expect(mocks.remove).toHaveBeenCalledOnce();
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
});
