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
  Users,
  X,
  XCircle,
} from 'lucide-react';
import { PlateVisualizer } from '@/components/ui';
import { SarPrice } from '@/components/sar-symbol';
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
  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  const [statusFilter, setStatusFilter] = useState<string>(liveOnly ? 'ACTIVE' : 'ALL');
  const [query, setQuery] = useState('');
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [expandedAuctionId, setExpandedAuctionId] = useState<string | null>(null);

  // Custom End Time Quick Modal
  const [timeModalAuction, setTimeModalAuction] = useState<AdminAuctionRecord | null>(null);
  const [customEndLocal, setCustomEndLocal] = useState('');
  const [customTimeReason, setCustomTimeReason] = useState('تعديل وقت إغلاق المزاد من غرفة التحكم الإدارية');

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
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(timer);
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
            const cd = formatCountdownLabel(auction.effective_end_at, nowMs);
            const isTerminal = ['ENDED', 'COMPLETED', 'CANCELLED', 'RESERVE_NOT_MET'].includes(auction.status);
            const isExpanded = expandedAuctionId === auction.id;
            const auctionBids = data.bids.filter((b) => b.auction_id === auction.id);
            const auctionRegs = data.registrations.filter((r) => r.auction_id === auction.id);

            return (
              <article key={auction.id} className={styles.panel}>
                <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
                  {/* Plate Stage */}
                  <div className="space-y-2.5">
                    <div className={styles.plateStage}>
                      <div className="w-full max-w-[235px]">
                        <PlateVisualizer
                          lettersAr={auction.letters_ar}
                          lettersEn={auction.letters_en}
                          numbers={auction.digits}
                          plateType={auction.plate_type}
                          compact
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs px-1">
                      <span className={`${styles.badge} ${styles[`tone_${st.tone}`]}`}>{st.label}</span>
                      <Link
                        href={`/plates/${auction.plate_slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 font-bold hover:underline text-[var(--adm-gold)]"
                      >
                        <span>صفحة المزاد</span>
                        <ExternalLink size={12} />
                      </Link>
                    </div>
                  </div>

                  {/* Auction Financial & Time Command Console */}
                  <div className="space-y-3.5 min-w-0">
                    {/* Financial Metrics Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="rounded-xl border border-[var(--adm-border-subtle)] bg-[var(--adm-surface-soft)] p-3">
                        <div className="text-[11px] opacity-70">المزايدة الحالية</div>
                        <div className="mt-1 text-base font-black">
                          <SarPrice amount={auction.current_price} />
                        </div>
                      </div>

                      <div className="rounded-xl border border-[var(--adm-border-subtle)] bg-[var(--adm-surface-soft)] p-3">
                        <div className="text-[11px] opacity-70">سعر البداية / الزيادة</div>
                        <div className="mt-1 text-xs font-bold">
                          <SarPrice amount={auction.starting_price} /> • +<SarPrice amount={auction.minimum_increment} />
                        </div>
                      </div>

                      <div className="rounded-xl border border-[var(--adm-border-subtle)] bg-[var(--adm-surface-soft)] p-3">
                        <div className="text-[11px] opacity-70">العد التنازلي للإغلاق</div>
                        <div
                          className={`mt-1 font-mono text-sm font-black tabular-nums ${
                            cd.urgent && !isTerminal ? 'text-rose-400' : ''
                          }`}
                          dir="ltr"
                        >
                          {isTerminal ? st.label : cd.text}
                        </div>
                      </div>

                      <div className="rounded-xl border border-[var(--adm-border-subtle)] bg-[var(--adm-surface-soft)] p-3">
                        <div className="text-[11px] opacity-70">العطاءات والتمديدات</div>
                        <div className="mt-1 text-xs font-black">
                          {auction.sequence_no} مزايدة • {auction.registrations_count} مسجل • {auction.extension_count} تمديد
                        </div>
                      </div>
                    </div>

                    {/* Exact Timestamps Info */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs opacity-80">
                      <span>البدء: {formatAdminDate(auction.start_at)}</span>
                      <span>الإغلاق الفعلي: {formatAdminDate(auction.effective_end_at)}</span>
                      {auction.reserve_price && (
                        <span>
                          الحد السري: <SarPrice amount={auction.reserve_price} />
                        </span>
                      )}
                      {auction.deposit_amount && BigInt(auction.deposit_amount) > 0n && (
                        <span>
                          التأمين: <SarPrice amount={auction.deposit_amount} />
                        </span>
                      )}
                    </div>

                    {/* Direct Time Control & State Transitions */}
                    {!isTerminal && (
                      <div className="rounded-2xl border border-[var(--adm-border)] bg-[var(--adm-surface-soft)] p-3 space-y-2.5">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-xs font-black flex items-center gap-1.5 text-[var(--adm-gold)]">
                            <Timer size={14} />
                            <span>التحكم الفوري بوقت المزاد وحالته</span>
                          </span>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            {[
                              { label: '+5 دقائق', min: 5 },
                              { label: '+15 دقيقة', min: 15 },
                              { label: '+1 ساعة', min: 60 },
                              { label: '+24 ساعة', min: 1440 },
                              { label: '-5 دقائق', min: -5 },
                            ].map((btn) => (
                              <button
                                key={btn.min}
                                type="button"
                                disabled={busyKey !== null}
                                onClick={() =>
                                  executeControl(auction.id, 'EXTEND_MINUTES', {
                                    minutes: btn.min,
                                    reason: `تعديل وقت المزاد (${btn.label}) من الإدارة`,
                                  })
                                }
                                className={styles.btnChip}
                              >
                                {btn.label}
                              </button>
                            ))}

                            <button
                              type="button"
                              onClick={() => {
                                setTimeModalAuction(auction);
                                setCustomEndLocal(toDatetimeLocalValue(auction.effective_end_at));
                                setCustomTimeReason('تحديد موعد إغلاق مخصص للمزاد من الإدارة');
                              }}
                              className={styles.btnChip}
                            >
                              <Clock size={12} />
                              <span>تحديد وقت مخصص</span>
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-[var(--adm-border-subtle)]">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {auction.status !== 'LIVE' && auction.status !== 'PAUSED' && (
                              <button
                                type="button"
                                disabled={busyKey !== null}
                                onClick={() =>
                                  executeControl(auction.id, 'GO_LIVE_NOW', {
                                    reason: 'بدء المزاد المباشر فوراً بأمر الإدارة',
                                  })
                                }
                                className={styles.btnSuccess}
                              >
                                <Play size={13} />
                                <span>بدء مباشر الآن (LIVE)</span>
                              </button>
                            )}

                            {['DRAFT', 'PENDING_APPROVAL', 'SCHEDULED'].includes(auction.status) && (
                              <button
                                type="button"
                                disabled={busyKey !== null}
                                onClick={() =>
                                  executeControl(auction.id, 'OPEN_REGISTRATION_NOW', {
                                    reason: 'فتح باب التسجيل في المزاد الآن',
                                  })
                                }
                                className={styles.btnSecondary}
                              >
                                <span>فتح التسجيل الآن</span>
                              </button>
                            )}

                            {auction.status === 'PAUSED' ? (
                              <button
                                type="button"
                                disabled={busyKey !== null}
                                onClick={() =>
                                  executeControl(auction.id, 'RESUME', {
                                    reason: 'استئناف المزاد من لوحة الإدارة',
                                  })
                                }
                                className={styles.btnSuccess}
                              >
                                <Play size={13} />
                                <span>استئناف المزاد</span>
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
                                  className={styles.btnSecondary}
                                >
                                  <Pause size={13} />
                                  <span>إيقاف مؤقت</span>
                                </button>
                              )
                            )}

                            <button type="button" className={styles.btnSecondary} onClick={() => openEditDrawer(auction)}>
                              <Edit3 size={13} />
                              <span>تعديل الأسعار والإعدادات</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            {['LIVE', 'ENDING', 'PAUSED'].includes(auction.status) && (
                              <button
                                type="button"
                                disabled={busyKey !== null}
                                onClick={() => {
                                  if (window.confirm('هل تريد إنهاء المزاد الآن واعتماد النتيجة والترسية فوراً؟')) {
                                    executeControl(auction.id, 'FINALIZE_NOW', {
                                      reason: 'إنهاء وترسية المزاد يدوياً بأمر الإدارة',
                                    });
                                  }
                                }}
                                className={styles.btnPrimary}
                              >
                                <Flag size={13} />
                                <span>إنهاء وترسية الآن</span>
                              </button>
                            )}

                            <button
                              type="button"
                              disabled={busyKey !== null}
                              onClick={() => {
                                const r = window.prompt('اكتب سبب إلغاء المزاد (سيتم فك حجز التأمينات تلقائياً):', 'إلغاء المزاد بقرار تنظيمي من الإدارة');
                                if (r && r.trim().length >= 3) {
                                  executeControl(auction.id, 'CANCEL', { reason: r.trim() });
                                }
                              }}
                              className={styles.btnDanger}
                            >
                              <XCircle size={13} />
                              <span>إلغاء المزاد</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Expandable Live Bids & Registrations Inspector */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setExpandedAuctionId(isExpanded ? null : auction.id)}
                        className={styles.btnChip}
                      >
                        <Users size={13} />
                        <span>
                          {isExpanded
                            ? 'إخفاء سجل المزايدات والمشاركين'
                            : `عرض المزايدات الحية (${auctionBids.length}) والمشاركين (${auctionRegs.length})`}
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="mt-3 grid gap-3 md:grid-cols-2">
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
                                      <span className="font-mono opacity-70">#{bid.sequence_no}</span>{' '}
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

      {/* Create / Edit Auction Drawer */}
      {drawerOpen && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="إعداد المزاد">
          <div className={styles.drawer}>
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
                  <div className="w-full max-w-[265px]">
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
                    <span className="text-xs text-amber-400">
                      جميع اللوحات الحالية مرتبطة بمزادات نشطة؛ يمكنك إضافة لوحة جديدة أولاً من قسم اللوحات.
                    </span>
                  )}
                </div>
              )}

              {/* Prices in SAR */}
              <div className={styles.formGrid}>
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
                  <label className={styles.fieldLabel}>السعر الاحتياطي السري (اختياري SAR)</label>
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
                  <label className={styles.fieldLabel}>مبلغ التأمين البنكي (0 = بدون تأمين)</label>
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
                        launchMode === 'LIVE_NOW' ? '!border-emerald-400 !text-emerald-400' : ''
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
                <div className={styles.formGrid}>
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
              <div className="rounded-2xl border border-[var(--adm-border)] bg-[var(--adm-surface-soft)] p-4 space-y-3">
                <label className={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    checked={antiSniping}
                    onChange={(e) => setAntiSniping(e.target.checked)}
                  />
                  <span>تفعيل التمديد التلقائي لمنع القنص في اللحظات الأخيرة (Anti-Sniping)</span>
                </label>

                {antiSniping && (
                  <div className={styles.formGrid}>
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

                <label className={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    checked={requireKyc}
                    onChange={(e) => setRequireKyc(e.target.checked)}
                  />
                  <span>اشتراط توثيق الهوية الوطنية (KYC) للمزايدة في هذا المزاد</span>
                </label>
              </div>

              {/* Commission */}
              <div className={styles.formGrid}>
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

                {commissionType !== 'NONE' && (
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
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>سبب الإجراء للسجل الرقابي</label>
                <input
                  type="text"
                  value={saveReason}
                  onChange={(e) => setSaveReason(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.drawerFooter}>
              <button type="button" className={styles.btnSecondary} onClick={() => setDrawerOpen(false)}>
                إلغاء
              </button>
              <button type="button" disabled={saving} className={styles.btnPrimary} onClick={saveAuction}>
                {saving ? 'جارٍ الحفظ…' : editingAuction ? 'حفظ التعديلات والتوقيت' : 'إنشاء واعتماد المزاد'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
