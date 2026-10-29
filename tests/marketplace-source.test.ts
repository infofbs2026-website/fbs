import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ admin: vi.fn() }));
vi.mock('@/lib/supabase/server', () => ({ createAdminClient: mocks.admin }));
import { getMarketplace } from '@/modules/marketplace/service';

beforeEach(() => vi.clearAllMocks());

describe('marketplace data provenance', () => {
  it('returns no listings when the service is not configured', async () => {
    mocks.admin.mockReturnValue(null);
    const result = await getMarketplace({ auctionStatus: 'LIVE', pageSize: 2 });
    expect(result.available).toBe(false);
    expect(result.plates).toEqual([]);
  });

  it('returns no listings when the database query fails', async () => {
    mocks.admin.mockReturnValue({ from: () => ({ select: () => ({ eq: () => ({ limit: async () => ({ data: null, error: { message: 'failed' } }) }) }) }) });
    const result = await getMarketplace({ auctionStatus: 'LIVE', pageSize: 2 });
    expect(result.available).toBe(false);
    expect(result.plates).toEqual([]);
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

describe('database plate search', () => {
  function databaseWithResults(data: Record<string, unknown>[]) {
    const filters: Array<[string, string]> = [];
    const platesQuery = {
      in: () => platesQuery,
      ilike: (field: string, value: string) => { filters.push([field, value]); return platesQuery; },
      or: (value: string) => { filters.push(['or', value]); return platesQuery; },
      order: () => platesQuery,
      range: async () => ({ data, error: null, count: data.length }),
    };
    const db = {
      from(table: string) {
        if (table === 'public_plates') return { select: () => platesQuery };
        return { select: (columns: string) => columns === 'plate_id'
          ? { eq: () => ({ limit: async () => ({ data: [{ plate_id: 'p1' }], error: null }) }) }
          : { in: () => ({ order: async () => ({ data: [], error: null }) }) } };
      },
    };
    mocks.admin.mockReturnValue(db);
    return filters;
  }

  it('filters the plate letters and normalized number in the database', async () => {
    const filters = databaseWithResults([{ id: 'p1', slug: 'p1', letters_ar: ['م', 'ل', 'ك'], letters_en: ['Z', 'L', 'K'], numbers: '5' }]);
    const result = await getMarketplace({ q: 'م ل ك ٥', auctionStatus: 'LIVE' });
    expect(filters).toEqual([['search_text', '%م ل ك%'], ['numbers', '%5%']]);
    expect(result.source).toBe('database');
    expect(result.plates.map((plate) => plate.id)).toEqual(['p1']);
  });

  it('matches Latin letters in their displayed order', async () => {
    const filters = databaseWithResults([]);
    await getMarketplace({ q: 'K L Z 5', auctionStatus: 'LIVE' });
    expect(filters).toEqual([
      ['search_text', '%Z L K%'],
      ['numbers', '%5%'],
    ]);
  });

  it('returns no results instead of substituting demo plates for an unmatched database query', async () => {
    databaseWithResults([]);
    const result = await getMarketplace({ q: 'ص', auctionStatus: 'LIVE' });
    expect(result.source).toBe('database');
    expect(result.plates).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('rejects wildcards rather than turning them into a match-all query', async () => {
    const filters = databaseWithResults([]);
    const result = await getMarketplace({ q: '%', auctionStatus: 'LIVE' });
    expect(filters).toEqual([]);
    expect(result.plates).toEqual([]);
  });
});
