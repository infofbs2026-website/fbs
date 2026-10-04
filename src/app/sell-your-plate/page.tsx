import type { Metadata } from 'next';
import Link from 'next/link';
import { PageTitle } from '@/components/ui';
import { SellerForm } from '@/components/seller-form';
import { getViewer } from '@/lib/auth';
import { getReferenceData } from '@/modules/marketplace/service';
import { ShieldCheck, Award, Lock, FileCheck2, ArrowLeft, MessageCircle, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'اعرض لوحتك في مزادات النخبة | فارس بن سعود'
};

export default async function Sell() {
  const [viewer, refs] = await Promise.all([getViewer(), getReferenceData()]);

  return (
    <>
      <PageTitle
        title="اعرض لوحتك في مزادات النخبة"
        eyebrow="خدمة كبار الملاك والمستثمرين"
        description="منصتك الأولى في المملكة لعرض اللوحات الماسية والنادرة أمام نخبة المزايدين والمقتنين، مع ضمان حماية حقوق البائع وسرية المعاملات المالية."
      />

      {/* Royal Ivory Page Background with Subtle Ambient Glow & Texture */}
      <main className="relative min-h-screen bg-gradient-to-b from-[#f8f5ee] via-[#f4efe4] to-[#ede5d6] py-12 sm:py-16 text-navy overflow-hidden">
        {/* Ambient Royal Gold Blobs */}
        <div className="pointer-events-none absolute -top-40 start-1/2 -translate-x-1/2 h-[550px] w-[950px] rounded-full bg-gold/15 blur-[140px]" />
        <div className="pointer-events-none absolute bottom-10 end-0 h-[450px] w-[450px] rounded-full bg-blue-900/10 blur-[130px]" />

        {/* Subtle Ivory Luxury Micro-Texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #b69248 1px, transparent 0)',
            backgroundSize: '28px 28px'
          }}
        />

        <div className="container-fbs relative z-10">
          {/* Prestige Trust Strip */}
          <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-4 rounded-3xl border-2 border-gold/40 bg-gradient-to-br from-[#18253f]/88 via-[#141f35]/90 to-[#101a2d]/88 backdrop-blur-xl p-5 shadow-[0_15px_35px_-5px_rgba(16,23,40,0.18)] hover:border-gold/70 transition-all">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold/20 border border-gold/35 text-gold shadow-xs">
                <ShieldCheck size={24} />
              </span>
              <div>
                <h3 className="text-sm font-black text-white">حماية وضمان مالي كامل</h3>
                <p className="text-xs text-slate-300 font-medium mt-0.5 leading-relaxed">حسابات ضامنة ومستندات موثقة نظاميًا</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-3xl border-2 border-gold/40 bg-gradient-to-br from-[#18253f]/88 via-[#141f35]/90 to-[#101a2d]/88 backdrop-blur-xl p-5 shadow-[0_15px_35px_-5px_rgba(16,23,40,0.18)] hover:border-gold/70 transition-all">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold/20 border border-gold/35 text-gold shadow-xs">
                <Award size={24} />
              </span>
              <div>
                <h3 className="text-sm font-black text-white">نخبة المقتنين والمزايدين</h3>
                <p className="text-xs text-slate-300 font-medium mt-0.5 leading-relaxed">وصول مباشر لأصحاب الرغبة والقدرة العالية</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-3xl border-2 border-gold/40 bg-gradient-to-br from-[#18253f]/88 via-[#141f35]/90 to-[#101a2d]/88 backdrop-blur-xl p-5 shadow-[0_15px_35px_-5px_rgba(16,23,40,0.18)] hover:border-gold/70 transition-all">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold/20 border border-gold/35 text-gold shadow-xs">
                <FileCheck2 size={24} />
              </span>
              <div>
                <h3 className="text-sm font-black text-white">اعتماد ونقل فوري</h3>
                <p className="text-xs text-slate-300 font-medium mt-0.5 leading-relaxed">إشراف كامل حتى إتمام نقل الملكية عبر أبشر</p>
              </div>
            </div>
          </div>

          {/* Interactive Consignment Form (with Live 3D Plate Simulator) */}
          <div className="space-y-12">
            {!viewer && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-5 rounded-3xl border-2 border-gold/45 bg-gradient-to-r from-[#18253f]/88 via-[#141f35]/90 to-[#101a2d]/88 backdrop-blur-xl p-6 shadow-xl">
                <div className="flex items-center gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gold/20 text-gold border border-gold/30">
                    <Lock size={20} />
                  </span>
                  <div>
                    <h4 className="text-sm font-black text-white">
                      محاكي تسجيل اللوحات المميزة (وضع المعاينة المباشرة)
                    </h4>
                    <p className="text-xs text-slate-300 font-medium mt-0.5">
                      يمكنك تجربة تحديد حروف وأرقام لوحتك بالأسفل ومعاينتها مباشرة. لحفظ اللوحة واعتمادها رسمياً، يُرجى تسجيل الدخول.
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2.5">
                  <Link
                    href="/login?redirect=/sell-your-plate"
                    className="btn btn-gold py-2.5 px-6 text-xs font-black shadow-md"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    href="/register?redirect=/sell-your-plate"
                    className="btn border-2 border-white/20 bg-white/10 text-white py-2.5 px-6 text-xs font-black hover:bg-white/20 transition-colors"
                  >
                    إنشاء حساب
                  </Link>
                </div>
              </div>
            )}

            <SellerForm
              letters={refs.letters}
              types={refs.types}
              cities={refs.cities}
              isLoggedIn={Boolean(viewer)}
            />

            {/* Seller Guarantee & Help Footer Cards */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-3xl border-2 border-gold/40 bg-gradient-to-br from-[#18253f]/88 via-[#141f35]/90 to-[#101a2d]/88 backdrop-blur-xl p-7 shadow-[0_20px_45px_-10px_rgba(16,23,40,0.18)] hover:border-gold/70 transition-all">
                <h3 className="flex items-center gap-2.5 text-base font-black text-white">
                  <ShieldCheck size={20} className="text-gold" />
                  <span>إرشادات اعتماد وعرض اللوحة</span>
                </h3>
                <ul className="mt-4 space-y-3 text-xs sm:text-sm leading-relaxed text-slate-200 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 shrink-0" />
                    <span>تُراجع المستندات بدقة للتأكد من مطابقة السجل المروري للمركبة.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 shrink-0" />
                    <span>يتولى مستشارو المنصة تقدير السعر الافتتاحي بالتشاور المباشر مع المالك.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 shrink-0" />
                    <span>يتم توثيق شروط المزاد وقيمة التأمين الإلزامي للمشاركين لضمان جدية المزايدات.</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-3xl border-2 border-gold/40 bg-gradient-to-br from-[#18253f]/88 via-[#141f35]/90 to-[#101a2d]/88 backdrop-blur-xl p-7 shadow-[0_20px_45px_-10px_rgba(16,23,40,0.18)] hover:border-gold/70 transition-all flex flex-col justify-between">
                <div>
                  <h3 className="flex items-center gap-2.5 text-base font-black text-gold">
                    <HelpCircle size={20} className="text-gold" />
                    <span>هل تحتاج استشارة خاصة لتقييم لوحتك؟</span>
                  </h3>
                  <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-200 font-medium">
                    مستشارو المكتب الخاص جاهزون للإجابة على جميع استفساراتك وتقديم تقييم فني وقيمة تقديرية للوحتك المميزة قبل اعتمادها وطرحها في المزاد.
                  </p>
                  <div className="mt-4 rounded-2xl bg-gold/15 border border-gold/30 p-3.5 text-xs text-gold-light font-medium leading-relaxed">
                    خدمة حصرية وسرية تامة مخصصة لكبار الملاك ومقتني اللوحات النادرة في المملكة.
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10">
                  <a
                    href="https://wa.me/966500000000"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-gold w-full py-3.5 text-xs sm:text-sm font-black shadow-lg inline-flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={17} />
                    <span>تواصل مع مستشار المزادات عبر واتساب</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
