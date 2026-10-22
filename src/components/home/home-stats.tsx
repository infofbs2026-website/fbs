import React from 'react';
import { TrendingUp, ShieldCheck, Users, Award, CheckCircle2 } from 'lucide-react';
import { SarSymbol } from '@/components/sar-symbol';
import { ScrollReveal, StaggerGrid, CountUp } from '@/components/home-motion';

const statsData = [
  {
    icon: TrendingUp,
    end: 45,
    prefix: '+',
    suffix: 'M',
    duration: 1400,
    title: 'إجمالي التداولات',
    hasSar: true,
    desc: 'صفقات رسمية محمية بنكياً',
    badge: 'اعتماد مصرفي فوري'
  },
  {
    icon: ShieldCheck,
    end: 100,
    prefix: '',
    suffix: '%',
    duration: 1200,
    title: 'توثيق الملكية',
    hasSar: false,
    desc: 'فحص نظامي شامل لكل استمارة',
    badge: 'فحص استمارة 100%'
  },
  {
    icon: Users,
    end: 2400,
    prefix: '+',
    suffix: '',
    duration: 1500,
    title: 'مزايد ومستثمر نشط',
    hasSar: false,
    desc: 'مجتمع نخبوي موثق بالمملكة',
    badge: 'مزادات نشطة وحصرية'
  },
  {
    icon: Award,
    end: 500,
    prefix: '+',
    suffix: '',
    duration: 1300,
    title: 'لوحة استثنائية مسوّاة',
    hasSar: false,
    desc: 'نقل ملكية وتسليم رسمي فوري',
    badge: 'إشراف رسمي مباشر'
  }
];

export function HomeStats() {
  return (
    <section className="relative overflow-hidden bg-[#08162B] py-14 sm:py-20 lg:py-22 text-white border-t border-[#D9BB81]/25 select-none">
      {/* Top 1px Golden Specular Line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D9BB81]/50 to-transparent pointer-events-none" />

      {/* Subtle Warm Gold Radial Glow in Midnight Navy */}
      <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#D9BB81]/5 blur-[120px] pointer-events-none" />

      {/* Container Constrained to ~1240px for generous breathing space */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal direction="up" delay={40}>
          <div className="mb-8 sm:mb-11 text-center">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D9BB81]/30 bg-[#14243C]/90 px-3.5 py-1 text-xs sm:text-[13px] font-bold text-[#E0CDA4] shadow-xs mb-3 mx-auto">
              <TrendingUp size={14} className="text-[#D9BB81] shrink-0" />
              <span className="tracking-wide">ريادة موثقة · سوق مزادات النخبة بالمملكة</span>
            </div>

            {/* Heading: Personal Luxury Scale */}
            <h2 className="text-[clamp(1.75rem,1.35rem+1.2vw,2.45rem)] font-black text-white tracking-tight leading-[1.25] text-center">
              <span>إحصائيات تمنحك </span>
              <span className="text-[#D9BB81]">الثقة المطلقة</span>
            </h2>

            {/* Concise Subtitle in a single clean line */}
            <p className="mt-2 max-w-lg mx-auto text-[13.5px] sm:text-[15px] leading-relaxed text-slate-300/90 font-normal text-center">
              أرقام موثقة تعكس ريادة المنصة وثقة كبار المزايدين والمستثمرين.
            </p>
          </div>
        </ScrollReveal>

        {/* Compact Luxury VisionOS Plaques Grid: 2x2 on Mobile, 4 columns on Desktop */}
        <StaggerGrid
          className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5"
          itemClassName="h-full flex flex-col"
          baseDelay={70}
        >
          {statsData.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl p-3.5 sm:p-4.5 text-center bg-[#0D1F3C]/80 border border-[#D9BB81]/20 hover:border-[#D9BB81]/60 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_16px_36px_rgba(217,184,127,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full"
              >
                {/* Specular Top Highlight Bar */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D9BB81]/40 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* Frosted Icon Medallion */}
                  <div className="inline-flex items-center justify-center w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#14243C] border border-[#D9BB81]/25 text-[#D9BB81] shadow-inner mb-2 group-hover:scale-105 group-hover:border-[#D9BB81] transition-all duration-300">
                    <Icon size={17} className="transition-transform duration-300 group-hover:rotate-3" />
                  </div>

                  {/* Numerical Counter: Reduced font size for luxury balance */}
                  <div className="my-0.5">
                    <CountUp
                      end={stat.end}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      duration={stat.duration}
                      className="block font-norwester text-xl sm:text-2xl lg:text-[28px] font-black text-white tracking-tight leading-none"
                    />
                  </div>

                  {/* Stat Title */}
                  <h3 className="mt-1.5 flex items-center justify-center gap-1 text-[13px] sm:text-[14.5px] font-bold text-white group-hover:text-[#faebd0] transition-colors">
                    <span>{stat.title}</span>
                    {stat.hasSar && <SarSymbol className="w-3.5 h-3.5 text-[#D9BB81] shrink-0" />}
                  </h3>

                  {/* Stat Description: Condensed to exactly 1 single line */}
                  <p className="mt-1 text-[10.5px] sm:text-[12px] text-slate-300/80 font-normal leading-normal truncate">
                    {stat.desc}
                  </p>
                </div>

                {/* Official Assurance Stamp Footer */}
                <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-center">
                  <span className="inline-flex items-center gap-1 text-[9.5px] sm:text-[10.5px] font-medium text-[#faebd0] bg-[#14243C]/80 rounded-md sm:rounded-lg py-0.5 px-2 sm:px-2.5 border border-[#D9BB81]/25 whitespace-nowrap">
                    <CheckCircle2 size={11} className="text-[#D9BB81] shrink-0" />
                    <span>{stat.badge}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </StaggerGrid>
      </div>
    </section>
  );
}


