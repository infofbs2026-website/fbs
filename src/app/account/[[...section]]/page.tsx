import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getViewer } from '@/lib/auth';
import { createSessionClient } from '@/lib/supabase/server';
import { AccountDashboard } from '@/components/account-dashboard';
import { getMarketplace } from '@/modules/marketplace/service';

export const metadata: Metadata = {
  title: 'بوابة النخبة التنفيذية · لوحة التحكم الخاصة | FBS',
  robots: { index: false, follow: false }
};

const VALID_SECTIONS = new Set([
  'overview',
  'auctions',
  'bids',
  'plates',
  'favorites',
  'deposits',
  'payments',
  'profile',
  'security',
  'notifications'
]);

interface TableConfig {
  table?: string;
  owner?: string;
  columns?: string[];
}

const tableConfigs: Record<string, TableConfig> = {
  overview: {},
  auctions: {
    table: 'auction_registrations',
    owner: 'user_id',
    columns: ['auction_id', 'status', 'created_at']
  },
  bids: {
    table: 'bids',
    owner: 'user_id',
    columns: ['auction_id', 'amount_minor', 'sequence_no', 'accepted_at']
  },
  plates: {
    table: 'plates',
    owner: 'owner_id',
    columns: ['digits', 'verification_status', 'listing_status', 'created_at']
  },
  favorites: {
    table: 'favorites',
    owner: 'user_id',
    columns: ['plate_id', 'created_at']
  },
  deposits: {
    table: 'payment_authorizations',
    owner: 'user_id',
    columns: ['auction_id', 'amount_minor', 'status', 'expires_at']
  },
  payments: {
    table: 'payment_authorizations',
    owner: 'user_id',
    columns: ['id', 'status', 'captured_amount_minor', 'refunded_amount_minor']
  },
  notifications: {
    table: 'notifications',
    owner: 'user_id',
    columns: ['title', 'body', 'created_at']
  },
  profile: {},
  security: {}
};

export default async function AccountPage({
  params
}: {
  params: Promise<{ section?: string[] }>;
}) {
  const user = await getViewer();
  if (!user) {
    redirect('/login');
  }

  const { section } = await params;
  const key = section?.[0] ?? 'overview';

  if (!VALID_SECTIONS.has(key) || (section?.length ?? 0) > 1) {
    notFound();
  }

  const config = tableConfigs[key] || {};
  const [db, market, cookieStore] = await Promise.all([
    createSessionClient(),
    key === 'overview' ? getMarketplace({ auctionStatus: 'LIVE', pageSize: 5 }) : Promise.resolve(null),
    cookies()
  ]);
  let rowsData: Record<string, unknown>[] = [];
  let dataState: 'ready' | 'unavailable' = db ? 'ready' : 'unavailable';
  let profilePhone: string | null = null;
  let profileEditable = false;
  const counts: { auctions: number | null; plates: number | null; favorites: number | null } = {
    auctions: null, plates: null, favorites: null
  };

  if (config.table) {
    if (db) {
      try {
        const { data, error } = await db
          .from(config.table)
          .select(config.columns!.join(','))
          .eq(config.owner!, user.id)
          .limit(100);
        if (!error && data) {
          rowsData = data as unknown as Record<string, unknown>[];
        } else {
          dataState = 'unavailable';
        }
      } catch {
        dataState = 'unavailable';
      }
    }
  }

  if (key === 'overview' && db) {
    try {
      const [auctions, plates, favorites] = await Promise.all([
        db.from('auction_registrations').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        db.from('plates').select('*', { count: 'exact', head: true }).eq('owner_id', user.id),
        db.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
      ]);
      counts.auctions = auctions.error ? null : auctions.count;
      counts.plates = plates.error ? null : plates.count;
      counts.favorites = favorites.error ? null : favorites.count;
    } catch {
      // An unavailable count is shown as a dash rather than an invented value.
    }
  }

  if (key === 'profile' && db) {
    try {
      const { data, error } = await db.from('profiles').select('phone').eq('id', user.id).maybeSingle();
      if (!error && data) {
        profilePhone = typeof data.phone === 'string' ? data.phone : '';
        profileEditable = true;
      } else {
        dataState = 'unavailable';
      }
    } catch {
      dataState = 'unavailable';
    }
  }

  const themeCookie = cookieStore.get('fbs_signature_theme')?.value;
  const initialTheme: 'light' | 'dark' = themeCookie === 'dark' ? 'dark' : 'light';

  return (
    <AccountDashboard
      user={user}
      activeSectionKey={key}
      rowsData={rowsData}
      columns={config.columns}
      initialTheme={initialTheme}
      dataState={dataState}
      featuredPlates={market?.plates ?? []}
      marketplaceSource={market?.source}
      counts={counts}
      profilePhone={profilePhone}
      profileEditable={profileEditable}
    />
  );
}
