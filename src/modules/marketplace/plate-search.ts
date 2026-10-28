import { parsePlateData } from '@/lib/plate-data';
import { normalizeSaudiPlateArChar } from '@/components/plate-glyphs-ar';
import type { MarketplacePlate } from './types';

export type PlateSearch = {
  arabic: string;
  latin: string;
  digits: string;
  valid: boolean;
};

const MARKS = /[\u064B-\u065F\u0670\u06D6-\u06ED\u200C-\u200F\u202A-\u202E\u2066-\u2069\uFEFF\u0640]/g;
const SEPARATORS = /[\s,،./_\-]/u;
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

// Normalize input the same way the plate renderer does. Search accepts either
// Arabic or Latin characters and either common form of Arabic numerals.
export function parsePlateSearch(value: string): PlateSearch {
  const result: PlateSearch = { arabic: '', latin: '', digits: '', valid: true };
  for (const char of Array.from(value.normalize('NFKC').replace(MARKS, ''))) {
    if (SEPARATORS.test(char)) continue;
    const arDigit = ARABIC_DIGITS.indexOf(char);
    const faDigit = PERSIAN_DIGITS.indexOf(char);
    if (arDigit >= 0 || faDigit >= 0) {
      result.digits += String(arDigit >= 0 ? arDigit : faDigit);
    } else if (/^[0-9]$/.test(char)) {
      result.digits += char;
    } else if (/^[a-z]$/i.test(char)) {
      result.latin += char.toUpperCase();
    } else if (/^\p{Script=Arabic}$/u.test(char) && /^\p{L}$/u.test(char)) {
      result.arabic += normalizeSaudiPlateArChar(char).replace(/ـ/g, '');
    } else {
      result.valid = false;
    }
  }
  if (!result.arabic && !result.latin && !result.digits) result.valid = false;
  return result;
}

/** Match only what the shared SVG renderer actually displays on the plate. */
export function matchesPlateSearch(plate: MarketplacePlate, search: PlateSearch): boolean {
  if (!search.valid) return false;
  const drawn = parsePlateData(plate.lettersAr, plate.lettersEn, plate.numbers);
  const ar = drawn.letterPairs.map((pair) => pair.ar.replace(/ـ/g, '') || '\0').reverse().join('');
  const en = drawn.letterPairs.map((pair) => pair.en.toUpperCase() || '\0').join('');
  const numbers = drawn.digitPairs.map((pair) => pair.en || '\0').join('');
  return (!search.arabic || ar.includes(search.arabic)) &&
    (!search.latin || en.includes(search.latin)) &&
    (!search.digits || numbers.includes(search.digits));
}
