import React from 'react';
import { TrendingUp, ShieldCheck, Users, Award, CheckCircle2 } from 'lucide-react';
import { SarSymbol } from '@/components/sar-symbol';
import { ScrollReveal, StaggerGrid, CountUp } from '@/components/home-motion';

const statsData = [
  {
    icon: TrendingUp,
    end: 250,
    prefix: '+',
    suffix: 'M',
    duration: 1600,
    title: 'إجمالي التداولات',
    hasSar: true,
    desc: 'صفقات موثقة ومحمية بالكامل عبر النظام المالي الرسمي',
    badge: 'اعتماد مصرفي فوري'
  },
  {
    icon: ShieldCheck,
    end: 100,
    prefix: '',
    suffix: '%',
    duration: 1400,
    title: 'توثيق الملكية',
    hasSar: false,
    desc: 'فحص جنائي ونظامي مسبق لكافة الاستمارات الرسمية',
    badge: 'فحص استمارة 100%'
  },
  {
    icon: Users,
    end: 15000,
    prefix: '+',
    suffix: '',
    duration: 1800,
    title: 'مزايد ومستثمر نشط',
    hasSar: false,
    desc: 'مجتمع نخبوي مهتم باقتناء أندر اللوحات بالمملكة',
    badge: 'مزادات نشطة وحصرية'
  },
  {
    icon: Award,
    end: 4200,
    prefix: '+',
    suffix: '',
    duration: 1600,
    title: 'لوحة استثنائية مسوّاة',
    hasSar: false,
    desc: 'تم نقل ملكيتها وتسليمها بنجاح وبإشراف رسمي مباشر',
    badge: 'إشراف رسمي مباشر'
  }
];

export function HomeStats() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f0eade] via-[#f7f3ec] to-[#fbf9f4] py-20 sm:py-28">
      {/* Sleek Dark Accent Horizon Divider between the two light sections */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#0e172a]/25 to-transparent pointer-events-none" />

      {/* Bottom Golden Horizon Edge leading to the Dark Imperial Section */}
      <div className="absolute inset-x-0 bottom-0 h-[2.5px] bg-gradient-to-r from-transparent via-gold to-transparent shadow-[0_0_20px_rgba(217,184,127,0.7)] pointer-events-none" />

      {/* Ambient Warm Architectural Lighting & Subtle Dots */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        {/* Soft Gold Radial Bloom */}
        <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[850px] rounded-full bg-gradient-to-b from-gold/20 via-gold/5 to-transparent blur-[140px]" />
        
        {/* Luxury Gold Micro-dot Grid Matrix */}
        <div
          className="absolute inset-0 opacity-[0.065]"
          style={{
            backgroundImage: 'radial-gradient(#d9b87f 1.2px, transparent 1.2px)',
            backgroundSize: '32px 32px'
          }}
        />

        {/* Ambient Wave Line */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.05]"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1440 600"
        >
          <path d="M-100 200 C 400 400, 950 100, 1540 300" fill="none" stroke="#d9b87f" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="container-fbs relative z-10">
        <ScrollReveal direction="up" delay={40}>
          <div className="mb-14 sm:mb-16 text-center">
            {/* Prestige Eyebrow Badge - With Generous Height & Breathing Room */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-gold/50 bg-[#0a1324] px-7 py-3 text-xs sm:text-sm font-black text-gold shadow-[0_4px_18px_rgba(26,37,65,0.14)] mb-4 backdrop-blur-md">
              <TrendingUp size={18} className="text-gold shrink-0" />
              <span className="tracking-wide">ريادة موثقة · سوق مزادات النخبة بالمملكة</span>
            </div>

            {/* Commanding Luxury Headline */}
            <h2 className="text-3xl font-black sm:text-4xl lg:text-[2.75rem] text-[#091122] tracking-tight leading-tight">
              <span>إحصائيات تمنحك</span>{' '}
              <span className="bg-gradient-to-r from-[#8a5d1b] via-[#c6943f] to-[#8a5d1b] bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
                الثقة المطلقة
              </span>
            </h2>
            <p className="mt-3.5 max-w-xl mx-auto text-sm sm:text-base leading-relaxed text-[#1e293b] font-bold">
              أرقام حقيقية وموثقة تعكس ثقة نخبة المزايدين والمستثمرين في منصة FBS للمزادات الرسمية
            </p>
          </div>
        </ScrollReveal>

        {/* Animated Luxury Porcelain Plaques Grid */}
        <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" itemClassName="h-full flex flex-col" baseDelay={100}>
          {statsData.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="group relative flex flex-col justify-between rounded-3xl p-5 sm:p-6 text-center bg-gradient-to-b from-[#ffffff] via-[#faf7f1] to-[#f4eee2] border-2 border-[#dbcebc] shadow-[0_12px_32px_-6px_rgba(26,37,65,0.07)] hover:border-gold hover:shadow-[0_24px_50px_-10px_rgba(26,37,65,0.18),0_0_32px_rgba(217,184,127,0.35)] hover:-translate-y-2.5 transition-all duration-300 overflow-hidden h-full"
              >
                {/* Specular Top Gold Highlight Bar */}
                <div className="absolute top-0 inset-x-0 h-[3.5px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Subtle Radial Corner Bloom */}
                <div className="absolute -top-12 -end-12 h-36 w-36 rounded-full bg-gradient-to-bl from-gold/35 via-gold/15 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div>
                  {/* Sculpted Obsidian Medallion */}
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#070e1c] via-[#142343] to-[#070e1c] text-gold border-2 border-gold/50 shadow-md mb-4 group-hover:scale-110 group-hover:border-gold group-hover:shadow-[0_0_24px_rgba(217,184,127,0.45)] transition-all duration-300">
                    <Icon size={24} className="transition-transform duration-300 group-hover:rotate-3" />
                  </div>

                  {/* Numerical Counter with Radiant Gold Tone */}
                  <div className="my-1">
                    <CountUp
                      end={stat.end}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      duration={stat.duration}
                      className="block font-norwester text-4xl sm:text-5xl font-black bg-gradient-to-r from-[#8a5d1b] via-[#c6943f] to-[#8a5d1b] bg-clip-text text-transparent drop-shadow-xs tracking-wide"
                    />
                  </div>

                  {/* Stat Title */}
                  <h3 className="mt-3 flex items-center justify-center gap-1.5 text-base sm:text-lg font-black text-[#081120] group-hover:text-navy transition-colors">
                    <span>{stat.title}</span>
                    {stat.hasSar && <SarSymbol className="w-4.5 h-4.5 text-[#8a5d1b] shrink-0 drop-shadow-xs" />}
                  </h3>

                  {/* Stat Description */}
                  <p className="mt-2 text-xs sm:text-sm text-[#1e293b] font-bold leading-relaxed">
                    {stat.desc}
                  </p>
                </div>

                {/* Official Assurance Stamp Footer */}
                <div className="mt-6 pt-4 border-t-2 border-[#e9dfcf] flex items-center justify-center">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#855b18] bg-white rounded-xl py-1.5 px-3.5 border border-gold/50 shadow-2xs whitespace-nowrap">
                    <CheckCircle2 size={13} className="text-[#855b18] shrink-0" />
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
