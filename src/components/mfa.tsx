'use client';

import Image from 'next/image';
import { useState } from 'react';
import { sendJson } from './forms';
import { ShieldCheck, LoaderCircle, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';

export function MfaSetup({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  const [factor, setFactor] = useState<{ id: string; qr: string } | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const isDark = theme === 'dark';

  return (
    <div
      className={
        isDark
          ? 'mt-6 rounded-2xl border border-white/10 bg-[#091122]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl'
          : 'panel mt-6'
      }
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 border border-gold/30 text-gold">
          <KeyRound size={20} />
        </span>
        <div>
          <h2 className={isDark ? 'text-lg font-black text-white' : 'font-bold'}>
            التحقق بخطوتين (2FA)
          </h2>
          <p className={isDark ? 'text-xs text-slate-400' : 'text-xs text-muted'}>
            حماية إضافية لحسابك وأرصدتك المالية
          </p>
        </div>
      </div>

      <p className={isDark ? 'mb-5 text-xs sm:text-sm leading-relaxed text-slate-300' : 'mb-5 text-sm leading-7 text-muted'}>
        اربط تطبيق المصادقة (مثل Google Authenticator أو 1Password) بحسابك. العمليات المالية الحساسة ومزايدات النخبة تتطلب جلسة موثقة برمز التحقق.
      </p>

      <button
        className={
          isDark
            ? 'btn btn-outline-gold text-xs sm:text-sm font-bold'
            : 'btn btn-outline'
        }
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError(false);
          try {
            const r = await sendJson('/api/v1/security/enroll', {});
            setFactor(r);
            setMessage(
              r.qr
                ? 'امسح رمز الاستجابة السريعة (QR) بتطبيق المصادقة، ثم أدخل الرمز المكون من 6 أرقام أدناه.'
                : 'أدخل الكود المباشر من تطبيق المصادقة المرتبط.'
            );
          } catch (e) {
            setError(true);
            setMessage(e instanceof Error ? e.message : 'تعذر إعداد المصادقة.');
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? (
          <span className="flex items-center gap-2">
            <LoaderCircle size={16} className="animate-spin" />
            <span>جارٍ الإعداد…</span>
          </span>
        ) : (
          'إعداد أو تأكيد تطبيق المصادقة'
        )}
      </button>

      {factor && (
        <form
          className="mt-6 space-y-4 rounded-xl border border-gold/20 bg-white/[0.03] p-5"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError(false);
            try {
              const code = new FormData(e.currentTarget).get('code');
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
          {factor.qr && (
            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl w-fit mx-auto border border-gold/40 shadow-lg">
              <Image
                src={`data:image/svg+xml;utf8,${encodeURIComponent(factor.qr)}`}
                alt="رمز ربط تطبيق المصادقة"
                width={180}
                height={180}
                unoptimized
              />
              <span className="mt-2 text-[11px] font-bold text-navy">امسح الكود عبر الكاميرا</span>
            </div>
          )}

          <div>
            <label
              htmlFor="code"
              className={
                isDark
                  ? 'mb-2 block text-xs font-bold uppercase tracking-wider text-slate-200'
                  : 'label'
              }
            >
              رمز التحقق (6 أرقام)
            </label>
            <input
              name="code"
              id="code"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              className={
                isDark
                  ? 'w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-center text-lg tracking-widest font-mono text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold'
                  : 'field'
              }
              autoComplete="one-time-code"
              placeholder="000000"
            />
          </div>

          <button
            className={
              isDark
                ? 'btn btn-gold w-full py-3 text-sm font-black text-navy shadow-lg shadow-gold/20'
                : 'btn btn-navy'
            }
            disabled={busy}
          >
            {busy ? 'جارٍ التحقق…' : 'تأكيد الرمز والتفعيل'}
          </button>
        </form>
      )}

      {message && (
        <div
          role={error ? 'alert' : 'status'}
          className={`mt-4 flex items-center gap-2 p-3.5 rounded-xl text-xs sm:text-sm font-semibold border ${
            isDark
              ? error
                ? 'border-red-500/30 bg-red-950/40 text-red-300'
                : 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300'
              : error
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          {error ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
