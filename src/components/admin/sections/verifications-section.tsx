'use client';

import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  FileCheck2,
  FileText,
  Gavel,
  History,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  User,
  X,
  XCircle,
} from 'lucide-react';
import { PlateVisualizer } from '@/components/ui';
import { SarPrice } from '@/components/sar-symbol';
import styles from '../admin-dashboard.module.css';
import {
  KYC_LABELS,
  LISTING_LABELS,
  SALE_MODE_LABELS,
  VERIFICATION_LABELS,
  callAdminManage,
  formatAdminDate,
  formatFileSize,
  minorToSarInput,
  sarToMinor,
} from '../helpers';
import type { AdminDashboardData, AdminPlateRecord, AdminSectionKey } from '../types';

interface VerificationsProps {
  data: AdminDashboardData;
  onNavigate: (section: AdminSectionKey, opts?: { createAuctionForPlateId?: string }) => void;
  onNotify: (msg: string, kind?: 'success' | 'error') => void;
  onRequireMfa: () => void;
  onRefresh: () => void;
}

type FilterMode = 'PENDING' | 'CHANGES_REQUIRED' | 'APPROVED' | 'REJECTED' | 'ALL';

const PRESET_REASONS: Record<string, string[]> = {
  APPROVED: [
    'تمت مطابقة رخصة السير (الاستمارة) وهوية المالك بنجاح واعتماد اللوحة للنشر الرسمي.',
    'مستندات الملكية مكتملة وسارية المفعول، وتم اعتماد اللوحة لإدراجها في المزاد.',
  ],
  CHANGES_REQUIRED: [
    'يرجى إرفاق صورة أوضح لرخصة السير (الاستمارة) بحيث يظهر الرقم التسلسلي وتاريخ الانتهاء بوضوح.',
    'يرجى استكمال توثيق الهوية الوطنية عبر صفحة الأمان وتطابق اسم المالك مع الاستمارة.',
  ],
  REJECTED: [
    'عدم تطابق بيانات اللوحة المدخلة مع مستند إثبات الملكية المرفق.',
    'رخصة السير المرفقة منتهية الصلاحية أو غير قابلة للتحقق النظامي.',
  ],
  UNDER_REVIEW: [
    'جاري التحقق من السجل المروري ومطابقة الملكية لدى لجنة المراجعة والتدقيق.',
  ],
};

