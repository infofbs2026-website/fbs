import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getViewer, requireMfa, requirePermission } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/server';
import { IdentityReview } from '@/components/identity-review';
import styles from '@/components/account-dashboard.module.css';

export const metadata: Metadata = { title: 'مراجعة الهوية', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function IdentitiesPage() {
  if (!await getViewer()) redirect('/login');
  try { await requirePermission('identity.review'); await requireMfa(); }
  catch { return <div className="container-fbs py-16" dir="rtl">تحتاج صلاحية مراجعة الهوية وتسجيل الدخول بالتحقق بخطوتين لعرض هذه الصفحة. <Link href="/account/security">إعدادات الأمان</Link></div>; }
  const db = createAdminClient();
  if (!db) return <div className="container-fbs py-16" dir="rtl">تعذر تحميل طلبات الهوية.</div>;
  const { data, error } = await db.from('identity_verification_requests').select('id,full_name,national_id,birth_date,phone,email,city,status,submitted_at,review_reason').order('submitted_at', { ascending: false }).limit(100);
  return <div className={`${styles.dashboard} ${styles.adminIdentityPreview}`} data-account-theme="light" dir="rtl">
    <div className={styles.adminIdentityContent}><Link href="/admin" className={styles.textLink}>العودة إلى الإدارة</Link>
      <section className={styles.panel}><div className={styles.panelHeading}><div><h1>مراجعة الهوية</h1><p>راجع البيانات والصور قبل اعتماد الطلب.</p></div></div></section>
      {error ? <p role="alert">تعذر تحميل طلبات الهوية.</p> : data?.length ? data.map(request => <IdentityReview key={request.id} request={request} />) : <p className={styles.identityEmpty}>لا توجد طلبات هوية.</p>}
    </div></div>;
}
