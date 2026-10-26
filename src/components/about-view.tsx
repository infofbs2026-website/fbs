'use client';

import { AboutHero } from '@/components/about/about-hero';
import { AboutManifesto } from '@/components/about/about-manifesto';
import { AboutTiers } from '@/components/about/about-tiers';
import { AboutPillars } from '@/components/about/about-pillars';
import { AboutFaqCta } from '@/components/about/about-faq-cta';

export function AboutView() {
  return (
    <div className="w-full bg-paper">
      {/* 01. Cinematic Riyadh Showroom Hero & Sovereign Plate Pedestal */}
      <AboutHero />

      {/* 02. Brand Mandate & Three Operational Channels (#F7F6F3) */}
      <AboutManifesto />

      {/* 03. Dark Museum Vault Interactive Plate Archive (#08162B) */}
      <AboutTiers />

      {/* 04. Editorial Split & Frameless 4-Step Transfer Protocol (#F7F6F3) */}
      <AboutPillars />

      {/* 05. Executive Private Brokerage & Listing Finale (#F7F6F3) */}
      <AboutFaqCta />
    </div>
  );
}
