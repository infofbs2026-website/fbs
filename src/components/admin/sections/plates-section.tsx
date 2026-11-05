'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  Gavel,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { PlateVisualizer } from '@/components/ui';
import { SarPrice } from '@/components/sar-symbol';
import styles from '../admin-dashboard.module.css';
import {
  LISTING_LABELS,
  SALE_MODE_LABELS,
  VERIFICATION_LABELS,
  callAdminManage,
  minorToSarInput,
  normalizeDigitsInput,
  sarToMinor,
} from '../helpers';
import type { AdminDashboardData, AdminPlateRecord, AdminSectionKey } from '../types';

interface PlatesSectionProps {
  data: AdminDashboardData;
  onNavigate: (section: AdminSectionKey, opts?: { createAuctionForPlateId?: string }) => void;
  onNotify: (msg: string, kind?: 'success' | 'error') => void;
  onRequireMfa: () => void;
  onRefresh: () => void;
}

type ListingFilter = 'ALL' | 'PUBLISHED' | 'DRAFT' | 'SOLD' | 'ARCHIVED';

export function PlatesSection({
  data,
  onNavigate,
  onNotify,
  onRequireMfa,
  onRefresh,
}: PlatesSectionProps) {
  const [filter, setFilter] = useState<ListingFilter>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [query, setQuery] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  // Add / Edit Plate Drawer State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingPlate, setEditingPlate] = useState<AdminPlateRecord | null>(null);
  const [letter1Id, setLetter1Id] = useState<number>(data.letters[0]?.id ?? 1);
  const [letter2Id, setLetter2Id] = useState<number>(data.letters[1]?.id ?? 2);
  const [letter3Id, setLetter3Id] = useState<number>(data.letters[2]?.id ?? 3);
  const [digits, setDigits] = useState('1');
  const [typeId, setTypeId] = useState<string>(data.plateTypes[0]?.id ?? '');
  const [cityId, setCityId] = useState<string>(data.cities[0]?.id ?? '');
  const [saleMode, setSaleMode] = useState<'FIXED_PRICE' | 'AUCTION' | 'AUCTION_WITH_BUY_NOW'>('FIXED_PRICE');
  const [askingSar, setAskingSar] = useState('65000');
  const [featured, setFeatured] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('APPROVED');
  const [listingStatus, setListingStatus] = useState<'DRAFT' | 'PUBLISHED' | 'SOLD' | 'ARCHIVED'>('PUBLISHED');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [reason, setReason] = useState('إضافة أو تحديث بيانات لوحة من الإدارة التنفيذية');
  const [saving, setSaving] = useState(false);

  // Delete / Archive Modal State
  const [deletingPlate, setDeletingPlate] = useState<AdminPlateRecord | null>(null);
  const [archiveOnly, setArchiveOnly] = useState(false);
  const [deleteReason, setDeleteReason] = useState('حذف أو إزالة اللوحة من العرض العام بأمر الإدارة');
  const [deleting, setDeleting] = useState(false);

  const letterById = useMemo(() => {
    const map = new Map<number, { arabic: string; latin: string }>();
    for (const l of data.letters) {
      map.set(l.id, { arabic: l.arabic, latin: l.latin });
    }
    return map;
  }, [data.letters]);

  const previewPlate = useMemo(() => {
    const l1 = letterById.get(letter1Id) ?? { arabic: 'أ', latin: 'A' };
    const l2 = letterById.get(letter2Id) ?? { arabic: 'ب', latin: 'B' };
    const l3 = letterById.get(letter3Id) ?? { arabic: 'د', latin: 'D' };
    const selectedType = data.plateTypes.find((t) => t.id === typeId)?.name_ar ?? 'خصوصي';
    return {
      lettersAr: [l1.arabic, l2.arabic, l3.arabic],
      lettersEn: [l1.latin, l2.latin, l3.latin],
      numbers: digits || '1',
      typeName: selectedType,
    };
  }, [letter1Id, letter2Id, letter3Id, digits, typeId, letterById, data.plateTypes]);

  const filteredPlates = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.plates.filter((p) => {
      if (filter !== 'ALL' && p.listing_status !== filter) return false;
      if (typeFilter !== 'ALL' && p.type_id !== typeFilter) return false;
      if (!q) return true;
      const hay = [
        p.digits,
        p.letters_ar.join(' '),
        p.letters_ar.join(''),
        p.letters_en.join(' '),
        p.letters_en.join(''),
        p.slug,
        p.city_name,
        p.owner_name,
        p.type_name,
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [data.plates, filter, typeFilter, query]);

  function openCreateDrawer() {
    setEditingPlate(null);
    setLetter1Id(data.letters[0]?.id ?? 1);
    setLetter2Id(data.letters[0]?.id ?? 1);
    setLetter3Id(data.letters[0]?.id ?? 1);
    setDigits('1');
    setTypeId(data.plateTypes[0]?.id ?? '');
    setCityId(data.cities[0]?.id ?? '');
    setSaleMode('FIXED_PRICE');
    setAskingSar('75000');
    setFeatured(true);
    setVerificationStatus('APPROVED');
    setListingStatus('PUBLISHED');
    setSlug('');
    setDescription('لوحة سعودية مميزة معتمدة لدى فارس بن سعود للوحات المميزة.');
    setReason('إدراج لوحة جديدة من لوحة الإدارة');
    setDrawerOpen(true);
  }

  function openEditDrawer(plate: AdminPlateRecord) {
    setEditingPlate(plate);
    setLetter1Id(plate.letter_1_id);
    setLetter2Id(plate.letter_2_id);
    setLetter3Id(plate.letter_3_id);
    setDigits(plate.digits);
    setTypeId(plate.type_id);
    setCityId(plate.city_id ?? '');
    setSaleMode((plate.sale_mode as typeof saleMode) || 'FIXED_PRICE');
    setAskingSar(minorToSarInput(plate.asking_price_minor));
    setFeatured(plate.featured);
    setVerificationStatus(plate.verification_status);
    setListingStatus((plate.listing_status as typeof listingStatus) || 'PUBLISHED');
    setSlug(plate.slug);
    setDescription(plate.description || '');
    setReason('تعديل بيانات وسعر اللوحة من لوحة الإدارة');
    setDrawerOpen(true);
  }

  async function savePlate() {
    const cleanDigits = normalizeDigitsInput(digits);
    if (!cleanDigits || /^0+$/.test(cleanDigits)) {
      onNotify('يرجى إدخال أرقام صحيحة للوحة (من 1 إلى 4 أرقام ولا تبدأ بأصفار فقط).', 'error');
      return;
    }
    if (!typeId) {
      onNotify('يرجى اختيار فئة اللوحة.', 'error');
      return;
    }
    if (reason.trim().length < 3) {
      onNotify('يرجى كتابة سبب التعديل (3 أحرف على الأقل).', 'error');
      return;
    }

    const effectiveVerification =
      listingStatus === 'PUBLISHED' ? 'APPROVED' : verificationStatus;
    const askingMinor = askingSar.trim() ? sarToMinor(askingSar) : '';

    setSaving(true);
    const res = await callAdminManage({
      action: 'plate.save',
      plateId: editingPlate?.id ?? null,
      slug: slug.trim(),
      typeId,
      letter1Id,
      letter2Id,
      letter3Id,
      digits: cleanDigits,
      cityId: cityId || '',
      description: description.trim(),
      saleMode,
      askingPriceMinor: askingMinor,
      featured,
      verificationStatus: effectiveVerification,
      listingStatus,
      ownerId: editingPlate?.owner_id ?? '',
      reason: reason.trim(),
    });
    setSaving(false);

    if (!res.ok) {
      if (res.mfaRequired) onRequireMfa();
      onNotify(res.error || 'تعذر حفظ اللوحة.', 'error');
      return;
    }

    setDrawerOpen(false);
    onNotify(res.message || 'تم حفظ بيانات اللوحة بنجاح.');
    onRefresh();
  }

  async function quickToggle(
    plate: AdminPlateRecord,
    patch: { featured?: boolean; listingStatus?: 'DRAFT' | 'PUBLISHED' | 'SOLD' | 'ARCHIVED' },
    actionReason: string,
  ) {
    setBusyId(plate.id);
    const res = await callAdminManage({
      action: 'plate.quick_toggle',
      plateId: plate.id,
      ...patch,
      reason: actionReason,
    });
    setBusyId(null);
    if (!res.ok) {
      if (res.mfaRequired) onRequireMfa();
      onNotify(res.error || 'تعذر تحديث اللوحة.', 'error');
      return;
    }
    onNotify(res.message || 'تم تحديث حالة اللوحة.');
    onRefresh();
  }

  async function confirmDeletePlate() {
    if (!deletingPlate) return;
    if (deleteReason.trim().length < 3) {
      onNotify('يرجى كتابة سبب الحذف أو الأرشفة.', 'error');
      return;
    }
    setDeleting(true);
    const res = await callAdminManage({
      action: 'plate.delete',
      plateId: deletingPlate.id,
      archiveOnly,
      reason: deleteReason.trim(),
    });
    setDeleting(false);

    if (!res.ok) {
      if (res.mfaRequired) onRequireMfa();
      onNotify(res.error || 'تعذر حذف اللوحة.', 'error');
      return;
    }
    setDeletingPlate(null);
    onNotify(res.message || 'تم حذف اللوحة بنجاح.');
    onRefresh();
  }

  return (
    <div className="space-y-4">
      {/* Top Action & Filter Bar */}
      <div className={styles.toolbar}>
        <div className={styles.filterPills}>
          {(
            [
              ['ALL', `الكل (${data.plates.length})`],
              ['PUBLISHED', `المنشورة (${data.plates.filter((p) => p.listing_status === 'PUBLISHED').length})`],
              ['DRAFT', `مسودات (${data.plates.filter((p) => p.listing_status === 'DRAFT').length})`],
              ['SOLD', `المباعة (${data.plates.filter((p) => p.listing_status === 'SOLD').length})`],
              ['ARCHIVED', `المؤرشفة (${data.plates.filter((p) => p.listing_status === 'ARCHIVED').length})`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`${styles.filterPill} ${filter === key ? styles.filterPillActive : ''}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={`${styles.select} !w-auto !py-2`}
            aria-label="فلترة حسب فئة اللوحة"
          >
            <option value="ALL">جميع الفئات</option>
            {data.plateTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name_ar}
              </option>
            ))}
          </select>

          <div className={styles.searchBox}>
            <Search size={15} className="opacity-60 shrink-0" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="بحث بالحروف أو الأرقام أو المالك…"
              className={styles.searchInput}
            />
          </div>

          <button type="button" className={styles.btnPrimary} onClick={openCreateDrawer}>
            <Plus size={16} />
            <span>إضافة لوحة جديدة</span>
          </button>
        </div>
      </div>

      {/* Plates Grid */}
      {filteredPlates.length === 0 ? (
        <div className={styles.emptyBox}>
          <p className="text-sm font-bold">لا توجد لوحات مطابقة لخيارات البحث الحالية</p>
          <button type="button" className={`${styles.btnPrimary} mt-4`} onClick={openCreateDrawer}>
            <Plus size={15} />
            <span>إضافة أول لوحة الآن</span>
          </button>
        </div>
      ) : (
        <div className={styles.cardsGrid}>
          {filteredPlates.map((plate) => {
            const lst = LISTING_LABELS[plate.listing_status] ?? { label: plate.listing_status, tone: 'slate' as const };
            const vst = VERIFICATION_LABELS[plate.verification_status] ?? {
              label: plate.verification_status,
              tone: 'slate' as const,
            };
            const isBusy = busyId === plate.id;

            return (
              <article key={plate.id} className={styles.itemCard}>
                <div className="space-y-3">
                  {/* Top Badges + Quick Star & Preview */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`${styles.badge} ${styles[`tone_${lst.tone}`]}`}>{lst.label}</span>
                      <span className={`${styles.badge} ${styles[`tone_${vst.tone}`]}`}>{vst.label}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() =>
                          quickToggle(
                            plate,
                            { featured: !plate.featured },
                            plate.featured ? 'إلغاء تمييز اللوحة' : 'تمييز اللوحة كلوحة نخبة',
                          )
                        }
                        title={plate.featured ? 'مميزة في الرئيسية (اضغط لإلغاء التمييز)' : 'تمييز في الرئيسية'}
                        className={styles.btnChip}
                      >
                        <Star
                          size={13}
                          className={plate.featured ? 'fill-amber-400 text-amber-400' : 'opacity-60'}
                        />
                      </button>

                      {plate.listing_status === 'PUBLISHED' && (
                        <Link
                          href={`/plates/${plate.slug}`}
                          target="_blank"
                          className={styles.btnChip}
                          title="معاينة اللوحة في الموقع"
                        >
                          <ExternalLink size={13} />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Authentic Plate Stage */}
                  <div className={styles.plateStage}>
                    <div className="w-full max-w-[255px]">
                      <PlateVisualizer
                        lettersAr={plate.letters_ar}
                        lettersEn={plate.letters_en}
                        numbers={plate.digits}
                        plateType={plate.type_name}
                        compact
                      />
                    </div>
                  </div>

                  {/* Specs & Price */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div>
                      <div className="font-bold">
                        {plate.type_name} • {plate.city_name || 'الرياض'}
                      </div>
                      <div className="opacity-70 mt-0.5">
                        {SALE_MODE_LABELS[plate.sale_mode] || plate.sale_mode} • المالك: {plate.owner_name || 'FBS'}
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="text-[11px] opacity-65">السعر المعروض</div>
                      <div className="text-sm font-black">
                        {plate.asking_price_minor ? <SarPrice amount={plate.asking_price_minor} /> : 'مزاد'}
                      </div>
                    </div>
                  </div>

                  {plate.active_auction_id && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs flex items-center justify-between">
                      <span>مرتبطة بمزاد ({plate.active_auction_status})</span>
                      <button
                        type="button"
                        className="font-bold underline cursor-pointer"
                        onClick={() => onNavigate('auctions')}
                      >
                        إدارة المزاد
                      </button>
                    </div>
                  )}
                </div>

                {/* Full CRUD Actions Bar */}
                <div className="flex items-center justify-between gap-1.5 flex-wrap pt-2.5 border-t border-[var(--adm-border-subtle)]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button type="button" className={styles.btnSecondary} onClick={() => openEditDrawer(plate)}>
                      <Edit3 size={13} />
                      <span>تعديل</span>
                    </button>

                    {plate.listing_status === 'PUBLISHED' ? (
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => quickToggle(plate, { listingStatus: 'DRAFT' }, 'إخفاء مؤقت للوحة من المتجر')}
                        className={styles.btnChip}
                        title="إخفاء مؤقت من الموقع"
                      >
                        <EyeOff size={13} />
                        <span>إخفاء</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() =>
                          plate.verification_status === 'APPROVED'
                            ? quickToggle(plate, { listingStatus: 'PUBLISHED' }, 'إعادة نشر اللوحة في الموقع')
                            : openEditDrawer(plate)
                        }
                        className={styles.btnChip}
                        title="نشر في الموقع"
                      >
                        <Eye size={13} />
                        <span>نشر</span>
                      </button>
                    )}

                    {!plate.active_auction_id && (
                      <button
                        type="button"
                        onClick={() => onNavigate('auctions', { createAuctionForPlateId: plate.id })}
                        className={styles.btnChip}
                        title="إنشاء مزاد لهذه اللوحة"
                      >
                        <Gavel size={13} />
                        <span>مزاد</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setDeletingPlate(plate);
                      setArchiveOnly(Boolean(plate.active_auction_id));
                      setDeleteReason('حذف اللوحة وإزالتها من الموقع بأمر الإدارة');
                    }}
                    className={styles.btnDanger}
                    title="حذف أو أرشفة اللوحة"
                  >
                    <Trash2 size={13} />
                    <span>حذف</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Add / Edit Plate Studio Drawer */}
      {drawerOpen && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="استوديو إعداد اللوحة">
          <div className={styles.drawer}>
            <div className={styles.drawerHeader}>
              <div>
                <h3 className="text-base font-black m-0">
                  {editingPlate ? 'تعديل بيانات اللوحة وسعرها' : 'إضافة لوحة سعودية جديدة'}
                </h3>
                <p className="text-xs opacity-70 m-0 mt-0.5">
                  معاينة فورية للوحة طبق الأصل مع تحكم كامل في الحروف، الأرقام، السعر، وحالة النشر.
                </p>
              </div>
              <button type="button" className={styles.iconBtn} onClick={() => setDrawerOpen(false)} aria-label="إغلاق">
                <X size={17} />
              </button>
            </div>

            <div className={styles.drawerBody}>
              {/* Live Plate Visualizer Preview */}
              <div className={styles.plateStage}>
                <div className="w-full max-w-[290px]">
                  <PlateVisualizer
                    lettersAr={previewPlate.lettersAr}
                    lettersEn={previewPlate.lettersEn}
                    numbers={previewPlate.numbers}
                    plateType={previewPlate.typeName}
                  />
                </div>
              </div>

              {/* Letters (RTL Reading Order) + Digits */}
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>الحرف الأول (يمين)</label>
                  <select
                    value={letter1Id}
                    onChange={(e) => setLetter1Id(Number(e.target.value))}
                    className={styles.select}
                  >
                    {data.letters.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.arabic} — {l.latin}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel}>الحرف الثاني (وسط)</label>
                  <select
                    value={letter2Id}
                    onChange={(e) => setLetter2Id(Number(e.target.value))}
                    className={styles.select}
                  >
                    {data.letters.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.arabic} — {l.latin}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel}>الحرف الثالث (يسار)</label>
                  <select
                    value={letter3Id}
                    onChange={(e) => setLetter3Id(Number(e.target.value))}
                    className={styles.select}
                  >
                    {data.letters.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.arabic} — {l.latin}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel}>الأرقام (1 إلى 4 خانات)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    dir="ltr"
                    maxLength={4}
                    value={digits}
                    onChange={(e) => setDigits(normalizeDigitsInput(e.target.value))}
                    className={styles.input}
                    placeholder="777"
                  />
                </div>
              </div>

              {/* Type & City */}
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>فئة اللوحة</label>
                  <select value={typeId} onChange={(e) => setTypeId(e.target.value)} className={styles.select}>
                    {data.plateTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name_ar} ({t.name_en})
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel}>المدينة</label>
                  <select value={cityId} onChange={(e) => setCityId(e.target.value)} className={styles.select}>
                    <option value="">بدون تحديد مدينة</option>
                    {data.cities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name_ar}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sale Mode & Price in SAR */}
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>آلية العرض والبيع</label>
                  <select
                    value={saleMode}
                    onChange={(e) => setSaleMode(e.target.value as typeof saleMode)}
                    className={styles.select}
                  >
                    <option value="FIXED_PRICE">بيع مباشر في المتجر</option>
                    <option value="AUCTION">عرض في المزاد</option>
                    <option value="AUCTION_WITH_BUY_NOW">مزاد + خيار شراء فوري</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel}>السعر المطلوب بالريال السعودي (SAR)</label>
                  <input
                    type="number"
                    min={0}
                    step="100"
                    dir="ltr"
                    value={askingSar}
                    onChange={(e) => setAskingSar(e.target.value)}
                    className={styles.input}
                    placeholder="75000"
                  />
                  <span className={styles.fieldHint}>يُحفظ تلقائياً بالهللة بدقة مالية كاملة في قاعدة البيانات.</span>
                </div>
              </div>

              {/* Listing Status & Verification */}
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>حالة الظهور بالموقع</label>
                  <select
                    value={listingStatus}
                    onChange={(e) => setListingStatus(e.target.value as typeof listingStatus)}
                    className={styles.select}
                  >
                    <option value="PUBLISHED">منشورة للجمهور الآن (PUBLISHED)</option>
                    <option value="DRAFT">مسودة مخفية (DRAFT)</option>
                    <option value="SOLD">تم البيع (SOLD)</option>
                    <option value="ARCHIVED">مؤرشفة (ARCHIVED)</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel}>الرابط المختصر (Slug - اختياري)</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className={styles.input}
                    placeholder="يُولّد تلقائياً عند تركه فارغاً"
                  />
                </div>
              </div>

              <label className={styles.checkboxRow}>
                <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                <span>تمييز اللوحة في الواجهة الرئيسية وقوائم النخبة (Featured)</span>
              </label>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>وصف اللوحة ومميزاتها</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={styles.textarea}
                  placeholder="وصف استثماري مختصر يظهر في صفحة تفاصيل اللوحة…"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>سبب الإجراء للسجل الرقابي</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.drawerFooter}>
              <button type="button" className={styles.btnSecondary} onClick={() => setDrawerOpen(false)}>
                إلغاء
              </button>
              <button type="button" disabled={saving} className={styles.btnPrimary} onClick={savePlate}>
                {saving ? 'جارٍ الحفظ…' : editingPlate ? 'حفظ تعديلات اللوحة' : 'إضافة ونشر اللوحة'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete / Archive Confirmation Modal */}
      {deletingPlate && (
        <div className={styles.modalCenter} role="dialog" aria-modal="true" aria-label="تأكيد حذف اللوحة">
          <div className={styles.modalBox}>
            <h3 className="text-base font-black m-0 text-rose-400">حذف أو إزالة اللوحة من المنصة</h3>
            <p className="text-xs opacity-80 mt-2 leading-relaxed">
              أنت على وشك إزالة اللوحة <strong>({deletingPlate.letters_ar.join(' ')} {deletingPlate.digits})</strong>. إذا كانت اللوحة غير مرتبطة بمزايدات سابقة سيتم حذفها نهائياً، وإذا كان لها سجل رقابي سيتم إخفاؤها وأرشفتها فوراً مع إلغاء أي مزاد غير مكتمل.
            </p>

            <div className="my-4 space-y-3">
              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={archiveOnly}
                  onChange={(e) => setArchiveOnly(e.target.checked)}
                />
                <span>أرشفة وإخفاء من الموقع بدلاً من الحذف النهائي</span>
              </label>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>سبب الحذف (يُوثّق في سجل التدقيق)</label>
                <input
                  type="text"
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button type="button" className={styles.btnSecondary} onClick={() => setDeletingPlate(null)}>
                تراجع
              </button>
              <button type="button" disabled={deleting} className={styles.btnDanger} onClick={confirmDeletePlate}>
                {deleting ? 'جارٍ التنفيذ…' : archiveOnly ? 'تأكيد الأرشفة والإخفاء' : 'حذف اللوحة نهائياً'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
