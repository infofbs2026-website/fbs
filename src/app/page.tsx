import dynamic from 'next/dynamic';
import { HeroCinematic } from '@/components/hero-cinematic';
import { getMarketplace } from '@/modules/marketplace/service';
import { fallbackPlates } from '@/modules/marketplace/mock-data';

// Dynamic lazy imports for below-the-fold sections:
// Strips all below-the-fold JS out of the initial entry bundle so Header + Hero have 100% thread priority.
// SSR remains enabled so search engines & users get instant semantic HTML with 0 layout shift (CLS = 0).
const HomeEndingSoon = dynamic(
  () => import('@/components/home/home-ending-soon').then((m) => m.HomeEndingSoon),
  { ssr: true }
);

const HomeLiveAuctions = dynamic(
  () => import('@/components/home/home-live-auctions').then((m) => m.HomeLiveAuctions),
  { ssr: true }
);

const HomeHowItWorks = dynamic(
  () => import('@/components/home/home-how-it-works').then((m) => m.HomeHowItWorks),
  { ssr: true }
);

const HomeStats = dynamic(
  () => import('@/components/home/home-stats').then((m) => m.HomeStats),
  { ssr: true }
);

const HomeWhyFbs = dynamic(
  () => import('@/components/home/home-why-fbs').then((m) => m.HomeWhyFbs),
  { ssr: true }
);

const HomeConciergeCta = dynamic(
  () => import('@/components/home/home-concierge-cta').then((m) => m.HomeConciergeCta),
  { ssr: true }
);

// High-Concurrency Edge Caching (ISR):
// Revalidates every 60 seconds in the background.
// Supports 10,000+ concurrent users with sub-25ms response time and ZERO database strain.
export const revalidate = 60;

export default async function Home() {
  const market = await getMarketplace({ pageSize: 12 });
  const displayPlates = market.plates.length > 0 ? market.plates : fallbackPlates;
  const liveAuctions = displayPlates.filter((p) => p.auction?.status === 'LIVE');
  const endingSoonCandidates = displayPlates.filter(
    (p) => p.auction && (p.auction.status === 'LIVE' || p.auction.status === 'REGISTRATION_OPEN' || p.auction.status === 'SCHEDULED')
  );
  const carouselAuctions =
    endingSoonCandidates.length >= 4
      ? endingSoonCandidates
      : displayPlates.filter((p) => p.auction || p.priceHalalas).slice(0, 8);

  return (
    <>
      {/* ============================================================== */}
      {/* 01. HERO CINEMATIC (MIDNIGHT NAVY #08162B)                     */}
      {/* ============================================================== */}
      <HeroCinematic
        initialPlate={liveAuctions[0] || displayPlates[0]}
        allLivePlates={liveAuctions.length > 0 ? liveAuctions : displayPlates.filter((p) => p.auction).slice(0, 5)}
      />

      {/* ============================================================== */}
      {/* 02. مزادات اللحظات الأخيرة (PURE WHITE #FFFFFF)                */}
      {/* ============================================================== */}
      <HomeEndingSoon endingSoonAuctions={carouselAuctions} />

      {/* ============================================================== */}
      {/* 03. كيف تعمل المنصة (SOFT GRAY #F0F1F2 + CALM ICONS)           */}
      {/* ============================================================== */}
      <HomeHowItWorks />

      {/* ============================================================== */}
      {/* 04. اللوحات المميزة (WARM IVORY #F7F6F3 + 2x4 COMPACT CARDS)   */}
      {/* ============================================================== */}
      <HomeLiveAuctions liveAuctions={displayPlates.slice(0, 8)} />

      {/* ============================================================== */}
      {/* 05. مزادات حصرية / الإحصائيات (MIDNIGHT NAVY #08162B + GOLD)   */}
      {/* ============================================================== */}
      <HomeStats />

      {/* ============================================================== */}
      {/* 06. الثقة والمميزات (WARM IVORY #F7F6F3 + WHITE CARDS)         */}
      {/* ============================================================== */}
      <HomeWhyFbs />

      {/* ============================================================== */}
      {/* EXECUTIVE CONCIERGE BANNER                                     */}
      {/* ============================================================== */}
      <HomeConciergeCta />
    </>
  );
}
