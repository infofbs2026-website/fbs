'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Radio,
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  Pause
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
  const [bidCount, setBidCount] = useState<number>(
    currentPlate.auction?.bidCount || 28
  );
  const [priceFlash, setPriceFlash] = useState(false);
  const [newBidAlert, setNewBidAlert] = useState<string | null>(null);

  // Auto-Slideshow & Hover-to-Pause States
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100%

  const ROTATE_INTERVAL_MS = 5500; // 5.5 seconds per live auction
  const TICK_INTERVAL_MS = 100;

  // When changing current plate, reset timer, price, and progress bar
  useEffect(() => {
    setTimeLeft(calculateInitialSeconds(currentPlate));
    setCurrentPriceHalalas(currentPlate.auction?.currentPriceHalalas || '75000000');
    setBidCount(currentPlate.auction?.bidCount || 28);
    setPriceFlash(false);
    setNewBidAlert(null);
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

      setBidCount((prev) => prev + 1);
      setPriceFlash(true);
      const incInRiyals = (Number(randomInc) / 100).toLocaleString('en-US');
      setNewBidAlert(`+${incInRiyals} ر.س مزايدة جديدة`);

      setTimeout(() => setPriceFlash(false), 2000);
      setTimeout(() => setNewBidAlert(null), 3800);
    }, intervalTime);

    return () => clearInterval(bidInterval);
  }, [isEnded, currentPlate.id]);

  // 3. Automated Carousel Rotation with Progress Bar (Paused when Hovered)
  useEffect(() => {
    if (platesPool.length <= 1 || isHovered || isEnded) return;

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
  }, [platesPool.length, isHovered, isEnded]);

  // 4. Format HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    if (totalSeconds <= 0) return '00:00:00';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // 5. Navigation Handlers
  const handleNextAuction = () => {
    if (platesPool.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % platesPool.length);
      setProgress(0);
    }
  };

  const handlePrevAuction = () => {
    if (platesPool.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + platesPool.length) % platesPool.length);
      setProgress(0);
    }
  };

  const handleSelectAuction = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  // Direct destination URL for the active auction
  const auctionUrl =
    currentPlate.auction?.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentPlate.auction.id)
      ? `/auction-room/${currentPlate.auction.id}`
      : `/plates/${currentPlate.slug}`;

  // Plate letters string (e.g. "ف ب س 1")
  const plateTitleAr = `${currentPlate.lettersAr.join(' ')} ${currentPlate.numbers}`;

  return (
    <div
      className="relative flex items-start justify-center lg:justify-end pt-0 pb-2 w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glowing Ambient Aura */}
      <div className="absolute h-80 w-80 rounded-full bg-gradient-to-tr from-gold/30 via-indigo-600/20 to-transparent blur-3xl pointer-events-none lg:end-12" />

      {/* Main Glassmorphic Auction Card (Rich Depth with Golden Accents) */}
      <div className="relative w-full max-w-[540px] xl:max-w-[550px] lg:ms-auto rounded-3xl border border-gold/35 bg-gradient-to-b from-[#141f38]/95 via-[#0e172a]/95 to-[#080e1c]/98 backdrop-blur-2xl p-4 sm:p-5 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.65),0_10px_25px_-5px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.14)] transition-all duration-300">
        
        {/* Top Slim Golden Progress Line (Visual Rotation Bar, Freezes on Hover) */}
        {platesPool.length > 1 && !isEnded && (
          <div className="absolute top-0 inset-x-5 h-[2px] bg-white/10 overflow-hidden rounded-t-3xl">
            <div
              className={`h-full transition-all duration-100 ease-linear ${
                isHovered
                  ? 'bg-amber-400 opacity-95'
                  : 'bg-gradient-to-r from-gold via-gold-light to-gold shadow-[0_0_8px_rgba(217,184,127,0.8)]'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Header Ticker, Status & Plate Identifier (Clean with Subtle Gold Divider) */}
        <div className="mb-3 flex items-center justify-between border-b border-gold/20 pb-2.5">
          <div className="flex items-center gap-2">
            {!isEnded ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-live shadow-[0_0_6px_#34d399]" />
                <span>مزاد نخبة مباشر</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-bold text-slate-200 border border-white/15">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span>اكتمل المزاد - تم الرسو</span>
              </span>
            )}

            {/* Hover Pause Status Indicator */}
            {isHovered && platesPool.length > 1 && !isEnded ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/35">
                <Pause size={10} className="text-amber-400 fill-amber-400" />
                <span>معلّق للمعاينة</span>
              </span>
            ) : newBidAlert ? (
              <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-gold-light border border-gold/40 animate-pulse">
                <TrendingUp size={11} className="text-gold" />
                <span>{newBidAlert}</span>
              </span>
            ) : null}
          </div>

          {/* Plate Identifier Badge with Gold Border */}
          <span
            className="font-norwester text-xs font-bold tracking-wider text-gold-light bg-[#1d2d4d]/90 border border-gold/35 px-2.5 py-1 rounded-md shadow-xs backdrop-blur-md"
            dir="ltr"
          >
            FBS-{currentPlate.slug.toUpperCase()}
          </span>
        </div>

        {/* 3D Skeuomorphic Plate Pedestal with Light Platinum Background & Gold Border (Clear Contrast with Saudi Plate's Black Frame) */}
        <div className="rounded-xl p-3 sm:p-3.5 flex items-center justify-center bg-gradient-to-b from-[#f1f4f9] via-[#e2e8f0] to-[#d6dfea] border border-gold/40 shadow-[inset_0_3px_8px_rgba(15,23,42,0.18),inset_0_1px_3px_rgba(15,23,42,0.1),0_4px_16px_rgba(0,0,0,0.35)]">
          <div
            key={currentPlate.id}
            className="w-full animate-plate-switch transition-transform duration-300 hover:scale-[1.01]"
          >
            <PlateVisualizer
              lettersAr={currentPlate.lettersAr}
              lettersEn={currentPlate.lettersEn}
              numbers={currentPlate.numbers}
              plateType={currentPlate.type}
              large
            />
          </div>
        </div>

        {/* Elevated Lighter Ticker Card with Gold Border & Rich Depth (No Murky Darkness) */}
        <div className="mt-3 rounded-xl border border-gold/35 bg-gradient-to-b from-[#213354]/95 via-[#192742]/95 to-[#131f36]/95 backdrop-blur-xl p-3 sm:p-3.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_6px_20px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between">
            {/* Price section with live pulse flash */}
            <div>
              <span className="block text-[11px] font-bold text-slate-200">
                {!isEnded ? 'أعلى مزايدة مسجلة' : 'سعر الترسية النهائي'}
              </span>
              <div
                className={`mt-1 flex items-baseline gap-1.5 text-xl font-bold transition-all duration-300 rounded-lg px-1 -ms-1 ${
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
                className={`font-norwester text-base font-bold tracking-widest mt-1 block drop-shadow-xs ${
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

        {/* Specifications & Bid Count as Elevated Badges */}
        <div className="mt-2.5 flex items-center justify-between gap-2 px-0.5">
          <div className="flex items-center gap-1.5 rounded-lg bg-[#1a2844]/90 border border-gold/25 px-2.5 py-1 text-[11px] font-bold text-slate-100 shadow-xs backdrop-blur-md">
            <Trophy size={13} className="text-gold" />
            <span>
              {currentPlate.numbers.length === 1
                ? 'لوحة أحادية ملكية'
                : currentPlate.numbers.length === 2
                  ? 'لوحة ثنائية نادرة'
                  : currentPlate.type === 'نقل'
                    ? 'لوحة نقل مميزة'
                    : 'لوحة مميزة خاصة'}
            </span>
          </div>
          <span
            className={`font-norwester text-[11px] px-3 py-1 rounded-lg font-bold transition-colors shadow-xs backdrop-blur-md ${
              priceFlash
                ? 'bg-gold/30 text-gold-light font-black ring-1 ring-gold/40'
                : 'text-gold-light bg-gold/15 border border-gold/35'
            }`}
            dir="ltr"
          >
            {bidCount} BIDS ACTIVE
          </span>
        </div>

        {/* Dedicated Bottom Carousel Controls with Lighter Surface & Gold Border */}
        {platesPool.length > 1 && (
          <div className="mt-2.5 flex items-center justify-between rounded-xl bg-gradient-to-b from-[#213354]/95 via-[#192742]/95 to-[#131f36]/95 backdrop-blur-xl border border-gold/30 px-3 py-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),0_4px_16px_rgba(0,0,0,0.35)]">
            {/* Previous Auction Button */}
            <button
              type="button"
              onClick={handlePrevAuction}
              className="group flex h-8 items-center gap-1 rounded-lg bg-[#16233d] hover:bg-gold/25 border border-gold/40 px-3 text-xs font-bold text-slate-100 shadow-xs hover:border-gold hover:text-gold-light active:scale-95 transition-all cursor-pointer"
              title="المزاد السابق"
              aria-label="المزاد السابق"
            >
              <ChevronRight size={14} className="text-gold transition-transform group-hover:translate-x-0.5" />
              <span className="text-[11px]">السابق</span>
            </button>

            {/* Deep Recessed Indicator Track with 3D Depth */}
            <div className="flex items-center gap-1.5 rounded-full bg-[#0c1427]/90 p-1 px-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] border border-gold/25">
              {platesPool.map((p, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectAuction(idx)}
                    className={`group relative transition-all duration-300 rounded-full cursor-pointer focus:outline-none ${
                      isActive
                        ? 'h-3.5 w-8 bg-gradient-to-r from-[#faebd0] via-[#d9b87f] to-[#d0ad67] shadow-[0_0_12px_rgba(217,184,127,0.85),0_2px_4px_rgba(0,0,0,0.4)] border border-amber-400/50 flex items-center justify-center'
                        : 'h-2 w-2 bg-slate-500 hover:bg-slate-300 border border-white/10 hover:scale-125'
                    }`}
                    aria-label={`المزاد ${idx + 1}`}
                    title={`لوحة ${p.lettersAr.join(' ')} ${p.numbers}`}
                  >
                    {isActive && (
                      <span className="text-[9px] font-black text-navy font-norwester tracking-tight drop-shadow-xs">
                        {idx + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Next Auction Button */}
            <button
              type="button"
              onClick={handleNextAuction}
              className="group flex h-8 items-center gap-1 rounded-lg bg-[#16233d] hover:bg-gold/25 border border-gold/40 px-3 text-xs font-bold text-slate-100 shadow-xs hover:border-gold hover:text-gold-light active:scale-95 transition-all cursor-pointer"
              title="المزاد التالي"
              aria-label="المزاد التالي"
            >
              <span className="text-[11px]">التالي</span>
              <ChevronLeft size={14} className="text-gold transition-transform group-hover:-translate-x-0.5" />
            </button>
          </div>
        )}

        {/* Direct CTA Button Bound 100% to this Specific Auction */}
        <div className="mt-3">
          {!isEnded ? (
            <Link
              href={auctionUrl}
              className="group btn btn-gold w-full h-[46px] rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base font-black shadow-lg shadow-gold/25 hover:shadow-gold/45 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              <Radio className="w-4 h-4 text-navy animate-pulse" />
              <span>دخول مزاد اللوحة الآن</span>
              <span className="text-xs font-bold text-navy/70 ps-1" dir="rtl">
                ({plateTitleAr})
              </span>
              <ArrowLeft className="w-4 h-4 text-navy/80 transition-transform duration-300 group-hover:-translate-x-1" />
            </Link>
          ) : (
            <div className="flex flex-col gap-1.5">
              <Link
                href={auctionUrl}
                className="group w-full h-[46px] rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 flex items-center justify-center gap-2 text-xs sm:text-sm font-black transition-all cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>تفاصيل اللوحة وترسية المزاد ({plateTitleAr})</span>
                <ArrowLeft className="w-4 h-4 text-slate-400 transition-transform duration-300 group-hover:-translate-x-1" />
              </Link>
              {platesPool.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextAuction}
                  className="w-full py-1 text-center text-xs font-bold text-gold hover:underline cursor-pointer"
                >
                  الانتقال إلى المزاد الحي التالي &larr;
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

