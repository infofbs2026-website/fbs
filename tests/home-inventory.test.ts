import { describe, expect, it, vi } from 'vitest';
const market = vi.hoisted(() => vi.fn());
vi.mock('@/modules/marketplace/service', () => ({ getMarketplace: market }));
vi.mock('next/dynamic', () => ({ default: () => () => null }));
import Home from '@/app/page';

describe('home inventory', () => {
  it('uses direct-sale listings for the store section and live auctions for the hero', async () => {
    market.mockImplementation(async ({ auctionStatus }: { auctionStatus: string }) => ({
      plates: auctionStatus === 'LIVE' ? [{ id: 'auction', auction: { status: 'LIVE' } }] : [{ id: 'store', auction: null }]
    }));
    const result = await Home();
    const children = result.props.children as Array<{ props?: Record<string, unknown> } | null>;
    const hero = children.find(child => child?.props && 'initialPlate' in child.props);
    const store = children.find(child => child?.props && 'liveAuctions' in child.props);
    expect((hero?.props?.initialPlate as {id:string}).id).toBe('auction');
    expect((store?.props?.liveAuctions as Array<{id:string}>).map(plate => plate.id)).toEqual(['store']);
  });
});
