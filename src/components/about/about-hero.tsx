'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Gavel, Award, ArrowDown } from 'lucide-react';

function SaudiCrestSvg({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M32 6C32 6 34.5 12 39 15C43.5 18 49 18 49 18C49 18 45.5 23 43.5 28C41.5 33 42 38 42 38C42 38 36.5 36.5 32 39C27.5 36.5 22 38 22 38C22 38 22.5 33 20.5 28C18.5 23 15 18 15 18C15 18 20.5 18 25 15C29.5 12 32 6 32 6Z"
        fill="currentColor"
        fillOpacity="0.16"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M32 14V34M32 18C28 16 25 18 24 21M32 18C36 16 39 18 40 21M32 23C27 22 24 24 23 27M32 23C37 22 40 24 41 27" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M18 46L46 46M20 42L44 50M20 50L44 42" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32" cy="46" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function AboutHero() {
  // Staged entrance animation state: 0 (pure clean background photo) to 7 (all hero elements revealed)
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 600),  // Stage 1: Master glass card appears after brief pure photo pause
      setTimeout(() => setStage(2), 900),  // Stage 2: Sovereign eyebrow badge floats down
      setTimeout(() => setStage(3), 1100), // Stage 3: Single-line majestic headline reveals
      setTimeout(() => setStage(4), 1300), // Stage 4: Subtitle paragraph fades in
      setTimeout(() => setStage(5), 1500), // Stage 5: Quick action CTA buttons glide in
      setTimeout(() => setStage(6), 1700), // Stage 6: Key metric highlight cards stagger in
      setTimeout(() => setStage(7), 1950), // Stage 7: Bottom scroll indicator reveals
    ];

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <section className="relative w-full min-h-[100dvh] lg:min-h-screen flex flex-col justify-between pt-28 sm:pt-36 pb-10 sm:pb-14 text-white overflow-hidden bg-[#060a14] border-b border-gold/30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]">
      {/* Background Image Layer: 100% Pure Video Poster with ZERO Overlays */}
      <div
        className="absolute inset-0 z-0 overflow-hidden bg-[#060a14] bg-cover bg-center select-none pointer-events-none"
        style={{ backgroundImage: 'url(/videos/fbs-hero-poster.webp)' }}
      >
        {/* Minimal 1px Golden Horizon Line at the bottom border */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent pointer-events-none" />
      </div>

      {/* Central Hero Master Glass Card Container */}
      <div className="container-fbs relative z-10 my-auto py-4 sm:py-6">
        {/* The Grand Master Glass Card itself reveals in Stage 1 */}
        <div
          className={`mx-auto max-w-4xl rounded-3xl sm:rounded-[28px] border border-gold/30 bg-gradient-to-b from-[#091122]/45 via-[#060b17]/55 to-[#0a1224]/45 p-5 sm:p-7 lg:p-8 text-center backdrop-blur-xl shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85),0_0_35px_rgba(217,184,127,0.1)] space-y-4 sm:space-y-5 relative overflow-hidden transition-all duration-700 ease-out transform ${
            stage >= 1
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-[0.96] translate-y-6 pointer-events-none'
          }`}
        >
          {/* Subtle Golden Horizon Accent at the top of the master card */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
          
          {/* Soft Ambient Gold Glow inside the master card */}
          <div className="pointer-events-none absolute -top-20 start-1/2 -translate-x-1/2 h-40 w-80 rounded-full bg-gold/10 blur-[70px]" />

          {/* Stage 2: Sovereign Eyebrow Badge */}
          <div
            className={`transition-all duration-700 ease-out transform ${
              stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
            }`}
          >
            <div className="inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-[#0b1426]/75 px-5 py-2 text-xs sm:text-sm font-black text-gold-light backdrop-blur-md shadow-sm">
              <SaudiCrestSvg className="w-4 h-4 sm:w-5 sm:h-5 text-gold shrink-0 drop-shadow-[0_0_8px_rgba(217,184,127,0.4)]" />
              <span>فارس بن سعود للوحات المميزة • الصرح السعودي الرائد</span>
            </div>
          </div>

          {/* Stage 3: Majestic Hero Headline (Strictly 1 Single Balanced Line) */}
          <div
            className={`transition-all duration-700 ease-out transform ${
              stage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
            }`}
          >
            <h1 className="text-lg sm:text-2xl md:text-[26px] lg:text-[29px] font-black tracking-tight leading-snug max-w-4xl mx-auto flex flex-wrap sm:flex-nowrap items-center justify-center gap-1.5 sm:gap-2.5">
              <span className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                حيث تلتقي الندرة بالهيبة..
              </span>
              <span className="text-gold/50 hidden sm:inline select-none">•</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fff3db] via-[#e2bd78] to-[#be903e] drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                وسادتنا في عالم اللوحات الاستثنائية
              </span>
            </h1>
          </div>

          {/* Stage 4: Subtitle Paragraph (Smaller Font, Exactly 2 Neat Organized Lines) */}
          <div
            className={`transition-all duration-700 ease-out transform ${
              stage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
            }`}
          >
            <p className="max-w-2xl sm:max-w-3xl mx-auto text-xs sm:text-sm lg:text-[14.5px] leading-relaxed text-slate-200 font-medium drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
              تأسست منصة فارس بن سعود لتكون دار المزادات والوساطة الأولى بالمملكة المتخصصة في أندر لوحات المركبات الملكية والأحادية،
              <span className="sm:block mt-0.5">مدعومة بحسابات مصرفية ضامنة وبنية تقنية فائقة تحمي حقوق النخبة وتصنع معياراً جديداً للثقة.</span>
            </p>
          </div>

          {/* Stage 5: Quick Action CTA Buttons */}
          <div
            className={`pt-0.5 flex flex-wrap items-center justify-center gap-3.5 transition-all duration-700 ease-out transform ${
              stage >= 5 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
            }`}
          >
            <Link
              href="/auctions"
              className="btn btn-gold py-3 px-7 text-xs sm:text-sm font-black shadow-[0_6px_25px_rgba(217,184,127,0.3)] hover:shadow-[0_6px_30px_rgba(217,184,127,0.45)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Gavel size={16} />
              <span>استكشف المزادات الحية</span>
            </Link>
            <Link
              href="/sell-your-plate"
              className="btn border border-gold/40 bg-[#0e172a]/75 text-slate-100 hover:text-white hover:bg-gold/15 hover:border-gold py-3 px-7 text-xs sm:text-sm font-black backdrop-blur-md shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Award size={16} className="text-gold-light" />
              <span>اعرض لوحتك النادرة</span>
            </Link>
          </div>

          {/* Stage 6: Key Metric Highlights: Cascading Staggered Frosted Glass Cards */}
          <div
            className={`pt-2 sm:pt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 transition-all duration-700 ease-out transform ${
              stage >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
            }`}
          >
            <div
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 backdrop-blur-xl transition-all duration-500 ease-out hover:border-gold/50 hover:bg-gold/[0.07] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.45)]"
              style={{ transitionDelay: stage >= 6 ? '50ms' : '0ms' }}
            >
              <span className="font-norwester text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#fff6e0] via-[#d9b87f] to-[#b38838] tracking-tight block">
                +10,000
              </span>
              <p className="mt-1.5 text-xs sm:text-sm text-white font-bold">مقتنٍ ومستثمر معتمد</p>
              <span className="text-[11px] text-slate-400 block mt-0.5">قاعدة نخبوية حصرية</span>
            </div>

            <div
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 backdrop-blur-xl transition-all duration-500 ease-out hover:border-gold/50 hover:bg-gold/[0.07] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.45)]"
              style={{ transitionDelay: stage >= 6 ? '150ms' : '0ms' }}
            >
              <span className="font-norwester text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#fff6e0] via-[#d9b87f] to-[#b38838] tracking-tight block">
                100%
              </span>
              <p className="mt-1.5 text-xs sm:text-sm text-white font-bold">حماية بنكية ضامنة</p>
              <span className="text-[11px] text-slate-400 block mt-0.5">نظام Escrow المعتمد</span>
            </div>

            <div
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 backdrop-blur-xl transition-all duration-500 ease-out hover:border-gold/50 hover:bg-gold/[0.07] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.45)]"
              style={{ transitionDelay: stage >= 6 ? '250ms' : '0ms' }}
            >
              <span className="font-norwester text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#fff6e0] via-[#d9b87f] to-[#b38838] tracking-tight block">
                &lt; 24h
              </span>
              <p className="mt-1.5 text-xs sm:text-sm text-white font-bold">متوسط دورة الفحص</p>
              <span className="text-[11px] text-slate-400 block mt-0.5">مطابقة رخصة السير والمرور</span>
            </div>

            <div
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 backdrop-blur-xl transition-all duration-500 ease-out hover:border-gold/50 hover:bg-gold/[0.07] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.45)]"
              style={{ transitionDelay: stage >= 6 ? '350ms' : '0ms' }}
            >
              <span className="font-norwester text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#fff6e0] via-[#d9b87f] to-[#b38838] tracking-tight block">
                0%
              </span>
              <p className="mt-1.5 text-xs sm:text-sm text-white font-bold">مخاطر على التأمين</p>
              <span className="text-[11px] text-slate-400 block mt-0.5">استرداد فوري لغير الفائزين</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stage 7: Scroll Indicator at Bottom Center */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center text-slate-400 text-xs gap-1.5 transition-all duration-700 ease-out transform pb-2 ${
          stage >= 7 ? 'opacity-80 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <span className="font-medium tracking-wide">استكشف تفاصيل المنصة</span>
        <ArrowDown size={14} className="animate-bounce text-gold" />
      </div>
    </section>
  );
}
