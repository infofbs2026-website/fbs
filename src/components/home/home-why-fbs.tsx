import Link from 'next/link';
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  FileCheck,
  Gavel,
  Landmark,
  ShieldCheck
} from 'lucide-react';
import { ScrollReveal, StaggerGrid } from '@/components/home-motion';

const whyFbsPillars = [
  {
    icon: ShieldCheck,
    number: '01',
    title: 'توثيق مسبق للملكية',
    desc: 'فحص رسمي معتمد للاستمارة قبل طرح اللوحة.',
    badge: 'تدقيق رسمي 100%'
  },
  {
    icon: Gavel,
    number: '02',
    title: 'مزايدة عادلة ومحمية',
    desc: 'نظام مشفر مع تمديد ذكي وتكافؤ كامل للفرص.',
    badge: 'تمديد ذكي ضد القنص'
  },
  {
    icon: Landmark,
    number: '03',
    title: 'أمان التأمين المصرفي',
    desc: 'حجز بنكي رسمي (Hold) دون استقطاع فوري.',
    badge: 'إفراج فوري وتلقائي'
  },
  {
    icon: FileCheck,
    number: '04',
    title: 'نقل ملكية وتسليم فوري',
    desc: 'إشراف تنفيذي مباشر حتى استلام الاستمارة.',
    badge: 'تسليم رسمي معتمد'
  }
];


export function HomeWhyFbs() {
  return (
    <section className="relative overflow-hidden bg-[#F7F6F3] py-14 sm:py-20 lg:py-24 text-[#14243C] border-t border-[#E7E5DF] select-none">
      {/* Top Specular Edge Line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D9BB81]/40 to-transparent pointer-events-none" />

      {/* Main Container: Constrained to ~1240px for generous breathing space */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal direction="up" delay={40}>
          <div className="mb-8 sm:mb-12 text-center">
            {/* Prestige Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D9BB81]/50 bg-white px-3.5 py-1 text-xs sm:text-[13px] font-bold text-[#8C6B2D] shadow-2xs mb-3 mx-auto">
              <BadgeCheck size={14} className="text-[#9E7B35] shrink-0" />
              <span className="tracking-wide">لماذا فارس بن سعود؟</span>
            </div>

            {/* Headline with High Contrast: Royal Navy + Deep Warm Gold */}
            <h2 className="text-[clamp(1.75rem,1.35rem+1.2vw,2.45rem)] font-black tracking-tight leading-[1.25] text-center">
              <span className="text-[#14243C]">التميّز خيارك، </span>
              <span className="text-[#9E7B35]">والثقة ضماننا</span>
            </h2>

            {/* Concise Subtitle in a single clean line */}
            <p className="mt-2 max-w-lg mx-auto text-[14px] sm:text-[15px] leading-relaxed text-[#526071] font-normal text-center">
              منصة المزادات المعتمدة لنخبة اللوحات بالمملكة بأعلى معايير الأمان المالي.
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Unified, Identical, Symmetrical Cards Grid (Zero Clutter) */}
        <StaggerGrid
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4.5 lg:gap-5"
          itemClassName="h-full flex flex-col"
          baseDelay={70}
        >
          {whyFbsPillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl p-4 sm:p-5 bg-white border border-[#E7E5DF] hover:border-[#D9BB81] shadow-2xs hover:shadow-[0_12px_28px_rgba(20,36,60,0.06)] hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full"
              >
                {/* Top Specular Edge Line */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D9BB81]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* Header Row: Icon Emblem + Number Index */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-[#FAF9F6] border border-[#E7E5DF] text-[#8C6B2D] shadow-2xs transition-all duration-300 group-hover:scale-105 group-hover:border-[#D9BB81]">
                      <Icon size={19} className="transition-transform duration-300 group-hover:rotate-3" />
                    </span>
                    <span
                      className="font-norwester text-2xl sm:text-3xl font-black text-[#E2E0D8] group-hover:text-[#9E7B35]/40 transition-colors select-none tracking-wider"
                      dir="ltr"
                    >
                      {pillar.number}
                    </span>
                  </div>

                  <h3 className="text-[15px] sm:text-[16px] font-bold text-[#14243C] group-hover:text-[#9E7B35] transition-colors leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="mt-1.5 text-[12.5px] sm:text-[13px] font-normal text-[#526071] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                {/* Verification Guarantee Footer */}
                <div className="mt-4 pt-3 border-t border-[#ECE9E2] flex items-center justify-between text-xs font-medium">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#E7E5DF] bg-[#FAF9F6] px-2 py-0.5 text-[10.5px] text-[#526071]">
                    <CheckCircle2 size={12} className="text-[#9E7B35] shrink-0" />
                    <span>{pillar.badge}</span>
                  </span>
                  <span className="text-[11px] text-[#64748B] group-hover:text-[#9E7B35] transition-colors font-bold">
                    ضمان FBS
                  </span>
                </div>
              </div>
            );
          })}
        </StaggerGrid>

        {/* Clean Centered Link Button to About Page */}
        <div className="mt-8 sm:mt-10 flex justify-center">
          <Link
            href="/about"
            className="group inline-flex items-center gap-2 rounded-xl border border-[#D9BB81]/60 bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-[#14243C] shadow-2xs hover:border-[#9E7B35] hover:bg-[#FAF9F6] hover:shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>تعرّف أكثر على قصة FBS ومعايير الأمان</span>
            <ArrowLeft size={14} className="text-[#14243C] transition-transform duration-200 group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

