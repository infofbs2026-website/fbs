import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  Gavel,
  History,
  Info,
  Landmark,
  Lock,
  Radio,
  Share2,
  ShieldCheck,
  Award,
  Trophy
} from 'lucide-react';
import { getPlateBySlug } from '@/modules/marketplace/service';
import { PlateVisualizer, statusLabels, EmptyState } from '@/components/ui';
import { ActionButton } from '@/components/forms';
import { SarPrice, SarSymbol, formatEnglishAmount } from '@/components/sar-symbol';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const result = await getPlateBySlug((await params).slug);
  return {
    title: result.plate
      ? `لوحة ${result.plate.lettersAr.join(' ')} ${result.plate.numbers} | منصة FBS للمزادات`
      : 'تفاصيل اللوحة المميزة'
  };
}

export default async function Detail({ params }: { params: Promise<{ slug: string }> }) {
  const result = await getPlateBySlug((await params).slug);

  if (!result.available) {
    return (
      <div className="container-fbs py-20">
        <EmptyState title="تفاصيل اللوحة غير متاحة حاليًا" description="يرجى إعادة المحاولة لاحقًا أو استكشاف المزادات المتاحة." />
      </div>
    );
  }

  if (!result.plate) notFound();
  const p = result.plate;
  const isLive = p.auction?.status === 'LIVE';
  const isUpcoming = p.auction?.status === 'SCHEDULED' || p.auction?.status === 'REGISTRATION_OPEN';
  const statusText = statusLabels[p.auction?.status ?? p.status] ?? p.status;
  const rawCurrentPrice = p.auction?.currentPriceHalalas ?? p.priceHalalas ?? '0';

  return (
    <>
      {/* ============================================================== */}
      {/* 1. LUXURY BREADCRUMB & AMBIENT BANNER                          */}
      {/* ============================================================== */}
      <section className="hero-luxury-ambient relative overflow-hidden border-b border-[#d9b87f]/20 pt-24 sm:pt-28 pb-8 sm:pb-12 text-white">
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <div className="absolute -top-24 start-1/2 -translate-x-1/2 h-[350px] w-[700px] rounded-full bg-gradient-to-b from-gold/15 via-gold/5 to-transparent blur-[110px]" />
        </div>

        <div className="container-fbs relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-gold-light mb-4">
            <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
            <span>/</span>
            <Link href="/plates" className="hover:text-white transition-colors">اللوحات المميزة</Link>
            <span>/</span>
            <span className="text-white">
              لوحة {p.lettersAr.join(' ')} {p.numbers}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-gold/40 bg-gold/15 px-3 py-1 text-xs font-black text-gold-light">
                  <Trophy size={13} className="text-gold" />
                  <span>لوحة {p.numbers.length === 1 ? 'أحادية ملكية' : p.numbers.length === 2 ? 'ثنائية مميزة' : 'نخبة'}</span>
                </span>
                {isLive ? (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-live shadow-[0_0_8px_#34d399]" />
                    <span>مباشر الآن ⚡</span>
                  </span>
                ) : isUpcoming ? (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-300">
                    <Clock size={13} />
                    <span>{statusText}</span>
                  </span>
                ) : null}
              </div>

              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl text-white">
                لوحة مركبة: {p.lettersAr.join(' ')} {p.numbers}
              </h1>
              <p className="mt-1 text-xs font-semibold text-slate-300">
                تسجيل رسمي: {p.type || 'خصوصي'} · منطقة {p.city || 'الرياض'} · كود اللوحة: <span className="font-norwester text-gold-light" dir="ltr">{p.lettersEn.join('')}-{p.numbers}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold text-slate-200 backdrop-blur-md">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>ملكية مفحوصة ومطابقة</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. MAIN SHOWCASE: PEDESTAL & AUCTION COMMAND DASHBOARD         */}
      {/* ============================================================== */}
      <div className="container-fbs py-10 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] items-start">
          
          {/* Left Column: 3D Plate Display & Specifications */}
          <div className="space-y-8">
            {/* Skeuomorphic Plate Presentation Pedestal */}
            <div className="luxury-card p-6 sm:p-10 text-center relative overflow-hidden">
              <div className="plate-tray-recessed rounded-3xl p-8 sm:p-14 flex items-center justify-center shadow-[inset_0_4px_16px_rgba(15,23,42,0.1)]">
                <div className="w-full max-w-[460px] transition-transform duration-300 hover:scale-[1.02]">
                  <PlateVisualizer
                    lettersAr={p.lettersAr}
                    lettersEn={p.lettersEn}
                    numbers={p.numbers}
                    plateType={p.type}
                    large
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 px-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>طبعة ألمنيوم بارزة ثلاثية الأبعاد بختم الليزر الأمني المعتمد</span>
                </span>
                <span className="font-norwester font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md" dir="ltr">
                  OFFICIAL DIE-STAMP
                </span>
              </div>
            </div>

            {/* Plate Description & Heritage */}
            <div className="luxury-card p-6 sm:p-8">
              <h2 className="flex items-center gap-2 text-base font-black text-navy mb-4">
                <Award size={18} className="text-gold-accent" />
                <span>عن هذه اللوحة الاستثنائية</span>
              </h2>
              <p className="whitespace-pre-wrap text-sm leading-8 text-slate-700">
                {p.description ||
                  'لوحة مركبة سعودية استثنائية تتميز بتناسق حروفها وأرقامها البارزة. خضعت لفحص الملكية والتدقيق النظامي عبر فريق منصة فارس بن سعود، وهي جاهزة للمزايدة ونقل الملكية الفوري عبر منصة أبشر والمعارض المعتمدة.'}
              </p>

              {/* Plate Technical Specifications */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-100 pt-6 text-xs">
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
                  <span className="block text-slate-400 font-medium">فئة اللوحة</span>
                  <span className="mt-1 block font-black text-navy text-sm">
                    {p.type || 'خصوصي'}
                  </span>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
                  <span className="block text-slate-400 font-medium">المدينة المسجلة</span>
                  <span className="mt-1 block font-black text-navy text-sm">{p.city || 'الرياض'}</span>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
                  <span className="block text-slate-400 font-medium">خانة الأرقام</span>
                  <span className="mt-1 block font-black text-navy text-sm font-norwester">
                    {p.numbers.length} {p.numbers.length === 1 ? 'رقم فردي' : 'أرقام'}
                  </span>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
                  <span className="block text-slate-400 font-medium">حالة الملكية</span>
                  <span className="mt-1 block font-black text-emerald-700 text-sm">موثّقة 100%</span>
                </div>
              </div>
            </div>

            {/* Virtual Vehicle Mounting Preview */}
            <div className="luxury-card p-6 sm:p-8 bg-gradient-to-r from-slate-900 to-navy text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Trophy size={18} className="text-gold" />
                  <h3 className="text-base font-bold text-white">معاينة اللوحة على مركبة فاخرة</h3>
                </div>
                <span className="text-xs text-gold-light font-semibold">محاكاة رقمية واقعية</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-300">
                شاهد كيف تمنح هذه اللوحة هيبة وفخامة استثنائية فور تركيبها على مقدمة أو خلفية سيارتك (مرسيدس مايباخ، رولز رويس، أو بورش).
              </p>
              <div className="mt-5 rounded-2xl bg-black/40 border border-white/10 p-6 text-center">
                <div className="mx-auto max-w-[280px]">
                  <PlateVisualizer
                    lettersAr={p.lettersAr}
                    lettersEn={p.lettersEn}
                    numbers={p.numbers}
                    plateType={p.type}
                  />
                </div>
                <span className="mt-3 block text-[11px] text-slate-400">
                  تنسيق الأبعاد متوافق مع معايير المرور السعودي للصدامات الأمامية والخلفية
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Bidding Command Box & Financial Protections */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="luxury-card p-6 sm:p-8 border-gold/40 shadow-xl">
              {/* Header Status Bar */}
              <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                  <ShieldCheck size={16} />
                  <span>توثيق رسمي ومعتمد</span>
                </span>
                <span className="rounded-lg bg-slate-100 px-3 py-1 font-norwester text-xs font-bold text-slate-800" dir="ltr">
                  FBS-{p.slug.toUpperCase()}
                </span>
              </div>

              {/* Price Banner */}
              <p className="text-xs font-semibold text-slate-500">
                {p.auction ? 'المزايدة الحالية المسجلة' : 'السعر المطلوب'}
              </p>
              <div className="my-3 flex items-baseline gap-2 text-3xl sm:text-4xl font-black text-navy" dir="ltr">
                <span className="tabular-nums tracking-tight font-norwester font-black text-slate-950">
                  {formatEnglishAmount(rawCurrentPrice)}
                </span>
                <SarSymbol className="w-6 h-6 text-gold-accent inline-block self-center" />
              </div>

              {p.auction && (
                <>
                  {/* Auction Key Figures */}
                  <dl className="my-6 grid grid-cols-2 gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-xs">
                    <div>
                      <dt className="text-slate-400 font-medium">سعر الافتتاح</dt>
                      <dd className="mt-1 text-sm font-bold text-navy">
                        <SarPrice amount={p.auction.startingPriceHalalas} symbolClassName="w-3.5 h-3.5 text-gold-accent" />
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-400 font-medium">عدد المزايدات</dt>
                      <dd className="mt-1 font-norwester text-sm font-bold text-navy flex items-center gap-1">
                        <Gavel size={14} className="text-gold-accent" />
                        <span>{p.auction.bidCount}</span>
                        <span className="text-[11px] text-slate-500">مزايدة</span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-400 font-medium">التأمين المطلوب</dt>
                      <dd className="mt-1 text-sm font-bold text-navy">
                        <SarPrice amount={p.auction.depositAmountHalalas} symbolClassName="w-3.5 h-3.5 text-gold-accent" />
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-400 font-medium">أقل زيادة للمزايدة</dt>
                      <dd className="mt-1 text-sm font-bold text-navy">
                        <SarPrice amount={p.auction.minimumIncrementHalalas} symbolClassName="w-3.5 h-3.5 text-gold-accent" />
                      </dd>
                    </div>
                  </dl>

                  {/* Primary CTA Button */}
                  <Link
                    href={`/auction-room/${p.auction.id}`}
                    className="btn btn-gold w-full py-4 text-sm font-black shadow-lg shadow-gold/25 hover:shadow-gold/40 flex items-center justify-center gap-2 mb-3"
                  >
                    <span>الدخول إلى غرفة المزاد المباشر</span>
                    <ArrowLeft size={16} />
                  </Link>
                </>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <ActionButton
                  endpoint="/api/v1/favorites"
                  body={{ plateId: p.id }}
                  label="حفظ في المفضلة"
                />
              </div>

              {/* Bank Guarantee & Escrow Notice */}
              <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-slate-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-800">
                  <Landmark size={15} />
                  <span>ضمان التأمين البنكي المعتمد</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  لا يتم استقطاع مبلغ التأمين البنكي، بل يتم حجزه (Pre-Authorization) فقط ويُفك الحجز تلقائياً فور انتهاء المزاد لجميع المشاركين غير الفائزين.
                </p>
              </div>

              {/* Terms Link */}
              <p className="mt-5 text-center text-[11px] text-slate-400">
                تخضع المشاركة إلى{' '}
                <Link href="/auction-policy" className="font-semibold text-navy underline hover:text-gold">
                  شروط المزادات
                </Link>{' '}
                و{' '}
                <Link href="/deposit-policy" className="font-semibold text-navy underline hover:text-gold">
                  سياسة التأمين المالي
                </Link>
                .
              </p>
            </div>

            {/* Concierge Contact Support Card */}
            <div className="luxury-card p-5 text-xs text-slate-600 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold-accent font-black">
                  FBS
                </span>
                <div>
                  <h4 className="font-bold text-navy">استفسار خاص عن اللوحة؟</h4>
                  <p className="text-[11px] text-slate-400">فريق الكونسيرج متاح على مدار الساعة</p>
                </div>
              </div>
              <Link href="/contact" className="btn btn-navy text-xs !px-4 !py-2 font-bold">
                تواصل معنا
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

