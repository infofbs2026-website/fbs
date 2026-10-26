import { PlateFace } from '@/components/plate-face';
import { PlateGlyphIcon } from '@/components/plate-vector-glyph';
import { getPlateGeometry, normalizePlateType, parsePlateData } from '@/lib/plate-data';
export { FbsPlateEmblem, SaudiEmblem, FbsPlateEmblem as FbsPlateShield } from '@/components/plate-emblems';
export { normalizePlateType, parsePlateData, SAUDI_PLATE_AR_TO_EN, SAUDI_PLATE_EN_TO_AR } from '@/lib/plate-data';
export type { SaudiPlateType } from '@/lib/plate-data';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  Clock,
  Gavel,
  Heart,
  SearchX,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart
} from 'lucide-react';
import type { MarketplacePlate } from '@/modules/marketplace/types';
import { SharePlateButton } from '@/components/share-plate-button';

export function PageTitle({
  title,
  description,
  eyebrow = 'فارس بن سعود للوحات المميزة'
}: {
  title: string;
  description?: string;
  eyebrow?: string;
}) {
  return (
    <section className="hero-luxury-ambient relative overflow-hidden text-white pt-26 sm:pt-30 lg:pt-34 pb-14 sm:pb-20 lg:pb-24 border-b border-[#D9BB81]/30 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.5)]">
      <div className="container-fbs relative z-10">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-xs font-bold text-gold-light backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            <span>{eyebrow}</span>
          </div>
        )}
        <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-white leading-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base font-normal">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}

export function EmptyState({
  title = 'لا توجد لوحات متاحة حاليًا',
  description = 'عد قريبًا للاطلاع على اللوحات المعتمدة والمزادات الجديدة.',
  href,
  label
}: {
  title?: string;
  description?: string;
  href?: string;
  label?: string;
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/80 p-8 text-center shadow-sm">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 text-gold-accent">
        <SearchX size={28} strokeWidth={1.75} />
      </span>
      <h2 className="text-lg font-bold text-navy">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{description}</p>
      {href && (
        <Link href={href} className="btn btn-navy mt-6 text-xs">
          {label}
          <ArrowLeft size={16} />
        </Link>
      )}
    </div>
  );
}

/**
 * Luxury Etched Platinum FBS Stage Watermark for Plate Showcase Trays:
 * Crowns the upper stage above the plate with the sleek GT Coupé silhouette
 * and anchors the lower stage below the plate with the custom FBS monogram.
 */
