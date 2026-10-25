import { useId } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  Clock,
  Crown,
  Gavel,
  Heart,
  MapPin,
  Palmtree,
  SearchX,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart
} from 'lucide-react';
import type { MarketplacePlate } from '@/modules/marketplace/types';

export function PageTitle({
  title,
  description,
  eyebrow = 'فارس بن سعود للوحات المميزة'
}: {
  title: string;
  description?: string;
  eyebrow?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#060b17] via-[#091224] to-[#0f1d38] text-white pt-24 sm:pt-28 lg:pt-32 pb-14 sm:pb-20 lg:pb-24 border-b border-gold/20 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.5)]">
      {/* Ambient Gold & Navy Glow Blobs */}
      <div className="pointer-events-none absolute -top-32 start-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-gold/15 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 end-10 h-64 w-64 rounded-full bg-blue-900/20 blur-[90px]" />

      {/* Subtle Texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #d9b87f 1px, transparent 0)',
          backgroundSize: '36px 36px'
        }}
      />

      <div className="container-fbs relative z-10">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-xs font-bold text-gold-light backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            <span>{eyebrow}</span>
          </div>
        )}
        <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-white leading-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base font-normal">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}

export function EmptyState({
  title = 'لا توجد لوحات متاحة حاليًا',
  description = 'عد قريبًا للاطلاع على اللوحات المعتمدة والمزادات الجديدة.',
  href,
  label
}: {
  title?: string;
  description?: string;
  href?: string;
  label?: string;
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/80 p-8 text-center shadow-sm">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 text-gold-accent">
        <SearchX size={28} strokeWidth={1.75} />
      </span>
      <h2 className="text-lg font-bold text-navy">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{description}</p>
      {href && (
        <Link href={href} className="btn btn-navy mt-6 text-xs">
          {label}
          <ArrowLeft size={16} />
        </Link>
      )}
    </div>
  );
}

export function SaudiEmblem({
  className = '',
  size = 20,
  fillColor = '#0b0f17',
  strokeColor,
  treeColor,
  swordsColor
}: {
  className?: string;
  size?: number;
  fillColor?: string;
  strokeColor?: string;
  treeColor?: string;
  swordsColor?: string;
}) {
  const palmFill = treeColor ?? fillColor;
  const saberFill = swordsColor ?? strokeColor ?? fillColor;

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0 }}
    >
      {/* Crisp Optical-Grade Saudi Date Palm (الشجرة) */}
      <g fill={palmFill}>
        {/* Upright Center Crown Spear */}
        <path d="M 60,3.5 C 55.5,14.5 56,26.5 60,38 C 64,26.5 64.5,14.5 60,3.5 Z" />

        {/* Upper-Inner Arching Fronds */}
        <path d="M 58.8,35.5 C 50.5,20.5 37.5,10 21.5,11 C 33.5,16.8 43.5,26 55.2,38.5 Z" />
        <path d="M 61.2,35.5 C 69.5,20.5 82.5,10 98.5,11 C 86.5,16.8 76.5,26 64.8,38.5 Z" />

        {/* Mid-Upper Sweeping Fronds */}
        <path d="M 57.8,39.5 C 44,26.5 25,20.5 8.5,26.5 C 23.5,29 38.5,34.5 54.2,43 Z" />
        <path d="M 62.2,39.5 C 76,26.5 95,20.5 111.5,26.5 C 96.5,29 81.5,34.5 65.8,43 Z" />

        {/* Mid-Lower Classic Date-Palm Fronds */}
        <path d="M 56.8,43.5 C 40.5,35 20,35.5 6,46.5 C 21.5,44 37.5,44.5 53.8,47.5 Z" />
        <path d="M 63.2,43.5 C 79.5,35 100,35.5 114,46.5 C 98.5,44 82.5,44.5 66.2,47.5 Z" />

        {/* Lower Drooping Fronds */}
        <path d="M 56.2,47.5 C 41.5,44.5 25.5,49.5 15,61.5 C 28.5,55.5 41.5,52.2 54.8,51.2 Z" />
        <path d="M 63.8,47.5 C 78.5,44.5 94.5,49.5 105,61.5 C 91.5,55.5 78.5,52.2 65.2,51.2 Z" />

        {/* Sculpted Date Clusters */}
        <ellipse cx="48.5" cy="55.5" rx="2.7" ry="4" transform="rotate(18 48.5 55.5)" />
        <ellipse cx="71.5" cy="55.5" rx="2.7" ry="4" transform="rotate(-18 71.5 55.5)" />

        {/* Tapered Segmented Palm Trunk */}
        <path d="M 56.2,41.5 L 63.8,41.5 L 65.8,64 C 66.6,69.8 69.2,73.2 72.5,75.2 L 47.5,75.2 C 50.8,73.2 53.4,69.8 54.2,64 Z" />
      </g>

      {/* Crossed Curved Arabian Scimitars (السيفان العربيان) */}
      <g fill={saberFill}>
        {/* Left-Hilt to Right-Tip Scimitar */}
        <path d="M 28.5,105.5 C 48,93 74.5,81.8 110,79 C 97.5,87.8 73,97 33.8,110.8 Z" />
        <path d="M 25,100.8 L 38.5,114 L 34.8,117.2 L 21.3,104 Z" />
        <path d="M 28,107.2 L 18.5,115.5 C 15.2,117.8 12,115.2 13.8,111.5 L 24,103.5 Z" />

        {/* Right-Hilt to Left-Tip Scimitar */}
        <path d="M 91.5,105.5 C 72,93 45.5,81.8 10,79 C 22.5,87.8 47,97 86.2,110.8 Z" />
        <path d="M 95,100.8 L 81.5,114 L 85.2,117.2 L 98.7,104 Z" />
        <path d="M 92,107.2 L 101.5,115.5 C 104.8,117.8 108,115.2 106.2,111.5 L 96,103.5 Z" />
      </g>
    </svg>
  );
}

