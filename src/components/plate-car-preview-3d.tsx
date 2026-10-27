'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Car,
  CarFront,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Moon,
  RectangleHorizontal,
  Sun,
  Sparkles
} from 'lucide-react';
import { PlateFace } from '@/components/plate-face';
import { getPlateGeometry, normalizePlateType, parsePlateData } from '@/lib/plate-data';
import styles from './plate-car-preview-3d.module.css';

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
export type CameraMode = 'full' | 'closeup';
export type LightingMode = 'night' | 'day';

const CAMERA_OPTIONS: { value: CameraMode; label: string }[] = [
  { value: 'full', label: 'كامل السيارة' },
  { value: 'closeup', label: 'قريب على اللوحة' }
];

const LIGHTING_FILTERS: Record<LightingMode, string> = {
  night: 'brightness(1.02) contrast(1.03) saturate(0.98)',
  day: 'sepia(0.20) saturate(1.22) brightness(1.05) contrast(1.06)'
};

function SceneLighting({ mode }: { mode: LightingMode }) {
  return mode === 'day' ? (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-5 bg-[radial-gradient(ellipse_at_50%_50%,rgba(217,184,127,0.45),transparent_70%)] opacity-25 mix-blend-color-dodge transition-opacity duration-700" />
  ) : (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-5 bg-radial-[at_50%_60%] from-transparent via-black/15 to-black/55 opacity-25 mix-blend-multiply transition-opacity duration-700" />
  );
}

/** Uses the catalog's plate details and finish without the FBS mark on a car. */
export function CarMountedPlate({ lettersAr, lettersEn, numbers, plateType = 'خصوصي', size = 'long' }: {
  lettersAr: string[] | string;
  lettersEn: string[] | string;
  numbers: string;
  plateType?: string;
  size?: PlateSize;
}) {
  return <PlateFace plate={parsePlateData(lettersAr, lettersEn, numbers)} type={normalizePlateType(plateType)} format={size} showBrand={false} />;
}

/* ============================================================== */
/* STUDIO CONTROLS                                                */
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
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="group relative flex min-h-[76px] min-w-0 cursor-pointer flex-col justify-center gap-1 px-3 py-2.5 transition-colors hover:bg-white/[0.04] focus-within:bg-white/[0.06] focus-within:ring-2 focus-within:ring-inset focus-within:ring-gold">
      <span className="flex min-w-0 items-center gap-1.5 text-[10px] font-semibold leading-4 text-slate-400" aria-hidden="true">
        <Icon size={14} className="shrink-0 text-gold/90" />{label}
      </span>
      <span className="flex min-w-0 items-center gap-1.5" aria-hidden="true">
        <ChevronDown size={14} className="shrink-0 text-gold" />
        <span className="truncate text-xs font-bold leading-5 text-slate-100">{options.find((option) => option.value === value)?.label}</span>
      </span>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      >
        {options.map((option) => <option key={option.value} value={option.value} className="bg-[#091224] text-white">{option.label}</option>)}
      </select>
    </label>
  );
}

