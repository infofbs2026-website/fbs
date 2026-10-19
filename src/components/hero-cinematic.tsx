'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Gavel,
  ArrowLeft,
  ArrowUpLeft,
  Search,
  X
} from 'lucide-react';
import { HeroAuctionCard } from '@/components/hero-auction-card';
import type { MarketplacePlate } from '@/modules/marketplace/types';

function SvgRoyalCrownCrest({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Royal Crown Arch Base */}
      <path
        d="M3 18h18c-.8-2-2-3-4-3H7c-2 0-3.2 1-4 3z"
        fill="currentColor"
        fillOpacity="0.25"
      />
      <path
        d="M4 17.5h16M5 19.5h14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Crown Peaks & Diadem Jewels */}
      <path
        d="M4.5 16.5L3 8.5l5 4 4-7.5 4 7.5 5-4-1.5 8H4.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <circle cx="3" cy="8" r="1.3" fill="currentColor" />
      <circle cx="12" cy="4.5" r="1.5" fill="currentColor" />
      <circle cx="21" cy="8" r="1.3" fill="currentColor" />
      <circle cx="12" cy="12.5" r="1" fill="currentColor" />
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
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Staged Choreographed Sequence:
  // stage 0: Video playing (0ms - 1800ms)
  // stage 1: Eyebrow badge floats in (1800ms)
  // stage 2: Headline & Subtitle fade in (2150ms)
  // stage 3: Action Buttons & Quick Search Bar appear (2550ms)
  // stage 4: Auction Card glides in from side (2950ms)
  const [stage, setStage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

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
      video.play().catch(() => {});
    }
  }, []);

  // Choreographed Staggered Timers
  useEffect(() => {
    const t1 = setTimeout(() => {
      setStage((prev) => (prev < 1 ? 1 : prev));
      if (typeof window !== 'undefined') {
        (window as unknown as { __fbsHeroRevealed: boolean }).__fbsHeroRevealed = true;
        window.dispatchEvent(new CustomEvent('fbs-hero-revealed'));
      }
    }, 1800);

    const t2 = setTimeout(() => {
      setStage((prev) => (prev < 2 ? 2 : prev));
    }, 2150);

    const t3 = setTimeout(() => {
      setStage((prev) => (prev < 3 ? 3 : prev));
    }, 2550);

    const t4 = setTimeout(() => {
      setStage(4);
    }, 2950);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    router.push(q ? `/plates/search?q=${encodeURIComponent(q)}` : '/plates/search');
  };

  return (
    <div className="relative w-full bg-[#060a14] overflow-hidden">
      {/* ============================================================== */}
      {/* 1. HERO SECTION: FULL-BLEED CINEMATIC 1080p BACKGROUND VIDEO    */}
      {/* ============================================================== */}
      <section className="relative w-full min-h-[100dvh] flex flex-col justify-center items-center pt-24 pb-14 sm:pt-28 sm:pb-20 lg:py-24 text-white overflow-hidden bg-[#060a14]">
        
        {/* Background Video Layer: 100% full bleed, edge-to-edge */}
        <div
          className="absolute inset-0 z-0 overflow-hidden bg-[#060a14] bg-cover bg-center select-none pointer-events-none"
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
            className="hero-video-cover pointer-events-none select-none scale-[1.01]"
          >
            <source src="/videos/fbs-hero-realistic-no-text.webm" type="video/webm" />
            <source src="/videos/fbs-hero-realistic-no-text.mp4" type="video/mp4" />
          </video>

          {/* Minimal 1px Golden Horizon Line at bottom border */}
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent pointer-events-none" />
        </div>

        {/* ============================================================== */}
        {/* 2. CINEMATIC INTRO TIMELINE                                    */}
        {/* ============================================================== */}
        {!isFullyRevealed && (
          <div className="fixed top-0 inset-x-0 h-[2.5px] bg-black/30 z-[60] pointer-events-none">
            <div
              className="h-full bg-gradient-to-r from-gold via-gold-light to-gold shadow-[0_0_12px_#d9b87f]"
              style={{
                animation: 'introProgress 2950ms linear forwards'
              }}
            />
          </div>
        )}

        {/* ============================================================== */}
        {/* 3. HERO CONTENT GRID: Vertically & Horizontally Aligned       */}
        {/* ============================================================== */}
        <div className="container-fbs relative z-10 hero-grid-layout my-auto lg:items-stretch">
          
          {/* Right Column (RTL start): Headline, Subtitle, CTAs, Search Bar */}
          <div className="flex flex-col justify-between min-w-0 w-full h-full py-0.5">
            <div>
              {/* STAGE 1: Eyebrow Badge (Card top aligns with this) */}
              <div
                className={`flex justify-center sm:justify-start transition-all duration-700 ease-out w-full ${
                  stage >= 1
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-4 pointer-events-none'
                }`}
              >
                <div className="inline-flex items-center gap-1.5 sm:gap-2.5 rounded-xl sm:rounded-2xl border border-gold/45 bg-gradient-to-r from-gold/15 via-[#091124]/90 to-gold/10 px-3 py-1.5 sm:px-5 sm:py-2 text-[10.5px] xs:text-[11px] sm:text-sm font-bold text-gold-light backdrop-blur-2xl shadow-[0_4px_20px_rgba(217,184,127,0.18)] ring-1 ring-gold/25 hover:border-gold/60 transition-all duration-300 text-center max-w-full">
                  <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-lg bg-gold/20 border border-gold/50 text-gold shrink-0 shadow-[0_0_10px_rgba(217,184,127,0.35)]">
                    <SvgRoyalCrownCrest className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold-light" />
                  </span>
                  <span className="tracking-normal sm:tracking-wide text-gold-light">المزاد الرسمي الأول للوحات النخبة في المملكة العربية السعودية</span>
                </div>
              </div>

              {/* STAGE 2: Commanding Luxury Headline & Punchy Single-line Subtitle */}
              <div
                className={`transition-all duration-700 ease-out delay-75 w-full ${
                  stage >= 2
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6 pointer-events-none'
                }`}
              >
                <h1 className="mt-4 sm:mt-5 max-w-2xl text-4xl sm:text-5xl lg:text-[3.9rem] xl:text-[4.5rem] font-black leading-[1.08] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] text-center sm:text-start mx-auto sm:mx-0 w-full">
                  لوحتك الاستثنائية
                  <br />
                  <span className="gold-gradient-text drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]">تبدأ من هنا.</span>
                </h1>
              </div>

              <div
                className={`transition-all duration-700 ease-out delay-150 w-full ${
                  stage >= 2
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6 pointer-events-none'
                }`}
              >
                {/* Single-line punchy subtitle spanning the full width */}
                <div className="relative mt-2.5 sm:mt-4 w-full max-w-[660px] mx-auto sm:mx-0 text-center sm:text-start">
                  <div
                    className="absolute inset-0 -inset-y-2 rounded-2xl bg-[#040814]/40 blur-md pointer-events-none"
                    aria-hidden="true"
                  />
                  <p
                    className="relative text-xs sm:text-base lg:text-[16.5px] font-medium text-slate-200 leading-relaxed"
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

            {/* STAGE 3: Action Buttons & Streamlined Search Bar (Card bottom aligns with Search Bar) */}
            <div
              className={`transition-all duration-700 ease-out w-full mt-3.5 sm:mt-6 lg:mt-auto pt-1 sm:pt-4 ${
                stage >= 3
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-6 pointer-events-none'
              }`}
            >
              {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 max-w-[660px] mx-auto sm:mx-0 w-full">
                <Link
                  href="/auctions"
                  className="group btn btn-gold text-sm sm:text-base font-black h-12 sm:h-[50px] flex-1 justify-center gap-2.5 shadow-2xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(217,184,127,0.5)] hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap px-6 w-full sm:w-auto"
                >
                  <Gavel className="w-5 h-5 text-navy shrink-0 transition-transform duration-300 group-hover:-rotate-12" />
                  <span className="whitespace-nowrap">استكشف المزادات الحية</span>
                  <ArrowLeft className="w-4 h-4 text-navy/80 shrink-0 transition-transform duration-300 group-hover:-translate-x-1" />
                </Link>
                <Link
                  href="/sell-your-plate"
                  className="group btn btn-outline-gold text-sm sm:text-base font-black h-12 sm:h-[50px] flex-1 justify-center gap-2.5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-gold/55 bg-[#0a1224]/85 text-white hover:border-gold hover:bg-gold/20 whitespace-nowrap px-6 shadow-xl w-full sm:w-auto"
                >
                  <SvgPlatePlus className="w-5 h-5 text-gold shrink-0 transition-transform duration-300 group-hover:scale-110" />
                  <span className="whitespace-nowrap">اعرض لوحتك الآن</span>
                  <ArrowUpLeft className="w-4 h-4 text-gold/80 shrink-0 transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>

              {/* Streamlined Quick Search Bar: Positioned below buttons, max-w-[660px] */}
              <form
                onSubmit={handleSearchSubmit}
                className="mt-3.5 sm:mt-4 w-full max-w-[660px] mx-auto sm:mx-0"
              >
                <div className="relative flex items-center rounded-xl sm:rounded-2xl border border-gold/40 bg-gradient-to-b from-[#111c33]/90 via-[#0b1324]/90 to-[#070d1a]/95 p-1.5 sm:p-2 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.18)] transition-all focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/30">
                  <div className="ps-3 pe-2 text-gold flex items-center justify-center shrink-0">
                    <Search size={18} className="text-gold" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث برقم أو حرف..."
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-white placeholder:text-slate-400 focus:outline-none px-2 h-10 sm:h-11"
                    aria-label="ابحث برقم أو حرف"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-1 text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer me-1"
                      aria-label="مسح النص"
                    >
                      <X size={15} />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="btn btn-gold h-10 sm:h-11 px-4 sm:px-6 rounded-lg sm:rounded-xl flex items-center gap-1.5 text-xs sm:text-sm font-black text-navy shrink-0 shadow-md shadow-gold/25 hover:shadow-gold/40 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>ابحث الآن</span>
                    <ArrowLeft size={15} className="text-navy" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* STAGE 4: Interactive Live Auction Card (Glides in from the side, full height matching right column) */}
          <div
            className={`relative flex items-stretch justify-center lg:justify-end transition-all duration-800 ease-out min-w-0 w-full h-full ${
              stage >= 4
                ? 'opacity-100 translate-x-0 scale-100'
                : 'opacity-0 lg:-translate-x-8 translate-y-4 scale-95 pointer-events-none'
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
