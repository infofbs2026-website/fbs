import type { Metadata } from 'next';
import { HowItWorksView } from '@/components/how-it-works-view';

export const metadata: Metadata = {
  title: 'دليل وآلية عمل المنصة | فارس بن سعود للوحات المميزة',
  description: 'تعرف على خطوات المزايدة والشراء أو عرض لوحتك للبيع بضمانات رسمية معتمدة عبر منصة فارس بن سعود، مع أنظمة الحساب الضامن ونقل الملكية الفوري.',
  openGraph: {
    title: 'دليل وآلية عمل المنصة | فارس بن سعود للوحات المميزة',
    description: 'خطوات موثقة تضمن حقك في مزادات ووساطة اللوحات السعودية المميزة.',
    type: 'website'
  }
};

export default function HowItWorksPage() {
  return <HowItWorksView />;
}
