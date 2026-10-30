import { useId } from 'react';
import { FbsPlateEmblem, SaudiEmblem } from './plate-emblems';
import { getPlateGlyph, PlateVectorGlyph } from './plate-vector-glyph';
import {
  getPlateGeometry,
  type ParsedPlateData,
  type PlateFormat,
  type PlatePair,
  type SaudiPlateType,
} from '@/lib/plate-data';

export function plateAccessibleLabel(plate: ParsedPlateData, type: SaudiPlateType) {
  const category = type === 'transport' ? 'نقل خاص' : type === 'small' ? 'صغيرة رياضية' : 'خصوصي';
  const letters = plate.letterPairs
    .toReversed()
    .map((pair) => pair.ar || '—')
    .join(' ');
  const numbers = plate.digitPairs.map((pair) => pair.ar || '—').join('');
  const prefix = plate.status === 'demo' ? 'لوحة FBS' : 'لوحة مركبة سعودية';
  return `${prefix} (${category}): ${letters} ${numbers}${plate.status === 'invalid' ? '، يرجى مراجعة بيانات اللوحة' : ''}`;
}

function GlyphRow({
  pairs,
  language,
  zone,
  y,
  height,
  brandDemo,
}: {
  pairs: PlatePair[];
  language: 'ar' | 'en';
  zone: { x: number; width: number };
  y: number;
  height: number;
  brandDemo: boolean;
}) {
  const cellWidth = zone.width / pairs.length;
  const widest = Math.max(...pairs.map((pair) => getPlateGlyph(pair[language], language, brandDemo).w));
  // Fit the entire row together; never squeeze an individual wide character.
  const fittedHeight = Math.min(height, (Math.max(1, cellWidth - 6) * 72) / widest);
  return (
    <g data-plate-row={language}>
      {pairs.map((pair, index) => (
        <PlateVectorGlyph
          key={index}
          char={pair[language]}
          language={language}
          cx={zone.x + cellWidth * (index + 0.5)}
          y={y + (height - fittedHeight) / 2}
          height={fittedHeight}
          brandDemo={brandDemo}
        />
      ))}
    </g>
  );
}

