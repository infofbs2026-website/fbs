import type { Metadata } from 'next';
import { FaqView } from '@/components/faq-view';

export const metadata: Metadata = {
  title: 'الأسئلة الشائعة والمساعدة الشاملة | فارس بن سعود للوحات المميزة',
  description:
    'دليل شامل ومفصل لكافة الاستفسارات التشغيلية والمالية: آليات المزايدة، التفويض البنكي، حساب الضمان Escrow، والتوثيق ونقل الملكية المعتمد عبر أبشر.',
  openGraph: {
    title: 'الأسئلة الشائعة والمساعدة الشاملة | فارس بن سعود للوحات المميزة',
    description: 'إجابات تفصيلية وموثقة لكافة استفسارات المزادات والتأمين المسترد ونقل الملكية المعتمد.',
    type: 'website'
  }
};

export default function FaqPage() {
  return (
    <main className="min-h-screen w-full overflow-x-clip bg-paper">
      <FaqView />
    </main>
  );
}
