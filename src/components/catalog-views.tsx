'use client';

import React, { useState, useEffect, useTransition, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  LayoutGrid,
  RectangleHorizontal,
  Table as TableIcon,
  ArrowRight,
  ArrowLeft,
  Gavel,
  ShieldCheck,
  SlidersHorizontal,
  Clock,
  Search,
  X,
  Heart,
  ShoppingCart,
  ShoppingBag,
  Check,
  Trash2,
  CheckCircle2,
  Lock
} from 'lucide-react';
import type { MarketplacePlate } from '@/modules/marketplace/types';
import {
  PlateCard,
  EmptyState,
  FbsStageWatermark,
  PlateVisualizer,
  normalizePlateType,
  statusLabels
} from '@/components/ui';
import { CatalogFilters } from '@/components/catalog-filters';
import { SharePlateButton } from '@/components/share-plate-button';
import { SarSymbol, formatEnglishAmount } from '@/components/sar-symbol';

export type ViewMode = 'grid' | 'wide' | 'table';

interface CatalogStageProps {
  plates: MarketplacePlate[];
  total: number;
  page: number;
  pageSize: number;
  clean: Record<string, string>;
  cities: { id: string; name_ar: string }[];
  types: { id: string; name_ar: string }[];
  currentPath: string;
  configured: boolean;
  available: boolean;
  mode?: 'auction' | 'store';
}

/**
 * 1. Wide Luxury Plate Card (كارت عريض كبير ومميز)
 */
