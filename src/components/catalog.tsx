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
import { StoreHeaderActions } from './store-header-actions';
import styles from './catalog-type-selector.module.css';
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
      auctionStatus: auctionFilter ?? 'DIRECT'
    } as MarketplaceQuery),
    getReferenceData()
  ]);

  const isStoreMode = !auctionFilter;
  const selectorItemPadding = isStoreMode ? 'py-1' : 'py-1.5';
  const selectorLabelMargin = isStoreMode ? 'mt-1.5' : 'mt-2.5';
  const standardPreviewSize = isStoreMode ? styles.storePreview : 'w-full max-w-[272px] sm:max-w-[286px]';
  const sportsPreviewSize = isStoreMode ? styles.storePreview : 'w-full max-w-[260px] sm:max-w-[274px]';
  const isLive = auctionFilter === 'LIVE';
  const isUpcoming = auctionFilter === 'UPCOMING';
  const isCompleted = auctionFilter === 'COMPLETED';

  const title = isStoreMode
    ? 'متجر اللوحات المميزة للبيع المباشر'
    : isLive
      ? 'المزادات المباشرة'
      : isUpcoming
        ? 'المزادات القادمة'
        : isCompleted
          ? 'المزادات المنتهية'
          : 'اللوحات المميزة والمزادات';

  const subtitle = isStoreMode
    ? 'اقتنِ لوحتك المميزة فوراً بالسعر المطلوب دون انتظار المزادات، مع ضمان نقل الملكية الرسمي عبر منصة أبشر وحماية حساب الضمان.'
    : isLive
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

  const breadcrumbCurrent = isStoreMode
    ? 'المتجر المباشر'
    : isLive
      ? 'المزادات المباشرة'
      : isUpcoming
        ? 'المزادات القادمة'
        : isCompleted
          ? 'المزادات المنتهية'
          : 'المزادات الرسمية';

  const heroTabs = isStoreMode
    ? [
        {
          href: '/plates',
          label: 'كل المعروض بالمتجر',
          mobileLabel: 'كل المعروض',
          active: !clean.featured && !clean.digitsCount,
          icon: TabIconAllPlates,
          isLive: false
        },
        {
          href: '/plates?featured=true',
          label: 'لوحات النخبة VIP',
          mobileLabel: 'نخبة VIP',
          active: clean.featured === 'true',
          icon: TabIconElite,
          isLive: false
        },
        {
          href: '/plates?digitsCount=1',
          label: 'الأرقام الأحادية النادرة',
          mobileLabel: 'الأحادية النادرة',
          active: clean.digitsCount === '1',
          icon: TabIconSingleDigit,
          isLive: false
        }
      ]
    : [
        {
          href: '/auctions',
          label: 'كل اللوحات',
          mobileLabel: 'كل اللوحات',
          active: !auctionFilter || auctionFilter === 'ALL',
          icon: TabIconAllPlates,
          isLive: false
        },
        {
          href: '/auctions/live',
          label: 'مباشر الآن',
          mobileLabel: 'مباشر الآن',
          active: isLive,
          icon: TabIconLive,
          isLive: true
        },
        {
          href: '/auctions/upcoming',
          label: 'مزادات قادمة',
          mobileLabel: 'مزادات قادمة',
          active: isUpcoming,
          icon: TabIconUpcoming,
          isLive: false
        }
      ];

  return (
    <>
      {/* ============================================================== */}
      {/* 1. LUXURY PAGE HEADER HERO BANNER (HIGH-CONTRAST ROYAL NAVY)   */}
      {/* ============================================================== */}
      <section className="hero-luxury-ambient relative overflow-hidden border-b border-[#D9BB81]/30 pt-26 sm:pt-30 lg:pt-34 pb-26 sm:pb-30 lg:pb-34 text-white">
        <div className="container-fbs relative z-10">
          {/* Concise High-Contrast Breadcrumb Trail */}
          <nav
            aria-label="مسار التصفح"
            className="mb-3.5 sm:mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-300"
          >
            <Link href="/" className="hover:text-[#F5E3BE] transition-colors">
              الرئيسية
            </Link>
            <span className="text-[#D9BB81]/60">/</span>
            <span className="text-[#F5E3BE] font-bold">{breadcrumbCurrent}</span>
          </nav>

          {/* Editorial Title & Subtitle with Clean Vertical Rhythm */}
          <div className="max-w-3xl">
            <h1 className="text-[clamp(1.75rem,4.8vw,2.75rem)] font-black tracking-tight leading-[1.28] text-white">
              {isStoreMode ? (
                <>
                  متجر اللوحات المميزة{' '}
                  <span className="inline-block bg-gradient-to-r from-[#F5E3BE] via-[#E4C78D] to-[#C89B4B] bg-clip-text text-transparent">
                    للبيع المباشر
                  </span>
                </>
              ) : title === 'اللوحات المميزة والمزادات' ? (
                <>
                  اللوحات المميزة{' '}
                  <span className="inline-block bg-gradient-to-r from-[#F5E3BE] via-[#E4C78D] to-[#C89B4B] bg-clip-text text-transparent">
                    والمزادات الرسمية
                  </span>
                </>
              ) : (
                title
              )}
            </h1>

            <p className="mt-3 sm:mt-4 text-[14px] sm:text-[15.5px] leading-[1.8] text-slate-300 font-normal max-w-[62ch]">
              {subtitle}
            </p>
          </div>

          {/* Unified Hero Command Bar: Category Tabs + Store Wishlist/Cart Pod */}
          <div className="mt-7 sm:mt-8 pt-5 sm:pt-6 border-t border-white/10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-5">
            {/* Category Segmented Capsule */}
            <div className="relative w-full lg:w-auto lg:min-w-[500px] xl:min-w-[540px] max-w-2xl overflow-hidden rounded-2xl border border-[#D9BB81]/30 bg-[#060E1F]/90 p-1.5 backdrop-blur-xl shadow-[0_14px_34px_rgba(0,0,0,0.45)]">
              <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#D9BB81]/65 to-transparent" />

              <div className="grid grid-cols-3 gap-1.5 w-full">
                {heroTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Link
                      key={tab.href}
                      href={tab.href}
                      className={`group relative flex h-10 sm:h-[42px] items-center justify-center gap-1.5 rounded-xl px-2 sm:px-3.5 text-center text-[11.5px] sm:text-[12.5px] font-bold transition-all duration-200 w-full ${
                        tab.active
                          ? 'bg-gradient-to-r from-[#DFC38D] via-[#F2DFB6] to-[#C89B4B] text-[#071122] font-black shadow-[0_4px_14px_rgba(217,187,129,0.3)] border border-white/40'
                          : 'text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-[#D9BB81]/40'
                      }`}
                    >
                      <Icon
                        className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                          tab.active ? 'text-[#071122]' : 'text-[#D9BB81] group-hover:text-[#F5E3BE]'
                        }`}
                      />
                      <span className="whitespace-nowrap tracking-tight sm:hidden">{tab.mobileLabel}</span>
                      <span className="whitespace-nowrap tracking-tight hidden sm:inline">{tab.label}</span>
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

            {/* Store Wishlist & Cart Action Pod (Balanced 2-Column on Mobile, Left-Aligned on Desktop) */}
            {isStoreMode && <StoreHeaderActions />}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* UNIFIED LUXURY CONTENT ZONE (CRISP HIGH-CONTRAST WARM STONE)   */}
      {/* ============================================================== */}
      <div className="relative bg-[#F2F0EA] flow-root">

        {/* 2. AUTHENTIC SAUDI PLATE TYPE VISUAL SELECTOR (نوع اللوحة)      */}
        <section aria-label="نوع اللوحة المعتمدة" className={`container-fbs relative z-30 -mt-12 sm:-mt-15 lg:-mt-18 mb-7 sm:mb-9 ${isStoreMode ? styles.storeSelector : ''}`}>
        <div className={`relative overflow-hidden rounded-3xl border border-[#D9BB81]/35 bg-gradient-to-b from-[#0A162C] via-[#071020] to-[#050B16] px-4 sm:px-6 ${isStoreMode ? 'py-3 sm:py-3.5' : 'py-4 sm:py-5'} shadow-[0_22px_50px_-14px_rgba(4,9,20,0.65)]`}>
          {/* Top Luxury Gold Accent Line */}
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#d9b87f]/80 to-transparent pointer-events-none" />

          {/* Ambient Subtle Radial Glow */}
          <div className="pointer-events-none absolute -top-24 start-1/2 -translate-x-1/2 h-40 w-full max-w-xl rounded-full bg-gold/10 blur-[80px]" />

          {clean.type && (
            <div className="relative z-10 flex items-center justify-end mb-2">
              <Link
                href={removeFilterUrl('type')}
                className="group inline-flex items-center gap-1.5 rounded-xl border border-rose-400/40 bg-rose-500/15 px-3 py-1 pf-type-micro font-bold text-rose-300 hover:bg-rose-500/25 transition-colors shadow-xs"
              >
                <RotateCcw size={12} className="transition-transform group-hover:-rotate-90" />
                <span>عرض جميع الفئات</span>
              </Link>
            </div>
          )}

          {/* 3 Frameless Plate Selectors - Direct Plate + Concise Label Underneath */}
          <div className={`relative z-10 grid grid-cols-1 sm:grid-cols-3 ${isStoreMode ? 'gap-3 sm:gap-4' : 'gap-4 sm:gap-5'} items-center`}>
            {/* Plate 1: خصوصي */}
            <Link
              href={makeTypeUrl('خصوصي')}
              className={`group relative flex flex-col items-center justify-center ${selectorItemPadding} transition-all duration-300 cursor-pointer`}
            >
              <div
                className={`${standardPreviewSize} transition-all duration-300 group-hover:-translate-y-1 ${
                  clean.type === 'خصوصي'
                    ? 'scale-[1.03] drop-shadow-[0_0_18px_rgba(217,184,127,0.55)]'
                    : 'opacity-92 group-hover:opacity-100'
                }`}
              >
                <PlateVisualizer
                  lettersAr={['ب', 'ط', 'ل']}
                  lettersEn={['L', 'T', 'B']}
                  numbers="8888"
                  plateType="خصوصي"
                  compact
                  dark
                />
              </div>

              <div
                className={`${selectorLabelMargin} inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 pf-type-caption font-bold transition-all ${
                  clean.type === 'خصوصي'
                    ? 'bg-gradient-to-r from-[#d9b87f] via-[#ecd5a5] to-[#cb9b48] text-navy-deep font-black shadow-sm'
                    : 'text-slate-200 group-hover:text-gold-light'
                }`}
              >
                {clean.type === 'خصوصي' && <Check size={13} strokeWidth={3} />}
                <span>خصوصي</span>
              </div>
            </Link>

            {/* Plate 2: صغيرة رياضية */}
            <Link
              href={makeTypeUrl('صغيرة')}
              className={`group relative flex flex-col items-center justify-center ${selectorItemPadding} transition-all duration-300 cursor-pointer`}
            >
              <div
                className={`${sportsPreviewSize} transition-all duration-300 group-hover:-translate-y-1 ${
                  clean.type === 'صغيرة'
                    ? 'scale-[1.03] drop-shadow-[0_0_18px_rgba(217,184,127,0.55)]'
                    : 'opacity-92 group-hover:opacity-100'
                }`}
              >
                <PlateVisualizer
                  lettersAr={['ك', 'د', 'س']}
                  lettersEn={['K', 'D', 'S']}
                  numbers="3471"
                  plateType="صغيرة"
                  compact
                  dark
                />
              </div>

              <div
                className={`${selectorLabelMargin} inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 pf-type-caption font-bold transition-all ${
                  clean.type === 'صغيرة'
                    ? 'bg-gradient-to-r from-[#d9b87f] via-[#ecd5a5] to-[#cb9b48] text-navy-deep font-black shadow-sm'
                    : 'text-slate-200 group-hover:text-gold-light'
                }`}
              >
                {clean.type === 'صغيرة' && <Check size={13} strokeWidth={3} />}
                <span>صغيرة رياضية</span>
              </div>
            </Link>

            {/* Plate 3: نقل خاص */}
            <Link
              href={makeTypeUrl('نقل')}
              className={`group relative flex flex-col items-center justify-center ${selectorItemPadding} transition-all duration-300 cursor-pointer`}
            >
              <div
                className={`${standardPreviewSize} transition-all duration-300 group-hover:-translate-y-1 ${
                  clean.type === 'نقل'
                    ? 'scale-[1.03] drop-shadow-[0_0_18px_rgba(217,184,127,0.55)]'
                    : 'opacity-92 group-hover:opacity-100'
                }`}
              >
                <PlateVisualizer
                  lettersAr={['ن', 'ق', 'ل']}
                  lettersEn={['L', 'G', 'N']}
                  numbers="7341"
                  plateType="نقل"
                  compact
                  dark
                />
              </div>

              <div
                className={`${selectorLabelMargin} inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 pf-type-caption font-bold transition-all ${
                  clean.type === 'نقل'
                    ? 'bg-gradient-to-r from-[#d9b87f] via-[#ecd5a5] to-[#cb9b48] text-navy-deep font-black shadow-sm'
                    : 'text-slate-200 group-hover:text-gold-light'
                }`}
              >
                {clean.type === 'نقل' && <Check size={13} strokeWidth={3} />}
                <span>نقل خاص</span>
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
                  className="ms-auto inline-flex items-center gap-1 pf-type-micro font-bold text-rose-400 hover:text-rose-300 hover:underline"
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
          mode={isStoreMode ? 'store' : 'auction'}
        />
      </section>
      </div>
    </>
  );
}

