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
    a: 'يتطلب الاشتراك إنشاء حساب موثّق وتأكيد الهوية عبر النفاذ الوطني الموحد (أبشر) لضمان موثوقية المزايدين. بعد تسجيل الدخول، يمكنك استعراض المزاد المطلوب، والموافقة على الشروط، وتفويض مبلغ التأمين المالي المخصص عبر بطاقتك البنكية (Pre-Authorization). فور اعتماد التفويض، يُفعّل حسابك فوراً لتقديم العروض الحية والتنافس المباشر.',
    badge: 'توثيق فوري عبر النفاذ الوطني'
  },
  {
    id: '02',
    category: 'الضمان المالي والتأمين',
    q: 'ما هو مصير مبلغ التأمين لغير الفائزين؟ ومتى يُفك الحجز؟',
    a: 'يتم التعامل مع مبلغ التأمين كحجز بنكي مؤقت (Pre-authorization Hold) دون خصمه الفعلي من رصيدك. فور إغلاق المزاد ورسوه على المزايد الفائز، يصدر نظام المنصة أمراً آلياً وفورياً بإلغاء التفويض (Void) لكافة المزايدين الآخرين دون أي خصومات أو رسوم، ويعود المبلغ المتاح في حسابك فوراً أو خلال 24 ساعة بحسب سياسة البنك المصدر لبطاقتك.',
    badge: 'إلغاء حجز فوري 100% بدون استقطاع'
  },
  {
    id: '03',
    category: 'التوثيق والتحقق',
    q: 'كيف تضمن المنصة صحة ملكية اللوحة وخلوها من الموانع؟',
    a: 'تطبّق المنصة بروتوكول تدقيق صارم بالتعاون مع المرجعيات النظامية؛ يُلزم البائع برفع رخصة سير المركبة (الاستمارة) سارية المفعول، ويقوم فريق التحقق بمطابقة بيانات المالك والرقم التسلسلي وسجل اللوحة للتأكد القاطع من خلو اللوحة من أي حجوزات قضائية، مخالفات مقيّدة، أو موانع تمنع نقل الملكية قبل اعتماد المزاد.',
    badge: 'فحص جنائي ونظامي شامل'
  },
  {
    id: '04',
    category: 'المزادات والمزايدة',
    q: 'ما هي ميزة منع القنص (Anti-Sniping) في اللحظات الأخيرة؟',
    a: 'ميزة منع القنص هي خوارزمية ذكية تهدف إلى حماية المزايدين من العروض المباغتة في الثواني الأخيرة؛ إذا تم تقديم أي مزايدة خلال آخر 120 ثانية من نهاية المزاد، يتم تمديد وقت المزاد تلقائياً بدقيقتين إضافيتين. يتكرر هذا التمديد مع كل مزايدة جديدة حتى تنقضي الدقيقتان دون مزايدة أخرى، مما يضمن عدالة المنافسة واستقرار السعر الحقيقي.',
    badge: 'تمديد ديناميكي لضمان الشفافية'
  },
  {
    id: '05',
    category: 'نقل الملكية والمرور',
    q: 'كيف تتم إجراءات نقل الملكية رسمياً؟ وهل يلزم مراجعة المرور؟',
    a: 'لا تتطلب العملية أي زيارة حضورية لإدارات المرور؛ تتم إجراءات نقل الملكية رقمياً عبر خدمة مبايعة اللوحات المعتمدة في منصة "أبشر" أو بالتنسيق المباشر مع شبكة معارض السيارات المعتمدة الشريكة لـ FBS في مدينتك. يتولى مستشار المنصة الخاص إدارة وتنسيق الخطوات وإصدار رخصة السير المحدثة وتسليمها لك خلال 48 إلى 72 ساعة عمل.',
    badge: 'نقل ملكية رقمي دون مراجعة فروع المرور'
  }
];

