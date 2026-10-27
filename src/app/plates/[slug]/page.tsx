import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Gavel, ShieldCheck, Tag } from 'lucide-react';
import { getPlateBySlug } from '@/modules/marketplace/service';
import { FbsStageWatermark, PlateVisualizer, statusLabels, EmptyState } from '@/components/ui';
import { PlateCarPreview3D } from '@/components/plate-car-preview-3d';
import { StorePlateActions } from '@/components/store-plate-actions';
import { SarSymbol, formatEnglishAmount } from '@/components/sar-symbol';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const result = await getPlateBySlug((await params).slug);
  return {
    title: result.plate
      ? `لوحة ${result.plate.lettersAr.join(' ')} ${result.plate.numbers} | منصة FBS للمزادات`
      : 'تفاصيل اللوحة المميزة'
  };
}

function Price({ amount, large = false }: { amount: string; large?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${large ? 'text-3xl sm:text-4xl' : 'text-sm'}`} dir="rtl">
      <bdi dir="ltr" className="font-norwester font-black tabular-nums tracking-tight text-navy">
        {formatEnglishAmount(amount)}
      </bdi>
      <SarSymbol ariaHidden={false} className={`${large ? 'h-6 w-6' : 'h-3.5 w-3.5'} shrink-0 text-gold-accent`} />
    </span>
  );
}

export default async function Detail({ params }: { params: Promise<{ slug: string }> }) {
  const result = await getPlateBySlug((await params).slug);

  if (!result.available) {
    return (
      <div className="container-fbs py-20">
        <EmptyState title="تفاصيل اللوحة غير متاحة حاليًا" description="يرجى إعادة المحاولة لاحقًا أو استكشاف اللوحات المتاحة." />
      </div>
    );
  }

  if (!result.plate) notFound();
  const p = result.plate;
  const isLive = p.auction?.status === 'LIVE';
  const isUpcoming = p.auction?.status === 'SCHEDULED' || p.auction?.status === 'REGISTRATION_OPEN';
  const statusText = statusLabels[p.auction?.status ?? p.status] ?? p.status;
  const price = p.auction?.currentPriceHalalas ?? p.priceHalalas;
  const code = `${p.lettersEn.join('')}-${p.numbers}`;

  return (
    <>
      <section className="hero-luxury-ambient relative overflow-hidden border-b border-gold/30 pb-8 pt-24 text-white sm:pb-12 sm:pt-30">
        <div className="container-fbs relative z-10">
          <nav aria-label="مسار الصفحة" className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-gold-light">
            <Link href="/" className="transition-colors hover:text-white">الرئيسية</Link>
            <span aria-hidden="true">/</span>
            <Link href={p.auction ? '/auctions' : '/plates'} className="transition-colors hover:text-white">
              {p.auction ? 'المزادات' : 'المتجر'}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-white">تفاصيل اللوحة</span>
          </nav>

          <h1 className="text-2xl font-black leading-snug tracking-tight sm:text-4xl">
            لوحة {p.lettersAr.join(' ')} <bdi>{p.numbers}</bdi>
          </h1>
          <p className="mt-2 text-xs font-semibold leading-6 text-slate-300 sm:text-sm">
            {p.type || 'خصوصي'} <span aria-hidden="true">·</span> {p.city || 'الرياض'}
            <span aria-hidden="true"> · </span> كود اللوحة: <bdi className="font-norwester text-gold-light" dir="ltr">{code}</bdi>
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold">
            {p.featured ? <span className="inline-flex items-center gap-1.5 text-gold-light"><Tag size={14} />لوحة مميزة</span> : null}
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />مزاد مباشر
              </span>
            ) : isUpcoming ? (
              <span className="inline-flex items-center gap-1.5 text-amber-300"><Clock size={14} />{statusText}</span>
            ) : null}
            {p.verified ? <span className="inline-flex items-center gap-1.5 text-slate-200"><ShieldCheck size={15} className="text-emerald-400" />ملكية مفحوصة ومطابقة</span> : null}
          </div>
        </div>
      </section>

      <div className="container-fbs py-7 sm:py-12">
        <div className="grid grid-cols-1 items-start gap-5 sm:gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="luxury-card relative overflow-hidden p-4 text-center sm:p-8 lg:col-start-1 lg:row-start-1">
            <div className="plate-tray-recessed relative flex items-center justify-center overflow-hidden rounded-2xl p-5 sm:rounded-3xl sm:p-12">
              <FbsStageWatermark />
              <div className="relative z-10 w-full max-w-[460px]">
                <PlateVisualizer lettersAr={p.lettersAr} lettersEn={p.lettersEn} numbers={p.numbers} plateType={p.type} large />
              </div>
            </div>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-medium leading-5 text-slate-500 sm:text-xs">
              <ShieldCheck size={14} className="shrink-0 text-emerald-600" />
              <span>ألمنيوم بارز ثلاثي الأبعاد بختم ليزر أمني</span>
            </p>
          </div>

          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-stretch">
            <aside aria-label="تفاصيل اللوحة والسعر" tabIndex={0} className="space-y-5 sm:space-y-6 lg:sticky lg:top-24 lg:-mx-2 lg:-mt-2 lg:max-h-[calc(100dvh-6.5rem)] lg:overflow-y-auto lg:px-2 lg:py-2">
              <section className="luxury-card p-5 sm:p-7">
                <h2 className="text-base font-black text-navy">تفاصيل اللوحة</h2>
                {p.description ? <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">{p.description}</p> : null}
                <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-slate-100 pt-4 text-xs sm:grid-cols-4">
                  <div><dt className="text-slate-500">الفئة</dt><dd className="mt-1 font-bold text-navy">{p.type || 'خصوصي'}</dd></div>
                  <div><dt className="text-slate-500">المدينة</dt><dd className="mt-1 font-bold text-navy">{p.city || 'الرياض'}</dd></div>
                  <div><dt className="text-slate-500">الأرقام</dt><dd className="mt-1 font-bold text-navy">{p.numbers.length} {p.numbers.length === 1 ? 'رقم' : 'أرقام'}</dd></div>
                  {p.verified ? <div><dt className="text-slate-500">الملكية</dt><dd className="mt-1 font-bold text-emerald-700">مفحوصة</dd></div> : null}
                </dl>
              </section>

              <section className="luxury-card border-gold/40 p-5 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600">
                    {p.verified ? <ShieldCheck size={16} className="text-emerald-700" /> : <Tag size={16} className="text-gold-accent" />}
                    {p.verified ? 'ملكية مفحوصة' : 'تفاصيل العرض'}
                  </span>
                  <span dir="ltr" className="font-norwester text-xs font-bold text-slate-500">{code}</span>
                </div>

                <div className="py-4">
                  <p className="mb-2 text-xs font-semibold text-slate-500">{p.auction ? 'المزايدة الحالية' : 'السعر المطلوب'}</p>
                  {price !== null ? <Price amount={price} large /> : <span className="text-lg font-bold text-navy">السعر عند الطلب</span>}
                </div>

                {p.auction ? (
                  <>
                    <dl className="mb-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-100 pt-4 text-xs">
                      <div><dt className="text-slate-500">سعر الافتتاح</dt><dd className="mt-1"><Price amount={p.auction.startingPriceHalalas} /></dd></div>
                      <div><dt className="text-slate-500">عدد المزايدات</dt><dd className="mt-1 font-bold text-navy">{p.auction.bidCount} مزايدة</dd></div>
                      <div><dt className="text-slate-500">التأمين المطلوب</dt><dd className="mt-1"><Price amount={p.auction.depositAmountHalalas} /></dd></div>
                      <div><dt className="text-slate-500">أقل زيادة</dt><dd className="mt-1"><Price amount={p.auction.minimumIncrementHalalas} /></dd></div>
                    </dl>
                    <Link href={`/auction-room/${p.auction.id}`} className="btn btn-gold w-full font-bold">
                      <Gavel size={17} />
                      <span>دخول المزاد</span>
                      <ArrowLeft size={16} />
                    </Link>
                    <p className="mt-4 text-xs leading-6 text-slate-500">
                      يُحجز التأمين للمزاد ويُفك لغير الفائزين وفق <Link href="/deposit-policy" className="font-bold text-navy underline">سياسة التأمين</Link>.
                    </p>
                  </>
                ) : (
                  <>
                    <StorePlateActions plateId={p.id} />
                    <p className="mt-4 text-xs leading-6 text-slate-500">بيع مباشر مع إجراءات نقل الملكية عبر أبشر.</p>
                  </>
                )}
              </section>
            </aside>
          </div>

          <div className="lg:col-start-1 lg:row-start-2">
            <PlateCarPreview3D initialPlate={{ lettersAr: p.lettersAr, lettersEn: p.lettersEn, numbers: p.numbers, plateType: p.type, slug: p.slug }} />
          </div>
        </div>
      </div>
    </>
  );
}
