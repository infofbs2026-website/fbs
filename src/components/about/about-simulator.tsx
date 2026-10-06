'use client';

import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { SarSymbol, formatEnglishAmount } from '@/components/sar-symbol';
import { plateTiers } from './about-tiers';

export function AboutSimulator() {
  const [selectedTierId, setSelectedTierId] = useState<string>('sovereign');
  const [horizonYears, setHorizonYears] = useState<number>(5);
  const [initialInvestment, setInitialInvestment] = useState<number>(500000);

  const selectedTier = plateTiers.find((t) => t.id === selectedTierId) || plateTiers[0];

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

        {/* Projection Dashboard Card */}
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
  );
}