const faqCol2 = [
  {
    id: '06',
    category: 'الضمان المالي والتأمين',
    q: 'كيف يحمي حساب الضمان (Escrow) قيمة اللوحة حتى استلامها؟',
    a: 'تُودع قيمة اللوحة المسددة بالكامل في حساب ضمان بنكي محمي ومستقل (Escrow Account) خاضع لإشراف مالي محكم. تظل الأموال معلقة في الحساب المحمي ولا يتم تحويل أي مبالغ لحساب البائع إلا بعد التحقق التقني والنظامي من اكتمال نقل ملكية اللوحة رسمياً في سجلات المرور باسم المشتري واستلامه لإشعار النقل بنجاح.',
    badge: 'حساب ضمان Escrow محمي ومعتمد'
  },
  {
    id: '07',
    category: 'البائعون وعرض اللوحات',
    q: 'كيف يمكنني عرض لوحتي للبيع أو المزاد؟ وما هي الرسوم؟',
    a: 'نعم، يمكنك تقديم طلب عرض لوحتك عبر صفحة "اعرض لوحتك الآن" وإرفاق صورة الاستمارة. يتواصل معك فريق التقييم خلال 24 ساعة للاتفاق على السعر الافتتاحي وسعر الحفظ السري (Reserve Price) لمنع بيع اللوحة بأقل من قيمتها المرجوة. لا نتقاضى أي رسوم تسجيل مسبقة؛ تُستحق عمولة المنصة فقط عند إتمام البيع بنجاح ونقل الملكية.',
    badge: 'بدون أي رسوم مسبقة وسعر حفظ سري محمي'
  },
  {
    id: '08',
    category: 'السياسات والالتزامات',
    q: 'ماذا يحدث في حال فوز مزايد وتخلّفه عن سداد القيمة؟',
    a: 'يمنح النظام الفائز مهلة سداد نظامية قدرها 48 ساعة عمل لتحويل المتبقي من قيمة اللوحة عبر القنوات المصرفية المعتمدة. في حال تخلفه عن السداد دون عذر قاهر، يُصادر مبلغ التأمين المفوّض كشرط جزائي لتعويض البائع وتغطية الرسوم التشغيلية، وتُعرض اللوحة على المزايد الثاني المؤهل أو يُعاد جدولتها في جولة مزاد خاصة.',
    badge: 'انضباط سوقي ملزم لحماية الجدية'
  },
  {
    id: '09',
    category: 'فئات اللوحات والرموز',
    q: 'ما هي فئات وتصنيفات اللوحات المعتمدة في مزادات المنصة؟',
    a: 'تختص منصة FBS باللوحات السعودية الفاخرة والاستثنائية بجميع الفئات المصرحة: اللوحات الخصوصية النادرة (أحادية الحرف والرقم، الثنائية، والثلاثية المميزة)، لوحات النقل الخاص للمؤسسات والأفراد، لوحات الدراجات النارية الفريدة، إضافة إلى اللوحات التي تحمل شعارات وطنية ورسمية مميزة وفق اللوائح المعتمدة.',
    badge: 'تغطية شاملة لكافة الفئات المصرحة'
  },
  {
    id: '10',
    category: 'السرية والخصوصية',
    q: 'هل بيانات المزايدين ومعلوماتهم الشخصية مشفرة وسرية؟',
    a: 'بكل تأكيد؛ تلتزم FBS بأعلى معايير الأمن السيبراني والخصوصية المصرفية. تظهر العروض في سجل المزايدة الحي بأسماء مشفرة وأرقام تعريفية رمزية (مثل: مزايد #582) لمنع أي تأثير نفسي أو تكتلات غير عادلة، مع حماية الهويات والبيانات الشخصية والمالية بأحدث بروتوكولات التشفير المصرفي.',
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

      <div className="container-fbs relative z-10">
        {/* Header */}
        <ScrollReveal
          direction="up"
          className="mb-12 sm:mb-16 flex flex-col justify-between gap-6 sm:flex-row sm:items-end"
        >
          <div className="max-w-2xl">
            {/* Unified Luxury Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/45 bg-gradient-to-r from-gold/20 via-gold/10 to-amber-500/10 px-4.5 py-1.5 text-xs sm:text-sm font-black text-navy-deep backdrop-blur-md shadow-[0_2px_12px_rgba(217,184,127,0.22)] mb-3.5">
              <HelpCircle size={16} className="text-gold-dark shrink-0" />
              <span className="tracking-wide">مركز المعرفة والشفافية</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-navy-deep tracking-tight">
              الأسئلة الشائعة والمساعدة
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
              إجابات تفصيلية ودقيقة لكافة الجوانب التشغيلية، من آليات المزايدة والتفويض البنكي إلى التوثيق ونقل الملكية
              المعتمد.
            </p>
          </div>
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full border border-gold/40 bg-white/90 px-5 py-2.5 text-xs sm:text-sm font-bold text-navy-deep shadow-sm hover:border-gold hover:bg-gold/10 hover:text-gold-dark transition-all duration-300"
          >
            <span>دليل الأسئلة الشامل</span>
            <ArrowLeft size={16} />
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
                className="luxury-card group rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-sm p-4 sm:p-4.5 transition-all duration-300 hover:border-gold/50 hover:shadow-md open:border-gold/60 open:shadow-[0_8px_30px_rgba(217,184,127,0.12)] open:bg-white"
              >
                <summary className="flex cursor-pointer select-none list-none items-center justify-between gap-3 text-start [&::-webkit-details-marker]:hidden">
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-md border border-gold/30 bg-gold/10 px-2 py-0.5 text-[10.5px] font-bold text-gold-dark">
                        {item.category}
                      </span>
                      <span className="text-[10.5px] font-mono text-slate-400 font-semibold">#{item.id}</span>
                    </div>
                    <h3 className="text-xs sm:text-[13px] md:text-sm font-black text-navy-deep leading-normal truncate group-hover:text-gold-dark transition-colors">
                      {item.q}
                    </h3>
                  </div>
                  <div className="shrink-0 flex h-8 w-8 sm:h-8.5 sm:w-8.5 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition-all duration-300 group-hover:border-gold/40 group-hover:text-gold group-open:bg-navy-deep group-open:border-navy-deep group-open:text-gold group-open:rotate-180 shadow-xs">
                    <ChevronDown size={16} />
                  </div>
                </summary>
                <div className="mt-3.5 border-t border-slate-100 pt-3.5 text-xs sm:text-[13.5px] leading-relaxed text-slate-600 font-medium">
                  <p>{item.a}</p>
                  {item.badge && (
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 border border-slate-200/70">
                      <CheckCircle2 size={13} className="text-gold-dark shrink-0" />
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
                className="luxury-card group rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-sm p-4 sm:p-4.5 transition-all duration-300 hover:border-gold/50 hover:shadow-md open:border-gold/60 open:shadow-[0_8px_30px_rgba(217,184,127,0.12)] open:bg-white"
              >
                <summary className="flex cursor-pointer select-none list-none items-center justify-between gap-3 text-start [&::-webkit-details-marker]:hidden">
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-md border border-gold/30 bg-gold/10 px-2 py-0.5 text-[10.5px] font-bold text-gold-dark">
                        {item.category}
                      </span>
                      <span className="text-[10.5px] font-mono text-slate-400 font-semibold">#{item.id}</span>
                    </div>
                    <h3 className="text-xs sm:text-[13px] md:text-sm font-black text-navy-deep leading-normal truncate group-hover:text-gold-dark transition-colors">
                      {item.q}
                    </h3>
                  </div>
                  <div className="shrink-0 flex h-8 w-8 sm:h-8.5 sm:w-8.5 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition-all duration-300 group-hover:border-gold/40 group-hover:text-gold group-open:bg-navy-deep group-open:border-navy-deep group-open:text-gold group-open:rotate-180 shadow-xs">
                    <ChevronDown size={16} />
                  </div>
                </summary>
                <div className="mt-3.5 border-t border-slate-100 pt-3.5 text-xs sm:text-[13.5px] leading-relaxed text-slate-600 font-medium">
                  <p>{item.a}</p>
                  {item.badge && (
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 border border-slate-200/70">
                      <CheckCircle2 size={13} className="text-gold-dark shrink-0" />
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
