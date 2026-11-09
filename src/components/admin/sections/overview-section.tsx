'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowLeft,
  ArrowUpLeft,
  Car,
  CheckCircle2,
  Clock,
  Compass,
  CreditCard,
  Crown,
  ExternalLink,
  FileCheck2,
  FileText,
  Gavel,
  KeyRound,
  Mail,
  Pause,
  Play,
  Plus,
  Radio,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
  XCircle,
} from 'lucide-react';
import { FbsStageWatermark, PlateVisualizer } from '@/components/ui';
import { SarPrice, SarSymbol, formatEnglishAmount } from '@/components/sar-symbol';
import accountStyles from '@/components/account-dashboard.module.css';
import adminStyles from '../admin-dashboard.module.css';
import {
  AUCTION_STATUS_LABELS,
  VERIFICATION_LABELS,
  callAdminManage,
  formatAdminDate,
  formatCountdownLabel,
} from '../helpers';
import type { AdminDashboardData, AdminSectionKey, AdminPlateRecord } from '../types';

interface OverviewProps {
  data: AdminDashboardData;
  onNavigate: (section: AdminSectionKey, opts?: { createAuctionForPlateId?: string }) => void;
  onNotify: (msg: string, kind?: 'success' | 'error') => void;
  onRequireMfa: () => void;
  onRefresh: () => void;
}

function LiveCountdownChamber({ endsAt }: { endsAt?: string | null }) {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    if (!endsAt || !Number.isFinite(Date.parse(endsAt))) return;
    const end = Date.parse(endsAt);
    const timer = window.setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= end) window.clearInterval(timer);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [endsAt]);

  const valid = Boolean(endsAt && Number.isFinite(Date.parse(endsAt)));
  const totalSeconds = valid && endsAt ? Math.max(0, Math.floor((Date.parse(endsAt) - now) / 1000)) : null;

  const days = totalSeconds === null ? '—' : String(Math.floor(totalSeconds / 86400)).padStart(2, '0');
  const hours = totalSeconds === null ? '—' : String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, '0');
  const minutes = totalSeconds === null ? '—' : String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = totalSeconds === null ? '—' : String(totalSeconds % 60).padStart(2, '0');

  const units = [
    { key: 'days', label: 'يوم', value: days },
    { key: 'hours', label: 'ساعة', value: hours },
    { key: 'minutes', label: 'دقيقة', value: minutes },
    { key: 'seconds', label: 'ثانية', value: seconds },
  ];

  return (
    <div className={accountStyles.countdownUnits} dir="ltr">
      {units.map((unit) => (
        <div key={unit.key} className={accountStyles.countdownUnitBox}>
          <span className={accountStyles.countdownLabel}>{unit.label}</span>
          <span className={accountStyles.countdownNum}>{unit.value}</span>
        </div>
      ))}
    </div>
  );
}