export type SaudiPlateType = 'private' | 'transport' | 'small';

export function normalizePlateType(type?: string): SaudiPlateType {
  if (!type) return 'private';
  const lower = type.toLowerCase().trim();
  if (lower.includes('نقل') || lower.includes('transport') || lower.includes('commercial')) {
    return 'transport';
  }
  if (
    lower.includes('صغير') ||
    lower.includes('small') ||
    lower.includes('رياض') ||
    lower.includes('sport') ||
    lower.includes('us')
  ) {
    return 'small';
  }
  return 'private';
}

/**
 * Official Saudi Traffic Authority Arabic to Latin letter standard transliteration table.
 */
export const SAUDI_PLATE_AR_TO_EN: Record<string, string> = {
  'أ': 'A', 'ا': 'A', 'إ': 'A', 'آ': 'A', 'ء': 'A',
  'ب': 'B',
  'ح': 'J',
  'د': 'D',
  'ر': 'R',
  'س': 'S',
  'ص': 'X',
  'ط': 'T',
  'ع': 'E',
  'ق': 'G',
  'ك': 'K',
  'ل': 'L',
  'م': 'Z',
  'ن': 'N',
  'هـ': 'H', 'ه': 'H',
  'و': 'U',
  'ى': 'V', 'ي': 'V'
};

export const SAUDI_PLATE_EN_TO_AR: Record<string, string> = {
  A: 'أ',
  B: 'ب',
  J: 'ح',
  D: 'د',
  R: 'ر',
  S: 'س',
  X: 'ص',
  T: 'ط',
  E: 'ع',
  G: 'ق',
  K: 'ك',
  L: 'ل',
  Z: 'م',
  N: 'ن',
  H: 'هـ',
  U: 'و',
  V: 'ى'
};

/**
 * Precision CAD-Vector FBS Automotive Emblem (Sleek GT Coupé + Custom FBS Monogram)
 * Reconstructed with pure cubic Bézier curves and dual-tone embossed metallic finish
 * for razor-sharp contrast and factory-stamped realism on Saudi aluminum plates.
 */
