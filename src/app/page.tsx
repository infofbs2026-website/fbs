import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpLeft,
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileCheck,
  Gavel,
  Headphones,
  HelpCircle,
  Landmark,
  MessageSquare,
  Radio,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Trophy
} from 'lucide-react';
import { PlateCard, PlateVisualizer } from '@/components/ui';
import { HeroCinematic } from '@/components/hero-cinematic';
import { SarSymbol } from '@/components/sar-symbol';
import { getMarketplace } from '@/modules/marketplace/service';
import type { MarketplacePlate } from '@/modules/marketplace/types';
import { fallbackPlates } from '@/modules/marketplace/mock-data';
import { ScrollReveal, StaggerGrid, CountUp } from '@/components/home-motion';

/* Bespoke SVG for listing a new plate (Authentic plate frame with plus badge) */
function SvgPlatePlus({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="5" width="20" height="14" rx="3.5" stroke="currentColor" strokeWidth="1.8" />
      <line x1="8" y1="5" x2="8" y2="19" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2 2" />
      <path d="M14 9.5v5M11.5 12h5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export const dynamic = 'force-dynamic';

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

export default async function Home() {
  const market = await getMarketplace({ pageSize: 12 });
  const displayPlates = market.plates.length > 0 ? market.plates : fallbackPlates;
  const liveAuctions = displayPlates.filter((p) => p.auction?.status === 'LIVE');
  const endingSoonAuctions = displayPlates.filter(
    (p) => p.auction && (p.auction.status === 'LIVE' || p.auction.status === 'REGISTRATION_OPEN')
  );

  return (
    <>
      {/* ============================================================== */}
      {/* 1 & 2. HERO CINEMATIC & CONCIERGE SEARCH (WEBM VIDEO + CASCADE) */}
      {/* ============================================================== */}
      <HeroCinematic
        initialPlate={liveAuctions[0] || displayPlates[0]}
        allLivePlates={liveAuctions.length > 0 ? liveAuctions : displayPlates.filter((p) => p.auction).slice(0, 5)}
      />

      {/* ============================================================== */}
      {/* 3. LIVE AUCTIONS SECTION: DIRECT REAL-TIME COMPETITION          */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fbfcfe] via-[#f4f7fb] to-[#edf2f8] pt-16 sm:pt-20 pb-20 sm:pb-24">
        {/* Ambient Subtle Procedural Glows & Contours */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <div className="absolute -top-24 start-1/4 h-[450px] w-[700px] rounded-full bg-gradient-to-br from-emerald-500/10 via-gold/10 to-transparent blur-[130px]" />
          <div className="absolute -bottom-24 end-1/4 h-[400px] w-[600px] rounded-full bg-gradient-to-tl from-gold/15 via-transparent to-transparent blur-[120px]" />
          <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1440 800" aria-hidden="true">
            <path d="M-100 200 C 450 50, 950 450, 1540 180" fill="none" stroke="#d9b87f" strokeWidth="1.5" />
            <path d="M-100 300 C 550 150, 1050 550, 1540 260" fill="none" stroke="#d9b87f" strokeWidth="1" strokeDasharray="6 8" />
          </svg>
        </div>

        <div className="container-fbs relative z-10">
          <ScrollReveal direction="up" delay={50}>
            <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                {/* Prestige Live Eyebrow Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-gold/45 bg-gradient-to-r from-gold/20 via-gold/10 to-amber-500/10 px-4.5 py-1.5 text-xs sm:text-sm font-black text-navy-deep backdrop-blur-md shadow-[0_2px_12px_rgba(217,184,127,0.22)] mb-3.5">
                  <Radio size={16} className="text-gold-dark shrink-0 animate-pulse" />
                  <span className="tracking-wide">منافسة حية ومباشرة الآن</span>
                </div>

                {/* Commanding Luxury Headline */}
                <h2 className="text-3xl font-black tracking-tight text-navy sm:text-4xl lg:text-[2.65rem] leading-tight">
                  <span>المزادات</span>{' '}
                  <span className="bg-gradient-to-r from-[#976a26] via-[#cb9b48] to-[#976a26] bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                    المباشرة الحية
                  </span>
                </h2>

                <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-600 font-medium">
                  لوحات استثنائية ونادرة تخضع للمزايدة الآن في الوقت الفعلي مع تمديد تلقائي عادل وتوثيق رسمي فوري.
                </p>
              </div>

              {/* Header Action Button */}
              <Link
                href="/auctions/live"
                className="group inline-flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white/95 px-5 py-3 text-sm font-black text-navy shadow-sm transition-all duration-300 hover:border-gold hover:shadow-[0_8px_20px_rgba(217,184,127,0.2)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>جميع المزادات الحية</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-gold/20 via-gold/10 to-transparent text-gold-dark border border-gold/40 transition-transform duration-300 group-hover:-translate-x-1">
                  <ArrowLeft size={15} />
                </span>
              </Link>
            </div>

            {/* Live Market Indicators Micro-bar */}
            <div className="mb-8 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-600">
              <div className="inline-flex items-center gap-2 rounded-xl bg-white/85 border border-slate-200/80 px-3.5 py-1.5 backdrop-blur-md shadow-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-800">مزايدة لحظية نشطة</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl bg-white/85 border border-slate-200/80 px-3.5 py-1.5 backdrop-blur-md shadow-xs">
                <ShieldCheck size={14} className="text-gold-accent" />
                <span className="text-slate-800">توثيق رسمي مسبق للملكية</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl bg-white/85 border border-slate-200/80 px-3.5 py-1.5 backdrop-blur-md shadow-xs">
                <Clock size={14} className="text-gold-accent" />
                <span className="text-slate-800">تمديد تلقائي عادل (Anti-Sniping)</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Cards Grid: Staggered Cascading Reveal */}
          <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" baseDelay={130}>
            {liveAuctions.slice(0, 3).map((plate) => (
              <PlateCard key={plate.id} plate={plate} />
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. ENDING SOON & UPCOMING SECTION                              */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden border-t border-[#d9b87f]/20 bg-gradient-to-b from-[#fbfcfe] via-[#f4f7fb] to-[#edf2f8] py-20 sm:py-24">
        {/* Ambient Subtle Procedural Glows & Contours */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <div className="absolute -top-24 start-1/3 h-[450px] w-[700px] rounded-full bg-gradient-to-br from-amber-500/10 via-gold/10 to-transparent blur-[130px]" />
          <div className="absolute -bottom-24 end-1/4 h-[400px] w-[600px] rounded-full bg-gradient-to-tl from-gold/15 via-transparent to-transparent blur-[120px]" />
          <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1440 800" aria-hidden="true">
            <path d="M-100 280 C 420 80, 920 480, 1540 200" fill="none" stroke="#d9b87f" strokeWidth="1.5" />
            <path d="M-100 380 C 520 180, 1020 580, 1540 280" fill="none" stroke="#d9b87f" strokeWidth="1" strokeDasharray="6 8" />
          </svg>
        </div>

        <div className="container-fbs relative z-10">
          <ScrollReveal direction="up" delay={50}>
            <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                {/* Prestige Eyebrow Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-gold/45 bg-gradient-to-r from-gold/20 via-gold/10 to-amber-500/10 px-4.5 py-1.5 text-xs sm:text-sm font-black text-navy-deep backdrop-blur-md shadow-[0_2px_12px_rgba(217,184,127,0.22)] mb-3.5">
                  <Clock size={16} className="text-gold-dark shrink-0" />
                  <span className="tracking-wide">فرص اللحظات الأخيرة</span>
                </div>

                {/* Commanding Luxury Headline */}
                <h2 className="text-3xl font-black tracking-tight text-navy sm:text-4xl lg:text-[2.65rem] leading-tight">
                  <span>تنتهي قريباً &</span>{' '}
                  <span className="bg-gradient-to-r from-[#976a26] via-[#cb9b48] to-[#976a26] bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                    مزادات مرتقبة
                  </span>
                </h2>

                <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-600 font-medium">
                  اغتنم فرصة المزايدة قبل إغلاق الجلسة أو جهز تأمينك البنكي للمزادات الحصرية القادمة.
                </p>
              </div>

              {/* Header Action Button */}
              <Link
                href="/auctions"
                className="group inline-flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white/95 px-5 py-3 text-sm font-black text-navy shadow-sm transition-all duration-300 hover:border-gold hover:shadow-[0_8px_20px_rgba(217,184,127,0.2)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>جدول المزادات الكامل</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-gold/20 via-gold/10 to-transparent text-gold-dark border border-gold/40 transition-transform duration-300 group-hover:-translate-x-1">
                  <ArrowLeft size={15} />
                </span>
              </Link>
            </div>

            {/* Upcoming Market Indicators Micro-bar */}
            <div className="mb-8 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-600">
              <div className="inline-flex items-center gap-2 rounded-xl bg-white/85 border border-slate-200/80 px-3.5 py-1.5 backdrop-blur-md shadow-xs">
                <Clock size={14} className="text-amber-600" />
                <span className="text-slate-800">إغلاق وشيك للجلسات</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl bg-white/85 border border-slate-200/80 px-3.5 py-1.5 backdrop-blur-md shadow-xs">
                <ShieldCheck size={14} className="text-gold-accent" />
                <span className="text-slate-800">تفويض بنكي معتمد</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl bg-white/85 border border-slate-200/80 px-3.5 py-1.5 backdrop-blur-md shadow-xs">
                <BadgeCheck size={14} className="text-gold-accent" />
                <span className="text-slate-800">لوحات نخبة مؤكدة النشر</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Cards Grid: Staggered Cascading Reveal */}
          <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" baseDelay={130}>
            {endingSoonAuctions.slice(0, 3).map((plate) => (
              <PlateCard key={plate.id} plate={plate} />
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. PLATFORM STATISTICS: TRUST & PERFORMANCE METRICS            */}
      {/* ============================================================== */}
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

      {/* ============================================================== */}
      {/* 6. HOW FBS WORKS: PRESTIGE STEP-BY-STEP JOURNEY               */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden border-t border-[#d9b87f]/25 bg-gradient-to-b from-[#fbfcfe] via-[#f4f7fb] to-[#edf2f8] py-20 sm:py-28">
        {/* Ambient Subtle Procedural Glows & Contours */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <div className="absolute -top-32 start-1/2 -translate-x-1/2 h-[450px] w-[750px] rounded-full bg-gradient-to-b from-gold/15 via-gold/5 to-transparent blur-[130px]" />
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1440 800" aria-hidden="true">
            <path d="M-100 250 C 400 450, 950 150, 1540 380" fill="none" stroke="#d9b87f" strokeWidth="1.5" />
            <path d="M-100 350 C 500 550, 1050 250, 1540 460" fill="none" stroke="#d9b87f" strokeWidth="1" strokeDasharray="6 8" />
          </svg>
        </div>

        <div className="container-fbs relative z-10">
          <ScrollReveal direction="up" className="mb-14 text-center">
            {/* Prestige Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/45 bg-gradient-to-r from-gold/20 via-gold/10 to-amber-500/10 px-4.5 py-1.5 text-xs sm:text-sm font-black text-navy-deep backdrop-blur-md shadow-[0_2px_12px_rgba(217,184,127,0.22)] mb-4">
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

      {/* ============================================================== */}
      {/* 7. WHY FBS: PILLARS OF TRUST & AUTOMOTIVE SECURITY             */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden border-t border-[#d9b87f]/25 bg-gradient-to-b from-[#fbfcfe] via-[#f4f7fb] to-[#edf2f8] py-20 sm:py-28">
        {/* Ambient Subtle Procedural Glows & Contours */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <div className="absolute -top-32 start-1/3 h-[500px] w-[700px] rounded-full bg-gradient-to-br from-gold/15 via-gold/5 to-transparent blur-[130px]" />
          <div className="absolute -bottom-32 end-10 h-[450px] w-[600px] rounded-full bg-gradient-to-tl from-navy/10 via-blue-900/5 to-transparent blur-[120px]" />
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1440 800" aria-hidden="true">
            <path d="M-100 350 C 400 150, 900 600, 1540 220" fill="none" stroke="#d9b87f" strokeWidth="1.5" />
            <path d="M-100 450 C 500 250, 1000 680, 1540 300" fill="none" stroke="#d9b87f" strokeWidth="1" strokeDasharray="6 8" />
          </svg>
        </div>

        <div className="container-fbs relative z-10 grid gap-10 lg:grid-cols-[1fr_1.26fr] lg:items-stretch xl:gap-14">
          <ScrollReveal direction="right" delay={80} className="flex flex-col justify-between h-full">
            <div>
              {/* Prestige Eyebrow Badge - Without glowing dot */}
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/45 bg-gradient-to-r from-gold/20 via-gold/10 to-amber-500/10 px-4 py-1.5 text-xs sm:text-sm font-black text-navy-deep backdrop-blur-md shadow-[0_2px_12px_rgba(217,184,127,0.22)] mb-4">
                <BadgeCheck size={16} className="text-gold-dark shrink-0" />
                <span className="tracking-wide">لماذا فارس بن سعود؟</span>
              </div>

              {/* Commanding Luxury Headline - Single Line */}
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl lg:text-[1.95rem] xl:text-[2.25rem] leading-tight text-navy">
                <span>التميّز خيارك.</span>{' '}
                <span className="bg-gradient-to-r from-[#976a26] via-[#cb9b48] to-[#976a26] bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)] whitespace-nowrap">
                  والثقة هي ضماننا.
                </span>
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

              {/* Action Button - Exact Same Full Width as Cards & Uniform Gap */}
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
                      <span className="font-norwester text-2xl font-black text-slate-300 group-hover:text-gold transition-colors select-none" dir="ltr">
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

      {/* ============================================================== */}
      {/* 8. FAQ ACCORDION: FREQUENTLY ASKED QUESTIONS                   */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden border-t border-[#d9b87f]/20 bg-gradient-to-b from-[#fbfcfe] via-[#f4f7fb] to-[#edf2f8] py-20 sm:py-28">
        {/* Ambient Lighting & Aerospace Grid */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <div className="absolute top-1/4 start-1/2 -translate-x-1/2 h-[450px] w-[900px] rounded-full bg-gradient-to-b from-gold/10 via-amber-500/5 to-transparent blur-[120px]" />
          <div className="absolute bottom-10 start-10 h-[320px] w-[380px] rounded-full bg-blue-500/5 blur-[95px]" />
          <svg className="absolute inset-0 h-full w-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="faq-aerospace-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#0b172a" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#faq-aerospace-grid)" />
          </svg>
        </div>

        <div className="container-fbs relative z-10">
          {/* Header */}
          <ScrollReveal direction="up" className="mb-12 sm:mb-16 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              {/* Unified Luxury Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/45 bg-gradient-to-r from-gold/20 via-gold/10 to-amber-500/10 px-4.5 py-1.5 text-xs sm:text-sm font-black text-navy-deep backdrop-blur-md shadow-[0_2px_12px_rgba(217,184,127,0.22)] mb-3.5">
                <HelpCircle size={16} className="text-gold-dark shrink-0" />
                <span className="tracking-wide">مركز المعرفة والشفافية</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-navy-deep tracking-tight">
                الأسئلة{' '}
                <span className="bg-gradient-to-r from-[#976a26] via-[#cb9b48] to-[#976a26] bg-clip-text text-transparent">
                  الشائعة والمساعدة
                </span>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                إجابات تفصيلية ودقيقة لكافة الجوانب التشغيلية، من آليات المزايدة والتفويض البنكي إلى التوثيق ونقل الملكية المعتمد.
              </p>
            </div>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full border border-gold/40 bg-white/90 px-5 py-2.5 text-xs sm:text-sm font-bold text-navy-deep shadow-sm hover:border-gold hover:bg-gold/10 hover:text-gold-dark transition-all duration-300"
            >
              <span>دليل الأسئلة الشامل</span>
              <ArrowLeft size={16} />
            </Link>
          </ScrollReveal>

          {/* Trust Highlights Strip */}
          <StaggerGrid className="mb-10 grid grid-cols-1 sm:grid-cols-3 gap-3" baseDelay={80}>
            {[
              { label: 'توثيق 100% عبر النفاذ الوطني وأبشر', desc: 'مطابقة رسمية لجميع المزايدين والملاك' },
              { label: 'حساب ضمان بنكي معتمد Escrow', desc: 'حماية كاملة لأموال المشتري حتى استلام اللوحة' },
              { label: 'فك حجز فوري للتأمين دون خصم', desc: 'إلغاء التفويض آلياً لجميع المزايدين غير الفائزين' }
            ].map((chip, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-xl border border-gold/25 bg-white/80 p-3.5 backdrop-blur-sm shadow-xs"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold-dark font-black">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black text-navy-deep">{chip.label}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{chip.desc}</div>
                </div>
              </div>
            ))}
          </StaggerGrid>

          {/* 10 Comprehensive FAQ Items in 2 Symmetrical Luxury Columns */}
          <ScrollReveal direction="up" delay={100} className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4.5 items-start">
            {/* Column 1: Items 1 to 5 */}
            <div className="space-y-3 sm:space-y-3.5">
              {[
                {
                  id: '01',
                  category: 'المزادات والمزايدة',
                  q: 'كيف أشارك في مزادات اللوحات؟ وما هي شروط الأهلية؟',
                  a: 'يتطلب الاشتراك إنشاء حساب موثّق وتأكيد الهوية عبر النفاذ الوطني الموحد (أبشر) لضمان موثوقية المزايدين. بعد تسجيل الدخول، يمكنك استعراض المزاد المطلوب، والموافقة على الشروط، وتفويض مبلغ التأمين المالي المخصص عبر بطاقتك البنكية (Pre-Authorization). فور اعتماد التفويض، يُفعّل حسابك فوراً لتقديم العروض الحية والتنافس المباشر.',
                  badge: 'توثيق فوري عبر النفاذ الوطني'
                },
                {
                  id: '02',
                  category: 'الضمان المالي والتأمين',
                  q: 'ما هو مصير مبلغ التأمين لغير الفائزين؟ ومتى يُفك الحجز؟',
                  a: 'يتم التعامل مع مبلغ التأمين كحجز بنكي مؤقت (Pre-authorization Hold) دون خصمه الفعلي من رصيدك. فور إغلاق المزاد ورسوه على المزايد الفائز، يصدر نظام المنصة أمراً آلياً وفورياً بإلغاء التفويض (Void) لكافة المزايدين الآخرين دون أي خصومات أو رسوم، ويعود المبلغ المتاح في حسابك فوراً أو خلال 24 ساعة بحسب سياسة البنك المصدر لبطاقتك.',
                  badge: 'إلغاء حجز فوري 100% بدون استقطاع'
                },
                {
                  id: '03',
                  category: 'التوثيق والتحقق',
                  q: 'كيف تضمن المنصة صحة ملكية اللوحة وخلوها من الموانع؟',
                  a: 'تطبّق المنصة بروتوكول تدقيق صارم بالتعاون مع المرجعيات النظامية؛ يُلزم البائع برفع رخصة سير المركبة (الاستمارة) سارية المفعول، ويقوم فريق التحقق بمطابقة بيانات المالك والرقم التسلسلي وسجل اللوحة للتأكد القاطع من خلو اللوحة من أي حجوزات قضائية، مخالفات مقيّدة، أو موانع تمنع نقل الملكية قبل اعتماد المزاد.',
                  badge: 'فحص جنائي ونظامي شامل'
                },
                {
                  id: '04',
                  category: 'المزادات والمزايدة',
                  q: 'ما هي ميزة منع القنص (Anti-Sniping) في اللحظات الأخيرة؟',
                  a: 'ميزة منع القنص هي خوارزمية ذكية تهدف إلى حماية المزايدين من العروض المباغتة في الثواني الأخيرة؛ إذا تم تقديم أي مزايدة خلال آخر 120 ثانية من نهاية المزاد، يتم تمديد وقت المزاد تلقائياً بدقيقتين إضافيتين. يتكرر هذا التمديد مع كل مزايدة جديدة حتى تنقضي الدقيقتان دون مزايدة أخرى، مما يضمن عدالة المنافسة واستقرار السعر الحقيقي.',
                  badge: 'تمديد ديناميكي لضمان الشفافية'
                },
                {
                  id: '05',
                  category: 'نقل الملكية والمرور',
                  q: 'كيف تتم إجراءات نقل الملكية رسمياً؟ وهل يلزم مراجعة المرور؟',
                  a: 'لا تتطلب العملية أي زيارة حضورية لإدارات المرور؛ تتم إجراءات نقل الملكية رقمياً عبر خدمة مبايعة اللوحات المعتمدة في منصة "أبشر" أو بالتنسيق المباشر مع شبكة معارض السيارات المعتمدة الشريكة لـ FBS في مدينتك. يتولى مستشار المنصة الخاص إدارة وتنسيق الخطوات وإصدار رخصة السير المحدثة وتسليمها لك خلال 48 إلى 72 ساعة عمل.',
                  badge: 'نقل ملكية رقمي دون مراجعة فروع المرور'
                }
              ].map((item) => (
                <details
                  key={item.id}
                  className="luxury-card group rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-sm p-4 sm:p-4.5 transition-all duration-300 hover:border-gold/50 hover:shadow-md open:border-gold/60 open:shadow-[0_8px_30px_rgba(217,184,127,0.12)] open:bg-white"
                >
                  <summary className="flex cursor-pointer select-none list-none items-center justify-between gap-3 text-start [&::-webkit-details-marker]:hidden">
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-md border border-gold/30 bg-gold/10 px-2 py-0.5 text-[10.5px] font-bold text-gold-dark">
                          {item.category}
                        </span>
                        <span className="text-[10.5px] font-mono text-slate-400 font-semibold">
                          #{item.id}
                        </span>
                      </div>
                      <h3 className="text-xs sm:text-[13px] md:text-sm font-black text-navy-deep leading-normal truncate group-hover:text-gold-dark transition-colors">
                        {item.q}
                      </h3>
                    </div>
                    <div className="shrink-0 flex h-8 w-8 sm:h-8.5 sm:w-8.5 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition-all duration-300 group-hover:border-gold/40 group-hover:text-gold group-open:bg-navy-deep group-open:border-navy-deep group-open:text-gold group-open:rotate-180 shadow-xs">
                      <ChevronDown size={16} />
                    </div>
                  </summary>
                  <div className="mt-3.5 border-t border-slate-100 pt-3.5 text-xs sm:text-[13.5px] leading-relaxed text-slate-600 font-medium">
                    <p>{item.a}</p>
                    {item.badge && (
                      <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 border border-slate-200/70">
                        <CheckCircle2 size={13} className="text-gold-dark shrink-0" />
                        <span>{item.badge}</span>
                      </div>
                    )}
                  </div>
                </details>
              ))}
            </div>

            {/* Column 2: Items 6 to 10 */}
            <div className="space-y-3 sm:space-y-3.5">
              {[
                {
                  id: '06',
                  category: 'الضمان المالي والتأمين',
                  q: 'كيف يحمي حساب الضمان (Escrow) قيمة اللوحة حتى استلامها؟',
                  a: 'تُودع قيمة اللوحة المسددة بالكامل في حساب ضمان بنكي محمي ومستقل (Escrow Account) خاضع لإشراف مالي محكم. تظل الأموال معلقة في الحساب المحمي ولا يتم تحويل أي مبالغ لحساب البائع إلا بعد التحقق التقني والنظامي من اكتمال نقل ملكية اللوحة رسمياً في سجلات المرور باسم المشتري واستلامه لإشعار النقل بنجاح.',
                  badge: 'حساب ضمان Escrow محمي ومعتمد'
                },
                {
                  id: '07',
                  category: 'البائعون وعرض اللوحات',
                  q: 'كيف يمكنني عرض لوحتي للبيع أو المزاد؟ وما هي الرسوم؟',
                  a: 'نعم، يمكنك تقديم طلب عرض لوحتك عبر صفحة "اعرض لوحتك الآن" وإرفاق صورة الاستمارة. يتواصل معك فريق التقييم خلال 24 ساعة للاتفاق على السعر الافتتاحي وسعر الحفظ السري (Reserve Price) لمنع بيع اللوحة بأقل من قيمتها المرجوة. لا نتقاضى أي رسوم تسجيل مسبقة؛ تُستحق عمولة المنصة فقط عند إتمام البيع بنجاح ونقل الملكية.',
                  badge: 'بدون أي رسوم مسبقة وسعر حفظ سري محمي'
                },
                {
                  id: '08',
                  category: 'السياسات والالتزامات',
                  q: 'ماذا يحدث في حال فوز مزايد وتخلّفه عن سداد القيمة؟',
                  a: 'يمنح النظام الفائز مهلة سداد نظامية قدرها 48 ساعة عمل لتحويل المتبقي من قيمة اللوحة عبر القنوات المصرفية المعتمدة. في حال تخلفه عن السداد دون عذر قاهر، يُصادر مبلغ التأمين المفوّض كشرط جزائي لتعويض البائع وتغطية الرسوم التشغيلية، وتُعرض اللوحة على المزايد الثاني المؤهل أو يُعاد جدولتها في جولة مزاد خاصة.',
                  badge: 'انضباط سوقي ملزم لحماية الجدية'
                },
                {
                  id: '09',
                  category: 'فئات اللوحات والرموز',
                  q: 'ما هي فئات وتصنيفات اللوحات المعتمدة في مزادات المنصة؟',
                  a: 'تختص منصة FBS باللوحات السعودية الفاخرة والاستثنائية بجميع الفئات المصرحة: اللوحات الخصوصية النادرة (أحادية الحرف والرقم، الثنائية، والثلاثية المميزة)، لوحات النقل الخاص للمؤسسات والأفراد، لوحات الدراجات النارية الفريدة، إضافة إلى اللوحات التي تحمل شعارات وطنية ورسمية مميزة وفق اللوائح المعتمدة.',
                  badge: 'تغطية شاملة لكافة الفئات المصرحة'
                },
                {
                  id: '10',
                  category: 'السرية والخصوصية',
                  q: 'هل بيانات المزايدين ومعلوماتهم الشخصية مشفرة وسرية؟',
                  a: 'بكل تأكيد؛ تلتزم FBS بأعلى معايير الأمن السيبراني والخصوصية المصرفية. تظهر العروض في سجل المزايدة الحي بأسماء مشفرة وأرقام تعريفية رمزية (مثل: مزايد #582) لمنع أي تأثير نفسي أو تكتلات غير عادلة، مع حماية الهويات والبيانات الشخصية والمالية بأحدث بروتوكولات التشفير المصرفي.',
                  badge: 'سرية مصرفية وتشفير كامل للهوية'
                }
              ].map((item) => (
                <details
                  key={item.id}
                  className="luxury-card group rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-sm p-4 sm:p-4.5 transition-all duration-300 hover:border-gold/50 hover:shadow-md open:border-gold/60 open:shadow-[0_8px_30px_rgba(217,184,127,0.12)] open:bg-white"
                >
                  <summary className="flex cursor-pointer select-none list-none items-center justify-between gap-3 text-start [&::-webkit-details-marker]:hidden">
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-md border border-gold/30 bg-gold/10 px-2 py-0.5 text-[10.5px] font-bold text-gold-dark">
                          {item.category}
                        </span>
                        <span className="text-[10.5px] font-mono text-slate-400 font-semibold">
                          #{item.id}
                        </span>
                      </div>
                      <h3 className="text-xs sm:text-[13px] md:text-sm font-black text-navy-deep leading-normal truncate group-hover:text-gold-dark transition-colors">
                        {item.q}
                      </h3>
                    </div>
                    <div className="shrink-0 flex h-8 w-8 sm:h-8.5 sm:w-8.5 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition-all duration-300 group-hover:border-gold/40 group-hover:text-gold group-open:bg-navy-deep group-open:border-navy-deep group-open:text-gold group-open:rotate-180 shadow-xs">
                      <ChevronDown size={16} />
                    </div>
                  </summary>
                  <div className="mt-3.5 border-t border-slate-100 pt-3.5 text-xs sm:text-[13.5px] leading-relaxed text-slate-600 font-medium">
                    <p>{item.a}</p>
                    {item.badge && (
                      <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 border border-slate-200/70">
                        <CheckCircle2 size={13} className="text-gold-dark shrink-0" />
                        <span>{item.badge}</span>
                      </div>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </ScrollReveal>

          {/* Bottom VIP Concierge & Unified Seller Call-To-Action Banner */}
          <ScrollReveal direction="up" delay={120} className="mt-14 sm:mt-20 relative overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-br from-[#0c1527] via-[#09101f] to-[#040812] p-8 sm:p-12 lg:p-14 text-white shadow-2xl flex flex-col justify-center">
            {/* Top gold accent line */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#d9b87f]/80 to-transparent pointer-events-none" />

            {/* Ambient background glows & aerospace grid */}
            <div className="absolute -top-28 end-0 h-80 w-80 rounded-full bg-gold/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-28 start-0 h-80 w-80 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 start-1/3 -translate-y-1/2 h-64 w-64 rounded-full bg-amber-500/5 blur-[90px] pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12">
              <div className="max-w-xl">
                {/* Expanded Luxury Concierge Tag with Generous Padding */}
                <div className="inline-flex items-center gap-2.5 rounded-full border border-gold/45 bg-gradient-to-r from-gold/25 via-gold/15 to-amber-500/10 px-5 py-2 text-xs sm:text-sm font-black text-gold-light backdrop-blur-md shadow-[0_2px_14px_rgba(217,184,127,0.25)] mb-3.5 sm:mb-4">
                  <Headphones size={16} className="text-gold shrink-0" />
                  <span className="tracking-wide">خدمة كونسيرج ومستشاري النخبة</span>
                </div>

                {/* Refined Balanced 2-Part Headline with Royal Gold Gradient */}
                <h3 className="text-xl sm:text-2xl lg:text-[28px] font-black text-white leading-snug tracking-tight">
                  هل ترغب في عرض لوحتك بالمزاد؟
                  <span className="block mt-1.5 sm:mt-2 bg-gradient-to-r from-[#e7cb97] via-[#f7e6c4] to-[#cb9b48] bg-clip-text text-transparent">
                    أو تحتاج مساعدة استشارية متخصصة؟
                  </span>
                </h3>
              </div>

              {/* 2 Buttons on Top, 1 Wide Full-Width Button on Bottom with Custom SVGs */}
              <div className="flex flex-col gap-3.5 sm:gap-4 w-full lg:w-[440px] shrink-0">
                {/* Top Row: 2 Buttons Side-by-Side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  {/* Button 1: اعرض لوحتك الآن */}
                  <Link
                    href="/sell-your-plate"
                    className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d9b87f] via-[#ecd5a5] to-[#cb9b48] px-4 py-3.5 text-xs sm:text-sm font-black text-navy-deep shadow-[0_4px_20px_rgba(217,184,127,0.35)] transition-all duration-300 hover:shadow-[0_6px_28px_rgba(217,184,127,0.55)] hover:scale-[1.02]"
                  >
                    <svg className="w-4.5 h-4.5 shrink-0 text-navy-deep" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="5" width="20" height="14" rx="3" />
                      <line x1="8" y1="5" x2="8" y2="19" strokeDasharray="2 2" />
                      <path d="M14 9.5v5M11.5 12h5" />
                    </svg>
                    <span>اعرض لوحتك</span>
                    <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
                  </Link>

                  {/* Button 2: تحدث مع مستشار FBS */}
                  <a
                    href="https://wa.me/966500000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3.5 text-xs sm:text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:border-gold/60 hover:bg-gold/15 hover:text-gold-light hover:scale-[1.02]"
                  >
                    <svg className="w-4.5 h-4.5 shrink-0 text-[#25D366] transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    <span>تحدث مع المستشار</span>
                  </a>
                </div>

                {/* Bottom Row: 1 Button Spanning Combined Width of the 2 Buttons Above */}
                <Link
                  href="/faq"
                  className="group flex items-center justify-center gap-2.5 rounded-xl border border-[#d9b87f]/35 bg-gradient-to-r from-[#0f172a] via-[#162238] to-[#0f172a] px-5 py-3.5 text-xs sm:text-sm font-black text-slate-200 shadow-md backdrop-blur-md transition-all duration-300 hover:border-gold/70 hover:text-gold-light hover:shadow-[0_4px_22px_rgba(217,184,127,0.22)]"
                >
                  <svg className="w-4.5 h-4.5 shrink-0 text-gold transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                    <path d="M6 6h10M6 10h10M6 14h6" />
                  </svg>
                  <span>دليل المركز المعرفي واللوائح المنظمة</span>
                  <ArrowLeft size={15} className="text-gold/80 transition-transform group-hover:-translate-x-1" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
