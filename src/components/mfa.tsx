'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AlertCircle, CheckCircle2, KeyRound, LoaderCircle, Smartphone } from 'lucide-react';
import { sendJson } from './forms';
import styles from './account-dashboard.module.css';

/** Accept both the SDK's SVG data URL and a raw SVG without encoding either twice. */
export function mfaQrImageSource(qr: string): string {
  let svg = qr.trim();
  if (svg.toLowerCase().startsWith('data:image/svg+xml')) {
    const comma = svg.indexOf(',');
    if (comma < 0) return '';
    const header = svg.slice(0, comma);
    const data = svg.slice(comma + 1);
    if (/;base64$/i.test(header)) {
      return /^[a-z0-9+/]+={0,2}$/i.test(data) ? `data:image/svg+xml;base64,${data}` : '';
    }
    try {
      svg = decodeURIComponent(data).trim();
    } catch {
      svg = data.trim();
    }
  }
  if (!/^(?:<\?xml[^>]*\?>\s*)?<svg(?:\s|>)/i.test(svg)) return '';
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function MfaSetup() {
  const [factor, setFactor] = useState<{ id: string; qr: string } | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const qrSource = factor?.qr ? mfaQrImageSource(factor.qr) : '';

  return (
    <section className={`${styles.panel} ${styles.securityCard}`} aria-labelledby="security-mfa-heading">
      <div className={styles.panelHeading}>
        <span className={styles.panelIcon}><KeyRound size={20} aria-hidden="true" /></span>
        <div><h2 id="security-mfa-heading">التحقق بخطوتين</h2><p>إعداد تطبيق المصادقة.</p></div>
      </div>

      <p className={styles.securityDescription}>اربط تطبيق مصادقة بحسابك لإعداد رمز تحقق إضافي أو تأكيده.</p>
      <div className={styles.securityDetail}>
        <Smartphone size={18} aria-hidden="true" />
        <span><small>طريقة التحقق</small><strong>تطبيق مصادقة</strong></span>
      </div>

      <div className={styles.securityAction}>
        <button
          type="button"
          className={styles.outlineButton}
          disabled={busy || Boolean(factor)}
          onClick={async () => {
            setBusy(true);
            setError(false);
            setMessage('');
            try {
              const result = await sendJson('/api/v1/security/enroll', {});
              if (!result || typeof result.id !== 'string' || typeof result.qr !== 'string' || (result.qr && !mfaQrImageSource(result.qr))) {
                throw new Error('تعذر عرض إعداد تطبيق المصادقة. حاول مرة أخرى.');
              }
              setFactor(result);
              setMessage(result.qr
                ? 'امسح رمز QR بتطبيق المصادقة، ثم أدخل الرمز المكون من 6 أرقام.'
                : 'أدخل الرمز من تطبيق المصادقة المرتبط.');
            } catch (e) {
              setError(true);
              setMessage(e instanceof Error ? e.message : 'تعذر إعداد المصادقة.');
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy && !factor ? <><LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> جارٍ الإعداد…</> : 'إعداد أو تأكيد تطبيق المصادقة'}
        </button>
      </div>

      {message && (
        <div role={error ? 'alert' : 'status'} className={`${styles.mfaMessage} ${error ? styles.mfaError : styles.mfaSuccess}`}>
          {error ? <AlertCircle size={16} aria-hidden="true" /> : <CheckCircle2 size={16} aria-hidden="true" />}
          <span>{message}</span>
        </div>
      )}

      {factor && (
        <form
          className={styles.mfaForm}
          onSubmit={async (event) => {
            event.preventDefault();
            setBusy(true);
            setError(false);
            try {
              const code = new FormData(event.currentTarget).get('code');
              await sendJson('/api/v1/security/verify', { factorId: factor.id, code });
              setMessage('تم تأكيد وربط المصادقة بخطوتين بنجاح.');
              setFactor(null);
            } catch (e) {
              setError(true);
              setMessage(e instanceof Error ? e.message : 'تعذر التحقق من الرمز المدخل.');
            } finally {
              setBusy(false);
            }
          }}
        >
          {factor.qr && (qrSource ? (
            <div className={styles.mfaQr}>
              <Image src={qrSource} alt="رمز ربط تطبيق المصادقة" width={180} height={180} unoptimized />
              <span>امسح الرمز بتطبيق المصادقة</span>
            </div>
          ) : <p className={styles.mfaError} role="alert">تعذر عرض رمز QR. حاول إعداد تطبيق المصادقة مجددًا.</p>)}

          <label className={styles.mfaField} htmlFor="mfa-code">
            <span>رمز التحقق (6 أرقام)</span>
            <input name="code" id="mfa-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required autoComplete="one-time-code" placeholder="000000" dir="ltr" />
          </label>
          <button className={styles.primaryButton} type="submit" disabled={busy}>
            {busy ? 'جارٍ التحقق…' : 'تأكيد الرمز والتفعيل'}
          </button>
        </form>
      )}
    </section>
  );
}
