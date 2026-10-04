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
      className="filter-sidebar-card flex flex-col lg:h-[calc(100vh-7.5rem)] p-5 sm:p-6 rounded-3xl border-2 border-[#0c162d]/25 hover:border-[#0c162d]/60 bg-white shadow-[0_15px_35px_-10px_rgba(12,22,45,0.08)] backdrop-blur-xl transition-all duration-300 relative group/sidebar"
      style={{ opacity: isPending ? 0.7 : 1 }}
    >
      {/* Top Ambient Hero-Navy Line Accent */}
      <div className="absolute top-0 inset-x-8 h-1 bg-gradient-to-r from-transparent via-[#0c162d]/30 to-transparent rounded-full" />

      {/* 1. Fixed Sidebar Header & Search */}
      <div className="shrink-0 border-b border-slate-100 pb-3 mb-2.5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-gradient-to-br from-[#0c162d] to-navy text-white border border-[#0c162d]/30 shadow-xs shrink-0">
              <SlidersHorizontal size={16} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-base font-black text-navy leading-none">تصفية اللوحات</h2>
              <span className="text-[11px] font-semibold text-slate-500 mt-1">تخصيص الخيارات والمعايير</span>
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
              className="flex items-center gap-1.5 text-xs font-black text-rose-600 hover:text-rose-700 transition-all bg-rose-50/90 hover:bg-rose-100/90 px-2.5 py-1 rounded-xl border border-rose-200/80 shadow-2xs active:scale-95"
              title="مسح كافة الفلاتر"
            >
              <RotateCcw size={12} strokeWidth={2.5} />
              <span>إعادة ضبط</span>
            </button>
          )}
        </div>

        {/* Executive Text Search Input */}
        <div className="relative flex items-center rounded-xl border-2 border-slate-200/90 bg-white shadow-2xs transition-all focus-within:border-[#0c162d] focus-within:ring-2 focus-within:ring-[#0c162d]/15 focus-within:shadow-[0_4px_16px_rgba(12,22,45,0.12)] overflow-hidden">
          <Search className="ms-3 text-slate-400 shrink-0" size={15} />
          <input
            id="search-q"
            className="w-full border-0 bg-transparent py-2.5 ps-2 pe-18 text-xs sm:text-sm font-semibold text-navy placeholder:text-slate-400 focus:outline-none focus:ring-0"
            placeholder="مثال: 777 أو ف ب س"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateQuery({ q: q.trim() || null });
              }
            }}
          />
          {q && (
            <button
              type="button"
              onClick={() => {
                setQ('');
                updateQuery({ q: null });
              }}
              className="absolute end-14 text-slate-400 hover:text-slate-600 p-1"
              title="مسح البحث"
            >
              <X size={13} />
            </button>
          )}
          <button
            type="button"
            onClick={() => updateQuery({ q: q.trim() || null })}
            className="absolute end-1.5 top-1.5 bottom-1.5 px-3.5 rounded-lg bg-gradient-to-r from-[#070e1c] via-[#0c162d] to-[#070e1c] text-white text-xs font-black hover:shadow-sm border border-[#0c162d]/40 active:scale-95 transition-all flex items-center gap-1"
          >
            <span>بحث</span>
          </button>
        </div>
      </div>

      {/* 2. Scrollable Middle Body: Clean Accordion Sections & Bottom Branded Logo Card */}
      <div dir="ltr" className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
        <div dir="rtl" className="flex flex-col min-h-full space-y-2.5 pe-0.5">
        {/* ============================================================== */}
        {/* SECTION 1: PRICE RANGE (نطاق السعر)                             */}
        {/* ============================================================== */}
        <div
          className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xs ${
            openSections.price
              ? 'border-[#0c162d]/40 bg-white shadow-md ring-1 ring-[#0c162d]/10'
              : 'border-slate-200/90 bg-white/95 hover:border-[#0c162d]/30 hover:bg-white hover:shadow-xs'
          }`}
        >
          <button
            type="button"
            onClick={() => toggleSection('price')}
            className="flex w-full items-center justify-between py-2.5 sm:py-3 px-3.5 text-start font-bold text-xs sm:text-sm text-navy hover:bg-slate-50/70 transition-colors gap-2"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="flex h-7.5 w-7.5 items-center justify-center rounded-xl bg-slate-100 text-[#0c162d] border border-slate-200/80 shrink-0">
                <Coins size={15} />
              </div>
              <span className="font-black text-slate-900 text-xs sm:text-sm shrink-0">نطاق السعر</span>
              {priceSummaryLabel && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    clearPrice();
                  }}
                  className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-2.5 py-0.5 text-[10px] font-extrabold shadow-2xs hover:from-rose-600 hover:to-red-600 transition-all max-w-[150px]"
                  title="إلغاء فلتر السعر"
                >
                  <span className="truncate">{priceSummaryLabel}</span>
                  <X size={10} className="shrink-0" />
                </span>
              )}
            </div>
            <div
              className={`flex h-6.5 w-6.5 items-center justify-center rounded-lg shrink-0 transition-all duration-200 ${
                openSections.price ? 'rotate-180 text-[#0c162d] bg-slate-100' : 'text-slate-400 bg-slate-100/70'
              }`}
            >
              <ChevronDown size={15} />
            </div>
          </button>

          {openSections.price && (
            <div className="border-t border-slate-100 p-4 space-y-3.5 bg-slate-50/70">
              {/* Custom Min / Max Inputs */}
              <div>
                <span className="block text-[11px] font-black text-slate-700 mb-2">
                  تحديد مخصص (ريال سعودي):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative rounded-xl border border-slate-200/90 bg-white focus-within:border-[#0c162d] focus-within:ring-1 focus-within:ring-[#0c162d]/20 transition-all overflow-hidden">
                    <span className="absolute start-2.5 top-2.5 text-[10px] font-black text-slate-400">من</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleApplyPrice();
                      }}
                      className="w-full border-0 bg-transparent py-2 ps-7 pe-2 text-xs font-bold text-center text-navy focus:outline-none"
                    />
                  </div>
                  <div className="relative rounded-xl border border-slate-200/90 bg-white focus-within:border-[#0c162d] focus-within:ring-1 focus-within:ring-[#0c162d]/20 transition-all overflow-hidden">
                    <span className="absolute start-2.5 top-2.5 text-[10px] font-black text-slate-400">إلى</span>
                    <input
                      type="number"
                      placeholder="500,000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleApplyPrice();
                      }}
                      className="w-full border-0 bg-transparent py-2 ps-7 pe-2 text-xs font-bold text-center text-navy focus:outline-none"
                    />
                  </div>
                </div>

                {/* Range Slider for Quick Max Price Dragging */}
                <div className="mt-3 px-1">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1.5">
                    <span>الحد الأقصى التقديري</span>
                    <span className="font-norwester text-gold-dark font-black text-xs">
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
                    className="w-full accent-gold h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleApplyPrice()}
                  className="mt-3 w-full rounded-xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 py-2.5 text-xs font-black text-white shadow-sm hover:from-emerald-800 hover:to-emerald-700 transition-all active:scale-[0.99] flex items-center justify-center gap-2 border border-emerald-500/30"
                >
                  <Check size={14} strokeWidth={2.5} />
                  <span>تطبيق نطاق السعر</span>
                </button>
              </div>

              {/* Preset Price Checkboxes with internal scroll if needed */}
              <div className="border-t border-slate-200/70 pt-3 space-y-1.5 max-h-52 overflow-y-auto custom-scrollbar pe-1">
                <span className="block text-[11px] font-black text-slate-700 mb-1.5">
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
                      className={`flex items-center justify-between rounded-xl p-2.5 text-xs font-bold cursor-pointer transition-all border ${
                        checked
                          ? 'bg-emerald-50 text-emerald-950 border-emerald-400 shadow-2xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`flex h-4.5 w-4.5 items-center justify-center rounded-md border transition-all ${
                            checked
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {checked && <Check size={12} strokeWidth={3} />}
                        </span>
                        <span>{tier.label}</span>
                      </div>
                      <SarSymbol className={`w-3.5 h-3.5 ${checked ? 'text-emerald-700' : 'text-slate-400'}`} />
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
          className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xs ${
            openSections.letters
              ? 'border-[#0c162d]/40 bg-white shadow-md ring-1 ring-[#0c162d]/10'
              : 'border-slate-200/90 bg-white/95 hover:border-[#0c162d]/30 hover:bg-white hover:shadow-xs'
          }`}
        >
          <button
            type="button"
            onClick={() => toggleSection('letters')}
            className="flex w-full items-center justify-between py-2.5 sm:py-3 px-3.5 text-start font-bold text-xs sm:text-sm text-navy hover:bg-slate-50/70 transition-colors gap-2"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="flex h-7.5 w-7.5 items-center justify-center rounded-xl bg-slate-100 text-[#0c162d] border border-slate-200/80 shrink-0">
                <FileText size={15} />
              </div>
              <span className="font-black text-slate-900 text-xs sm:text-sm shrink-0">الحروف</span>
              {lettersSummaryLabel && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    clearLetters();
                  }}
                  className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-2.5 py-0.5 text-[10px] font-extrabold shadow-2xs hover:from-rose-600 hover:to-red-600 transition-all max-w-[150px]"
                  title="إلغاء فلتر الحروف"
                >
                  <span className="truncate">{lettersSummaryLabel}</span>
                  <X size={10} className="shrink-0" />
                </span>
              )}
            </div>
            <div
              className={`flex h-6.5 w-6.5 items-center justify-center rounded-lg shrink-0 transition-all duration-200 ${
                openSections.letters ? 'rotate-180 text-[#0c162d] bg-slate-100' : 'text-slate-400 bg-slate-100/70'
              }`}
            >
              <ChevronDown size={15} />
            </div>
          </button>

          {openSections.letters && (
            <div className="border-t border-slate-100 p-4 space-y-2 bg-slate-50/70 max-h-56 overflow-y-auto custom-scrollbar pe-1">
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
                    className={`flex items-center justify-between rounded-xl p-2.5 text-xs font-bold cursor-pointer transition-all border ${
                      checked
                        ? 'bg-emerald-50 text-emerald-950 border-emerald-400 shadow-2xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`flex h-4.5 w-4.5 items-center justify-center rounded-md border transition-all ${
                          checked
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {checked && <Check size={12} strokeWidth={3} />}
                      </span>
                      <span>{pattern.label}</span>
                    </div>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200/80">
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
          className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xs ${
            openSections.numbers
              ? 'border-[#0c162d]/40 bg-white shadow-md ring-1 ring-[#0c162d]/10'
              : 'border-slate-200/90 bg-white/95 hover:border-[#0c162d]/30 hover:bg-white hover:shadow-xs'
          }`}
        >
          <button
            type="button"
            onClick={() => toggleSection('numbers')}
            className="flex w-full items-center justify-between py-2.5 sm:py-3 px-3.5 text-start font-bold text-xs sm:text-sm text-navy hover:bg-slate-50/70 transition-colors gap-2"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="flex h-7.5 w-7.5 items-center justify-center rounded-xl bg-slate-100 text-[#0c162d] border border-slate-200/80 shrink-0">
                <Hash size={15} />
              </div>
              <span className="font-black text-slate-900 text-xs sm:text-sm shrink-0">الأرقام والتشكيل</span>
              {numbersSummaryLabel && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    clearNumbers();
                  }}
                  className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-2.5 py-0.5 text-[10px] font-extrabold shadow-2xs hover:from-rose-600 hover:to-red-600 transition-all max-w-[150px]"
                  title="إلغاء فلتر الأرقام"
                >
                  <span className="truncate">{numbersSummaryLabel}</span>
                  <X size={10} className="shrink-0" />
                </span>
              )}
            </div>
            <div
              className={`flex h-6.5 w-6.5 items-center justify-center rounded-lg shrink-0 transition-all duration-200 ${
                openSections.numbers ? 'rotate-180 text-[#0c162d] bg-slate-100' : 'text-slate-400 bg-slate-100/70'
              }`}
            >
              <ChevronDown size={15} />
            </div>
          </button>

          {openSections.numbers && (
            <div className="border-t border-slate-100 p-4 space-y-3.5 bg-slate-50/70 max-h-64 overflow-y-auto custom-scrollbar pe-1">
              {/* Digit count pills */}
              <div>
                <span className="block text-[11px] font-black text-slate-700 mb-2">
                  خانة الأرقام:
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: '1', label: 'أحادية (1)' },
                    { id: '2', label: 'ثنائية (22)' },
                    { id: '3', label: 'ثلاثية (333)' },
                    { id: '4', label: 'رباعية (4444)' }
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
                        className={`rounded-xl py-2 text-[11px] font-black transition-all text-center border ${
                          active
                            ? 'bg-[#0c162d] text-white border-[#0c162d] shadow-xs'
                            : 'bg-white border-slate-200/90 text-slate-700 hover:border-[#0c162d]/40 hover:bg-slate-50'
                        }`}
                      >
                        {digit.label.split(' ')[0]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Number Patterns */}
              <div className="space-y-1.5 border-t border-slate-200/70 pt-3">
                <span className="block text-[11px] font-black text-slate-700 mb-1.5">
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
                      className={`flex items-center justify-between rounded-xl p-2.5 text-xs font-bold cursor-pointer transition-all border ${
                        checked
                          ? 'bg-emerald-50 text-emerald-950 border-emerald-400 shadow-2xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`flex h-4.5 w-4.5 items-center justify-center rounded-md border transition-all ${
                            checked
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {checked && <Check size={12} strokeWidth={3} />}
                        </span>
                        <span>{pattern.label}</span>
                      </div>
                      <span className="font-norwester text-[11px] font-bold text-slate-600 rounded-md bg-slate-100 px-2 py-0.5 border border-slate-200/80" dir="ltr">
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
          className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xs ${
            openSections.cities
              ? 'border-[#0c162d]/40 bg-white shadow-md ring-1 ring-[#0c162d]/10'
              : 'border-slate-200/90 bg-white/95 hover:border-[#0c162d]/30 hover:bg-white hover:shadow-xs'
          }`}
        >
          <button
            type="button"
            onClick={() => toggleSection('cities')}
            className="flex w-full items-center justify-between py-2.5 sm:py-3 px-3.5 text-start font-bold text-xs sm:text-sm text-navy hover:bg-slate-50/70 transition-colors gap-2"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="flex h-7.5 w-7.5 items-center justify-center rounded-xl bg-slate-100 text-[#0c162d] border border-slate-200/80 shrink-0">
                <MapPin size={15} />
              </div>
              <span className="font-black text-slate-900 text-xs sm:text-sm shrink-0">المنطقة والمدينة</span>
              {citiesSummaryLabel && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    clearCities();
                  }}
                  className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-2.5 py-0.5 text-[10px] font-extrabold shadow-2xs hover:from-rose-600 hover:to-red-600 transition-all max-w-[150px]"
                  title="إلغاء فلتر المدينة"
                >
                  <span className="truncate">{citiesSummaryLabel}</span>
                  <X size={10} className="shrink-0" />
                </span>
              )}
            </div>
            <div
              className={`flex h-6.5 w-6.5 items-center justify-center rounded-lg shrink-0 transition-all duration-200 ${
                openSections.cities ? 'rotate-180 text-[#0c162d] bg-slate-100' : 'text-slate-400 bg-slate-100/70'
              }`}
            >
              <ChevronDown size={15} />
            </div>
          </button>

          {openSections.cities && (
            <div className="border-t border-slate-100 p-4 space-y-2.5 bg-slate-50/70">
              {/* City quick search input */}
              <div className="relative rounded-xl border border-slate-200/90 bg-white focus-within:border-[#0c162d] focus-within:ring-1 focus-within:ring-[#0c162d]/20 transition-all overflow-hidden">
                <Search className="absolute start-2.5 top-2.5 text-slate-400" size={13} />
                <input
                  type="text"
                  placeholder="ابحث عن منطقة أو مدينة..."
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  className="w-full border-0 bg-transparent py-2 ps-8 pe-3 text-[11px] font-bold text-navy focus:outline-none"
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
                      className={`flex items-center justify-between rounded-xl p-2.5 text-xs font-bold cursor-pointer transition-all border ${
                        checked
                          ? 'bg-emerald-50 text-emerald-950 border-emerald-400 shadow-2xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`flex h-4.5 w-4.5 items-center justify-center rounded-md border transition-all ${
                            checked
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {checked && <Check size={12} strokeWidth={3} />}
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
        {/* SECTION 5: SORTING & ELITE (الترتيب والنخبة)                   */}
        {/* ============================================================== */}
        <div className="rounded-2xl border-2 border-slate-200/90 bg-slate-50/80 p-3 space-y-2.5 shadow-2xs">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-5.5 w-5.5 items-center justify-center rounded-md bg-slate-200/80 text-navy">
                <ArrowUpDown size={12} />
              </div>
              <span className="text-xs font-black text-navy">ترتيب النتائج</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100/90 border border-slate-200/80 text-xs">
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
                    className={`rounded-lg py-1.5 sm:py-2 font-black transition-all text-center border ${
                      active
                        ? 'bg-[#0c162d] text-white border-[#0c162d] shadow-xs'
                        : 'border-transparent text-slate-600 hover:text-navy hover:bg-white/80'
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Elite Plates VIP Card Toggle */}
          <label
            onClick={(e) => {
              e.preventDefault();
              const isChecked = searchParams.get('featured') === 'true';
              updateQuery({ featured: isChecked ? null : 'true' });
            }}
            className={`flex items-center justify-between rounded-xl p-2.5 text-xs font-black cursor-pointer transition-all border-2 ${
              searchParams.get('featured') === 'true'
                ? 'bg-emerald-50/90 text-emerald-950 border-emerald-400 shadow-2xs ring-1 ring-emerald-400/30'
                : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-all ${
                  searchParams.get('featured') === 'true'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-slate-100 text-slate-700 border-slate-200/80'
                }`}
              >
                <svg className="w-4 h-4 text-inherit" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14v2H5v-2z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black leading-none">لوحات النخبة المعتمدة</span>
                <span className="text-[10px] font-semibold text-slate-500 mt-0.5">المعروضات الأكثر تميزاً</span>
              </div>
            </div>
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all ${
                searchParams.get('featured') === 'true'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {searchParams.get('featured') === 'true' && <Check size={13} strokeWidth={3} />}
            </span>
          </label>
        </div>

        {/* ============================================================== */}
        {/* SECTION 6: PLATFORM BRANDED LOGO CARD (كارت اللوجو الفاخر)    */}
        {/* ============================================================== */}
        <div className="mt-auto pt-2">
          <div className="relative rounded-2xl bg-gradient-to-br from-[#050a15] via-[#0c162d] to-[#070e1c] p-3 sm:p-3.5 text-white border border-[#1e2c4d]/90 shadow-[0_8px_25px_-4px_rgba(12,22,45,0.45)] overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-gold/15 rounded-full blur-lg pointer-events-none" />

            {/* Official Badge & Platform Tag */}
            <div className="relative flex items-center justify-between gap-1.5 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[9.5px] font-black text-gold-light border border-gold/25">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>منصة رسمية معتمدة</span>
              </span>
              <span className="text-[9.5px] font-norwester font-bold text-slate-300 tracking-wider">FBS PLATFORM</span>
            </div>

            {/* Center: Official Brand Logos Side-by-Side in One Single Row */}
            <Link
              href="/about"
              className="relative flex items-center justify-center gap-3 sm:gap-4 py-2 px-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-gold/30 transition-all group my-1"
            >
              {/* 1. X12: FBS Plate Emblem SVG - Prominent and clearly visible */}
              <img
                src="/brand/X12.svg"
                alt="شعار لوحة FBS"
                className="h-11 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-[0_2px_8px_rgba(217,184,127,0.35)] shrink-0"
              />

              {/* 2 & 3. Typography: Calligraphy (logo.svg) & Subtitle (X14.svg) */}
              <div className="flex flex-col items-center justify-center gap-1">
                <img
                  src="/brand/logo.svg"
                  alt="فارس بن سعود"
                  className="h-5 sm:h-5.5 w-auto object-contain drop-shadow"
                />
                <img
                  src="/brand/X14.svg"
                  alt="اللوحات المميزة"
                  className="h-2 sm:h-2.5 w-auto object-contain opacity-90"
                />
              </div>
            </Link>

            {/* Slogan on a Single Line */}
            <p className="relative text-[10px] sm:text-[10.5px] text-slate-300 text-center font-medium truncate mt-1.5 px-0.5">
              المنصة الرائدة بالمملكة لمزادات اللوحات المميزة
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
