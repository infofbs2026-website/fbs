'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Search,
  ShieldCheck,
  ChevronDown,
  ArrowLeft,
  X,
  Lock,
  RotateCcw,
  Gavel,
  Car,
  BadgeDollarSign,
  Scale,
} from 'lucide-react';

import { type FaqItem, masterFaqData } from '@/lib/faq-data';
export { type FaqItem, masterFaqData };

const CATEGORY_GROUPS: ReadonlyArray<{
  id: FaqItem['catId'];
  label: string;
  subtitle: string;
  icon: typeof Gavel;
}> = [
  {
    id: 'auctions',
    label: 'المزادات وفئات اللوحات والرموز',
    subtitle: 'شروط المشاركة، منع القنص، وتصنيفات اللوحات',
    icon: Gavel,
  },
  {
    id: 'guarantees',
    label: 'الضمان المالي والتأمين',
    subtitle: 'حساب الضمان Escrow، فك الحجز، وحماية الحقوق',
    icon: ShieldCheck,
  },
  {
    id: 'transfer',
    label: 'نقل الملكية والمرور',
    subtitle: 'إصدار الاستمارة، الحفظ، وتسليم اللوحات المعدنية',
    icon: Car,
  },
  {
    id: 'selling',
    label: 'البائعون وعرض اللوحات',
    subtitle: 'آلية التقييم، العمولة، وسعر الحفظ السري',
    icon: BadgeDollarSign,
  },
  {
    id: 'policies',
    label: 'التوثيق والسياسات والخصوصية',
    subtitle: 'التحقق من الملكية، مهلة السداد، وسرية المزايدين',
    icon: Scale,
  },
];

function pluralizeQuestions(count: number): string {
  if (count === 1) return 'سؤال واحد';
  if (count === 2) return 'سؤالان';
  if (count <= 10) return `${count} أسئلة`;
  return `${count} سؤالاً`;
}

