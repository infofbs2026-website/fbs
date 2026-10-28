import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  client: vi.fn(),
  viewer: vi.fn(),
  readJson: vi.fn(),
  rateLimit: vi.fn()
}));
vi.mock('@/lib/supabase/server', () => ({ createSessionClient: mocks.client, createAdminClient: () => null }));
vi.mock('@/lib/auth', () => ({ requireViewer: mocks.viewer, requirePermission: vi.fn(), requireMfa: vi.fn() }));
vi.mock('@/lib/rate-limit', () => ({ rateLimit: mocks.rateLimit }));
vi.mock('@/lib/api', async (importOriginal) => ({
  ...await importOriginal<typeof import('@/lib/api')>(),
  assertOrigin: vi.fn(), readJson: mocks.readJson
}));
vi.mock('@/modules/realtime/provider', () => ({ projectToRedis: vi.fn(), getAuctionStateFromRedis: vi.fn(), realtimeProvider: vi.fn() }));

import { POST } from '@/app/api/v1/[...path]/route';

function profileClient(updated: { id: string } | null) {
  return {
    from: () => ({
      select: () => ({ ilike: () => ({ neq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }) }) }),
      update: () => ({ eq: () => ({ select: () => ({ maybeSingle: async () => ({ data: updated, error: null }) }) }) })
    })
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.viewer.mockResolvedValue({ id: 'user-1' });
  mocks.readJson.mockResolvedValue({ displayName: 'اسم صالح', phone: '+966501234567' });
  mocks.rateLimit.mockResolvedValue(undefined);
});

describe('account profile save', () => {
  it('confirms success only when a profile row was updated', async () => {
    mocks.client.mockResolvedValue(profileClient({ id: 'user-1' }));
    const response = await POST(new Request('http://localhost/api/v1/profile', { method: 'POST' }), { params: Promise.resolve({ path: ['profile'] }) });
    expect(response.status).toBe(200);
    expect((await response.json()).data.message).toContain('حُفظ الملف');
  });

  it('does not report success if the update affected no row', async () => {
    mocks.client.mockResolvedValue(profileClient(null));
    const response = await POST(new Request('http://localhost/api/v1/profile', { method: 'POST' }), { params: Promise.resolve({ path: ['profile'] }) });
    expect(response.status).toBe(503);
    expect((await response.json()).error.message).toContain('تعذر حفظ الملف');
  });

  it('does not report a successful save when the account database is unavailable', async () => {
    mocks.client.mockResolvedValue(null);
    const response = await POST(new Request('http://localhost/api/v1/profile', { method: 'POST' }), { params: Promise.resolve({ path: ['profile'] }) });
    expect(response.status).toBe(503);
  });
});
