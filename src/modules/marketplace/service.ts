import 'server-only';
import { createAdminClient } from '@/lib/supabase/server';
import type { MarketplaceAuction, MarketplacePlate, MarketplaceQuery, MarketplaceResult } from './types';
import { fallbackPlates, filterFallbackPlates } from './mock-data';
import { parsePlateSearch } from './plate-search';

type Row = Record<string, unknown>;
const text = (value: unknown) => typeof value === 'string' ? value : String(value ?? '');
const strings = (value: unknown) => Array.isArray(value) ? value.map(text) : [];
export function mapAuction(row: Row): MarketplaceAuction {
  return {
    id: text(row.id), slug: text(row.slug), plateId: text(row.plate_id), status: text(row.status),
    startsAt: text(row.starts_at), endsAt: text(row.ends_at), registrationEndsAt: row.registration_ends_at ? text(row.registration_ends_at) : null,
    currentPriceHalalas: text(row.current_price_minor ?? '0'), startingPriceHalalas: text(row.starting_price_minor ?? '0'),
    minimumIncrementHalalas: text(row.minimum_increment_minor ?? '0'), depositAmountHalalas: text(row.deposit_amount_minor ?? '0'),
    bidCount: Number(row.bid_count ?? 0), sequence: text(row.sequence ?? '0'), version: text(row.version ?? '0'),
  };
}
export function mapPlate(row: Row, auction: MarketplaceAuction | null = null): MarketplacePlate {
  return {
    id: text(row.id), slug: text(row.slug), lettersAr: strings(row.letters_ar), lettersEn: strings(row.letters_en),
    numbers: text(row.numbers), city: text(row.city), type: text(row.type), description: text(row.description),
    priceHalalas: row.price_minor == null ? null : text(row.price_minor), status: text(row.status),
    featured: row.featured === true, verified: row.verified === true, auction,
  };
}

