'use client';

import React, { useState, useEffect, useTransition } from 'react';
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
  Sparkles,
  MapPin,
  Clock
} from 'lucide-react';
import type { MarketplacePlate } from '@/modules/marketplace/types';
import {
  PlateCard,
  EmptyState,
  PlateVisualizer,
  normalizePlateType,
  statusLabels
} from '@/components/ui';
import { CatalogFilters } from '@/components/catalog-filters';
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
}

/**
 * 1. Wide Luxury Plate Card (كارت عريض كبير ومميز)
 */
export function PlateCardWide({ plate }: { plate: MarketplacePlate }) {
  const isLive = plate.auction?.status === 'LIVE';
  const isUpcoming =
    plate.auction?.status === 'SCHEDULED' || plate.auction?.status === 'REGISTRATION_OPEN';
  const statusText = statusLabels[plate.auction?.status ?? plate.status] ?? plate.status;
  const rawPrice = plate.auction?.currentPriceHalalas ?? plate.priceHalalas ?? '0';

  const normType = normalizePlateType(plate.type);
  const isTransport = normType === 'transport';
  const isSmall = normType === 'small';

  return (
    <article className="group relative flex flex-col md:flex-row items-stretch justify-between rounded-3xl border-2 border-slate-200/90 hover:border-gold/60 bg-white hover:bg-gradient-to-r hover:from-white hover:via-[#fcfbf9] hover:to-white shadow-[0_10px_30px_-8px_rgba(15,23,42,0.06)] hover:shadow-[0_20px_50px_-10px_rgba(15,23,42,0.14),0_0_30px_rgba(217,184,127,0.18)] transition-all duration-300 p-4 sm:p-5 gap-5 overflow-hidden">
      {/* Top Ambient Gold Light Edge on hover */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-gold/0 group-hover:via-gold/80 to-transparent transition-all duration-500 z-10" />

      {/* Right: Plate Showcase Canvas */}
      <Link
        href={`/plates/${plate.slug}`}
        className="w-full md:w-[280px] lg:w-[310px] shrink-0 rounded-2xl p-4 flex items-center justify-center bg-gradient-to-b from-[#f1f4f9] via-[#e8edf5] to-[#dde4ee] border border-slate-200/90 shadow-[inset_0_3px_10px_rgba(15,23,42,0.08)] group-hover:border-gold/40 group-hover:shadow-[inset_0_3px_12px_rgba(217,184,127,0.15)] transition-all"
      >
        <div className="w-full transition-transform duration-300 group-hover:scale-[1.03] filter drop-shadow-[0_6px_14px_rgba(0,0,0,0.12)]">
          <PlateVisualizer
            lettersAr={plate.lettersAr}
            lettersEn={plate.lettersEn}
            numbers={plate.numbers}
            plateType={plate.type}
            compact
          />
        </div>
      </Link>

      {/* Center: Comprehensive Details */}
      <div className="flex flex-1 flex-col justify-between py-1">
        <div>
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-black text-emerald-800 border border-emerald-500/35 shadow-xs shadow-emerald-500/10 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600 shadow-[0_0_6px_#10b981]" />
                </span>
                <span>{statusText}</span>
              </span>
            ) : isUpcoming ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-black text-amber-800 border border-amber-500/30 backdrop-blur-md">
                <Clock size={12} strokeWidth={2.5} />
                <span>{statusText}</span>
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-slate-100/90 px-3 py-1 text-xs font-bold text-slate-700 backdrop-blur-md border border-slate-200/80">
                {statusText}
              </span>
            )}

            {plate.featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400/20 via-gold/25 to-amber-500/20 px-3 py-1 text-xs font-black text-gold-dark border border-gold/40 shadow-xs">
                <Sparkles size={11} className="text-gold-dark" />
                <span>نخبة</span>
              </span>
            )}

            {plate.verified && (
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-slate-700 bg-slate-100/90 px-3 py-1 rounded-full border border-slate-200/80 shadow-2xs">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>موثّقة</span>
              </span>
            )}
          </div>

          {/* Plate typography headline */}
          <Link href={`/plates/${plate.slug}`} className="block group-hover:text-gold-dark transition-colors">
            <h3 className="text-xl sm:text-2xl font-black text-navy tracking-tight flex items-center gap-3">
              <span>{plate.lettersAr.join(' ')}</span>
              <span className="font-norwester text-gold-dark font-black">{plate.numbers}</span>
              <span className="font-norwester text-sm text-slate-400 font-bold" dir="ltr">
                ({plate.lettersEn.join('')}-{plate.numbers})
              </span>
            </h3>
          </Link>

          {/* Specs & classification */}
          <div className="flex flex-wrap items-center gap-2 mt-2.5">
            {isTransport ? (
              <span className="inline-flex items-center gap-1 rounded-xl bg-sky-500/10 px-3 py-1 text-xs font-black text-sky-800 border border-sky-500/30">
                <span className="text-[9px]">▼</span>
                <span>نقل خاص وتجاري</span>
              </span>
            ) : isSmall ? (
              <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-800 border border-emerald-500/30">
                <span>صغيرة (رياضية)</span>
              </span>
            ) : (
              <span className="rounded-xl bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 border border-slate-200/80">
                {plate.type || 'خصوصي'}
              </span>
            )}

            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200/60">
              <MapPin size={13} className="text-gold-dark" />
              <span>{plate.city || 'الرياض'}</span>
            </div>
          </div>
        </div>

        {/* Small subtitle notice */}
        <p className="text-xs text-slate-400 font-medium mt-2 hidden sm:block">
          لوحة معتمدة رسمياً ومسجلة في قواعد بيانات المرور السعودي.
        </p>
      </div>

      {/* Left: Price, Bids & CTA Button */}
      <div className="flex flex-col justify-between items-start md:items-end border-t md:border-t-0 md:border-s border-slate-100 pt-4 md:pt-0 md:ps-6 md:min-w-[210px] shrink-0">
        <div>
          <span className="text-xs font-black text-slate-500 block text-start md:text-end">
            {plate.auction ? 'المزايدة الحالية' : 'السعر المطلوب'}
          </span>
          <div className="mt-1 flex items-baseline gap-1.5 text-navy" dir="ltr">
            <span className="tabular-nums tracking-tight font-norwester text-3xl sm:text-4xl font-black text-slate-900 leading-none">
              {formatEnglishAmount(rawPrice)}
            </span>
            <SarSymbol className="w-4.5 h-4.5 text-gold-accent inline-block self-center" />
          </div>

          {plate.auction?.bidCount !== undefined && plate.auction.bidCount > 0 && (
            <div className="mt-2 text-start md:text-end">
              <span className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-b from-[#0c162d] to-navy text-gold-accent px-3.5 py-1 text-xs font-black shadow-xs border border-gold/30">
                <Gavel size={12} className="text-gold" />
                <span className="font-norwester text-sm font-black">{plate.auction.bidCount}</span>
                <span className="text-[11px] text-slate-300">مزايدة</span>
              </span>
            </div>
          )}
        </div>

        <div className="w-full mt-4">
          <Link
            href={`/plates/${plate.slug}`}
            className="group/btn relative flex items-center justify-between w-full rounded-2xl bg-gradient-to-r from-[#070e1c] via-[#0c162d] to-[#070e1c] px-5 py-3 text-xs sm:text-sm font-black text-white transition-all duration-300 hover:shadow-[0_10px_25px_-5px_rgba(12,22,45,0.4),0_0_20px_rgba(217,184,127,0.35)] hover:border-gold/50 border border-slate-800 active:scale-[0.98] overflow-hidden"
          >
            <span className="text-gold-light group-hover/btn:text-white transition-colors">
              {plate.auction ? 'دخول المزاد والمزايدة' : 'تفاصيل اللوحة والشراء'}
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/10 border border-white/15 text-gold group-hover/btn:bg-gold group-hover/btn:text-navy group-hover/btn:border-gold transition-all duration-200 group-hover/btn:-translate-x-1 ms-2">
              <ArrowLeft size={14} strokeWidth={2.5} />
            </div>
          </Link>
        </div>
      </div>
    </article>
  );
}

