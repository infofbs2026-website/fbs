'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Gavel,
  ArrowLeft,
  ArrowUpLeft,
  ShieldCheck,
  Landmark
} from 'lucide-react';
import { HeroAuctionCard } from '@/components/hero-auction-card';
import { HeroSearchBar } from '@/components/hero-search-bar';
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
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Staged Choreographed Sequence:
  // stage 0: Pure video, all elements hidden (0ms - 1800ms)
  // stage 1: Header revealed (transparent) & Eyebrow Badge floats in (1800ms)
  // stage 2: Commanding Headline & Subtitle fade & rise (2100ms)
  // stage 3: CTAs & Trust Badges appear (2500ms)
  // stage 4: Interactive Live Auction Card glides in from side (2900ms)
  // stage 5: Concierge Search Bar docks smoothly at the bottom (3400ms)
  const [stage, setStage] = useState(0);

  // Instantly reveal all elements (for Skip or Scroll)
  const skipToRevealed = useCallback(() => {
    setStage(5);
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
      video.playbackRate = 1.15; // Crisp, faster pace
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
      setStage((prev) => (prev < 4 ? 4 : prev));
    }, 2950);

    const t5 = setTimeout(() => {
      setStage(5);
    }, 3400);

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
      clearTimeout(t5);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [skipToRevealed]);

  const isFullyRevealed = stage >= 5;

  return (
    <div className="relative w-full bg-[#060a14] overflow-hidden">
      {/* ============================================================== */}
      {/* 1. HERO SECTION: FULL-BLEED CINEMATIC 1080p BACKGROUND VIDEO    */}
      {/* ============================================================== */}
      <section className="relative w-full min-h-[100dvh] lg:min-h-screen flex flex-col justify-between pt-24 sm:pt-28 pb-4 sm:pb-6 text-white overflow-hidden bg-[#060a14]">
        
        {/* Background Video Layer: 100% full bleed, edge-to-edge, ZERO overlays with instant static poster */}
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

          {/* Minimal 1px Golden Horizon Line at the very bottom border */}
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent pointer-events-none" />
        </div>

        {/* ============================================================== */}
        {/* 2. CINEMATIC INTRO TIMELINE (Top subtle gold shimmer indicator)*/}
        {/* ============================================================== */}
        {!isFullyRevealed && (
          <div className="fixed top-0 inset-x-0 h-[2.5px] bg-black/30 z-[60] pointer-events-none">
            <div
              className="h-full bg-gradient-to-r from-gold via-gold-light to-gold shadow-[0_0_12px_#d9b87f]"
              style={{
                animation: 'introProgress 3400ms linear forwards'
              }}
            />
          </div>
        )}

        {/* ============================================================== */}
        {/* 3. HERO CONTENT GRID: Staggered, Distinct & Gentle Reveal       */}
        {/* ============================================================== */}
        {/* 3. HERO CONTENT GRID: Staggered, Distinct & Gentle Reveal       */}
        {/* ============================================================== */}
        <div className="container-fbs relative z-10 hero-grid-layout my-auto py-2 sm:py-4">
          
          {/* Right Column (RTL start): Headline, Subtitle, CTAs, Badges - Balanced Height */}
          <div className="flex flex-col justify-between py-1 lg:py-2 min-h-full">
            <div>
              {/* STAGE 1: Eyebrow Badge with Rounded-xl/2xl Corners matching the buttons and search bar */}
              <div
                className={`transition-all duration-700 ease-out ${
                  stage >= 1
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-4 pointer-events-none'
                }`}
              >
                <div className="inline-flex items-center gap-2.5 rounded-xl sm:rounded-2xl border border-gold/45 bg-gradient-to-r from-gold/15 via-[#091124]/90 to-gold/10 px-4 py-2.5 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-gold-light backdrop-blur-2xl shadow-[0_4px_20px_rgba(217,184,127,0.18)] ring-1 ring-gold/25 hover:border-gold/60 transition-all duration-300">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold/20 border border-gold/50 text-gold shrink-0 shadow-[0_0_10px_rgba(217,184,127,0.35)]">
                    <SvgRoyalCrownCrest className="w-4 h-4 text-gold-light" />
                  </span>
                  <span className="tracking-wide text-gold-light">المزاد الرسمي الأول للوحات النخبة في المملكة العربية السعودية</span>
                </div>
              </div>

              {/* STAGE 2: Commanding Luxury Headline & Subtitle (Even Larger & Grand) */}
              <div
                className={`transition-all duration-700 ease-out delay-75 ${
                  stage >= 2
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6 pointer-events-none'
                }`}
              >
                <h1 className="mt-6 sm:mt-7 max-w-2xl text-4xl sm:text-5xl lg:text-[4.15rem] xl:text-[4.75rem] font-black leading-[1.08] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                  لوحتك الاستثنائية
                  <br />
                  <span className="gold-gradient-text drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]">تبدأ من هنا.</span>
                </h1>
              </div>

              <div
                className={`transition-all duration-700 ease-out delay-150 ${
                  stage >= 2
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6 pointer-events-none'
                }`}
              >
                {/* Paragraph spanning the full max-w-[660px] width of the buttons below */}
                <div className="relative mt-5 sm:mt-6 w-full max-w-[660px]">
                  {/* Soft feathered dark diffusion strictly behind the text area - No borders, no hard edges */}
                  <div
                    className="absolute -inset-2 rounded-2xl bg-[#040814]/40 blur-md pointer-events-none"
                    aria-hidden="true"
                  />
                  <p
                    className="relative text-sm leading-relaxed text-slate-100 sm:text-base lg:text-[17px] xl:text-[17.5px] lg:leading-relaxed font-medium"
                    style={{
                      textShadow:
                        '0 1px 3px rgba(0, 0, 0, 0.95), 0 3px 10px rgba(0, 0, 0, 0.9), 0 6px 20px rgba(0, 0, 0, 0.85)'
                    }}
                  >
                    وجهتك المتخصصة لامتلاك وعرض أندر لوحات المركبات السعودية. ننظم المزادات المباشرة بتوثيق معتمد
                    للملكية، وتسوية مالية موثوقة تضمن حقوق الطرفين.
                  </p>
                </div>
              </div>
            </div>

            {/* STAGE 3: CTAs Action Buttons & 3 Equal Trust Cards (Floats in third) */}
            <div
              className={`transition-all duration-700 ease-out ${
                stage >= 3
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-6 pointer-events-none'
              }`}
            >
              {/* Action Buttons Row with max-w-[660px] */}
              <div className="mt-8 sm:mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 max-w-[660px]">
                <Link
                  href="/auctions"
                  className="group btn btn-gold text-sm sm:text-base font-black h-13 sm:h-[54px] flex-1 justify-center gap-2.5 shadow-2xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(217,184,127,0.5)] hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap px-6"
                >
                  <Gavel className="w-5 h-5 text-navy shrink-0 transition-transform duration-300 group-hover:-rotate-12" />
                  <span className="whitespace-nowrap">استكشف المزادات الحية</span>
                  <ArrowLeft className="w-4 h-4 text-navy/80 shrink-0 transition-transform duration-300 group-hover:-translate-x-1" />
                </Link>
                <Link
                  href="/sell-your-plate"
                  className="group btn btn-outline-gold text-sm sm:text-base font-black h-13 sm:h-[54px] flex-1 justify-center gap-2.5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-gold/55 bg-[#0a1224]/85 text-white hover:border-gold hover:bg-gold/20 whitespace-nowrap px-6 shadow-xl"
                >
                  <SvgPlatePlus className="w-5 h-5 text-gold shrink-0 transition-transform duration-300 group-hover:scale-110" />
                  <span className="whitespace-nowrap">اعرض لوحتك الآن</span>
                  <ArrowUpLeft className="w-4 h-4 text-gold/80 shrink-0 transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>

              {/* 3 Widened Trust Cards with Soft Visible Borders and Ample Horizontal Space */}
              <div className="mt-7 sm:mt-8 border-t border-white/15 pt-6 max-w-[660px]">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full">
                  {/* Card 1: توثيق وفحص الملكية 100% */}
                  <div className="flex h-13 sm:h-[54px] items-center gap-2.5 rounded-xl border border-gold/40 hover:border-gold/70 bg-gradient-to-b from-[#111c33]/90 via-[#0b1324]/90 to-[#070d1a]/95 px-3 sm:px-3.5 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.18)] transition-all">
                    <span className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg bg-gold/20 text-gold border border-gold/50 shadow-xs">
                      <ShieldCheck size={16} />
                    </span>
                    <span className="font-bold text-slate-100 text-xs sm:text-[11.5px] xl:text-xs leading-none whitespace-nowrap">
                      توثيق وفحص الملكية 100%
                    </span>
                  </div>

                  {/* Card 2: مزايدة آنية ونظامية */}
                  <div className="flex h-13 sm:h-[54px] items-center gap-2.5 rounded-xl border border-gold/40 hover:border-gold/70 bg-gradient-to-b from-[#111c33]/90 via-[#0b1324]/90 to-[#070d1a]/95 px-3 sm:px-3.5 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.18)] transition-all">
                    <span className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg bg-gold/20 text-gold border border-gold/50 shadow-xs">
                      <Gavel size={16} />
                    </span>
                    <span className="font-bold text-slate-100 text-xs sm:text-[11.5px] xl:text-xs leading-none whitespace-nowrap">
                      مزايدة آنية ونظامية
                    </span>
                  </div>

                  {/* Card 3: حماية بنكية للتأمين */}
                  <div className="flex h-13 sm:h-[54px] items-center gap-2.5 rounded-xl border border-gold/40 hover:border-gold/70 bg-gradient-to-b from-[#111c33]/90 via-[#0b1324]/90 to-[#070d1a]/95 px-3 sm:px-3.5 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.18)] transition-all">
                    <span className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg bg-gold/20 text-gold border border-gold/50 shadow-xs">
                      <Landmark size={16} />
                    </span>
                    <span className="font-bold text-slate-100 text-xs sm:text-[11.5px] xl:text-xs leading-none whitespace-nowrap">
                      حماية بنكية للتأمين
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STAGE 4: Interactive Live Auction Card (Glides in fourth from the side) */}
          <div
            className={`relative flex items-center justify-center lg:justify-end transition-all duration-800 ease-out ${
              stage >= 4
                ? 'opacity-100 translate-x-0 scale-100'
                : 'opacity-0 -translate-x-8 scale-95 pointer-events-none'
            }`}
          >
            <HeroAuctionCard
              initialPlate={initialPlate}
              allLivePlates={allLivePlates}
            />
          </div>
        </div>

        {/* ============================================================== */}
        {/* STAGE 5: CONCIERGE SEARCH BAR (Docks smoothly last at bottom)  */}
        {/* ============================================================== */}
        <div
          className={`container-fbs relative z-30 pt-2 pb-2 mt-auto transition-all duration-800 ease-out ${
            stage >= 5
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8 pointer-events-none'
          }`}
        >
          <HeroSearchBar />
        </div>
      </section>
    </div>
  );
}
