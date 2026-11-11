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
        <section className="max-w-[1000px] mx-auto px-5 sm:px-8 lg:px-10 pb-12 sm:pb-16">
          <div className="rounded-2xl border border-[#D9BB81]/40 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl sm:text-2xl font-black text-[#14243C]">{cms.data.title_ar}</h2>
            <div className="mt-3.5 whitespace-pre-wrap text-xs sm:text-[13.5px] leading-relaxed text-slate-700">
              {cms.data.body_ar}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
