import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PGlite } from '@electric-sql/pglite';
import { readFile, readdir } from 'node:fs/promises';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { DEFAULT_SITE_SETTINGS } from '@/lib/site-settings-types';
import type { AdminDashboardData } from '@/components/admin/types';

vi.mock('next/navigation', () => ({
  redirect: () => {
    throw new Error('REDIRECT');
  },
  notFound: () => {
    throw new Error('NOT_FOUND');
  },
  useRouter: () => ({
    refresh: vi.fn(),
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => '/admin',
}));

import { AdminDashboard } from '@/components/admin/admin-dashboard';

let db: PGlite;
const seller = '40000000-0000-4000-8000-000000000001';
const regularUser = '40000000-0000-4000-8000-000000000002';
const admin = '40000000-0000-4000-8000-000000000003';
let privateTypeId: string;
let riyadhCityId: string;

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    create role anon;
    create role authenticated;
    create role service_role bypassrls;
    create schema auth;
    create table auth.users(
      id uuid primary key,
      raw_user_meta_data jsonb default '{}',
      raw_app_meta_data jsonb default '{}',
      email_confirmed_at timestamptz
    );
    create function auth.uid() returns uuid language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
    $$;
    grant usage on schema auth to anon, authenticated, service_role;
    grant execute on function auth.uid() to anon, authenticated, service_role;
    grant select, insert on auth.users to service_role;
    create schema storage;
    create table storage.buckets(
      id text primary key,
      name text,
      public boolean,
      file_size_limit bigint,
      allowed_mime_types text[]
    );
    create table storage.objects(
      id uuid primary key default gen_random_uuid(),
      bucket_id text,
      name text
    );
    alter table storage.objects enable row level security;
    grant usage on schema storage to authenticated, service_role;
    grant select, insert on storage.objects to authenticated;
  `);

  const files = (await readdir('supabase/migrations'))
    .filter((f) => f.endsWith('.sql'))
    .sort();
  for (const file of files) {
    await db.exec(await readFile(`supabase/migrations/${file}`, 'utf8'));
  }
  await db.exec(await readFile('supabase/seed.sql', 'utf8'));

  await db.query(
    'insert into auth.users(id, email_confirmed_at) select x::uuid, now() from unnest($1::text[]) x',
    [[seller, regularUser, admin]],
  );
  await db.query(
    `update auth.users set raw_app_meta_data = '{"role":"super_admin"}' where id = $1`,
    [admin],
  );

  const pt = await db.query<{ id: string }>(
    "select id from public.plate_types where code = 'private' limit 1",
  );
  privateTypeId = pt.rows[0].id;

  const ct = await db.query<{ id: string }>(
    "select id from public.cities where name_ar = 'الرياض' limit 1",
  );
  riyadhCityId = ct.rows[0].id;
}, 60000);

afterAll(async () => {
  await db?.close();
});

describe('Admin full-control database operations', () => {
  it('seeds Saudi regions, cities, and core legal CMS pages cleanly', async () => {
    const citiesCount = await db.query<{ count: number }>(
      'select count(*)::int as count from public.cities',
    );
    expect(citiesCount.rows[0].count).toBeGreaterThanOrEqual(20);

    const cmsCount = await db.query<{ count: number }>(
      'select count(*)::int as count from public.cms_pages where published = true',
    );
    expect(cmsCount.rows[0].count).toBeGreaterThanOrEqual(4);
  });

  it('creates, edits, and hard-deletes clean catalog plates while blocking unauthorized callers', async () => {
    const payload = {
      typeId: privateTypeId,
      cityId: riyadhCityId,
      letter1Id: 1,
      letter2Id: 2,
      letter3Id: 4,
      digits: '9',
      slug: 'admin-vip-9',
      description: 'لوحة ملكية فاخرة',
      saleMode: 'FIXED_PRICE',
      askingPriceMinor: '25000000',
      verificationStatus: 'APPROVED',
      listingStatus: 'PUBLISHED',
      featured: true,
    };

    await expect(
      db.query('select public.fbs_admin_upsert_plate($1, null, $2::jsonb, $3)', [
        regularUser,
        JSON.stringify(payload),
        'محاولة غير مصرح بها',
      ]),
    ).rejects.toThrow('FORBIDDEN');

    const created = await db.query<{ res: { id: string; slug: string; listingStatus: string } }>(
      'select public.fbs_admin_upsert_plate($1, null, $2::jsonb, $3) as res',
      [admin, JSON.stringify(payload), 'إضافة لوحة ملكية للمتجر'],
    );
    const createdId = created.rows[0].res.id;
    expect(created.rows[0].res.slug).toBe('admin-vip-9');
    expect(created.rows[0].res.listingStatus).toBe('PUBLISHED');

    const visible = await db.query<{ id: string; price_minor: string }>(
      'select id, price_minor::text from public.public_plates where id = $1',
      [createdId],
    );
    expect(visible.rows).toHaveLength(1);
    expect(visible.rows[0].price_minor).toBe('25000000');

    await db.query('select public.fbs_admin_upsert_plate($1, $2, $3::jsonb, $4)', [
      admin,
      createdId,
      JSON.stringify({ askingPriceMinor: '30000000', featured: false }),
      'تحديث سعر العرض المباشر',
    ]);

    const updated = await db.query<{ asking_price_minor: string; featured: boolean }>(
      'select asking_price_minor::text, featured from public.plates where id = $1',
      [createdId],
    );
    expect(updated.rows[0]).toEqual({ asking_price_minor: '30000000', featured: false });

    const deleted = await db.query<{ res: { mode: string } }>(
      'select public.fbs_admin_delete_plate($1, $2, false, $3) as res',
      [admin, createdId, 'حذف لوحة تجريبية من المخزون'],
    );
    expect(deleted.rows[0].res.mode).toBe('DELETED');

    const gone = await db.query('select id from public.plates where id = $1', [createdId]);
    expect(gone.rows).toHaveLength(0);
  });

  it('reviews seller plate submissions (approve & publish OR reject), notifies seller, and safely archives audited plates', async () => {
    const subPlate = await db.query<{ id: string }>(
      `insert into public.plates(
        owner_id, slug, type_id, letter_1_id, letter_2_id, letter_3_id, digits,
        city_id, verification_status, listing_status, sale_mode
      ) values ($1, 'seller-sub-88', $2, 1, 5, 7, '88', $3, 'SUBMITTED', 'DRAFT', 'FIXED_PRICE')
      returning id`,
      [seller, privateTypeId, riyadhCityId],
    );
    const subPlateId = subPlate.rows[0].id;
    await db.query(
      "insert into public.plate_submissions(plate_id, user_id, status, note) values ($1, $2, 'SUBMITTED', 'أرغب بعرض اللوحة للبيع المباشر')",
      [subPlateId, seller],
    );

    const approved = await db.query<{ res: { status: string; listingStatus: string } }>(
      'select public.fbs_admin_review_submission($1, $2, $3, $4, $5::jsonb) as res',
      [
        subPlateId,
        admin,
        'APPROVED',
        'تم التحقق من استمارة المركبة واعتماد اللوحة للنشر',
        JSON.stringify({
          saleMode: 'FIXED_PRICE',
          askingPriceMinor: '18500000',
          listingStatus: 'PUBLISHED',
          featured: true,
        }),
      ],
    );
    expect(approved.rows[0].res).toMatchObject({
      status: 'APPROVED',
      listingStatus: 'PUBLISHED',
    });

    const inPublicView = await db.query<{ id: string }>(
      'select id from public.public_plates where id = $1',
      [subPlateId],
    );
    expect(inPublicView.rows).toHaveLength(1);

    const sellerNotifs = await db.query<{ title: string }>(
      "select title from public.notifications where user_id = $1 and type = 'plate.review'",
      [seller],
    );
    expect(sellerNotifs.rows[0].title).toContain('اعتماد');

    // Deleting a plate that has immutable plate_verification_events safely archives it
    const archived = await db.query<{ res: { mode: string } }>(
      'select public.fbs_admin_delete_plate($1, $2, false, $3) as res',
      [admin, subPlateId, 'إزالة اللوحة من المتجر مع حفظ سجل التدقيق'],
    );
    expect(archived.rows[0].res.mode).toBe('ARCHIVED');

    const hiddenAfterArchive = await db.query<{ id: string }>(
      'select id from public.public_plates where id = $1',
      [subPlateId],
    );
    expect(hiddenAfterArchive.rows).toHaveLength(0);
  });

  it('creates auctions and executes full time & lifecycle controls (go live, +15m, -5m, set time, pause, resume, finalize)', async () => {
    const createdPlate = await db.query<{ res: { id: string } }>(
      'select public.fbs_admin_upsert_plate($1, null, $2::jsonb, $3) as res',
      [
        admin,
        JSON.stringify({
          typeId: privateTypeId,
          cityId: riyadhCityId,
          letter1Id: 2,
          letter2Id: 3,
          letter3Id: 5,
          digits: '555',
          slug: 'auction-ctrl-555',
          saleMode: 'AUCTION',
          verificationStatus: 'APPROVED',
          listingStatus: 'PUBLISHED',
        }),
        'تجهيز لوحة للمزاد',
      ],
    );
    const auctionPlateId = createdPlate.rows[0].res.id;

    const startIso = new Date(Date.now() + 3600_000).toISOString();
    const endIso = new Date(Date.now() + 7200_000).toISOString();

    const saved = await db.query<{ res: { id: string; status: string } }>(
      'select public.fbs_admin_save_auction($1, null, $2::jsonb, $3) as res',
      [
        admin,
        JSON.stringify({
          plateId: auctionPlateId,
          status: 'SCHEDULED',
          startingPrice: '5000000',
          minimumIncrement: '100000',
          depositAmount: '250000',
          startAt: startIso,
          endAt: endIso,
          antiSniping: true,
          windowSeconds: 120,
          extensionSeconds: 180,
          maxExtensions: 5,
        }),
        'إنشاء مزاد مجدول',
      ],
    );
    const auctionId = saved.rows[0].res.id;
    expect(saved.rows[0].res.status).toBe('SCHEDULED');

    // Start immediately
    const liveRes = await db.query<{ res: { status: string; effectiveEndAt: string } }>(
      "select public.fbs_admin_auction_control($1, $2, 'GO_LIVE_NOW', null, null, $3) as res",
      [auctionId, admin, 'بدء المزاد فوراً بقرار الإدارة'],
    );
    expect(liveRes.rows[0].res.status).toBe('LIVE');
    const beforeExtend = new Date(liveRes.rows[0].res.effectiveEndAt).getTime();

    // Extend +15 minutes
    const extRes = await db.query<{ res: { effectiveEndAt: string } }>(
      "select public.fbs_admin_auction_control($1, $2, 'EXTEND_MINUTES', 15, null, $3) as res",
      [auctionId, admin, 'تمديد وقت المزاد 15 دقيقة'],
    );
    const afterExtend = new Date(extRes.rows[0].res.effectiveEndAt).getTime();
    expect(Math.round((afterExtend - beforeExtend) / 60000)).toBe(15);

    // Reduce -5 minutes
    const subRes = await db.query<{ res: { effectiveEndAt: string } }>(
      "select public.fbs_admin_auction_control($1, $2, 'EXTEND_MINUTES', -5, null, $3) as res",
      [auctionId, admin, 'تقليص وقت المزاد 5 دقائق'],
    );
    const afterSub = new Date(subRes.rows[0].res.effectiveEndAt).getTime();
    expect(Math.round((afterExtend - afterSub) / 60000)).toBe(5);

    // Pause & Resume
    const paused = await db.query<{ res: { status: string } }>(
      "select public.fbs_admin_auction_control($1, $2, 'PAUSE', null, null, $3) as res",
      [auctionId, admin, 'إيقاف مؤقت للمراجعة'],
    );
    expect(paused.rows[0].res.status).toBe('PAUSED');

    const resumed = await db.query<{ res: { status: string } }>(
      "select public.fbs_admin_auction_control($1, $2, 'RESUME', null, null, $3) as res",
      [auctionId, admin, 'استئناف المزاد'],
    );
    expect(resumed.rows[0].res.status).toBe('LIVE');

    // Finalize immediately
    const finalized = await db.query<{ res: { command: string } }>(
      "select public.fbs_admin_auction_control($1, $2, 'FINALIZE_NOW', null, null, $3) as res",
      [auctionId, admin, 'إغلاق وترسية فورية'],
    );
    expect(finalized.rows[0].res.command).toBe('FINALIZE_NOW');

    const finalAuction = await db.query<{ status: string }>(
      'select status from public.auctions where id = $1',
      [auctionId],
    );
    expect(['ENDED', 'COMPLETED', 'RESERVE_NOT_MET']).toContain(finalAuction.rows[0].status);
  });
});

describe('Executive AdminDashboard UI rendering', () => {
  const sampleData: AdminDashboardData = {
    activeSection: 'overview',
    viewer: {
      id: admin,
      email: 'admin@fbs-plates.sa',
      displayName: 'فارس الإداري',
      roles: ['super_admin'],
      permissions: ['admin.view', 'plate.verify', 'auction.edit', 'cms.manage', 'settings.manage'],
      mfaVerified: true,
      mfaFactorId: 'factor-1',
    },
    badges: {
      pendingVerifications: 1,
      liveAuctions: 1,
      pendingIdentities: 0,
      newMessages: 1,
      activeSettlements: 0,
    },
    letters: [
      { id: 1, arabic: 'أ', latin: 'A', sort_order: 1, active: true },
      { id: 2, arabic: 'ب', latin: 'B', sort_order: 2, active: true },
    ],
    plateTypes: [
      {
        id: 'pt-1',
        code: 'private',
        name_ar: 'خصوصي',
        name_en: 'Private',
        active: true,
        sort_order: 1,
      },
    ],
    regions: [{ id: 'reg-1', code: 'riyadh', name_ar: 'الرياض', name_en: 'Riyadh' }],
    cities: [
      { id: 'city-1', region_id: 'reg-1', name_ar: 'الرياض', name_en: 'Riyadh', active: true },
    ],
    plates: [
      {
        id: 'plate-pending-1',
        slug: 'plate-pending-1',
        owner_id: seller,
        owner_name: 'سعود العارض',
        owner_phone: '0501234567',
        owner_kyc: 'VERIFIED',
        type_id: 'pt-1',
        type_name: 'خصوصي',
        type_code: 'private',
        city_id: 'city-1',
        city_name: 'الرياض',
        letter_1_id: 1,
        letter_2_id: 1,
        letter_3_id: 2,
        letters_ar: ['أ', 'أ', 'ب'],
        letters_en: ['A', 'A', 'B'],
        digits: '10',
        description: 'لوحة مميزة معروضة من المالك',
        verification_status: 'SUBMITTED',
        listing_status: 'DRAFT',
        sale_mode: 'FIXED_PRICE',
        asking_price_minor: '12000000',
        featured: false,
        views_count: 14,
        favorites_count: 2,
        created_at: '2026-11-04T10:00:00Z',
        updated_at: '2026-11-04T10:00:00Z',
        submission_note: 'مرفق صورة الاستمارة الأصلية',
        submitted_at: '2026-11-04T10:05:00Z',
        documents: [],
        events: [],
        active_auction_id: null,
        active_auction_status: null,
      },
    ],
    auctions: [
      {
        id: 'auc-live-1',
        slug: 'auc-live-1',
        plate_id: 'plate-pending-1',
        plate_slug: 'plate-pending-1',
        letters_ar: ['أ', 'أ', 'ب'],
        letters_en: ['A', 'A', 'B'],
        digits: '1',
        plate_type: 'خصوصي',
        city_name: 'الرياض',
        status: 'LIVE',
        starting_price: '10000000',
        current_price: '15500000',
        reserve_price: null,
        minimum_increment: '500000',
        deposit_type: 'NONE',
        deposit_amount: null,
        require_kyc: true,
        registration_start_at: '2026-11-03T10:00:00Z',
        registration_end_at: '2026-11-04T08:00:00Z',
        start_at: '2026-11-04T09:00:00Z',
        scheduled_end_at: '2026-11-05T09:00:00Z',
        effective_end_at: '2026-11-05T09:00:00Z',
        anti_sniping_enabled: true,
        extension_window_seconds: 300,
        extension_duration_seconds: 300,
        max_extensions: 3,
        extension_count: 0,
        sequence_no: 4,
        commission_type: 'NONE',
        commission_value: null,
        winner_id: null,
        winning_amount: null,
        paused_from_status: null,
        cancellation_reason: null,
        registrations_count: 6,
        bids_count: 4,
        created_at: '2026-11-03T10:00:00Z',
        updated_at: '2026-11-04T12:00:00Z',
      },
    ],
    registrations: [],
    bids: [],
    users: [],
    identities: [],
    deposits: [],
    payments: [],
    settlements: [],
    reports: [],
    cmsPages: [
      {
        slug: 'terms',
        title_ar: 'الشروط والأحكام العامة',
        body_ar: 'نص الشروط والأحكام',
        published: true,
        updated_at: '2026-11-04T10:00:00Z',
      },
    ],
    faqs: [],
    siteSettings: DEFAULT_SITE_SETTINGS,
    featureFlags: [],
    messages: [],
    notifications: [],
    auditLogs: [],
  };

  it('renders executive overview, approval queues, plates, live timing controls, CMS, and settings cleanly', () => {
    const overviewHtml = renderToStaticMarkup(
      React.createElement(AdminDashboard, { data: sampleData }),
    );
    expect(overviewHtml).toContain('النظرة التنفيذية');
    expect(overviewHtml).toContain('اعتماد لوحات الملاك');
    expect(overviewHtml).toContain('فارس الإداري');

    const verificationsHtml = renderToStaticMarkup(
      React.createElement(AdminDashboard, {
        data: { ...sampleData, activeSection: 'verifications' },
      }),
    );
    expect(verificationsHtml).toContain('سعود العارض');
    expect(verificationsHtml).toContain('مرفق صورة الاستمارة الأصلية');

    const liveHtml = renderToStaticMarkup(
      React.createElement(AdminDashboard, {
        data: { ...sampleData, activeSection: 'live' },
      }),
    );
    expect(liveHtml).toContain('+15 د');
    expect(liveHtml).toContain('صالة المراقبة والوقت');

    const cmsHtml = renderToStaticMarkup(
      React.createElement(AdminDashboard, {
        data: { ...sampleData, activeSection: 'cms' },
      }),
    );
    expect(cmsHtml).toContain('الشروط والأحكام العامة');

    const settingsHtml = renderToStaticMarkup(
      React.createElement(AdminDashboard, {
        data: { ...sampleData, activeSection: 'settings' },
      }),
    );
    expect(settingsHtml).toContain('966500000000');
  });
});
