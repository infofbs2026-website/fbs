'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ArrowLeft,
  Crown,
  Lock,
  BadgeCheck,
  TrendingUp,
  CreditCard,
  Building,
  Clock,
  Car,
  FileCheck2,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { PlateVisualizer } from '@/components/ui';

/* ========================================================================= */
/* BESPOKE LUXURY ICONS (SVG)                                                */
/* ========================================================================= */

function IconBuyerJourney({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="19" width="26" height="10" rx="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="9" cy="24" r="1.5" fill="currentColor" />
      <path d="M14 24h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M11 14L19 6M19 6L23 10M19 6L16 3M23 10L26 7M23 10L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="2" fill="currentColor" fillOpacity="0.4" />
    </svg>
  );
}

function IconSellerJourney({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 3L5 7V15C5 21.8 9.7 28.1 16 29C22.3 28.1 27 21.8 27 15V7L16 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="16" cy="13" r="3.5" stroke="currentColor" strokeWidth="2" />
      <path d="M16 16.5V22M16 19.5H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconOfficialSeal({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14.7 4.2L18.2 4.4L19.4 7.6L22.2 9.7L21.7 13.1L23 16.4L20.2 18.3L19.2 21.6L15.7 21.7L13.3 24.1L10.7 21.7L7.2 21.6L6.2 18.3L3.4 16.4L4.7 13.1L4.2 9.7L7 7.6L8.2 4.4L11.7 4.2L12 2Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.5 12L11 14.5L16 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ========================================================================= */
/* JOURNEY STEPS DATA                                                        */
/* ========================================================================= */

type JourneyStep = {
  num: string;
  badge: {
    label: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
  };
  title: string;
  description: string;
  stepProgress: string;
  renderVisual: () => React.ReactNode;
};

const buyerJourneySteps: JourneyStep[] = [
  {
    num: '01',
    badge: {
      label: 'معاينة واقعية 3D',
      bgClass: 'bg-emerald-50',
      textClass: 'text-emerald-800',
      borderClass: 'border-emerald-300'
    },
    title: 'استكشاف اللوحات ومعاينتها بدقة',
    description:
      'تصفح أندر اللوحات المميزة مع محاكي دقيق مطابق للمقاسات والمواصفات الرسمية.',
    stepProgress: 'الخطوة 1 من 5',
    renderVisual: () => (
      <div className="space-y-3">
        <div className="flex justify-center py-1">
          <PlateVisualizer
            lettersAr={['د', 'ل', 'ع']}
            lettersEn={['D', 'L', 'E']}
            numbers="1"
            compact={true}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-semibold text-slate-600 bg-white/80 p-2 rounded-xl border border-slate-200">
          <span className="flex items-center gap-1 text-navy font-bold">
            <CheckCircle2 size={13} className="text-emerald-600" />
            أبعاد معتمدة 52 × 11 سم
          </span>
          <span className="text-slate-500">فئة خصوصي فاخرة</span>
        </div>
      </div>
    )
  },
  {
    num: '02',
    badge: {
      label: 'توثيق معتمد وسريع',
      bgClass: 'bg-blue-50',
      textClass: 'text-blue-800',
      borderClass: 'border-blue-300'
    },
    title: 'التسجيل وتوثيق بيانات المزايد',
    description:
      'إنشاء حسابك وتأكيد بيانات الهوية والتواصل لضمان جدية المزايدات وموثوقية التعاملات.',
    stepProgress: 'الخطوة 2 من 5',
    renderVisual: () => (
      <div className="rounded-xl border border-blue-200/80 bg-gradient-to-br from-blue-50/70 to-indigo-50/40 p-3 text-start">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
              <ShieldCheck size={16} />
            </span>
            <div>
              <p className="text-xs font-bold text-navy">توثيق هوية المزايد</p>
              <p className="text-[10px] text-slate-500">تحقق رسمي معتمد</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-300">
            <CheckCircle2 size={11} /> موثق ومطابق
          </span>
        </div>
        <div className="mt-2.5 flex items-center justify-between border-t border-blue-100 pt-2 text-[10px] text-slate-500 font-medium">
          <span className="whitespace-nowrap">تشفير بنكي معتمد 256-bit</span>
          <span className="text-navy font-bold whitespace-nowrap">للأفراد والشركات</span>
        </div>
      </div>
    )
  },
  {
    num: '03',
    badge: {
      label: 'تأمين مسترد 100%',
      bgClass: 'bg-amber-50',
      textClass: 'text-amber-900',
      borderClass: 'border-amber-300'
    },
    title: 'إيداع تأمين المزاد المالي',
    description:
      'إيداع مبلغ التأمين المحدد بأمان، مع إفراج فوري وتلقائي 100% في حال عدم الفوز.',
    stepProgress: 'الخطوة 3 من 5',
    renderVisual: () => (
      <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
            <CreditCard size={15} className="text-amber-600" />
            حساب بنكي ضامن (Escrow)
          </span>
          <span className="rounded-md bg-amber-200/70 px-2 py-0.5 text-[10px] font-black text-amber-900">
            ضمان بنكي معتمد
          </span>
        </div>
        <p className="mt-1.5 text-[11px] leading-relaxed text-amber-900/80">
          حجز بنكي آمن يُحرر تلقائياً فور نهاية المزاد دون أي استقطاعات عند عدم الترسية.
        </p>
      </div>
    )
  },
  {
    num: '04',
    badge: {
      label: 'مزامنة صالة حية',
      bgClass: 'bg-purple-50',
      textClass: 'text-purple-800',
      borderClass: 'border-purple-300'
    },
    title: 'المزايدة في الصالة الرقمية الحية',
    description:
      'متابعة لحظية وتنافس عادل مع نظام تمديد ذكي يحمي تكافؤ الفرص في اللحظات الأخيرة.',
    stepProgress: 'الخطوة 4 من 5',
    renderVisual: () => (
      <div className="rounded-xl border border-purple-200/90 bg-gradient-to-r from-purple-50 via-slate-50 to-purple-50/50 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-600" />
            </span>
            <span className="text-xs font-black text-navy">صالة المزاد نشطة الآن</span>
          </div>
          <span className="text-[11px] font-norwester font-black text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-md">
            +60 ثانية تمديد
          </span>
        </div>
        <div className="mt-2 text-[11px] font-medium text-slate-600">
          خوارزمية ذكية تمدد وقت المزاد آلياً عند وجود مزايدات بالثواني الأخيرة لضمان تكافؤ الفرص.
        </div>
      </div>
    )
  },
  {
    num: '05',
    badge: {
      label: 'نقل ملكية رسمي',
      bgClass: 'bg-emerald-50',
      textClass: 'text-emerald-900',
      borderClass: 'border-emerald-300'
    },
    title: 'الترسية والتسوية ونقل الملكية',
    description:
      'تسديد المتبقي عبر الحساب الضامن واستكمال إجراءات نقل الملكية الرسمية واستلام الاستمارة.',
    stepProgress: 'الخطوة 5 من 5',
    renderVisual: () => (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3">
        <div className="flex items-center gap-2">
          <Building size={16} className="text-emerald-700 shrink-0" />
          <span className="text-xs font-bold text-emerald-950 whitespace-nowrap">
            تسوية ونقل الملكية المعتمد
          </span>
        </div>
        <div className="mt-2.5 space-y-1.5 border-t border-emerald-200/60 pt-2 text-[11px] text-emerald-900 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
            <span>مطابقة السجلات وتحديث المستندات</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
            <span>تسليم الوثائق الرسمية</span>
          </div>
        </div>
      </div>
    )
  }
];

const sellerJourneySteps: JourneyStep[] = [
  {
    num: '01',
    badge: {
      label: 'مطابقة فورية',
      bgClass: 'bg-teal-50',
      textClass: 'text-teal-800',
      borderClass: 'border-teal-300'
    },
    title: 'إدخال بيانات ومواصفات اللوحة',
    description:
      'إدخال الحروف والأرقام والفئة للحصول على معاينة فورية ومطابقة دقيقة للمواصفات الرسمية.',
    stepProgress: 'الخطوة 1 من 5',
    renderVisual: () => (
      <div className="space-y-3">
        <div className="flex justify-center py-1">
          <PlateVisualizer
            lettersAr={['س', 'ع', 'د']}
            lettersEn={['S', 'E', 'D']}
            numbers="777"
            compact={true}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-semibold text-slate-600 bg-white/80 p-2 rounded-xl border border-slate-200">
          <span className="flex items-center gap-1 text-navy font-bold">
            <CheckCircle2 size={13} className="text-teal-600" />
            لوحة ثلاثية مميزة
          </span>
          <span className="text-slate-500">فحص تلقائي لمطابقة السجل</span>
        </div>
      </div>
    )
  },
  {
    num: '02',
    badge: {
      label: 'سرية وتشفير كامل',
      bgClass: 'bg-blue-50',
      textClass: 'text-blue-800',
      borderClass: 'border-blue-300'
    },
    title: 'رفع إثبات الملكية وتفويض البيع',
    description:
      'رفع استمارة المركبة وتفويض البيع في بيئة مشفرة تخضع لأعلى معايير السرية والتدقيق النظامي.',
    stepProgress: 'الخطوة 2 من 5',
    renderVisual: () => (
      <div className="rounded-xl border border-blue-200/80 bg-gradient-to-br from-blue-50/70 to-indigo-50/40 p-3 text-start">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
              <Lock size={15} />
            </span>
            <div>
              <p className="text-xs font-bold text-navy">بيئة رفع مشفرة وآمنة</p>
              <p className="text-[10px] text-slate-500">حماية تامة لبيانات الاستمارة</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-900 border border-blue-300">
            <ShieldCheck size={11} /> سرية تامة
          </span>
        </div>
        <div className="mt-2.5 flex items-center justify-between border-t border-blue-100 pt-2 text-[10px] text-slate-500 font-medium">
          <span>توثيق تفويض البيع إلكترونيًا</span>
          <span className="text-navy font-bold">عقد وساطة نظامي</span>
        </div>
      </div>
    )
  },
  {
    num: '03',
    badge: {
      label: 'تقييم خلال 24 ساعة',
      bgClass: 'bg-amber-50',
      textClass: 'text-amber-900',
      borderClass: 'border-amber-300'
    },
    title: 'الفحص والتقييم الاستثماري',
    description:
      'مراجعة شاملة ومطابقة للسجلات وتقدير السعر العادل وفق تحليلات السوق لتحقيق أعلى عائد.',
    stepProgress: 'الخطوة 3 من 5',
    renderVisual: () => (
      <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
            <BadgeCheck size={15} className="text-amber-600" />
            تقرير التثمين التقديري
          </span>
          <span className="rounded-md bg-amber-200/70 px-2 py-0.5 text-[10px] font-black text-amber-900">
            دراسة اتجاهات السوق
          </span>
        </div>
        <p className="mt-1.5 text-[11px] leading-relaxed text-amber-900/80">
          تحليل مقارن لأحدث الصفقات المماثلة في السوق السعودي لتحديد السعر الأنسب لجذب كبار المزايدين.
        </p>
      </div>
    )
  },
  {
    num: '04',
    badge: {
      label: 'تسويق موجه للنخبة',
      bgClass: 'bg-purple-50',
      textClass: 'text-purple-800',
      borderClass: 'border-purple-300'
    },
    title: 'طرح المزاد والتسويق الحصري',
    description:
      'عرض اللوحة في الصالة الحية والوصول المباشر لقاعدة تضم أكثر من 10,000 مستثمر ومقتنٍ جاد.',
    stepProgress: 'الخطوة 4 من 5',
    renderVisual: () => (
      <div className="rounded-xl border border-purple-200/90 bg-gradient-to-r from-purple-50 via-slate-50 to-purple-50/50 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={15} className="text-purple-700" />
            <span className="text-xs font-black text-navy">وصول استثنائي مباشر</span>
          </div>
          <span className="text-[11px] font-norwester font-black text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-md">
            +10,000 مقتنٍ
          </span>
        </div>
        <div className="mt-2 text-[11px] font-medium text-slate-600">
          حملات تسويقية وتنبيهات مباشرة لكبار المقتنين والمهتمين باللوحات النادرة.
        </div>
      </div>
    )
  },
  {
    num: '05',
    badge: {
      label: 'تحصيل بنكي آمن',
      bgClass: 'bg-emerald-50',
      textClass: 'text-emerald-900',
      borderClass: 'border-emerald-300'
    },
    title: 'تحصيل العوائد ونقل الملكية',
    description:
      'إيداع قيمة الترسية بالحساب الضامن مسبقاً، وتحويل العوائد لحسابك البنكي فور إتمام نقل الملكية.',
    stepProgress: 'الخطوة 5 من 5',
    renderVisual: () => (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3">
        <div className="flex items-center gap-2">
          <Building size={16} className="text-emerald-700 shrink-0" />
          <span className="text-xs font-bold text-emerald-950 whitespace-nowrap">
            تحويل بنكي IBAN فوري
          </span>
        </div>
        <div className="mt-2.5 space-y-1.5 border-t border-emerald-200/60 pt-2 text-[11px] text-emerald-900 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
            <span>استلام المقابل المالي مضمون 100%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
            <span>إخلاء طرف رسمي فوري</span>
          </div>
        </div>
      </div>
    )
  }
];

/* ========================================================================= */
/* FAQS DATA                                                                 */
/* ========================================================================= */

type FaqItem = {
  q: string;
  a: string;
  category: string;
};

const faqs: FaqItem[] = [
  {
    q: 'ما هو نظام الحساب الضامن (Escrow) وكيف يحميني كمشترٍ أو كبائع؟',
    a: 'تُحفظ قيمة اللوحة في حساب بنكي ضامن محمي، ولا تُحوّل للبائع إلا بعد اكتمال نقل الملكية رسمياً واستلام المشتري للاستمارة الجديدة.',
    category: 'الضمانات المالية'
  },
  {
    q: 'كيف يعمل نظام مكافحة القنص (Anti-Sniping) في الصالة الحية؟',
    a: 'عند تقديم أي مزايدة في آخر دقيقة من المزاد، يُمدد الوقت تلقائياً لدقيقة إضافية لضمان تكافؤ الفرص ومنع المباغتة في اللحظات الأخيرة.',
    category: 'المزادات الحية'
  },
  {
    q: 'متى يتم استرداد مبلغ تأمين المزاد في حال عدم الفوز؟',
    a: 'يُفك حجز التأمين آلياً وفور انتهاء المزاد لغير الفائزين دون أي استقطاع، ليعود الرصيد لحسابك البنكي مباشرة دون تأخير.',
    category: 'التأمين والمدفوعات'
  },
  {
    q: 'هل يتطلب إتمام نقل الملكية الحضور لأي فرع من فروع المرور؟',
    a: 'لا حاجة لمراجعة فروع المرور؛ يتولى فريقنا إنهاء إجراءات النقل الرسمية وإصدار الاستمارة وتسليم اللوحات مباشرة.',
    category: 'نقل الملكية'
  }
];

/* ========================================================================= */
/* MAIN COMPONENT: HOW IT WORKS VIEW                                         */
/* ========================================================================= */

export function HowItWorksView() {
  const [stage, setStage] = useState(0);
  const [activeTab, setActiveTab] = useState<'buyer' | 'seller'>('buyer');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 50);
    const t2 = setTimeout(() => setStage(2), 180);
    const t3 = setTimeout(() => setStage(3), 360);
    const t4 = setTimeout(() => setStage(4), 540);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const steps = activeTab === 'buyer' ? buyerJourneySteps : sellerJourneySteps;

  return (
    <div className="min-h-screen bg-[#F2F0EA]">
      {/* =================================================================== */}
      {/* 1. PRESTIGE DARK HERO SECTION                                       */}
      {/* =================================================================== */}
      <section className="hero-luxury-ambient relative overflow-hidden border-b border-[#D9BB81]/30 text-white pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-22 min-h-[66vh] lg:min-h-[70vh] flex flex-col justify-center items-center text-center">
        <div className="w-full max-w-[1000px] mx-auto px-5 sm:px-8 lg:px-10 relative z-10 flex flex-col items-center text-center">
          {/* Stage 1: Breadcrumb Navigation & Eyebrow Capsule */}
          <div
            className={`flex flex-col items-center justify-center transition-all duration-700 ease-out transform ${
              stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
            }`}
          >
            <nav aria-label="مسار التصفح" className="mb-4 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
              <Link href="/" className="hover:text-gold transition-colors">
                الرئيسية
              </Link>
              <ChevronLeft size={13} className="text-slate-600" />
              <span className="text-gold font-semibold">كيف نعمل</span>
            </nav>

            <div className="inline-flex items-center justify-center gap-1.5 rounded-full border border-gold/35 bg-gold/15 px-3.5 py-1.5 backdrop-blur-md mx-auto">
              <IconOfficialSeal className="w-3.5 h-3.5 text-gold" />
              <span className="text-[11px] sm:text-[11.5px] font-bold text-gold-light tracking-wide">
                دليل آلية العمل والوساطة المعتمدة
              </span>
            </div>
          </div>

          {/* Stage 2: Hero Typography */}
          <div
            className={`mt-5 max-w-3xl text-center mx-auto transition-all duration-700 ease-out transform ${
              stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
            }`}
          >
            <h1 className="text-[clamp(1.75rem,1.35rem+1.2vw,2.35rem)] font-black tracking-tight text-white leading-tight whitespace-normal sm:whitespace-nowrap text-center">
              آلية عمل مزادات وصفقات النخبة المعتمدة
            </h1>

            <p className="mt-3 text-xs sm:text-[13.5px] text-slate-300 font-normal whitespace-normal sm:whitespace-nowrap max-w-2xl mx-auto leading-relaxed text-center">
              منظومة رقمية متكاملة للمزايدة والبيع بإشراف حساب بنكي ضامن وحماية مالية معتمدة.
            </p>
          </div>

          {/* Stage 3: Quick Assurance Badges Ribbon */}
          <div
            className={`mt-7 w-full max-w-[540px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-gold/20 pt-6 justify-center transition-all duration-700 ease-out transform ${
              stage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
            }`}
          >
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-2.5 sm:py-2.5 sm:px-3.5 backdrop-blur-sm text-start">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/20 text-gold border border-gold/30">
                <CreditCard size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-black text-white whitespace-nowrap">حساب بنكي ضامن</p>
                <p className="text-[11px] text-slate-300 font-medium whitespace-nowrap">تسوية مالية مؤمنة 100%</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-2.5 sm:py-2.5 sm:px-3.5 backdrop-blur-sm text-start">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <Clock size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-black text-white whitespace-nowrap">مكافحة القنص الذكية</p>
                <p className="text-[11px] text-slate-300 font-medium whitespace-nowrap">تمديد تلقائي وتكافؤ فرص</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. SEGMENTED TAB SWITCHER & STEPS SHOWCASE                          */}
      {/* =================================================================== */}
      <section className="relative -mt-8 sm:-mt-10 pb-20">
        <div className="max-w-[1000px] mx-auto px-5 sm:px-8 lg:px-10">
          {/* Executive Glass Tab Bar */}
          <div className="mx-auto max-w-xl">
            <div className="rounded-2xl border border-gold/40 bg-[#081223]/95 p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-md">
              <div className="grid grid-cols-2 gap-1.5">
                {/* Tab 1: Buyer Journey */}
                <button
                  type="button"
                  onClick={() => setActiveTab('buyer')}
                  className={`flex items-center justify-center gap-2.5 rounded-xl px-3 sm:px-4 py-3 text-center transition-all duration-300 ${
                    activeTab === 'buyer'
                      ? 'bg-gradient-to-r from-gold/30 via-gold/15 to-gold/25 border border-gold text-gold-light shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <IconBuyerJourney
                    className={`w-5 h-5 sm:w-6 sm:h-6 shrink-0 transition-colors ${
                      activeTab === 'buyer' ? 'text-gold' : 'text-slate-400'
                    }`}
                  />
                  <div className="text-start min-w-0">
                    <p className={`text-xs sm:text-[14px] font-black whitespace-nowrap ${activeTab === 'buyer' ? 'text-white' : 'text-slate-300'}`}>
                      رحلة المزايد والمشتري
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium hidden sm:block whitespace-nowrap truncate">
                      للمشاركين في المزادات والشراء الفوري
                    </p>
                  </div>
                </button>

                {/* Tab 2: Seller Journey */}
                <button
                  type="button"
                  onClick={() => setActiveTab('seller')}
                  className={`flex items-center justify-center gap-2.5 rounded-xl px-3 sm:px-4 py-3 text-center transition-all duration-300 ${
                    activeTab === 'seller'
                      ? 'bg-gradient-to-r from-gold/30 via-gold/15 to-gold/25 border border-gold text-gold-light shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <IconSellerJourney
                    className={`w-5 h-5 sm:w-6 sm:h-6 shrink-0 transition-colors ${
                      activeTab === 'seller' ? 'text-gold' : 'text-slate-400'
                    }`}
                  />
                  <div className="text-start min-w-0">
                    <p className={`text-xs sm:text-[14px] font-black whitespace-nowrap ${activeTab === 'seller' ? 'text-white' : 'text-slate-300'}`}>
                      رحلة المالك والبائع
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium hidden sm:block whitespace-nowrap truncate">
                      لعرض وتثمين لوحتك أمام المستثمرين
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Section Subheading Indicator */}
          <div className="mt-9 sm:mt-11 text-center">
            <h2 className="text-xl sm:text-2xl font-black text-navy whitespace-normal sm:whitespace-nowrap">
              {activeTab === 'buyer'
                ? '5 خطوات لاقتناء لوحتك المميزة بأعلى درجات الأمان'
                : '5 خطوات لعرض لوحتك وتحقيق أعلى عائد استثماري'}
            </h2>
            <p className="mt-2 text-xs sm:text-[13px] text-slate-500 font-medium whitespace-normal sm:whitespace-nowrap">
              {activeTab === 'buyer'
                ? 'إجراءات منظمة تبدأ بالمعاينة والمزايدة الحية وتنتهي بنقل الملكية الرسمي'
                : 'من الفحص والتقييم العادل وحتى إيداع العوائد المالية في حسابك البنكي'}
            </p>
          </div>

          {/* =============================================================== */}
          {/* STEP CARDS GRID (HIGH CONTRAST & LUXURY DESIGN)                 */}
          {/* =============================================================== */}
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.num}
                className="group relative flex flex-col justify-between rounded-3xl border-2 border-slate-200/90 bg-white p-6 sm:p-7 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.06)] hover:border-gold hover:shadow-[0_22px_50px_-8px_rgba(217,184,127,0.22)] transition-all duration-300 overflow-hidden"
              >
                {/* Background Large Watermark Number for prestige feel */}
                <span className="pointer-events-none absolute -start-2 -bottom-4 font-black font-norwester text-8xl text-slate-100 select-none opacity-60 group-hover:text-gold/10 group-hover:opacity-100 transition-all duration-300">
                  {step.num}
                </span>

                <div>
                  {/* Card Top Ribbon: Metallic Number Insignia & Category Pill */}
                  <div className="flex items-center justify-between">
                    {/* Metallic Number Box */}
                    <div className="relative flex h-12 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fbf2da] via-[#d9b87f] to-[#b69248] text-[#060b17] font-norwester font-black text-2xl shadow-[0_4px_14px_rgba(217,184,127,0.45)] border border-white/80 ring-2 ring-gold/20">
                      {step.num}
                    </div>

                    {/* Colorful Category Pill */}
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${step.badge.bgClass} ${step.badge.textClass} ${step.badge.borderClass} shadow-xs`}
                    >
                      {step.badge.label}
                    </span>
                  </div>

                  {/* Title & Description with Strong Contrast */}
                  <h3 className="mt-5 text-lg font-black text-[#0f172a] group-hover:text-navy leading-snug transition-colors">
                    {step.title}
                  </h3>

                  <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-[#334155] font-normal">
                    {step.description}
                  </p>

                  {/* Visual Proof Snippet Box */}
                  <div className="mt-5 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 group-hover:border-gold/30 group-hover:bg-[#faf8f5] transition-all">
                    {step.renderVisual()}
                  </div>
                </div>

                {/* Step Progress Footer */}
                <div className="relative z-10 mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1.5 text-navy font-bold">
                    <CheckCircle2 size={15} className="text-gold-accent" />
                    <span>{step.stepProgress}</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">منصة معتمدة</span>
                </div>
              </div>
            ))}

            {/* ============================================================= */}
            {/* 6th CARD: VIP ACTION HUB CARD                                 */}
            {/* ============================================================= */}
            <div className="relative flex flex-col justify-between rounded-3xl border-2 border-gold/60 bg-gradient-to-br from-[#060b17] via-[#0d172e] to-[#122244] p-7 text-white shadow-2xl overflow-hidden group">
              {/* Gold Beam Glow Effect */}
              <div className="pointer-events-none absolute -top-16 -end-16 h-48 w-48 rounded-full bg-gold/20 blur-[50px] group-hover:bg-gold/30 transition-all" />

              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-3 py-1 text-xs font-bold text-gold">
                    <Crown size={14} />
                    جاهز للبدء الآن؟
                  </span>
                  <IconOfficialSeal className="w-6 h-6 text-gold" />
                </div>

                <h3 className="mt-5 text-xl font-black text-white leading-tight">
                  {activeTab === 'buyer'
                    ? 'شارك في أحدث مزادات اللوحات الحصرية'
                    : 'اعرض لوحتك أمام أكثر من 10,000 مقتنٍ'}
                </h3>

                <p className="mt-3 text-xs sm:text-[13px] leading-relaxed text-slate-300 font-normal">
                  {activeTab === 'buyer'
                    ? 'انضم إلى نخبة مقتني اللوحات في المملكة وتابع المزادات الحية بالثواني مع ضمانات حماية مالية متكاملة.'
                    : 'احصل على أعلى قيمة سوقية للوحتك مع سرية تامة وسرعة في إجراءات البيع والتسوية البنكية.'}
                </p>

                {/* Key Benefits List */}
                <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-gold" />
                    <span>{activeTab === 'buyer' ? 'حساب بنكي ضامن لحفظ حقوقك بالكامل' : 'إيداع بنكي مضمون لكامل القيمة مسبقاً'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-gold" />
                    <span>{activeTab === 'buyer' ? 'إجراءات نقل ملكية رسمية موثقة ومعتمدة' : 'تسويق موجه لأكثر من 10,000 مقتنٍ جاد'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                {activeTab === 'buyer' ? (
                  <>
                    <Link
                      href="/auctions"
                      className="btn btn-gold w-full text-sm font-black shadow-lg"
                    >
                      <span>دخول صالة المزادات الحية</span>
                      <ArrowLeft size={16} />
                    </Link>
                    <Link
                      href="/plates"
                      className="btn btn-outline-gold w-full text-xs font-bold"
                    >
                      <span>تصفح اللوحات المعروضة للشراء الفوري</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/sell-your-plate"
                      className="btn btn-gold w-full text-sm font-black shadow-lg"
                    >
                      <span>اعرض لوحتك للبيع الآن</span>
                      <ArrowLeft size={16} />
                    </Link>
                    <Link
                      href="/contact"
                      className="btn btn-outline-gold w-full text-xs font-bold"
                    >
                      <span>طلب استشارة أو تثمين خاص</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. TRIPLE GUARANTEES & COMPLIANCE SECTION                           */}
      {/* =================================================================== */}
      <section className="border-y border-slate-200 bg-white py-16 sm:py-20">
        <div className="max-w-[1000px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/35 bg-gold/15 px-3.5 py-1.5 text-[11px] sm:text-[11.5px] font-bold text-[#8a6828]">
              منظومة الحماية والضمان
            </span>
            <h2 className="mt-3 text-xl sm:text-2xl lg:text-3xl font-black text-navy whitespace-normal sm:whitespace-nowrap">
              3 ركائز أساسية تضمن حماية صفقاتك
            </h2>
            <p className="mt-2 text-xs sm:text-[13px] text-slate-500 whitespace-normal sm:whitespace-nowrap">
              بنية تحتية مالية ونظامية محكمة تضمن أمان التعاملات وحفظ حقوق كافة الأطراف.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {/* Pillar 1 */}
            <div className="rounded-3xl border border-slate-200 bg-[#fbfcfd] p-6 hover:border-gold/50 transition-colors">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 shadow-xs">
                <CreditCard size={22} />
              </span>
              <h3 className="mt-4 text-base font-black text-navy">
                الحساب البنكي الضامن (Escrow)
              </h3>
              <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-slate-600">
                تسوية مالية مؤمنة 100%؛ تبقى المبالغ في حساب وسيط معتمد ولا تُحوّل للبائع إلا بعد استكمال نقل الملكية وتأكيد الاستلام رسمياً.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-3xl border border-slate-200 bg-[#fbfcfd] p-6 hover:border-gold/50 transition-colors">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-xs">
                <Building size={22} />
              </span>
              <h3 className="mt-4 text-base font-black text-navy">
                حوكمة وتوثيق رسمي معتمد
              </h3>
              <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-slate-600">
                إشراف نظامي متكامل لمطابقة بيانات اللوحات وإتمام إجراءات نقل الملكية الرسمية واستلام الاستمارة باسم المشتري مباشرة.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-3xl border border-slate-200 bg-[#fbfcfd] p-6 hover:border-gold/50 transition-colors">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 border border-purple-500/20 shadow-xs">
                <Clock size={22} />
              </span>
              <h3 className="mt-4 text-base font-black text-navy">
                خوارزمية مكافحة القنص الذكية
              </h3>
              <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-slate-600">
                تمديد تلقائي لعمر المزاد عند وجود مزايدات في الدقيقة الأخيرة لضمان تكافؤ الفرص ومنع أي مباغتة برمجية.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 4. FREQUENTLY ASKED QUESTIONS ACCORDION                             */}
      {/* =================================================================== */}
      <section className="py-16 sm:py-20 bg-[#f8fafc]">
        <div className="max-w-[1000px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/35 bg-gold/15 px-3.5 py-1.5 text-[11px] sm:text-[11.5px] font-bold text-[#8a6828]">
              الأسئلة الشائعة
            </span>
            <h2 className="mt-3 text-xl sm:text-2xl lg:text-3xl font-black text-navy whitespace-normal sm:whitespace-nowrap">
              إجابات وافية حول آلية عمل المنصة
            </h2>
            <p className="mt-2 text-xs sm:text-[13px] text-slate-500 whitespace-normal sm:whitespace-nowrap">
              كل ما يهمك معرفته عن المزايدة، التأمين، الحساب الضامن، وإجراءات الاستلام.
            </p>
          </div>

          <div className="mt-10 mx-auto max-w-3xl space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-start font-black text-navy hover:text-gold-dark transition-colors"
                  >
                    <span className="text-sm sm:text-base">{faq.q}</span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 bg-gold text-navy' : 'text-slate-600'
                      }`}
                    >
                      <ChevronDown size={16} />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm leading-relaxed text-slate-600 border-t border-slate-100">
                      <p>{faq.a}</p>
                      <span className="mt-3 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                        {faq.category}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Need help footer */}
          <div className="mt-12 text-center">
            <p className="text-xs text-slate-500">
              لديك استفسار خاص لم تجد إجابته هنا؟{' '}
              <Link href="/contact" className="font-bold text-navy underline hover:text-gold">
                تواصل مع مستشاري المنصة مباشرة
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
