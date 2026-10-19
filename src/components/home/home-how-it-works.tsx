'use client';

import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, CreditCard, Gavel, ShieldCheck } from 'lucide-react';
import { ScrollReveal, StaggerGrid } from '@/components/home-motion';

/**
 * Bespoke Luxury Nautical Compass Rose SVG for Step 1
 */
function LuxuryCompassIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Outer Precision Bezel */}
      <circle cx="12" cy="12" r="9.5" strokeWidth="1.5" />
      {/* 4 Primary Directional Ticks */}
      <line x1="12" y1="2.5" x2="12" y2="4.5" strokeWidth="2" stroke="currentColor" />
      <line x1="12" y1="19.5" x2="12" y2="21.5" strokeWidth="2" stroke="currentColor" />
      <line x1="2.5" y1="12" x2="4.5" y2="12" strokeWidth="2" stroke="currentColor" />
      <line x1="19.5" y1="12" x2="21.5" y2="12" strokeWidth="2" stroke="currentColor" />
      {/* Faceted Nautical Compass Needle */}
      <polygon points="12,5.5 14.5,12 12,10.5 9.5,12" fill="currentColor" stroke="none" />
      <polygon points="12,18.5 9.5,12 12,13.5 14.5,12" fill="currentColor" opacity="0.4" stroke="none" />
      {/* Center Pivot Jewel */}
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

const steps = [
  {
    number: '01',
    stepLabel: 'الأولى',
    icon: LuxuryCompassIcon,
    shortTitle: 'اكتشاف اللوحة',
    title: 'اكتشف لوحتك النادرة',
    desc: 'ابحث بالحروف والأرقام أو تصفح مزادات النخبة النشطة لاختيار بصمتك الخاصة بأعلى معايير الشفافية.',
    badge: 'تصفح وفلترة ذكية',
    tag: 'نظامي معتمد'
  },
  {
    number: '02',
    stepLabel: 'الثانية',
    icon: CreditCard,
    shortTitle: 'حجز التأمين',
    title: 'التسجيل وتفويض التأمين',
    desc: 'سجّل في المزاد المطلوب واعتمد مبلغ التأمين البنكي بأمان كامل ومحمي دون استقطاع فوري من حسابك.',
    badge: 'حجز بنكي آمن (Hold)',
    tag: 'حماية مصرفية 100%'
  },
  {
    number: '03',
    stepLabel: 'الثالثة',
    icon: Gavel,
    shortTitle: 'المزايدة الذكية',
    title: 'زايد في الوقت الفعلي',
    desc: 'تابع المزايدة لحظة بلحظة مع حماية متطورة من القنص وتمديد تلقائي عادل يضمن تكافؤ الفرص لجميع الأطراف.',
    badge: 'تمديد ذكي ضد القنص',
    tag: 'تحديث لحظي مشفر'
  },
  {
    number: '04',
    stepLabel: 'الرابعة',
    icon: Award,
    shortTitle: 'نقل الملكية',
    title: 'التسوية ونقل الملكية',
    desc: 'بعد رسو المزاد، يُشرف فريقنا التنفيذي على إتمام كافة الإجراءات الرسمية ونقل الاستمارة فوراً باسم المشتري.',
    badge: 'نقل رسمي معتمد',
    tag: 'تسليم فوري ومضمون'
  }
];

