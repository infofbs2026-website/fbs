import { PLATE_GLYPHS_AR, normalizeSaudiPlateArChar, type PlateGlyphSpec } from './plate-glyphs-ar';
import { PLATE_GLYPHS_EN, PLATE_GLYPHS_EN_FALLBACK, normalizeSaudiPlateEnChar } from './plate-glyphs-en';

export const PLATE_INK = '#202629';
export const PLATE_GLYPH_STROKE = 0.25;
const EMPTY_GLYPH: PlateGlyphSpec = { w: 26, d: 'M5 36H21V39H5Z' };

// A vector for the existing brand demo only; never part of the Saudi alphabet.
const BRAND_FA: PlateGlyphSpec = {
  w: 47,
  d: 'M31.3 28C38.4 27.4 42.1 33.7 44.7 42.4C47.5 51.8 44.1 59.8 35.4 64.4C27.2 68.8 14.7 69.6 7.1 65C0 60.8 0.7 52 4.4 43.7L7.9 38.3L10.1 39.7C7.1 45.8 5.6 51.5 8.9 55.4C12.8 60.2 22 60.6 30.2 57.9C36.6 55.8 40.8 52.8 41 48.3C36.8 50.6 30 51.6 26.3 48.4C22 44.6 24.6 35 27.2 31.3C28.4 29.6 29.8 28.3 31.3 28ZM29.7 40.5C30 43 35 43.3 39.5 41.6C37.5 36.2 34.9 34.2 32.7 35.5C30.7 36.7 29.7 38.7 29.7 40.5ZM31.8 12.1L37.1 15.7L33.6 21.5L28.3 17.9L31.8 12.1Z',
};

type OpticalOffset = { x: number; y: number };
const AR_OPTICAL: Record<string, OpticalOffset> = {
  ا: { x: -0.1, y: 0 },
  د: { x: 0, y: 4 },
  ط: { x: 0, y: 3 },
  هـ: { x: 0, y: 4.5 },
  م: { x: -0.5, y: 0 },
};
const EN_OPTICAL: Record<string, OpticalOffset> = {
  '1': { x: 0.4, y: 0 },
  B: { x: -0.5, y: 0 },
  J: { x: 0.2, y: 0 },
  L: { x: -0.7, y: 0 },
};

export function getPlateGlyph(char: string, language: 'ar' | 'en', brandDemo = false) {
  const key = language === 'ar' ? normalizeSaudiPlateArChar(char) : normalizeSaudiPlateEnChar(char);
  const base = language === 'ar' ? PLATE_GLYPHS_AR[key] : PLATE_GLYPHS_EN[key];
  const demo = brandDemo
    ? language === 'ar' && char === 'ف'
      ? BRAND_FA
      : language === 'en' && char === 'F'
        ? PLATE_GLYPHS_EN_FALLBACK.F
        : undefined
    : undefined;
  const offset = (language === 'ar' ? AR_OPTICAL : EN_OPTICAL)[key];
  return {
    ...(base ?? demo ?? EMPTY_GLYPH),
    x: offset?.x ?? 0,
    y: offset?.y ?? 0,
    placeholder: !base && !demo,
  };
}

/** The shared 72-unit canvas preserves naturally shorter Arabic letter bodies. */
export function PlateVectorGlyph({
  char,
  language,
  cx,
  y,
  height,
  brandDemo = false,
}: {
  char: string;
  language: 'ar' | 'en';
  cx: number;
  y: number;
  height: number;
  brandDemo?: boolean;
}) {
  const spec = getPlateGlyph(char, language, brandDemo);
  const scale = height / 72;
  return (
    <g
      className={`q-char-cell q-${language}-vector`}
      data-plate-char={spec.placeholder ? '' : char}
      data-plate-placeholder={spec.placeholder ? 'true' : undefined}
      data-plate-column-center={cx}
      transform={`translate(${cx - (spec.w * scale) / 2 + spec.x * scale} ${y + spec.y * scale}) scale(${scale})`}
    >
      <path
        d={spec.d}
        fill={PLATE_INK}
        stroke={PLATE_INK}
        strokeWidth={PLATE_GLYPH_STROKE}
        strokeLinejoin="round"
        paintOrder="stroke fill"
      />
    </g>
  );
}

/** Compatibility exports use the same vector source and neutral placeholders. */
export function PlateGlyphIcon({
  char,
  language,
  className = '',
}: {
  char: string;
  language: 'ar' | 'en';
  className?: string;
}) {
  const spec = getPlateGlyph(char, language);
  return (
    <svg
      viewBox={`0 0 ${spec.w} 72`}
      className={`q-${language}-svg-glyph ${className}`}
      aria-hidden="true"
      style={{ display: 'block', height: '1em', width: 'auto' }}
    >
      <path
        d={spec.d}
        fill={PLATE_INK}
        stroke={PLATE_INK}
        strokeWidth={PLATE_GLYPH_STROKE}
        strokeLinejoin="round"
      />
    </svg>
  );
}
