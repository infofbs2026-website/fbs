import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Lock, ShieldAlert } from 'lucide-react';
import { getViewerAdminAccess } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/server';
import { getSiteSettings } from '@/lib/site-settings';
import { masterFaqData } from '@/lib/faq-data';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
import type {
  AdminAuctionRecord,
  AdminAuctionResultRecord,
  AdminAuditLogRecord,
  AdminBidRecord,
  AdminCityRef,
  AdminCmsPageRecord,
  AdminContactMessageRecord,
  AdminDashboardData,
  AdminDepositRecord,
  AdminFaqRecord,
  AdminFeatureFlagRecord,
  AdminIdentityRecord,
  AdminLetterRef,
  AdminNotificationRecord,
  AdminPaymentTxRecord,
  AdminPlateDocument,
  AdminPlateRecord,
  AdminPlateTypeRef,
  AdminRegionRef,
  AdminRegistrationRecord,
  AdminSectionKey,
  AdminSettlementRecord,
  AdminUserRecord,
  AdminVerificationEvent,
} from '@/components/admin/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'لوحة تحكم الإدارة التنفيذية | فارس بن سعود',
  robots: { index: false, follow: false },
};

const VALID_SECTIONS = new Set<AdminSectionKey>([
  'overview',
  'verifications',
  'plates',
  'auctions',
  'live',
  'cms',
  'settings',
  'identities',
  'users',
  'registrations',
  'bids',
  'deposits',
  'payments',
  'settlements',
  'reports',
  'messages',
  'notifications',
  'audit',
]);

const ACTIVE_AUCTION_STATUSES = new Set([
  'DRAFT',
  'PENDING_APPROVAL',
  'SCHEDULED',
  'REGISTRATION_OPEN',
  'WAITING_ROOM',
  'LIVE',
  'ENDING',
  'PAUSED',
]);

function strOrNull(val: unknown): string | null {
  if (val === null || val === undefined || val === '') return null;
  return String(val);
}

function strOrZero(val: unknown): string {
  if (val === null || val === undefined || val === '') return '0';
  return String(val);
}

