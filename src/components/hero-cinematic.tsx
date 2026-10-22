'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Gavel,
  ArrowLeft,
  ArrowUpLeft,
  ShieldCheck
} from 'lucide-react';
import { HeroAuctionCard } from '@/components/hero-auction-card';
import type { MarketplacePlate } from '@/modules/marketplace/types';

function SvgSaudiRoyalEmblem({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Palm Trunk & Arabesque Crown */}
      <path d="M12 4.5v9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      {/* Palm Fronds (Natural Arabesque Arc) */}
      <path d="M12 5c-2-2-4.5-1.8-6-.5 1.8 1.5 3.8 1.5 6 .5z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M12 5c2-2 4.5-1.8 6-.5-1.8 1.5-3.8 1.5-6 .5z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M12 7.5c-2.4-1.3-4.8-0.8-6.2.6 2 1.2 4.2 1 6.2-.6z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M12 7.5c2.4-1.3 4.8-0.8 6.2.6-2 1.2-4.2 1-6.2-.6z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M12 10c-1.8-0.7-3.8-0.2-5 1 1.6 0.8 3.4 0.5 5-1z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
      <path d="M12 10c1.8-0.7 3.8-0.2 5 1-1.6 0.8-3.4 0.5-5-1z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
      {/* Crossed Curved Scimitars */}
      <path d="M4.5 20c3.2-1 6.5-3.4 8-6.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M19.5 20c-3.2-1-6.5-3.4-8-6.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Sword Hilts / Crossguards */}
      <path d="M4 19l2 2M18 21l2-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="3.8" cy="18.8" r="0.9" fill="currentColor" />
      <circle cx="20.2" cy="18.8" r="0.9" fill="currentColor" />
    </svg>
  );
}