export function FbsStageWatermark({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none absolute inset-0 overflow-hidden z-0 flex items-center justify-center ${className}`}
    >
      {/* Unified Giant Etched Platinum FBS Watermark:
          GT Coupé silhouette crowns cleanly above the plate & wheel arches kiss top edge;
          Connected FBS monogram emerges boldly below the plate's bottom edge */}
      <svg
        viewBox="4 -12 252 180"
        className="w-[78%] max-w-[330px] h-[94%] object-contain text-[#94A3B8]/[0.26]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="currentColor" transform="translate(0, -14)">
          <path d="M 10,25.5 C 21,29 33,27.5 50,22 C 78,12.5 103,7.5 127,8.2 C 149,8.8 168,15.5 188,26.8 L 183.5,28.2 C 164,18.5 146,13.2 126.5,12.8 C 103,12.2 79,17 51,26.5 C 34,32 21,33.5 10,25.5 Z" />
          <path d="M 22,33.2 C 42,27.8 66,26.8 98,30.5 C 70,31.2 46,31.5 27,36.2 C 23,37 19.5,35.5 22,33.2 Z" />
          <path d="M 65,25.8 C 105,30.8 147,31.4 185,32 C 213,32.5 234,38 250,49.5 C 232,42.5 212,37.8 184.5,37 C 145,36 103,35 65,27.6 Z" />
          <path d="M 94,46.2 C 127,40.2 165,39.8 202,42.6 C 166,44 128,44.6 94,46.2 Z" />
          <path d="M 212,42.2 C 221,41.8 233,45.5 242,51.6 C 231,50.8 221,48.2 215,44.8 Z" />
          <path d="M 39,62.5 C 40.2,49.2 48,43 57.5,43 C 67,43 74.8,49.2 76,62.5 C 73.2,52.2 66.2,47.5 57.5,47.5 C 48.8,47.5 41.8,52.2 39,62.5 Z" />
          <path d="M 180,65 C 181.2,51.8 189,45.6 198.5,45.6 C 208,45.6 215.8,51.8 217,65 C 214.2,54.8 207.2,50.1 198.5,50.1 C 189.8,50.1 182.8,54.8 180,65 Z" />
          <path d="M 83,62.5 C 113,64.2 144,65 173,64.8 C 144,67.6 113,66.6 83,62.5 Z" />
        </g>

        <g fill="currentColor" transform="translate(0, 16)">
          <path
            fillRule="evenodd"
            d="M 22,79 H 131 C 142.2,79 149.8,86 149.8,96.5 C 149.8,103.6 145.6,109.2 139,111.6 C 147.2,114.2 152.2,120.8 152.2,129.4 C 152.2,139 144.2,145.5 133,145.5 H 90 V 98.2 H 110 V 104.8 H 130 C 133.6,104.8 135.8,102.3 135.8,99.4 C 135.8,96.5 133.6,94 130,94 H 42 V 104.8 H 83 L 72,119.8 H 42 V 145.5 H 22 Z M 110,119.8 H 131.5 C 135.6,119.8 138.2,122.4 138.2,125.2 C 138.2,128.1 135.6,130.5 131.5,130.5 H 110 Z"
          />
          <path d="M 182,79 H 238 L 227,94 H 183 C 178.4,94 176,96.5 176,99.4 C 176,102.3 178.4,104.8 183,104.8 H 214 C 228.2,104.8 238.2,113.4 238.2,125.2 C 238.2,137 228.2,145.5 214,145.5 H 165.5 C 161,145.5 158,142.1 158,138 C 158,133.9 161,130.5 165.5,130.5 H 213 C 217.6,130.5 220.2,128.1 220.2,125.2 C 220.2,122.4 217.6,119.8 213,119.8 H 182 C 167.8,119.8 158,111.2 158,99.4 C 158,87.6 167.8,79 182,79 Z" />
        </g>
      </svg>
    </div>
  );
}

export interface PlateVisualizerProps {
  lettersAr: string[] | string;
  lettersEn: string[] | string;
  numbers: string;
  large?: boolean;
  compact?: boolean;
  dark?: boolean;
  plateType?: string;
  plateSize?: 'long' | 'short' | 'sports' | 'standard';
  className?: string;
}

export function PlateArabicGlyph({ char, className = '' }: { char: string; className?: string }) {
  return <PlateGlyphIcon char={char} language="ar" className={className} />;
}

export function PlateLatinGlyph({ char, className = '' }: { char: string; className?: string }) {
  return <PlateGlyphIcon char={char} language="en" className={className} />;
}

/** FBS layout and identity are drawn once, inside the shared SVG face. */
export function PlateVisualizer({
  lettersAr, lettersEn, numbers, large = false, compact = false, dark = false,
  plateType = 'private', plateSize, className = ''
}: PlateVisualizerProps) {
  const normalizedType = normalizePlateType(plateType);
  const type = plateSize === 'sports' && normalizedType !== 'transport' ? 'small' : normalizedType;
  const format = plateSize === 'short' || plateSize === 'standard' ? 'standard' : 'long';
  const plate = parsePlateData(lettersAr, lettersEn, numbers);
  const geometry = getPlateGeometry(type, format);
  return (
    <div
      data-pf-proportional="saudi-plate"
      data-plate-status={plate.status}
      className={`hero-saudi-plate ${type === 'transport' ? 'is-transport' : ''} ${type === 'small' ? 'is-small' : 'is-private'} ${compact ? 'compact' : ''} ${large ? 'large' : ''} ${dark ? 'plate-dark-pedestal' : ''} ${format === 'standard' ? 'is-standard-format' : ''} digits-${plate.digitPairs.length || 1} letters-${plate.letterPairs.length || 1} ${className}`}
      style={{ aspectRatio: `${geometry.width} / ${geometry.height}` }}
      dir="ltr"
    >
      <PlateFace plate={plate} type={type} format={format} />
    </div>
  );
}

import { SarSymbol, formatEnglishAmount } from '@/components/sar-symbol';

export const statusLabels: Record<string, string> = {
  LIVE: 'مباشر الآن',
  SCHEDULED: 'قادم',
  REGISTRATION_OPEN: 'التسجيل مفتوح',
  WAITING_ROOM: 'غرفة الانتظار',
  ENDED: 'انتهى المزاد',
  COMPLETED: 'مكتمل',
  PAUSED: 'متوقف مؤقتًا',
  PUBLISHED: 'معروضة للبيع',
  SOLD: 'تم البيع',
  DRAFT: 'مسودة',
  SUBMITTED: 'تم الإرسال',
  UNDER_REVIEW: 'قيد المراجعة',
  APPROVED: 'معتمدة',
  CHANGES_REQUIRED: 'مطلوب تعديل',
  REJECTED: 'مرفوضة',
  QUALIFIED: 'مؤهل للمزايدة',
  PAYMENT_PENDING: 'بانتظار التأمين',
  AUTHORIZED: 'التأمين مفوّض'
};

export function PlateCard({
  plate,
  mode = 'auction',
  isFavorite = false,
  isInCart = false,
  onToggleFavorite,
  onToggleCart,
  onBuyNow
}: {
  plate: MarketplacePlate;
  mode?: 'auction' | 'store';
  isFavorite?: boolean;
  isInCart?: boolean;
  onToggleFavorite?: (plate: MarketplacePlate) => void;
  onToggleCart?: (plate: MarketplacePlate) => void;
  onBuyNow?: (plate: MarketplacePlate) => void;
}) {
  const isStore = mode === 'store';
  const isLive = plate.auction?.status === 'LIVE';
  const isUpcoming =
    plate.auction?.status === 'SCHEDULED' || plate.auction?.status === 'REGISTRATION_OPEN';
  const statusText = statusLabels[plate.auction?.status ?? plate.status] ?? plate.status;
  const rawPrice = isStore
    ? plate.priceHalalas ?? plate.auction?.currentPriceHalalas ?? '0'
    : plate.auction?.currentPriceHalalas ?? plate.priceHalalas ?? '0';

  const normType = normalizePlateType(plate.type);
  const isTransport = normType === 'transport';
  const isSmall = normType === 'small';
  const typeLabel = isTransport ? 'نقل خاص' : isSmall ? 'صغيرة' : 'خصوصي';
  const plateLabel = `${plate.lettersAr.join(' ')} ${plate.numbers}`;

  return (
    <article
      data-pf-audit="plate-card"
      style={{ containerType: 'inline-size' }}
      className="group relative h-full flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E7E5DF] hover:border-[#D9BB81] bg-white p-3 sm:p-3.5 shadow-[0_4px_16px_rgba(20,36,60,0.04)] hover:shadow-[0_12px_28px_rgba(20,36,60,0.08)] transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Subtle Top Specular Edge */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D9BB81]/40 to-transparent pointer-events-none" />

      {/* 1. Header:
          - Store mode: Plate Type (Right) & Wishlist + Cart + Share Actions (Left)
          - Auction mode: Status Badge (Right) & Plate Type + Share Action (Left) */}
      <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-[#ECE9E2] pf-type-micro whitespace-nowrap">
        {isStore ? (
          <>
            <span
              className={`inline-flex items-center rounded-lg px-2.5 py-1 pf-type-micro font-bold shadow-2xs shrink-0 ${
                isTransport
                  ? 'bg-amber-50 text-amber-800 border border-amber-200/80'
                  : isSmall
                    ? 'bg-slate-100 text-slate-700 border border-slate-200'
                    : 'bg-[#FAF9F6] text-[#14243C] border border-[#E5E2D9]'
              }`}
            >
              <span>{typeLabel}</span>
            </span>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onToggleFavorite?.(plate);
                }}
                aria-label={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                title={isFavorite ? 'في المفضلة' : 'إضافة للمفضلة'}
                className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-all active:scale-95 ${
                  isFavorite
                    ? 'border-rose-300 bg-rose-50 text-rose-600 shadow-2xs'
                    : 'border-[#E5E2D9] bg-[#FAF9F6] text-slate-500 hover:border-rose-300 hover:bg-rose-50/60 hover:text-rose-600'
                }`}
              >
                <Heart size={13} className={isFavorite ? 'fill-rose-500 text-rose-600' : ''} />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onToggleCart?.(plate);
                }}
                aria-label={isInCart ? 'في سلة الشراء' : 'إضافة إلى سلة الشراء'}
                title={isInCart ? 'مضافة في سلة الشراء' : 'إضافة لسلة الشراء'}
                className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-all active:scale-95 ${
                  isInCart
                    ? 'border-[#9E7B35] bg-[#FAF7F0] text-[#8C6B2D] shadow-2xs'
                    : 'border-[#E5E2D9] bg-[#FAF9F6] text-slate-500 hover:border-[#D9BB81] hover:bg-[#FAF7F0] hover:text-[#8C6B2D]'
                }`}
              >
                {isInCart ? <Check size={13} strokeWidth={2.5} /> : <ShoppingCart size={13} />}
              </button>

              <SharePlateButton slug={plate.slug} plateLabel={plateLabel} size="sm" />
            </div>
          </>
        ) : (
          <>
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 pf-type-micro font-bold text-emerald-700 border border-emerald-200/80 shadow-2xs">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
                </span>
                <span>{statusText}</span>
              </span>
            ) : isUpcoming ? (
              <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 pf-type-micro font-bold text-amber-800 border border-amber-200/80 shadow-2xs">
                <Clock size={11} strokeWidth={2.5} className="shrink-0" />
                <span>{statusText}</span>
              </span>
            ) : (
              <span className="inline-flex items-center rounded-lg bg-[#FAF9F6] px-2.5 py-1 pf-type-micro font-bold text-[#14243C] border border-[#E5E2D9] shadow-2xs">
                {statusText}
              </span>
            )}

            <div className="flex items-center gap-1 shrink-0">
              <span
                className={`inline-flex items-center rounded-lg px-2.5 py-1 pf-type-micro font-bold shadow-2xs ${
                  isTransport
                    ? 'bg-amber-50 text-amber-800 border border-amber-200/80'
                    : isSmall
                      ? 'bg-slate-100 text-slate-700 border border-slate-200'
                      : 'bg-[#FAF9F6] text-[#14243C] border border-[#E5E2D9]'
                }`}
              >
                <span>{typeLabel}</span>
              </span>

              <SharePlateButton slug={plate.slug} plateLabel={plateLabel} size="sm" />
            </div>
          </>
        )}
      </div>

      {/* 2. Center: Authentic Saudi Plate on Tall Platinum Showcase Stage with Etched FBS Watermark */}
      <Link
        href={`/plates/${plate.slug}`}
        className="relative overflow-hidden my-2 sm:my-2.5 flex items-center justify-center rounded-xl bg-gradient-to-b from-[#FFFFFF] via-[#F6F8FC] to-[#EBF0F6] px-2.5 py-5 sm:px-3 sm:py-6 min-h-[132px] sm:min-h-[150px] border border-[#DCE3EE] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_2px_6px_rgba(15,23,42,0.04)] transition-all duration-300 group-hover:border-[#D9BB81]/70"
      >
        <FbsStageWatermark />
        <div className="relative z-10 w-full flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02] filter drop-shadow-[0_6px_14px_rgba(15,23,42,0.13)]">
          <PlateVisualizer
            lettersAr={plate.lettersAr}
            lettersEn={plate.lettersEn}
            numbers={plate.numbers}
            plateType={plate.type}
            compact
          />
        </div>
      </Link>

      {/* 3. Footer:
          - Store mode: السعر المطلوب (Right) + زر شراء بجانب السعر مباشرة (Left)
          - Auction mode: المزايدة الحالية + عدد المزايدات + زر دخول المزاد */}
      {isStore ? (
        <div className="pt-2 sm:pt-2.5 border-t border-[#ECE9E2] flex items-center justify-between gap-2 min-w-0">
          <div className="min-w-0">
            <span className="pf-type-micro font-semibold text-[#64748B] block leading-tight mb-0.5">
              السعر المطلوب
            </span>
            <div className="flex items-baseline gap-1 text-[#14243C]" dir="rtl">
              <span
                className="tabular-nums font-norwester text-[clamp(1.1rem,6cqi,1.35rem)] font-black tracking-tight text-[#14243C] leading-none"
                dir="ltr"
              >
                {formatEnglishAmount(rawPrice)}
              </span>
              <SarSymbol className="w-3.5 h-3.5 text-[#9E7B35] inline-block self-center shrink-0" />
            </div>
          </div>

          {onBuyNow ? (
            <button
              type="button"
              onClick={() => onBuyNow(plate)}
              className="group/btn shrink-0 min-h-9 sm:min-h-[38px] py-2 px-3 sm:px-3.5 rounded-xl bg-[#14243C] hover:bg-[#08162B] text-white pf-type-micro font-bold shadow-2xs hover:shadow-xs active:scale-[0.98] transition-all inline-flex items-center justify-center gap-1.5"
            >
              <ShoppingBag size={13} className="text-[#D9BB81] shrink-0" />
              <span>شراء</span>
              <ArrowLeft size={12} className="text-[#D9BB81] shrink-0 transition-transform duration-200 group-hover/btn:-translate-x-0.5" />
            </button>
          ) : (
            <Link
              href={`/plates/${plate.slug}`}
              className="group/btn shrink-0 min-h-9 sm:min-h-[38px] py-2 px-3 sm:px-3.5 rounded-xl bg-[#14243C] hover:bg-[#08162B] text-white pf-type-micro font-bold shadow-2xs hover:shadow-xs active:scale-[0.98] transition-all inline-flex items-center justify-center gap-1.5"
            >
              <ShoppingBag size={13} className="text-[#D9BB81] shrink-0" />
              <span>شراء</span>
              <ArrowLeft size={12} className="text-[#D9BB81] shrink-0 transition-transform duration-200 group-hover/btn:-translate-x-0.5" />
            </Link>
          )}
        </div>
      ) : (
        <div className="pt-2 sm:pt-2.5 border-t border-[#ECE9E2] flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
            <div className="min-w-0">
              <span className="pf-type-micro font-semibold text-[#64748B] block leading-tight mb-0.5">
                {plate.auction ? 'المزايدة الحالية' : 'السعر المطلوب'}
              </span>
              <div className="flex items-baseline gap-1 text-[#14243C]" dir="rtl">
                <span
                  className="tabular-nums font-norwester text-[clamp(1.1rem,6cqi,1.35rem)] font-black tracking-tight text-[#14243C] leading-none"
                  dir="ltr"
                >
                  {formatEnglishAmount(rawPrice)}
                </span>
                <SarSymbol className="w-3.5 h-3.5 text-[#9E7B35] inline-block self-center shrink-0" />
              </div>
            </div>

            {plate.auction?.bidCount !== undefined && plate.auction.bidCount > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-xl bg-[#FAF9F6] border border-[#E5E2D9] px-2.5 py-1 pf-type-micro font-bold text-[#14243C] shrink-0">
                <Gavel size={12} className="text-[#9E7B35] shrink-0" />
                <span className="font-norwester font-black">{plate.auction.bidCount}</span>
                <span className="text-[#64748B]">مزايدة</span>
              </span>
            ) : plate.verified ? (
              <span className="inline-flex items-center gap-1 pf-type-micro font-bold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/70 shrink-0">
                <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                <span>موثّقة</span>
              </span>
            ) : null}
          </div>

          <Link
            href={`/plates/${plate.slug}`}
            className="group/btn w-full min-h-9 sm:min-h-[38px] py-2 px-3 rounded-xl bg-[#14243C] hover:bg-[#08162B] text-white pf-type-micro font-bold shadow-2xs hover:shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 mt-0.5"
          >
            <Gavel size={13} className="text-[#D9BB81] shrink-0 transition-transform duration-200 group-hover/btn:-rotate-12" />
            <span className="text-center">
              {plate.auction ? 'دخول المزاد والمزايدة' : 'تفاصيل اللوحة والشراء'}
            </span>
            <ArrowLeft size={13} className="text-[#D9BB81] shrink-0 transition-transform duration-200 group-hover/btn:-translate-x-1" />
          </Link>
        </div>
      )}
    </article>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton-shimmer rounded-lg ${className}`} />;
}

