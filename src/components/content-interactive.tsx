'use client';

import { useState, useMemo, FormEvent } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Gavel,
  Award,
  Car,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  Search,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Building,
  ArrowLeft,
  Send,
  Lock,
  HelpCircle,
  FileText,
  BadgeCheck,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { sendJson } from './forms';

/* ========================================================================= */
/* 1. HOW IT WORKS: INTERACTIVE BUYER & SELLER JOURNEY                       */
/* ========================================================================= */

const buyerSteps = [
  {
    step: '1',
    title: 'استكشاف اللوحات ومعاينتها',
    description: 'تصفح تشكيلة اللوحات الأحادية والثنائية والنادرة بدقة عالية، مع محاكي القياسات والمواصفات الرسمية لوزارة الداخلية.',
    icon: Car,
    badge: 'معاينة واقعية 3D'
  },
  {
    step: '2',
    title: 'التسجيل وتوثيق الحساب',
    description: 'أنشئ حسابك وفعّل رقم جوالك لضمان الهوية الوطنية وموثوقية المزايدات في المنصة.',
    icon: ShieldCheck,
    badge: 'توثيق أمني'
  },
  {
    step: '3',
    title: 'إيداع تأمين المزاد',
    description: 'سدّد تأمين المزاد المحدد لكل لوحة، وهو مبلغ مسترد بالكامل 100% فور انتهاء المزاد في حال عدم الفوز.',
    icon: CreditCard,
    badge: 'مسترد 100%'
  },
  {
    step: '4',
    title: 'المزايدة في الصالة الحية',
    description: 'ادخل صالة المزاد الرقمية وتابع المزايدات بالثواني مع نظام حماية الثواني الأخيرة (Anti-Sniping) لمنع المباغتة.',
    icon: Gavel,
    badge: 'مزامنة فورية'
  },
  {
    step: '5',
    title: 'الترسية ونقل الملكية الفوري',
    description: 'عند انتهاء المزاد بفوزك، تُسدد القيمة عبر الحساب الضامن ويتم التنسيق لإتمام نقل الملكية رسميًا عبر منصة أبشر.',
    icon: Award,
    badge: 'نقل رسمي معتمد'
  }
];

const sellerSteps = [
  {
    step: '1',
    title: 'إدخال بيانات اللوحة',
    description: 'أدخل الحروف والأرقام ونوع اللوحة والمدينة، مع معاينة حية فورية تُطابق الواقع وتظهر ندرة اللوحة.',
    icon: Car,
    badge: 'معاينة فورية'
  },
  {
    step: '2',
    title: 'رفع إثبات الملكية الموثق',
    description: 'ارفع صورة استمارة المركبة أو برنت منصة أبشر في بيئة سحابية مشفرة بالكامل لا يطلع عليها سوى فريق التدقيق.',
    icon: Lock,
    badge: 'تشفير تام'
  },
  {
    step: '3',
    title: 'الفحص والتقييم الاستثماري',
    description: 'يتولى خبراء المنصة مراجعة السجل المروري ومطابقة البيانات وتحديد السعر الافتتاحي المقترح خلال أقل من 24 ساعة.',
    icon: BadgeCheck,
    badge: 'خلال 24 ساعة'
  },
  {
    step: '4',
    title: 'إطلاق المزاد والتسويق للنخبة',
    description: 'تُعرض اللوحة أمام شبكة حصرية من كبار المقتنين والمستثمرين في المملكة لضمان الوصول لأعلى قيمة سوقية.',
    icon: TrendingUp,
    badge: 'وصول استثنائي'
  },
  {
    step: '5',
    title: 'تحصيل العوائد ونقل الملكية',
    description: 'بعد انتهاء المزاد، يتم تحصيل المبلغ في حساب الضامن وتحويله لحسابك البنكي فور اكتمال نقل اللوحة للمشتري.',
    icon: Award,
    badge: 'ضمان التحصيل'
  }
];

