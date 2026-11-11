import type { Metadata } from 'next';
import { FaqView, type FaqItem } from '@/components/faq-view';
import { createAdminClient } from '@/lib/supabase/server';
import { getSiteSettings } from '@/lib/site-settings';

export const metadata: Metadata = {
  title: 'الأسئلة الشائعة والمساعدة الشاملة | فارس بن سعود للوحات المميزة',
  description:
    'دليل شامل ومفصل لكافة الاستفسارات التشغيلية والمالية: آليات المزايدة، التفويض البنكي، حساب الضمان Escrow، والتوثيق ونقل الملكية المعتمد.',
  openGraph: {
    title: 'الأسئلة الشائعة والمساعدة الشاملة | فارس بن سعود للوحات المميزة',
    description: 'إجابات تفصيلية وموثقة لكافة استفسارات المزادات والتأمين المسترد ونقل الملكية المعتمد.',
    type: 'website'
  }
};

const CATEGORY_MAP: Record<string, { label: string; catId: FaqItem['catId']; badge: string }> = {
  auctions: { label: 'المزادات والمزايدة', catId: 'auctions', badge: 'توثيق رسمي معتمد وسريع' },
  guarantees: { label: 'الضمان المالي والتأمين', catId: 'guarantees', badge: 'حساب ضمان Escrow بنكي معتمد' },
  transfer: { label: 'نقل الملكية والمرور', catId: 'transfer', badge: 'نقل ملكية رسمي دون مراجعة فروع المرور' },
  selling: { label: 'البائعون وعرض اللوحات', catId: 'selling', badge: 'بدون أي رسوم مسبقة وتقييم خلال 24 ساعة' },
  policies: { label: 'التوثيق والسياسات', catId: 'policies', badge: 'إجابة معتمدة وفق اللوائح التنظيمية' },
  general: { label: 'استفسارات عامة', catId: 'policies', badge: 'مركز المعرفة والشفافية المعتمد' },
};

export async function loadDynamicFaqs(): Promise<FaqItem[] | undefined> {
  try {
    const db = createAdminClient();
    if (!db) return undefined;
    const { data, error } = await db
      .from('faqs')
      .select('id,question_ar,answer_ar,question_en,sort_order,published')
      .eq('published', true)
      .order('sort_order', { ascending: true });
    if (error || !data || data.length === 0) return undefined;

    const seen = new Set<string>();
    const uniqueRows = data.filter((row) => {
      const q = String(row.question_ar ?? '').trim();
      if (!q || seen.has(q)) return false;
      seen.add(q);
      return true;
    });

    return uniqueRows.map((row, idx) => {
      const metaRaw = String(row.question_en ?? '').trim();
      const [rawCatId, customLabel, customBadge] = metaRaw.includes('|')
        ? metaRaw.split('|')
        : [metaRaw.toLowerCase() || 'policies', '', ''];
      const mapped = CATEGORY_MAP[rawCatId] ?? CATEGORY_MAP.policies;

      return {
        id: String(idx + 1).padStart(2, '0'),
        category: customLabel || mapped.label,
        catId: mapped.catId,
        q: row.question_ar,
        a: row.answer_ar,
        badge: customBadge || mapped.badge,
      };
    });
  } catch {
    return undefined;
  }
}

export default async function FaqPage() {
  const [dynamicItems, siteSettings] = await Promise.all([loadDynamicFaqs(), getSiteSettings()]);

  return (
    <main className="min-h-screen w-full overflow-x-clip bg-paper">
      <FaqView items={dynamicItems} whatsappNumber={siteSettings.whatsappNumber} />
    </main>
  );
}
