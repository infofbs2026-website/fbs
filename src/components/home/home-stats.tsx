import { TrendingUp } from 'lucide-react';
import { SarSymbol } from '@/components/sar-symbol';
import { ScrollReveal, StaggerGrid, CountUp } from '@/components/home-motion';

export function HomeStats() {
  return (
    <section className="hero-luxury-ambient relative overflow-hidden border-y border-[#d9b87f]/25 text-white py-20 sm:py-24">
      {/* Ambient Subtle Radial Glow */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[700px] rounded-full bg-gradient-to-r from-gold/15 via-blue-600/15 to-transparent blur-[100px]" />
      </div>

      <div className="container-fbs relative z-10">
        <ScrollReveal direction="up" delay={40}>
          <div className="mb-14 text-center">
            <span className="eyebrow justify-center text-gold">
              <TrendingUp size={14} />
              <span>ريادة موثقة في سوق اللوحات</span>
            </span>
            <h2 className="text-3xl font-extrabold sm:text-4xl text-white">إحصائيات تمنحك الثقة</h2>
          </div>
        </ScrollReveal>

        {/* Animated 60fps Numbers Grid with Cascading Reveal */}
        <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" baseDelay={100}>
          <div className="glass-vision-card p-6 text-center hover:scale-[1.03] transition-transform duration-300">
            <CountUp
              end={250}
              prefix="+"
              suffix="M"
              duration={1600}
              className="block font-norwester text-4xl sm:text-5xl text-gold-light tracking-wide drop-shadow-md"
            />
            <h3 className="mt-2.5 flex items-center justify-center gap-1.5 text-sm font-bold text-slate-200">
              <span>إجمالي التداولات</span>
              <SarSymbol className="w-4 h-4 text-gold" />
            </h3>
            <p className="mt-1 text-xs text-slate-400">صفقات موثقة ومحمية بالكامل</p>
          </div>

          <div className="glass-vision-card p-6 text-center hover:scale-[1.03] transition-transform duration-300">
            <CountUp
              end={100}
              suffix="%"
              duration={1400}
              className="block font-norwester text-4xl sm:text-5xl text-gold-light tracking-wide drop-shadow-md"
            />
            <h3 className="mt-2.5 text-sm font-bold text-slate-200">توثيق الملكية</h3>
            <p className="mt-1 text-xs text-slate-400">فحص رسمي مسبق لكل استمارة</p>
          </div>

          <div className="glass-vision-card p-6 text-center hover:scale-[1.03] transition-transform duration-300">
            <CountUp
              end={15000}
              prefix="+"
              duration={1800}
              className="block font-norwester text-4xl sm:text-5xl text-gold-light tracking-wide drop-shadow-md"
            />
            <h3 className="mt-2.5 text-sm font-bold text-slate-200">مزايد نشط</h3>
            <p className="mt-1 text-xs text-slate-400">مجتمع مهتم بأندر اللوحات بالمملكة</p>
          </div>

          <div className="glass-vision-card p-6 text-center hover:scale-[1.03] transition-transform duration-300">
            <CountUp
              end={4200}
              prefix="+"
              duration={1600}
              className="block font-norwester text-4xl sm:text-5xl text-gold-light tracking-wide drop-shadow-md"
            />
            <h3 className="mt-2.5 text-sm font-bold text-slate-200">لوحة استثنائية</h3>
            <p className="mt-1 text-xs text-slate-400">تم نقل ملكيتها وتسويتها بنجاح</p>
          </div>
        </StaggerGrid>
      </div>
    </section>
  );
}
