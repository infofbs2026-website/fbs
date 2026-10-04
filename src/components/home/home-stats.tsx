import { TrendingUp } from 'lucide-react';
import { SarSymbol } from '@/components/sar-symbol';
import { ScrollReveal, StaggerGrid, CountUp } from '@/components/home-motion';

export function HomeStats() {
  return (
    <section className="relative overflow-hidden border-t border-slate-200/80 bg-gradient-to-b from-[#fbfcfe] via-[#f4f7fb] to-[#edf2f8] py-20 sm:py-24">
      {/* Ambient Subtle Radial Glow */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[750px] rounded-full bg-gradient-to-r from-gold/15 via-blue-500/10 to-transparent blur-[120px]" />
      </div>

      <div className="container-fbs relative z-10">
        <ScrollReveal direction="up" delay={40}>
          <div className="mb-14 text-center">
            {/* Prestige Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/45 bg-gradient-to-r from-gold/20 via-gold/10 to-amber-500/10 px-4.5 py-1.5 text-xs sm:text-sm font-black text-navy-deep backdrop-blur-md shadow-[0_2px_12px_rgba(217,184,127,0.22)] mb-3.5">
              <TrendingUp size={16} className="text-gold-dark shrink-0" />
              <span className="tracking-wide">ريادة موثقة في سوق اللوحات</span>
            </div>

            {/* Commanding Luxury Headline - Unified Single Color */}
            <h2 className="text-3xl font-black sm:text-4xl lg:text-[2.65rem] text-navy-deep tracking-tight">
              إحصائيات تمنحك الثقة
            </h2>
          </div>
        </ScrollReveal>

        {/* Animated 60fps Numbers Grid with Cascading Reveal */}
        <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" baseDelay={100}>
          <div className="group relative rounded-3xl p-6 sm:p-7 text-center bg-white/95 border border-slate-200/90 shadow-[0_10px_30px_-5px_rgba(26,37,65,0.06)] backdrop-blur-xl transition-all duration-300 hover:border-gold hover:shadow-[0_20px_45px_-8px_rgba(217,184,127,0.25)] hover:-translate-y-1.5 overflow-hidden">
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

          <div className="group relative rounded-3xl p-6 sm:p-7 text-center bg-white/95 border border-slate-200/90 shadow-[0_10px_30px_-5px_rgba(26,37,65,0.06)] backdrop-blur-xl transition-all duration-300 hover:border-gold hover:shadow-[0_20px_45px_-8px_rgba(217,184,127,0.25)] hover:-translate-y-1.5 overflow-hidden">
            <CountUp
              end={100}
              suffix="%"
              duration={1400}
              className="block font-norwester text-4xl sm:text-5xl bg-gradient-to-r from-[#976a26] via-[#cb9b48] to-[#976a26] bg-clip-text text-transparent tracking-wide drop-shadow-xs"
            />
            <h3 className="mt-3 text-sm sm:text-base font-black text-navy-deep">توثيق الملكية</h3>
            <p className="mt-1 text-xs text-slate-500 font-medium">فحص رسمي مسبق لكل استمارة</p>
          </div>

          <div className="group relative rounded-3xl p-6 sm:p-7 text-center bg-white/95 border border-slate-200/90 shadow-[0_10px_30px_-5px_rgba(26,37,65,0.06)] backdrop-blur-xl transition-all duration-300 hover:border-gold hover:shadow-[0_20px_45px_-8px_rgba(217,184,127,0.25)] hover:-translate-y-1.5 overflow-hidden">
            <CountUp
              end={15000}
              prefix="+"
              duration={1800}
              className="block font-norwester text-4xl sm:text-5xl bg-gradient-to-r from-[#976a26] via-[#cb9b48] to-[#976a26] bg-clip-text text-transparent tracking-wide drop-shadow-xs"
            />
            <h3 className="mt-3 text-sm sm:text-base font-black text-navy-deep">مزايد نشط</h3>
            <p className="mt-1 text-xs text-slate-500 font-medium">مجتمع مهتم بأندر اللوحات بالمملكة</p>
          </div>

          <div className="group relative rounded-3xl p-6 sm:p-7 text-center bg-white/95 border border-slate-200/90 shadow-[0_10px_30px_-5px_rgba(26,37,65,0.06)] backdrop-blur-xl transition-all duration-300 hover:border-gold hover:shadow-[0_20px_45px_-8px_rgba(217,184,127,0.25)] hover:-translate-y-1.5 overflow-hidden">
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
