'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './account-dashboard.module.css';

type RequestRecord = { id: string; full_name: string; national_id: string; birth_date: string; phone: string; email: string; city: string; status: string; submitted_at: string; review_reason: string | null };

export function IdentityReview({ request }: { request: RequestRecord }) {
  const router = useRouter();
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function review(status: 'VERIFIED' | 'REJECTED') {
    if (status === 'REJECTED' && reason.trim().length < 3) { setMessage('اكتب سبب الرفض قبل المتابعة.'); return; }
    setBusy(true); setMessage('');
    try {
      const response = await fetch(`/api/v1/admin/identity/${request.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status, reason }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || 'تعذر حفظ القرار.');
      router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'تعذر حفظ القرار.'); }
    finally { setBusy(false); }
  }
  const fields = [['الاسم الكامل', request.full_name], ['رقم الهوية', request.national_id], ['تاريخ الميلاد', request.birth_date], ['رقم الجوال', request.phone], ['البريد الإلكتروني', request.email], ['المدينة', request.city]];
  const status = ({ PENDING: 'قيد المراجعة', VERIFIED: 'معتمدة', REJECTED: 'مرفوضة' } as Record<string, string>)[request.status] ?? request.status;
  return <article className={styles.panel}>
    <div className={styles.identityReview}>
      <p className={styles.identityStatus}>{status}</p>
      <dl className={styles.identityData}>{fields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd dir={['رقم الهوية','رقم الجوال','البريد الإلكتروني','تاريخ الميلاد'].includes(label) ? 'ltr' : undefined}>{value}</dd></div>)}</dl>
      <div className={styles.identityImages}>
        {(['front', 'back'] as const).map((side) => <figure key={side}>{/* Private, permission-checked, no-store endpoint. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.identityPreviewImage} src={`/api/v1/admin/identity/${request.id}/image/${side}`} alt={side === 'front' ? 'وجه الهوية' : 'ظهر الهوية'} /><figcaption>{side === 'front' ? 'الوجه الأمامي' : 'الوجه الخلفي'}</figcaption></figure>)}
      </div>
      {request.status === 'PENDING' && <><label className={styles.field}><span>سبب الرفض عند الحاجة</span><input value={reason} maxLength={1000} onChange={event => setReason(event.target.value)} /></label>
        <div className={styles.identityReviewActions}><button type="button" disabled={busy} className={styles.primaryButton} onClick={() => review('VERIFIED')}>اعتماد الهوية</button><button type="button" disabled={busy} className={styles.outlineButton} onClick={() => review('REJECTED')}>رفض الطلب</button></div></>}
      {request.review_reason && <p>سبب الرفض: {request.review_reason}</p>}
      {message && <p role="alert" className={styles.error}>{message}</p>}
    </div>
  </article>;
}
