import type { MarketplacePlate } from './types';

export const fallbackPlates: MarketplacePlate[] = [
  {
    id: 'sample-1',
    slug: 'fbs-1',
    lettersAr: ['ف', 'ب', 'س'],
    lettersEn: ['F', 'B', 'S'],
    numbers: '1',
    city: 'الرياض',
    type: 'خصوصي',
    description: 'لوحة ماسية فردية تمثل هوية المنصة الأيقونية بتناسق الحروف الفخمة.',
    priceHalalas: '75000000',
    status: 'LIVE',
    featured: true,
    verified: true,
    auction: {
      id: 'auction-sample-1',
      slug: 'auction-fbs-1',
      plateId: 'sample-1',
      status: 'LIVE',
      startsAt: new Date(Date.now() - 3600000).toISOString(),
      endsAt: new Date(Date.now() + 14400000).toISOString(),
      registrationEndsAt: null,
      currentPriceHalalas: '75000000',
      startingPriceHalalas: '30000000',
      minimumIncrementHalalas: '500000',
      depositAmountHalalas: '2500000',
      bidCount: 28,
      sequence: '28',
      version: '28'
    }
  },
  {
    id: 'sample-2',
    slug: 'rqm-7',
    lettersAr: ['ر', 'ق', 'م'],
    lettersEn: ['R', 'Q', 'M'],
    numbers: '7',
    city: 'جدة',
    type: 'خصوصي',
    description: 'لوحة فردية استثنائية بحروف ذات دلالة ورقم الحظ الأول.',
    priceHalalas: '52000000',
    status: 'LIVE',
    featured: true,
    verified: true,
    auction: {
      id: 'auction-sample-2',
      slug: 'auction-rqm-7',
      plateId: 'sample-2',
      status: 'LIVE',
      startsAt: new Date(Date.now() - 7200000).toISOString(),
      endsAt: new Date(Date.now() + 7200000).toISOString(),
      registrationEndsAt: null,
      currentPriceHalalas: '52000000',
      startingPriceHalalas: '20000000',
      minimumIncrementHalalas: '500000',
      depositAmountHalalas: '2000000',
      bidCount: 19,
      sequence: '19',
      version: '19'
    }
  },
  {
    id: 'sample-3',
    slug: 'saad-777',
    lettersAr: ['س', 'ع', 'د'],
    lettersEn: ['S', 'A', 'D'],
    numbers: '777',
    city: 'الرياض',
    type: 'خصوصي',
    description: 'لوحة ثلاثية متميزة بحروف اسم سعد وأرقام متطابقة نادرة.',
    priceHalalas: '38000000',
    status: 'LIVE',
    featured: true,
    verified: true,
    auction: {
      id: 'auction-sample-3',
      slug: 'auction-saad-777',
      plateId: 'sample-3',
      status: 'LIVE',
      startsAt: new Date(Date.now() - 14400000).toISOString(),
      endsAt: new Date(Date.now() + 3600000).toISOString(),
      registrationEndsAt: null,
      currentPriceHalalas: '38000000',
      startingPriceHalalas: '15000000',
      minimumIncrementHalalas: '250000',
      depositAmountHalalas: '1500000',
      bidCount: 34,
      sequence: '34',
      version: '34'
    }
  },
  {
    id: 'sample-4',
    slug: 'knj-99',
    lettersAr: ['ك', 'ن', 'ج'],
    lettersEn: ['K', 'N', 'J'],
    numbers: '99',
    city: 'الدمام',
    type: 'خصوصي',
    description: 'لوحة ثنائية ملكية برقمين متطابقين 99.',
    priceHalalas: '29000000',
    status: 'SCHEDULED',
    featured: true,
    verified: true,
    auction: {
      id: 'auction-sample-4',
      slug: 'auction-knj-99',
      plateId: 'sample-4',
      status: 'SCHEDULED',
      startsAt: new Date(Date.now() + 86400000).toISOString(),
      endsAt: new Date(Date.now() + 172800000).toISOString(),
      registrationEndsAt: null,
      currentPriceHalalas: '29000000',
      startingPriceHalalas: '10000000',
      minimumIncrementHalalas: '250000',
      depositAmountHalalas: '1000000',
      bidCount: 0,
      sequence: '0',
      version: '0'
    }
  },
  {
    id: 'sample-5',
    slug: 'zta-966',
    lettersAr: ['ا', 'ط', 'م'],
    lettersEn: ['Z', 'T', 'A'],
    numbers: '966',
    city: 'الرياض',
    type: 'نقل',
    description: 'لوحة نقل ملكية مميزة ترمز لمفتاح الاتصال الدولي للمملكة 966 مع الشريط الأمني الأزرق والمثلث المعتمد.',
    priceHalalas: '24000000',
    status: 'LIVE',
    featured: true,
    verified: true,
    auction: {
      id: 'auction-sample-5',
      slug: 'auction-zta-966',
      plateId: 'sample-5',
      status: 'LIVE',
      startsAt: new Date(Date.now() - 3600000).toISOString(),
      endsAt: new Date(Date.now() + 18000000).toISOString(),
      registrationEndsAt: null,
      currentPriceHalalas: '24000000',
      startingPriceHalalas: '12000000',
      minimumIncrementHalalas: '250000',
      depositAmountHalalas: '1000000',
      bidCount: 14,
      sequence: '14',
      version: '14'
    }
  },
  {
    id: 'sample-6',
    slug: 'hba-5333',
    lettersAr: ['ا', 'ب', 'هـ'],
    lettersEn: ['H', 'B', 'A'],
    numbers: '5333',
    city: 'قلوة',
    type: 'نقل',
    description: 'لوحة نقل تجاري مميزة بتكرار ثلاثي فخم للرقم 333 وشريط أزرق رسمي.',
    priceHalalas: '17500000',
    status: 'PUBLISHED',
    featured: false,
    verified: true,
    auction: null
  },
  {
    id: 'sample-7',
    slug: 'tea-300',
    lettersAr: ['ط', 'م', 'ا'],
    lettersEn: ['T', 'E', 'A'],
    numbers: '300',
    city: 'أبها',
    type: 'صغيرة',
    description: 'لوحة صغيرة قياس رياضي معتمد بحروف إنجليزية مقروءة TEA ورقم ثلاثي متناسق 300 للسيارات الرياضية الفاخرة.',
    priceHalalas: '45000000',
    status: 'LIVE',
    featured: true,
    verified: true,
    auction: {
      id: 'auction-sample-7',
      slug: 'auction-tea-300',
      plateId: 'sample-7',
      status: 'LIVE',
      startsAt: new Date(Date.now() - 5400000).toISOString(),
      endsAt: new Date(Date.now() + 21600000).toISOString(),
      registrationEndsAt: null,
      currentPriceHalalas: '45000000',
      startingPriceHalalas: '20000000',
      minimumIncrementHalalas: '500000',
      depositAmountHalalas: '2000000',
      bidCount: 26,
      sequence: '26',
      version: '26'
    }
  },
  {
    id: 'sample-8',
    slug: 'spd-911',
    lettersAr: ['س', 'ب', 'د'],
    lettersEn: ['S', 'P', 'D'],
    numbers: '911',
    city: 'جدة',
    type: 'صغيرة',
    description: 'لوحة صغيرة قياس مفرد للسيارات الرياضية برقم الأيقونة الأسطورية 911.',
    priceHalalas: '68000000',
    status: 'LIVE',
    featured: true,
    verified: true,
    auction: {
      id: 'auction-sample-8',
      slug: 'auction-spd-911',
      plateId: 'sample-8',
      status: 'LIVE',
      startsAt: new Date(Date.now() - 1800000).toISOString(),
      endsAt: new Date(Date.now() + 10800000).toISOString(),
      registrationEndsAt: null,
      currentPriceHalalas: '68000000',
      startingPriceHalalas: '35000000',
      minimumIncrementHalalas: '500000',
      depositAmountHalalas: '2500000',
      bidCount: 22,
      sequence: '22',
      version: '22'
    }
  },
  {
    id: 'sample-9',
    slug: 'twq-100',
    lettersAr: ['ط', 'و', 'ق'],
    lettersEn: ['T', 'W', 'Q'],
    numbers: '100',
    city: 'الرياض',
    type: 'نقل',
    description: 'لوحة نقل استثنائية مقفلة برقم 100 وشريط أمني أزرق ومثلث رسمي.',
    priceHalalas: '18500000',
    status: 'PUBLISHED',
    featured: false,
    verified: true,
    auction: null
  },
  {
    id: 'sample-10',
    slug: 'ahd-1',
    lettersAr: ['أ', 'ح', 'د'],
    lettersEn: ['A', 'H', 'D'],
    numbers: '1',
    city: 'المدينة المنورة',
    type: 'خصوصي',
    description: 'لوحة أحادية ملكية نادرة بمكانة رفيعة ونقاء كامل في الحروف.',
    priceHalalas: '92000000',
    status: 'REGISTRATION_OPEN',
    featured: true,
    verified: true,
    auction: {
      id: 'auction-sample-10',
      slug: 'auction-ahd-1',
      plateId: 'sample-10',
      status: 'REGISTRATION_OPEN',
      startsAt: new Date(Date.now() + 43200000).toISOString(),
      endsAt: new Date(Date.now() + 129600000).toISOString(),
      registrationEndsAt: null,
      currentPriceHalalas: '92000000',
      startingPriceHalalas: '50000000',
      minimumIncrementHalalas: '1000000',
      depositAmountHalalas: '3000000',
      bidCount: 0,
      sequence: '0',
      version: '0'
    }
  },
  {
    id: 'sample-11',
    slug: 'aaa-7777',
    lettersAr: ['أ', 'أ', 'أ'],
    lettersEn: ['A', 'A', 'A'],
    numbers: '7777',
    city: 'الرياض',
    type: 'خصوصي',
    description: 'لوحة ملكية نادرة جداً: ثلاثة حروف متطابقة وأربعة أرقام متطابقة.',
    priceHalalas: '120000000',
    status: 'LIVE',
    featured: true,
    verified: true,
    auction: {
      id: 'auction-sample-11',
      slug: 'auction-aaa-7777',
      plateId: 'sample-11',
      status: 'LIVE',
      startsAt: new Date(Date.now() - 7200000).toISOString(),
      endsAt: new Date(Date.now() + 10800000).toISOString(),
      registrationEndsAt: null,
      currentPriceHalalas: '120000000',
      startingPriceHalalas: '80000000',
      minimumIncrementHalalas: '1000000',
      depositAmountHalalas: '5000000',
      bidCount: 41,
      sequence: '41',
      version: '41'
    }
  },
  {
    id: 'sample-12',
    slug: 'qsq-1001',
    lettersAr: ['ق', 'ص', 'ق'],
    lettersEn: ['Q', 'S', 'Q'],
    numbers: '1001',
    city: 'جدة',
    type: 'خصوصي',
    description: 'لوحة متناظرة فخمة: أول وآخر حرف متطابقان وأول وآخر رقم متطابقان.',
    priceHalalas: '8500000',
    status: 'PUBLISHED',
    featured: false,
    verified: true,
    auction: null
  },
  {
    id: 'sample-13',
    slug: 'bss-123',
    lettersAr: ['ب', 'س', 'س'],
    lettersEn: ['B', 'S', 'S'],
    numbers: '123',
    city: 'الدمام',
    type: 'خصوصي',
    description: 'لوحة مميزة بحرفين متطابقين وتسلسل رقمي كلاسيكي 123.',
    priceHalalas: '3500000',
    status: 'PUBLISHED',
    featured: false,
    verified: true,
    auction: null
  },
  {
    id: 'sample-14',
    slug: 'dla-444',
    lettersAr: ['د', 'ل', 'أ'],
    lettersEn: ['D', 'L', 'A'],
    numbers: '444',
    city: 'مكة المكرمة',
    type: 'خصوصي',
    description: 'لوحة اقتصادية نادرة بـ 3 أرقام متطابقة وسعر في متناول الجميع.',
    priceHalalas: '1200000',
    status: 'PUBLISHED',
    featured: false,
    verified: true,
    auction: null
  },
  {
    id: 'sample-15',
    slug: 'jjd-1234',
    lettersAr: ['ح', 'ح', 'د'],
    lettersEn: ['J', 'J', 'D'],
    numbers: '1234',
    city: 'الخبر',
    type: 'نقل',
    description: 'لوحة نقل بشريط أزرق ومثلث رسمي بحرفين متطابقين وتسلسل رباعي متناسق 1234.',
    priceHalalas: '4500000',
    status: 'PUBLISHED',
    featured: false,
    verified: true,
    auction: null
  },
  {
    id: 'sample-16',
    slug: 'xyz-505',
    lettersAr: ['ع', 'ص', 'و'],
    lettersEn: ['X', 'Y', 'Z'],
    numbers: '505',
    city: 'أبها',
    type: 'صغيرة',
    description: 'لوحة صغيرة مفردة للسيارات الرياضية برقم متناظر 505 وحروف متناسقة.',
    priceHalalas: '6500000',
    status: 'PUBLISHED',
    featured: false,
    verified: true,
    auction: null
  }
];

