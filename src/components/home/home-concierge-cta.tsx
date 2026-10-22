import Link from 'next/link';
import { ArrowLeft, Crown, MessageSquare, ShieldCheck } from 'lucide-react';
import { ScrollReveal } from '@/components/home-motion';

export function HomeConciergeCta() {
  return (
    <section className="relative overflow-hidden bg-[#F7F6F3] pt-2 pb-16 sm:pb-24 select-none">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal
          direction="up"
          delay={80}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#D9BB81]/30 bg-gradient-to-b from-[#0B182B] to-[#071222] p-8 sm:p-12 lg:p-14 text-white shadow-[0_24px_50px_-12px_rgba(8,22,43,0.3)] text-center"
        >
          {/* Subtle Top Specular Edge Line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D9BB81]/50 to-transparent pointer-events-none" />

          {/* Ambient Radial Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#D9BB81]/10 blur-3xl pointer-events-none rounded-full" />

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            {/* VIP Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D9BB81]/35 bg-white/[0.05] px-3.5 py-1 text-xs sm:text-[13px] font-semibold text-[#D9BB81] backdrop-blur-md mb-4 shadow-2xs">
              <Crown size={13} className="text-[#D9BB81] shrink-0" />
              <span className="tracking-wide">خدمة كونسيرج ومستشاري النخبة</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            </div>

            {/* Clean Punchy Headline */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug">
              هل ترغب في عرض لوحتك أو اقتناء لوحة نادرة؟
            </h2>

            {/* Concise 1-Line Subtitle */}
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto font-normal">
              مستشارو FBS متاحون لتقديم التقييم المعتمد والدعم التنفيذي الفوري بأعلى درجات الخصوصية.
            </p>

            {/* Two Balanced Action Buttons */}
            <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
              {/* Primary Action Button: اعرض لوحتك في المزاد */}
              <Link
                href="/sell-your-plate"
                className="group w-full sm:w-auto min-w-[210px] h-11 sm:h-12 px-6 rounded-xl bg-gradient-to-r from-[#D9BB81] via-[#E2C792] to-[#C9A253] hover:from-[#E2C792] hover:to-[#D9BB81] text-[#0A1628] text-xs sm:text-sm font-bold shadow-md hover:shadow-[0_0_20px_rgba(217,187,129,0.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>اعرض لوحتك في المزاد</span>
                <ArrowLeft size={15} className="text-[#0A1628] transition-transform duration-200 group-hover:-translate-x-1" />
              </Link>

              {/* Secondary VIP Direct Line: تحدث مع مستشار خاص */}
              <a
                href="https://wa.me/966500000000"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full sm:w-auto min-w-[210px] h-11 sm:h-12 px-6 rounded-xl border border-white/15 bg-white/[0.06] hover:bg-white/[0.12] hover:border-[#D9BB81]/50 text-white flex items-center justify-center gap-2 text-xs sm:text-sm font-bold backdrop-blur-md active:scale-[0.98] transition-all cursor-pointer"
              >
                <MessageSquare size={16} className="text-emerald-400 shrink-0" />
                <span>تحدث مع مستشار خاص</span>
                <ArrowLeft size={14} className="text-slate-400 transition-transform duration-200 group-hover:-translate-x-1" />
              </a>
            </div>

            {/* Minimalist Trust Reassurance Strip */}
            <div className="mt-6 pt-5 border-t border-white/10 w-full flex items-center justify-center gap-4 sm:gap-6 text-[11px] sm:text-xs text-slate-400 font-medium flex-wrap">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-400 shrink-0" />
                <span>سرية تامة ومطلقة</span>
              </span>
              <span className="text-white/20 select-none">•</span>
              <span>تقييم فوري معتمد</span>
              <span className="text-white/20 select-none">•</span>
              <span>إشراف رسمي مباشر</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