/**
 * 2. Detailed Auction Ledger Table (جدول تفصيلي)
 */
export function PlateTableView({ plates }: { plates: MarketplacePlate[] }) {
  return (
    <div className="rounded-3xl border-2 border-[#0c162d]/25 hover:border-[#0c162d]/50 bg-white shadow-sm overflow-hidden flex flex-col lg:h-[calc(100vh-7.5rem)] transition-all">
      {/* Outer Horizontal Scroller for smaller displays */}
      <div className="flex-1 flex flex-col min-h-0 overflow-x-auto">
        <div className="min-w-[860px] flex-1 flex flex-col min-h-0">
          {/* 1. TABLE HEADER: Fixed at the very top of the card, completely above the vertical scrollbar */}
          <div className="bg-gradient-to-r from-[#070e1c] via-[#0c162d] to-[#070e1c] text-white border-b border-slate-700/60 shrink-0 select-none z-10">
            <div
              dir="rtl"
              className="grid grid-cols-[280px_1.1fr_1fr_1.3fr_90px_130px] items-center text-xs font-black"
              style={{ paddingInlineStart: '6px' }}
            >
              <div className="py-4 px-5 text-start">لوحة المركبة</div>
              <div className="py-4 px-4 text-start">الفئة والمدينة</div>
              <div className="py-4 px-4 text-start">حالة المزاد</div>
              <div className="py-4 px-4 text-start">المزايدة الحالية</div>
              <div className="py-4 px-4 text-center">المزايدات</div>
              <div className="py-4 px-4 text-center">الإجراء</div>
            </div>
          </div>

          {/* 2. SCROLLABLE ROWS:
                 - Starts strictly BELOW the header!
                 - dir="ltr" puts the vertical scrollbar on the RIGHT side!
                 - Inner content is dir="rtl" so all columns & Arabic text align naturally!
          */}
          <div
            dir="ltr"
            className="flex-1 overflow-y-auto table-scrollbar relative bg-white min-h-0"
          >
            <div dir="rtl" className="divide-y divide-slate-100 bg-white">
              {plates.length === 0 ? (
                <div className="py-16 text-center text-slate-400 font-bold text-sm">
                  لا توجد لوحات معروضة حالياً تطابق معايير التصفية.
                </div>
              ) : (
                plates.map((plate) => {
                  const isLive = plate.auction?.status === 'LIVE';
                  const isUpcoming =
                    plate.auction?.status === 'SCHEDULED' ||
                    plate.auction?.status === 'REGISTRATION_OPEN';
                  const statusText = statusLabels[plate.auction?.status ?? plate.status] ?? plate.status;
                  const rawPrice = plate.auction?.currentPriceHalalas ?? plate.priceHalalas ?? '0';

                  const normType = normalizePlateType(plate.type);
                  const isTransport = normType === 'transport';
                  const isSmall = normType === 'small';

                  return (
                    <div
                      key={plate.id}
                      className="grid grid-cols-[280px_1.1fr_1fr_1.3fr_90px_130px] items-center hover:bg-slate-50/90 transition-colors group/row py-3 text-xs"
                    >
                      {/* Column 1: Wide Authentic Plate Visualizer */}
                      <div className="py-1 px-5 w-[280px]">
                        <Link
                          href={`/plates/${plate.slug}`}
                          className="block w-full max-w-[265px] rounded-2xl p-2.5 bg-gradient-to-b from-[#f1f4f9] via-[#e8edf5] to-[#dde4ee] border border-slate-200/90 shadow-2xs group-hover/row:border-[#0c162d]/40 group-hover/row:shadow-xs transition-all"
                        >
                          <div className="w-full transition-transform duration-200 group-hover/row:scale-[1.02] filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
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

                      {/* Column 2: Type & City */}
                      <div className="py-2 px-4">
                        <div className="flex flex-col gap-1.5 items-start">
                          {isTransport ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-sky-500/10 px-2 py-0.5 text-[10px] font-black text-sky-800 border border-sky-500/30">
                              <span>▼ نقل</span>
                            </span>
                          ) : isSmall ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black text-emerald-800 border border-emerald-500/30">
                              <span>صغيرة رياضية</span>
                            </span>
                          ) : (
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 border border-slate-200/80">
                              {plate.type || 'خصوصي'}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                            <MapPin size={11} className="text-slate-400" />
                            <span>{plate.city || 'الرياض'}</span>
                          </span>
                        </div>
                      </div>

                      {/* Column 3: Status & Verification */}
                      <div className="py-2 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          {isLive ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-black text-emerald-800 border border-emerald-500/30">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-ping" />
                              <span>{statusText}</span>
                            </span>
                          ) : isUpcoming ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-black text-amber-800 border border-amber-500/30">
                              <Clock size={11} />
                              <span>{statusText}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">
                              {statusText}
                            </span>
                          )}

                          {plate.verified && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                              <ShieldCheck size={12} />
                              <span>موثّقة</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Column 4: Price */}
                      <div className="py-2 px-4">
                        <div className="flex items-baseline gap-1 text-navy" dir="ltr">
                          <span className="font-norwester text-lg font-black text-slate-900">
                            {formatEnglishAmount(rawPrice)}
                          </span>
                          <SarSymbol className="w-3.5 h-3.5 text-gold-dark inline-block self-center" />
                        </div>
                      </div>

                      {/* Column 5: Bid Count */}
                      <div className="py-2 px-4 text-center">
                        {plate.auction?.bidCount !== undefined && plate.auction.bidCount > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-800 border border-slate-200/80">
                            <Gavel size={11} className="text-slate-600" />
                            <span className="font-norwester">{plate.auction.bidCount}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </div>

                      {/* Column 6: Action */}
                      <div className="py-2 px-4 text-center">
                        <Link
                          href={`/plates/${plate.slug}`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#070e1c] to-navy text-white hover:text-gold-light px-3.5 py-2 text-xs font-black border border-[#0c162d]/40 hover:border-[#0c162d] shadow-2xs hover:shadow-xs transition-all active:scale-95 whitespace-nowrap"
                        >
                          <span>دخول المزاد</span>
                          <ArrowLeft size={12} strokeWidth={2.5} />
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Internal Scroll Status Bar */}
      <div className="border-t border-slate-200/80 bg-slate-50/90 px-5 py-2.5 flex items-center justify-between text-xs text-slate-500 font-bold shrink-0">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>المعروض بالجدول: <strong className="text-navy font-norwester">{plates.length}</strong> لوحة</span>
        </span>
        <span className="text-[11px] text-slate-400 font-medium">شريط التمرير الداخلي في الجانب الأيمن ↕</span>
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
  available
}: CatalogStageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Normalize view mode from URL query param ('table' | 'wide' | 'grid')
  const rawView = searchParams.get('view');
  const urlMode: ViewMode =
    rawView === 'table' ? 'table' : rawView === 'wide' ? 'wide' : 'grid';

  // Local state for instant zero-latency UI response
  const [viewMode, setViewMode] = useState<ViewMode>(urlMode);

  // Synchronize state ONLY when the URL actually changes (e.g. browser Back / Forward buttons)
  useEffect(() => {
    setViewMode(urlMode);
  }, [urlMode]);

  const handleModeChange = (mode: ViewMode) => {
    if (mode === viewMode) return;

    // 1. Instant local switch on first click
    setViewMode(mode);

    // 2. Smoothly update URL query param in background transition
    const p = new URLSearchParams(searchParams.toString());
    if (mode === 'grid') {
      p.delete('view');
    } else {
      p.set('view', mode);
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
      {/* FULL-WIDTH STAGE BAR (بعرض السكشن بالكامل مع خيارات العرض)       */}
      {/* ============================================================== */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-slate-200/90 bg-white p-4 sm:p-5 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.06),0_0_15px_rgba(217,184,127,0.08)]">
        {/* Right side: Count & Page info */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Total Count Badge */}
          <div className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#070e1c] via-navy to-[#070e1c] px-4 py-2 border border-gold/30 shadow-xs text-white">
            <span className="text-xs font-medium text-slate-300">معروض حالياً:</span>
            <span className="font-norwester text-gold-light text-lg sm:text-xl font-black tracking-wider">
              {total}
            </span>
            <span className="text-xs font-bold text-gold-accent">لوحة مميزة</span>
          </div>

          {/* Page Info */}
          <div className="flex items-center gap-1.5 rounded-xl bg-slate-100/90 border border-slate-200/80 px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-2xs">
            <span>صفحة</span>
            <strong className="font-norwester text-navy text-sm font-black">{page}</strong>
            <span className="text-slate-400">من</span>
            <strong className="font-norwester text-navy text-sm font-black">{totalPages}</strong>
          </div>
        </div>

        {/* Left side: View Mode Toggle Buttons (شبكة / كروت عريضة / جدول) */}
        <div className="flex items-center gap-1 rounded-2xl bg-slate-100/90 p-1.5 border border-slate-200/80 shadow-2xs">
          {/* Option 1: Grid */}
          <button
            type="button"
            onClick={() => handleModeChange('grid')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-black transition-all ${
              viewMode === 'grid'
                ? 'bg-gradient-to-b from-[#070e1c] to-navy text-gold-accent border border-gold/30 shadow-xs'
                : 'text-slate-600 hover:text-navy hover:bg-white/80'
            }`}
            title="عرض شبكة (كروت)"
          >
            <LayoutGrid size={15} />
            <span className="hidden sm:inline">شبكة</span>
          </button>

          {/* Option 2: Wide Card */}
          <button
            type="button"
            onClick={() => handleModeChange('wide')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-black transition-all ${
              viewMode === 'wide'
                ? 'bg-gradient-to-b from-[#070e1c] to-navy text-gold-accent border border-gold/30 shadow-xs'
                : 'text-slate-600 hover:text-navy hover:bg-white/80'
            }`}
            title="عرض كروت عريضة"
          >
            <RectangleHorizontal size={15} />
            <span className="hidden sm:inline">كروت عريضة</span>
          </button>

          {/* Option 3: Table */}
          <button
            type="button"
            onClick={() => handleModeChange('table')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-black transition-all ${
              viewMode === 'table'
                ? 'bg-gradient-to-b from-[#070e1c] to-navy text-gold-accent border border-gold/30 shadow-xs'
                : 'text-slate-600 hover:text-navy hover:bg-white/80'
            }`}
            title="عرض جدول تفصيلي"
          >
            <TableIcon size={15} />
            <span className="hidden sm:inline">جدول تفصيلي</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2-COLUMN MAIN CONTENT: STICKY FILTERS & SELECTED PLATES VIEW    */}
      {/* ============================================================== */}
      <div className="grid gap-8 lg:grid-cols-[350px_1fr] xl:grid-cols-[370px_1fr] items-start">
        {/* Sticky Filter Sidebar */}
        <aside className="lg:sticky lg:top-24 self-start">
          <CatalogFilters
            initialQuery={clean}
            cities={cities}
            types={types}
            currentPath={currentPath}
          />
        </aside>

        {/* Selected View Mode Stage */}
        <div className="flex flex-col min-w-0">
          {plates.length ? (
            <>
              {viewMode === 'grid' && (
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                  {plates.map((plate) => (
                    <PlateCard key={plate.id} plate={plate} />
                  ))}
                </div>
              )}

              {viewMode === 'wide' && (
                <div className="space-y-4">
                  {plates.map((plate) => (
                    <PlateCardWide key={plate.id} plate={plate} />
                  ))}
                </div>
              )}

              {viewMode === 'table' && <PlateTableView plates={plates} />}
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

          {/* Pagination Controls */}
          {total > pageSize && (
            <nav
              aria-label="صفحات النتائج"
              className="mt-10 flex items-center justify-between border-t border-slate-200/80 pt-6"
            >
              {page > 1 ? (
                <Link
                  className="flex items-center gap-2 rounded-xl bg-white border border-gold/30 hover:border-gold hover:bg-gold/10 text-navy px-4 py-2.5 text-xs font-black shadow-xs transition-all active:scale-95"
                  href={`?${new URLSearchParams({ ...clean, page: String(page - 1) })}`}
                >
                  <ArrowRight size={14} />
                  <span>الصفحة السابقة</span>
                </Link>
              ) : (
                <span />
              )}

              <span className="rounded-xl bg-white border border-slate-200 px-4 py-1.5 text-xs font-bold text-slate-600 shadow-2xs">
                {page} / {totalPages}
              </span>

              {page * pageSize < total && (
                <Link
                  className="flex items-center gap-2 rounded-xl bg-white border border-gold/30 hover:border-gold hover:bg-gold/10 text-navy px-4 py-2.5 text-xs font-black shadow-xs transition-all active:scale-95"
                  href={`?${new URLSearchParams({ ...clean, page: String(page + 1) })}`}
                >
                  <span>الصفحة التالية</span>
                  <ArrowLeft size={14} />
                </Link>
              )}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