export function CatalogSkeleton({ store = false }: { store?: boolean }) {
  return (
    <>
      {/* 1. Luxury Hero Skeleton with Shimmer */}
      <section className="hero-luxury-ambient relative overflow-hidden border-b border-[#D9BB81]/30 pt-26 sm:pt-30 lg:pt-34 pb-26 sm:pb-30 lg:pb-34 text-white">
        <div className="container-fbs relative z-10 space-y-4">
          <div className="h-4 w-36 rounded-md skeleton-shimmer-dark" />
          <div className="h-11 w-80 sm:w-[440px] rounded-xl skeleton-shimmer-dark" />
          <div className="h-5 w-full max-w-xl rounded-md skeleton-shimmer-dark" />
          <div className="mt-7 pt-5 border-t border-white/10">
            <div className="grid grid-cols-3 gap-2 max-w-xl p-1.5 rounded-2xl border border-[#D9BB81]/25 bg-[#060E1F]/90">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 w-full rounded-xl skeleton-shimmer-dark" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Overlapping 3-Plate Type Selector Skeleton + Full-Width Stage Bar + Full-Height 2-Column Skeleton */}
      <div className="relative bg-[#F2F0EA] flow-root pb-16 sm:pb-24">
        <section className={`container-fbs relative z-30 -mt-12 sm:-mt-15 lg:-mt-18 mb-7 sm:mb-9 ${store ? styles.storeSelector : ''}`}>
          <div className={`rounded-3xl border border-[#D9BB81]/35 bg-[#071020] px-4 sm:px-6 ${store ? 'py-3 sm:py-3.5' : 'py-5 sm:py-6'} shadow-xl`}>
            <div className={`grid grid-cols-1 sm:grid-cols-3 ${store ? 'gap-3 sm:gap-4' : 'gap-4 sm:gap-6'} items-center`}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={`flex flex-col items-center ${store ? 'gap-1.5 py-1' : 'gap-2.5'}`}>
                  {store ? (
                    <div className={`${styles.storePreview} aspect-[52/11] rounded-xl skeleton-shimmer-dark`} />
                  ) : (
                    <div className="h-[68px] w-full max-w-[220px] rounded-xl skeleton-shimmer-dark" />
                  )}
                  <div className={`${store ? 'h-7' : 'h-5'} w-24 rounded-full skeleton-shimmer-dark`} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="container-fbs">
          {/* Full-Width Stage Bar Skeleton (Filter Button + Search Bar + View Toggle) */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-200/80 bg-white p-2.5 sm:px-4 sm:py-3 shadow-xs">
            <div className="flex flex-1 flex-wrap sm:flex-nowrap items-center gap-2.5 min-w-0">
              <div className="h-10 w-24 rounded-xl skeleton-shimmer shrink-0" />
              <div className="h-10 flex-1 min-w-[200px] max-w-md rounded-xl skeleton-shimmer" />
            </div>
            <div className="h-10 w-44 rounded-xl skeleton-shimmer shrink-0" />
          </div>

          {/* Default 4-Column Plates Grid Skeleton (12 cards = 3 rows × 4 columns) */}
          <div className="min-w-0">
            <PlateCardSkeletonGrid count={12} />
          </div>
        </div>
      </div>
    </>
  );
}

