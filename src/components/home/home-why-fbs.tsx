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

export function HomeWhyFbs() {
  return (
    <section className="relative overflow-hidden border-t border-[#d9b87f]/25 bg-gradient-to-b from-[#fbfcfe] via-[#f4f7fb] to-[#edf2f8] py-20 sm:py-28">
      {/* Ambient Subtle Procedural Glows & Contours */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute -top-32 start-1/3 h-[500px] w-[700px] rounded-full bg-gradient-to-br from-gold/15 via-gold/5 to-transparent blur-[130px]" />
        <div className="absolute -bottom-32 end-10 h-[450px] w-[600px] rounded-full bg-gradient-to-tl from-navy/10 via-blue-900/5 to-transparent blur-[120px]" />
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1440 800"
          aria-hidden="true"
        >
          <path d="M-100 350 C 400 150, 900 600, 1540 220" fill="none" stroke="#d9b87f" strokeWidth="1.5" />
          <path
            d="M-100 450 C 500 250, 1000 680, 1540 300"
            fill="none"
            stroke="#d9b87f"
            strokeWidth="1"
            strokeDasharray="6 8"
          />
        </svg>
      </div>

      <div className="container-fbs relative z-10 grid gap-10 lg:grid-cols-[1fr_1.26fr] lg:items-stretch xl:gap-14">
        <ScrollReveal direction="right" delay={80} className="flex flex-col justify-between h-full">
          <div>
            {/* Prestige Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/45 bg-white/95 px-4.5 py-1.5 text-xs sm:text-sm font-black text-navy-deep shadow-[0_2px_12px_rgba(217,184,127,0.18)] mb-4">
              <BadgeCheck size={16} className="text-gold-dark shrink-0" />
              <span className="tracking-wide">لماذا فارس بن سعود؟</span>
            </div>

            {/* Commanding Luxury Headline - Unified Single Color */}
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl lg:text-[1.95rem] xl:text-[2.25rem] leading-tight text-navy-deep">
              التميّز خيارك، والثقة هي ضماننا.
            </h2>

            {/* Subtitle Paragraph */}
            <p className="mt-3.5 max-w-xl text-sm sm:text-base leading-relaxed text-slate-600 font-medium">
              صممنا منصة FBS لتكون الجسر الموثوق بين نخبة ملاك اللوحات والمزايدين الجادين في المملكة،
              وفق أعلى ضوابط الأمان المالي والتحقق القانوني.
            </p>
          </div>

          {/* Unified Executive Package: Guarantee Cards + Action Button */}
          <div className="flex flex-col gap-3.5 my-5 sm:my-6">
            {[
              'فحص ملكية وثائق اللوحة عبر المراجعين الرسميين قبل الموافقة على نشر المزاد.',
              'حجز مبلغ التأمين دون استقطاعه حتى انتهاء المزاد لضمان جدية المزايدين.',
              'تنسيق ومتابعة نقل الملكية عبر منصة أبشر الرسمية والمعارض المعتمدة.'
            ].map((text, idx) => (
              <div
                key={idx}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white/95 px-5 py-4 sm:py-4.5 shadow-[0_4px_16px_rgba(26,37,65,0.04)] backdrop-blur-md transition-all duration-300 hover:border-gold/60 hover:bg-white hover:shadow-[0_8px_24px_rgba(217,184,127,0.18)] hover:translate-x-1"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy via-[#1f2c4e] to-navy-deep text-gold border border-gold/40 shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:border-gold">
                  <CheckCircle2 size={18} className="text-gold" />
                </span>
                <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug group-hover:text-navy transition-colors">
                  {text}
                </p>
              </div>
            ))}

            {/* Action Button */}
            <Link
              href="/about"
              className="group btn btn-navy w-full h-14 sm:h-[54px] px-8 text-base font-black shadow-xl shadow-navy/20 border border-gold/35 transition-all duration-300 hover:border-gold hover:shadow-[0_12px_32px_rgba(26,37,65,0.35)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3"
            >
              <span>تعرّف أكثر على قصة FBS</span>
              <ArrowLeft size={18} className="text-gold transition-transform duration-300 group-hover:-translate-x-1.5" />
            </Link>
          </div>
        </ScrollReveal>

        <StaggerGrid className="grid gap-5 sm:grid-cols-2" baseDelay={90}>
          {[
            {
              icon: ShieldCheck,
              number: '01',
              title: 'توثيق الملكية المسبق',
              desc: 'كل لوحة تُعرض خضعت للتدقيق وفحص مستندات الاستمارة لإثبات ملكية البائع.',
              badge: 'مراجعة وتدقيق 100%'
            },
            {
              icon: Gavel,
              number: '02',
              title: 'مزايدة عادلة ومحمية',
              desc: 'تسجيل المزايدات لحظة بلحظة مع تمديد تلقائي يمنع خطف المزاد في الثواني الأخيرة.',
              badge: 'تمديد ذكي ضد القنص'
            },
            {
              icon: FileCheck,
              number: '03',
              title: 'متابعة نقل الملكية',
              desc: 'فريق متخصص يرافق البائع والمشتري خطوة بخطوة حتى إصدار الاستمارة الجديدة.',
              badge: 'معتمد عبر منصة أبشر'
            },
            {
              icon: Landmark,
              number: '04',
              title: 'أمان التأمين البنكي',
              desc: 'إفراج فوري وتلقائي عن مبالغ التأمين لكافة المشاركين غير الفائزين فور إغلاق المزاد.',
              badge: 'إلغاء تفويض فوري (Void)'
            }
          ].map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className="group relative flex flex-col justify-between rounded-3xl p-6 sm:p-7 bg-white/95 border border-slate-200/90 shadow-[0_10px_30px_-5px_rgba(26,37,65,0.06),0_1px_3px_rgba(0,0,0,0.02)] backdrop-blur-xl transition-all duration-300 hover:border-gold hover:shadow-[0_22px_45px_-8px_rgba(26,37,65,0.14),0_0_24px_rgba(217,184,127,0.22)] hover:-translate-y-1.5 overflow-hidden"
              >
                {/* Subtle Golden Hover Flare in Corner */}
                <div className="absolute -top-10 -end-10 h-32 w-32 rounded-full bg-gradient-to-bl from-gold/25 via-gold/5 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div>
                  {/* Header Row: Icon Emblem + Number Index */}
                  <div className="flex items-center justify-between">
                    <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0c152a] via-[#16223e] to-[#0a1122] text-gold border-2 border-gold/45 shadow-md shadow-navy/15 transition-all duration-300 group-hover:scale-110 group-hover:border-gold group-hover:shadow-[0_0_20px_rgba(217,184,127,0.45)]">
                      <Icon size={24} className="transition-transform duration-300 group-hover:rotate-3" />
                    </span>
                    <span
                      className="font-norwester text-2xl font-black text-slate-300 group-hover:text-gold transition-colors select-none"
                      dir="ltr"
                    >
                      {pillar.number}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-black text-slate-950 group-hover:text-navy transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
                    {pillar.desc}
                  </p>
                </div>

                {/* Verification Guarantee Footer */}
                <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between text-xs font-extrabold">
                  <span className="flex items-center gap-1.5 text-gold-dark font-black">
                    <CheckCircle2 size={14} className="text-gold-accent shrink-0" />
                    <span>{pillar.badge}</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 group-hover:text-navy transition-colors">
                    ضمان FBS
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
