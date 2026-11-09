'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Search,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ArrowLeft,
  Crown,
  MessageCircle,
  Phone,
  X,
  FileCheck2,
  Lock,
  RotateCcw,
  Layers,
  Gavel,
  Car,
  BadgeDollarSign,
  Scale
} from 'lucide-react';

import { type FaqItem, masterFaqData } from '@/lib/faq-data';
export { type FaqItem, masterFaqData };

const baseCategories = [
  { id: 'all', label: 'جميع الأسئلة', icon: Layers },
  { id: 'auctions', label: 'المزادات والمزايدة', icon: Gavel },
  { id: 'guarantees', label: 'الضمان والتأمين', icon: ShieldCheck },
  { id: 'transfer', label: 'نقل الملكية والمرور', icon: Car },
  { id: 'selling', label: 'البائعون وعرض اللوحات', icon: BadgeDollarSign },
  { id: 'policies', label: 'التوثيق والسياسات', icon: Scale }
] as const;

export function FaqView({
  items,
  whatsappNumber,
}: {
  items?: FaqItem[];
  whatsappNumber?: string;
} = {}) {
  const sourceItems = items && items.length > 0 ? items : masterFaqData;
  const cleanWa = (whatsappNumber ?? '966500000000').replace(/[^0-9]/g, '') || '966500000000';
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const categoriesList = useMemo(
    () =>
      baseCategories.map((cat) => ({
        ...cat,
        count:
          cat.id === 'all'
            ? sourceItems.length
            : sourceItems.filter((item) => item.catId === cat.id).length,
      })),
    [sourceItems],
  );

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sourceItems.filter((item) => {
      const matchCat = activeCategory === 'all' || item.catId === activeCategory;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        item.q.toLowerCase().includes(q) ||
        item.a.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q) ||
        item.id.includes(q)
      );
    });
  }, [activeCategory, searchQuery, sourceItems]);

  // Divide into two symmetrical luxury columns (Home-page layout)
  const { col1, col2 } = useMemo(() => {
    const mid = Math.ceil(filteredItems.length / 2);
    return {
      col1: filteredItems.slice(0, mid),
      col2: filteredItems.slice(mid)
    };
  }, [filteredItems]);

  const renderCard = (item: FaqItem) => {
    const isOpen = openId === item.id;
    return (
      <div
        key={item.id}
        className={`luxury-card rounded-2xl border transition-all duration-300 bg-white/95 backdrop-blur-sm overflow-hidden ${
          isOpen
            ? 'border-gold/70 shadow-[0_10px_35px_rgba(217,184,127,0.18)] ring-1 ring-gold/20'
            : 'border-slate-200/90 hover:border-gold/50 hover:shadow-sm'
        }`}
      >
        <button
          type="button"
          onClick={() => setOpenId(isOpen ? null : item.id)}
          className="flex w-full items-center justify-between gap-3 p-4 sm:p-4.5 text-start cursor-pointer select-none"
        >
          <div className="flex-1 min-w-0 space-y-1.5">
            {/* Unified Luxury Tag with Fixed Width (170px) and Norwester Number */}
            <div className="flex items-center">
              <span
                style={{ width: '170px' }}
                className="inline-flex items-center gap-1.5 rounded-md border border-gold/40 bg-gold/12 px-2 py-0.5 text-xs font-bold text-[#5c3810] shadow-2xs w-[170px] max-w-full"
              >
                <span className="font-norwester font-black text-xs sm:text-[13px] tracking-wide text-[#482907] shrink-0" dir="ltr">
                  {item.id}
                </span>
                <span className="h-3 w-px bg-gold/50 shrink-0" />
                <span className="whitespace-nowrap truncate">{item.category}</span>
              </span>
            </div>

            {/* Question Title */}
            <h3 className="text-xs sm:text-[13px] md:text-sm font-black text-navy-deep leading-snug group-hover:text-gold-dark transition-colors line-clamp-2">
              {item.q}
            </h3>
          </div>

          {/* Expand / Collapse Chevron Button */}
          <span
            className={`shrink-0 flex h-8 w-8 sm:h-8.5 sm:w-8.5 items-center justify-center rounded-full border transition-all duration-300 shadow-2xs ${
              isOpen
                ? 'rotate-180 bg-navy-deep border-navy-deep text-gold'
                : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-gold/40 hover:text-gold'
            }`}
          >
            <ChevronDown size={16} />
          </span>
        </button>

        {/* Answer Body */}
        {isOpen && (
          <div className="border-t border-slate-100 bg-[#fcfdfe] p-4.5 sm:p-5 text-xs sm:text-[13.5px] leading-relaxed text-slate-700 font-medium">
            <p className="leading-relaxed">{item.a}</p>

            {/* Answer Footer Strip with Verified Badge & Action */}
            <div className="mt-4 pt-3.5 border-t border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800 border border-emerald-200/80">
                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                  <span>إجابة معتمدة رسمياً</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 border border-slate-200/80">
                  <ShieldCheck size={13} className="text-gold-dark shrink-0" />
                  <span>{item.badge}</span>
                </span>
              </div>

              {item.action && (
                <Link
                  href={item.action.href}
                  className="inline-flex items-center gap-1.5 font-bold text-navy-deep hover:text-gold-dark transition-colors self-start sm:self-auto text-xs"
                >
                  <span>{item.action.label}</span>
                  <ArrowLeft size={14} />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-[#F2F0EA] text-navy">
      {/* ================================================================= */}
      {/* 1. LUXURY HERO BANNER WITH HIGH-CONTRAST ROYAL NAVY & SEARCH      */}
      {/* ================================================================= */}
      <section className="hero-luxury-ambient relative overflow-hidden text-white pt-26 sm:pt-32 pb-14 sm:pb-20 border-b border-[#D9BB81]/30 shadow-xl">
        <div className="container-fbs relative z-10">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Link href="/" className="hover:text-gold transition-colors">
              الرئيسية
            </Link>
            <span>/</span>
            <span className="text-gold-light">مركز المعرفة والشفافية</span>
            <span>/</span>
            <span className="text-white font-bold">دليل الأسئلة الشامل</span>
          </nav>

          {/* Unified Luxury Eyebrow Badge (Spacious & Breathable) */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-gold/50 bg-[#101b33]/90 px-6 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-black text-gold-light shadow-[0_4px_22px_rgba(217,184,127,0.25)] backdrop-blur-md my-6 sm:my-8">
            <span className="flex h-2 w-2 rounded-full bg-gold animate-pulse shrink-0" />
            <HelpCircle size={18} className="text-gold shrink-0" />
            <span className="tracking-wide">مركز المعرفة والشفافية — الدليل التشغيلي والنظامي الشامل</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl">
            الأسئلة الشائعة والمساعدة الشاملة
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-300 font-normal">
            إجابات دقيقة ومفصلة تغطي كافة جوانب المنظومة: من آليات المزايدة والتفويض البنكي الآمن وحساب الضمان Escrow، إلى التوثيق الرقمي ونقل الملكية المعتمد عبر منصة أبشر.
          </p>

          {/* Hero Interactive Smart Search Console (Single Luxury Bar with Integrated Action Button) */}
          <div className="mt-8 sm:mt-10 max-w-3xl">
            <div className="relative flex items-center rounded-2xl border-2 border-gold/45 bg-[#0a1426]/95 p-1.5 sm:p-2 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all focus-within:border-gold focus-within:ring-4 focus-within:ring-gold/20">
              <div className="flex items-center ps-3.5 sm:ps-4 text-gold shrink-0">
                <Search size={22} />
              </div>
              <input
                type="text"
                placeholder="ابحث في كافة الأسئلة (مثال: التأمين، نقل الملكية، مكافحة القنص، سعر الحفظ)…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-3 px-3 sm:px-4 text-sm sm:text-base font-semibold text-white placeholder:text-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="مسح البحث"
                  className="me-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  <X size={15} />
                </button>
              )}
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-dark via-gold to-gold-light px-5 sm:px-6 py-3 text-xs sm:text-sm font-black text-navy-deep shadow-[0_2px_14px_rgba(217,184,127,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <Search size={15} className="shrink-0" />
                <span className="whitespace-nowrap">بحث فوري</span>
              </button>
            </div>
          </div>

          {/* Trust Highlights Strip (4 Institutional Pillars) Seamlessly Embedded into Dark Luxury Hero */}
          <div className="mt-12 sm:mt-16 pt-8 border-t border-gold/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4.5">
              {[
                {
                  title: 'توثيق 100% عبر النفاذ وأبشر',
                  desc: 'مطابقة رسمية لجميع المزايدين والملاك لمنع الحسابات الوهمية',
                  icon: ShieldCheck
                },
                {
                  title: 'حساب ضمان بنكي معتمد Escrow',
                  desc: 'حماية كاملة لأموال المشتري حتى استلام اللوحة ونقلها رسمياً',
                  icon: Lock
                },
                {
                  title: 'فك حجز فوري للتأمين دون خصم',
                  desc: 'إلغاء التفويض المالي آلياً لجميع المزايدين غير الفائزين',
                  icon: RotateCcw
                },
                {
                  title: 'نقل ملكية رقمي خلال 48-72 ساعة',
                  desc: 'إدارة المعاملة رسمياً عبر أبشر دون مراجعة إدارات المرور',
                  icon: FileCheck2
                }
              ].map((chip, idx) => {
                const Icon = chip.icon;
                return (
                  <div
                    key={idx}
                    className="group relative overflow-hidden flex items-start gap-3.5 rounded-2xl border border-gold/50 bg-gradient-to-br from-white/[0.14] via-[#102042]/90 to-[#0c1833]/95 backdrop-blur-xl p-4.5 sm:p-5 shadow-[0_10px_35px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:border-gold hover:from-white/[0.2] hover:via-[#162c5b]/95 hover:shadow-[0_14px_45px_rgba(217,184,127,0.3),inset_0_1px_1px_rgba(255,255,255,0.45)] hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Glass Specular Ambient Reflection */}
                    <div className="pointer-events-none absolute -top-10 -end-10 h-28 w-28 rounded-full bg-gold/20 blur-2xl group-hover:bg-gold/35 transition-all duration-300" />

                    <div className="relative z-10 flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/35 via-gold/15 to-transparent border border-gold/60 text-gold-light shadow-[0_0_20px_rgba(217,184,127,0.3)] group-hover:scale-110 group-hover:text-gold group-hover:shadow-[0_0_28px_rgba(217,184,127,0.55)] transition-all duration-300">
                      <Icon size={22} />
                    </div>
                    <div className="relative z-10">
                      <h2 className="text-xs sm:text-sm font-black text-white group-hover:text-gold-light transition-colors leading-snug tracking-tight">
                        {chip.title}
                      </h2>
                      <p className="mt-1 text-[11.5px] sm:text-xs text-slate-200 font-medium leading-relaxed">
                        {chip.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 2. MAIN ACCORDION DIRECTORY (1400px WIDTH, 1 ROW TABS, 2 COLUMNS) */}
      {/* ================================================================= */}
      <section className="container-fbs py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-[1400px] w-full space-y-8">
          {/* Category Filter Pills Bar - Strictly in One Balanced Row on Desktop with Distinctive SVG Icons */}
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 sm:gap-2.5 pb-3 border-b border-slate-200 w-full overflow-x-auto lg:overflow-visible">
            {categoriesList.map((cat) => {
              const isActive = activeCategory === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`group flex-1 min-w-fit inline-flex items-center justify-center gap-2 rounded-xl py-3 px-3.5 text-xs sm:text-[13px] font-bold transition-all duration-200 cursor-pointer whitespace-nowrap shadow-2xs ${
                    isActive
                      ? 'border-2 border-gold bg-gradient-to-r from-navy via-[#1f2c4e] to-navy-deep text-gold shadow-md'
                      : 'border border-slate-200/90 bg-white text-slate-600 hover:border-gold/50 hover:text-navy hover:bg-slate-50'
                  }`}
                >
                  <Icon size={16} className={`shrink-0 transition-colors ${isActive ? 'text-gold' : 'text-slate-400 group-hover:text-gold'}`} />
                  <span>{cat.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10.5px] font-mono font-bold ${
                      isActive ? 'bg-gold/20 text-gold-light' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Search / Filter Status Summary */}
          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 font-medium px-1">
            <span>
              عرض <strong className="text-navy-deep font-norwester text-sm sm:text-base font-black">{filteredItems.length}</strong> من أصل{' '}
              <span className="font-norwester">{sourceItems.length}</span> سؤالاً معتمداً
            </span>
            {(searchQuery || activeCategory !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="text-xs font-bold text-gold-dark hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>إعادة ضبط الفلاتر</span>
                <RotateCcw size={12} />
              </button>
            )}
          </div>

          {/* FAQ Accordion Items in 2 Symmetrical Columns (Like Home Page) */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4.5 items-start">
              {/* Column 1 (Items 1 to 7) */}
              <div className="space-y-3 sm:space-y-3.5">
                {col1.map((item) => renderCard(item))}
              </div>

              {/* Column 2 (Items 8 to 14) */}
              <div className="space-y-3 sm:space-y-3.5">
                {col2.map((item) => renderCard(item))}
              </div>
            </div>
          ) : (
            /* Luxury Empty State */
            <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 text-gold-dark font-black mb-4">
                <HelpCircle size={28} />
              </div>
              <h4 className="text-base sm:text-lg font-black text-navy-deep">لم نتمكن من العثور على سؤال مطابق</h4>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                لم نجد أي إجابة مطابقة لبحثك عن &ldquo;{searchQuery}&rdquo;. حاول استخدام كلمات بحث بديلة مثل (التأمين، أبشر، المزايدة) أو تواصل مباشرة مع المكتب الخاص.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="btn btn-navy text-xs font-bold py-2.5 px-5 cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>عرض جميع الأسئلة</span>
                </button>
                <Link href="/contact" className="btn btn-gold text-xs font-bold py-2.5 px-5">
                  <MessageCircle size={14} />
                  <span>التواصل مع المكتب الخاص</span>
                </Link>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* 4. PRESTIGE VIP CONCIERGE & WHATSAPP SUPPORT BOX             */}
          {/* ============================================================= */}
          <div className="rounded-3xl border-2 border-gold/45 bg-gradient-to-br from-[#060b17] via-[#0d162a] to-[#121f3d] p-7 sm:p-9 text-white shadow-2xl relative overflow-hidden">
            {/* Ambient Lighting */}
            <div className="pointer-events-none absolute -top-20 end-0 h-48 w-48 rounded-full bg-gold/15 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 start-0 h-40 w-40 rounded-full bg-blue-900/20 blur-3xl" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2.5 max-w-xl">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-3.5 py-1 text-xs font-bold text-gold-light backdrop-blur-md">
                  <Crown size={14} className="text-gold" />
                  <span>خدمة عملاء النخبة والمكتب الخاص VIP</span>
                </span>
                <h4 className="text-lg sm:text-xl font-black text-white">هل لديك استفسار استثنائي لم تجد إجابته؟</h4>
                <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                  فريق المستشارين في المكتب الخاص لمنصة فارس بن سعود متاح للرد المباشر وتقديم الاستشارات الخاصة حول تقييم اللوحات الملكية، وإجراءات المزايدة والتفويض البنكي المحمي.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a
                  href={`https://wa.me/${cleanWa}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-gold text-xs sm:text-sm font-black py-3 px-5 shadow-lg shadow-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle size={17} />
                  <span>محادثة واتساب فورية</span>
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gold/40 bg-white/10 px-5 py-3 text-xs sm:text-sm font-bold text-white backdrop-blur-md hover:bg-white/20 hover:border-gold transition-all"
                >
                  <Phone size={15} />
                  <span>طلب اتصال هاتفي</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
