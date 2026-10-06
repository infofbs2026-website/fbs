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
  // Staged entrance animation state: 0 to 6
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 50),
      setTimeout(() => setStage(2), 180),
      setTimeout(() => setStage(3), 320),
      setTimeout(() => setStage(4), 480),
      setTimeout(() => setStage(5), 620),
      setTimeout(() => setStage(6), 780),
    ];

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <section className="relative w-full min-h-[100dvh] lg:min-h-screen flex flex-col justify-between pt-28 sm:pt-36 pb-10 sm:pb-14 text-white overflow-hidden bg-[#060a14] border-b border-gold/30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]">
      {/* Background Image Layer: Video poster with delicate subtle overlay */}
      <div
        className="absolute inset-0 z-0 overflow-hidden bg-[#060a14] bg-cover bg-center select-none pointer-events-none"
        style={{ backgroundImage: 'url(/videos/fbs-hero-poster.webp)' }}
      >
        {/* Very Subtle Contrast Veil */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060a14]/50 via-[#060a14]/30 to-[#060a14]/65 pointer-events-none" />

        {/* Minimal 1px Golden Horizon Line at the bottom border */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent pointer-events-none" />
      </div>

      {/* Central Hero Content */}
      <div className="container-fbs relative z-10 my-auto py-6 sm:py-8 text-center max-w-5xl mx-auto space-y-6 sm:space-y-7">
        
        {/* Stage 1: Sovereign Eyebrow Badge */}
        <div
          className={`transition-all duration-700 ease-out transform ${
            stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-gold/45 bg-[#0b1426]/85 px-6 py-2.5 text-xs sm:text-sm font-black text-gold-light backdrop-blur-xl shadow-[0_4px_24px_rgba(217,184,127,0.18)]">
            <SaudiCrestSvg className="w-5 h-5 text-gold shrink-0 drop-shadow-[0_0_8px_rgba(217,184,127,0.4)]" />
            <span>فارس بن سعود للوحات المميزة • الصرح السعودي الرائد</span>
          </div>
        </div>

        {/* Stage 2: Majestic Hero Headline (Strictly 2 Lines: Line 1 White, Line 2 Gold) */}
        <div
          className={`transition-all duration-700 ease-out transform ${
            stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
          }`}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-black tracking-tight leading-snug sm:leading-tight max-w-5xl mx-auto">
            <span className="block text-white mb-1.5 sm:mb-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
              حيث تلتقي الندرة بالهيبة..
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#fff3db] via-[#e2bd78] to-[#be903e] drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
              وسادتنا في عالم اللوحات السعودية الاستثنائية
            </span>
          </h1>
        </div>

        {/* Stage 3: Enlarged Subtitle Paragraph */}
        <div
          className={`transition-all duration-700 ease-out transform ${
            stage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
          }`}
        >
          <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl lg:text-[21px] leading-[1.8] sm:leading-[1.85] text-slate-100 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            تأسست منصة فارس بن سعود لتكون دار المزادات والوساطة الأولى بالمملكة المتخصصة في أندر لوحات المركبات الملكية والأحادية، مدعومة بحسابات مصرفية ضامنة وبنية تقنية فائقة تحمي حقوق النخبة وتصنع معياراً جديداً للثقة.
          </p>
        </div>

        {/* Stage 4: Quick Action CTA Buttons */}
        <div
          className={`pt-2 flex flex-wrap items-center justify-center gap-4 transition-all duration-700 ease-out transform ${
            stage >= 4 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
          }`}
        >
          <Link
            href="/auctions"
            className="btn btn-gold py-3.5 px-8 text-sm font-black shadow-[0_8px_30px_rgba(217,184,127,0.35)] hover:shadow-[0_8px_35px_rgba(217,184,127,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Gavel size={18} />
            <span>استكشف المزادات الحية</span>
          </Link>
          <Link
            href="/sell-your-plate"
            className="btn border border-gold/40 bg-[#0e172a]/70 text-slate-100 hover:text-white hover:bg-gold/15 hover:border-gold py-3.5 px-8 text-sm font-black backdrop-blur-md shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Award size={18} className="text-gold-light" />
            <span>اعرض لوحتك النادرة</span>
          </Link>
        </div>

        {/* Stage 5: Key Metric Highlights: Cascading Staggered Frosted Glass Cards */}
        <div
          className={`pt-6 sm:pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-5 transition-all duration-700 ease-out transform ${
            stage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
          }`}
        >
          <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 backdrop-blur-xl transition-all duration-300 hover:border-gold/50 hover:bg-gold/[0.07] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.45)]">
            <span className="font-norwester text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#fff6e0] via-[#d9b87f] to-[#b38838] tracking-tight block">
              +10,000
            </span>
            <p className="mt-1.5 text-xs sm:text-sm text-white font-bold">مقتنٍ ومستثمر معتمد</p>
            <span className="text-[11px] text-slate-400 block mt-0.5">قاعدة نخبوية حصرية</span>
          </div>

          <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 backdrop-blur-xl transition-all duration-300 hover:border-gold/50 hover:bg-gold/[0.07] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.45)]">
            <span className="font-norwester text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#fff6e0] via-[#d9b87f] to-[#b38838] tracking-tight block">
              100%
            </span>
            <p className="mt-1.5 text-xs sm:text-sm text-white font-bold">حماية بنكية ضامنة</p>
            <span className="text-[11px] text-slate-400 block mt-0.5">نظام Escrow المعتمد</span>
          </div>

          <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 backdrop-blur-xl transition-all duration-300 hover:border-gold/50 hover:bg-gold/[0.07] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.45)]">
            <span className="font-norwester text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#fff6e0] via-[#d9b87f] to-[#b38838] tracking-tight block">
              &lt; 24h
            </span>
            <p className="mt-1.5 text-xs sm:text-sm text-white font-bold">متوسط دورة الفحص</p>
            <span className="text-[11px] text-slate-400 block mt-0.5">مطابقة رخصة السير والمرور</span>
          </div>

          <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 backdrop-blur-xl transition-all duration-300 hover:border-gold/50 hover:bg-gold/[0.07] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.45)]">
            <span className="font-norwester text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#fff6e0] via-[#d9b87f] to-[#b38838] tracking-tight block">
              0%
            </span>
            <p className="mt-1.5 text-xs sm:text-sm text-white font-bold">مخاطر على التأمين</p>
            <span className="text-[11px] text-slate-400 block mt-0.5">استرداد فوري لغير الفائزين</span>
          </div>
        </div>
      </div>

      {/* Stage 6: Scroll Indicator at Bottom Center */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center text-slate-400 text-xs gap-1.5 transition-all duration-700 ease-out transform pb-2 ${
          stage >= 6 ? 'opacity-80 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <span className="font-medium tracking-wide">استكشف تفاصيل المنصة</span>
        <ArrowDown size={14} className="animate-bounce text-gold" />
      </div>
    </section>
  );
}
