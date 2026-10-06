import type { Metadata } from 'next';
import { AboutView } from '@/components/about-view';

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

export default function AboutPage() {
  return (
    <main className="min-h-screen w-full overflow-x-clip bg-paper">
      <AboutView />
    </main>
  );
}
