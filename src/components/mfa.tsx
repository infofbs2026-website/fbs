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

export function MfaSetup({
  onVerified,
  compact = false,
}: {
  onVerified?: () => void;
  compact?: boolean;
} = {}) {
  const [factor, setFactor] = useState<{ id: string; qr: string; secret?: string } | null>(null);
  const [verifiedDone, setVerifiedDone] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const qrSource = factor?.qr ? mfaQrImageSource(factor.qr) : '';

  async function handleQuickActivate() {
    setBusy(true);
    setError(false);
    setMessage('');
    try {
      const res = await sendJson('/api/v1/security/quick-activate', { mode: 'instant' });
      setVerifiedDone(true);
      setFactor(null);
      setMessage(res?.message || 'تم تفعيل وتأكيد التحقق بخطوتين (2FA) لحسابك بنجاح.');
      onVerified?.();
    } catch (e) {
      setError(true);
      setMessage(e instanceof Error ? e.message : 'تعذر تفعيل التحقق بخطوتين.');
    } finally {
      setBusy(false);
    }
  }

  async function handleEnrollTotp(reset = false) {
    setBusy(true);
    setError(false);
    setMessage('');
    try {
      const result = await sendJson('/api/v1/security/enroll', { reset });
      if (result?.fallback || result?.id === 'instant-2fa') {
        await handleQuickActivate();
        return;
      }
      if (!result || typeof result.id !== 'string') {
        throw new Error('تعذر بدء إعداد تطبيق المصادقة.');
      }
      setFactor(result);
      setMessage(
        result.qr
          ? 'امسح رمز QR بتطبيق المصادقة (Google Authenticator)، ثم أدخل الرمز المكون من 6 أرقام.'
          : 'تطبيق المصادقة مرتبط مسبقاً؛ أدخل الرمز المكون من 6 أرقام أو أعد توليد رمز QR جديد.',
      );
    } catch (e) {
      setError(true);
      setMessage(e instanceof Error ? e.message : 'تعذر إعداد المصادقة.');
    } finally {
      setBusy(false);
    }
  }

  if (compact) {
    return (
      <div className="space-y-3 text-right">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={handleQuickActivate}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#b89042] bg-gradient-to-b from-[#fcefd6] via-[#dfc288] to-[#c79e4f] px-4 py-2.5 text-xs font-black text-[#08162b] shadow-sm cursor-pointer disabled:opacity-50"
          >
            <KeyRound size={15} />
            <span>{busy ? 'جارٍ التفعيل…' : 'تفعيل التحقق بخطوتين فوراً لحسابي'}</span>
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={() => handleEnrollTotp(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-current/20 px-3.5 py-2.5 text-xs font-bold opacity-85 hover:opacity-100 cursor-pointer disabled:opacity-50"
          >
            <Smartphone size={15} />
            <span>ربط تطبيق مصادقة (QR Code)</span>
          </button>
        </div>

        {message && (
          <div
            role={error ? 'alert' : 'status'}
            className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-bold ${
              error
                ? 'border-rose-500/40 bg-rose-500/10 text-rose-500'
                : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600'
            }`}
          >
            {error ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            <span>{message}</span>
          </div>
        )}

        {factor && (
          <form
            className="space-y-3 rounded-2xl border border-current/15 p-3.5"
            onSubmit={async (event) => {
              event.preventDefault();
              setBusy(true);
              setError(false);
              try {
                const code = String(new FormData(event.currentTarget).get('code') ?? '').trim();
                await sendJson('/api/v1/security/verify', { factorId: factor.id, code });
                setVerifiedDone(true);
                setMessage('تم تأكيد وربط المصادقة بخطوتين بنجاح.');
                setFactor(null);
                onVerified?.();
              } catch (e) {
                setError(true);
                setMessage(e instanceof Error ? e.message : 'تعذر التحقق من الرمز المدخل.');
              } finally {
                setBusy(false);
              }
            }}
          >
            {qrSource && (
              <div className="flex flex-col items-center gap-2 rounded-xl bg-white p-3 text-[#08162b]">
                <Image src={qrSource} alt="رمز ربط تطبيق المصادقة" width={164} height={164} unoptimized />
                <span className="text-[11px] font-bold">امسح الرمز بتطبيق Google Authenticator</span>
                {factor.secret && (
                  <code dir="ltr" className="rounded bg-slate-100 px-2 py-1 text-[11px] font-mono select-all">
                    {factor.secret}
                  </code>
                )}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-bold" htmlFor="mfa-compact-code">
                رمز التحقق من التطبيق (6 أرقام)
              </label>
              <input
                name="code"
                id="mfa-compact-code"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                autoComplete="one-time-code"
                placeholder="000000"
                dir="ltr"
                className="w-full rounded-xl border border-current/25 bg-transparent px-3 py-2 text-right font-mono text-base font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl border border-[#b89042] bg-gradient-to-b from-[#fcefd6] via-[#dfc288] to-[#c79e4f] px-4 py-2.5 text-xs font-black text-[#08162b] cursor-pointer"
            >
              {busy ? 'جارٍ التحقق…' : 'تأكيد الرمز والتفعيل'}
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <section className={`${styles.panel} ${styles.securityCard}`} aria-labelledby="security-mfa-heading">
      <div className={styles.panelHeading}>
        <span className={styles.panelIcon}><KeyRound size={20} aria-hidden="true" /></span>
        <div><h2 id="security-mfa-heading">التحقق بخطوتين</h2><p>تأمين الحساب وتوثيق الدخول بطريقتين.</p></div>
      </div>

      <p className={styles.securityDescription}>
        يمكنك تفعيل التحقق بخطوتين لحسابك مباشرة أو ربطه بتطبيق المصادقة (Google Authenticator) لحماية إجراءاتك وهويتك.
      </p>
      <div className={styles.securityDetail}>
        <Smartphone size={18} aria-hidden="true" />
        <span>
          <small>حالة الحماية الثنائية</small>
          <strong>{verifiedDone ? 'مفعّلة وموثقة (2FA)' : 'التفعيل الفوري أو تطبيق المصادقة'}</strong>
        </span>
      </div>

      <div className={`${styles.securityAction} flex flex-wrap gap-2`}>
        <button
          type="button"
          className={styles.primaryButton}
          disabled={busy}
          onClick={handleQuickActivate}
        >
          {busy && !factor ? (
            <>
              <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> جارٍ التفعيل…
            </>
          ) : (
            'تفعيل التحقق بخطوتين فوراً'
          )}
        </button>

        <button
          type="button"
          className={styles.outlineButton}
          disabled={busy}
          onClick={() => handleEnrollTotp(true)}
        >
          <span>إعداد أو تأكيد تطبيق المصادقة</span>
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
              setVerifiedDone(true);
              setMessage('تم تأكيد وربط المصادقة بخطوتين بنجاح.');
              setFactor(null);
              onVerified?.();
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
              {factor.secret && (
                <small dir="ltr" className="font-mono text-xs opacity-75 select-all">
                  {factor.secret}
                </small>
              )}
            </div>
          ) : <p className={styles.mfaError} role="alert">تعذر عرض رمز QR. يمكنك استخدام زر التفعيل الفوري أعلاه.</p>)}

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
