'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Radio,
  ArrowLeft,
  CheckCircle2,
  Clock,
  TrendingUp,
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

  const ROTATE_INTERVAL_MS = 3200; // 3.2 seconds per live auction (brisk and comfortable)
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
      className="@container relative flex flex-col items-center justify-center w-full max-w-full lg:h-full overflow-hidden sm:overflow-visible touch-pan-y"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      {/* Subtle Ambient Gold Horizon Glow */}
      <div className="absolute h-64 w-64 rounded-full bg-gold/10 blur-3xl pointer-events-none lg:end-4 -top-8" />

      {/* Main Glassmorphic Auction Card (Authentic Apple visionOS Frosted Glass) */}
      <div id="hero-auction-card" className="relative w-full max-w-[21.5rem] xl:max-w-[22rem] lg:h-full mx-auto rounded-2xl sm:rounded-3xl border border-white/20 bg-gradient-to-b from-white/[0.09] via-white/[0.03] to-slate-950/45 backdrop-blur-2xl p-3 sm:p-3.5 xl:p-4 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.28)] transition-all duration-300 flex flex-col justify-between hover:border-white/30">
        
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

        {/* Top Section: Clean Header (Live Badge on Right + Play/Pause Control on Left) */}
        <div className="w-full">
          <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-2">
            {/* 1. Live Badge: Direct and unadorned "مزاد مباشر" */}
            <div>
              {!isEnded ? (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/20 px-2.5 py-1 text-[10.5px] sm:text-[11px] font-bold text-emerald-300 border border-emerald-400/35 backdrop-blur-md shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                  <span>مزاد مباشر</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-[10.5px] sm:text-[11px] font-bold text-slate-200 border border-white/15">
                  <CheckCircle2 size={11} className="text-emerald-400" />
                  <span>اكتمل المزاد</span>
                </span>
              )}
            </div>

            {/* 2. Repositioned Play/Pause Control (Replaces old FBS tag at the end) */}
            {!isEnded && platesPool.length > 1 && (
              <button
                type="button"
                onClick={() => setIsManualPaused((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10.5px] sm:text-[11px] font-bold border transition-all cursor-pointer backdrop-blur-md active:scale-95 ${
                  isManualPaused
                    ? 'bg-amber-500/30 border-amber-400/70 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.35)]'
                    : isHovered
                      ? 'bg-white/15 border-white/30 text-amber-300'
                      : 'bg-white/10 border-white/15 text-slate-200 hover:border-gold/50 hover:text-gold-light'
                }`}
                title={isManualPaused ? 'المعاينة معلّقة - اضغط للاستئناف' : 'اضغط لإيقاف التبديل وتثبيت هذه اللوحة'}
                aria-pressed={isManualPaused}
              >
                {isManualPaused ? (
                  <>
                    <Play size={10} className="text-amber-400 fill-amber-400" />
                    <span>معلّق</span>
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
        </div>

        {/* Middle Section: Authentic Saudi Plate Floating Directly on VisionOS Glass (Un-nested) */}
        <div className="flex-1 my-auto py-2.5 sm:py-3.5 xl:py-4.5 w-full flex flex-col justify-center items-center relative">
          <div
            key={currentPlate.id}
            className="relative z-10 w-full flex justify-center animate-plate-switch transition-transform duration-300 hover:scale-[1.02]"
          >
            <PlateVisualizer
              lettersAr={currentPlate.lettersAr}
              lettersEn={currentPlate.lettersEn}
              numbers={currentPlate.numbers}
              plateType={currentPlate.type}
              compact
              className="w-full max-w-[270px] sm:max-w-[280px] xl:max-w-[290px] drop-shadow-[0_12px_28px_rgba(0,0,0,0.65)]"
            />
          </div>
        </div>

        {/* Bottom Section: Elevated Frosted Price/Timer Ticker + Direct Auction CTA */}
        <div className="w-full space-y-2 sm:space-y-2.5 mt-auto">
          {/* Elevated Frosted Price & Countdown Shelf */}
          <div className="rounded-xl border border-white/15 bg-white/[0.06] backdrop-blur-xl p-2 sm:p-2.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_20px_rgba(0,0,0,0.35)]">
            <div className="grid grid-cols-2 divide-x divide-x-reverse divide-white/10 items-center">
              {/* Price Column: Centered with Icon & Label */}
              <div className="flex flex-col items-center justify-center text-center px-1">
                <div className="flex items-center justify-center gap-1.5 text-[10.5px] sm:text-[11px] font-bold text-slate-300">
                  <TrendingUp size={11.5} className="text-gold shrink-0" />
                  <span>{!isEnded ? 'أعلى مزايدة' : 'سعر الترسية'}</span>
                </div>
                <div
                  className={`mt-0.5 flex items-baseline justify-center gap-1 font-bold transition-all duration-300 rounded-lg px-1 ${
                    priceFlash ? 'bg-gold/25 text-gold-light ring-2 ring-gold/40' : 'text-white'
                  }`}
                  dir="rtl"
                >
                  <span suppressHydrationWarning className="tabular-nums tracking-tight font-norwester text-base sm:text-lg xl:text-[20px] font-black text-white drop-shadow-xs" dir="ltr">
                    {formatEnglishAmount(currentPriceHalalas)}
                  </span>
                  <SarSymbol className="w-3.5 h-3.5 text-gold inline-block self-center drop-shadow-xs" />
                </div>
              </div>

              {/* Countdown Timer Column: Centered with Icon & Label */}
              <div className="flex flex-col items-center justify-center text-center px-1">
                <div className="flex items-center justify-center gap-1.5 text-[10.5px] sm:text-[11px] font-bold text-slate-300">
                  <Clock size={11.5} className={`shrink-0 ${!isEnded ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{!isEnded ? 'الوقت المتبقي' : 'حالة المزاد'}</span>
                </div>
                <div className="mt-0.5 flex items-baseline justify-center">
                  <span
                    suppressHydrationWarning
                    className={`font-norwester text-xs sm:text-[13px] font-bold tracking-widest block drop-shadow-xs ${
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
          </div>

          {/* Direct CTA Button Bound to this Specific Auction */}
          <div>
            {!isEnded ? (
              <Link
                href={auctionUrl}
                className="group btn btn-gold w-full h-[40px] sm:h-[44px] rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-[13px] font-black shadow-lg shadow-gold/25 hover:shadow-gold/45 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer px-2"
              >
                <Radio className="w-3.5 h-3.5 text-navy animate-pulse shrink-0" />
                <span className="whitespace-nowrap">دخول مزاد اللوحة الآن</span>
                <span className="text-[10.5px] font-bold text-navy/80 ps-0.5 truncate max-w-[90px] sm:max-w-none" dir="rtl">
                  ({plateTitleAr})
                </span>
                <ArrowLeft className="w-3.5 h-3.5 text-navy/90 transition-transform duration-300 group-hover:-translate-x-1 shrink-0" />
              </Link>
            ) : (
              <Link
                href={auctionUrl}
                className="group w-full h-[40px] sm:h-[44px] rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer shadow-xs px-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">تفاصيل اللوحة وترسية المزاد ({plateTitleAr})</span>
                <ArrowLeft className="w-3.5 h-3.5 text-slate-400 transition-transform duration-300 group-hover:-translate-x-1 shrink-0" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
