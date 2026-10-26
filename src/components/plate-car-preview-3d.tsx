'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Camera,
  Car,
  Check,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  SlidersHorizontal,
  Sparkles,
  Sun
} from 'lucide-react';
import { FbsPlateEmblem, normalizePlateType, parsePlateData, PlateVisualizer, SaudiEmblem } from '@/components/ui';
import { PLATE_GLYPHS_AR, normalizeSaudiPlateArChar } from '@/components/plate-glyphs-ar';
import { PLATE_GLYPHS_EN, normalizeSaudiPlateEnChar } from '@/components/plate-glyphs-en';

/* ============================================================== */
/* STUDIO DATA                                                     */
/* ============================================================== */

export type CarModelId = 'g-class' | 's-class' | 'cullinan' | 'amg-gt' | 'sierra';

interface CarStudioModel {
  id: CarModelId;
  nameAr: string;
  categoryAr: string;
  studioImage: string;
  /** Plate bracket position on the photo, in % of the 16:9 frame */
  bracket: {
    centerX: number;
    centerY: number;
    width: number;
    rotateY?: number;
    rotateX?: number;
  };
}

export const CAR_STUDIO_MODELS: CarStudioModel[] = [
  {
    id: 'g-class',
    nameAr: 'مرسيدس G63 AMG',
    categoryAr: 'SUV',
    studioImage: '/images/cars/g-class.jpg',
    bracket: { centerX: 50.4, centerY: 55.8, width: 11.8 }
  },
  {
    id: 's-class',
    nameAr: 'مرسيدس مايباخ S680',
    categoryAr: 'سيدان',
    studioImage: '/images/cars/s-class.jpg',
    bracket: { centerX: 50.1, centerY: 66.2, width: 15.5 }
  },
  {
    id: 'cullinan',
    nameAr: 'رولز رويس كولينان',
    categoryAr: 'SUV فاخرة',
    studioImage: '/images/cars/cullinan.jpg',
    bracket: { centerX: 50.2, centerY: 59.3, width: 13.8 }
  },
  {
    id: 'amg-gt',
    nameAr: 'مرسيدس AMG GT',
    categoryAr: 'كوبيه رياضية',
    studioImage: '/images/cars/amg-gt.jpg',
    bracket: { centerX: 55.0, centerY: 61.0, width: 10.9, rotateY: -8, rotateX: 2 }
  },
  {
    id: 'sierra',
    nameAr: 'جي إم سي سييرا (نقل)',
    categoryAr: 'نقل خاص',
    studioImage: '/images/cars/sierra.jpg',
    bracket: { centerX: 50.5, centerY: 63.6, width: 13.4 }
  }
];

export const SAMPLE_STUDIO_PLATES = [
  { lettersAr: ['ب', 'ط', 'ل'], lettersEn: ['L', 'T', 'B'], numbers: '8888', plateType: 'خصوصي', title: 'ب ط ل 8888' },
  { lettersAr: ['ف', 'ب', 'س'], lettersEn: ['S', 'B', 'F'], numbers: '7', plateType: 'خصوصي', title: 'ف ب س 7' },
  { lettersAr: ['ق', 'م', 'ر'], lettersEn: ['R', 'Z', 'G'], numbers: '1', plateType: 'صغيرة', title: 'ق م ر 1' },
  { lettersAr: ['س', 'ع', 'د'], lettersEn: ['D', 'E', 'S'], numbers: '777', plateType: 'خصوصي', title: 'س ع د 777' },
  { lettersAr: ['ن', 'ق', 'ل'], lettersEn: ['L', 'G', 'N'], numbers: '100', plateType: 'نقل', title: 'ن ق ل 100' }
];

export type PlateSize = 'long' | 'standard';
type CameraMode = 'full' | 'closeup' | 'hero';
type LightingMode = 'night' | 'warm' | 'day';

const CAMERA_OPTIONS: { value: CameraMode; label: string }[] = [
  { value: 'full', label: 'كامل السيارة' },
  { value: 'closeup', label: 'قريب على اللوحة' },
  { value: 'hero', label: 'زاوية سينمائية' }
];

const LIGHTING_OPTIONS: { value: LightingMode; label: string }[] = [
  { value: 'night', label: 'ليلي' },
  { value: 'warm', label: 'ذهبي دافئ' },
  { value: 'day', label: 'نهاري' }
];

const LIGHTING_FILTERS: Record<LightingMode, string> = {
  night: 'brightness(0.92) contrast(1.15) saturate(0.95)',
  warm: 'sepia(0.20) saturate(1.22) brightness(1.05) contrast(1.06)',
  day: 'brightness(1.36) contrast(1.10) saturate(1.10)'
};

/* ============================================================== */
/* VECTOR CAR MOUNTED PLATE GLYPH HELPERS (AUTHENTIC VECTORS)     */
/* ============================================================== */

function CarPlateArabicGlyph({
  char,
  cx,
  y,
  height,
  embossId
}: {
  char: string;
  cx: number;
  y: number;
  height: number;
  embossId: string;
}) {
  const norm = normalizeSaudiPlateArChar(char);
  const spec = PLATE_GLYPHS_AR[norm];
  const s = height / 72;
  if (!spec) {
    return (
      <text
        x={cx}
        y={y + height * 0.9}
        textAnchor="middle"
        fill="#11151e"
        fontSize={height * 0.9}
        fontWeight="700"
        fontFamily="var(--font-plate-naskh), 'Noto Naskh Arabic', 'Traditional Arabic', serif"
        filter={`url(#${embossId})`}
      >
        {char}
      </text>
    );
  }
  const w = spec.w * s;
  return (
    <g
      transform={`translate(${cx - w / 2}, ${y}) scale(${s})`}
      fill="#11151e"
      filter={`url(#${embossId})`}
    >
      <path d={spec.d} />
    </g>
  );
}

