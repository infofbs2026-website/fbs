'use client';

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Activity,
  AlertCircle,
  Bell,
  Car,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Crown,
  ExternalLink,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Gavel,
  Handshake,
  Home,
  KeyRound,
  LayoutDashboard,
  Lock,
  type LucideIcon,
  Mail,
  Menu,
  Moon,
  PanelRightClose,
  PanelRightOpen,
  Radio,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  UserCheck,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { MfaSetup } from '@/components/mfa';
import { sendJson } from '@/components/forms';
import accountStyles from '@/components/account-dashboard.module.css';
import styles from './admin-dashboard.module.css';
import { EngravedFbsCrest } from './helpers';
import { OverviewSection } from './sections/overview-section';
import { VerificationsSection } from './sections/verifications-section';
import { PlatesSection } from './sections/plates-section';
import { AuctionsSection } from './sections/auctions-section';
import { PagesCmsSection } from './sections/pages-cms-section';
import { SettingsSection } from './sections/settings-section';
import { PeopleOpsSection } from './sections/people-ops-section';
import { FinanceAuditSection } from './sections/finance-audit-section';
import type { AdminDashboardData, AdminSectionKey } from './types';

interface NavEntry {
  key: AdminSectionKey;
  label: string;
  subtitle: string;
  icon: LucideIcon;
  badgeKey?: keyof AdminDashboardData['badges'];
  liveTone?: boolean;
}

const NAV_GROUPS: Array<{ title: string; items: NavEntry[] }> = [
  {
    title: 'القيادة والاعتماد',
    items: [
      {
        key: 'overview',
        label: 'النظرة التنفيذية',
        subtitle: 'مؤشرات الأداء الفورية وغرفة القيادة المركزية لمنصة فارس بن سعود.',
        icon: LayoutDashboard,
      },
      {
        key: 'verifications',
        label: 'اعتماد لوحات الملاك',
        subtitle: 'مراجعة طلبات العارضين وفحص مستندات الملكية للقبول أو الرفض.',
        icon: FileCheck2,
        badgeKey: 'pendingVerifications',
      },
      {
        key: 'plates',
        label: 'اللوحات والمخزون',
        subtitle: 'إضافة وتعديل وحذف اللوحات والتحكم الكامل بالأسعار والظهور.',
        icon: Car,
      },
    ],
  },
  {
    title: 'المزادات والتحكم بالوقت',
    items: [
      {
        key: 'auctions',
        label: 'إدارة المزادات',
        subtitle: 'إنشاء المزادات وتعديل الأسعار وقواعد التمديد والوقت.',
        icon: Gavel,
      },
      {
        key: 'live',
        label: 'صالة المراقبة والوقت',
        subtitle: 'تحكم لحظي بالعد التنازلي، التمديد الفوري، الإيقاف، والترسية.',
        icon: Radio,
        badgeKey: 'liveAuctions',
        liveTone: true,
      },
      {
        key: 'registrations',
        label: 'تأهيل المسجلين',
        subtitle: 'اعتماد وتأهيل المزايدين المسجلين في المزادات.',
        icon: UserCheck,
      },
      {
        key: 'bids',
        label: 'سجل المزايدات',
        subtitle: 'دفتر العطاءات المالية المتسلسلة غير القابل للتعديل.',
        icon: Activity,
      },
    ],
  },
  {
    title: 'صفحات الموقع والإعدادات',
    items: [
      {
        key: 'cms',
        label: 'الصفحات والـ FAQ والمدن',
        subtitle: 'تحرير صفحات الموقع والسياسات والأسئلة الشائعة والمدن السعودية.',
        icon: FileText,
      },
      {
        key: 'settings',
        label: 'إعدادات الموقع الشاملة',
        subtitle: 'التحكم في الهوية، شريط الإعلانات، أرقام الواتساب، ومفاتيح الميزات.',
        icon: Settings,
      },
    ],
  },
  {
    title: 'الأعضاء والتوثيق والتواصل',
    items: [
      {
        key: 'identities',
        label: 'توثيق الهوية (KYC)',
        subtitle: 'فحص ومطابقة صور الهوية الوطنية للأعضاء.',
        icon: ShieldCheck,
        badgeKey: 'pendingIdentities',
      },
      {
        key: 'users',
        label: 'الأعضاء والصلاحيات',
        subtitle: 'إدارة حسابات المستخدمين ومنح أو سحب الأدوار الإدارية.',
        icon: Users,
      },
      {
        key: 'messages',
        label: 'رسائل تواصل معنا',
        subtitle: 'استفسارات الزوار وطلبات الكونسيرج والوساطة الخاصة.',
        icon: Mail,
        badgeKey: 'newMessages',
      },
      {
        key: 'notifications',
        label: 'الإشعارات والتعاميم',
        subtitle: 'إرسال تنبيهات فورية للأعضاء داخل حساباتهم.',
        icon: Bell,
      },
    ],
  },
  {
    title: 'المالية والتسويات والرقابة',
    items: [
      {
        key: 'settlements',
        label: 'التسويات ونقل الملكية',
        subtitle: 'إدارة الحساب الضامن Escrow ومراحل نقل الملكية عبر أبشر.',
        icon: Handshake,
        badgeKey: 'activeSettlements',
      },
      {
        key: 'deposits',
        label: 'تفويضات التأمينات',
        subtitle: 'متابعة حجوزات التأمين البنكية وحالات الفك والتحصيل.',
        icon: Wallet,
      },
      {
        key: 'payments',
        label: 'الحركات المصرفية',
        subtitle: 'سجل عمليات بوابة الدفع والتحويلات المعتمدة.',
        icon: CreditCard,
      },
      {
        key: 'reports',
        label: 'تقارير الترسية',
        subtitle: 'ملخصات المزادات المنتهية وتصدير التقارير المالية.',
        icon: FileSpreadsheet,
      },
      {
        key: 'audit',
        label: 'سجل التدقيق الرقابي',
        subtitle: 'الأرشيف الزمني الكامل لكافة قرارات وتعديلات الإدارة.',
        icon: Lock,
      },
    ],
  },
];

