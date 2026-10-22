'use client';

import React, { useRef, useState, useEffect, memo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Gavel,
  ShieldCheck
} from 'lucide-react';
import { PlateVisualizer } from '@/components/ui';
import { SarSymbol } from '@/components/sar-symbol';
import type { MarketplacePlate } from '@/modules/marketplace/types';
import { ScrollReveal } from '@/components/home-motion';

interface HomeEndingSoonProps {
  endingSoonAuctions: MarketplacePlate[];
}

function formatSar(halalas?: string | number | null) {
  if (!halalas) return '0';
  const num = Math.round(Number(halalas) / 100);
  return num.toLocaleString('en-US');
}

/**
 * Deterministic auction time formatting (hours and minutes only).
 * Updated calmly every 30 seconds to completely eliminate React render storms.
 */
function getAuctionTime(seed: number) {
  const baseMinutes = seed % 3 === 0 ? 35 : seed % 3 === 1 ? 155 : 290;
  const initialOffset = (seed * 17) % 35;
  const totalMinutes = Math.max(8, baseMinutes + initialOffset);

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  if (hours > 0) {
    return {
      text: `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')} س`,
      color: hours <= 1 ? 'text-amber-600 font-bold' : 'text-[#14243C] font-semibold'
    };
  }
  return {
    text: `${mins} دقيقة`,
    color: mins <= 15 ? 'text-rose-500 font-bold' : 'text-amber-600 font-bold'
  };
}

/**
 * Reusable Card Component for Ending Soon Auctions
 */
const EndingSoonCard = memo(function EndingSoonCard({
  plate,
  lotNum,
  timeInfo
}: {
  plate: MarketplacePlate;
  lotNum: number;
  timeInfo: { text: string; color: string };
}) {
  const rawPrice = plate.auction?.currentPriceHalalas ?? plate.priceHalalas ?? '0';

  return (
    <article
      dir="rtl"
      className="@container relative shrink-0 w-[clamp(260px,76vw,292px)] sm:w-[295px] rounded-2xl overflow-hidden border border-[#E7E4DC] hover:border-[#D9BB81]/80 shadow-[0_4px_16px_rgba(20,36,60,0.04)] hover:shadow-[0_12px_28px_rgba(20,36,60,0.08)] transition-all duration-300 bg-white p-3 sm:p-3.5 flex flex-col justify-between select-none"
    >
      {/* Subtle Top Specular Edge */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D9BB81]/40 to-transparent pointer-events-none" />

      {/* -------------------------------------------------------- */}
      {/* POSTER HEADER: LOT NUMBER & LIVE STATUS (2 PILLS ONLY)   */}
      {/* -------------------------------------------------------- */}
      <div className="flex items-center justify-between pb-2 border-b border-[#ECE9E2]">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D9BB81]/40 bg-[#FAF9F5] px-2.5 py-0.5 text-[11px] font-bold text-[#8C6B2D] shadow-2xs">
          <Gavel size={11} className="text-[#9E7B35]" />
          <span>لوط #{String(lotNum).padStart(2, '0')}</span>
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10.5px] font-bold text-emerald-700 border border-emerald-200/70 shadow-2xs">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
          </span>
          <span>مزايدة حية</span>
        </span>
      </div>

      {/* -------------------------------------------------------- */}
      {/* POSTER CENTER: AUTHENTIC SAUDI PLATE (SLIGHTLY COMPACTED) */}
      {/* -------------------------------------------------------- */}
      <div className="my-1.5 sm:my-2 py-1.5 sm:py-2 px-1 w-full flex items-center justify-center rounded-xl bg-gradient-to-b from-[#FAF9F6] via-[#F3F0EA] to-[#ECE8E0] border border-[#E4E1D7] transition-all duration-300 group-hover:border-[#D9BB81]/60">
        <div className="w-full flex justify-center py-0.5 transition-transform duration-300 group-hover:scale-[1.02]">
          <div className="w-full max-w-[240px] flex justify-center scale-[0.92] origin-center">
            <PlateVisualizer
              lettersAr={plate.lettersAr}
              lettersEn={plate.lettersEn}
              numbers={plate.numbers}
              plateType={plate.type}
              compact
              className="w-full filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.06)]"
            />
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------- */}
      {/* POSTER FOOTER: PRICE (RIGHT), TIMER (LEFT) & CTA         */}
      {/* -------------------------------------------------------- */}
      <div className="pt-2 sm:pt-2.5 border-t border-[#ECE9E2] flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2.5">
          <div>
            <span className="text-[10.5px] font-medium text-[#64748B] flex items-center gap-1 mb-0.5">
              <Gavel size={11} className="text-[#9E7B35] shrink-0" />
              <span>المزايدة الحالية</span>
            </span>
            <div className="flex items-baseline gap-1" dir="rtl">
              <span className="font-norwester text-base sm:text-[18px] font-black tracking-tight text-[#14243C] leading-none" dir="ltr">
                {formatSar(rawPrice)}
              </span>
              <SarSymbol className="w-3 h-3 text-[#9E7B35] inline-block self-center" />
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10.5px] font-medium text-[#64748B] flex items-center justify-end gap-1 mb-0.5">
              <Clock size={11} className="text-[#9E7B35]" />
              <span>الوقت المتبقي</span>
            </span>
            <span
              className={`font-norwester text-xs sm:text-[14px] tracking-wide leading-none select-none tabular-nums ${timeInfo.color}`}
              dir="ltr"
            >
              {timeInfo.text}
            </span>
          </div>
        </div>

        <Link
          href={`/plates/${plate.slug}`}
          className="group w-full h-9 sm:h-[38px] rounded-xl bg-gradient-to-r from-[#D9BB81] via-[#E0CDA4] to-[#C9A569] hover:from-[#E6D4AF] hover:to-[#D4B375] text-[#08162B] text-xs font-bold shadow-xs hover:shadow-sm active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 mt-0.5"
        >
          <Gavel size={13} className="text-[#08162B] transition-transform duration-200 group-hover:-rotate-12" />
          <span>دخول المزاد والمزايدة</span>
          <ArrowLeft size={13} className="text-[#08162B] transition-transform duration-200 group-hover:-translate-x-1" />
        </Link>
      </div>
    </article>
  );
});

