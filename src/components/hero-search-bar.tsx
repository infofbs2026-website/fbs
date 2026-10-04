'use client';

import React, { useState, useRef, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  ArrowLeft,
  SlidersHorizontal,
  X,
  RotateCcw,
  ChevronDown,
  Check
} from 'lucide-react';

/* ========================================================================= */
/* BESPOKE PURPOSE-BUILT LUXURY SVG ICONS FOR TABS & FILTER CHIPS            */
/* ========================================================================= */

export function SvgFilterFunnel({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 4.5h14l-5.5 6.5v5.5l-3-1.8v-3.7L3 4.5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.18"
      />
    </svg>
  );
}

export function SvgAllPlates({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4.5" width="16" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <line x1="7.5" y1="4.5" x2="7.5" y2="15.5" stroke="currentColor" strokeWidth="1.2" strokeDasharray="1.5 1.5" />
      <path d="M4.5 10h1M11 8.5h3.5M11 11.5h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SvgSingleDigit({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2.5" y="3.5" width="15" height="13" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8.8 8.2 10.5 7v6.5M9.2 13.5h2.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SvgDoubleDigit({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="3.5" width="16" height="13" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5.5 8a1.6 1.6 0 0 1 2.8 1.1c0 1-1.3 1.8-2.3 2.6H8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.5 8a1.6 1.6 0 0 1 2.8 1.1c0 1-1.3 1.8-2.3 2.6H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SvgTripleDigit({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="3.5" width="17" height="13" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.8 7.5h2.2l-1 1.8a1.2 1.2 0 1 1-1 1.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.8 7.5h2.2l-1 1.8a1.2 1.2 0 1 1-1 1.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.8 7.5h2.2l-1 1.8a1.2 1.2 0 1 1-1 1.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SvgLiveBroadcast({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="3" fill="#10b981" />
      <path d="M5.5 5.5a6.5 6.5 0 0 0 0 9M14.5 5.5a6.5 6.5 0 0 1 0 9" stroke="#10b981" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M3 3a10 10 0 0 0 0 14M17 3a10 10 0 0 1 0 14" stroke="#10b981" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.55" />
    </svg>
  );
}

export function SvgCrownElite({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 15h14l-1.5-7.5-3.5 3.5-2-5.5-2 5.5-3.5-3.5L3 15z" stroke="#d9b87f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="#d9b87f" fillOpacity="0.25" />
      <circle cx="3" cy="7.5" r="1.1" fill="#d9b87f" />
      <circle cx="10" cy="5.5" r="1.2" fill="#d9b87f" />
      <circle cx="17" cy="7.5" r="1.1" fill="#d9b87f" />
      <path d="M4.5 15h11" stroke="#d9b87f" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function SvgLuxurySedan({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 12.5h14M4 12.5 5.5 8h9l1.5 4.5M3 12.5v2.5h2v-1.5h10v1.5h2v-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6.5" cy="13.5" r="1.5" fill="currentColor" />
      <circle cx="13.5" cy="13.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function SvgTransportTruck({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 5.5h9v9h-9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M11.5 8h3.5l2.5 3.5v3h-6V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="6" cy="15" r="1.5" fill="currentColor" />
      <circle cx="14.5" cy="15" r="1.5" fill="currentColor" />
      {/* Saudi Blue Transport Triangle Indicator */}
      <path d="M6 8l1.5 2.5h-3z" fill="#006ebc" />
    </svg>
  );
}

export function SvgChronograph({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10.5" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 6.5v4l2.5 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8.5 2h3M10 2v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/* ========================================================================= */
/* CUSTOM LUXURY DROPDOWN COMPONENT                                          */
/* ========================================================================= */

interface DropdownOption {
  value: string;
  label: string;
  badge?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  ariaLabel,
  className = '',
  dropdownWidth = 'w-full'
}: {
  value: string;
  onChange: (val: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
  dropdownWidth?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];
  const Icon = selectedOption?.icon;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button with Visual Depth & Solid Contrast */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        className={`w-full h-[52px] flex items-center justify-between gap-2 rounded-2xl border px-3.5 sm:px-4 text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.2)] ${
          isOpen
            ? 'border-gold bg-[#16223d] ring-4 ring-gold/25 text-white'
            : value
              ? 'border-gold/50 bg-[#121c33]/85 text-white hover:border-gold hover:bg-[#16223d]'
              : 'border-white/15 bg-[#121c33]/70 text-slate-200 hover:border-white/30 hover:bg-[#16223d]'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon className="w-4 h-4 text-gold shrink-0" />}
          <span className="truncate">{selectedOption?.label || placeholder}</span>
        </div>
        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-gold' : ''}`}
        />
      </button>

      {/* Floating Glassmorphic Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute start-0 top-full mt-2 z-50 overflow-hidden rounded-2xl border border-gold/30 bg-[#0d162b]/95 p-1.5 shadow-[0_25px_60px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.12)] backdrop-blur-2xl animate-in fade-in-0 zoom-in-95 duration-150 ${dropdownWidth}`}
        >
          <div className="max-h-60 overflow-y-auto custom-scrollbar flex flex-col gap-1 p-0.5">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              const OptIcon = opt.icon;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between gap-2.5 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer text-start ${
                    isSelected
                      ? 'bg-gold/20 text-gold-light font-black border border-gold/40 shadow-xs'
                      : 'text-slate-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {OptIcon && <OptIcon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-gold' : 'text-slate-400'}`} />}
                    <span className="truncate">{opt.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {opt.badge && (
                      <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-norwester font-black text-slate-300 border border-white/15">
                        {opt.badge}
                      </span>
                    )}
                    {isSelected && <Check size={16} className="text-gold shrink-0 stroke-[2.5]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================= */
/* DROPDOWN CONFIGURATIONS                                                   */
/* ========================================================================= */

const digitsOptions: DropdownOption[] = [
  { value: '', label: 'جميع الأرقام (الكل)', icon: SvgAllPlates },
  { value: '1', label: 'أحادي - رقم 1 فقط', badge: '1', icon: SvgSingleDigit },
  { value: '2', label: 'ثنائي - رقمان (22)', badge: '22', icon: SvgDoubleDigit },
  { value: '3', label: 'ثلاثي - 3 أرقام (333)', badge: '333', icon: SvgTripleDigit },
  { value: '4', label: 'رباعي - 4 أرقام', badge: '4444' }
];

const plateTypeOptions: DropdownOption[] = [
  { value: '', label: 'جميع الفئات', icon: SvgAllPlates },
  { value: 'خصوصي', label: 'خصوصي مميز', icon: SvgLuxurySedan },
  { value: 'نقل', label: 'نقل خاص', icon: SvgTransportTruck }
];

const sortOptions: DropdownOption[] = [
  { value: 'newest', label: 'الأحدث وصولاً للمنصة' },
  { value: 'price_desc', label: 'الأعلى سعراً (لوحات النخبة)' },
  { value: 'price_asc', label: 'الأقل سعراً' },
  { value: 'ending', label: 'ينتهي قريباً (أولوية المزايدة)', icon: SvgChronograph }
];

const cityOptions: DropdownOption[] = [
  { value: '', label: 'جميع مدن المملكة' },
  { value: 'الرياض', label: 'الرياض (العاصمة)' },
  { value: 'جدة', label: 'جدة (عروس البحر)' },
  { value: 'الدمام', label: 'الدمام والمنطقة الشرقية' },
  { value: 'مكة المكرمة', label: 'مكة المكرمة' },
  { value: 'المدينة المنورة', label: 'المدينة المنورة' },
  { value: 'الخبر', label: 'الخبر' }
];

const quickFilterChips = [
  {
    href: '/auctions/live',
    label: 'مزادات مباشرة الآن',
    icon: SvgLiveBroadcast,
    badge: 'حي',
    color: 'hover:border-emerald-500/60 hover:text-emerald-300 hover:bg-emerald-500/15'
  },
  {
    href: '/plates?featured=true',
    label: 'لوحات النخبة VIP',
    icon: SvgCrownElite,
    color: 'hover:border-gold/60 hover:text-gold-light hover:bg-gold/15'
  },
  {
    href: '/plates/search?digitsCount=1',
    label: 'لوحات فردية (1)',
    icon: SvgSingleDigit,
    color: 'hover:border-gold/60 hover:text-gold-light hover:bg-gold/15'
  },
  {
    href: '/plates/search?digitsCount=2',
    label: 'لوحات ثنائية (22)',
    icon: SvgDoubleDigit,
    color: 'hover:border-gold/60 hover:text-gold-light hover:bg-gold/15'
  },
  {
    href: '/plates/search?digitsCount=3',
    label: 'لوحات ثلاثية (333)',
    icon: SvgTripleDigit,
    color: 'hover:border-gold/60 hover:text-gold-light hover:bg-gold/15'
  },
  {
    href: '/plates?type=خصوصي',
    label: 'خصوصي مميز',
    icon: SvgLuxurySedan,
    color: 'hover:border-blue-400/60 hover:text-blue-300 hover:bg-blue-500/15'
  },
  {
    href: '/plates?type=نقل',
    label: 'نقل مميز',
    icon: SvgTransportTruck,
    color: 'hover:border-sky-400/60 hover:text-sky-300 hover:bg-sky-500/15'
  },
  {
    href: '/plates/search?sort=ending',
    label: 'قريب الانتهاء',
    icon: SvgChronograph,
    color: 'hover:border-amber-400/60 hover:text-amber-300 hover:bg-amber-500/15'
  }
];

export function HeroSearchBar() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Search State
  const [q, setQ] = useState('');
  const [digitsCount, setDigitsCount] = useState('');
  const [plateType, setPlateType] = useState('');
  const [sort, setSort] = useState('newest');

  // Advanced Filters Drawer
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [city, setCity] = useState('');

  // Submit Search
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (digitsCount) params.set('digitsCount', digitsCount);
    if (plateType) params.set('type', plateType);
    if (sort && sort !== 'newest') params.set('sort', sort);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (city) params.set('city', city);

    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `/plates/search?${qs}` : '/plates/search');
    });
  };

  const handleReset = () => {
    setQ('');
    setDigitsCount('');
    setPlateType('');
    setSort('newest');
    setMinPrice('');
    setMaxPrice('');
    setCity('');
  };

  return (
    <div className="relative w-full">
      {/* Main Search Bar Card - Sleek, Uncluttered Luxury Glassmorphism with Higher Video Transparency */}
      <div className="rounded-2xl border border-gold/35 bg-[#060c1c]/50 hover:bg-[#060c1c]/60 backdrop-blur-2xl p-2.5 sm:p-3 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5),0_0_0_1px_rgba(217,184,127,0.2)] transition-all duration-300">
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Main Controls Row: Only Search Input + Advanced Filters Button + Search CTA */}
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            {/* Lighter Frosted Glass Search Input */}
            <div className="relative flex-1 group">
              <div className="absolute start-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                <Search size={20} className="text-gold group-focus-within:text-gold-light group-focus-within:scale-110 transition-all drop-shadow-[0_0_8px_rgba(217,184,127,0.4)]" />
              </div>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                name="q"
                aria-label="حروف اللوحة أو أرقامها"
                placeholder="ابحث برقم (مثال: 1 أو 777)، حروف (مثال: ف ب س)، أو مزيج (س ع د 1)..."
                className="w-full h-12 sm:h-[50px] rounded-xl border border-white/20 bg-white/[0.08] hover:bg-white/[0.12] ps-11 pe-9 text-xs sm:text-sm font-bold text-white placeholder:text-white/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)] transition-all focus:border-gold focus:bg-white/[0.16] focus:outline-none focus:ring-2 focus:ring-gold/30"
                maxLength={80}
              />
              {q && (
                <button
                  type="button"
                  onClick={() => setQ('')}
                  className="absolute end-3 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-white rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                  aria-label="مسح النص"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Toggle Advanced Filters Button */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`h-12 sm:h-[50px] flex items-center justify-center gap-2 rounded-xl border px-3.5 sm:px-4 text-xs sm:text-sm font-bold transition-all duration-200 shrink-0 cursor-pointer shadow-md ${
                showAdvanced || minPrice || maxPrice || city || digitsCount || plateType
                  ? 'border-gold bg-gold/20 text-gold-light shadow-[0_0_15px_rgba(217,184,127,0.25)] ring-2 ring-gold/40'
                  : 'border-white/15 bg-white/[0.08] text-slate-100 hover:bg-white/[0.14] hover:border-gold/50 hover:text-gold'
              }`}
              title="خيارات وفلاتر متقدمة"
            >
              <SlidersHorizontal size={16} className={showAdvanced || minPrice || maxPrice || city || digitsCount || plateType ? 'text-gold' : 'text-gold-light'} />
              <span>فلاتر متقدمة</span>
              {(minPrice || maxPrice || city || digitsCount || plateType) && (
                <span className="flex h-2 w-2 rounded-full bg-gold animate-pulse" />
              )}
              <ChevronDown size={14} className={`transition-transform duration-200 ${showAdvanced ? 'rotate-180 text-gold' : 'text-slate-400'}`} />
            </button>

            {/* Primary Action Button - Prestigious Gold CTA */}
            <button
              type="submit"
              disabled={isPending}
              className="h-12 sm:h-[50px] btn btn-gold flex items-center justify-center gap-2 rounded-xl !px-6 sm:!px-7 text-xs sm:text-sm font-black text-navy shadow-lg shadow-gold/25 hover:shadow-gold/40 active:scale-[0.98] border border-gold/70 shrink-0 cursor-pointer transition-all duration-200"
            >
              <span className="font-black text-navy">{isPending ? 'جاري البحث...' : 'ابحث الآن'}</span>
              <ArrowLeft size={16} className="text-navy" />
            </button>
          </div>

          {/* Advanced Filters Collapsible Drawer (Dropdowns, Price Range & Quick Filter Chips) */}
          {showAdvanced && (
            <div className="rounded-xl border border-white/10 bg-[#090f1d]/80 backdrop-blur-xl p-4 sm:p-5 mt-2 transition-all animate-fadeIn shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)] space-y-4">
              {/* Row 1: Dropdown Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-start">
                {/* Custom Dropdown: Digits Count Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">عدد الأرقام</label>
                  <CustomSelect
                    value={digitsCount}
                    onChange={setDigitsCount}
                    options={digitsOptions}
                    ariaLabel="عدد الأرقام"
                    dropdownWidth="w-full"
                  />
                </div>

                {/* Custom Dropdown: Plate Type Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">فئة اللوحة</label>
                  <CustomSelect
                    value={plateType}
                    onChange={setPlateType}
                    options={plateTypeOptions}
                    ariaLabel="فئة اللوحة"
                    dropdownWidth="w-full"
                  />
                </div>

                {/* Custom City Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">المدينة / المنطقة</label>
                  <CustomSelect
                    value={city}
                    onChange={setCity}
                    options={cityOptions}
                    ariaLabel="المدينة"
                    dropdownWidth="w-full"
                  />
                </div>

                {/* Custom Sort Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">ترتيب النتائج</label>
                  <CustomSelect
                    value={sort}
                    onChange={setSort}
                    options={sortOptions}
                    ariaLabel="ترتيب العرض"
                    dropdownWidth="w-full"
                  />
                </div>
              </div>

              {/* Row 2: Price Range Filter & Reset Button */}
              <div className="border-t border-white/10 pt-3 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                  <span className="text-xs font-bold text-slate-200 shrink-0">النطاق السعري:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="من"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-28 h-10 rounded-xl border border-white/15 bg-[#121c33]/85 px-3 text-xs font-bold text-white placeholder:text-slate-400 focus:border-gold focus:outline-none"
                    />
                    <span className="text-xs font-bold text-slate-400">-</span>
                    <input
                      type="number"
                      placeholder="إلى"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-28 h-10 rounded-xl border border-white/15 bg-[#121c33]/85 px-3 text-xs font-bold text-white placeholder:text-slate-400 focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      ['أقل من 50 ألف', '', '50000'],
                      ['50k - 200k', '50000', '200000'],
                      ['أكثر من 200k', '200000', '']
                    ].map(([label, min, max]) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => {
                          setMinPrice(min);
                          setMaxPrice(max);
                        }}
                        className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-bold text-slate-200 hover:border-gold/60 hover:bg-gold/15 hover:text-gold cursor-pointer transition-colors"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <RotateCcw size={13} />
                    <span>إعادة تعيين الفلاتر</span>
                  </button>
                </div>
              </div>

              {/* Row 3: Quick Filter Chips (Shown ONLY in Advanced Mode) */}
              <div className="border-t border-white/10 pt-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
                <div className="flex items-center gap-2 pe-2 text-xs font-black text-white shrink-0">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-gold/15 text-gold border border-gold/30">
                    <SvgFilterFunnel className="w-3 h-3" />
                  </span>
                  <span>فلاتر سريعة:</span>
                </div>

                {quickFilterChips.map((chip) => {
                  const Icon = chip.icon;
                  return (
                    <Link
                      key={chip.href}
                      href={chip.href}
                      className={`group inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-slate-200 transition-all duration-200 shadow-2xs hover:shadow-sm text-[11px] ${chip.color}`}
                    >
                      <span className="transition-transform duration-200 group-hover:scale-110">
                        <Icon className="w-3 h-3" />
                      </span>
                      <span>{chip.label}</span>
                      {chip.badge && (
                        <span className="ms-1 rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-bold text-emerald-300 border border-emerald-500/30">
                          {chip.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
