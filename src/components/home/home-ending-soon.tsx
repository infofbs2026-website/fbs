'use client';

import React, { useRef, useState, useEffect, useMemo, useCallback, memo } from 'react';
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
import { FbsStageWatermark, PlateVisualizer } from '@/components/ui';
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
function getAuctionTime(endsAt?: string) {
  if (!endsAt || !Number.isFinite(Date.parse(endsAt))) return { text: '—', color: 'text-[#14243C]' };
  const totalMinutes = Math.max(0, Math.floor((Date.parse(endsAt) - Date.now()) / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return { text: `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')} س`, color: totalMinutes <= 60 ? 'text-amber-600 font-bold' : 'text-[#14243C] font-semibold' };
}

/**
 * Keeps horizontal track offset strictly wrapped inside (-2 * setWidth, -setWidth].
 * With 3 identical sets [0..W), [W..2W), [2W..3W), Set 0 is always buffered on the left
 * and Set 2 is always buffered on the right — making empty gaps mathematically impossible
 * whether swiping right or left indefinitely.
 */
function wrapTrackOffset(x: number, setWidth: number): number {
  if (setWidth <= 0) return 0;
  const rel = (x + setWidth) % setWidth;
  const normalized = rel > 0 ? rel - setWidth : rel;
  return normalized - setWidth;
}

/**
 * Reusable Card Component for Ending Soon Auctions
 */
const EndingSoonCard = memo(function EndingSoonCard({
  plate,
  lotNum,
  timeInfo,
  cardRef
}: {
  plate: MarketplacePlate;
  lotNum: number;
  timeInfo: { text: string; color: string };
  cardRef?: React.Ref<HTMLElement>;
}) {
  const rawPrice = plate.auction?.currentPriceHalalas ?? plate.priceHalalas ?? '0';

  return (
    <article
      ref={cardRef}
      dir="rtl"
      className="@container relative shrink-0 w-[clamp(260px,76vw,292px)] sm:w-[295px] rounded-2xl overflow-hidden border border-[#E7E4DC] hover:border-[#D9BB81]/80 shadow-[0_4px_16px_rgba(20,36,60,0.04)] hover:shadow-[0_12px_28px_rgba(20,36,60,0.08)] transition-[border-color,box-shadow] duration-300 bg-white p-3 sm:p-3.5 flex flex-col justify-between select-none"
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
      {/* POSTER CENTER: AUTHENTIC SAUDI PLATE + FBS WATERMARK     */}
      {/* -------------------------------------------------------- */}
      <div className="relative overflow-hidden my-2 sm:my-2.5 py-5 sm:py-6 px-2 w-full min-h-[128px] sm:min-h-[144px] flex items-center justify-center rounded-xl bg-gradient-to-b from-[#FFFFFF] via-[#F6F8FC] to-[#EBF0F6] border border-[#DCE3EE] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_2px_6px_rgba(15,23,42,0.04)] transition-colors duration-300 group-hover:border-[#D9BB81]/70">
        <FbsStageWatermark />
        <div className="relative z-10 w-full flex justify-center py-0.5 transition-transform duration-300 group-hover:scale-[1.02]">
          <div className="w-full max-w-[244px] flex justify-center scale-[0.94] origin-center">
            <PlateVisualizer
              lettersAr={plate.lettersAr}
              lettersEn={plate.lettersEn}
              numbers={plate.numbers}
              plateType={plate.type}
              compact
              className="w-full"
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
          draggable={false}
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

  // Build one normalized period of full plate cycles (>= 8 cards so 1 period > widest 1220px viewport)
  const baseItems = useMemo(() => {
    if (plates.length === 0) return [];
    const items: { plate: MarketplacePlate; lotNum: number }[] = [];
    while (items.length < 8) {
      for (let i = 0; i < plates.length; i++) {
        items.push({ plate: plates[i], lotNum: i + 1 });
      }
    }
    return items;
  }, [plates]);

  // Triple-buffered track: [Set 0 (left buffer), Set 1 (center active), Set 2 (right buffer)]
  const trackItems = useMemo(
    () => (baseItems.length > 0 ? [...baseItems, ...baseItems, ...baseItems] : []),
    [baseItems]
  );

  // 30-Second Calm Clock: zero CPU drain
  const [, setTimeTick] = useState<number>(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeTick((t) => t + 1);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Refs for zero-re-render 60fps infinite bidirectional track physics
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const firstSetStartRef = useRef<HTMLElement | null>(null);
  const secondSetStartRef = useRef<HTMLElement | null>(null);

  const setWidthRef = useRef<number>(0);
  const cardStrideRef = useRef<number>(290);
  const offsetRef = useRef<number>(0);
  const initializedRef = useRef<boolean>(false);

  const velocityRef = useRef<number>(0); // px/sec momentum after swipe release
  const pendingNudgeRef = useRef<number>(0); // px queued from Prev / Next buttons
  const autoRampRef = useRef<number>(1);
  const pauseAutoUntilRef = useRef<number>(0);
  const isHoveredRef = useRef<boolean>(false);
  const inViewRef = useRef<boolean>(true);
  const reducedMotionRef = useRef<boolean>(false);
  const suppressClickUntilRef = useRef<number>(0);

  const dragRef = useRef<{
    active: boolean;
    axis: 'none' | 'x' | 'y';
    startX: number;
    startY: number;
    lastX: number;
    lastTime: number;
    vxPxPerMs: number;
    movedPx: number;
  }>({
    active: false,
    axis: 'none',
    startX: 0,
    startY: 0,
    lastX: 0,
    lastTime: 0,
    vxPxPerMs: 0,
    movedPx: 0
  });

  const applyTransform = useCallback(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    }
  }, []);

  const measureTrack = useCallback(() => {
    const firstEl = firstSetStartRef.current;
    const secondEl = secondSetStartRef.current;
    if (!firstEl || !secondEl || baseItems.length === 0) return;

    const measuredWidth = secondEl.offsetLeft - firstEl.offsetLeft;
    if (measuredWidth <= 0) return;

    const prevWidth = setWidthRef.current;
    setWidthRef.current = measuredWidth;
    cardStrideRef.current = measuredWidth / baseItems.length;

    if (!initializedRef.current) {
      offsetRef.current = -measuredWidth;
      initializedRef.current = true;
    } else if (prevWidth > 0 && Math.abs(measuredWidth - prevWidth) > 0.5) {
      const progress = (offsetRef.current + prevWidth) / prevWidth;
      offsetRef.current = wrapTrackOffset(-measuredWidth + progress * measuredWidth, measuredWidth);
    } else {
      offsetRef.current = wrapTrackOffset(offsetRef.current, measuredWidth);
    }

    applyTransform();
  }, [applyTransform, baseItems.length]);

  const nudge = useCallback((direction: 'next' | 'prev') => {
    const fallbackStep = typeof window !== 'undefined' && window.innerWidth < 640 ? 276 : 315;
    const step = cardStrideRef.current > 0 ? cardStrideRef.current : fallbackStep;
    velocityRef.current = 0;
    pendingNudgeRef.current += direction === 'next' ? -step : step;
    pauseAutoUntilRef.current = performance.now() + 2400;
  }, []);

  // Measure track geometry & keep synced via ResizeObserver + IntersectionObserver
  useEffect(() => {
    if (trackItems.length === 0) return;

    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    measureTrack();

    let resizeObserver: ResizeObserver | null = null;
    if ('ResizeObserver' in window && trackRef.current) {
      resizeObserver = new ResizeObserver(() => {
        measureTrack();
      });
      resizeObserver.observe(trackRef.current);
    }
    window.addEventListener('resize', measureTrack, { passive: true });

    let intersectionObserver: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window && viewportRef.current) {
      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          inViewRef.current = entry.isIntersecting;
        },
        { rootMargin: '200px 0px' }
      );
      intersectionObserver.observe(viewportRef.current);
    }

    return () => {
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      window.removeEventListener('resize', measureTrack);
    };
  }, [measureTrack, trackItems.length]);

  // Native Touch & Mouse Drag Listeners (1:1 tracking + vertical scroll preservation)
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || trackItems.length === 0) return;

    const beginDrag = (clientX: number, clientY: number) => {
      if (setWidthRef.current <= 0) measureTrack();
      dragRef.current = {
        active: true,
        axis: 'none',
        startX: clientX,
        startY: clientY,
        lastX: clientX,
        lastTime: performance.now(),
        vxPxPerMs: 0,
        movedPx: 0
      };
      velocityRef.current = 0;
      pendingNudgeRef.current = 0;
    };

    const moveDrag = (clientX: number, clientY: number, preventDefaultIfHorizontal?: () => void) => {
      const d = dragRef.current;
      if (!d.active) return;

      const totalDx = clientX - d.startX;
      const totalDy = clientY - d.startY;

      if (d.axis === 'none') {
        if (Math.hypot(totalDx, totalDy) < 6) return;
        // Lock to vertical if gesture is predominantly vertical so browser scroll stays 100% native
        if (Math.abs(totalDy) > Math.abs(totalDx)) {
          d.axis = 'y';
          d.active = false;
          return;
        }
        d.axis = 'x';
        d.lastX = clientX;
        d.lastTime = performance.now();
      }

      if (d.axis !== 'x') return;
      preventDefaultIfHorizontal?.();

      const now = performance.now();
      const dt = Math.max(1, now - d.lastTime);
      const deltaX = clientX - d.lastX;

      const instantVx = Math.max(-2.8, Math.min(2.8, deltaX / dt));
      d.vxPxPerMs = d.vxPxPerMs * 0.25 + instantVx * 0.75;
      d.movedPx += Math.abs(deltaX);
      d.lastX = clientX;
      d.lastTime = now;

      if (setWidthRef.current > 0) {
        offsetRef.current = wrapTrackOffset(offsetRef.current + deltaX, setWidthRef.current);
        applyTransform();
      }
    };

    const endDrag = () => {
      const d = dragRef.current;
      if (!d.active) return;

      const wasHorizontal = d.axis === 'x';
      const staleTouch = performance.now() - d.lastTime > 90;
      const releaseVx = wasHorizontal && !staleTouch ? d.vxPxPerMs * 1000 : 0;

      if (wasHorizontal) {
        velocityRef.current = Math.max(-2200, Math.min(2200, releaseVx));
        pauseAutoUntilRef.current = performance.now() + 1800;
        if (d.movedPx > 8) {
          suppressClickUntilRef.current = performance.now() + 320;
        }
      }

      d.active = false;
      d.axis = 'none';
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      beginDrag(e.touches[0].clientX, e.touches[0].clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      moveDrag(e.touches[0].clientX, e.touches[0].clientY, () => {
        if (e.cancelable) e.preventDefault();
      });
    };

    const onTouchEnd = () => endDrag();

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      beginDrag(e.clientX, e.clientY);
      const onWinMouseMove = (ev: MouseEvent) => {
        moveDrag(ev.clientX, ev.clientY);
      };
      const onWinMouseUp = () => {
        endDrag();
        window.removeEventListener('mousemove', onWinMouseMove);
        window.removeEventListener('mouseup', onWinMouseUp);
      };
      window.addEventListener('mousemove', onWinMouseMove);
      window.addEventListener('mouseup', onWinMouseUp);
    };

    viewport.addEventListener('touchstart', onTouchStart, { passive: true });
    viewport.addEventListener('touchmove', onTouchMove, { passive: false });
    viewport.addEventListener('touchend', onTouchEnd, { passive: true });
    viewport.addEventListener('touchcancel', onTouchEnd, { passive: true });
    viewport.addEventListener('mousedown', onMouseDown);

    return () => {
      viewport.removeEventListener('touchstart', onTouchStart);
      viewport.removeEventListener('touchmove', onTouchMove);
      viewport.removeEventListener('touchend', onTouchEnd);
      viewport.removeEventListener('touchcancel', onTouchEnd);
      viewport.removeEventListener('mousedown', onMouseDown);
    };
  }, [applyTransform, measureTrack, trackItems.length]);

  // Unified 60fps GPU Loop: Auto-Glide + Swipe Inertia + Arrow Button Stepping
  useEffect(() => {
    if (trackItems.length === 0) return;

    const AUTO_GLIDE_SPEED = -28; // Calm continuous right-to-left flow (px/sec)
    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dtSec = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      const setWidth = setWidthRef.current;
      const isActivelyDraggingX = dragRef.current.active && dragRef.current.axis === 'x';

      if (setWidth > 0 && inViewRef.current && !document.hidden && !isActivelyDraggingX) {
        let nextOffset = offsetRef.current;
        let moved = false;

        // 1. Smoothly ease any queued arrow-button steps
        if (Math.abs(pendingNudgeRef.current) > 0.25) {
          const stepDelta = pendingNudgeRef.current * (1 - Math.exp(-dtSec * 11));
          nextOffset += stepDelta;
          pendingNudgeRef.current -= stepDelta;
          moved = true;
        } else if (pendingNudgeRef.current !== 0) {
          nextOffset += pendingNudgeRef.current;
          pendingNudgeRef.current = 0;
          moved = true;
        }

        // 2. Coast with smooth exponential friction after touch/mouse swipe release
        if (Math.abs(velocityRef.current) > 4) {
          nextOffset += velocityRef.current * dtSec;
          velocityRef.current *= Math.exp(-dtSec * 4.2);
          moved = true;
        } else if (velocityRef.current !== 0) {
          velocityRef.current = 0;
        }

        // 3. Calm continuous auto-glide (ramps smoothly after user interaction)
        const shouldAutoGlide =
          !reducedMotionRef.current &&
          !isHoveredRef.current &&
          !dragRef.current.active &&
          now >= pauseAutoUntilRef.current &&
          Math.abs(pendingNudgeRef.current) < 1 &&
          Math.abs(velocityRef.current) < 12;

        if (shouldAutoGlide) {
          autoRampRef.current += (1 - autoRampRef.current) * Math.min(1, dtSec * 3);
        } else {
          autoRampRef.current *= Math.exp(-dtSec * 8);
        }

        if (autoRampRef.current > 0.005) {
          nextOffset += AUTO_GLIDE_SPEED * autoRampRef.current * dtSec;
          moved = true;
        }

        if (moved) {
          offsetRef.current = wrapTrackOffset(nextOffset, setWidth);
          applyTransform();
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [applyTransform, trackItems.length]);

  const handleClickCapture = useCallback((e: React.MouseEvent) => {
    if (performance.now() < suppressClickUntilRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  if (plates.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24 text-[#14243C] select-none bg-white border-b border-[#E7E5DF] [overflow-anchor:none]">
      {/* Top 1px Accent Line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D9BB81]/40 to-transparent pointer-events-none" />

      {/* Main Container: Constrained to ~1220px with zero vertical layout jumping */}
      <div className="max-w-[1220px] mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        <ScrollReveal direction="none" delay={0}>
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
                  onClick={() => nudge('prev')}
                  aria-label="السابق"
                  className="group flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E0D8] bg-[#F7F6F3] text-[#14243C] shadow-xs transition-all duration-200 hover:border-[#D9BB81] hover:scale-105 active:scale-95"
                  title="اللوحة السابقة"
                >
                  <ChevronLeft size={18} className="transition-transform group-hover:scale-110" />
                </button>
                <button
                  type="button"
                  onClick={() => nudge('next')}
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
        {/* INFINITE BIDIRECTIONAL GLIDE + 1:1 TOUCH SWIPE CAROUSEL        */}
        {/* ============================================================== */}
        <div
          ref={viewportRef}
          className="relative w-full overflow-hidden py-3 touch-pan-y cursor-grab active:cursor-grabbing"
          dir="ltr"
          style={{ touchAction: 'pan-y' }}
          onMouseEnter={() => {
            isHoveredRef.current = true;
          }}
          onMouseLeave={() => {
            isHoveredRef.current = false;
          }}
          onClickCapture={handleClickCapture}
          onDragStart={(e) => e.preventDefault()}
        >
          <div
            ref={trackRef}
            className="flex w-max gap-3.5 sm:gap-5 will-change-transform"
          >
            {trackItems.map((item, idx) => (
              <EndingSoonCard
                key={`carousel-${item.plate.id || 'plate'}-${idx}`}
                cardRef={
                  idx === 0
                    ? firstSetStartRef
                    : idx === baseItems.length
                    ? secondSetStartRef
                    : undefined
                }
                plate={item.plate}
                lotNum={item.lotNum}
                timeInfo={getAuctionTime(item.plate.auction?.endsAt)}
              />
            ))}
          </div>
        </div>

        {/* Mobile Carousel Controls Bar: Positioned Below Carousel */}
        <div className="mt-4 mb-2 flex lg:hidden items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2" dir="ltr">
            <button
              type="button"
              onClick={() => nudge('prev')}
              aria-label="السابق"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E0D8] bg-white text-[#14243C] shadow-xs transition-all active:scale-95 cursor-pointer"
              title="اللوحة السابقة"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => nudge('next')}
              aria-label="التالي"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E0D8] bg-white text-[#14243C] shadow-xs transition-all active:scale-95 cursor-pointer"
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
