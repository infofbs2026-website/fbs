import { createElement, Fragment } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { parsePlateData, SAUDI_PLATE_AR_TO_EN } from '@/lib/plate-data';
import { PlateVisualizer } from '@/components/ui';
import { CarMountedPlate, PlateCarPreview3D } from '@/components/plate-car-preview-3d';
import { fallbackPlates } from '@/modules/marketplace/mock-data';

const arabic = ['ا', 'ب', 'ح'];
const columns = [
  { ar: 'ح', en: 'J' },
  { ar: 'ب', en: 'B' },
  { ar: 'ا', en: 'A' },
];

describe('Plate identity and input normalization', () => {
  it.each(Object.entries(SAUDI_PLATE_AR_TO_EN))('pairs %s with %s', (ar, en) => {
    const plate = parsePlateData([ar], [en], '1');
    expect(plate.status).toBe('valid');
    expect(plate.letterPairs).toEqual([{ ar, en }]);
  });

  it('keeps Arabic reading order independent of the Latin field or its legacy orientation', () => {
    for (const en of [[], ['A', 'B', 'J'], ['J', 'B', 'A']]) {
      expect(parsePlateData(arabic, en, '1234').letterPairs).toEqual(columns);
    }
  });

  it('checks every pair even when the first letter matches', () => {
    const plate = parsePlateData(arabic, ['A', 'X', 'J'], '1234');
    expect(plate.status).toBe('invalid');
    expect(plate.issues).toContain('letter-mismatch');
    expect(plate.letterPairs.map((pair) => pair.ar)).toEqual(['ح', 'ب', 'ا']);
    expect(plate.letterPairs.every((pair) => pair.en === '')).toBe(true);
  });

  it('does not infer orientation from a repeated first/last letter', () => {
    expect(parsePlateData(['ا', 'ب', 'ا'], ['A', 'X', 'A'], '1').status).toBe('invalid');
  });

  it('splits strings and multi-character array items into the same three columns', () => {
    expect(parsePlateData('ا ب ح', 'J B A', '12').letterPairs).toEqual(columns);
    expect(parsePlateData(['ابح'], ['JBA'], '12').letterPairs).toEqual(columns);
  });

  it('keeps هـ as one letter and normalizes Arabic forms and direction marks', () => {
    expect(parsePlateData('هـبا', 'ABH', '1').letterPairs).toEqual([
      { ar: 'ا', en: 'A' },
      { ar: 'ب', en: 'B' },
      { ar: 'هـ', en: 'H' },
    ]);
    expect(parsePlateData(['\u200fأَ', 'ب', 'ی'], ['V', 'B', 'A'], '1').status).toBe('valid');
  });

  it.each(['0123', '٠١٢٣', '۰۱۲۳', '０１２３'])('preserves leading zeroes in %s', (input) => {
    expect(
      parsePlateData(arabic, [], input)
        .digitPairs.map((pair) => pair.en)
        .join(''),
    ).toBe('0123');
  });

  it('keeps partial seller-form columns without moving the selected letter', () => {
    const plate = parsePlateData(['ـ', 'ب', 'ـ'], ['•', 'B', '•'], '••••');
    expect(plate.status).toBe('incomplete');
    expect(plate.letterPairs).toEqual([
      { ar: '', en: '' },
      { ar: 'ب', en: 'B' },
      { ar: '', en: '' },
    ]);
    expect(plate.digitPairs).toHaveLength(4);
  });

  it('marks invalid digits rather than dropping them and changing the number', () => {
    const plate = parsePlateData(arabic, [], '10x2');
    expect(plate.status).toBe('invalid');
    expect(plate.digitPairs.map((pair) => pair.en || '?').join('')).toBe('10?2');
  });

  it('uses neutral placeholders for oversized identities instead of truncating them', () => {
    const plate = parsePlateData('ابحد', [], '12345');
    expect(plate.issues).toEqual(expect.arrayContaining(['too-many-letters', 'too-many-digits']));
    expect(plate.letterPairs.every((pair) => !pair.ar && !pair.en)).toBe(true);
    expect(plate.digitPairs.every((pair) => !pair.ar && !pair.en)).toBe(true);
  });

  it('derives only supported Arabic counterparts for Latin-only input', () => {
    expect(parsePlateData([], 'JBA', '1').letterPairs).toEqual(columns);
    expect(parsePlateData([], 'Q', '1').status).toBe('invalid');
  });

  it.each(['FBS', 'SBF'])('preserves the FBS demo (%s) without extending the real alphabet', (input) => {
    const plate = parsePlateData('فبس', input, '7');
    expect(plate.status).toBe('demo');
    expect(plate.letterPairs).toEqual([
      { ar: 'س', en: 'S' },
      { ar: 'ب', en: 'B' },
      { ar: 'ف', en: 'F' },
    ]);
    expect(SAUDI_PLATE_AR_TO_EN['ف']).toBeUndefined();
    expect(parsePlateData('فبا', 'ABF', '7').status).toBe('invalid');
  });

  it('keeps all existing marketplace examples renderable', () => {
    for (const item of fallbackPlates) {
      const plate = parsePlateData(item.lettersAr, item.lettersEn, item.numbers);
      expect(plate.issues, item.slug).toEqual([]);
      expect(['valid', 'demo']).toContain(plate.status);
    }
  });
});

