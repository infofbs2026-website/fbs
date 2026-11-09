'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Edit3,
  ExternalLink,
  FileText,
  HelpCircle,
  MapPin,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react';
import styles from '../admin-dashboard.module.css';
import { callAdminManage, formatAdminDate } from '../helpers';
import type { AdminCmsPageRecord, AdminDashboardData, AdminFaqRecord } from '../types';

interface PagesCmsProps {
  data: AdminDashboardData;
  onNotify: (msg: string, kind?: 'success' | 'error') => void;
  onRequireMfa: () => void;
  onRefresh: () => void;
}

const CORE_PAGES: Array<{ slug: string; title: string; route: string; defaultBody: string }> = [
  {
    slug: 'auction-policy',
    title: 'سياسة وضوابط المزادات',
    route: '/auction-policy',
    defaultBody: `المادة الأولى: انعقاد المزاد وإدارته\nتُدار جميع المزادات إلكترونياً وبشكل مباشر وفوري عبر منصة فارس بن سعود للوحات المميزة.\n\nالمادة الثانية: نظام مكافحة القنص (Anti-Sniping)\nيُفعّل النظام تمديداً تلقائياً للمزاد عند تقديم أي مزايدة مقبولة خلال الثواني الأخيرة لضمان عدالة المنافسة.\n\nالمادة الثالثة: الإلزام القانوني للمزايدة\nتعد أي مزايدة يتقدم بها العضو التزاماً قانونياً ومالياً لا رجعة فيه.`,
  },
  {
    slug: 'terms',
    title: 'الشروط والأحكام العامة',
    route: '/terms',
    defaultBody: `أولاً: نطاق الخدمة والتعريفات\nتعد منصة «فارس بن سعود للوحات المميزة» وسيطاً تقنياً وتنظيمياً معتمداً لعرض لوحات المركبات المميزة وتنظيم المزادات الحية الإلكترونية.\n\nثانياً: شروط الأهلية والتسجيل\nيشترط للمشاركة في المزادات أن يكون العضو ذا أهلية شرعية وقانونية كاملة وموثق الهوية الوطنية.`,
  },
  {
    slug: 'privacy',
    title: 'سياسة الخصوصية وحماية البيانات',
    route: '/privacy',
    defaultBody: `1. التزامنا بالخصوصية\nتلتزم منصة فارس بن سعود بحماية البيانات الشخصية والمستندات الرسمية لعملائها وفقاً لنظام حماية البيانات الشخصية في المملكة العربية السعودية.\n\n2. سرية مستندات الملكية\nتُحفظ مستندات إثبات الملكية في مساحات تخزين سحابية مشفرة ولا يتم نشرها للعامة.`,
  },
  {
    slug: 'deposit-policy',
    title: 'سياسة التأمين المالي والاسترداد',
    route: '/deposit-policy',
    defaultBody: `1. الغرض من تأمين المزاد\nيهدف تأمين المزاد إلى ضمان جدية المشاركة ومنع المزايدات الوهمية.\n\n2. استرداد التأمين لغير الفائزين\nيتم فك الحجز وإعادة مبلغ التأمين بالكامل بنسبة 100% للمزايدين غير الفائزين فور إغلاق المزاد.`,
  },
  {
    slug: 'about',
    title: 'عن فارس بن سعود للوحات المميزة',
    route: '/about',
    defaultBody: `دار المزادات والوساطة الأولى في المملكة العربية السعودية للوحات المركبات الملكية والأحادية والنادرة، بإشراف مالي وتنظيمي معتمد عبر نظام الضامن Escrow.`,
  },
  {
    slug: 'how-it-works',
    title: 'دليل وآلية عمل المنصة',
    route: '/how-it-works',
    defaultBody: `توثيق الحساب، تفويض مبلغ التأمين المسترد، الدخول لصالة المزاد المباشر، وإتمام نقل الملكية الرقمي عبر أبشر خلال 48 إلى 72 ساعة عمل.`,
  },
];

const FAQ_CATEGORIES = [
  { id: 'auctions', label: 'المزادات والمزايدة' },
  { id: 'guarantees', label: 'الضمان المالي والتأمين' },
  { id: 'transfer', label: 'نقل الملكية والمرور' },
  { id: 'selling', label: 'البائعون وعرض اللوحات' },
  { id: 'policies', label: 'التوثيق والسياسات' },
];

