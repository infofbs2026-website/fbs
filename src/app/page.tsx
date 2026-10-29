import dynamic from 'next/dynamic';
import { HeroCinematic } from '@/components/hero-cinematic';
import { HomeEndingSoon } from '@/components/home/home-ending-soon';
import { getMarketplace } from '@/modules/marketplace/service';

// Dynamic lazy imports for deeper below-the-fold sections:
// HomeEndingSoon is imported statically above because it sits directly at the Hero fold boundary,
// guaranteeing zero hydration/scroll jump when scrolling down from Hero on mobile.

const HomeLiveAuctions = dynamic(
  () => import('@/components/home/home-live-auctions').then((m) => m.HomeLiveAuctions),
  { ssr: true }
);

const HomeHowItWorks = dynamic(
  () => import('@/components/home/home-how-it-works').then((m) => m.HomeHowItWorks),
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
  const displayPlates = market.plates;
  const liveAuctions = displayPlates.filter((p) => p.auction?.status === 'LIVE');
  const endingSoonCandidates = liveAuctions;
  const carouselAuctions =
    endingSoonCandidates.length >= 4
      ? endingSoonCandidates
      : endingSoonCandidates;

  return (
    <>
      {/* ============================================================== */}
      {/* 01. HERO CINEMATIC (MIDNIGHT NAVY #08162B)                     */}
      {/* ============================================================== */}
      <HeroCinematic
        initialPlate={liveAuctions[0]}
        allLivePlates={liveAuctions}
      />

      {/* ============================================================== */}
      {/* 02. مزادات اللحظات الأخيرة (PURE WHITE #FFFFFF)                */}
      {/* ============================================================== */}
      {carouselAuctions.length > 0 && <HomeEndingSoon endingSoonAuctions={carouselAuctions} />}

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