export function PlateCardWide({
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
      data-pf-audit="plate-card-wide"
      className="group relative flex flex-col xl:flex-row items-stretch justify-between rounded-2xl border border-[#E7E5DF] hover:border-[#D9BB81] bg-white shadow-[0_4px_16px_rgba(20,36,60,0.04)] hover:shadow-[0_12px_28px_rgba(20,36,60,0.08)] transition-all duration-300 p-3.5 sm:p-4 gap-4 overflow-hidden"
    >
      {/* Top Specular Edge */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D9BB81]/40 to-transparent pointer-events-none" />

      {/* Main Content Group: Plate + Details side-by-side from sm+ */}
      <div className="flex flex-col sm:flex-row items-stretch gap-4 flex-1 min-w-0">
        {/* Right: Plate Showcase Canvas with Etched FBS Watermark */}
        <Link
          href={`/plates/${plate.slug}`}
          className="relative overflow-hidden w-full sm:w-[284px] xl:w-[312px] min-h-[134px] sm:min-h-[148px] shrink-0 rounded-xl px-2.5 py-5 sm:px-3.5 sm:py-6 flex items-center justify-center bg-gradient-to-b from-[#FFFFFF] via-[#F6F8FC] to-[#EBF0F6] border border-[#DCE3EE] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_2px_6px_rgba(15,23,42,0.04)] group-hover:border-[#D9BB81]/70 transition-all"
        >
          <FbsStageWatermark />
          <div className="relative z-10 w-full flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02]">
            <PlateVisualizer
              lettersAr={plate.lettersAr}
              lettersEn={plate.lettersEn}
              numbers={plate.numbers}
              plateType={plate.type}
              compact
            />
          </div>
        </Link>

        {/* Center: Details */}
        <div className="flex flex-1 flex-col justify-between py-0.5 min-w-0">
          <div>
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              {isStore ? (
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
                </>
              )}
            </div>

            {/* Plate typography headline */}
            <Link href={`/plates/${plate.slug}`} className="block group-hover:text-[#9E7B35] transition-colors">
              <h3 className="pf-type-h3 font-black text-[#14243C] tracking-tight flex flex-wrap items-center gap-2">
                <span>{plate.lettersAr.join(' ')}</span>
                <span className="font-norwester text-[#9E7B35] font-black text-xl sm:text-2xl">{plate.numbers}</span>
                <span className="font-norwester pf-type-micro text-slate-400 font-bold" dir="ltr">
                  ({plate.lettersEn.join('')}-{plate.numbers})
                </span>
              </h3>
            </Link>
          </div>

          <p className="pf-type-micro text-[#64748B] font-medium mt-2">
            {isStore
              ? 'لوحة متاحة للشراء الفوري المباشر مع نقل الملكية عبر منصة أبشر.'
              : 'لوحة معتمدة رسمياً ومسجلة في قواعد بيانات المرور السعودي.'}
          </p>
        </div>
      </div>

      {/* Left: Price & Action Controls */}
      {isStore ? (
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between xl:justify-end border-t xl:border-t-0 xl:border-s border-[#ECE9E2] pt-3 xl:pt-0 xl:ps-5 xl:min-w-[295px] gap-3 shrink-0">
          <div>
            <span className="pf-type-micro font-semibold text-[#64748B] block mb-0.5">
              السعر المطلوب
            </span>
            <div className="flex items-baseline gap-1 text-[#14243C]" dir="rtl">
              <span className="tabular-nums tracking-tight font-norwester text-xl sm:text-2xl font-black text-[#14243C] leading-none" dir="ltr">
                {formatEnglishAmount(rawPrice)}
              </span>
              <SarSymbol className="w-3.5 h-3.5 text-[#9E7B35] inline-block self-center shrink-0" />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onToggleFavorite?.(plate)}
              aria-label={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
              title={isFavorite ? 'في المفضلة' : 'إضافة للمفضلة'}
              className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all active:scale-95 ${
                isFavorite
                  ? 'border-rose-300 bg-rose-50 text-rose-600 shadow-2xs'
                  : 'border-[#E5E2D9] bg-[#FAF9F6] text-slate-500 hover:border-rose-300 hover:bg-rose-50/60 hover:text-rose-600'
              }`}
            >
              <Heart size={15} className={isFavorite ? 'fill-rose-500 text-rose-600' : ''} />
            </button>

            <button
              type="button"
              onClick={() => onToggleCart?.(plate)}
              aria-label={isInCart ? 'في سلة الشراء' : 'إضافة إلى سلة الشراء'}
              title={isInCart ? 'مضافة في سلة الشراء' : 'إضافة لسلة الشراء'}
              className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all active:scale-95 ${
                isInCart
                  ? 'border-[#9E7B35] bg-[#FAF7F0] text-[#8C6B2D] shadow-2xs'
                  : 'border-[#E5E2D9] bg-[#FAF9F6] text-slate-500 hover:border-[#D9BB81] hover:bg-[#FAF7F0] hover:text-[#8C6B2D]'
              }`}
            >
              {isInCart ? <Check size={15} strokeWidth={2.5} /> : <ShoppingCart size={15} />}
            </button>

            <SharePlateButton slug={plate.slug} plateLabel={plateLabel} size="md" />

            <button
              type="button"
              onClick={() => onBuyNow?.(plate)}
              className="group/btn min-h-9 sm:min-h-[38px] py-2 px-4 rounded-xl bg-[#14243C] hover:bg-[#08162B] text-white pf-type-micro font-bold shadow-2xs hover:shadow-xs active:scale-[0.98] transition-all inline-flex items-center justify-center gap-1.5"
            >
              <ShoppingBag size={13} className="text-[#D9BB81] shrink-0" />
              <span>شراء</span>
              <ArrowLeft size={12} className="text-[#D9BB81] shrink-0 transition-transform duration-200 group-hover/btn:-translate-x-0.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row xl:flex-col justify-between items-start sm:items-center xl:items-end border-t xl:border-t-0 xl:border-s border-[#ECE9E2] pt-3 xl:pt-0 xl:ps-5 xl:min-w-[235px] gap-3 shrink-0">
          <div className="flex flex-wrap items-center xl:items-end justify-between w-full sm:w-auto xl:w-full gap-2">
            <div>
              <span className="pf-type-micro font-semibold text-[#64748B] block text-start xl:text-end mb-0.5">
                {plate.auction ? 'المزايدة الحالية' : 'السعر المطلوب'}
              </span>
              <div className="flex items-baseline gap-1 text-[#14243C] justify-start xl:justify-end" dir="rtl">
                <span className="tabular-nums tracking-tight font-norwester text-xl sm:text-2xl font-black text-[#14243C] leading-none" dir="ltr">
                  {formatEnglishAmount(rawPrice)}
                </span>
                <SarSymbol className="w-3.5 h-3.5 text-[#9E7B35] inline-block self-center shrink-0" />
              </div>
            </div>

            {plate.auction?.bidCount !== undefined && plate.auction.bidCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-[#FAF9F6] border border-[#E5E2D9] px-2.5 py-1 pf-type-micro font-bold text-[#14243C] shrink-0">
                <Gavel size={12} className="text-[#9E7B35] shrink-0" />
                <span className="font-norwester font-black">{plate.auction.bidCount}</span>
                <span className="text-[#64748B]">مزايدة</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto xl:w-full">
            <SharePlateButton slug={plate.slug} plateLabel={plateLabel} size="md" />
            <Link
              href={`/plates/${plate.slug}`}
              className="group/btn flex-1 sm:min-w-[185px] min-h-9 sm:min-h-[38px] py-2 px-4 rounded-xl bg-[#14243C] hover:bg-[#08162B] text-white pf-type-micro font-bold shadow-2xs hover:shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
            >
              <Gavel size={13} className="text-[#D9BB81] shrink-0 transition-transform duration-200 group-hover/btn:-rotate-12" />
              <span>{plate.auction ? 'دخول المزاد والمزايدة' : 'تفاصيل اللوحة والشراء'}</span>
              <ArrowLeft size={13} className="text-[#D9BB81] shrink-0 transition-transform duration-200 group-hover/btn:-translate-x-1" />
            </Link>
          </div>
        </div>
      )}
    </article>
  );
}

/**
 * 2. Detailed Ledger Table (جدول تفصيلي)
 */
export function PlateTableView({
  plates,
  mode = 'auction',
  wishlistIds = [],
  cartIds = [],
  onToggleFavorite,
  onToggleCart,
  onBuyNow
}: {
  plates: MarketplacePlate[];
  mode?: 'auction' | 'store';
  wishlistIds?: string[];
  cartIds?: string[];
  onToggleFavorite?: (plate: MarketplacePlate) => void;
  onToggleCart?: (plate: MarketplacePlate) => void;
  onBuyNow?: (plate: MarketplacePlate) => void;
}) {
  const isStore = mode === 'store';

  return (
    <div className="rounded-3xl border-2 border-[#0c162d]/25 hover:border-[#0c162d]/50 bg-white shadow-sm overflow-hidden flex flex-col transition-all">
      {/* Outer Horizontal Scroller for smaller displays */}
      <div className="flex-1 flex flex-col min-h-0 overflow-x-auto table-scrollbar">
        <div className="min-w-[820px] flex-1 flex flex-col min-h-0">
          {/* 1. TABLE HEADER */}
          <div className="bg-gradient-to-r from-[#070e1c] via-[#0c162d] to-[#070e1c] text-white border-b border-slate-700/60 shrink-0 select-none z-10">
            <div
              dir="rtl"
              className="grid grid-cols-[268px_minmax(96px,0.85fr)_minmax(110px,0.95fr)_minmax(120px,1fr)_108px_154px] items-center pf-type-micro font-black"
            >
              <div className="py-4 px-4 text-start">لوحة المركبة</div>
              <div className="py-4 px-3 text-start">نوع اللوحة</div>
              <div className="py-4 px-3 text-start">{isStore ? 'التوثيق' : 'حالة المزاد'}</div>
              <div className="py-4 px-3 text-start">{isStore ? 'السعر المطلوب' : 'المزايدة الحالية'}</div>
              <div className="py-4 px-2 text-center">{isStore ? 'حفظ ومشاركة' : 'المزايدات'}</div>
              <div className="py-4 px-3 text-center">الإجراء</div>
            </div>
          </div>

          {/* 2. ROWS */}
          <div dir="ltr" className="flex-1 relative bg-white min-h-0">
            <div dir="rtl" className="divide-y divide-slate-100 bg-white">
              {plates.length === 0 ? (
                <div className="py-16 text-center text-slate-400 font-bold pf-type-body">
                  لا توجد لوحات معروضة حالياً تطابق معايير التصفية.
                </div>
              ) : (
                plates.map((plate) => {
                  const isLive = plate.auction?.status === 'LIVE';
                  const isUpcoming =
                    plate.auction?.status === 'SCHEDULED' ||
                    plate.auction?.status === 'REGISTRATION_OPEN';
                  const statusText = statusLabels[plate.auction?.status ?? plate.status] ?? plate.status;
                  const rawPrice = isStore
                    ? plate.priceHalalas ?? plate.auction?.currentPriceHalalas ?? '0'
                    : plate.auction?.currentPriceHalalas ?? plate.priceHalalas ?? '0';

                  const normType = normalizePlateType(plate.type);
                  const isTransport = normType === 'transport';
                  const isSmall = normType === 'small';
                  const isFavorite = wishlistIds.includes(plate.id);
                  const isInCart = cartIds.includes(plate.id);
                  const plateLabel = `${plate.lettersAr.join(' ')} ${plate.numbers}`;

                  return (
                    <div
                      key={plate.id}
                      className="grid grid-cols-[268px_minmax(96px,0.85fr)_minmax(110px,0.95fr)_minmax(120px,1fr)_108px_154px] items-center hover:bg-slate-50/90 transition-colors group/row py-3 pf-type-micro"
                    >
                      {/* Column 1: Plate Visualizer */}
                      <div className="py-1 px-3 w-[268px]">
                        <Link
                          href={`/plates/${plate.slug}`}
                          className="block w-full rounded-2xl p-2 bg-gradient-to-b from-[#f1f4f9] via-[#e8edf5] to-[#dde4ee] border border-slate-200/90 shadow-2xs group-hover/row:border-[#0c162d]/40 group-hover/row:shadow-xs transition-all"
                        >
                          <div className="w-full transition-transform duration-200 group-hover/row:scale-[1.02]">
                            <PlateVisualizer
                              lettersAr={plate.lettersAr}
                              lettersEn={plate.lettersEn}
                              numbers={plate.numbers}
                              plateType={plate.type}
                              compact
                            />
                          </div>
                        </Link>
                      </div>

                      {/* Column 2: Plate Type */}
                      <div className="py-2 px-3">
                        <div className="flex flex-col gap-1.5 items-start">
                          {isTransport ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 pf-type-micro font-bold text-amber-800 border border-amber-200/80">
                              <span>نقل خاص</span>
                            </span>
                          ) : isSmall ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 pf-type-micro font-bold text-slate-700 border border-slate-200">
                              <span>صغيرة</span>
                            </span>
                          ) : (
                            <span className="rounded-md bg-[#FAF9F6] px-2 py-0.5 pf-type-micro font-bold text-[#14243C] border border-[#E5E2D9]">
                              {plate.type || 'خصوصي'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Column 3: Verification (Store) or Status (Auction) */}
                      <div className="py-2 px-3">
                        {isStore ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 pf-type-micro font-bold text-emerald-700">
                            <ShieldCheck size={12} className="text-emerald-600 shrink-0" />
                            <span>موثّقة رسمياً</span>
                          </span>
                        ) : (
                          <div className="flex flex-col gap-1 items-start">
                            {isLive ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 pf-type-micro font-black text-emerald-800 border border-emerald-500/30">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-ping shrink-0" />
                                <span>{statusText}</span>
                              </span>
                            ) : isUpcoming ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 pf-type-micro font-black text-amber-800 border border-amber-500/30">
                                <Clock size={11} className="shrink-0" />
                                <span>{statusText}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 pf-type-micro font-bold text-slate-700">
                                {statusText}
                              </span>
                            )}

                            {plate.verified && (
                              <span className="inline-flex items-center gap-1 pf-type-micro font-bold text-emerald-700">
                                <ShieldCheck size={12} className="shrink-0" />
                                <span>موثّقة</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Column 4: Price */}
                      <div className="py-2 px-3">
                        <div className="flex items-baseline gap-1 text-navy" dir="ltr">
                          <span className="font-norwester text-lg font-black text-slate-900">
                            {formatEnglishAmount(rawPrice)}
                          </span>
                          <SarSymbol className="w-3.5 h-3.5 text-gold-dark inline-block self-center shrink-0" />
                        </div>
                      </div>

                      {/* Column 5: Wishlist/Cart/Share (Store) or Bid Count (Auction) */}
                      <div className="py-2 px-2 text-center">
                        {isStore ? (
                          <div className="inline-flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => onToggleFavorite?.(plate)}
                              aria-label="المفضلة"
                              className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-all ${
                                isFavorite
                                  ? 'border-rose-300 bg-rose-50 text-rose-600'
                                  : 'border-[#E5E2D9] bg-[#FAF9F6] text-slate-500 hover:text-rose-600'
                              }`}
                            >
                              <Heart size={13} className={isFavorite ? 'fill-rose-500 text-rose-600' : ''} />
                            </button>
                            <button
                              type="button"
                              onClick={() => onToggleCart?.(plate)}
                              aria-label="سلة الشراء"
                              className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-all ${
                                isInCart
                                  ? 'border-[#9E7B35] bg-[#FAF7F0] text-[#8C6B2D]'
                                  : 'border-[#E5E2D9] bg-[#FAF9F6] text-slate-500 hover:text-[#8C6B2D]'
                              }`}
                            >
                              {isInCart ? <Check size={13} strokeWidth={2.5} /> : <ShoppingCart size={13} />}
                            </button>
                            <SharePlateButton slug={plate.slug} plateLabel={plateLabel} size="sm" />
                          </div>
                        ) : plate.auction?.bidCount !== undefined && plate.auction.bidCount > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-2.5 py-1 pf-type-micro font-black text-slate-800 border border-slate-200/80">
                            <Gavel size={11} className="text-slate-600 shrink-0" />
                            <span className="font-norwester">{plate.auction.bidCount}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 pf-type-micro">-</span>
                        )}
                      </div>

                      {/* Column 6: Action */}
                      <div className="py-2 px-3 text-center">
                        {isStore ? (
                          <button
                            type="button"
                            onClick={() => onBuyNow?.(plate)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#14243C] hover:bg-[#08162B] text-white px-3.5 py-2 pf-type-micro font-bold shadow-2xs transition-all active:scale-95 whitespace-nowrap"
                          >
                            <ShoppingBag size={12} className="text-[#D9BB81] shrink-0" />
                            <span>شراء</span>
                            <ArrowLeft size={11} className="text-[#D9BB81] shrink-0" />
                          </button>
                        ) : (
                          <div className="inline-flex items-center justify-center gap-1.5">
                            <SharePlateButton slug={plate.slug} plateLabel={plateLabel} size="sm" />
                            <Link
                              href={`/plates/${plate.slug}`}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#070e1c] to-navy text-white hover:text-gold-light px-3 py-2 pf-type-micro font-black border border-[#0c162d]/40 hover:border-[#0c162d] shadow-2xs hover:shadow-xs transition-all active:scale-95 whitespace-nowrap"
                            >
                              <span>دخول المزاد</span>
                              <ArrowLeft size={12} strokeWidth={2.5} className="shrink-0" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Internal Status Bar */}
      <div className="border-t border-slate-200/80 bg-slate-50/90 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 pf-type-micro text-slate-500 font-bold shrink-0">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
          <span>المعروض بالجدول: <strong className="text-navy font-norwester">{plates.length}</strong> لوحة</span>
        </span>
        <span className="pf-type-micro text-slate-400 font-medium">
          {isStore ? 'متجر اللوحات المميزة للبيع المباشر' : 'سجل المزادات الرسمي المعتمد'}
        </span>
      </div>
    </div>
  );
}

/**
 * 3. Main Catalog View Stage: Full-Width Stage Ribbon & 3-Mode View Switcher
 */
export function CatalogStage({
  plates,
  total,
  page,
  pageSize,
  clean,
  cities,
  types,
  currentPath,
  configured,
  available,
  mode = 'auction'
}: CatalogStageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const isStore = mode === 'store';

  // Normalize view mode from URL query param ('table' | 'wide' | 'grid')
  const rawView = searchParams.get('view');
  const urlMode: ViewMode =
    rawView === 'table' ? 'table' : rawView === 'wide' ? 'wide' : 'grid';

  // Local state for instant zero-latency UI response
  const [viewMode, setViewMode] = useState<ViewMode>(urlMode);
  const [searchQ, setSearchQ] = useState<string>(clean.q || '');
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (
      searchParams.get('minPrice') ||
      searchParams.get('maxPrice') ||
      searchParams.get('priceRange')
    ) {
      count++;
    }
    if (searchParams.get('lettersPattern')) count++;
    if (searchParams.get('digitsCount') || searchParams.get('numbersPattern')) count++;
    if (searchParams.get('city')) count++;
    if (searchParams.get('featured')) count++;
    const sort = searchParams.get('sort');
    if (sort && sort !== 'newest') count++;
    return count;
  }, [searchParams]);

  // Store Wishlist & Cart state (persisted in localStorage)
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [cartIds, setCartIds] = useState<string[]>([]);
  const [drawerTab, setDrawerTab] = useState<'cart' | 'wishlist' | null>(null);
  const [checkoutDone, setCheckoutDone] = useState(false);

  useEffect(() => {
    if (!isStore) return;
    try {
      const savedWish = localStorage.getItem('fbs_store_wishlist');
      const savedCart = localStorage.getItem('fbs_store_cart');
      if (savedWish) setWishlistIds(JSON.parse(savedWish));
      if (savedCart) setCartIds(JSON.parse(savedCart));
    } catch {
      // ignore storage errors
    }
  }, [isStore]);

  useEffect(() => {
    const onOpenDrawer = (e: Event) => {
      const ce = e as CustomEvent<'cart' | 'wishlist'>;
      if (ce.detail === 'cart' || ce.detail === 'wishlist') {
        setCheckoutDone(false);
        setDrawerTab(ce.detail);
      }
    };
    window.addEventListener('fbs_open_store_drawer', onOpenDrawer);
    return () => window.removeEventListener('fbs_open_store_drawer', onOpenDrawer);
  }, []);

  const toggleWishlist = (plate: MarketplacePlate) => {
    const next = wishlistIds.includes(plate.id)
      ? wishlistIds.filter((id) => id !== plate.id)
      : [...wishlistIds, plate.id];
    setWishlistIds(next);
    try {
      localStorage.setItem('fbs_store_wishlist', JSON.stringify(next));
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('fbs_store_updated'));
    } catch {}
  };

  const toggleCart = (plate: MarketplacePlate) => {
    setCheckoutDone(false);
    const next = cartIds.includes(plate.id)
      ? cartIds.filter((id) => id !== plate.id)
      : [...cartIds, plate.id];
    setCartIds(next);
    try {
      localStorage.setItem('fbs_store_cart', JSON.stringify(next));
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('fbs_store_updated'));
    } catch {}
  };

  const handleBuyNow = (plate: MarketplacePlate) => {
    setCheckoutDone(false);
    const next = cartIds.includes(plate.id) ? cartIds : [...cartIds, plate.id];
    setCartIds(next);
    try {
      localStorage.setItem('fbs_store_cart', JSON.stringify(next));
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('fbs_store_updated'));
    } catch {}
    setDrawerTab('cart');
  };

  const cartPlates = useMemo(
    () => plates.filter((p) => cartIds.includes(p.id)),
    [plates, cartIds]
  );

  const wishlistPlates = useMemo(
    () => plates.filter((p) => wishlistIds.includes(p.id)),
    [plates, wishlistIds]
  );

  const cartTotalHalalas = useMemo(() => {
    let sum = 0;
    for (const p of cartPlates) {
      const raw = Number(p.priceHalalas ?? p.auction?.currentPriceHalalas ?? 0);
      if (!isNaN(raw)) sum += raw;
    }
    return String(sum);
  }, [cartPlates]);

  // Synchronize state when URL changes
  useEffect(() => {
    setViewMode(urlMode);
  }, [urlMode]);

  useEffect(() => {
    setSearchQ(searchParams.get('q') || '');
  }, [searchParams]);

  // Lock body scroll & close on Escape when Store Drawer is open
  useEffect(() => {
    if (!drawerTab) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerTab(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [drawerTab]);

  const handleSearchSubmit = (nextQ: string | null) => {
    const p = new URLSearchParams(searchParams.toString());
    if (nextQ && nextQ.trim()) {
      p.set('q', nextQ.trim());
    } else {
      p.delete('q');
    }
    p.delete('page');
    const qs = p.toString();
    startTransition(() => {
      router.push(qs ? `${currentPath}?${qs}` : currentPath, { scroll: false });
    });
  };

  const handleModeChange = (modeToSet: ViewMode) => {
    if (modeToSet === viewMode) return;
    setViewMode(modeToSet);

    const p = new URLSearchParams(searchParams.toString());
    if (modeToSet === 'grid') {
      p.delete('view');
    } else {
      p.set('view', modeToSet);
    }
    const qs = p.toString();
    startTransition(() => {
      router.replace(qs ? `${currentPath}?${qs}` : currentPath, { scroll: false });
    });
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="container-fbs">
      {/* ============================================================== */}
      {/* FULL-WIDTH STAGE BAR (زر الفلاتر + بحث سريع + خيارات العرض)    */}
      {/* ============================================================== */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 sm:gap-3 rounded-2xl border border-neutral-200/90 bg-white p-3 sm:px-4 sm:py-3 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.05)]">
        {/* Right/Start Group: Filter Toggle Button (Before Search Bar) + Quick Search Input */}
        <div className="flex flex-1 items-center gap-2 sm:gap-2.5 min-w-0">
          {/* 1. Filter Toggle Button — right BEFORE the Search Bar */}
          <button
            type="button"
            onClick={() => setIsFiltersOpen((prev) => !prev)}
            aria-expanded={isFiltersOpen}
            aria-controls="catalog-filters-panel"
            data-pf-action="toggle-filters"
            className={`inline-flex h-10 items-center justify-center gap-1.5 sm:gap-2 rounded-xl border px-3 sm:px-3.5 pf-type-micro font-bold transition-all active:scale-95 shrink-0 ${
              isFiltersOpen
                ? 'border-[#14243C] bg-[#14243C] text-[#D9BB81] shadow-xs'
                : activeFilterCount > 0
                  ? 'border-[#D9BB81] bg-[#FAF7F0] text-[#14243C] hover:bg-[#F3ECE0]'
                  : 'border-neutral-300 bg-neutral-100/90 text-[#14243C] hover:border-[#D9BB81] hover:bg-[#FAF7F0]'
            }`}
          >
            <SlidersHorizontal
              size={15}
              className={isFiltersOpen ? 'text-[#D9BB81] shrink-0' : 'text-[#9E7B35] shrink-0'}
            />
            <span>الفلاتر</span>
            {activeFilterCount > 0 && (
              <span
                className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 font-norwester text-[11px] font-black leading-none ${
                  isFiltersOpen
                    ? 'bg-[#D9BB81] text-[#14243C]'
                    : 'bg-[#14243C] text-[#D9BB81]'
                }`}
              >
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* 2. Quick Search Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchSubmit(searchQ);
            }}
            className="flex flex-1 items-center gap-1 sm:gap-1.5 min-w-0 md:max-w-md h-10 rounded-xl border border-neutral-300 bg-neutral-100/90 focus-within:bg-white focus-within:border-neutral-500 focus-within:ring-2 focus-within:ring-neutral-200 px-1 transition-all"
          >
            <Search size={15} className="ms-1.5 sm:ms-2 text-neutral-500 shrink-0" />
            <input
              id="header-search-q"
              type="text"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="ابحث بالحروف أو الأرقام..."
              className="flex-1 min-w-0 bg-transparent border-0 py-1 px-1 sm:px-1.5 pf-type-micro font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-0"
            />
            {searchQ && (
              <button
                type="button"
                onClick={() => {
                  setSearchQ('');
                  handleSearchSubmit(null);
                }}
                className="shrink-0 p-1 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-neutral-200/60 transition-colors"
                title="مسح البحث"
              >
                <X size={13} />
              </button>
            )}
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-neutral-800 hover:bg-neutral-900 text-white px-2.5 sm:px-3.5 py-1.5 pf-type-micro font-bold transition-all active:scale-95 shadow-xs"
            >
              بحث
            </button>
          </form>
        </div>

        {/* Left/End side: View Mode Toggle */}
        <div className="grid grid-cols-3 md:flex items-center gap-1 rounded-xl bg-neutral-100 p-1 border border-neutral-200 md:shrink-0">
          {/* Option 1: Grid */}
          <button
            type="button"
            onClick={() => handleModeChange('grid')}
            className={`flex items-center justify-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 pf-type-micro font-bold whitespace-nowrap transition-all ${
              viewMode === 'grid'
                ? 'bg-[#14243C] text-[#D9BB81] shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-white'
            }`}
            title={isFiltersOpen ? 'عرض شبكة (3 كروت)' : 'عرض شبكة (4 كروت)'}
          >
            <LayoutGrid size={14} className="shrink-0" />
            <span>شبكة</span>
          </button>

          {/* Option 2: Wide Card */}
          <button
            type="button"
            onClick={() => handleModeChange('wide')}
            className={`flex items-center justify-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 pf-type-micro font-bold whitespace-nowrap transition-all ${
              viewMode === 'wide'
                ? 'bg-[#14243C] text-[#D9BB81] shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-white'
            }`}
            title="عرض كروت عريضة"
          >
            <RectangleHorizontal size={14} className="shrink-0" />
            <span className="sm:hidden">كروت</span>
            <span className="hidden sm:inline">كروت عريضة</span>
          </button>

          {/* Option 3: Table */}
          <button
            type="button"
            onClick={() => handleModeChange('table')}
            className={`flex items-center justify-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 pf-type-micro font-bold whitespace-nowrap transition-all ${
              viewMode === 'table'
                ? 'bg-[#14243C] text-[#D9BB81] shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-white'
            }`}
            title="عرض جدول تفصيلي"
          >
            <TableIcon size={14} className="shrink-0" />
            <span className="sm:hidden">جدول</span>
            <span className="hidden sm:inline">جدول تفصيلي</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MAIN CONTENT: 4-COLUMN DEFAULT OR STICKY FILTERS + 3-COLUMN    */}
      {/* ============================================================== */}
      <div
        className={
          isFiltersOpen
            ? 'grid gap-4 xl:gap-5 lg:grid-cols-[255px_minmax(0,1fr)] xl:grid-cols-[265px_minmax(0,1fr)] items-start'
            : 'w-full'
        }
      >
        {/* Collapsible Sticky Filter Sidebar (Shown when Filter button is clicked) */}
        {isFiltersOpen && (
          <aside
            id="catalog-filters-panel"
            className="lg:sticky lg:top-24 self-start min-w-0 animate-fade-in-up"
          >
            <CatalogFilters
              initialQuery={clean}
              cities={cities}
              types={types}
              currentPath={currentPath}
              onClose={() => setIsFiltersOpen(false)}
            />
          </aside>
        )}

        {/* Selected View Mode Stage */}
        <div className="flex flex-col min-w-0" style={{ containerType: 'inline-size' }}>
          {plates.length ? (
            <>
              {viewMode === 'grid' && (
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 ${
                    isFiltersOpen ? 'lg:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-4'
                  } gap-3.5 sm:gap-4 items-stretch`}
                >
                  {plates.map((plate, idx) => (
                    <div
                      key={plate.id}
                      className="animate-fade-in-up h-full"
                      style={{ animationDelay: `${Math.min(idx * 50, 400)}ms` }}
                    >
                      <PlateCard
                        plate={plate}
                        mode={mode}
                        isFavorite={wishlistIds.includes(plate.id)}
                        isInCart={cartIds.includes(plate.id)}
                        onToggleFavorite={isStore ? toggleWishlist : undefined}
                        onToggleCart={isStore ? toggleCart : undefined}
                        onBuyNow={isStore ? handleBuyNow : undefined}
                      />
                    </div>
                  ))}
                </div>
              )}

              {viewMode === 'wide' && (
                <div className="space-y-4">
                  {plates.map((plate, idx) => (
                    <div
                      key={plate.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${Math.min(idx * 50, 400)}ms` }}
                    >
                      <PlateCardWide
                        plate={plate}
                        mode={mode}
                        isFavorite={wishlistIds.includes(plate.id)}
                        isInCart={cartIds.includes(plate.id)}
                        onToggleFavorite={isStore ? toggleWishlist : undefined}
                        onToggleCart={isStore ? toggleCart : undefined}
                        onBuyNow={isStore ? handleBuyNow : undefined}
                      />
                    </div>
                  ))}
                </div>
              )}

              {viewMode === 'table' && (
                <div className="animate-fade-in-up">
                  <PlateTableView
                    plates={plates}
                    mode={mode}
                    wishlistIds={wishlistIds}
                    cartIds={cartIds}
                    onToggleFavorite={isStore ? toggleWishlist : undefined}
                    onToggleCart={isStore ? toggleCart : undefined}
                    onBuyNow={isStore ? handleBuyNow : undefined}
                  />
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title={
                configured && !available
                  ? 'تعذر تحميل النتائج'
                  : 'لا توجد لوحات مطابقة لخيارات البحث'
              }
              description="جرّب تعديل معايير البحث أو تصفية الحروف والأرقام للاطلاع على كافة اللوحات المتاحة."
              href={currentPath}
              label="عرض كل اللوحات"
            />
          )}

          {/* Bottom Summary & Pagination Bar (المعروض أسفل الصفحة + التنقل بين الصفحات) */}
          {total > 0 && (
            <nav
              aria-label="صفحات النتائج والمعروض"
              className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200/90 pt-6"
            >
              {/* Previous Page (RTL: Previous button on right) */}
              <div className="w-36 flex justify-start">
                {page > 1 ? (
                  <Link
                    className="flex items-center gap-2 rounded-xl bg-white border border-neutral-200 hover:border-[#9E7B35] hover:bg-[#FAF7F0] text-neutral-800 px-4 py-2 pf-type-micro font-bold shadow-xs transition-all active:scale-95"
                    href={`?${new URLSearchParams({ ...clean, page: String(page - 1) })}`}
                  >
                    <ArrowRight size={14} className="text-[#9E7B35]" />
                    <span>الصفحة السابقة</span>
                  </Link>
                ) : null}
              </div>

              {/* Center: Unified Compact Summary Card (Count + Page in one pill) */}
              <div className="inline-flex items-center gap-2.5 rounded-xl bg-[#FAF9F6] border border-[#E5E2D9] px-4 py-2 pf-type-micro text-[#14243C] shadow-2xs">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#9E7B35] shrink-0" />
                  <span className="text-neutral-500 font-semibold">المعروض:</span>
                  <strong className="font-norwester text-[#14243C] text-sm font-black tracking-tight">
                    {total}
                  </strong>
                  <span className="font-bold text-[#9E7B35]">لوحة</span>
                </div>

                <span className="h-3.5 w-px bg-[#E5E2D9]" aria-hidden="true" />

                <div className="flex items-center gap-1 text-neutral-600 font-bold">
                  <span>صفحة</span>
                  <strong className="font-norwester text-[#14243C] font-black">{page}</strong>
                  <span className="text-neutral-400">من</span>
                  <strong className="font-norwester text-[#14243C] font-black">{totalPages}</strong>
                </div>
              </div>

              {/* Next Page (RTL: Next button on left) */}
              <div className="w-36 flex justify-end">
                {page * pageSize < total ? (
                  <Link
                    className="flex items-center gap-2 rounded-xl bg-white border border-neutral-200 hover:border-[#9E7B35] hover:bg-[#FAF7F0] text-neutral-800 px-4 py-2 pf-type-micro font-bold shadow-xs transition-all active:scale-95"
                    href={`?${new URLSearchParams({ ...clean, page: String(page + 1) })}`}
                  >
                    <span>الصفحة التالية</span>
                    <ArrowLeft size={14} className="text-[#9E7B35]" />
                  </Link>
                ) : null}
              </div>
            </nav>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* STORE SLIDE-OVER DRAWER (سلة الشراء والمفضلة - للمتجر فقط)      */}
      {/* ============================================================== */}
      {isStore &&
        drawerTab &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[120]"
            role="dialog"
            aria-modal="true"
            aria-label={drawerTab === 'cart' ? 'سلة الشراء المباشر' : 'قائمة اللوحات المفضلة'}
          >
            {/* Backdrop Overlay */}
            <div
              className="fixed inset-0 bg-[#040811]/65 backdrop-blur-xs transition-opacity"
              onClick={() => setDrawerTab(null)}
              aria-hidden="true"
            />

            {/* Right-Side Drawer Panel */}
            <div
              className="fixed inset-y-0 right-0 z-[121] flex h-full w-full max-w-md flex-col justify-between bg-white shadow-2xl border-l border-[#E7E5DF]"
              dir="rtl"
            >
              {/* Drawer Header & Tabs */}
              <div className="border-b border-[#ECE9E2] p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#9E7B35]/40 bg-[#FAF7F0] text-[#8C6B2D]">
                      {drawerTab === 'cart' ? <ShoppingCart size={18} /> : <Heart size={18} />}
                    </span>
                    <div>
                      <h3 className="pf-type-h3 font-black text-[#14243C]">
                        {drawerTab === 'cart' ? 'سلة الشراء المباشر' : 'قائمة اللوحات المفضلة'}
                      </h3>
                      <p className="pf-type-micro text-[#64748B] font-medium">
                        {drawerTab === 'cart'
                          ? 'شراء فوري بالسعر المطلوب مع ضمان نقل الملكية'
                          : 'اللوحات المحفوظة للمقارنة والشراء السريع'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDrawerTab(null)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E2D9] bg-[#FAF9F6] text-slate-500 hover:text-[#14243C] transition-colors"
                    aria-label="إغلاق"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Drawer Mode Switcher */}
                <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-[#FAF9F6] p-1 border border-[#E5E2D9]">
                  <button
                    type="button"
                    onClick={() => {
                      setCheckoutDone(false);
                      setDrawerTab('cart');
                    }}
                    className={`flex items-center justify-center gap-1.5 rounded-lg py-2 pf-type-micro font-bold transition-all ${
                      drawerTab === 'cart'
                        ? 'bg-[#14243C] text-[#D9BB81] shadow-2xs'
                        : 'text-[#526071] hover:text-[#14243C]'
                    }`}
                  >
                    <ShoppingCart size={13} />
                    <span>سلة الشراء ({cartPlates.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCheckoutDone(false);
                      setDrawerTab('wishlist');
                    }}
                    className={`flex items-center justify-center gap-1.5 rounded-lg py-2 pf-type-micro font-bold transition-all ${
                      drawerTab === 'wishlist'
                        ? 'bg-[#14243C] text-[#D9BB81] shadow-2xs'
                        : 'text-[#526071] hover:text-[#14243C]'
                    }`}
                  >
                    <Heart size={13} />
                    <span>المفضلة ({wishlistPlates.length})</span>
                  </button>
                </div>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 custom-scrollbar">
                {checkoutDone && drawerTab === 'cart' ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 text-center space-y-3 my-6">
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
                      <CheckCircle2 size={28} />
                    </span>
                    <h4 className="pf-type-h3 font-black text-[#14243C]">
                      تم تسجيل طلب الشراء المباشر بنجاح!
                    </h4>
                    <p className="pf-type-micro text-[#526071] leading-relaxed font-medium">
                      تم حجز اللوحات المختارة في سلة الشراء الخاصة بك. يمكنك الآن إتمام إجراءات التعاقد ونقل الملكية عبر صفحة اللوحة أو مع مستشار المبيعات المعتمد.
                    </p>
                  </div>
                ) : (drawerTab === 'cart' ? cartPlates : wishlistPlates).length === 0 ? (
                  <div className="py-16 text-center space-y-2">
                    <p className="pf-type-body font-bold text-[#14243C]">
                      {drawerTab === 'cart'
                        ? 'سلة الشراء فارغة حالياً'
                        : 'لا توجد لوحات محفوظة في المفضلة'}
                    </p>
                    <p className="pf-type-micro text-[#64748B]">
                      {drawerTab === 'cart'
                        ? 'اضغط على أيقونة السلة أو زر «شراء» على أي لوحة لإضافتها.'
                        : 'اضغط على أيقونة القلب أعلى أي لوحة لحفظها في المفضلة.'}
                    </p>
                  </div>
                ) : (
                  (drawerTab === 'cart' ? cartPlates : wishlistPlates).map((item) => {
                    const itemPrice = item.priceHalalas ?? item.auction?.currentPriceHalalas ?? '0';
                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-[#E7E5DF] bg-[#FAF9F6] p-3"
                      >
                        <Link
                          href={`/plates/${item.slug}`}
                          onClick={() => setDrawerTab(null)}
                          className="flex w-full items-center justify-center rounded-xl border border-[#E5E2D9] bg-gradient-to-b from-white via-[#F8FAFD] to-[#EDF1F7] px-2.5 py-3"
                          aria-label={`عرض تفاصيل اللوحة ${item.lettersAr.join(' ')} ${item.numbers}`}
                        >
                          <div className="w-full max-w-[360px]">
                            <PlateVisualizer
                              lettersAr={item.lettersAr}
                              lettersEn={item.lettersEn}
                              numbers={item.numbers}
                              plateType={item.type}
                            />
                          </div>
                        </Link>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="whitespace-nowrap rounded-md border border-[#E5E2D9] bg-white px-2 py-0.5 pf-type-micro font-bold text-[#14243C]">
                              {item.type || 'خصوصي'}
                            </span>
                            <div className="flex items-baseline gap-1 text-[#14243C]" dir="rtl">
                              <span
                                className="whitespace-nowrap font-norwester text-lg font-black text-[#14243C]"
                                dir="ltr"
                              >
                                {formatEnglishAmount(itemPrice)}
                              </span>
                              <SarSymbol className="w-3 h-3 text-[#9E7B35]" />
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-1.5">
                            {drawerTab === 'wishlist' && !cartIds.includes(item.id) && (
                              <button
                                type="button"
                                onClick={() => toggleCart(item)}
                                className="min-h-11 rounded-lg bg-[#14243C] px-3 pf-type-micro font-bold text-white hover:bg-[#08162B]"
                                aria-label={`إضافة إلى السلة: ${item.lettersAr.join(' ')} ${item.numbers}`}
                                title="إضافة إلى السلة"
                              >
                                + للسلة
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() =>
                                drawerTab === 'cart' ? toggleCart(item) : toggleWishlist(item)
                              }
                              className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                              aria-label={`${drawerTab === 'cart' ? 'إزالة من السلة' : 'إزالة من المفضلة'}: ${item.lettersAr.join(' ')} ${item.numbers}`}
                              title="حذف"
                            >
                              <Trash2 size={16} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer */}
              {drawerTab === 'cart' && cartPlates.length > 0 && (
                <div className="border-t border-[#ECE9E2] bg-[#FAF9F6] p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="pf-type-caption font-bold text-[#526071]">
                      إجمالي السعر المطلوب ({cartPlates.length} لوحة):
                    </span>
                    <div className="flex items-baseline gap-1 text-[#14243C]" dir="rtl">
                      <span
                        className="font-norwester text-xl font-black text-[#14243C]"
                        dir="ltr"
                      >
                        {formatEnglishAmount(cartTotalHalalas)}
                      </span>
                      <SarSymbol className="w-3.5 h-3.5 text-[#9E7B35]" />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pf-type-micro text-[#64748B] font-medium">
                    <Lock size={12} className="text-[#9E7B35] shrink-0" />
                    <span>حماية كاملة عبر حساب الضمان المعتمد ونقل ملكية عبر أبشر</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setCheckoutDone(true)}
                      className="w-full rounded-xl bg-[#14243C] hover:bg-[#08162B] py-3 px-4 pf-type-micro font-bold text-white shadow-sm flex items-center justify-center gap-1.5 transition-all"
                    >
                      <ShoppingBag size={14} className="text-[#D9BB81]" />
                      <span>إتمام الشراء المباشر</span>
                    </button>
                    <Link
                      href={`/plates/${cartPlates[0].slug}`}
                      onClick={() => setDrawerTab(null)}
                      className="w-full rounded-xl border border-[#D9BB81] bg-white hover:bg-[#FAF7F0] py-3 px-4 pf-type-micro font-bold text-[#14243C] flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span>صفحة اللوحة والتعاقد</span>
                      <ArrowLeft size={13} className="text-[#9E7B35]" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
