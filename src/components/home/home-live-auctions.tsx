import Link from 'next/link';
import { ArrowLeft, MapPin, Store } from 'lucide-react';
import { PlateVisualizer } from '@/components/ui';
import { SarSymbol } from '@/components/sar-symbol';
import type { MarketplacePlate } from '@/modules/marketplace/types';
import { ScrollReveal, StaggerGrid } from '@/components/home-motion';

interface HomeLiveAuctionsProps {
  liveAuctions: MarketplacePlate[];
}

function formatSar(halalas?: string | number | null) {
  if (!halalas) return '0';
  const num = Math.round(Number(halalas) / 100);
  return num.toLocaleString('en-US');
}

/**
 * Bespoke Luxury Diamond Gem SVG Icon for Eyebrow Badge (replaces generic star/asterisk)
 */
function LuxuryGemIcon({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Precision multifaceted luxury gem cut */}
      <path d="M6 3h12l4 7-10 11L2 10l4-7z" />
      <path d="M2 10h20" />
      <path d="M12 21L7.5 10 10 3" />
      <path d="M12 21l4.5-11L14 3" />
    </svg>
  );
}

/**
 * SimplifiedPlateCard:
 * Optimized for Premium Fluid UI across 4 columns (desktop), 3 columns (tablet),
 * and 2 columns (mobile) without clipping or awkward overflow.
 * Labeled exclusively as 'السعر المطلوب' (Direct Store Marketplace).
 */
