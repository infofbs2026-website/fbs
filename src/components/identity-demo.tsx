'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from 'react';
import { ArrowLeft, FileCheck2, IdCard, RotateCcw, ShieldCheck } from 'lucide-react';
import {
  canIdentityDemoBid, clearIdentityDemo, getIdentityDemo, reviewIdentityDemo, submitIdentityDemo,
  subscribeIdentityDemo, type IdentityDemoSubmission
} from './identity-demo-store';
import styles from './account-dashboard.module.css';

const serverSnapshot = () => null;

function useIdentityDemo(ownerId: string) {
  return useSyncExternalStore(subscribeIdentityDemo, () => getIdentityDemo(ownerId), serverSnapshot);
}

function LocalImage({ file, alt }: { file: File; alt: string }) {
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const url = URL.createObjectURL(file);
    if (imageRef.current) imageRef.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);
  // A local object URL keeps the selected test image inside this browser tab.
  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={imageRef} alt={alt} className={styles.identityPreviewImage} />;
}

export function IdentityDemoReview({ ownerId }: { ownerId: string }) {
  const submission = useIdentityDemo(ownerId);
  if (!submission) return <p className={styles.identityEmpty}>لا يوجد طلب تجريبي في هذه الجلسة. أنشئ طلبًا تجريبيًا من الملف الشخصي أولًا.</p>;
  const fields = [
    ['الاسم الكامل', submission.fullName], ['رقم الهوية', submission.nationalId],
    ['تاريخ الميلاد', submission.birthDate], ['الجوال', submission.phone],
    ['البريد الإلكتروني', submission.email], ['المدينة', submission.city]
  ];
  const labels = { pending: 'بانتظار المراجعة التجريبية', approved: 'مقبول في التجربة', rejected: 'مرفوض في التجربة' };
  return (
    <div className={styles.identityReview}>
      <p className={styles.identityDemoNote}>معاينة محلية فقط؛ هذا القرار لا يغيّر حالة الحساب أو صلاحية المزايدة الفعلية.</p>
      <p className={styles.identityStatus} role="status">{labels[submission.status]}</p>
      <dl className={styles.identityData}>
        {fields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd dir={label === 'البريد الإلكتروني' || label === 'الجوال' || label === 'رقم الهوية' ? 'ltr' : undefined}>{value || '—'}</dd></div>)}
      </dl>
      <div className={styles.identityImages}>
        <figure><LocalImage file={submission.front} alt="صورة تجريبية لوجه الهوية" /><figcaption>الوجه الأمامي</figcaption></figure>
        <figure><LocalImage file={submission.back} alt="صورة تجريبية لظهر الهوية" /><figcaption>الوجه الخلفي</figcaption></figure>
      </div>
      {submission.status === 'pending' && <div className={styles.identityReviewActions}>
        <button type="button" className={styles.primaryButton} onClick={() => reviewIdentityDemo(ownerId, 'approved')}>قبول تجريبي</button>
        <button type="button" className={styles.outlineButton} onClick={() => reviewIdentityDemo(ownerId, 'rejected')}>رفض تجريبي</button>
      </div>}
    </div>
  );
}