/** One scale-safe face for cards, detail pages and the car-mounted preview. */
export function PlateFace({
  plate,
  type,
  format = 'long',
  className = '',
  showBrand = true,
}: {
  plate: ParsedPlateData;
  type: SaudiPlateType;
  format?: PlateFormat;
  className?: string;
  showBrand?: boolean;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const id = (part: string) => `pf-${uid}-${part}`;
  const geometry = getPlateGeometry(type, format);
  const { width, height, pillarX, pillarWidth, rows } = geometry;
  const long = format === 'long';
  const fieldStart = long ? 14 : 10;
  const middle = (fieldStart + pillarX) / 2;
  const digitsZone = showBrand ? geometry.digits : { x: fieldStart, width: middle - fieldStart - 4 };
  const lettersZone = showBrand ? geometry.letters : { x: middle + 4, width: pillarX - middle - 12 };
  const small = type === 'small';
  const transport = type === 'transport';
  const cx = pillarX + pillarWidth / 2;
  const digits = plate.digitPairs.length
    ? plate.digitPairs
    : Array.from({ length: 4 }, () => ({ ar: '', en: '' }));
  const letters = plate.letterPairs.length
    ? plate.letterPairs
    : Array.from({ length: 3 }, () => ({ ar: '', en: '' }));
  const brandDemo = plate.status === 'demo';
  const digitHeight = rows.digitHeight - (digits.length === 4 ? 4 : 0);
  const emblemSize = long ? (small ? 28 : 23) : small ? 31 : 25;
  const ksaY = long ? (small ? 54.5 : 50.5) : 82;
  const ksaStep = long ? 10 : 14;
  const ksaFont = long ? (small ? 11.8 : 10.2) : 13.2;
  const aY = ksaY + ksaStep * 2;
  const symbolY = long ? (small ? 93 : 90) : 149;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={`fbs-plate-face ${className}`}
      style={{ display: 'block', width: '100%', height: 'auto' }}
      role="img"
      aria-labelledby={id('title')}
      aria-describedby={plate.status === 'invalid' ? id('description') : undefined}
      data-plate-face={format}
      data-plate-type={type}
      data-plate-status={plate.status}
      preserveAspectRatio="xMidYMid meet"
    >
      <title id={id('title')}>{plateAccessibleLabel(plate, type)}</title>
      {plate.status === 'invalid' ? (
        <desc id={id('description')}>
          بيانات اللوحة غير مكتملة أو غير متطابقة. تظهر علامة محايدة بدل الرمز الذي يحتاج مراجعة.
        </desc>
      ) : null}
      <defs>
        <linearGradient id={id('rim')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fcfdff" />
          <stop offset="0.24" stopColor="#e9edf0" />
          <stop offset="0.6" stopColor="#bbc3ca" />
          <stop offset="0.84" stopColor="#929ea8" />
          <stop offset="1" stopColor="#e1e6ea" />
        </linearGradient>
        <linearGradient id={id('body')} x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0" stopColor="#dce2eb" />
          <stop offset="0.18" stopColor="#ecf0f6" />
          <stop offset="0.42" stopColor="#ffffff" />
          <stop offset="0.57" stopColor="#f9fbfd" />
          <stop offset="0.82" stopColor="#e2e8f0" />
          <stop offset="1" stopColor="#f3f6fa" />
        </linearGradient>
        <linearGradient id={id('pillar-white')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#f1f5f9" />
          <stop offset="1" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id={id('sheen')} x1="0" y1="0" x2="1" y2="0.5">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="0.22" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="0.4" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.52" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="0.66" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#0f172a" stopOpacity="0.035" />
        </linearGradient>
        <linearGradient id={id('recess-top')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f172a" stopOpacity="0.24" />
          <stop offset="1" stopColor="#0f172a" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id('recess-bottom')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#ffffff" stopOpacity={transport ? 0.4 : 0.92} />
        </linearGradient>
        <linearGradient id={id('recess-left')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0f172a" stopOpacity="0.14" />
          <stop offset="1" stopColor="#0f172a" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id('recess-right')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#ffffff" stopOpacity={transport ? 0.28 : 0.8} />
        </linearGradient>
        <linearGradient id={id('blue')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#159ac9" />
          <stop offset="0.55" stopColor="#1286b3" />
          <stop offset="1" stopColor="#106a93" />
        </linearGradient>
        <linearGradient id={id('foil')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#94a3b8" />
          <stop offset="0.26" stopColor="#cbd5e1" />
          <stop offset="0.52" stopColor="#f8fafc" />
          <stop offset="0.78" stopColor="#cbd5e1" />
          <stop offset="1" stopColor="#94a3b8" />
        </linearGradient>
        <pattern id={id('brushed')} width="4" height="2" patternUnits="userSpaceOnUse">
          <rect width="4" height="1" fill="#0f172a" opacity="0.014" />
          <rect y="1" width="4" height="1" fill="#ffffff" opacity="0.32" />
        </pattern>
        <pattern id={id('grain')} width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="1.2" cy="2.4" r="0.4" fill="#5f6870" opacity="0.035" />
          <circle cx="5.5" cy="6.2" r="0.55" fill="#ffffff" opacity="0.3" />
        </pattern>
        <filter id={id('emboss')} x="-30%" y="-12%" width="160%" height="128%">
          <feDropShadow dx="-0.55" dy="-0.6" stdDeviation="0.16" floodColor="#fff" floodOpacity="0.92" />
          <feDropShadow dx="0.75" dy="1.15" stdDeviation="0.45" floodColor="#202629" floodOpacity="0.34" />
        </filter>
        <clipPath id={id('inside')}>
          <rect x="2.5" y="2.5" width={width - 5} height={height - 5} rx="7" />
        </clipPath>
      </defs>

      <rect
        x="0.5"
        y="0.5"
        width={width - 1}
        height={height - 1}
        rx="9.5"
        fill={`url(#${id('rim')})`}
        stroke="#7c8993"
        strokeWidth="0.8"
      />
      <g clipPath={`url(#${id('inside')})`}>
        <rect x="2.5" y="2.5" width={width - 5} height={height - 5} fill={`url(#${id('body')})`} />
        <rect x="2.5" y="2.5" width={width - 5} height={height - 5} fill={`url(#${id('grain')})`} />
        <rect x="2.5" y="2.5" width={pillarX - 2.5} height={height - 5} fill={`url(#${id('brushed')})`} />
        <rect
          x={pillarX}
          y="2.5"
          width={pillarWidth}
          height={height - 5}
          fill={`url(#${id(transport ? 'blue' : 'pillar-white')})`}
        />
        {!transport ? (
          <rect x={pillarX} y="2.5" width={pillarWidth} height={height - 5} fill={`url(#${id('brushed')})`} />
        ) : null}
        <rect x="2.5" y="2.5" width={width - 5} height={height - 5} fill={`url(#${id('sheen')})`} />
        {/* Surface relief sits inside the existing frame; its geometry is unchanged. */}
        <rect x="3.8" y="3.8" width={width - 7.6} height="5.2" fill={`url(#${id('recess-top')})`} />
        <rect
          x="3.8"
          y={height - 9.6}
          width={width - 7.6}
          height="5.8"
          fill={`url(#${id('recess-bottom')})`}
        />
        <rect x="3.8" y="3.8" width="4" height={height - 7.6} fill={`url(#${id('recess-left')})`} />
        <rect x={width - 7.8} y="3.8" width="4" height={height - 7.6} fill={`url(#${id('recess-right')})`} />
      </g>
      <rect
        x="3.8"
        y="3.8"
        width={width - 7.6}
        height={height - 7.6}
        rx="6.8"
        fill="none"
        stroke="#111621"
        strokeWidth="3.4"
      />
      <line x1={pillarX} y1="3.8" x2={pillarX} y2={height - 3.8} stroke="#111621" strokeWidth="2.8" />

      <g data-pf-part="digits" filter={`url(#${id('emboss')})`}>
        <GlyphRow
          pairs={digits}
          language="ar"
          zone={digitsZone}
          y={rows.arabicY}
          height={digitHeight}
          brandDemo={false}
        />
        <GlyphRow
          pairs={digits}
          language="en"
          zone={digitsZone}
          y={rows.latinY}
          height={Math.min(digitHeight, 40)}
          brandDemo={false}
        />
      </g>
      {showBrand ? (
        <g data-pf-part="fbs-logo" transform={`translate(${geometry.logo.x} ${geometry.logo.y})`}>
          <FbsPlateEmblem width={geometry.logo.width} height={geometry.logo.height} />
        </g>
      ) : null}
      <g data-pf-part="letters" filter={`url(#${id('emboss')})`}>
        <GlyphRow
          pairs={letters}
          language="ar"
          zone={lettersZone}
          y={rows.arabicY}
          height={rows.letterHeight}
          brandDemo={brandDemo}
        />
        <GlyphRow
          pairs={letters}
          language="en"
          zone={lettersZone}
          y={rows.latinY}
          height={rows.letterHeight}
          brandDemo={brandDemo}
        />
      </g>

      <g
        data-pf-part="pillar"
        textAnchor="middle"
        fill="#111621"
        fontFamily="var(--font-plate-din), 'Bahnschrift', sans-serif"
        fontWeight="700"
      >
        <g transform={`translate(${cx - emblemSize / 2} ${long ? 6.5 : 10})`}>
          <SaudiEmblem
            size={emblemSize}
            fillColor={transport ? '#ffffff' : '#0b0f17'}
            treeColor={!small && !transport ? '#0b6330' : undefined}
            swordsColor={!small && !transport ? '#084d25' : undefined}
          />
        </g>
        <text
          x={cx}
          y={long ? (small ? 42.5 : 38) : 51}
          fontSize={Math.min(long ? (small ? 9.4 : 7.8) : 9.5, (pillarWidth - 8) / 4.4)}
          fontFamily="var(--font-plate-naskh), 'Noto Naskh Arabic', serif"
          textLength={Math.min(pillarWidth - 8, long ? (small ? 35 : 28) : small ? 34 : 25)}
          lengthAdjust="spacingAndGlyphs"
        >
          السعودية
        </text>
        <text x={cx} y={ksaY} fontSize={ksaFont}>
          K
        </text>
        <text x={cx} y={ksaY + ksaStep} fontSize={ksaFont}>
          S
        </text>
        {transport ? (
          <>
            <text x={cx} y={aY} fontSize={ksaFont}>
              A
            </text>
            <rect
              x={cx - pillarWidth * 0.33}
              y={aY + 8}
              width={pillarWidth * 0.66}
              height={long ? 6 : 7}
              rx="1"
              fill={`url(#${id('foil')})`}
            />
            <path d={`M${cx - 5.8} ${symbolY + 2}H${cx + 5.8}L${cx} ${symbolY + 12}Z`} />
          </>
        ) : (
          <>
            <rect
              x={cx - pillarWidth * 0.33}
              y={aY - ksaFont * 0.88}
              width={pillarWidth * 0.66}
              height={ksaFont + 2}
              rx="1.5"
              fill={`url(#${id('foil')})`}
              stroke="#8a969e"
              strokeWidth="0.45"
            />
            <text x={cx} y={aY} fontSize={ksaFont}>
              A
            </text>
            <circle cx={cx} cy={symbolY} r={small ? 8.2 : 5.2} />
          </>
        )}
      </g>
    </svg>
  );
}
