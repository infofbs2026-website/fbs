import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ admin: vi.fn() }));
vi.mock('@/lib/supabase/server', () => ({ createAdminClient: mocks.admin }));
import { getMarketplace } from '@/modules/marketplace/service';

beforeEach(() => vi.clearAllMocks());

describe('marketplace data provenance', () => {
  it('marks fallback listings as examples when the service is not configured', async () => {
    mocks.admin.mockReturnValue(null);
    const result = await getMarketplace({ auctionStatus: 'LIVE', pageSize: 2 });
    expect(result.source).toBe('demo');
    expect(result.plates.length).toBeGreaterThan(0);
  });

  it('marks fallback listings when the database query fails', async () => {
    mocks.admin.mockReturnValue({ from: () => ({ select: () => ({ eq: () => ({ limit: async () => ({ data: null, error: { message: 'failed' } }) }) }) }) });
    const result = await getMarketplace({ auctionStatus: 'LIVE', pageSize: 2 });
    expect(result.source).toBe('demo');
  });

  it('marks successfully loaded marketplace listings as database data', async () => {
    const row = { id: 'p1', slug: 'p1', letters_ar: ['ق'], letters_en: ['G'], numbers: '1', type: 'خصوصي' };
    const platesQuery = { in: () => platesQuery, order: () => platesQuery, range: async () => ({ data: [row], error: null, count: 1 }) };
    const db = {
      from(table: string) {
        if (table === 'public_plates') return { select: () => platesQuery };
        return { select: (columns: string) => columns === 'plate_id'
          ? { eq: () => ({ limit: async () => ({ data: [{ plate_id: 'p1' }], error: null }) }) }
          : { in: () => ({ order: async () => ({ data: [], error: null }) }) } };
      }
    };
    mocks.admin.mockReturnValue(db);
    const result = await getMarketplace({ auctionStatus: 'LIVE' });
    expect(result.source).toBe('database');
    expect(result.plates[0].id).toBe('p1');
  });
});
