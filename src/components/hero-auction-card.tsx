'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Radio,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Pause,
  Play
} from 'lucide-react';
import { PlateVisualizer } from '@/components/ui';
import { SarSymbol, formatEnglishAmount } from '@/components/sar-symbol';
import type { MarketplacePlate } from '@/modules/marketplace/types';

interface HeroAuctionCardProps {
  initialPlate: MarketplacePlate;
  allLivePlates?: MarketplacePlate[];
}

export function HeroAuctionCard({
  initialPlate,
  allLivePlates = []
}: HeroAuctionCardProps) {
  // Available plates pool without duplicates, ensuring initialPlate is first
  const platesPool = useMemo(() => {
    if (!allLivePlates || allLivePlates.length === 0) return [initialPlate];
    const seen = new Set<string>();
    const list: MarketplacePlate[] = [];
    seen.add(initialPlate.id);
    list.push(initialPlate);
    for (const p of allLivePlates) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        list.push(p);
      }
    }
    return list;
  }, [initialPlate, allLivePlates]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentPlate = platesPool[currentIndex] || initialPlate;

  // Real-time Countdown Timer State (calculated from endsAt)
  const calculateInitialSeconds = (plate: MarketplacePlate) => {
    if (!plate.auction?.endsAt) return 4 * 3600 + 18 * 60 + 22; // 04:18:22 fallback
    const diff = Math.floor((new Date(plate.auction.endsAt).getTime() - Date.now()) / 1000);
    return diff > 0 ? diff : 4 * 3600 + 18 * 60 + 22;
  };

  const [timeLeft, setTimeLeft] = useState(() => calculateInitialSeconds(currentPlate));
  const isEnded = timeLeft <= 0;

  // Real-time Bidding Price State
  const [currentPriceHalalas, setCurrentPriceHalalas] = useState<string>(
    currentPlate.auction?.currentPriceHalalas || '75000000'
  );
  const [priceFlash, setPriceFlash] = useState(false);

  // Manual Pause & Hover-to-Pause States
  const [isManualPaused, setIsManualPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100%

  const ROTATE_INTERVAL_MS = 6500; // Keep the plate readable before rotating
  const TICK_INTERVAL_MS = 50; // Smooth progress updates

  // When changing current plate, reset timer, price, and progress bar
  useEffect(() => {
    setTimeLeft(calculateInitialSeconds(currentPlate));
    setCurrentPriceHalalas(currentPlate.auction?.currentPriceHalalas || '75000000');
    setPriceFlash(false);
    setProgress(0);
  }, [currentIndex, currentPlate]);

  // 1. Tick Countdown Every Second
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // 2. Simulated Dynamic Real-Time Bids for the active plate
  useEffect(() => {
    if (isEnded) return;

    const intervalTime = Math.floor(Math.random() * 8000) + 14000;
    const bidInterval = setInterval(() => {
      const increments = [1000000n, 1500000n, 2000000n, 2500000n];
      const randomInc = increments[Math.floor(Math.random() * increments.length)];

      setCurrentPriceHalalas((prev) => {
        try {
          return (BigInt(prev) + randomInc).toString();
        } catch {
          return prev;
        }
      });

      setPriceFlash(true);
      setTimeout(() => setPriceFlash(false), 2000);
    }, intervalTime);

    return () => clearInterval(bidInterval);
  }, [isEnded, currentPlate.id]);

  // Touch Swiping & Gesture States for Mobile
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isTouching, setIsTouching] = useState(false);

  // Automated Carousel Rotation with Progress Bar (Paused when Hovered, Touched, or Manually Paused)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (platesPool.length <= 1 || isHovered || isTouching || isManualPaused || isEnded) return;

    const progressStep = (TICK_INTERVAL_MS / ROTATE_INTERVAL_MS) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((old) => (old + 1) % platesPool.length);
          return 0;
        }
        return prev + progressStep;
      });
    }, TICK_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [platesPool.length, isHovered, isTouching, isManualPaused, isEnded]);

  // Touch Gesture Handlers for Mobile Swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    if (platesPool.length <= 1) return;
    const touch = e.touches[0];
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);
    setIsTouching(true);
  };

  const handleTouchMove = (_e: React.TouchEvent) => {
    // Keep touch-pan-y active so page scroll continues naturally
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsTouching(false);
    if (touchStartX === null || touchStartY === null || platesPool.length <= 1) {
      setTouchStartX(null);
      setTouchStartY(null);
      return;
    }

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    // Minimum swipe threshold (35px) and primarily horizontal
    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        // Swiped Left: advance to next plate
        setCurrentIndex((prev) => (prev + 1) % platesPool.length);
        setProgress(0);
      } else {
        // Swiped Right: go to previous plate
        setCurrentIndex((prev) => (prev - 1 + platesPool.length) % platesPool.length);
        setProgress(0);
      }
    }

    setTouchStartX(null);
    setTouchStartY(null);
  };

  const handleTouchCancel = () => {
    setIsTouching(false);
    setTouchStartX(null);
    setTouchStartY(null);
  };

  // Format HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    if (totalSeconds <= 0) return '00:00:00';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Direct destination URL for the active auction
  const auctionUrl =
    currentPlate.auction?.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentPlate.auction.id)
      ? `/auction-room/${currentPlate.auction.id}`
      : `/plates/${currentPlate.slug}`;

  // Plate letters & numbers formatting for titles
  const arabicLetters = Array.isArray(currentPlate.lettersAr) ? currentPlate.lettersAr.join(' ') : currentPlate.lettersAr;
  const plateTitleAr = `${arabicLetters} ${currentPlate.numbers}`;

  const isPausedState = isManualPaused || isHovered || isTouching;

  return (
    <div
      className="relative flex items-stretch justify-center pt-0 pb-0 w-full max-w-full overflow-hidden sm:overflow-visible touch-pan-y"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsHovered(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsHovered(false);
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      {/* Glowing Ambient Aura */}
      <div className="absolute h-80 w-80 rounded-full bg-gradient-to-tr from-gold/30 via-indigo-600/20 to-transparent blur-3xl pointer-events-none lg:end-12" />

      {/* Main Glassmorphic Auction Card (Narrower width: max-w-[420px], full height matching right column) */}
      <div className="relative w-full max-w-[30rem] mx-auto rounded-3xl border border-gold/35 bg-gradient-to-b from-[#141f38]/95 via-[#0e172a]/95 to-[#080e1c]/98 backdrop-blur-2xl p-4 sm:p-5 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.65),0_10px_25px_-5px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.14)] transition-all duration-300 flex flex-col justify-start gap-3.5">
        
        {/* Top Slim Golden Progress Line (Visual Rotation Bar, Turns Amber When Paused) */}
        {platesPool.length > 1 && !isEnded && (
          <div className="absolute top-0 inset-x-5 h-[2px] bg-white/10 overflow-hidden rounded-t-3xl">
            <div
              className={`h-full transition-all duration-100 ease-linear ${
                isPausedState
                  ? 'bg-amber-400 opacity-95 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                  : 'bg-gradient-to-r from-gold via-gold-light to-gold shadow-[0_0_8px_rgba(217,184,127,0.8)]'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Top Section: Header (Live Badge, Play/Pause Control, & Plate Identifier) */}
        <div className="w-full">
          <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-gold/20 pb-2.5">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {!isEnded ? (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-2 py-1 text-[0.72rem] font-bold text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                  <span>مزاد نخبة مباشر</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2 py-1 text-[0.72rem] font-bold text-slate-200 border border-white/15">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  <span>اكتمل المزاد</span>
                </span>
              )}

              {/* Interactive Play/Pause Toggle Pill */}
              {!isEnded && platesPool.length > 1 && (
                <button
                  type="button"
                  onClick={() => setIsManualPaused((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[0.72rem] font-bold border transition-all cursor-pointer backdrop-blur-md active:scale-95 ${
                    isManualPaused
                      ? 'bg-amber-500/25 border-amber-400/60 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.35)]'
                      : isHovered
                        ? 'bg-amber-500/15 border-amber-500/35 text-amber-300/90'
                        : 'bg-white/10 border-white/20 text-slate-200 hover:border-gold/50 hover:text-gold-light'
                  }`}
                  title={isManualPaused ? 'المعاينة معلّقة - اضغط للاستئناف' : 'اضغط لإيقاف التبديل وتثبيت هذه اللوحة'}
                  aria-pressed={isManualPaused}
                >
                  {isManualPaused ? (
                    <>
                      <Play size={10} className="text-amber-400 fill-amber-400" />
                      <span>معلّق للمعاينة</span>
                    </>
                  ) : (
                    <>
                      <Pause size={10} className="text-slate-300 fill-slate-300" />
                      <span>معاينة تلقائية</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Plate Identifier Badge */}
            <span
              className="font-norwester text-[11px] font-bold tracking-wider text-gold-light bg-[#1d2d4d]/90 border border-gold/35 px-2 py-0.5 rounded-md shadow-xs backdrop-blur-md"
              dir="ltr"
            >
              FBS-{currentPlate.slug.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Middle Section: Authentic Saudi Plate Frontal View (Centered & fills vertical space gracefully) */}
        <div className="py-1.5 w-full flex flex-col justify-center">
          <div className="rounded-2xl p-2.5 sm:p-3 flex items-center justify-center bg-gradient-to-b from-[#0b1324] via-[#070d18] to-[#040812] border border-gold/30 shadow-[inset_0_2px_10px_rgba(0,0,0,0.7),0_8px_24px_rgba(0,0,0,0.4)] relative overflow-visible">
            {/* Subtle Ambient Gold Glow behind Plate */}
            <div className="absolute h-32 w-64 rounded-full bg-gold/15 blur-2xl pointer-events-none" />

            <div
              key={currentPlate.id}
              className="relative z-10 w-full flex justify-center animate-plate-switch transition-transform duration-300 hover:scale-[1.01]"
            >
              <PlateVisualizer
                lettersAr={currentPlate.lettersAr}
                lettersEn={currentPlate.lettersEn}
                numbers={currentPlate.numbers}
                plateType={currentPlate.type}
                className="w-full max-w-[365px]"
              />
            </div>
          </div>
        </div>

        {/* Bottom Section: Elevated Price/Timer Ticker + Direct Auction CTA */}
        <div className="w-full space-y-3">
          {/* Elevated Price & Countdown Ticker Card */}
          <div className="rounded-xl border border-gold/35 bg-gradient-to-b from-[#213354]/95 via-[#192742]/95 to-[#131f36]/95 backdrop-blur-xl p-3 sm:p-3.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_6px_20px_rgba(0,0,0,0.35)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Price section with live pulse flash */}
              <div>
                <span className="block text-[11px] font-bold text-slate-200">
                  {!isEnded ? 'أعلى مزايدة مسجلة' : 'سعر الترسية النهائي'}
                </span>
                <div
                  className={`mt-0.5 flex items-baseline gap-1.5 text-xl font-bold transition-all duration-300 rounded-lg px-1 -ms-1 ${
                    priceFlash ? 'bg-gold/25 text-gold-light ring-2 ring-gold/40' : 'text-white'
                  }`}
                  dir="ltr"
                >
                  <span suppressHydrationWarning className="tabular-nums tracking-tight font-norwester text-2xl font-black text-white drop-shadow-xs">
                    {formatEnglishAmount(currentPriceHalalas)}
                  </span>
                  <SarSymbol className="w-4 h-4 text-gold inline-block self-center drop-shadow-xs" />
                </div>
              </div>

              {/* Countdown timer section */}
              <div className="text-end">
                <span className="block text-[11px] font-bold text-slate-200 flex items-center justify-end gap-1.5">
                  <Clock size={12} className={!isEnded ? 'text-emerald-400' : 'text-slate-400'} />
                  <span>{!isEnded ? 'الوقت المتبقي' : 'حالة المزاد'}</span>
                </span>
                <span
                  suppressHydrationWarning
                  className={`font-norwester text-base font-bold tracking-widest mt-0.5 block drop-shadow-xs ${
                    !isEnded
                      ? timeLeft < 600
                        ? 'text-red-400 animate-pulse'
                        : 'text-gold-light'
                      : 'text-emerald-400 text-xs font-sans font-bold'
                  }`}
                  dir="ltr"
                >
                  {!isEnded ? formatTime(timeLeft) : 'منتهي (تم الرسو)'}
                </span>
              </div>
            </div>
          </div>

          {/* Direct CTA Button Bound to this Specific Auction */}
          <div>
            {!isEnded ? (
              <Link
                href={auctionUrl}
                className="group btn btn-gold w-full min-h-[2.875rem] h-auto py-2.5 text-center flex-wrap rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base font-black shadow-lg shadow-gold/25 hover:shadow-gold/45 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                <Radio className="w-4 h-4 text-navy animate-pulse" />
                <span>دخول مزاد اللوحة الآن</span>
                <span className="text-xs font-bold text-navy/70 ps-1" dir="rtl">
                  ({plateTitleAr})
                </span>
                <ArrowLeft className="w-4 h-4 text-navy/80 transition-transform duration-300 group-hover:-translate-x-1" />
              </Link>
            ) : (
              <Link
                href={auctionUrl}
                className="group w-full min-h-[2.875rem] h-auto py-2.5 text-center flex-wrap rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 flex items-center justify-center gap-2 text-xs sm:text-sm font-black transition-all cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>تفاصيل اللوحة وترسية المزاد ({plateTitleAr})</span>
                <ArrowLeft className="w-4 h-4 text-slate-400 transition-transform duration-300 group-hover:-translate-x-1" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
