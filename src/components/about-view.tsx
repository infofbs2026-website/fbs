'use client';

import dynamic from 'next/dynamic';
import { AboutHero } from '@/components/about/about-hero';

// High-Performance Below-The-Fold Section Splitting:
// Strips non-critical JavaScript out of the entry bundle so the Hero paints and animates with zero competition.
// SSR remains enabled so search engines and users get instant semantic HTML without layout shifts (CLS = 0).
const AboutManifesto = dynamic(
  () => import('@/components/about/about-manifesto').then((m) => m.AboutManifesto),
  { ssr: true }
);

const AboutTiers = dynamic(
  () => import('@/components/about/about-tiers').then((m) => m.AboutTiers),
  { ssr: true }
);

const AboutPillars = dynamic(
  () => import('@/components/about/about-pillars').then((m) => m.AboutPillars),
  { ssr: true }
);

const AboutSimulator = dynamic(
  () => import('@/components/about/about-simulator').then((m) => m.AboutSimulator),
  { ssr: true }
);

const AboutFaqCta = dynamic(
  () => import('@/components/about/about-faq-cta').then((m) => m.AboutFaqCta),
  { ssr: true }
);

export function AboutView() {
  return (
    <div className="w-full">
      {/* 1. Fast Critical Hero with Staged Choreographed Entrance & High-Contrast Typography */}
      <AboutHero />

      {/* 2. Below-the-fold modular sections with chunked lazy hydration */}
      <div className="container-fbs py-16 sm:py-24 space-y-20 sm:space-y-28">
        <AboutManifesto />
        <AboutTiers />
        <AboutPillars />
        <AboutSimulator />
        <AboutFaqCta />
      </div>
    </div>
  );
}
