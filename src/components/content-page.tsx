import Link from 'next/link';
import { PageTitle, EmptyState } from './ui';
import { createAdminClient } from '@/lib/supabase/server';
import {
  HowItWorksInteractive,
  FaqInteractive,
  ContactInteractive,
  AboutInteractive
} from './content-interactive';
import { AboutView } from './about-view';
import { ShieldCheck, FileText, Scale, Lock, ArrowLeft } from 'lucide-react';

export const contentTitles: Record<string, string> = {
  about: 'عن فارس بن سعود للوحات المميزة',
  'how-it-works': 'دليل وآلية عمل المنصة',
  faq: 'الأسئلة الشائعة والمساعدة',
  contact: 'المكتب الخاص وتواصل معنا',
  terms: 'الشروط والأحكام العامة',
  privacy: 'سياسة الخصوصية وحماية البيانات',
  'auction-policy': 'سياسة وضوابط المزادات',
  'deposit-policy': 'سياسة التأمين المالي والاسترداد'
};

const pageDescriptions: Record<string, string> = {
  about: 'تعرف على رؤيتنا في تقديم أرقى منصة سعودية متخصصة في وساطة ومزادات اللوحات النادرة.',
  'how-it-works': 'تعرف على خطوات المزايدة والشراء أو عرض لوحتك للبيع بضمانات رسمية معتمدة.',
  faq: 'إجابات شاملة ومفصلة عن كافة استفسارات المزادات، التوثيق، نقل الملكية، والتأمين المسترد.',
  contact: 'قنوات التواصل المباشرة مع مستشاري المكتب الخاص لخدمة كبار الشخصيات والمقتنين.',
  terms: 'اللوائح التنظيمية الحاكمة لاستخدام المنصة والمشاركة في المزادات وفق الأنظمة السعودية.',
  privacy: 'التزامنا الكامل بحماية وتشفير بيانات الملاك والمزايدين وفق أعلى معايير الأمن السيبراني.',
  'auction-policy': 'الضوابط الصارمة لفتح المزادات، نظام مكافحة القنص، وزيادات المزايدة المعتمدة.',
  'deposit-policy': 'آليات إيداع التأمين الإلزامي وضمان استرداده بنسبة 100% فور انتهاء المزاد لغير الفائزين.'
};

