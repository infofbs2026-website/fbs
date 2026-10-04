'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Gavel,
  ShieldCheck,
  Sparkles
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

export function HomeEndingSoon({ endingSoonAuctions }: HomeEndingSoonProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Active ticking countdown (hours, minutes, seconds)
  const [countdown, setCountdown] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const plates = endingSoonAuctions && endingSoonAuctions.length > 0 ? endingSoonAuctions : [];

  // Center a specific card index horizontally without affecting page vertical scroll
  const scrollToIndex = useCallback((targetIndex: number) => {
    const el = scrollContainerRef.current;
    if (!el || plates.length === 0) return;

    const boundedIndex = (targetIndex + plates.length) % plates.length;
    const cardEl = el.children[boundedIndex] as HTMLElement;
    if (!cardEl) return;

    const targetScroll = cardEl.offsetLeft - (el.clientWidth - cardEl.offsetWidth) / 2;

    el.scrollTo({
      left: Math.max(0, targetScroll),
      behavior: 'smooth'
    });

    setActiveIndex(boundedIndex);
    setProgress(0);
  }, [plates.length]);

  // Motion from Left to Right:
  const slideNext = useCallback(() => {
    scrollToIndex(activeIndex + 1);
  }, [activeIndex, scrollToIndex]);

  const slidePrev = useCallback(() => {
    scrollToIndex(activeIndex - 1);
  }, [activeIndex, scrollToIndex]);

  // Pause on hover, resume after exactly 2 seconds on unhover
  const handleMouseEnter = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 2000); // 2 seconds delay before resuming motion as requested
  };

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  // Snappy auto-slide ticker: 2600ms cycle (faster as requested)
  useEffect(() => {
    if (isPaused || plates.length <= 1) return;

    const stepMs = 40;
    const totalMs = 2600; // 2.6 seconds per poster card
    const increment = (stepMs / totalMs) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          slideNext();
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    return () => clearInterval(interval);
  }, [isPaused, plates.length, slideNext]);

  // Track active index based on scroll position
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el || plates.length === 0) return;

    const scrollLeft = el.scrollLeft;
    const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 24 : 640;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.min(Math.max(index, 0), plates.length - 1));
  }, [plates.length]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    el.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  if (plates.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden py-20 sm:py-26 text-white select-none border-y border-[#d9b87f]/35"
      style={{
        background: 'linear-gradient(180deg, #091222 0%, #111f38 35%, #152646 65%, #0a1324 100%)'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseEnter}
      onTouchEnd={handleMouseLeave}
    >
      {/* ============================================================== */}
      {/* 1. LUXURY ATMOSPHERIC STAGE LIGHTING (WARM RADIANCE & RAYS)   */}
      {/* ============================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Overhead Golden Stage Spotlight Cone */}
        <div
          className="absolute -top-40 start-1/2 -translate-x-1/2 h-[600px] w-[1000px] rounded-full blur-[110px] opacity-75"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(217,184,127,0.32) 0%, rgba(203,155,72,0.12) 45%, transparent 75%)'
          }}
        />

        {/* Ambient Royal Navy Deep Glows */}
        <div className="absolute top-1/3 -start-32 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="absolute bottom-10 -end-32 h-[450px] w-[450px] rounded-full bg-amber-500/15 blur-[120px]" />

        {/* Golden Horizon Hairlines at Borders */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#d9b87f]/80 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#d9b87f]/60 to-transparent" />

        {/* Architectural Coordinates Light Grid */}
        <div className="absolute inset-0 opacity-[0.045] bg-[linear-gradient(to_right,#d9b87f_1px,transparent_1px),linear-gradient(to_bottom,#d9b87f_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="container-fbs relative z-10">
        <ScrollReveal direction="up" delay={30}>
          {/* Header Bar: Headline, Badge & Showcase Navigation */}
          <div className="mb-10 sm:mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              {/* Prestige Golden Stage Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/55 bg-gradient-to-r from-gold/30 via-gold/15 to-amber-500/20 px-4.5 py-1.5 text-xs sm:text-sm font-black text-gold-light backdrop-blur-md shadow-[0_0_25px_rgba(217,184,127,0.3)] mb-3.5">
                <Flame size={16} className="text-amber-400 shrink-0 animate-bounce" />
                <span className="tracking-wide">المسرح الماسي · فرص اللحظات الأخيرة</span>
              </div>

              {/* Commanding Luxury Headline */}
              <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-[2.65rem] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
                مزادات اللحظات الأخيرة والفرص النادرة
              </h2>

              <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-200 font-medium">
                لوحات استثنائية تقترب من الإغلاق النهائي. عروض تنافسية حية مع تمديد تلقائي عادل وتوثيق رسمي فوري.
              </p>
            </div>

            {/* Stage Controls: Prev/Next Arrows & View All (Play/pause button removed as requested) */}
            <div className="flex items-center gap-3 self-start lg:self-end">
              {/* Prev / Next Luxury Buttons */}
              <div className="flex items-center gap-2" dir="ltr">
                <button
                  type="button"
                  onClick={slidePrev}
                  aria-label="السابق"
                  className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/50 bg-[#0d1830]/95 text-gold-light backdrop-blur-md transition-all duration-300 hover:border-gold hover:bg-gold hover:text-navy hover:scale-105 active:scale-95 shadow-lg shadow-black/50"
                  title="اللوحة السابقة"
                >
                  <ChevronLeft size={22} className="transition-transform group-hover:scale-110" />
                </button>
                <button
                  type="button"
                  onClick={slideNext}
                  aria-label="التالي"
                  className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/50 bg-[#0d1830]/95 text-gold-light backdrop-blur-md transition-all duration-300 hover:border-gold hover:bg-gold hover:text-navy hover:scale-105 active:scale-95 shadow-lg shadow-black/50"
                  title="اللوحة التالية (من اليسار لليمين)"
                >
                  <ChevronRight size={22} className="transition-transform group-hover:scale-110" />
                </button>
              </div>

              {/* View All Button */}
              <Link
                href="/auctions"
                className="group inline-flex items-center gap-2 rounded-2xl border border-gold/50 bg-gradient-to-r from-gold/20 via-gold/10 to-transparent px-5 py-3 text-xs sm:text-sm font-black text-gold-light shadow-md backdrop-blur-md transition-all duration-300 hover:border-gold hover:bg-gold hover:text-navy hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>جميع المزادات</span>
                <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Autoplay Active Progress Indicator Bar */}
          <div className="mb-6 sm:mb-8 h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold via-gold-light to-amber-400 shadow-[0_0_12px_#d9b87f] transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </ScrollReveal>

        {/* ============================================================== */}
        {/* 2. THE WIDE POSTER CAROUSEL (كروت عريضة بنصف عرض الشاشة)       */}
        {/* ============================================================== */}
        <div
          ref={scrollContainerRef}
          dir="ltr"
          className="flex gap-6 sm:gap-8 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-none cursor-grab active:cursor-grabbing -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {plates.map((plate, idx) => {
            const rawPrice = plate.auction?.currentPriceHalalas ?? plate.priceHalalas ?? '0';
            const isActive = activeIndex === idx;
            const bidsCount = plate.auction?.bidCount ?? 18 + (idx * 5);

            return (
              <article
                key={plate.id || idx}
                dir="rtl"
                onClick={() => scrollToIndex(idx)}
                className={`relative shrink-0 snap-center transition-all duration-500 w-[90vw] sm:w-[580px] lg:w-[680px] xl:w-[730px] rounded-3xl overflow-hidden border-2 ${
                  isActive
                    ? 'border-gold shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8),0_0_40px_rgba(217,184,127,0.35)] scale-[1.01]'
                    : 'border-white/15 hover:border-gold/50 shadow-xl opacity-85 hover:opacity-100 scale-[0.98]'
                } bg-gradient-to-br from-[#101b30]/98 via-[#0c1628]/98 to-[#070e1c]/99 backdrop-blur-2xl p-6 sm:p-8 flex flex-col justify-between`}
              >
                {/* Golden Top Shimmer Edge */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-gold to-transparent" />

                {/* Corner Decorative Aura */}
                <div className="absolute -top-16 -end-16 h-44 w-44 rounded-full bg-gold/15 blur-2xl pointer-events-none" />

                {/* -------------------------------------------------------- */}
                {/* POSTER HEADER: LOT NUMBER, STATUS & LIVE COUNTDOWN       */}
                {/* -------------------------------------------------------- */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    {/* Lot Number Emblem */}
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-gold/40 bg-gold/15 px-3 py-1 text-xs font-black text-gold-light">
                      <Gavel size={13} className="text-gold" />
                      <span>لوط #{String(idx + 1).padStart(2, '0')}</span>
                    </span>

                    {/* Live Pulse Indicator */}
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-black text-emerald-300 border border-emerald-500/40">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                      </span>
                      <span>مزايدة حية نشطة</span>
                    </span>

                    {plate.featured && (
                      <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-black text-amber-300 border border-amber-400/40">
                        <Sparkles size={12} className="text-amber-300" />
                        <span>نخبة</span>
                      </span>
                    )}
                  </div>

                  {/* Live Urgent Countdown Pill */}
                  <div className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/15 px-3.5 py-1 text-xs font-black text-amber-200" dir="ltr">
                    <Clock size={13} className="text-amber-400 shrink-0" />
                    <span>
                      {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:
                      {String(countdown.seconds).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {/* -------------------------------------------------------- */}
                {/* POSTER CENTER: MAJESTIC PLATE SHOWCASE CANVAS            */}
                {/* -------------------------------------------------------- */}
                <div className="py-7 sm:py-9 flex flex-col items-center justify-center">
                  <div className="w-full max-w-[480px] sm:max-w-[540px] transform transition-transform duration-500 group-hover:scale-[1.03] filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)]">
                    <PlateVisualizer
                      lettersAr={plate.lettersAr}
                      lettersEn={plate.lettersEn}
                      numbers={plate.numbers}
                      plateType={plate.type}
                      large
                    />
                  </div>

                  {/* Subtitle Identity & Classification */}
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-bold text-slate-300">
                    <span className="font-norwester text-gold-light tracking-wider" dir="ltr">
                      {plate.lettersEn.join('')} {plate.numbers}
                    </span>
                    <span className="text-white/30">•</span>
                    <span className="text-slate-200">
                      {plate.type || 'خصوصي سعودي فاخر'}
                    </span>
                    <span className="text-white/30">•</span>
                    <span className="text-gold-light font-black flex items-center gap-1">
                      <ShieldCheck size={14} className="text-gold" />
                      <span>{plate.city || 'الرياض'} · فحص معتمد 100%</span>
                    </span>
                  </div>
                </div>

                {/* -------------------------------------------------------- */}
                {/* POSTER FOOTER: CURRENT PRICE, BIDS & ACTION BUTTON       */}
                {/* -------------------------------------------------------- */}
                <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  {/* Price Block */}
                  <div>
                    <span className="text-xs font-bold text-slate-400 block mb-1">
                      المزايدة الحالية (أعلى عرض)
                    </span>
                    <div className="flex items-baseline gap-2 text-white" dir="ltr">
                      <span className="font-norwester text-3xl sm:text-4xl lg:text-[40px] font-black tracking-tight text-white leading-none drop-shadow-md">
                        {formatSar(rawPrice)}
                      </span>
                      <SarSymbol className="w-5 h-5 text-gold-accent inline-block self-center" />
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs font-semibold text-slate-400">
                      <span className="text-emerald-400 font-black">{bidsCount} مزايدة نشطة</span>
                      <span>•</span>
                      <span>تمديد تلقائي ضد القنص</span>
                    </div>
                  </div>

                  {/* Direct Action Button */}
                  <Link
                    href={`/plates/${plate.slug}`}
                    className="group btn btn-gold h-13 sm:h-14 px-8 text-sm sm:text-base font-black shadow-xl hover:shadow-[0_0_30px_rgba(217,184,127,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shrink-0"
                  >
                    <Gavel size={18} className="text-navy transition-transform duration-300 group-hover:-rotate-12" />
                    <span>دخول المزاد والمزايدة</span>
                    <ArrowLeft size={16} className="text-navy transition-transform duration-300 group-hover:-translate-x-1" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* 3. BOTTOM CAROUSEL DOTS & SHOWCASE STATS                      */}
        {/* ============================================================== */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Slide Navigation Dots */}
          <div className="flex items-center gap-2.5" dir="ltr">
            {plates.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-label={`الانتقال إلى اللوط ${i + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === i
                    ? 'w-10 bg-gradient-to-r from-gold via-gold-light to-gold shadow-[0_0_12px_rgba(217,184,127,0.9)]'
                    : 'w-2.5 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

          {/* Guarantee Badges Strip */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck size={14} className="text-gold" />
              <span>حساب ضمان Escrow معتمد</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Clock size={14} className="text-amber-400" />
              <span>إلغاء فوري للتفويض لغير الفائزين</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
