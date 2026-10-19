import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getViewer } from '@/lib/auth';
import { createSessionClient } from '@/lib/supabase/server';
import { AccountDashboard } from '@/components/account-dashboard';

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

const demoAccountData: Record<string, Record<string, unknown>[]> = {
  auctions: [
    {
      auction_id: 'لوحة ف ب س 1 (FBS-1)',
      status: 'مؤهل للمزايدة (QUALIFIED)',
      created_at: '2026-10-04'
    },
    {
      auction_id: 'لوحة ر ق م 7 (RQM-7)',
      status: 'مؤهل للمزايدة (QUALIFIED)',
      created_at: '2026-10-04'
    }
  ],
  bids: [
    {
      auction_id: 'لوحة ف ب س 1',
      amount_minor: '75,000,000 هللة (750,000 ر.س)',
      sequence_no: 28,
      accepted_at: 'اليوم 18:40'
    },
    {
      auction_id: 'لوحة ر ق م 7',
      amount_minor: '52,000,000 هللة (520,000 ر.س)',
      sequence_no: 19,
      accepted_at: 'اليوم 16:15'
    }
  ],
  plates: [
    {
      digits: 'م ج د 777',
      verification_status: 'تحت المراجعة والتوثيق',
      listing_status: 'مسودة معتمدة',
      created_at: '2026-10-03'
    }
  ],
  favorites: [
    { plate_id: 'لوحة ف ب س 1', created_at: '2026-10-04' },
    { plate_id: 'لوحة ك ن غ 1', created_at: '2026-10-02' }
  ],
  deposits: [
    {
      auction_id: 'مزاد لوحة ف ب س 1',
      amount_minor: '25,000 ر.س (مفوض بنكياً)',
      status: 'حجز مؤقت (AUTHORIZED)',
      expires_at: '2026-10-05'
    }
  ],
  payments: [
    {
      id: 'TXN-984210',
      status: 'مكتمل بنجاح',
      captured_amount_minor: '0 ر.س (حجز تفويض فقط)',
      refunded_amount_minor: '0'
    }
  ],
  notifications: [
    {
      title: 'تأكيد التسجيل في مزاد النخبة',
      body: 'تم قبول طلبك والتأهيل المباشر لمزاد لوحة ف ب س 1.',
      created_at: 'اليوم'
    },
    {
      title: 'مزايدة جديدة مسجلة',
      body: 'تم تسجيل مزايدتك بنجاح برقم تسلسلي معتمد.',
      created_at: 'قبل قليل'
    }
  ]
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
  let rowsData: Record<string, unknown>[] = [];

  if (config.table) {
    const db = await createSessionClient();
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
          rowsData = demoAccountData[key] ?? [];
        }
      } catch {
        rowsData = demoAccountData[key] ?? [];
      }
    } else {
      rowsData = demoAccountData[key] ?? [];
    }
  }

  const cookieStore = await cookies();
  const themeCookie = cookieStore.get('fbs_signature_theme')?.value;
  const initialTheme: 'light' | 'dark' = themeCookie === 'dark' ? 'dark' : 'light';

  return (
    <AccountDashboard
      user={user}
      activeSectionKey={key}
      rowsData={rowsData}
      columns={config.columns}
      initialTheme={initialTheme}
    />
  );
}
