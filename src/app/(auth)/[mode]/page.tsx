import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AuthForm } from '@/components/forms';
import { ContentPage, contentTitles } from '@/components/content-page';
import {
  ShieldCheck,
  Award,
  Gavel,
  Lock,
  Crown,
  Car,
  CheckCircle2
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
    <div className="relative min-h-[90vh] bg-[#060a15] text-white pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden">
      {/* Subtle luxury ambient glows & showroom depth */}
      <div className="pointer-events-none absolute -top-40 start-1/2 h-[550px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-gold/18 via-gold/5 to-transparent blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 end-0 h-96 w-96 rounded-full bg-blue-900/15 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 start-0 h-80 w-80 rounded-full bg-amber-500/10 blur-[120px]" />

      <div className="container-fbs relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Right Column: VIP Membership Presentation (Desktop) */}
          <div className="hidden lg:col-span-6 lg:block space-y-8 pe-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-[#131c31] px-4 py-1.5 text-xs font-bold text-gold-light shadow-xs">
                <Crown size={15} className="text-gold" />
                <span>نادي نخبة المقتنين والمستثمرين</span>
              </span>
              <h1 className="mt-4 text-3xl font-black leading-tight text-white xl:text-4xl tracking-tight">
                بوابتك المعتمدة لأندر{' '}
                <span className="bg-gradient-to-r from-[#faebd0] via-[#d9b87f] to-[#be903e] bg-clip-text text-transparent">
                  مزادات اللوحات في المملكة
                </span>
              </h1>
              <p className="mt-3.5 text-sm leading-relaxed text-slate-300 xl:text-base font-medium">
                حساب رسمي يمنحك صلاحية المزايدة الحية في الصالة الرقمية، وحفظ ومتابعة اللوحات
                المميزة، مع ضمانات مصرفية تحمي تعاملاتك المالية بنظام الضامن (Escrow).
              </p>
            </div>

            {/* VIP Member Perks List */}
            <div className="space-y-3.5">
              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4.5 shadow-md backdrop-blur-xl hover:border-gold/30 hover:bg-white/[0.06] transition-all">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 border border-gold/30 text-gold-light">
                  <Gavel size={20} />
                </span>
                <div>
                  <h3 className="text-xs font-black text-white sm:text-sm">
                    المزايدة الحية الفورية (Live Bidding)
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    مزامنة فورية بالثواني مع تقنية مكافحة القنص (Anti-Sniping) لضمان بيئة تنافسية عادلة.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4.5 shadow-md backdrop-blur-xl hover:border-gold/30 hover:bg-white/[0.06] transition-all">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 border border-gold/30 text-gold-light">
                  <ShieldCheck size={20} />
                </span>
                <div>
                  <h3 className="text-xs font-black text-white sm:text-sm">
                    حماية الأموال بنظام الضامن (Escrow)
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    استرداد فوري 100% لتأمين المزاد لغير الفائزين، وحماية مستحقات البائعين حتى تمام نقل الملكية.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4.5 shadow-md backdrop-blur-xl hover:border-gold/30 hover:bg-white/[0.06] transition-all">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 border border-gold/30 text-gold-light">
                  <Car size={20} />
                </span>
                <div>
                  <h3 className="text-xs font-black text-white sm:text-sm">
                    محاكي القياسات واللوحات الملكية
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    معاينة دقيقة ومطابقة للمواصفات الرسمية لوزارة الداخلية لكافة فئات اللوحات النادرة.
                  </p>
                </div>
              </div>
            </div>

            {/* Official KSA Compliance Reassurance */}
            <div className="flex items-center gap-2.5 text-xs text-slate-300 font-semibold pt-1">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>نلتزم بمعايير الأمن السيبراني ونظام حماية البيانات الشخصية السعودي 🇸🇦</span>
            </div>
          </div>

          {/* Left Column: Luxury Grand Glass Form Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md rounded-3xl border border-gold/35 bg-[#091122]/90 backdrop-blur-2xl p-7 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.65)] relative overflow-hidden">
              {/* Golden Ambient Glow in card */}
              <div className="pointer-events-none absolute -top-16 start-1/2 -translate-x-1/2 h-32 w-64 rounded-full bg-gold/15 blur-2xl" />

              {/* Login / Register Quick Switcher Tabs */}
              {(safeMode === 'login' || safeMode === 'register') && (
                <div className="mb-6 grid grid-cols-2 rounded-2xl border border-white/10 bg-[#060b17] p-1 text-center text-xs font-bold shadow-inner">
                  <Link
                    href="/login"
                    className={`rounded-xl py-2.5 transition-all ${
                      safeMode === 'login'
                        ? 'bg-gradient-to-r from-gold via-gold-light to-gold-dark text-navy font-black shadow-md'
                        : 'text-slate-300 hover:text-gold'
                    }`}
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    href="/register"
                    className={`rounded-xl py-2.5 transition-all ${
                      safeMode === 'register'
                        ? 'bg-gradient-to-r from-gold via-gold-light to-gold-dark text-navy font-black shadow-md'
                        : 'text-slate-300 hover:text-gold'
                    }`}
                  >
                    إنشاء حساب جديد
                  </Link>
                </div>
              )}

              {/* Form Content */}
              <AuthForm mode={safeMode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