const defaults: Record<string, string> = {
  terms: `أولاً: نطاق الخدمة والتعريفات
تعد منصة «فارس بن سعود للوحات المميزة» وسيطاً تقنياً وتنظيمياً معتمداً لعرض لوحات المركبات المميزة وتنظيم المزادات الحية الإلكترونية بين الملاك والمشترين، ولا تمتلك المنصة اللوحات المعروضة ما لم ينص صراحة على غير ذلك.

ثانياً: شروط الأهلية والتسجيل
يشترط للمشاركة في المزادات أن يكون العضو ذا أهلية شرعية وقانونية كاملة، وأن يقدم بيانات الهوية الوطنية أو السجل التجاري المعتمد بدقة، مع الالتزام بربط حسابه بوسائل التحقق المعتمدة.

ثالثاً: الضمانات المالية والتأمين
يلزم سداد مبلغ التأمين المالي المحدد لكل مزاد قبل التمكن من تقديم العطاءات. التأمين محجوز في حساب مصرفي ضامن ومسترد بالكامل بنسبة 100% لكافة المزايدين الذين لم يحالفهم الفوز.

رابعاً: نقل الملكية والمسؤوليات
تتم كافة إجراءات نقل الملكية وفق الأنظمة والتعليمات الصادرة عن الإدارة العامة للمرور في المملكة العربية السعودية وعبر القنوات الرسمية لمنصة «أبشر». يلتزم الطرفان باستكمال الإجراءات المحددة خلال المهلة النظامية.`,

  privacy: `1. التزامنا بالخصوصية
تلتزم منصة فارس بن سعود بحماية البيانات الشخصية والمستندات الرسمية لعملائها وفقاً لنظام حماية البيانات الشخصية المعمول به في المملكة العربية السعودية.

2. البيانات التي نجمعها
نجمع البيانات اللازمة للتحقق من هوية المستخدمين وصحة ملكية اللوحات المعروضة، وتشمل: الاسم الرسمي، رقم الهوية الوطنية، رقم الجوال المسجل، ومستندات رخصة السير.

3. سرية مستندات الملكية
تُحفظ مستندات إثبات الملكية في مساحات تخزين سحابية مشفرة بدرجة أمان مصرفية، ولا يطلع عليها سوى أعضاء لجنة التدقيق والتحقق المختصة، ولا يتم نشرها للعامة بأي حال من الأحوال.

4. مشاركة البيانات مع الجهات الرسمية
لا نقوم ببيع أو تأجير أي بيانات شخصية لطرف ثالث. تقتصر مشاركة البيانات مع الجهات الحكومية أو القضائية المختصة عند طلبها نظاماً ووفق القوانين السارية.`,

  'auction-policy': `المادة الأولى: انعقاد المزاد وإدارته
تُدار جميع المزادات إلكترونياً وبشكل مباشر وفوري. تدار المزايدات بنظام التسلسل الرقمي المعتمد ويتم تحديد السعر الافتتاحي ومقدار الزيادة الأدنى لكل مزاد مسبقاً.

المادة الثانية: نظام مكافحة القنص (Anti-Sniping)
لحماية المنافسة العادلة، يُفعل النظام تمديداً تلقائياً للمزاد لمدة إضافية عند تقديم أي مزايدة مقبولة خلال الثواني الأخيرة، وذلك لإتاحة الفرصة لباقي المزايدين للمنافسة.

المادة الثالثة: الإلزام القانوني للمزايدة
تعد أي مزايدة يتقدم بها العضو التزاماً قانونياً ومالياً لا رجعة فيه. في حال نكول المزايد الفائز عن سداد باقي القيمة خلال المهلة المحددة، يُصادر مبلغ التأمين وتُتخذ الإجراءات النظامية بحقه.`,

  'deposit-policy': `1. الغرض من تأمين المزاد
يهدف تأمين المزاد إلى ضمان جدية المشاركة ومنع المزايدات الوهمية، وحماية مصالح ملاك اللوحات والمشاركين الجادين.

2. استرداد التأمين لغير الفائزين
يتم فك الحجز وإعادة مبلغ التأمين بالكامل بنسبة 100% لحسابات المزايدين الذين لم يفوزوا باللوحة فور إغلاق المزاد واعتماد النتيجة دون أي خصومات أو رسوم إدارية.

3. سداد باقي القيمة للفائز
يُحسب مبلغ التأمين كجزء من القيمة الإجمالية للوحة التي فاز بها المزايد، ويُطلب منه سداد المبلغ المتبقي خلال مهلة العمل المحددة لإتمام إجراءات نقل الملكية الرسمية.`
};