export function PagesCmsSection({ data, onNotify, onRequireMfa, onRefresh }: PagesCmsProps) {
  const [subTab, setSubTab] = useState<'PAGES' | 'FAQS' | 'REFERENCE'>('PAGES');
  const [busy, setBusy] = useState(false);

  // Page Editor Drawer
  const [editingPage, setEditingPage] = useState<{
    slug: string;
    title_ar: string;
    body_ar: string;
    published: boolean;
  } | null>(null);
  const [pageReason, setPageReason] = useState('تحديث ونشر محتوى الصفحة من لوحة الإدارة');

  // FAQ Editor Drawer
  const [editingFaq, setEditingFaq] = useState<{
    id: string | null;
    question_ar: string;
    answer_ar: string;
    catId: string;
    sort_order: number;
    published: boolean;
  } | null>(null);

  // New City Modal
  const [newCityOpen, setNewCityOpen] = useState(false);
  const [cityNameAr, setCityNameAr] = useState('');
  const [cityNameEn, setCityNameEn] = useState('');
  const [cityRegionId, setCityRegionId] = useState(data.regions[0]?.id ?? '');
  const [deletingFaqId, setDeletingFaqId] = useState<string | null>(null);

  function openPageEditor(slug: string, fallbackTitle = '', fallbackBody = '') {
    const existing: AdminCmsPageRecord | undefined = data.cmsPages.find((p) => p.slug === slug);
    setEditingPage({
      slug,
      title_ar: existing?.title_ar || fallbackTitle || slug,
      body_ar: existing?.body_ar || fallbackBody,
      published: existing ? existing.published : true,
    });
    setPageReason(`تحديث محتوى صفحة (${slug}) من لوحة الإدارة`);
  }

  async function saveCmsPage() {
    if (!editingPage) return;
    if (!/^[a-z0-9-]+$/.test(editingPage.slug)) {
      onNotify('معرّف الرابط (Slug) يجب أن يحتوي على حروف إنجليزية صغيرة وأرقام وشرطات فقط.', 'error');
      return;
    }
    if (editingPage.title_ar.trim().length < 2 || editingPage.body_ar.trim().length < 3) {
      onNotify('يرجى إدخال عنوان الصفحة والمحتوى النصي.', 'error');
      return;
    }
    setBusy(true);
    const res = await callAdminManage({
      action: 'cms.save',
      slug: editingPage.slug,
      title_ar: editingPage.title_ar.trim(),
      body_ar: editingPage.body_ar.trim(),
      published: editingPage.published,
      reason: pageReason.trim() || 'تحديث محتوى صفحة',
    });
    setBusy(false);

    if (!res.ok) {
      if (res.mfaRequired) onRequireMfa();
      onNotify(res.error || 'تعذر حفظ الصفحة.', 'error');
      return;
    }
    setEditingPage(null);
    onNotify(res.message || 'تم حفظ الصفحة ونشرها فوراً.');
    onRefresh();
  }

  function openFaqEditor(faq?: AdminFaqRecord) {
    if (faq) {
      const catId = (faq.question_en || 'policies').split('|')[0] || 'policies';
      setEditingFaq({
        id: faq.id,
        question_ar: faq.question_ar,
        answer_ar: faq.answer_ar,
        catId,
        sort_order: faq.sort_order,
        published: faq.published,
      });
    } else {
      setEditingFaq({
        id: null,
        question_ar: '',
        answer_ar: '',
        catId: 'auctions',
        sort_order: data.faqs.length + 1,
        published: true,
      });
    }
  }

  async function saveFaq() {
    if (!editingFaq) return;
    if (editingFaq.question_ar.trim().length < 3 || editingFaq.answer_ar.trim().length < 3) {
      onNotify('يرجى كتابة السؤال والإجابة بشكل كامل.', 'error');
      return;
    }
    const catMeta = FAQ_CATEGORIES.find((c) => c.id === editingFaq.catId) ?? FAQ_CATEGORIES[0];
    setBusy(true);
    const res = await callAdminManage({
      action: 'faq.save',
      id: editingFaq.id,
      question_ar: editingFaq.question_ar.trim(),
      answer_ar: editingFaq.answer_ar.trim(),
      question_en: `${catMeta.id}|${catMeta.label}|إجابة معتمدة رسمياً`,
      sort_order: editingFaq.sort_order,
      published: editingFaq.published,
      reason: 'تحديث مركز الأسئلة الشائعة من الإدارة',
    });
    setBusy(false);

    if (!res.ok) {
      if (res.mfaRequired) onRequireMfa();
      onNotify(res.error || 'تعذر حفظ السؤال الشائع.', 'error');
      return;
    }
    setEditingFaq(null);
    onNotify(res.message || 'تم حفظ السؤال الشائع.');
    onRefresh();
  }

  async function seedDefaultFaqs() {
    setBusy(true);
    const res = await callAdminManage({ action: 'faq.seed_defaults' });
    setBusy(false);
    if (!res.ok) {
      if (res.mfaRequired) onRequireMfa();
      onNotify(res.error || 'تعذر استيراد الأسئلة الشائعة.', 'error');
      return;
    }
    onNotify(res.message || 'تم استيراد الأسئلة الشائعة الافتراضية.');
    onRefresh();
  }

  async function confirmDeleteFaq() {
    if (!deletingFaqId) return;
    const id = deletingFaqId;
    setDeletingFaqId(null);
    setBusy(true);
    const res = await callAdminManage({ action: 'faq.delete', id, reason: 'حذف سؤال شائع من الإدارة' });
    setBusy(false);
    if (!res.ok) {
      if (res.mfaRequired) onRequireMfa();
      onNotify(res.error || 'تعذر حذف السؤال.', 'error');
      return;
    }
    onNotify(res.message || 'تم حذف السؤال.');
    onRefresh();
  }

  async function toggleCityActive(cityId: string, name_ar: string, name_en: string, active: boolean) {
    setBusy(true);
    const res = await callAdminManage({
      action: 'reference.city_save',
      cityId,
      name_ar,
      name_en,
      active,
      reason: `${active ? 'تفعيل' : 'إيقاف'} مدينة ${name_ar}`,
    });
    setBusy(false);
    if (!res.ok) {
      if (res.mfaRequired) onRequireMfa();
      onNotify(res.error || 'تعذر تحديث المدينة.', 'error');
      return;
    }
    onNotify(res.message || 'تم تحديث المدينة.');
    onRefresh();
  }

  async function createCity() {
    if (cityNameAr.trim().length < 2) {
      onNotify('يرجى إدخال اسم المدينة بالعربية.', 'error');
      return;
    }
    setBusy(true);
    const res = await callAdminManage({
      action: 'reference.city_save',
      cityId: null,
      name_ar: cityNameAr.trim(),
      name_en: cityNameEn.trim() || cityNameAr.trim(),
      regionId: cityRegionId || undefined,
      active: true,
      reason: `إضافة مدينة ${cityNameAr.trim()} إلى قوائم المنصة`,
    });
    setBusy(false);
    if (!res.ok) {
      if (res.mfaRequired) onRequireMfa();
      onNotify(res.error || 'تعذر إضافة المدينة.', 'error');
      return;
    }
    setNewCityOpen(false);
    setCityNameAr('');
    setCityNameEn('');
    onNotify(res.message || 'تمت إضافة المدينة بنجاح.');
    onRefresh();
  }

  async function togglePlateType(typeId: string, active: boolean) {
    setBusy(true);
    const res = await callAdminManage({
      action: 'reference.type_toggle',
      typeId,
      active,
      reason: `${active ? 'تفعيل' : 'إيقاف'} فئة لوحة`,
    });
    setBusy(false);
    if (!res.ok) {
      if (res.mfaRequired) onRequireMfa();
      onNotify(res.error || 'تعذر تحديث فئة اللوحة.', 'error');
      return;
    }
    onNotify(res.message || 'تم تحديث فئة اللوحة.');
    onRefresh();
  }

  const customPages = data.cmsPages.filter((p) => !CORE_PAGES.some((c) => c.slug === p.slug));

  return (
    <div className="space-y-4">
      {/* Sub-Navigation Tabs */}
      <div className={styles.toolbar}>
        <div className={styles.filterPills}>
          <button
            type="button"
            onClick={() => setSubTab('PAGES')}
            className={`${styles.filterPill} ${subTab === 'PAGES' ? styles.filterPillActive : ''}`}
          >
            <FileText size={14} />
            <span>صفحات الموقع واللوائح القانونية</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('FAQS')}
            className={`${styles.filterPill} ${subTab === 'FAQS' ? styles.filterPillActive : ''}`}
          >
            <HelpCircle size={14} />
            <span>مركز الأسئلة الشائعة ({data.faqs.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('REFERENCE')}
            className={`${styles.filterPill} ${subTab === 'REFERENCE' ? styles.filterPillActive : ''}`}
          >
            <MapPin size={14} />
            <span>المدن السعودية وفئات اللوحات</span>
          </button>
        </div>

        {subTab === 'PAGES' && (
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() =>
              setEditingPage({
                slug: 'vip-policy',
                title_ar: 'صفحة تنظيمية جديدة',
                body_ar: '',
                published: true,
              })
            }
          >
            <Plus size={15} />
            <span>صفحة مخصصة جديدة</span>
          </button>
        )}

        {subTab === 'FAQS' && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={seedDefaultFaqs}
              className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-extrabold text-[var(--gold)] hover:opacity-80 cursor-pointer bg-transparent border-0"
              title="استيراد واستعادة الأسئلة الشائعة الافتراضية في قاعدة البيانات"
            >
              <RotateCcw size={13} />
              <span>استيراد الأسئلة الافتراضية</span>
            </button>
            <button type="button" className={styles.btnPrimary} onClick={() => openFaqEditor()}>
              <Plus size={15} />
              <span>إضافة سؤال شائع</span>
            </button>
          </div>
        )}

        {subTab === 'REFERENCE' && (
          <button type="button" className={styles.btnPrimary} onClick={() => setNewCityOpen(true)}>
            <Plus size={15} />
            <span>إضافة مدينة سعودية</span>
          </button>
        )}
      </div>

      {/* TAB 1: CMS PAGES */}
      {subTab === 'PAGES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CORE_PAGES.map((core) => {
            const dbRow = data.cmsPages.find((p) => p.slug === core.slug);
            const isPublished = dbRow ? dbRow.published : false;

            return (
              <article key={core.slug} className={styles.itemCard}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <h3 className="text-[15px] font-black m-0 text-[var(--ink-strong)]">
                        {dbRow?.title_ar || core.title}
                      </h3>
                      <span className="text-[var(--muted)] opacity-40">•</span>
                      <span
                        className="text-xs font-extrabold"
                        style={{ color: isPublished ? '#065f46' : '#92400e' }}
                      >
                        {isPublished ? 'منشورة ومعتمدة' : 'النص الافتراضي'}
                      </span>
                    </div>

                    <div className="flex items-center flex-wrap gap-2 text-[11.5px] text-[var(--muted)]">
                      <span className="font-mono opacity-80" dir="ltr">
                        {core.route}
                      </span>
                      {dbRow?.updated_at && (
                        <>
                          <span className="opacity-40">•</span>
                          <span>آخر تحديث: {formatAdminDate(dbRow.updated_at)}</span>
                        </>
                      )}
                      {core.slug === 'auction-policy' && (
                        <>
                          <span className="opacity-40">•</span>
                          <span className="font-extrabold" style={{ color: '#065f46' }}>
                            مرتبطة بتوقيع الشروط الإلزامي للمزايدين
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      className={styles.iconBtn}
                      onClick={() => openPageEditor(core.slug, core.title, core.defaultBody)}
                      title="تحرير المحتوى والنشر"
                      aria-label={`تحرير ${dbRow?.title_ar || core.title}`}
                    >
                      <Edit3 size={15} />
                    </button>

                    <Link
                      href={core.route}
                      target="_blank"
                      className={styles.iconBtn}
                      title="معاينة حية في الموقع"
                      aria-label={`معاينة ${dbRow?.title_ar || core.title}`}
                    >
                      <ExternalLink size={15} />
                    </Link>
                  </div>
                </div>

                <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed m-0 pt-2 border-t border-[var(--adm-border-subtle)]">
                  {dbRow?.body_ar || core.defaultBody}
                </p>
              </article>
            );
          })}

          {customPages.map((custom) => (
            <article key={custom.slug} className={styles.itemCard}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center flex-wrap gap-2">
                    <h3 className="text-[15px] font-black m-0 text-[var(--ink-strong)]">
                      {custom.title_ar}
                    </h3>
                    <span className="text-[var(--muted)] opacity-40">•</span>
                    <span
                      className="text-xs font-extrabold"
                      style={{ color: custom.published ? '#065f46' : '#64748b' }}
                    >
                      {custom.published ? 'منشورة' : 'مسودة'}
                    </span>
                  </div>
                  <div className="text-[11.5px] text-[var(--muted)] font-mono opacity-80" dir="ltr">
                    /{custom.slug}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => openPageEditor(custom.slug, custom.title_ar, custom.body_ar)}
                    title="تعديل الصفحة"
                    aria-label={`تعديل ${custom.title_ar}`}
                  >
                    <Edit3 size={15} />
                  </button>
                </div>
              </div>

              <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed m-0 pt-2 border-t border-[var(--adm-border-subtle)]">
                {custom.body_ar}
              </p>
            </article>
          ))}
        </div>
      )}

      {/* TAB 2: FAQS */}
      {subTab === 'FAQS' && (
        <section className={styles.panel}>
          {data.faqs.length === 0 ? (
            <div className={styles.emptyBox}>
              <HelpCircle size={30} className="mx-auto mb-2 opacity-70" />
              <p className="text-sm font-bold">صفحة الأسئلة الشائعة تعرض حالياً الدليل الافتراضي</p>
              <p className="mt-1 text-xs max-w-lg mx-auto">
                اضغط على «استيراد الأسئلة الافتراضية» لنسخها إلى قاعدة البيانات وتعديل أي سؤال أو إضافة أسئلة جديدة بحرية كاملة.
              </p>
              <button
                type="button"
                disabled={busy}
                onClick={seedDefaultFaqs}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold text-[var(--gold)] hover:opacity-80 cursor-pointer bg-transparent border-0"
              >
                <RotateCcw size={14} />
                <span>استيراد الأسئلة الافتراضية للتحكم بها الآن</span>
              </button>
            </div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>الترتيب</th>
                    <th>التصنيف</th>
                    <th>السؤال</th>
                    <th>الحالة</th>
                    <th>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {data.faqs.map((faq) => {
                    const catLabel = (faq.question_en || '').split('|')[1] || 'عام';
                    return (
                      <tr key={faq.id}>
                        <td className="font-mono font-bold">{faq.sort_order}</td>
                        <td>
                          <span className="text-xs font-extrabold text-[var(--gold)]">{catLabel}</span>
                        </td>
                        <td>
                          <div className="font-bold text-xs">{faq.question_ar}</div>
                          <div className="text-[11px] opacity-70 line-clamp-1 mt-0.5">{faq.answer_ar}</div>
                        </td>
                        <td>
                          <span
                            className="text-xs font-extrabold"
                            style={{ color: faq.published ? '#065f46' : '#64748b' }}
                          >
                            {faq.published ? 'منشور' : 'مخفي'}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              className={styles.iconBtn}
                              onClick={() => openFaqEditor(faq)}
                              title="تعديل السؤال"
                              aria-label="تعديل السؤال"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              type="button"
                              className={styles.iconBtn}
                              onClick={() => setDeletingFaqId(faq.id)}
                              title="حذف السؤال"
                              aria-label="حذف السؤال"
                              style={{ color: '#e11d48' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* TAB 3: CITIES & PLATE TYPES */}
      {subTab === 'REFERENCE' && (
        <div className="grid gap-5 lg:grid-cols-2">
          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <h3 className={styles.panelTitle}>فئات اللوحات السعودية المعتمدة</h3>
                <p className={styles.panelDesc}>التحكم في الفئات المتاحة للبحث والإدراج وعرض اللوحات.</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {data.plateTypes.map((pt) => (
                <div
                  key={pt.id}
                  className="flex items-center justify-between rounded-xl border border-[var(--adm-border)] bg-[var(--adm-surface-soft)] p-3"
                >
                  <div>
                    <div className="font-black text-sm">{pt.name_ar}</div>
                    <div className="text-xs opacity-70" dir="ltr">
                      {pt.code} • {pt.name_en}
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={pt.active}
                    disabled={busy}
                    onClick={() => togglePlateType(pt.id, !pt.active)}
                    className={`${styles.engravedToggle} ${pt.active ? styles.engravedToggleActive : ''}`}
                  >
                    <span className={styles.engravedToggleLabel}>{pt.active ? 'مفعّلة' : 'متوقفة'}</span>
                    <span className={styles.engravedToggleTrack} aria-hidden="true">
                      <span className={styles.engravedToggleThumb} />
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <h3 className={styles.panelTitle}>المدن السعودية ({data.cities.length})</h3>
                <p className={styles.panelDesc}>المدن المتاحة للملاك والمشترين في الفلاتر ونماذج العرض.</p>
              </div>
            </div>
            <div className="max-h-[420px] overflow-y-auto space-y-2">
              {data.cities.map((city) => (
                <div
                  key={city.id}
                  className="flex items-center justify-between rounded-xl border border-[var(--adm-border-subtle)] bg-[var(--adm-surface-soft)] px-3 py-2 text-xs"
                >
                  <div>
                    <span className="font-bold">{city.name_ar}</span>{' '}
                    <span className="opacity-65" dir="ltr">
                      ({city.name_en})
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={city.active}
                    disabled={busy}
                    onClick={() => toggleCityActive(city.id, city.name_ar, city.name_en, !city.active)}
                    className={`${styles.engravedToggle} ${city.active ? styles.engravedToggleActive : ''}`}
                  >
                    <span className={styles.engravedToggleLabel}>{city.active ? 'نشطة' : 'مخفية'}</span>
                    <span className={styles.engravedToggleTrack} aria-hidden="true">
                      <span className={styles.engravedToggleThumb} />
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* CMS Page Editor Drawer */}
      {editingPage && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="تحرير الصفحة">
          <div className={styles.drawer}>
            <div className={styles.drawerHeader}>
              <div>
                <h3 className="text-base font-black m-0">تحرير صفحة الموقع</h3>
                <p className="text-xs opacity-70 m-0 mt-0.5" dir="ltr">
                  /{editingPage.slug}
                </p>
              </div>
              <button type="button" className={styles.iconBtn} onClick={() => setEditingPage(null)} aria-label="إغلاق">
                <X size={17} />
              </button>
            </div>

            <div className={styles.drawerBody}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>الرابط المختصر (Slug)</label>
                <input
                  type="text"
                  dir="ltr"
                  value={editingPage.slug}
                  onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value.toLowerCase() })}
                  className={styles.input}
                  disabled={CORE_PAGES.some((c) => c.slug === editingPage.slug)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>عنوان الصفحة الرئيسي بالعربية</label>
                <input
                  type="text"
                  value={editingPage.title_ar}
                  onChange={(e) => setEditingPage({ ...editingPage, title_ar: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <div className="flex items-center justify-between">
                  <label className={styles.fieldLabel}>المحتوى النصي والبنود (يفصل سطر فارغ بين كل بند)</label>
                  {CORE_PAGES.find((c) => c.slug === editingPage.slug) && (
                    <button
                      type="button"
                      className={styles.btnChip}
                      onClick={() => {
                        const def = CORE_PAGES.find((c) => c.slug === editingPage.slug);
                        if (def) setEditingPage({ ...editingPage, body_ar: def.defaultBody });
                      }}
                    >
                      استعادة النص النموذجي
                    </button>
                  )}
                </div>
                <textarea
                  rows={12}
                  value={editingPage.body_ar}
                  onChange={(e) => setEditingPage({ ...editingPage, body_ar: e.target.value })}
                  className={styles.textarea}
                />
              </div>

              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={editingPage.published}
                  onChange={(e) => setEditingPage({ ...editingPage, published: e.target.checked })}
                />
                <span>نشر الصفحة وتفعيلها للزوار فوراً</span>
              </label>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>سبب التحديث (للتدقيق)</label>
                <input
                  type="text"
                  value={pageReason}
                  onChange={(e) => setPageReason(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.drawerFooter}>
              <button type="button" className={styles.btnSecondary} onClick={() => setEditingPage(null)}>
                إلغاء
              </button>
              <button type="button" disabled={busy} className={styles.btnPrimary} onClick={saveCmsPage}>
                {busy ? 'جارٍ الحفظ…' : 'حفظ ونشر الصفحة فوراً'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Editor Drawer */}
      {editingFaq && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="تحرير سؤال شائع">
          <div className={styles.drawer}>
            <div className={styles.drawerHeader}>
              <h3 className="text-base font-black m-0">
                {editingFaq.id ? 'تعديل السؤال الشائع' : 'إضافة سؤال شائع جديد'}
              </h3>
              <button type="button" className={styles.iconBtn} onClick={() => setEditingFaq(null)} aria-label="إغلاق">
                <X size={17} />
              </button>
            </div>

            <div className={styles.drawerBody}>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>التصنيف</label>
                  <select
                    value={editingFaq.catId}
                    onChange={(e) => setEditingFaq({ ...editingFaq, catId: e.target.value })}
                    className={styles.select}
                  >
                    {FAQ_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel}>ترتيب الظهور</label>
                  <input
                    type="number"
                    min={0}
                    dir="ltr"
                    value={editingFaq.sort_order}
                    onChange={(e) => setEditingFaq({ ...editingFaq, sort_order: Number(e.target.value) })}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>نص السؤال</label>
                <input
                  type="text"
                  value={editingFaq.question_ar}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question_ar: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>الإجابة التفصيلية المعتمدة</label>
                <textarea
                  rows={7}
                  value={editingFaq.answer_ar}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer_ar: e.target.value })}
                  className={styles.textarea}
                />
              </div>

              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={editingFaq.published}
                  onChange={(e) => setEditingFaq({ ...editingFaq, published: e.target.checked })}
                />
                <span>إظهار السؤال في صفحة الأسئلة الشائعة</span>
              </label>
            </div>

            <div className={styles.drawerFooter}>
              <button type="button" className={styles.btnSecondary} onClick={() => setEditingFaq(null)}>
                إلغاء
              </button>
              <button type="button" disabled={busy} className={styles.btnPrimary} onClick={saveFaq}>
                {busy ? 'جارٍ الحفظ…' : 'حفظ السؤال الشائع'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New City Modal */}
      {newCityOpen && (
        <div className={styles.modalCenter} role="dialog" aria-modal="true" aria-label="إضافة مدينة">
          <div className={styles.modalBox}>
            <h3 className="text-base font-black m-0">إضافة مدينة سعودية جديدة</h3>
            <div className="my-4 space-y-3">
              <div className={styles.field}>
                <label className={styles.fieldLabel}>المنطقة الإدارية</label>
                <select
                  value={cityRegionId}
                  onChange={(e) => setCityRegionId(e.target.value)}
                  className={styles.select}
                >
                  {data.regions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name_ar}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>اسم المدينة بالعربية</label>
                <input
                  type="text"
                  value={cityNameAr}
                  onChange={(e) => setCityNameAr(e.target.value)}
                  className={styles.input}
                  placeholder="مثال: العلا"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>الاسم بالإنجليزية</label>
                <input
                  type="text"
                  dir="ltr"
                  value={cityNameEn}
                  onChange={(e) => setCityNameEn(e.target.value)}
                  className={styles.input}
                  placeholder="AlUla"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" className={styles.btnSecondary} onClick={() => setNewCityOpen(false)}>
                إلغاء
              </button>
              <button type="button" disabled={busy} className={styles.btnPrimary} onClick={createCity}>
                إضافة المدينة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete FAQ Confirmation Modal */}
      {deletingFaqId && (
        <div
          className={styles.modalCenter}
          role="dialog"
          aria-modal="true"
          aria-label="تأكيد حذف السؤال الشائع"
          onClick={() => setDeletingFaqId(null)}
        >
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-black m-0 text-rose-500">حذف السؤال الشائع</h3>
            <p className="text-xs text-[var(--muted)] mt-2 mb-5 leading-relaxed">
              هل أنت متأكد من حذف هذا السؤال الشائع من الموقع؟ سيتم توثيق هذا الإجراء في سجل التدقيق الإداري.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button type="button" className={styles.btnSecondary} onClick={() => setDeletingFaqId(null)}>
                تراجع
              </button>
              <button type="button" disabled={busy} className={styles.btnDanger} onClick={confirmDeleteFaq}>
                <Trash2 size={14} />
                <span>تأكيد الحذف</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
