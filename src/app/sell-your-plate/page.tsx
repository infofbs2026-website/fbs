import type { Metadata } from 'next';
import Link from 'next/link';
import { SellerForm } from '@/components/seller-form';
import { getViewer } from '@/lib/auth';
import { getReferenceData } from '@/modules/marketplace/service';
import {
  ShieldCheck,
  Award,
  Lock,
  FileCheck2,
  MessageCircle,
  HelpCircle,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'اعرض لوحتك في مزادات النخبة | فارس بن سعود'
};

export default async function Sell() {
  const [viewer, refs] = await Promise.all([getViewer(), getReferenceData()]);

  return (
    <div className="w-full bg-[#F0F1F2] text-[#14243C]">
      {/* ============================================================= */}
      {/* 1. LUXURY DARK HERO SECTION WITH 3 INTEGRATED TRUST CARDS     */}
      {/* ============================================================= */}
      <section className="hero-luxury-ambient relative overflow-hidden border-b border-[#d9b87f]/25 bg-gradient-to-b from-[#091224] via-[#070d1a] to-[#040810] pt-28 sm:pt-34 lg:pt-38 pb-12 sm:pb-16 text-white">
        {/* Ambient background glows */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <div className="absolute -top-28 end-10 h-80 w-80 rounded-full bg-gold/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-28 start-10 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-[700px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
        </div>

        {/* Light Hero Contrast Overlay: Preserves ambient background glow & grid */}
        <div
          className="absolute inset-0 pointer-events-none select-none bg-gradient-to-b from-[#040811]/15 via-transparent to-[#040811]/20"
          aria-hidden="true"
        />

        <div className="container-fbs relative z-10 pt-2 sm:pt-3">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-3.5 flex flex-wrap items-center gap-2 pf-type-micro font-semibold text-gold-light">
            <Link href="/" className="hover:text-white transition-colors">
              الرئيسية
            </Link>
            <span className="text-gold/50">/</span>
            <Link href="/auctions" className="hover:text-white transition-colors text-slate-300">
              المزادات والوساطة
            </Link>
            <span className="text-gold/50">/</span>
            <span className="text-white font-bold">اعرض لوحتك</span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="pf-type-h1 font-black text-white tracking-tight">
              اعرض لوحتك في{' '}
              <span className="bg-gradient-to-r from-[#e7cb97] via-[#f7e6c4] to-[#cb9b48] bg-clip-text text-transparent">
                مزادات النخبة
              </span>
            </h1>
            <p className="mt-2.5 max-w-[62ch] pf-type-body text-slate-200 font-normal">
              منصتك الأولى في المملكة لعرض اللوحات الماسية والنادرة أمام نخبة المزايدين والمقتنين، مع ضمان حماية حقوق البائع وسرية المعاملات المالية.
            </p>
          </div>

          {/* 3 Prestige Trust Cards inside Hero */}
          <div className="mt-8 sm:mt-10 pt-6 border-t border-white/10">
            <div className="grid grid-cols-1 gap-3.5 sm:gap-4 sm:grid-cols-3">
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
                    className="group relative overflow-hidden flex items-center gap-3.5 rounded-2xl border border-gold/35 bg-gradient-to-br from-white/[0.09] via-[#0c162d]/90 to-[#081022]/95 backdrop-blur-xl p-4 sm:p-4.5 shadow-[0_10px_28px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.18)] hover:border-gold/70 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="pointer-events-none absolute -top-8 -end-8 h-24 w-24 rounded-full bg-gold/15 blur-2xl group-hover:bg-gold/25 transition-all duration-300" />

                    <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 border border-gold/45 text-gold-light shadow-[0_0_16px_rgba(217,184,127,0.2)] group-hover:scale-105 transition-transform duration-300">
                      <Icon size={20} />
                    </div>
                    <div className="relative z-10 min-w-0">
                      <h3 className="pf-type-h3 font-bold text-white group-hover:text-gold-light transition-colors tracking-tight">
                        {card.title}
                      </h3>
                      <p className="mt-0.5 pf-type-micro text-slate-300 font-medium">
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
      {/* 2. SOFT STONE LUXURY BODY (Reference: HomeHowItWorks #F0F1F2) */}
      {/* ============================================================= */}
      <section className="relative border-t border-[#E5E7EB] bg-[#F0F1F2] py-12 sm:py-16 lg:py-20 text-[#14243C] overflow-hidden">
        {/* Top Specular Edge Line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D9BB81]/40 to-transparent pointer-events-none" />

        <div className="container-fbs relative z-10">
          <div className="space-y-8 sm:space-y-10">
            {/* Guest Preview Notice Card (White Surface with Warm Gold Accents) */}
            {!viewer && (
              <div className="relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-2xl border border-[#E7E5DF] hover:border-[#D9BB81]/80 bg-white p-4 sm:p-5.5 shadow-[0_4px_16px_rgba(20,36,60,0.04)] transition-all duration-300">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D9BB81]/50 to-transparent pointer-events-none" />

                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#9E7B35]/40 bg-[#FAF7F0] text-[#8C6B2D] shadow-2xs">
                    <Lock size={20} />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="pf-type-h3 font-bold text-[#14243C]">
                        محاكي تسجيل اللوحات المميزة
                      </h2>
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#D9BB81]/50 bg-[#FAF7F0] px-2.5 py-0.5 pf-type-micro font-bold text-[#8C6B2D]">
                        وضع المعاينة المباشرة
                      </span>
                    </div>
                    <p className="pf-type-caption text-[#526071] font-normal mt-1">
                      يمكنك تجربة تحديد حروف وأرقام لوحتك بالأسفل ومعاينتها مباشرة. لحفظ اللوحة واعتمادها رسمياً، يُرجى تسجيل الدخول.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center shrink-0 gap-2.5 w-full md:w-auto">
                  <Link
                    href="/login?redirect=/sell-your-plate"
                    className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#14243C] hover:bg-[#08162B] text-white py-2.5 px-5 pf-type-caption font-bold shadow-xs transition-all active:scale-95"
                  >
                    <span>تسجيل الدخول</span>
                    <ArrowLeft size={14} className="text-[#D9BB81]" />
                  </Link>
                  <Link
                    href="/register?redirect=/sell-your-plate"
                    className="flex-1 md:flex-initial inline-flex items-center justify-center rounded-xl border border-[#D9BB81]/60 bg-[#FAF9F6] hover:bg-[#FAF7F0] hover:border-[#9E7B35] text-[#14243C] py-2.5 px-5 pf-type-caption font-bold transition-all active:scale-95"
                  >
                    إنشاء حساب
                  </Link>
                </div>
              </div>
            )}

            {/* Main Interactive Seller Form & Live Plate Visualizer */}
            <SellerForm
              letters={refs.letters}
              types={refs.types}
              cities={refs.cities}
              isLoggedIn={Boolean(viewer)}
            />

            {/* Seller Guarantee & Executive Concierge Footer Cards (Matching HomeHowItWorks Cards) */}
            <div className="grid gap-4 sm:gap-5 md:grid-cols-2 items-stretch">
              {/* Card 1: Official Guidelines */}
              <div className="group relative flex flex-col justify-between rounded-2xl bg-white border border-[#E7E5DF] hover:border-[#D9BB81]/80 p-5 sm:p-6 shadow-[0_4px_16px_rgba(20,36,60,0.04)] hover:shadow-[0_10px_24px_rgba(20,36,60,0.06)] transition-all duration-300 overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D9BB81]/40 to-transparent" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E7E5DF] bg-[#FAF9F6] text-[#14243C] group-hover:border-[#D9BB81]/60 transition-colors">
                      <ShieldCheck size={20} className="text-[#9E7B35]" />
                    </span>
                    <span className="inline-flex items-center rounded-full border border-[#E7E5DF] bg-[#FAF9F6] px-3 py-0.5 pf-type-micro font-semibold text-[#526071]">
                      ضوابط الاعتماد الرسمي
                    </span>
                  </div>

                  <h3 className="pf-type-h3 font-bold text-[#14243C] group-hover:text-[#9E7B35] transition-colors">
                    إرشادات اعتماد وعرض اللوحة
                  </h3>

                  <ul className="mt-3 space-y-2.5 pf-type-body text-[#526071]">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-[#9E7B35] mt-1 shrink-0" />
                      <span>تُراجع المستندات بدقة للتأكد من مطابقة السجل المروري للمركبة.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-[#9E7B35] mt-1 shrink-0" />
                      <span>يتولى مستشارو المنصة تقدير السعر الافتتاحي بالتشاور المباشر مع المالك.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-[#9E7B35] mt-1 shrink-0" />
                      <span>يتم توثيق شروط المزاد وقيمة التأمين الإلزامي للمشاركين لضمان جدية المزايدات.</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#ECE9E2] flex flex-wrap items-center justify-between gap-2 pf-type-micro font-medium text-[#526071]">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#E7E5DF] bg-[#FAF9F6] px-2.5 py-1">
                    <ShieldCheck size={13} className="text-[#9E7B35] shrink-0" />
                    <span>مراجعة وتدقيق معتمد</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse shrink-0" />
                    <span>حماية تعاقدية كاملة</span>
                  </span>
                </div>
              </div>

              {/* Card 2: Private Valuation Concierge */}
              <div className="group relative flex flex-col justify-between rounded-2xl bg-white border border-[#9E7B35]/60 p-5 sm:p-6 shadow-[0_12px_28px_rgba(20,36,60,0.06)] transition-all duration-300 overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#9E7B35]/60 to-transparent" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#9E7B35]/40 bg-[#FAF7F0] text-[#8C6B2D]">
                      <HelpCircle size={20} />
                    </span>
                    <span className="inline-flex items-center rounded-full border border-[#D9BB81]/50 bg-[#FAF7F0] px-3 py-0.5 pf-type-micro font-bold text-[#8C6B2D]">
                      خدمة كبار الملاك VIP
                    </span>
                  </div>

                  <h3 className="pf-type-h3 font-bold text-[#14243C]">
                    هل تحتاج استشارة خاصة لتقييم لوحتك؟
                  </h3>

                  <p className="mt-2 pf-type-body text-[#526071]">
                    مستشارو المكتب الخاص جاهزون للإجابة على جميع استفساراتك وتقديم تقييم فني وقيمة تقديرية للوحتك المميزة قبل اعتمادها وطرحها في المزاد.
                  </p>

                  <div className="mt-3.5 rounded-xl bg-[#FAF7F0] border border-[#D9BB81]/50 p-3 pf-type-caption text-[#8C6B2D] font-semibold">
                    خدمة حصرية وسرية تامة مخصصة لكبار الملاك ومقتني اللوحات النادرة في المملكة.
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#ECE9E2]">
                  <a
                    href="https://wa.me/966500000000"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full rounded-xl bg-[#14243C] hover:bg-[#08162B] text-white py-3 px-5 pf-type-caption font-bold shadow-xs transition-all inline-flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    <MessageCircle size={16} className="text-[#D9BB81] shrink-0" />
                    <span>تواصل مع مستشار المزادات عبر واتساب</span>
                    <ArrowLeft size={14} className="text-[#D9BB81] shrink-0" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
