'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Scale,
  Landmark,
  Lock,
  Building2,
  FileText,
  ChevronDown,
  Crown,
  MessageCircle,
  Phone
} from 'lucide-react';

function SaudiCrestSvg({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M32 6C32 6 34.5 12 39 15C43.5 18 49 18 49 18C49 18 45.5 23 43.5 28C41.5 33 42 38 42 38C42 38 36.5 36.5 32 39C27.5 36.5 22 38 22 38C22 38 22.5 33 20.5 28C18.5 23 15 18 15 18C15 18 20.5 18 25 15C29.5 12 32 6 32 6Z"
        fill="currentColor"
        fillOpacity="0.16"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M32 14V34M32 18C28 16 25 18 24 21M32 18C36 16 39 18 40 21M32 23C27 22 24 24 23 27M32 23C37 22 40 24 41 27" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M18 46L46 46M20 42L44 50M20 50L44 42" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32" cy="46" r="2.5" fill="currentColor" />
    </svg>
  );
}

export const aboutFaqs = [
  {
    q: 'ما الذي يجعل منصة فارس بن سعود تختلف جذرياً عن حراج ومجموعات التواصل الاجتماعي؟',
    a: 'منصتنا ليست سوقاً مفتوحاً بلا رقابة، بل دار مزادات ووساطة مرخصة تعمل بنظام الحساب الضامن المصرفي (Escrow) والتحقق الرسمي من هوية البائع والمشتري وصحة ملكية اللوحة عبر الأنظمة المعتمدة. كل مزايدة هنا حقيقية وملزمة قانونياً، وتتم التسوية المالية ونقل الملكية بضمانات بنكية تحمي الطرفين من النصب والمماطلة.'
  },
  {
    q: 'كيف يضمن نظام مكافحة القنص (Anti-Sniping) عدالة المزايدة في صالة FBS؟',
    a: 'في المزادات التقليدية غير العادلة، يتعمد البعض تقديم مزايدة في آخر ثانية لحرمان الآخرين من الرد. في نظامنا، عند تقديم أي مزايدة صحيحة في آخر دقيقتين من وقت المزاد، يتم تمديد الوقت تلقائياً لدقيقتين إضافيتين، وهكذا حتى يستقر المزاد على أعلى سعر يقدمه المزايد الأكثر جدية.'
  },
  {
    q: 'ما هي آلية استرداد تأمين المزاد في حال لم أربح اللوحة؟',
    a: 'تأمين المزاد محمي بالكامل ومحجوز في حساب مصرفي ضامن. فور انتهاء جلسة المزاد واعتماد النتيجة للمزايد الفائز، يتم تحرير الحجز وإرجاع مبلغ التأمين 100% لحسابات كافة المشاركين الآخرين دون أي استقطاع أو رسوم إدارية.'
  },
  {
    q: 'هل توفر المنصة صفقات خاصة غير معلنة في المزادات العامة (Off-Market)؟',
    a: 'نعم، يقدم المكتب الخاص (VIP Concierge Desk) خدمة الوساطة المباشرة بين الملاك والمشترين من كبار الشخصيات الراغبين في إتمام صفقات بيع أو شراء بأعلى درجات السرية والخصوصية دون عرضها في الصالة الرقمية العامة.'
  }
];

