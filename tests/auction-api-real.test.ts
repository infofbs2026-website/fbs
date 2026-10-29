import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ viewer: vi.fn(), admin: vi.fn(), rpc: vi.fn(), readJson: vi.fn(), publish: vi.fn() }));
vi.mock('@/lib/auth', () => ({ requireViewer: mocks.viewer, requirePermission: vi.fn(), requireMfa: vi.fn() }));
vi.mock('@/lib/supabase/server', () => ({ createAdminClient: mocks.admin, createSessionClient: vi.fn() }));
vi.mock('@/lib/rate-limit', () => ({ rateLimit: vi.fn() }));
vi.mock('@/lib/api', async original => ({ ...await original<typeof import('@/lib/api')>(), assertOrigin: vi.fn(), readJson: mocks.readJson }));
vi.mock('@/modules/realtime/provider', () => ({ projectToRedis: vi.fn(), realtimeProvider: () => ({ publish: mocks.publish }) }));
import { POST } from '@/app/api/v1/[...path]/route';
const auctionId='00000000-0000-4000-8000-000000000001';
const request = () => new Request('http://localhost', { method:'POST' });
beforeEach(() => {
  vi.clearAllMocks();
  mocks.viewer.mockResolvedValue({id:'00000000-0000-4000-8000-000000000002'});
  mocks.admin.mockReturnValue({rpc:mocks.rpc});
  mocks.readJson.mockResolvedValue({ amount:'10000', bidRequestId:'00000000-0000-4000-8000-000000000003', expectedSequence:0 });
});
describe('durable auction responses', () => {
  it('returns the actual identity requirement instead of accepting a fake bid', async () => {
    mocks.rpc.mockResolvedValue({data:null,error:{message:'IDENTITY_REQUIRED'}});
    const response=await POST(request(),{params:Promise.resolve({path:['auctions',auctionId,'bids']})});
    expect(response.status).toBe(409);
    expect((await response.json()).error.code).toBe('IDENTITY_REQUIRED');
    expect(mocks.publish).not.toHaveBeenCalled();
  });
  it('does not report successful registration when the database is unavailable', async () => {
    mocks.admin.mockReturnValue(null);
    mocks.readJson.mockResolvedValue({ termsVersion:'x'.repeat(32) });
    const response=await POST(request(),{params:Promise.resolve({path:['auctions',auctionId,'register']})});
    expect(response.status).toBe(503);
  });
});
