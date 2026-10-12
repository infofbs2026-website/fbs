import React from 'react';
import { Compass, Check, Crown, ShieldCheck } from 'lucide-react';

function SaudiCrestSvg({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M32 6C32 6 34.5 12 39 15C43.5 18 49 18 49 18C49 18 45.5 23 43.5 28C41.5 33 42 38 42 38C42 38 36.5 36.5 32 39C27.5 36.5 22 38 22 38C22 38 22.5 33 20.5 28C18.5 23 15 18 15 18C15 18 20.5 18 25 15C29.5 12 32 6 32 6Z"
        fill="currentColor"
        fillOpacity="0.16"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M32 14V34M32 18C28 16 25 18 24 21M32 18C36 16 39 18 40 21M32 23C27 22 24 24 23 27M32 23C37 22 40 24 41 27" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M18 46L46 46M20 42L44 50M20 50L44 42" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32" cy="46" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function AboutManifesto() {
  return (
    <section className="space-y-10 sm:space-y-12">
      {/* 1. Centered Prestigious Header Block */}
      <div className="text-center max-w-4xl mx-auto space-y-4">
        {/* Big Prestigious Centered Badge with Breathing Room */}
        <div className="inline-flex items-center gap-2.5 rounded-full border border-gold/45 bg-[#101b33] text-[#faebd0] px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-black shadow-[0_4px_20px_rgba(217,184,127,0.18)]">
          <Compass size={18} className="text-gold shrink-0" />
          <span className="tracking-wide">بيان الهوية وفلسفة التميز</span>
        </div>

        {/* Section Headline (Harmonious 2 Lines, Unified Balanced Scale) */}
        <h2 className="flex flex-col items-center gap-1 sm:gap-2 text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-black text-[#0f172a] tracking-tight leading-snug">
          <span>اللوحة المميزة ليست مجرد معدن،</span>
          <span>بل بصمة سيادية وأصل تاريخي يورّث</span>
        </h2>

        {/* Luxury Aesthetic Gold Divider */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <span className="h-px w-16 sm:w-28 bg-gradient-to-r from-transparent via-gold/60 to-gold" />
          <span className="flex h-2 w-2 rounded-full bg-gold shadow-[0_0_10px_rgba(217,184,127,0.9)]" />
          <span className="h-px w-16 sm:w-28 bg-gradient-to-l from-transparent via-gold/60 to-gold" />
        </div>
      </div>

      {/* 2. Symmetrical Two-Column Content with Balanced Equal Height */}
      <div className="grid gap-8 lg:grid-cols-12 items-stretch">
        {/* Right Column: Editorial Paragraphs and Key Checklist Cards */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-[#334155] font-medium">
            <p className="leading-relaxed">
              في ثقافة المجتمع السعودي الرفيعة، شكلت لوحات المركبات النادرة دائماً عنواناً للمكانة والهيبة والذوق الرفيع. ومع نضوج السوق، تحولت اللوحات الأحادية والثنائية إلى فئة أصول نادرة (<span className="text-[#0f172a] font-bold">Scarce Luxury Assets</span>) تحظى بإقبال متزايد وتتفوق في عوائدها على العديد من الأدوات الاستثمارية التقليدية.
            </p>
            <p className="leading-relaxed">
              جاءت منصة <strong className="font-black text-[#0f172a]">فارس بن سعود (FBS)</strong> لتنهي عهد التداول العشوائي وغير الموثق في المنصات العامة، ولتؤسس بيئة ذات طابع مصرفي نخبوي تليق بعشاق التفرد، وتضمن لكافة الأطراف إتمام صفقاتهم بكرامة وسرية واطمئنان مطلق.
            </p>
          </div>

          {/* Key Checklist Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 pt-2 mt-auto">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-xs hover:border-gold/50 hover:shadow-sm transition-all">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <Check size={16} strokeWidth={3} />
              </span>
              <span className="text-xs sm:text-[13px] font-bold text-[#0f172a]">انتقاء دقيق لا يقبل إلا التحف الحقيقية</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-xs hover:border-gold/50 hover:shadow-sm transition-all">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <Check size={16} strokeWidth={3} />
              </span>
              <span className="text-xs sm:text-[13px] font-bold text-[#0f172a]">حفظ أموال بنكي مستقل بنظام الضامن</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-xs hover:border-gold/50 hover:shadow-sm transition-all">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <Check size={16} strokeWidth={3} />
              </span>
              <span className="text-xs sm:text-[13px] font-bold text-[#0f172a]">نقل ملكية رسمي عبر القنوات الحكومية المعتمدة</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-xs hover:border-gold/50 hover:shadow-sm transition-all">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <Check size={16} strokeWidth={3} />
              </span>
              <span className="text-xs sm:text-[13px] font-bold text-[#0f172a]">سرية تامة لحسابات كبار الشخصيات والملاك</span>
            </div>
          </div>
        </div>

        {/* Left Column: Curated Royal Emblem Pedestal (Equal-Height Stretch) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="relative rounded-3xl border-2 border-gold/45 bg-gradient-to-br from-[#1c2c4d] via-[#14213a] to-[#0d162a] p-7 sm:p-8 text-white shadow-xl overflow-hidden h-full flex flex-col justify-between">
            {/* Ambient Corner Lighting */}
            <div className="pointer-events-none absolute -top-12 -end-12 h-44 w-44 rounded-full bg-gold/20 blur-3xl" />

            {/* Crest Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/20 text-gold border border-gold/40 shadow-inner">
                  <Crown size={24} />
                </span>
                <div>
                  <h3 className="text-sm font-black text-white">ختم الاعتماد المؤسسي</h3>
                  <p className="text-[11px] text-slate-300">منظومة دار مزادات فارس بن سعود</p>
                </div>
              </div>
              <SaudiCrestSvg className="w-8 h-8 text-gold/80" />
            </div>

            {/* Quote Body */}
            <div className="my-6 space-y-4 text-xs sm:text-sm leading-relaxed text-slate-200">
              <p className="italic font-medium leading-relaxed">
                «نحن لا نبيع أرقاماً.. بل نوثق تاريخاً ونمكّن مقتني اللوحات من حيازة تحف لا تتكرر، بإشراف قانوني ومالي يضاهي أرقى بيوت المزادات العالمية في لندن وجنيف ونيويورك.»
              </p>
              <div className="pt-3.5 flex items-center justify-between text-xs text-gold border-t border-white/10">
                <span className="font-bold">المكتب التنفيذي واللجنة الاستشارية</span>
                <span className="font-norwester tracking-wider font-bold">FBS PRIVATE DESK</span>
              </div>
            </div>

            {/* Official Licensing Footer */}
            <div className="rounded-2xl border border-gold/35 bg-gold/15 p-4 flex items-center gap-3 text-xs text-gold-light backdrop-blur-xs">
              <ShieldCheck size={22} className="shrink-0 text-gold" />
              <span className="font-semibold">مرخصة ومطابقة للأنظمة التجارية وأنظمة المرور السعودية</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
