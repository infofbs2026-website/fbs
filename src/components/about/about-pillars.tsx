import React from 'react';
import {
  BadgeCheck,
  CheckCircle2,
  Lock,
  Scale,
  Building2,
  FileCheck2,
  ShieldCheck
} from 'lucide-react';

export const pillarsList = [
  {
    num: '01',
    title: 'نظام الحساب الضامن المصرفي (Escrow Protection)',
    subtitle: 'حماية مالية مطلقة بإشراف بنكي',
    desc: 'لا يتم تحويل أي مبلغ للبائع إلا بعد استكمال نقل الملكية رسمياً واستلام المشتري للوحة موثقة في حسابه لدى أبشر. تودع أموال الصفقات والتأمينات في حسابات مصرفية مستقلة خاضعة لرقابة البنك المركزي السعودي.',
    badge: 'حماية مالية 100%',
    icon: Lock,
    stats: '0% مخاطر احتيال'
  },
  {
    num: '02',
    title: 'نظام مكافحة القنص الآلي (Anti-Sniping Protocol)',
    subtitle: 'عدالة المزايدة وتكافؤ الفرص للمقتنين',
    desc: 'خوارزمية ذكية تمدد وقت المزاد تلقائياً عند تقديم أي مزايدة في الدقائق الأخيرة، لمنع المضاربات المباغتة وضمان حصول صاحب المزايدة الحقيقية والأعلى على اللوحة بكل شفافية.',
    badge: 'تمديد ذكي عادل',
    icon: Scale,
    stats: 'تمديد ديناميكي دقيقتين'
  },
  {
    num: '03',
    title: 'التقييم التراثي والتحليل المالي المستقل',
    subtitle: 'تسعير عادل مبني على سجل السوق الفعلي',
    desc: 'تعتمد لجنتنا الاستشارية على أرشيف تداولات يمتد لأكثر من 15 عاماً، وتصنيف معتمد لندرة الأحرف والأرقام لتحديد القيمة السوقية العادلة وحماية الطرفين من الغبن أو التقييمات الجزافية.',
    badge: 'اعتماد سعري موثق',
    icon: ShieldCheck,
    stats: 'أرشيف صفقات 15+ عاماً'
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

export function AboutPillars() {
  return (
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
          Card 0, 1, 2 = lg:col-span-2 (3 cards in row 1)
          Card 3, 4 = lg:col-span-3 (2 cards in row 2) */}
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
  );
}
