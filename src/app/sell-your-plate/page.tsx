import type { Metadata } from 'next';
import Link from 'next/link';
import { SellerForm } from '@/components/seller-form';
import { getViewer } from '@/lib/auth';
import { getReferenceData } from '@/modules/marketplace/service';
import { ShieldCheck, Award, Lock, FileCheck2, MessageCircle, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'اعرض لوحتك في مزادات النخبة | فارس بن سعود'
};

export default async function Sell() {
  const [viewer, refs] = await Promise.all([getViewer(), getReferenceData()]);

  return (
    <div className="w-full bg-[#050914] text-white">
      {/* ============================================================= */}
      {/* 1. EXTENDED LUXURY HERO SECTION WITH 3 INTEGRATED TRUST CARDS */}
      {/* ============================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#030612] via-[#071328] via-[#0b1b38] to-[#071124] text-white pt-24 sm:pt-32 pb-14 sm:pb-20 border-b border-gold/30 shadow-2xl">
        {/* Ambient Lights & Multi-Layered Radial Gradients */}
        <div className="pointer-events-none absolute -top-44 start-1/2 -translate-x-1/2 h-[650px] w-[1100px] rounded-full bg-gradient-to-b from-gold/25 via-amber-500/10 to-transparent blur-[150px]" />
        <div className="pointer-events-none absolute top-1/3 start-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[800px] rounded-full bg-gold/10 blur-[130px]" />
        <div className="pointer-events-none absolute bottom-10 end-0 h-[450px] w-[450px] rounded-full bg-blue-600/15 blur-[140px]" />
        <div className="pointer-events-none absolute top-1/4 start-0 h-[400px] w-[400px] rounded-full bg-amber-400/8 blur-[130px]" />

        {/* Aerospace Micro Grid */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="sell-hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#d9b87f" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sell-hero-grid)" />
        </svg>

        <div className="container-fbs relative z-10">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Link href="/" className="hover:text-gold transition-colors">
              الرئيسية
            </Link>
            <span>/</span>
            <span className="text-gold-light">المزادات والوساطة</span>
            <span>/</span>
            <span className="text-white font-bold">اعرض لوحتك</span>
          </nav>

          {/* Unified Luxury Eyebrow Badge (Spacious & Breathable) */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-gold/50 bg-[#101b33]/90 px-6 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-black text-gold-light shadow-[0_4px_22px_rgba(217,184,127,0.25)] backdrop-blur-md my-6 sm:my-8">
            <span className="flex h-2 w-2 rounded-full bg-gold animate-pulse shrink-0" />
            <Award size={18} className="text-gold shrink-0" />
            <span className="tracking-wide">خدمة كبار الملاك والمستثمرين — منصة العرض الحصرية</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl">
            اعرض لوحتك في مزادات النخبة
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-300 font-normal">
            منصتك الأولى في المملكة لعرض اللوحات الماسية والنادرة أمام نخبة المزايدين والمقتنين، مع ضمان حماية حقوق البائع وسرية المعاملات المالية.
          </p>

          {/* 3 Prestige Trust Cards (Joined with the Hero, Tuned Glassmorphism) */}
          <div className="mt-12 sm:mt-16 pt-8 border-t border-gold/20">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                {
                  title: 'حماية وضمان مالي كامل',
                  desc: 'حسابات ضامنة ومستندات موثقة نظاميًا',
                  icon: ShieldCheck
                },
                {
                  title: 'نخبة المقتنين والمزايدين',
                  desc: 'وصول مباشر لأصحاب الرغبة والقدرة العالية',
                  icon: Award
                },
                {
                  title: 'اعتماد ونقل فوري',
                  desc: 'إشراف كامل حتى إتمام نقل الملكية عبر أبشر',
                  icon: FileCheck2
                }
              ].map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div
                    key={idx}
                    className="group relative overflow-hidden flex items-center gap-4.5 rounded-2xl border border-gold/45 bg-gradient-to-br from-white/[0.13] via-[#102042]/90 to-[#0c1833]/95 backdrop-blur-xl p-5 sm:p-5.5 shadow-[0_10px_35px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.28)] hover:border-gold hover:from-white/[0.19] hover:via-[#162c5b]/95 hover:shadow-[0_14px_45px_rgba(217,184,127,0.25),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Glass Specular Accent */}
                    <div className="pointer-events-none absolute -top-10 -end-10 h-28 w-28 rounded-full bg-gold/20 blur-2xl group-hover:bg-gold/35 transition-all duration-300" />

                    <div className="relative z-10 flex h-12 w-12 sm:h-13 sm:w-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/35 via-gold/15 to-transparent border border-gold/60 text-gold-light shadow-[0_0_20px_rgba(217,184,127,0.28)] group-hover:scale-110 group-hover:text-gold group-hover:shadow-[0_0_28px_rgba(217,184,127,0.5)] transition-all duration-300">
                      <Icon size={24} />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-sm sm:text-base font-black text-white group-hover:text-gold-light transition-colors leading-snug tracking-tight">
                        {card.title}
                      </h3>
                      <p className="mt-1 text-xs sm:text-[12.5px] text-slate-200 font-medium leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* 2. REFINED LUXURY LIGHT PAGE BODY                             */}
      {/* ============================================================= */}
      <main className="relative min-h-screen bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#f8fafc] py-14 sm:py-20 text-navy overflow-hidden">
        {/* Subtle Ambient Gold Glow Blobs on Light Background */}
        <div className="pointer-events-none absolute -top-40 start-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-gold/10 blur-[140px]" />
        <div className="pointer-events-none absolute bottom-10 end-0 h-[400px] w-[400px] rounded-full bg-blue-900/5 blur-[120px]" />

        {/* Subtle Executive Micro-Grid Pattern */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="sell-body-grid" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M 44 0 L 0 0 0 44" fill="none" stroke="#0f172a" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sell-body-grid)" />
        </svg>

        <div className="container-fbs relative z-10">
          <div className="space-y-12">
            {!viewer && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-3xl border-2 border-gold/45 bg-gradient-to-r from-[#18253f]/95 via-[#141f35]/95 to-[#101a2d]/95 backdrop-blur-xl py-8 sm:py-9.5 px-6 sm:px-8 min-h-[140px] sm:min-h-[150px] shadow-[0_20px_50px_-10px_rgba(16,23,40,0.22)]">
                <div className="flex items-center gap-4">
                  <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-gold/20 text-gold border border-gold/35 shadow-inner">
                    <Lock size={22} />
                  </span>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-white">
                      محاكي تسجيل اللوحات المميزة (وضع المعاينة المباشرة)
                    </h4>
                    <p className="text-xs sm:text-[13px] text-slate-300 font-medium mt-1 leading-relaxed">
                      يمكنك تجربة تحديد حروف وأرقام لوحتك بالأسفل ومعاينتها مباشرة. لحفظ اللوحة واعتمادها رسمياً، يُرجى تسجيل الدخول.
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-3">
                  <Link
                    href="/login?redirect=/sell-your-plate"
                    className="btn btn-gold py-3 px-6 text-xs sm:text-sm font-black shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    href="/register?redirect=/sell-your-plate"
                    className="btn border-2 border-white/20 bg-white/10 text-white py-3 px-6 text-xs sm:text-sm font-black hover:bg-white/20 hover:border-white/30 transition-all"
                  >
                    إنشاء حساب
                  </Link>
                </div>
              </div>
            )}

            <SellerForm
              letters={refs.letters}
              types={refs.types}
              cities={refs.cities}
              isLoggedIn={Boolean(viewer)}
            />

            {/* Seller Guarantee & Help Footer Cards */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-3xl border-2 border-gold/40 bg-gradient-to-br from-[#18253f]/88 via-[#141f35]/90 to-[#101a2d]/88 backdrop-blur-xl p-7 shadow-[0_20px_45px_-10px_rgba(16,23,40,0.18)] hover:border-gold/70 transition-all">
                <h3 className="flex items-center gap-2.5 text-base font-black text-white">
                  <ShieldCheck size={20} className="text-gold" />
                  <span>إرشادات اعتماد وعرض اللوحة</span>
                </h3>
                <ul className="mt-4 space-y-3 text-xs sm:text-sm leading-relaxed text-slate-200 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 shrink-0" />
                    <span>تُراجع المستندات بدقة للتأكد من مطابقة السجل المروري للمركبة.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 shrink-0" />
                    <span>يتولى مستشارو المنصة تقدير السعر الافتتاحي بالتشاور المباشر مع المالك.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 shrink-0" />
                    <span>يتم توثيق شروط المزاد وقيمة التأمين الإلزامي للمشاركين لضمان جدية المزايدات.</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-3xl border-2 border-gold/40 bg-gradient-to-br from-[#18253f]/88 via-[#141f35]/90 to-[#101a2d]/88 backdrop-blur-xl p-7 shadow-[0_20px_45px_-10px_rgba(16,23,40,0.18)] hover:border-gold/70 transition-all flex flex-col justify-between">
                <div>
                  <h3 className="flex items-center gap-2.5 text-base font-black text-gold">
                    <HelpCircle size={20} className="text-gold" />
                    <span>هل تحتاج استشارة خاصة لتقييم لوحتك؟</span>
                  </h3>
                  <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-200 font-medium">
                    مستشارو المكتب الخاص جاهزون للإجابة على جميع استفساراتك وتقديم تقييم فني وقيمة تقديرية للوحتك المميزة قبل اعتمادها وطرحها في المزاد.
                  </p>
                  <div className="mt-4 rounded-2xl bg-gold/15 border border-gold/30 p-3.5 text-xs text-gold-light font-medium leading-relaxed">
                    خدمة حصرية وسرية تامة مخصصة لكبار الملاك ومقتني اللوحات النادرة في المملكة.
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10">
                  <a
                    href="https://wa.me/966500000000"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-gold w-full py-3.5 text-xs sm:text-sm font-black shadow-lg inline-flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={17} />
                    <span>تواصل مع مستشار المزادات عبر واتساب</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
