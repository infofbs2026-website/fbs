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

  const publishedPlates = data.plates.filter((p) => p.listing_status === 'PUBLISHED').length;
  const pendingSubmissions = data.plates.filter((p) =>
    ['SUBMITTED', 'DOCUMENTS_PENDING', 'UNDER_REVIEW'].includes(p.verification_status),
  );
  const liveAuctions = data.auctions.filter((a) =>
    ['LIVE', 'ENDING', 'REGISTRATION_OPEN', 'WAITING_ROOM', 'PAUSED'].includes(a.status),
  );
  const topLiveAuction = liveAuctions[0] ?? null;
  const topPlate = topLiveAuction
    ? data.plates.find((p) => p.id === topLiveAuction.plate_id) ?? null
    : null;

  const verifiedUsers = data.users.filter((u) => u.kyc_status === 'VERIFIED').length;

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

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        disabled={busyId !== null}
                        onClick={() => quickAuctionCommand(topLiveAuction.id, 'EXTEND_MINUTES', 15)}
                        className={accountStyles.goldButton}
                        title="تمديد الوقت 15 دقيقة إضافية فوراً"
                      >
                        <Clock size={15} />
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
                        className={accountStyles.secondaryHeroButton}
                      >
                        {topLiveAuction.status === 'PAUSED' ? <Play size={15} /> : <Pause size={15} />}
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
              <p>انتقل مباشرةً لإدارة وتحكم كافة أركان المنصة</p>
            </div>
          </div>

          <div className={accountStyles.quickLinks}>
            {[
              {
                label: 'طابور اعتماد لوحات العارضين',
                desc: `${pendingSubmissions.length} طلبات جديدة تنتظر قرارك`,
                icon: FileCheck2,
                section: 'verifications' as const,
              },
              {
                label: 'إضافة أو تعديل لوحة معتمدة',
                desc: 'التحكم الكامل بالأسعار وحذف اللوحات',
                icon: Car,
                section: 'plates' as const,
              },
              {
                label: 'المزادات والتحكم بالوقت',
                desc: 'تمديد الوقت، الترسية، وقواعد المزايدة',
                icon: Gavel,
                section: 'auctions' as const,
              },
              {
                label: 'تعديل صفحات الموقع والـ FAQ',
                desc: 'تحرير السياسات والشروط والأسئلة الشائعة',
                icon: FileText,
                section: 'cms' as const,
              },
              {
                label: 'إعدادات الهوية والواتساب',
                desc: 'شريط الإعلانات وأرقام الدعم المعتمدة',
                icon: Settings,
                section: 'settings' as const,
              },
            ].map(({ label, desc, icon: Icon, section }) => (
              <button
                key={section}
                type="button"
                onClick={() => onNavigate(section)}
                className="cursor-pointer text-start w-full border-0 bg-transparent p-0"
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
            <span>مراجعة كافة الطلبات ({pendingSubmissions.length})</span>
            <ArrowLeft size={14} aria-hidden="true" />
          </button>
        </div>

        {pendingSubmissions.length ? (
          <div className={accountStyles.plateGrid}>
            {pendingSubmissions.slice(0, 4).map((plate) => {
              const isBusy = busyId?.startsWith(plate.id);
              return (
                <article
                  key={plate.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--line)] hover:border-[var(--line-hover)] bg-[var(--surface)] p-3 sm:p-4 shadow-[var(--slab-shadow)] hover:shadow-[var(--slab-shadow-hover)] transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between gap-1.5 pb-2.5 border-b border-[var(--line)] text-xs font-bold">
                    <span className="inline-flex items-center rounded-lg px-2.5 py-1 bg-[var(--well-bg)] border border-[var(--well-border)] text-[var(--gold)]">
                      {plate.type_name} · {plate.city_name}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/30">
                      <Clock size={12} />
                      <span>بانتظار قرارك</span>
                    </span>
                  </div>

                  {/* Realistic Plate Stage Pedestal */}
                  <div className="relative my-3 flex items-center justify-center py-4 px-2 rounded-xl bg-gradient-to-b from-[#faf8f3] to-[#ebe6d9] dark:from-[#08162b] dark:to-[#040913] border border-[var(--line)] shadow-inner">
                    <PlateVisualizer
                      lettersAr={plate.letters_ar}
                      lettersEn={plate.letters_en}
                      numbers={plate.digits}
                      plateType={plate.type_name}
                    />
                  </div>

                  {/* Seller Price & Metadata */}
                  <div className="flex items-baseline justify-between pt-1 pb-3 text-xs">
                    <span className="text-[var(--muted)] font-semibold">السعر المطلوب من المالك:</span>
                    <strong className="text-sm font-black text-[var(--ink-strong)]" dir="rtl">
                      <span dir="ltr">{formatEnglishAmount(plate.asking_price_minor || '0')}</span>{' '}
                      <SarSymbol className={accountStyles.riyal} />
                    </strong>
                  </div>

                  {/* Quick Decision Action Bar */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--line)]">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => quickReviewSubmission(plate.id, 'APPROVED')}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-black text-emerald-700 bg-emerald-500/15 border border-emerald-500/40 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                    >
                      <CheckCircle2 size={14} />
                      <span>اعتماد اللوحة</span>
                    </button>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => onNavigate('verifications')}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-black text-[var(--ink-strong)] bg-[var(--well-bg)] border border-[var(--line)] hover:border-[var(--line-hover)] transition-all cursor-pointer"
                    >
                      <span>فحص المستندات</span>
                      <ArrowLeft size={13} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className={accountStyles.empty}>
            لا توجد طلبات جديدة بانتظار الاعتماد حالياً. جميع عروض الملاك تم فحصها واعتمادها!
          </div>
        )}
      </section>

      {/* 4. Approved Platform Plates Section (Using the User Dashboard Plate Grid) */}
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
            <span>إدارة كافة اللوحات ({data.plates.length})</span>
            <ArrowLeft size={14} aria-hidden="true" />
          </button>
        </div>

        <div className={accountStyles.plateGrid}>
          {data.plates.slice(0, 4).map((plate) => {
            const hasAuction = data.auctions.some((a) => a.plate_id === plate.id);
            return (
              <article
                key={plate.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--line)] hover:border-[var(--line-hover)] bg-[var(--surface)] p-3 sm:p-4 shadow-[var(--slab-shadow)] hover:shadow-[var(--slab-shadow-hover)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between gap-1.5 pb-2.5 border-b border-[var(--line)] text-xs font-bold">
                  <span className="inline-flex items-center rounded-lg px-2.5 py-1 bg-[var(--well-bg)] border border-[var(--well-border)] text-[var(--gold)]">
                    {plate.type_name} · {plate.city_name}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-black ${
                      plate.listing_status === 'PUBLISHED'
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                        : 'bg-slate-500/10 text-slate-500 border border-slate-500/30'
                    }`}
                  >
                    {plate.listing_status === 'PUBLISHED' ? 'معروضة بالموقع' : plate.listing_status}
                  </span>
                </div>

                <div className="relative my-3 flex items-center justify-center py-4 px-2 rounded-xl bg-gradient-to-b from-[#faf8f3] to-[#ebe6d9] dark:from-[#08162b] dark:to-[#040913] border border-[var(--line)] shadow-inner">
                  <PlateVisualizer
                    lettersAr={plate.letters_ar}
                    lettersEn={plate.letters_en}
                    numbers={plate.digits}
                    plateType={plate.type_name}
                  />
                </div>

                <div className="flex items-baseline justify-between pt-1 pb-3 text-xs">
                  <span className="text-[var(--muted)] font-semibold">
                    {plate.sale_mode === 'AUCTION' ? 'سعر فتح المزاد:' : 'السعر المحدد:'}
                  </span>
                  <strong className="text-sm font-black text-[var(--ink-strong)]" dir="rtl">
                    <span dir="ltr">{formatEnglishAmount(plate.asking_price_minor || '0')}</span>{' '}
                    <SarSymbol className={accountStyles.riyal} />
                  </strong>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--line)]">
                  <button
                    type="button"
                    onClick={() => onNavigate('plates')}
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-black text-[var(--ink-strong)] bg-[var(--well-bg)] border border-[var(--line)] hover:border-[var(--line-hover)] transition-all cursor-pointer"
                  >
                    <span>تعديل اللوحة</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onNavigate('auctions', { createAuctionForPlateId: plate.id })
                    }
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-black text-[#08162b] bg-gradient-to-b from-[#faebd0] to-[#d9bb81] border border-[#b89047] hover:brightness-105 transition-all cursor-pointer"
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