export function VerificationsSection({
  data,
  onNavigate,
  onNotify,
  onRequireMfa,
  onRefresh,
}: VerificationsProps) {
  const [filter, setFilter] = useState<FilterMode>('PENDING');
  const [query, setQuery] = useState('');
  const [selectedPlate, setSelectedPlate] = useState<AdminPlateRecord | null>(null);
  const [decisionStatus, setDecisionStatus] = useState<'APPROVED' | 'UNDER_REVIEW' | 'CHANGES_REQUIRED' | 'REJECTED'>('APPROVED');
  const [publishTrack, setPublishTrack] = useState<'STORE_NOW' | 'AUCTION_READY' | 'DRAFT_ONLY'>('STORE_NOW');
  const [askingSar, setAskingSar] = useState('');
  const [featured, setFeatured] = useState(false);
  const [launchAuctionAfter, setLaunchAuctionAfter] = useState(false);
  const [reason, setReason] = useState(PRESET_REASONS.APPROVED[0]);
  const [busy, setBusy] = useState(false);
  const [docPreview, setDocPreview] = useState<{ url: string; mimeType: string; title: string } | null>(null);
  const [docLoadingId, setDocLoadingId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const pending = data.plates.filter((p) =>
      ['SUBMITTED', 'DOCUMENTS_PENDING', 'UNDER_REVIEW'].includes(p.verification_status),
    ).length;
    const changes = data.plates.filter((p) => p.verification_status === 'CHANGES_REQUIRED').length;
    const approved = data.plates.filter((p) => p.verification_status === 'APPROVED').length;
    const rejected = data.plates.filter((p) => p.verification_status === 'REJECTED').length;
    return { pending, changes, approved, rejected, all: data.plates.length };
  }, [data.plates]);

  const filteredPlates = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.plates.filter((p) => {
      if (filter === 'PENDING' && !['SUBMITTED', 'DOCUMENTS_PENDING', 'UNDER_REVIEW'].includes(p.verification_status)) {
        return false;
      }
      if (filter === 'CHANGES_REQUIRED' && p.verification_status !== 'CHANGES_REQUIRED') return false;
      if (filter === 'APPROVED' && p.verification_status !== 'APPROVED') return false;
      if (filter === 'REJECTED' && p.verification_status !== 'REJECTED') return false;

      if (!q) return true;
      const haystack = [
        p.digits,
        p.letters_ar.join(' '),
        p.letters_ar.join(''),
        p.letters_en.join(' '),
        p.letters_en.join(''),
        p.owner_name,
        p.owner_phone ?? '',
        p.city_name,
        p.type_name,
        p.slug,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [data.plates, filter, query]);

  function openReviewDrawer(
    plate: AdminPlateRecord,
    initialStatus: 'APPROVED' | 'UNDER_REVIEW' | 'CHANGES_REQUIRED' | 'REJECTED' = 'APPROVED',
  ) {
    setSelectedPlate(plate);
    setDecisionStatus(initialStatus);
    const defaultTrack = plate.sale_mode === 'AUCTION' ? 'AUCTION_READY' : 'STORE_NOW';
    setPublishTrack(defaultTrack);
    setAskingSar(minorToSarInput(plate.asking_price_minor) || '45000');
    setFeatured(plate.featured);
    setLaunchAuctionAfter(plate.sale_mode === 'AUCTION');
    setReason(PRESET_REASONS[initialStatus]?.[0] ?? '');
  }

  async function openDocumentPreview(docId: string, label: string) {
    setDocLoadingId(docId);
    const res = await callAdminManage<{ url?: string; mimeType?: string }>({
      action: 'document.signed_url',
      documentId: docId,
    });
    setDocLoadingId(null);
    if (!res.ok || !res.data?.url) {
      if (res.mfaRequired) onRequireMfa();
      onNotify(res.error || 'تعذر فتح مستند الملكية المشفر.', 'error');
      return;
    }
    setDocPreview({
      url: res.data.url,
      mimeType: res.data.mimeType || 'image/jpeg',
      title: label,
    });
  }

  async function submitReview() {
    if (!selectedPlate) return;
    if (reason.trim().length < 3) {
      onNotify('يرجى كتابة سبب القرار (3 أحرف على الأقل) لحفظه في سجل التدقيق وإشعار المالك.', 'error');
      return;
    }

    const payload: Record<string, unknown> = {
      action: 'submission.review',
      plateId: selectedPlate.id,
      status: decisionStatus,
      reason: reason.trim(),
    };

    if (decisionStatus === 'APPROVED') {
      if (publishTrack === 'STORE_NOW') {
        const minor = sarToMinor(askingSar);
        if (!minor || BigInt(minor) <= 0n) {
          onNotify('يرجى تحديد سعر البيع بالريال السعودي لنشر اللوحة في المتجر.', 'error');
          return;
        }
        payload.saleMode = 'FIXED_PRICE';
        payload.askingPriceMinor = minor;
        payload.listingStatus = 'PUBLISHED';
        payload.featured = featured;
      } else if (publishTrack === 'AUCTION_READY') {
        const minor = askingSar ? sarToMinor(askingSar) : '';
        payload.saleMode = 'AUCTION';
        if (minor) payload.askingPriceMinor = minor;
        payload.listingStatus = 'PUBLISHED';
        payload.featured = featured;
      } else {
        payload.listingStatus = 'DRAFT';
        payload.featured = featured;
      }
    }

    setBusy(true);
    const res = await callAdminManage(payload);
    setBusy(false);

    if (!res.ok) {
      if (res.mfaRequired) onRequireMfa();
      onNotify(res.error || 'تعذر حفظ قرار المراجعة.', 'error');
      return;
    }

    const approvedPlateId = selectedPlate.id;
    const shouldGoToAuction = decisionStatus === 'APPROVED' && publishTrack === 'AUCTION_READY' && launchAuctionAfter;
    setSelectedPlate(null);
    onNotify(res.message || 'تم اعتماد القرار وإرسال إشعار لمالك اللوحة.');
    onRefresh();

    if (shouldGoToAuction) {
      onNavigate('auctions', { createAuctionForPlateId: approvedPlateId });
    }
  }

  return (
    <div className="space-y-4">
      {/* Filter & Search Bar */}
      <div className={styles.toolbar}>
        <div className={styles.filterPills}>
          <button
            type="button"
            className={`${styles.filterPill} ${filter === 'PENDING' ? styles.filterPillActive : ''}`}
            onClick={() => setFilter('PENDING')}
          >
            <span>بانتظار الاعتماد</span>
            <span>({counts.pending})</span>
          </button>
          <button
            type="button"
            className={`${styles.filterPill} ${filter === 'CHANGES_REQUIRED' ? styles.filterPillActive : ''}`}
            onClick={() => setFilter('CHANGES_REQUIRED')}
          >
            <span>مطلوب استكمال</span>
            <span>({counts.changes})</span>
          </button>
          <button
            type="button"
            className={`${styles.filterPill} ${filter === 'APPROVED' ? styles.filterPillActive : ''}`}
            onClick={() => setFilter('APPROVED')}
          >
            <span>المعتمدة</span>
            <span>({counts.approved})</span>
          </button>
          <button
            type="button"
            className={`${styles.filterPill} ${filter === 'REJECTED' ? styles.filterPillActive : ''}`}
            onClick={() => setFilter('REJECTED')}
          >
            <span>المرفوضة</span>
            <span>({counts.rejected})</span>
          </button>
          <button
            type="button"
            className={`${styles.filterPill} ${filter === 'ALL' ? styles.filterPillActive : ''}`}
            onClick={() => setFilter('ALL')}
          >
            <span>كافة السجلات</span>
            <span>({counts.all})</span>
          </button>
        </div>

        <div className={styles.searchBox}>
          <Search size={16} className="opacity-60 shrink-0" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث برقم اللوحة، الحروف، اسم المالك، المدينة…"
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Submissions Cards */}
      {filteredPlates.length === 0 ? (
        <div className={styles.emptyBox}>
          <FileCheck2 size={32} className="mx-auto mb-2 opacity-60" />
          <p className="text-sm font-bold">لا توجد طلبات مطابقة للفلتر المحدد حالياً</p>
          <p className="mt-1 text-xs">جميع اللوحات المرسلة من نموذج «اعرض لوحتك» تظهر هنا مع مستنداتها للمراجعة والاعتماد.</p>
        </div>
      ) : (
        <div className={styles.cardsGrid}>
          {filteredPlates.map((plate) => {
            const vst = VERIFICATION_LABELS[plate.verification_status] ?? {
              label: plate.verification_status,
              tone: 'slate' as const,
            };
            const lst = LISTING_LABELS[plate.listing_status] ?? {
              label: plate.listing_status,
              tone: 'slate' as const,
            };
            const kyc = KYC_LABELS[plate.owner_kyc] ?? { label: plate.owner_kyc, tone: 'slate' as const };

            return (
              <article key={plate.id} className={styles.itemCard}>
                <div className="space-y-3">
                  {/* Card Top Status Row */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`${styles.badge} ${styles[`tone_${vst.tone}`]}`}>{vst.label}</span>
                      <span className={`${styles.badge} ${styles[`tone_${lst.tone}`]}`}>{lst.label}</span>
                    </div>
                    <span className="text-[11px] opacity-70">{formatAdminDate(plate.submitted_at || plate.created_at)}</span>
                  </div>

                  {/* Authentic Saudi Plate Preview */}
                  <div className={styles.plateStage}>
                    <div className="w-full max-w-[260px]">
                      <PlateVisualizer
                        lettersAr={plate.letters_ar}
                        lettersEn={plate.letters_en}
                        numbers={plate.digits}
                        plateType={plate.type_name}
                        compact
                      />
                    </div>
                  </div>

                  {/* Owner & Plate Specs */}
                  <div className="rounded-xl border border-[var(--adm-border-subtle)] bg-[var(--adm-surface-soft)] p-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 font-bold">
                        <User size={13} className="text-[var(--adm-gold)]" />
                        <span>{plate.owner_name || 'عارض لوحة مسجل'}</span>
                      </span>
                      <span className={`${styles.badge} ${styles[`tone_${kyc.tone}`]}`}>
                        <ShieldCheck size={11} />
                        <span>هوية: {kyc.label}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 opacity-85">
                      <span>الفئة: {plate.type_name} • {plate.city_name || 'الرياض'}</span>
                      {plate.owner_phone && (
                        <span className="inline-flex items-center gap-1 font-mono" dir="ltr">
                          <Phone size={11} />
                          {plate.owner_phone}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-[var(--adm-border-subtle)]">
                      <span className="opacity-75">رغبة البيع: {SALE_MODE_LABELS[plate.sale_mode] || plate.sale_mode}</span>
                      {plate.asking_price_minor ? (
                        <span className="font-black">
                          <SarPrice amount={plate.asking_price_minor} />
                        </span>
                      ) : (
                        <span className="opacity-65">تقييم من الإدارة</span>
                      )}
                    </div>

                    {(plate.description || plate.submission_note) && (
                      <p className="pt-1.5 border-t border-[var(--adm-border-subtle)] text-[11.5px] leading-relaxed opacity-85">
                        {plate.submission_note || plate.description}
                      </p>
                    )}
                  </div>

                  {/* Ownership Documents */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold opacity-75 flex items-center justify-between">
                      <span>مستندات الملكية المرفقة ({plate.documents.length})</span>
                      {plate.documents.length === 0 && (
                        <span className="text-amber-400 inline-flex items-center gap-1">
                          <AlertTriangle size={11} />
                          لم يُرفق مستند بعد
                        </span>
                      )}
                    </div>
                    {plate.documents.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {plate.documents.map((doc, idx) => (
                          <button
                            key={doc.id}
                            type="button"
                            disabled={docLoadingId === doc.id}
                            onClick={() =>
                              openDocumentPreview(
                                doc.id,
                                `مستند ملكية (${doc.document_type}) — ${plate.letters_ar.join(' ')} ${plate.digits}`,
                              )
                            }
                            className={styles.btnChip}
                          >
                            <Eye size={12} />
                            <span>
                              {docLoadingId === doc.id
                                ? 'جارٍ فك التشفير…'
                                : `معاينة المستند #${idx + 1} (${formatFileSize(doc.size_bytes)})`}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Latest Verification Event */}
                  {plate.events.length > 0 && (
                    <div className="rounded-xl bg-[var(--adm-surface-soft)] px-3 py-2 text-[11px] opacity-80 flex items-start gap-2">
                      <History size={13} className="shrink-0 mt-0.5 text-[var(--adm-gold)]" />
                      <div>
                        <span className="font-bold">آخر قرار:</span> {plate.events[0].reason}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--adm-border-subtle)]">
                  <button
                    type="button"
                    onClick={() => openReviewDrawer(plate, 'APPROVED')}
                    className={styles.btnSuccess}
                  >
                    <CheckCircle2 size={14} />
                    <span>قبول واعتماد</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openReviewDrawer(plate, 'CHANGES_REQUIRED')}
                    className={styles.btnSecondary}
                  >
                    <Clock size={14} />
                    <span>طلب استكمال</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openReviewDrawer(plate, 'REJECTED')}
                    className={styles.btnDanger}
                  >
                    <XCircle size={14} />
                    <span>رفض الطلب</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Review & Approval Decision Drawer */}
      {selectedPlate && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="قرار مراجعة اللوحة">
          <div className={styles.drawer}>
            <div className={styles.drawerHeader}>
              <div>
                <h3 className="text-base font-black m-0">مراجعة واعتماد لوحة البائع</h3>
                <p className="text-xs opacity-70 m-0 mt-0.5">
                  المالك: {selectedPlate.owner_name || 'مستخدم مسجل'} • {selectedPlate.type_name}
                </p>
              </div>
              <button type="button" className={styles.iconBtn} onClick={() => setSelectedPlate(null)} aria-label="إغلاق">
                <X size={17} />
              </button>
            </div>

            <div className={styles.drawerBody}>
              {/* Plate Preview */}
              <div className={styles.plateStage}>
                <div className="w-full max-w-[280px]">
                  <PlateVisualizer
                    lettersAr={selectedPlate.letters_ar}
                    lettersEn={selectedPlate.letters_en}
                    numbers={selectedPlate.digits}
                    plateType={selectedPlate.type_name}
                  />
                </div>
              </div>

              {/* Decision Selector */}
              <div className={styles.field}>
                <span className={styles.fieldLabel}>قرار اللجنة الإدارية</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'APPROVED', label: 'اعتماد وقبول اللوحة', icon: CheckCircle2 },
                    { key: 'UNDER_REVIEW', label: 'تحويل لقيد التدقيق', icon: Clock },
                    { key: 'CHANGES_REQUIRED', label: 'طلب تعديل / مستند أوضح', icon: FileText },
                    { key: 'REJECTED', label: 'رفض الطلب نهائياً', icon: XCircle },
                  ].map((opt) => {
                    const Icon = opt.icon;
                    const active = decisionStatus === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => {
                          const st = opt.key as typeof decisionStatus;
                          setDecisionStatus(st);
                          setReason(PRESET_REASONS[st]?.[0] ?? '');
                        }}
                        className={`${styles.btnSecondary} justify-start ${
                          active ? '!border-[#d9bb81] !bg-[var(--adm-gold-tint)] !text-[var(--adm-gold)]' : ''
                        }`}
                      >
                        <Icon size={15} />
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Approval Publishing Configuration */}
              {decisionStatus === 'APPROVED' && (
                <div className="rounded-2xl border border-[var(--adm-border)] bg-[var(--adm-surface-soft)] p-4 space-y-4">
                  <div className="text-xs font-black flex items-center gap-1.5 text-[var(--adm-gold)]">
                    <Sparkles size={14} />
                    <span>خيارات النشر الفوري بعد الاعتماد</span>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => setPublishTrack('STORE_NOW')}
                      className={`${styles.btnSecondary} ${
                        publishTrack === 'STORE_NOW' ? '!border-emerald-400 !text-emerald-400' : ''
                      }`}
                    >
                      <Store size={14} />
                      <span>نشر مباشر بالمتجر</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPublishTrack('AUCTION_READY')}
                      className={`${styles.btnSecondary} ${
                        publishTrack === 'AUCTION_READY' ? '!border-emerald-400 !text-emerald-400' : ''
                      }`}
                    >
                      <Gavel size={14} />
                      <span>اعتماد للمزاد</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPublishTrack('DRAFT_ONLY')}
                      className={`${styles.btnSecondary} ${
                        publishTrack === 'DRAFT_ONLY' ? '!border-emerald-400 !text-emerald-400' : ''
                      }`}
                    >
                      <span>اعتماد بدون نشر</span>
                    </button>
                  </div>

                  {publishTrack !== 'DRAFT_ONLY' && (
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>
                        {publishTrack === 'STORE_NOW'
                          ? 'سعر البيع المعتمد بالمتجر (ريال سعودي SAR)'
                          : 'السعر التقديري / الاسترشادي (ريال سعودي - اختياري)'}
                      </label>
                      <input
                        type="number"
                        min={0}
                        step="100"
                        dir="ltr"
                        value={askingSar}
                        onChange={(e) => setAskingSar(e.target.value)}
                        className={styles.input}
                        placeholder="مثال: 75000"
                      />
                    </div>
                  )}

                  <label className={styles.checkboxRow}>
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                    />
                    <span>تمييز اللوحة في الواجهة الرئيسية وقسم النخبة (Featured)</span>
                  </label>

                  {publishTrack === 'AUCTION_READY' && (
                    <label className={styles.checkboxRow}>
                      <input
                        type="checkbox"
                        checked={launchAuctionAfter}
                        onChange={(e) => setLaunchAuctionAfter(e.target.checked)}
                      />
                      <span>الانتقال تلقائياً لإعداد وقت وسعر المزاد فور الحفظ</span>
                    </label>
                  )}
                </div>
              )}

              {/* Preset Reasons */}
              <div className={styles.field}>
                <span className={styles.fieldLabel}>قوالب جاهزة لسبب القرار (تُرسل كإشعار لصاحب اللوحة)</span>
                <div className="flex flex-wrap gap-1.5">
                  {(PRESET_REASONS[decisionStatus] ?? []).map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setReason(preset)}
                      className={styles.btnChip}
                    >
                      قالب #{idx + 1}
                    </button>
                  ))}
                </div>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className={styles.textarea}
                  placeholder="اكتب ملاحظة القرار بوضوح ليتم إشعار المالك وحفظها في سجل التدقيق…"
                />
              </div>

              {/* Verification History Timeline */}
              {selectedPlate.events.length > 0 && (
                <div className="space-y-2">
                  <span className={styles.fieldLabel}>سجل المراجعات السابقة لهذه اللوحة</span>
                  <div className="space-y-2">
                    {selectedPlate.events.map((ev) => (
                      <div
                        key={ev.id}
                        className="rounded-xl border border-[var(--adm-border-subtle)] bg-[var(--adm-surface-soft)] p-3 text-xs"
                      >
                        <div className="flex items-center justify-between opacity-75 mb-1">
                          <span>
                            {ev.previous_status} ← <strong>{ev.status}</strong>
                          </span>
                          <span>{formatAdminDate(ev.created_at)}</span>
                        </div>
                        <div>{ev.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.drawerFooter}>
              <button type="button" className={styles.btnSecondary} onClick={() => setSelectedPlate(null)}>
                إلغاء
              </button>
              <button type="button" disabled={busy} className={styles.btnPrimary} onClick={submitReview}>
                {busy ? 'جارٍ الحفظ وإشعار المالك…' : 'تأكيد القرار وحفظه رسمياً'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Encrypted Document Preview Modal */}
      {docPreview && (
        <div className={styles.modalCenter} role="dialog" aria-modal="true" aria-label={docPreview.title}>
          <div className={`${styles.modalBox} !max-w-3xl`}>
            <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-[var(--adm-border)]">
              <h4 className="text-sm font-black m-0">{docPreview.title}</h4>
              <div className="flex items-center gap-2">
                <a
                  href={docPreview.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnSecondary}
                >
                  فتح في تبويب مستقل
                </a>
                <button type="button" className={styles.iconBtn} onClick={() => setDocPreview(null)} aria-label="إغلاق">
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden bg-black/40 border border-[var(--adm-border)] flex items-center justify-center min-h-[340px]">
              {docPreview.mimeType === 'application/pdf' ? (
                <iframe src={docPreview.url} title={docPreview.title} className="w-full h-[65vh] border-0" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={docPreview.url} alt={docPreview.title} className="max-h-[65vh] w-auto object-contain" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
