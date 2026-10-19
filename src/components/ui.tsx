import Link from 'next/link';
import { ArrowLeft, Clock, Crown, Gavel, MapPin, Palmtree, SearchX, ShieldCheck } from 'lucide-react';
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
  strokeColor = '#0b0f17'
}: {
  className?: string;
  size?: number;
  fillColor?: string;
  strokeColor?: string;
}) {
  return (
    <svg
      viewBox="0 0 610 665"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0 }}
    >
      {/* Right Curved Scimitar Blade */}
      <path
        d="M 269.37768,588.73967 379.31541,478.80192 c 80.23452,-66.04726 152.79805,-49.90475 225.0899,-30.85208 -67.01024,-48.72317 -141.9926,-68.30165 -234.6497,0 L 238.5256,558.75662 Z"
        fill={fillColor}
        fillRule="evenodd"
        stroke={strokeColor}
        strokeWidth="3"
      />
      {/* Right Scimitar Hilt, Guard & Pommel */}
      <path
        d="m 249.82354,606.55565 -39.54282,41.71548 c -17.21111,14.02431 -33.15742,8.00956 -45.19177,-4.34537 -9.55542,-20.27357 10.09925,-32.30458 24.33402,-24.33401 l 36.9356,-39.97737 c 6.27509,-7.69551 2.07548,-11.20114 -3.04175,-14.33969 l -7.82166,-6.51807 c -10.72732,-13.99073 5.9128,-21.91045 13.47062,-13.90513 l 17.81601,19.11961 c 0,0 89.45335,-68.28458 90.81812,-68.65679 -0.49628,1.24071 -73.43666,86.03822 -73.43666,86.03822 l 19.11961,13.90516 c 14.89397,11.1339 0.15733,22.81849 -10.42888,14.33973 l -8.2562,-6.95262 c -5.9135,-2.97461 -10.59873,-1.94971 -14.77424,3.91085 z"
        fill={fillColor}
        fillRule="evenodd"
        stroke={strokeColor}
        strokeWidth="3"
      />
      {/* Left Curved Scimitar Blade */}
      <path
        d="M 340.62229,588.79173 230.68457,478.85398 C 150.45004,412.8067 77.886559,428.94923 5.5946881,448.00188 c 67.0102369,-48.72315 141.9925919,-68.30163 234.6496919,0 L 371.4744,558.80869 Z"
        fill={fillColor}
        fillRule="evenodd"
        stroke={strokeColor}
        strokeWidth="3"
      />
      {/* Left Scimitar Hilt, Guard & Pommel */}
      <path
        d="m 360.17646,606.60772 39.54281,41.71547 c 17.21111,14.02431 33.15741,8.00956 45.19177,-4.34536 9.55541,-20.2736 -10.09925,-32.30459 -24.33401,-24.33402 l -36.93562,-39.97736 c -6.27507,-7.69551 -2.07549,-11.20115 3.04176,-14.33969 l 7.82167,-6.51807 c 10.72731,-13.99074 -5.9128,-21.91045 -13.47065,-13.90514 l -17.81599,19.11959 c 0,0 -89.08113,-68.03642 -90.81812,-68.65677 0.62035,1.61292 73.43667,86.03823 73.43667,86.03823 l -19.11961,13.90513 c -14.89397,11.13392 -0.15734,22.81851 10.42888,14.33973 l 8.25619,-6.9526 c 5.91349,-2.97461 10.59874,-1.9497 14.77425,3.91086 z"
        fill={fillColor}
        fillRule="evenodd"
        stroke={strokeColor}
        strokeWidth="3"
      />
      {/* Crossed Blade Intersection Relief Accents */}
      <path d="m 332.07385,500.53565 -72.6905,67.34626" fill="none" stroke={strokeColor} strokeWidth="4" />
      <path d="m 277.80208,500.42703 72.81456,67.50694" fill="none" stroke={strokeColor} strokeWidth="4" />
      {/* Official Palm Tree: Segmented Trunk, Fronds & Full Canopy */}
      <g stroke={strokeColor} strokeWidth="2.5" fill={fillColor}>
        <path
          d="m 315.61891,156.19943 h -31.72117 c -21.82067,47.16315 -3.7384,54.59727 -8.69073,56.48975 -4.05566,1.54081 -8.11133,0.19696 -12.167,-0.43453 6.12085,9.16655 14.1265,20.02149 9.12526,23.03043 -5.79382,-0.86906 -8.54587,-1.44846 -10.86341,-6.95258 l -1.30362,26.07219 c -1.70906,6.57537 -7.98505,6.98226 -9.99433,-0.43454 -4.61794,-38.95955 3.45919,-75.03386 24.33404,-108.19959 l -5.64898,-2.60722 c -7.23253,12.76412 -22.0956,16.71093 -18.25052,52.14438 -3.57891,4.8162 -6.26204,4.25775 -8.69073,2.17268 l -1.30362,53.88252 c -2.64016,5.57971 -5.50681,9.68714 -10.42886,0.43455 l -9.55981,-32.59025 c -4.76415,-13.95437 -11.26261,-46.17159 20.85776,-67.78769 10.96888,-8.09165 20.89657,-15.66272 29.54848,-22.59589 l -13.03611,3.47629 c -31.67272,29.06032 -75.86111,38.09109 -69.52583,106.46145 -2.23532,5.03953 -5.67912,7.44958 -9.99434,0.86906 -4.52605,-16.69979 -12.47974,-32.35378 -2.60722,-57.35881 13.3856,-21.84603 28.90965,-37.25078 50.40624,-53.01345 -17.47923,2.17997 -35.40215,1.10614 -49.53716,27.81033 -4.34046,9.07132 -7.66487,6.96603 -10.86341,3.47629 l -4.7799,18.68507 c -5.27795,7.90229 -12.67086,0.90769 -9.55981,-6.08351 3.62114,-8.69073 16.39103,-90.864915 95.59802,-58.66242 8.92589,4.26316 17.09002,2.94648 3.91083,-7.38712 -9.61008,-4.77395 -23.11483,-23.935965 -54.31705,-9.559795 -12.54448,10.812585 -11.91611,-3.97275 -4.7799,-9.12527 -13.84363,6.12328 -27.13289,13.909675 -38.67375,26.941255 -7.33625,6.46718 -12.12029,-0.0467 -9.12527,-6.51805 13.26354,-16.354365 28.59878,-33.812355 64.3114,-33.893835 9.84271,-2.60722 3.84815,-5.21444 1.73815,-7.82166 -32.97249,-8.55059 -36.31849,1.50404 -50.40624,14.77424 -1.99554,3.68396 -10.68179,3.49553 -8.25619,-4.7799 18.928,-37.79553 89.74701,-47.95806 121.23567,3.4763 3.532,4.74424 7.94439,0.87452 4.34536,-3.4763 -7.91938,-7.50524 -19.9546,-35.64832 -48.66807,-34.32838 -4.14983,0.36581 -10.16094,-3.69278 -6.95258,-6.51805 -17.67116,-3.94487 -40.55674,3.03367 -58.22789,15.20878 -0.55356,1.56748 -16.80759,3.19211 -14.33971,-6.08351 39.43086,-36.0742006 107.7035,-30.51611 130.36094,6.95258 -1.82151,-9.25411 4.34501,-22.16126 -15.64331,-26.07219 -6.64301,-8.94653 23.03387,-22.6476506 29.54849,-19.9886706 14.42029,4.3252106 12.19862,12.8109206 13.47062,20.4232106 1.03958,5.74801 2.95395,7.99877 7.82167,-0.43454 25.5276,-35.7910002 76.05129,-14.63438 93.42535,-9.12526 8.14745,5.75033 6.60798,10.75455 -2.17273,11.29795 l -33.89382,-4.34537 c 3.47088,1.67912 4.54215,6.78916 -2.17269,6.51805 -18.31189,-3.30171 -29.44726,-0.66655 -36.95016,8.677 0.0662,0.73975 -1.47374,10.01585 -11.97158,8.97786 -3.77508,0.10063 -8.70296,1.91346 -10.4627,7.93553 -0.63271,3.63646 2.41377,4.96998 5.0317,3.14886 18.53306,-17.00107 65.07513,-35.41366 104.75901,-9.18511 l 22.16135,20.85775 c 8.54343,8.95139 -3.98058,13.64471 -7.38711,8.2562 -31.74995,-28.88 -58.08164,-22.77421 -88.21092,-13.90518 -1.13326,3.42034 -2.81576,7.15452 3.91081,6.08352 53.45818,-15.66792 96.51304,16.91818 103.85423,47.799005 2.59014,18.46337 -7.98105,16.79597 -13.03609,7.38712 -5.75241,-13.22242 -9.12632,-31.476085 -18.2505,-29.983015 0,0 -2.09921,7.035455 -10.42888,4.345365 -3.63172,-1.172875 -10.78463,-14.997895 -22.59593,-16.077845 1.82907,6.36475 -33.72417,7.49678 -53.44799,6.95258 -2.00822,2.36253 -4.70409,4.83969 0,6.08351 50.53343,-12.356 90.97713,2.371035 119.49754,49.102615 l 9.99433,24.33404 c 6.77394,27.23633 -6.56175,26.21465 -16.94691,13.0361 -13.62519,-19.39958 -25.60163,-40.4479 -41.28096,-57.79335 -1.57729,8.60994 -5.76539,6.77664 -9.55981,6.51804 -22.00668,-19.84246 -41.49316,-20.78339 -61.26966,-23.8995 -2.5256,2.67832 -5.36019,5.4008 0,6.95258 37.0045,8.83993 88.92369,26.49855 89.94908,106.89597 0.14479,10.39457 -11.87733,24.86323 -17.81601,6.51805 l 4.77992,-27.3758 c 2.09031,-4.29593 -1.58053,-8.69839 -4.34537,-6.51805 -4.21375,4.05146 -7.08018,3.61188 -7.82169,-3.91082 0.6183,-6.47211 -1.63851,-13.663 -5.64896,-21.29229 -2.91094,10.569 -8.32751,7.35701 -13.47064,5.64897 l -27.37579,-28.24487 c 31.36463,49.46592 13.70652,75.98934 9.12527,84.30007 -5.15225,3.60428 -11.06991,6.24382 -12.16703,-2.17266 0.72187,-9.06781 1.25637,-15.9135 8.25619,-22.59591 4.61733,-8.30308 0.3189,-10.73324 -3.04174,-10.42888 -7.06298,1.86513 -5.50969,-15.22552 -7.38714,-24.76858 -7.32433,-0.3935 -7.06605,-4.57831 -5.21442,-9.55979 4.59122,-8.3303 -2.4338,-12.30449 -6.51805,-17.38147 l -8.69073,2.17268 c 16.52443,28.07848 20.64248,67.03746 18.25052,86.47276 -1.90842,7.42588 -10.81885,11.98941 -15.6433,0.43453 -0.40877,-26.07218 -9.61169,-52.14437 -16.5124,-78.21656 z"
          fillRule="evenodd"
        />
        {/* Palm Trunk Ring Segments */}
        <path
          d="m 321.18381,161.71733 -7.82164,5.21444 -0.43455,10.42888 h 9.12528 l -8.69073,9.12526 v 9.55981 l 10.42888,0.43453 -10.17435,9.50709 -0.23649,7.17856 8.7615,-0.13401 -8.69073,9.12524 v 9.55982 l 10.42888,0.43453 -10.17435,9.5071 -0.11904,11.91777 8.818,0.30726 -8.69073,9.12529 v 9.55979 l 10.42888,0.43455 -10.17432,9.50707 -0.23651,7.17857 8.76149,-0.13401 -8.69072,9.12526 v 9.55982 l 10.42887,0.43453 -10.17432,9.50709 0.12719,8.84888 9.48715,-0.61 -9.2179,11.67603 v 7.98886 l 9.83244,0.61451 -9.21791,10.13971 v 9.83243 l 9.83244,0.30728 -11.0615,12.29054 -0.30726,9.83244 h 9.83244 l -9.83244,10.13971 v 9.52514 l 10.75423,-0.61451 -10.44697,14.13411 0.30725,11.36878 -12.79186,-0.20046 -14.53003,-0.27493 0.30726,-11.36876 -10.44695,-14.13414 10.75422,0.61451 v -9.52513 l -9.83243,-10.13972 h 9.83243 l -0.30727,-9.83243 -11.06148,-12.29054 9.83243,-0.30728 v -9.83243 l -9.2179,-10.13969 9.83244,-0.61454 v -7.98886 l -9.21793,-11.67603 9.48718,0.61 0.12719,-8.84888 -10.17435,-9.50709 10.42888,-0.43453 v -9.55979 l -8.69073,-9.12526 8.7615,0.13401 -0.23649,-7.17857 -10.17433,-9.50707 10.42886,-0.43455 v -9.5598 l -8.69073,-9.12526 8.81801,-0.30728 -0.11905,-11.91778 -10.17432,-9.50709 10.42887,-0.43453 v -9.5598 l -8.69072,-9.12526 8.76149,0.13401 -0.23651,-7.17856 -10.17432,-9.50709 10.42888,-0.43454 v -9.5598 l -8.69073,-9.12527 h 9.12526 l -0.43453,-10.42887 -7.82167,-5.21444 c 0,0 7.9004,-15.46238 14.45795,-21.4233 4.5767,-4.16031 8.60336,-6.14528 14.29583,0.48038 5.65593,6.58316 12.64284,21.41829 12.64284,21.41829 z"
          fillRule="evenodd"
        />
        {/* Palm Canopy Spreading Fronds */}
        <path
          d="m 261.10214,462.81027 h 86.90729 c -1.0905,-20.7086 14.97041,-34.27079 26.94125,-49.53717 -7.48446,3.01025 -24.33023,12.7616 -33.02477,27.81038 -0.007,-7.03198 2.68661,-12.00662 5.64899,-16.94695 -10.80418,3.69752 -14.03506,13.36672 -19.55414,21.29229 0.39204,-7.61827 8.35781,-24.2981 18.25052,-30.41753 -8.9314,0.34755 -18.45033,8.30771 -26.94125,20.85771 0.30039,-12.45135 7.51221,-23.77585 14.77424,-30.41752 -6.38404,1.12306 -21.58064,13.39525 -25.20312,29.54846 -3.73011,-10.71857 -0.94551,-21.43715 0.86906,-32.15568 -9.11751,7.27284 -11.58838,20.08457 -13.90515,33.02474 0,0 -10.32709,-26.26917 -13.0361,-29.54848 0.57033,4.84767 1.73813,31.28663 1.73813,31.28663 -9.2701,-14.21093 -15.933,-21.82663 -22.59589,-25.20312 0,0 15.21558,25.10133 15.64331,27.81034 -10.87358,-6.91191 -21.87797,-13.30055 -33.89385,-15.64329 8.21045,7.60822 18.09416,14.54707 20.85776,24.33402 -12.50952,-6.58409 -20.71644,-7.78987 -28.6794,-8.69073 7.27642,5.23304 20.30187,10.26052 25.20312,22.5959 z"
          fillRule="evenodd"
        />
      </g>
    </svg>
  );
}