function SimplifiedPlateCard({ plate }: { plate: MarketplacePlate }) {
  const rawPrice = plate.priceHalalas ?? plate.auction?.currentPriceHalalas ?? '0';
  const isTransport = plate.type?.includes('نقل') || plate.type?.includes('commercial');
  const isSmall = plate.type?.includes('صغيرة') || plate.type?.includes('رياض');

  return (
    <Link
      href={`/plates/${plate.slug}`}
      className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border border-[#E7E5DF] bg-white p-2.5 sm:p-3.5 shadow-2xs transition-all duration-300 hover:border-[#D9BB81] hover:shadow-[0_8px_24px_rgba(20,36,60,0.06)] hover:-translate-y-0.5 select-none"
    >
      {/* 1. Header: Plate Type & City Tag */}
      <div className="flex items-center justify-between pb-1.5 sm:pb-2 text-xs">
        <span
          className={`rounded-md sm:rounded-lg px-1.5 sm:px-2 py-0.5 text-[9.5px] sm:text-[11px] font-bold ${
            isTransport
              ? 'bg-amber-50 text-amber-800 border border-amber-200/80'
              : isSmall
              ? 'bg-slate-100 text-slate-700 border border-slate-200'
              : 'bg-[#FAF9F6] text-[#14243C] border border-[#E5E2D9]'
          }`}
        >
          {isTransport ? 'نقل خاص' : isSmall ? 'صغيرة' : 'خصوصي'}
        </span>

        <span className="inline-flex items-center gap-1 text-[9.5px] sm:text-[11px] font-medium text-[#64748B]">
          <MapPin size={11} className="text-[#9E7B35] shrink-0" />
          <span className="truncate max-w-[65px] sm:max-w-none">{plate.city || 'الرياض'}</span>
        </span>
      </div>

      {/* 2. Center: Authentic Saudi Plate in Clean Recessed Tray */}
      <div className="my-1 sm:my-2 flex items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-b from-[#FAF9F6] via-[#F1EEE7] to-[#E9E5DD] p-1 sm:p-2.5 h-[66px] sm:h-[88px] border border-[#E5E2D9] transition-all duration-300 group-hover:border-[#D9BB81]/60">
        <div className="w-full flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02] filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <PlateVisualizer
            lettersAr={plate.lettersAr}
            lettersEn={plate.lettersEn}
            numbers={plate.numbers}
            plateType={plate.type}
            compact
          />
        </div>
      </div>

      {/* 3. Footer: Asking Price ("السعر المطلوب") & View Action */}
      <div className="mt-1 sm:mt-1.5 flex items-center justify-between pt-1.5 sm:pt-2 border-t border-[#ECE9E2]">
        <div className="min-w-0">
          <span className="text-[9px] sm:text-[10px] font-semibold text-[#64748B] block leading-tight mb-0.5">
            السعر المطلوب
          </span>
          <div className="flex items-baseline gap-1 text-[#14243C]" dir="rtl">
            <span className="font-norwester text-[13.5px] sm:text-[16px] lg:text-[17px] font-black tracking-tight text-[#14243C] leading-none" dir="ltr">
              {formatSar(rawPrice)}
            </span>
            <SarSymbol className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#9E7B35] inline-block self-center shrink-0" />
          </div>
        </div>

        <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-md sm:rounded-lg bg-[#FAF9F6] text-[#14243C] border border-[#E5E2D9] transition-all duration-300 group-hover:bg-[#14243C] group-hover:text-white group-hover:border-[#14243C] shrink-0">
          <ArrowLeft size={11} className="transition-transform group-hover:-translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}

export function HomeLiveAuctions({ liveAuctions }: HomeLiveAuctionsProps) {
  if (!liveAuctions || liveAuctions.length === 0) return null;

  // Exactly 8 plates for 2 rows of 4 cards on desktop
  const displayPlates = liveAuctions.slice(0, 8);

  return (
    <section className="relative overflow-hidden bg-[#F7F6F3] py-14 sm:py-20 lg:py-24 border-b border-[#E7E5DF] text-[#14243C]">
      {/* Top 1px Specular Edge Line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D9BB81]/40 to-transparent pointer-events-none" />

      {/* Main Container: Constrained to ~1240px for generous breathing margins */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal direction="up" delay={50}>
          <div className="mb-6 sm:mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end text-center sm:text-start">
            <div className="flex flex-col items-center sm:items-start">
              {/* Prestige Eyebrow Badge with Bespoke Luxury Gem Icon */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D9BB81]/50 bg-white px-3.5 py-1 text-xs sm:text-[13px] font-bold text-[#8C6B2D] shadow-2xs mb-2.5 mx-auto sm:mx-0">
                <LuxuryGemIcon size={14} className="text-[#9E7B35] shrink-0" />
                <span className="tracking-wide">سوق النخبة · لوحات حصرية</span>
              </div>

              {/* Headline: Two-tone Royal Navy + Deep Warm Gold */}
              <h2 className="text-[clamp(1.75rem,1.35rem+1.2vw,2.45rem)] font-black tracking-tight leading-[1.25] text-center sm:text-start">
                <span className="text-[#14243C]">اللوحات </span>
                <span className="text-[#9E7B35]">المميزة</span>
              </h2>

              <p className="mt-2 max-w-xl text-[14px] sm:text-[15px] leading-[1.7] text-[#526071] font-normal text-center sm:text-start mx-auto sm:mx-0">
                تشكيلة منتقاة من أندر اللوحات الملكية والخصوصية المتاحة للشراء المباشر.
              </p>
            </div>

            {/* Desktop Action Button (Top Left in RTL) */}
            <Link
              href="/plates"
              className="group hidden sm:inline-flex items-center justify-center gap-2 rounded-xl border border-[#D9BB81]/60 bg-white px-4.5 py-2.5 text-xs sm:text-sm font-bold text-[#14243C] shadow-2xs transition-all duration-300 hover:border-[#9E7B35] hover:bg-[#FAF9F6] hover:shadow-xs hover:scale-[1.02] active:scale-[0.98] shrink-0"
            >
              <Store size={15} className="text-[#9E7B35] transition-transform duration-200 group-hover:scale-105" />
              <span>تصفح متجر اللوحات بالكامل</span>
              <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>

        {/* Responsive Grid: 4 columns on desktop (lg+), 3 columns on tablet (sm-md), 2 columns on mobile */}
        <StaggerGrid
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5 lg:gap-4.5"
          baseDelay={60}
        >
          {displayPlates.map((plate) => (
            <SimplifiedPlateCard key={plate.id} plate={plate} />
          ))}
        </StaggerGrid>

        {/* Mobile Action Button: Placed at the bottom of the section */}
        <div className="mt-6 flex sm:hidden justify-center w-full">
          <Link
            href="/plates"
            className="group w-full h-11 rounded-xl bg-[#14243C] hover:bg-[#08162B] text-white text-xs sm:text-sm font-bold shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <Store size={15} className="text-[#D9BB81]" />
            <span>تصفح متجر اللوحات بالكامل</span>
            <ArrowLeft size={14} className="text-slate-300 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

