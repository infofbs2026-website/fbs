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
    desc: 'ابحث وتصفح مزادات النخبة لاختيار لوحتك بأعلى معايير الشفافية.',
    badge: 'تصفح وفلترة ذكية',
    tag: 'نظامي معتمد'
  },
  {
    number: '02',
    stepLabel: 'الثانية',
    icon: CreditCard,
    shortTitle: 'حجز التأمين',
    title: 'التسجيل وتفويض التأمين',
    desc: 'اعتمد مبلغ التأمين البنكي بأمان رسمي كامل دون أي استقطاع فوري.',
    badge: 'حجز بنكي آمن (Hold)',
    tag: 'حماية مصرفية 100%'
  },
  {
    number: '03',
    stepLabel: 'الثالثة',
    icon: Gavel,
    shortTitle: 'المزايدة الذكية',
    title: 'زايد في الوقت الفعلي',
    desc: 'زايد لحظياً مع تمديد ذكي يحمي من القنص ويضمن تكافؤ الفرص.',
    badge: 'تمديد ذكي ضد القنص',
    tag: 'تحديث لحظي مشفر'
  },
  {
    number: '04',
    stepLabel: 'الرابعة',
    icon: Award,
    shortTitle: 'نقل الملكية',
    title: 'التسوية ونقل الملكية',
    desc: 'فور رسو المزاد، يتولى فريقنا إتمام الإجراءات ونقل الاستمارة باسمك.',
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
    }, 3400);
    return () => clearInterval(interval);
  }, [hoveredStep]);

  const activeIndex = hoveredStep !== null ? hoveredStep : autoStep;

  return (
    <section className="relative overflow-hidden border-t border-[#E5E7EB] bg-[#F0F1F2] py-14 sm:py-20 lg:py-24 text-[#14243C]">
      {/* Top Specular Edge Line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D9BB81]/30 to-transparent pointer-events-none" />

      {/* Main Container: Constrained to ~1240px for generous breathing margins */}
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
        {/* Section Header */}
        <ScrollReveal direction="up" className="mb-10 sm:mb-14 text-center">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D9BB81]/50 bg-white px-4 py-1.5 text-xs sm:text-[13px] font-bold text-[#8C6B2D] shadow-2xs mb-3.5 mx-auto">
            <ShieldCheck size={14} className="text-[#9E7B35] shrink-0" />
            <span className="tracking-wide">رحلة واضحة ومحمية من المزايدة حتى نقل الملكية</span>
          </div>

          {/* Heading with Deep Royal Navy & High-Contrast Warm Saudi Gold */}
          <h2 className="text-[clamp(1.75rem,1.35rem+1.2vw,2.45rem)] font-black tracking-tight leading-[1.25] text-center">
            <span className="text-[#14243C]">كيف تعمل </span>
            <span className="text-[#9E7B35]">منصة FBS للمزادات؟</span>
          </h2>

          {/* Concise, impactful subtitle */}
          <p className="mt-2.5 max-w-xl mx-auto text-[14px] sm:text-[15px] leading-[1.7] text-[#526071] font-normal text-center">
            4 خطوات موثقة تضمن الشفافية والحماية المصرفية وسلاسة نقل الملكية باسمك.
          </p>
        </ScrollReveal>

        {/* ========================================================
            Central Interactive Stepper Track
            Bounded strictly between Node 01 and Node 04 center (12.5% to 87.5%)
            ======================================================== */}
        <div className="mb-8 hidden lg:block">
          <div className="relative">
            {/* Base Metallic Rail */}
            <div
              className="absolute top-[28px] -translate-y-1/2 start-[12.5%] end-[12.5%] h-[2px] rounded-full bg-[#D9BB81]/25 pointer-events-none"
              aria-hidden="true"
            />

            {/* Continuous Radiant Laser Beam Sweeping in RTL */}
            <div
              className="absolute top-[28px] -translate-y-1/2 start-[12.5%] end-[12.5%] h-[2px] overflow-hidden rounded-full pointer-events-none z-0"
              aria-hidden="true"
            >
              <div className="absolute top-0 h-full w-36 rounded-full bg-gradient-to-l from-transparent via-[#9E7B35] to-transparent shadow-[0_0_12px_#9E7B35] animate-travel-beam-rtl" />
            </div>

            {/* Active Progress Fill Line: Starts at Node 01 (start = right in RTL) and flows toward Node 04 */}
            <div
              className="absolute top-[28px] start-[12.5%] -translate-y-1/2 h-[2px] rounded-full bg-[#9E7B35] transition-all duration-700 ease-out z-0 pointer-events-none"
              style={{
                width: `${(activeIndex / (steps.length - 1)) * 75}%`
              }}
              aria-hidden="true"
            />

            {/* 4 Interactive Waypoint Milestone Nodes */}
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
                      className="group/node flex flex-col items-center focus:outline-hidden cursor-pointer"
                    >
                      {/* Node Medallion */}
                      <div
                        className={`relative flex h-13 w-13 items-center justify-center rounded-2xl border transition-all duration-300 ${
                          isActive
                            ? 'scale-110 border-[#9E7B35] bg-white text-[#8C6B2D] shadow-[0_4px_16px_rgba(158,123,53,0.25)]'
                            : isPassed
                            ? 'border-[#9E7B35]/60 bg-white text-[#9E7B35] shadow-xs'
                            : 'border-[#E2E0D8] bg-white/80 text-[#64748B] hover:border-[#9E7B35]/50'
                        }`}
                      >
                        <Icon size={20} className={`transition-transform duration-300 ${isActive ? 'scale-110 text-[#8C6B2D]' : ''}`} />

                        {/* Outer Pulse Halo Ring when active */}
                        {isActive && (
                          <span className="absolute -inset-1 rounded-2xl border border-[#9E7B35]/50 animate-ping opacity-30 pointer-events-none" />
                        )}
                      </div>

                      {/* Step Label beneath Node */}
                      <div className="mt-2 text-center">
                        <span
                          className={`block text-xs transition-colors duration-300 ${
                            isActive ? 'text-[#8C6B2D] font-bold' : 'text-[#64748B] font-medium'
                          }`}
                        >
                          الخطوة {step.stepLabel}
                        </span>
                        <span
                          className={`block text-[11px] transition-colors duration-300 ${
                            isActive ? 'text-[#14243C] font-bold' : 'text-[#526071]'
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
            className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4 relative z-10"
            itemClassName="h-full flex flex-col"
            baseDelay={80}
          >
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeIndex === idx;

              return (
                <div
                  key={step.number}
                  onMouseEnter={() => setHoveredStep(idx)}
                  onMouseLeave={() => setHoveredStep(null)}
                  className={`group relative flex flex-col justify-between rounded-2xl p-5 sm:p-5.5 bg-white border transition-all duration-300 overflow-hidden h-full ${
                    isActive
                      ? 'border-[#9E7B35] shadow-[0_12px_28px_rgba(20,36,60,0.08)] -translate-y-1.5'
                      : 'border-[#E7E5DF] hover:border-[#D9BB81]/80 shadow-[0_4px_16px_rgba(20,36,60,0.04)] hover:shadow-[0_10px_24px_rgba(20,36,60,0.06)] hover:-translate-y-1'
                  }`}
                >
                  {/* Top Specular Edge Line */}
                  <div
                    className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D9BB81]/40 to-transparent transition-opacity duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'
                    }`}
                  />

                  <div>
                    {/* Top Row: Icon + Step Chip + Number */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300 ${
                          isActive
                            ? 'scale-105 border-[#9E7B35]/40 bg-[#FAF7F0] text-[#8C6B2D]'
                            : 'border-[#E7E5DF] bg-[#FAF9F6] text-[#14243C] group-hover:border-[#D9BB81]/50'
                        }`}
                      >
                        <Icon size={20} className="transition-transform duration-300 group-hover:rotate-3" />
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full border border-[#E7E5DF] bg-[#FAF9F6] px-2.5 py-0.5 text-[11px] font-semibold text-[#526071]">
                          الخطوة {step.stepLabel}
                        </span>
                        <span
                          className="font-norwester text-2xl sm:text-3xl font-black text-[#D9BB81]/40 group-hover:text-[#9E7B35] transition-colors select-none tracking-wider"
                          dir="ltr"
                        >
                          {step.number}
                        </span>
                      </div>
                    </div>

                    {/* Card Title */}
                    <h3 className="text-[16px] sm:text-[17px] font-bold text-[#14243C] leading-snug group-hover:text-[#9E7B35] transition-colors tracking-tight">
                      {step.title}
                    </h3>

                    {/* Card Description: Condensed and uncluttered */}
                    <p className="mt-2 text-[13px] sm:text-[13.5px] leading-[1.65] text-[#526071] font-normal">
                      {step.desc}
                    </p>
                  </div>

                  {/* Verification Guarantee Footer */}
                  <div className="mt-4 pt-3 border-t border-[#ECE9E2] flex items-center justify-between gap-1.5 text-xs font-medium">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#E7E5DF] bg-[#FAF9F6] px-2 py-0.5 text-[10.5px] text-[#526071] whitespace-nowrap shrink-0">
                      <CheckCircle2 size={12} className="text-[#9E7B35] shrink-0" />
                      <span>{step.badge}</span>
                    </span>
                    <span className="text-[10.5px] text-[#526071] flex items-center gap-1.5 whitespace-nowrap shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse shrink-0" />
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

