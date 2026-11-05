import type { Metadata } from 'next';
import { AboutView } from '@/components/about-view';
import { createAdminClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'عن فارس بن سعود للوحات المميزة | الصرح السعودي الرائد لمزادات اللوحات',
  description:
    'تعرف على رؤية ومنظومة فارس بن سعود في إدارة مزادات ووساطة اللوحات السعودية الملكية والأحادية بأعلى معايير الحماية المصرفية ونظام الضامن Escrow.',
  openGraph: {
    title: 'عن فارس بن سعود للوحات المميزة | الصرح السعودي الرائد لمزادات اللوحات',
    description: 'دار المزادات والوساطة الأولى بالمملكة للوحات المركبات الملكية والأحادية والنادرة.',
    type: 'website'
  }
};

export default async function AboutPage() {
  const db = createAdminClient();
  const cms = db
    ? await db
        .from('cms_pages')
        .select('title_ar,body_ar')
        .eq('slug', 'about')
        .eq('published', true)
        .maybeSingle()
    : null;

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-paper">
      <AboutView />
      {cms?.data?.body_ar ? (
        <section className="container-fbs pb-16">
          <div className="mx-auto max-w-4xl rounded-3xl border border-[#D9BB81]/40 bg-white p-7 sm:p-10 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-black text-[#14243C]">{cms.data.title_ar}</h2>
            <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
              {cms.data.body_ar}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
