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
    <section className="grid gap-10 lg:grid-cols-12 items-center">
      <div className="lg:col-span-7 space-y-6">
        {/* High-contrast crisp badge on light background */}
        <div className="inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-[#131c31] text-[#faebd0] px-5 py-2 text-xs sm:text-sm font-bold shadow-xs">
          <Compass size={16} className="text-gold" />
          <span>بيان الهوية وفلسفة التميز</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-black text-[#0f172a] leading-tight">
          اللوحة المميزة ليست مجرد معدن، بل بصمة سيادية وأصل تاريخي يورّث
        </h2>

        <p className="text-sm sm:text-base leading-relaxed text-[#334155] font-medium">
          في ثقافة المجتمع السعودي الرفيعة، شكلت لوحات المركبات النادرة دائماً عنواناً للمكانة والهيبة والذوق الرفيع. ومع نضوج السوق، تحولت اللوحات الأحادية والثنائية إلى فئة أصول نادرة (Scarce Luxury Assets) تحظى بإقبال متزايد وتتفوق في عوائدها على العديد من الأدوات الاستثمارية التقليدية.
        </p>

        <p className="text-sm sm:text-base leading-relaxed text-[#334155] font-medium">
          جاءت منصة <strong className="font-black text-[#0f172a]">فارس بن سعود (FBS)</strong> لتنهي عهد التداول العشوائي وغير الموثق في المنصات العامة، ولتؤسس بيئة ذات طابع مصرفي نخبوي تليق بعشاق التفرد، وتضمن لكافة الأطراف إتمام صفقاتهم بكرامة وسرية واطمئنان مطلق.
        </p>

        {/* Key Checklist Badges */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm font-bold text-[#0f172a]">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <Check size={16} strokeWidth={3} />
            </span>
            <span>انتقاء دقيق لا يقبل إلا التحف الحقيقية</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <Check size={16} strokeWidth={3} />
            </span>
            <span>حفظ أموال بنكي مستقل بنظام الضامن</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <Check size={16} strokeWidth={3} />
            </span>
            <span>نقل ملكية رسمي عبر القنوات الحكومية المعتمدة</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <Check size={16} strokeWidth={3} />
            </span>
            <span>سرية تامة لحسابات كبار الشخصيات والملاك</span>
          </div>
        </div>
      </div>

      {/* Right: Curated Royal Emblem Pedestal */}
      <div className="lg:col-span-5">
        <div className="relative rounded-3xl border-2 border-gold/40 bg-gradient-to-br from-[#1c2c4d] via-[#15223c] to-[#0e172a] p-8 sm:p-9 text-white shadow-xl overflow-hidden">
          <div className="pointer-events-none absolute -top-12 -end-12 h-44 w-44 rounded-full bg-gold/20 blur-3xl" />

          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/20 text-gold border border-gold/40">
                <Crown size={24} />
              </span>
              <div>
                <h3 className="text-sm font-black text-white">ختم الاعتماد المؤسسي</h3>
                <p className="text-[11px] text-slate-300">منظومة دار مزادات فارس بن سعود</p>
              </div>
            </div>
            <SaudiCrestSvg className="w-8 h-8 text-gold/80" />
          </div>

          <div className="my-6 space-y-4 text-xs sm:text-sm leading-relaxed text-slate-200">
            <p className="italic font-medium">
              «نحن لا نبيع أرقاماً.. بل نوثق تاريخاً ونمكن مقتني اللوحات من حيازة تحف لا تتكرر، بإشراف قانوني ومالي يضاهي أرقى بيوت المزادات العالمية في لندن وجنيف ونيويورك.»
            </p>
            <div className="pt-3 flex items-center justify-between text-xs text-gold border-t border-white/10">
              <span className="font-bold">المكتب التنفيذي واللجنة الاستشارية</span>
              <span className="font-norwester">FBS PRIVATE DESK</span>
            </div>
          </div>

          <div className="rounded-2xl border border-gold/30 bg-gold/15 p-4 flex items-center gap-3 text-xs text-gold-light">
            <ShieldCheck size={22} className="shrink-0 text-gold" />
            <span>مرخصة ومطابقة للأنظمة التجارية وأنظمة المرور السعودية</span>
          </div>
        </div>
      </div>
    </section>
  );
}