export function HowItWorksInteractive() {
  const [activeTab, setActiveTab] = useState<'buyer' | 'seller'>('buyer');
  const steps = activeTab === 'buyer' ? buyerSteps : sellerSteps;

  return (
    <div className="space-y-12">
      {/* Tab Switcher */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-2xl border border-line bg-white p-1.5 shadow-sm">
          <button
            onClick={() => setActiveTab('buyer')}
            className={`flex items-center gap-2 rounded-xl px-6 py-3 text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'buyer'
                ? 'bg-navy text-gold shadow-md'
                : 'text-muted hover:text-navy'
            }`}
          >
            <Gavel size={16} />
            <span>رحلة المزايد والمشتري</span>
          </button>
          <button
            onClick={() => setActiveTab('seller')}
            className={`flex items-center gap-2 rounded-xl px-6 py-3 text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'seller'
                ? 'bg-navy text-gold shadow-md'
                : 'text-muted hover:text-navy'
            }`}
          >
            <Award size={16} />
            <span>رحلة البائع والمالك</span>
          </button>
        </div>
      </div>

      {/* Step Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {steps.map((s, index) => {
          const Icon = s.icon;
          return (
            <div
              key={s.step}
              className="group relative flex flex-col justify-between rounded-2xl border border-line bg-white p-6 shadow-sm hover:border-gold/50 hover:shadow-md transition-all"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 font-norwester text-lg font-black text-gold-accent group-hover:bg-gold group-hover:text-navy transition-colors">
                    {s.step}
                  </span>
                  <span className="rounded-full border border-line bg-paper px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                    {s.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-navy group-hover:text-gold-accent transition-colors">
                  {s.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {s.description}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 border-t border-line/60 pt-4 text-[11px] font-bold text-slate-400">
                <Icon size={14} className="text-gold-accent" />
                <span>الخطوة رقم {s.step} من 5</span>
              </div>
            </div>
          );
        })}

        {/* Action Callout Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-gold/40 bg-gradient-to-br from-navy to-navy-dark p-6 text-white shadow-xl">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1 text-xs font-bold text-gold">
              <Sparkles size={14} />
              جاهز للبدء؟
            </span>
            <h3 className="mt-4 text-lg font-black text-white">
              {activeTab === 'buyer'
                ? 'استكشف مزادات النخبة الآن'
                : 'اعرض لوحتك أمام المستثمرين'}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              {activeTab === 'buyer'
                ? 'انضم لأكثر من 10,000 مقتنٍ وشارك في المزايدات الحية لأندر اللوحات السعودية.'
                : 'احصل على أعلى عائد للوحتك مع سرية تامة وضمانات مالية معتمدة.'}
            </p>
          </div>

          <div className="mt-6">
            {activeTab === 'buyer' ? (
              <Link
                href="/catalog"
                className="btn btn-gold w-full text-xs font-bold shadow-md"
              >
                <span>تصفح اللوحات والمزادات</span>
                <ArrowLeft size={15} />
              </Link>
            ) : (
              <Link
                href="/sell-your-plate"
                className="btn btn-gold w-full text-xs font-bold shadow-md"
              >
                <span>اعرض لوحتك للبيع</span>
                <ArrowLeft size={15} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="rounded-2xl border border-line bg-paper p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-start">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md">
            <ShieldCheck size={28} />
          </span>
          <div>
            <h4 className="text-sm font-bold text-navy">
              ضمانات نظامية ومالية كاملة تحت إشراف متخصص
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              تتم جميع التسويات المالية عبر حسابات مصرفية ضامنة (Escrow)، ولا يتم تسليم المقابل المالي إلا بعد إتمام نقل الملكية رسميًا عبر القنوات الحكومية المعتمدة لوزارة الداخلية ومنصة أبشر.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* 2. FAQ: INTERACTIVE CATEGORIZED ACCORDION                                 */
/* ========================================================================= */

type FaqItem = {
  q: string;
  a: string;
  category: 'auctions' | 'selling' | 'payments' | 'transfer';
};

const faqData: FaqItem[] = [
  {
    q: 'كيف يمكنني المشاركة في مزادات اللوحات الحية؟',
    a: 'للمشاركة في المزاد الحي، يلزم إنشاء حساب وتوثيقه، ثم دفع قيمة التأمين المالي المحددة للمزاد المعني. بعد قبول التأمين، يمكنك الدخول لصالة المزاد وتقديم المزايدات في الوقت الفعلي.',
    category: 'auctions'
  },
  {
    q: 'ما هو نظام مكافحة القنص (Anti-Sniping) في المزادات؟',
    a: 'هو نظام آلي يمدد وقت المزاد تلقائيًا بدقيقة أو دقيقتين إضافيتين في حال تقديم أي مزايدة خلال الثواني الأخيرة، وذلك لإتاحة فرصة عادلة لجميع المزايدين للرد ومنع خطف اللوحات بطرق برمجية.',
    category: 'auctions'
  },
  {
    q: 'ما هي قيمة تأمين المزاد وهل هو مسترد؟',
    a: 'تُحدد قيمة التأمين بشكل مستقل لكل مزاد بحسب القيمة التقديرية للوحة. هذا التأمين مسترد بالكامل 100% لجميع المشاركين الذين لم يفوزوا باللوحة فور انتهاء المزاد مباشرة دون أي خصومات.',
    category: 'payments'
  },
  {
    q: 'كيف أعرض لوحتي للبيع في منصة فارس بن سعود؟',
    a: 'توجه إلى صفحة «اعرض لوحتك»، وأدخل حروف وأرقام اللوحة ونوعها، ثم ارفع مستند إثبات الملكية (استمارة المركبة أو برنت أبشر). يتولى فريقنا مراجعة الطلب واعتماده خلال 24 ساعة عمل.',
    category: 'selling'
  },
  {
    q: 'هل توجد رسوم على عرض اللوحة في المنصة؟',
    a: 'التقديم وعرض اللوحة للمراجعة مجاني بالكامل. يتم الاتفاق مع المالك على عمولة وساطة ثابتة أو نسبة محددة يتم خصمها فقط عند إتمام البيع بنجاح وترسية المزاد.',
    category: 'selling'
  },
  {
    q: 'كيف تتم عملية نقل ملكية اللوحة بعد الفوز؟',
    a: 'يقوم فريق العمليات في المنصة بالتواصل المباشر مع البائع والمشتري للتنسيق وإتمام إجراءات نقل الملكية الرسمية عبر منصة أبشر أو فروع المرور المعتمدة بأعلى معايير السرعة والموثوقية.',
    category: 'transfer'
  },
  {
    q: 'هل يمكنني الاحتفاظ باللوحة دون إسقاطها على سيارة حاليًا؟',
    a: 'تخضع إجراءات الاحتفاظ والنقل لضوابط الإدارة العامة للمرور في المملكة العربية السعودية، حيث يمكن نقلها على مركبة أخرى يملكها المشتري مباشرة وفق النظام المتبع.',
    category: 'transfer'
  },
  {
    q: 'ما الذي يضمن حقوقي المالية كمشتري أو كبائع؟',
    a: 'تعتمد المنصة آلية الحساب الضامن (Escrow). يبقى مبلغ الشراء محجوزًا لدى المنصة ولا يتم تحويله للبائع إلا بعد تأكيد استلام المشتري للوحة ونقل ملكيتها رسميًا في السجلات المرورية.',
    category: 'payments'
  }
];

export function FaqInteractive() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = [
    { id: 'all', label: 'جميع الأسئلة' },
    { id: 'auctions', label: 'المزادات والمزايدة' },
    { id: 'selling', label: 'بيع وعرض اللوحات' },
    { id: 'payments', label: 'الدفع والتأمين المسترد' },
    { id: 'transfer', label: 'نقل الملكية والمرور' }
  ];

  const filteredFaqs = useMemo(() => {
    return faqData.filter((item) => {
      const matchesCat = activeCategory === 'all' || item.category === activeCategory;
      const matchesQuery =
        !searchQuery.trim() ||
        item.q.includes(searchQuery) ||
        item.a.includes(searchQuery);
      return matchesCat && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search and Category Filters */}
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث في الأسئلة الشائعة (مثال: التأمين، نقل الملكية، المزايدة)…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border-2 border-slate-200 bg-white py-4 ps-12 pe-4 text-sm font-semibold text-[#0f172a] shadow-sm transition-all placeholder:text-slate-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
          <Search size={20} className="absolute start-4 top-4 text-gold-accent" />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-200 ${
                activeCategory === c.id
                  ? 'border-2 border-gold bg-gradient-to-r from-navy to-navy-dark text-gold shadow-md'
                  : 'border-2 border-slate-200 bg-white text-slate-600 hover:border-gold/50 hover:text-navy'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      {filteredFaqs.length > 0 ? (
        <div className="space-y-3.5">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="overflow-hidden rounded-3xl border-2 border-slate-200/90 bg-white shadow-xs transition-all duration-200 hover:border-gold/60 hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-start transition-colors"
                >
                  <span className="flex items-center gap-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold-accent">
                      <HelpCircle size={18} />
                    </span>
                    <span className="text-sm sm:text-base font-black text-[#0f172a]">
                      {faq.q}
                    </span>
                  </span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-gold text-navy' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <ChevronDown size={16} />
                  </span>
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 bg-[#fbfcfd] p-5 sm:p-6 text-xs sm:text-sm leading-relaxed text-[#334155] font-normal">
                    <p>{faq.a}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-200/60 pt-3 text-[11px] text-slate-500">
                      <span className="font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 size={13} /> إجابة معتمدة رسمياً
                      </span>
                      <span className="rounded-full bg-slate-200/80 px-2.5 py-0.5 font-bold text-slate-700">
                        {categories.find((c) => c.id === faq.category)?.label ?? 'عام'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white p-10 text-center text-sm font-medium text-slate-500">
          لا توجد نتائج مطابقة لبحثك. حاول استخدام كلمات بحث أخرى أو تواصل مباشرة مع المكتب الخاص.
        </div>
      )}

      {/* Need Help Box */}
      <div className="rounded-3xl border-2 border-gold/40 bg-gradient-to-br from-[#060b17] via-[#0d162a] to-[#101b33] p-7 text-white shadow-xl sm:flex sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1 text-xs font-bold text-gold">
            <Sparkles size={14} />
            خدمة كبار الشخصيات VIP
          </span>
          <h4 className="mt-3 text-base sm:text-lg font-black text-white">لم تجد إجابة لاستفسارك؟</h4>
          <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-xl font-normal leading-relaxed">
            فريق المستشارين في المكتب الخاص متاح للرد الفوري وتقديم الدعم في إجراءات المزايدة أو التقييم ونقل الملكية.
          </p>
        </div>
        <div className="mt-5 sm:mt-0 shrink-0">
          <a
            href="https://wa.me/966500000000"
            target="_blank"
            rel="noreferrer"
            className="btn btn-gold text-xs sm:text-sm font-black shadow-lg"
          >
            <MessageCircle size={17} />
            <span>محادثة واتساب فورية</span>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* 3. CONTACT: VIP CONCIERGE & DIRECT INQUIRY DESK                           */
/* ========================================================================= */

export function ContactInteractive() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ message: string; isError?: boolean } | null>(null);

  async function handleContactSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const data = Object.fromEntries(new FormData(e.currentTarget));
      await sendJson('/api/v1/contact', data);
      setStatus({
        message: 'تم استلام استفسارك بنجاح. سيتواصل معك مستشار المكتب الخاص في أقرب وقت.'
      });
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setStatus({
        message: err instanceof Error ? err.message : 'تعذر إرسال الرسالة. يرجى تسجيل الدخول أولاً أو التواصل عبر واتساب.',
        isError: true
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Right Column: Direct VIP Cards */}
      <div className="space-y-4 lg:col-span-5">
        <div className="rounded-3xl border-2 border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-bold text-gold-accent">
              <Sparkles size={14} />
              المكتب الخاص
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              مستشار متاح الآن
            </span>
          </div>

          <h3 className="mt-4 text-lg font-black text-[#0f172a]">
            قنوات التواصل المباشرة
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-500 font-normal">
            يسعدنا استقبال اتصالاتكم واستفساراتكم حول اللوحات المعروضة أو المزادات القادمة أو طلبات الوساطة الخاصة.
          </p>

          <div className="mt-6 space-y-3.5 text-xs">
            {/* WhatsApp VIP */}
            <a
              href="https://wa.me/966500000000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3.5 rounded-2xl border-2 border-emerald-200 bg-emerald-50/70 p-4 font-bold text-navy hover:border-emerald-400 hover:bg-emerald-50 transition-all shadow-xs"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                <MessageCircle size={20} />
              </span>
              <div className="flex-1">
                <p className="text-[11px] text-emerald-800 font-semibold">محادثة واتساب كبار الشخصيات (24/7)</p>
                <p className="text-sm font-black text-navy" dir="ltr">+966 50 000 0000</p>
              </div>
            </a>

            {/* Direct Phone */}
            <div className="flex items-center gap-3.5 rounded-2xl border-2 border-slate-200/80 bg-slate-50/80 p-4 text-[#0f172a]">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy text-gold shadow-sm">
                <Phone size={18} />
              </span>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">الهاتف الموحد المعتمد</p>
                <p className="text-sm font-black" dir="ltr">9200 00000</p>
              </div>
            </div>

            {/* Direct Email */}
            <div className="flex items-center gap-3.5 rounded-2xl border-2 border-slate-200/80 bg-slate-50/80 p-4 text-[#0f172a]">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy text-gold shadow-sm">
                <Mail size={18} />
              </span>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">البريد الإلكتروني المعتمد</p>
                <p className="text-sm font-black" dir="ltr">concierge@fbs.sa</p>
              </div>
            </div>

            {/* Direct Address */}
            <div className="flex items-center gap-3.5 rounded-2xl border-2 border-slate-200/80 bg-slate-50/80 p-4 text-[#0f172a]">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy text-gold shadow-sm">
                <MapPin size={18} />
              </span>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">المقر الرئيسي</p>
                <p className="text-xs font-bold leading-relaxed">طريق الملك فهد، برج النخبة، الرياض، المملكة العربية السعودية</p>
              </div>
            </div>
          </div>
        </div>

        {/* Working Hours Card */}
        <div className="rounded-3xl border-2 border-slate-200/90 bg-white p-5 text-xs text-slate-600 shadow-sm">
          <div className="flex items-center gap-2 font-black text-navy">
            <Clock size={16} className="text-gold-accent" />
            <span>ساعات العمل الرسمية</span>
          </div>
          <div className="mt-3 space-y-1.5 text-xs leading-relaxed">
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="font-semibold text-navy">من الأحد إلى الخميس:</span>
              <span className="text-slate-500">9:00 ص – 6:00 م</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="font-semibold text-navy">صالة المزادات والدعم الطارئ:</span>
              <span className="font-bold text-emerald-700">على مدار الساعة 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Left Column: Inquiry Submission Form */}
      <div className="rounded-3xl border-2 border-slate-200/90 bg-white p-7 sm:p-9 shadow-sm lg:col-span-7">
        <h3 className="text-xl font-black text-[#0f172a]">أرسل استفسارك أو طلب وساطة خاصة</h3>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
          سواء كنت ترغب في الاستفسار عن لوحة محددة، أو ترغب في وساطة خاصة لبيع أو شراء لوحة نادرة، املأ النموذج أدناه وسيتولى مستشارنا التواصل معك.
        </p>

        <form onSubmit={handleContactSubmit} className="mt-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-navy mb-1.5">
                الاسم الكامل
              </label>
              <input
                id="name"
                name="name"
                required
                minLength={2}
                maxLength={120}
                placeholder="الاسم الثلاثي أو اسم المنشأة"
                className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#0f172a] shadow-xs focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-navy mb-1.5">
                رقم الجوال
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                dir="ltr"
                placeholder="+966 5x xxx xxxx"
                className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#0f172a] shadow-xs focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="city" className="block text-xs font-bold text-navy mb-1.5">
                المدينة
              </label>
              <input
                id="city"
                name="city"
                required
                placeholder="الرياض، جدة، الخبر…"
                className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#0f172a] shadow-xs focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-navy mb-1.5">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                dir="ltr"
                placeholder="name@example.com"
                className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#0f172a] shadow-xs focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-xs font-bold text-navy mb-1.5">
              موضوع الرسالة
            </label>
            <input
              id="subject"
              name="subject"
              required
              minLength={3}
              maxLength={200}
              placeholder="مثال: استفسار عن لوحة أحادية / طلب وساطة خاصة"
              className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#0f172a] shadow-xs focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-xs font-bold text-navy mb-1.5">
              نص الرسالة أو تفاصيل الطلب
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              minLength={10}
              maxLength={5000}
              placeholder="اكتب استفسارك هنا بالتفصيل (مثل: حروف وأرقام اللوحة المطلوبة، الميزانية، أو أي تفاصيل تفيدنا في خدمتك)…"
              className="w-full rounded-2xl border-2 border-slate-200 bg-white p-4 text-sm font-medium leading-relaxed text-[#0f172a] shadow-xs focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
            />
          </div>

          {status && (
            <div
              role={status.isError ? 'alert' : 'status'}
              className={`rounded-2xl border p-4 text-xs sm:text-sm font-semibold leading-relaxed ${
                status.isError
                  ? 'border-red-200 bg-red-50 text-red-800'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-800'
              }`}
            >
              {status.message}
            </div>
          )}

          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
            <Lock size={14} className="text-gold-accent shrink-0" />
            <span>بياناتك محمية بسرية تامة ولا تتم مشاركتها مع أي جهة خارجية.</span>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="btn btn-gold w-full py-4 text-sm font-black shadow-lg"
          >
            {busy ? (
              <span className="flex items-center gap-2">
                <Clock size={16} className="animate-spin" />
                جارٍ إرسال الرسالة…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Send size={16} />
                <span>إرسال الرسالة إلى مستشار المكتب الخاص</span>
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* 4. ABOUT: PRESTIGE EDITORIAL STORY & PILLARS                              */
/* ========================================================================= */

export function AboutInteractive() {
  const pillars = [
    {
      step: '01',
      title: 'النخبوية والندرة المطلقة',
      description: 'نطبق معايير فرز دقيقة تقبل فقط اللوحات الأحادية والثنائية والنادرة التي تمثل تحفة اقتنائية وقيمة استثمارية متنامية في السوق السعودي.',
      icon: Award,
      badge: 'انتقائية 100%'
    },
    {
      step: '02',
      title: 'الموثوقية والشفافية القانونية',
      description: 'جميع اللوحات المعروضة تخضع لتدقيق مروري صارم للتحقق من هوية المالك وسجل المركبة، بإشراف قانوني كامل وربط مع الأنظمة المعتمدة.',
      icon: ShieldCheck,
      badge: 'تدقيق نظامي'
    },
    {
      step: '03',
      title: 'الحماية المالية بنظام الضامن (Escrow)',
      description: 'نظام مدفوعات وتأمين يحفظ أموال البائع والمشتري في حسابات مصرفية مخصصة، ولا يتم الإفراج عنها إلا بعد اكتمال نقل الملكية بنجاح.',
      icon: Lock,
      badge: 'حساب ضامن'
    },
    {
      step: '04',
      title: 'تقنية المزادات اللحظية العالمية',
      description: 'بنية رقمية فائقة السرعة تتيح المزايدة الحية دون تأخير زمني، مع خوارزميات مضادة للقنص لحماية المنافسة النزيهة بين المقتنين.',
      icon: Gavel,
      badge: 'مكافحة القنص'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Vision & Mission Split Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Vision Card */}
        <div className="rounded-3xl border-2 border-slate-200/90 bg-white p-7 sm:p-9 shadow-sm hover:border-gold/60 transition-all">
          <div className="flex items-center justify-between gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/60 border border-amber-200/60 text-gold-accent shadow-xs">
              <Sparkles size={24} />
            </span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold text-gold-accent border border-amber-200/60">
              رؤية المنصة
            </span>
          </div>
          <h3 className="mt-5 text-xl font-black text-[#0f172a] sm:text-2xl">
            الريادة في صياغة تجربة اقتناء اللوحات المميزة
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-[#334155] font-medium">
            تأسست منصة <strong className="font-bold text-[#0f172a]">فارس بن سعود للوحات المميزة</strong> لتكون الصرح الأكثر احترافية وموثوقية في المملكة العربية السعودية، حيث نجمع بين شغف التميز وأحدث التقنيات الرقمية المتقدمة لتقديم تجربة مزاد تضاهي كبرى دور المزادات العالمية.
          </p>
        </div>

        {/* Mission Card */}
        <div className="rounded-3xl border-2 border-slate-200/90 bg-white p-7 sm:p-9 shadow-sm hover:border-gold/60 transition-all">
          <div className="flex items-center justify-between gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/60 border border-amber-200/60 text-gold-accent shadow-xs">
              <TrendingUp size={24} />
            </span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold text-gold-accent border border-amber-200/60">
              رسالتنا وقيمنا
            </span>
          </div>
          <h3 className="mt-5 text-xl font-black text-[#0f172a] sm:text-2xl">
            حفظ الحقوق وابتكار بيئة تداول آمنة وسرية
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-[#334155] font-medium">
            ندرك أن لوحة المركبة لم تعد مجرد أرقام تعريفية، بل هي رمز للهوية والوجاهة واستثمار طويل الأجل. نلتزم بتوفير بيئة تداول آمنة، تحفظ حقوق البائع والمشتري بكل سرية وشفافية، وفق الأنظمة والقوانين المعتمدة لوزارة الداخلية ومنصة أبشر.
          </p>
        </div>
      </div>

      {/* Prestige Stats Strip */}
      <div className="rounded-3xl border-2 border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-slate-100">
          <div className="text-center pt-4 sm:pt-0">
            <span className="font-norwester text-3xl font-black text-[#c59a3f] sm:text-4xl tracking-tight">
              100%
            </span>
            <h4 className="mt-1.5 text-xs font-black text-[#0f172a]">نقل موثق ومعتمد</h4>
            <p className="mt-0.5 text-[11px] text-[#475569] font-medium">عبر القنوات الرسمية لمنصة أبشر</p>
          </div>
          <div className="text-center pt-4 sm:pt-0">
            <span className="font-norwester text-3xl font-black text-[#c59a3f] sm:text-4xl tracking-tight">
              +10,000
            </span>
            <h4 className="mt-1.5 text-xs font-black text-[#0f172a]">مقتنٍ ومستثمر مسجل</h4>
            <p className="mt-0.5 text-[11px] text-[#475569] font-medium">قاعدة عملاء حصرية ونخبوية</p>
          </div>
          <div className="text-center pt-4 sm:pt-0">
            <span className="font-norwester text-3xl font-black text-[#c59a3f] sm:text-4xl tracking-tight">
              &lt; 24h
            </span>
            <h4 className="mt-1.5 text-xs font-black text-[#0f172a]">اعتماد وفحص سريع</h4>
            <p className="mt-0.5 text-[11px] text-[#475569] font-medium">مراجعة وثائق الملكية باحترافية</p>
          </div>
          <div className="text-center pt-4 sm:pt-0">
            <span className="font-norwester text-3xl font-black text-[#c59a3f] sm:text-4xl tracking-tight">
              24/7
            </span>
            <h4 className="mt-1.5 text-xs font-black text-[#0f172a]">مزادات حية ودعم مستمر</h4>
            <p className="mt-0.5 text-[11px] text-[#475569] font-medium">مكتب خاص لخدمة كبار الشخصيات</p>
          </div>
        </div>
      </div>

      {/* 4 Core Pillars Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/60 bg-amber-50/80 px-4 py-1.5 text-xs font-black text-gold-accent">
            <BadgeCheck size={14} />
            <span>معايير الجودة والضمان</span>
          </span>
          <h3 className="mt-3 text-2xl font-black text-[#0f172a]">ركائز التفرد في فارس بن سعود</h3>
          <p className="mt-1.5 text-xs sm:text-sm text-[#475569] font-medium">
            المبادئ الأساسية الأربعة التي تضمن لك تجربة اقتناء واستثمار نخبوية لا تضاهى
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="group relative rounded-3xl border-2 border-slate-200/90 bg-white p-7 shadow-sm hover:border-gold/60 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/60 border border-amber-200/60 text-gold-accent shadow-xs group-hover:bg-gold/20 transition-colors">
                      <Icon size={22} />
                    </span>
                    <span className="font-norwester text-xs font-black text-slate-400">
                      {p.step}
                    </span>
                  </div>
                  <h4 className="mt-4 text-base font-black text-[#0f172a] group-hover:text-gold-accent transition-colors">
                    {p.title}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-[#334155] font-medium">
                    {p.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-[#0f172a]">
                    <CheckCircle2 size={12} className="text-emerald-600" />
                    <span>{p.badge}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Royal Seal Bottom Banner */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-gold/40 bg-gradient-to-r from-[#060b17] via-[#091224] to-[#0f1d38] p-8 sm:p-10 text-white shadow-2xl">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gold/20 border border-gold/40 text-gold shadow-md">
              <ShieldCheck size={28} />
            </span>
            <div>
              <span className="inline-block rounded-full bg-gold/20 px-3 py-1 text-[11px] font-bold text-gold border border-gold/30">
                منصة وطنية مرخصة بمعايير نقدية
              </span>
              <h4 className="mt-2 text-lg sm:text-xl font-black text-white">
                جميع التعاملات مطابقة للأنظمة المرورية المعتمدة في المملكة
              </h4>
              <p className="mt-1 text-xs text-slate-300 font-medium leading-relaxed max-w-xl">
                نلتزم بأعلى معايير الحوكمة المالية ونظام الضامن المعتمد لضمان تسليم اللوحات ونقل الملكية رسمياً عبر منصة أبشر بأمان تام.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href="/"
              className="btn btn-gold py-3 px-6 text-xs font-black shadow-lg"
            >
              استكشف المزادات الحية
            </Link>
            <Link
              href="/contact"
              className="btn border border-white/20 bg-white/10 text-white py-3 px-6 text-xs font-black hover:bg-white/20 backdrop-blur-xs transition-colors"
            >
              تواصل مع المكتب الخاص
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
