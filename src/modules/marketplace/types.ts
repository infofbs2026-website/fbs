export type MarketplaceAuction = {
  id: string; slug: string; plateId: string; status: string;
  startsAt: string; endsAt: string; registrationEndsAt: string | null;
  currentPriceHalalas: string; startingPriceHalalas: string; minimumIncrementHalalas: string;
  depositAmountHalalas: string; bidCount: number; sequence: string; version: string;
};
export type MarketplacePlate = {
  id: string; slug: string; lettersAr: string[]; lettersEn: string[]; numbers: string;
  city: string; type: string; description: string; priceHalalas: string | null;
  status: string; featured: boolean; verified: boolean; auction: MarketplaceAuction | null;
};
export type MarketplaceQuery = {
  q?: string;
  type?: string;
  city?: string;
  status?: string;
  auctionStatus?: string;
  digitsCount?: string;
  featured?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  priceRange?: string;
  lettersPattern?: string | string[];
  numbersPattern?: string | string[];
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'ending';
  page?: number;
  pageSize?: number;
};
export type MarketplaceResult = {
  configured: boolean;
  available: boolean;
  plates: MarketplacePlate[];
  total: number;
  page: number;
  pageSize: number;
  error?: string;
};
