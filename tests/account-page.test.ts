import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getViewer: vi.fn(),
  createSessionClient: vi.fn(),
  getMarketplace: vi.fn(),
  cookies: vi.fn()
}));

vi.mock('@/lib/auth', () => ({ getViewer: mocks.getViewer }));
vi.mock('@/lib/supabase/server', () => ({ createSessionClient: mocks.createSessionClient }));
vi.mock('@/modules/marketplace/service', () => ({ getMarketplace: mocks.getMarketplace }));
vi.mock('next/headers', () => ({ cookies: mocks.cookies }));
vi.mock('next/navigation', async (importOriginal) => ({
  ...await importOriginal<typeof import('next/navigation')>(),
  redirect: (path: string) => { throw new Error(`redirect:${path}`); }
}));

import AccountPage from '@/app/account/[[...section]]/page';

type Call = { table: string; column: string; value: string };
function database(results: Record<string, { data?: unknown; error?: unknown; count?: number | null }>) {
  const calls: Call[] = [];
  const db = {
    from(table: string) {
      return {
        select() {
          return {
            eq(column: string, value: string) {
              calls.push({ table, column, value });
              const result = { data: null, error: null, count: null, ...results[table] };
              const promise = Promise.resolve(result);
              return {
                limit: () => promise,
                maybeSingle: () => promise,
                then: promise.then.bind(promise)
              };
            }
          };
        }
      };
    }
  };
  return { db, calls };
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getViewer.mockResolvedValue({ id: 'signed-in-user', email: 'member@example.com', displayName: 'عضو' });
  mocks.cookies.mockResolvedValue({ get: () => ({ value: 'dark' }) });
  mocks.getMarketplace.mockResolvedValue({ plates: [], source: 'demo' });
});

describe('account data boundaries', () => {
  it('filters account records to the signed-in user', async () => {
    const { db, calls } = database({ payment_authorizations: { data: [{ id: 'one' }] } });
    mocks.createSessionClient.mockResolvedValue(db);
    const result = await AccountPage({ params: Promise.resolve({ section: ['deposits'] }) });
    expect(calls).toEqual([{ table: 'payment_authorizations', column: 'user_id', value: 'signed-in-user' }]);
    expect(result.props.rowsData).toEqual([{ id: 'one' }]);
    expect(result.props.dataState).toBe('ready');
    expect(result.props.initialTheme).toBe('dark');
  });

  it('does not substitute example financial records for a failed account query', async () => {
    const { db } = database({ payment_authorizations: { error: { message: 'unavailable' } } });
    mocks.createSessionClient.mockResolvedValue(db);
    const result = await AccountPage({ params: Promise.resolve({ section: ['deposits'] }) });
    expect(result.props.dataState).toBe('unavailable');
    expect(result.props.rowsData).toEqual([]);
  });

  it('reports an unconfigured account without inventing records', async () => {
    mocks.createSessionClient.mockResolvedValue(null);
    const result = await AccountPage({ params: Promise.resolve({ section: ['deposits'] }) });
    expect(result.props.dataState).toBe('unavailable');
    expect(result.props.rowsData).toEqual([]);
  });

  it('counts only the current user and retains marketplace source information', async () => {
    const { db, calls } = database({
      auction_registrations: { count: 2 }, plates: { count: 0 }, favorites: { count: 4 }
    });
    mocks.createSessionClient.mockResolvedValue(db);
    const result = await AccountPage({ params: Promise.resolve({}) });
    expect(calls).toEqual([
      { table: 'auction_registrations', column: 'user_id', value: 'signed-in-user' },
      { table: 'plates', column: 'owner_id', value: 'signed-in-user' },
      { table: 'favorites', column: 'user_id', value: 'signed-in-user' }
    ]);
    expect(result.props.counts).toEqual({ auctions: 2, plates: 0, favorites: 4 });
    expect(result.props.marketplaceSource).toBe('demo');
  });

  it('loads the current profile before allowing profile edits', async () => {
    const { db, calls } = database({ profiles: { data: { phone: '+966501234567' } } });
    mocks.createSessionClient.mockResolvedValue(db);
    const result = await AccountPage({ params: Promise.resolve({ section: ['profile'] }) });
    expect(calls).toEqual([{ table: 'profiles', column: 'id', value: 'signed-in-user' }]);
    expect(result.props.profileEditable).toBe(true);
    expect(result.props.profilePhone).toBe('+966501234567');
  });

  it('redirects an unauthenticated viewer before loading account data', async () => {
    mocks.getViewer.mockResolvedValue(null);
    await expect(AccountPage({ params: Promise.resolve({}) })).rejects.toThrow('redirect:/login');
    expect(mocks.createSessionClient).not.toHaveBeenCalled();
  });
});