export function AboutFaqCta() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <>
      {/* Regulatory Compliance & Escrow Architecture */}
      <section className="rounded-3xl border-2 border-gold/40 bg-gradient-to-br from-[#192744] via-[#121c32] to-[#0d1527] p-8 sm:p-12 text-white shadow-xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold/20 px-4 py-1.5 text-xs font-bold text-gold border border-gold/30">
            <ShieldCheck size={16} />
            <span>الامتثال التنظيمي والتشريعي في المملكة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            بنية حماية نظامية تخضع للأنظمة السعودية 100%
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            صممت كل مرحلة من مراحل المزايدة والتسوية ونقل الملكية لتتوافق مع اشتراطات وزارة الداخلية، والإدارة العامة للمرور، ونظام مكافحة غسل الأموال، ونظام حماية البيانات الشخصية الصادر بالمرسوم الملكي الكريم.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xs">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/20 text-gold mb-3">
              <Scale size={20} />
            </span>
            <h3 className="text-sm font-black text-white">نظام المرور الرسمي</h3>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed font-normal">
              إجراءات نقل فورية عبر منصة أبشر ومراكز تسجيل المركبات المعتمدة.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xs">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/20 text-gold mb-3">
              <Landmark size={20} />
            </span>
            <h3 className="text-sm font-black text-white">حسابات بنكية ضامنة</h3>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed font-normal">
              عزل أموال التأمين والصفقات في حسابات مصرفية مخصصة لا تمس.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xs">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/20 text-gold mb-3">
              <Lock size={20} />
            </span>
            <h3 className="text-sm font-black text-white">تشفير وأمن سيبراني</h3>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed font-normal">
              حماية بيانات العملاء ووثائق الملكية وفق معايير الهيئة الوطنية للأمن السيبراني.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xs">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/20 text-gold mb-3">
              <Building2 size={20} />
            </span>
            <h3 className="text-sm font-black text-white">المكتب الخاص السري</h3>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed font-normal">
              اتفاقيات عدم إفصاح (NDA) لحماية سرية الملاك في الصفقات المليونية.
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          {/* High-contrast crisp badge on light background */}
          <span className="inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-[#131c31] text-[#faebd0] px-5 py-2 text-xs sm:text-sm font-bold shadow-xs">
            <FileText size={16} className="text-gold" />
            <span>إيضاحات هامة</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a]">
            أسئلة شائعة حول صرح فارس بن سعود
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] font-medium">
            كل ما تود معرفته عن موثوقية المنصة وآليات المزايدة والسرية
          </p>
        </div>

        <div className="space-y-3">
          {aboutFaqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border-2 border-slate-200/80 bg-white transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-5 text-start font-black text-[#0f172a] hover:text-navy transition-colors text-xs sm:text-sm"
                >
                  <span className="pe-4 leading-relaxed">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 transition-transform duration-200 text-slate-400 ${
                      isOpen ? 'rotate-180 text-navy' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 bg-slate-50/60 p-5 text-xs sm:text-sm leading-relaxed text-[#334155] font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* VIP Private Desk CTA Banner */}
      <section className="relative overflow-hidden rounded-3xl border-2 border-gold/45 bg-gradient-to-br from-[#162544] via-[#101b34] to-[#0c1527] p-8 sm:p-12 lg:p-14 text-white shadow-[0_30px_70px_-15px_rgba(16,23,40,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)]">
        {/* Subtle Royal Crest Watermark in corner */}
        <SaudiCrestSvg className="pointer-events-none absolute -bottom-12 -start-12 w-72 h-72 text-gold/[0.04] select-none" />

        {/* Ambient Glowing Aura */}
        <div className="pointer-events-none absolute -end-24 -top-24 h-72 w-72 rounded-full bg-gold/20 blur-[90px]" />
        <div className="pointer-events-none absolute bottom-0 start-1/3 h-56 w-56 rounded-full bg-blue-600/15 blur-[80px]" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="space-y-4 max-w-2xl text-center lg:text-start">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-gold/15 px-5 py-2 text-xs sm:text-sm font-black text-gold-light backdrop-blur-md shadow-xs">
              <Crown size={16} className="text-gold" />
              <span>المكتب الخاص لكبار الشخصيات • VIP Private Desk</span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
              هل تبحث عن لوحة نادرة غير معلنة أو ترغب في وساطة سرية خاصة؟
            </h3>

            <p className="text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed font-normal">
              يقدم المكتب الخاص لدار فارس بن سعود خدمات الوساطة الحصرية لترتيب صفقات البيع والشراء المغلقة (Off-Market)، مع تقديم استشارات تسعيرية موثقة وحلول مصرفية ضامنة تحفظ سرية وخصوصية النخبة.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-center lg:justify-start gap-2.5 text-xs text-slate-200 font-bold">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold text-[10px] font-black">✓</span>
                <span>وساطة صفقات مستترة</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2.5 text-xs text-slate-200 font-bold">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold text-[10px] font-black">✓</span>
                <span>مدير حساب متاح 24/7</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2.5 text-xs text-slate-200 font-bold">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold text-[10px] font-black">✓</span>
                <span>حساب مصرفي ضامن Escrow</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[360px] xl:w-[380px] shrink-0 space-y-3.5">
            <a
              href="https://wa.me/966500000000"
              target="_blank"
              rel="noreferrer"
              className="btn btn-gold w-full py-4 px-6 text-sm font-black shadow-xl hover:shadow-gold/30 flex items-center justify-center gap-3 rounded-2xl transition-all"
            >
              <MessageCircle size={20} className="shrink-0" />
              <span>محادثة واتساب فورية للمكتب الخاص</span>
            </a>

            <Link
              href="/contact"
              className="btn w-full border-2 border-white/20 bg-white/10 text-white hover:bg-white/15 hover:border-gold/50 py-4 px-6 text-sm font-black flex items-center justify-center gap-3 rounded-2xl backdrop-blur-md shadow-lg transition-all"
            >
              <Phone size={18} className="shrink-0 text-gold-light" />
              <span>طلب اتصال استشاري من المكتب الخاص</span>
            </Link>

            <div className="pt-1.5 flex items-center justify-center gap-2 text-xs font-semibold text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span>مستشار المكتب الخاص متاح الآن للرد الفوري</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
