import type { Metadata } from 'next';
import { HowItWorksView } from '@/components/how-it-works-view';
import { createAdminClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'دليل وآلية عمل المنصة | فارس بن سعود للوحات المميزة',
  description: 'تعرف على خطوات المزايدة والشراء أو عرض لوحتك للبيع بضمانات رسمية معتمدة عبر منصة فارس بن سعود، مع أنظمة الحساب الضامن ونقل الملكية الفوري.',
  openGraph: {
    title: 'دليل وآلية عمل المنصة | فارس بن سعود للوحات المميزة',
    description: 'خطوات موثقة تضمن حقك في مزادات ووساطة اللوحات السعودية المميزة.',
    type: 'website'
  }
};

export default async function HowItWorksPage() {
  const db = createAdminClient();
  const cms = db
    ? await db
        .from('cms_pages')
        .select('title_ar,body_ar')
        .eq('slug', 'how-it-works')
        .eq('published', true)
        .maybeSingle()
    : null;

  return (
    <>
      <HowItWorksView />
      {cms?.data?.body_ar ? (
        <section className="max-w-[1000px] mx-auto px-5 sm:px-8 lg:px-10 pb-16">
          <div className="mx-auto max-w-4xl rounded-3xl border border-[#D9BB81]/40 bg-white p-7 sm:p-10 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-black text-[#14243C]">{cms.data.title_ar}</h2>
            <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
              {cms.data.body_ar}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
