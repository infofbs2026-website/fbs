import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { IdentityDemoReview } from '@/components/identity-demo';
import styles from '@/components/account-dashboard.module.css';
import { getViewer, requirePermission } from '@/lib/auth';

export const metadata: Metadata = { title: 'معاينة مراجعة الهوية' };
export const dynamic = 'force-dynamic';

export default async function IdentityPreviewPage() {
  const viewer = await getViewer();
  if (!viewer) redirect('/login');
  try {
    await requirePermission('user.view');
  } catch {
    return <div className="container-fbs py-16">الوصول غير مسموح.</div>;
  }

  return (
    <div className={`${styles.dashboard} ${styles.adminIdentityPreview}`} data-account-theme="light" dir="rtl">
      <div className={styles.adminIdentityContent}>
        <Link href="/admin" className={styles.textLink}>العودة إلى الإدارة</Link>
        <section className={styles.panel}>
          <div className={styles.panelHeading}><div><h1>مراجعة الهوية التجريبية</h1><p>معاينة في نفس جلسة المتصفح فقط؛ لا توجد بيانات محفوظة.</p></div></div>
          <IdentityDemoReview ownerId={viewer.id} />
        </section>
        <Link href="/account/profile" className={styles.textLink}>العودة إلى الملف الشخصي</Link>
      </div>
    </div>
  );
}
