import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Filter,
  Gavel,
  Layers,
  Lock,
  Radio,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Trophy,
  X
} from 'lucide-react';
import { EmptyState, PlateCard, PlateCardSkeletonGrid, PlateVisualizer, Skeleton } from './ui';
import { CatalogFilters } from './catalog-filters';
import { CatalogStage } from './catalog-views';
import { getMarketplace, getReferenceData } from '@/modules/marketplace/service';
import type { MarketplaceQuery } from '@/modules/marketplace/types';

/* Custom Luxury SVGs for Catalog Category Navigation Tabs */
function TabIconAllPlates({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4.5" width="16" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <line x1="8" y1="4.5" x2="8" y2="15.5" stroke="currentColor" strokeWidth="1.3" strokeDasharray="1.5 1.5" />
      <path d="M4.5 10h1.5M11 8.5h3.5M11 11.5h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TabIconLive({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="2.8" fill="currentColor" />
      <path d="M5.5 5.5a6.5 6.5 0 0 0 0 9M14.5 5.5a6.5 6.5 0 0 1 0 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M3 3a10 10 0 0 0 0 14M17 3a10 10 0 0 1 0 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.5" />
    </svg>
  );
}

function TabIconUpcoming({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 6v4.5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 2.5v-1M17.5 10h1M10 17.5v1M2.5 10h-1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.4" />
    </svg>
  );
}

