import type { Metadata } from 'next';
import { PlateCarPreview3D } from '@/components/plate-car-preview-3d';

export const metadata: Metadata = {
  title: 'استوديو المعاينة 3D | FBS',
  description: 'عاين لوحتك المميزة على أفخم السيارات بمعاينة ثلاثية الأبعاد واقعية ملء الشاشة.'
};

const DEFAULT_SAMPLE_PLATES = [
  { lettersAr: ['ب', 'ط', 'ل'], lettersEn: ['L', 'T', 'B'], numbers: '8888', plateType: 'خصوصي', title: 'ب ط ل 8888' },
  { lettersAr: ['ف', 'ب', 'س'], lettersEn: ['S', 'B', 'F'], numbers: '7', plateType: 'خصوصي', title: 'ف ب س 7' },
  { lettersAr: ['ق', 'م', 'ر'], lettersEn: ['R', 'Z', 'G'], numbers: '1', plateType: 'صغيرة', title: 'ق م ر 1' },
  { lettersAr: ['س', 'ع', 'د'], lettersEn: ['D', 'E', 'S'], numbers: '777', plateType: 'خصوصي', title: 'س ع د 777' },
  { lettersAr: ['ن', 'ق', 'ل'], lettersEn: ['L', 'G', 'N'], numbers: '100', plateType: 'نقل', title: 'ن ق ل 100' }
];

export default async function Studio3DPage({
  searchParams
}: {
  searchParams?: Promise<{
    lettersAr?: string;
    lettersEn?: string;
    numbers?: string;
    type?: string;
    preview?: string;
    car?: string;
    size?: string;
    camera?: string;
    lighting?: string;
    from?: string;
  }>;
}) {
  const sp = (await searchParams) || {};

  let initialPlate: { lettersAr: string[]; lettersEn: string[]; numbers: string; plateType: string; slug?: string } = {
    lettersAr: ['ب', 'ط', 'ل'],
    lettersEn: ['L', 'T', 'B'],
    numbers: '8888',
    plateType: 'خصوصي'
  };

  const presetIdx = sp.preview !== undefined ? Number(sp.preview) : -1;
  const preset = presetIdx >= 0 && presetIdx < DEFAULT_SAMPLE_PLATES.length ? DEFAULT_SAMPLE_PLATES[presetIdx] : undefined;

  if (preset) {
    initialPlate = {
      lettersAr: preset.lettersAr,
      lettersEn: preset.lettersEn,
      numbers: preset.numbers,
      plateType: preset.plateType
    };
  } else if (sp.numbers) {
    initialPlate = {
      lettersAr: sp.lettersAr ? sp.lettersAr.split(',').filter(Boolean) : [],
      lettersEn: sp.lettersEn ? sp.lettersEn.split(',').filter(Boolean) : [],
      numbers: sp.numbers,
      plateType: sp.type || 'خصوصي',
      slug: sp.from
    };
  }

  const backHref = sp.from ? `/plates/${encodeURIComponent(sp.from)}` : undefined;
  const isTransport = initialPlate.plateType?.includes('نقل');
  const initialCar = sp.car ?? (isTransport ? 'sierra' : 'g-class');

  return (
    <PlateCarPreview3D
      variant="page"
      initialPlate={initialPlate}
      initialCarId={initialCar}
      initialSize={sp.size === 'standard' ? 'standard' : 'long'}
      initialCamera={sp.camera === 'closeup' ? 'closeup' : 'full'}
      initialLighting={sp.lighting === 'day' ? 'day' : 'night'}
      backHref={backHref}
    />
  );
}
