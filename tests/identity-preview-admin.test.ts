import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
const auth = vi.hoisted(() => ({ getViewer: vi.fn(), requirePermission: vi.fn(), requireMfa: vi.fn() }));
const db = vi.hoisted(() => ({ createAdminClient: vi.fn() }));
vi.mock('@/lib/auth', () => auth);
vi.mock('@/lib/supabase/server', () => db);
vi.mock('next/navigation', () => ({ redirect: () => { throw new Error('REDIRECT_TO_LOGIN'); }, useRouter: () => ({ refresh: vi.fn() }) }));
import IdentitiesPage from '@/app/admin/identities/page';

beforeEach(() => {
  vi.resetAllMocks();
  auth.getViewer.mockResolvedValue({ id: 'admin-1' });
  auth.requirePermission.mockResolvedValue(undefined);
  auth.requireMfa.mockResolvedValue(undefined);
  db.createAdminClient.mockReturnValue({ from: () => ({ select: () => ({ order: () => ({ limit: async () => ({ data: [], error: null }) }) }) }) });
});
describe('identity administration', () => {
  it('requires the dedicated permission and MFA before reading the review queue', async () => {
    const html = renderToStaticMarkup(await IdentitiesPage());
    expect(html).toContain('لا توجد طلبات هوية');
    expect(auth.requirePermission).toHaveBeenCalledWith('identity.review');
    expect(auth.requireMfa).toHaveBeenCalledOnce();
  });
  it('does not read identity data without permission or MFA', async () => {
    auth.requireMfa.mockRejectedValue(new Error('FORBIDDEN'));
    const html = renderToStaticMarkup(await IdentitiesPage());
    expect(html).toContain('التحقق بخطوتين');
    expect(db.createAdminClient).not.toHaveBeenCalled();
  });
  it('redirects signed-out visitors', async () => {
    auth.getViewer.mockResolvedValue(null);
    await expect(IdentitiesPage()).rejects.toThrow('REDIRECT_TO_LOGIN');
    expect(auth.requirePermission).not.toHaveBeenCalled();
  });
});