export function PlateCardSkeleton() {
  return (
    <article className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E7E5DF] bg-white p-3 sm:p-3.5 shadow-2xs">
      <div className="flex items-center justify-between pb-2 border-b border-[#ECE9E2]">
        <div className="h-5 w-20 rounded-full skeleton-shimmer" />
        <div className="h-5 w-24 rounded-lg skeleton-shimmer" />
      </div>

      <div className="my-2 rounded-xl bg-[#F6F8FC] h-[132px] sm:h-[150px] border border-[#DCE3EE] flex items-center justify-center p-2.5">
        <div className="w-full max-w-[230px] h-[64px] rounded-lg skeleton-shimmer" />
      </div>

      <div className="pt-2 border-t border-[#ECE9E2] space-y-2.5">
        <div className="flex items-end justify-between">
          <div className="space-y-1.5">
            <div className="h-3 w-16 rounded-md skeleton-shimmer" />
            <div className="h-5 w-24 rounded-md skeleton-shimmer" />
          </div>
          <div className="h-6 w-16 rounded-xl skeleton-shimmer" />
        </div>
        <div className="h-9 w-full rounded-xl skeleton-shimmer" />
      </div>
    </article>
  );
}

export function PlateCardSkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <PlateCardSkeleton key={i} />
      ))}
    </div>
  );
}

