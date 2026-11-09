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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
            const isApproved = plate.verification_status === 'APPROVED';
            const isRejected = plate.verification_status === 'REJECTED';
            const isChangesReq = plate.verification_status === 'CHANGES_REQUIRED';

            const statusColor =
              vst.tone === 'emerald'
                ? '#065f46'
                : vst.tone === 'rose'
                  ? '#be123c'
                  : vst.tone === 'amber'
                    ? '#92400e'
                    : 'var(--ink-strong)';

            return (
              <article key={plate.id} className={styles.itemCard}>
                <div className="space-y-3">
                  {/* Card Top Status Row — Clean text without crowded pill tags */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold" style={{ color: statusColor }}>
                      <span>{vst.label}</span>
                      <span className="opacity-40">•</span>
                      <span className="text-[var(--muted)] font-bold">{lst.label}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[var(--muted)]">
                      {formatAdminDate(plate.submitted_at || plate.created_at)}
                    </span>
                  </div>

                  {/* Authentic Saudi Plate Preview */}
                  <div className={styles.plateStage}>
                    <div className="w-full max-w-[250px]">
                      <PlateVisualizer
                        lettersAr={plate.letters_ar}
                        lettersEn={plate.letters_en}
                        numbers={plate.digits}
                        plateType={plate.type_name}
                        compact
                      />
                    </div>
                  </div>

                  {/* Owner & Plate Specs — High contrast surface & crisp typography */}
                  <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3 space-y-2 text-xs text-[var(--ink-strong)]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 font-extrabold text-[var(--ink-strong)]">
                        <User size={13} className="text-[var(--adm-gold)]" />
                        <span>{plate.owner_name || 'عارض لوحة مسجل'}</span>
                      </span>
                      <span
                        className="text-[11px] font-bold"
                        style={{
                          color:
                            kyc.tone === 'emerald'
                              ? '#065f46'
                              : kyc.tone === 'amber'
                                ? '#92400e'
                                : '#475569',
                        }}
                      >
                        هوية: {kyc.label}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 text-[var(--ink)] font-semibold">
                      <span>{plate.type_name} • {plate.city_name || 'الرياض'}</span>
                      {plate.owner_phone ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[var(--ink-strong)]" dir="ltr">
                          <Phone size={11} />
                          {plate.owner_phone}
                        </span>
                      ) : (
                        <span className="text-[11px] text-[var(--muted)]">
                          {SALE_MODE_LABELS[plate.sale_mode] || plate.sale_mode}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-[var(--adm-border-subtle)]">
                      <span className="text-[var(--muted)] font-semibold">
                        {SALE_MODE_LABELS[plate.sale_mode] || plate.sale_mode}
                      </span>
                      {plate.asking_price_minor ? (
                        <span className="font-black text-[var(--ink-strong)]">
                          <SarPrice amount={plate.asking_price_minor} />
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-[var(--gold)]">تقييم من الإدارة</span>
                      )}
                    </div>

                    {(plate.description || plate.submission_note) && (
                      <p className="pt-1.5 border-t border-[var(--adm-border-subtle)] text-[11.5px] leading-relaxed text-[var(--muted)] m-0">
                        {plate.submission_note || plate.description}
                      </p>
                    )}

                    {/* Ownership Documents inside same clean card */}
                    <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-[var(--adm-border-subtle)] text-[11.5px]">
                      <span className="font-bold text-[var(--ink-strong)]">
                        المستندات ({plate.documents.length})
                      </span>
                      {plate.documents.length === 0 ? (
                        <span className="font-bold" style={{ color: '#92400e' }}>
                          بدون مستند مرفق
                        </span>
                      ) : (
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
                              className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[var(--gold)] hover:underline cursor-pointer bg-transparent border-0 p-0"
                            >
                              <Eye size={12} />
                              <span>
                                {docLoadingId === doc.id
                                  ? 'جارٍ الفتح…'
                                  : `معاينة #${idx + 1}`}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Lightweight Icon + Short Text Action Bar */}
                <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-[var(--adm-border-subtle)]">
                  <button
                    type="button"
                    disabled={isApproved}
                    onClick={() => openReviewDrawer(plate, 'APPROVED')}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer disabled:opacity-45 disabled:cursor-default"
                    style={{
                      borderColor: isApproved ? 'var(--line)' : 'rgba(5, 150, 105, 0.35)',
                      background: isApproved ? 'transparent' : 'rgba(16, 185, 129, 0.08)',
                      color: '#065f46',
                    }}
                    title={isApproved ? 'هذه اللوحة معتمدة بالفعل' : 'قبول واعتماد اللوحة'}
                  >
                    <CheckCircle2 size={14} />
                    <span>{isApproved ? 'معتمدة' : 'قبول'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isChangesReq}
                    onClick={() => openReviewDrawer(plate, 'CHANGES_REQUIRED')}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-[var(--line)] bg-transparent hover:bg-[var(--surface)] text-xs font-extrabold text-[var(--ink-strong)] transition-all cursor-pointer disabled:opacity-45 disabled:cursor-default"
                    title="طلب استكمال البيانات أو المستندات"
                  >
                    <Clock size={14} />
                    <span>استكمال</span>
                  </button>

                  <button
                    type="button"
                    disabled={isRejected}
                    onClick={() => openReviewDrawer(plate, 'REJECTED')}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer disabled:opacity-45 disabled:cursor-default"
                    style={{
                      borderColor: isRejected ? 'var(--line)' : 'rgba(225, 29, 72, 0.3)',
                      background: isRejected ? 'transparent' : 'rgba(225, 29, 72, 0.06)',
                      color: '#be123c',
                    }}
                    title={isRejected ? 'هذه اللوحة مرفوضة بالفعل' : 'رفض الطلب'}
                  >
                    <XCircle size={14} />
                    <span>{isRejected ? 'مرفوضة' : 'رفض'}</span>
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
                    <CheckCircle2 size={14} />
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
