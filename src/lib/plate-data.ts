import { normalizeSaudiPlateArChar } from '@/components/plate-glyphs-ar';
import { SAUDI_PLATE_AR_TO_EN } from '@/components/plate-glyphs-en';

export { SAUDI_PLATE_AR_TO_EN };
export const SAUDI_PLATE_EN_TO_AR: Record<string, string> = Object.fromEntries(
  Object.entries(SAUDI_PLATE_AR_TO_EN).map(([ar, en]) => [en, ar]),
);

export type SaudiPlateType = 'private' | 'transport' | 'small';
export type PlateFormat = 'long' | 'standard';
export type PlateDataIssue =
  'letter-mismatch' | 'unsupported-letter' | 'too-many-letters' | 'invalid-number' | 'too-many-digits';
export type PlatePair = { ar: string; en: string };
export interface ParsedPlateData {
  digitPairs: PlatePair[];
  letterPairs: PlatePair[];
  issues: PlateDataIssue[];
  status: 'valid' | 'incomplete' | 'invalid' | 'demo';
}

export function normalizePlateType(type = ''): SaudiPlateType {
  const value = type.toLowerCase().trim();
  if (/نقل|transport|commercial/.test(value)) return 'transport';
  if (/صغير|small|رياض|sport|(?:^|[\s_-])us(?:$|[\s_-])/.test(value)) return 'small';
  return 'private';
}

const EMPTY_MARKS = new Set(['ـ', '•', '·', '—', '–']);
const CLEAN_MARKS = /[\u064B-\u065F\u0670\u06D6-\u06ED\u200C-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g;
const SEPARATORS = /[\s,،_./\\-]/g;

function arabicLetters(input: string[] | string): string[] {
  return (Array.isArray(input) ? input : [input]).flatMap((item) => {
    const chars = Array.from(
      String(item ?? '')
        .normalize('NFKC')
        .replace(CLEAN_MARKS, '')
        .replace(SEPARATORS, ''),
    );
    const result: string[] = [];
    for (const char of chars) {
      // The tatweel in هـ belongs to the preceding heh, not another column.
      if (char === 'ـ' && result.at(-1) === 'هـ') continue;
      result.push(EMPTY_MARKS.has(char) ? '' : normalizeSaudiPlateArChar(char));
    }
    return result;
  });
}

function latinLetters(input: string[] | string): string[] {
  return (Array.isArray(input) ? input : [input]).flatMap((item) =>
    Array.from(
      String(item ?? '')
        .normalize('NFKC')
        .replace(CLEAN_MARKS, '')
        .replace(SEPARATORS, '')
        .toUpperCase(),
    ).map((char) => (EMPTY_MARKS.has(char) ? '' : char)),
  );
}

function sameLetters(a: string[], b: string[]) {
  return a.length === b.length && a.every((letter, index) => letter === b[index]);
}

/**
 * Arabic input is ALWAYS in reading order (right to left). Output columns are
 * ALWAYS visual left to right. Legacy Latin input in the opposite order is
 * accepted only when EVERY pair matches. Conflicting data is never guessed.
 */
export function parsePlateData(
  lettersAr: string[] | string,
  lettersEn: string[] | string,
  numbers: string,
): ParsedPlateData {
  const ar = arabicLetters(lettersAr);
  const en = latinLetters(lettersEn);
  const issues: PlateDataIssue[] = [];
  const addIssue = (issue: PlateDataIssue) => {
    if (!issues.includes(issue)) issues.push(issue);
  };

  // Explicit display-only exception for the existing FBS brand demonstration.
  // It does not extend the alphabet of real Saudi registration plates.
  const brandDemo = ar.join('') === 'فبس' && ['FBS', 'SBF'].includes(en.join(''));
  const mapArabic = (char: string) => SAUDI_PLATE_AR_TO_EN[char] ?? (brandDemo && char === 'ف' ? 'F' : '');
  if (ar.length > 3 || en.length > 3) addIssue('too-many-letters');
  if (
    ar.some((char) => char && !mapArabic(char)) ||
    en.some((char) => char && !SAUDI_PLATE_EN_TO_AR[char] && !(brandDemo && char === 'F'))
  ) {
    addIssue('unsupported-letter');
  }

  let letterPairs: PlatePair[] = [];
  if (ar.length) {
    const displayAr = ar.toReversed();
    const expectedEn = displayAr.map(mapArabic);
    let displayEn = expectedEn;
    if (en.some(Boolean)) {
      if (sameLetters(en, expectedEn)) displayEn = en;
      else if (sameLetters(en.toReversed(), expectedEn)) displayEn = en.toReversed();
      else {
        addIssue('letter-mismatch');
        // Keep the supplied Arabic identity, with neutral placeholders below.
        displayEn = displayAr.map(() => '');
      }
    }
    letterPairs = displayAr.map((char, index) => ({ ar: char, en: displayEn[index] ?? '' }));
  } else {
    letterPairs = en.map((char) => ({
      ar: SAUDI_PLATE_EN_TO_AR[char] ?? '',
      en: SAUDI_PLATE_EN_TO_AR[char] ? char : '',
    }));
  }
  if (issues.includes('too-many-letters'))
    letterPairs = Array.from({ length: 3 }, () => ({ ar: '', en: '' }));

  const rawDigits = Array.from(
    String(numbers ?? '')
      .normalize('NFKC')
      .replace(/\s/g, ''),
  );
  let digitPairs = rawDigits.map((char) => {
    if (EMPTY_MARKS.has(char)) return { ar: '', en: '' };
    const norm = normalizeSaudiPlateArChar(char);
    const digit = '٠١٢٣٤٥٦٧٨٩'.indexOf(norm);
    if (digit < 0) {
      addIssue('invalid-number');
      return { ar: '', en: '' };
    }
    return { ar: norm, en: String(digit) };
  });
  if (rawDigits.length > 4) {
    addIssue('too-many-digits');
    digitPairs = Array.from({ length: 4 }, () => ({ ar: '', en: '' }));
  }

  const incomplete =
    !letterPairs.length ||
    !digitPairs.length ||
    [...letterPairs, ...digitPairs].some((pair) => !pair.ar || !pair.en);
  const status = issues.length ? 'invalid' : brandDemo ? 'demo' : incomplete ? 'incomplete' : 'valid';
  return { digitPairs, letterPairs, issues, status };
}

/** Design coordinates, not a certification of physical plate dimensions. */
export function getPlateGeometry(type: SaudiPlateType, format: PlateFormat = 'long') {
  const long = format === 'long';
  const width = long ? 520 : 335;
  const height = long ? 110 : 170;
  const pillarX = long ? (type === 'small' ? 462 : 476) : type === 'small' ? 287 : 299;
  return {
    width,
    height,
    pillarX,
    pillarWidth: width - 2.5 - pillarX,
    digits: long ? { x: 14, width: 174 } : { x: 10, width: 100 },
    logo: long ? { x: 196, y: 24.5, width: 102, height: 60 } : { x: 112, y: 52, width: 78, height: 60 },
    letters: { x: long ? 304 : 196, width: pillarX - (long ? 308 : 202) },
    rows: long
      ? { arabicY: 7, latinY: 54, digitHeight: 42, letterHeight: 40 }
      : { arabicY: 28, latinY: 98, digitHeight: 40, letterHeight: 36 },
  };
}
