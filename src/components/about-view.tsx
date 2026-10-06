'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  Lock,
  Gavel,
  TrendingUp,
  Building2,
  Users,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Crown,
  ExternalLink,
  MessageCircle,
  Phone,
  Scale,
  FileCheck2,
  FileText,
  BadgeCheck,
  Landmark,
  Layers,
  Compass,
  Eye,
  Check,
  Zap,
  ArrowDown
} from 'lucide-react';
import { PlateVisualizer } from '@/components/ui';
import { SarSymbol, formatEnglishAmount } from '@/components/sar-symbol';

/* ========================================================================= */
/* BESPOKE SVG CRESTS & SYMBOLS (REGAL SAUDI IDENTITY - ZERO SPARKLES/STARS) */
/* ========================================================================= */

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

function EscrowShieldSvg({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 3L5 7.5V15C5 22.5 9.7 28.5 16 30C22.3 28.5 27 22.5 27 15V7.5L16 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect x="11" y="14" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M13 14V11.5C13 9.8 14.3 8.5 16 8.5C17.7 8.5 19 9.8 19 11.5V14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="16" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

function AntiSnipingRadarSvg({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.75" strokeOpacity="0.4" />
      <circle cx="16" cy="16" r="8" stroke="currentColor" strokeWidth="1.75" strokeOpacity="0.7" />
      <circle cx="16" cy="16" r="3" fill="currentColor" />
      <path d="M16 3V7M16 25V29M3 16H7M25 16H29" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M16 16L24 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ========================================================================= */
/* DATA MODELS                                                               */
/* ========================================================================= */

interface PlateTierData {
  id: string;
  tabLabel: string;
  name: string;
  lettersAr: string[];
  lettersEn: string[];
  numbers: string;
  scarcityIndex: string;
  heritageRating: string;
  cagrGrowth: string;
  description: string;
  profile: string;
  idealVehicle: string;
  badge: string;
}

const plateTiers: PlateTierData[] = [
  {
    id: 'sovereign',
    tabLabel: 'الأحادية والملكية (Single-Digit)',
    name: 'الفئة السيادية: أحادي الحرف والرقم',
    lettersAr: ['ق'],
    lettersEn: ['Q'],
    numbers: '1',
    scarcityIndex: '0.001% (قمة الندرة المطلقة)',
    heritageRating: 'أصول سيادية رفيعة',
    cagrGrowth: '+28% سنوياً',
    description:
      'تمثل هذه الفئة ذروة الهيبة والوجاهة في تاريخ تسجيل المركبات في المملكة. لوحات أحادية مفردة لا تتكرر، وتعد من أكثر الأصول التراثية والاستثمارية طلباً بين كبار الشخصيات وصناع القرار.',
    profile: 'نخبة المجتمع، المستثمرون الإستراتيجيون، مقتنو التحف التاريخية والسيادية.',
    idealVehicle: 'رولز رويس فانتوم، بنتلي مولينير، أساطيل القصور الملكية والسيارات الرئاسية.',
    badge: 'المرتبة السيادية الأولى'
  },
  {
    id: 'duals',
    tabLabel: 'الثنائية والمتشابهة (Prestige Duals)',
    name: 'الفئة الثنائية: التناغم البصري الفخم',
    lettersAr: ['س', 'س'],
    lettersEn: ['S', 'S'],
    numbers: '7',
    scarcityIndex: '0.02% (ندرة استثنائية)',
    heritageRating: 'وجاهة وتوازن بصري مثالي',
    cagrGrowth: '+22% سنوياً',
    description:
      'تتميز بتماثل الأحرف أو الأرقام الفردية الثنائية، ما يمنح المركبة بصمة بصرية لا تُنسى في شوارع العاصمة ومناسبات النخبة، مع قيمة سوقية تصاعدية ثابتة ومحمية من التضخم.',
    profile: 'رواد الأعمال البارزون، الدبلوماسيون، وعشاق التميز البصري الكلاسيكي.',
    idealVehicle: 'مرسيدس مايباخ، أستون مارتن، رينج روفر إس في أوتوبيوغرافي.',
    badge: 'التطابق المتناغم'
  },
  {
    id: 'iconic',
    tabLabel: 'الكلمات الدلالية (Iconic Names)',
    name: 'فئة المعنى والتفرد: لوحات الكلمات الشهيرة',
    lettersAr: ['ق', 'م', 'ر'],
    lettersEn: ['Q', 'M', 'R'],
    numbers: '1',
    scarcityIndex: '0.08% (تفرد شخصي معنوي)',
    heritageRating: 'هوية عربية أصيلة',
    cagrGrowth: '+19% سنوياً',
    description:
      'لوحات تنطق بكلمات عربية ذات دلالات عميقة ترتبط بالجمال أو الأصالة أو القوة، متصلة برقم مميز كـ (1) أو (7) أو (777). تجمع بين الروح العربية والشخصية الفريدة لصاحبها.',
    profile: 'الشخصيات العامة المؤثرة، المبدعون، وهواة الجمع ذوو الذوق الانتقائي الخاص.',
    idealVehicle: 'فيراري، بورش 911 توربو إس، لامبورغيني أوروس.',
    badge: 'الرمزية والدلالة'
  },
  {
    id: 'sports',
    tabLabel: 'الرياضية المقتضبة (Short Fitment)',
    name: 'الفئة الرياضية: التصميم الديناميكي المركز',
    lettersAr: ['د'],
    lettersEn: ['D'],
    numbers: '8',
    scarcityIndex: '0.04% (نسق صغير مخصص)',
    heritageRating: 'رياضية حصرية بالغة الأناقة',
    cagrGrowth: '+24% سنوياً',
    description:
      'مصممة خصيصاً للواجهات الرياضية الخارقة لتمنح انسيابية هوائية ومظهراً نظيفاً دون استهلاك مساحة الصدام، مع إبراز الحرف والرقم المقتضبين في تناغم فائق.',
    profile: 'هواة السيارات الرياضية الخارقة وسيارات الحلبات المحدودة الإصدار.',
    idealVehicle: 'مكلارين، بورش جي تي ثري آر إس، باجاني، بوغاتي.',
    badge: 'النسق الرياضي الفاخر'
  }
];

const pillarsList = [
  {
    num: '01',
    title: 'الانتقائية المطلقة والفرز الصارم',
    subtitle: 'نخبة اللوحات فقط من بين آلاف الطلبات',
    desc: 'نخضع كل لوحة معروضة لمعايير تقييم صارمة تضمن الندرة الحقيقية، والجاذبية البصرية، والقيمة التراثية والاستثمارية المستدامة. المنصة ليست سوقاً مفتوحاً للعشوائية بل معرض حصري منتقى بعناية فائقة.',
    badge: 'قبول أقل من 5% من الطلبات',
    icon: Award,
    stats: '1 من 20 لوحة تجتاز الفحص'
  },
  {
    num: '02',
    title: 'نظام الحساب الضامن المصرفي (Escrow)',
    subtitle: 'فصل مالي كامل وأمان بنكي 100%',
    desc: 'تودع أموال المزايدات والصفقات في حسابات مصرفية وسيطة وضامنة خاضعة للرقابة المالية. لا يتم الإفراج عن المبلغ للبائع إلا بعد تأكيد انتقال قيد اللوحة رسمياً في سجلات المرور ومنصة أبشر للمشتري.',
    badge: 'حماية مصرفية معتمدة',
    icon: EscrowShieldSvg,
    stats: 'صفر حالات نزاع مالي'
  },
  {
    num: '03',
    title: 'محرك المزادات الحية ومكافحة القنص (Anti-Sniping)',
    subtitle: 'بنية خوادم بمزامنة اللحظة الفائقة',
    desc: 'نظام مزايدة لحظي بالثواني مجهز بخوارزمية تمديد تلقائي عادلة عند تقديم أي عطاء في اللحظات الأخيرة. هذا يمنع برمجيات القنص ويمنح كل مزايد جاد فرصة التنافس الشريف حتى آخر لحظة.',
    badge: 'تمديد ذكي عادل',
    icon: AntiSnipingRadarSvg,
    stats: 'تأخير استجابة < 35ms'
  },
  {
    num: '04',
    title: 'التدقيق المروري والتحقق عبر النفاذ الوطني',
    subtitle: 'ربط نظامي وتوثيق رسمي خالي من اللبس',
    desc: 'لا يُقبل أي مزاد أو بيع إلا بعد مطابقة رخصة السير وهوية المالك ورقم الهيكل لدى الجهات المرورية الرسمية بالمملكة، مع توثيق كافة المزايدين عبر النفاذ الوطني لضمان جدية المزايدات.',
    badge: 'مطابقة مرورية معتمدة',
    icon: FileCheck2,
    stats: 'توثيق رسمي 100%'
  },
  {
    num: '05',
    title: 'المكتب الخاص ووساطة الصفقات الكبرى (VIP Desk)',
    subtitle: 'سرية تامة وعناية فائقة بكبار الشخصيات',
    desc: 'فريق استشاري مخصص يقدم خدمات الوساطة المستترة للصفقات الخاصة (Off-Market)، والترتيبات اللوجستية، وتوجيه المحافظ الاستثمارية التراثية مع حفظ الخصوصية والسرية المصرفية التامة.',
    badge: 'خدمة كبار الشخصيات',
    icon: Building2,
    stats: 'مدير حساب شخصي مخصص'
  }
];

const aboutFaqs = [
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

/* ========================================================================= */
/* MAIN COMPONENT                                                            */
/* ========================================================================= */

export function AboutView() {
  const [selectedTierId, setSelectedTierId] = useState<string>('sovereign');
  const [horizonYears, setHorizonYears] = useState<number>(5);
  const [initialInvestment, setInitialInvestment] = useState<number>(500000);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const selectedTier = plateTiers.find((t) => t.id === selectedTierId) || plateTiers[0];

  // Dynamic ROI calculation based on historic Saudi rare plate appreciation:
  const annualRate =
    selectedTier.id === 'sovereign'
      ? 0.25
      : selectedTier.id === 'duals'
        ? 0.2
        : selectedTier.id === 'sports'
          ? 0.22
          : 0.17;

  const estimatedFinalValue = Math.round(initialInvestment * Math.pow(1 + annualRate, horizonYears));
  const estimatedNetGain = estimatedFinalValue - initialInvestment;

  return (
    <div className="w-full">
      {/* =================================================================== */}
      {/* 1. FULL-BLEED CINEMATIC HERO (EDGE-TO-EDGE, LUXURY ATMOSPHERE)     */}
      {/* =================================================================== */}
      <section className="relative w-full min-h-[100dvh] lg:min-h-screen flex flex-col justify-between pt-28 sm:pt-36 pb-10 sm:pb-14 text-white overflow-hidden bg-[#060a14] border-b border-gold/30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]">
        
        {/* ============================================================== */}
        {/* HERO BACKGROUND IMAGE: IDENTICAL TO HOME HERO POSTER (NO OVERLAYS) */}
        {/* ============================================================== */}
        <div
          className="absolute inset-0 z-0 overflow-hidden bg-[#060a14] bg-cover bg-center select-none pointer-events-none"
          style={{ backgroundImage: 'url(/videos/fbs-hero-poster.webp)' }}
        >
          {/* Minimal 1px Golden Horizon Line at the very bottom border */}
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent pointer-events-none" />
        </div>

        {/* Central Hero Content */}
        <div className="container-fbs relative z-10 my-auto py-6 sm:py-8 text-center max-w-5xl mx-auto space-y-6 sm:space-y-7">
          {/* Sovereign Eyebrow Badge: Regal styling with gold rim */}
          <div className="inline-flex items-center gap-3 rounded-full border border-gold/45 bg-[#0b1426]/85 px-6 py-2.5 text-xs sm:text-sm font-black text-gold-light backdrop-blur-xl shadow-[0_4px_24px_rgba(217,184,127,0.18)]">
            <SaudiCrestSvg className="w-5 h-5 text-gold shrink-0 drop-shadow-[0_0_8px_rgba(217,184,127,0.4)]" />
            <span>فارس بن سعود للوحات المميزة • الصرح السعودي الرائد</span>
          </div>

          {/* Majestic Hero Headline: Strictly Two Balanced Lines (Line 1: White, Line 2: Gold) */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-black tracking-tight leading-snug sm:leading-tight max-w-5xl mx-auto">
            <span className="block text-white mb-1.5 sm:mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
              حيث تلتقي الندرة بالهيبة..
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#fae8c8] via-[#d9b87f] to-[#b3883b] drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              وسادتنا في عالم اللوحات السعودية الاستثنائية
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base lg:text-lg leading-relaxed text-slate-200/90 font-normal drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
            تأسست منصة فارس بن سعود لتكون دار المزادات والوساطة الأولى بالمملكة المتخصصة في أندر لوحات المركبات الملكية والأحادية، مدعومة بحسابات مصرفية ضامنة وبنية تقنية فائقة تحمي حقوق النخبة وتصنع معياراً جديداً للثقة.
          </p>

          {/* Quick Action CTA Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/auctions"
              className="btn btn-gold py-3.5 px-8 text-sm font-black shadow-[0_8px_30px_rgba(217,184,127,0.35)] hover:shadow-[0_8px_35px_rgba(217,184,127,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Gavel size={18} />
              <span>استكشف المزادات الحية</span>
            </Link>
            <Link
              href="/sell-your-plate"
              className="btn border border-gold/40 bg-[#0e172a]/70 text-slate-100 hover:text-white hover:bg-gold/15 hover:border-gold py-3.5 px-8 text-sm font-black backdrop-blur-md shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Award size={18} className="text-gold-light" />
              <span>اعرض لوحتك النادرة</span>
            </Link>
          </div>

          {/* Key Metric Highlights: Refined Frosted Glass Cards */}
          <div className="pt-6 sm:pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-5">
            <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 backdrop-blur-xl transition-all duration-300 hover:border-gold/50 hover:bg-gold/[0.07] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.45)]">
              <span className="font-norwester text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#fff6e0] via-[#d9b87f] to-[#b38838] tracking-tight block">
                +10,000
              </span>
              <p className="mt-1.5 text-xs sm:text-sm text-white font-bold">مقتنٍ ومستثمر معتمد</p>
              <span className="text-[11px] text-slate-400 block mt-0.5">قاعدة نخبوية حصرية</span>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 backdrop-blur-xl transition-all duration-300 hover:border-gold/50 hover:bg-gold/[0.07] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.45)]">
              <span className="font-norwester text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#fff6e0] via-[#d9b87f] to-[#b38838] tracking-tight block">
                100%
              </span>
              <p className="mt-1.5 text-xs sm:text-sm text-white font-bold">حماية بنكية ضامنة</p>
              <span className="text-[11px] text-slate-400 block mt-0.5">نظام Escrow المعتمد</span>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 backdrop-blur-xl transition-all duration-300 hover:border-gold/50 hover:bg-gold/[0.07] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.45)]">
              <span className="font-norwester text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#fff6e0] via-[#d9b87f] to-[#b38838] tracking-tight block">
                &lt; 24h
              </span>
              <p className="mt-1.5 text-xs sm:text-sm text-white font-bold">متوسط دورة الفحص</p>
              <span className="text-[11px] text-slate-400 block mt-0.5">مطابقة رخصة السير والمرور</span>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 backdrop-blur-xl transition-all duration-300 hover:border-gold/50 hover:bg-gold/[0.07] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.45)]">
              <span className="font-norwester text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#fff6e0] via-[#d9b87f] to-[#b38838] tracking-tight block">
                0%
              </span>
              <p className="mt-1.5 text-xs sm:text-sm text-white font-bold">مخاطر على التأمين</p>
              <span className="text-[11px] text-slate-400 block mt-0.5">استرداد فوري لغير الفائزين</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator at Bottom Center */}
        <div className="relative z-10 flex flex-col items-center justify-center text-slate-400 text-xs gap-1.5 opacity-80 hover:opacity-100 transition-opacity pb-2">
          <span className="font-medium tracking-wide">استكشف تفاصيل المنصة</span>
          <ArrowDown size={14} className="animate-bounce text-gold" />
        </div>
      </section>

      {/* =================================================================== */}
      {/* REST OF PAGE CONTENT (IN REFINED CONTAINER)                         */}
      {/* =================================================================== */}
      <div className="container-fbs py-16 sm:py-24 space-y-20 sm:space-y-28">
        
        {/* ================================================================= */}
        {/* 2. THE CURATOR MANIFESTO & IDENTITY                               */}
        {/* ================================================================= */}
        <section className="grid gap-10 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            {/* High-contrast crisp badge on light background with generous padding */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-[#131c31] text-[#faebd0] px-5 py-2 text-xs sm:text-sm font-bold shadow-xs">
              <Compass size={16} className="text-gold" />
              <span>بيان الهوية وفلسفة التميز</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-[#0f172a] leading-tight">
              اللوحة المميزة ليست مجرد معدن، بل بصمة سيادية وأصل تاريخي يورّث
            </h2>

            <p className="text-sm sm:text-base leading-relaxed text-[#334155] font-medium">
              في ثقافة المجتمع السعودي الرفيعة، شكلت لوحات المركبات النادرة دائماً عنواناً للمكانة والهيبة والذوق الرفيع. ومع نضوج السوق، تحولت اللوحات الأحادية والثنائية إلى فئة أصول نادرة (Scarce Luxury Assets) تحظى بإقبال متزايد وتتفوق في عوائدها على العديد من الأدوات الاستثمارية التقليدية.
            </p>

            <p className="text-sm sm:text-base leading-relaxed text-[#334155] font-medium">
              جاءت منصة <strong className="font-black text-[#0f172a]">فارس بن سعود (FBS)</strong> لتنهي عهد التداول العشوائي وغير الموثق في المنصات العامة، ولتؤسس بيئة ذات طابع مصرفي نخبوي تليق بعشاق التفرد، وتضمن لكافة الأطراف إتمام صفقاتهم بكرامة وسرية واطمئنان مطلق.
            </p>

            {/* Key Checklist Badges */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm font-bold text-[#0f172a]">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <Check size={16} strokeWidth={3} />
                </span>
                <span>انتقاء دقيق لا يقبل إلا التحف الحقيقية</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <Check size={16} strokeWidth={3} />
                </span>
                <span>حفظ أموال بنكي مستقل بنظام الضامن</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <Check size={16} strokeWidth={3} />
                </span>
                <span>نقل ملكية رسمي عبر القنوات الحكومية المعتمدة</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <Check size={16} strokeWidth={3} />
                </span>
                <span>سرية تامة لحسابات كبار الشخصيات والملاك</span>
              </div>
            </div>
          </div>

          {/* Right: Curated Royal Emblem Pedestal (Rich Twilight Navy, No Pitch Black) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl border-2 border-gold/40 bg-gradient-to-br from-[#1c2c4d] via-[#15223c] to-[#0e172a] p-8 sm:p-9 text-white shadow-xl overflow-hidden">
              <div className="pointer-events-none absolute -top-12 -end-12 h-44 w-44 rounded-full bg-gold/20 blur-3xl" />

              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/20 text-gold border border-gold/40">
                    <Crown size={24} />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-white">ختم الاعتماد المؤسسي</h3>
                    <p className="text-[11px] text-slate-300">منظومة دار مزادات فارس بن سعود</p>
                  </div>
                </div>
                <SaudiCrestSvg className="w-8 h-8 text-gold/80" />
              </div>

              <div className="my-6 space-y-4 text-xs sm:text-sm leading-relaxed text-slate-200">
                <p className="italic font-medium">
                  «نحن لا نبيع أرقاماً.. بل نوثق تاريخاً ونمكن مقتني اللوحات من حيازة تحف لا تتكرر، بإشراف قانوني ومالي يضاهي أرقى بيوت المزادات العالمية في لندن وجنيف ونيويورك.»
                </p>
                <div className="pt-3 flex items-center justify-between text-xs text-gold border-t border-white/10">
                  <span className="font-bold">المكتب التنفيذي واللجنة الاستشارية</span>
                  <span className="font-norwester">FBS PRIVATE DESK</span>
                </div>
              </div>

              <div className="rounded-2xl border border-gold/30 bg-gold/15 p-4 flex items-center gap-3 text-xs text-gold-light">
                <ShieldCheck size={22} className="shrink-0 text-gold" />
                <span>مرخصة ومطابقة للأنظمة التجارية وأنظمة المرور السعودية</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 3. INTERACTIVE PLATE RARITY & TIER EXPLORER                      */}
        {/* ================================================================= */}
        <section className="space-y-8 rounded-3xl border-2 border-slate-200/90 bg-white p-7 sm:p-12 shadow-md">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              {/* High-contrast crisp badge on light background */}
              <span className="inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-[#131c31] text-[#faebd0] px-5 py-2 text-xs sm:text-sm font-bold shadow-xs">
                <Layers size={16} className="text-gold" />
                <span>تصنيف المقتنيات وفئات الندرة</span>
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-black text-[#0f172a]">
                مستكشف درجات الندرة في فارس بن سعود
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#475569] font-medium">
                اختر الفئة لمعاينة نموذج لوحة مطابق للمواصفات الرسمية والاطلاع على خصائصها الاستثمارية
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <Eye size={16} className="text-navy" />
              <span>محاكاة دقيقة بأبعاد المرور الرسمية</span>
            </div>
          </div>

          {/* Interactive Tab Selectors with Generous Padding */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            {plateTiers.map((tier) => {
              const isSelected = tier.id === selectedTierId;
              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setSelectedTierId(tier.id)}
                  className={`flex flex-col items-start rounded-2xl border-2 p-4 sm:p-5 text-start transition-all ${
                    isSelected
                      ? 'border-navy bg-gradient-to-br from-slate-900 to-navy text-white shadow-md ring-2 ring-gold/40'
                      : 'border-slate-200/90 bg-slate-50/70 hover:border-slate-300 hover:bg-white text-slate-800'
                  }`}
                >
                  <span
                    className={`rounded-full px-3.5 py-1 text-[11px] font-black ${
                      isSelected
                        ? 'bg-gold text-navy'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tier.badge}
                  </span>
                  <span className={`mt-3 text-xs sm:text-sm font-black ${isSelected ? 'text-white' : 'text-[#0f172a]'}`}>
                    {tier.tabLabel}
                  </span>
                  <span className={`mt-1.5 text-[11px] font-bold ${isSelected ? 'text-gold-light' : 'text-emerald-700'}`}>
                    معدل النمو: {tier.cagrGrowth}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Tier Spotlight Stage (Rich Twilight Navy Gradient, No Pitch Black) */}
          <div className="rounded-3xl border-2 border-gold/40 bg-gradient-to-br from-[#1a2947] via-[#131f37] to-[#0e182c] p-6 sm:p-10 text-white shadow-xl">
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              {/* Left: Die-stamped Plate Rendering Pedestal */}
              <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-4">
                <span className="text-[11px] font-black uppercase tracking-wider text-gold-light border border-gold/40 rounded-full px-4 py-1.5 bg-gold/15">
                  معاينة مواصفات الفئة المختارة
                </span>

                <div className="w-full flex justify-center py-4">
                  <PlateVisualizer
                    lettersAr={selectedTier.lettersAr}
                    lettersEn={selectedTier.lettersEn}
                    numbers={selectedTier.numbers}
                    large={true}
                    plateType={selectedTier.id === 'sports' ? 'small' : 'private'}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300">
                  <span className="flex items-center gap-1.5 font-bold text-white">
                    <CheckCircle2 size={15} className="text-emerald-400" />
                    أبعاد رسمية: {selectedTier.id === 'sports' ? '30.5 × 15.5 سم' : '52 × 11 سم'}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-gold-light font-bold">شعار السيفين والنخلة البارز</span>
                </div>
              </div>

              {/* Right: Detailed Characteristics */}
              <div className="lg:col-span-6 space-y-5">
                <div>
                  <span className="inline-block rounded-full bg-gold/20 px-4 py-1 text-xs font-black text-gold border border-gold/30">
                    {selectedTier.badge}
                  </span>
                  <h3 className="mt-2 text-xl sm:text-2xl font-black text-white">
                    {selectedTier.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {selectedTier.description}
                  </p>
                </div>

                {/* Specs Metric Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                    <span className="text-slate-400 block text-[11px]">مؤشر الندرة في المملكة</span>
                    <span className="mt-1 block font-bold text-gold text-xs sm:text-sm">
                      {selectedTier.scarcityIndex}
                    </span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                    <span className="text-slate-400 block text-[11px]">معدل النمو السنوي التقديري</span>
                    <span className="mt-1 block font-bold text-emerald-400 text-xs sm:text-sm">
                      {selectedTier.cagrGrowth}
                    </span>
                  </div>
                </div>

                {/* Profile & Fitment */}
                <div className="space-y-2.5 text-xs text-slate-300 border-t border-white/10 pt-4">
                  <div>
                    <strong className="text-white font-bold">الملف النموذجي للمقتني: </strong>
                    <span>{selectedTier.profile}</span>
                  </div>
                  <div>
                    <strong className="text-white font-bold">التناسب المثالي مع المركبات: </strong>
                    <span className="text-gold-light">{selectedTier.idealVehicle}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/plates"
                    className="btn btn-gold text-xs font-black py-3 px-6 shadow-md inline-flex items-center gap-2"
                  >
                    <span>استعراض لوحات هذه الفئة في الكتالوج</span>
                    <ArrowLeft size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 4. THE 5 SOVEREIGN PILLARS OF FBS (3 IN ROW 1, 2 IN ROW 2)        */}
        {/* ================================================================= */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            {/* High-contrast crisp badge on light background */}
            <span className="inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-[#131c31] text-[#faebd0] px-5 py-2 text-xs sm:text-sm font-bold shadow-xs">
              <BadgeCheck size={16} className="text-gold" />
              <span>معايير الحوكمة والسيادة</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0f172a]">
              الركائز الخمس للتفرد في فارس بن سعود
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] font-medium">
              المبادئ التشغيلية والتقنية الصارمة التي تجعل منصتنا الصرح الأكثر موثوقية وأماناً بالمملكة
            </p>
          </div>

          {/* 6-Column Grid Layout:
              Card 0, 1, 2 = lg:col-span-2 (3 cards in row 1, 100% full width)
              Card 3, 4 = lg:col-span-3 (2 cards in row 2, 100% full width) */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
            {pillarsList.map((pillar, idx) => {
              const Icon = pillar.icon;
              const isTopThree = idx < 3;
              return (
                <div
                  key={pillar.num}
                  className={`group relative flex flex-col justify-between rounded-3xl border-2 border-slate-200/90 bg-white p-7 sm:p-8 shadow-sm hover:border-gold/70 hover:shadow-lg transition-all ${
                    isTopThree
                      ? 'lg:col-span-2'
                      : idx === 4
                        ? 'md:col-span-2 lg:col-span-3'
                        : 'lg:col-span-3'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/70 border border-amber-200/70 text-navy shadow-xs group-hover:bg-gold/20 transition-colors">
                        <Icon className="w-6 h-6 text-navy" />
                      </span>
                      <span className="font-norwester text-sm font-black text-slate-400 group-hover:text-navy transition-colors">
                        {pillar.num}
                      </span>
                    </div>

                    <span className="mt-4 inline-block text-[11px] font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
                      {pillar.subtitle}
                    </span>

                    <h3 className="mt-2 text-lg font-black text-[#0f172a] group-hover:text-navy transition-colors">
                      {pillar.title}
                    </h3>

                    <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#334155] font-medium">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-navy border border-slate-200 px-3.5 py-1.5 font-bold shadow-xs">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      <span>{pillar.badge}</span>
                    </span>
                    <span className="font-norwester text-[11px] font-bold text-slate-500">
                      {pillar.stats}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================================================================= */}
        {/* 5. INTERACTIVE INVESTMENT APPRECIATION ESTIMATOR                   */}
        {/* ================================================================= */}
        <section className="rounded-3xl border-2 border-slate-200/90 bg-white p-7 sm:p-12 shadow-md space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              {/* High-contrast crisp badge on light background */}
              <span className="inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-[#131c31] text-[#faebd0] px-5 py-2 text-xs sm:text-sm font-bold shadow-xs">
                <TrendingUp size={16} className="text-gold" />
                <span>التحليل المالي والجدوى الاستثمارية</span>
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-black text-[#0f172a]">
                حاسبة ومؤشر نمو قيمة اللوحات النادرة
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#475569] font-medium">
                محاكاة استرشادية مبنية على البيانات التاريخية لنمو أسعار اللوحات السعودية المميزة
              </p>
            </div>

            <div className="text-xs text-slate-500 font-semibold max-w-xs">
              * مبني على تداولات السوق السعودي وحسابات الندرة الفعلية بين 2018 و2026.
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-center">
            {/* Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <label className="block text-xs font-black text-[#0f172a] mb-2.5">
                  1. اختر فئة اللوحة الاستثمارية:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {plateTiers.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTierId(t.id)}
                      className={`rounded-xl border p-3 text-xs font-bold transition-all text-start ${
                        selectedTierId === t.id
                          ? 'border-navy bg-navy text-gold shadow-sm'
                          : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700'
                      }`}
                    >
                      <span>{t.tabLabel.split('(')[0]}</span>
                      <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                        نمو سنوي: {t.cagrGrowth}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-black text-[#0f172a] mb-2.5">
                  <span>2. رأس المال المبدئي المستثمر في اللوحة:</span>
                  <span className="font-norwester text-sm font-black text-navy" dir="ltr">
                    {formatEnglishAmount(initialInvestment * 100)} SAR
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[250000, 500000, 1000000, 2500000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setInitialInvestment(amt)}
                      className={`rounded-xl border py-2.5 text-center text-xs font-black transition-all ${
                        initialInvestment === amt
                          ? 'border-navy bg-navy text-white ring-1 ring-navy'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {amt >= 1000000 ? `${amt / 1000000} مليون` : `${amt / 1000} ألف`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-black text-[#0f172a] mb-2.5">
                  <span>3. أفق الاقتناء والاحتفاظ (مدة الاستثمار):</span>
                  <span className="font-norwester text-sm font-black text-navy">{horizonYears} سنوات</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[3, 5, 10].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setHorizonYears(yr)}
                      className={`rounded-xl border py-2.5 text-center text-xs font-black transition-all ${
                        horizonYears === yr
                          ? 'border-navy bg-navy text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {yr} سنوات
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Projection Dashboard Card (Rich Twilight Navy Gradient, No Pitch Black) */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl border-2 border-gold/40 bg-gradient-to-br from-[#182643] via-[#121d33] to-[#0e1729] p-6 sm:p-8 text-white shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-xs font-bold text-gold flex items-center gap-2">
                    <TrendingUp size={16} />
                    <span>نتائج المحاكاة التقديرية</span>
                  </span>
                  <span className="rounded-full bg-emerald-500/20 px-3.5 py-1 text-[11px] font-bold text-emerald-300 border border-emerald-500/30">
                    فئة أصول نادرة ومحمية
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block">القيمة السوقية التقديرية المتوقعة بعد {horizonYears} سنوات</span>
                  <div className="mt-1 flex items-baseline gap-2 font-norwester text-3xl sm:text-4xl font-black text-gold tracking-tight" dir="ltr">
                    <span>{formatEnglishAmount(estimatedFinalValue * 100)}</span>
                    <SarSymbol className="w-6 h-6 text-gold" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">صافي النمو الرأسمالي المتوقع</span>
                    <div className="mt-1 flex items-baseline gap-1 font-norwester text-lg font-black text-emerald-400" dir="ltr">
                      <span>+{formatEnglishAmount(estimatedNetGain * 100)}</span>
                      <SarSymbol className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">معدل العائد التراكمي الإجمالي</span>
                    <span className="mt-1 block font-norwester text-lg font-black text-white">
                      +{Math.round((estimatedNetGain / initialInvestment) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-[11px] text-slate-300 leading-relaxed">
                  تعد اللوحات السعودية الاستثنائية أصولاً غير قابلة للاستنساخ، حيث يمنح النظام لوحة واحدة فقط لكل تشكيلة، ما يجعل عامل الندرة الحتمي درعاً يحمي قيمتها من عوامل التضخم.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 6. REGULATORY COMPLIANCE & ESCROW ARCHITECTURE                    */}
        {/* ================================================================= */}
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

        {/* ================================================================= */}
        {/* 7. FREQUENTLY ASKED QUESTIONS ABOUT FBS                           */}
        {/* ================================================================= */}
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

        {/* ================================================================= */}
        {/* 8. VIP PRIVATE DESK CTA BANNER: THE ROYAL ARCHITECTURAL PEDESTAL  */}
        {/* ================================================================= */}
        <section className="relative overflow-hidden rounded-3xl border-2 border-gold/45 bg-gradient-to-br from-[#162544] via-[#101b34] to-[#0c1527] p-8 sm:p-12 lg:p-14 text-white shadow-[0_30px_70px_-15px_rgba(16,23,40,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)]">
          {/* Subtle Royal Crest Watermark in corner */}
          <SaudiCrestSvg className="pointer-events-none absolute -bottom-12 -start-12 w-72 h-72 text-gold/[0.04] select-none" />

          {/* Ambient Glowing Aura */}
          <div className="pointer-events-none absolute -end-24 -top-24 h-72 w-72 rounded-full bg-gold/20 blur-[90px]" />
          <div className="pointer-events-none absolute bottom-0 start-1/3 h-56 w-56 rounded-full bg-blue-600/15 blur-[80px]" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Right Column: Narrative, Badge & Privileges */}
            <div className="space-y-4 max-w-2xl text-center lg:text-start">
              {/* Top Badge: Generous padding, perfectly balanced */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-gold/15 px-5 py-2 text-xs sm:text-sm font-black text-gold-light backdrop-blur-md shadow-xs">
                <Crown size={16} className="text-gold" />
                <span>المكتب الخاص لكبار الشخصيات • VIP Private Desk</span>
              </div>

              {/* Commanding Headline */}
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                هل تبحث عن لوحة نادرة غير معلنة أو ترغب في وساطة سرية خاصة؟
              </h3>

              {/* Rich Description with comfortable line height */}
              <p className="text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed font-normal">
                يقدم المكتب الخاص لدار فارس بن سعود خدمات الوساطة الحصرية لترتيب صفقات البيع والشراء المغلقة (Off-Market)، مع تقديم استشارات تسعيرية موثقة وحلول مصرفية ضامنة تحفظ سرية وخصوصية النخبة.
              </p>

              {/* Micro-perks list */}
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

            {/* Left Column: Stacked Equal-Sized Action Buttons with Status Indicator */}
            <div className="w-full lg:w-[360px] xl:w-[380px] shrink-0 space-y-3.5">
              {/* Button 1: WhatsApp Hotline (Equal Width & Full Touch Target) */}
              <a
                href="https://wa.me/966500000000"
                target="_blank"
                rel="noreferrer"
                className="btn btn-gold w-full py-4 px-6 text-sm font-black shadow-xl hover:shadow-gold/30 flex items-center justify-center gap-3 rounded-2xl transition-all"
              >
                <MessageCircle size={20} className="shrink-0" />
                <span>محادثة واتساب فورية للمكتب الخاص</span>
              </a>

              {/* Button 2: Call / Consultation Request (Equal Width & Matching Height) */}
              <Link
                href="/contact"
                className="btn w-full border-2 border-white/20 bg-white/10 text-white hover:bg-white/15 hover:border-gold/50 py-4 px-6 text-sm font-black flex items-center justify-center gap-3 rounded-2xl backdrop-blur-md shadow-lg transition-all"
              >
                <Phone size={18} className="shrink-0 text-gold-light" />
                <span>طلب اتصال استشاري من المكتب الخاص</span>
              </Link>

              {/* Real-time Advisor Availability Status */}
              <div className="pt-1.5 flex items-center justify-center gap-2 text-xs font-semibold text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                <span>مستشار المكتب الخاص متاح الآن للرد الفوري</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
