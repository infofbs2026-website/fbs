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
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0b1428] via-[#0f1d3a] to-[#070c18] py-20 sm:py-28 text-white">
      {/* Royal Clean Section Boundary Separator */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#d9b87f] to-transparent shadow-[0_0_20px_rgba(217,184,127,0.8)] z-20 pointer-events-none" />

      {/* Ambient Procedural Lighting & Contours */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute -top-40 start-1/2 -translate-x-1/2 h-[600px] w-[950px] rounded-full bg-gradient-to-b from-blue-600/25 via-gold/10 to-transparent blur-[140px]" />
        <div className="absolute -bottom-40 end-10 h-[500px] w-[700px] rounded-full bg-gold/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(217,184,127,0.08)_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.08]"
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

      <div className="container-fbs relative z-10 grid gap-8 lg:grid-cols-[1fr_1.26fr] lg:items-stretch xl:gap-12">
        <ScrollReveal direction="right" delay={80} className="flex flex-col justify-between h-full">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-start">
            {/* Prestige Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gradient-to-r from-gold/25 via-gold/15 to-transparent px-4 py-1.5 text-xs sm:text-sm font-black text-gold-light shadow-[0_2px_14px_rgba(217,184,127,0.25)] mb-3 mx-auto lg:mx-0 backdrop-blur-md">
              <BadgeCheck size={16} className="text-gold shrink-0" />
              <span className="tracking-wide">لماذا فارس بن سعود؟</span>
            </div>

            {/* Commanding Luxury Headline */}
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl lg:text-[1.95rem] xl:text-[2.25rem] leading-tight text-white text-center lg:text-start">
              التميّز خيارك، والثقة هي ضماننا.
            </h2>

            {/* Subtitle Paragraph */}
            <p className="mt-2.5 max-w-xl text-sm sm:text-base leading-relaxed text-slate-200 font-medium text-center lg:text-start mx-auto lg:mx-0">
              منصة المزادات المعتمدة لنخبة اللوحات بالمملكة، بأعلى معايير الأمان المالي والتوثيق الرسمي.
            </p>
          </div>

          {/* Unified Executive Package: Guarantee Cards + Action Button */}
          <div className="flex flex-col gap-3 mt-4 sm:mt-5">
            {[
              'تدقيق رسمي لملكية اللوحة ومستنداتها قبل الطرح.',
              'حجز بنكي آمن للتأمين دون استقطاع فوري.',
              'نقل ملكية فوري ومعتمد بإشراف رسمي كامل.'
            ].map((text, idx) => (
              <div
                key={idx}
                className="group flex items-center gap-3.5 rounded-2xl border-2 border-gold/35 bg-gradient-to-r from-[#17264a] via-[#101b36] to-[#0c1428] px-4.5 py-3 sm:py-3.5 shadow-[0_6px_20px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.12)] backdrop-blur-md transition-all duration-300 hover:border-gold/70 hover:bg-[#1c2e59] hover:shadow-[0_8px_24px_rgba(217,184,127,0.25)] hover:translate-x-1"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold/35 via-gold/20 to-transparent text-gold border border-gold/50 shadow-[0_0_12px_rgba(217,184,127,0.3)] transition-transform duration-300 group-hover:scale-110 group-hover:border-gold">
                  <CheckCircle2 size={17} className="text-gold" />
                </span>
                <p className="text-xs sm:text-sm font-extrabold text-white leading-snug group-hover:text-gold-light transition-colors">
                  {text}
                </p>
              </div>
            ))}

            {/* Action Button - Regal Gold Button */}
            <Link
              href="/about"
              className="group btn btn-gold w-full h-12 sm:h-[48px] px-8 text-base font-black shadow-xl shadow-gold/20 border-2 border-gold/50 transition-all duration-300 hover:shadow-[0_12px_32px_rgba(217,184,127,0.45)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 text-navy-deep"
            >
              <span>تعرّف أكثر على قصة FBS</span>
              <ArrowLeft size={18} className="text-navy-deep transition-transform duration-300 group-hover:-translate-x-1.5" />
            </Link>
          </div>
        </ScrollReveal>

        <StaggerGrid
          className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 grid-rows-2 h-full"
          itemClassName="h-full flex flex-col"
          baseDelay={90}
        >
          {[
            {
              icon: ShieldCheck,
              number: '01',
              title: 'توثيق مسبق للملكية',
              desc: 'فحص رسمي شامل للاستمارة ومستندات البائع قبل إدراج أي لوحة بالمزاد.',
              badge: 'تدقيق رسمي 100%'
            },
            {
              icon: Gavel,
              number: '02',
              title: 'مزايدة عادلة ومحمية',
              desc: 'نظام مشفر لحظي مع تمديد ذكي يحمي تكافؤ الفرص ويمنع خطف الثواني الأخيرة.',
              badge: 'تمديد ذكي ضد القنص'
            },
            {
              icon: FileCheck,
              number: '03',
              title: 'نقل ملكية سلس',
              desc: 'متابعة تنفيذية متكاملة حتى إصدار الاستمارة الجديدة باسم المشتري.',
              badge: 'إشراف رسمي مباشر'
            },
            {
              icon: Landmark,
              number: '04',
              title: 'أمان التأمين المصرفي',
              desc: 'إلغاء حجز مبالغ التأمين تلقائياً وفورياً لجميع المشاركين غير الفائزين.',
              badge: 'إفراج فوري (Hold/Void)'
            }
          ].map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#16254a]/95 via-[#101b36]/98 to-[#0b1326]/98 border-2 border-gold/40 shadow-[0_16px_36px_-8px_rgba(0,0,0,0.65),0_0_25px_rgba(217,184,127,0.08),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-xl transition-all duration-300 hover:border-gold hover:shadow-[0_24px_50px_-8px_rgba(0,0,0,0.85),0_0_35px_rgba(217,184,127,0.3)] hover:-translate-y-1 overflow-hidden h-full"
              >
                {/* Subtle Golden Hover Flare in Corner */}
                <div className="absolute -top-10 -end-10 h-32 w-32 rounded-full bg-gradient-to-bl from-gold/30 via-gold/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div>
                  {/* Header Row: Icon Emblem + Number Index */}
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/35 via-gold/20 to-[#0e1933] text-gold border-2 border-gold/55 shadow-[0_4px_16px_rgba(217,184,127,0.3)] transition-all duration-300 group-hover:scale-105 group-hover:border-gold group-hover:shadow-[0_0_22px_rgba(217,184,127,0.5)]">
                      <Icon size={24} className="transition-transform duration-300 group-hover:rotate-3" />
                    </span>
                    <span
                      className="font-norwester text-3xl sm:text-4xl font-black text-gold/85 group-hover:text-gold transition-colors select-none tracking-wider drop-shadow-[0_2px_10px_rgba(217,184,127,0.4)]"
                      dir="ltr"
                    >
                      {pillar.number}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg sm:text-xl font-black text-white group-hover:text-gold-light transition-colors drop-shadow-xs">
                    {pillar.title}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm font-semibold text-slate-200 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                {/* Verification Guarantee Footer */}
                <div className="mt-4 border-t border-white/10 pt-3 flex items-center justify-between text-xs font-extrabold">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-gold/40 bg-gold/15 px-2.5 py-1 text-xs font-black text-gold-light shadow-xs">
                    <CheckCircle2 size={13} className="text-gold shrink-0" />
                    <span>{pillar.badge}</span>
                  </span>
                  <span className="text-xs font-bold text-slate-300 group-hover:text-gold transition-colors">
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