function TabIconElite({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 15h14l-1.5-7.5-3.5 3.5-2-5.5-2 5.5-3.5-3.5L3 15z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2" />
      <circle cx="3" cy="7.5" r="1" fill="currentColor" />
      <circle cx="10" cy="5.5" r="1.1" fill="currentColor" />
      <circle cx="17" cy="7.5" r="1" fill="currentColor" />
      <path d="M4.5 15h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function TabIconSingleDigit({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2.5" y="3.5" width="15" height="13" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.8 8.2 10.5 7v6.5M9.2 13.5h2.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TabIconDoubleDigit({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="3.5" width="16" height="13" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 8a1.6 1.6 0 0 1 2.8 1.1c0 1-1.3 1.8-2.3 2.6H8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.5 8a1.6 1.6 0 0 1 2.8 1.1c0 1-1.3 1.8-2.3 2.6H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TabIconTripleDigit({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="3.5" width="17" height="13" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4.8 7.5h2.2l-1 1.8a1.2 1.2 0 1 1-1 1.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.8 7.5h2.2l-1 1.8a1.2 1.2 0 1 1-1 1.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.8 7.5h2.2l-1 1.8a1.2 1.2 0 1 1-1 1.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TabIconCompleted({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.5 11.5 16 14l-1.8 1.8-2.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m4.5 7.5 4-4 3 3-4 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2" />
      <path d="M7 10l5.5 5.5M3 16.5h4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="15.5" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="m14.5 5.5.8.8 1.4-1.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export async function Catalog({
  query,
  auctionFilter
}: {
  query: Record<string, string | string[] | undefined>;
  auctionFilter?: string;
}) {
  const clean: Record<string, string> = {};
  for (const [k, v] of Object.entries(query)) {
    if (typeof v === 'string') clean[k] = v;
    else if (Array.isArray(v)) clean[k] = v.join(',');
  }

  const [result, refs] = await Promise.all([
    getMarketplace({
      ...clean,
      page: Number(clean.page) || 1,
      sort: clean.sort as MarketplaceQuery['sort'],
      auctionStatus: auctionFilter
    } as MarketplaceQuery),
    getReferenceData()
  ]);

  const isLive = auctionFilter === 'LIVE';
  const isUpcoming = auctionFilter === 'UPCOMING';
  const isCompleted = auctionFilter === 'COMPLETED';

  const title = isLive
    ? 'المزادات المباشرة'
    : isUpcoming
      ? 'المزادات القادمة'
      : isCompleted
        ? 'المزادات المنتهية'
        : 'اللوحات المميزة والمزادات';

  const subtitle = isLive
    ? 'مزايدة آنية ونظامية في الوقت الفعلي مع تمديد عادل وتوثيق رسمي للملكية.'
    : isUpcoming
      ? 'استكشف اللوحات الاستثنائية القادمة وجّهز تأمينك لدخول المزاد فور افتتاحه.'
      : isCompleted
        ? 'أرشيف الصفقات والمزادات التي تمت تسويتها بنجاح عبر المنصة.'
        : 'حروف لها معنى، وأرقام تترك أثرًا. استكشف نخبة لوحات المركبات السعودية المعتمدة.';

  const currentPath =
    auctionFilter && auctionFilter !== 'ALL'
      ? `/auctions/${auctionFilter.toLowerCase()}`
      : (auctionFilter ? '/auctions' : '/plates');

  function makeTypeUrl(targetType: string) {
    const p = new URLSearchParams(clean);
    if (clean.type === targetType) {
      p.delete('type');
    } else {
      p.set('type', targetType);
    }
    p.delete('page');
    const qs = p.toString();
    return qs ? `${currentPath}?${qs}` : currentPath;
  }

  const letterLabels: Record<string, string> = {
    '3_same': '3 حروف متطابقة',
    '2_same': 'حرفين متطابقة',
    first_last_same: 'أول وآخر حرف متطابق',
    all_diff: 'كل الحروف مختلفة'
  };

  const numberLabels: Record<string, string> = {
    '4_same': '4 أرقام متطابقة',
    '3_same': '3 أرقام متطابقة',
    '2_same': 'رقمين متطابقة',
    first_last_same: 'أول وآخر رقم متطابق',
    sequence: 'تسلسل أرقام',
    all_diff: 'كل الأرقام مختلفة'
  };

  const priceRangeLabels: Record<string, string> = {
    under_15k: 'أقل من 15,000 ﷼',
    '15k_50k': '15,000 - 50,000 ﷼',
    '50k_150k': '50,000 - 150,000 ﷼',
    '150k_500k': '150,000 - 500,000 ﷼',
    over_500k: 'أكثر من 500,000 ﷼'
  };

  function removeFilterUrl(key: string, valueToRemove?: string) {
    const p = new URLSearchParams(clean);
    if (valueToRemove && p.has(key)) {
      const existing = p.get(key)!.split(',').filter((v) => v !== valueToRemove);
      if (existing.length > 0) {
        p.set(key, existing.join(','));
      } else {
        p.delete(key);
      }
    } else {
      p.delete(key);
    }
    p.delete('page');
    const qs = p.toString();
    return qs ? `${currentPath}?${qs}` : currentPath;
  }

  return (
    <>
      {/* ============================================================== */}
      {/* 1. LUXURY PAGE HEADER HERO BANNER                              */}
      {/* ============================================================== */}
      <section className="hero-luxury-ambient relative overflow-hidden border-b border-[#d9b87f]/25 bg-gradient-to-b from-[#091224] via-[#070d1a] to-[#040810] pt-24 sm:pt-28 lg:pt-30 pb-40 sm:pb-52 lg:pb-60 text-white">

        {/* Ambient background glows */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <div className="absolute -top-28 end-10 h-80 w-80 rounded-full bg-gold/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-28 start-10 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-[700px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
        </div>

        <div className="container-fbs relative z-10">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-gold-light mb-2.5">
            <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
            <span className="text-gold/50">/</span>
            <span className="text-white font-bold">{title}</span>
          </div>

          <div className="max-w-4xl pb-1">
            {/* Tuned Luxury Badge: Replaced Star with Gavel / Single Cohesive Gold Tone */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-gold/45 bg-gradient-to-r from-gold/25 via-gold/15 to-transparent px-4.5 py-1.5 text-xs sm:text-sm font-black text-gold-light backdrop-blur-md shadow-[0_2px_14px_rgba(217,184,127,0.25)] mb-3">
              <Gavel size={15} className="text-gold shrink-0" />
              <span className="tracking-wide">منصة المزادات الرسمية المعتمدة</span>
            </div>

            <h1 className="text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl text-white leading-tight">
              {title === 'اللوحات المميزة والمزادات' ? (
                <>
                  اللوحات المميزة{' '}
                  <span className="bg-gradient-to-r from-[#e7cb97] via-[#f7e6c4] to-[#cb9b48] bg-clip-text text-transparent">
                    والمزادات الرسمية
                  </span>
                </>
              ) : (
                title
              )}
            </h1>

            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-200 font-normal max-w-3xl">
              {subtitle}
            </p>
          </div>

          {/* Quick Category Navigation Card (Full-Width High-Definition 8-Column Architecture) */}
          <div className="mt-5 sm:mt-6 pt-4 border-t border-white/10">
            <div className="relative overflow-hidden rounded-2xl border-2 border-gold/35 bg-gradient-to-r from-[#0c162d]/95 via-[#101e3d]/90 to-[#0c162d]/95 p-2 sm:p-2.5 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
              {/* Top Luxury Gold Accent Line */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#d9b87f]/80 to-transparent pointer-events-none" />

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 w-full">
                {[
                  {
                    href: '/plates',
                    label: 'كل اللوحات',
                    active: !auctionFilter && !clean.featured && !clean.digitsCount && !clean.type,
                    icon: TabIconAllPlates
                  },
                  {
                    href: '/auctions/live',
                    label: 'مباشرة الآن',
                    active: isLive,
                    icon: TabIconLive,
                    isLive: true
                  },
                  {
                    href: '/auctions/upcoming',
                    label: 'مزادات قادمة',
                    active: isUpcoming,
                    icon: TabIconUpcoming
                  },
                  {
                    href: '/plates?featured=true',
                    label: 'لوحات النخبة',
                    active: clean.featured === 'true',
                    icon: TabIconElite
                  },
                  {
                    href: '/plates?digitsCount=1',
                    label: 'لوحات أحادية (1)',
                    active: clean.digitsCount === '1',
                    icon: TabIconSingleDigit
                  },
                  {
                    href: '/plates?digitsCount=2',
                    label: 'لوحات ثنائية (22)',
                    active: clean.digitsCount === '2',
                    icon: TabIconDoubleDigit
                  },
                  {
                    href: '/plates?digitsCount=3',
                    label: 'لوحات ثلاثية (333)',
                    active: clean.digitsCount === '3',
                    icon: TabIconTripleDigit
                  },
                  {
                    href: '/auctions/completed',
                    label: 'مزادات منتهية',
                    active: isCompleted,
                    icon: TabIconCompleted
                  }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Link
                      key={tab.href}
                      href={tab.href}
                      className={`group relative flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-center text-xs font-bold transition-all duration-200 w-full ${tab.active
                          ? 'bg-gradient-to-r from-[#d9b87f] via-[#ecd5a5] to-[#cb9b48] text-navy-deep font-black shadow-[0_4px_16px_rgba(217,184,127,0.4)] border border-white/40 scale-[1.02]'
                          : 'text-slate-100 hover:text-white bg-white/[0.06] hover:bg-white/[0.14] border border-white/15 hover:border-gold/50 shadow-xs hover:scale-[1.01]'
                        }`}
                    >
                      <Icon
                        className={`w-3.5 h-3.5 shrink-0 transition-colors ${tab.active ? 'text-navy-deep' : 'text-gold group-hover:text-gold-light'
                          }`}
                      />
                      <span className="whitespace-nowrap tracking-tight">{tab.label}</span>
                      {tab.isLive && (
                        <span className="flex h-2 w-2 relative ms-0.5 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* UNIFIED LUXURY CONTENT ZONE (SECTIONS 2 & 3 SEAMLESS INTEGRATION) */}
      {/* ============================================================== */}
      <div className="relative bg-[#f8fafc] flow-root">
        {/* Subtle Ambient Background Accents strictly clipped */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(217,184,127,0.06),transparent_70%)]" />
          <div className="absolute -top-32 -end-32 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
          <div className="absolute top-1/2 -start-32 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
        </div>

        {/* 2. AUTHENTIC SAUDI PLATE TYPE VISUAL SELECTOR (نوع اللوحة)      */}
        <section aria-label="نوع اللوحة المعتمدة" className="container-fbs relative z-30 -mt-24 sm:-mt-32 lg:-mt-40 mb-10 sm:mb-12">
        <div className="relative overflow-hidden rounded-3xl border-2 border-gold/35 bg-gradient-to-b from-[#0c162c]/95 via-[#080f1e]/98 to-[#050a14]/95 p-5 sm:p-7 sm:px-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65),0_0_35px_rgba(217,184,127,0.12)] backdrop-blur-2xl">
          {/* Top Luxury Gold Accent Line */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#d9b87f]/80 to-transparent pointer-events-none" />

          {/* Ambient Subtle Radial Glow */}
          <div className="pointer-events-none absolute -top-24 start-1/2 -translate-x-1/2 h-48 w-full max-w-2xl rounded-full bg-gold/10 blur-[85px]" />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-5 sm:mb-6">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/5 border border-gold/40 text-gold shadow-sm">
                <Layers size={22} className="text-gold" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  نوع اللوحة المعتمدة
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
                  تصفح اللوحات الفاخرة والمزادات حسب تصنيفها المعتمد لدى الإدارة العامة للمرور
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {clean.type && (
                <Link
                  href={removeFilterUrl('type')}
                  className="group inline-flex items-center gap-1.5 rounded-xl border border-rose-400/40 bg-rose-500/15 px-3.5 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-500/25 transition-colors shadow-xs"
                >
                  <RotateCcw size={13} className="transition-transform group-hover:-rotate-90" />
                  <span>عرض جميع الفئات</span>
                </Link>
              )}
            </div>
          </div>

          {/* 3 Visual Cards */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-stretch">
            {/* Card 1: خصوصي (Private) */}
            <Link
              href={makeTypeUrl('خصوصي')}
              className={`group relative flex flex-col justify-between rounded-2xl border-2 p-4 sm:p-5 transition-all duration-300 text-center h-full overflow-hidden ${clean.type === 'خصوصي'
                  ? 'border-gold bg-gradient-to-b from-[#fffbf2] via-white to-[#fbf6ea] shadow-[0_16px_35px_-8px_rgba(217,184,127,0.4)] ring-2 ring-gold/40'
                  : 'border-slate-200/90 bg-white hover:border-gold/60 hover:bg-gradient-to-b hover:from-white hover:to-[#fcfbf9] hover:shadow-[0_14px_30px_-6px_rgba(217,184,127,0.25)] hover:-translate-y-1'
                }`}
            >
              {clean.type === 'خصوصي' && (
                <span className="absolute top-3 end-3 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 px-3 py-1 text-[11px] font-black text-white shadow-md z-10 animate-in fade-in zoom-in-95">
                  <Check size={12} strokeWidth={3} />
                  <span>مُفعّل الآن</span>
                </span>
              )}

              {/* Authentic Private Plate Representation */}
              <div className="rounded-xl p-3 flex items-center justify-center w-full h-[135px] mb-3 relative overflow-hidden transition-all duration-300 bg-gradient-to-b from-[#f1f5f9] via-[#e2e8f0] to-[#cbd5e1] border border-slate-300/80 shadow-[inset_0_2px_8px_rgba(15,23,42,0.1),0_1px_2px_rgba(255,255,255,0.8)] group-hover:border-gold/50 group-hover:shadow-[inset_0_2px_10px_rgba(217,184,127,0.2)]">
                <div className="w-full transition-transform duration-300 group-hover:scale-[1.03] filter drop-shadow-[0_6px_14px_rgba(0,0,0,0.15)]">
                  <PlateVisualizer
                    lettersAr={['ف', 'ب', 'س']}
                    lettersEn={['F', 'B', 'S']}
                    numbers="1"
                    plateType="خصوصي"
                    compact
                  />
                </div>
              </div>

              <div className="flex flex-col items-center w-full mt-auto">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black text-navy group-hover:text-gold-dark transition-colors">
                    خصوصي
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 font-mono">(Private)</span>
                </div>
                <span className="text-xs text-slate-500 font-medium mt-0.5">ملاكي وشخصي قياسي (الأكثر طلباً)</span>

                <span
                  className={`text-xs font-bold mt-3.5 rounded-full px-4 py-1.5 transition-all duration-300 flex items-center justify-center gap-1.5 w-full ${clean.type === 'خصوصي'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 group-hover:bg-gradient-to-r group-hover:from-gold group-hover:via-gold-light group-hover:to-gold group-hover:text-navy group-hover:shadow-[0_4px_14px_rgba(217,184,127,0.35)]'
                    }`}
                >
                  <span>{clean.type === 'خصوصي' ? 'الفئة المحددة (إلغاء التحديد ✕)' : 'تصفية اللوحات الخصوصية'}</span>
                  {clean.type !== 'خصوصي' && <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-1" />}
                </span>
              </div>
            </Link>

            {/* Card 2: صغيرة (للسيارات الرياضية) (Small / Sports) */}
            <Link
              href={makeTypeUrl('صغيرة')}
              className={`group relative flex flex-col justify-between rounded-2xl border-2 p-4 sm:p-5 transition-all duration-300 text-center h-full overflow-hidden ${clean.type === 'صغيرة'
                  ? 'border-emerald-600 bg-gradient-to-b from-[#f0fdf4] via-white to-[#e8fbf0] shadow-[0_16px_35px_-8px_rgba(16,185,129,0.35)] ring-2 ring-emerald-500/40'
                  : 'border-slate-200/90 bg-white hover:border-emerald-500/60 hover:bg-gradient-to-b hover:from-white hover:to-[#fcfbf9] hover:shadow-[0_14px_30px_-6px_rgba(16,185,129,0.2)] hover:-translate-y-1'
                }`}
            >
              {clean.type === 'صغيرة' && (
                <span className="absolute top-3 end-3 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 px-3 py-1 text-[11px] font-black text-white shadow-md z-10 animate-in fade-in zoom-in-95">
                  <Check size={12} strokeWidth={3} />
                  <span>مُفعّل الآن</span>
                </span>
              )}

              {/* Authentic Sports Plate Representation */}
              <div className="rounded-xl p-3 flex items-center justify-center w-full h-[135px] mb-3 relative overflow-hidden transition-all duration-300 bg-gradient-to-b from-[#f1f5f9] via-[#e2e8f0] to-[#cbd5e1] border border-slate-300/80 shadow-[inset_0_2px_8px_rgba(15,23,42,0.1),0_1px_2px_rgba(255,255,255,0.8)] group-hover:border-emerald-500/50 group-hover:shadow-[inset_0_2px_10px_rgba(16,185,129,0.18)]">
                <div className="w-full transition-transform duration-300 group-hover:scale-[1.03] filter drop-shadow-[0_6px_14px_rgba(0,0,0,0.15)]">
                  <PlateVisualizer
                    lettersAr={['ط', 'ي', 'ا']}
                    lettersEn={['T', 'E', 'A']}
                    numbers="300"
                    plateType="صغيرة"
                    compact
                  />
                </div>
              </div>

              <div className="flex flex-col items-center w-full mt-auto">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black text-navy group-hover:text-emerald-700 transition-colors">
                    صغيرة (رياضية)
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 font-mono">(US Size)</span>
                </div>
                <span className="text-xs text-slate-500 font-medium mt-0.5">نسق أمريكي مخصص للسيارات الرياضية</span>

                <span
                  className={`text-xs font-bold mt-3.5 rounded-full px-4 py-1.5 transition-all duration-300 flex items-center justify-center gap-1.5 w-full ${clean.type === 'صغيرة'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-emerald-500 group-hover:text-white group-hover:shadow-[0_4px_14px_rgba(16,185,129,0.35)]'
                    }`}
                >
                  <span>{clean.type === 'صغيرة' ? 'الفئة المحددة (إلغاء التحديد ✕)' : 'تصفية اللوحات الرياضية'}</span>
                  {clean.type !== 'صغيرة' && <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-1" />}
                </span>
              </div>
            </Link>

            {/* Card 3: نقل (Transport / Commercial) */}
            <Link
              href={makeTypeUrl('نقل')}
              className={`group relative flex flex-col justify-between rounded-2xl border-2 p-4 sm:p-5 transition-all duration-300 text-center h-full overflow-hidden ${clean.type === 'نقل'
                  ? 'border-sky-600 bg-gradient-to-b from-[#f0f9ff] via-white to-[#e6f4fe] shadow-[0_16px_35px_-8px_rgba(2,132,199,0.35)] ring-2 ring-sky-500/40'
                  : 'border-slate-200/90 bg-white hover:border-sky-500/60 hover:bg-gradient-to-b hover:from-white hover:to-[#fcfbf9] hover:shadow-[0_14px_30px_-6px_rgba(2,132,199,0.2)] hover:-translate-y-1'
                }`}
            >
              {clean.type === 'نقل' && (
                <span className="absolute top-3 end-3 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 px-3 py-1 text-[11px] font-black text-white shadow-md z-10 animate-in fade-in zoom-in-95">
                  <Check size={12} strokeWidth={3} />
                  <span>مُفعّل الآن</span>
                </span>
              )}

              {/* Authentic Transport Plate Representation (Blue Stripe + White ▼) */}
              <div className="rounded-xl p-3 flex items-center justify-center w-full h-[135px] mb-3 relative overflow-hidden transition-all duration-300 bg-gradient-to-b from-[#f1f5f9] via-[#e2e8f0] to-[#cbd5e1] border border-slate-300/80 shadow-[inset_0_2px_8px_rgba(15,23,42,0.1),0_1px_2px_rgba(255,255,255,0.8)] group-hover:border-sky-500/50 group-hover:shadow-[inset_0_2px_10px_rgba(2,132,199,0.18)]">
                <div className="w-full transition-transform duration-300 group-hover:scale-[1.03] filter drop-shadow-[0_6px_14px_rgba(0,0,0,0.15)]">
                  <PlateVisualizer
                    lettersAr={['ط', 'ع', 'م']}
                    lettersEn={['Z', 'T', 'A']}
                    numbers="966"
                    plateType="نقل"
                    compact
                  />
                </div>
              </div>

              <div className="flex flex-col items-center w-full mt-auto">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black text-navy group-hover:text-sky-700 transition-colors">
                    نقل خاص وتجاري
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 font-mono">(Transport)</span>
                </div>
                <span className="text-xs text-slate-500 font-medium mt-0.5">شريط أزرق ومثلث أمني رسمي للمرور</span>

                <span
                  className={`text-xs font-bold mt-3.5 rounded-full px-4 py-1.5 transition-all duration-300 flex items-center justify-center gap-1.5 w-full ${clean.type === 'نقل'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 group-hover:bg-gradient-to-r group-hover:from-sky-600 group-hover:to-sky-500 group-hover:text-white group-hover:shadow-[0_4px_14px_rgba(2,132,199,0.35)]'
                    }`}
                >
                  <span>{clean.type === 'نقل' ? 'الفئة المحددة (إلغاء التحديد ✕)' : 'تصفية لوحات النقل'}</span>
                  {clean.type !== 'نقل' && <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-1" />}
                </span>
              </div>
            </Link>
          </div>

          {/* Active Filter Chips Bar (التصفيات) */}
          {(clean.type ||
            clean.digitsCount ||
            clean.city ||
            clean.featured ||
            clean.q ||
            clean.minPrice ||
            clean.maxPrice ||
            clean.priceRange ||
            clean.lettersPattern ||
            clean.numbersPattern) && (
              <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-300 font-bold ms-1">التصفيات النشطة:</span>

                {clean.type && (
                  <Link
                    href={removeFilterUrl('type')}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-slate-200 font-bold hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-400/40 border border-white/15 transition-colors"
                  >
                    <span>نوع اللوحة: {clean.type}</span>
                    <X size={12} />
                  </Link>
                )}

                {/* Price Range Chip */}
                {(clean.minPrice || clean.maxPrice) && (
                  <Link
                    href={removeFilterUrl('minPrice')}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-slate-200 font-bold hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-400/40 border border-white/15 transition-colors"
                  >
                    <span>
                      السعر:{' '}
                      {clean.minPrice ? `من ${Number(clean.minPrice).toLocaleString()}` : ''}{' '}
                      {clean.maxPrice ? `إلى ${Number(clean.maxPrice).toLocaleString()}` : ''} ﷼
                    </span>
                    <X size={12} />
                  </Link>
                )}

                {clean.priceRange && (
                  <Link
                    href={removeFilterUrl('priceRange')}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-slate-200 font-bold hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-400/40 border border-white/15 transition-colors"
                  >
                    <span>السعر: {priceRangeLabels[clean.priceRange] || clean.priceRange}</span>
                    <X size={12} />
                  </Link>
                )}

                {/* Letter Pattern Chips */}
                {clean.lettersPattern &&
                  clean.lettersPattern.split(',').filter(Boolean).map((pat) => (
                    <Link
                      key={pat}
                      href={removeFilterUrl('lettersPattern', pat)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-3 py-1 font-bold hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-400/40 transition-colors"
                    >
                      <span>حروف: {letterLabels[pat] || pat}</span>
                      <X size={12} />
                    </Link>
                  ))}

                {/* Number Pattern Chips */}
                {clean.numbersPattern &&
                  clean.numbersPattern.split(',').filter(Boolean).map((pat) => (
                    <Link
                      key={pat}
                      href={removeFilterUrl('numbersPattern', pat)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 px-3 py-1 font-bold hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-400/40 transition-colors"
                    >
                      <span>أرقام: {numberLabels[pat] || pat}</span>
                      <X size={12} />
                    </Link>
                  ))}

                {clean.digitsCount && (
                  <Link
                    href={removeFilterUrl('digitsCount')}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-slate-200 font-bold hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-400/40 border border-white/15 transition-colors"
                  >
                    <span>الخانة: {clean.digitsCount} {clean.digitsCount === '1' ? 'رقم' : 'أرقام'}</span>
                    <X size={12} />
                  </Link>
                )}

                {clean.city && (
                  <Link
                    href={removeFilterUrl('city')}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-slate-200 font-bold hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-400/40 border border-white/15 transition-colors"
                  >
                    <span>المدينة: {clean.city}</span>
                    <X size={12} />
                  </Link>
                )}

                {clean.featured && (
                  <Link
                    href={removeFilterUrl('featured')}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 text-gold-light border border-gold/40 px-3 py-1 font-bold hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-400/40 transition-colors"
                  >
                    <TabIconElite className="w-3.5 h-3.5 text-gold" />
                    <span>لوحات النخبة</span>
                    <X size={12} />
                  </Link>
                )}

                {clean.q && (
                  <Link
                    href={removeFilterUrl('q')}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-slate-200 font-bold hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-400/40 border border-white/15 transition-colors"
                  >
                    <span>بحث: &quot;{clean.q}&quot;</span>
                    <X size={12} />
                  </Link>
                )}

                <Link
                  href={currentPath}
                  className="ms-auto inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 hover:text-rose-300 hover:underline"
                >
                  <RotateCcw size={11} />
                  <span>مسح الكل</span>
                </Link>
              </div>
            )}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. CATALOG CONTENT: FULL-WIDTH STAGE BAR & 3 VIEW MODES        */}
      {/* ============================================================== */}
      <section className="relative pb-16 sm:pb-24">
        <CatalogStage
          plates={result.plates}
          total={result.total}
          page={result.page}
          pageSize={result.pageSize}
          clean={clean}
          cities={refs.cities}
          types={refs.types}
          currentPath={currentPath}
          configured={result.configured}
          available={result.available}
        />
      </section>
      </div>
    </>
  );
}

export function CatalogSkeleton() {
  return (
    <>
      {/* Luxury Hero Skeleton with Shimmer */}
      <section className="relative overflow-hidden border-b border-gold/25 bg-gradient-to-b from-[#091224] via-[#070d1a] to-[#040810] py-14 sm:py-18 text-white">
        <div className="container-fbs relative z-10 space-y-4">
          <div className="h-4 w-32 rounded-md skeleton-shimmer-dark" />
          <div className="h-8 w-56 rounded-full skeleton-shimmer-dark" />
          <div className="h-12 w-80 sm:w-96 rounded-xl skeleton-shimmer-dark" />
          <div className="h-5 w-full max-w-xl rounded-md skeleton-shimmer-dark" />
          <div className="mt-8 pt-5 border-t border-white/10">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 p-2 rounded-2xl border-2 border-gold/20 bg-white/[0.04]">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-10 w-full rounded-xl skeleton-shimmer-dark" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Body Skeleton */}
      <div className="container-fbs py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Filters Sidebar Placeholder */}
          <div className="hidden lg:block space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
              <div className="h-5 w-28 rounded-md skeleton-shimmer" />
              <div className="space-y-2.5 pt-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-5 w-full rounded-md skeleton-shimmer" />
                ))}
              </div>
            </div>
          </div>

          {/* Plates Grid with Luxury Shimmer Cards */}
          <div className="space-y-6">
            <div className="h-14 rounded-2xl border border-slate-200 bg-white p-4 skeleton-shimmer shadow-xs" />
            <PlateCardSkeletonGrid count={6} />
          </div>
        </div>
      </div>
    </>
  );
}