function CarPlateLatinGlyph({
  char,
  cx,
  y,
  height,
  embossId
}: {
  char: string;
  cx: number;
  y: number;
  height: number;
  embossId: string;
}) {
  const norm = normalizeSaudiPlateEnChar(char);
  const spec = norm ? PLATE_GLYPHS_EN[norm] : undefined;
  const s = height / 72;
  if (!spec) {
    return (
      <text
        x={cx}
        y={y + height * 0.9}
        textAnchor="middle"
        fill="#11151e"
        fontSize={height * 0.9}
        fontWeight="600"
        fontFamily="var(--font-plate-din), 'Bahnschrift', 'DIN Alternate', sans-serif"
        filter={`url(#${embossId})`}
      >
        {char}
      </text>
    );
  }
  const w = spec.w * s;
  return (
    <g
      transform={`translate(${cx - w / 2}, ${y}) scale(${s})`}
      fill="#11151e"
      filter={`url(#${embossId})`}
    >
      <path d={spec.d} />
    </g>
  );
}

/* ============================================================== */
/* VECTOR CAR MOUNTED PLATE (100% SCALE-SAFE, ZERO OVERLAP)        */
/* ============================================================== */

export function CarMountedPlate({
  lettersAr,
  lettersEn,
  numbers,
  plateType = 'خصوصي',
  size = 'long'
}: {
  lettersAr: string[] | string;
  lettersEn: string[] | string;
  numbers: string;
  plateType?: string;
  size?: PlateSize;
}) {
  const rawUid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const bgId = `cmp-bg-${rawUid}`;
  const rimId = `cmp-rim-${rawUid}`;
  const blueId = `cmp-blue-${rawUid}`;
  const foilId = `cmp-foil-${rawUid}`;
  const embossId = `cmp-emboss-${rawUid}`;
  const innerClipId = `cmp-clip-${rawUid}`;

  const normType = normalizePlateType(plateType);
  const isTransport = normType === 'transport';
  const isSmall = normType === 'small' || (size === 'standard' && plateType?.includes('صغير'));
  const { digitPairs, letterPairs } = parsePlateData(lettersAr, lettersEn, numbers);

  const digitCount = Math.max(1, digitPairs.length);
  const letterCount = Math.max(1, letterPairs.length);

  // 1. European Long Plate (520mm x 110mm — 3D Silver+Black Frame, Brushed Metal, Authentic Naskh & DIN)
  if (size === 'long') {
    const pillarX = isSmall ? 462 : 476;
    const pillarW = 517.5 - pillarX;
    const pillarCx = pillarX + pillarW / 2;
    const letterZoneW = pillarX - 308;

    return (
      <svg
        viewBox="0 0 520 110"
        className="block h-full w-full select-none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="لوحة مركبة سعودية طويلة"
      >
        <defs>
          <linearGradient id={bgId} x1="0%" y1="0%" x2="100%" y2="25%">
            <stop offset="0%" stopColor="#dce2eb" />
            <stop offset="20%" stopColor="#edf1f7" />
            <stop offset="44%" stopColor="#ffffff" />
            <stop offset="58%" stopColor="#f9fbfd" />
            <stop offset="82%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#f3f6fa" />
          </linearGradient>
          <linearGradient id={rimId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="22%" stopColor="#f1f5f9" />
            <stop offset="55%" stopColor="#cbd5e1" />
            <stop offset="84%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#dbe3ec" />
          </linearGradient>
          <linearGradient id={blueId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="48%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
          <linearGradient id={foilId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="26%" stopColor="#cbd5e1" />
            <stop offset="52%" stopColor="#f8fafc" />
            <stop offset="78%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <filter id={embossId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="-0.7" dy="-0.7" stdDeviation="0.2" floodColor="#ffffff" floodOpacity="0.96" />
            <feDropShadow dx="0.85" dy="1.45" stdDeviation="0.65" floodColor="#0f172a" floodOpacity="0.34" />
          </filter>
          <clipPath id={innerClipId}>
            <rect x="2.5" y="2.5" width="515" height="105" rx="7" ry="7" />
          </clipPath>
        </defs>

        {/* Brushed Metallic Silver Outer Bezel */}
        <rect
          x="0.5"
          y="0.5"
          width="519"
          height="109"
          rx="9.5"
          ry="9.5"
          fill={`url(#${rimId})`}
          stroke="#64748b"
          strokeWidth="0.8"
        />

        {/* Interior Clipped to Black Frame (Zero White Gap Between Silver & Black) */}
        <g clipPath={`url(#${innerClipId})`}>
          <rect x="2.5" y="2.5" width="515" height="105" fill={`url(#${bgId})`} />

          {/* Right Kingdom Pillar Background (Slim on Private/Transport, Wider on Sports) */}
          <rect
            x={pillarX}
            y="2.5"
            width={pillarW}
            height="105"
            fill={isTransport ? `url(#${blueId})` : '#f5f7fb'}
          />

          {/* Soft Studio Metallic Specular Sheen */}
          <path d="M 0,0 L 185,0 L 105,110 L 0,110 Z" fill="#ffffff" fillOpacity="0.16" pointerEvents="none" />
        </g>

        {/* Flush 3D Solid Black Stamped Inner Frame */}
        <rect
          x="3.8"
          y="3.8"
          width="512.4"
          height="102.4"
          rx="6.8"
          ry="6.8"
          fill="none"
          stroke="#111621"
          strokeWidth="3.4"
        />

        {/* Far-Right Kingdom Pillar Vertical Divider */}
        <line x1={pillarX} y1="3.8" x2={pillarX} y2="106.2" stroke="#111621" strokeWidth="2.8" />

        {/* Open Field: Digits | Center FBS Emblem | Letters */}
        {digitPairs.map((pair, idx) => {
          const cx = 14 + (174 / digitCount) * (idx + 0.5);
          const h = digitCount > 3 ? 38 : 42;
          return (
            <g key={`lp-d-${idx}`}>
              <CarPlateArabicGlyph char={pair.ar} cx={cx} y={7} height={h} embossId={embossId} />
              <CarPlateLatinGlyph char={pair.en} cx={cx} y={54} height={h} embossId={embossId} />
            </g>
          );
        })}

        {/* Center FBS Emblem (Always Centered Across All 3 Plate Categories) */}
        <g transform="translate(196, 24.5)">
          <FbsPlateEmblem width={102} height={60} />
        </g>

        {letterPairs.map((pair, idx) => {
          const cx = 304 + (letterZoneW / letterCount) * (idx + 0.5);
          return (
            <g key={`lp-l-${idx}`}>
              <CarPlateArabicGlyph char={pair.ar} cx={cx} y={7} height={40} embossId={embossId} />
              <CarPlateLatinGlyph char={pair.en} cx={cx} y={54} height={40} embossId={embossId} />
            </g>
          );
        })}

        {/* Far-Right Kingdom Pillar Content */}
        <g>
          <g transform={`translate(${pillarCx - (isSmall ? 14 : 11.5)}, 6.5)`}>
            {isTransport ? (
              <SaudiEmblem size={23} fillColor="#ffffff" />
            ) : isSmall ? (
              <SaudiEmblem size={28} fillColor="#0b0f17" />
            ) : (
              <SaudiEmblem size={23} treeColor="#0b6330" swordsColor="#084d25" />
            )}
          </g>
          <text
            x={pillarCx}
            y={isSmall ? '42.5' : '38'}
            textAnchor="middle"
            fill="#080d16"
            fontSize={isSmall ? '9.4' : '7.8'}
            fontWeight="700"
            fontFamily="var(--font-plate-naskh), 'IBM Plex Sans Arabic', sans-serif"
          >
            السعودية
          </text>
          <text
            x={pillarCx}
            y={isSmall ? '54.5' : '50.5'}
            textAnchor="middle"
            fill="#080d16"
            fontSize={isSmall ? '11.8' : '10.2'}
            fontWeight="700"
            fontFamily="var(--font-plate-din), 'Bahnschrift', sans-serif"
          >
            K
          </text>
          <text
            x={pillarCx}
            y={isSmall ? '65.5' : '60.5'}
            textAnchor="middle"
            fill="#080d16"
            fontSize={isSmall ? '11.8' : '10.2'}
            fontWeight="700"
            fontFamily="var(--font-plate-din), 'Bahnschrift', sans-serif"
          >
            S
          </text>

          {isTransport ? (
            <>
              <text
                x={pillarCx}
                y="70.5"
                textAnchor="middle"
                fill="#080d16"
                fontSize="10.2"
                fontWeight="700"
                fontFamily="var(--font-plate-din), 'Bahnschrift', sans-serif"
              >
                A
              </text>
              <rect
                x={pillarCx - 12.5}
                y="75.5"
                width="25"
                height="7.5"
                rx="1.2"
                fill={`url(#${foilId})`}
                stroke="#475569"
                strokeWidth="0.5"
              />
              <polygon points={`${pillarCx - 6.5},88.5 ${pillarCx + 6.5},88.5 ${pillarCx},100`} fill="#080d16" />
            </>
          ) : (
            <>
              {/* Brushed Silver Band Directly Behind 'A' */}
              <rect
                x={pillarCx - (isSmall ? 18 : 13.5)}
                y={isSmall ? '68' : '64'}
                width={isSmall ? 36 : 27}
                height={isSmall ? '12.5' : '11'}
                rx="1.8"
                fill={`url(#${foilId})`}
                stroke="#64748b"
                strokeWidth="0.5"
              />
              <text
                x={pillarCx}
                y={isSmall ? '78' : '73.2'}
                textAnchor="middle"
                fill="#080d16"
                fontSize={isSmall ? '11.8' : '10.2'}
                fontWeight="700"
                fontFamily="var(--font-plate-din), 'Bahnschrift', sans-serif"
              >
                A
              </text>
              <circle cx={pillarCx} cy={isSmall ? '93' : '90'} r={isSmall ? '8.2' : '5.2'} fill="#080d16" />
            </>
          )}
        </g>
      </svg>
    );
  }

  // 2. Standard / Short Plate (335mm x 170mm — 3D Silver+Black Frame, Brushed Metal, Authentic Naskh & DIN)
  const spPillarX = isSmall ? 287 : 299;
  const spPillarW = 332.5 - spPillarX;
  const spPillarCx = spPillarX + spPillarW / 2;
  const spLetterZoneW = spPillarX - 196;

  return (
    <svg
      viewBox="0 0 335 170"
      className="block h-full w-full select-none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="لوحة مركبة سعودية قياسية"
    >
      <defs>
        <linearGradient id={bgId} x1="0%" y1="0%" x2="100%" y2="25%">
          <stop offset="0%" stopColor="#dce2eb" />
          <stop offset="20%" stopColor="#edf1f7" />
          <stop offset="44%" stopColor="#ffffff" />
          <stop offset="58%" stopColor="#f9fbfd" />
          <stop offset="82%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#f3f6fa" />
        </linearGradient>
        <linearGradient id={rimId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="22%" stopColor="#f1f5f9" />
          <stop offset="55%" stopColor="#cbd5e1" />
          <stop offset="84%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#dbe3ec" />
        </linearGradient>
        <linearGradient id={blueId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="48%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id={foilId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="26%" stopColor="#cbd5e1" />
          <stop offset="52%" stopColor="#f8fafc" />
          <stop offset="78%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <filter id={embossId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="-0.75" dy="-0.75" stdDeviation="0.25" floodColor="#ffffff" floodOpacity="0.96" />
          <feDropShadow dx="0.9" dy="1.5" stdDeviation="0.7" floodColor="#0f172a" floodOpacity="0.34" />
        </filter>
        <clipPath id={innerClipId}>
          <rect x="2.5" y="2.5" width="330" height="165" rx="7.5" ry="7.5" />
        </clipPath>
      </defs>

      {/* Brushed Metallic Silver Outer Bezel */}
      <rect
        x="0.5"
        y="0.5"
        width="334"
        height="169"
        rx="9.5"
        ry="9.5"
        fill={`url(#${rimId})`}
        stroke="#64748b"
        strokeWidth="0.8"
      />

      {/* Interior Clipped to Black Frame (Zero White Gap) */}
      <g clipPath={`url(#${innerClipId})`}>
        <rect x="2.5" y="2.5" width="330" height="165" fill={`url(#${bgId})`} />

        {/* Far-Right Kingdom Pillar Background */}
        <rect
          x={spPillarX}
          y="2.5"
          width={spPillarW}
          height="165"
          fill={isTransport ? `url(#${blueId})` : '#f5f7fb'}
        />

        {/* Diagonal Metallic Sheen */}
        <path d="M 0,0 L 125,0 L 50,170 L 0,170 Z" fill="#ffffff" fillOpacity="0.16" pointerEvents="none" />
      </g>

      {/* Flush 3D Solid Black Stamped Inner Frame */}
      <rect
        x="3.8"
        y="3.8"
        width="327.4"
        height="162.4"
        rx="7.2"
        ry="7.2"
        fill="none"
        stroke="#111621"
        strokeWidth="3.3"
      />

      {/* Far-Right Kingdom Pillar Divider */}
      <line x1={spPillarX} y1="3.8" x2={spPillarX} y2="166.2" stroke="#111621" strokeWidth="2.6" />

      {/* Open Field: Digits | Center FBS Emblem | Letters */}
      {digitPairs.map((pair, idx) => {
        const cx = 10 + (102 / digitCount) * (idx + 0.5);
        const h = digitCount > 3 ? 34 : 38;
        return (
          <g key={`sp-d-${idx}`}>
            <CarPlateArabicGlyph char={pair.ar} cx={cx} y={28} height={h} embossId={embossId} />
            <CarPlateLatinGlyph char={pair.en} cx={cx} y={98} height={h} embossId={embossId} />
          </g>
        );
      })}

      <g transform="translate(115, 62)">
        <FbsPlateEmblem width={75} height={45} />
      </g>

      {letterPairs.map((pair, idx) => {
        const cx = 195 + (spLetterZoneW / letterCount) * (idx + 0.5);
        return (
          <g key={`sp-l-${idx}`}>
            <CarPlateArabicGlyph char={pair.ar} cx={cx} y={28} height={36} embossId={embossId} />
            <CarPlateLatinGlyph char={pair.en} cx={cx} y={98} height={36} embossId={embossId} />
          </g>
        );
      })}

      {/* Far-Right Kingdom Pillar */}
      <g>
        <g transform={`translate(${spPillarCx - (isSmall ? 14 : 11.5)}, 12)`}>
          {isTransport ? (
            <SaudiEmblem size={23} fillColor="#ffffff" />
          ) : isSmall ? (
            <SaudiEmblem size={28} fillColor="#0b0f17" />
          ) : (
            <SaudiEmblem size={23} treeColor="#0b6330" swordsColor="#084d25" />
          )}
        </g>
        <text
          x={spPillarCx}
          y={isSmall ? '52' : '48'}
          textAnchor="middle"
          fill="#080d16"
          fontSize={isSmall ? '9.2' : '7.8'}
          fontWeight="700"
          fontFamily="var(--font-plate-naskh), 'IBM Plex Sans Arabic', sans-serif"
        >
          السعودية
        </text>
        <text
          x={spPillarCx}
          y={isSmall ? '73' : '69'}
          textAnchor="middle"
          fill="#080d16"
          fontSize={isSmall ? '14.5' : '13'}
          fontWeight="700"
          fontFamily="var(--font-plate-din), 'Bahnschrift', sans-serif"
        >
          K
        </text>
        <text
          x={spPillarCx}
          y={isSmall ? '90' : '85'}
          textAnchor="middle"
          fill="#080d16"
          fontSize={isSmall ? '14.5' : '13'}
          fontWeight="700"
          fontFamily="var(--font-plate-din), 'Bahnschrift', sans-serif"
        >
          S
        </text>

        {isTransport ? (
          <>
            <text
              x={spPillarCx}
              y="101"
              textAnchor="middle"
              fill="#080d16"
              fontSize="13"
              fontWeight="700"
              fontFamily="var(--font-plate-din), 'Bahnschrift', sans-serif"
            >
              A
            </text>
            <rect
              x={spPillarCx - 11}
              y="112"
              width="22"
              height="10"
              rx="1.2"
              fill={`url(#${foilId})`}
              stroke="#475569"
              strokeWidth="0.5"
            />
            <polygon points={`${spPillarCx - 7},134 ${spPillarCx + 7},134 ${spPillarCx},149`} fill="#080d16" />
          </>
        ) : (
          <>
            <rect
              x={spPillarCx - (isSmall ? 17 : 12.5)}
              y={isSmall ? '95' : '91'}
              width={isSmall ? 34 : 25}
              height={isSmall ? '16' : '14'}
              rx="2"
              fill={`url(#${foilId})`}
              stroke="#64748b"
              strokeWidth="0.5"
            />
            <text
              x={spPillarCx}
              y={isSmall ? '108' : '103'}
              textAnchor="middle"
              fill="#080d16"
              fontSize={isSmall ? '14.5' : '13'}
              fontWeight="700"
              fontFamily="var(--font-plate-din), 'Bahnschrift', sans-serif"
            >
              A
            </text>
            <circle cx={spPillarCx} cy={isSmall ? '138' : '136'} r={isSmall ? '9.2' : '5.8'} fill="#080d16" />
          </>
        )}
      </g>
    </svg>
  );
}

/* ============================================================== */
/* COMPACT LUXURY DROPDOWN SELECTOR                                */
/* ============================================================== */

function StudioSelect<T extends string>({
  label,
  icon: Icon,
  value,
  options,
  onChange
}: {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  value: T;
  options: { value: T; label: string; hint?: string }[];
  onChange: (value: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex h-9 items-center gap-2 rounded-xl border px-3 text-xs font-bold transition-all ${
          open
            ? 'border-gold/60 bg-gold/15 text-gold-light shadow-[0_0_15px_rgba(217,187,129,0.25)]'
            : 'border-white/15 bg-white/[0.08] text-slate-100 hover:border-gold/40 hover:bg-white/[0.12]'
        }`}
      >
        <Icon size={14} className="text-gold shrink-0" />
        <span className="whitespace-nowrap">{current?.label}</span>
        <ChevronDown
          size={13}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className="absolute top-full end-0 z-50 mt-2 w-max min-w-[170px] rounded-2xl border border-gold/30 bg-[#091224]/95 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl animate-fade-in-up"
        >
          {options.map((o) => {
            const selected = o.value === value;
            return (
              <li key={o.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2 text-start text-xs font-bold transition-colors ${
                    selected ? 'bg-gold/20 text-gold-light' : 'text-slate-200 hover:bg-white/[0.08]'
                  }`}
                >
                  <span className="flex flex-col">
                    <span className="whitespace-nowrap">{o.label}</span>
                    {o.hint && <span className="text-[10px] font-medium text-slate-400">{o.hint}</span>}
                  </span>
                  {selected && <Check size={14} className="text-gold shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ============================================================== */
/* MAIN VIEWER COMPONENT                                           */
/* ============================================================== */

export interface PlateCarPreview3DProps {
  initialPlate?: {
    lettersAr: string[];
    lettersEn: string[];
    numbers: string;
    plateType?: string;
    slug?: string;
  };
  /** inline = inside plate detail card, page = full-screen immersive studio */
  variant?: 'inline' | 'page';
  initialCarId?: string;
  backHref?: string;
}

export function PlateCarPreview3D({
  initialPlate,
  variant = 'inline',
  initialCarId,
  backHref
}: PlateCarPreview3DProps) {
  const [currentPlate, setCurrentPlate] = useState({
    lettersAr: initialPlate?.lettersAr ?? ['ب', 'ط', 'ل'],
    lettersEn: initialPlate?.lettersEn ?? ['L', 'T', 'B'],
    numbers: initialPlate?.numbers ?? '8888',
    plateType: initialPlate?.plateType ?? 'خصوصي',
    slug: initialPlate?.slug
  });

  const isInitialTransport = initialPlate?.plateType?.includes('نقل');

  // Keep state in sync if initialPlate updates
  useEffect(() => {
    if (initialPlate) {
      setCurrentPlate({
        lettersAr: initialPlate.lettersAr ?? ['ب', 'ط', 'ل'],
        lettersEn: initialPlate.lettersEn ?? ['L', 'T', 'B'],
        numbers: initialPlate.numbers ?? '8888',
        plateType: initialPlate.plateType ?? 'خصوصي',
        slug: initialPlate.slug
      });
      if (initialPlate.plateType?.includes('نقل')) {
        setCarId('sierra');
      }
    }
  }, [initialPlate]);

  const [carId, setCarId] = useState<CarModelId>(() => {
    if (initialCarId && CAR_STUDIO_MODELS.some((c) => c.id === initialCarId)) {
      return initialCarId as CarModelId;
    }
    return isInitialTransport ? 'sierra' : 'g-class';
  });
  const [plateSize, setPlateSize] = useState<PlateSize>(
    initialPlate?.plateType?.includes('صغير') ? 'standard' : 'long'
  );
  const [cameraMode, setCameraMode] = useState<CameraMode>('full');
  const [lighting, setLighting] = useState<LightingMode>('night');
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPresetsTray, setShowPresetsTray] = useState(true);

  const sceneRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const car = useMemo(
    () => CAR_STUDIO_MODELS.find((c) => c.id === carId) ?? CAR_STUDIO_MODELS[0],
    [carId]
  );
  const b = car.bracket;

  // Bracket dimensions and proportions
  const isLong = plateSize === 'long';
  const bracketWidth = isLong ? b.width : b.width * 0.74;
  const plateAspect = isLong ? 520 / 110 : 335 / 170;

  const expandHref = useMemo(() => {
    const params = new URLSearchParams({
      lettersAr: currentPlate.lettersAr.join(','),
      lettersEn: currentPlate.lettersEn.join(','),
      numbers: currentPlate.numbers,
      type: currentPlate.plateType,
      car: carId
    });
    if (currentPlate.slug) params.set('from', currentPlate.slug);
    return `/studio-3d?${params.toString()}`;
  }, [currentPlate, carId]);

  // Cinematic subtle tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cameraMode !== 'hero' || !sceneRef.current) return;
    const rect = sceneRef.current.getBoundingClientRect();
    setTilt({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5
    });
  };

  const sceneTransform: React.CSSProperties =
    cameraMode === 'closeup'
      ? { transform: 'scale(2.35)', transformOrigin: `${b.centerX}% ${b.centerY}%` }
      : cameraMode === 'hero'
        ? {
            transform: `perspective(1400px) rotateX(${2 - tilt.y * 4}deg) rotateY(${tilt.x * 6}deg) scale(1.05)`,
            transformOrigin: '50% 50%'
          }
        : { transform: 'none', transformOrigin: '50% 50%' };

  // Fullscreen API toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const isPage = variant === 'page';

  /* ============================================================== */
  /* 1. FULL-SCREEN IMMERSIVE STUDIO (ON /studio-3d)                */
  /* ============================================================== */
  if (isPage) {
    return (
      <div
        ref={containerRef}
        className="fixed inset-0 z-30 h-[100dvh] w-screen overflow-hidden bg-[#030712] select-none flex flex-col justify-between"
      >
        {/* Dynamic Ambient Luxury Lighting matching car environment */}
        <div
          className={`pointer-events-none absolute inset-0 bg-cover bg-center blur-3xl scale-125 transition-all duration-700 ${
            lighting === 'day' ? 'opacity-45 brightness-150' : 'opacity-25'
          }`}
          style={{ backgroundImage: `url(${car.studioImage})` }}
        />
        <div
          className={`pointer-events-none absolute inset-0 transition-all duration-700 bg-gradient-to-t ${
            lighting === 'day'
              ? 'from-[#070f1e]/40 via-transparent to-[#070f1e]/30'
              : 'from-[#030712] via-transparent to-[#030712]/80'
          }`}
        />
        <div
          className={`pointer-events-none absolute inset-0 transition-all duration-700 bg-gradient-to-r ${
            lighting === 'day'
              ? 'from-[#070f1e]/30 via-transparent to-[#070f1e]/30'
              : 'from-[#030712]/80 via-transparent to-[#030712]/80'
          }`}
        />
        {lighting === 'day' && (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_90%_at_50%_0%,rgba(255,255,255,0.22),transparent_75%)] transition-opacity duration-700" />
        )}

        {/* 16:9 Studio Stage: Occupies maximum screen area without distortion */}
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
          <div
            ref={sceneRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            className="relative flex aspect-video h-full w-full max-h-[56.25vw] max-w-[177.78vh] items-center justify-center overflow-hidden transition-[transform,filter] duration-500 ease-out"
            style={{ ...sceneTransform, filter: LIGHTING_FILTERS[lighting] }}
          >
            <Image
              key={car.id}
              src={car.studioImage}
              alt={car.nameAr}
              fill
              priority
              sizes="100vw"
              className="select-none object-cover object-center"
            />

            {/* Dynamic Lighting Ambience Overlays */}
            {lighting === 'day' && (
              <>
                <div className="pointer-events-none absolute inset-0 z-5 mix-blend-screen opacity-80 transition-opacity duration-700 bg-[radial-gradient(ellipse_100%_80%_at_50%_0%,rgba(255,255,255,0.52),rgba(255,250,240,0.25)_50%,transparent_80%)]" />
                <div className="pointer-events-none absolute inset-0 z-5 mix-blend-overlay opacity-40 transition-opacity duration-700 bg-gradient-to-b from-sky-100/70 via-white/30 to-transparent" />
              </>
            )}
            {lighting === 'night' && (
              <div className="pointer-events-none absolute inset-0 z-5 mix-blend-multiply opacity-55 transition-opacity duration-700 bg-radial-[at_50%_60%] from-transparent via-black/45 to-black/85" />
            )}
            {lighting === 'warm' && (
              <div className="pointer-events-none absolute inset-0 z-5 mix-blend-color-dodge opacity-25 transition-opacity duration-700 bg-[radial-gradient(ellipse_at_50%_50%,rgba(217,184,127,0.45),transparent_70%)]" />
            )}

            {/* Bracket Mounted Plate with exact proportions & sub-millimeter anchor */}
            <div
              className="pointer-events-none absolute z-10"
              style={{
                left: `${b.centerX}%`,
                top: `${b.centerY}%`,
                width: `${bracketWidth}%`,
                transform: `translate(-50%, -50%) perspective(900px) rotateY(${b.rotateY ?? 0}deg) rotateX(${b.rotateX ?? 0}deg)`
              }}
            >
              <div
                className="relative w-full rounded-[3px] bg-[#0d0f13] p-[1.5px] shadow-[0_6px_18px_rgba(0,0,0,0.92)]"
                style={{ aspectRatio: `${plateAspect}` }}
              >
                <CarMountedPlate
                  lettersAr={currentPlate.lettersAr}
                  lettersEn={currentPlate.lettersEn}
                  numbers={currentPlate.numbers}
                  plateType={currentPlate.plateType}
                  size={plateSize}
                />
                {/* Bumper Ambient Occlusion Shadow */}
                <div className="pointer-events-none absolute inset-0 rounded-[3px] bg-gradient-to-b from-black/30 via-transparent to-black/15" />
              </div>
            </div>
          </div>
        </div>

        {/* Overlay UI with Safe Area Margins from screen edges */}
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-3 sm:p-5 lg:p-6">
          {/* Top Bar (Safe from edges) */}
          <header className="pointer-events-auto flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-white/10 bg-[#091224]/85 px-3 py-2 sm:px-4 sm:py-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl">
            {/* Right: Back button & Title */}
            <div className="flex items-center gap-3">
              <Link
                href={backHref || '/plates'}
                className="inline-flex h-9 items-center gap-2 rounded-xl border border-gold/40 bg-gold/15 px-3.5 text-xs font-bold text-gold-light transition-all hover:border-gold hover:bg-gold/25 shadow-sm active:scale-95"
              >
                <ArrowRight size={15} className="text-gold" />
                <span>{backHref ? 'رجوع للوحة' : 'العودة للمتجر'}</span>
              </Link>

              <div className="hidden h-5 w-px bg-white/10 sm:block" />

              <div className="hidden items-center gap-2 sm:flex">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-black tracking-tight text-white">استوديو المعاينة 3D</span>
              </div>
            </div>

            {/* Left: Interactive Controls Bar */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <StudioSelect
                label="موديل السيارة"
                icon={Car}
                value={carId}
                options={CAR_STUDIO_MODELS.map((c) => ({ value: c.id, label: c.nameAr, hint: c.categoryAr }))}
                onChange={(v) => setCarId(v)}
              />
              <StudioSelect
                label="حجم اللوحة"
                icon={SlidersHorizontal}
                value={plateSize}
                options={[
                  { value: 'long', label: 'لوحة طويلة (كبيرة)', hint: 'المقاس الأوروبي 520×110' },
                  { value: 'standard', label: 'لوحة عادية / صغيرة', hint: 'المقاس القياسي 335×170' }
                ]}
                onChange={(v) => setPlateSize(v as PlateSize)}
              />
              <StudioSelect
                label="زاوية الرؤية"
                icon={Camera}
                value={cameraMode}
                options={CAMERA_OPTIONS}
                onChange={(v) => {
                  setCameraMode(v);
                  setTilt({ x: 0, y: 0 });
                }}
              />
              <StudioSelect
                label="الإضاءة"
                icon={Sun}
                value={lighting}
                options={LIGHTING_OPTIONS}
                onChange={(v) => setLighting(v)}
              />

              {/* Fullscreen Button */}
              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label="تبديل ملء الشاشة"
                title="تبديل ملء الشاشة"
                className="hidden h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/[0.08] text-slate-200 transition-colors hover:border-gold/40 hover:text-gold sm:inline-flex"
              >
                {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>
            </div>
          </header>

          {/* Bottom Bar: Presets & Plate Info (Safe from edges) */}
          <footer className="pointer-events-auto mx-auto w-full max-w-4xl">
            {backHref ? (
              /* When previewing a specific plate */
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold/30 bg-[#091224]/90 p-3 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="w-24 shrink-0 sm:w-28">
                    <PlateVisualizer
                      lettersAr={currentPlate.lettersAr}
                      lettersEn={currentPlate.lettersEn}
                      numbers={currentPlate.numbers}
                      plateType={currentPlate.plateType}
                      compact
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] font-medium text-slate-400">معاينة واقعية حية</span>
                    <span className="text-xs font-black text-white sm:text-sm">
                      {currentPlate.lettersAr.join(' ')} {currentPlate.numbers}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={backHref}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gold px-4 text-xs font-bold text-navy transition-transform hover:scale-[1.02] active:scale-95 shadow-md"
                  >
                    <span>تفاصيل وحجز اللوحة</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ) : (
              /* Preset Plates Floating Selector */
              <div className="rounded-2xl border border-white/10 bg-[#091224]/90 p-2 sm:p-3 shadow-2xl backdrop-blur-xl">
                <div className="mb-2 flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gold-light">
                    <Sparkles size={13} className="text-gold" />
                    <span>جرّب لوحات مميزة أخرى على السيارة:</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPresetsTray((prev) => !prev)}
                    className="text-[11px] font-bold text-slate-400 hover:text-gold transition-colors inline-flex items-center gap-1"
                  >
                    <span>{showPresetsTray ? 'إخفاء' : 'إظهار'}</span>
                    {showPresetsTray ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
                  </button>
                </div>

                {showPresetsTray && (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5 animate-fade-in-up">
                    {SAMPLE_STUDIO_PLATES.map((sample, idx) => {
                      const isSelected =
                        sample.numbers === currentPlate.numbers &&
                        sample.lettersAr.join('') === currentPlate.lettersAr.join('');
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setCurrentPlate({
                              lettersAr: sample.lettersAr,
                              lettersEn: sample.lettersEn,
                              numbers: sample.numbers,
                              plateType: sample.plateType,
                              slug: undefined
                            });
                            if (sample.plateType.includes('نقل')) {
                              setCarId('sierra');
                            } else if (carId === 'sierra') {
                              setCarId('g-class');
                            }
                          }}
                          className={`group rounded-xl border p-1.5 text-start transition-all ${
                            isSelected
                              ? 'border-gold bg-gold/15 shadow-md ring-1 ring-gold'
                              : 'border-white/10 bg-white/[0.04] hover:border-gold/50 hover:bg-white/[0.08]'
                          }`}
                        >
                          <PlateVisualizer
                            lettersAr={sample.lettersAr}
                            lettersEn={sample.lettersEn}
                            numbers={sample.numbers}
                            plateType={sample.plateType}
                            compact
                          />
                          <span
                            className={`mt-1 block text-center text-[10px] font-bold ${
                              isSelected ? 'text-gold-light' : 'text-slate-300 group-hover:text-gold'
                            }`}
                          >
                            {sample.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </footer>
        </div>
      </div>
    );
  }

  /* ============================================================== */
  /* 2. INLINE CARD PREVIEW (INSIDE /plates/[slug])                  */
  /* ============================================================== */
  return (
    <div className="relative rounded-2xl border border-gold/25 bg-gradient-to-b from-[#0a1222] to-[#060b16] p-3 text-white shadow-[0_16px_40px_-16px_rgba(6,11,22,0.6)]">
      {/* Header: Controls */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-black text-white">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-gold/40 bg-gold/10 text-gold">
            <Car size={14} />
          </span>
          <span>معاينة على السيارة</span>
        </h3>

        <div className="flex flex-wrap items-center gap-1.5">
          <StudioSelect
            label="موديل السيارة"
            icon={Car}
            value={carId}
            options={CAR_STUDIO_MODELS.map((c) => ({ value: c.id, label: c.nameAr, hint: c.categoryAr }))}
            onChange={(v) => setCarId(v)}
          />
          <StudioSelect
            label="حجم اللوحة"
            icon={SlidersHorizontal}
            value={plateSize}
            options={[
              { value: 'long', label: 'لوحة طويلة (كبيرة)', hint: '520×110' },
              { value: 'standard', label: 'لوحة عادية / صغيرة', hint: '335×170' }
            ]}
            onChange={(v) => setPlateSize(v as PlateSize)}
          />
          <StudioSelect
            label="زاوية الرؤية"
            icon={Camera}
            value={cameraMode}
            options={CAMERA_OPTIONS}
            onChange={(v) => {
              setCameraMode(v);
              setTilt({ x: 0, y: 0 });
            }}
          />
          <StudioSelect
            label="الإضاءة"
            icon={Sun}
            value={lighting}
            options={LIGHTING_OPTIONS}
            onChange={(v) => setLighting(v)}
          />

          <Link
            href={expandHref}
            title="عرض مكبر ملء الشاشة"
            aria-label="عرض مكبر ملء الشاشة"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/[0.08] text-slate-200 transition-colors hover:border-gold/40 hover:text-gold"
          >
            <Maximize2 size={15} />
          </Link>
        </div>
      </div>

      {/* Viewer: Fixed 16:9 Frame */}
      <div
        ref={sceneRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black"
      >
        <div
          className="absolute inset-0 transition-[transform,filter] duration-500 ease-out"
          style={{ ...sceneTransform, filter: LIGHTING_FILTERS[lighting] }}
        >
          <Image
            key={car.id}
            src={car.studioImage}
            alt={car.nameAr}
            fill
            sizes="(min-width: 1024px) 640px, 100vw"
            className="select-none object-cover object-center animate-fade-in-up"
          />

          {/* Dynamic Lighting Ambience Overlays */}
          {lighting === 'day' && (
            <>
              <div className="pointer-events-none absolute inset-0 z-5 mix-blend-screen opacity-80 transition-opacity duration-700 bg-[radial-gradient(ellipse_100%_80%_at_50%_0%,rgba(255,255,255,0.52),rgba(255,250,240,0.25)_50%,transparent_80%)]" />
              <div className="pointer-events-none absolute inset-0 z-5 mix-blend-overlay opacity-40 transition-opacity duration-700 bg-gradient-to-b from-sky-100/70 via-white/30 to-transparent" />
            </>
          )}
          {lighting === 'night' && (
            <div className="pointer-events-none absolute inset-0 z-5 mix-blend-multiply opacity-55 transition-opacity duration-700 bg-radial-[at_50%_60%] from-transparent via-black/45 to-black/85" />
          )}
          {lighting === 'warm' && (
            <div className="pointer-events-none absolute inset-0 z-5 mix-blend-color-dodge opacity-25 transition-opacity duration-700 bg-[radial-gradient(ellipse_at_50%_50%,rgba(217,184,127,0.45),transparent_70%)]" />
          )}

          {/* Mounted Vector Plate */}
          <div
            className="pointer-events-none absolute z-10"
            style={{
              left: `${b.centerX}%`,
              top: `${b.centerY}%`,
              width: `${bracketWidth}%`,
              transform: `translate(-50%, -50%) perspective(900px) rotateY(${b.rotateY ?? 0}deg) rotateX(${b.rotateX ?? 0}deg)`
            }}
          >
            <div
              className="relative w-full rounded-[3px] bg-[#0d0f13] p-[1.5px] shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
              style={{ aspectRatio: `${plateAspect}` }}
            >
              <CarMountedPlate
                lettersAr={currentPlate.lettersAr}
                lettersEn={currentPlate.lettersEn}
                numbers={currentPlate.numbers}
                plateType={currentPlate.plateType}
                size={plateSize}
              />
              <div className="pointer-events-none absolute inset-0 rounded-[3px] bg-gradient-to-b from-black/25 via-transparent to-black/15" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