function StudioControls({ carId, plateSize, cameraMode, lighting, onCar, onSize, onCamera, onLighting }: {
  carId: CarModelId;
  plateSize: PlateSize;
  cameraMode: CameraMode;
  lighting: LightingMode;
  onCar: (value: CarModelId) => void;
  onSize: (value: PlateSize) => void;
  onCamera: (value: CameraMode) => void;
  onLighting: (value: LightingMode) => void;
}) {
  return (
    <div className={styles.controlsContainer}>
      <div role="group" aria-label="خيارات معاينة السيارة" className={styles.controls}>
        <StudioSelect label="السيارة" icon={CarFront} value={carId} options={CAR_STUDIO_MODELS.map((car) => ({ value: car.id, label: car.nameAr }))} onChange={onCar} />
        <StudioSelect label="نوع اللوحة" icon={RectangleHorizontal} value={plateSize} options={[{ value: 'long', label: 'لوحة طويلة' }, { value: 'standard', label: 'لوحة صغيرة' }]} onChange={onSize} />
        <StudioSelect label="العرض" icon={Car} value={cameraMode} options={CAMERA_OPTIONS} onChange={onCamera} />
        <div className="flex min-h-[76px] min-w-0 flex-col justify-center gap-1 px-3 py-2">
          <span className="text-[10px] font-semibold leading-4 text-slate-400">الإضاءة</span>
          <div role="group" aria-label="الإضاءة" className="grid grid-cols-2 gap-1 rounded-lg bg-[#07111f]/80 p-0.5">
            {([{ value: 'night', label: 'ليلي', icon: Moon }, { value: 'day', label: 'نهاري', icon: Sun }] as const).map(({ value, label, icon: LightingIcon }) => (
              <button key={value} type="button" aria-pressed={lighting === value} onClick={() => onLighting(value)} className={`flex min-h-10 min-w-0 items-center justify-center gap-1 rounded-md px-1 text-[11px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-gold ${lighting === value ? 'bg-gold/20 text-gold-light' : 'text-slate-400 hover:bg-white/[0.08] hover:text-white'}`}>
                <LightingIcon size={13} className="shrink-0" aria-hidden="true" />{label}
              </button>
            ))}
          </div>
        </div>
      </div>
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
  initialSize?: PlateSize;
  initialCamera?: CameraMode;
  initialLighting?: LightingMode;
  backHref?: string;
}

export function PlateCarPreview3D(props: PlateCarPreview3DProps) {
  // A different source plate starts a fresh scene. Local preset/car selections
  // stay intact when the parent re-renders with the same plate data.
  const plate = props.initialPlate;
  const sceneKey = JSON.stringify([plate?.lettersAr, plate?.lettersEn, plate?.numbers, plate?.plateType, plate?.slug, props.initialCarId, props.initialSize, props.initialCamera, props.initialLighting]);
  return <PlateCarPreviewScene key={sceneKey} {...props} />;
}

function PlateCarPreviewScene({
  initialPlate,
  variant = 'inline',
  initialCarId,
  initialSize = 'long',
  initialCamera = 'full',
  initialLighting = 'night',
  backHref
}: PlateCarPreview3DProps) {
  const [currentPlate, setCurrentPlate] = useState({
    lettersAr: initialPlate?.lettersAr ?? ['ب', 'ط', 'ل'],
    lettersEn: initialPlate?.lettersEn ?? ['L', 'T', 'B'],
    numbers: initialPlate?.numbers ?? '8888',
    plateType: initialPlate?.plateType ?? 'خصوصي',
    slug: initialPlate?.slug
  });

  const isInitialTransport = normalizePlateType(initialPlate?.plateType) === 'transport';

  const [carId, setCarId] = useState<CarModelId>(() => {
    if (initialCarId && CAR_STUDIO_MODELS.some((c) => c.id === initialCarId)) {
      return initialCarId as CarModelId;
    }
    return isInitialTransport ? 'sierra' : 'g-class';
  });
  const [plateSize, setPlateSize] = useState<PlateSize>(initialSize);
  const [cameraMode, setCameraMode] = useState<CameraMode>(initialCamera);
  const [lighting, setLighting] = useState<LightingMode>(initialLighting);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPresetsTray, setShowPresetsTray] = useState(true);

  const car = useMemo(
    () => CAR_STUDIO_MODELS.find((c) => c.id === carId) ?? CAR_STUDIO_MODELS[0],
    [carId]
  );
  const b = car.bracket;

  // Bracket dimensions and proportions
  const isLong = plateSize === 'long';
  const bracketWidth = isLong ? b.width : b.width * 0.74;
  const plateGeometry = getPlateGeometry(normalizePlateType(currentPlate.plateType), plateSize);
  const plateAspect = plateGeometry.width / plateGeometry.height;

  const expandHref = useMemo(() => {
    const params = new URLSearchParams({
      lettersAr: currentPlate.lettersAr.join(','),
      lettersEn: currentPlate.lettersEn.join(','),
      numbers: currentPlate.numbers,
      type: currentPlate.plateType,
      car: carId,
      size: plateSize,
      camera: cameraMode,
      lighting
    });
    if (currentPlate.slug) params.set('from', currentPlate.slug);
    return `/studio-3d?${params.toString()}`;
  }, [currentPlate, carId, plateSize, cameraMode, lighting]);

  const sceneTransform: React.CSSProperties =
    cameraMode === 'closeup'
      ? { transform: 'scale(2.35)', transformOrigin: `${b.centerX}% ${b.centerY}%` }
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
      <div className="fixed inset-0 z-30 flex h-[100dvh] w-screen select-none flex-col justify-between overflow-hidden bg-[#030712]">
        {/* Dynamic Ambient Luxury Lighting matching car environment */}
        <div
          className={`pointer-events-none absolute inset-0 bg-cover bg-center blur-3xl scale-125 transition-all duration-700 ${
            lighting === 'day' ? 'opacity-30 brightness-110' : 'opacity-25'
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
        {/* 16:9 Studio Stage: Occupies maximum screen area without distortion */}
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
          <div
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

            <SceneLighting mode={lighting} />

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
                className="relative w-full rounded-[3px] bg-[#0d0f13] shadow-[0_6px_18px_rgba(0,0,0,0.92)]"
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
          <header className="pointer-events-auto mx-auto flex w-full max-w-5xl flex-col gap-2 lg:flex-row lg:items-start">
            <div className="flex items-center justify-between gap-2 lg:shrink-0">
              <Link href={backHref || '/plates'} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-[#091224]/90 px-3 text-xs font-bold text-gold-light shadow-lg backdrop-blur-xl hover:text-white">
                <ArrowRight size={16} />
                <span>{backHref ? 'رجوع للوحة' : 'العودة للمتجر'}</span>
              </Link>
              <button type="button" onClick={toggleFullscreen} aria-label="تبديل ملء الشاشة" title="تبديل ملء الشاشة" className="hidden h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#091224]/90 text-slate-200 shadow-lg hover:text-gold sm:inline-flex">
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </div>
            <div className="min-w-0 lg:flex-1">
              <StudioControls carId={carId} plateSize={plateSize} cameraMode={cameraMode} lighting={lighting} onCar={setCarId} onSize={setPlateSize} onCamera={setCameraMode} onLighting={setLighting} />
            </div>
          </header>

          {/* Bottom Bar: Presets & Plate Info (Safe from edges) */}
          <footer className={`pointer-events-auto mx-auto ${backHref ? 'w-fit max-w-full' : 'w-full max-w-4xl'}`}>
            {backHref ? (
              /* When previewing a specific plate */
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-gold/30 bg-[#091224]/90 px-3 py-3 shadow-xl backdrop-blur-xl">
                <div className={plateSize === 'standard' ? 'w-[min(45vw,12rem)]' : 'w-[min(60vw,22rem)]'}>
                  <CarMountedPlate lettersAr={currentPlate.lettersAr} lettersEn={currentPlate.lettersEn} numbers={currentPlate.numbers} plateType={currentPlate.plateType} size={plateSize} />
                </div>
                <Link href={backHref} aria-label="العودة لتفاصيل اللوحة" title="العودة لتفاصيل اللوحة" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold text-navy transition-colors hover:bg-gold-light">
                  <ArrowRight size={19} />
                </Link>
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
                          <CarMountedPlate
                            lettersAr={sample.lettersAr}
                            lettersEn={sample.lettersEn}
                            numbers={sample.numbers}
                            plateType={sample.plateType}
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
      <div className="mb-2 flex items-center justify-between gap-3 px-1">
        <h2 className="flex items-center gap-2 text-sm font-black text-white"><Car size={17} className="text-gold" />معاينة على السيارة</h2>
        <Link href={expandHref} title="فتح معرض السيارات" aria-label="فتح معرض السيارات" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-gold-light transition-colors hover:bg-white/10">
          <ArrowRight size={19} />
        </Link>
      </div>
      <div className="mb-3">
        <StudioControls carId={carId} plateSize={plateSize} cameraMode={cameraMode} lighting={lighting} onCar={setCarId} onSize={setPlateSize} onCamera={setCameraMode} onLighting={setLighting} />
      </div>

      {/* Viewer: Fixed 16:9 Frame */}
      <div
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

          <SceneLighting mode={lighting} />

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
              className="relative w-full rounded-[3px] bg-[#0d0f13] shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
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
