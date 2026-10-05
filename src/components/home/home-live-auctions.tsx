import Link from 'next/link';
import { ArrowLeft, Clock, Radio, ShieldCheck } from 'lucide-react';
import { PlateCard } from '@/components/ui';
import type { MarketplacePlate } from '@/modules/marketplace/types';
import { ScrollReveal, StaggerGrid } from '@/components/home-motion';

interface HomeLiveAuctionsProps {
  liveAuctions: MarketplacePlate[];
}

export function HomeLiveAuctions({ liveAuctions }: HomeLiveAuctionsProps) {
  if (!liveAuctions || liveAuctions.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#f8fafc] to-[#f1f5f9] pt-16 sm:pt-20 pb-20 sm:pb-24 border-t border-[#d9b87f]/30">
      {/* Ambient Brand Subtle Geometry & Royal Gold/Navy Radiance (Strictly Brand Colors) */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        {/* Overhead Subtle Gold Halo */}
        <div
          className="absolute -top-32 start-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full blur-[120px] opacity-70"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(217,184,127,0.18) 0%, rgba(208,173,103,0.06) 50%, transparent 80%)'
          }}
        />

        {/* Subtle Navy Depth on corners */}
        <div className="absolute top-1/3 -start-32 h-[450px] w-[450px] rounded-full bg-navy/4 blur-[130px]" />
        <div className="absolute bottom-10 -end-32 h-[450px] w-[450px] rounded-full bg-gold/6 blur-[130px]" />

        {/* Micro-dot Luxury Architectural Matrix (Pure Brand Gold, 4% Opacity) */}
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage: 'radial-gradient(#d9b87f 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />

        {/* Golden Hairline Horizon Divider from Hero */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#d9b87f]/60 to-transparent" />
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

              {/* Commanding Luxury Headline - Unified Single Color */}
              <h2 className="text-3xl font-black tracking-tight text-navy-deep sm:text-4xl lg:text-[2.65rem] leading-tight">
                المزادات المباشرة الحية
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
            <div className="inline-flex items-center gap-2 rounded-xl bg-white/90 border border-slate-200/80 px-3.5 py-1.5 backdrop-blur-md shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-800">مزايدة لحظية نشطة</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl bg-white/90 border border-slate-200/80 px-3.5 py-1.5 backdrop-blur-md shadow-xs">
              <ShieldCheck size={14} className="text-gold-accent" />
              <span className="text-slate-800">توثيق رسمي مسبق للملكية</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl bg-white/90 border border-slate-200/80 px-3.5 py-1.5 backdrop-blur-md shadow-xs">
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
  );
}