export function HomeEndingSoon({ endingSoonAuctions }: HomeEndingSoonProps) {
  const plates = endingSoonAuctions && endingSoonAuctions.length > 0 ? endingSoonAuctions : [];

  // Duplicated set for seamless infinite desktop GPU marquee
  const desktopLoopedPlates = plates.length > 0 ? [...plates, ...plates] : [];

  // 30-Second Calm Clock: zero CPU drain
  const [, setTimeTick] = useState<number>(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeTick((t) => t + 1);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Desktop Manual Nudge Support
  const [desktopShift, setDesktopShift] = useState(0);
  const [isManualDesktop, setIsManualDesktop] = useState(false);
  const manualTimerRef = useRef<NodeJS.Timeout | null>(null);

  const nudgeDesktop = (direction: 'next' | 'prev') => {
    setIsManualDesktop(true);
    const step = 315;
    setDesktopShift((prev) => (direction === 'next' ? prev - step : prev + step));

    if (manualTimerRef.current) clearTimeout(manualTimerRef.current);
    manualTimerRef.current = setTimeout(() => {
      setIsManualDesktop(false);
      setDesktopShift(0);
    }, 4500);
  };

  // Mobile Native Touch Scroll Container
  const mobileScrollRef = useRef<HTMLDivElement | null>(null);

  const nudgeMobile = (direction: 'next' | 'prev') => {
    if (!mobileScrollRef.current) return;
    const step = 300;
    mobileScrollRef.current.scrollBy({
      left: direction === 'next' ? -step : step,
      behavior: 'smooth'
    });
  };

  if (plates.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24 text-[#14243C] select-none bg-white border-b border-[#E7E5DF]">
      {/* Top 1px Accent Line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D9BB81]/40 to-transparent pointer-events-none" />

      {/* Main Container: Constrained to ~1220px (giving ~80% width with generous breathing side margins) */}
      <div className="max-w-[1220px] mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        <ScrollReveal direction="up" delay={30}>
          {/* Header Bar */}
          <div className="mb-6 sm:mb-8 md:mb-9 flex flex-col justify-between gap-5 sm:gap-6 lg:flex-row lg:items-end text-center lg:text-start">
            <div className="flex flex-col items-center lg:items-start">
              {/* Prestige Stage Badge: فرص اللحظات الأخيرة */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-[#D9BB81]/50 bg-[#F7F6F3] px-3.5 py-1 sm:py-1.5 text-xs sm:text-[13px] font-bold text-[#8C6B2D] shadow-2xs mb-2.5 mx-auto lg:mx-0">
                <Flame size={13} className="text-[#9E7B35] shrink-0 animate-pulse" />
                <span className="tracking-wide">فرص اللحظات الأخيرة</span>
              </div>

              {/* H2 Title: Concisely 'مزادات اللحظات الأخيرة' without redundant text */}
              <h2 className="text-[clamp(1.5rem,1.25rem+1vw,2.15rem)] font-black tracking-tight leading-[1.25] text-center lg:text-start">
                <span className="text-[#14243C]">مزادات </span>
                <span className="text-[#9E7B35]">اللحظات الأخيرة</span>
              </h2>

              <p className="mt-2 max-w-2xl text-[14px] sm:text-[15px] leading-[1.75] text-[#526071] font-normal text-center lg:text-start mx-auto lg:mx-0">
                فرص استثنائية في دقائقها الأخيرة للمزايدة الحية واقتناء أندر اللوحات الملكية بالمملكة.
              </p>
            </div>

            {/* Desktop Controls in Header */}
            <div className="hidden lg:flex items-center gap-3 self-end">
              <div className="flex items-center gap-2" dir="ltr">
                <button
                  type="button"
                  onClick={() => nudgeDesktop('prev')}
                  aria-label="السابق"
                  className="group flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E0D8] bg-[#F7F6F3] text-[#14243C] shadow-xs transition-all duration-200 hover:border-[#D9BB81] hover:scale-105 active:scale-95"
                  title="اللوحة السابقة"
                >
                  <ChevronLeft size={18} className="transition-transform group-hover:scale-110" />
                </button>
                <button
                  type="button"
                  onClick={() => nudgeDesktop('next')}
                  aria-label="التالي"
                  className="group flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E0D8] bg-[#F7F6F3] text-[#14243C] shadow-xs transition-all duration-200 hover:border-[#D9BB81] hover:scale-105 active:scale-95"
                  title="اللوحة التالية"
                >
                  <ChevronRight size={18} className="transition-transform group-hover:scale-110" />
                </button>
              </div>

              <Link
                href="/auctions"
                className="group inline-flex items-center gap-2 rounded-xl bg-[#14243C] hover:bg-[#08162B] px-4.5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>جميع المزادات</span>
                <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* ============================================================== */}
        {/* DESKTOP VIEW (lg+): Hardware GPU Infinite Glide (Zero-Jank)    */}
        {/* ============================================================== */}
        <div className="hidden lg:block relative w-full overflow-hidden py-3" dir="ltr">
          <div
            className={`flex gap-5 will-change-transform ${
              isManualDesktop ? 'transition-transform duration-400 ease-out' : 'animate-fbs-carousel-glide'
            }`}
            style={
              isManualDesktop
                ? { transform: `translate3d(${desktopShift}px, 0, 0)` }
                : undefined
            }
          >
            {desktopLoopedPlates.map((plate, idx) => (
              <EndingSoonCard
                key={`desktop-${plate.id || 'plate'}-${idx}`}
                plate={plate}
                lotNum={(idx % plates.length) + 1}
                timeInfo={getAuctionTime((idx % plates.length) + 1)}
              />
            ))}
          </div>
        </div>

        {/* ============================================================== */}
        {/* MOBILE VIEW (<lg): Native Touch Scroll-Snap (120Hz Smoothness) */}
        {/* ============================================================== */}
        <div
          ref={mobileScrollRef}
          className="flex lg:hidden overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar gap-3.5 sm:gap-4 py-3 px-1 touch-pan-x"
          dir="rtl"
        >
          {plates.map((plate, idx) => (
            <div key={`mob-${plate.id || 'plate'}-${idx}`} className="shrink-0 snap-center">
              <EndingSoonCard
                plate={plate}
                lotNum={idx + 1}
                timeInfo={getAuctionTime(idx + 1)}
              />
            </div>
          ))}
        </div>

        {/* Mobile Carousel Controls Bar: Positioned Below Carousel */}
        <div className="mt-4 mb-2 flex lg:hidden items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2" dir="ltr">
            <button
              type="button"
              onClick={() => nudgeMobile('prev')}
              aria-label="السابق"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E0D8] bg-white text-[#14243C] shadow-xs transition-all active:scale-95"
              title="اللوحة السابقة"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => nudgeMobile('next')}
              aria-label="التالي"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E0D8] bg-white text-[#14243C] shadow-xs transition-all active:scale-95"
              title="اللوحة التالية"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <Link
            href="/auctions"
            className="inline-flex items-center gap-2 rounded-xl bg-[#14243C] hover:bg-[#08162B] px-4 py-2 text-xs font-semibold text-white shadow-xs active:scale-95"
          >
            <span>جميع المزادات</span>
            <ArrowLeft size={14} />
          </Link>
        </div>

        {/* Bottom Trust & Guarantee Strip */}
        <div className="mt-6 sm:mt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-[#E5E2DB] pt-5 text-center md:text-start">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-3 text-xs font-bold text-[#475569]">
            <span className="flex items-center gap-1.5 text-[#14243C]">
              <ShieldCheck size={15} className="text-[#D9BB81] shrink-0" />
              <span>حساب ضمان Escrow رسمي معتمد بنكياً</span>
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 text-[#475569]">
              <Clock size={14} className="text-amber-600 shrink-0" />
              <span>إلغاء فوري لحجز مبلغ المزايدة تلقائياً لغير الفائزين</span>
            </span>
          </div>

          <div className="text-xs text-[#64748B] font-medium shrink-0">
            نظام المزايدات الفورية المعتمد لدى FBS للمزادات
          </div>
        </div>
      </div>
    </section>
  );
}
