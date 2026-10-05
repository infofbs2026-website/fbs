import { TrendingUp, ShieldCheck, Users, Award } from 'lucide-react';
import { SarSymbol } from '@/components/sar-symbol';
import { ScrollReveal, StaggerGrid, CountUp } from '@/components/home-motion';

export function HomeStats() {
  return (
    <section className="relative overflow-hidden border-t border-[#d9b87f]/30 bg-gradient-to-b from-white via-[#f8fafc] to-[#f1f5f9] py-20 sm:py-24">
      {/* Ambient Brand Geometry & Gold Radiance (Pure Brand Colors) */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[750px] rounded-full blur-[130px] opacity-60"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(217,184,127,0.18) 0%, rgba(26,37,65,0.04) 50%, transparent 80%)'
          }}
        />

        {/* Micro-dot Luxury Architectural Matrix (Pure Brand Gold, 4% Opacity) */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(#d9b87f 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />

        {/* Top Transition Golden Hairline */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#d9b87f]/60 to-transparent" />
      </div>

      <div className="container-fbs relative z-10">
        <ScrollReveal direction="up" delay={40}>
          <div className="mb-14 text-center">
            {/* Prestige Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/45 bg-white/95 px-4.5 py-1.5 text-xs sm:text-sm font-black text-navy-deep shadow-[0_2px_12px_rgba(217,184,127,0.18)] mb-3.5">
              <TrendingUp size={16} className="text-gold-dark shrink-0" />
              <span className="tracking-wide">ريادة موثقة في سوق اللوحات</span>
            </div>

            {/* Commanding Luxury Headline - Unified Single Color */}
            <h2 className="text-3xl font-black sm:text-4xl lg:text-[2.65rem] text-navy-deep tracking-tight">
              إحصائيات تمنحك الثقة
            </h2>
            <p className="mt-3 max-w-xl mx-auto text-sm sm:text-base leading-relaxed text-slate-600 font-medium">
              أرقام حقيقية تعكس ثقة نخبة المزايدين والمستثمرين في منصة FBS للمزادات
            </p>
          </div>
        </ScrollReveal>

        {/* Animated Treasury Plaques Grid with Brand Accents */}
        <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" baseDelay={100}>
          {/* Stat 1: Total Volume */}
          <div className="group relative rounded-3xl p-6 sm:p-7 text-center bg-white border border-slate-200/90 shadow-[0_8px_25px_-5px_rgba(26,37,65,0.06)] hover:border-navy/40 hover:shadow-[0_16px_35px_-8px_rgba(26,37,65,0.12)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
            {/* Deep Navy Top Shimmer Edge */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-navy-deep/80 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gold/10 text-gold-dark border border-gold/30 mb-3 shadow-2xs">
              <TrendingUp size={18} />
            </div>

            <CountUp
              end={250}
              prefix="+"
              suffix="M"
              duration={1600}
              className="block font-norwester text-4xl sm:text-5xl bg-gradient-to-r from-[#976a26] via-[#cb9b48] to-[#976a26] bg-clip-text text-transparent tracking-wide drop-shadow-xs"
            />
            <h3 className="mt-3 flex items-center justify-center gap-1.5 text-sm sm:text-base font-black text-navy-deep">
              <span>إجمالي التداولات</span>
              <SarSymbol className="w-4 h-4 text-gold-dark" />
            </h3>
            <p className="mt-1 text-xs text-slate-500 font-medium">صفقات موثقة ومحمية بالكامل</p>
          </div>

          {/* Stat 2: Verified Ownership */}
          <div className="group relative rounded-3xl p-6 sm:p-7 text-center bg-white border border-slate-200/90 shadow-[0_8px_25px_-5px_rgba(26,37,65,0.06)] hover:border-navy/40 hover:shadow-[0_16px_35px_-8px_rgba(26,37,65,0.12)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
            {/* Deep Navy Top Shimmer Edge */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-navy-deep/80 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gold/10 text-gold-dark border border-gold/30 mb-3 shadow-2xs">
              <ShieldCheck size={18} />
            </div>

            <CountUp
              end={100}
              suffix="%"
              duration={1400}
              className="block font-norwester text-4xl sm:text-5xl bg-gradient-to-r from-[#976a26] via-[#cb9b48] to-[#976a26] bg-clip-text text-transparent tracking-wide drop-shadow-xs"
            />
            <h3 className="mt-3 text-sm sm:text-base font-black text-navy-deep">توثيق الملكية</h3>
            <p className="mt-1 text-xs text-slate-500 font-medium">فحص رسمي مسبق لكل استمارة</p>
          </div>

          {/* Stat 3: Active Bidders */}
          <div className="group relative rounded-3xl p-6 sm:p-7 text-center bg-white border border-slate-200/90 shadow-[0_8px_25px_-5px_rgba(26,37,65,0.06)] hover:border-navy/40 hover:shadow-[0_16px_35px_-8px_rgba(26,37,65,0.12)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
            {/* Deep Navy Top Shimmer Edge */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-navy-deep/80 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gold/10 text-gold-dark border border-gold/30 mb-3 shadow-2xs">
              <Users size={18} />
            </div>

            <CountUp
              end={15000}
              prefix="+"
              duration={1800}
              className="block font-norwester text-4xl sm:text-5xl bg-gradient-to-r from-[#976a26] via-[#cb9b48] to-[#976a26] bg-clip-text text-transparent tracking-wide drop-shadow-xs"
            />
            <h3 className="mt-3 text-sm sm:text-base font-black text-navy-deep">مزايد نشط</h3>
            <p className="mt-1 text-xs text-slate-500 font-medium">مجتمع مهتم بأندر اللوحات بالمملكة</p>
          </div>

          {/* Stat 4: Exceptional Plates */}
          <div className="group relative rounded-3xl p-6 sm:p-7 text-center bg-white border border-slate-200/90 shadow-[0_8px_25px_-5px_rgba(26,37,65,0.06)] hover:border-navy/40 hover:shadow-[0_16px_35px_-8px_rgba(26,37,65,0.12)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
            {/* Deep Navy Top Shimmer Edge */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-navy-deep/80 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gold/10 text-gold-dark border border-gold/30 mb-3 shadow-2xs">
              <Award size={18} />
            </div>

            <CountUp
              end={4200}
              prefix="+"
              duration={1600}
              className="block font-norwester text-4xl sm:text-5xl bg-gradient-to-r from-[#976a26] via-[#cb9b48] to-[#976a26] bg-clip-text text-transparent tracking-wide drop-shadow-xs"
            />
            <h3 className="mt-3 text-sm sm:text-base font-black text-navy-deep">لوحة استثنائية</h3>
            <p className="mt-1 text-xs text-slate-500 font-medium">تم نقل ملكيتها وتسويتها بنجاح</p>
          </div>
        </StaggerGrid>
      </div>
    </section>
  );
}