function matchesLettersPattern(letters: string[], pattern: string): boolean {
  if (!letters.length) return false;
  if (pattern === '3_same') {
    return letters.length === 3 && letters[0] === letters[1] && letters[1] === letters[2];
  }
  if (pattern === '2_same') {
    return (
      (letters[0] === letters[1] && letters[0] !== letters[2]) ||
      (letters[1] === letters[2] && letters[1] !== letters[0]) ||
      (letters[0] === letters[2] && letters[0] !== letters[1])
    );
  }
  if (pattern === 'first_last_same') {
    return letters.length >= 2 && letters[0] === letters[letters.length - 1];
  }
  if (pattern === 'all_diff') {
    return new Set(letters).size === letters.length;
  }
  return true;
}

function matchesNumbersPattern(nums: string, pattern: string): boolean {
  if (!nums) return false;
  const digits = nums.split('');
  if (pattern === '4_same') {
    return digits.length === 4 && digits.every((d) => d === digits[0]);
  }
  if (pattern === '3_same') {
    const counts = digits.reduce((acc, d) => ({ ...acc, [d]: (acc[d] || 0) + 1 }), {} as Record<string, number>);
    return Object.values(counts).some((c) => c >= 3);
  }
  if (pattern === '2_same') {
    const counts = digits.reduce((acc, d) => ({ ...acc, [d]: (acc[d] || 0) + 1 }), {} as Record<string, number>);
    return Object.values(counts).some((c) => c >= 2);
  }
  if (pattern === 'first_last_same') {
    return digits.length >= 2 && digits[0] === digits[digits.length - 1];
  }
  if (pattern === 'sequence') {
    if (digits.length < 2) return false;
    const numDigits = digits.map(Number);
    const isAsc = numDigits.every((d, i) => i === 0 || d === numDigits[i - 1] + 1);
    const isDesc = numDigits.every((d, i) => i === 0 || d === numDigits[i - 1] - 1);
    return isAsc || isDesc;
  }
  if (pattern === 'all_diff') {
    return new Set(digits).size === digits.length;
  }
  return true;
}

