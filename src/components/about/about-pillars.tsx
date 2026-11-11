import React from 'react';
import Link from 'next/link';
import { FileCheck2, Landmark, Scale, ShieldCheck, ArrowLeft, BadgeCheck } from 'lucide-react';

export const protocolSteps = [
  {
    num: '01',
    stepAr: 'الخطوة 01',
    title: 'تدقيق الملكية',
    desc: 'فحص سريان الاستمارة وأهلية الأطراف.',
    icon: FileCheck2
  },
  {
    num: '02',
    stepAr: 'الخطوة 02',
    title: 'الضمان المالي',
    desc: 'حفظ القيمة بحساب مستقل ومؤمّن.',
    icon: Landmark
  },
  {
    num: '03',
    stepAr: 'الخطوة 03',
    title: 'اعتماد الاتفاق',
    desc: 'توثيق الترسية وإصدار محضر الصفقة.',
    icon: Scale
  },
  {
    num: '04',
    stepAr: 'الخطوة 04',
    title: 'النقل عبر أبشر',
    desc: 'نقل اللوحة رسمياً وصرف المستحقات.',
    icon: ShieldCheck
  }
];

export function AboutPillars() {
  return (
    <section className="relative z-10 bg-paper pt-12 sm:pt-16 pb-8 sm:pb-12 text-navy">
      <div className="max-w-[1000px] mx-auto px-5 sm:px-8 lg:px-10 space-y-6 sm:space-y-8">
        {/* Header: Title + Subtitle on Right & Button on Left (Desktop) | Centered with Button Underneath (Mobile) */}
        <div className="flex flex-col items-center text-center lg:flex-row lg:items-end lg:justify-between lg:text-start gap-4">
          <div className="min-w-0 flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-white px-3.5 py-1.5 text-[11px] sm:text-[11.5px] font-bold text-navy shadow-xs">
              <BadgeCheck size={13} className="text-gold-dark shrink-0" />
              <span>الحوكمة والأمان المالي</span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-[26px] font-black text-navy tracking-tight mt-2.5">
              مسار توثيق ونقل الملكية
            </h2>

            <p className="mt-1.5 text-xs sm:text-[13.5px] text-slate-600 font-normal">
              أربع خطوات إلكترونية متسلسلة تحفظ حقوق البائع والمشتري.
            </p>
          </div>

          <Link
            href="/how-it-works"
            className="btn btn-navy min-h-9.5 shrink-0 rounded-xl px-4.5 py-2 text-xs font-bold group shadow-xs"
          >
            <span>دليل الإجراءات</span>
            <ArrowLeft
              size={13}
              className="text-gold shrink-0 transition-transform duration-200 group-hover:-translate-x-1"
            />
          </Link>
        </div>

        {/* Content Underneath: Frameless 2x2 Architectural Hairline Rows (Desktop) | Centered Stack (Mobile) */}
        <div data-pf-audit="about-protocol-ledger" className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12">
          {protocolSteps.map((step, idx) => {
            const Icon = step.icon;
            const topBorderClass =
              idx === 0
                ? 'border-t border-slate-300/75'
                : idx === 1
                  ? 'lg:border-t lg:border-slate-300/75'
                  : '';

            return (
              <div
                key={step.num}
                className={`protocol-step ${topBorderClass} border-b border-slate-300/75 py-4 sm:py-4.5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-start group`}
              >
                <div className="min-w-0 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                  <span className="protocol-seal">
                    <Icon size={17} />
                  </span>

                  <div className="min-w-0 flex flex-col items-center sm:items-start">
                    <span className="sm:hidden pf-type-micro font-bold text-gold-dark mb-0.5">
                      {step.stepAr}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-navy">{step.title}</h3>
                    <p className="mt-0.5 text-xs sm:text-[13px] text-slate-600 font-normal">
                      {step.desc}
                    </p>
                  </div>
                </div>

                <span
                  dir="ltr"
                  className="hidden sm:inline-block font-norwester text-lg sm:text-xl font-bold tracking-widest text-gold-dark/65 group-hover:text-gold-dark transition-colors shrink-0 select-none"
                >
                  {step.num}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
