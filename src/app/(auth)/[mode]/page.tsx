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
    <div className="relative min-h-[85vh] bg-gradient-to-b from-paper via-white to-paper pt-28 pb-12 sm:pt-36 sm:pb-20 overflow-hidden">
      {/* Subtle luxury ambient glows */}
      <div className="pointer-events-none absolute -top-40 start-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 end-0 h-80 w-80 rounded-full bg-navy/5 blur-3xl" />

      <div className="container-fbs relative">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Right Column: VIP Membership Presentation (Desktop) */}
          <div className="hidden lg:col-span-6 lg:block space-y-8 pe-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-xs font-bold text-gold-accent">
                <Crown size={14} />
                نادي نخبة المقتنين والمستثمرين
              </span>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight text-navy xl:text-4xl">
                بوابتك المعتمدة لأندر مزادات اللوحات في المملكة
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted xl:text-base">
                حساب واحد يمنحك صلاحية المزايدة الحية في الصالة الرقمية، وحفظ ومتابعة اللوحات
                المميزة، مع ضمانات مصرفية تحمي تعاملاتك المالية بالكامل.
              </p>
            </div>

            {/* VIP Member Perks List */}
            <div className="space-y-4">
              <div className="flex items-start gap-3.5 rounded-2xl border border-line bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold-accent">
                  <Gavel size={20} />
                </span>
                <div>
                  <h3 className="text-xs font-bold text-navy">
                    المزايدة الحية الفورية (Live Bidding)
                  </h3>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
                    مزامنة فورية بالثواني مع تقنية مكافحة القنص (Anti-Sniping) لضمان بيئة تنافسية عادلة.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-2xl border border-line bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold-accent">
                  <ShieldCheck size={20} />
                </span>
                <div>
                  <h3 className="text-xs font-bold text-navy">
                    حماية الأموال بنظام الضامن (Escrow)
                  </h3>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
                    استرداد فوري 100% لتأمين المزاد لغير الفائزين، وحماية مستحقات البائعين حتى تمام نقل الملكية.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-2xl border border-line bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold-accent">
                  <Car size={20} />
                </span>
                <div>
                  <h3 className="text-xs font-bold text-navy">
                    محاكي القياسات واللوحات الملكية
                  </h3>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
                    معاينة دقيقة ومطابقة للمواصفات الرسمية لوزارة الداخلية لكافة فئات اللوحات النادرة.
                  </p>
                </div>
              </div>
            </div>

            {/* Official KSA Compliance Reassurance */}
            <div className="flex items-center gap-2 text-xs text-muted">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>نلتزم بمعايير الأمن السيبراني ونظام حماية البيانات الشخصية السعودي</span>
            </div>
          </div>

          {/* Left Column: Form Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md rounded-3xl border border-line bg-white p-7 sm:p-10 shadow-xl shadow-slate-200/50">
              {/* Login / Register Quick Switcher Tabs */}
              {(safeMode === 'login' || safeMode === 'register') && (
                <div className="mb-6 grid grid-cols-2 rounded-xl bg-paper p-1 text-center text-xs font-bold">
                  <Link
                    href="/login"
                    className={`rounded-lg py-2 transition-all ${
                      safeMode === 'login'
                        ? 'bg-navy text-gold shadow-sm'
                        : 'text-muted hover:text-navy'
                    }`}
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    href="/register"
                    className={`rounded-lg py-2 transition-all ${
                      safeMode === 'register'
                        ? 'bg-navy text-gold shadow-sm'
                        : 'text-muted hover:text-navy'
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
