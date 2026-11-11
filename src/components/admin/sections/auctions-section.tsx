'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  Edit3,
  ExternalLink,
  Flag,
  Gavel,
  Pause,
  Play,
  Plus,
  Search,
  Timer,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { FbsStageWatermark, PlateVisualizer } from '@/components/ui';
import { SarPrice } from '@/components/sar-symbol';
import accountStyles from '@/components/account-dashboard.module.css';
import styles from '../admin-dashboard.module.css';
import {
  AUCTION_STATUS_LABELS,
  callAdminManage,
  formatAdminDate,
  formatCountdownLabel,
  fromDatetimeLocalValue,
  minorToSarInput,
  sarToMinor,
  toDatetimeLocalValue,
} from '../helpers';
import type { AdminAuctionRecord, AdminDashboardData } from '../types';

interface AuctionsSectionProps {
  data: AdminDashboardData;
  liveOnly?: boolean;
  preselectedPlateId?: string | null;
  onClearPreselectedPlate?: () => void;
  onNotify: (msg: string, kind?: 'success' | 'error') => void;
  onRequireMfa: () => void;
  onRefresh: () => void;
}

export function AuctionsSection({
  data,
  liveOnly = false,
  preselectedPlateId,
  onClearPreselectedPlate,
  onNotify,
  onRequireMfa,
  onRefresh,
}: AuctionsSectionProps) {
  const [nowMs, setNowMs] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>(liveOnly ? 'ACTIVE' : 'ALL');
  const [query, setQuery] = useState('');
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [expandedAuctionId, setExpandedAuctionId] = useState<string | null>(null);

  // Custom End Time Quick Modal
  const [timeModalAuction, setTimeModalAuction] = useState<AdminAuctionRecord | null>(null);
  const [customEndLocal, setCustomEndLocal] = useState('');
  const [customTimeReason, setCustomTimeReason] = useState('تعديل وقت إغلاق المزاد من غرفة التحكم الإدارية');

  // Custom Finalize / Cancel Decision Modal (replaces browser prompt/confirm)
  const [decisionModal, setDecisionModal] = useState<{
    auction: AdminAuctionRecord;
    mode: 'FINALIZE_NOW' | 'CANCEL';
  } | null>(null);
  const [decisionReason, setDecisionReason] = useState('');

  // Create / Edit Auction Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingAuction, setEditingAuction] = useState<AdminAuctionRecord | null>(null);
  const [plateId, setPlateId] = useState('');
  const [launchMode, setLaunchMode] = useState<'LIVE_NOW' | 'SCHEDULED'>('LIVE_NOW');
  const [durationHours, setDurationHours] = useState<number>(48);
  const [startingSar, setStartingSar] = useState('50000');
  const [reserveSar, setReserveSar] = useState('');
  const [incrementSar, setIncrementSar] = useState('1000');
  const [depositSar, setDepositSar] = useState('2500');
  const [regStartLocal, setRegStartLocal] = useState('');
  const [regEndLocal, setRegEndLocal] = useState('');
  const [startLocal, setStartLocal] = useState('');
  const [endLocal, setEndLocal] = useState('');
  const [antiSniping, setAntiSniping] = useState(true);
  const [windowSeconds, setWindowSeconds] = useState<number>(data.siteSettings.defaultExtensionWindowSeconds || 300);
  const [extensionSeconds, setExtensionSeconds] = useState<number>(
    data.siteSettings.defaultExtensionDurationSeconds || 300,
  );
  const [maxExtensions, setMaxExtensions] = useState<number>(data.siteSettings.defaultMaxExtensions || 3);
  const [commissionType, setCommissionType] = useState<'NONE' | 'FIXED' | 'PERCENTAGE'>('NONE');
  const [commissionInput, setCommissionInput] = useState('0');
  const [requireKyc, setRequireKyc] = useState(true);
  const [saveReason, setSaveReason] = useState('إعداد وضبط المزاد من لوحة الإدارة التنفيذية');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const initial = window.setTimeout(() => setNowMs(Date.now()), 0);
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, []);

  const eligiblePlates = useMemo(
    () =>
      data.plates.filter(
        (p) => p.listing_status !== 'ARCHIVED' && p.listing_status !== 'SOLD' && !p.active_auction_id,
      ),
    [data.plates],
  );

  function initScheduleFields(hoursFromNow = 48) {
    const now = Date.now();
    setRegStartLocal(toDatetimeLocalValue(new Date(now - 10 * 60 * 1000).toISOString()));
    setRegEndLocal(toDatetimeLocalValue(new Date(now + 30 * 60 * 1000).toISOString()));
    setStartLocal(toDatetimeLocalValue(new Date(now + 60 * 60 * 1000).toISOString()));
    setEndLocal(toDatetimeLocalValue(new Date(now + (hoursFromNow + 1) * 3600 * 1000).toISOString()));
  }

  function openCreateDrawer(initialPlateId?: string) {
    setEditingAuction(null);
    const chosenPlateId = initialPlateId || eligiblePlates[0]?.id || '';
    const chosenPlate = data.plates.find((p) => p.id === chosenPlateId);
    setPlateId(chosenPlateId);
    setLaunchMode('LIVE_NOW');
    setDurationHours(48);
    setStartingSar(minorToSarInput(chosenPlate?.asking_price_minor) || '50000');
    setReserveSar('');
    setIncrementSar('1000');
    setDepositSar('2500');
    initScheduleFields(48);
    setAntiSniping(true);
    setWindowSeconds(data.siteSettings.defaultExtensionWindowSeconds || 300);
    setExtensionSeconds(data.siteSettings.defaultExtensionDurationSeconds || 300);
    setMaxExtensions(data.siteSettings.defaultMaxExtensions || 3);
    setCommissionType('NONE');
    setCommissionInput('0');
    setRequireKyc(true);
    setSaveReason('إنشاء وإطلاق مزاد جديد من لوحة الإدارة');
    setDrawerOpen(true);
  }

  useEffect(() => {
    if (preselectedPlateId) {
      openCreateDrawer(preselectedPlateId);
      onClearPreselectedPlate?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectedPlateId]);

  function openEditDrawer(auction: AdminAuctionRecord) {
    setEditingAuction(auction);
    setPlateId(auction.plate_id);
    setLaunchMode('SCHEDULED');
    setStartingSar(minorToSarInput(auction.starting_price));
    setReserveSar(minorToSarInput(auction.reserve_price));
    setIncrementSar(minorToSarInput(auction.minimum_increment));
    setDepositSar(auction.deposit_type === 'FIXED' ? minorToSarInput(auction.deposit_amount) : '0');
    setRegStartLocal(toDatetimeLocalValue(auction.registration_start_at));
    setRegEndLocal(toDatetimeLocalValue(auction.registration_end_at));
    setStartLocal(toDatetimeLocalValue(auction.start_at));
    setEndLocal(toDatetimeLocalValue(auction.effective_end_at));
    setAntiSniping(auction.anti_sniping_enabled);
    setWindowSeconds(auction.extension_window_seconds ?? 300);
    setExtensionSeconds(auction.extension_duration_seconds ?? 300);
    setMaxExtensions(auction.max_extensions ?? 3);
    setCommissionType((auction.commission_type as typeof commissionType) || 'NONE');
    setCommissionInput(
      auction.commission_type === 'FIXED'
        ? minorToSarInput(auction.commission_value)
        : String(auction.commission_value ?? '0'),
    );
    setRequireKyc(auction.require_kyc);
    setSaveReason('تعديل إعدادات وأسعار وتوقيت المزاد');
    setDrawerOpen(true);
  }

  async function saveAuction() {
    if (!editingAuction && !plateId) {
      onNotify('يرجى اختيار اللوحة لإنشاء المزاد.', 'error');
      return;
    }
    const startingMinor = sarToMinor(startingSar);
    const incrementMinor = sarToMinor(incrementSar);
    const reserveMinor = reserveSar.trim() ? sarToMinor(reserveSar) : '';
    const depositMinor = depositSar.trim() ? sarToMinor(depositSar) : '0';

    if (!startingMinor || BigInt(startingMinor) <= 0n) {
      onNotify('يرجى إدخال سعر بداية صحيح بالريال السعودي.', 'error');
      return;
    }
    if (!incrementMinor || BigInt(incrementMinor) <= 0n) {
      onNotify('يرجى إدخال الحد الأدنى للزيادة بالريال السعودي.', 'error');
      return;
    }
    if (reserveMinor && BigInt(reserveMinor) < BigInt(startingMinor)) {
      onNotify('السعر الاحتياطي السري يجب أن يكون مساوياً أو أعلى من سعر البداية.', 'error');
      return;
    }

    let regStartIso: string;
    let regEndIso: string;
    let startIso: string;
    let endIso: string;
    let statusToSave: string | undefined;

    if (!editingAuction && launchMode === 'LIVE_NOW') {
      const now = Date.now();
      regStartIso = new Date(now - 20 * 60 * 1000).toISOString();
      regEndIso = new Date(now - 5 * 60 * 1000).toISOString();
      startIso = new Date(now - 60 * 1000).toISOString();
      endIso = new Date(now + Math.max(1, durationHours) * 3600 * 1000).toISOString();
      statusToSave = 'LIVE';
    } else {
      regStartIso = fromDatetimeLocalValue(regStartLocal);
      regEndIso = fromDatetimeLocalValue(regEndLocal);
      startIso = fromDatetimeLocalValue(startLocal);
      endIso = fromDatetimeLocalValue(endLocal);
      if (!regStartIso || !regEndIso || !startIso || !endIso) {
        onNotify('يرجى التحقق من جميع حقول التوقيت والجدولة.', 'error');
        return;
      }
      if (!editingAuction) {
        statusToSave = Date.parse(startIso) <= Date.now() ? 'LIVE' : 'REGISTRATION_OPEN';
      }
    }

    const commissionValue =
      commissionType === 'NONE'
        ? '0'
        : commissionType === 'FIXED'
          ? sarToMinor(commissionInput) || '0'
          : String(Math.round(Number(commissionInput || '0')));

    setSaving(true);
    const res = await callAdminManage({
      action: 'auction.save',
      auctionId: editingAuction?.id ?? null,
      plateId: editingAuction ? undefined : plateId,
      status: statusToSave,
      startingPrice: startingMinor,
      reservePrice: reserveMinor,
      minimumIncrement: incrementMinor,
      depositAmount: depositMinor,
      registrationStart: regStartIso,
      registrationEnd: regEndIso,
      startAt: startIso,
      endAt: endIso,
      antiSniping,
      windowSeconds,
      extensionSeconds,
      maxExtensions,
      commissionType,
      commissionValue,
      requireKyc,
      reason: saveReason.trim() || 'حفظ إعدادات المزاد',
    });
    setSaving(false);

    if (!res.ok) {
      if (res.mfaRequired) onRequireMfa();
      onNotify(res.error || 'تعذر حفظ المزاد.', 'error');
      return;
    }

    setDrawerOpen(false);
    onNotify(res.message || 'تم حفظ المزاد بنجاح.');
    onRefresh();
  }

  async function executeControl(
    auctionId: string,
    command:
      | 'EXTEND_MINUTES'
      | 'SET_END_TIME'
      | 'GO_LIVE_NOW'
      | 'OPEN_REGISTRATION_NOW'
      | 'PAUSE'
      | 'RESUME'
      | 'FINALIZE_NOW'
      | 'CANCEL',
    opts?: { minutes?: number; endAt?: string; reason?: string },
  ) {
    setBusyKey(`${auctionId}:${command}:${opts?.minutes ?? ''}`);
    const res = await callAdminManage({
      action: 'auction.control',
      auctionId,
      command,
      minutes: opts?.minutes,
      endAt: opts?.endAt,
      reason: opts?.reason || `تنفيذ أمر التحكم (${command}) من صالة الإدارة`,
    });
    setBusyKey(null);

    if (!res.ok) {
      if (res.mfaRequired) onRequireMfa();
      onNotify(res.error || 'تعذر تنفيذ أمر التحكم بالمزاد.', 'error');
      return;
    }
    onNotify(res.message || 'تم تحديث حالة وتوقيت المزاد.');
    onRefresh();
  }

  async function updateRegistrationStatus(regId: string, status: 'QUALIFIED' | 'SUSPENDED') {
    setBusyKey(`reg:${regId}`);
    const res = await callAdminManage({
      action: 'registration.status',
      registrationId: regId,
      status,
      reason: status === 'QUALIFIED' ? 'تأهيل المزايد يدوياً من الإدارة' : 'تعليق أهلية المزايد من الإدارة',
    });
    setBusyKey(null);
    if (!res.ok) {
      if (res.mfaRequired) onRequireMfa();
      onNotify(res.error || 'تعذر تحديث أهلية المزايد.', 'error');
      return;
    }
    onNotify(res.message || 'تم تحديث الأهلية.');
    onRefresh();
  }

  const filteredAuctions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.auctions.filter((a) => {
      if (statusFilter === 'ACTIVE') {
        if (!['LIVE', 'ENDING', 'REGISTRATION_OPEN', 'WAITING_ROOM', 'PAUSED', 'SCHEDULED'].includes(a.status)) {
          return false;
        }
      } else if (statusFilter !== 'ALL' && a.status !== statusFilter) {
        return false;
      }

      if (!q) return true;
      const hay = [
        a.digits,
        a.letters_ar.join(' '),
        a.letters_ar.join(''),
        a.letters_en.join(' '),
        a.plate_type,
        a.city_name,
        a.status,
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [data.auctions, statusFilter, query]);

  const selectedPlatePreview = useMemo(
    () => data.plates.find((p) => p.id === plateId) ?? null,
    [data.plates, plateId],
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.filterPills}>
          {[
            ['ALL', `الكل (${data.auctions.length})`],
            ['ACTIVE', 'النشطة والقادمة'],
            ['LIVE', 'المباشرة الآن'],
            ['PAUSED', 'المتوقفة مؤقتاً'],
            ['ENDED', 'المنتهية'],
            ['CANCELLED', 'الملغاة'],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setStatusFilter(key)}
              className={`${styles.filterPill} ${statusFilter === key ? styles.filterPillActive : ''}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className={styles.searchBox}>
            <Search size={15} className="opacity-60 shrink-0" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="بحث برقم أو حروف لوحة المزاد…"
              className={styles.searchInput}
            />
          </div>

          <button type="button" className={styles.btnPrimary} onClick={() => openCreateDrawer()}>
            <Plus size={16} />
            <span>إنشاء مزاد جديد</span>
          </button>
        </div>
      </div>

      {/* Auctions Cards */}
      {filteredAuctions.length === 0 ? (
        <div className={styles.emptyBox}>
          <Gavel size={30} className="mx-auto mb-2 opacity-65" />
          <p className="text-sm font-bold">لا توجد مزادات مطابقة للفلتر المحدد</p>
          <button type="button" className={`${styles.btnPrimary} mt-4`} onClick={() => openCreateDrawer()}>
            <Plus size={15} />
            <span>إطلاق مزاد جديد الآن</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAuctions.map((auction) => {
            const st = AUCTION_STATUS_LABELS[auction.status] ?? { label: auction.status, tone: 'slate' as const };
            const isTerminal = ['ENDED', 'COMPLETED', 'CANCELLED', 'RESERVE_NOT_MET'].includes(auction.status);
            const isExpanded = expandedAuctionId === auction.id;
            const auctionBids = data.bids.filter((b) => b.auction_id === auction.id);
            const auctionRegs = data.registrations.filter((r) => r.auction_id === auction.id);

            const targetMs = auction.effective_end_at ? Date.parse(auction.effective_end_at) : NaN;
            const totalSec =
              nowMs !== null && Number.isFinite(targetMs)
                ? Math.max(0, Math.floor((targetMs - nowMs) / 1000))
                : null;
            const countdownUnits = [
              {
                key: 'days',
                label: 'يوم',
                value: totalSec === null ? '00' : String(Math.floor(totalSec / 86400)).padStart(2, '0'),
              },
              {
                key: 'hours',
                label: 'ساعة',
                value: totalSec === null ? '00' : String(Math.floor((totalSec % 86400) / 3600)).padStart(2, '0'),
              },
              {
                key: 'minutes',
                label: 'دقيقة',
                value: totalSec === null ? '00' : String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0'),
              },
              {
                key: 'seconds',
                label: 'ثانية',
                value: totalSec === null ? '00' : String(totalSec % 60).padStart(2, '0'),
              },
            ];

            return (
              <article key={auction.id} className={styles.panel}>
                <div className="grid gap-5 lg:grid-cols-[295px_1fr] items-stretch">
                  {/* Right Column (in RTL): Plate Stage + Status & Icon Bar + Finalize/Cancel Under Plate */}
                  <div className="flex flex-col justify-between gap-3">
                    {/* Top Row: Status Badge + Lightweight Icon Controls */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`${styles.badge} ${styles[`tone_${st.tone}`]}`}>{st.label}</span>

                      <div className="flex items-center gap-1">
                        {!isTerminal && (
                          <>
                            {auction.status === 'PAUSED' ? (
                              <button
                                type="button"
                                disabled={busyKey !== null}
                                onClick={() =>
                                  executeControl(auction.id, 'RESUME', {
                                    reason: 'استئناف المزاد من لوحة الإدارة',
                                  })
                                }
                                className={styles.btnChip}
                                title="استئناف المزاد"
                                aria-label="استئناف المزاد"
                              >
                                <Play size={14} className="text-emerald-600" />
                              </button>
                            ) : (
                              ['LIVE', 'REGISTRATION_OPEN', 'WAITING_ROOM', 'SCHEDULED'].includes(auction.status) && (
                                <button
                                  type="button"
                                  disabled={busyKey !== null}
                                  onClick={() =>
                                    executeControl(auction.id, 'PAUSE', {
                                      reason: 'إيقاف مؤقت للمزاد من لوحة الإدارة',
                                    })
                                  }
                                  className={styles.btnChip}
                                  title="إيقاف مؤقت للمزاد"
                                  aria-label="إيقاف مؤقت للمزاد"
                                >
                                  <Pause size={14} />
                                </button>
                              )
                            )}

                            <button
                              type="button"
                              onClick={() => openEditDrawer(auction)}
                              className={styles.btnChip}
                              title="تعديل الأسعار والإعدادات"
                              aria-label="تعديل الأسعار والإعدادات"
                            >
                              <Edit3 size={14} />
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => setExpandedAuctionId(isExpanded ? null : auction.id)}
                          className={styles.btnChip}
                          title={`عرض المزايدات الحية (${auctionBids.length}) والمشاركين (${auctionRegs.length})`}
                          aria-label="عرض المزايدات والمشاركين"
                        >
                          <Users size={14} />
                          <span className="tabular-nums text-[11px]" dir="ltr">
                            {auctionBids.length}
                          </span>
                        </button>

                        <Link
                          href={`/plates/${auction.plate_slug}`}
                          target="_blank"
                          className={styles.btnChip}
                          title="معاينة صفحة المزاد في الموقع"
                          aria-label="معاينة صفحة المزاد في الموقع"
                        >
                          <ExternalLink size={14} />
                        </Link>
                      </div>
                    </div>

                    {/* Plate Stage */}
                    <div className={styles.plateStage}>
                      <FbsStageWatermark className={accountStyles.auctionStageWatermark} />
                      <div className="relative z-10 w-full max-w-[240px]">
                        <PlateVisualizer
                          lettersAr={auction.letters_ar}
                          lettersEn={auction.letters_en}
                          numbers={auction.digits}
                          plateType={auction.plate_type}
                          compact
                        />
                      </div>
                    </div>

                    {/* Minimal Icon + Text Action Row Directly Under the Plate */}
                    {!isTerminal && (
                      <div className={`flex items-center justify-between gap-2 pt-2 ${styles.engravedDivider}`}>
                        {['LIVE', 'ENDING', 'PAUSED'].includes(auction.status) ? (
                          <button
                            type="button"
                            disabled={busyKey !== null}
                            onClick={() => {
                              setDecisionReason('إنهاء وترسية المزاد يدوياً بأمر الإدارة');
                              setDecisionModal({ auction, mode: 'FINALIZE_NOW' });
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-extrabold text-[var(--ink-strong)] hover:bg-amber-500/10 hover:text-[var(--gold)] transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <Flag size={14} className="text-[var(--gold)] shrink-0" />
                            <span>إنهاء وترسية</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={busyKey !== null}
                            onClick={() =>
                              executeControl(auction.id, 'GO_LIVE_NOW', {
                                reason: 'بدء المزاد المباشر فوراً بأمر الإدارة',
                              })
                            }
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-extrabold text-emerald-700 hover:bg-emerald-500/10 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <Play size={14} className="shrink-0" />
                            <span>بدء مباشر الآن</span>
                          </button>
                        )}

                        <span className="h-4 w-px bg-[var(--adm-border-subtle)] shrink-0" aria-hidden="true" />

                        <button
                          type="button"
                          disabled={busyKey !== null}
                          onClick={() => {
                            setDecisionReason('إلغاء المزاد بقرار تنظيمي من الإدارة');
                            setDecisionModal({ auction, mode: 'CANCEL' });
                          }}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-extrabold text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <Trash2 size={14} className="shrink-0" />
                          <span>إلغاء المزاد</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Left Column: RTL Metrics + Main-Page Style Countdown Chamber & Quick Time Controls */}
                  <div className="flex flex-col justify-between gap-3.5 min-w-0">
                    {/* 3 Clean RTL Financial & Activity Vaults (English Digits) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="rounded-xl border border-[var(--well-border)] bg-[var(--well-bg)] p-3 text-right">
                        <div className="text-[11px] font-bold text-[var(--muted)]">المزايدة الحالية</div>
                        <div className="mt-1 text-lg font-black text-[var(--ink-strong)] tabular-nums">
                          <SarPrice amount={auction.current_price} />
                        </div>
                      </div>

                      <div className="rounded-xl border border-[var(--well-border)] bg-[var(--well-bg)] p-3 text-right">
                        <div className="text-[11px] font-bold text-[var(--muted)]">سعر البداية / الزيادة</div>
                        <div className="mt-1 text-xs font-black text-[var(--ink-strong)] tabular-nums">
                          <SarPrice amount={auction.starting_price} />
                          <span className="mx-1.5 opacity-50">•</span>
                          <span dir="ltr">+</span>
                          <SarPrice amount={auction.minimum_increment} />
                        </div>
                      </div>

                      <div className="rounded-xl border border-[var(--well-border)] bg-[var(--well-bg)] p-3 text-right">
                        <div className="text-[11px] font-bold text-[var(--muted)]">العطاءات والمشاركون</div>
                        <div className="mt-1 text-xs font-black text-[var(--ink-strong)] tabular-nums">
                          <span dir="ltr">{auction.sequence_no.toLocaleString('en-US')}</span> مزايدة
                          <span className="mx-1.5 opacity-50">•</span>
                          <span dir="ltr">{auction.registrations_count.toLocaleString('en-US')}</span> مسجل
                          <span className="mx-1.5 opacity-50">•</span>
                          <span dir="ltr">{auction.extension_count.toLocaleString('en-US')}</span> تمديد
                        </div>
                      </div>
                    </div>

                    {/* Home-Page Style 4-Cell Countdown Chamber + Compact Quick Time Chips */}
                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-3 items-center">
                      <div className={accountStyles.auctionTimerChamber}>
                        <div className={accountStyles.countdownUnits} dir="ltr">
                          {countdownUnits.map((unit) => (
                            <div key={unit.key} className={accountStyles.countdownUnitBox}>
                              <span className={accountStyles.countdownLabel}>{unit.label}</span>
                              <span className={accountStyles.countdownNum}>{unit.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {!isTerminal && (
                        <div className="rounded-2xl border border-[var(--well-border)] bg-[var(--well-bg)] p-2.5 flex flex-col gap-2 justify-center">
                          <div className="flex items-center justify-between gap-2 px-1">
                            <span className="text-[11px] font-extrabold flex items-center gap-1.5 text-[var(--gold)]">
                              <Timer size={13} />
                              <span>تمديد وتحكم بالوقت</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setTimeModalAuction(auction);
                                setCustomEndLocal(toDatetimeLocalValue(auction.effective_end_at));
                                setCustomTimeReason('تحديد موعد إغلاق مخصص للمزاد من الإدارة');
                              }}
                              className={styles.btnChip}
                              title="تحديد موعد إغلاق مخصص"
                              aria-label="تحديد موعد إغلاق مخصص"
                            >
                              <Clock size={13} />
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            {[
                              { label: '+5m', title: 'تمديد 5 دقائق (+5 د)', min: 5 },
                              { label: '+15m', title: 'تمديد 15 دقيقة (+15 د)', min: 15 },
                              { label: '+1h', title: 'تمديد ساعة واحدة (+1 س)', min: 60 },
                              { label: '+24h', title: 'تمديد 24 ساعة (+24 س)', min: 1440 },
                              { label: '-5m', title: 'إنقاص 5 دقائق (-5 د)', min: -5 },
                            ].map((btn) => (
                              <button
                                key={btn.min}
                                type="button"
                                disabled={busyKey !== null}
                                onClick={() =>
                                  executeControl(auction.id, 'EXTEND_MINUTES', {
                                    minutes: btn.min,
                                    reason: `تعديل وقت المزاد (${btn.title}) من الإدارة`,
                                  })
                                }
                                title={btn.title}
                                className={`${styles.btnChip} tabular-nums font-black`}
                                dir="ltr"
                              >
                                {btn.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expandable Live Bids & Registrations Inspector */}
                    {isExpanded && (
                      <div className="pt-1 grid gap-3 md:grid-cols-2">
                        <div className="rounded-xl border border-[var(--adm-border)] p-3">
                          <h4 className="text-xs font-black m-0 mb-2">أحدث العطاءات المسجلة</h4>
                          {auctionBids.length === 0 ? (
                            <p className="text-xs opacity-65 m-0">لم تُسجّل أي مزايدات بعد.</p>
                          ) : (
                            <div className="space-y-1.5 max-h-52 overflow-y-auto">
                              {auctionBids.slice(0, 12).map((bid) => (
                                <div
                                  key={bid.id}
                                  className="flex items-center justify-between text-xs py-1.5 border-b border-[var(--adm-border-subtle)]"
                                >
                                  <div>
                                    <span className="tabular-nums opacity-70" dir="ltr">
                                      #{bid.sequence_no}
                                    </span>{' '}
                                    <strong>{bid.user_name}</strong>
                                  </div>
                                  <div className="font-black">
                                    <SarPrice amount={bid.amount_minor} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="rounded-xl border border-[var(--adm-border)] p-3">
                          <h4 className="text-xs font-black m-0 mb-2">المزايدون المسجلون وتأهيلهم</h4>
                          {auctionRegs.length === 0 ? (
                            <p className="text-xs opacity-65 m-0">لا يوجد مسجلون في هذا المزاد بعد.</p>
                          ) : (
                            <div className="space-y-1.5 max-h-52 overflow-y-auto">
                              {auctionRegs.map((reg) => (
                                <div
                                  key={reg.id}
                                  className="flex items-center justify-between gap-2 text-xs py-1.5 border-b border-[var(--adm-border-subtle)]"
                                >
                                  <div>
                                    <strong>{reg.user_name}</strong>{' '}
                                    <span className="opacity-70">({reg.bidder_alias})</span>
                                    <div className="text-[11px] opacity-70">الحالة: {reg.status}</div>
                                  </div>
                                  {reg.status !== 'QUALIFIED' ? (
                                    <button
                                      type="button"
                                      disabled={busyKey !== null}
                                      onClick={() => updateRegistrationStatus(reg.id, 'QUALIFIED')}
                                      className={styles.btnSuccess}
                                    >
                                      <CheckCircle2 size={12} />
                                      <span>تأهيل</span>
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      disabled={busyKey !== null}
                                      onClick={() => updateRegistrationStatus(reg.id, 'SUSPENDED')}
                                      className={styles.btnChip}
                                    >
                                      تعليق
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Custom End Time Modal */}
      {timeModalAuction && (
        <div className={styles.modalCenter} role="dialog" aria-modal="true" aria-label="تعديل وقت إغلاق المزاد">
          <div className={styles.modalBox}>
            <h3 className="text-base font-black m-0">تحديد موعد إغلاق مخصص للمزاد</h3>
            <p className="text-xs opacity-75 mt-1">
              اللوحة: {timeModalAuction.letters_ar.join(' ')} {timeModalAuction.digits}
            </p>

            <div className="my-4 space-y-3">
              <div className={styles.field}>
                <label className={styles.fieldLabel}>وقت وتاريخ إغلاق المزاد الجديد (بتوقيت جهازك)</label>
                <input
                  type="datetime-local"
                  dir="ltr"
                  value={customEndLocal}
                  onChange={(e) => setCustomEndLocal(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>سبب تعديل التوقيت</label>
                <input
                  type="text"
                  value={customTimeReason}
                  onChange={(e) => setCustomTimeReason(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button type="button" className={styles.btnSecondary} onClick={() => setTimeModalAuction(null)}>
                إلغاء
              </button>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={async () => {
                  const iso = fromDatetimeLocalValue(customEndLocal);
                  if (!iso) {
                    onNotify('يرجى تحديد تاريخ ووقت صحيح.', 'error');
                    return;
                  }
                  const targetId = timeModalAuction.id;
                  setTimeModalAuction(null);
                  await executeControl(targetId, 'SET_END_TIME', {
                    endAt: iso,
                    reason: customTimeReason.trim() || 'تعديل وقت إغلاق المزاد',
                  });
                }}
              >
                اعتماد التوقيت الجديد فوراً
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Finalize / Cancel Decision Modal */}
      {decisionModal && (
        <div
          className={styles.modalCenter}
          role="dialog"
          aria-modal="true"
          aria-label={decisionModal.mode === 'CANCEL' ? 'تأكيد إلغاء المزاد' : 'تأكيد إنهاء وترسية المزاد'}
          onClick={() => setDecisionModal(null)}
        >
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-black m-0 text-[var(--ink-strong)]">
                  {decisionModal.mode === 'CANCEL'
                    ? 'إلغاء المزاد وفك حجز التأمين'
                    : 'إنهاء المزاد واعتماد الترسية'}
                </h3>
                <p className="text-xs text-[var(--muted)] m-0 mt-1">
                  {decisionModal.mode === 'CANCEL'
                    ? 'سيتم إيقاف المزاد وتحرير مبالغ التأمين المحجوزة للمشاركين تلقائياً.'
                    : 'سيتم إغلاق المزاد فوراً واعتماد أعلى مزايدة مسجلة حالياً.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDecisionModal(null)}
                className={styles.btnChip}
                aria-label="إغلاق النافذة"
              >
                <X size={14} />
              </button>
            </div>

            {/* Plate Preview & Current Bid Summary */}
            <div className={`${styles.plateStage} mb-4`}>
              <FbsStageWatermark className={accountStyles.auctionStageWatermark} />
              <div className="relative z-10 w-full max-w-[225px]">
                <PlateVisualizer
                  lettersAr={decisionModal.auction.letters_ar}
                  lettersEn={decisionModal.auction.letters_en}
                  numbers={decisionModal.auction.digits}
                  plateType={decisionModal.auction.plate_type}
                  compact
                />
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between text-xs px-1">
              <span className="font-bold text-[var(--muted)]">أعلى مزايدة حالية:</span>
              <strong className="text-sm font-black text-[var(--ink-strong)] tabular-nums">
                <SarPrice amount={decisionModal.auction.current_price} />
              </strong>
            </div>

            <div className={`${styles.field} mb-5`}>
              <label className={styles.fieldLabel}>
                {decisionModal.mode === 'CANCEL' ? 'سبب إلغاء المزاد' : 'سبب الإنهاء والترسية'}
              </label>
              <input
                type="text"
                value={decisionReason}
                onChange={(e) => setDecisionReason(e.target.value)}
                placeholder="اكتب سبب القرار هنا…"
                className={styles.input}
                autoFocus
              />
            </div>

            <div className="flex items-center gap-2.5 pt-3 border-t border-[var(--adm-border-subtle)]">
              <button
                type="button"
                className={`${styles.btnSecondary} flex-1`}
                onClick={() => setDecisionModal(null)}
              >
                تراجع
              </button>
              <button
                type="button"
                disabled={busyKey !== null}
                className={`${decisionModal.mode === 'CANCEL' ? styles.btnDanger : styles.btnPrimary} flex-1`}
                onClick={async () => {
                  const trimmed = decisionReason.trim();
                  if (trimmed.length < 3) {
                    onNotify('يرجى كتابة سبب واضح (3 أحرف على الأقل).', 'error');
                    return;
                  }
                  const target = decisionModal;
                  setDecisionModal(null);
                  await executeControl(target.auction.id, target.mode, { reason: trimmed });
                }}
              >
                {decisionModal.mode === 'CANCEL' ? (
                  <>
                    <Trash2 size={14} />
                    <span>تأكيد إلغاء المزاد</span>
                  </>
                ) : (
                  <>
                    <Flag size={14} />
                    <span>تأكيد الإنهاء والترسية</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Auction Centered Wide Studio Modal */}
      {drawerOpen && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="إعداد المزاد"
          onClick={() => setDrawerOpen(false)}
        >
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <div>
                <h3 className="text-base font-black m-0">
                  {editingAuction ? 'تعديل أسعار وتوقيت وقواعد المزاد' : 'إنشاء وإطلاق مزاد جديد'}
                </h3>
                <p className="text-xs opacity-70 m-0 mt-0.5">
                  جميع القيم المالية تُدخل بالريال السعودي (SAR) وتُطبّق فوراً على صالة المزاد.
                </p>
              </div>
              <button type="button" className={styles.iconBtn} onClick={() => setDrawerOpen(false)} aria-label="إغلاق">
                <X size={17} />
              </button>
            </div>

            <div className={styles.drawerBody}>
              {/* Plate Picker & Preview */}
              {selectedPlatePreview && (
                <div className={styles.plateStage}>
                  <FbsStageWatermark className={accountStyles.auctionStageWatermark} />
                  <div className="relative z-10 w-full max-w-[275px]">
                    <PlateVisualizer
                      lettersAr={selectedPlatePreview.letters_ar}
                      lettersEn={selectedPlatePreview.letters_en}
                      numbers={selectedPlatePreview.digits}
                      plateType={selectedPlatePreview.type_name}
                      compact
                    />
                  </div>
                </div>
              )}

              {!editingAuction && (
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>اختر اللوحة المراد طرحها في المزاد</label>
                  <select value={plateId} onChange={(e) => setPlateId(e.target.value)} className={styles.select}>
                    <option value="">— اختر لوحة من السجل —</option>
                    {eligiblePlates.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.letters_ar.join(' ')} {p.digits} — {p.type_name} ({p.city_name || 'الرياض'})
                      </option>
                    ))}
                  </select>
                  {eligiblePlates.length === 0 && (
                    <span className="text-xs text-amber-500 font-bold">
                      جميع اللوحات الحالية مرتبطة بمزادات نشطة؛ يمكنك إضافة لوحة جديدة أولاً من قسم اللوحات.
                    </span>
                  )}
                </div>
              )}

              {/* Prices in SAR — 2x2 Grid in Wide Modal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>سعر البداية (ريال سعودي)</label>
                  <input
                    type="number"
                    min={1}
                    step="100"
                    dir="ltr"
                    value={startingSar}
                    onChange={(e) => setStartingSar(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel}>أقل مقدار زيادة (ريال سعودي)</label>
                  <input
                    type="number"
                    min={1}
                    step="100"
                    dir="ltr"
                    value={incrementSar}
                    onChange={(e) => setIncrementSar(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel}>السعر الاحتياطي السري (اختياري)</label>
                  <input
                    type="number"
                    min={0}
                    step="500"
                    dir="ltr"
                    value={reserveSar}
                    onChange={(e) => setReserveSar(e.target.value)}
                    className={styles.input}
                    placeholder="بدون حد سري"
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel}>مبلغ التأمين البنكي (0 = بدون)</label>
                  <input
                    type="number"
                    min={0}
                    step="100"
                    dir="ltr"
                    value={depositSar}
                    onChange={(e) => setDepositSar(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>

              {/* Launch Timing */}
              {!editingAuction && (
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>طريقة الإطلاق والوقت</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setLaunchMode('LIVE_NOW')}
                      className={`${styles.btnSecondary} ${
                        launchMode === 'LIVE_NOW' ? '!border-emerald-500 !text-emerald-600' : ''
                      }`}
                    >
                      <Play size={14} />
                      <span>بدء المزاد مباشرة الآن (LIVE)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLaunchMode('SCHEDULED')}
                      className={`${styles.btnSecondary} ${
                        launchMode === 'SCHEDULED' ? '!border-[#d9bb81] !text-[var(--adm-gold)]' : ''
                      }`}
                    >
                      <Clock size={14} />
                      <span>جدولة بتواريخ محددة</span>
                    </button>
                  </div>
                </div>
              )}

              {!editingAuction && launchMode === 'LIVE_NOW' ? (
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>مدة المزاد المباشر قبل الإغلاق</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'ساعة واحدة', h: 1 },
                      { label: '6 ساعات', h: 6 },
                      { label: '24 ساعة (يوم)', h: 24 },
                      { label: '48 ساعة (يومان)', h: 48 },
                      { label: '72 ساعة (3 أيام)', h: 72 },
                      { label: '7 أيام', h: 168 },
                    ].map((preset) => (
                      <button
                        key={preset.h}
                        type="button"
                        onClick={() => setDurationHours(preset.h)}
                        className={`${styles.filterPill} ${durationHours === preset.h ? styles.filterPillActive : ''}`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>فتح التسجيل</label>
                    <input
                      type="datetime-local"
                      dir="ltr"
                      value={regStartLocal}
                      onChange={(e) => setRegStartLocal(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>إغلاق التسجيل</label>
                    <input
                      type="datetime-local"
                      dir="ltr"
                      value={regEndLocal}
                      onChange={(e) => setRegEndLocal(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>بدء المزاد</label>
                    <input
                      type="datetime-local"
                      dir="ltr"
                      value={startLocal}
                      onChange={(e) => setStartLocal(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>وقت إغلاق المزاد</label>
                    <input
                      type="datetime-local"
                      dir="ltr"
                      value={endLocal}
                      onChange={(e) => setEndLocal(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                </div>
              )}

              {/* Anti-Sniping & Rules */}
              <div className="rounded-2xl border border-[var(--well-border)] bg-[var(--well-bg)] p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <label className={styles.checkboxRow}>
                    <input
                      type="checkbox"
                      checked={antiSniping}
                      onChange={(e) => setAntiSniping(e.target.checked)}
                    />
                    <span>تفعيل التمديد التلقائي لمنع القنص في اللحظات الأخيرة (Anti-Sniping)</span>
                  </label>

                  <label className={styles.checkboxRow}>
                    <input
                      type="checkbox"
                      checked={requireKyc}
                      onChange={(e) => setRequireKyc(e.target.checked)}
                    />
                    <span>اشتراط توثيق الهوية الوطنية (KYC)</span>
                  </label>
                </div>

                {antiSniping && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>نافذة المراقبة (ثوانٍ)</label>
                      <input
                        type="number"
                        min={10}
                        dir="ltr"
                        value={windowSeconds}
                        onChange={(e) => setWindowSeconds(Number(e.target.value))}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>مدة التمديد (ثوانٍ)</label>
                      <input
                        type="number"
                        min={10}
                        dir="ltr"
                        value={extensionSeconds}
                        onChange={(e) => setExtensionSeconds(Number(e.target.value))}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>أقصى عدد تمديدات</label>
                      <input
                        type="number"
                        min={0}
                        dir="ltr"
                        value={maxExtensions}
                        onChange={(e) => setMaxExtensions(Number(e.target.value))}
                        className={styles.input}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Commission & Audit Reason in 1 Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>نوع عمولة المنصة</label>
                  <select
                    value={commissionType}
                    onChange={(e) => setCommissionType(e.target.value as typeof commissionType)}
                    className={styles.select}
                  >
                    <option value="NONE">بدون عمولة</option>
                    <option value="FIXED">مبلغ مقطوع بالريال السعودي</option>
                    <option value="PERCENTAGE">نسبة مئوية بنقاط الأساس (250 = 2.5%)</option>
                  </select>
                </div>

                {commissionType !== 'NONE' ? (
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>
                      {commissionType === 'FIXED' ? 'قيمة العمولة (ريال سعودي)' : 'نقاط الأساس (100 = 1%)'}
                    </label>
                    <input
                      type="number"
                      min={0}
                      dir="ltr"
                      value={commissionInput}
                      onChange={(e) => setCommissionInput(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                ) : (
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>سبب الإجراء للسجل الرقابي</label>
                    <input
                      type="text"
                      value={saveReason}
                      onChange={(e) => setSaveReason(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                )}
              </div>

              {commissionType !== 'NONE' && (
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>سبب الإجراء للسجل الرقابي</label>
                  <input
                    type="text"
                    value={saveReason}
                    onChange={(e) => setSaveReason(e.target.value)}
                    className={styles.input}
                  />
                </div>
              )}
            </div>

            <div className={styles.drawerFooter}>
              <button type="button" disabled={saving} className={styles.btnPrimary} onClick={saveAuction}>
                {saving ? 'جارٍ الحفظ…' : editingAuction ? 'حفظ التعديلات والتوقيت' : 'إنشاء واعتماد المزاد'}
              </button>
              <button type="button" className={styles.btnSecondary} onClick={() => setDrawerOpen(false)}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