function PlateMountDimple({ className = '' }: { className?: string }) {
  return <span className={`q-mount-dimple ${className}`} aria-hidden="true" />;
}

function PlateSlot({ className = '' }: { className?: string }) {
  return <span className={`q-oval-slot ${className}`} aria-hidden="true" />;
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

function parsePlateData(
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

  const rawAr = Array.isArray(lettersAr) ? lettersAr.join('') : (lettersAr || '');
  const cleanAr = rawAr.replace(/[\s\-_]/g, '').split('');

  const rawEn = Array.isArray(lettersEn) ? lettersEn.join('') : (lettersEn || '');
  const cleanEn = rawEn.replace(/[\s\-_]/g, '').toUpperCase().split('');

  const maxLen = Math.max(cleanAr.length, cleanEn.length);
  const letterPairs: { ar: string; en: string }[] = [];
  for (let i = 0; i < maxLen; i++) {
    letterPairs.push({
      ar: cleanAr[i] || '',
      en: cleanEn[i] || ''
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
 * Authentic Skeuomorphic Saudi Vehicle License Plate
 * Exact 1:1 photorealistic simulation of Saudi Arabian license plate specifications:
 * 1. خصوصي (Private) - Long plate with Center Kingdom Pillar: Left Digits | Center Pillar (KSA & Emblem) | Right Letters
 * 2. نقل (Transport / Commercial) - Long plate with Golden Amber Center Pillar + Hologram Seal & 'نقل'
 * 3. صغيرة (Small / Sports / US Size) - 3 columns separated by 2 vertical lines (NO horizontal divider line anywhere)
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

  const emblemSize = large ? 24 : compact ? 16 : 19;
  const digitCount = digitPairs.length || 1;
  const letterCount = letterPairs.length || 1;

  return (
    <div
      className={`hero-saudi-plate ${isTransport ? 'is-transport' : ''} ${
        isSmall ? 'is-small' : ''
      } ${compact ? 'compact' : ''} ${large ? 'large' : ''} ${
        dark ? 'plate-dark-pedestal' : ''
      } ${className}`}
      style={{
        ['--digit-count' as any]: digitCount,
        ['--letter-count' as any]: letterCount
      }}
      role="img"
      aria-label={`لوحة مركبة سعودية (${
        isTransport ? 'نقل' : isSmall ? 'صغيرة' : 'خصوصي'
      }): ${letterPairs.map((p) => p.ar).join(' ')} ${digitPairs.map((p) => p.ar).join('')}`}
      dir="ltr"
    >
      {/* Subtle Silver Recessed Mounting Dimples (No black crosshead screws) */}
      {isTransport ? (
        <>
          <PlateSlot className="q-slot-top-a" />
          <PlateSlot className="q-slot-top-b" />
          <PlateSlot className="q-slot-bot-a" />
          <PlateSlot className="q-slot-bot-b" />
        </>
      ) : (
        <>
          <PlateMountDimple className="q-dimple-tl" />
          <PlateMountDimple className="q-dimple-tr" />
          <PlateMountDimple className="q-dimple-bl" />
          <PlateMountDimple className="q-dimple-br" />
        </>
      )}

      {/* Surface light reflection sweep */}
      <span className="q-sheen-highlight" aria-hidden="true" />

      {isSmall ? (
        /* ================= 3-COLUMN LAYOUT FOR صغيرة ================= */
        <div className="plate-inner-frame plate-layout-small">
          {/* Column 1: Numbers (Arabic top, English bottom - NO horizontal line, perfectly aligned) */}
          <div className="q-small-col q-small-numbers">
            <div
              className="q-digits-block"
              style={{ gridTemplateColumns: `repeat(${digitCount}, minmax(0, 1fr))` }}
              dir="ltr"
              aria-label={`أرقام عربية: ${digitPairs.map((p) => p.ar).join('')}`}
            >
              {digitPairs.map((pair, idx) => (
                <span key={`s-ar-d-${idx}`} className="q-char-cell q-char-digit q-arabic-char">
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
                <span key={`s-en-d-${idx}`} className="q-char-cell q-char-digit q-latin-char">
                  {pair.en}
                </span>
              ))}
            </div>
          </div>

          {/* Column 2: Letters (Arabic top, English bottom - NO horizontal line, perfectly aligned) */}
          <div className="q-small-col q-small-letters">
            <div
              className="q-letters-block"
              style={{ gridTemplateColumns: `repeat(${letterCount}, minmax(0, 1fr))` }}
              dir="ltr"
              aria-label={`حروف عربية: ${letterPairs.map((p) => p.ar).join(' ')}`}
            >
              {letterPairs.map((pair, idx) => (
                <span key={`s-ar-l-${idx}`} className="q-char-cell q-char-letter q-arabic-char">
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
                <span key={`s-en-l-${idx}`} className="q-char-cell q-char-letter q-latin-char">
                  {pair.en}
                </span>
              ))}
            </div>
          </div>

          {/* Column 3: Kingdom Pillar (Stacked Vertically: Palm/Swords -> السعودية -> KSA -> Black Seal) */}
          <div className="q-kingdom-pillar">
            <SaudiEmblem size={emblemSize} strokeColor="#0b0f17" fillColor="#0b0f17" />
            <span className="q-saudi-text">السعودية</span>
            <span className="q-ksa-text">KSA</span>
            <span className="q-black-seal" title="الختم الأمني المعتمد" />
          </div>
        </div>
      ) : isTransport ? (
        /* ================= 2-ROW + RIGHT YELLOW PILLAR FOR نقل ================= */
        <div className="plate-inner-frame plate-layout-transport is-transport">
          <div className="q-main-section">
            {/* Top Row: Arabic Numbers & Arabic Letters */}
            <div className="q-plate-row q-row-arabic">
              <div
                className="q-digits-block"
                style={{ gridTemplateColumns: `repeat(${digitCount}, minmax(0, 1fr))` }}
                dir="ltr"
                aria-label={`أرقام عربية: ${digitPairs.map((p) => p.ar).join('')}`}
              >
                {digitPairs.map((pair, idx) => (
                  <span key={`t-ar-d-${idx}`} className="q-char-cell q-char-digit q-arabic-char">
                    {pair.ar}
                  </span>
                ))}
              </div>
              <div
                className="q-letters-block"
                style={{ gridTemplateColumns: `repeat(${letterCount}, minmax(0, 1fr))` }}
                dir="ltr"
                aria-label={`حروف عربية: ${letterPairs.map((p) => p.ar).join(' ')}`}
              >
                {letterPairs.map((pair, idx) => (
                  <span key={`t-ar-l-${idx}`} className="q-char-cell q-char-letter q-arabic-char">
                    {pair.ar}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Row: English Numbers & English Letters */}
            <div className="q-plate-row q-row-latin">
              <div
                className="q-digits-block"
                style={{ gridTemplateColumns: `repeat(${digitCount}, minmax(0, 1fr))` }}
                dir="ltr"
                aria-label={`أرقام إنجليزية: ${digitPairs.map((p) => p.en).join('')}`}
              >
                {digitPairs.map((pair, idx) => (
                  <span key={`t-en-d-${idx}`} className="q-char-cell q-char-digit q-latin-char">
                    {pair.en}
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
                  <span key={`t-en-l-${idx}`} className="q-char-cell q-char-letter q-latin-char">
                    {pair.en}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Golden Amber Kingdom Pillar */}
          <div className="q-kingdom-pillar q-pillar-right-transport">
            <SaudiEmblem size={emblemSize} strokeColor="#0b0f17" fillColor="#0b0f17" />
            <span className="q-saudi-text">السعودية</span>
            <span className="q-ksa-text">KSA</span>
            <span className="q-transport-hologram-seal" title="الختم الأمني الفضي المعتمد">
              <span className="q-hologram-shimmer" />
              <SaudiEmblem size={large ? 10 : compact ? 7 : 8} strokeColor="#ffffff" fillColor="#ffffff" />
            </span>
            <span className="q-transport-word">نقل</span>
          </div>
        </div>
      ) : (
        /* ================= CENTER PILLAR LAYOUT FOR خصوصي ================= */
        <div className="plate-inner-frame plate-layout-center is-private">
          {/* Left: Digits Section (Arabic top row, Latin bottom row) */}
          <div className="q-plate-section q-digits-section">
            <div className="q-plate-cell q-row-arabic">
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
            </div>
            <div className="q-plate-cell q-row-latin">
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
          </div>

          {/* Center: Kingdom Pillar (Saudi Emblem, السعودية, KSA in the middle) */}
          <div className="q-kingdom-pillar q-pillar-center">
            <SaudiEmblem size={emblemSize} strokeColor="#0b0f17" fillColor="#0b0f17" />
            <span className="q-saudi-text">السعودية</span>
            <span className="q-ksa-text">KSA</span>
            <div className="q-pillar-bottom-private">
              <span className="q-hologram-strip" title="شريط الهولوغرام الفضي الأمني">
                <span className="q-hologram-shimmer" />
                <span className="q-hologram-bars" />
              </span>
              <span className="q-black-seal" title="الختم الأمني الدائري المعتمد" />
            </div>
          </div>

          {/* Right: Letters Section (Arabic top row, Latin bottom row) */}
          <div className="q-plate-section q-letters-section">
            <div className="q-plate-cell q-row-arabic">
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
            </div>
            <div className="q-plate-cell q-row-latin">
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
          </div>
        </div>
      )}
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
  plate
}: {
  plate: MarketplacePlate;
}) {
  const isLive = plate.auction?.status === 'LIVE';
  const isUpcoming = plate.auction?.status === 'SCHEDULED' || plate.auction?.status === 'REGISTRATION_OPEN';
  const statusText = statusLabels[plate.auction?.status ?? plate.status] ?? plate.status;
  const rawPrice = plate.auction?.currentPriceHalalas ?? plate.priceHalalas ?? '0';

  const normType = normalizePlateType(plate.type);
  const isTransport = normType === 'transport';
  const isSmall = normType === 'small';

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border-2 border-slate-200/90 hover:border-gold/60 bg-white hover:bg-gradient-to-b hover:from-white hover:via-[#fcfbf9] hover:to-white shadow-[0_12px_35px_-8px_rgba(15,23,42,0.08)] hover:shadow-[0_25px_60px_-12px_rgba(15,23,42,0.18),0_0_35px_rgba(217,184,127,0.22)] transition-all duration-300 hover:-translate-y-2">
      {/* Subtle Top Ambient Gold Edge on hover */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-gold/0 group-hover:via-gold/80 to-transparent transition-all duration-500 z-10" />

      {/* Plate Showcase Canvas */}
      <Link
        href={`/plates/${plate.slug}`}
        className="relative block p-5 sm:p-6 transition-colors group-hover:bg-slate-50/40"
      >
        {/* Top Badges Bar */}
        <div className="mb-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-black text-emerald-800 border border-emerald-500/35 shadow-xs shadow-emerald-500/10 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600 shadow-[0_0_6px_#10b981]" />
                </span>
                <span>{statusText}</span>
              </span>
            ) : isUpcoming ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-black text-amber-800 border border-amber-500/30 backdrop-blur-md">
                <Clock size={12} strokeWidth={2.5} />
                <span>{statusText}</span>
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-slate-100/90 px-3 py-1 text-xs font-bold text-slate-700 backdrop-blur-md border border-slate-200/80">
                {statusText}
              </span>
            )}

            {plate.featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400/20 via-gold/25 to-amber-500/20 px-3 py-1 text-xs font-black text-gold-dark border border-gold/40 shadow-xs">
                <Crown size={12} className="text-gold-dark" />
                <span>نخبة</span>
              </span>
            )}
          </div>

          {plate.verified && (
            <span className="inline-flex items-center gap-1.5 text-xs font-black text-slate-700 bg-slate-100/90 px-3 py-1 rounded-full border border-slate-200/80 shadow-2xs">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>موثّقة</span>
            </span>
          )}
        </div>

        {/* Neomorphic Luxury Showcase Tray */}
        <div className="rounded-2xl p-5 sm:p-6 flex items-center justify-center transition-all duration-300 bg-gradient-to-b from-[#f1f4f9] via-[#e8edf5] to-[#dde4ee] border border-slate-200/90 shadow-[inset_0_3px_10px_rgba(15,23,42,0.08),0_1px_2px_rgba(255,255,255,0.8)] group-hover:border-gold/40 group-hover:shadow-[inset_0_3px_12px_rgba(217,184,127,0.15),0_10px_25px_-5px_rgba(15,23,42,0.08)]">
          <div className="w-full transition-transform duration-300 group-hover:scale-[1.03] filter drop-shadow-[0_8px_18px_rgba(0,0,0,0.12)]">
            <PlateVisualizer
              lettersAr={plate.lettersAr}
              lettersEn={plate.lettersEn}
              numbers={plate.numbers}
              plateType={plate.type}
            />
          </div>
        </div>
      </Link>

      {/* Card Details & Action Footer */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 border-t border-slate-100">
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            {isTransport ? (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/15 px-3 py-1 text-xs font-black text-amber-900 border border-amber-500/35">
                <span>نقل خاص وتجاري</span>
              </span>
            ) : isSmall ? (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800/10 px-3 py-1 text-xs font-black text-slate-800 border border-slate-700/25">
                <span>صغيرة (رياضية)</span>
              </span>
            ) : (
              <span className="rounded-xl bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 border border-slate-200/80">
                {plate.type || 'خصوصي'}
              </span>
            )}
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200/60">
              <MapPin size={13} className="text-gold-dark" />
              <span>{plate.city || 'الرياض'}</span>
            </div>
          </div>

          <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
            <div>
              <p className="text-xs font-black text-slate-500">
                {plate.auction ? 'المزايدة الحالية' : 'السعر المطلوب'}
              </p>
              <div className="mt-1 flex items-baseline gap-1.5 text-navy" dir="ltr">
                <span className="tabular-nums tracking-tight font-norwester text-3xl sm:text-4xl font-black text-slate-900 leading-none">
                  {formatEnglishAmount(rawPrice)}
                </span>
                <SarSymbol className="w-4.5 h-4.5 text-gold-accent inline-block self-center" />
              </div>
            </div>

            {plate.auction?.bidCount !== undefined && plate.auction.bidCount > 0 && (
              <div className="text-end">
                <span className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-b from-[#0c162d] to-navy text-gold-accent px-3.5 py-1.5 text-xs font-black shadow-xs border border-gold/30">
                  <Gavel size={13} className="text-gold" />
                  <span className="font-norwester text-sm font-black">{plate.auction.bidCount}</span>
                  <span className="text-[11px] text-slate-300">مزايدة</span>
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 pt-1">
          <Link
            href={`/plates/${plate.slug}`}
            className="group/btn relative flex items-center justify-between w-full rounded-2xl bg-gradient-to-r from-[#070e1c] via-[#0c162d] to-[#070e1c] px-5 py-3 text-xs sm:text-sm font-black text-white transition-all duration-300 hover:shadow-[0_10px_25px_-5px_rgba(12,22,45,0.4),0_0_20px_rgba(217,184,127,0.35)] hover:border-gold/50 border border-slate-800 active:scale-[0.98] overflow-hidden"
          >
            {/* Subtle hover shimmer */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />

            <span className="flex items-center gap-2">
              <span className="text-gold-light group-hover/btn:text-white transition-colors">
                {plate.auction ? 'دخول المزاد والمزايدة' : 'تفاصيل اللوحة والشراء'}
              </span>
            </span>

            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/10 border border-white/15 text-gold group-hover/btn:bg-gold group-hover/btn:text-navy group-hover/btn:border-gold transition-all duration-200 group-hover/btn:-translate-x-1">
              <ArrowLeft size={14} strokeWidth={2.5} />
            </div>
          </Link>
        </div>
      </div>
    </article>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton-shimmer rounded-lg ${className}`} />;
}

export function PlateCardSkeleton() {
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border-2 border-slate-200/90 bg-white shadow-xs">
      {/* Plate Showcase Canvas Placeholder */}
      <div className="relative p-5 sm:p-6 border-b border-slate-100/70">
        {/* Top Badges Bar */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-5.5 w-24 rounded-full skeleton-shimmer" />
            <div className="h-5.5 w-12 rounded-lg skeleton-shimmer" />
          </div>
          <div className="h-4.5 w-14 rounded-md skeleton-shimmer" />
        </div>

        {/* Recessed Plate Tray Simulation */}
        <div className="plate-tray-recessed rounded-2xl p-4 sm:p-5 flex items-center justify-center">
          <div className="w-full max-w-[280px] h-[95px] sm:h-[110px] rounded-xl bg-white border-2 border-slate-200/90 shadow-sm p-3.5 flex flex-col justify-between skeleton-shimmer">
            <div className="flex justify-between items-center h-full">
              <div className="h-7 sm:h-9 w-16 rounded-md bg-slate-200/70" />
              <div className="h-6 sm:h-8 w-6 sm:w-8 rounded-full bg-slate-200/70" />
              <div className="h-7 sm:h-9 w-16 rounded-md bg-slate-200/70" />
            </div>
          </div>
        </div>
      </div>

      {/* Card Details & Action Footer Placeholder */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 space-y-4">
        <div>
          {/* Plate Subtitle / Classification */}
          <div className="flex items-center justify-between">
            <div className="h-4 w-28 rounded-md skeleton-shimmer" />
            <div className="h-4 w-16 rounded-md skeleton-shimmer" />
          </div>

          {/* Pricing & Bids */}
          <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
            <div className="space-y-2">
              <div className="h-3 w-16 rounded-md skeleton-shimmer" />
              <div className="h-7 w-32 rounded-lg skeleton-shimmer" />
            </div>
            <div className="h-7 w-20 rounded-lg skeleton-shimmer" />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-1">
          <div className="h-12 w-full rounded-2xl skeleton-shimmer" />
        </div>
      </div>
    </article>
  );
}

export function PlateCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <PlateCardSkeleton key={i} />
      ))}
    </div>
  );
}