export function OverviewSection({
  data,
  onNavigate,
  onNotify,
  onRequireMfa,
  onRefresh,
}: OverviewProps) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [analyticsRange, setAnalyticsRange] = useState<'7d' | '30d'>('7d');

  const publishedPlates = data.plates.filter((p) => p.listing_status === 'PUBLISHED').length;
  const draftPlates = data.plates.filter((p) => p.listing_status === 'DRAFT').length;
  const soldPlates = data.plates.filter((p) => p.listing_status === 'SOLD').length;
  const pendingSubmissions = data.plates.filter((p) =>
    ['SUBMITTED', 'DOCUMENTS_PENDING', 'UNDER_REVIEW'].includes(p.verification_status),
  );
  const approvedPlatesCount = data.plates.filter((p) => p.verification_status === 'APPROVED').length;
  const liveAuctions = data.auctions.filter((a) =>
    ['LIVE', 'ENDING', 'REGISTRATION_OPEN', 'WAITING_ROOM', 'PAUSED'].includes(a.status),
  );
  const topLiveAuction = liveAuctions[0] ?? null;
  const topPlate = topLiveAuction
    ? data.plates.find((p) => p.id === topLiveAuction.plate_id) ?? null
    : null;

  const verifiedUsers = data.users.filter((u) => u.kyc_status === 'VERIFIED').length;

  const totalPlatesCount = Math.max(1, data.plates.length);
  const approvalRatePct = Math.round((approvedPlatesCount / totalPlatesCount) * 100);
  const kycRatePct = Math.round((verifiedUsers / Math.max(1, data.users.length)) * 100);
  const auctionEngagementPct = Math.min(
    100,
    Math.round(((liveAuctions.length + data.bids.length) / Math.max(1, data.plates.length)) * 100),
  );

  // Donut chart segments (circumference for r=48 is ~301.59)
  const donutCircumference = 2 * Math.PI * 48;
  const segPublished = (publishedPlates / totalPlatesCount) * donutCircumference;
  const segLive = (liveAuctions.length / totalPlatesCount) * donutCircumference;
  const segPending = ((pendingSubmissions.length + draftPlates) / totalPlatesCount) * donutCircumference;

  const trafficSeries =
    analyticsRange === '7d'
      ? [
          { day: 'السبت', visits: 1420, bids: 18 },
          { day: 'الأحد', visits: 1680, bids: 24 },
          { day: 'الإثنين', visits: 1540, bids: 21 },
          { day: 'الثلاثاء', visits: 1920, bids: 32 },
          { day: 'الأربعاء', visits: 2180, bids: 39 },
          { day: 'الخميس', visits: 2490, bids: 46 },
          { day: 'الجمعة', visits: 2310, bids: 41 },
        ]
      : [
          { day: 'الأسبوع 1', visits: 8400, bids: 112 },
          { day: 'الأسبوع 2', visits: 9650, bids: 138 },
          { day: 'الأسبوع 3', visits: 11200, bids: 164 },
          { day: 'الأسبوع 4', visits: 13540, bids: 221 },
        ];
  const maxTrafficVisits = Math.max(...trafficSeries.map((d) => d.visits), 1);
  const totalPeriodVisits = trafficSeries.reduce((sum, d) => sum + d.visits, 0);

  const totalLiveVolumeMinor = data.auctions
    .filter((a) => ['LIVE', 'ENDING', 'COMPLETED', 'SETTLEMENT', 'ENDED'].includes(a.status))
    .reduce((acc, a) => {
      try {
        return acc + BigInt(a.current_price || '0');
      } catch {
        return acc;
      }
    }, 0n);

  async function quickAuctionCommand(
    auctionId: string,
    command: 'EXTEND_MINUTES' | 'PAUSE' | 'RESUME',
    minutes = 15,
  ) {
    setBusyId(`${auctionId}:${command}`);
    const res = await callAdminManage({
      action: 'auction.control',
      auctionId,
      command,
      minutes,
      reason:
        command === 'EXTEND_MINUTES'
          ? `تمديد سريع لمدة ${minutes} دقيقة من النظرة العامة الإدارية`
          : command === 'PAUSE'
            ? 'إيقاف مؤقت سريع من النظرة العامة الإدارية'
            : 'استئناف المزاد من النظرة العامة الإدارية',
    });
    setBusyId(null);
    if (!res.ok) {
      if (res.mfaRequired) onRequireMfa();
      onNotify(res.error || 'تعذر تنفيذ الأمر', 'error');
      return;
    }
    onNotify(res.message || 'تم تحديث المزاد بنجاح');
    onRefresh();
  }

  async function quickReviewSubmission(plateId: string, decision: 'APPROVED' | 'REJECTED') {
    setBusyId(`${plateId}:${decision}`);
    const res = await callAdminManage({
      action: 'submission.review',
      plateId,
      decision,
      reviewNotes:
        decision === 'APPROVED'
          ? 'تم اعتماد اللوحة ونقلها إلى المخزون المعتمد مباشرة'
          : 'تم رفض طلب العرض لعدم اكتمال مسوغات رخصة السير',
    });
    setBusyId(null);
    if (!res.ok) {
      if (res.mfaRequired) onRequireMfa();
      onNotify(res.error || 'تعذر تسجيل القرار', 'error');
      return;
    }
    onNotify(
      decision === 'APPROVED' ? 'تم اعتماد اللوحة ونشرها بنجاح' : 'تم رفض طلب العرض وتحديث الحالة',
    );
    onRefresh();
  }

  return (
    <div className="space-y-6">
      {/* 1. Summary Heading & Tactile Multi-Plane Metric Vaults */}
      <div className={accountStyles.summaryHeading}>
        <span className={accountStyles.headingOrnament} aria-hidden="true" />
        <h2 className={accountStyles.engravedSubheading}>
          <span className={accountStyles.carvedInk}>مؤشرات </span>
          <span className={accountStyles.carvedGold}>المنصة والعمليات</span>
        </h2>
        <span className={accountStyles.headingRule} aria-hidden="true" />
      </div>

      <section className={accountStyles.metrics} aria-label="مؤشرات القيادة">
        {[
          {
            label: 'اللوحات المعروضة بالموقع',
            sub: `إجمالي السجل: ${data.plates.length} لوحة`,
            value: publishedPlates,
            section: 'plates' as const,
            icon: Car,
          },
          {
            label: 'طلبات عروض تنتظر قرارك',
            sub: 'فحص رخصة السير والاعتماد',
            value: data.badges.pendingVerifications,
            section: 'verifications' as const,
            icon: FileCheck2,
          },
          {
            label: 'المزادات المباشرة والنشطة',
            sub: `إجمالي المزادات: ${data.auctions.length}`,
            value: data.badges.liveAuctions,
            section: 'live' as const,
            icon: Gavel,
          },
          {
            label: 'الأعضاء والهويات الموثقة',
            sub: `موثقون: ${verifiedUsers} · معلقون: ${data.badges.pendingIdentities}`,
            value: data.users.length,
            section: 'users' as const,
            icon: Users,
          },
        ].map(({ label, sub, value, section, icon: Icon }) => (
          <div
            role="button"
            tabIndex={0}
            key={label}
            onClick={() => onNavigate(section)}
            onKeyDown={(e) => e.key === 'Enter' && onNavigate(section)}
            className={`${accountStyles.metric} cursor-pointer`}
          >
            <div className={accountStyles.metricTop}>
              <span className={accountStyles.metricIcon}>
                <Icon size={19} strokeWidth={1.85} aria-hidden="true" />
              </span>
              <span className={accountStyles.metricArrow}>
                <ArrowUpLeft size={15} aria-hidden="true" />
              </span>
            </div>
            <div className={accountStyles.metricVault}>
              <strong className={accountStyles.metricNumber}>{value}</strong>
              <span className={accountStyles.metricTitle}>{label}</span>
              <small className={accountStyles.metricSub}>{sub}</small>
            </div>
          </div>
        ))}
      </section>

      {/* 2. Executive Bento Grid: Signature Live Auction Commander + Recessed Quick Command Dock */}
      <div className={accountStyles.bentoGrid}>
        {/* Top Live Auction Showcase */}
        <section className={accountStyles.auctionSection} aria-label="المزاد المباشر الأبرز">
          {topLiveAuction ? (
            <>
              <div className={accountStyles.auctionTopline}>
                <span className={accountStyles.spotlightLabel}>
                  <Radio size={14} strokeWidth={2.1} className="text-emerald-500 animate-pulse" aria-hidden="true" />
                  <span>غرفة التحكم بالمزاد الحي</span>
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('live')}
                  className={accountStyles.spotlightLink}
                >
                  <span>صالة التحكم الكاملة</span>
                  <ArrowLeft size={14} aria-hidden="true" />
                </button>
              </div>

              <div className={accountStyles.auctionBody}>
                <div className={accountStyles.auctionInfo}>
                  <h2 className={accountStyles.auctionCarvedTitle}>
                    <span className={accountStyles.carvedInk}>مزاد لوحة </span>
                    <span className={accountStyles.carvedGold}>
                      {topPlate ? `${topPlate.letters_ar.join(' ')} ${topPlate.digits}` : 'مباشر'}
                    </span>
                  </h2>
                  <p className={accountStyles.auctionLead}>
                    تحكم لحظي مباشر: تمديد وقت المزاد فوراً (+15 دقيقة)، الإيقاف المؤقت، أو الترسية وإنهاء المزاد.
                  </p>

                  <div className={accountStyles.auctionTimerChamber}>
                    <LiveCountdownChamber endsAt={topLiveAuction.effective_end_at} />
                  </div>

                  <div className={accountStyles.auctionActionRow}>
                    <div className={accountStyles.auctionPriceInline}>
                      <span className={accountStyles.auctionInlinePriceLabel}>أعلى مزايدة حالية</span>
                      <strong className={accountStyles.auctionPriceValue} dir="rtl">
                        <span dir="ltr">
                          {formatEnglishAmount(topLiveAuction.current_price || '0')}
                        </span>
                        <SarSymbol className={accountStyles.riyal} />
                      </strong>
                    </div>

            <div className="flex items-center justify-between gap-2 flex-nowrap pt-2">
              <button
                type="button"
                disabled={busyId !== null}
                onClick={() => quickAuctionCommand(topLiveAuction.id, 'EXTEND_MINUTES', 15)}
                className={`${accountStyles.goldButton} flex-1 !min-w-0 !min-h-[42px] !px-4 text-xs whitespace-nowrap`}
                title="تمديد الوقت 15 دقيقة إضافية فوراً"
              >
                <Clock size={14} />
                <span>+15 دقيقة</span>
              </button>
              <button
                type="button"
                disabled={busyId !== null}
                onClick={() =>
                  quickAuctionCommand(
                    topLiveAuction.id,
                    topLiveAuction.status === 'PAUSED' ? 'RESUME' : 'PAUSE',
                  )
                }
                className={`${accountStyles.secondaryHeroButton} flex-1 !min-w-0 !min-h-[42px] !px-4 text-xs whitespace-nowrap`}
              >
                {topLiveAuction.status === 'PAUSED' ? <Play size={14} /> : <Pause size={14} />}
                <span>{topLiveAuction.status === 'PAUSED' ? 'استئناف' : 'إيقاف مؤقت'}</span>
              </button>
            </div>
                  </div>
                </div>

                <div className={accountStyles.auctionVisualCol}>
                  {topPlate && (
                    <>
                      <p className={accountStyles.visualPlateInfo}>
                        <span>{topPlate.type_name} · {topPlate.city_name}</span>
                        <span className={accountStyles.visualInfoDivider} aria-hidden="true">—</span>
                        <span>لوحة {topPlate.letters_ar.join(' ')} {topPlate.digits}</span>
                      </p>
                      <div className={accountStyles.auctionVisual}>
                        <FbsStageWatermark className={accountStyles.auctionStageWatermark} />
                        <div className={accountStyles.heroPlate}>
                          <PlateVisualizer
                            lettersAr={topPlate.letters_ar}
                            lettersEn={topPlate.letters_en}
                            numbers={topPlate.digits}
                            plateType={topPlate.type_name}
                            large
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className={accountStyles.noAuction}>
              <h2 className={accountStyles.auctionCarvedTitle}>
                <span className={accountStyles.carvedInk}>لا توجد مزادات </span>
                <span className={accountStyles.carvedGold}>نشطة حالياً</span>
              </h2>
              <p>يمكنك إطلاق مزاد فوري وتحديد وقت البداية والنهاية على أي لوحة معتمدة بنقرة واحدة.</p>
              <button
                type="button"
                onClick={() => onNavigate('auctions')}
                className={accountStyles.goldButton}
              >
                <Plus size={16} />
                <span>إنشاء مزاد جديد</span>
                <ArrowLeft size={16} />
              </button>
            </div>
          )}
        </section>

        {/* Tactile Quick Executive Command Bar */}
        <section className={accountStyles.quickBar} aria-label="أوامر سريعة">
          <div className={accountStyles.quickIntro}>
            <span className={accountStyles.quickIntroIcon}>
              <Compass size={19} aria-hidden="true" />
            </span>
            <div>
              <h2 className={accountStyles.engravedSubheading}>
                <span className={accountStyles.carvedInk}>أوامر </span>
                <span className={accountStyles.carvedGold}>سريعة</span>
              </h2>
              <p>انتقل مباشرةً لإدارة أقسام المنصة الأساسية</p>
            </div>
          </div>

          <div className={accountStyles.quickLinks}>
            {[
              {
                label: 'اعتماد لوحات الملاك',
                desc: `${pendingSubmissions.length} طلبات بانتظار المراجعة`,
                icon: FileCheck2,
                section: 'verifications' as const,
              },
              {
                label: 'اللوحات والمخزون',
                desc: 'إضافة وتعديل اللوحات والأسعار',
                icon: Car,
                section: 'plates' as const,
              },
              {
                label: 'المزادات والتحكم بالوقت',
                desc: 'تمديد الوقت والترسية والرقابة',
                icon: Gavel,
                section: 'auctions' as const,
              },
            ].map(({ label, desc, icon: Icon, section }) => (
              <button
                key={section}
                type="button"
                onClick={() => onNavigate(section)}
              >
                <span className={accountStyles.quickIcon}>
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span className={accountStyles.quickText}>
                  <strong>{label}</strong>
                  <small>{desc}</small>
                </span>
                <ArrowLeft size={15} aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* 2.5 Executive Analytics, Visits & Circular Charts Section */}
      <section className={accountStyles.listSection} aria-label="تحليلات المنصة والزيارات">
        <div className={accountStyles.sectionHeading}>
          <div>
            <p className={accountStyles.eyebrowPill}>
              <TrendingUp size={13} strokeWidth={2.1} aria-hidden="true" />
              <span>تحليلات الأداء والزيارات المباشرة</span>
            </p>
            <h2 className={accountStyles.engravedSectionTitle}>
              <span className={accountStyles.carvedInk}>إحصائيات المنصة </span>
              <span className={accountStyles.carvedGold}>والتحليلات (Analytics)</span>
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className={adminStyles.filterPills}>
              <button
                type="button"
                onClick={() => setAnalyticsRange('7d')}
                className={`${adminStyles.filterPill} ${
                  analyticsRange === '7d' ? adminStyles.filterPillActive : ''
                }`}
              >
                آخر 7 أيام
              </button>
              <button
                type="button"
                onClick={() => setAnalyticsRange('30d')}
                className={`${adminStyles.filterPill} ${
                  analyticsRange === '30d' ? adminStyles.filterPillActive : ''
                }`}
              >
                آخر 30 يوماً
              </button>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('reports')}
              className={accountStyles.sectionActionPill}
            >
              <span>التقارير التفصيلية</span>
              <ArrowLeft size={14} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Card 1: Visits & Traffic Bar/Area Chart */}
          <article className={adminStyles.itemCard}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-black text-[var(--ink-strong)] m-0">
                  حركة الزيارات والمزايدات
                </h3>
                <p className="text-[11.5px] text-[var(--muted)] m-0 mt-0.5">
                  معدل زيارات المنصة وتفاعل المزايدين
                </p>
              </div>
              <span className={`${adminStyles.badge} ${adminStyles.tone_emerald}`}>
                <span dir="ltr">+18.4%</span>
                <span>نمو</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 my-1">
              <div className="rounded-xl border border-[var(--well-border)] bg-[var(--well-bg)] p-3 text-right">
                <div className="text-[11px] font-bold text-[var(--muted)]">إجمالي الزيارات</div>
                <div className="text-xl font-black text-[var(--ink-strong)] tabular-nums mt-0.5">
                  <span dir="ltr">{totalPeriodVisits.toLocaleString('en-US')}</span>
                </div>
              </div>
              <div className="rounded-xl border border-[var(--well-border)] bg-[var(--well-bg)] p-3 text-right">
                <div className="text-[11px] font-bold text-[var(--muted)]">إجمالي المزايدات</div>
                <div className="text-xl font-black text-[var(--gold)] tabular-nums mt-0.5">
                  <span dir="ltr">{data.bids.length.toLocaleString('en-US')}</span>
                </div>
              </div>
            </div>

            {/* Interactive Bar Chart */}
            <div className="rounded-2xl border border-[var(--well-border)] bg-[var(--well-bg)] p-3.5 pt-4">
              <div className="flex items-end justify-between gap-1.5 h-32">
                {trafficSeries.map((item) => {
                  const heightPct = Math.max(18, Math.round((item.visits / maxTrafficVisits) * 100));
                  return (
                    <div
                      key={item.day}
                      className="flex-1 min-w-0 flex flex-col items-center justify-end h-full gap-1.5 group"
                      title={`${item.day}: ${item.visits.toLocaleString('en-US')} زيارة`}
                    >
                      <span
                        className="text-[10.5px] tabular-nums font-extrabold text-[var(--muted)]"
                        dir="ltr"
                      >
                        {item.visits >= 1000 ? `${(item.visits / 1000).toFixed(1)}k` : item.visits}
                      </span>
                      <div className="w-full max-w-[28px] bg-black/5 rounded-t-lg h-full flex items-end overflow-hidden">
                        <div
                          style={{ height: `${heightPct}%` }}
                          className="w-full rounded-t-lg transition-all duration-300 bg-gradient-to-t from-[#08162b] via-[#b88428] to-[#edd08d]"
                        />
                      </div>
                      <span className="text-[10.5px] font-extrabold text-[var(--ink-strong)] whitespace-nowrap leading-normal">
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </article>

          {/* Card 2: Circular Donut Chart — Plate & Auction Distribution */}
          <article className={adminStyles.itemCard}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-black text-[var(--ink-strong)] m-0">
                  التوزيع الدائري للمخزون والمزادات
                </h3>
                <p className="text-[11.5px] text-[var(--muted)] m-0 mt-0.5">
                  توزيع اللوحات حسب الحالة والمسار البيعي
                </p>
              </div>
              <span className={`${adminStyles.badge} ${adminStyles.tone_gold}`}>
                {data.plates.length} لوحة
              </span>
            </div>

            <div className="flex items-center justify-center gap-5 my-auto py-2">
              <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    fill="none"
                    stroke="rgba(148, 163, 184, 0.2)"
                    strokeWidth="13"
                  />
                  {/* Published Segment (Gold) */}
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    fill="none"
                    stroke="#c89632"
                    strokeWidth="13"
                    strokeDasharray={`${segPublished} ${donutCircumference}`}
                    strokeLinecap="round"
                  />
                  {/* Live Auctions Segment (Emerald) */}
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="13"
                    strokeDasharray={`${segLive} ${donutCircumference}`}
                    strokeDashoffset={-segPublished}
                    strokeLinecap="round"
                  />
                  {/* Pending / Draft Segment (Royal Navy) */}
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    fill="none"
                    stroke="#14243c"
                    strokeWidth="13"
                    strokeDasharray={`${segPending} ${donutCircumference}`}
                    strokeDashoffset={-(segPublished + segLive)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <strong className="text-2xl font-black text-[var(--ink-strong)] tabular-nums leading-none">
                    {data.plates.length}
                  </strong>
                  <span className="text-[10.5px] font-extrabold text-[var(--muted)] mt-1">
                    إجمالي اللوحات
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 flex-1 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 font-bold text-[var(--ink-strong)]">
                    <span className="w-3 h-3 rounded-full bg-[#c89632] shrink-0" />
                    <span>منشورة بالموقع</span>
                  </span>
                  <strong className="tabular-nums font-black">{publishedPlates}</strong>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 font-bold text-[var(--ink-strong)]">
                    <span className="w-3 h-3 rounded-full bg-[#10b981] shrink-0" />
                    <span>مزادات نشطة</span>
                  </span>
                  <strong className="tabular-nums font-black">{liveAuctions.length}</strong>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 font-bold text-[var(--ink-strong)]">
                    <span className="w-3 h-3 rounded-full bg-[#14243c] shrink-0" />
                    <span>مراجعة / مسودة</span>
                  </span>
                  <strong className="tabular-nums font-black">{pendingSubmissions.length + draftPlates}</strong>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 font-bold text-[var(--ink-strong)]">
                    <span className="w-3 h-3 rounded-full bg-[#0284c7] shrink-0" />
                    <span>مباعة ومكتملة</span>
                  </span>
                  <strong className="tabular-nums font-black">{soldPlates}</strong>
                </div>
              </div>
            </div>
          </article>

          {/* Card 3: Radial Circular Gauges — Operational Health & Volume */}
          <article className={adminStyles.itemCard}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-black text-[var(--ink-strong)] m-0">
                  مؤشرات الكفاءة الدائرية
                </h3>
                <p className="text-[11.5px] text-[var(--muted)] m-0 mt-0.5">
                  نسب الاعتماد وتوثيق الهويات والتفاعل
                </p>
              </div>
              <Activity size={18} className="text-[var(--gold)] shrink-0" />
            </div>

            <div className="grid grid-cols-3 gap-2.5 my-auto py-2">
              {[
                { label: 'اعتماد اللوحات', pct: approvalRatePct, color: '#c89632' },
                { label: 'توثيق الهويات', pct: kycRatePct, color: '#10b981' },
                { label: 'تفاعل المزادات', pct: auctionEngagementPct, color: '#14243c' },
              ].map((gauge) => {
                const r = 30;
                const c = 2 * Math.PI * r;
                const dash = (gauge.pct / 100) * c;
                return (
                  <div
                    key={gauge.label}
                    className="flex flex-col items-center justify-center p-2.5 rounded-2xl border border-[var(--well-border)] bg-[var(--well-bg)] text-center"
                  >
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
                        <circle
                          cx="36"
                          cy="36"
                          r={r}
                          fill="none"
                          stroke="rgba(148, 163, 184, 0.22)"
                          strokeWidth="6.5"
                        />
                        <circle
                          cx="36"
                          cy="36"
                          r={r}
                          fill="none"
                          stroke={gauge.color}
                          strokeWidth="6.5"
                          strokeDasharray={`${dash} ${c}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <strong
                        className="absolute text-xs font-black text-[var(--ink-strong)] tabular-nums"
                        dir="ltr"
                      >
                        {gauge.pct}%
                      </strong>
                    </div>
                    <span className="text-[11px] font-extrabold text-[var(--ink-strong)] mt-1.5">
                      {gauge.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between rounded-xl border border-[var(--well-border)] bg-[var(--well-bg)] px-3.5 py-2.5 text-xs">
              <span className="font-bold text-[var(--muted)]">إجمالي حجم المزايدات النشطة:</span>
              <strong className="text-sm font-black text-[var(--ink-strong)]" dir="rtl">
                <span dir="ltr">{formatEnglishAmount(totalLiveVolumeMinor.toString())}</span>{' '}
                <SarSymbol className={accountStyles.riyal} />
              </strong>
            </div>
          </article>
        </div>
      </section>

      {/* 3. Pending Seller Submissions Section (Rendered as Authentic Plate Cards) */}
      <section className={accountStyles.listSection} aria-label="طلبات اللوحات بانتظار الاعتماد">
        <div className={accountStyles.sectionHeading}>
          <div>
            <p className={accountStyles.eyebrowPill}>
              <FileCheck2 size={13} strokeWidth={2.1} aria-hidden="true" />
              <span>فحص الملكية ورخصة السير</span>
            </p>
            <h2 className={accountStyles.engravedSectionTitle}>
              <span className={accountStyles.carvedInk}>طلبات اعتماد </span>
              <span className={accountStyles.carvedGold}>لوحات البائعين</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('verifications')}
            className={accountStyles.sectionActionPill}
          >
            <span>جميع الطلبات ({pendingSubmissions.length})</span>
            <ArrowLeft size={14} aria-hidden="true" />
          </button>
        </div>

        {pendingSubmissions.length ? (
          <div className={accountStyles.plateGrid}>
            {pendingSubmissions.slice(0, 4).map((plate) => {
              const isBusy = busyId?.startsWith(plate.id);
              return (
                <article key={plate.id} className={adminStyles.itemCard}>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`${adminStyles.badge} ${adminStyles.tone_slate}`}>
                      {plate.type_name} · {plate.city_name}
                    </span>
                    <span className={`${adminStyles.badge} ${adminStyles.tone_amber}`}>
                      <Clock size={12} />
                      <span>قيد المراجعة</span>
                    </span>
                  </div>

                  {/* Realistic Plate Stage Pedestal */}
                  <div className={adminStyles.plateStage}>
                    <FbsStageWatermark className={accountStyles.auctionStageWatermark} />
                    <div className="relative z-10 w-full max-w-[255px]">
                      <PlateVisualizer
                        lettersAr={plate.letters_ar}
                        lettersEn={plate.letters_en}
                        numbers={plate.digits}
                        plateType={plate.type_name}
                        compact
                      />
                    </div>
                  </div>

                  {/* Seller Price & Metadata */}
                  <div className="flex items-baseline justify-between pt-1 text-xs">
                    <span className="text-[var(--muted)] font-semibold">السعر المطلوب:</span>
                    <strong className="text-sm font-black text-[var(--ink-strong)]" dir="rtl">
                      <span dir="ltr">{formatEnglishAmount(plate.asking_price_minor || '0')}</span>{' '}
                      <SarSymbol className={accountStyles.riyal} />
                    </strong>
                  </div>

                  {/* Quick Decision Action Bar */}
                  <div className={`grid grid-cols-2 gap-2 pt-2.5 ${adminStyles.engravedDivider}`}>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => quickReviewSubmission(plate.id, 'APPROVED')}
                      className={`${adminStyles.btnSuccess} justify-center !px-3`}
                    >
                      <CheckCircle2 size={14} />
                      <span>اعتماد</span>
                    </button>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => onNavigate('verifications')}
                      className={`${adminStyles.btnSecondary} !min-h-[40px] !px-3`}
                    >
                      <span>المستندات</span>
                      <ArrowLeft size={13} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className={accountStyles.empty}>
            لا توجد طلبات جديدة بانتظار الاعتماد حالياً.
          </div>
        )}
      </section>

      {/* 4. Approved Platform Plates Section */}
      <section className={accountStyles.listSection} aria-label="لوحات المنصة المعتمدة">
        <div className={accountStyles.sectionHeading}>
          <div>
            <p className={accountStyles.eyebrowPill}>
              <Car size={13} strokeWidth={2.1} aria-hidden="true" />
              <span>مخزون المنصة الرسمي</span>
            </p>
            <h2 className={accountStyles.engravedSectionTitle}>
              <span className={accountStyles.carvedInk}>لوحات </span>
              <span className={accountStyles.carvedGold}>المنصة المعروضة</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('plates')}
            className={accountStyles.sectionActionPill}
          >
            <span>جميع اللوحات ({data.plates.length})</span>
            <ArrowLeft size={14} aria-hidden="true" />
          </button>
        </div>

        <div className={accountStyles.plateGrid}>
          {data.plates.slice(0, 4).map((plate) => {
            const hasAuction = data.auctions.some((a) => a.plate_id === plate.id);
            const isPublished = plate.listing_status === 'PUBLISHED';
            return (
              <article key={plate.id} className={adminStyles.itemCard}>
                <div className="flex items-center justify-between gap-2">
                  <span className={`${adminStyles.badge} ${adminStyles.tone_slate}`}>
                    {plate.type_name} · {plate.city_name}
                  </span>
                  <span
                    className={`${adminStyles.badge} ${
                      isPublished ? adminStyles.tone_emerald : adminStyles.tone_amber
                    }`}
                  >
                    {isPublished ? 'منشورة' : 'مسودة'}
                  </span>
                </div>

                <div className={adminStyles.plateStage}>
                  <FbsStageWatermark className={accountStyles.auctionStageWatermark} />
                  <div className="relative z-10 w-full max-w-[255px]">
                    <PlateVisualizer
                      lettersAr={plate.letters_ar}
                      lettersEn={plate.letters_en}
                      numbers={plate.digits}
                      plateType={plate.type_name}
                      compact
                    />
                  </div>
                </div>

                <div className="flex items-baseline justify-between pt-1 text-xs">
                  <span className="text-[var(--muted)] font-semibold">
                    {plate.sale_mode === 'AUCTION' ? 'سعر فتح المزاد:' : 'السعر المحدد:'}
                  </span>
                  <strong className="text-sm font-black text-[var(--ink-strong)]" dir="rtl">
                    <span dir="ltr">{formatEnglishAmount(plate.asking_price_minor || '0')}</span>{' '}
                    <SarSymbol className={accountStyles.riyal} />
                  </strong>
                </div>

                <div className={`grid grid-cols-2 gap-2 pt-2.5 ${adminStyles.engravedDivider}`}>
                  <button
                    type="button"
                    onClick={() => onNavigate('plates')}
                    className={`${adminStyles.btnSecondary} !min-h-[40px] !px-3`}
                  >
                    <span>تعديل</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onNavigate('auctions', { createAuctionForPlateId: plate.id })
                    }
                    className={`${adminStyles.btnPrimary} !min-h-[40px] !px-3`}
                  >
                    <Gavel size={13} />
                    <span>{hasAuction ? 'إدارة المزاد' : 'إطلاق مزاد'}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
