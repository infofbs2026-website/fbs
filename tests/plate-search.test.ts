import { describe, expect, it } from 'vitest';
import { fallbackPlates, filterFallbackPlates } from '@/modules/marketplace/mock-data';
import { matchesPlateSearch, parsePlateSearch } from '@/modules/marketplace/plate-search';
import { SAUDI_PLATE_AR_TO_EN } from '@/components/plate-glyphs-en';
import type { MarketplacePlate } from '@/modules/marketplace/types';

const plate = fallbackPlates.find((item) => item.id === 'sample-17')!;

describe('plate search', () => {
  it('does not match a letter merely because it appears in the type or description', () => {
    expect(plate.type).toBe('خصوصي');
    expect(filterFallbackPlates([plate], { q: 'ص' })).toEqual([]);
    expect(filterFallbackPlates([plate], { q: 'م' })).toEqual([plate]);
  });

  it.each(['ملك', 'م ل ك', 'م ل ك ٥', '5 م ل ك', 'klz', 'K L Z 5', '۵'])
    ('finds the same rendered plate for %s', (term) => {
      expect(filterFallbackPlates([plate], { q: term })).toEqual([plate]);
    });

  it.each(['م ك ل', 'م ل ك ١', 'Z L K 5', 'L K', 'ص', 'ي', '%', '---'])
    ('does not match unrelated or invalid input %s', (term) => {
      expect(filterFallbackPlates([plate], { q: term })).toEqual([]);
    });

  it('normalizes Arabic letter variants and ignores punctuation used as separators', () => {
    const example = fallbackPlates.find((item) => item.id === 'sample-6')!;
    expect(matchesPlateSearch(example, parsePlateSearch('ه ب أ ٥٣٣٣'))).toBe(true);
    expect(matchesPlateSearch(example, parsePlateSearch('هـ-ب-ا-5333'))).toBe(true);
  });

  it('does not match invalid Latin data that the SVG renderer leaves blank', () => {
    const inconsistent: MarketplacePlate = { ...plate, lettersEn: ['B', 'B', 'B'] };
    expect(matchesPlateSearch(inconsistent, parsePlateSearch('B'))).toBe(false);
    expect(matchesPlateSearch(inconsistent, parsePlateSearch('م ل ك'))).toBe(true);
  });

  it('matches the displayed Arabic and Latin sequence for every supported three-letter combination', () => {
    const letters = Object.keys(SAUDI_PLATE_AR_TO_EN);
    for (const first of letters) for (const second of letters) for (const third of letters) {
      const ar = [first, second, third];
      const storedLatin = ar.map((letter) => SAUDI_PLATE_AR_TO_EN[letter]);
      const example: MarketplacePlate = { ...plate, lettersAr: ar, lettersEn: storedLatin };
      const displayedLatin = [...storedLatin].reverse().join('');
      expect(matchesPlateSearch(example, parsePlateSearch(ar.join('')))).toBe(true);
      expect(matchesPlateSearch(example, parsePlateSearch(displayedLatin))).toBe(true);
      if (displayedLatin !== storedLatin.join('')) {
        expect(matchesPlateSearch(example, parsePlateSearch(storedLatin.join('')))).toBe(false);
      }
    }
  });
});
