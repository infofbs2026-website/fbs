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
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const offsetRef = useRef<number>(0);
  const singleSetWidthRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartOffsetRef = useRef<number>(0);

  const [isPaused, setIsPaused] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 4, minutes: 28, seconds: 45 });

  // Active ticking countdown (hours, minutes, seconds)
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

  // Repeat the plates 4 times to guarantee a seamless infinite loop on all screen sizes
  const loopedPlates = plates.length > 0 ? [...plates, ...plates, ...plates, ...plates] : [];

  // Measure the exact repeating period (width of one full set of cards + gaps)
  const measureWidth = useCallback(() => {
    if (plates.length === 0) return 0;
    const firstCard = cardRefs.current[0];
    const nextSetFirstCard = cardRefs.current[plates.length];
    if (firstCard && nextSetFirstCard) {
      const measured = nextSetFirstCard.offsetLeft - firstCard.offsetLeft;
      if (measured > 0) {
        singleSetWidthRef.current = measured;
        return measured;
      }
    }
    // Fallback calculation
    const fallback = plates.length * 760;
    singleSetWidthRef.current = fallback;
    return fallback;
  }, [plates.length]);

  // Continuous Perpetual Gliding Loop (Left to Right, 60fps)
  useEffect(() => {
    if (plates.length === 0) return;

    // Initial setup
    const setWidth = measureWidth();
    if (offsetRef.current === 0 && setWidth > 0) {
      offsetRef.current = -setWidth;
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }
    }

    lastTimeRef.current = performance.now();
    const SPEED = 75; // 75 pixels per second: continuous, visible, graceful glide

    const tick = (now: number) => {
      const delta = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      if (!isPausedRef.current && !isDraggingRef.current && trackRef.current) {
        const currentSetWidth = singleSetWidthRef.current || measureWidth();
        if (currentSetWidth > 0) {
          // Continuous motion from Left to Right (increasing X translation)
          offsetRef.current += SPEED * delta;

          // Seamless infinite wrap without any visual jump
          while (offsetRef.current >= 0) {
            offsetRef.current -= currentSetWidth;
          }
          while (offsetRef.current < -currentSetWidth * 2) {
            offsetRef.current += currentSetWidth;
          }

          trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
        }
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [plates.length, measureWidth]);

  // Recalculate set width on viewport resize
  useEffect(() => {
    const handleResize = () => {
      measureWidth();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [measureWidth]);

  // Pause on hover / touch, resume after exactly 2 seconds on unhover
  const handleMouseEnter = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    isPausedRef.current = true;
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      isPausedRef.current = false;
      setIsPaused(false);
      lastTimeRef.current = performance.now();
    }, 2000); // 2-second delay before resuming continuous motion as requested
  };

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  // Manual Nudge (Prev / Next Buttons)
  const nudge = (direction: 'prev' | 'next') => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    isPausedRef.current = true;
    setIsPaused(true);

    const step = singleSetWidthRef.current > 0
      ? singleSetWidthRef.current / plates.length
      : 760;

    // Direction handling: Next advances forward, Prev steps back
    const delta = direction === 'next' ? step : -step;
    offsetRef.current += delta;

    const setWidth = singleSetWidthRef.current;
    if (setWidth > 0) {
      while (offsetRef.current >= 0) offsetRef.current -= setWidth;
      while (offsetRef.current < -setWidth * 2) offsetRef.current += setWidth;
    }

    if (trackRef.current) {
      trackRef.current.style.transition = 'transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)';
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    }

    setTimeout(() => {
      if (trackRef.current) {
        trackRef.current.style.transition = 'none';
      }
    }, 450);

    // Resume continuous motion after 2 seconds
    resumeTimerRef.current = setTimeout(() => {
      isPausedRef.current = false;
      setIsPaused(false);
      lastTimeRef.current = performance.now();
    }, 2000);
  };

  // Pointer Drag & Swipe Handling
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('a, button')) return;

    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    isPausedRef.current = true;
    setIsPaused(true);

    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    if (trackRef.current) {
      trackRef.current.style.transition = 'none';
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    offsetRef.current = dragStartOffsetRef.current + deltaX;

    const setWidth = singleSetWidthRef.current;
    if (setWidth > 0) {
      while (offsetRef.current >= 0) offsetRef.current -= setWidth;
      while (offsetRef.current < -setWidth * 2) offsetRef.current += setWidth;
    }

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    }
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    handleMouseLeave();
  };

  if (plates.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden py-20 sm:py-26 text-white select-none border-y border-[#d9b87f]/35"
      style={{
        background: 'linear-gradient(180deg, #091222 0%, #111f38 35%, #152646 65%, #0a1324 100%)'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
          {/* Header Bar: Headline, Badges & Stage Navigation */}
          <div className="mb-10 sm:mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              {/* Prestige Golden Stage Badge & Live Status Indicator */}
              <div className="flex flex-wrap items-center gap-3 mb-3.5">
                <div className="inline-flex items-center gap-2 rounded-full border border-gold/55 bg-gradient-to-r from-gold/30 via-gold/15 to-amber-500/20 px-4.5 py-1.5 text-xs sm:text-sm font-black text-gold-light backdrop-blur-md shadow-[0_0_25px_rgba(217,184,127,0.3)]">
                  <Flame size={16} className="text-amber-400 shrink-0 animate-bounce" />
                  <span className="tracking-wide">المسرح الماسي · فرص اللحظات الأخيرة</span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1.5 text-xs font-bold text-gold-light backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className={`absolute inline-flex h-full w-full rounded-full bg-gold ${isPaused ? 'opacity-0' : 'animate-ping opacity-75'}`} />
                    <span className={`relative inline-flex h-2 w-2 rounded-full ${isPaused ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' : 'bg-emerald-400 shadow-[0_0_8px_#10b981]'}`} />
                  </span>
                  <span>{isPaused ? 'توقف مؤقت للتفحص (استئناف بعد ثانيتين)' : 'انسياب دائم من اليسار لليمين'}</span>
                </div>
              </div>

              {/* Commanding Luxury Headline */}
              <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-[2.65rem] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
                مزادات اللحظات الأخيرة والفرص النادرة
              </h2>

              <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-200 font-medium">
                لوحات استثنائية في حركة انسيابية مستمرة. قف بالماوس على أي لوحة لمعاينتها فورا، أو استكشف المزادات المتاحة.
              </p>
            </div>

            {/* Stage Controls: Prev/Next Arrows & View All */}
            <div className="flex items-center gap-3 self-start lg:self-end">
              {/* Prev / Next Luxury Buttons */}
              <div className="flex items-center gap-2" dir="ltr">
                <button
                  type="button"
                  onClick={() => nudge('prev')}
                  aria-label="السابق"
                  className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/50 bg-[#0d1830]/95 text-gold-light backdrop-blur-md transition-all duration-300 hover:border-gold hover:bg-gold hover:text-navy hover:scale-105 active:scale-95 shadow-lg shadow-black/50"
                  title="اللوحة السابقة"
                >
                  <ChevronLeft size={22} className="transition-transform group-hover:scale-110" />
                </button>
                <button
                  type="button"
                  onClick={() => nudge('next')}
                  aria-label="التالي"
                  className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/50 bg-[#0d1830]/95 text-gold-light backdrop-blur-md transition-all duration-300 hover:border-gold hover:bg-gold hover:text-navy hover:scale-105 active:scale-95 shadow-lg shadow-black/50"
                  title="اللوحة التالية"
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
        </ScrollReveal>
      </div>

      {/* ============================================================== */}
      {/* 2. CONTINUOUS INFINITE GLIDING TRACK (حركة دائمة من اليسار لليمين) */}
      {/* ============================================================== */}
      <div
        className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing select-none py-4"
        dir="ltr"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Edge Vignette Masks for cinematic seamless gliding */}
        <div className="absolute inset-y-0 start-0 w-8 sm:w-24 bg-gradient-to-r from-[#091222] to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 end-0 w-8 sm:w-24 bg-gradient-to-l from-[#0a1324] to-transparent z-20 pointer-events-none" />

        {/* The Continuous Gliding Flex Track */}
        <div
          ref={trackRef}
          className="flex gap-6 sm:gap-8 will-change-transform px-4 sm:px-8"
        >
          {loopedPlates.map((plate, idx) => {
            const rawPrice = plate.auction?.currentPriceHalalas ?? plate.priceHalalas ?? '0';
            const lotNum = (idx % plates.length) + 1;
            const bidsCount = plate.auction?.bidCount ?? 18 + (lotNum * 5);

            return (
              <article
                key={`${plate.id || 'plate'}-${idx}`}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                dir="rtl"
                className="relative shrink-0 w-[88vw] sm:w-[580px] lg:w-[680px] xl:w-[730px] rounded-3xl overflow-hidden border-2 border-white/15 hover:border-gold shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8),0_0_35px_rgba(217,184,127,0.25)] hover:shadow-[0_25px_70px_-10px_rgba(0,0,0,0.9),0_0_45px_rgba(217,184,127,0.4)] transition-all duration-300 bg-gradient-to-br from-[#101b30]/98 via-[#0c1628]/98 to-[#070e1c]/99 backdrop-blur-2xl p-6 sm:p-8 flex flex-col justify-between"
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
                      <span>لوط #{String(lotNum).padStart(2, '0')}</span>
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
      </div>

      {/* ============================================================== */}
      {/* 3. BOTTOM TRUST & GUARANTEE STRIP                             */}
      {/* ============================================================== */}
      <div className="container-fbs relative z-10 mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6">
        <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
          <span className="flex items-center gap-1.5 text-gold-light">
            <ShieldCheck size={16} className="text-gold" />
            <span>حساب ضمان Escrow رسمي معتمد بنكياً</span>
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <Clock size={15} className="text-amber-400" />
            <span>إلغاء فوري لحجز مبلغ المزايدة تلقائياً لغير الفائزين</span>
          </span>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          نظام المزايدات الفورية المعتمد لدى FBS للمزادات
        </div>
      </div>
    </section>
  );
}
