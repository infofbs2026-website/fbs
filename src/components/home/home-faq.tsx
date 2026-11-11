import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { ScrollReveal, StaggerGrid } from '@/components/home-motion';

const faqCol1 = [
  {
    id: '01',
    category: 'المزادات والمزايدة',
    q: 'كيف أشارك في مزادات اللوحات؟ وما هي شروط الأهلية؟',
    a: 'يتطلب الاشتراك توثيق حسابك بالهوية وحجز تفويض تأمين المزاد (Hold) بنكياً دون خصم من رصيدك. فور اعتماد التفويض، يمكنك المزايدة فوراً في الصالة الحية.',
    badge: 'توثيق رسمي وتأمين بنكي فوري'
  },
  {
    id: '02',
    category: 'الضمان المالي والتأمين',
    q: 'ما هو مصير مبلغ التأمين لغير الفائزين؟ ومتى يُفك الحجز؟',
    a: 'يُفك الحجز البنكي المؤقت (Void) آلياً وفور انتهاء المزاد مباشرة لكافة المزايدين دون أي استقطاع، ليعود الرصيد متاحاً في حسابك دون تأخير.',
    badge: 'إلغاء حجز فوري 100% دون استقطاع'
  },
  {
    id: '03',
    category: 'التوثيق والتحقق',
    q: 'كيف تضمن المنصة صحة ملكية اللوحة وخلوها من الموانع؟',
    a: 'يتم التحقق رسمياً من سريان الاستمارة ومطابقة بيانات المالك، والتأكد من خلو اللوحة تماماً من أي بلاغات، حجوزات قضائية، أو قيود قبل نشرها.',
    badge: 'فحص وتدقيق نظامي شامل للملكية'
  },
  {
    id: '04',
    category: 'المزادات والمزايدة',
    q: 'ما هي ميزة منع القنص (Anti-Sniping) في اللحظات الأخيرة؟',
    a: 'عند تقديم أي مزايدة في آخر دقيقتين من المزاد، يُمدد الوقت تلقائياً لدقيقتين إضافيتين لضمان تكافؤ الفرص ومنع عروض الثواني الأخيرة المباغتة.',
    badge: 'تمديد ذكي لمنع القنص'
  },
  {
    id: '05',
    category: 'نقل الملكية والمرور',
    q: 'كيف تتم إجراءات نقل الملكية رسمياً؟ وهل يلزم مراجعة المرور؟',
    a: 'تتم الإجراءات دون الحاجة لمراجعة فروع المرور عبر شبكة المعارض المعتمدة الشريكة؛ ويتولى فريقنا إصدار رخصة السير (الاستمارة) وتسليمها لك مباشرة.',
    badge: 'نقل رسمي دون مراجعة فروع المرور'
  }
];

const faqCol2 = [
  {
    id: '06',
    category: 'الضمان المالي والتأمين',
    q: 'كيف يحمي حساب الضمان (Escrow) قيمة اللوحة حتى استلامها؟',
    a: 'تُحفظ قيمة الصفقة في حساب بنكي ضامن محمي، ولا تُحوّل للبائع إلا بعد إتمام نقل الملكية رسمياً باسم المشتري وصدور الاستمارة المحدثة.',
    badge: 'حساب ضمان Escrow بنكي معتمد'
  },
  {
    id: '07',
    category: 'البائعون وعرض اللوحات',
    q: 'كيف يمكنني عرض لوحتي للبيع أو المزاد؟ وما هي الرسوم؟',
    a: 'قدّم طلبك عبر صفحة «اعرض لوحتك» بصورة الاستمارة. يتم التقييم خلال 24 ساعة دون رسوم مسبقة، وتُستحق عمولة المنصة فقط عند إتمام البيع بنجاح.',
    badge: 'بدون أي رسوم مسبقة وتقييم خلال 24 ساعة'
  },
  {
    id: '08',
    category: 'السياسات والالتزامات',
    q: 'ماذا يحدث في حال فوز مزايد وتخلّفه عن سداد القيمة؟',
    a: 'يُمنح الفائز مهلة 48 ساعة للسداد؛ وفي حال التخلف يُصادر مبلغ التأمين كشرط جزائي لتعويض البائع، وتُعرض اللوحة على المزايد التالي أو تُجدول مجدداً.',
    badge: 'انضباط سوقي ملزم لحماية الجدية'
  },
  {
    id: '09',
    category: 'فئات اللوحات والرموز',
    q: 'ما هي فئات وتصنيفات اللوحات المعتمدة في مزادات المنصة؟',
    a: 'نختص باللوحات السعودية الفاخرة المعتمدة رسمياً: الخصوصي (أحادية، ثنائية، وثلاثية)، النقل الخاص، الدراجات النارية، واللوحات ذات الشعارات المعتمدة.',
    badge: 'كافة الفئات المصرحة رسمياً'
  },
  {
    id: '10',
    category: 'السرية والخصوصية',
    q: 'هل بيانات المزايدين ومعلوماتهم الشخصية مشفرة وسرية؟',
    a: 'نعم؛ تُعرض المزايدات بأسماء رمزية مشفرة (مثل: مزايد #582) لضمان الخصوصية والعدالة، وتُحمى كافة البيانات الشخصية والمالية بتشفير مصرفي كامل.',
    badge: 'سرية مصرفية وتشفير كامل للهوية'
  }
];

