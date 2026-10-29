'use client';
import { useEffect, useState, type FormEvent } from 'react';
import { ArrowLeft, FileCheck2, IdCard, ShieldCheck } from 'lucide-react';
import styles from './account-dashboard.module.css';

type IdentityState = { status: 'NOT_STARTED' | 'PENDING' | 'VERIFIED' | 'REJECTED'; reason: string | null };

const MAX_IMAGE = 1572864;
async function prepareImage(file: File): Promise<File> {
  if (file.size <= MAX_IMAGE) return file;
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const scale = Math.min(1, 1800 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error();
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.86, 0.76, 0.66]) {
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
      if (blob && blob.size <= MAX_IMAGE) return new File([blob], 'identity.jpg', { type: 'image/jpeg' });
    }
    throw new Error();
  } finally { URL.revokeObjectURL(url); }
}

export function IdentityVerification({ email, phone }: { email: string; phone: string | null }) {
  const [state, setState] = useState<IdentityState | null>(null);
  const [front, setFront] = useState<File | null>(null);
  const [back, setBack] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/v1/identity', { signal: controller.signal, cache: 'no-store' })
      .then(async response => { if (!response.ok) throw new Error(); return response.json(); })
      .then(result => setState(result.data))
      .catch(() => { if (!controller.signal.aborted) setError('تعذر تحميل حالة الهوية. حاول تحديث الصفحة.'); });
    return () => controller.abort();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    if (!front || !back) { setError('اختر صورتي وجه وظهر الهوية.'); return; }
    if ([front, back].some(file => !['image/jpeg','image/png'].includes(file.type) || !file.size)) {
      setError('استخدم صور JPG أو PNG.'); return;
    }
    setBusy(true); setError('');
    try {
      const form = new FormData(event.currentTarget);
      const [frontImage, backImage] = await Promise.all([prepareImage(front), prepareImage(back)]);
      form.set('front', frontImage); form.set('back', backImage);
      const response = await fetch('/api/v1/identity', { method: 'POST', body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || 'تعذر إرسال الطلب.');
      setState({ status: 'PENDING', reason: null });
      setFront(null); setBack(null);
    } catch (error) { setError(error instanceof Error && error.message ? error.message : 'تعذر تجهيز الصور أو إرسال الطلب. حاول بصور أوضح وأصغر حجمًا.'); }
    finally { setBusy(false); }
  }

  const status = state?.status;
  return <section className={`${styles.panel} ${styles.identityPanel}`} aria-labelledby="identity-title">
    <div className={styles.panelHeading}><span className={styles.panelIcon}><IdCard size={20} aria-hidden="true" /></span><div><h2 id="identity-title">إثبات الهوية</h2><p>اعتماد الهوية مطلوب للمشاركة في المزادات.</p></div></div>
    {!state && !error && <p className={styles.formHint} role="status">جارٍ تحميل حالة الهوية…</p>}
    {status === 'PENDING' && <div className={styles.identitySubmitted}><p className={styles.identityStatus} role="status">قيد المراجعة</p><p>تم إرسال طلبك، وستتم مراجعة البيانات وصور الهوية.</p></div>}
    {status === 'VERIFIED' && <div className={styles.identitySubmitted}><p className={styles.identityStatus} role="status"><ShieldCheck size={16} aria-hidden="true" /> الهوية معتمدة</p><p>يمكنك التسجيل في المزادات بعد استيفاء شروط المشاركة.</p></div>}
    {status === 'REJECTED' && <div className={styles.identitySubmitted}><p className={styles.identityStatus}>لم يُعتمد الطلب</p>{state?.reason && <p>سبب الرفض: {state.reason}</p>}<p>يمكنك تحديث البيانات وإرسال الطلب مرة أخرى.</p></div>}
    {(status === 'NOT_STARTED' || status === 'REJECTED') && <form className={styles.identityForm} onSubmit={submit}>
      <div className={styles.formGrid}>
        <label className={styles.field}><span>الاسم الكامل كما في الهوية</span><input name="fullName" minLength={3} maxLength={120} required /></label>
        <label className={styles.field}><span>رقم الهوية</span><input name="nationalId" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} required placeholder="١٠ أرقام" dir="ltr" /></label>
        <label className={styles.field}><span>تاريخ الميلاد</span><input name="birthDate" type="date" required /></label>
        <label className={styles.field}><span>رقم الجوال</span><input name="phone" type="tel" minLength={7} maxLength={20} defaultValue={phone ?? ''} required placeholder="+966" dir="ltr" /></label>
        <label className={styles.field}><span>البريد الإلكتروني</span><input name="email" type="email" defaultValue={email} required dir="ltr" /></label>
        <label className={styles.field}><span>المدينة</span><input name="city" minLength={2} maxLength={100} required /></label>
      </div>
      <p className={styles.formHint}>ارفع صورتين واضحتين بصيغة JPG أو PNG. تُهيّأ الصور الكبيرة تلقائيًا قبل الإرسال.</p>
      <div className={styles.identityFiles}>
        <label className={styles.identityFile}><FileCheck2 size={20} aria-hidden="true" /><span><strong>وجه الهوية</strong><small>{front ? front.name : 'اختر الصورة'}</small></span><input name="front" type="file" accept="image/jpeg,image/png" required onChange={event => setFront(event.target.files?.[0] ?? null)} /></label>
        <label className={styles.identityFile}><FileCheck2 size={20} aria-hidden="true" /><span><strong>ظهر الهوية</strong><small>{back ? back.name : 'اختر الصورة'}</small></span><input name="back" type="file" accept="image/jpeg,image/png" required onChange={event => setBack(event.target.files?.[0] ?? null)} /></label>
      </div>
      <button className={styles.primaryButton} type="submit" disabled={busy}>{busy ? 'جارٍ الإرسال…' : 'إرسال للمراجعة'} <ArrowLeft size={16} aria-hidden="true" /></button>
    </form>}
    {error && <p className={styles.error} role="alert">{error}</p>}
  </section>;
}
