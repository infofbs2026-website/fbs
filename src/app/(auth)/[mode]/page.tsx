import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AuthForm } from '@/components/forms';
import { ContentPage, contentTitles } from '@/components/content-page';
import { Brand } from '@/components/shell';
import {
  Gavel,
  ShieldCheck,
  TrendingUp,
  Lock,
  Crown,
  ArrowLeft
} from 'lucide-react';

export const metadata: Metadata = {
  robots: { index: false, follow: false }
};

const modes = {
  login: 'تسجيل الدخول',
  register: 'إنشاء حساب جديد',
  'forgot-password': 'استعادة كلمة المرور',
  'reset-password': 'كلمة مرور جديدة',
  verify: 'تفعيل الحساب'
} as const;

export default async function AuthPage({
  params
}: {
  params: Promise<{ mode: string }>;
}) {
  const { mode } = await params;

  // Handle content / CMS pages routed through this segment
  if (mode in contentTitles) {
    return <ContentPage slug={mode} />;
  }

  // Validate auth mode
  if (!(mode in modes)) {
    notFound();
  }

  const safeMode = mode as keyof typeof modes;

  return (
    <div
      className="relative h-screen max-h-screen w-full bg-[#050b17] text-white flex flex-col justify-between overflow-hidden selection:bg-gold/30 selection:text-white"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(5, 10, 22, 0.4) 0%, rgba(5, 10, 22, 0.18) 50%, rgba(5, 10, 22, 0.55) 100%), url('/images/auth-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Seamless Floating Header (Integrated into Page, No Separate Black Bar) */}
      <header className="relative z-20 w-full py-4 px-4 sm:px-6 shrink-0 flex items-center">
        <div className="container-fbs flex items-center justify-between w-full">
          <Brand />

          {/* Discreet Return to Home Link */}
          <Link
            href="/"
            className="group inline-flex h-8 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 text-xs font-bold text-slate-200 backdrop-blur-md transition-all duration-200 hover:border-gold/50 hover:bg-gold/15 hover:text-gold active:scale-[0.98]"
          >
            <span>العودة للرئيسية</span>
            <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-1 text-gold" />
          </Link>
        </div>
      </header>

      {/* Main Interactive Auth Stage (100% VH Fit with Zero Scroll) */}
      <main className="relative z-10 flex-1 min-h-0 flex items-center justify-center p-3 sm:p-5 overflow-hidden">
        <div className="container-fbs w-full max-h-full flex items-center justify-center">
          <div className="grid items-stretch gap-8 xl:gap-14 lg:grid-cols-12 w-full max-w-5xl">
            {/* VIP Showcase Column (On the Right in RTL - Perfectly Compact Without Voids) */}
            <div className="hidden lg:col-span-6 lg:flex flex-col justify-center space-y-4 xl:space-y-4.5 pe-2 h-full">
              {/* Crown Emblem + Exactly 2-Line Bold Title + Subtitle */}
              <div className="space-y-2">
                {/* Crown Emblem - Centered */}
                <div className="flex justify-center items-center">
                  <Crown size={46} className="text-[#d9b87f] drop-shadow-[0_4px_22px_rgba(217,184,127,0.75)] stroke-[1.8]" />
                </div>

                {/* Title - Centered, Exactly 2 lines (Line 2 slightly smaller than Line 1) */}
                <div className="text-center">
                  <h1 className="font-black text-white tracking-tight flex flex-col items-center">
                    <span className="text-2xl sm:text-3xl xl:text-4xl 2xl:text-[38px] font-black leading-tight whitespace-nowrap block drop-shadow-md">
                      بوابتك الرسمية لأندر
                    </span>
                    <span className="text-xl sm:text-2xl xl:text-3xl 2xl:text-[30px] font-black leading-tight whitespace-nowrap block mt-1.5 bg-gradient-to-r from-[#faebd0] via-[#d9b87f] to-[#be903e] bg-clip-text text-transparent drop-shadow-md">
                      مزادات اللوحات في المملكة
                    </span>
                  </h1>
                </div>

                {/* Subtitle - Aligned to the Right */}
                <p className="text-right text-xs xl:text-sm leading-relaxed text-slate-200 font-medium max-w-md pt-0.5">
                  حسابك يمنحك متابعة المزادات المباشرة وحفظ اللوحات المفضلة مع أعلى معايير الأمان والثقة.
                </p>
              </div>

              {/* 4 Feature Cards Directly Below - No Void or Strange Gap */}
              <div className="space-y-2.5 max-w-md w-full pt-1">
                {/* Feature 1 */}
                <div className="flex items-center gap-3.5 rounded-2xl border border-white/20 bg-[#0a152c]/35 backdrop-blur-xl p-3 px-4 shadow-lg hover:border-gold/45 hover:bg-[#0a152c]/55 transition-all">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-gold/15 backdrop-blur-md text-gold shadow-[0_0_15px_rgba(217,184,127,0.2)]">
                    <Gavel size={20} className="text-gold" />
                  </div>
                  <div className="text-right">
                    <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                      المزايدة المباشرة والآمنة
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-300 font-normal leading-tight mt-0.5">
                      شارك في المزادات عبر منصة معتمدة رسمياً
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex items-center gap-3.5 rounded-2xl border border-white/20 bg-[#0a152c]/35 backdrop-blur-xl p-3 px-4 shadow-lg hover:border-gold/45 hover:bg-[#0a152c]/55 transition-all">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-gold/15 backdrop-blur-md text-gold shadow-[0_0_15px_rgba(217,184,127,0.2)]">
                    <ShieldCheck size={20} className="text-gold" />
                  </div>
                  <div className="text-right">
                    <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                      حماية وموثوقية
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-300 font-normal leading-tight mt-0.5">
                      جميع البيانات محمية وفق أعلى المعايير
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex items-center gap-3.5 rounded-2xl border border-white/20 bg-[#0a152c]/35 backdrop-blur-xl p-3 px-4 shadow-lg hover:border-gold/45 hover:bg-[#0a152c]/55 transition-all">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-gold/15 backdrop-blur-md text-gold shadow-[0_0_15px_rgba(217,184,127,0.2)]">
                    <TrendingUp size={20} className="text-gold" />
                  </div>
                  <div className="text-right">
                    <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                      متابعة فورية
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-300 font-normal leading-tight mt-0.5">
                      تنبيهات لحظية للمزادات واللوحات المفضلة
                    </p>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="flex items-center gap-3.5 rounded-2xl border border-white/20 bg-[#0a152c]/35 backdrop-blur-xl p-3 px-4 shadow-lg hover:border-gold/45 hover:bg-[#0a152c]/55 transition-all">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-gold/15 backdrop-blur-md text-gold shadow-[0_0_15px_rgba(217,184,127,0.2)]">
                    <Lock size={20} className="text-gold" />
                  </div>
                  <div className="text-right">
                    <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                      خصوصية وأمان بياناتك
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-300 font-normal leading-tight mt-0.5">
                      نحرص على خصوصيتك وحماية معلوماتك
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Elevated Luxury Frosted Glass Form Card (On the Left in RTL - Fixed Matching Height) */}
            <div className="lg:col-span-6 flex justify-center items-stretch h-full">
              <div className="w-full max-w-[430px] rounded-3xl border border-white/20 bg-[#0a152c]/35 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.6)] flex flex-col h-full relative overflow-hidden">
                {/* Golden Ambient Glow in card */}
                <div className="pointer-events-none absolute -top-20 start-1/2 -translate-x-1/2 h-32 w-64 rounded-full bg-gold/15 blur-2xl" />

                {/* Login / Register Quick Switcher Tabs */}
                {(safeMode === 'login' || safeMode === 'register') && (
                  <div className="mb-3.5 grid grid-cols-2 rounded-xl border border-white/20 bg-black/35 backdrop-blur-md p-1 text-center text-xs font-bold shadow-inner">
                    <Link
                      href="/login"
                      className={`rounded-lg py-2 transition-all ${
                        safeMode === 'login'
                          ? 'bg-gradient-to-r from-[#e8c888] via-[#d9b87f] to-[#b88c3a] text-[#070e1e] font-black shadow-md'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      تسجيل الدخول
                    </Link>
                    <Link
                      href="/register"
                      className={`rounded-lg py-2 transition-all ${
                        safeMode === 'register'
                          ? 'bg-gradient-to-r from-[#e8c888] via-[#d9b87f] to-[#b88c3a] text-[#070e1e] font-black shadow-md'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      إنشاء حساب جديد
                    </Link>
                  </div>
                )}

                {/* Form Content */}
                <AuthForm mode={safeMode} theme="dark" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Discrete Bottom Regulatory Footer (Seamless Floating, No Harsh Bar) */}
      <footer className="relative z-20 py-2.5 shrink-0 flex items-center text-[11px] text-slate-300/80">
        <div className="container-fbs flex items-center justify-between w-full">
          <p>© {new Date().getFullYear()} FBS · منصة فارس بن سعود للوحات المميزة</p>
          <div className="flex items-center gap-3">
            <Link href="/terms" className="hover:text-gold transition-colors">
              الشروط والأحكام
            </Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-gold transition-colors">
              سياسة الخصوصية
            </Link>
            <span>·</span>
            <Link href="/faq" className="hover:text-gold transition-colors">
              الأسئلة الشائعة
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