export function FbsPlateEmblem({
  width,
  height,
  className = ''
}: {
  width?: number | string;
  height?: number | string;
  className?: string;
}) {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, '');
  const navyGradId = `fbs-navy-${uid}`;
  const goldGradId = `fbs-gold-${uid}`;
  const goldTrimId = `fbs-trim-${uid}`;
  const embossFilterId = `fbs-emboss-${uid}`;

  return (
    <svg
      viewBox="0 0 260 154"
      width={width}
      height={height}
      className={`q-fbs-emblem shrink-0 ${className}`}
      aria-label="شعار FBS الرسمي"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <defs>
        {/* Deep Royal Midnight Navy Metallic Ink for High-Contrast Stamped Legibility */}
        <linearGradient id={navyGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e2f53" />
          <stop offset="45%" stopColor="#121e38" />
          <stop offset="100%" stopColor="#091122" />
        </linearGradient>

        {/* Rich Burnished Champagne-Bronze Gold for GT Coupé Silhouette */}
        <linearGradient id={goldGradId} x1="0%" y1="0%" x2="100%" y2="18%">
          <stop offset="0%" stopColor="#8c621e" />
          <stop offset="28%" stopColor="#c79a4b" />
          <stop offset="55%" stopColor="#ddb66c" />
          <stop offset="82%" stopColor="#b58636" />
          <stop offset="100%" stopColor="#7f5718" />
        </linearGradient>

        {/* Subtle Metallic Gold Bevel Rim */}
        <linearGradient id={goldTrimId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e2be78" />
          <stop offset="50%" stopColor="#b88938" />
          <stop offset="100%" stopColor="#8f651f" />
        </linearGradient>

        {/* Crisp Die-Stamped Aluminum Relief */}
        <filter id={embossFilterId} x="-10%" y="-10%" width="120%" height="125%">
          <feDropShadow dx="0" dy="-0.65" stdDeviation="0.25" floodColor="#ffffff" floodOpacity="0.9" />
          <feDropShadow dx="0" dy="1.1" stdDeviation="0.55" floodColor="#0b1324" floodOpacity="0.24" />
        </filter>
      </defs>

      <g filter={`url(#${embossFilterId})`}>
        {/* ================= 1. SLEEK GT SPORTS COUPÉ SILHOUETTE ================= */}
        <g>
          {/* Sweeping Fastback Roofline & Ducktail Spoiler */}
          <path
            d="M 10,25.5 C 21,29 33,27.5 50,22 C 78,12.5 103,7.5 127,8.2 C 149,8.8 168,15.5 188,26.8 L 183.5,28.2 C 164,18.5 146,13.2 126.5,12.8 C 103,12.2 79,17 51,26.5 C 34,32 21,33.5 10,25.5 Z"
            fill={`url(#${goldGradId})`}
            stroke="#5e3f10"
            strokeWidth="0.45"
            strokeLinejoin="round"
          />

          {/* Sculpted Rear Decklid & C-Pillar Flow */}
          <path
            d="M 22,33.2 C 42,27.8 66,26.8 98,30.5 C 70,31.2 46,31.5 27,36.2 C 23,37 19.5,35.5 22,33.2 Z"
            fill={`url(#${goldGradId})`}
          />

          {/* Long Muscular GT Hood & Front Fender Horizon */}
          <path
            d="M 65,25.8 C 105,30.8 147,31.4 185,32 C 213,32.5 234,38 250,49.5 C 232,42.5 212,37.8 184.5,37 C 145,36 103,35 65,27.6 Z"
            fill={`url(#${navyGradId})`}
          />

          {/* Dynamic Aerodynamic Waist Crease */}
          <path
            d="M 94,46.2 C 127,40.2 165,39.8 202,42.6 C 166,44 128,44.6 94,46.2 Z"
            fill={`url(#${goldGradId})`}
            stroke="#5e3f10"
            strokeWidth="0.35"
          />

          {/* Aggressive Predator LED Headlamp Eye */}
          <path
            d="M 212,42.2 C 221,41.8 233,45.5 242,51.6 C 231,50.8 221,48.2 215,44.8 Z"
            fill={`url(#${goldGradId})`}
            stroke="#5e3f10"
            strokeWidth="0.4"
          />

          {/* Rear Tapered Wheel Arch */}
          <path
            d="M 39,62.5 C 40.2,49.2 48,43 57.5,43 C 67,43 74.8,49.2 76,62.5 C 73.2,52.2 66.2,47.5 57.5,47.5 C 48.8,47.5 41.8,52.2 39,62.5 Z"
            fill={`url(#${navyGradId})`}
          />

          {/* Front Tapered Wheel Arch */}
          <path
            d="M 180,65 C 181.2,51.8 189,45.6 198.5,45.6 C 208,45.6 215.8,51.8 217,65 C 214.2,54.8 207.2,50.1 198.5,50.1 C 189.8,50.1 182.8,54.8 180,65 Z"
            fill={`url(#${navyGradId})`}
          />

          {/* Sculpted Lower Rocker Sill Blade */}
          <path
            d="M 83,62.5 C 113,64.2 144,65 173,64.8 C 144,67.6 113,66.6 83,62.5 Z"
            fill={`url(#${goldGradId})`}
            stroke="#5e3f10"
            strokeWidth="0.35"
          />
        </g>

        {/* ================= 2. PRECISION CUSTOM 'FBS' MONOGRAM ================= */}
        <g stroke={`url(#${goldTrimId})`} strokeWidth="0.9" strokeLinejoin="round">
          {/* Connected 'FB' Ligature with Signature Speed-Slot & Diagonal Crossbar */}
          <path
            fill={`url(#${navyGradId})`}
            fillRule="evenodd"
            d="M 22,79 H 131 C 142.2,79 149.8,86 149.8,96.5 C 149.8,103.6 145.6,109.2 139,111.6 C 147.2,114.2 152.2,120.8 152.2,129.4 C 152.2,139 144.2,145.5 133,145.5 H 90 V 98.2 H 110 V 104.8 H 130 C 133.6,104.8 135.8,102.3 135.8,99.4 C 135.8,96.5 133.6,94 130,94 H 42 V 104.8 H 83 L 72,119.8 H 42 V 145.5 H 22 Z M 110,119.8 H 131.5 C 135.6,119.8 138.2,122.4 138.2,125.2 C 138.2,128.1 135.6,130.5 131.5,130.5 H 110 Z"
          />

          {/* Precision Sporty 'S' with Matching Diagonal Top-Right Cut */}
          <path
            fill={`url(#${navyGradId})`}
            d="M 182,79 H 238 L 227,94 H 183 C 178.4,94 176,96.5 176,99.4 C 176,102.3 178.4,104.8 183,104.8 H 214 C 228.2,104.8 238.2,113.4 238.2,125.2 C 238.2,137 228.2,145.5 214,145.5 H 165.5 C 161,145.5 158,142.1 158,138 C 158,133.9 161,130.5 165.5,130.5 H 213 C 217.6,130.5 220.2,128.1 220.2,125.2 C 220.2,122.4 217.6,119.8 213,119.8 H 182 C 167.8,119.8 158,111.2 158,99.4 C 158,87.6 167.8,79 182,79 Z"
          />
        </g>
      </g>
    </svg>
  );
}

export const FbsPlateShield = FbsPlateEmblem;

/**
 * Luxury Etched Platinum FBS Stage Watermark for Plate Showcase Trays:
 * Crowns the upper stage above the plate with the sleek GT Coupé silhouette
 * and anchors the lower stage below the plate with the custom FBS monogram.
 */
export function FbsStageWatermark({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none absolute inset-0 overflow-hidden z-0 flex items-center justify-center ${className}`}
    >
      {/* Unified Giant Etched Platinum FBS Watermark:
          GT Coupé silhouette crowns cleanly above the plate & wheel arches kiss top edge;
          Connected FBS monogram emerges boldly below the plate's bottom edge */}
      <svg
        viewBox="4 -12 252 180"
        className="w-[78%] max-w-[330px] h-[94%] object-contain text-[#94A3B8]/[0.26]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="currentColor" transform="translate(0, -14)">
          <path d="M 10,25.5 C 21,29 33,27.5 50,22 C 78,12.5 103,7.5 127,8.2 C 149,8.8 168,15.5 188,26.8 L 183.5,28.2 C 164,18.5 146,13.2 126.5,12.8 C 103,12.2 79,17 51,26.5 C 34,32 21,33.5 10,25.5 Z" />
          <path d="M 22,33.2 C 42,27.8 66,26.8 98,30.5 C 70,31.2 46,31.5 27,36.2 C 23,37 19.5,35.5 22,33.2 Z" />
          <path d="M 65,25.8 C 105,30.8 147,31.4 185,32 C 213,32.5 234,38 250,49.5 C 232,42.5 212,37.8 184.5,37 C 145,36 103,35 65,27.6 Z" />
          <path d="M 94,46.2 C 127,40.2 165,39.8 202,42.6 C 166,44 128,44.6 94,46.2 Z" />
          <path d="M 212,42.2 C 221,41.8 233,45.5 242,51.6 C 231,50.8 221,48.2 215,44.8 Z" />
          <path d="M 39,62.5 C 40.2,49.2 48,43 57.5,43 C 67,43 74.8,49.2 76,62.5 C 73.2,52.2 66.2,47.5 57.5,47.5 C 48.8,47.5 41.8,52.2 39,62.5 Z" />
          <path d="M 180,65 C 181.2,51.8 189,45.6 198.5,45.6 C 208,45.6 215.8,51.8 217,65 C 214.2,54.8 207.2,50.1 198.5,50.1 C 189.8,50.1 182.8,54.8 180,65 Z" />
          <path d="M 83,62.5 C 113,64.2 144,65 173,64.8 C 144,67.6 113,66.6 83,62.5 Z" />
        </g>

        <g fill="currentColor" transform="translate(0, 16)">
          <path
            fillRule="evenodd"
            d="M 22,79 H 131 C 142.2,79 149.8,86 149.8,96.5 C 149.8,103.6 145.6,109.2 139,111.6 C 147.2,114.2 152.2,120.8 152.2,129.4 C 152.2,139 144.2,145.5 133,145.5 H 90 V 98.2 H 110 V 104.8 H 130 C 133.6,104.8 135.8,102.3 135.8,99.4 C 135.8,96.5 133.6,94 130,94 H 42 V 104.8 H 83 L 72,119.8 H 42 V 145.5 H 22 Z M 110,119.8 H 131.5 C 135.6,119.8 138.2,122.4 138.2,125.2 C 138.2,128.1 135.6,130.5 131.5,130.5 H 110 Z"
          />
          <path d="M 182,79 H 238 L 227,94 H 183 C 178.4,94 176,96.5 176,99.4 C 176,102.3 178.4,104.8 183,104.8 H 214 C 228.2,104.8 238.2,113.4 238.2,125.2 C 238.2,137 228.2,145.5 214,145.5 H 165.5 C 161,145.5 158,142.1 158,138 C 158,133.9 161,130.5 165.5,130.5 H 213 C 217.6,130.5 220.2,128.1 220.2,125.2 C 220.2,122.4 217.6,119.8 213,119.8 H 182 C 167.8,119.8 158,111.2 158,99.4 C 158,87.6 167.8,79 182,79 Z" />
        </g>
      </svg>
    </div>
  );
}

export function parsePlateData(
  lettersAr: string[] | string,
  lettersEn: string[] | string,
  numbers: string
) {
  const rawDigits = (numbers || '').replace(/\s+/g, '');
  const standardDigits: string[] = [];
  for (const ch of rawDigits) {
    const arIdx = '٠١٢٣٤٥٦٧٨٩'.indexOf(ch);
    if (arIdx !== -1) {
      standardDigits.push(String(arIdx));
    } else if (/\d/.test(ch)) {
      standardDigits.push(ch);
    }
  }
  const digitPairs = standardDigits.map((d) => ({
    ar: '٠١٢٣٤٥٦٧٨٩'[Number(d)] ?? d,
    en: d
  }));

  // Clean Arabic letters: treat 'هـ' as 1 grapheme, strip rogue dots/commas/punctuation
  let cleanAr: string[] = [];
  if (Array.isArray(lettersAr)) {
    cleanAr = lettersAr
      .map((l) => {
        const s = String(l || '').replace(/[\s\-_,\/\\\.،\*\#]/g, '');
        if (s.startsWith('ه') && (s.includes('ـ') || s.includes('\u0640'))) {
          return 'هـ';
        }
        return s.replace(/[\u0640ـ]/g, '');
      })
      .filter(Boolean);
  } else {
    const raw = String(lettersAr || '').trim();
    const tokens = raw.includes(' ')
      ? raw.split(/\s+/)
      : raw.match(/(هـ|[\u0600-\u06FF])/g) || [];
    cleanAr = tokens
      .map((l) => {
        const s = l.replace(/[\s\-_,\/\\\.،\*\#]/g, '');
        if (s.startsWith('ه') && (s.includes('ـ') || s.includes('\u0640'))) {
          return 'هـ';
        }
        return s.replace(/[\u0640ـ]/g, '');
      })
      .filter(Boolean);
  }

  // Clean Latin letters: strict uppercase A-Z only, discard punctuation and stray characters
  let cleanEn: string[] = [];
  if (Array.isArray(lettersEn)) {
    cleanEn = lettersEn
      .map((l) => String(l || '').replace(/[^A-Za-z]/g, '').toUpperCase())
      .filter(Boolean);
  } else {
    cleanEn = String(lettersEn || '')
      .replace(/[^A-Za-z]/g, '')
      .toUpperCase()
      .split('')
      .filter(Boolean);
  }

  // Align Arabic and Latin letters accurately in LTR column display:
  // On authentic Saudi plates:
  // Column 0 (leftmost): Latin letter 0 is under Arabic letter corresponding to Latin 0.
  // Column N (rightmost, closest to pillar): Arabic reading starts here (first Arabic letter).
  let displayAr = [...cleanAr];
  let displayEn = [...cleanEn];

  if (cleanAr.length > 0 && cleanEn.length > 0) {
    const firstArMapped = SAUDI_PLATE_AR_TO_EN[cleanAr[0]];
    const lastEn = cleanEn[cleanEn.length - 1];
    if (firstArMapped && firstArMapped === lastEn && cleanAr.length > 1) {
      displayAr = cleanAr.slice().reverse();
    }
  } else if (cleanAr.length > 0 && cleanEn.length === 0) {
    displayAr = cleanAr.slice().reverse();
    displayEn = displayAr.map((ch) => SAUDI_PLATE_AR_TO_EN[ch] || '');
  } else if (cleanEn.length > 0 && cleanAr.length === 0) {
    displayEn = [...cleanEn];
    displayAr = displayEn.map((ch) => SAUDI_PLATE_EN_TO_AR[ch] || '');
  }

  const maxLen = Math.max(displayAr.length, displayEn.length);
  const letterPairs: { ar: string; en: string }[] = [];
  for (let i = 0; i < maxLen; i++) {
    letterPairs.push({
      ar: displayAr[i] || '',
      en: displayEn[i] || ''
    });
  }

  return {
    digitPairs,
    letterPairs
  };
}

export interface PlateVisualizerProps {
  lettersAr: string[] | string;
  lettersEn: string[] | string;
  numbers: string;
  large?: boolean;
  compact?: boolean;
  dark?: boolean;
  plateType?: string;
  className?: string;
}

/**
 * Photorealistic Screw-Free Saudi Vehicle License Plate with Center FBS Emblem:
 * - Flush silver outer rim + slightly thicker black inner frame (zero gap)
 * - FBS Emblem always centered in an open divider-free main field across all 3 categories
 * - Slim right-side Kingdom Pillar:
 *   1. خصوصي (Private): White pillar + Dark Green Saudi Emblem + vertical K/S/A + silver foil + black circle (●)
 *   2. صغيرة (Small / Sports): White pillar + Black Saudi Emblem + vertical K/S/A + silver foil + black circle (●)
 *   3. نقل (Transport): Blue pillar + White Saudi Emblem + vertical K/S/A + silver foil + downward triangle (▼)
 */
export function PlateVisualizer({
  lettersAr,
  lettersEn,
  numbers,
  large = false,
  compact = false,
  dark = false,
  plateType = 'private',
  className = ''
}: PlateVisualizerProps) {
  const normType = normalizePlateType(plateType);
  const isTransport = normType === 'transport';
  const isSmall = normType === 'small';

  const { digitPairs, letterPairs } = parsePlateData(
    lettersAr,
    lettersEn,
    numbers
  );

  const emblemSize = isSmall
    ? large
      ? 28
      : compact
        ? 18
        : 24
    : large
      ? 23
      : compact
        ? 15
        : 20;
  const digitCount = digitPairs.length || 1;
  const letterCount = letterPairs.length || 1;

  return (
    <div
      data-pf-proportional="saudi-plate"
      className={`hero-saudi-plate ${isTransport ? 'is-transport' : ''} ${
        isSmall ? 'is-small' : 'is-private'
      } ${compact ? 'compact' : ''} ${large ? 'large' : ''} ${
        dark ? 'plate-dark-pedestal' : ''
      } digits-${digitCount} letters-${letterCount} ${className}`}
      style={{
        ['--digit-count' as string]: digitCount,
        ['--letter-count' as string]: letterCount
      }}
      role="img"
      aria-label={`لوحة مركبة سعودية (${
        isTransport ? 'نقل خاص' : isSmall ? 'صغيرة رياضية' : 'خصوصي'
      }): ${letterPairs.map((p) => p.ar).join(' ')} ${digitPairs.map((p) => p.ar).join('')}`}
      dir="ltr"
    >
      {/* Subtle diagonal aluminum studio sheen (zero screws or mounting slots) */}
      <span className="q-sheen-highlight" aria-hidden="true" />

      <div
        className={`plate-inner-frame plate-layout-open ${
          isTransport ? 'is-transport' : isSmall ? 'is-small-frame' : 'is-private'
        }`}
      >
        {/* Left: Digits Section (Arabic top, English bottom — open field, no divider lines) */}
        <div data-pf-part="digits" className="q-plate-section q-digits-section">
          <div
            className="q-digits-block"
            style={{ gridTemplateColumns: `repeat(${digitCount}, minmax(0, 1fr))` }}
            dir="ltr"
            aria-label={`أرقام عربية: ${digitPairs.map((p) => p.ar).join('')}`}
          >
            {digitPairs.map((pair, idx) => (
              <span key={`ar-d-${idx}`} className="q-char-cell q-char-digit q-arabic-char">
                {pair.ar}
              </span>
            ))}
          </div>
          <div
            className="q-digits-block"
            style={{ gridTemplateColumns: `repeat(${digitCount}, minmax(0, 1fr))` }}
            dir="ltr"
            aria-label={`أرقام إنجليزية: ${digitPairs.map((p) => p.en).join('')}`}
          >
            {digitPairs.map((pair, idx) => (
              <span key={`en-d-${idx}`} className="q-char-cell q-char-digit q-latin-char">
                {pair.en}
              </span>
            ))}
          </div>
        </div>

        {/* Center: Official FBS Emblem (Always Centered Across All 3 Plate Categories) */}
        <div data-pf-part="fbs-logo" className="q-logo-zone q-logo-center">
          <FbsPlateEmblem />
        </div>

        {/* Right: Letters Section (Arabic top, English bottom — open field, no divider lines) */}
        <div data-pf-part="letters" className="q-plate-section q-letters-section">
          <div
            className="q-letters-block"
            style={{ gridTemplateColumns: `repeat(${letterCount}, minmax(0, 1fr))` }}
            dir="ltr"
            aria-label={`حروف عربية: ${letterPairs.map((p) => p.ar).join(' ')}`}
          >
            {letterPairs.map((pair, idx) => (
              <span key={`ar-l-${idx}`} className="q-char-cell q-char-letter q-arabic-char">
                {pair.ar}
              </span>
            ))}
          </div>
          <div
            className="q-letters-block"
            style={{ gridTemplateColumns: `repeat(${letterCount}, minmax(0, 1fr))` }}
            dir="ltr"
            aria-label={`حروف إنجليزية: ${letterPairs.map((p) => p.en).join(' ')}`}
          >
            {letterPairs.map((pair, idx) => (
              <span key={`en-l-${idx}`} className="q-char-cell q-char-letter q-latin-char">
                {pair.en}
              </span>
            ))}
          </div>
        </div>

        {/* Far-Right: Saudi Kingdom Pillar (Slim on Private/Transport, Wider on Sports/Small) */}
        <div
          data-pf-part="pillar"
          className={`q-kingdom-pillar ${
            isTransport
              ? 'q-pillar-right-transport'
              : isSmall
                ? 'q-pillar-right-private q-pillar-right-small'
                : 'q-pillar-right-private'
          }`}
        >
          <div className="q-pillar-top">
            {isTransport ? (
              <SaudiEmblem
                size={emblemSize}
                fillColor="#ffffff"
                className="q-saudi-emblem is-white-emblem shrink-0"
              />
            ) : isSmall ? (
              <SaudiEmblem
                size={emblemSize}
                fillColor="#0b0f17"
                className="q-saudi-emblem is-small-emblem shrink-0"
              />
            ) : (
              <SaudiEmblem
                size={emblemSize}
                treeColor="#0b6330"
                swordsColor="#084d25"
                className="q-saudi-emblem is-green-emblem shrink-0"
              />
            )}
            <span className="q-saudi-text">السعودية</span>
          </div>

          {isTransport ? (
            <>
              <span className="q-ksa-stack" aria-label="KSA">
                <span>K</span>
                <span>S</span>
                <span>A</span>
              </span>

              <span className="q-hologram-strip" title="شريط الهولوغرام الأمني">
                <span className="q-hologram-shimmer" />
                <span className="q-hologram-bars" />
              </span>

              <svg
                viewBox="0 0 14 12"
                className="q-transport-triangle shrink-0"
                aria-hidden="true"
              >
                <polygon points="1,1 13,1 7,11.2" fill="#080d16" />
              </svg>
            </>
          ) : (
            <>
              <span className="q-ksa-stack" aria-label="KSA">
                <span>K</span>
                <span>S</span>
                <span className="q-ksa-a-foil" title="شريط الأمان المعدني">
                  <span className="q-hologram-shimmer" />
                  <span className="q-hologram-bars" />
                  <span className="q-ksa-a-char">A</span>
                </span>
              </span>

              <span className="q-black-seal" title="الختم الأمني المعتمد" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import { SarSymbol, formatEnglishAmount } from '@/components/sar-symbol';

export const statusLabels: Record<string, string> = {
  LIVE: 'مباشر الآن',
  SCHEDULED: 'قادم',
  REGISTRATION_OPEN: 'التسجيل مفتوح',
  WAITING_ROOM: 'غرفة الانتظار',
  ENDED: 'انتهى المزاد',
  COMPLETED: 'مكتمل',
  PAUSED: 'متوقف مؤقتًا',
  PUBLISHED: 'معروضة للبيع',
  SOLD: 'تم البيع',
  DRAFT: 'مسودة',
  SUBMITTED: 'تم الإرسال',
  UNDER_REVIEW: 'قيد المراجعة',
  APPROVED: 'معتمدة',
  CHANGES_REQUIRED: 'مطلوب تعديل',
  REJECTED: 'مرفوضة',
  QUALIFIED: 'مؤهل للمزايدة',
  PAYMENT_PENDING: 'بانتظار التأمين',
  AUTHORIZED: 'التأمين مفوّض'
};

export function PlateCard({
  plate,
  mode = 'auction',
  isFavorite = false,
  isInCart = false,
  onToggleFavorite,
  onToggleCart,
  onBuyNow
}: {
  plate: MarketplacePlate;
  mode?: 'auction' | 'store';
  isFavorite?: boolean;
  isInCart?: boolean;
  onToggleFavorite?: (plate: MarketplacePlate) => void;
  onToggleCart?: (plate: MarketplacePlate) => void;
  onBuyNow?: (plate: MarketplacePlate) => void;
}) {
  const isStore = mode === 'store';
  const isLive = plate.auction?.status === 'LIVE';
  const isUpcoming =
    plate.auction?.status === 'SCHEDULED' || plate.auction?.status === 'REGISTRATION_OPEN';
  const statusText = statusLabels[plate.auction?.status ?? plate.status] ?? plate.status;
  const rawPrice = isStore
    ? plate.priceHalalas ?? plate.auction?.currentPriceHalalas ?? '0'
    : plate.auction?.currentPriceHalalas ?? plate.priceHalalas ?? '0';

  const normType = normalizePlateType(plate.type);
  const isTransport = normType === 'transport';
  const isSmall = normType === 'small';
  const typeLabel = isTransport ? 'نقل خاص' : isSmall ? 'صغيرة' : 'خصوصي';

  return (
    <article
      data-pf-audit="plate-card"
      style={{ containerType: 'inline-size' }}
      className="group relative h-full flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E7E5DF] hover:border-[#D9BB81] bg-white p-3 sm:p-3.5 shadow-[0_4px_16px_rgba(20,36,60,0.04)] hover:shadow-[0_12px_28px_rgba(20,36,60,0.08)] transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Subtle Top Specular Edge */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D9BB81]/40 to-transparent pointer-events-none" />

      {/* 1. Header:
          - Store mode: Plate Type + City (Right) & Wishlist + Cart Actions (Left)
          - Auction mode: Status Badge (Right) & Plate Type Badge (Left) */}
      <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-[#ECE9E2] pf-type-micro whitespace-nowrap">
        {isStore ? (
          <>
            <div className="flex items-center gap-1 min-w-0">
              <span
                className={`inline-flex items-center rounded-lg px-2 py-1 pf-type-micro font-bold shadow-2xs shrink-0 ${
                  isTransport
                    ? 'bg-amber-50 text-amber-800 border border-amber-200/80'
                    : isSmall
                      ? 'bg-slate-100 text-slate-700 border border-slate-200'
                      : 'bg-[#FAF9F6] text-[#14243C] border border-[#E5E2D9]'
                }`}
              >
                <span>{typeLabel}</span>
              </span>

              <span className="inline-flex items-center gap-1 rounded-lg bg-[#FAF7F0] border border-[#D9BB81]/50 px-2 py-1 pf-type-micro font-bold text-[#8C6B2D] shadow-2xs shrink-0">
                <MapPin size={11} className="text-[#9E7B35] shrink-0" />
                <span>{plate.city || 'الرياض'}</span>
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onToggleFavorite?.(plate);
                }}
                aria-label={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                title={isFavorite ? 'في المفضلة' : 'إضافة للمفضلة'}
                className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-all active:scale-95 ${
                  isFavorite
                    ? 'border-rose-300 bg-rose-50 text-rose-600 shadow-2xs'
                    : 'border-[#E5E2D9] bg-[#FAF9F6] text-slate-500 hover:border-rose-300 hover:bg-rose-50/60 hover:text-rose-600'
                }`}
              >
                <Heart size={13} className={isFavorite ? 'fill-rose-500 text-rose-600' : ''} />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onToggleCart?.(plate);
                }}
                aria-label={isInCart ? 'في سلة الشراء' : 'إضافة إلى سلة الشراء'}
                title={isInCart ? 'مضافة في سلة الشراء' : 'إضافة لسلة الشراء'}
                className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-all active:scale-95 ${
                  isInCart
                    ? 'border-[#9E7B35] bg-[#FAF7F0] text-[#8C6B2D] shadow-2xs'
                    : 'border-[#E5E2D9] bg-[#FAF9F6] text-slate-500 hover:border-[#D9BB81] hover:bg-[#FAF7F0] hover:text-[#8C6B2D]'
                }`}
              >
                {isInCart ? <Check size={13} strokeWidth={2.5} /> : <ShoppingCart size={13} />}
              </button>
            </div>
          </>
        ) : (
          <>
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 pf-type-micro font-bold text-emerald-700 border border-emerald-200/80 shadow-2xs">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
                </span>
                <span>{statusText}</span>
              </span>
            ) : isUpcoming ? (
              <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 pf-type-micro font-bold text-amber-800 border border-amber-200/80 shadow-2xs">
                <Clock size={11} strokeWidth={2.5} className="shrink-0" />
                <span>{statusText}</span>
              </span>
            ) : (
              <span className="inline-flex items-center rounded-lg bg-[#FAF9F6] px-2.5 py-1 pf-type-micro font-bold text-[#14243C] border border-[#E5E2D9] shadow-2xs">
                {statusText}
              </span>
            )}

            <span
              className={`inline-flex items-center rounded-lg px-2.5 py-1 pf-type-micro font-bold shadow-2xs ${
                isTransport
                  ? 'bg-amber-50 text-amber-800 border border-amber-200/80'
                  : isSmall
                    ? 'bg-slate-100 text-slate-700 border border-slate-200'
                    : 'bg-[#FAF9F6] text-[#14243C] border border-[#E5E2D9]'
              }`}
            >
              <span>{typeLabel}</span>
            </span>
          </>
        )}
      </div>

      {/* 2. Center: Authentic Saudi Plate on Tall Platinum Showcase Stage with Etched FBS Watermark */}
      <Link
        href={`/plates/${plate.slug}`}
        className="relative overflow-hidden my-2 sm:my-2.5 flex items-center justify-center rounded-xl bg-gradient-to-b from-[#FFFFFF] via-[#F6F8FC] to-[#EBF0F6] px-2.5 py-5 sm:px-3 sm:py-6 min-h-[132px] sm:min-h-[150px] border border-[#DCE3EE] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_2px_6px_rgba(15,23,42,0.04)] transition-all duration-300 group-hover:border-[#D9BB81]/70"
      >
        <FbsStageWatermark />
        <div className="relative z-10 w-full flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02] filter drop-shadow-[0_6px_14px_rgba(15,23,42,0.13)]">
          <PlateVisualizer
            lettersAr={plate.lettersAr}
            lettersEn={plate.lettersEn}
            numbers={plate.numbers}
            plateType={plate.type}
            compact
          />
        </div>
      </Link>

      {/* 3. Footer:
          - Store mode: السعر المطلوب (Right) + زر شراء بجانب السعر مباشرة (Left)
          - Auction mode: المزايدة الحالية + عدد المزايدات + زر دخول المزاد */}
      {isStore ? (
        <div className="pt-2 sm:pt-2.5 border-t border-[#ECE9E2] flex items-center justify-between gap-2 min-w-0">
          <div className="min-w-0">
            <span className="pf-type-micro font-semibold text-[#64748B] block leading-tight mb-0.5">
              السعر المطلوب
            </span>
            <div className="flex items-baseline gap-1 text-[#14243C]" dir="rtl">
              <span
                className="tabular-nums font-norwester text-[clamp(1.1rem,6cqi,1.35rem)] font-black tracking-tight text-[#14243C] leading-none"
                dir="ltr"
              >
                {formatEnglishAmount(rawPrice)}
              </span>
              <SarSymbol className="w-3.5 h-3.5 text-[#9E7B35] inline-block self-center shrink-0" />
            </div>
          </div>

          {onBuyNow ? (
            <button
              type="button"
              onClick={() => onBuyNow(plate)}
              className="group/btn shrink-0 min-h-9 sm:min-h-[38px] py-2 px-4 rounded-xl bg-[#14243C] hover:bg-[#08162B] text-white pf-type-micro font-bold shadow-2xs hover:shadow-xs active:scale-[0.98] transition-all inline-flex items-center justify-center gap-1.5"
            >
              <ShoppingBag size={13} className="text-[#D9BB81] shrink-0" />
              <span>شراء</span>
              <ArrowLeft size={12} className="text-[#D9BB81] shrink-0 transition-transform duration-200 group-hover/btn:-translate-x-0.5" />
            </button>
          ) : (
            <Link
              href={`/plates/${plate.slug}`}
              className="group/btn shrink-0 min-h-9 sm:min-h-[38px] py-2 px-4 rounded-xl bg-[#14243C] hover:bg-[#08162B] text-white pf-type-micro font-bold shadow-2xs hover:shadow-xs active:scale-[0.98] transition-all inline-flex items-center justify-center gap-1.5"
            >
              <ShoppingBag size={13} className="text-[#D9BB81] shrink-0" />
              <span>شراء</span>
              <ArrowLeft size={12} className="text-[#D9BB81] shrink-0 transition-transform duration-200 group-hover/btn:-translate-x-0.5" />
            </Link>
          )}
        </div>
      ) : (
        <div className="pt-2 sm:pt-2.5 border-t border-[#ECE9E2] flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
            <div className="min-w-0">
              <span className="pf-type-micro font-semibold text-[#64748B] block leading-tight mb-0.5">
                {plate.auction ? 'المزايدة الحالية' : 'السعر المطلوب'}
              </span>
              <div className="flex items-baseline gap-1 text-[#14243C]" dir="rtl">
                <span
                  className="tabular-nums font-norwester text-[clamp(1.1rem,6cqi,1.35rem)] font-black tracking-tight text-[#14243C] leading-none"
                  dir="ltr"
                >
                  {formatEnglishAmount(rawPrice)}
                </span>
                <SarSymbol className="w-3.5 h-3.5 text-[#9E7B35] inline-block self-center shrink-0" />
              </div>
            </div>

            {plate.auction?.bidCount !== undefined && plate.auction.bidCount > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-xl bg-[#FAF9F6] border border-[#E5E2D9] px-2.5 py-1 pf-type-micro font-bold text-[#14243C] shrink-0">
                <Gavel size={12} className="text-[#9E7B35] shrink-0" />
                <span className="font-norwester font-black">{plate.auction.bidCount}</span>
                <span className="text-[#64748B]">مزايدة</span>
              </span>
            ) : plate.verified ? (
              <span className="inline-flex items-center gap-1 pf-type-micro font-bold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/70 shrink-0">
                <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                <span>موثّقة</span>
              </span>
            ) : null}
          </div>

          <Link
            href={`/plates/${plate.slug}`}
            className="group/btn w-full min-h-9 sm:min-h-[38px] py-2 px-3 rounded-xl bg-[#14243C] hover:bg-[#08162B] text-white pf-type-micro font-bold shadow-2xs hover:shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 mt-0.5"
          >
            <Gavel size={13} className="text-[#D9BB81] shrink-0 transition-transform duration-200 group-hover/btn:-rotate-12" />
            <span className="text-center">
              {plate.auction ? 'دخول المزاد والمزايدة' : 'تفاصيل اللوحة والشراء'}
            </span>
            <ArrowLeft size={13} className="text-[#D9BB81] shrink-0 transition-transform duration-200 group-hover/btn:-translate-x-1" />
          </Link>
        </div>
      )}
    </article>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton-shimmer rounded-lg ${className}`} />;
}

