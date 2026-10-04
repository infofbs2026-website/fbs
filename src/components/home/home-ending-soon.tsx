import Link from 'next/link';
import { ArrowLeft, BadgeCheck, Clock, ShieldCheck } from 'lucide-react';
import { PlateCard } from '@/components/ui';
import type { MarketplacePlate } from '@/modules/marketplace/types';
import { ScrollReveal, StaggerGrid } from '@/components/home-motion';

interface HomeEndingSoonProps {
  endingSoonAuctions: MarketplacePlate[];
}

export function HomeEndingSoon({ endingSoonAuctions }: HomeEndingSoonProps) {
  if (!endingSoonAuctions || endingSoonAuctions.length === 0) return null;

  return (
    <section className="relative overflow-hidden border-t border-[#d9b87f]/20 bg-gradient-to-b from-[#fbfcfe] via-[#f4f7fb] to-[#edf2f8] py-20 sm:py-24">
      {/* Ambient Subtle Procedural Glows & Contours */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute -top-24 start-1/3 h-[450px] w-[700px] rounded-full bg-gradient-to-br from-amber-500/10 via-gold/10 to-transparent blur-[130px]" />
        <div className="absolute -bottom-24 end-1/4 h-[400px] w-[600px] rounded-full bg-gradient-to-tl from-gold/15 via-transparent to-transparent blur-[120px]" />
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.035]"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1440 800"
          aria-hidden="true"
        >
          <path d="M-100 280 C 420 80, 920 480, 1540 200" fill="none" stroke="#d9b87f" strokeWidth="1.5" />
          <path
            d="M-100 380 C 520 180, 1020 580, 1540 280"
            fill="none"
            stroke="#d9b87f"
            strokeWidth="1"
            strokeDasharray="6 8"
          />
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
  );
}