export async function getMarketplace(input: MarketplaceQuery = {}): Promise<MarketplaceResult> {
  const page = Math.max(1, Math.min(1000, Math.floor(Number(input.page) || 1)));
  const pageSize = Math.max(1, Math.min(48, Math.floor(Number(input.pageSize) || 12)));
  const db = createAdminClient();

  if (!db) {
    const filtered = filterFallbackPlates(fallbackPlates, input);
    return {
      configured: false,
      available: true,
      source: 'demo',
      plates: filtered.slice((page - 1) * pageSize, page * pageSize),
      total: filtered.length,
      page,
      pageSize
    };
  }

  try {
    let query = db.from('public_plates').select('*', { count: 'exact' });
    if (input.auctionStatus === 'DIRECT') {
      const filtered = filterFallbackPlates(fallbackPlates, input);
      return {
        configured: true,
        available: true,
        source: 'demo',
        plates: filtered.slice((page - 1) * pageSize, page * pageSize),
        total: filtered.length,
        page,
        pageSize
      };
    } else if (input.auctionStatus) {
      let aq = db.from('public_auctions').select('plate_id');
      if (input.auctionStatus === 'LIVE') aq = aq.eq('status', 'LIVE');
      else if (input.auctionStatus === 'UPCOMING') aq = aq.in('status', ['SCHEDULED', 'REGISTRATION_OPEN', 'WAITING_ROOM']);
      else if (input.auctionStatus === 'COMPLETED') aq = aq.in('status', ['ENDED', 'COMPLETED', 'RESERVE_NOT_MET']);
      const active = await aq.limit(1000);
      if (active.error || !active.data?.length) {
        const filtered = filterFallbackPlates(fallbackPlates, input);
        return { configured: true, available: true, source: 'demo', plates: filtered.slice((page - 1) * pageSize, page * pageSize), total: filtered.length, page, pageSize };
      }
      query = query.in('id', active.data.map(a => a.plate_id));
    }
    if (input.digitsCount && /^[1-4]$/.test(input.digitsCount)) query = query.eq('digits_count', Number(input.digitsCount));
    if (input.featured === 'true') query = query.eq('featured', true);
    if (input.q?.trim()) {
      const search = parsePlateSearch(input.q);
      if (!search.valid) return { configured: true, available: true, source: 'database', plates: [], total: 0, page, pageSize };
      // search_text contains only digits and the three Arabic and Latin letters.
      // Keep the queried letters adjacent and ignore unrelated plate metadata.
      if (search.arabic) query = query.ilike('search_text', `%${Array.from(search.arabic).join(' ')}%`);
      if (search.latin) {
        const forward = Array.from(search.latin).join(' ');
        const reverse = Array.from(search.latin).reverse().join(' ');
        query = forward === reverse
          ? query.ilike('search_text', `%${forward}%`)
          : query.or(`search_text.ilike.%${forward}%,search_text.ilike.%${reverse}%`);
      }
      if (search.digits) query = query.ilike('numbers', `%${search.digits}%`);
    }
    if (input.type) {
      const t = input.type.trim();
      if (t === 'نقل' || t === 'transport') query = query.ilike('type', '%نقل%');
      else if (t === 'صغيرة' || t === 'small' || t === 'sports') query = query.ilike('type', '%صغير%');
      else if (t === 'خصوصي' || t === 'private') query = query.ilike('type', '%خصوص%');
      else query = query.ilike('type', `%${t}%`);
    }
    if (input.city) query = query.eq('city', input.city);
    if (input.status) query = query.eq('status', input.status);
    if (input.minPrice !== undefined && input.minPrice !== '') {
      const min = Number(input.minPrice);
      if (!isNaN(min)) query = query.gte('price_minor', min * 100);
    }
    if (input.maxPrice !== undefined && input.maxPrice !== '') {
      const max = Number(input.maxPrice);
      if (!isNaN(max)) query = query.lte('price_minor', max * 100);
    }
    query = input.sort === 'price_asc' ? query.order('price_minor', { ascending: true, nullsFirst: false })
      : input.sort === 'price_desc' ? query.order('price_minor', { ascending: false, nullsFirst: false })
      : query.order('created_at', { ascending: false });
    const { data, error, count } = await query.range((page - 1) * pageSize, page * pageSize - 1);
    if (error || (!data?.length && !input.q?.trim() && page === 1)) {
      const filtered = filterFallbackPlates(fallbackPlates, input);
      return { configured: true, available: true, source: 'demo', plates: filtered.slice((page - 1) * pageSize, page * pageSize), total: filtered.length, page, pageSize };
    }
    const rows = (data ?? []) as Row[];
    const ids = rows.map((row) => text(row.id));
    const auctions = ids.length ? await db.from('public_auctions').select('*').in('plate_id', ids).order('starts_at', { ascending: false }) : { data: [], error: null };
    const mappedAuctions = ((auctions.data ?? []) as Row[]).map(mapAuction);
    let plates = rows.map((row) => mapPlate(row, mappedAuctions.find((auction) => auction.plateId === row.id) ?? null));
    if (input.sort === 'ending') plates = plates.sort((a, b) => (a.auction?.endsAt ?? 'z').localeCompare(b.auction?.endsAt ?? 'z'));
    return { configured: true, available: true, source: 'database', plates, total: count ?? plates.length, page, pageSize };
  } catch {
    const filtered = filterFallbackPlates(fallbackPlates, input);
    return { configured: true, available: true, source: 'demo', plates: filtered.slice((page - 1) * pageSize, page * pageSize), total: filtered.length, page, pageSize };
  }
}

export async function getPlateBySlug(slug: string) {
  const db = createAdminClient();
  if (!db) {
    const found = fallbackPlates.find((p) => p.slug === slug);
    return { configured: false, available: true, plate: found ?? null };
  }
  try {
    const { data, error } = await db.from('public_plates').select('*').eq('slug', slug).maybeSingle();
    if (error || !data) {
      const found = fallbackPlates.find((p) => p.slug === slug);
      return { configured: true, available: true, plate: found ?? null };
    }
    const auctions = await db.from('public_auctions').select('*').eq('plate_id', data.id).order('starts_at', { ascending: false }).limit(1).maybeSingle();
    return { configured: true, available: true, plate: mapPlate(data, auctions.data ? mapAuction(auctions.data) : null) };
  } catch {
    const found = fallbackPlates.find((p) => p.slug === slug);
    return { configured: true, available: true, plate: found ?? null };
  }
}

