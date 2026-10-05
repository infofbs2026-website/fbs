'use client';

import React, { useRef, useState, useEffect, useCallback, memo } from 'react';
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

/**
 * Isolated Countdown Timer:
 * Keeps timer re-renders completely isolated to this pill only,
 * preventing any re-renders of the parent carousel track or cards (0% stuttering).
 */
const LiveAuctionCountdown = memo(function LiveAuctionCountdown() {
  const [time, setTime] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/15 px-3 py-1 text-xs font-black text-amber-200"
      dir="ltr"
    >
      <Clock size={13} className="text-amber-400 shrink-0" />
      <span>
        {String(time.hours).padStart(2, '0')}:{String(time.minutes).padStart(2, '0')}:
        {String(time.seconds).padStart(2, '0')}
      </span>
    </div>
  );
});

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

  const plates = endingSoonAuctions && endingSoonAuctions.length > 0 ? endingSoonAuctions : [];

  // Repeat 3 times: perfectly covers 1400px container width with minimal DOM nodes for 60fps smoothness
  const loopedPlates = plates.length > 0 ? [...plates, ...plates, ...plates] : [];

  // Measure repeating cycle width once
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
    const estimated = plates.length * 664;
    singleSetWidthRef.current = estimated;
    return estimated;
  }, [plates.length]);

  // Continuous Glide Animation Loop (Left to Right, 60fps GPU Composited)
  useEffect(() => {
    if (plates.length === 0) return;

    const setWidth = measureWidth();
    if (offsetRef.current === 0 && setWidth > 0) {
      offsetRef.current = -setWidth;
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }
    }

    lastTimeRef.current = performance.now();
    const SPEED = 60; // 60px/sec: calm, smooth, continuous, zero-jank glide

    const tick = (now: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = now;
      const delta = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      if (!isPausedRef.current && !isDraggingRef.current && trackRef.current) {
        const currentSetWidth = singleSetWidthRef.current || measureWidth();
        if (currentSetWidth > 0) {
          offsetRef.current += SPEED * delta;

          // Seamless infinite wrap without jump
          while (offsetRef.current >= 0) {
            offsetRef.current -= currentSetWidth;
          }
          while (offsetRef.current < -currentSetWidth * 2) {
            offsetRef.current += currentSetWidth;
          }

          trackRef.current.style.transform = `translate3d(${offsetRef.current.toFixed(2)}px, 0, 0)`;
        }
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [plates.length, measureWidth]);

  // Recalculate set width on resize
  useEffect(() => {
    const handleResize = () => {
      measureWidth();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [measureWidth]);

  // Pause on hover, resume after exactly 2 seconds
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
    }, 2000);
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
      : 664;

    const delta = direction === 'next' ? step : -step;
    offsetRef.current += delta;

    const setWidth = singleSetWidthRef.current;
    if (setWidth > 0) {
      while (offsetRef.current >= 0) offsetRef.current -= setWidth;
      while (offsetRef.current < -setWidth * 2) offsetRef.current += setWidth;
    }

    if (trackRef.current) {
      trackRef.current.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
      trackRef.current.style.transform = `translate3d(${offsetRef.current.toFixed(2)}px, 0, 0)`;
    }

    setTimeout(() => {
      if (trackRef.current) {
        trackRef.current.style.transition = 'none';
      }
    }, 400);

    resumeTimerRef.current = setTimeout(() => {
      isPausedRef.current = false;
      setIsPaused(false);
      lastTimeRef.current = performance.now();
    }, 2000);
  };

  // Drag & Swipe Handling
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
      trackRef.current.style.transform = `translate3d(${offsetRef.current.toFixed(2)}px, 0, 0)`;
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
      className="relative overflow-hidden py-16 sm:py-24 text-white select-none border-y border-[#d9b87f]/35"
      style={{
        background: 'linear-gradient(180deg, #091222 0%, #111f38 35%, #152646 65%, #0a1324 100%)'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Luxury Atmospheric Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-40 start-1/2 -translate-x-1/2 h-[600px] w-[1000px] rounded-full blur-[110px] opacity-75"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(217,184,127,0.32) 0%, rgba(203,155,72,0.12) 45%, transparent 75%)'
          }}
        />
        <div className="absolute top-1/3 -start-32 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="absolute bottom-10 -end-32 h-[450px] w-[450px] rounded-full bg-amber-500/15 blur-[120px]" />
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#d9b87f]/80 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#d9b87f]/60 to-transparent" />
        <div className="absolute inset-0 opacity-[0.045] bg-[linear-gradient(to_right,#d9b87f_1px,transparent_1px),linear-gradient(to_bottom,#d9b87f_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      {/* Main Container: Strictly Constrained to Max 1400px */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal direction="up" delay={30}>
          {/* Header Bar */}
          <div className="mb-8 sm:mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
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

              <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-[2.65rem] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
                مزادات اللحظات الأخيرة والفرص النادرة
              </h2>

              <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-200 font-medium">
                لوحات استثنائية في حركة انسيابية مستمرة. قف بالماوس على أي لوحة لمعاينتها فوراً، أو استكشف المزادات المتاحة.
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 self-start lg:self-end">
              <div className="flex items-center gap-2" dir="ltr">
                <button
                  type="button"
                  onClick={() => nudge('prev')}
                  aria-label="السابق"
                  className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-gold/50 bg-[#0d1830]/95 text-gold-light backdrop-blur-md transition-all duration-300 hover:border-gold hover:bg-gold hover:text-navy hover:scale-105 active:scale-95 shadow-lg shadow-black/50"
                  title="اللوحة السابقة"
                >
                  <ChevronLeft size={20} className="transition-transform group-hover:scale-110" />
                </button>
                <button
                  type="button"
                  onClick={() => nudge('next')}
                  aria-label="التالي"
                  className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-gold/50 bg-[#0d1830]/95 text-gold-light backdrop-blur-md transition-all duration-300 hover:border-gold hover:bg-gold hover:text-navy hover:scale-105 active:scale-95 shadow-lg shadow-black/50"
                  title="اللوحة التالية"
                >
                  <ChevronRight size={20} className="transition-transform group-hover:scale-110" />
                </button>
              </div>

              <Link
                href="/auctions"
                className="group inline-flex items-center gap-2 rounded-2xl border border-gold/50 bg-gradient-to-r from-gold/20 via-gold/10 to-transparent px-5 py-2.5 text-xs sm:text-sm font-black text-gold-light shadow-md backdrop-blur-md transition-all duration-300 hover:border-gold hover:bg-gold hover:text-navy hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>جميع المزادات</span>
                <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* ============================================================== */}
        {/* SHOWCASE THEATER FRAME: Framed, 1400px Max, 1.5 - 2 Cards Fit  */}
        {/* ============================================================== */}
        <div
          className="relative w-full overflow-hidden rounded-3xl border border-gold/25 bg-[#08101d]/60 shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.08)] py-5 px-2 sm:px-4 cursor-grab active:cursor-grabbing select-none"
          dir="ltr"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Vignette Edge Masks on Frame Borders */}
          <div className="absolute inset-y-0 start-0 w-8 sm:w-16 bg-gradient-to-r from-[#08101d] to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 end-0 w-8 sm:w-16 bg-gradient-to-l from-[#08101d] to-transparent z-20 pointer-events-none" />

          {/* Continuous Gliding Track: Hardware Accelerated */}
          <div
            ref={trackRef}
            className="flex gap-6 will-change-transform"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
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
                  className="relative shrink-0 w-[86vw] sm:w-[500px] md:w-[560px] lg:w-[620px] xl:w-[640px] rounded-2xl overflow-hidden border border-white/15 hover:border-gold shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_45px_rgba(217,184,127,0.3)] transition-all duration-300 bg-gradient-to-br from-[#121e36] via-[#0d1628] to-[#070e1a] p-5 sm:p-7 flex flex-col justify-between"
                >
                  {/* Golden Top Shimmer Edge */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

                  {/* -------------------------------------------------------- */}
                  {/* POSTER HEADER: LOT NUMBER, STATUS & LIVE COUNTDOWN       */}
                  {/* -------------------------------------------------------- */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-xl border border-gold/40 bg-gold/15 px-2.5 py-1 text-xs font-black text-gold-light">
                        <Gavel size={12} className="text-gold" />
                        <span>لوط #{String(lotNum).padStart(2, '0')}</span>
                      </span>

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-black text-emerald-300 border border-emerald-500/40">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                        </span>
                        <span>مزايدة حية</span>
                      </span>

                      {plate.featured && (
                        <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-2.5 py-1 text-xs font-black text-amber-300 border border-amber-400/40">
                          <Sparkles size={11} className="text-amber-300" />
                          <span>نخبة</span>
                        </span>
                      )}
                    </div>

                    {/* Isolated Zero-Lag Countdown */}
                    <LiveAuctionCountdown />
                  </div>

                  {/* -------------------------------------------------------- */}
                  {/* POSTER CENTER: MAJESTIC PLATE SHOWCASE CANVAS            */}
                  {/* -------------------------------------------------------- */}
                  <div className="py-6 sm:py-8 flex flex-col items-center justify-center">
                    <div className="w-full max-w-[420px] sm:max-w-[480px] transform transition-transform duration-300 group-hover:scale-[1.02]">
                      <PlateVisualizer
                        lettersAr={plate.lettersAr}
                        lettersEn={plate.lettersEn}
                        numbers={plate.numbers}
                        plateType={plate.type}
                        large
                      />
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 text-xs sm:text-sm font-bold text-slate-300">
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
                  <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-slate-400 block mb-0.5">
                        المزايدة الحالية (أعلى عرض)
                      </span>
                      <div className="flex items-baseline gap-2 text-white" dir="ltr">
                        <span className="font-norwester text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight text-white leading-none drop-shadow-md">
                          {formatSar(rawPrice)}
                        </span>
                        <SarSymbol className="w-4.5 h-4.5 text-gold-accent inline-block self-center" />
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <span className="text-emerald-400 font-black">{bidsCount} مزايدة نشطة</span>
                        <span>•</span>
                        <span>تمديد تلقائي ضد القنص</span>
                      </div>
                    </div>

                    <Link
                      href={`/plates/${plate.slug}`}
                      className="group btn btn-gold h-12 sm:h-13 px-7 text-xs sm:text-sm font-black shadow-lg hover:shadow-[0_0_25px_rgba(217,184,127,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 shrink-0"
                    >
                      <Gavel size={16} className="text-navy transition-transform duration-300 group-hover:-rotate-12" />
                      <span>دخول المزاد والمزايدة</span>
                      <ArrowLeft size={15} className="text-navy transition-transform duration-300 group-hover:-translate-x-1" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Bottom Trust & Guarantee Strip */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-5">
          <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-gold-light">
              <ShieldCheck size={15} className="text-gold" />
              <span>حساب ضمان Escrow رسمي معتمد بنكياً</span>
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Clock size={14} className="text-amber-400" />
              <span>إلغاء فوري لحجز مبلغ المزايدة تلقائياً لغير الفائزين</span>
            </span>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            نظام المزايدات الفورية المعتمد لدى FBS للمزادات
          </div>
        </div>
      </div>
    </section>
  );
}