export function FaqView({
  items,
}: {
  items?: FaqItem[];
  whatsappNumber?: string;
} = {}) {
  const sourceItems = items && items.length > 0 ? items : masterFaqData;
  const [searchQuery, setSearchQuery] = useState('');
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    auctions: true,
  });

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0;

  const groupedSections = useMemo(() => {
    return CATEGORY_GROUPS.map((group) => {
      const groupItems = sourceItems.filter((item) => {
        if (item.catId !== group.id) return false;
        if (!normalizedQuery) return true;
        return (
          item.q.toLowerCase().includes(normalizedQuery) ||
          item.a.toLowerCase().includes(normalizedQuery) ||
          group.label.toLowerCase().includes(normalizedQuery)
        );
      });
      return {
        ...group,
        items: groupItems,
      };
    }).filter((section) => section.items.length > 0);
  }, [sourceItems, normalizedQuery]);

  const totalMatchedCount = useMemo(
    () => groupedSections.reduce((acc, g) => acc + g.items.length, 0),
    [groupedSections],
  );

  const allExpanded = useMemo(
    () => groupedSections.length > 0 && groupedSections.every((g) => openGroups[g.id]),
    [groupedSections, openGroups],
  );

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleAllGroups = () => {
    const nextState = !allExpanded;
    const updated: Record<string, boolean> = {};
    for (const g of groupedSections) {
      updated[g.id] = nextState;
    }
    setOpenGroups(updated);
  };

  return (
    <div className="w-full bg-[#F2F0EA] text-navy antialiased">
      {/* ================================================================= */}
      {/* 1. COMPACT LUXURY HERO BANNER WITH SEARCH                         */}
      {/* ================================================================= */}
      <section className="hero-luxury-ambient relative overflow-hidden text-white pt-22 sm:pt-26 lg:pt-28 pb-8 sm:pb-10 border-b border-[#D9BB81]/30 shadow-xl">
        <div className="w-[min(calc(100%-2.5rem),76rem)] lg:w-[min(73vw,76rem)] mx-auto relative z-10">
          {/* Clean Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-2 text-[11px] sm:text-xs text-slate-400 font-normal">
            <Link href="/" className="hover:text-gold transition-colors">
              الرئيسية
            </Link>
            <span>/</span>
            <span className="text-gold-light font-medium">الأسئلة الشائعة</span>
          </nav>

          <h1 className="text-[clamp(1.375rem,1.1rem+0.9vw,1.875rem)] font-bold text-white tracking-tight leading-tight max-w-2xl">
            الأسئلة الشائعة والمساعدة الشاملة
          </h1>
          <p className="mt-2 text-[max(0.75rem,11.5px)] sm:text-[0.8125rem] text-slate-300/90 font-normal max-w-2xl leading-relaxed">
            إجابات دقيقة ومنظمة حول المزادات، الحساب الضامن، التأمين المسترد، وإجراءات نقل الملكية.
          </p>

          {/* Hero Interactive Smart Search Console */}
          <div className="mt-5 sm:mt-6 max-w-xl">
            <div className="relative flex items-center rounded-2xl border border-gold/45 bg-[#0a1426]/95 p-1 shadow-[0_10px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/20">
              <div className="flex items-center ps-3 text-gold shrink-0">
                <Search size={17} />
              </div>
              <input
                type="text"
                placeholder="ابحث في الأسئلة (مثال: التأمين، نقل الملكية، منع القنص، سعر الحفظ)…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-w-0 bg-transparent py-2 px-2.5 text-[12px] sm:text-[13px] font-medium text-white placeholder:text-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="مسح البحث"
                  className="me-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  <X size={12} />
                </button>
              )}
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-gold-dark via-gold to-gold-light px-3.5 py-2 text-[11.5px] font-bold text-navy-deep shadow-[0_2px_12px_rgba(217,184,127,0.35)] hover:brightness-110 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <Search size={13} className="shrink-0" />
                <span className="whitespace-nowrap">بحث</span>
              </button>
            </div>
          </div>

          {/* Trust Highlights Strip (3 Institutional Pillars) */}
          <div className="mt-6 pt-5 border-t border-gold/20">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full max-w-[820px]">
              {[
                {
                  title: 'توثيق رسمي معتمد',
                  desc: 'تحقق معتمد لكافة المزايدين والملاك',
                  icon: ShieldCheck,
                },
                {
                  title: 'حساب ضمان بنكي Escrow',
                  desc: 'حماية كاملة لأموالك حتى نقل الملكية',
                  icon: Lock,
                },
                {
                  title: 'فك حجز فوري للتأمين',
                  desc: 'إلغاء التفويض آلياً لغير الفائزين دون خصم',
                  icon: RotateCcw,
                },
              ].map((chip, idx) => {
                const Icon = chip.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-sm"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/20 text-gold border border-gold/30">
                      <Icon size={15} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11.5px] font-semibold text-white leading-snug">{chip.title}</p>
                      <p className="text-[10.5px] text-slate-300/90 font-normal leading-snug">{chip.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 2. CATEGORY-GROUPED COLLAPSIBLE CARDS DIRECTORY                   */}
      {/* ================================================================= */}
      <section className="w-[min(calc(100%-2.5rem),76rem)] lg:w-[min(73vw,76rem)] mx-auto py-7 sm:py-10">
        <div className="space-y-4">
          {/* Subtle Directory Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-0.5 text-[11.5px] sm:text-xs text-slate-500 font-normal">
            {isSearching ? (
              <div className="flex items-center gap-2">
                <span>
                  نتائج البحث عن &ldquo;<strong className="text-navy-deep font-semibold">{searchQuery}</strong>&rdquo;:{' '}
                  <strong className="font-norwester text-navy-deep">{totalMatchedCount}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-[11px] font-semibold text-gold-dark hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>مسح</span>
                  <X size={11} />
                </button>
              </div>
            ) : (
              <span>تصنيفات الأسئلة المعتمدة ({groupedSections.length} مجموعات)</span>
            )}

            {!isSearching && groupedSections.length > 0 && (
              <button
                type="button"
                onClick={toggleAllGroups}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:border-gold/50 hover:text-navy-deep transition-colors cursor-pointer"
              >
                <span>{allExpanded ? 'طي جميع المجموعات' : 'فتح جميع المجموعات'}</span>
              </button>
            )}
          </div>

          {/* Category Cards List */}
          {groupedSections.length > 0 ? (
            <div className="space-y-3.5">
              {groupedSections.map((group) => {
                const Icon = group.icon;
                const isOpen = isSearching ? true : Boolean(openGroups[group.id]);

                return (
                  <article
                    key={group.id}
                    className={`rounded-2xl border bg-white/95 backdrop-blur-sm overflow-hidden transition-all duration-200 ${
                      isOpen
                        ? 'border-gold/55 shadow-[0_8px_28px_rgba(20,36,60,0.06)] ring-1 ring-gold/15'
                        : 'border-slate-200/90 hover:border-gold/45 shadow-2xs'
                    }`}
                  >
                    {/* Collapsible Category Header */}
                    <button
                      type="button"
                      onClick={() => !isSearching && toggleGroup(group.id)}
                      aria-expanded={isOpen}
                      className={`flex w-full items-center justify-between gap-3 px-4 py-3.5 sm:px-5 sm:py-4 text-start select-none transition-colors ${
                        isSearching ? 'cursor-default' : 'cursor-pointer hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                            isOpen
                              ? 'border-navy-deep bg-navy-deep text-gold shadow-xs'
                              : 'border-gold/30 bg-gold/10 text-gold-dark'
                          }`}
                        >
                          <Icon size={17} strokeWidth={1.8} />
                        </span>

                        <div className="min-w-0 space-y-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-[max(0.875rem,13.5px)] font-semibold text-navy-deep leading-snug">
                              {group.label}
                            </h2>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10.5px] font-medium text-slate-500">
                              {pluralizeQuestions(group.items.length)}
                            </span>
                          </div>
                          <p className="text-[max(0.72rem,11px)] text-slate-500 font-normal leading-snug">
                            {group.subtitle}
                          </p>
                        </div>
                      </div>

                      {!isSearching && (
                        <span
                          className={`shrink-0 flex h-7.5 w-7.5 items-center justify-center rounded-full border transition-transform duration-200 ${
                            isOpen
                              ? 'rotate-180 border-navy-deep bg-navy-deep text-gold'
                              : 'border-slate-200 bg-slate-50 text-slate-500'
                          }`}
                        >
                          <ChevronDown size={15} />
                        </span>
                      )}
                    </button>

                    {/* All Questions & Answers for this Category Inside the Unified Card */}
                    {isOpen && (
                      <div className="border-t border-slate-100 divide-y divide-slate-100 bg-[#fcfcfd]">
                        {group.items.map((item) => (
                          <div key={item.id} className="px-4 py-3.5 sm:px-6 sm:py-4">
                            <h3 className="flex items-start gap-2 text-[max(0.78rem,12px)] font-semibold text-navy-deep leading-snug">
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                              <span>{item.q}</span>
                            </h3>
                            <p className="mt-1.5 ps-3.5 text-[max(0.72rem,11px)] sm:text-[0.75rem] text-slate-600 font-normal leading-[1.7] max-w-4xl">
                              {item.a}
                            </p>
                            {item.action && (
                              <div className="mt-2 ps-3.5">
                                <Link
                                  href={item.action.href}
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-gold-dark hover:text-navy-deep transition-colors"
                                >
                                  <span>{item.action.label}</span>
                                  <ArrowLeft size={11} />
                                </Link>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            /* Clean Empty Search State */
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center shadow-2xs">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold-dark mb-3">
                <HelpCircle size={22} />
              </div>
              <h2 className="text-sm font-semibold text-navy-deep">لم نجد أسئلة مطابقة لبحثك</h2>
              <p className="mt-1.5 text-[11.5px] sm:text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-normal">
                لم نجد نتائج مطابقة لـ &ldquo;{searchQuery}&rdquo;. جرّب كلمات أخرى مثل (التأمين، نقل الملكية، المزايدة).
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-navy-deep px-4 py-2 text-[11.5px] font-semibold text-gold hover:brightness-110 transition-all cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>إظهار جميع المجموعات</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