function SvgPlatePlus({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="5" width="20" height="14" rx="3.5" stroke="currentColor" strokeWidth="1.8" />
      <line x1="8" y1="5" x2="8" y2="19" strokeDasharray="2 2" />
      <path d="M14 9.5v5M11.5 12h5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

interface HeroCinematicProps {
  initialPlate: MarketplacePlate;
  allLivePlates: MarketplacePlate[];
}

export function HeroCinematic({ initialPlate, allLivePlates }: HeroCinematicProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Staged Choreographed Sequence:
  // stage 0: Video playing (0ms - 1800ms)
  // stage 1: Eyebrow badge floats in (1800ms)
  // stage 2: Headline & Subtitle fade in (2150ms)
  // stage 3: Action Buttons appear (2550ms)
  // stage 4: Auction Card glides in from side (2950ms)
  const [stage, setStage] = useState(0);

  // Instantly reveal all elements (for Skip or Scroll)
  const skipToRevealed = useCallback(() => {
    setStage(4);
    if (typeof window !== 'undefined') {
      (window as unknown as { __fbsHeroRevealed: boolean }).__fbsHeroRevealed = true;
      window.dispatchEvent(new CustomEvent('fbs-hero-revealed'));
    }
  }, []);

  // Ensure continuous background video playback at an energetic, dynamic speed
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.playbackRate = 1.15;
      video.play().catch(() => { });
    }
  }, []);

  // Choreographed Staggered Timers - Snappy, silky entrance without empty pauses
  useEffect(() => {
    const t1 = setTimeout(() => {
      setStage((prev) => (prev < 1 ? 1 : prev));
      if (typeof window !== 'undefined') {
        (window as unknown as { __fbsHeroRevealed: boolean }).__fbsHeroRevealed = true;
        window.dispatchEvent(new CustomEvent('fbs-hero-revealed'));
      }
    }, 120);

    const t2 = setTimeout(() => {
      setStage((prev) => (prev < 2 ? 2 : prev));
    }, 260);

    const t3 = setTimeout(() => {
      setStage((prev) => (prev < 3 ? 3 : prev));
    }, 420);

    const t4 = setTimeout(() => {
      setStage(4);
    }, 580);

    // Instant reveal on user scroll
    const handleScroll = () => {
      if (window.scrollY > 20) {
        skipToRevealed();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [skipToRevealed]);

  const isFullyRevealed = stage >= 4;

  return (
    <div className="relative w-full bg-[#08162B] overflow-hidden">
      {/* ============================================================== */}
      {/* 1. HERO SECTION: FULL-BLEED CINEMATIC 1080p BACKGROUND VIDEO    */}
      {/* ============================================================== */}
      <section className="relative w-full min-h-[100dvh] flex flex-col justify-center items-center pt-[clamp(4.25rem,6.5vh,5.5rem)] pb-[clamp(1.5rem,3vh,2.5rem)] text-white overflow-hidden bg-[#08162B]">

        {/* Background Video Layer: 100% crisp with ultra-subtle clarity tint */}
        <div
          className="absolute inset-0 z-0 overflow-hidden bg-[#08162B] bg-cover bg-center select-none pointer-events-none"
          style={{ backgroundImage: 'url(/videos/fbs-hero-poster.webp)' }}
        >
          <video
            ref={videoRef}
            playsInline
            autoPlay
            loop
            muted
            preload="metadata"
            poster="/videos/fbs-hero-poster.webp"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            className="hero-video-cover pointer-events-none select-none scale-[1.01] opacity-100"
          >
            <source src="/videos/fbs-hero-realistic-no-text.webm" type="video/webm" />
            <source src="/videos/fbs-hero-realistic-no-text.mp4" type="video/mp4" />
          </video>
          {/* Subtle Atmospheric Overlay: Softens background highlights without dulling the 100% video vibrancy */}
          <div
            className="absolute inset-0 pointer-events-none select-none bg-gradient-to-b from-[#08162B]/35 via-black/15 to-[#08162B]/50"
            aria-hidden="true"
          />
        </div>

        {/* ============================================================== */}
        {/* 2. CINEMATIC INTRO TIMELINE                                    */}
        {/* ============================================================== */}
        {!isFullyRevealed && (
          <div className="fixed top-0 inset-x-0 h-[2.5px] bg-black/30 z-[60] pointer-events-none">
            <div
              className="h-full bg-gradient-to-r from-gold via-gold-light to-gold shadow-[0_0_12px_#d9b87f]"
              style={{
                animation: 'introProgress 600ms linear forwards'
              }}
            />
          </div>
        )}

        {/* ============================================================== */}
        {/* 3. HERO CONTENT GRID: Vertically & Horizontally Aligned       */}
        {/* ============================================================== */}
        <div className="hero-container relative z-10 hero-grid-layout my-auto">

          {/* Right Column (RTL start): Headline, Subtitle, CTAs, Search Bar */}
          <div id="hero-content-column" className="flex flex-col justify-between items-center lg:items-start min-w-0 w-full lg:w-[30rem] xl:w-[33rem] max-w-[34rem] lg:shrink-0 py-0.5">
            <div className="w-full">
              {/* STAGE 1: Eyebrow Badge (Card top aligns with this) */}
              <div
                className={`flex justify-center lg:justify-start transition-all duration-700 ease-out w-full ${stage >= 1
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 -translate-y-4 pointer-events-none'
                  }`}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gradient-to-r from-gold/15 via-[#091124]/90 to-gold/15 px-3 py-1 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-xs font-bold text-gold-light backdrop-blur-2xl shadow-[0_4px_24px_rgba(217,184,127,0.2),inset_0_1px_1px_rgba(255,255,255,0.2)] ring-1 ring-gold/30 hover:border-gold/60 transition-all duration-300 max-w-full">
                  <span className="flex h-4.5 w-4.5 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-gold/20 border border-gold/50 text-gold-light shrink-0 shadow-[0_0_10px_rgba(217,184,127,0.4)]">
                    <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold-light" />
                  </span>
                  <span className="tracking-wide text-gold-light whitespace-nowrap">المنصة الرسمية المعتمدة للوحات المميزة</span>
                </div>
              </div>

              {/* STAGE 2: Commanding Luxury Headline & Subtitle */}
              <div
                className={`transition-all duration-700 ease-out delay-75 w-full ${stage >= 2
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-6 pointer-events-none'
                  }`}
              >
                <h1 className="mt-3 sm:mt-4 lg:mt-5 text-[clamp(1.75rem,3.5vw,2.25rem)] lg:text-[clamp(2.35rem,2.2vw+0.5rem,3.2rem)] xl:text-[clamp(2.65rem,2.5vw+0.6rem,3.5rem)] font-black tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] text-center lg:text-start mx-auto lg:mx-0 w-full leading-[1.22]">
                  لوحتك الاستثنائية
                  <br />
                  <span className="gold-gradient-text drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]">تبدأ من هنا.</span>
                </h1>
              </div>

              <div
                className={`transition-all duration-700 ease-out delay-150 w-full ${stage >= 2
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-6 pointer-events-none'
                  }`}
              >
                {/* Subtitle */}
                <div className="relative mt-3 sm:mt-4 lg:mt-4.5 w-full max-w-[28rem] xl:max-w-[29rem] mx-auto lg:mx-0 text-center lg:text-start">
                  <div
                    className="absolute inset-0 -inset-y-2 rounded-2xl bg-[#040814]/40 blur-md pointer-events-none"
                    aria-hidden="true"
                  />
                  <p
                    className="pf-type-body relative font-medium text-slate-200 drop-shadow-sm text-center lg:text-start leading-[1.7]"
                    style={{
                      textShadow:
                        '0 1px 3px rgba(0, 0, 0, 0.95), 0 3px 10px rgba(0, 0, 0, 0.9), 0 6px 20px rgba(0, 0, 0, 0.85)'
                    }}
                  >
                    المنصة الرسمية المعتمدة لامتلاك وعرض أندر لوحات المركبات بالمملكة عبر المزادات المباشرة.
                  </p>
                </div>
              </div>
            </div>

            {/* STAGE 3: Action Buttons */}
            <div
              className={`transition-all duration-700 ease-out w-full max-w-[28rem] xl:max-w-[29rem] mx-auto lg:mx-0 mt-5 sm:mt-6 lg:mt-7 ${stage >= 3
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-6 pointer-events-none'
                }`}
            >
              {/* Action Buttons Row */}
              <div className="flex flex-row items-center gap-2.5 sm:gap-3 w-full mx-auto lg:mx-0">
                <Link
                  href="/auctions"
                  className="group btn btn-gold text-[13px] sm:text-[14px] font-black h-[42px] sm:h-[45px] w-full sm:flex-1 justify-center gap-2 shadow-xl shadow-gold/20 transition-all duration-300 hover:shadow-gold/35 hover:scale-[1.01] active:scale-[0.98] whitespace-nowrap px-3 sm:px-4"
                >
                  <Gavel className="w-3.5 h-3.5 text-navy shrink-0 transition-transform duration-300 group-hover:-rotate-12" />
                  <span className="whitespace-nowrap">استكشف المزادات الحية</span>
                  <ArrowLeft className="w-3 h-3 text-navy/80 shrink-0 transition-transform duration-300 group-hover:-translate-x-1" />
                </Link>
                <Link
                  href="/sell-your-plate"
                  className="group btn text-[13px] sm:text-[14px] font-bold h-[42px] sm:h-[45px] hidden sm:inline-flex flex-1 justify-center gap-2 transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] border border-white/20 bg-white/[0.06] text-white hover:border-gold/50 hover:bg-gold/15 whitespace-nowrap px-3 sm:px-4 shadow-lg backdrop-blur-xl"
                >
                  <SvgPlatePlus className="w-3.5 h-3.5 text-gold shrink-0 transition-transform duration-300 group-hover:scale-110" />
                  <span className="whitespace-nowrap">اعرض لوحتك الآن</span>
                  <ArrowUpLeft className="w-3 h-3 text-gold/80 shrink-0 transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* STAGE 4: Interactive Live Auction Card */}
          <div
            className={`relative flex flex-col items-center justify-center transition-all duration-700 ease-out min-w-0 w-full lg:w-[21.5rem] xl:w-[22.5rem] max-w-[23rem] lg:shrink-0 lg:h-full lg:self-stretch ${stage >= 4
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-4 scale-98 pointer-events-none'
              }`}
          >
            <HeroAuctionCard
              initialPlate={initialPlate}
              allLivePlates={allLivePlates}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
