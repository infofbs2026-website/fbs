import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { fallbackPlates } from '@/modules/marketplace/mock-data';

vi.mock('@/modules/marketplace/service', () => ({
  getPlateBySlug: async (slug: string) => ({
    available: true,
    plate: fallbackPlates.find((plate) => plate.slug === slug) ?? null,
  }),
}));

vi.mock('next/navigation', async (importOriginal) => ({
  ...await importOriginal<typeof import('next/navigation')>(),
  useRouter: () => ({ push: vi.fn() }),
}));

import Detail from '@/app/plates/[slug]/page';

async function renderDetail(slug: string) {
  return renderToStaticMarkup(await Detail({ params: Promise.resolve({ slug }) }));
}

describe('plate detail sale type', () => {
  it('shows direct-purchase and store favorites without auction-only terms', async () => {
    const html = await renderDetail('hba-5333');
    expect(html).toContain('الشراء المباشر');
    expect(html).toContain('حفظ في المفضلة');
    expect(html).not.toContain('/auction-room/');
    expect(html).not.toContain('سياسة التأمين');
    expect(html).not.toContain('OFFICIAL DIE-STAMP');
  });

  it('links auction plates to their auction and does not offer store favorites', async () => {
    const html = await renderDetail('fbs-1');
    expect(html).toContain('/auction-room/auction-sample-1');
    expect(html).toContain('دخول المزاد');
    expect(html).toContain('سياسة التأمين');
    expect(html).not.toContain('حفظ في المفضلة');
    expect(html).not.toContain('الشراء المباشر');
  });
});