export function HomeFaq() {
  return (
    <section className="relative overflow-hidden border-t border-[#d9b87f]/20 bg-gradient-to-b from-[#fbfcfe] via-[#f4f7fb] to-[#edf2f8] py-20 sm:py-28">
      {/* Ambient Lighting & Aerospace Grid */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-1/4 start-1/2 -translate-x-1/2 h-[450px] w-[900px] rounded-full bg-gradient-to-b from-gold/10 via-amber-500/5 to-transparent blur-[120px]" />
        <div className="absolute bottom-10 start-10 h-[320px] w-[380px] rounded-full bg-blue-500/5 blur-[95px]" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="faq-aerospace-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#0b172a" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#faq-aerospace-grid)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-[1000px] px-5 sm:px-8 lg:px-10">
        {/* Section Header */}
        <ScrollReveal direction="up" className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-xs font-bold text-navy-deep backdrop-blur-md shadow-2xs">
            <HelpCircle size={14} className="text-gold-dark" />
            <span>مركز الشفافية والمعرفة</span>
          </div>

          <h2 className="mt-3 text-xl sm:text-2xl lg:text-3xl font-black text-navy-deep tracking-tight">
            الأسئلة الشائعة والمساعدة الشاملة
          </h2>

          <p className="mt-2 text-xs sm:text-[13px] text-slate-600 font-medium leading-relaxed">
            كل ما تحتاج معرفته عن آليات المزايدة، التوثيق، الحساب الضامن، ونقل الملكية المعتمد.
          </p>

          <Link
            href="/faq"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-navy-deep hover:text-gold-dark transition-colors group"
          >
            <span>استعراض الدليل التفاعلي الكامل للأسئلة</span>
            <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-1" />
          </Link>
        </ScrollReveal>

        {/* Trust Highlights Strip */}
        <StaggerGrid className="mb-10 grid grid-cols-1 sm:grid-cols-3 gap-3" baseDelay={80}>
          {[
            { label: 'توثيق 100% عبر النفاذ الوطني وأبشر', desc: 'مطابقة رسمية لجميع المزايدين والملاك' },
            { label: 'حساب ضمان بنكي معتمد Escrow', desc: 'حماية كاملة لأموال المشتري حتى استلام اللوحة' },
            { label: 'فك حجز فوري للتأمين دون خصم', desc: 'إلغاء التفويض آلياً لجميع المزايدين غير الفائزين' }
          ].map((chip, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 rounded-xl border border-gold/25 bg-white/80 p-3.5 backdrop-blur-sm shadow-xs"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold-dark font-black">
                <ShieldCheck size={16} />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-black text-navy-deep">{chip.label}</div>
                <div className="text-[11px] text-slate-500 font-medium">{chip.desc}</div>
              </div>
            </div>
          ))}
        </StaggerGrid>

        {/* 10 Comprehensive FAQ Items in 2 Symmetrical Luxury Columns */}
        <ScrollReveal
          direction="up"
          delay={100}
          className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4.5 items-start"
        >
          {/* Column 1: Items 1 to 5 */}
          <div className="space-y-3 sm:space-y-3.5">
            {faqCol1.map((item) => (
              <details
                key={item.id}
                className="luxury-card group rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-sm p-3.5 sm:p-4 transition-all duration-300 hover:border-gold/50 hover:shadow-md open:border-gold/60 open:shadow-[0_8px_30px_rgba(217,184,127,0.12)] open:bg-white"
              >
                <summary className="flex cursor-pointer select-none list-none items-center justify-between gap-3 text-start [&::-webkit-details-marker]:hidden">
                  <div className="flex-1 min-w-0 space-y-1">
                    {/* Category & ID - Clean Minimalist Text */}
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-[11.5px] font-medium">
                      <span className="font-norwester font-black text-xs sm:text-[12.5px] tracking-wide text-[#7a4e17] shrink-0" dir="ltr">
                        {item.id}
                      </span>
                      <span className="text-slate-300 select-none">|</span>
                      <span className="whitespace-nowrap text-slate-500 font-semibold">{item.category}</span>
                    </div>

                    <h3 className="text-[12px] sm:text-[13px] font-bold text-navy-deep leading-snug truncate group-hover:text-gold transition-colors">
                      {item.q}
                    </h3>
                  </div>

                  <div className="shrink-0 flex h-7.5 w-7.5 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition-all duration-300 group-hover:border-gold/40 group-hover:text-gold group-open:bg-navy-deep group-open:border-navy-deep group-open:text-gold group-open:rotate-180 shadow-xs">
                    <ChevronDown size={15} />
                  </div>
                </summary>

                <div className="mt-3 border-t border-slate-100 pt-3 text-[11.5px] sm:text-xs leading-relaxed text-slate-600 font-normal">
                  <p>{item.a}</p>
                  {item.badge && (
                    <div className="mt-2.5 inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 text-[10.5px] font-medium text-slate-600 border border-slate-200/70">
                      <CheckCircle2 size={11} className="text-gold-dark shrink-0" />
                      <span>{item.badge}</span>
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>

          {/* Column 2: Items 6 to 10 */}
          <div className="space-y-3 sm:space-y-3.5">
            {faqCol2.map((item) => (
              <details
                key={item.id}
                className="luxury-card group rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-sm p-3.5 sm:p-4 transition-all duration-300 hover:border-gold/50 hover:shadow-md open:border-gold/60 open:shadow-[0_8px_30px_rgba(217,184,127,0.12)] open:bg-white"
              >
                <summary className="flex cursor-pointer select-none list-none items-center justify-between gap-3 text-start [&::-webkit-details-marker]:hidden">
                  <div className="flex-1 min-w-0 space-y-1">
                    {/* Category & ID - Clean Minimalist Text */}
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-[11.5px] font-medium">
                      <span className="font-norwester font-black text-xs sm:text-[12.5px] tracking-wide text-[#7a4e17] shrink-0" dir="ltr">
                        {item.id}
                      </span>
                      <span className="text-slate-300 select-none">|</span>
                      <span className="whitespace-nowrap text-slate-500 font-semibold">{item.category}</span>
                    </div>

                    <h3 className="text-[12px] sm:text-[13px] font-bold text-navy-deep leading-snug truncate group-hover:text-gold transition-colors">
                      {item.q}
                    </h3>
                  </div>

                  <div className="shrink-0 flex h-7.5 w-7.5 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition-all duration-300 group-hover:border-gold/40 group-hover:text-gold group-open:bg-navy-deep group-open:border-navy-deep group-open:text-gold group-open:rotate-180 shadow-xs">
                    <ChevronDown size={15} />
                  </div>
                </summary>

                <div className="mt-3 border-t border-slate-100 pt-3 text-[11.5px] sm:text-xs leading-relaxed text-slate-600 font-normal">
                  <p>{item.a}</p>
                  {item.badge && (
                    <div className="mt-2.5 inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 text-[10.5px] font-medium text-slate-600 border border-slate-200/70">
                      <CheckCircle2 size={11} className="text-gold-dark shrink-0" />
                      <span>{item.badge}</span>
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
