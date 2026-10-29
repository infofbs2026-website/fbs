import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { fallbackPlates } from '@/modules/marketplace/mock-data';

vi.mock('next/navigation', async (importOriginal) => ({
  ...await importOriginal<typeof import('next/navigation')>(),
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() })
}));

import { AccountDashboard, type AccountDashboardProps } from '@/components/account-dashboard';

const props: AccountDashboardProps = {
  user: { id: 'user-1', email: 'member@example.com', displayName: 'عضو' },
  activeSectionKey: 'overview', rowsData: [], initialTheme: 'light', dataState: 'demo',
  featuredPlates: [fallbackPlates[0]], marketplaceSource: 'demo',
  counts: { auctions: null, plates: null, favorites: null },
  profilePhone: null, profileEditable: false
};

function render(changes: Partial<AccountDashboardProps> = {}) {
  return renderToStaticMarkup(createElement(AccountDashboard, { ...props, ...changes }));
}

describe('account dashboard', () => {
  it('uses the shared plate face and labels examples without inventing account figures', () => {
    const html = render();
    expect(html).toContain('data-pf-proportional="saudi-plate"');
    expect(html).toContain('/plates/fbs-1');
    expect(html).toContain('وضع المعاينة');
    expect(html).toContain('لوحة تجريبية');
    expect(html).toContain('سعر توضيحي');
    expect(html).toContain('مثال توضيحي');
    expect(html).not.toContain('مباشر الآن');
    expect(html).not.toContain('موثّقة');
    expect(html).not.toContain('مزايدة سريعة');
    expect(html).not.toContain('سقف ضمانك');
  });

  it('renders each chosen theme and actual zero counts', () => {
    const html = render({ initialTheme: 'dark', dataState: 'ready', marketplaceSource: 'database', counts: { auctions: 0, plates: 3, favorites: 1 } });
    expect(html).toContain('data-account-theme="dark"');
    expect(html).toContain('aria-label="الوضع الداكن" aria-pressed="true"');
    expect(html).not.toContain('وضع المعاينة');
    expect(html).not.toContain('سعر توضيحي');
    expect(html).toContain('مشاركاتي');
  });

  it('provides real quick links and identifies a sample featured plate', () => {
    const html = render();
    expect(html).toContain('aria-label="وصول سريع"');
    expect(html).toContain('href="/plates/search"');
    expect(html).toContain('href="/auctions"');
    expect(html).toContain('href="/sell-your-plate"');
    expect(html).toContain('data-demo="true"');
  });

  it('reports unavailable data instead of presenting fake account records', () => {
    const html = render({ activeSectionKey: 'deposits', dataState: 'unavailable', featuredPlates: [] });
    expect(html).toContain('تعذر تحميل البيانات حاليًا');
    expect(html).not.toContain('250,000');
  });

  it('does not permit saving profile fields before the real profile is loaded', () => {
    const html = render({ activeSectionKey: 'profile', dataState: 'unavailable', featuredPlates: [] });
    expect(html).toContain('تعذر تحميل بيانات الملف للتعديل');
    expect(html).toContain('disabled=""');
    expect(html).not.toContain('1088492001');
  });

  it('shows the identity and password structure as a local-only preview without country or language selectors', () => {
    const html = render({ activeSectionKey: 'profile', dataState: 'ready', featuredPlates: [] });
    expect(html).toContain('إثبات الهوية');
    expect(html).toContain('إرسال للمراجعة التجريبية');
    expect(html).toContain('لا تُرسل الملفات أو تُحفظ');
    expect(html).toContain('href="/forgot-password"');
    expect(html).not.toContain('لغة التواصل');
    expect(html).not.toContain('الدولة');
  });

  it('shows account security actions and the actual account email without claiming MFA is already enabled', () => {
    const html = render({ activeSectionKey: 'security', initialTheme: 'dark', dataState: 'ready', featuredPlates: [] });
    expect(html).toContain('member@example.com');
    expect(html).toContain('href="/forgot-password"');
    expect(html).toContain('إعداد أو تأكيد تطبيق المصادقة');
    expect(html).toContain('نصائح لحماية حسابك');
    expect(html).not.toContain('العمليات المالية الحساسة ومزايدات النخبة تتطلب');
  });

  it('distinguishes unavailable security settings from the demo and does not offer enrollment in either case', () => {
    const unavailable = render({ activeSectionKey: 'security', dataState: 'unavailable', featuredPlates: [] });
    const demo = render({ activeSectionKey: 'security', dataState: 'demo', featuredPlates: [] });
    expect(unavailable).toContain('تعذر تحميل إعدادات التحقق بخطوتين');
    expect(demo).toContain('إعداد التحقق بخطوتين غير متاح في وضع المعاينة');
    expect(unavailable).not.toContain('إعداد أو تأكيد تطبيق المصادقة');
    expect(demo).not.toContain('إعداد أو تأكيد تطبيق المصادقة');
  });
});