const ALL_NAV_ITEMS: NavEntry[] = NAV_GROUPS.flatMap((g) => g.items);

export function AdminDashboard({ data }: { data: AdminDashboardData }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [section, setSection] = useState<AdminSectionKey>(data.activeSection);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [preselectedPlateId, setPreselectedPlateId] = useState<string | null>(null);

  // MFA Modal State
  const [mfaModalOpen, setMfaModalOpen] = useState(false);
  const [mfaVerifiedLocal, setMfaVerifiedLocal] = useState(data.viewer.mfaVerified);
  const [totpCode, setTotpCode] = useState('');
  const [totpBusy, setTotpBusy] = useState(false);
  const [totpErr, setTotpErr] = useState('');

  // Omni-Search Modal (Ctrl+K)
  const [omniOpen, setOmniOpen] = useState(false);
  const [omniQuery, setOmniQuery] = useState('');

  // Toast Stack
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; kind: 'success' | 'error' }>>([]);

  useEffect(() => {
    setSection(data.activeSection);
  }, [data.activeSection]);

  useEffect(() => {
    setMfaVerifiedLocal(data.viewer.mfaVerified);
  }, [data.viewer.mfaVerified]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('fbs_admin_theme');
      if (saved === 'light' || saved === 'dark') setTheme(saved);
    } catch {}
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOmniOpen((v) => !v);
      } else if (e.key === 'Escape') {
        setOmniOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const notify = useCallback((message: string, kind: 'success' | 'error' = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-3), { id, message, kind }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const refreshData = useCallback(() => {
    startTransition(() => {
      router.refresh();
    });
  }, [router]);

  const navigateSection = useCallback(
    (next: AdminSectionKey, opts?: { createAuctionForPlateId?: string }) => {
      setSection(next);
      setMobileOpen(false);
      if (opts?.createAuctionForPlateId) {
        setPreselectedPlateId(opts.createAuctionForPlateId);
      }
      if (typeof window !== 'undefined') {
        const targetUrl = next === 'overview' ? '/admin' : `/admin/${next}`;
        window.history.pushState(null, '', targetUrl);
      }
    },
    [],
  );

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      window.localStorage.setItem('fbs_admin_theme', next);
    } catch {}
  }

  async function verifyExistingMfaFactor(e: React.FormEvent) {
    e.preventDefault();
    if (!data.viewer.mfaFactorId) return;
    setTotpBusy(true);
    setTotpErr('');
    try {
      await sendJson('/api/v1/security/verify', {
        factorId: data.viewer.mfaFactorId,
        code: totpCode.trim(),
      });
      setMfaVerifiedLocal(true);
      setMfaModalOpen(false);
      setTotpCode('');
      notify('تم تفعيل جلسة التحقق بخطوتين (2FA) بنجاح. يمكنك الآن تنفيذ جميع أوامر التعديل.');
      refreshData();
    } catch (err) {
      setTotpErr(err instanceof Error ? err.message : 'رمز التحقق غير صحيح، حاول مرة أخرى.');
    } finally {
      setTotpBusy(false);
    }
  }

  const activeNavMeta = useMemo(
    () => ALL_NAV_ITEMS.find((item) => item.key === section) ?? ALL_NAV_ITEMS[0],
    [section],
  );

  const omniResults = useMemo(() => {
    const q = omniQuery.trim().toLowerCase();
    const matchedNav = ALL_NAV_ITEMS.filter(
      (n) => !q || n.label.toLowerCase().includes(q) || n.subtitle.toLowerCase().includes(q),
    ).slice(0, 6);
    const matchedPlates = q
      ? data.plates
          .filter((p) =>
            [p.digits, p.letters_ar.join(' '), p.letters_ar.join(''), p.owner_name, p.slug]
              .join(' ')
              .toLowerCase()
              .includes(q),
          )
          .slice(0, 5)
      : [];
    return { matchedNav, matchedPlates };
  }, [omniQuery, data.plates]);

  return (
    <div
      className={`${accountStyles.dashboard} ${collapsed ? accountStyles.sidebarCollapsed : ''} ${mobileOpen ? accountStyles.sidebarOpen : ''}`}
      data-account-theme={theme}
      dir="rtl"
    >
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className={accountStyles.backdrop}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Executive Sculpted Sidebar */}
      <aside
        id="admin-navigation"
        className={`${accountStyles.sidebar} ${collapsed ? accountStyles.sidebarCollapsed : ''}`}
        aria-label="قائمة لوحة تحكم الإدارة"
      >
        <div className={accountStyles.sidebarInner}>
          {/* Brand Crest Plaque */}
          <div className={accountStyles.brandPlaque}>
            <Link href="/" className={accountStyles.brand} onClick={() => setMobileOpen(false)} aria-label="FBS، العودة للرئيسية" title="فارس بن سعود — الرئيسية">
              <div className={accountStyles.brandMark}>
                <img src="/brand/X12.svg" alt="" className={accountStyles.brandEmblem} />
                {!collapsed && (
                  <div className={accountStyles.brandWords}>
                    <img src="/brand/logo.svg" alt="فارس بن سعود" className={accountStyles.brandCalligraphy} />
                    <img src="/brand/X14.svg" alt="غرفة القيادة والسيطرة" className={accountStyles.brandSubtitle} />
                  </div>
                )}
              </div>
            </Link>
          </div>

          {/* Executive Member Monogram Card */}
          {!collapsed && (
            <div className={accountStyles.sidebarMember} title={data.viewer.displayName}>
              <span className={accountStyles.memberMonogram}>
                {data.viewer.displayName.charAt(0) || 'أ'}
                <span className={accountStyles.memberPulse} aria-hidden="true" />
              </span>
              <span className={accountStyles.memberMeta}>
                <strong>{data.viewer.displayName}</strong>
                <small dir="ltr" className="flex items-center gap-1 font-bold">
                  <Crown size={11} className="text-amber-500 shrink-0" />
                  <span>{data.viewer.email}</span>
                </small>
              </span>
            </div>
          )}

          {/* Grouped Navigation */}
          <nav className={accountStyles.navigation} aria-label="أقسام لوحة الإدارة">
            {NAV_GROUPS.map((group) => (
              <div key={group.title} className={accountStyles.navSection}>
                {!collapsed && <span className={accountStyles.navCaption}>{group.title}</span>}
                <div className={accountStyles.navTrack}>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = section === item.key;
                    const count = item.badgeKey ? data.badges[item.badgeKey] : 0;

                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => navigateSection(item.key)}
                        title={collapsed ? item.label : undefined}
                        aria-current={active ? 'page' : undefined}
                      >
                        <span className={accountStyles.navIconWrap}>
                          <Icon size={17} strokeWidth={1.9} aria-hidden="true" />
                        </span>
                        {!collapsed && <span className={accountStyles.navLabel}>{item.label}</span>}
                        {!collapsed && count > 0 && (
                          <span
                            className={`${accountStyles.navBadge} ${item.liveTone ? styles.navBadgeLive : ''}`}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Sidebar Bottom Dock */}
          <div className={accountStyles.sidebarBottom}>
            <div className={accountStyles.dockTray} role="group" aria-label="أدوات الإدارة السريعة">
              <Link href="/" onClick={() => setMobileOpen(false)} aria-label="الموقع العام" title="معاينة الموقع العام">
                <ExternalLink size={16} aria-hidden="true" />
                <span>الموقع</span>
              </Link>
              <Link href="/account" onClick={() => setMobileOpen(false)} aria-label="حسابي" title="لوحة الحساب العادية">
                <UserCheck size={16} aria-hidden="true" />
                <span>حسابي</span>
              </Link>
              <button
                type="button"
                onClick={() => setMfaModalOpen(true)}
                aria-label="المصادقة"
                title="إعدادات الأمان"
              >
                <KeyRound size={16} aria-hidden="true" />
                <span>2FA</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className={accountStyles.workspace}>
        <div className={accountStyles.content}>
          {/* Seamless Header */}
          <header className={accountStyles.header}>
            <div className={accountStyles.headerStart}>
              <button
                type="button"
                className={accountStyles.sidebarToggleBtn}
                onClick={() => setCollapsed((c) => !c)}
                title={collapsed ? 'توسيع القائمة الجانبية' : 'طي القائمة الجانبية'}
                aria-label={collapsed ? 'توسيع القائمة الجانبية' : 'طي القائمة الجانبية'}
              >
                {collapsed ? (
                  <PanelRightOpen size={18} strokeWidth={2.1} aria-hidden="true" />
                ) : (
                  <PanelRightClose size={18} strokeWidth={2.1} aria-hidden="true" />
                )}
              </button>

              <Link href="/" className={accountStyles.homePill} title="العودة للرئيسية">
                <span className={accountStyles.homePillIcon}>
                  <Home size={15} aria-hidden="true" />
                </span>
                <span>الرئيسية</span>
              </Link>
            </div>

            <div className={accountStyles.headerEnd}>
              {/* Omni Search Trigger */}
              <button
                type="button"
                onClick={() => setOmniOpen(true)}
                className={styles.omniTrigger}
                title="البحث الشامل والتنقل السريع (Ctrl+K)"
              >
                <Search size={15} />
                <span className="hidden sm:inline">ابحث في أقسام الإدارة واللوحات والمزادات…</span>
                <kbd className={`${styles.kbd} hidden md:inline`} dir="ltr">Ctrl K</kbd>
              </button>

              {/* Tactile Theme Switcher */}
              <div className={accountStyles.themeControl} role="group" aria-label="مظهر الداشبورد">
                <button
                  type="button"
                  aria-label="الوضع الفاتح الخزفي"
                  aria-pressed={theme === 'light'}
                  onClick={() => {
                    setTheme('light');
                    try { window.localStorage.setItem('fbs_admin_theme', 'light'); } catch {}
                  }}
                >
                  <Sun size={14} aria-hidden="true" />
                  <span className="hidden sm:inline">فاتح</span>
                </button>
                <button
                  type="button"
                  aria-label="الوضع الداكن الملكي"
                  aria-pressed={theme === 'dark'}
                  onClick={() => {
                    setTheme('dark');
                    try { window.localStorage.setItem('fbs_admin_theme', 'dark'); } catch {}
                  }}
                >
                  <Moon size={14} aria-hidden="true" />
                  <span className="hidden sm:inline">داكن</span>
                </button>
              </div>

              {/* 2FA Assurance Pill */}
              <button
                type="button"
                onClick={() => setMfaModalOpen(true)}
                className={`${styles.mfaPill} ${
                  mfaVerifiedLocal ? styles.mfaPillVerified : styles.mfaPillLocked
                }`}
                title="حالة التحقق بخطوتين للعمليات الإدارية الحساسة"
              >
                <KeyRound size={14} />
                <span className="hidden sm:inline">
                  {mfaVerifiedLocal ? 'جلسة 2FA موثقة' : 'تأكيد 2FA'}
                </span>
              </button>

              {/* Refresh */}
              <button
                type="button"
                onClick={refreshData}
                className={accountStyles.raisedIconBtn}
                title="تحديث البيانات من الخادم"
                aria-label="تحديث البيانات"
              >
                <RefreshCw size={16} className={isPending ? 'animate-spin' : ''} />
              </button>

              {/* Admin Avatar Pill */}
              <div className={accountStyles.userPill}>
                <span className={accountStyles.avatar}>{data.viewer.displayName.charAt(0) || 'أ'}</span>
                <span className={accountStyles.userName}>{data.viewer.displayName || 'الإدارة'}</span>
              </div>
            </div>
          </header>

          {/* Sculpted 3D Welcome & Operations Banner */}
          <section className={accountStyles.greeting} aria-label="ترويسة القيادة التنفيذية">
            <div className={accountStyles.greetingInner}>
              <div className={accountStyles.greetingCopy}>
                <p className={accountStyles.eyebrowPill}>
                  <Crown size={13} aria-hidden="true" />
                  <span>غرفة العمليات المركزية والتحكم الشامل · منصة فارس بن سعود للوحات</span>
                </p>
                <h1 className={accountStyles.engravedHeading}>
                  <span className={accountStyles.carvedInk}>{activeNavMeta.label} </span>
                  <span className={accountStyles.carvedGold}>· غرفة التحكم التنفيذي</span>
                </h1>
                <p className={accountStyles.intro}>{activeNavMeta.subtitle}</p>
              </div>

              <div className={accountStyles.greetingActions}>
                <button
                  type="button"
                  className={accountStyles.primaryButton}
                  onClick={() => navigateSection(section === 'overview' ? 'plates' : 'overview')}
                >
                  <Car size={16} aria-hidden="true" />
                  <span>{section === 'overview' ? 'إضافة لوحة جديدة' : 'النظرة التنفيذية'}</span>
                </button>
                <button
                  type="button"
                  className={accountStyles.secondaryHeroButton}
                  onClick={() => navigateSection('verifications')}
                >
                  <FileCheck2 size={15} aria-hidden="true" />
                  <span>طابور الاعتماد ({data.badges.pendingVerifications})</span>
                </button>
              </div>

              <EngravedFbsCrest
                filterId="fbs-admin-greeting-deboss"
                tone={theme}
                className={accountStyles.greetingWatermark}
              />
            </div>
          </section>
          {/* Gentle inline banner when MFA session isn't unlocked yet */}
          {!mfaVerifiedLocal && (
            <div className={styles.mfaBanner}>
              <div className="flex items-center gap-2.5 text-xs">
                <Crown size={17} className="text-amber-400 shrink-0" />
                <div>
                  <strong>حماية الصلاحيات التنفيذية (2FA):</strong> يمكنك تصفح كافة البيانات بحرية؛ ولتنفيذ أوامر القبول أو الحذف أو تعديل الوقت والأسعار اضغط على زر تأكيد رمز المصادقة بخطوتين.
                </div>
              </div>
              <button type="button" className={styles.btnPrimary} onClick={() => setMfaModalOpen(true)}>
                <KeyRound size={14} />
                <span>فتح قفل التعديل (2FA)</span>
              </button>
            </div>
          )}

          {section === 'overview' && (
            <OverviewSection
              data={data}
              onNavigate={navigateSection}
              onNotify={notify}
              onRequireMfa={() => setMfaModalOpen(true)}
              onRefresh={refreshData}
            />
          )}

          {section === 'verifications' && (
            <VerificationsSection
              data={data}
              onNavigate={navigateSection}
              onNotify={notify}
              onRequireMfa={() => setMfaModalOpen(true)}
              onRefresh={refreshData}
            />
          )}

          {section === 'plates' && (
            <PlatesSection
              data={data}
              onNavigate={navigateSection}
              onNotify={notify}
              onRequireMfa={() => setMfaModalOpen(true)}
              onRefresh={refreshData}
            />
          )}

          {(section === 'auctions' || section === 'live') && (
            <AuctionsSection
              data={data}
              liveOnly={section === 'live'}
              preselectedPlateId={preselectedPlateId}
              onClearPreselectedPlate={() => setPreselectedPlateId(null)}
              onNotify={notify}
              onRequireMfa={() => setMfaModalOpen(true)}
              onRefresh={refreshData}
            />
          )}

          {section === 'cms' && (
            <PagesCmsSection
              data={data}
              onNotify={notify}
              onRequireMfa={() => setMfaModalOpen(true)}
              onRefresh={refreshData}
            />
          )}

          {section === 'settings' && (
            <SettingsSection
              data={data}
              onNotify={notify}
              onRequireMfa={() => setMfaModalOpen(true)}
              onRefresh={refreshData}
            />
          )}

          {(section === 'identities' ||
            section === 'users' ||
            section === 'registrations' ||
            section === 'messages' ||
            section === 'notifications') && (
            <PeopleOpsSection
              section={section}
              data={{
                ...data,
                viewer: { ...data.viewer, mfaVerified: mfaVerifiedLocal },
              }}
              onNotify={notify}
              onRequireMfa={() => setMfaModalOpen(true)}
              onRefresh={refreshData}
            />
          )}

          {(section === 'bids' ||
            section === 'deposits' ||
            section === 'payments' ||
            section === 'settlements' ||
            section === 'reports' ||
            section === 'audit') && (
            <FinanceAuditSection
              section={section}
              data={data}
              onNotify={notify}
              onRequireMfa={() => setMfaModalOpen(true)}
              onRefresh={refreshData}
            />
          )}
        </div>
      </div>

      {/* Inline 2FA Unlock / Enrollment Modal */}
      {mfaModalOpen && (
        <div className={styles.modalCenter} role="dialog" aria-modal="true" aria-label="التحقق بخطوتين للإدارة">
          <div className={styles.modalBox}>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--adm-border)]">
              <div className="flex items-center gap-2">
                <KeyRound size={18} className="text-[var(--adm-gold)]" />
                <h3 className="text-base font-black m-0">تأكيد الهوية الإدارية بخطوتين (2FA)</h3>
              </div>
              <button type="button" className={styles.iconBtn} onClick={() => setMfaModalOpen(false)} aria-label="إغلاق">
                <X size={16} />
              </button>
            </div>

            {mfaVerifiedLocal ? (
              <div className="py-4 text-center space-y-2">
                <CheckCircle2 size={34} className="mx-auto text-emerald-400" />
                <p className="text-sm font-black m-0">جلسة التحقق بخطوتين مفعّلة وموثقة حالياً (AAL2)</p>
                <p className="text-xs opacity-75 m-0">جميع أوامر التعديل والحذف والاعتماد مفتوحة لحسابك الإداري.</p>
              </div>
            ) : data.viewer.mfaFactorId ? (
              <form onSubmit={verifyExistingMfaFactor} className="space-y-3">
                <p className="text-xs opacity-80 leading-relaxed m-0">
                  أدخل الرمز المكون من 6 أرقام من تطبيق المصادقة المرتبط بحسابك لتفعيل صلاحيات التعديل الفورية.
                </p>
                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor="admin-totp-code">
                    رمز تطبيق المصادقة (6 أرقام)
                  </label>
                  <input
                    id="admin-totp-code"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                    dir="ltr"
                    placeholder="000000"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                    className={`${styles.input} text-center text-lg font-mono tracking-widest`}
                  />
                </div>
                {totpErr && <p className="text-xs text-rose-400 font-bold m-0">{totpErr}</p>}
                <button type="submit" disabled={totpBusy} className={`${styles.btnPrimary} w-full`}>
                  {totpBusy ? 'جارٍ التحقق…' : 'تأكيد الرمز وفتح الصلاحيات'}
                </button>
              </form>
            ) : (
              <div className="space-y-3">
                <p className="text-xs opacity-80 leading-relaxed m-0">
                  لم يتم ربط تطبيق مصادقة بحسابك الإداري بعد. يمكنك إعداده الآن مباشرة دون مغادرة لوحة الإدارة:
                </p>
                <MfaSetup />
                <button
                  type="button"
                  onClick={() => {
                    setMfaModalOpen(false);
                    refreshData();
                  }}
                  className={`${styles.btnSecondary} w-full`}
                >
                  تحديث الجلسة بعد إتمام الربط
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Omni-Search Command Palette (Ctrl+K) */}
      {omniOpen && (
        <div className={styles.modalCenter} role="dialog" aria-modal="true" aria-label="البحث السريع">
          <div className={styles.modalBox}>
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-[var(--adm-border)]">
              <Search size={17} className="text-[var(--adm-gold)] shrink-0" />
              <input
                type="search"
                autoFocus
                value={omniQuery}
                onChange={(e) => setOmniQuery(e.target.value)}
                placeholder="انتقل لأي قسم أو ابحث برقم لوحة أو اسم مالك…"
                className={styles.searchInput}
              />
              <button type="button" className={styles.iconBtn} onClick={() => setOmniOpen(false)} aria-label="إغلاق">
                <X size={15} />
              </button>
            </div>

            <div className="space-y-3 max-h-[55vh] overflow-y-auto">
              <div>
                <div className="text-[11px] font-bold opacity-60 mb-1.5">أقسام لوحة التحكم</div>
                <div className="space-y-1">
                  {omniResults.matchedNav.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => {
                          setOmniOpen(false);
                          setOmniQuery('');
                          navigateSection(item.key);
                        }}
                        className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs hover:bg-[var(--adm-surface-hover)] text-start cursor-pointer"
                      >
                        <span className="inline-flex items-center gap-2 font-bold">
                          <Icon size={15} className="text-[var(--adm-gold)]" />
                          <span>{item.label}</span>
                        </span>
                        <span className="opacity-60 truncate max-w-[200px]">{item.subtitle}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {omniResults.matchedPlates.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold opacity-60 mb-1.5">اللوحات المطابقة</div>
                  <div className="space-y-1">
                    {omniResults.matchedPlates.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setOmniOpen(false);
                          setOmniQuery('');
                          navigateSection('plates');
                        }}
                        className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs hover:bg-[var(--adm-surface-hover)] text-start cursor-pointer"
                      >
                        <span className="font-bold">
                          {p.letters_ar.join(' ')} {p.digits} — {p.type_name}
                        </span>
                        <span className="opacity-70">{p.listing_status}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {toasts.length > 0 && (
        <div className={styles.toastStack} aria-live="polite">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`${styles.toast} ${
                t.kind === 'error' ? styles.toastError : styles.toastSuccess
              }`}
            >
              {t.kind === 'error' ? (
                <AlertCircle size={17} className="text-rose-400 shrink-0" />
              ) : (
                <CheckCircle2 size={17} className="text-emerald-400 shrink-0" />
              )}
              <span>{t.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
