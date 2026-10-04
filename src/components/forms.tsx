'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  LoaderCircle,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  User,
  ShieldCheck
} from 'lucide-react';

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

export async function sendJson(path: string, body: unknown, method = 'POST') {
  const response = await fetch(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const result = await response.json();
  if (!response.ok) {
    throw new ApiError(result.error?.message ?? 'تعذر إكمال الطلب.', response.status);
  }
  return result.data;
}

export function AuthForm({
  mode
}: {
  mode: 'login' | 'register' | 'forgot-password' | 'reset-password' | 'verify';
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const titles = {
    login: 'تسجيل الدخول إلى حسابك',
    register: 'إنشاء حساب عضوية جديد',
    'forgot-password': 'إرسال رابط الاستعادة',
    'reset-password': 'حفظ كلمة المرور الجديدة',
    verify: 'إعادة إرسال رمز التفعيل'
  };

  const ctaSubtitles = {
    login: 'أدخل بياناتك المعتمدة للمتابعة',
    register: 'سجّل الآن لتتمكن من المزايدة وحفظ اللوحات',
    'forgot-password': 'سنرسل لك رابطًا آمنًا لتعيين كلمة مرور جديدة',
    'reset-password': 'اختر كلمة مرور قوية لا تقل عن 12 حرفًا',
    verify: 'أدخل بريدك الإلكتروني لإعادة إرسال رابط التوثيق'
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        setBusy(true);
        setMessage('');
        setError(false);
        try {
          const result = await sendJson(`/api/v1/auth/${mode}`, data);
          if (result?.redirect) {
            router.push(result.redirect);
            router.refresh();
          } else {
            setMessage(result?.message || 'تمت العملية بنجاح.');
          }
        } catch (err) {
          setError(true);
          setMessage(err instanceof Error ? err.message : 'تعذر إكمال الطلب. حاول مجددًا.');
        } finally {
          setBusy(false);
        }
      }}
      className="space-y-5"
    >
      {/* Mode Description */}
      <div className="border-b border-line pb-4">
        <h2 className="text-xl font-bold text-navy sm:text-2xl">{titles[mode]}</h2>
        <p className="mt-1 text-xs text-muted leading-relaxed">{ctaSubtitles[mode]}</p>
      </div>

      {/* Register: Display Name */}
      {mode === 'register' && (
        <div>
          <label htmlFor="displayName" className="label flex items-center gap-1.5">
            <User size={14} className="text-gold-accent" />
            <span>الاسم الكامل (كما في الهوية الرسمية)</span>
          </label>
          <input
            id="displayName"
            name="displayName"
            autoComplete="name"
            required
            minLength={2}
            maxLength={120}
            placeholder="مثال: فهد عبد الله السعيد"
            className="field text-sm"
          />
        </div>
      )}

      {/* Email input for all modes except reset-password */}
      {mode !== 'reset-password' && (
        <div>
          <label htmlFor="email" className="label flex items-center gap-1.5">
            <Mail size={14} className="text-gold-accent" />
            <span>البريد الإلكتروني</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            dir="ltr"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="name@example.com"
            className="field text-sm"
          />
        </div>
      )}

      {/* Password input for login, register, reset-password */}
      {['login', 'register', 'reset-password'].includes(mode) && (
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="label flex items-center gap-1.5">
              <Lock size={14} className="text-gold-accent" />
              <span>كلمة المرور</span>
            </label>
            {mode === 'login' && (
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-gold-accent hover:underline"
              >
                نسيت كلمة المرور؟
              </Link>
            )}
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              dir="ltr"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              minLength={mode === 'login' ? 1 : 12}
              maxLength={128}
              required
              placeholder="••••••••••••"
              className="field pe-11 text-sm tracking-wider"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              className="absolute end-3 top-3 text-muted hover:text-navy transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {mode !== 'login' && (
            <p className="mt-1.5 text-[11px] text-muted">
              يجب أن تحتوي كلمة المرور على 12 حرفًا على الأقل لضمان أمان حسابك.
            </p>
          )}
        </div>
      )}

      {/* Register Terms Consent */}
      {mode === 'register' && (
        <label className="flex items-start gap-3 rounded-xl border border-line bg-paper/60 p-3 text-xs leading-5 cursor-pointer">
          <input
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-gold-accent focus:ring-gold"
          />
          <span className="text-slate-600">
            أقر بأنني اطلعت وأوافق على{' '}
            <Link href="/terms" className="font-bold text-navy hover:underline">
              الشروط والأحكام
            </Link>{' '}
            و
            <Link href="/privacy" className="font-bold text-navy hover:underline">
              سياسة الخصوصية
            </Link>{' '}
            الخاصة بمنصة فارس بن سعود.
          </span>
        </label>
      )}

      {/* Error & Success Messages */}
      {message && (
        <div
          role={error ? 'alert' : 'status'}
          className={`flex items-start gap-2.5 rounded-xl border p-4 text-xs sm:text-sm leading-relaxed ${
            error
              ? 'border-red-200 bg-red-50 text-red-800'
              : 'border-emerald-200 bg-emerald-50 text-emerald-800'
          }`}
        >
          {error ? (
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
          ) : (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
          )}
          <span>{message}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        disabled={busy}
        className="btn btn-navy w-full py-3.5 text-sm font-bold shadow-md hover:shadow-lg transition-all"
      >
        {busy ? (
          <span className="flex items-center justify-center gap-2">
            <LoaderCircle size={18} className="animate-spin" />
            <span>جارٍ المعالجة…</span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span>{titles[mode]}</span>
            <ArrowLeft size={16} />
          </span>
        )}
      </button>

      {/* Secondary Bottom Links */}
      <div className="pt-2 text-center text-xs text-muted">
        {mode === 'login' ? (
          <p>
            ليس لديك حساب بعد؟{' '}
            <Link href="/register" className="font-bold text-navy hover:text-gold-accent hover:underline">
              إنشاء حساب جديد
            </Link>
          </p>
        ) : mode === 'register' ? (
          <p>
            لديك حساب مسجل بالفعل؟{' '}
            <Link href="/login" className="font-bold text-navy hover:text-gold-accent hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        ) : (
          <Link
            href="/login"
            className="inline-flex items-center gap-1 font-bold text-navy hover:text-gold-accent hover:underline"
          >
            <span>العودة لصفحة تسجيل الدخول</span>
          </Link>
        )}
      </div>
    </form>
  );
}

export function ActionButton({
  endpoint,
  body,
  label,
  method = 'POST',
  confirm = false
}: {
  endpoint: string;
  body?: unknown;
  label: string;
  method?: string;
  confirm?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  return (
    <div>
      <button
        className="btn btn-navy"
        disabled={busy}
        onClick={async () => {
          if (confirm && !window.confirm('هل تؤكد تنفيذ هذا الإجراء؟')) return;
          setBusy(true);
          try {
            const result = await sendJson(endpoint, body ?? {}, method);
            setMessage(result?.message ?? 'تم تنفيذ الطلب بنجاح.');
            router.refresh();
          } catch (e) {
            setMessage(e instanceof Error ? e.message : 'تعذر التنفيذ.');
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? 'جارٍ التنفيذ…' : label}
      </button>
      {message && (
        <p role="status" className="mt-3 text-sm leading-7">
          {message}
        </p>
      )}
    </div>
  );
}
