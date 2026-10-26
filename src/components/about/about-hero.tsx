'use client';

import React from 'react';
import Link from 'next/link';
import { Gavel, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PlateVisualizer } from '@/components/ui';

export function AboutHero() {
  return (
    <section className="relative w-full overflow-hidden bg-navy border-b border-gold/30 pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 text-white">
      {/* Bespoke Riyadh Night Penthouse Showroom Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 z-0 bg-navy bg-cover bg-center"
        style={{ backgroundImage: 'url(/branding/about-hero-bg.jpg)' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(4, 9, 20, 0.86) 0%, rgba(6, 14, 28, 0.56) 48%, rgba(4, 9, 20, 0.92) 100%), radial-gradient(ellipse at 78% 45%, rgba(4, 10, 22, 0.72) 0%, rgba(4, 10, 22, 0.28) 68%)'
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      </div>

      <div className="container-fbs relative z-10">
        {/* Minimalist Breadcrumb */}
        <nav
          aria-label="مسار التصفح"
          className="pf-type-micro mb-5 flex items-center justify-center lg:justify-start gap-2 font-semibold text-slate-300"
        >
          <Link
            href="/"
            className="inline-flex min-h-6 items-center px-1 hover:text-gold-light transition-colors"
          >
            الرئيسية
          </Link>
          <span className="text-gold/60">/</span>
          <span className="text-gold-light font-bold">عن FBS</span>
        </nav>

        {/* Balanced VisionOS Glass Split */}
        <div className="pf-cq-split grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Start Column: Centered Executive Identity */}
          <div
            className="glass-vision min-w-0 flex flex-col items-center justify-between text-center p-6 sm:p-8 lg:p-9"
            style={{ backgroundColor: 'rgba(8, 18, 36, 0.78)' }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"
            />

            <div className="flex flex-col items-center">
              <div className="pf-type-micro inline-flex items-center justify-center gap-2 rounded-full border border-gold/35 bg-gold/10 px-3.5 py-1 font-bold text-gold-light">
                <ShieldCheck size={13} className="text-gold shrink-0" />
                <span>فارس بن سعود للوحات المميزة</span>
              </div>

              <h1 className="pf-type-h1 mt-4 font-black tracking-tight text-white">
                اللوحات السعودية النادرة
                <span className="block mt-1.5 gold-gradient-text">
                  مزادات علنية ووساطة خاصة
                </span>
              </h1>

              <p className="pf-type-body mt-3.5 text-slate-200/90 font-normal">
                عرض احترافي، ضمان مالي مستقل، ونقل إلكتروني عبر أبشر.
              </p>
            </div>

            <div className="mt-6 pt-5 w-full border-t border-white/10 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/auctions"
                className="btn btn-gold text-xs sm:text-[13px] font-black px-5 py-2.5"
              >
                <Gavel size={15} className="shrink-0" />
                <span>المزادات الحية</span>
              </Link>
              <Link
                href="/sell-your-plate"
                className="btn btn-outline-gold text-xs sm:text-[13px] font-bold px-5 py-2.5 group"
              >
                <span>اعرض لوحتك</span>
                <ArrowLeft
                  size={14}
                  className="text-gold shrink-0 transition-transform duration-200 group-hover:-translate-x-1"
                />
              </Link>
            </div>
          </div>

          {/* End Column: VisionOS Sovereign Crest & 3D Aluminum Plate Showcase */}
          <div
            data-pf-audit="about-hero-pedestal"
            className="glass-vision min-w-0 flex flex-col justify-between p-5 sm:p-8 lg:p-9"
            style={{ backgroundColor: 'rgba(8, 18, 36, 0.76)' }}
          >
            <div className="flex items-center justify-center sm:justify-between gap-4 border-b border-white/10 pb-4">
              <img
                src="/branding/calligraphy_transparent.png"
                alt="فارس بن سعود"
                className="h-8 w-auto object-contain select-none"
              />
              <span
                dir="ltr"
                className="hidden sm:inline-flex pf-cq-hide-narrow pf-type-micro rounded-full border border-gold/30 bg-gold/10 px-3 py-1 font-norwester tracking-widest text-gold shrink-0"
              >
                FBS · KSA
              </span>
            </div>

            <div className="pf-cq-pad-inner plate-tray-recessed-dark my-5 rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center">
              <PlateVisualizer
                lettersAr={['ق']}
                lettersEn={['Q']}
                numbers="1"
                plateType="private"
              />
            </div>

            {/* Minimalist Single-Line Verification Footer */}
            <div className="pf-type-micro pt-3 border-t border-white/10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-slate-300 font-semibold">
              <span className="inline-flex items-center gap-1.5 text-white">
                <CheckCircle2 size={13} className="text-gold shrink-0" />
                <span>تحقق مسبق للملكية</span>
              </span>
              <span className="text-gold/40">•</span>
              <span>ضمان مالي مستقل</span>
              <span className="text-gold/40">•</span>
              <span>نقل رسمي عبر أبشر</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
