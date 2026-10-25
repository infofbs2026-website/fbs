'use client';

import React, { useState, useTransition, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronDown,
  Check,
  Search,
  RotateCcw,
  SlidersHorizontal,
  Coins,
  FileText,
  Hash,
  MapPin,
  ArrowUpDown,
  ShieldCheck,
  X
} from 'lucide-react';
import { SarSymbol } from '@/components/sar-symbol';

interface CatalogFiltersProps {
  initialQuery: Record<string, string>;
  cities: { id: string; name_ar: string }[];
  types: { id: string; name_ar: string }[];
  currentPath: string;
}

export function CatalogFilters({
  initialQuery,
  cities,
  types,
  currentPath
}: CatalogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Controlled search text
  const [q, setQ] = useState(initialQuery.q || '');

  // Controlled Custom Price Range
  const [minPrice, setMinPrice] = useState(initialQuery.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(initialQuery.maxPrice || '');
  const [sliderMax, setSliderMax] = useState<number>(() => {
    const p = Number(initialQuery.maxPrice);
    return !isNaN(p) && p > 0 ? Math.min(p, 1000000) : 500000;
  });

  // City Search Filter Input
  const [citySearch, setCitySearch] = useState('');

  // Accordion Sections Open State - starts ALL CLOSED by default as requested
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    price: false,
    letters: false,
    numbers: false,
    cities: false,
    more: false
  });

  // Open clicked section and collapse others to keep sidebar tidy and prevent page overflows
  const toggleSection = (section: string) => {
    setOpenSections((prev) => {
      const isCurrentlyOpen = !!prev[section];
      return {
        price: false,
        letters: false,
        numbers: false,
        cities: false,
        more: false,
        [section]: !isCurrentlyOpen
      };
    });
  };

  const closeSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: false }));
  };

  // Helper to update query in URL
  const updateQuery = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page'); // Reset to first page on filter change

    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '') {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${currentPath}?${qs}` : currentPath, { scroll: false });
    });
  };

  // Toggle multi-value array param (e.g. lettersPattern)
  const toggleArrayParam = (paramName: string, value: string) => {
    const current = searchParams.get(paramName);
    const existing = current ? current.split(',').filter(Boolean) : [];
    let updated: string[];

    if (existing.includes(value)) {
      updated = existing.filter((v) => v !== value);
    } else {
      updated = [...existing, value];
    }

    updateQuery({
      [paramName]: updated.length > 0 ? updated.join(',') : null
    });
  };

  // Active check helpers
  const isLetterPatternChecked = (val: string) => {
    const current = searchParams.get('lettersPattern');
    return current ? current.split(',').includes(val) : false;
  };

  const isNumberPatternChecked = (val: string) => {
    const current = searchParams.get('numbersPattern');
    return current ? current.split(',').includes(val) : false;
  };

  const isPriceRangeChecked = (val: string) => {
    const current = searchParams.get('priceRange');
    return current === val;
  };

  const isCityChecked = (cityName: string) => {
    const current = searchParams.get('city');
    return current ? current.split(',').includes(cityName) : false;
  };

  // Clear specific filters
  const clearPrice = () => {
    setMinPrice('');
    setMaxPrice('');
    updateQuery({ minPrice: null, maxPrice: null, priceRange: null });
  };

  const clearLetters = () => {
    updateQuery({ lettersPattern: null });
  };

  const clearNumbers = () => {
    updateQuery({ digitsCount: null, numbersPattern: null });
  };

  const clearCities = () => {
    updateQuery({ city: null });
  };

  // Apply custom price min / max and close accordion tab
  const handleApplyPrice = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateQuery({
      minPrice: minPrice.trim() || null,
      maxPrice: maxPrice.trim() || null,
      priceRange: null // clear preset when custom price is applied
    });
    closeSection('price');
  };

  // Active selection summaries for closed tab headers
  const priceSummaryLabel = useMemo(() => {
    const pr = searchParams.get('priceRange');
    const min = searchParams.get('minPrice');
    const max = searchParams.get('maxPrice');
    if (pr) {
      const map: Record<string, string> = {
        under_15k: 'أقل من 15,000',
        '15k_50k': '15,000 - 50,000',
        '50k_150k': '50,000 - 150,000',
        '150k_500k': '150,000 - 500,000',
        over_500k: 'أكثر من 500,000'
      };
      return map[pr] ? `${map[pr]} ﷼` : pr;
    }
    if (min || max) {
      if (min && max) return `${Number(min).toLocaleString()} - ${Number(max).toLocaleString()} ﷼`;
      if (min) return `من ${Number(min).toLocaleString()} ﷼`;
      if (max) return `إلى ${Number(max).toLocaleString()} ﷼`;
    }
    return null;
  }, [searchParams]);

  const lettersSummaryLabel = useMemo(() => {
    const lp = searchParams.get('lettersPattern');
    if (!lp) return null;
    const items = lp.split(',').filter(Boolean);
    if (items.length === 0) return null;
    const map: Record<string, string> = {
      '3_same': '3 متطابقة',
      '2_same': 'حرفين متطابقة',
      first_last_same: 'أول وآخر',
      all_diff: 'حروف مختلفة'
    };
    const firstLabel = map[items[0]] || items[0];
    if (items.length === 1) return firstLabel;
    return `${firstLabel} (+${items.length - 1})`;
  }, [searchParams]);

  const numbersSummaryLabel = useMemo(() => {
    const digits = searchParams.get('digitsCount');
    const np = searchParams.get('numbersPattern');
    const parts: string[] = [];

    if (digits) {
      const digitMap: Record<string, string> = {
        '1': 'أحادية',
        '2': 'ثنائية',
        '3': 'ثلاثية',
        '4': 'رباعية'
      };
      parts.push(digitMap[digits] || `${digits} أرقام`);
    }

    if (np) {
      const items = np.split(',').filter(Boolean);
      const map: Record<string, string> = {
        '4_same': '4 متطابقة',
        '3_same': '3 متطابقة',
        '2_same': 'رقمين متطابقة',
        first_last_same: 'أول وآخر',
        sequence: 'تسلسل',
        all_diff: 'أرقام مختلفة'
      };
      if (items.length > 0) {
        parts.push(map[items[0]] || items[0]);
        if (items.length > 1) {
          parts.push(`(+${items.length - 1})`);
        }
      }
    }

    return parts.length > 0 ? parts.join('، ') : null;
  }, [searchParams]);

  const citiesSummaryLabel = useMemo(() => {
    const c = searchParams.get('city');
    if (!c) return null;
    const items = c.split(',').filter(Boolean);
    if (items.length === 0) return null;
    if (items.length === 1) return items[0];
    return `${items[0]} (+${items.length - 1})`;
  }, [searchParams]);

  // Filtered Cities list based on citySearch
  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return cities;
    return cities.filter((c) => c.name_ar.includes(citySearch.trim()));
  }, [cities, citySearch]);

  const hasAnyFilter =
    searchParams.get('q') ||
    searchParams.get('type') ||
    searchParams.get('digitsCount') ||
    searchParams.get('city') ||
    searchParams.get('featured') ||
    searchParams.get('minPrice') ||
    searchParams.get('maxPrice') ||
    searchParams.get('priceRange') ||
    searchParams.get('lettersPattern') ||
    searchParams.get('numbersPattern') ||
    searchParams.get('sort');

  return (
    <div
      className="filter-sidebar-card flex flex-col p-4 sm:p-5 rounded-2xl border border-[#E5E0D5] bg-white shadow-[0_10px_30px_-10px_rgba(20,36,60,0.07)] transition-all duration-300 relative group/sidebar"
      style={{ opacity: isPending ? 0.7 : 1 }}
    >
      {/* Top Ambient Specular Line Accent */}
      <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-[#D9BB81]/60 to-transparent rounded-full" />

      {/* 1. Sidebar Header */}
      <div className="shrink-0 border-b border-[#EFECE6] pb-3.5 mb-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#14243C] text-[#D9BB81] border border-[#14243C] shadow-xs shrink-0">
              <SlidersHorizontal size={16} />
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className="text-sm font-black text-[#14243C] leading-tight">تصفية اللوحات</h2>
              <span className="text-[11px] font-semibold text-slate-500 mt-0.5">تخصيص الخيارات والمعايير</span>
            </div>
          </div>
          {hasAnyFilter && (
            <button
              type="button"
              onClick={() => {
                startTransition(() => {
                  router.push(currentPath, { scroll: false });
                });
              }}
              className="flex items-center gap-1 text-[11px] font-extrabold text-rose-600 hover:text-rose-700 transition-all bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg border border-rose-200/80 active:scale-95 shrink-0"
              title="مسح كافة الفلاتر"
            >
              <RotateCcw size={11} strokeWidth={2.5} />
              <span>مسح الكل</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Sort By (ترتيب حسب) - Positioned at the very top of filters */}
      <div className="shrink-0 mb-3.5 pb-3.5 border-b border-[#EFECE6]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <ArrowUpDown size={13} className="text-[#9E7B35]" />
            <span className="text-xs font-black text-[#14243C]">ترتيب حسب</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400">عرض النتائج</span>
        </div>
        <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#F6F4EF] border border-[#E5E0D5]">
          {[
            { id: 'newest', label: 'الأحدث' },
            { id: 'price_asc', label: 'الأقل سعراً' },
            { id: 'price_desc', label: 'الأعلى سعراً' }
          ].map((s) => {
            const active = (searchParams.get('sort') || 'newest') === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => updateQuery({ sort: s.id })}
                className={`rounded-lg py-2 px-1.5 text-[11px] font-black transition-all text-center ${
                  active
                    ? 'bg-[#14243C] text-[#FAF9F6] shadow-xs'
                    : 'text-slate-600 hover:text-[#14243C] hover:bg-white/70 font-bold'
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Accordion Sections & Bottom Branded Logo Card */}
      <div dir="ltr" className="flex-1 min-h-0">
        <div dir="rtl" className="flex flex-col space-y-2.5">
          {/* ============================================================== */}
          {/* SECTION 1: PRICE RANGE (نطاق السعر)                             */}
          {/* ============================================================== */}
          <div
            className={`rounded-xl border transition-all duration-200 overflow-hidden ${
              openSections.price
                ? 'border-[#14243C]/25 bg-white shadow-[0_8px_20px_-6px_rgba(20,36,60,0.08)] ring-1 ring-[#14243C]/5'
                : 'border-[#E6E2D8] bg-[#FAF9F6]/70 hover:bg-white hover:border-[#D9BB81]/70 hover:shadow-2xs'
            }`}
          >
            <button
              type="button"
              onClick={() => toggleSection('price')}
              className="flex w-full items-center justify-between py-3 px-3.5 text-start transition-colors gap-2.5"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors shrink-0 ${
                    openSections.price || priceSummaryLabel
                      ? 'bg-[#14243C] text-[#D9BB81] border-[#14243C]'
                      : 'bg-white text-[#14243C] border-[#E5E0D5] shadow-2xs'
                  }`}
                >
                  <Coins size={15} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-black text-[#14243C] text-[13px] leading-tight">نطاق السعر</span>
                  {!priceSummaryLabel && (
                    <span className="text-[10px] font-semibold text-slate-400 mt-0.5">تحديد السعر بالريال</span>
                  )}
                </div>
                {priceSummaryLabel && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      clearPrice();
                    }}
                    className="ms-auto inline-flex items-center gap-1 rounded-md bg-[#14243C] text-[#D9BB81] border border-[#D9BB81]/30 px-2 py-0.5 text-[10px] font-extrabold hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all max-w-[130px]"
                    title="إلغاء فلتر السعر"
                  >
                    <span className="truncate">{priceSummaryLabel}</span>
                    <X size={10} className="shrink-0" />
                  </span>
                )}
              </div>
              <div
                className={`flex h-6.5 w-6.5 items-center justify-center rounded-md shrink-0 transition-all duration-200 ${
                  openSections.price
                    ? 'rotate-180 text-[#14243C] bg-[#F4F1EA]'
                    : 'text-slate-400 bg-white border border-[#EAE6DF]'
                }`}
              >
                <ChevronDown size={14} />
              </div>
            </button>

            {openSections.price && (
              <div className="border-t border-[#EFECE6] p-3.5 space-y-3.5 bg-[#FAF9F6]/50">
                {/* Custom Min / Max Inputs */}
                <div>
                  <span className="block text-[11px] font-black text-[#14243C] mb-2">
                    نطاق مخصص (ريال سعودي):
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 rounded-lg border border-[#E2DDD3] bg-white focus-within:border-[#14243C] transition-all overflow-hidden">
                      <span className="shrink-0 text-[11px] font-bold text-slate-400">من</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleApplyPrice();
                        }}
                        className="flex-1 min-w-0 border-0 bg-transparent py-2 px-1 text-xs font-bold text-center text-[#14243C] focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 rounded-lg border border-[#E2DDD3] bg-white focus-within:border-[#14243C] transition-all overflow-hidden">
                      <span className="shrink-0 text-[11px] font-bold text-slate-400">إلى</span>
                      <input
                        type="number"
                        placeholder="500,000"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleApplyPrice();
                        }}
                        className="flex-1 min-w-0 border-0 bg-transparent py-2 px-1 text-xs font-bold text-center text-[#14243C] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Range Slider for Quick Max Price Dragging */}
                  <div className="mt-3 px-0.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1.5">
                      <span>الحد الأقصى التقديري</span>
                      <span className="font-norwester text-[#9E7B35] font-black text-xs">
                        {Number(sliderMax).toLocaleString()} ﷼
                      </span>
                    </div>
                    <input
                      type="range"
                      min="15000"
                      max="1000000"
                      step="5000"
                      value={sliderMax}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setSliderMax(v);
                        setMaxPrice(String(v));
                      }}
                      className="w-full accent-[#14243C] h-1.5 bg-[#E5E0D5] rounded-lg cursor-pointer"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApplyPrice()}
                    className="mt-3 w-full rounded-lg bg-[#14243C] hover:bg-[#1c3252] py-2 text-xs font-black text-[#FAF9F6] shadow-2xs transition-all active:scale-[0.99] flex items-center justify-center gap-1.5"
                  >
                    <Check size={13} strokeWidth={2.5} className="text-[#D9BB81]" />
                    <span>تطبيق نطاق السعر</span>
                  </button>
                </div>

                {/* Preset Price Checkboxes */}
                <div className="border-t border-[#E6E2D8] pt-3 space-y-1.5 max-h-52 overflow-y-auto custom-scrollbar pe-1">
                  <span className="block text-[11px] font-black text-[#14243C] mb-1.5">
                    فئات الأسعار السريعة:
                  </span>
                  {[
                    { id: 'under_15k', label: 'أقل من 15,000' },
                    { id: '15k_50k', label: '15,000 - 50,000' },
                    { id: '50k_150k', label: '50,000 - 150,000' },
                    { id: '150k_500k', label: '150,000 - 500,000' },
                    { id: 'over_500k', label: 'أكثر من 500,000' }
                  ].map((tier) => {
                    const checked = isPriceRangeChecked(tier.id);
                    return (
                      <label
                        key={tier.id}
                        onClick={(e) => {
                          e.preventDefault();
                          updateQuery({
                            priceRange: checked ? null : tier.id,
                            minPrice: null,
                            maxPrice: null
                          });
                          closeSection('price');
                        }}
                        className={`flex items-center justify-between rounded-lg p-2.5 text-xs font-bold cursor-pointer transition-all border ${
                          checked
                            ? 'bg-[#14243C]/[0.05] text-[#14243C] border-[#14243C]/40 shadow-2xs'
                            : 'bg-white hover:bg-[#FAF9F6] border-[#E6E2D8] text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded border transition-all ${
                              checked
                                ? 'bg-[#14243C] border-[#14243C] text-[#D9BB81]'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {checked && <Check size={11} strokeWidth={3} />}
                          </span>
                          <span>{tier.label}</span>
                        </div>
                        <SarSymbol className={`w-3.5 h-3.5 ${checked ? 'text-[#9E7B35]' : 'text-slate-400'}`} />
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* SECTION 2: LETTERS PATTERNS (الحروف)                             */}
          {/* ============================================================== */}
          <div
            className={`rounded-xl border transition-all duration-200 overflow-hidden ${
              openSections.letters
                ? 'border-[#14243C]/25 bg-white shadow-[0_8px_20px_-6px_rgba(20,36,60,0.08)] ring-1 ring-[#14243C]/5'
                : 'border-[#E6E2D8] bg-[#FAF9F6]/70 hover:bg-white hover:border-[#D9BB81]/70 hover:shadow-2xs'
            }`}
          >
            <button
              type="button"
              onClick={() => toggleSection('letters')}
              className="flex w-full items-center justify-between py-3 px-3.5 text-start transition-colors gap-2.5"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors shrink-0 ${
                    openSections.letters || lettersSummaryLabel
                      ? 'bg-[#14243C] text-[#D9BB81] border-[#14243C]'
                      : 'bg-white text-[#14243C] border-[#E5E0D5] shadow-2xs'
                  }`}
                >
                  <FileText size={15} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-black text-[#14243C] text-[13px] leading-tight">الحروف</span>
                  {!lettersSummaryLabel && (
                    <span className="text-[10px] font-semibold text-slate-400 mt-0.5">تشكيل وتكرار الأحرف</span>
                  )}
                </div>
                {lettersSummaryLabel && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      clearLetters();
                    }}
                    className="ms-auto inline-flex items-center gap-1 rounded-md bg-[#14243C] text-[#D9BB81] border border-[#D9BB81]/30 px-2 py-0.5 text-[10px] font-extrabold hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all max-w-[130px]"
                    title="إلغاء فلتر الحروف"
                  >
                    <span className="truncate">{lettersSummaryLabel}</span>
                    <X size={10} className="shrink-0" />
                  </span>
                )}
              </div>
              <div
                className={`flex h-6.5 w-6.5 items-center justify-center rounded-md shrink-0 transition-all duration-200 ${
                  openSections.letters
                    ? 'rotate-180 text-[#14243C] bg-[#F4F1EA]'
                    : 'text-slate-400 bg-white border border-[#EAE6DF]'
                }`}
              >
                <ChevronDown size={14} />
              </div>
            </button>

            {openSections.letters && (
              <div className="border-t border-[#EFECE6] p-3.5 space-y-2 bg-[#FAF9F6]/50 max-h-56 overflow-y-auto custom-scrollbar pe-1">
                {[
                  { id: '3_same', label: '3 حروف متطابقة', hint: 'أ أ أ' },
                  { id: '2_same', label: 'حرفين متطابقة', hint: 'ب س س' },
                  { id: 'first_last_same', label: 'أول وأخير متطابقة', hint: 'ق ص ق' },
                  { id: 'all_diff', label: 'كل الحروف مختلفة', hint: 'ف ب س' }
                ].map((pattern) => {
                  const checked = isLetterPatternChecked(pattern.id);
                  return (
                    <label
                      key={pattern.id}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleArrayParam('lettersPattern', pattern.id);
                        closeSection('letters');
                      }}
                      className={`flex items-center justify-between rounded-lg p-2.5 text-xs font-bold cursor-pointer transition-all border ${
                        checked
                          ? 'bg-[#14243C]/[0.05] text-[#14243C] border-[#14243C]/40 shadow-2xs'
                          : 'bg-white hover:bg-[#FAF9F6] border-[#E6E2D8] text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded border transition-all ${
                            checked
                              ? 'bg-[#14243C] border-[#14243C] text-[#D9BB81]'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {checked && <Check size={11} strokeWidth={3} />}
                        </span>
                        <span>{pattern.label}</span>
                      </div>
                      <span className="rounded bg-[#F4F1EA] px-2 py-0.5 text-[11px] font-extrabold text-[#14243C] border border-[#E2DDD3]">
                        {pattern.hint}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* SECTION 3: NUMBERS PATTERNS (الأرقام والتشكيل)                    */}
          {/* ============================================================== */}
          <div
            className={`rounded-xl border transition-all duration-200 overflow-hidden ${
              openSections.numbers
                ? 'border-[#14243C]/25 bg-white shadow-[0_8px_20px_-6px_rgba(20,36,60,0.08)] ring-1 ring-[#14243C]/5'
                : 'border-[#E6E2D8] bg-[#FAF9F6]/70 hover:bg-white hover:border-[#D9BB81]/70 hover:shadow-2xs'
            }`}
          >
            <button
              type="button"
              onClick={() => toggleSection('numbers')}
              className="flex w-full items-center justify-between py-3 px-3.5 text-start transition-colors gap-2.5"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors shrink-0 ${
                    openSections.numbers || numbersSummaryLabel
                      ? 'bg-[#14243C] text-[#D9BB81] border-[#14243C]'
                      : 'bg-white text-[#14243C] border-[#E5E0D5] shadow-2xs'
                  }`}
                >
                  <Hash size={15} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-black text-[#14243C] text-[13px] leading-tight">الأرقام والتشكيل</span>
                  {!numbersSummaryLabel && (
                    <span className="text-[10px] font-semibold text-slate-400 mt-0.5">عدد الخانات والأنماط</span>
                  )}
                </div>
                {numbersSummaryLabel && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      clearNumbers();
                    }}
                    className="ms-auto inline-flex items-center gap-1 rounded-md bg-[#14243C] text-[#D9BB81] border border-[#D9BB81]/30 px-2 py-0.5 text-[10px] font-extrabold hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all max-w-[130px]"
                    title="إلغاء فلتر الأرقام"
                  >
                    <span className="truncate">{numbersSummaryLabel}</span>
                    <X size={10} className="shrink-0" />
                  </span>
                )}
              </div>
              <div
                className={`flex h-6.5 w-6.5 items-center justify-center rounded-md shrink-0 transition-all duration-200 ${
                  openSections.numbers
                    ? 'rotate-180 text-[#14243C] bg-[#F4F1EA]'
                    : 'text-slate-400 bg-white border border-[#EAE6DF]'
                }`}
              >
                <ChevronDown size={14} />
              </div>
            </button>

            {openSections.numbers && (
              <div className="border-t border-[#EFECE6] p-3.5 space-y-3.5 bg-[#FAF9F6]/50 max-h-64 overflow-y-auto custom-scrollbar pe-1">
                {/* Digit count pills */}
                <div>
                  <span className="block text-[11px] font-black text-[#14243C] mb-2">
                    عدد خانات الأرقام:
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: '1', label: 'أحادية', sub: '1' },
                      { id: '2', label: 'ثنائية', sub: '22' },
                      { id: '3', label: 'ثلاثية', sub: '333' },
                      { id: '4', label: 'رباعية', sub: '4444' }
                    ].map((digit) => {
                      const active = searchParams.get('digitsCount') === digit.id;
                      return (
                        <button
                          key={digit.id}
                          type="button"
                          onClick={() => {
                            updateQuery({
                              digitsCount: active ? null : digit.id
                            });
                            closeSection('numbers');
                          }}
                          className={`rounded-lg py-2 px-1 text-[11px] font-black transition-all text-center border ${
                            active
                              ? 'bg-[#14243C] text-[#FAF9F6] border-[#14243C] shadow-2xs'
                              : 'bg-white border-[#E2DDD3] text-slate-700 hover:border-[#14243C]/40'
                          }`}
                        >
                          {digit.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Number Patterns */}
                <div className="space-y-1.5 border-t border-[#E6E2D8] pt-3">
                  <span className="block text-[11px] font-black text-[#14243C] mb-1.5">
                    تشكيل الأرقام:
                  </span>
                  {[
                    { id: '4_same', label: '4 أرقام متطابقة', hint: '7777' },
                    { id: '3_same', label: '3 أرقام متطابقة', hint: '333' },
                    { id: '2_same', label: 'رقمين متطابقة', hint: '99' },
                    { id: 'first_last_same', label: 'أول وأخير متطابقة', hint: '1001 / 707' },
                    { id: 'sequence', label: 'تسلسل رقمي', hint: '123 / 1234' },
                    { id: 'all_diff', label: 'كل الأرقام مختلفة', hint: 'فريدة' }
                  ].map((pattern) => {
                    const checked = isNumberPatternChecked(pattern.id);
                    return (
                      <label
                        key={pattern.id}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleArrayParam('numbersPattern', pattern.id);
                          closeSection('numbers');
                        }}
                        className={`flex items-center justify-between rounded-lg p-2.5 text-xs font-bold cursor-pointer transition-all border ${
                          checked
                            ? 'bg-[#14243C]/[0.05] text-[#14243C] border-[#14243C]/40 shadow-2xs'
                            : 'bg-white hover:bg-[#FAF9F6] border-[#E6E2D8] text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded border transition-all ${
                              checked
                                ? 'bg-[#14243C] border-[#14243C] text-[#D9BB81]'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {checked && <Check size={11} strokeWidth={3} />}
                          </span>
                          <span>{pattern.label}</span>
                        </div>
                        <span
                          className="font-norwester text-[11px] font-bold text-[#14243C] rounded bg-[#F4F1EA] px-2 py-0.5 border border-[#E2DDD3]"
                          dir="ltr"
                        >
                          {pattern.hint}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* SECTION 4: REGION & CITY (المنطقة والمدينة)                     */}
          {/* ============================================================== */}
          <div
            className={`rounded-xl border transition-all duration-200 overflow-hidden ${
              openSections.cities
                ? 'border-[#14243C]/25 bg-white shadow-[0_8px_20px_-6px_rgba(20,36,60,0.08)] ring-1 ring-[#14243C]/5'
                : 'border-[#E6E2D8] bg-[#FAF9F6]/70 hover:bg-white hover:border-[#D9BB81]/70 hover:shadow-2xs'
            }`}
          >
            <button
              type="button"
              onClick={() => toggleSection('cities')}
              className="flex w-full items-center justify-between py-3 px-3.5 text-start transition-colors gap-2.5"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors shrink-0 ${
                    openSections.cities || citiesSummaryLabel
                      ? 'bg-[#14243C] text-[#D9BB81] border-[#14243C]'
                      : 'bg-white text-[#14243C] border-[#E5E0D5] shadow-2xs'
                  }`}
                >
                  <MapPin size={15} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-black text-[#14243C] text-[13px] leading-tight">المنطقة والمدينة</span>
                  {!citiesSummaryLabel && (
                    <span className="text-[10px] font-semibold text-slate-400 mt-0.5">تصفية حسب موقع اللوحة</span>
                  )}
                </div>
                {citiesSummaryLabel && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      clearCities();
                    }}
                    className="ms-auto inline-flex items-center gap-1 rounded-md bg-[#14243C] text-[#D9BB81] border border-[#D9BB81]/30 px-2 py-0.5 text-[10px] font-extrabold hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all max-w-[130px]"
                    title="إلغاء فلتر المدينة"
                  >
                    <span className="truncate">{citiesSummaryLabel}</span>
                    <X size={10} className="shrink-0" />
                  </span>
                )}
              </div>
              <div
                className={`flex h-6.5 w-6.5 items-center justify-center rounded-md shrink-0 transition-all duration-200 ${
                  openSections.cities
                    ? 'rotate-180 text-[#14243C] bg-[#F4F1EA]'
                    : 'text-slate-400 bg-white border border-[#EAE6DF]'
                }`}
              >
                <ChevronDown size={14} />
              </div>
            </button>

            {openSections.cities && (
              <div className="border-t border-[#EFECE6] p-3.5 space-y-2.5 bg-[#FAF9F6]/50">
                {/* City quick search input */}
                <div className="flex items-center gap-2 px-2.5 rounded-lg border border-[#E2DDD3] bg-white focus-within:border-[#14243C] transition-all overflow-hidden">
                  <Search className="shrink-0 text-slate-400" size={13} />
                  <input
                    type="text"
                    placeholder="ابحث عن منطقة أو مدينة..."
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    className="flex-1 min-w-0 border-0 bg-transparent py-2 px-1 text-xs font-bold text-[#14243C] focus:outline-none"
                  />
                </div>

                {/* City Checkbox List with internal scroll */}
                <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-1.5 pe-1">
                  {filteredCities.map((city) => {
                    const checked = isCityChecked(city.name_ar);
                    return (
                      <label
                        key={city.id}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleArrayParam('city', city.name_ar);
                          closeSection('cities');
                        }}
                        className={`flex items-center justify-between rounded-lg p-2.5 text-xs font-bold cursor-pointer transition-all border ${
                          checked
                            ? 'bg-[#14243C]/[0.05] text-[#14243C] border-[#14243C]/40 shadow-2xs'
                            : 'bg-white hover:bg-[#FAF9F6] border-[#E6E2D8] text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded border transition-all ${
                              checked
                                ? 'bg-[#14243C] border-[#14243C] text-[#D9BB81]'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {checked && <Check size={11} strokeWidth={3} />}
                          </span>
                          <span>{city.name_ar}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* SECTION 5: PLATFORM BRANDED LOGO CARD (كارت اللوجو الفاخر)    */}
          {/* ============================================================== */}
          <div className="mt-auto pt-3">
            <Link
              href="/about"
              className="group relative flex flex-col items-center text-center rounded-xl bg-gradient-to-b from-[#14243C] to-[#0B1526] px-4 py-4 text-white border border-[#243B61] shadow-[0_10px_24px_-8px_rgba(11,21,38,0.35)] hover:border-[#D9BB81]/50 transition-all overflow-hidden"
            >
              {/* Top Specular Gold Line */}
              <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-[#D9BB81]/70 to-transparent" />
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#D9BB81]/10 rounded-full blur-xl pointer-events-none" />

              {/* Brand Lockup */}
              <div className="relative flex items-center justify-center gap-3 w-full py-1">
                <img
                  src="/brand/X12.svg"
                  alt="شعار لوحة FBS"
                  className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_2px_8px_rgba(217,187,129,0.25)] shrink-0"
                />
                <div className="h-7 w-px bg-white/15 shrink-0" />
                <div className="flex flex-col items-start justify-center gap-1">
                  <img
                    src="/brand/logo.svg"
                    alt="فارس بن سعود"
                    className="h-5 w-auto object-contain drop-shadow"
                  />
                  <img
                    src="/brand/X14.svg"
                    alt="اللوحات المميزة"
                    className="h-2 w-auto object-contain opacity-90"
                  />
                </div>
              </div>

              {/* Subtle Gold Hairline Divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent my-2.5" />

              {/* Concise Platform Statement */}
              <p className="relative text-[11px] text-[#FAF9F6] font-extrabold leading-relaxed">
                المنصة الرائدة لمزادات اللوحات المميزة
              </p>
              <span className="relative text-[10px] text-[#D9BB81]/90 font-semibold mt-0.5">
                توثيق رسمي ومزايدة آمنة ومعتمدة
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
