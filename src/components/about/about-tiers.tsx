'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Layers, Eye, CheckCircle2, ArrowLeft } from 'lucide-react';
import { PlateVisualizer } from '@/components/ui';

export interface PlateTierData {
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

export const plateTiers: PlateTierData[] = [
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
    profile: 'عشاق الرموز الثقافية، الشخصيات الفنية والإعلامية، وأصحاب المجموعات الخاصة.',
    idealVehicle: 'فيراري، بورش 911، لامبورغيني ريفويلتو.',
    badge: 'البصمة المعنوية'
  },
  {
    id: 'sports',
    tabLabel: 'المثلث الرياضي (Sport Compact)',
    name: 'الفئة الرياضية: لوحات المقاس المصغر',
    lettersAr: ['ط', 'ط', 'ط'],
    lettersEn: ['T', 'T', 'T'],
    numbers: '9',
    scarcityIndex: '0.04% (طلب متسارع جداً)',
    heritageRating: 'طابع رياضي ديناميكي',
    cagrGrowth: '+25% سنوياً',
    description:
      'مصممة خصيصاً للمركبات الخارقة والسيارات الرياضية الفارهة، وتتميز بتكرار الأحرف الثلاثية مع رقم فردي مميز وأبعاد مصغرة تزيد من انسيابية مقدمة ومؤخرة المركبة.',
    profile: 'جيل الشباب المستثمر، مقتنو السيارات الخارقة، وأعضاء نوادي السيارات السريعة.',
    idealVehicle: 'ماكلارين، بوجاتي، مرسيدس AMG GT بلاك سيريس.',
    badge: 'الأداء الديناميكي'
  }
];

export function AboutTiers() {
  const [selectedTierId, setSelectedTierId] = useState<string>('sovereign');
  const selectedTier = plateTiers.find((t) => t.id === selectedTierId) || plateTiers[0];

  return (
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

      {/* Selected Tier Spotlight Stage */}
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
  );
}