export function PlateCardSkeleton() {
  return (
    <article className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E7E5DF] bg-white p-3 sm:p-3.5 shadow-2xs">
      <div className="flex items-center justify-between pb-2 border-b border-[#ECE9E2]">
        <div className="h-5 w-20 rounded-full skeleton-shimmer" />
        <div className="h-5 w-24 rounded-lg skeleton-shimmer" />
      </div>

      <div className="my-2 rounded-xl bg-[#F6F8FC] h-[132px] sm:h-[150px] border border-[#DCE3EE] flex items-center justify-center p-2.5">
        <div className="w-full max-w-[230px] h-[64px] rounded-lg skeleton-shimmer" />
      </div>

      <div className="pt-2 border-t border-[#ECE9E2] space-y-2.5">
        <div className="flex items-end justify-between">
          <div className="space-y-1.5">
            <div className="h-3 w-16 rounded-md skeleton-shimmer" />
            <div className="h-5 w-24 rounded-md skeleton-shimmer" />
          </div>
          <div className="h-6 w-16 rounded-xl skeleton-shimmer" />
        </div>
        <div className="h-9 w-full rounded-xl skeleton-shimmer" />
      </div>
    </article>
  );
}

export function PlateCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-3.5 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <PlateCardSkeleton key={i} />
      ))}
    </div>
  );
}

