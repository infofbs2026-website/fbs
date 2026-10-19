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
  ShieldCheck,
  KeyRound,
  RotateCcw
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

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
  isAcceptable: boolean;
} {
  if (!password) {
    return { score: 0, label: 'أدخل كلمة المرور', color: 'bg-white/10', isAcceptable: false };
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 10 && /[0-9]/.test(password)) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password) || (password.length >= 12 && /[0-9]/.test(password))) score++;

  if (score <= 1) {
    return { score: 1, label: 'ضعيفة', color: 'bg-rose-500', isAcceptable: false };
  } else if (score === 2) {
    return { score: 2, label: 'متوسطة', color: 'bg-amber-500', isAcceptable: false };
  } else if (score === 3) {
    return { score: 3, label: 'قوية', color: 'bg-emerald-500', isAcceptable: true };
  } else {
    return { score: 4, label: 'استثنائية', color: 'bg-gradient-to-r from-emerald-400 to-[#d9b87f]', isAcceptable: true };
  }
}

export function AuthForm({
  mode,
  theme = 'light'
}: {
  mode: 'login' | 'register' | 'forgot-password' | 'reset-password' | 'verify';
  theme?: 'light' | 'dark';
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // OTP & 2-Step states
  const [step, setStep] = useState<'form' | 'otp' | 'reset-password-otp'>('form');
  const [otpEmail, setOtpEmail] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const router = useRouter();

  const isLight = theme === 'light';
  const isRegisterOrReset = (mode === 'register' || mode === 'reset-password') && step === 'form';
  const strength = getPasswordStrength(password);
  const passwordsMatch = !confirmPassword || confirmPassword === password;

  const titles = {
    login: 'تسجيل الدخول إلى حسابك',
    register: 'إنشاء حساب عضوية جديد',
    'forgot-password': 'استعادة كلمة المرور',
    'reset-password': 'تعيين كلمة المرور الجديدة',
    verify: 'إعادة إرسال رمز التفعيل'
  };

  const ctaSubtitles = {
    login: 'أدخل بياناتك المعتمدة للمتابعة الفورية',
    register: 'سجّل الآن لتتمكن من المزايدة وحفظ اللوحات',
    'forgot-password': 'أدخل بريدك الإلكتروني لاستلام رمز التحقق الفوري',
    'reset-password': 'اختر كلمة مرور قوية لا تقل عن 8 أحرف',
    verify: 'أدخل بريدك الإلكتروني لإعادة إرسال رمز التحقق'
  };

  const handleResendOtp = async (type: 'signup' | 'recovery') => {
    if (!otpEmail) return;
    setBusy(true);
    try {
      const res = await sendJson('/api/v1/auth/resend-otp', { email: otpEmail, type });
      if (res?.devOtp) setDevOtp(res.devOtp);
      setMessage(res?.message || 'تمت إعادة إرسال رمز التحقق بنجاح.');
      setError(false);
    } catch (err) {
      setError(true);
      setMessage(err instanceof Error ? err.message : 'تعذر إعادة إرسال الرمز.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      style={{ colorScheme: 'dark' }}
      onSubmit={async (e) => {
        e.preventDefault();
        setMessage('');
        setError(false);

        // Step 1: Handling OTP verification for Registration
        if (step === 'otp') {
          if (!otpToken) {
            setError(true);
            setMessage('يرجى إدخال رمز التحقق.');
            return;
          }
          setBusy(true);
          try {
            const result = await sendJson('/api/v1/auth/verify-otp', {
              email: otpEmail,
              token: otpToken,
              type: 'signup'
            });
            if (result?.redirect) {
              router.push(result.redirect);
              router.refresh();
            } else {
              setMessage(result?.message || 'تم تفعيل الحساب بنجاح.');
            }
          } catch (err) {
            setError(true);
            setMessage(err instanceof Error ? err.message : 'رمز التحقق غير صحيح أو منتهي الصلاحية.');
          } finally {
            setBusy(false);
          }
          return;
        }

        // Step 2: Handling OTP reset password
        if (step === 'reset-password-otp') {
          if (!otpToken) {
            setError(true);
            setMessage('يرجى إدخال رمز التحقق.');
            return;
          }
          if (password.length < 8) {
            setError(true);
            setMessage('يجب ألا تقل كلمة المرور عن 8 أحرف.');
            return;
          }
          if (password !== confirmPassword) {
            setError(true);
            setMessage('كلمتا المرور غير متطابقتين، يرجى التأكد من التطابق.');
            return;
          }
          setBusy(true);
          try {
            const result = await sendJson('/api/v1/auth/reset-password-otp', {
              email: otpEmail,
              token: otpToken,
              password
            });
            if (result?.redirect) {
              router.push(result.redirect);
              router.refresh();
            } else {
              setMessage(result?.message || 'تم تعيين كلمة المرور الجديدة بنجاح.');
            }
          } catch (err) {
            setError(true);
            setMessage(err instanceof Error ? err.message : 'تعذر إعادة تعيين كلمة المرور.');
          } finally {
            setBusy(false);
          }
          return;
        }

        // Step 3: Handling initial form submission
        if (isRegisterOrReset) {
          if (password.length < 8) {
            setError(true);
            setMessage('يجب ألا تقل كلمة المرور عن 8 أحرف.');
            return;
          }
          if (password !== confirmPassword) {
            setError(true);
            setMessage('كلمتا المرور غير متطابقتين، يرجى التأكد من التطابق.');
            return;
          }
        }

        const formData = new FormData(e.currentTarget);
        formData.delete('confirmPassword');
        const data = Object.fromEntries(formData);

        setBusy(true);
        try {
          const result = await sendJson(`/api/v1/auth/${mode}`, data);

          if (mode === 'register' && result?.step === 'otp') {
            setStep('otp');
            setOtpEmail(String(data.email || ''));
            setDevOtp(result.devOtp ?? null);
            setMessage(result.message || 'تم إرسال رمز التحقق (OTP) إلى بريدك الإلكتروني.');
            setError(false);
            return;
          }

          if (mode === 'forgot-password' && result?.step === 'reset') {
            setStep('reset-password-otp');
            setOtpEmail(String(data.email || ''));
            setDevOtp(result.devOtp ?? null);
            setMessage(result.message || 'تم إرسال رمز التحقق إلى بريدك الإلكتروني.');
            setError(false);
            return;
          }

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
      className={`flex-1 flex flex-col ${
        mode === 'register' && step === 'form'
          ? 'justify-between space-y-3 sm:space-y-3.5'
          : 'justify-center space-y-4 my-auto'
      }`}
    >
      <div className="space-y-3 sm:space-y-3.5">
        {/* OTP Step View (for Register verification) */}
        {step === 'otp' && (
          <div className="space-y-3.5">
            <div className="border-b border-white/10 pb-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/20 text-gold border border-gold/40">
                  <ShieldCheck size={16} />
                </div>
                <h2 className="text-base font-black text-white sm:text-lg">
                  تفعيل الحساب برمز التحقق (OTP)
                </h2>
              </div>
              <p className="text-xs font-medium text-slate-300">
                أدخل الرمز المرسل إلى: <span className="text-gold font-mono font-bold" dir="ltr">{otpEmail}</span>
              </p>
            </div>

            {devOtp && (
              <button
                type="button"
                onClick={() => setOtpToken(devOtp)}
                className="w-full p-2.5 rounded-xl bg-gold/10 border border-gold/40 text-gold text-xs text-center cursor-pointer hover:bg-gold/20 active:scale-[0.99] transition-all"
              >
                💡 وضع التجربة السريع: الرمز هو <strong className="font-mono text-sm tracking-widest">{devOtp}</strong> (انقر للملء التلقائي)
              </button>
            )}

            <div>
              <label htmlFor="otpToken" className="mb-1 block text-right text-xs font-bold text-slate-200">
                رمز التحقق (OTP)
              </label>
              <input
                id="otpToken"
                name="otpToken"
                type="text"
                dir="ltr"
                value={otpToken}
                onChange={(e) => setOtpToken(e.target.value.trim())}
                required
                maxLength={12}
                autoFocus
                placeholder="● ● ● ● ● ●"
                className="w-full text-center rounded-xl border border-gold/50 bg-black/45 backdrop-blur-md py-3 text-2xl font-mono font-black tracking-[0.25em] text-[#e8c888] placeholder:text-slate-600 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-all shadow-inner"
              />
            </div>
          </div>
        )}

        {/* OTP Step View (for Forgot Password reset) */}
        {step === 'reset-password-otp' && (
          <div className="space-y-3 sm:space-y-3.5">
            <div className="border-b border-white/10 pb-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/20 text-gold border border-gold/40">
                  <KeyRound size={16} />
                </div>
                <h2 className="text-base font-black text-white sm:text-lg">
                  تعيين كلمة المرور الجديدة
                </h2>
              </div>
              <p className="text-xs font-medium text-slate-300">
                أدخل رمز التحقق المرسل إلى: <span className="text-gold font-mono font-bold" dir="ltr">{otpEmail}</span>
              </p>
            </div>

            {devOtp && (
              <button
                type="button"
                onClick={() => setOtpToken(devOtp)}
                className="w-full p-2.5 rounded-xl bg-gold/10 border border-gold/40 text-gold text-xs text-center cursor-pointer hover:bg-gold/20 active:scale-[0.99] transition-all"
              >
                💡 وضع التجربة السريع: الرمز هو <strong className="font-mono text-sm tracking-widest">{devOtp}</strong> (انقر للملء)
              </button>
            )}

            <div>
              <label htmlFor="resetOtpToken" className="mb-1 block text-right text-xs font-bold text-slate-200">
                رمز التحقق (OTP)
              </label>
              <input
                id="resetOtpToken"
                name="resetOtpToken"
                type="text"
                dir="ltr"
                value={otpToken}
                onChange={(e) => setOtpToken(e.target.value.trim())}
                required
                maxLength={12}
                autoFocus
                placeholder="123456"
                className="w-full text-center rounded-xl border border-gold/50 bg-black/45 backdrop-blur-md py-2 text-xl font-mono font-black tracking-widest text-[#e8c888] placeholder:text-slate-600 focus:border-gold focus:outline-none transition-all shadow-inner"
              />
            </div>

            <div>
              <label htmlFor="resetPassword" className="mb-1 block text-right text-xs font-bold text-slate-200">
                كلمة المرور الجديدة
              </label>
              <div className="relative flex items-center">
                <input
                  id="resetPassword"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  dir="rtl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  maxLength={128}
                  required
                  placeholder="8 أحرف على الأقل"
                  className="w-full rounded-xl border border-white/20 bg-black/35 backdrop-blur-md py-2.5 sm:py-3 pr-10 pl-10 text-xs sm:text-sm text-white placeholder:text-slate-400 text-right focus:border-gold/80 focus:bg-black/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all shadow-inner tracking-wider"
                />
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center text-slate-300">
                  <Lock size={16} />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-gold transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="resetConfirmPassword" className="mb-1 block text-right text-xs font-bold text-slate-200">
                تأكيد كلمة المرور الجديدة
              </label>
              <div className="relative flex items-center">
                <input
                  id="resetConfirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  dir="rtl"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  maxLength={128}
                  placeholder="أعد إدخال كلمة المرور"
                  className={`w-full rounded-xl border bg-black/35 backdrop-blur-md py-2.5 sm:py-3 pr-10 pl-10 text-xs sm:text-sm text-white placeholder:text-slate-400 text-right focus:outline-none focus:ring-1 transition-all shadow-inner tracking-wider ${
                    confirmPassword && !passwordsMatch
                      ? 'border-rose-500/70 focus:border-rose-500 focus:ring-rose-500'
                      : 'border-white/20 focus:border-gold/80 focus:bg-black/50 focus:ring-gold/50'
                  }`}
                />
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center text-slate-300">
                  <Lock size={16} />
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-gold transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Regular Form Fields (step === 'form') */}
        {step === 'form' && (
          <>
            {/* Mode Header (shown only for recovery / non-tab modes) */}
            {mode !== 'login' && mode !== 'register' && (
              <div className="border-b border-white/10 pb-2">
                <h2 className="text-base font-black text-white sm:text-lg">
                  {titles[mode]}
                </h2>
                <p className="mt-0.5 text-xs font-medium text-slate-300">
                  {ctaSubtitles[mode]}
                </p>
              </div>
            )}

        {/* Register: Full Name */}
        {mode === 'register' && (
          <div>
            <label
              htmlFor="displayName"
              className="mb-1 block text-right text-xs font-bold text-slate-200"
            >
              الاسم الكامل
            </label>
            <div className="relative flex items-center">
              <input
                id="displayName"
                name="displayName"
                type="text"
                dir="rtl"
                autoComplete="name"
                required
                minLength={2}
                maxLength={120}
                placeholder="مثال: محمد عبدالله"
                style={{ colorScheme: 'dark' }}
                className="w-full rounded-xl border border-white/20 bg-black/35 backdrop-blur-md py-2.5 sm:py-3 pr-10 pl-3.5 text-xs sm:text-sm text-white placeholder:text-slate-400 text-right focus:border-gold/80 focus:bg-black/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all shadow-inner"
              />
              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center text-slate-300">
                <User size={16} />
              </div>
            </div>
          </div>
        )}

        {/* Email Input */}
        {mode !== 'reset-password' && (
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-right text-xs font-bold text-slate-200"
            >
              البريد الإلكتروني
            </label>
            <div className="relative flex items-center">
              <input
                id="email"
                name="email"
                type="email"
                dir="rtl"
                autoComplete={mode === 'login' ? 'username' : 'email'}
                required
                maxLength={254}
                placeholder="name@example.com"
                style={{ colorScheme: 'dark' }}
                className="w-full rounded-xl border border-white/20 bg-black/35 backdrop-blur-md py-2.5 sm:py-3 pr-10 pl-3.5 text-xs sm:text-sm text-white placeholder:text-slate-400 text-right focus:border-gold/80 focus:bg-black/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all shadow-inner"
              />
              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center text-slate-300">
                <Mail size={16} />
              </div>
            </div>
          </div>
        )}

      {/* Password Input */}
      {['login', 'register', 'reset-password'].includes(mode) && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="password"
              className="text-right text-xs font-bold text-slate-200"
            >
              كلمة المرور
            </label>
            {mode === 'login' && (
              <Link
                href="/forgot-password"
                className="text-[11px] font-semibold text-gold hover:text-gold-light hover:underline transition-colors"
              >
                نسيت كلمة المرور؟
              </Link>
            )}
          </div>
          <div className="relative flex items-center">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              dir="rtl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              minLength={mode === 'login' ? 1 : 8}
              maxLength={128}
              required
              placeholder={mode === 'register' ? '8 أحرف على الأقل مع رموز قوية' : 'أدخل كلمة المرور'}
              style={{ colorScheme: 'dark' }}
              className="w-full rounded-xl border border-white/20 bg-black/35 backdrop-blur-md py-2.5 sm:py-3 pr-10 pl-10 text-xs sm:text-sm text-white placeholder:text-slate-400 text-right focus:border-gold/80 focus:bg-black/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all shadow-inner tracking-wider"
            />
            {/* Lock icon on the right */}
            <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center text-slate-300">
              <Lock size={16} />
            </div>
            {/* Eye toggle on the left */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-gold transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      )}

      {/* Confirm Password Input (Register & Reset Password) */}
      {isRegisterOrReset && (
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1 block text-right text-xs font-bold text-slate-200"
          >
            تأكيد كلمة المرور
          </label>
          <div className="relative flex items-center">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              dir="rtl"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              maxLength={128}
              placeholder="أعد إدخال كلمة المرور"
              style={{ colorScheme: 'dark' }}
              className={`w-full rounded-xl border bg-black/35 backdrop-blur-md py-2.5 sm:py-3 pr-10 pl-10 text-xs sm:text-sm text-white placeholder:text-slate-400 text-right focus:outline-none focus:ring-1 transition-all shadow-inner tracking-wider ${
                confirmPassword && !passwordsMatch
                  ? 'border-rose-500/70 focus:border-rose-500 focus:ring-rose-500'
                  : 'border-white/20 focus:border-gold/80 focus:bg-black/50 focus:ring-gold/50'
              }`}
            />
            {/* Lock icon on the right */}
            <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center text-slate-300">
              <Lock size={16} />
            </div>
            {/* Eye toggle on the left */}
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-gold transition-colors cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      )}

      {/* Register Terms Consent Checkbox */}
      {mode === 'register' && (
        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none pt-0.5">
          <input
            type="checkbox"
            required
            className="h-4 w-4 rounded border-white/20 bg-black/40 text-gold accent-[#d9b87f] focus:ring-gold/50 shrink-0 cursor-pointer"
          />
          <span className="text-[11px] leading-tight text-slate-300">
            أوافق على{' '}
            <Link href="/terms" className="text-white hover:text-gold font-bold underline decoration-white/30">
              الشروط والأحكام
            </Link>{' '}
            و
            <Link href="/privacy" className="text-white hover:text-gold font-bold underline decoration-white/30">
              سياسة الخصوصية
            </Link>{' '}
            لمنصة FBS
          </span>
        </label>
      )}

      {/* Login Remember Me Checkbox */}
      {mode === 'login' && (
        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none pt-0.5">
          <input
            type="checkbox"
            name="remember"
            defaultChecked
            className="h-4 w-4 rounded border-white/20 bg-black/40 text-gold accent-[#d9b87f] focus:ring-gold/50 shrink-0 cursor-pointer"
          />
          <span className="text-[11px] text-slate-300">
            تذكرني على هذا الجهاز
          </span>
        </label>
      )}
      </>
      )}

      {/* Error & Success Messages */}
      {message && (
        <div
          role={error ? 'alert' : 'status'}
          className={`flex items-start gap-2 rounded-xl border p-2.5 text-xs leading-relaxed backdrop-blur-md ${
            error
              ? 'border-rose-500/30 bg-rose-950/70 text-rose-200'
              : 'border-emerald-500/30 bg-emerald-950/70 text-emerald-200'
          }`}
        >
          {error ? (
            <AlertCircle size={15} className="mt-0.5 shrink-0 text-rose-400" />
          ) : (
            <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
          )}
          <span>{message}</span>
        </div>
      )}
      </div>

      {/* Action Footer (Submit Button + Links) */}
      <div className="space-y-2 pt-2">
        {step === 'otp' ? (
          <>
            <button
              type="submit"
              disabled={busy || !otpToken}
              className="w-full rounded-xl bg-gradient-to-r from-[#e8c888] via-[#d9b87f] to-[#b88c3a] py-2.5 sm:py-3 text-xs sm:text-sm font-black text-[#070e1e] shadow-lg shadow-gold/25 hover:shadow-gold/35 hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {busy ? (
                <span className="flex items-center justify-center gap-2">
                  <LoaderCircle size={16} className="animate-spin text-[#070e1e]" />
                  <span>جارٍ التحقق والتفعيل…</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>تأكيد وتفعيل الحساب</span>
                  <ArrowLeft size={16} />
                </span>
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-1 px-1">
              <button
                type="button"
                onClick={() => handleResendOtp('signup')}
                disabled={busy}
                className="text-gold font-bold hover:underline transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50"
              >
                <RotateCcw size={12} />
                <span>إعادة إرسال الرمز</span>
              </button>
              <button
                type="button"
                onClick={() => { setStep('form'); setMessage(''); setError(false); }}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                تعديل البيانات
              </button>
            </div>
          </>
        ) : step === 'reset-password-otp' ? (
          <>
            <button
              type="submit"
              disabled={busy || !otpToken || password.length < 8 || !passwordsMatch}
              className="w-full rounded-xl bg-gradient-to-r from-[#e8c888] via-[#d9b87f] to-[#b88c3a] py-2.5 sm:py-3 text-xs sm:text-sm font-black text-[#070e1e] shadow-lg shadow-gold/25 hover:shadow-gold/35 hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {busy ? (
                <span className="flex items-center justify-center gap-2">
                  <LoaderCircle size={16} className="animate-spin text-[#070e1e]" />
                  <span>جارٍ تعيين كلمة المرور…</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>تعيين كلمة المرور والدخول</span>
                  <ArrowLeft size={16} />
                </span>
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-1 px-1">
              <button
                type="button"
                onClick={() => handleResendOtp('recovery')}
                disabled={busy}
                className="text-gold font-bold hover:underline transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50"
              >
                <RotateCcw size={12} />
                <span>إعادة إرسال الرمز</span>
              </button>
              <button
                type="button"
                onClick={() => { setStep('form'); setMessage(''); setError(false); }}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                تغيير البريد الإلكتروني
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              type="submit"
              disabled={busy || (isRegisterOrReset && (password.length < 8 || !passwordsMatch))}
              className="w-full rounded-xl bg-gradient-to-r from-[#e8c888] via-[#d9b87f] to-[#b88c3a] py-2.5 sm:py-3 text-xs sm:text-sm font-black text-[#070e1e] shadow-lg shadow-gold/25 hover:shadow-gold/35 hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {busy ? (
                <span className="flex items-center justify-center gap-2">
                  <LoaderCircle size={16} className="animate-spin text-[#070e1e]" />
                  <span>جارٍ المعالجة…</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>
                    {mode === 'register'
                      ? 'إنشاء حساب جديد'
                      : mode === 'login'
                      ? 'تسجيل الدخول'
                      : mode === 'forgot-password'
                      ? 'إرسال رمز الاستعادة (OTP)'
                      : titles[mode]}
                  </span>
                  <ArrowLeft size={16} />
                </span>
              )}
            </button>

            {/* Bottom Switcher Links */}
            <div className="pt-0.5 text-center text-xs font-medium text-slate-300">
              {mode === 'login' ? (
                <p>
                  ليس لديك حساب بعد؟{' '}
                  <Link
                    href="/register"
                    className="text-gold font-bold hover:underline transition-colors"
                  >
                    إنشاء حساب جديد
                  </Link>
                </p>
              ) : mode === 'register' ? (
                <p>
                  لديك حساب بالفعل؟{' '}
                  <Link
                    href="/login"
                    className="text-gold font-bold hover:underline transition-colors"
                  >
                    تسجيل الدخول
                  </Link>
                </p>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 font-bold text-gold hover:underline transition-colors"
                >
                  <span>العودة لصفحة تسجيل الدخول</span>
                </Link>
              )}
            </div>
          </>
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
  confirm = false,
  className
}: {
  endpoint: string;
  body?: unknown;
  label: string;
  method?: string;
  confirm?: boolean;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  return (
    <div>
      <button
        className={className ?? "btn btn-navy"}
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