describe('Shared vector face contract', () => {
  const props = { lettersAr: ['ب', 'ط', 'ل'], lettersEn: ['L', 'T', 'B'], numbers: '8888' };
  const signatures = (html: string) =>
    [...html.matchAll(/data-plate-char="([^"]*)"[^>]*>\s*(<path[^>]*>)/g)]
      .map((match) => `${match[1]}:${match[2]}`);

  it.each(['خصوصي', 'صغيرة', 'نقل'])(
    'preserves the glyphs and frame while leaving the car plate unbranded for %s',
    (plateType) => {
      for (const format of ['long', 'standard'] as const) {
        const card = renderToStaticMarkup(
          createElement(PlateVisualizer, { ...props, plateType, plateSize: format }),
        );
        const car = renderToStaticMarkup(
          createElement(CarMountedPlate, { ...props, plateType, size: format }),
        );
        expect(signatures(card)).toHaveLength(14);
        expect(signatures(card)).toEqual(signatures(car));
        expect(card).toContain('data-pf-part="fbs-logo"');
        expect(car).not.toContain('data-pf-part="fbs-logo"');
        expect(car).toContain('data-pf-part="pillar"');
        expect(card).toContain(format === 'long' ? 'viewBox="0 0 520 110"' : 'viewBox="0 0 335 170"');
        expect(car).toContain(format === 'long' ? 'viewBox="0 0 520 110"' : 'viewBox="0 0 335 170"');
      }
    },
  );

  it('uses vectors for the FBS demo and never falls back to a text glyph', () => {
    const html = renderToStaticMarkup(
      createElement(PlateVisualizer, {
        lettersAr: ['ف', 'ب', 'س'],
        lettersEn: ['F', 'B', 'S'],
        numbers: '1',
      }),
    );
    expect(html).toContain('data-plate-status="demo"');
    expect(html).toContain('data-plate-char="ف"');
    expect(html).not.toMatch(/<text[^>]*>ف<\/text>/);
    expect(html).not.toContain('q-char-fallback');
  });

  it('preserves the chosen short format in the full-screen preview link', () => {
    const html = renderToStaticMarkup(
      createElement(PlateCarPreview3D, {
        initialPlate: { ...props, plateType: 'خصوصي' },
        initialSize: 'standard',
      }),
    );
    expect(html).toContain('data-plate-face="standard"');
    expect(html).toContain('size=standard');
  });

  it('keeps the chosen view and lighting when opening the full-screen preview', () => {
    const html = renderToStaticMarkup(
      createElement(PlateCarPreview3D, {
        initialPlate: { ...props, plateType: 'خصوصي' },
        initialCamera: 'closeup',
        initialLighting: 'day',
      }),
    );
    expect(html).toContain('camera=closeup');
    expect(html).toContain('lighting=day');
    expect(html).not.toContain('زاوية سينمائية');
    expect(html).not.toContain('ذهبي دافئ');
  });

  it('shows a neutral vector for a conflicting pair and exposes an accessible explanation', () => {
    const html = renderToStaticMarkup(
      createElement(PlateVisualizer, { lettersAr: arabic, lettersEn: ['A', 'X', 'J'], numbers: '1' }),
    );
    expect(html).toContain('data-plate-status="invalid"');
    expect(html).toContain('data-plate-placeholder="true"');
    expect(html).toContain('يرجى مراجعة بيانات اللوحة');
    expect(html).not.toContain('data-plate-char="X"');
  });

  it('keeps SVG definitions unique and resolves every gradient, clip and filter on a multi-card page', () => {
    const html = renderToStaticMarkup(
      createElement(
        Fragment,
        null,
        createElement(PlateVisualizer, props),
        createElement(PlateVisualizer, props),
      ),
    );
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    expect(new Set(ids).size).toBe(ids.length);
    for (const match of html.matchAll(/url\(#([^\)]+)\)/g)) expect(ids).toContain(match[1]);
  });
});