export function HomeHowItWorks() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [autoStep, setAutoStep] = useState<number>(0);

  // Auto-cycle through steps when user is not actively hovering
  useEffect(() => {
    if (hoveredStep !== null) return;
    const interval = setInterval(() => {
      setAutoStep((prev) => (prev + 1) % steps.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [hoveredStep]);

  const activeIndex = hoveredStep !== null ? hoveredStep : autoStep;

  return (
    <section className="relative overflow-hidden border-t-2 border-gold/40 bg-gradient-to-b from-[#fcfbf8] via-[#f7f3ec] to-[#f0eade] py-20 sm:py-28">
      {/* Top Gold Horizon Edge */}
      <div className="absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-transparent via-gold to-transparent shadow-[0_0_20px_rgba(217,184,127,0.7)] pointer-events-none" />

      {/* Ambient Warm Architectural Geometry & Soft Lighting */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 start-1/2 -translate-x-1/2 h-[520px] w-[900px] rounded-full bg-gradient-to-b from-gold/25 via-gold/8 to-transparent blur-[140px]" />
        <div className="absolute -bottom-32 end-1/4 h-[420px] w-[650px] rounded-full bg-blue-900/5 blur-[130px]" />

        {/* Luxury Gold Micro-dot Grid Matrix */}
        <div
          className="absolute inset-0 opacity-[0.065]"
          style={{
            backgroundImage: 'radial-gradient(#d9b87f 1.2px, transparent 1.2px)',
            backgroundSize: '32px 32px'
          }}
        />

        {/* Dynamic Architectural Accent Curves */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.06]"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1440 800"
        >
          <path d="M-100 250 C 400 450, 950 150, 1540 380" fill="none" stroke="#d9b87f" strokeWidth="1.5" />
          <path
            d="M-100 350 C 500 550, 1050 250, 1540 460"
            fill="none"
            stroke="#d9b87f"
            strokeWidth="1"
            strokeDasharray="6 8"
          />
        </svg>
      </div>

      <div className="container-fbs relative z-10">
        {/* Section Header */}
        <ScrollReveal direction="up" className="mb-14 sm:mb-16 text-center">
          {/* Prestige Eyebrow Badge - With Generous Height & Breathing Room */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-gold/50 bg-[#0a1324] px-7 py-3 text-xs sm:text-sm font-black text-gold shadow-[0_4px_18px_rgba(26,37,65,0.14)] mb-4 backdrop-blur-md">
            <ShieldCheck size={18} className="text-gold shrink-0" />
            <span className="tracking-wide">رحلة واضحة ومحمية · من المزايدة حتى نقل الملكية</span>
          </div>

          {/* Commanding Title with High-Contrast Typography */}
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-[2.75rem] text-[#091122] leading-tight">
            <span>كيف تعمل</span>{' '}
            <span className="bg-gradient-to-r from-[#8a5d1b] via-[#c6943f] to-[#8a5d1b] bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
              منصة FBS للمزادات؟
            </span>
          </h2>
          <p className="mt-3.5 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed text-[#1e293b] font-bold">
            أربع خطوات رسمية مدروسة تضمن لك الشفافية التامة، الحماية المصرفية الكاملة، وسلاسة نقل الاستمارة.
          </p>
        </ScrollReveal>

        {/* ========================================================
            Central Interactive Stepper Track (مسار الخطوات في السنتر الدقيق)
            Bounded strictly between Node 01 and Node 04 center (12.5% to 87.5%)
            ======================================================== */}
        <div className="mb-10 hidden lg:block">
          <div className="relative">
            {/* Base Metallic Rail - Spans exactly from center of 1st node (12.5%) to center of 4th node (87.5%) */}
            <div
              className="absolute top-[28px] -translate-y-1/2 start-[12.5%] end-[12.5%] h-[3.5px] rounded-full bg-gradient-to-r from-gold/30 via-gold/60 to-gold/30 shadow-inner z-0 pointer-events-none"
              aria-hidden="true"
            />

            {/* Continuous Radiant Laser Beam Sweeping in RTL strictly bounded within the rail */}
            <div
              className="absolute top-[28px] -translate-y-1/2 start-[12.5%] end-[12.5%] h-[3.5px] overflow-hidden rounded-full pointer-events-none z-0"
              aria-hidden="true"
            >
              <div className="absolute top-0 h-full w-36 rounded-full bg-gradient-to-l from-transparent via-[#d9b87f] to-transparent shadow-[0_0_16px_#d9b87f,0_0_24px_#d9b87f] animate-travel-beam-rtl" />
            </div>

            {/* Active Progress Fill Line following current step (from Node 01 toward current step) */}
            <div
              className="absolute top-[28px] end-[12.5%] -translate-y-1/2 h-[4px] rounded-full bg-gradient-to-l from-gold via-[#e8c888] to-gold shadow-[0_0_14px_rgba(217,184,127,0.8)] transition-all duration-700 ease-out z-0 pointer-events-none"
              style={{
                width: `${(activeIndex / (steps.length - 1)) * 75}%`
              }}
              aria-hidden="true"
            />

            {/* 4 Interactive Waypoint Milestone Nodes - Sits in a 4-column grid (centers at 12.5%, 37.5%, 62.5%, 87.5%) */}
            <div className="grid grid-cols-4 relative z-10">
              {steps.map((step, idx) => {
                const isActive = activeIndex === idx;
                const isPassed = activeIndex >= idx;
                const Icon = step.icon;

                return (
                  <div key={step.number} className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setHoveredStep(idx)}
                      onMouseEnter={() => setHoveredStep(idx)}
                      onMouseLeave={() => setHoveredStep(null)}
                      className="group/node flex flex-col items-center focus:outline-hidden"
                    >
                      {/* Node Medallion (h-14 w-14 -> Center is exactly at 28px) */}
                      <div
                        className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border-2 transition-all duration-500 ${
                          isActive
                            ? 'scale-115 border-gold bg-gradient-to-br from-[#0c152a] via-[#162444] to-[#0a1122] text-gold shadow-[0_0_25px_rgba(217,184,127,0.85)]'
                            : isPassed
                            ? 'border-gold/80 bg-[#0c152a] text-gold shadow-md'
                            : 'border-[#d4c5b0] bg-white text-slate-500 shadow-sm hover:border-gold/60 hover:text-navy-deep'
                        }`}
                      >
                        <Icon size={22} className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />

                        {/* Outer Pulse Halo Ring when active */}
                        {isActive && (
                          <span className="absolute -inset-1.5 rounded-2xl border-2 border-gold/60 animate-ping opacity-40 pointer-events-none" />
                        )}
                      </div>

                      {/* Step Label beneath Node */}
                      <div className="mt-2.5 text-center">
                        <span
                          className={`block text-xs font-black transition-colors duration-300 ${
                            isActive ? 'text-[#8a5d1b] font-black scale-105' : 'text-[#2b3548] font-bold'
                          }`}
                        >
                          الخطوة {step.stepLabel}
                        </span>
                        <span
                          className={`block text-[11px] font-extrabold transition-colors duration-300 ${
                            isActive ? 'text-[#091122]' : 'text-slate-500'
                          }`}
                        >
                          {step.shortTitle}
                        </span>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================
            Connected 4-Step Cards Grid
            ======================================================== */}
        <div className="relative">
          <StaggerGrid
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 relative z-10"
            itemClassName="h-full flex flex-col"
            baseDelay={90}
          >
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeIndex === idx;

              return (
                <div
                  key={step.number}
                  onMouseEnter={() => setHoveredStep(idx)}
                  onMouseLeave={() => setHoveredStep(null)}
                  className={`group relative flex flex-col justify-between rounded-3xl p-5 sm:p-6 bg-gradient-to-b from-[#ffffff] via-[#faf7f1] to-[#f4eee2] border-2 transition-all duration-400 overflow-hidden h-full ${
                    isActive
                      ? 'border-gold shadow-[0_24px_50px_-10px_rgba(26,37,65,0.18),0_0_32px_rgba(217,184,127,0.35)] -translate-y-3'
                      : 'border-[#dbcebc] shadow-[0_12px_32px_-6px_rgba(26,37,65,0.07)] hover:border-gold hover:shadow-[0_20px_45px_-8px_rgba(26,37,65,0.14)] hover:-translate-y-2'
                  }`}
                >
                  {/* Top Golden Horizon Line */}
                  <div
                    className={`absolute inset-x-0 top-0 h-[3.5px] bg-gradient-to-r from-transparent via-gold to-transparent transition-opacity duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  />

                  {/* Corner Gold Radial Bloom */}
                  <div
                    className={`absolute -top-12 -end-12 h-36 w-36 rounded-full bg-gradient-to-bl from-gold/35 via-gold/15 to-transparent blur-xl transition-opacity duration-500 pointer-events-none ${
                      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  />

                  <div>
                    {/* Top Row: Sculpted Obsidian Medallion + Step Chip + High Contrast Number */}
                    <div className="flex items-center justify-between mb-5">
                      <span
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#070e1c] via-[#142343] to-[#070e1c] text-gold border-2 transition-all duration-300 shadow-md ${
                          isActive
                            ? 'scale-110 border-gold shadow-[0_0_24px_rgba(217,184,127,0.55)]'
                            : 'border-gold/50 group-hover:scale-105 group-hover:border-gold'
                        }`}
                      >
                        <Icon size={24} className="transition-transform duration-300 group-hover:rotate-3" />
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full border border-gold/45 bg-[#0a1324] px-3 py-1 text-xs font-black text-[#e8c888] shadow-xs">
                          الخطوة {step.stepLabel}
                        </span>
                        <span
                          className="font-norwester text-3xl font-black text-[#855b18] group-hover:text-gold transition-colors select-none tracking-wider drop-shadow-xs"
                          dir="ltr"
                        >
                          {step.number}
                        </span>
                      </div>
                    </div>

                    {/* Card Title - Deep Solid High Contrast */}
                    <h3 className="text-xl sm:text-[1.32rem] font-black text-[#081120] leading-snug group-hover:text-navy transition-colors tracking-tight">
                      {step.title}
                    </h3>

                    {/* Card Description - Crisp Dark Charcoal with perfect readability */}
                    <p className="mt-3 text-sm leading-relaxed text-[#1e293b] font-bold group-hover:text-black transition-colors">
                      {step.desc}
                    </p>
                  </div>

                  {/* Verification Guarantee Footer - Single Line Badges (No Wrapping) */}
                  <div className="mt-6 border-t-2 border-[#e9dfcf] pt-4 flex items-center justify-between gap-1.5 text-xs font-extrabold">
                    <span className="inline-flex items-center gap-1 rounded-lg border border-gold/50 bg-white px-2 py-1 text-[11px] font-black text-[#855b18] shadow-2xs whitespace-nowrap shrink-0">
                      <CheckCircle2 size={13} className="text-[#855b18] shrink-0" />
                      <span>{step.badge}</span>
                    </span>
                    <span className="text-[11px] font-black text-[#0a1426] flex items-center gap-1 whitespace-nowrap shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block animate-pulse shrink-0" />
                      <span>{step.tag}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </StaggerGrid>
        </div>
      </div>
    </section>
  );
}