export default async function AdminSectionPage({
  params,
}: {
  params: Promise<{ section?: string[] }>;
}) {
  const { section } = await params;
  if ((section?.length ?? 0) > 1) {
    notFound();
  }

  const rawKey = (section?.[0] ?? 'overview') as AdminSectionKey;
  if (!VALID_SECTIONS.has(rawKey)) {
    notFound();
  }

  const access = await getViewerAdminAccess();
  if (!access.viewer) {
    redirect('/login');
  }

  if (!access.isAdmin) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex items-center justify-center bg-[#f6f4ef] px-4 py-16"
      >
        <div className="max-w-lg w-full rounded-3xl border border-[#1a2234]/10 bg-white p-8 shadow-xl text-center space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#b89249]/15 text-[#9a7632]">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-2xl font-extrabold text-[#111827]">
            الوصول مقتصر على الإدارة التنفيذية
          </h1>
          <p className="text-sm leading-7 text-[#4b5563]">
            حسابك الحالي ({access.viewer.email}) لا يحمل صلاحيات الوصول إلى غرفة القيادة
            الإدارية لمنصة فارس بن سعود. تواصل مع المدير العام لمنحك الدور الإداري المناسب.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/account"
              className="rounded-xl bg-[#111827] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1f2937] transition"
            >
              لوحة حسابي
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-[#111827]/15 px-5 py-2.5 text-sm font-bold text-[#111827] hover:bg-[#f9fafb] transition"
            >
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const db = createAdminClient();
  if (!db) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex items-center justify-center bg-[#f6f4ef] px-4 py-16"
      >
        <div className="max-w-lg w-full rounded-3xl border border-[#1a2234]/10 bg-white p-8 shadow-xl text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-700">
            <Lock size={28} />
          </div>
          <h1 className="text-xl font-extrabold text-[#111827]">
            اتصال قاعدة البيانات الإدارية غير مهيأ
          </h1>
          <p className="text-sm leading-7 text-[#4b5563]">
            تأكد من ضبط المتغير <code dir="ltr">SUPABASE_SERVICE_ROLE_KEY</code> في بيئة التشغيل
            لتفعيل لوحة الإدارة الكاملة.
          </p>
        </div>
      </div>
    );
  }

  const canReadIdentities =
    access.mfaVerified &&
    (access.permissions.includes('identity.review') || access.roles.includes('super_admin'));

  const [
    siteSettings,
    lettersRes,
    plateTypesRes,
    regionsRes,
    citiesRes,
    profilesRes,
    userRolesRes,
    platesRes,
    plateDocsRes,
    plateSubsRes,
    plateEventsRes,
    auctionsRes,
    registrationsRes,
    bidsRes,
    depositsRes,
    paymentsRes,
    settlementsRes,
    reportsRes,
    cmsPagesRes,
    faqsRes,
    featureFlagsRes,
    messagesRes,
    notificationsRes,
    auditLogsRes,
    identitiesRes,
    authUsersRes,
    auditClearedRes,
  ] = await Promise.all([
    getSiteSettings(),
    db
      .from('plate_letters')
      .select('id,arabic,latin,sort_order,active')
      .order('sort_order', { ascending: true }),
    db
      .from('plate_types')
      .select('id,code,name_ar,name_en,active,sort_order')
      .order('sort_order', { ascending: true }),
    db.from('regions').select('id,code,name_ar,name_en').order('code', { ascending: true }),
    db
      .from('cities')
      .select('id,region_id,name_ar,name_en,active')
      .order('name_ar', { ascending: true }),
    db
      .from('profiles')
      .select('id,display_name,phone,status,kyc_status,created_at')
      .order('created_at', { ascending: false })
      .limit(500),
    db.from('user_roles').select('user_id,role_code').limit(2000),
    db
      .from('plates')
      .select(
        'id,owner_id,slug,type_id,letter_1_id,letter_2_id,letter_3_id,digits,city_id,description,verification_status,listing_status,sale_mode,asking_price_minor,featured,views_count,favorites_count,created_at,updated_at',
      )
      .order('created_at', { ascending: false })
      .limit(500),
    db
      .from('plate_documents')
      .select('id,plate_id,document_type,mime_type,size_bytes,object_path,created_at')
      .order('created_at', { ascending: false })
      .limit(1000),
    db
      .from('plate_submissions')
      .select('id,plate_id,user_id,submitted_at,status,note')
      .order('submitted_at', { ascending: false })
      .limit(1000),
    db
      .from('plate_verification_events')
      .select('id,plate_id,actor_id,previous_status,status,reason,created_at')
      .order('created_at', { ascending: false })
      .limit(1000),
    db
      .from('auctions')
      .select(
        'id,plate_id,slug,status,starting_price,current_price,reserve_price,minimum_increment,deposit_type,deposit_amount,require_kyc,registration_start_at,registration_end_at,start_at,scheduled_end_at,effective_end_at,anti_sniping_enabled,extension_window_seconds,extension_duration_seconds,max_extensions,extension_count,sequence_no,winner_id,winning_amount,commission_type,commission_value,cancellation_reason,paused_from_status,created_at,updated_at',
      )
      .order('created_at', { ascending: false })
      .limit(300),
    db
      .from('auction_registrations')
      .select(
        'id,auction_id,user_id,status,bidder_alias,required_deposit_minor,qualified_at,created_at',
      )
      .order('created_at', { ascending: false })
      .limit(500),
    db
      .from('bids')
      .select('id,auction_id,user_id,amount_minor,sequence_no,accepted_at')
      .order('accepted_at', { ascending: false })
      .limit(500),
    db
      .from('payment_authorizations')
      .select(
        'id,user_id,auction_id,provider,amount_minor,captured_amount_minor,refunded_amount_minor,status,expires_at,created_at',
      )
      .order('created_at', { ascending: false })
      .limit(300),
    db
      .from('payment_transactions')
      .select(
        'id,authorization_id,operation,amount_minor,status,reason,provider_transaction_id,error_code,created_at',
      )
      .order('created_at', { ascending: false })
      .limit(300),
    db
      .from('settlements')
      .select(
        'id,auction_id,seller_id,winner_id,winning_amount_minor,commission_minor,remaining_amount_minor,status,created_at,updated_at',
      )
      .order('created_at', { ascending: false })
      .limit(300),
    db
      .from('auction_results')
      .select('id,auction_id,outcome,winner_id,winning_amount_minor,final_sequence,finalized_at')
      .order('finalized_at', { ascending: false })
      .limit(300),
    db
      .from('cms_pages')
      .select('slug,title_ar,body_ar,published,updated_at')
      .order('updated_at', { ascending: false }),
    db
      .from('faqs')
      .select('id,question_ar,answer_ar,question_en,sort_order,published')
      .order('sort_order', { ascending: true }),
    db
      .from('feature_flags')
      .select('key,enabled,description,updated_at')
      .order('key', { ascending: true }),
    db
      .from('contact_messages')
      .select('id,user_id,name,email,subject,message,status,created_at')
      .order('created_at', { ascending: false })
      .limit(300),
    db
      .from('notifications')
      .select('id,user_id,type,title,body,href,read_at,created_at')
      .order('created_at', { ascending: false })
      .limit(300),
    db
      .from('audit_logs')
      .select('id,actor_id,action,entity_type,entity_id,reason,before_data,after_data,created_at')
      .order('created_at', { ascending: false })
      .limit(300),
    canReadIdentities
      ? db
          .from('identity_verification_requests')
          .select(
            'id,full_name,national_id,birth_date,phone,email,city,status,submitted_at,review_reason',
          )
          .order('submitted_at', { ascending: false })
          .limit(200)
      : Promise.resolve({ data: [], error: null }),
    db.auth.admin.listUsers({ page: 1, perPage: 500 }).catch(() => ({ data: { users: [] }, error: null })),
    db.from('system_settings').select('value').eq('key', 'audit_cleared_at').maybeSingle(),
  ]);

  const mfaByUserId = new Map<string, boolean>();
  for (const au of authUsersRes?.data?.users ?? []) {
    const hasTotp = Array.isArray(au.factors) && au.factors.some((f) => f.status === 'verified');
    const hasMeta = Boolean(
      au.app_metadata?.mfa_enabled ||
      au.app_metadata?.mfa_verified ||
      au.user_metadata?.mfa_enabled ||
      au.user_metadata?.mfa_verified,
    );
    mfaByUserId.set(String(au.id), Boolean(hasTotp || hasMeta));
  }

  const letters: AdminLetterRef[] = (lettersRes.data ?? []).map((row) => ({
    id: Number(row.id),
    arabic: String(row.arabic),
    latin: String(row.latin),
    sort_order: Number(row.sort_order ?? 0),
    active: Boolean(row.active),
  }));
  const letterById = new Map(letters.map((l) => [l.id, l]));

  const plateTypes: AdminPlateTypeRef[] = (plateTypesRes.data ?? []).map((row) => ({
    id: String(row.id),
    code: String(row.code),
    name_ar: String(row.name_ar),
    name_en: String(row.name_en),
    active: Boolean(row.active),
    sort_order: Number(row.sort_order ?? 0),
  }));
  const typeById = new Map(plateTypes.map((t) => [t.id, t]));

  const regions: AdminRegionRef[] = (regionsRes.data ?? []).map((row) => ({
    id: String(row.id),
    code: String(row.code),
    name_ar: String(row.name_ar),
    name_en: String(row.name_en),
  }));

  const cities: AdminCityRef[] = (citiesRes.data ?? []).map((row) => ({
    id: String(row.id),
    region_id: String(row.region_id),
    name_ar: String(row.name_ar),
    name_en: String(row.name_en),
    active: Boolean(row.active),
  }));
  const cityById = new Map(cities.map((c) => [c.id, c]));

  const rolesByUserId = new Map<string, string[]>();
  for (const r of userRolesRes.data ?? []) {
    const uid = String(r.user_id);
    const code = String(r.role_code);
    const list = rolesByUserId.get(uid) ?? [];
    if (!list.includes(code)) list.push(code);
    rolesByUserId.set(uid, list);
  }

  const profileById = new Map<
    string,
    { display_name: string; phone: string | null; status: string; kyc_status: string }
  >();
  for (const p of profilesRes.data ?? []) {
    profileById.set(String(p.id), {
      display_name: String(p.display_name || 'مستخدم'),
      phone: strOrNull(p.phone),
      status: String(p.status || 'ACTIVE'),
      kyc_status: String(p.kyc_status || 'UNVERIFIED'),
    });
  }

  const docsByPlateId = new Map<string, AdminPlateDocument[]>();
  for (const doc of plateDocsRes.data ?? []) {
    const pid = String(doc.plate_id);
    const arr = docsByPlateId.get(pid) ?? [];
    arr.push({
      id: String(doc.id),
      plate_id: pid,
      document_type: String(doc.document_type || 'OWNERSHIP'),
      mime_type: String(doc.mime_type || 'application/octet-stream'),
      size_bytes: Number(doc.size_bytes ?? 0),
      object_path: String(doc.object_path),
      created_at: String(doc.created_at),
    });
    docsByPlateId.set(pid, arr);
  }

  const latestSubByPlateId = new Map<string, { note: string | null; submitted_at: string }>();
  for (const sub of plateSubsRes.data ?? []) {
    const pid = String(sub.plate_id);
    if (!latestSubByPlateId.has(pid)) {
      latestSubByPlateId.set(pid, {
        note: strOrNull(sub.note),
        submitted_at: String(sub.submitted_at),
      });
    }
  }

  const eventsByPlateId = new Map<string, AdminVerificationEvent[]>();
  for (const ev of plateEventsRes.data ?? []) {
    const pid = String(ev.plate_id);
    const arr = eventsByPlateId.get(pid) ?? [];
    arr.push({
      id: String(ev.id),
      plate_id: pid,
      actor_id: String(ev.actor_id ?? ''),
      previous_status: String(ev.previous_status ?? ''),
      status: String(ev.status ?? ''),
      reason: String(ev.reason ?? ''),
      created_at: String(ev.created_at),
    });
    eventsByPlateId.set(pid, arr);
  }

  const activeAuctionByPlateId = new Map<string, { id: string; status: string }>();
  for (const auc of auctionsRes.data ?? []) {
    const pid = String(auc.plate_id);
    const st = String(auc.status);
    if (ACTIVE_AUCTION_STATUSES.has(st) && !activeAuctionByPlateId.has(pid)) {
      activeAuctionByPlateId.set(pid, { id: String(auc.id), status: st });
    }
  }

  const platesCountByOwner = new Map<string, number>();
  const plateRecordById = new Map<string, AdminPlateRecord>();
  const plateLabelById = new Map<string, string>();

  const plates: AdminPlateRecord[] = (platesRes.data ?? [])
    .filter((row) => {
      const owner = profileById.get(String(row.owner_id));
      if (owner?.status === 'CLOSED' && String(row.listing_status) === 'ARCHIVED') {
        return false;
      }
      return true;
    })
    .map((row) => {
    const id = String(row.id);
    const ownerId = String(row.owner_id);
    platesCountByOwner.set(ownerId, (platesCountByOwner.get(ownerId) ?? 0) + 1);

    const owner = profileById.get(ownerId);
    const type = typeById.get(String(row.type_id));
    const city = row.city_id ? cityById.get(String(row.city_id)) : undefined;
    const l1 = letterById.get(Number(row.letter_1_id));
    const l2 = letterById.get(Number(row.letter_2_id));
    const l3 = letterById.get(Number(row.letter_3_id));
    const lettersAr = [l1?.arabic ?? 'أ', l2?.arabic ?? 'أ', l3?.arabic ?? 'أ'];
    const lettersEn = [l1?.latin ?? 'A', l2?.latin ?? 'A', l3?.latin ?? 'A'];
    const digits = String(row.digits);
    const sub = latestSubByPlateId.get(id);
    const activeAuction = activeAuctionByPlateId.get(id);

    const label = `${lettersAr.join(' ')} — ${digits}`;
    plateLabelById.set(id, label);

    const plateRec: AdminPlateRecord = {
      id,
      slug: String(row.slug),
      owner_id: ownerId,
      owner_name: owner?.display_name ?? 'حساب المخزون الرسمي',
      owner_phone: owner?.phone ?? null,
      owner_kyc: owner?.kyc_status ?? 'UNVERIFIED',
      type_id: String(row.type_id),
      type_name: type?.name_ar ?? 'خصوصي',
      type_code: type?.code ?? 'private',
      city_id: strOrNull(row.city_id),
      city_name: city?.name_ar ?? 'الرياض',
      letter_1_id: Number(row.letter_1_id),
      letter_2_id: Number(row.letter_2_id),
      letter_3_id: Number(row.letter_3_id),
      letters_ar: lettersAr,
      letters_en: lettersEn,
      digits,
      description: String(row.description ?? ''),
      verification_status: String(row.verification_status),
      listing_status: String(row.listing_status),
      sale_mode: String(row.sale_mode),
      asking_price_minor: strOrNull(row.asking_price_minor),
      featured: Boolean(row.featured),
      views_count: Number(row.views_count ?? 0),
      favorites_count: Number(row.favorites_count ?? 0),
      created_at: String(row.created_at),
      updated_at: String(row.updated_at),
      submission_note: sub?.note ?? null,
      submitted_at: sub?.submitted_at ?? null,
      documents: docsByPlateId.get(id) ?? [],
      events: eventsByPlateId.get(id) ?? [],
      active_auction_id: activeAuction?.id ?? null,
      active_auction_status: activeAuction?.status ?? null,
    };
    plateRecordById.set(id, plateRec);
    return plateRec;
  });

  const regCountByAuction = new Map<string, number>();
  for (const reg of registrationsRes.data ?? []) {
    const aid = String(reg.auction_id);
    regCountByAuction.set(aid, (regCountByAuction.get(aid) ?? 0) + 1);
  }

  const bidsCountByAuction = new Map<string, number>();
  const bidsCountByUser = new Map<string, number>();
  for (const bid of bidsRes.data ?? []) {
    const aid = String(bid.auction_id);
    const uid = String(bid.user_id);
    bidsCountByAuction.set(aid, (bidsCountByAuction.get(aid) ?? 0) + 1);
    bidsCountByUser.set(uid, (bidsCountByUser.get(uid) ?? 0) + 1);
  }

  const plateLabelByAuctionId = new Map<string, string>();
  const auctions: AdminAuctionRecord[] = (auctionsRes.data ?? []).map((row) => {
    const id = String(row.id);
    const pid = String(row.plate_id);
    const plate = plateRecordById.get(pid);
    const label = plateLabelById.get(pid) ?? String(row.slug);
    plateLabelByAuctionId.set(id, label);

    return {
      id,
      slug: String(row.slug),
      plate_id: pid,
      plate_slug: plate?.slug ?? String(row.slug),
      letters_ar: plate?.letters_ar ?? ['أ', 'أ', 'أ'],
      letters_en: plate?.letters_en ?? ['A', 'A', 'A'],
      digits: plate?.digits ?? '1',
      plate_type: plate?.type_name ?? 'خصوصي',
      city_name: plate?.city_name ?? 'الرياض',
      status: String(row.status),
      starting_price: strOrZero(row.starting_price),
      current_price: strOrZero(row.current_price),
      reserve_price: strOrNull(row.reserve_price),
      minimum_increment: strOrZero(row.minimum_increment),
      deposit_type: String(row.deposit_type ?? 'NONE'),
      deposit_amount: strOrNull(row.deposit_amount),
      require_kyc: Boolean(row.require_kyc),
      registration_start_at: String(row.registration_start_at),
      registration_end_at: String(row.registration_end_at),
      start_at: String(row.start_at),
      scheduled_end_at: String(row.scheduled_end_at),
      effective_end_at: String(row.effective_end_at),
      anti_sniping_enabled: Boolean(row.anti_sniping_enabled),
      extension_window_seconds:
        row.extension_window_seconds !== null && row.extension_window_seconds !== undefined
          ? Number(row.extension_window_seconds)
          : null,
      extension_duration_seconds:
        row.extension_duration_seconds !== null && row.extension_duration_seconds !== undefined
          ? Number(row.extension_duration_seconds)
          : null,
      max_extensions:
        row.max_extensions !== null && row.max_extensions !== undefined
          ? Number(row.max_extensions)
          : null,
      extension_count: Number(row.extension_count ?? 0),
      sequence_no: Number(row.sequence_no ?? 0),
      commission_type: String(row.commission_type ?? 'NONE'),
      commission_value: strOrNull(row.commission_value),
      winner_id: strOrNull(row.winner_id),
      winning_amount: strOrNull(row.winning_amount),
      paused_from_status: strOrNull(row.paused_from_status),
      cancellation_reason: strOrNull(row.cancellation_reason),
      registrations_count: regCountByAuction.get(id) ?? 0,
      bids_count: bidsCountByAuction.get(id) ?? 0,
      created_at: String(row.created_at),
      updated_at: String(row.updated_at),
    };
  });

  const registrations: AdminRegistrationRecord[] = (registrationsRes.data ?? []).map((row) => {
    const uid = String(row.user_id);
    const aid = String(row.auction_id);
    const user = profileById.get(uid);
    return {
      id: String(row.id),
      auction_id: aid,
      plate_label: plateLabelByAuctionId.get(aid) ?? aid.slice(0, 8),
      user_id: uid,
      user_name: user?.display_name ?? uid.slice(0, 8),
      user_phone: user?.phone ?? null,
      user_kyc: user?.kyc_status ?? 'UNVERIFIED',
      status: String(row.status),
      bidder_alias: String(row.bidder_alias ?? ''),
      required_deposit_minor: strOrZero(row.required_deposit_minor),
      qualified_at: strOrNull(row.qualified_at),
      created_at: String(row.created_at),
    };
  });

  const bids: AdminBidRecord[] = (bidsRes.data ?? []).map((row) => {
    const uid = String(row.user_id);
    const aid = String(row.auction_id);
    const user = profileById.get(uid);
    return {
      id: String(row.id),
      auction_id: aid,
      plate_label: plateLabelByAuctionId.get(aid) ?? aid.slice(0, 8),
      user_id: uid,
      user_name: user?.display_name ?? uid.slice(0, 8),
      amount_minor: strOrZero(row.amount_minor),
      sequence_no: Number(row.sequence_no ?? 0),
      accepted_at: String(row.accepted_at),
    };
  });

  const users: AdminUserRecord[] = (profilesRes.data ?? [])
    .filter((row) => String(row.status || 'ACTIVE') !== 'CLOSED')
    .map((row) => {
      const uid = String(row.id);
      return {
        id: uid,
        display_name: String(row.display_name || 'مستخدم'),
        phone: strOrNull(row.phone),
        status: String(row.status || 'ACTIVE'),
        kyc_status: String(row.kyc_status || 'UNVERIFIED'),
        mfa_enabled: Boolean(
          mfaByUserId.get(uid) || (uid === access.viewer?.id && access.mfaVerified),
        ),
        roles: rolesByUserId.get(uid) ?? [],
        plates_count: platesCountByOwner.get(uid) ?? 0,
        bids_count: bidsCountByUser.get(uid) ?? 0,
        created_at: String(row.created_at),
      };
    });

  const identities: AdminIdentityRecord[] = (identitiesRes.data ?? []).map((row) => ({
    id: String(row.id),
    full_name: String(row.full_name ?? ''),
    national_id: String(row.national_id ?? ''),
    birth_date: String(row.birth_date ?? ''),
    phone: String(row.phone ?? ''),
    email: String(row.email ?? ''),
    city: String(row.city ?? ''),
    status: String(row.status ?? 'PENDING'),
    submitted_at: String(row.submitted_at),
    review_reason: strOrNull(row.review_reason),
  }));

  const deposits: AdminDepositRecord[] = (depositsRes.data ?? []).map((row) => {
    const uid = String(row.user_id);
    const aid = String(row.auction_id);
    return {
      id: String(row.id),
      user_id: uid,
      user_name: profileById.get(uid)?.display_name ?? uid.slice(0, 8),
      auction_id: aid,
      plate_label: plateLabelByAuctionId.get(aid) ?? aid.slice(0, 8),
      provider: String(row.provider ?? ''),
      amount_minor: strOrZero(row.amount_minor),
      captured_amount_minor: strOrZero(row.captured_amount_minor),
      refunded_amount_minor: strOrZero(row.refunded_amount_minor),
      status: String(row.status),
      expires_at: strOrNull(row.expires_at),
      created_at: String(row.created_at),
    };
  });

  const payments: AdminPaymentTxRecord[] = (paymentsRes.data ?? []).map((row) => ({
    id: String(row.id),
    authorization_id: String(row.authorization_id),
    operation: String(row.operation),
    amount_minor: strOrZero(row.amount_minor),
    status: String(row.status),
    reason: strOrNull(row.reason),
    provider_transaction_id: strOrNull(row.provider_transaction_id),
    error_code: strOrNull(row.error_code),
    created_at: String(row.created_at),
  }));

  const settlements: AdminSettlementRecord[] = (settlementsRes.data ?? []).map((row) => {
    const sid = String(row.seller_id);
    const wid = String(row.winner_id);
    const aid = String(row.auction_id);
    return {
      id: String(row.id),
      auction_id: aid,
      plate_label: plateLabelByAuctionId.get(aid) ?? aid.slice(0, 8),
      seller_id: sid,
      seller_name: profileById.get(sid)?.display_name ?? sid.slice(0, 8),
      winner_id: wid,
      winner_name: profileById.get(wid)?.display_name ?? wid.slice(0, 8),
      winning_amount_minor: strOrZero(row.winning_amount_minor),
      commission_minor: strOrZero(row.commission_minor),
      remaining_amount_minor: strOrZero(row.remaining_amount_minor),
      status: String(row.status),
      created_at: String(row.created_at),
      updated_at: String(row.updated_at),
    };
  });

  const reports: AdminAuctionResultRecord[] = (reportsRes.data ?? []).map((row) => {
    const aid = String(row.auction_id);
    const wid = strOrNull(row.winner_id);
    return {
      id: String(row.id),
      auction_id: aid,
      plate_label: plateLabelByAuctionId.get(aid) ?? aid.slice(0, 8),
      outcome: String(row.outcome),
      winner_id: wid,
      winner_name: wid ? (profileById.get(wid)?.display_name ?? wid.slice(0, 8)) : null,
      winning_amount_minor: strOrNull(row.winning_amount_minor),
      final_sequence: Number(row.final_sequence ?? 0),
      finalized_at: String(row.finalized_at),
    };
  });

  const cmsPages: AdminCmsPageRecord[] = (cmsPagesRes.data ?? []).map((row) => ({
    slug: String(row.slug),
    title_ar: String(row.title_ar ?? ''),
    body_ar: String(row.body_ar ?? ''),
    published: Boolean(row.published),
    updated_at: String(row.updated_at),
  }));

  let rawFaqs = faqsRes.data ?? [];
  if (rawFaqs.length === 0) {
    const seedRows = masterFaqData.map((item, idx) => ({
      question_ar: item.q,
      answer_ar: item.a,
      question_en: `${item.catId}|${item.category}|${item.badge}`,
      sort_order: idx + 1,
      published: true,
    }));
    const { data: insertedFaqs } = await db
      .from('faqs')
      .insert(seedRows)
      .select('id,question_ar,answer_ar,question_en,sort_order,published');
    if (insertedFaqs && insertedFaqs.length > 0) {
      rawFaqs = insertedFaqs;
    }
  }

  const faqs: AdminFaqRecord[] = rawFaqs.map((row) => ({
    id: String(row.id),
    question_ar: String(row.question_ar ?? ''),
    answer_ar: String(row.answer_ar ?? ''),
    question_en: strOrNull(row.question_en),
    sort_order: Number(row.sort_order ?? 0),
    published: Boolean(row.published),
  }));

  const featureFlags: AdminFeatureFlagRecord[] = (featureFlagsRes.data ?? []).map((row) => ({
    key: String(row.key),
    enabled: Boolean(row.enabled),
    description: String(row.description ?? ''),
    updated_at: String(row.updated_at),
  }));

  const messages: AdminContactMessageRecord[] = (messagesRes.data ?? []).map((row) => ({
    id: String(row.id),
    user_id: strOrNull(row.user_id),
    name: String(row.name ?? ''),
    email: String(row.email ?? ''),
    subject: String(row.subject ?? ''),
    message: String(row.message ?? ''),
    status: String(row.status ?? 'NEW'),
    created_at: String(row.created_at),
  }));

  const notifications: AdminNotificationRecord[] = (notificationsRes.data ?? []).map((row) => {
    const uid = String(row.user_id);
    return {
      id: String(row.id),
      user_id: uid,
      user_name: profileById.get(uid)?.display_name ?? uid.slice(0, 8),
      type: String(row.type ?? 'ADMIN'),
      title: String(row.title ?? ''),
      body: String(row.body ?? ''),
      href: strOrNull(row.href),
      read_at: strOrNull(row.read_at),
      created_at: String(row.created_at),
    };
  });

  const auditClearedAt =
    auditClearedRes?.data?.value &&
    typeof auditClearedRes.data.value === 'object' &&
    'clearedAt' in auditClearedRes.data.value
      ? String((auditClearedRes.data.value as Record<string, unknown>).clearedAt ?? '')
      : '';

  const auditLogs: AdminAuditLogRecord[] = (auditLogsRes.data ?? [])
    .filter((row) => !auditClearedAt || String(row.created_at) > auditClearedAt)
    .map((row) => {
    const actorId = strOrNull(row.actor_id);
    return {
      id: String(row.id),
      actor_id: actorId,
      actor_name: actorId
        ? (profileById.get(actorId)?.display_name ?? actorId.slice(0, 8))
        : 'النظام',
      action: String(row.action ?? ''),
      entity_type: String(row.entity_type ?? ''),
      entity_id: strOrNull(row.entity_id),
      reason: strOrNull(row.reason),
      before_data:
        row.before_data && typeof row.before_data === 'object'
          ? (row.before_data as Record<string, unknown>)
          : null,
      after_data:
        row.after_data && typeof row.after_data === 'object'
          ? (row.after_data as Record<string, unknown>)
          : null,
      created_at: String(row.created_at),
    };
  });

  const badges = {
    pendingVerifications: plates.filter(
      (p) =>
        p.verification_status === 'SUBMITTED' ||
        p.verification_status === 'DOCUMENTS_PENDING' ||
        p.verification_status === 'UNDER_REVIEW' ||
        p.verification_status === 'CHANGES_REQUIRED',
    ).length,
    liveAuctions: auctions.filter((a) => a.status === 'LIVE' || a.status === 'ENDING').length,
    pendingIdentities: identities.filter((i) => i.status === 'PENDING').length,
    newMessages: messages.filter((m) => m.status === 'NEW').length,
    activeSettlements: settlements.filter(
      (s) => s.status !== 'COMPLETED' && s.status !== 'CANCELLED',
    ).length,
  };

  const dashboardData: AdminDashboardData = {
    activeSection: rawKey,
    viewer: {
      id: access.viewer.id,
      email: access.viewer.email,
      displayName: access.viewer.displayName,
      roles: access.roles,
      permissions: access.permissions,
      mfaVerified: access.mfaVerified,
      mfaFactorId: access.mfaFactorId,
    },
    badges,
    letters,
    plateTypes,
    regions,
    cities,
    plates,
    auctions,
    registrations,
    bids,
    users,
    identities,
    deposits,
    payments,
    settlements,
    reports,
    cmsPages,
    faqs,
    siteSettings,
    featureFlags,
    messages,
    notifications,
    auditLogs,
  };

  return <AdminDashboard data={dashboardData} />;
}