export function IdentityDemo({ ownerId, adminLink }: { ownerId: string; adminLink: boolean }) {
  const submission = useIdentityDemo(ownerId);
  const [front, setFront] = useState<File | null>(null);
  const [back, setBack] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [bidMessage, setBidMessage] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (!front || !back) { setError('اختر صورتين تجريبيتين للوجه والظهر.'); return; }
    if ([front, back].some((file) => !['image/jpeg', 'image/png'].includes(file.type) || file.size === 0 || file.size > 5 * 1024 * 1024)) {
      setError('استخدم صورًا تجريبية بصيغة JPG أو PNG، بحد أقصى 5 ميجابايت للصورة.'); return;
    }
    const data = new FormData(event.currentTarget);
    submitIdentityDemo({
      ownerId,
      fullName: String(data.get('fullName') ?? '').trim(),
      nationalId: String(data.get('nationalId') ?? '').trim(),
      birthDate: String(data.get('birthDate') ?? ''),
      phone: String(data.get('phone') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      city: String(data.get('city') ?? '').trim(),
      front, back
    });
    setBidMessage('');
  }

  function testBid() {
    setBidMessage(canIdentityDemoBid(ownerId)
      ? 'المحاكاة تسمح بالمزايدة بعد القبول التجريبي. لم تتغير صلاحية حسابك الفعلية.'
      : 'في المحاكاة، يلزم قبول الهوية قبل السماح بالمزايدة.');
  }

  const labels: Record<IdentityDemoSubmission['status'], string> = {
    pending: 'قيد المراجعة التجريبية', approved: 'مقبول في التجربة', rejected: 'مرفوض في التجربة'
  };

  return (
    <section className={`${styles.panel} ${styles.identityPanel}`} aria-labelledby="identity-demo-title">
      <div className={styles.panelHeading}>
        <span className={styles.panelIcon}><IdCard size={20} aria-hidden="true" /></span>
        <div><h2 id="identity-demo-title">إثبات الهوية</h2><p>تجربة مراحل التقديم والمراجعة قبل الربط الفعلي.</p></div>
      </div>
      <p className={styles.identityDemoNote}>وضع تجريبي على جهازك فقط. استخدم بيانات وصورًا غير حقيقية؛ لا تُرسل الملفات أو تُحفظ، وتختفي عند تحديث الصفحة أو إغلاقها.</p>
      {!submission ? (
        <form className={styles.identityForm} onSubmit={submit}>
          <div className={styles.formGrid}>
            <label className={styles.field}><span>الاسم الكامل التجريبي</span><input name="fullName" minLength={3} maxLength={120} required placeholder="اسم تجريبي" /></label>
            <label className={styles.field}><span>رقم الهوية التجريبي</span><input name="nationalId" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} required placeholder="10 أرقام تجريبية" dir="ltr" /></label>
            <label className={styles.field}><span>تاريخ الميلاد التجريبي</span><input name="birthDate" type="date" required /></label>
            <label className={styles.field}><span>رقم الجوال التجريبي</span><input name="phone" type="tel" minLength={7} maxLength={20} required placeholder="رقم تجريبي" dir="ltr" /></label>
            <label className={styles.field}><span>البريد الإلكتروني التجريبي</span><input name="email" type="email" required placeholder="test@example.com" dir="ltr" /></label>
            <label className={styles.field}><span>المدينة</span><input name="city" maxLength={100} required placeholder="المدينة التجريبية" /></label>
          </div>
          <div className={styles.identityFiles}>
            <label className={styles.identityFile}><FileCheck2 size={20} aria-hidden="true" /><span><strong>وجه الهوية</strong><small>{front ? front.name : 'اختر صورة تجريبية'}</small></span><input type="file" accept="image/jpeg,image/png" required onChange={(event) => setFront(event.target.files?.[0] ?? null)} /></label>
            <label className={styles.identityFile}><FileCheck2 size={20} aria-hidden="true" /><span><strong>ظهر الهوية</strong><small>{back ? back.name : 'اختر صورة تجريبية'}</small></span><input type="file" accept="image/jpeg,image/png" required onChange={(event) => setBack(event.target.files?.[0] ?? null)} /></label>
          </div>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <button className={styles.primaryButton} type="submit">إرسال للمراجعة التجريبية <ArrowLeft size={16} aria-hidden="true" /></button>
        </form>
      ) : (
        <div className={styles.identitySubmitted}>
          <p className={styles.identityStatus} role="status">{labels[submission.status]}</p>
          <p>الطلب موجود في ذاكرة هذه الصفحة فقط ولا يُرسل للإدارة الفعلية.</p>
          <details className={styles.identityDetails}>
            <summary>معاينة تجربة مراجعة الأدمن</summary>
            <IdentityDemoReview ownerId={ownerId} />
          </details>
          {adminLink && <Link href="/admin/identity-preview" className={styles.textLink}>فتح نموذج المراجعة في الإدارة <ArrowLeft size={15} aria-hidden="true" /></Link>}
          <button type="button" className={styles.outlineButton} onClick={() => { clearIdentityDemo(); setFront(null); setBack(null); setBidMessage(''); }}><RotateCcw size={15} aria-hidden="true" /> تجربة جديدة</button>
        </div>
      )}
      <div className={styles.identityBidDemo}>
        <ShieldCheck size={19} aria-hidden="true" />
        <span>اختبر شرط قبول الهوية للمزايدة داخل المحاكاة.</span>
        <button type="button" className={styles.outlineButton} onClick={testBid}>اختبار الشرط</button>
      </div>
      {bidMessage && <p className={styles.formHint} role="status">{bidMessage}</p>}
    </section>
  );
}
