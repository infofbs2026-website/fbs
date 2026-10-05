import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { ScrollReveal, StaggerGrid } from '@/components/home-motion';

const steps = [
  {
    number: '01',
    stepLabel: 'الأولى',
    title: 'اكتشف لوحتك النادرة',
    desc: 'ابحث بالحروف والأرقام أو تصفح مزادات النخبة النشطة لاختيار بصمتك الخاصة.',
    badge: 'تصفح وفلترة ذكية'
  },
  {
    number: '02',
    stepLabel: 'الثانية',
    title: 'التسجيل وتفويض التأمين',
    desc: 'سجّل في المزاد المطلوب واعتمد مبلغ التأمين البنكي بأمان كامل ومحمي.',
    badge: 'حجز بنكي آمن (Hold)'
  },
  {
    number: '03',
    stepLabel: 'الثالثة',
    title: 'زايد في الوقت الفعلي',
    desc: 'تابع المزايدة لحظة بلحظة مع حماية من القنص (Anti-sniping) وتمديد تلقائي عادل.',
    badge: 'تمديد ذكي ضد القنص'
  },
  {
    number: '04',
    stepLabel: 'الرابعة',
    title: 'التسوية ونقل الملكية',
    desc: 'بعد رسو المزاد، تتابع المنصة إنهاء الإجراءات الرسمية بين الأطراف حتى استلام اللوحة.',
    badge: 'نقل رسمي عبر أبشر'
  }
];

export function HomeHowItWorks() {
  return (
    <section className="relative overflow-hidden border-t border-[#d9b87f]/25 bg-gradient-to-b from-[#fbfcfe] via-[#f4f7fb] to-[#edf2f8] py-20 sm:py-28">
      {/* Ambient Subtle Procedural Glows & Contours */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute -top-32 start-1/2 -translate-x-1/2 h-[450px] w-[750px] rounded-full bg-gradient-to-b from-gold/15 via-gold/5 to-transparent blur-[130px]" />
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1440 800"
          aria-hidden="true"
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
        <ScrollReveal direction="up" className="mb-14 text-center">
          {/* Prestige Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/45 bg-white/95 px-4.5 py-1.5 text-xs sm:text-sm font-black text-navy-deep shadow-[0_2px_12px_rgba(217,184,127,0.18)] mb-4">
            <ShieldCheck size={16} className="text-gold-dark shrink-0" />
            <span className="tracking-wide">رحلة واضحة · من المزايدة حتى نقل الملكية</span>
          </div>

          {/* Commanding Title with Gold Gradient Accent */}
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-[2.65rem] text-navy">
            <span>كيف تعمل</span>{' '}
            <span className="bg-gradient-to-r from-[#976a26] via-[#cb9b48] to-[#976a26] bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
              منصة FBS؟
            </span>
          </h2>
          <p className="mt-3.5 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed text-slate-600 font-medium">
            خطوات سهلة ومحمية تضمن لك المنافسة الشفافة والتسليم الرسمي المعتمد.
          </p>
        </ScrollReveal>

        <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" baseDelay={100}>
          {steps.map((step) => (
            <div
              key={step.number}
              className="group relative flex flex-col justify-between rounded-3xl p-6 sm:p-7 bg-white/95 border border-slate-200/90 shadow-[0_10px_30px_-5px_rgba(26,37,65,0.06),0_1px_3px_rgba(0,0,0,0.02)] backdrop-blur-xl transition-all duration-300 hover:border-gold hover:shadow-[0_22px_45px_-8px_rgba(26,37,65,0.14),0_0_24px_rgba(217,184,127,0.22)] hover:-translate-y-2 overflow-hidden"
            >
              {/* Subtle Golden Hover Flare in Corner */}
              <div className="absolute -top-10 -end-10 h-32 w-32 rounded-full bg-gradient-to-bl from-gold/25 via-gold/5 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div>
                {/* Top Row: Number Emblem & Step Chip */}
                <div className="flex items-center justify-between mb-5">
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0c152a] via-[#16223e] to-[#0a1122] border-2 border-gold/45 text-[#faebd0] font-norwester text-2xl font-black shadow-md shadow-navy/15 transition-all duration-300 group-hover:scale-110 group-hover:border-gold group-hover:shadow-[0_0_20px_rgba(217,184,127,0.45)]"
                    dir="ltr"
                  >
                    {step.number}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] font-extrabold text-gold-dark group-hover:border-gold group-hover:bg-gold/20 transition-all">
                    الخطوة {step.stepLabel}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-950 group-hover:text-navy transition-colors">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
                  {step.desc}
                </p>
              </div>

              {/* Verification Guarantee Footer */}
              <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between text-xs font-extrabold">
                <span className="flex items-center gap-1.5 text-gold-dark font-black">
                  <CheckCircle2 size={14} className="text-gold-accent shrink-0" />
                  <span>{step.badge}</span>
                </span>
                <span className="text-[11px] font-bold text-slate-400 group-hover:text-navy transition-colors">
                  نظامي معتمد
                </span>
              </div>
            </div>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