export function filterFallbackPlates(
  plates: MarketplacePlate[],
  filter: {
    q?: string;
    type?: string;
    digitsCount?: string;
    city?: string | string[];
    featured?: string;
    auctionStatus?: string;
    minPrice?: string | number;
    maxPrice?: string | number;
    priceRange?: string | string[];
    lettersPattern?: string | string[];
    numbersPattern?: string | string[];
    sort?: string;
  }
): MarketplacePlate[] {
  let list = [...plates];

  if (filter.auctionStatus) {
    if (filter.auctionStatus === 'LIVE') {
      list = list.filter((p) => p.auction?.status === 'LIVE');
    } else if (filter.auctionStatus === 'UPCOMING') {
      list = list.filter((p) => p.auction?.status === 'SCHEDULED' || p.auction?.status === 'REGISTRATION_OPEN');
    } else if (filter.auctionStatus === 'COMPLETED') {
      list = list.filter((p) => p.auction?.status === 'ENDED' || p.auction?.status === 'COMPLETED');
    } else if (filter.auctionStatus === 'ALL') {
      list = list.filter((p) => p.auction != null);
    }
  }

  if (filter.type) {
    const t = filter.type.trim().toLowerCase();
    if (t.includes('نقل') || t.includes('transport')) {
      list = list.filter((p) => p.type.toLowerCase().includes('نقل') || p.type.toLowerCase().includes('transport'));
    } else if (t.includes('صغير') || t.includes('small') || t.includes('رياض')) {
      list = list.filter((p) => p.type.toLowerCase().includes('صغير') || p.type.toLowerCase().includes('small') || p.type.toLowerCase().includes('رياض'));
    } else if (t.includes('خصوص') || t.includes('private')) {
      list = list.filter((p) => p.type.toLowerCase().includes('خصوص') || p.type.toLowerCase().includes('private'));
    } else {
      list = list.filter((p) => p.type.toLowerCase().includes(t));
    }
  }

  if (filter.digitsCount && /^[1-4]$/.test(filter.digitsCount)) {
    const d = Number(filter.digitsCount);
    list = list.filter((p) => p.numbers.length === d);
  }

  if (filter.featured === 'true') {
    list = list.filter((p) => p.featured);
  }

  if (filter.city) {
    const cities = Array.isArray(filter.city)
      ? filter.city
      : filter.city.includes(',')
        ? filter.city.split(',').map((c) => c.trim())
        : [filter.city.trim()];
    if (cities.length && cities[0] !== '') {
      list = list.filter((p) => cities.includes(p.city));
    }
  }

  // Price Filtering (in SAR)
  if (filter.minPrice !== undefined && filter.minPrice !== '') {
    const min = Number(filter.minPrice);
    if (!isNaN(min)) {
      list = list.filter((p) => {
        const sar = Number(BigInt(p.auction?.currentPriceHalalas ?? p.priceHalalas ?? '0')) / 100;
        return sar >= min;
      });
    }
  }

  if (filter.maxPrice !== undefined && filter.maxPrice !== '') {
    const max = Number(filter.maxPrice);
    if (!isNaN(max)) {
      list = list.filter((p) => {
        const sar = Number(BigInt(p.auction?.currentPriceHalalas ?? p.priceHalalas ?? '0')) / 100;
        return sar <= max;
      });
    }
  }

  // Preset Price Ranges
  if (filter.priceRange) {
    const ranges = Array.isArray(filter.priceRange) ? filter.priceRange : [filter.priceRange];
    list = list.filter((p) => {
      const sar = Number(BigInt(p.auction?.currentPriceHalalas ?? p.priceHalalas ?? '0')) / 100;
      return ranges.some((r) => {
        if (r === 'under_15k') return sar < 15000;
        if (r === '15k_50k') return sar >= 15000 && sar <= 50000;
        if (r === '50k_150k') return sar >= 50000 && sar <= 150000;
        if (r === '150k_500k') return sar >= 150000 && sar <= 500000;
        if (r === 'over_500k') return sar > 500000;
        return true;
      });
    });
  }

  // Letters Patterns (3 حروف متطابقة, حرفين متطابقة, أول وآخر متطابقة, كل الحروف مختلفة)
  if (filter.lettersPattern) {
    const patterns = Array.isArray(filter.lettersPattern) ? filter.lettersPattern : [filter.lettersPattern];
    list = list.filter((p) =>
      patterns.some((pat) => matchesLettersPattern(p.lettersAr, pat) || matchesLettersPattern(p.lettersEn, pat))
    );
  }

  // Numbers Patterns (4 متطابقة, 3 متطابقة, رقمين, أول وآخر, تسلسل, كل الأرقام مختلفة)
  if (filter.numbersPattern) {
    const patterns = Array.isArray(filter.numbersPattern) ? filter.numbersPattern : [filter.numbersPattern];
    list = list.filter((p) => patterns.some((pat) => matchesNumbersPattern(p.numbers, pat)));
  }

  if (filter.q?.trim()) {
    const q = filter.q.trim().toLowerCase().replace(/\s+/g, '');
    list = list.filter((p) => {
      const allText = [
        ...p.lettersAr,
        ...p.lettersEn,
        p.numbers,
        p.city,
        p.type,
        p.description
      ].join('').toLowerCase().replace(/\s+/g, '');
      return allText.includes(q);
    });
  }

  if (filter.sort === 'price_asc') {
    list.sort((a, b) => {
      const pa = BigInt(a.auction?.currentPriceHalalas ?? a.priceHalalas ?? '0');
      const pb = BigInt(b.auction?.currentPriceHalalas ?? b.priceHalalas ?? '0');
      return pa < pb ? -1 : pa > pb ? 1 : 0;
    });
  } else if (filter.sort === 'price_desc') {
    list.sort((a, b) => {
      const pa = BigInt(a.auction?.currentPriceHalalas ?? a.priceHalalas ?? '0');
      const pb = BigInt(b.auction?.currentPriceHalalas ?? b.priceHalalas ?? '0');
      return pa > pb ? -1 : pa < pb ? 1 : 0;
    });
  }

  return list;
}
