import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getViewer } from '@/lib/auth';
import { createSessionClient } from '@/lib/supabase/server';
import { DataTable } from '@/components/data-table';
import { EditorForm } from '@/components/editor-form';
import { ActionButton } from '@/components/forms';
import { MfaSetup } from '@/components/mfa';
import {
  Crown,
  Gavel,
  Flame,
  Car,
  Heart,
  ShieldCheck,
  CreditCard,
  Bell,
  User,
  Lock,
  ArrowLeft,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Clock,
  Wallet,
  ShieldAlert,
  ChevronLeft,
  LayoutDashboard
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'حساب النخبة · فارس بن سعود للوحات المميزة',
  robots: { index: false, follow: false }
};

interface SectionConfig {
  label: string;
  icon: typeof LayoutDashboard;
  description: string;
  table?: string;
  owner?: string;
  columns?: string[];
  badge?: string;
}

const sections: Record<string, SectionConfig> = {
  overview: {
    label: 'نظرة عامة',
    icon: LayoutDashboard,
    description: 'ملخص شامل لحسابك ومزاداتك وتأميناتك النشطة'
  },
  auctions: {
    label: 'مزاداتي',
    icon: Gavel,
    description: 'المزادات التي تأهلت وسجلت للمشاركة فيها',
    table: 'auction_registrations',
    owner: 'user_id',
    columns: ['auction_id', 'status', 'created_at'],
    badge: '2'
  },
  bids: {
    label: 'مزايداتي',
    icon: Flame,
    description: 'سجل المزايدات الحية المقدمة من حسابك',
    table: 'bids',
    owner: 'user_id',
    columns: ['auction_id', 'amount_minor', 'sequence_no', 'accepted_at'],
    badge: 'نشطة'
  },
  plates: {
    label: 'لوحاتي المعروضة',
    icon: Car,
    description: 'اللوحات المسجلة باسمك والمعروضة للبيع أو المزاد',
    table: 'plates',
    owner: 'owner_id',
    columns: ['digits', 'verification_status', 'listing_status', 'created_at']
  },
  favorites: {
    label: 'المفضلة',
    icon: Heart,
    description: 'اللوحات المميزة التي قمت بحفظها للمتابعة',
    table: 'favorites',
    owner: 'user_id',
    columns: ['plate_id', 'created_at'],
    badge: '2'
  },
  deposits: {
    label: 'تأمينات المزاد (Escrow)',
    icon: ShieldCheck,
    description: 'مبالغ التأمين البنكية المحجوزة والمفوضة للمزايدة',
    table: 'payment_authorizations',
    owner: 'user_id',
    columns: ['auction_id', 'amount_minor', 'status', 'expires_at']
  },
  payments: {
    label: 'سجل العمليات',
    icon: CreditCard,
    description: 'تاريخ التحويلات والتفويضات المصرفية',
    table: 'payment_authorizations',
    owner: 'user_id',
    columns: ['id', 'status', 'captured_amount_minor', 'refunded_amount_minor']
  },
  notifications: {
    label: 'الإشعارات',
    icon: Bell,
    description: 'تنبيهات المزايدة والتحديثات الرسمية',
    table: 'notifications',
    owner: 'user_id',
    columns: ['title', 'body', 'created_at'],
    badge: '2'
  },
  profile: {
    label: 'الملف الشخصي',
    icon: User,
    description: 'البيانات الشخصية ووسائل التواصل المعتمدة'
  },
  security: {
    label: 'الأمان والخصوصية',
    icon: Lock,
    description: 'إعدادات الحماية والمصادقة الثنائية وكلمة المرور'
  }
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

export default async function Account({
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
  const config = sections[key];

  if (!config || (section?.length ?? 0) > 1) {
    notFound();
  }

  const db = await createSessionClient();
  let rowsData: Record<string, unknown>[] = [];
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
          rowsData = demoAccountData[key] ?? [];
        }
      } catch {
        rowsData = demoAccountData[key] ?? [];
      }
    } else {
      rowsData = demoAccountData[key] ?? [];
    }
  }

  const avatarInitial = (user.displayName || user.email || 'ف').trim().charAt(0).toUpperCase();

  return (
    <div className="relative min-h-screen bg-[#060a15] text-white pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden">
      {/* Subtle luxury ambient glows */}
      <div className="pointer-events-none absolute -top-40 start-1/2 h-[550px] w-[950px] -translate-x-1/2 rounded-full bg-gradient-to-b from-gold/18 via-gold/5 to-transparent blur-[140px]" />
      <div className="pointer-events-none absolute bottom-10 end-0 h-96 w-96 rounded-full bg-blue-900/15 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 start-0 h-80 w-80 rounded-full bg-amber-500/10 blur-[120px]" />

      <div className="container-fbs relative z-10 space-y-8">
        {/* Royal VIP Welcome Header Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-[#091122]/90 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          {/* Internal Ambient Glow */}
          <div className="pointer-events-none absolute -top-16 start-12 h-40 w-80 rounded-full bg-gold/15 blur-3xl" />

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
            {/* User Identity & Avatar */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#faebd0] via-[#d9b87f] to-[#b69248] text-[#1a2541] font-black text-2xl sm:text-3xl shadow-xl ring-4 ring-gold/25">
                  {avatarInitial}
                </div>
                <div className="absolute -bottom-1 -end-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#060a15] border border-gold text-gold shadow-md">
                  <Crown size={12} />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-3 py-1 text-xs font-bold text-gold-light">
                    <Crown size={13} className="text-gold" />
                    <span>عضوية النخبة الماسية</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-400">
                    <ShieldCheck size={12} />
                    <span>حساب رسمي موثق 🇸🇦</span>
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
                  مرحباً بسعادتكم، {user.displayName || 'عضو النخبة'}
                </h1>

                <p className="mt-1 text-xs sm:text-sm text-slate-300 font-mono flex items-center gap-2">
                  <span>{user.email}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">
                    معرّف الحساب: VIP-{(user.id || '').slice(0, 8).toUpperCase()}
                  </span>
                </p>
              </div>
            </div>

            {/* Quick VIP Action CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/auctions"
                className="btn btn-gold text-xs sm:text-sm font-black shadow-lg shadow-gold/25 hover:shadow-gold/40"
              >
                <Gavel size={16} />
                <span>صالة المزادات الحية</span>
              </Link>
              <Link
                href="/sell-your-plate"
                className="btn btn-outline-gold text-xs sm:text-sm font-bold"
              >
                <Car size={16} />
                <span>اعرض لوحة جديدة</span>
              </Link>
            </div>
          </div>
        </div>

        {/* VIP Metrics Row (4 Luxury KPI Stat Cards) */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Link
            href="/account/auctions"
            className="group rounded-2xl border border-white/10 bg-[#091122]/70 backdrop-blur-xl p-5 shadow-lg hover:border-gold/30 hover:bg-[#091122]/90 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">المزادات المؤهلة</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15 text-gold group-hover:scale-110 transition-transform">
                <Gavel size={18} />
              </span>
            </div>
            <p className="mt-3 text-2xl font-black text-white font-mono">2</p>
            <p className="mt-1 text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>جاهز للمزايدة الفورية</span>
            </p>
          </Link>

          <Link
            href="/account/plates"
            className="group rounded-2xl border border-white/10 bg-[#091122]/70 backdrop-blur-xl p-5 shadow-lg hover:border-gold/30 hover:bg-[#091122]/90 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">لوحاتك المسجلة</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400 group-hover:scale-110 transition-transform">
                <Car size={18} />
              </span>
            </div>
            <p className="mt-3 text-2xl font-black text-white font-mono">1</p>
            <p className="mt-1 text-[11px] text-slate-400 font-medium">لوحة تحت التوثيق والعرض</p>
          </Link>

          <Link
            href="/account/deposits"
            className="group rounded-2xl border border-white/10 bg-[#091122]/70 backdrop-blur-xl p-5 shadow-lg hover:border-gold/30 hover:bg-[#091122]/90 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">التأمين المعتمد (Escrow)</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 group-hover:scale-110 transition-transform">
                <ShieldCheck size={18} />
              </span>
            </div>
            <p className="mt-3 text-2xl font-black text-gold font-mono">
              25,000 <span className="text-xs font-sans text-slate-300">ر.س</span>
            </p>
            <p className="mt-1 text-[11px] text-emerald-400 font-medium">تفويض مصرفي سارٍ</p>
          </Link>

          <Link
            href="/account/favorites"
            className="group rounded-2xl border border-white/10 bg-[#091122]/70 backdrop-blur-xl p-5 shadow-lg hover:border-gold/30 hover:bg-[#091122]/90 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">اللوحات المحفوظة</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/15 text-rose-400 group-hover:scale-110 transition-transform">
                <Heart size={18} />
              </span>
            </div>
            <p className="mt-3 text-2xl font-black text-white font-mono">2</p>
            <p className="mt-1 text-[11px] text-slate-400 font-medium">في قائمة المتابعة والتنبيهات</p>
          </Link>
        </div>

        {/* Dashboard Main Grid: Navigation Sidebar & Section View */}
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Navigation Sidebar */}
          <aside className="rounded-2xl border border-white/10 bg-[#091122]/85 backdrop-blur-xl p-3.5 shadow-xl h-fit">
            <div className="px-3 py-2 text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-white/5 mb-2">
              لوحة التحكم الخاصة
            </div>
            <nav className="space-y-1">
              {Object.entries(sections).map(([sKey, sConf]) => {
                const IconComponent = sConf.icon;
                const isActive = key === sKey;
                return (
                  <Link
                    key={sKey}
                    href={sKey === 'overview' ? '/account' : `/account/${sKey}`}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-gold/25 via-gold/10 to-transparent border-e-2 border-gold text-gold shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <IconComponent
                        size={16}
                        className={isActive ? 'text-gold' : 'text-slate-400'}
                      />
                      <span>{sConf.label}</span>
                    </span>
                    {sConf.badge && (
                      <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] text-gold font-mono">
                        {sConf.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 border-t border-white/10 pt-4 px-1">
              <ActionButton
                endpoint="/api/v1/auth/logout"
                label="تسجيل الخروج من الحساب"
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/25 bg-red-950/20 py-2.5 text-xs font-bold text-red-300 hover:bg-red-950/40 hover:border-red-500/40 transition-all cursor-pointer"
              />
            </div>
          </aside>

          {/* Section Content Panel */}
          <section className="min-w-0 space-y-6">
            {/* Section Header Title & Description */}
            <div className="flex flex-col gap-1 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/15 text-gold">
                  <config.icon size={18} />
                </span>
                <h2 className="text-xl font-black text-white">{config.label}</h2>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">{config.description}</p>
            </div>

            {/* Overview Section */}
            {key === 'overview' && (
              <div className="space-y-6">
                {/* 3 High-Impact Luxury Quick Action Gateway Cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <Link
                    href="/auctions"
                    className="group rounded-2xl border border-gold/30 bg-gradient-to-b from-[#0f1d38] to-[#091122] p-5 shadow-xl hover:border-gold hover:shadow-gold/10 transition-all"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/20 text-gold-light group-hover:scale-110 transition-transform">
                      <Gavel size={22} />
                    </div>
                    <h3 className="mt-4 text-sm font-black text-white">صالة المزادات الحية</h3>
                    <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                      ادخل المزاد الجاري لحظياً وتنافس بأمان مع تقنية مكافحة القنص.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-gold group-hover:underline">
                      <span>دخول الصالة الآن</span>
                      <ArrowLeft size={14} />
                    </span>
                  </Link>

                  <Link
                    href="/sell-your-plate"
                    className="group rounded-2xl border border-white/10 bg-[#091122]/90 p-5 shadow-xl hover:border-gold/40 transition-all"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                      <Car size={22} />
                    </div>
                    <h3 className="mt-4 text-sm font-black text-white">اعرض لوحتك النادرة</h3>
                    <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                      قدّم بيانات لوحتك للمراجعة والتوثيق أمام أكبر شبكة مقتنين بالمملكة.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-gold group-hover:underline">
                      <span>بدء تقديم الطلب</span>
                      <ArrowLeft size={14} />
                    </span>
                  </Link>

                  <Link
                    href="/account/deposits"
                    className="group rounded-2xl border border-white/10 bg-[#091122]/90 p-5 shadow-xl hover:border-gold/40 transition-all"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                      <ShieldCheck size={22} />
                    </div>
                    <h3 className="mt-4 text-sm font-black text-white">نظام الضامن (Escrow)</h3>
                    <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                      تأميناتك المصرفية محمية وتُسترد تلقائيًا وفورياً إلى حسابك.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-gold group-hover:underline">
                      <span>إدارة التأمينات</span>
                      <ArrowLeft size={14} />
                    </span>
                  </Link>
                </div>

                {/* Active Bidding Highlights */}
                <div className="rounded-2xl border border-white/10 bg-[#091122]/90 backdrop-blur-xl p-6 shadow-xl">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <Flame size={16} className="text-amber-400" />
                        <span>أحدث المزايدات المسجلة من حسابك</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        متابعة حية لحالة العروض المقبولة
                      </p>
                    </div>
                    <Link
                      href="/account/bids"
                      className="text-xs font-bold text-gold hover:underline flex items-center gap-1"
                    >
                      <span>عرض الكل</span>
                      <ChevronLeft size={14} />
                    </Link>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:border-gold/20 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-28 items-center justify-center rounded-lg border border-gold/40 bg-[#060b17] text-sm font-black tracking-wider text-gold-light shadow-inner font-mono">
                          ف ب س 1
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">مزاد اللوحة الملكية الأحادية</span>
                            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                              أعلى مزايدة حالياً
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            رقم التسلسل: #28 · قبل 15 دقيقة
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <span className="text-base font-black text-gold font-mono">
                          750,000 <span className="text-xs font-sans text-slate-400">ر.س</span>
                        </span>
                        <Link
                          href="/auctions"
                          className="btn btn-outline-gold py-1.5 px-3 text-xs font-bold"
                        >
                          دخول المزاد
                        </Link>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:border-gold/20 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-28 items-center justify-center rounded-lg border border-white/20 bg-[#060b17] text-sm font-black tracking-wider text-white shadow-inner font-mono">
                          ر ق م 7
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">مزاد لوحة النخبة الفردية</span>
                            <span className="rounded-full bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 text-[10px] font-bold text-blue-400">
                              مزايدة نشطة
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            رقم التسلسل: #19 · اليوم 16:15
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <span className="text-base font-black text-gold font-mono">
                          520,000 <span className="text-xs font-sans text-slate-400">ر.س</span>
                        </span>
                        <Link
                          href="/auctions"
                          className="btn btn-outline-gold py-1.5 px-3 text-xs font-bold"
                        >
                          دخول المزاد
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Section */}
            {key === 'profile' && (
              <div className="space-y-6">
                <EditorForm
                  endpoint="/api/v1/profile"
                  theme="dark"
                  button="حفظ بيانات الملف الشخصي"
                  fields={[
                    {
                      name: 'displayName',
                      label: 'الاسم الكامل المعتمد في الهوية الرسمية',
                      value: user.displayName,
                      required: true
                    },
                    {
                      name: 'phone',
                      label: 'رقم الجوال للتنبيهات والمزايدة (بصيغة دولية +966)',
                      required: false
                    }
                  ]}
                />
              </div>
            )}

            {/* Security Section */}
            {key === 'security' && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-white/10 bg-[#091122]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 border border-gold/30 text-gold">
                      <Lock size={20} />
                    </span>
                    <div>
                      <h3 className="text-base font-black text-white">تغيير كلمة المرور</h3>
                      <p className="text-xs text-slate-400">
                        حماية حسابك عبر رابط تفعيل مشفر يصل لبريدك المسجل
                      </p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                    لأسباب أمنية ولضمان سلامة العمليات المالية، يتم تعيين كلمة المرور الجديدة عبر
                    رابط مؤقت ومشفر يتم إرساله مباشرة إلى بريدك الإلكتروني المعتمد: ({user.email}).
                  </p>
                  <Link
                    className="btn btn-gold text-xs sm:text-sm font-black shadow-md shadow-gold/20"
                    href="/forgot-password"
                  >
                    إرسال رابط استعادة وتغيير كلمة المرور
                  </Link>
                </div>

                <MfaSetup theme="dark" />

                {/* Cyber Security Assurance Card */}
                <div className="flex items-start gap-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-5 text-xs text-slate-300">
                  <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white mb-0.5">أمان الجلسة والبيانات</h4>
                    <p className="leading-relaxed text-slate-300">
                      جلسة دخولك الحالية مشفرة بالكامل بتقنية TLS 1.3 مع تخزين آمن لرموز الجلسة (HTTP-Only Secure Cookies)، بما يتوافق مع الضوابط الأساسية للأمن السيبراني الصادرة من الهيئة الوطنية للأمن السيبراني (NCA).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Auctions & Bids Sections Custom Cards */}
            {(key === 'auctions' || key === 'bids') && (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-gold/30 bg-[#091122]/90 backdrop-blur-xl p-5 shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <span className="text-xs font-bold text-slate-300">لوحة ف ب س 1 (FBS-1)</span>
                      <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                        مؤهل للمزايدة الحية
                      </span>
                    </div>

                    <div className="my-4 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-slate-400">أحدث قيمة مزايدة</p>
                        <p className="text-lg font-black text-gold font-mono">
                          750,000 <span className="text-xs font-sans text-slate-300">ر.س</span>
                        </p>
                      </div>
                      <div className="flex h-11 w-24 items-center justify-center rounded-lg border border-gold/40 bg-[#060b17] text-xs font-black text-gold-light font-mono shadow-inner">
                        1 FBS
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[11px] text-slate-400">
                      <span>التأمين المصرفي: 25,000 ر.س (مفوض)</span>
                      <Link
                        href="/auctions"
                        className="font-bold text-gold hover:underline flex items-center gap-1"
                      >
                        <span>دخول الصالة</span>
                        <ArrowLeft size={12} />
                      </Link>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/15 bg-[#091122]/90 backdrop-blur-xl p-5 shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <span className="text-xs font-bold text-slate-300">لوحة ر ق م 7 (RQM-7)</span>
                      <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                        مؤهل للمزايدة الحية
                      </span>
                    </div>

                    <div className="my-4 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-slate-400">أحدث قيمة مزايدة</p>
                        <p className="text-lg font-black text-gold font-mono">
                          520,000 <span className="text-xs font-sans text-slate-300">ر.س</span>
                        </p>
                      </div>
                      <div className="flex h-11 w-24 items-center justify-center rounded-lg border border-white/20 bg-[#060b17] text-xs font-black text-white font-mono shadow-inner">
                        7 RQM
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[11px] text-slate-400">
                      <span>التأمين المصرفي: 20,000 ر.س (مفوض)</span>
                      <Link
                        href="/auctions"
                        className="font-bold text-gold hover:underline flex items-center gap-1"
                      >
                        <span>دخول الصالة</span>
                        <ArrowLeft size={12} />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">
                    السجل المعتمد (Audit Trail)
                  </div>
                  <DataTable rows={rowsData} columns={config.columns} theme="dark" />
                </div>
              </div>
            )}

            {/* Plates Section */}
            {key === 'plates' && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-white/10 bg-[#091122]/90 backdrop-blur-xl p-6 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-28 items-center justify-center rounded-xl border border-gold/40 bg-[#060b17] text-sm font-black text-gold-light font-mono shadow-inner">
                        م ج د 777
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-white">لوحة خاصة ثلاثية مميزة</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                            تحت المراجعة والتوثيق
                          </span>
                          <span className="rounded-full bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 text-[10px] font-bold text-blue-300">
                            مسودة معتمدة
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/sell-your-plate"
                      className="btn btn-gold text-xs font-black py-2 px-4"
                    >
                      <span>إضافة وتوثيق لوحة جديدة</span>
                      <ArrowLeft size={14} />
                    </Link>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">
                    جدول تفاصيل اللوحات
                  </div>
                  <DataTable rows={rowsData} columns={config.columns} theme="dark" />
                </div>
              </div>
            )}

            {/* Favorites Section */}
            {key === 'favorites' && (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-[#091122]/90 backdrop-blur-xl p-5 shadow-xl hover:border-gold/30 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-24 items-center justify-center rounded-lg border border-gold/40 bg-[#060b17] text-xs font-black text-gold-light font-mono">
                        ف ب س 1
                      </div>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/15 text-rose-400">
                        <Heart size={16} fill="currentColor" />
                      </span>
                    </div>
                    <h3 className="mt-3 text-sm font-black text-white">اللوحة الملكية الأحادية</h3>
                    <p className="text-xs text-slate-400 mt-0.5">مزاد مباشر نشط الآن</p>
                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/5">
                      <span className="text-xs font-black text-gold font-mono">750,000 ر.س</span>
                      <Link
                        href="/auctions"
                        className="btn btn-outline-gold py-1.5 px-3 text-xs font-bold"
                      >
                        عرض المزاد
                      </Link>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#091122]/90 backdrop-blur-xl p-5 shadow-xl hover:border-gold/30 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-24 items-center justify-center rounded-lg border border-white/20 bg-[#060b17] text-xs font-black text-white font-mono">
                        ك ن غ 1
                      </div>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/15 text-rose-400">
                        <Heart size={16} fill="currentColor" />
                      </span>
                    </div>
                    <h3 className="mt-3 text-sm font-black text-white">لوحة النخبة الفاخرة</h3>
                    <p className="text-xs text-slate-400 mt-0.5">معروضة في الصالة الخاصة</p>
                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/5">
                      <span className="text-xs font-black text-gold font-mono">480,000 ر.س</span>
                      <Link
                        href="/auctions"
                        className="btn btn-outline-gold py-1.5 px-3 text-xs font-bold"
                      >
                        عرض التفاصيل
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">
                    سجل المفضلة
                  </div>
                  <DataTable rows={rowsData} columns={config.columns} theme="dark" />
                </div>
              </div>
            )}

            {/* Deposits & Payments Sections */}
            {(key === 'deposits' || key === 'payments') && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-[#091122] to-[#091122] p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                      <ShieldCheck size={22} />
                    </span>
                    <div>
                      <h3 className="text-base font-black text-white">حماية المبالغ والتأمينات بنظام الضامن (Escrow)</h3>
                      <p className="text-xs text-slate-400">تحت إشراف المعايير المصرفية في المملكة العربية السعودية</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    جميع مبالغ تأمين دخول المزادات يتم تفويضها مؤقتًا عبر البطاقات البنكية دون خصم مباشر، ويتم إلغاء التفويض فور انتهاء المزاد لجميع المزايدين الذين لم يحالفهم الفوز تلقائياً بنسبة 100%.
                  </p>
                </div>

                <div className="mt-6">
                  <div className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">
                    السجل المالي للتأمينات والعمليات
                  </div>
                  <DataTable rows={rowsData} columns={config.columns} theme="dark" />
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {key === 'notifications' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3.5 rounded-2xl border border-gold/30 bg-[#091122]/90 backdrop-blur-xl p-4.5 shadow-lg">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
                      <Crown size={18} />
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black text-white sm:text-sm">
                          تأكيد التسجيل في مزاد النخبة
                        </h3>
                        <span className="text-[11px] text-slate-400 font-mono">اليوم</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                        تم قبول طلبك والتأهيل المباشر لمزاد لوحة ف ب س 1 بعد التحقق من تفويض التأمين المصرفي.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 rounded-2xl border border-white/10 bg-[#091122]/80 backdrop-blur-xl p-4.5 shadow-lg">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
                      <Flame size={18} />
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black text-white sm:text-sm">
                          مزايدة جديدة مسجلة بنجاح
                        </h3>
                        <span className="text-[11px] text-slate-400 font-mono">قبل قليل</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                        تم تسجيل مزايدتك بقيمة 750,000 ر.س برقم تسلسلي معتمد #28 في الصالة الرقمية.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">
                    أرشيف الإشعارات
                  </div>
                  <DataTable rows={rowsData} columns={config.columns} theme="dark" />
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
