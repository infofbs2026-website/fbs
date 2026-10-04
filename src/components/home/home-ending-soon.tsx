'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { PlateCard } from '@/components/ui';
import type { MarketplacePlate } from '@/modules/marketplace/types';
import { ScrollReveal } from '@/components/home-motion';

interface HomeEndingSoonProps {
  endingSoonAuctions: MarketplacePlate[];
}

export function HomeEndingSoon({ endingSoonAuctions }: HomeEndingSoonProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // If there are fewer than 4 plates, duplicate or provide enough slides for a rich carousel feel
  const plates = endingSoonAuctions && endingSoonAuctions.length > 0 ? endingSoonAuctions : [];

  const updateScrollState = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    // In RTL, scrollLeft can be negative or positive depending on browser implementation
    const maxScroll = scrollWidth - clientWidth;
    const currentScroll = Math.abs(scrollLeft);

    setCanScrollRight(currentScroll < maxScroll - 10);
    setCanScrollLeft(currentScroll > 10);

    // Calculate approximate active card index
    const cardWidth = 360;
    const index = Math.round(currentScroll / cardWidth);
    setActiveIndex(Math.min(Math.max(index, 0), plates.length - 1));
  }, [plates.length]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  // Smooth slide function (RTL aware)
  const slide = useCallback((direction: 'next' | 'prev') => {
    const el = scrollContainerRef.current;
    if (!el) return;

    // In RTL, moving forward ("next") scrolls further towards the start or end
    // el.scrollBy with positive/negative depending on document direction
    const isRtl = document.dir === 'rtl' || document.documentElement.dir === 'rtl';
    const scrollAmount = 370; // width of one card + gap
    
    // In RTL, scrolling "next" is visually towards the left (negative scrollLeft in modern browsers)
    const delta = direction === 'next' ? (isRtl ? -scrollAmount : scrollAmount) : (isRtl ? scrollAmount : -scrollAmount);

    el.scrollBy({ left: delta, behavior: 'smooth' });
  }, []);

  // Subtle auto-advance ticker when not hovered
  useEffect(() => {
    if (isPaused || plates.length <= 1) return;

    const interval = setInterval(() => {
      const el = scrollContainerRef.current;
      if (!el) return;

      const { scrollLeft, scrollWidth, clientWidth } = el;
      const maxScroll = scrollWidth - clientWidth;
      const isAtEnd = Math.abs(scrollLeft) >= maxScroll - 20;

      if (isAtEnd) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        slide('next');
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, plates.length, slide]);

  if (plates.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden border-y border-gold/30 bg-gradient-to-b from-[#070d18] via-[#0c162c] to-[#070d18] py-20 sm:py-26 text-white select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Ambient Subtle Procedural Glows & Aerospace Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Top & Bottom Accent Golden Beams */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        {/* Ambient Radial Lights */}
        <div className="absolute -top-32 start-1/4 h-[550px] w-[750px] rounded-full bg-gradient-to-br from-amber-500/10 via-gold/15 to-transparent blur-[140px]" />
        <div className="absolute -bottom-32 end-1/4 h-[500px] w-[700px] rounded-full bg-gradient-to-tl from-blue-700/15 via-gold/10 to-transparent blur-[130px]" />

        {/* Aerospace Fine Dot Grid */}
        <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#d9b87f_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div className="container-fbs relative z-10">
        <ScrollReveal direction="up" delay={40}>
          <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              {/* Prestige Dark Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gradient-to-r from-gold/25 via-gold/15 to-amber-500/15 px-4.5 py-1.5 text-xs sm:text-sm font-black text-gold-light backdrop-blur-md shadow-[0_0_20px_rgba(217,184,127,0.25)] mb-3.5">
                <Clock size={16} className="text-gold shrink-0 animate-pulse" />
                <span className="tracking-wide">فرص اللحظات الأخيرة · مزادات مرتقبة</span>
              </div>

              {/* Commanding Luxury Headline - Crisp High-Contrast White */}
              <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-[2.65rem] leading-tight">
                مزادات تنتهي قريباً والفرص المرتقبة
              </h2>

              <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-300 font-medium">
                اغتنم فرصة المزايدة قبل إغلاق الجلسة أو جهز تفويضك البنكي للمزادات الحصرية القادمة في جولة استثنائية.
              </p>
            </div>

            {/* Header Action & Carousel Controls */}
            <div className="flex items-center gap-3 self-start lg:self-end">
              {/* Carousel Arrow Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => slide('prev')}
                  aria-label="السابق"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gold/40 bg-[#0d1830]/90 text-gold-light backdrop-blur-md transition-all duration-300 hover:border-gold hover:bg-gold hover:text-navy hover:scale-105 active:scale-95 shadow-md shadow-black/40"
                >
                  <ChevronRight size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => slide('next')}
                  aria-label="التالي"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gold/40 bg-[#0d1830]/90 text-gold-light backdrop-blur-md transition-all duration-300 hover:border-gold hover:bg-gold hover:text-navy hover:scale-105 active:scale-95 shadow-md shadow-black/40"
                >
                  <ChevronLeft size={20} />
                </button>
              </div>

              {/* View All Auctions Button */}
              <Link
                href="/auctions"
                className="group inline-flex items-center gap-2.5 rounded-2xl border border-gold/45 bg-[#0f1d38]/90 px-5 py-3 text-xs sm:text-sm font-black text-slate-100 shadow-md backdrop-blur-md transition-all duration-300 hover:border-gold hover:bg-gold/20 hover:text-gold-light hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>جدول المزادات الكامل</span>
                <ArrowLeft size={15} className="text-gold transition-transform group-hover:-translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Upcoming Market Indicators Dark Glass Micro-bar */}
          <div className="mb-8 flex flex-wrap items-center gap-3 text-xs font-bold">
            <div className="inline-flex items-center gap-2 rounded-xl bg-[#0e1932]/85 border border-gold/30 px-3.5 py-1.5 backdrop-blur-md shadow-sm">
              <Clock size={14} className="text-amber-400" />
              <span className="text-slate-200">إغلاق وشيك للجلسات</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl bg-[#0e1932]/85 border border-gold/30 px-3.5 py-1.5 backdrop-blur-md shadow-sm">
              <ShieldCheck size={14} className="text-gold" />
              <span className="text-slate-200">تفويض بنكي معتمد</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl bg-[#0e1932]/85 border border-gold/30 px-3.5 py-1.5 backdrop-blur-md shadow-sm">
              <BadgeCheck size={14} className="text-gold" />
              <span className="text-slate-200">لوحات نخبة مؤكدة النشر</span>
            </div>
            <div className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-slate-400 font-medium ms-auto">
              <Sparkles size={12} className="text-gold" />
              <span>اسحب أو استخدم الأسهم للتنقل</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Dynamic Carousel Slide Track */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none cursor-grab active:cursor-grabbing -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {plates.map((plate, idx) => (
            <div
              key={plate.id || idx}
              className="shrink-0 snap-start w-[310px] sm:w-[350px] lg:w-[370px] transition-transform duration-300 hover:scale-[1.02]"
            >
              <div className="rounded-3xl p-1 bg-gradient-to-b from-gold/35 via-white/10 to-transparent shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
                <PlateCard plate={plate} />
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Progress Indicators / Dots */}
        {plates.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {plates.slice(0, Math.min(plates.length, 8)).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  const el = scrollContainerRef.current;
                  if (!el) return;
                  const isRtl = document.dir === 'rtl' || document.documentElement.dir === 'rtl';
                  const targetScroll = i * 370;
                  el.scrollTo({ left: isRtl ? -targetScroll : targetScroll, behavior: 'smooth' });
                }}
                aria-label={`الشريحة ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === i
                    ? 'w-8 bg-gradient-to-r from-gold via-gold-light to-gold shadow-[0_0_10px_rgba(217,184,127,0.7)]'
                    : 'w-2 bg-white/25 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
