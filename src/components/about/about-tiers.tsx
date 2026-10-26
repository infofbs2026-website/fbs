'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Layers, ArrowLeft, Box } from 'lucide-react';
import { PlateVisualizer } from '@/components/ui';

export interface PlateTierData {
  id: string;
  tabLabel: string;
  rankTag: string;
  name: string;
  lettersAr: string[];
  lettersEn: string[];
  numbers: string;
  description: string;
}

export const plateTiers: PlateTierData[] = [
  {
    id: 'sovereign',
    tabLabel: 'الأحادية الملكية',
    rankTag: 'المرتبة الأولى',
    name: 'الأحادية الملكية',
    lettersAr: ['ق'],
    lettersEn: ['Q'],
    numbers: '1',
    description: 'تركيب مفرد للحرف والرقم يتصدر أندر المقتنيات بالمملكة.'
  },
  {
    id: 'duals',
    tabLabel: 'الثنائية المتناغمة',
    rankTag: 'تطابق بصري',
    name: 'الثنائية المتناغمة',
    lettersAr: ['س', 'س'],
    lettersEn: ['S', 'S'],
    numbers: '7',
    description: 'تماثل هندسي للأحرف مع رقم فردي يمنح حضوراً متزناً.'
  },
  {
    id: 'iconic',
    tabLabel: 'الكلمات الدلالية',
    rankTag: 'دلالة عربية',
    name: 'الكلمات الدلالية',
    lettersAr: ['ق', 'م', 'ر'],
    lettersEn: ['Q', 'M', 'R'],
    numbers: '1',
    description: 'أحرف تشكل كلمة عربية مميزة مقترنة برقم أحادي فريد.'
  },
  {
    id: 'sports',
    tabLabel: 'الرياضية المصغرة',
    rankTag: 'فئة السوبركار',
    name: 'الرياضية المصغرة',
    lettersAr: ['ط', 'ط', 'ط'],
    lettersEn: ['T', 'T', 'T'],
    numbers: '9',
    description: 'أبعاد رياضية رسمية مصغرة تنسجم مع تصميم السيارات الخارقة.'
  }
];

export function AboutTiers() {
  const [selectedTierId, setSelectedTierId] = useState<string>('sovereign');
  const selectedTier = plateTiers.find((t) => t.id === selectedTierId) || plateTiers[0];

  return (
    <section className="relative overflow-hidden bg-navy border-y border-gold/30 py-16 sm:py-22 text-white">
      {/* Architectural Museum Vault Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 z-0 bg-navy bg-cover bg-center"
        style={{ backgroundImage: 'url(/branding/about-hero-vault.jpg)' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(6, 13, 27, 0.93) 0%, rgba(8, 20, 40, 0.82) 50%, rgba(6, 13, 27, 0.95) 100%)'
          }}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      </div>

      <div className="container-fbs relative z-10 space-y-6">
        {/* Header + Compact Segmented Selector (Centered on Mobile, Balanced Split on Desktop) */}
        <div className="flex flex-col items-center text-center lg:flex-row lg:items-end lg:text-start justify-between gap-4">
          <div className="min-w-0 flex flex-col items-center lg:items-start">
            <div className="pf-type-micro inline-flex items-center gap-2 rounded-full border border-gold/35 bg-gold/10 px-3.5 py-1 font-bold text-gold-light">
              <Layers size={13} className="text-gold shrink-0" />
              <span>أرشيف الفئات</span>
            </div>
            <h2 className="pf-type-h2 mt-2.5 font-black text-white tracking-tight">
              تصنيف اللوحات المميزة
            </h2>
            <p className="pf-type-body mt-1.5 text-slate-300 font-normal">
              أربع فئات نادرة مصنفة وفق التميز البصري والمقاس الرسمي.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:inline-flex sm:flex-wrap items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-navy/85 p-1.5 backdrop-blur-md self-center lg:self-auto">
            {plateTiers.map((tier) => {
              const isSelected = tier.id === selectedTierId;
              return (
                <button
                  key={tier.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedTierId(tier.id)}
                  className={`min-w-0 rounded-lg px-3.5 py-2 text-xs font-bold transition-all text-center whitespace-nowrap ${
                    isSelected
                      ? 'btn-gold text-navy font-black shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tier.tabLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sculpted Gallery Stage — Clean, Uncluttered, Zero Nested Box Bloat */}
        <div
          data-pf-audit="about-tier-stage"
          className="glass-vision p-5 sm:p-8 lg:p-9"
          style={{ backgroundColor: 'rgba(10, 20, 40, 0.8)' }}
        >
          <div className="pf-cq-split grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
            {/* Start Column (Right): Recessed Plate Pedestal + Plain Inline Tag Before Dimension */}
            <div className="pf-cq-pad-inner plate-tray-recessed-dark min-w-0 flex flex-col items-center justify-center rounded-2xl p-5 sm:p-7">
              <div className="w-full flex justify-center py-1.5">
                <PlateVisualizer
                  lettersAr={selectedTier.lettersAr}
                  lettersEn={selectedTier.lettersEn}
                  numbers={selectedTier.numbers}
                  large={true}
                  plateType={selectedTier.id === 'sports' ? 'small' : 'private'}
                />
              </div>

              <div className="pf-type-micro mt-4 flex flex-wrap items-center justify-center gap-2 text-slate-300">
                <span className="font-bold text-gold">{selectedTier.rankTag}</span>
                <span className="text-white/25">•</span>
                <span>
                  المقاس المعتمد: {selectedTier.id === 'sports' ? '30.5 × 15.5 سم' : '52 × 11 سم'}
                </span>
              </div>
            </div>

            {/* End Column (Left): Clean Title, 1-Line Description & Compact Natural-Width Buttons */}
            <div className="min-w-0 flex flex-col items-center text-center lg:items-start lg:text-start justify-center">
              <h3 className="pf-type-h2 font-black text-white tracking-tight">
                {selectedTier.name}
              </h3>

              <p className="pf-type-body mt-2 text-slate-300 font-normal">
                {selectedTier.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                <Link
                  href="/plates"
                  className="btn btn-gold min-h-10 rounded-xl px-5 py-2 text-xs font-black"
                >
                  <span>تصفح المتجر</span>
                  <ArrowLeft size={14} className="shrink-0" />
                </Link>

                <Link
                  href="/studio-3d"
                  className="btn btn-outline-gold min-h-10 rounded-xl px-4 py-2 text-xs font-bold"
                >
                  <Box size={14} className="text-gold shrink-0" />
                  <span>معاينة 3D</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