const defaultLetters = [
  { id: '1', arabic: 'أ', latin: 'A' }, { id: '2', arabic: 'ب', latin: 'B' },
  { id: '3', arabic: 'ح', latin: 'J' }, { id: '4', arabic: 'د', latin: 'D' },
  { id: '5', arabic: 'ر', latin: 'R' }, { id: '6', arabic: 'س', latin: 'S' },
  { id: '7', arabic: 'ص', latin: 'X' }, { id: '8', arabic: 'ط', latin: 'T' },
  { id: '9', arabic: 'ع', latin: 'E' }, { id: '10', arabic: 'ق', latin: 'G' },
  { id: '11', arabic: 'ك', latin: 'K' }, { id: '12', arabic: 'ل', latin: 'L' },
  { id: '13', arabic: 'م', latin: 'Z' }, { id: '14', arabic: 'ن', latin: 'N' },
  { id: '15', arabic: 'هـ', latin: 'H' }, { id: '16', arabic: 'و', latin: 'U' },
  { id: '17', arabic: 'ى', latin: 'V' }
];

const defaultTypes = [
  { id: 'private', name_ar: 'خصوصي' },
  { id: 'small', name_ar: 'صغيرة' },
  { id: 'transport', name_ar: 'نقل' }
];

const defaultCities = [
  { id: 'riyadh', name_ar: 'الرياض' },
  { id: 'jeddah', name_ar: 'جدة' },
  { id: 'makkah', name_ar: 'مكة المكرمة' },
  { id: 'madinah', name_ar: 'المدينة المنورة' },
  { id: 'dammam', name_ar: 'الدمام' },
  { id: 'khobar', name_ar: 'الخبر' },
  { id: 'dhahran', name_ar: 'الظهران' },
  { id: 'taif', name_ar: 'الطائف' },
  { id: 'buraidah', name_ar: 'بريدة' },
  { id: 'unaizah', name_ar: 'عنيزة' },
  { id: 'tabuk', name_ar: 'تبوك' },
  { id: 'abha', name_ar: 'أبها' },
  { id: 'khamis_mushait', name_ar: 'خميس مشيط' },
  { id: 'hail', name_ar: 'حائل' },
  { id: 'jazan', name_ar: 'جازان' },
  { id: 'najran', name_ar: 'نجران' },
  { id: 'jubail', name_ar: 'الجبيل' },
  { id: 'yanbu', name_ar: 'ينبع' },
  { id: 'ahsa', name_ar: 'الأحساء' },
  { id: 'hafar_albatin', name_ar: 'حفر الباطن' },
  { id: 'kharj', name_ar: 'الخرج' },
  { id: 'qatif', name_ar: 'القطيف' },
  { id: 'baha', name_ar: 'الباحة' },
  { id: 'sakaka', name_ar: 'سكاكا (الجوف)' },
  { id: 'arar', name_ar: 'عرعر' },
  { id: 'qurayyat', name_ar: 'القريات' },
  { id: 'bisha', name_ar: 'بيشة' },
  { id: 'rass', name_ar: 'الرس' },
  { id: 'zulfi', name_ar: 'الزلفي' },
  { id: 'majmaah', name_ar: 'المجمعة' },
  { id: 'dawadmi', name_ar: 'الدوادمي' },
  { id: 'wadi_aldawasir', name_ar: 'وادي الدواسر' },
  { id: 'qunfudhah', name_ar: 'القنفذة' },
  { id: 'rabigh', name_ar: 'رابغ' },
  { id: 'qilwah', name_ar: 'قلوة' }
];

export async function getReferenceData() {
  const db = createAdminClient();
  if (!db) return { configured: false, letters: defaultLetters, types: defaultTypes, cities: defaultCities };
  try {
    const [letters, types, cities] = await Promise.all([
      db.from('plate_letters').select('id,arabic,latin').eq('active', true).order('sort_order'),
      db.from('plate_types').select('id,name_ar').eq('active', true).order('sort_order'),
      db.from('cities').select('id,name_ar').order('name_ar'),
    ]);
    const dbCities = cities.data ?? [];
    const existingNames = new Set(dbCities.map((c) => String(c.name_ar ?? '').trim()));
    const mergedCities = [
      ...dbCities,
      ...defaultCities.filter((c) => !existingNames.has(c.name_ar))
    ];
    return {
      configured: true,
      letters: letters.data?.length ? letters.data : defaultLetters,
      types: types.data?.length ? types.data : defaultTypes,
      cities: mergedCities.length ? mergedCities : defaultCities
    };
  } catch {
    return { configured: true, letters: defaultLetters, types: defaultTypes, cities: defaultCities };
  }
}