export async function ContentPage({ slug }: { slug: string }) {
  const db = createAdminClient();
  const result = db
    ? await db
        .from('cms_pages')
        .select('title_ar,body_ar')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle()
    : null;

  const pageTitle = result?.data?.title_ar ?? contentTitles[slug] ?? 'فارس بن سعود';
  const pageDescription = pageDescriptions[slug];
  const customBody = result?.data?.body_ar;

  return (
    <>
      {slug !== 'about' && (
        <PageTitle
          title={pageTitle}
          eyebrow="فارس بن سعود للوحات المميزة"
          description={pageDescription}
        />
      )}

      <div className={slug === 'about' ? 'w-full' : 'container-fbs py-12 sm:py-16'}>
        {slug === 'how-it-works' ? (
          <HowItWorksInteractive />
        ) : slug === 'faq' ? (
          <div className="mx-auto max-w-4xl">
            <FaqInteractive />
          </div>
        ) : slug === 'contact' ? (
          <div className="mx-auto max-w-5xl">
            <ContactInteractive />
          </div>
        ) : slug === 'about' ? (
          <AboutView />
        ) : (
          /* Legal & Policy Pages (terms, privacy, auction-policy, deposit-policy) */
          <div className="mx-auto max-w-3xl">
            <div className="overflow-hidden rounded-3xl border-2 border-slate-200/90 bg-white shadow-md">
              {/* Prestige Legal Header */}
              <div className="border-b-2 border-slate-100 bg-gradient-to-r from-amber-50/40 via-white to-amber-50/20 p-6 sm:p-9">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/70 bg-amber-50/90 px-3.5 py-1 text-xs font-black text-gold-accent">
                  <Scale size={16} />
                  <span>الوثائق والسياسات الرسمية المعتمدة</span>
                </div>
                <h2 className="mt-3 text-2xl font-black text-[#0f172a] sm:text-3xl">
                  {pageTitle}
                </h2>
                <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-5 text-xs text-[#475569] font-medium">
                  <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700">
                    <ShieldCheck size={16} className="text-emerald-600" />
                    <span>سارية المفعول وتخضع للأنظمة السعودية</span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Lock size={14} className="text-gold-accent" />
                    <span>مرخصة ومحمية نظامياً</span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span>آخر مراجعة: سبتمبر 2026</span>
                </div>
              </div>

              {/* Document Body - Structured Clause View */}
              <div className="p-6 sm:p-10 space-y-6">
                {customBody || defaults[slug] ? (
                  <div className="space-y-5">
                    {((customBody || defaults[slug]) as string)
                      .trim()
                      .split(/\n\s*\n/)
                      .map((clauseBlock: string, idx: number) => {
                        const lines = clauseBlock.trim().split('\n');
                        const title = lines[0];
                        const body = lines.slice(1).join('\n');

                        return (
                          <div
                            key={idx}
                            className="rounded-2xl border-2 border-slate-200/80 bg-slate-50/40 p-5 sm:p-6 transition-all hover:border-gold/50 hover:bg-white hover:shadow-xs"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-norwester flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100/80 text-xs font-black text-gold-accent border border-amber-200">
                                {idx + 1}
                              </span>
                              <h3 className="text-base font-black text-[#0f172a]">
                                {title}
                              </h3>
                            </div>
                            {body && (
                              <p className="mt-3 text-sm leading-relaxed text-[#334155] font-medium whitespace-pre-wrap">
                                {body}
                              </p>
                            )}
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <EmptyState
                    title="لم تُنشر هذه السياسة بعد"
                    description="تُتاح هذه الصفحة بعد اعتماد السياسة رسميًا من الفريق الاستشاري للمنصة."
                  />
                )}

                {/* Legal Official Seal Stamp */}
                <div className="mt-8 rounded-2xl border border-amber-200/70 bg-gradient-to-r from-amber-50/60 to-white p-5 flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold-accent border border-gold/30">
                    <ShieldCheck size={22} />
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-[#0f172a]">
                      توثيق الإدارة القانونية — فارس بن سعود للوحات المميزة
                    </h4>
                    <p className="mt-0.5 text-[11px] text-[#475569] font-medium leading-relaxed">
                      هذه الوثيقة ملزمة لجميع الأطراف المزايدة والبائعة وتنظم كافة التعاملات وفق الأنظمة المعمول بها في المملكة العربية السعودية.
                    </p>
                  </div>
                </div>
              </div>

              {/* Back to Home CTA */}
              <div className="border-t-2 border-slate-100 bg-slate-50/80 p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs sm:text-sm font-bold text-[#0f172a]">
                  هل لديك استفسار قانوني حول هذه السياسة؟
                </span>
                <Link
                  href="/contact"
                  className="btn btn-navy text-xs sm:text-sm font-black py-3 px-6 shadow-sm hover:shadow-md"
                >
                  <span>تواصل مع الإدارة والمكتب الخاص</span>
                  <ArrowLeft size={16} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
