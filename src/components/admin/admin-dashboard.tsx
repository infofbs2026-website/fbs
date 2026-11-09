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
  LogOut,
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
    title: 'الأعضاء والتواصل',
    items: [
      {
        key: 'identities',
        label: 'توثيق الهويات',
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
        label: 'رسائل التواصل',
        subtitle: 'استفسارات الزوار وطلبات الكونسيرج والوساطة الخاصة.',
        icon: Mail,
        badgeKey: 'newMessages',
      },
      {
        key: 'notifications',
        label: 'الإشعارات',
        subtitle: 'إرسال تنبيهات فورية للأعضاء داخل حساباتهم.',
        icon: Bell,
      },
    ],
  },
  {
    title: 'المحتوى والإعدادات',
    items: [
      {
        key: 'cms',
        label: 'الصفحات والمدن',
        subtitle: 'تحرير صفحات الموقع والسياسات والأسئلة الشائعة والمدن السعودية.',
        icon: FileText,
      },
      {
        key: 'settings',
        label: 'إعدادات المنصة',
        subtitle: 'التحكم في الهوية، شريط الإعلانات، أرقام الواتساب، ومفاتيح الميزات.',
        icon: Settings,
      },
    ],
  },
  {
    title: 'المالية والرقابة',
    items: [
      {
        key: 'settlements',
        label: 'التسويات والضمان',
        subtitle: 'إدارة الحساب الضامن Escrow ومراحل نقل الملكية عبر أبشر.',
        icon: Handshake,
        badgeKey: 'activeSettlements',
      },
      {
        key: 'deposits',
        label: 'التأمينات البنكية',
        subtitle: 'متابعة حجوزات التأمين البنكية وحالات الفك والتحصيل.',
        icon: Wallet,
      },
      {
        key: 'payments',
        label: 'المدفوعات',
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
        label: 'سجل التدقيق',
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
        const targetUrl = next === 'overview' ? '/fbs-console' : `/fbs-console/${next}`;
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

  async function handleAdminLogout() {
    try {
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
    } catch {}
    try {
      window.sessionStorage.clear();
    } catch {}
    window.location.href = '/';
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
      className={accountStyles.dashboard}
      data-account-theme={theme}
      data-sidebar-collapsed={collapsed ? 'true' : 'false'}
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
        className={`${accountStyles.sidebar} ${collapsed ? accountStyles.sidebarCollapsed : ''} ${mobileOpen ? accountStyles.sidebarOpen : ''}`}
        aria-label="قائمة لوحة تحكم الإدارة"
      >
        <div className={accountStyles.sidebarInner}>
          {/* Brand Crest Plaque */}
          <div className={accountStyles.brandPlaque}>
            <Link href="/" className={accountStyles.brand} onClick={() => setMobileOpen(false)} aria-label="FBS، العودة للرئيسية" title="فارس بن سعود — الرئيسية">
              <div className={accountStyles.brandMark}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/X12.svg" alt="" className={accountStyles.brandEmblem} />
                {!collapsed && (
                  <div className={accountStyles.brandWords}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/brand/logo.svg" alt="فارس بن سعود" className={accountStyles.brandCalligraphy} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/brand/X14.svg" alt="اللوحات المميزة" className={accountStyles.brandSubtitle} />
                  </div>
                )}
              </div>
            </Link>
          </div>

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
                        data-tooltip={item.label}
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
              <button
                type="button"
                onClick={handleAdminLogout}
                className={accountStyles.dockLogout}
                aria-label="تسجيل الخروج"
                title="تسجيل الخروج وإنهاء الجلسة الإدارية"
              >
                <LogOut size={16} aria-hidden="true" />
                <span>خروج</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className={accountStyles.workspace}>
        <div className={accountStyles.content}>
          {/* Seamless Header — Matches AccountDashboard 1:1 */}
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

            {/* Centered Omni-Search Bar — Matches AccountDashboard */}
            <div className={accountStyles.omniSearchRoot}>
              <form
                className={accountStyles.omniSearchForm}
                role="search"
                aria-label="البحث الشامل في الإدارة"
                onSubmit={(e) => {
                  e.preventDefault();
                  setOmniOpen(true);
                }}
              >
                <span className={accountStyles.omniSearchIcon} aria-hidden="true">
                  <Search size={17} strokeWidth={2.2} />
                </span>
                <input
                  type="search"
                  value={omniQuery}
                  onFocus={() => setOmniOpen(true)}
                  onChange={(e) => {
                    setOmniQuery(e.target.value);
                    setOmniOpen(true);
                  }}
                  placeholder="ابحث في أقسام الإدارة، اللوحات، المزادات، أو الأعضاء..."
                  aria-label="ابحث في الإدارة"
                  autoComplete="off"
                  className={accountStyles.omniSearchInput}
                />
                <button type="submit" className={accountStyles.omniSubmitBtn}>
                  <span>بحث</span>
                </button>
              </form>
            </div>

            <div className={accountStyles.headerEnd}>
              {/* Single Theme Switcher Button */}
              <button
                type="button"
                className={accountStyles.raisedIconBtn}
                aria-label={theme === 'dark' ? 'الوضع الداكن' : 'الوضع الفاتح'}
                aria-pressed={theme === 'dark'}
                title={theme === 'dark' ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
                onClick={() => {
                  const nextTheme = theme === 'dark' ? 'light' : 'dark';
                  setTheme(nextTheme);
                  try { window.localStorage.setItem('fbs_admin_theme', nextTheme); } catch {}
                }}
              >
                {theme === 'dark' ? (
                  <Sun size={17} aria-hidden="true" />
                ) : (
                  <Moon size={17} aria-hidden="true" />
                )}
              </button>

              {/* 2FA Status & Quick Unlock Icon Button */}
              <button
                type="button"
                onClick={() => setMfaModalOpen(true)}
                className={styles.mfaHeaderIconBtn}
                aria-label={mfaVerifiedLocal ? 'التحقق بخطوتين (2FA) مفعل' : 'تفعيل التحقق بخطوتين (2FA)'}
                title={mfaVerifiedLocal ? 'التحقق بخطوتين (2FA) مفعل' : 'تفعيل التحقق بخطوتين (2FA)'}
              >
                <ShieldCheck size={18} strokeWidth={2.1} aria-hidden="true" />
              </button>

              {/* Admin Avatar Pill */}
              <div className={accountStyles.userPill}>
                <span className={accountStyles.avatar}>{data.viewer.displayName.charAt(0) || 'أ'}</span>
                <span className={accountStyles.userName}>{data.viewer.displayName || 'الإدارة'}</span>
              </div>

              {/* Admin Logout Button */}
              <button
                type="button"
                onClick={handleAdminLogout}
                className={accountStyles.raisedIconBtn}
                style={{ color: '#ef4444' }}
                aria-label="تسجيل الخروج من لوحة الإدارة"
                title="تسجيل الخروج وإنهاء الجلسة الإدارية"
              >
                <LogOut size={17} strokeWidth={2.1} aria-hidden="true" />
              </button>
            </div>
          </header>

          {/* Sculpted 3D Welcome & Operations Banner — Matches AccountDashboard */}
          <section className={accountStyles.greeting} aria-label="ترويسة القيادة التنفيذية">
            <div className={accountStyles.greetingInner}>
              <div className={accountStyles.greetingCopy}>
                <p className={accountStyles.eyebrowPill}>
                  <Crown size={13} aria-hidden="true" />
                  <span>بوابة القيادة التنفيذية · فارس بن سعود</span>
                </p>
                <h1 className={accountStyles.engravedHeading}>
                  {section === 'overview' ? (
                    <>
                      <span className={accountStyles.carvedInk}>مرحبًا، </span>
                      <span className={accountStyles.carvedGold}>{data.viewer.displayName || 'الإدارة'}</span>
                    </>
                  ) : (
                    <span className={accountStyles.carvedInk}>{activeNavMeta.label}</span>
                  )}
                </h1>
                <p className={accountStyles.intro}>{activeNavMeta.subtitle}</p>
              </div>

              <div className={accountStyles.greetingActions}>
                <button
                  type="button"
                  className={accountStyles.secondaryHeroButton}
                  onClick={() => navigateSection('verifications')}
                >
                  <FileCheck2 size={15} aria-hidden="true" />
                  <span>طابور الاعتماد ({data.badges.pendingVerifications})</span>
                </button>
                <button
                  type="button"
                  className={accountStyles.primaryButton}
                  onClick={() => navigateSection(section === 'overview' ? 'plates' : 'overview')}
                >
                  <Car size={16} aria-hidden="true" />
                  <span>{section === 'overview' ? 'إضافة لوحة جديدة' : 'النظرة التنفيذية'}</span>
                </button>
              </div>

              <EngravedFbsCrest
                filterId="fbs-admin-greeting-deboss"
                tone={theme}
                className={accountStyles.greetingWatermark}
              />
            </div>
          </section>

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
        <div
          className={styles.modalBackdrop}
          role="dialog"
          aria-modal="true"
          aria-label="التحقق بخطوتين للإدارة"
          onClick={() => setMfaModalOpen(false)}
        >
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalIconWrap}>
                <KeyRound size={19} />
              </div>
              <div className={styles.modalTitleGroup}>
                <h3 className={styles.modalTitle}>التحقق بخطوتين وتوثيق الحساب (2FA)</h3>
                <p className={styles.modalSubtitle}>
                  حماية حساب الإدارة ومراجعة الهويات الوطنية والعمليات الحساسة.
                </p>
              </div>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => setMfaModalOpen(false)}
                aria-label="إغلاق"
              >
                <X size={16} />
              </button>
            </div>

            {mfaVerifiedLocal ? (
              <div className={styles.modalBody}>
                <div className="rounded-2xl border border-emerald-500/35 bg-emerald-500/10 p-4 text-center space-y-2">
                  <CheckCircle2 size={32} className="mx-auto text-emerald-500" />
                  <p className="text-sm font-black m-0">جلسة التحقق بخطوتين (2FA) مفعّلة وموثقة حالياً</p>
                  <p className="text-xs opacity-75 m-0">
                    جميع أقسام توثيق الهويات الوطنية وأوامر التعديل والحذف الإدارية مفعّلة لحسابك.
                  </p>
                </div>

                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.btnPrimary}
                    onClick={() => setMfaModalOpen(false)}
                  >
                    إغلاق ومتابعة العمل
                  </button>
                  <button
                    type="button"
                    disabled={totpBusy}
                    className={styles.btnSecondary}
                    onClick={async () => {
                      setTotpBusy(true);
                      try {
                        await sendJson('/api/v1/security/disable', {});
                        setMfaVerifiedLocal(false);
                        notify('تم إيقاف التحقق بخطوتين وإعادة تعيين الإعدادات.');
                        refreshData();
                      } catch {
                        notify('تعذر إعادة تعيين التحقق بخطوتين.', 'error');
                      } finally {
                        setTotpBusy(false);
                      }
                    }}
                  >
                    إعادة ضبط أو إيقاف 2FA
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.modalBody}>
                <p className="text-xs opacity-80 leading-relaxed m-0">
                  يمكنك تفعيل التحقق بخطوتين (2FA) لحسابك الإداري مباشرة بضغطة واحدة لفتح قسم توثيق الهويات وجميع الصلاحيات، أو ربطه بتطبيق المصادقة (Google Authenticator):
                </p>

                <MfaSetup
                  compact
                  onVerified={() => {
                    setMfaVerifiedLocal(true);
                    setMfaModalOpen(false);
                    notify('تم تفعيل التحقق بخطوتين (2FA) وتوثيق الحساب بنجاح.');
                    refreshData();
                  }}
                />

                {data.viewer.mfaFactorId && (
                  <form onSubmit={verifyExistingMfaFactor} className="space-y-3 pt-2 border-t border-[var(--adm-border-subtle)]">
                    <div className={styles.field}>
                      <label className={styles.fieldLabel} htmlFor="admin-totp-code">
                        أو أدخل الرمز من تطبيق المصادقة المرتبط مسبقاً (6 أرقام)
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
                        className={`${styles.input} text-lg font-mono tracking-widest`}
                      />
                    </div>
                    {totpErr && <p className="text-xs text-rose-500 font-bold m-0">{totpErr}</p>}
                    <button type="submit" disabled={totpBusy} className={`${styles.btnSecondary} w-full`}>
                      {totpBusy ? 'جارٍ التحقق…' : 'تأكيد رمز التطبيق'}
                    </button>
                  </form>
                )}
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
