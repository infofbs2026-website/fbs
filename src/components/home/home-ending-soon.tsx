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
 * Isolated Countdown Timer:
 * Self-contained ticking to prevent re-rendering the parent carousel track or cards (0% stuttering).
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

  const plates = endingSoonAuctions && endingSoonAuctions.length > 0 ? endingSoonAuctions : [];

  // Repeat 3 times to perfectly cover the 1400px container with minimal DOM nodes
  const loopedPlates = plates.length > 0 ? [...plates, ...plates, ...plates] : [];

  // Measure repeating cycle width once and cache in ref
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
    const estimated = plates.length * 444;
    singleSetWidthRef.current = estimated;
    return estimated;
  }, [plates.length]);

  // Continuous Perpetual Glide Loop (Left to Right, 60fps GPU Composited)
  useEffect(() => {
    if (plates.length === 0) return;

    // Cache initial measurement
    const setWidth = measureWidth();
    if (offsetRef.current === 0 && setWidth > 0) {
      offsetRef.current = -setWidth;
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }
    }

    lastTimeRef.current = performance.now();
    const SPEED = 48; // 48px/sec: calm, smooth, continuous, zero-jank luxury tempo

    const tick = (now: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = now;
      const elapsed = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      // Clamp delta between 20fps and 120fps to prevent any tab switch or VSync frame jitter
      const delta = Math.min(Math.max(elapsed, 0.005), 0.04);

      if (!isPausedRef.current && !isDraggingRef.current && trackRef.current) {
        const currentSetWidth = singleSetWidthRef.current;
        if (currentSetWidth > 0) {
          offsetRef.current += SPEED * delta;

          // Seamless infinite wrap without jump
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

  // Recalculate set width on resize
  useEffect(() => {
    const handleResize = () => {
      measureWidth();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [measureWidth]);

  // Pause ONLY when directly hovering on a card, resume after 2 seconds on leave
  const handleCardMouseEnter = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    isPausedRef.current = true;
  };

  const handleCardMouseLeave = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      isPausedRef.current = false;
      lastTimeRef.current = performance.now();
    }, 2000); // 2 seconds delay before resuming continuous motion
  };

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  // Manual Nudge (Prev / Next Buttons)
  const nudge = useCallback((direction: 'prev' | 'next') => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    isPausedRef.current = true;

    const step = singleSetWidthRef.current > 0
      ? singleSetWidthRef.current / plates.length
      : 444;

    const delta = direction === 'next' ? step : -step;
    offsetRef.current += delta;

    const setWidth = singleSetWidthRef.current;
    if (setWidth > 0) {
      while (offsetRef.current >= 0) offsetRef.current -= setWidth;
      while (offsetRef.current < -setWidth * 2) offsetRef.current += setWidth;
    }

    if (trackRef.current) {
      trackRef.current.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    }

    setTimeout(() => {
      if (trackRef.current) {
        trackRef.current.style.transition = 'none';
      }
    }, 400);

    resumeTimerRef.current = setTimeout(() => {
      isPausedRef.current = false;
      lastTimeRef.current = performance.now();
    }, 2000);
  }, [plates.length]);

  // Touch & Pointer Drag / Swipe Handling for Mobile & Desktop
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const isSwipingRef = useRef<boolean>(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('a, button')) return;

    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    isPausedRef.current = true;

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
    handleCardMouseLeave();
  };

  // Dedicated Mobile Touch Gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('a, button')) return;
    const touch = e.touches[0];
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
    dragStartOffsetRef.current = offsetRef.current;
    isPausedRef.current = true;
    isSwipingRef.current = false;

    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    if (trackRef.current) {
      trackRef.current.style.transition = 'none';
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartXRef.current;
    const deltaY = touch.clientY - touchStartYRef.current;

    // Detect horizontal swipe intent vs vertical page scroll
    if (!isSwipingRef.current) {
      if (Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY)) {
        isSwipingRef.current = true;
      } else if (Math.abs(deltaY) > 10) {
        return; // Allow vertical scrolling smoothly
      }
    }

    if (isSwipingRef.current) {
      offsetRef.current = dragStartOffsetRef.current + deltaX;
      const setWidth = singleSetWidthRef.current;
      if (setWidth > 0) {
        while (offsetRef.current >= 0) offsetRef.current -= setWidth;
        while (offsetRef.current < -setWidth * 2) offsetRef.current += setWidth;
      }
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isSwipingRef.current) {
      isSwipingRef.current = false;
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartXRef.current;
      if (Math.abs(deltaX) > 50) {
        nudge(deltaX > 0 ? 'prev' : 'next');
        return;
      }
    }
    handleCardMouseLeave();
  };

  if (plates.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden py-[clamp(3rem,6vw,6rem)] text-white select-none border-y border-[#d9b87f]/35"
      style={{
        background: 'linear-gradient(180deg, #091222 0%, #111f38 35%, #152646 65%, #0a1324 100%)'
      }}
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
      <div className="w-full max-w-[87.5rem] mx-auto px-[clamp(1rem,3vw,2.5rem)] relative z-10">
        <ScrollReveal direction="up" delay={30}>
          {/* Header Bar */}
          <div className="mb-[clamp(1.5rem,3vw,2.5rem)] flex flex-col justify-between gap-6 xl:flex-row xl:items-end text-center xl:text-start">
            <div className="flex flex-col items-center xl:items-start">
              {/* Prestige Golden Stage Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/55 bg-gradient-to-r from-gold/30 via-gold/15 to-amber-500/20 px-4.5 py-1.5 text-xs sm:text-sm font-black text-gold-light backdrop-blur-md shadow-[0_0_25px_rgba(217,184,127,0.3)] mb-5 mx-auto xl:mx-0">
                <Flame size={16} className="text-amber-400 shrink-0" />
                <span className="tracking-wide">المسرح الماسي · فرص اللحظات الأخيرة</span>
              </div>

              <h2 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-black tracking-tight text-white leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] text-center xl:text-start">
                مزادات <span className="bg-gradient-to-r from-gold via-gold-light to-amber-300 bg-clip-text text-transparent">اللحظات الأخيرة</span> والفرص النادرة
              </h2>

              <p className="mt-3.5 max-w-3xl text-[clamp(1rem,1.3vw,1.125rem)] leading-relaxed text-slate-200 font-medium text-center xl:text-start mx-auto xl:mx-0">
                فرص استثنائية في دقائقها الأخيرة للمزايدة الحية واقتناء أندر اللوحات الملكية بالمملكة.
              </p>
            </div>

            {/* Desktop Controls */}
            <div className="hidden xl:flex items-center gap-3 self-end">
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
        {/* CAROUSEL TRACK: Clean & Frameless, Cards Float Free             */}
        {/* ============================================================== */}
        <div
          className="ending-soon-viewport relative w-full overflow-hidden py-4 cursor-grab active:cursor-grabbing select-none touch-pan-y"
          dir="ltr"
          style={{ touchAction: 'pan-y' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          {/* Continuous Gliding Track: Hardware GPU Accelerated */}
          <div
            ref={trackRef}
            className="flex gap-[clamp(1rem,2vw,1.5rem)] will-change-transform"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'translateZ(0)'
            }}
          >
            {loopedPlates.map((plate, idx) => {
              const rawPrice = plate.auction?.currentPriceHalalas ?? plate.priceHalalas ?? '0';
              const lotNum = (idx % plates.length) + 1;

              return (
                <article
                  key={`${plate.id || 'plate'}-${idx}`}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  dir="rtl"
                  onMouseEnter={handleCardMouseEnter}
                  onMouseLeave={handleCardMouseLeave}
                  className="ending-soon-card relative shrink-0 max-w-full rounded-3xl overflow-hidden border border-gold/35 hover:border-gold shadow-[0_20px_50px_rgba(0,0,0,0.65)] hover:shadow-[0_25px_60px_rgba(217,184,127,0.35)] transition-all duration-200 bg-gradient-to-b from-[#141f38]/95 via-[#0e172a]/95 to-[#080e1c]/98 backdrop-blur-2xl p-5 sm:p-6 flex flex-col justify-between"
                  style={{
                    contain: 'layout paint',
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden'
                  }}
                >
                  {/* Golden Top Shimmer Edge */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

                  {/* -------------------------------------------------------- */}
                  {/* POSTER HEADER: LOT NUMBER & LIVE STATUS (ENLARGED)       */}
                  {/* -------------------------------------------------------- */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-gold/20">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex items-center gap-2 rounded-xl border border-gold/45 bg-gold/20 px-3.5 py-1.5 text-xs sm:text-sm font-black text-gold-light shadow-sm">
                        <Gavel size={14} className="text-gold" />
                        <span>لوط #{String(lotNum).padStart(2, '0')}</span>
                      </span>

                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3.5 py-1.5 text-xs sm:text-sm font-black text-emerald-300 border border-emerald-500/40 shadow-sm">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                        </span>
                        <span>مزايدة حية</span>
                      </span>
                    </div>

                    <span className="hidden sm:inline-flex font-norwester text-xs sm:text-sm font-bold tracking-wider text-gold-light bg-[#1d2d4d]/90 border border-gold/35 px-2.5 py-1 rounded-md shadow-xs backdrop-blur-md" dir="ltr">
                      LOT-{String(lotNum).padStart(2, '0')}
                    </span>
                  </div>

                  {/* -------------------------------------------------------- */}
                  {/* POSTER CENTER: AUTHENTIC SAUDI PLATE SHOWCASE PEDESTAL   */}
                  {/* -------------------------------------------------------- */}
                  <div className="my-auto py-3 w-full flex flex-col justify-center">
                    <div className="rounded-2xl p-3.5 sm:p-4 flex items-center justify-center bg-gradient-to-b from-[#0b1324] via-[#070d18] to-[#040812] border border-gold/30 shadow-[inset_0_2px_10px_rgba(0,0,0,0.7),0_8px_24px_rgba(0,0,0,0.4)] relative overflow-hidden">
                      {/* Subtle Ambient Gold Glow behind Plate */}
                      <div className="absolute h-32 w-64 rounded-full bg-gold/15 blur-2xl pointer-events-none" />

                      <div className="relative z-10 w-full flex justify-center">
                        <PlateVisualizer
                          lettersAr={plate.lettersAr}
                          lettersEn={plate.lettersEn}
                          numbers={plate.numbers}
                          plateType={plate.type}
                        />
                      </div>
                    </div>
                  </div>

                  {/* -------------------------------------------------------- */}
                  {/* POSTER FOOTER: PRICE (RIGHT), TIMER (LEFT) & FULL CTA    */}
                  {/* -------------------------------------------------------- */}
                  <div className="pt-4 border-t border-gold/20 flex flex-col gap-3.5">
                    {/* Upper row: Current Bid on Right (RTL start), Countdown on Left (RTL end) */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-slate-300 block mb-1">
                          المزايدة الحالية (أعلى عرض)
                        </span>
                        <div className="flex items-baseline gap-2 text-white" dir="ltr">
                          <span className="font-norwester text-2xl sm:text-3xl font-black tracking-tight text-white leading-none drop-shadow-md">
                            {formatSar(rawPrice)}
                          </span>
                          <SarSymbol className="w-4.5 h-4.5 text-gold-accent inline-block self-center" />
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-slate-300 block mb-1 flex items-center gap-1.5">
                          <Clock size={13} className="text-amber-400" />
                          <span>الوقت المتبقي</span>
                        </span>
                        <LiveAuctionCountdown />
                      </div>
                    </div>

                    {/* Direct Auction CTA: Full Width underneath */}
                    <Link
                      href={`/plates/${plate.slug}`}
                      className="group btn btn-gold w-full h-12 sm:h-12.5 text-xs sm:text-sm font-black shadow-lg hover:shadow-[0_0_25px_rgba(217,184,127,0.45)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 mt-1"
                    >
                      <Gavel size={16} className="text-navy transition-transform duration-300 group-hover:-rotate-12" />
                      <span>دخول المزاد والمزايدة</span>
                      <ArrowLeft size={16} className="text-navy transition-transform duration-300 group-hover:-translate-x-1" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Mobile Carousel Controls Bar: Positioned Below Carousel */}
        <div className="mt-4 mb-2 flex xl:hidden items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2" dir="ltr">
            <button
              type="button"
              onClick={() => nudge('prev')}
              aria-label="السابق"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gold/50 bg-[#0d1830]/95 text-gold-light backdrop-blur-md transition-all active:scale-95 shadow-md shadow-black/50"
              title="اللوحة السابقة"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => nudge('next')}
              aria-label="التالي"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gold/50 bg-[#0d1830]/95 text-gold-light backdrop-blur-md transition-all active:scale-95 shadow-md shadow-black/50"
              title="اللوحة التالية"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <Link
            href="/auctions"
            className="inline-flex items-center gap-2 rounded-2xl border border-gold/50 bg-gradient-to-r from-gold/20 via-gold/10 to-transparent px-5 py-2.5 text-xs sm:text-sm font-black text-gold-light shadow-md active:scale-95"
          >
            <span>جميع المزادات</span>
            <ArrowLeft size={15} />
          </Link>
        </div>

        {/* Bottom Trust & Guarantee Strip */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-5">
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-300">
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
