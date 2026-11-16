'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useTransition, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Activity,
  AlertCircle,
  ArrowLeft,
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
import {
  AUCTION_STATUS_LABELS,
  EngravedFbsCrest,
  KYC_LABELS,
  LISTING_LABELS,
  MESSAGE_STATUS_LABELS,
  ROLE_LABELS,
  VERIFICATION_LABELS,
  matchesAdminSearch,
} from './helpers';
import { OverviewSection } from './sections/overview-section';
import { VerificationsSection } from './sections/verifications-section';
import { PlatesSection } from './sections/plates-section';
import { AuctionsSection } from './sections/auctions-section';
import { PagesCmsSection } from './sections/pages-cms-section';
import { SettingsSection } from './sections/settings-section';
import { ProfileSection } from './sections/profile-section';
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
        key: 'profile',
        label: 'الملف الإداري والحساب',
        subtitle: 'تعديل البيانات الشخصية، مفاتيح الأمان، والأدوار الإدارية.',
        icon: UserCheck,
      },
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

  // Inline Real-Time Omni-Search State
  const omniRootRef = useRef<HTMLDivElement | null>(null);
  const omniInputRef = useRef<HTMLInputElement | null>(null);
  const [omniOpen, setOmniOpen] = useState(false);
  const [omniQuery, setOmniQuery] = useState('');
  const [omniActiveIndex, setOmniActiveIndex] = useState(0);
  const [sectionSearch, setSectionSearch] = useState<{
    key: AdminSectionKey;
    query: string;
    nonce: number;
  } | null>(null);

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
        omniInputRef.current?.focus();
        setOmniOpen(true);
      } else if (e.key === 'Escape') {
        setOmniOpen(false);
        setMobileOpen(false);
      }
    };
    const onPointerDown = (e: MouseEvent) => {
      if (omniRootRef.current && !omniRootRef.current.contains(e.target as Node)) {
        setOmniOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('mousedown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('mousedown', onPointerDown);
    };
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
    (next: AdminSectionKey, opts?: { createAuctionForPlateId?: string; searchQuery?: string }) => {
      setSection(next);
      setMobileOpen(false);
      if (opts?.createAuctionForPlateId) {
        setPreselectedPlateId(opts.createAuctionForPlateId);
      }
      if (typeof opts?.searchQuery === 'string') {
        setSectionSearch({ key: next, query: opts.searchQuery, nonce: Date.now() });
      } else {
        setSectionSearch(null);
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
    const q = omniQuery.trim();
    const matchedNav = ALL_NAV_ITEMS.filter(
      (n) => !q || matchesAdminSearch(q, n.label, n.subtitle, n.key),
    ).slice(0, q ? 5 : 6);

    if (!q) {
      return {
        matchedUsers: [] as typeof data.users,
        matchedPlates: [] as typeof data.plates,
        matchedAuctions: [] as typeof data.auctions,
        matchedMessages: [] as typeof data.messages,
        matchedIdentities: [] as typeof data.identities,
        matchedRecords: [] as Array<{
          id: string;
          title: string;
          subtitle: string;
          badge: string;
          targetSection: AdminSectionKey;
          filterText?: string;
        }>,
        matchedNav,
      };
    }

    const matchedUsers = data.users
      .filter((u) => {
        const kycLabel = KYC_LABELS[u.kyc_status]?.label ?? u.kyc_status;
        return matchesAdminSearch(
          q,
          u.display_name,
          u.phone,
          u.id,
          kycLabel,
          u.status === 'ACTIVE' ? 'نشط' : 'موقوف مؤقتا',
          u.mfa_enabled ? '2fa مفعل' : '',
          u.roles.map((r) => ROLE_LABELS[r] || r).join(' '),
          u.roles.join(' '),
        );
      })
      .slice(0, 5);

    const matchedPlates = data.plates
      .filter((p) =>
        matchesAdminSearch(
          q,
          p.digits,
          p.letters_ar.join(' '),
          p.letters_ar.join(''),
          `${p.letters_ar.join('')}${p.digits}`,
          p.letters_en.join(' '),
          p.letters_en.join(''),
          `${p.letters_en.join('')}${p.digits}`,
          p.owner_name,
          p.owner_phone,
          p.type_name,
          p.city_name,
          p.slug,
          LISTING_LABELS[p.listing_status]?.label ?? p.listing_status,
          VERIFICATION_LABELS[p.verification_status]?.label ?? p.verification_status,
        ),
      )
      .slice(0, 5);

    const matchedAuctions = data.auctions
      .filter((a) =>
        matchesAdminSearch(
          q,
          a.digits,
          a.letters_ar.join(' '),
          a.letters_ar.join(''),
          `${a.letters_ar.join('')}${a.digits}`,
          a.letters_en.join(' '),
          a.letters_en.join(''),
          `${a.letters_en.join('')}${a.digits}`,
          a.plate_type,
          a.city_name,
          a.status,
          AUCTION_STATUS_LABELS[a.status]?.label,
          a.slug,
        ),
      )
      .slice(0, 4);

    const matchedMessages = data.messages
      .filter((m) =>
        matchesAdminSearch(
          q,
          m.name,
          m.email,
          m.subject,
          m.message,
          MESSAGE_STATUS_LABELS[m.status]?.label ?? m.status,
        ),
      )
      .slice(0, 3);

    const matchedIdentities = data.identities
      .filter((idReq) =>
        matchesAdminSearch(
          q,
          idReq.full_name,
          idReq.national_id,
          idReq.phone,
          idReq.email,
          idReq.city,
          KYC_LABELS[idReq.status]?.label ?? idReq.status,
        ),
      )
      .slice(0, 3);

    const matchedRecords: Array<{
      id: string;
      title: string;
      subtitle: string;
      badge: string;
      targetSection: AdminSectionKey;
      filterText?: string;
    }> = [];

    for (const reg of data.registrations) {
      if (matchedRecords.length >= 4) break;
      if (matchesAdminSearch(q, reg.plate_label, reg.user_name, reg.user_phone, reg.bidder_alias, reg.status)) {
        matchedRecords.push({
          id: `reg-${reg.id}`,
          title: `${reg.user_name} — ${reg.plate_label}`,
          subtitle: `تسجيل مزاد • ${reg.bidder_alias}`,
          badge: 'تأهيل المسجلين',
          targetSection: 'registrations',
        });
      }
    }

    for (const st of data.settlements) {
      if (matchedRecords.length >= 4) break;
      if (matchesAdminSearch(q, st.plate_label, st.seller_name, st.winner_name, st.status)) {
        matchedRecords.push({
          id: `settle-${st.id}`,
          title: `تسوية ${st.plate_label}`,
          subtitle: `البائع: ${st.seller_name} • المشتري: ${st.winner_name}`,
          badge: 'التسويات والضمان',
          targetSection: 'settlements',
        });
      }
    }

    for (const pg of data.cmsPages) {
      if (matchedRecords.length >= 4) break;
      if (matchesAdminSearch(q, pg.title_ar, pg.slug, pg.body_ar)) {
        matchedRecords.push({
          id: `cms-${pg.slug}`,
          title: pg.title_ar,
          subtitle: `صفحة موقع (${pg.slug})`,
          badge: 'الصفحات والمدن',
          targetSection: 'cms',
        });
      }
    }

    for (const faq of data.faqs) {
      if (matchedRecords.length >= 4) break;
      if (matchesAdminSearch(q, faq.question_ar, faq.answer_ar, faq.question_en)) {
        matchedRecords.push({
          id: `faq-${faq.id}`,
          title: faq.question_ar,
          subtitle: faq.answer_ar.slice(0, 75),
          badge: 'الأسئلة الشائعة',
          targetSection: 'cms',
        });
      }
    }

    for (const log of data.auditLogs) {
      if (matchedRecords.length >= 5) break;
      if (matchesAdminSearch(q, log.actor_name, log.action, log.entity_type, log.reason)) {
        matchedRecords.push({
          id: `audit-${log.id}`,
          title: `${log.actor_name} — ${log.action}`,
          subtitle: log.reason || log.entity_type,
          badge: 'سجل التدقيق',
          targetSection: 'audit',
          filterText: q,
        });
      }
    }

    return {
      matchedUsers,
      matchedPlates,
      matchedAuctions,
      matchedMessages,
      matchedIdentities,
      matchedRecords,
      matchedNav,
    };
  }, [
    omniQuery,
    data.users,
    data.plates,
    data.auctions,
    data.messages,
    data.identities,
    data.registrations,
    data.settlements,
    data.cmsPages,
    data.faqs,
    data.auditLogs,
  ]);

  const flatOmniActions = useMemo(() => {
    const actions: Array<{ key: string; run: () => void }> = [];

    for (const u of omniResults.matchedUsers) {
      actions.push({
        key: `user-${u.id}`,
        run: () => {
          setOmniOpen(false);
          navigateSection('users', { searchQuery: u.display_name || u.id.slice(0, 8) });
        },
      });
    }

    for (const p of omniResults.matchedPlates) {
      const needsVerify = ['SUBMITTED', 'DOCUMENTS_PENDING', 'UNDER_REVIEW', 'CHANGES_REQUIRED'].includes(
        p.verification_status,
      );
      actions.push({
        key: `plate-${p.id}`,
        run: () => {
          setOmniOpen(false);
          navigateSection(needsVerify ? 'verifications' : 'plates', {
            searchQuery: `${p.letters_ar.join('')} ${p.digits}`.trim(),
          });
        },
      });
    }

    for (const a of omniResults.matchedAuctions) {
      const isLive = ['LIVE', 'ENDING', 'PAUSED'].includes(a.status);
      actions.push({
        key: `auction-${a.id}`,
        run: () => {
          setOmniOpen(false);
          navigateSection(isLive ? 'live' : 'auctions', {
            searchQuery: `${a.letters_ar.join('')} ${a.digits}`.trim(),
          });
        },
      });
    }

    for (const m of omniResults.matchedMessages) {
      actions.push({
        key: `msg-${m.id}`,
        run: () => {
          setOmniOpen(false);
          navigateSection('messages');
        },
      });
    }

    for (const idReq of omniResults.matchedIdentities) {
      actions.push({
        key: `id-${idReq.id}`,
        run: () => {
          setOmniOpen(false);
          navigateSection('identities');
        },
      });
    }

    for (const rec of omniResults.matchedRecords) {
      actions.push({
        key: rec.id,
        run: () => {
          setOmniOpen(false);
          navigateSection(rec.targetSection, rec.filterText ? { searchQuery: rec.filterText } : undefined);
        },
      });
    }

    for (const navItem of omniResults.matchedNav) {
      actions.push({
        key: `nav-${navItem.key}`,
        run: () => {
          setOmniOpen(false);
          navigateSection(navItem.key);
        },
      });
    }

    return actions;
  }, [omniResults, navigateSection]);

  function onOmniInputKeyDown(e: ReactKeyboardEvent<HTMLInputElement>) {
    if (!omniOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setOmniOpen(true);
      return;
    }
    if (!flatOmniActions.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOmniActiveIndex((prev) => (prev + 1) % flatOmniActions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setOmniActiveIndex((prev) => (prev - 1 + flatOmniActions.length) % flatOmniActions.length);
    }
  }

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
              <button
                type="button"
                onClick={() => navigateSection('profile')}
                aria-current={section === 'profile' ? 'page' : undefined}
                aria-label="الملف الإداري"
                title="الملف الإداري وتعديل البيانات"
              >
                <UserCheck size={16} aria-hidden="true" />
                <span>حسابي</span>
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
                onClick={() => {
                  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                    setMobileOpen((m) => !m);
                  } else {
                    setCollapsed((c) => !c);
                  }
                }}
                title={mobileOpen ? 'إغلاق القائمة الجانبية' : collapsed ? 'توسيع القائمة الجانبية' : 'طي القائمة الجانبية'}
                aria-label={mobileOpen ? 'إغلاق القائمة الجانبية' : collapsed ? 'توسيع القائمة الجانبية' : 'طي القائمة الجانبية'}
              >
                {/* Desktop Collapse Icon: Visible only on desktop */}
                <span className="hidden lg:inline-flex items-center justify-center">
                  {collapsed ? (
                    <PanelRightOpen size={18} strokeWidth={2.1} aria-hidden="true" />
                  ) : (
                    <PanelRightClose size={18} strokeWidth={2.1} aria-hidden="true" />
                  )}
                </span>
                {/* Mobile Menu Icon: Visible only on mobile/tablet */}
                <span className="inline-flex lg:hidden items-center justify-center">
                  {mobileOpen ? (
                    <X size={20} strokeWidth={2.2} aria-hidden="true" />
                  ) : (
                    <Menu size={20} strokeWidth={2.2} aria-hidden="true" />
                  )}
                </span>
              </button>

              <Link
                href="/"
                className={accountStyles.raisedIconBtn}
                title="العودة للرئيسية"
                aria-label="الرئيسية"
              >
                <Home size={17} strokeWidth={2.1} aria-hidden="true" />
              </Link>
            </div>

            {/* Real-Time Inline Header Search Bar — Matches AccountDashboard GlobalOmniSearch */}
            <div ref={omniRootRef} className={accountStyles.omniSearchRoot}>
              <form
                className={accountStyles.omniSearchForm}
                role="search"
                aria-label="البحث الشامل في الإدارة"
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = omniQuery.trim();
                  if (omniOpen && flatOmniActions[omniActiveIndex]) {
                    flatOmniActions[omniActiveIndex].run();
                    return;
                  }
                  if (flatOmniActions[0]) {
                    flatOmniActions[0].run();
                    return;
                  }
                  if (q) {
                    setOmniOpen(false);
                    navigateSection(section, { searchQuery: q });
                  } else {
                    setOmniOpen(true);
                  }
                }}
              >
                <span className={accountStyles.omniSearchIcon} aria-hidden="true">
                  <Search size={17} strokeWidth={2.2} />
                </span>
                <input
                  ref={omniInputRef}
                  type="search"
                  value={omniQuery}
                  onFocus={() => setOmniOpen(true)}
                  onChange={(e) => {
                    setOmniQuery(e.target.value);
                    setOmniActiveIndex(0);
                    setOmniOpen(true);
                  }}
                  onKeyDown={onOmniInputKeyDown}
                  placeholder="ابحث بالنص: عضو، رقم لوحة، مزاد، رسالة، أو قسم إدارة..."
                  aria-label="ابحث في الإدارة"
                  autoComplete="off"
                  className={accountStyles.omniSearchInput}
                />
                {omniQuery ? (
                  <button
                    type="button"
                    className={accountStyles.omniClearBtn}
                    aria-label="مسح البحث"
                    onClick={() => {
                      setOmniQuery('');
                      setOmniActiveIndex(0);
                      setSectionSearch(null);
                      omniInputRef.current?.focus();
                    }}
                  >
                    <X size={13} />
                  </button>
                ) : (
                  <kbd className={accountStyles.omniShortcut} aria-hidden="true" dir="ltr">
                    Ctrl K
                  </kbd>
                )}
                <button type="submit" className={accountStyles.omniSubmitBtn}>
                  <span>بحث</span>
                </button>
              </form>

              {omniOpen && (
                <div
                  id="fbs-admin-omni-search-results"
                  role="region"
                  aria-label="نتائج البحث الفوري في الإدارة"
                  className={accountStyles.omniDropdown}
                >
                  {(() => {
                    const userOffset = 0;
                    const plateOffset = userOffset + omniResults.matchedUsers.length;
                    const auctionOffset = plateOffset + omniResults.matchedPlates.length;
                    const msgOffset = auctionOffset + omniResults.matchedAuctions.length;
                    const idOffset = msgOffset + omniResults.matchedMessages.length;
                    const recordOffset = idOffset + omniResults.matchedIdentities.length;
                    const navOffset = recordOffset + omniResults.matchedRecords.length;
                    const hasAnyResults = flatOmniActions.length > 0;

                    if (!hasAnyResults) {
                      return (
                        <div className="p-4 text-center text-xs text-[var(--muted)]">
                          لا توجد نتائج مطابقة لـ «<strong className="text-[var(--ink-strong)]">{omniQuery}</strong>» في السجلات أو الأقسام.
                        </div>
                      );
                    }

                    return (
                      <>
                        {omniResults.matchedUsers.length > 0 && (
                          <div className={accountStyles.omniGroup}>
                            <div className={accountStyles.omniGroupHeader}>
                              <span>الأعضاء والصلاحيات المطابقون</span>
                              <small>{omniResults.matchedUsers.length}</small>
                            </div>
                            <div className={accountStyles.omniList}>
                              {omniResults.matchedUsers.map((u, i) => {
                                const idx = userOffset + i;
                                const roleSummary =
                                  u.roles
                                    .filter((r) => r !== 'user')
                                    .map((r) => ROLE_LABELS[r] || r)
                                    .join(' · ') || 'عضو عام';
                                const kycText = KYC_LABELS[u.kyc_status]?.label ?? u.kyc_status;
                                return (
                                  <button
                                    key={u.id}
                                    type="button"
                                    onMouseEnter={() => setOmniActiveIndex(idx)}
                                    onClick={() => flatOmniActions[idx]?.run()}
                                    className={`w-full bg-transparent text-start cursor-pointer ${accountStyles.omniItem} ${
                                      omniActiveIndex === idx ? accountStyles.omniItemActive : ''
                                    }`}
                                  >
                                    <span className={accountStyles.omniItemIcon}>
                                      <Users size={15} />
                                    </span>
                                    <span className={accountStyles.omniItemBody}>
                                      <strong>{u.display_name || 'عضو مسجل'}</strong>
                                      <small>
                                        {roleSummary} · {kycText}
                                        {u.phone ? ` · ${u.phone}` : ''}
                                      </small>
                                    </span>
                                    <ArrowLeft size={14} className={accountStyles.omniArrow} />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {omniResults.matchedPlates.length > 0 && (
                          <div className={accountStyles.omniGroup}>
                            <div className={accountStyles.omniGroupHeader}>
                              <span>اللوحات والمخزون المطابقة</span>
                              <small>{omniResults.matchedPlates.length}</small>
                            </div>
                            <div className={accountStyles.omniList}>
                              {omniResults.matchedPlates.map((p, i) => {
                                const idx = plateOffset + i;
                                const statusText =
                                  LISTING_LABELS[p.listing_status]?.label ?? p.listing_status;
                                return (
                                  <button
                                    key={p.id}
                                    type="button"
                                    onMouseEnter={() => setOmniActiveIndex(idx)}
                                    onClick={() => flatOmniActions[idx]?.run()}
                                    className={`w-full bg-transparent text-start cursor-pointer ${accountStyles.omniItem} ${
                                      omniActiveIndex === idx ? accountStyles.omniItemActive : ''
                                    }`}
                                  >
                                    <span className={accountStyles.omniPlateTag} dir="ltr">
                                      <strong>{p.letters_en.join(' ')}</strong>
                                      <span>{p.digits}</span>
                                    </span>
                                    <span className={accountStyles.omniItemBody}>
                                      <strong>
                                        لوحة {p.letters_ar.join(' ')} · {p.digits}
                                      </strong>
                                      <small>
                                        {p.type_name} · {p.city_name} · {p.owner_name} · {statusText}
                                      </small>
                                    </span>
                                    <ArrowLeft size={14} className={accountStyles.omniArrow} />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {omniResults.matchedAuctions.length > 0 && (
                          <div className={accountStyles.omniGroup}>
                            <div className={accountStyles.omniGroupHeader}>
                              <span>المزادات المطابقة</span>
                              <small>{omniResults.matchedAuctions.length}</small>
                            </div>
                            <div className={accountStyles.omniList}>
                              {omniResults.matchedAuctions.map((a, i) => {
                                const idx = auctionOffset + i;
                                const stLabel = AUCTION_STATUS_LABELS[a.status]?.label ?? a.status;
                                return (
                                  <button
                                    key={a.id}
                                    type="button"
                                    onMouseEnter={() => setOmniActiveIndex(idx)}
                                    onClick={() => flatOmniActions[idx]?.run()}
                                    className={`w-full bg-transparent text-start cursor-pointer ${accountStyles.omniItem} ${
                                      omniActiveIndex === idx ? accountStyles.omniItemActive : ''
                                    }`}
                                  >
                                    <span className={accountStyles.omniPlateTag} dir="ltr">
                                      <strong>{a.letters_en.join(' ')}</strong>
                                      <span>{a.digits}</span>
                                    </span>
                                    <span className={accountStyles.omniItemBody}>
                                      <strong>
                                        مزاد {a.letters_ar.join(' ')} {a.digits}
                                      </strong>
                                      <small>
                                        {a.plate_type} · {a.city_name} · {stLabel}
                                      </small>
                                    </span>
                                    <ArrowLeft size={14} className={accountStyles.omniArrow} />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {omniResults.matchedMessages.length > 0 && (
                          <div className={accountStyles.omniGroup}>
                            <div className={accountStyles.omniGroupHeader}>
                              <span>رسائل التواصل</span>
                              <small>{omniResults.matchedMessages.length}</small>
                            </div>
                            <div className={accountStyles.omniList}>
                              {omniResults.matchedMessages.map((m, i) => {
                                const idx = msgOffset + i;
                                return (
                                  <button
                                    key={m.id}
                                    type="button"
                                    onMouseEnter={() => setOmniActiveIndex(idx)}
                                    onClick={() => flatOmniActions[idx]?.run()}
                                    className={`w-full bg-transparent text-start cursor-pointer ${accountStyles.omniItem} ${
                                      omniActiveIndex === idx ? accountStyles.omniItemActive : ''
                                    }`}
                                  >
                                    <span className={accountStyles.omniItemIcon}>
                                      <Mail size={15} />
                                    </span>
                                    <span className={accountStyles.omniItemBody}>
                                      <strong>{m.subject}</strong>
                                      <small>
                                        {m.name} · {m.email}
                                      </small>
                                    </span>
                                    <ArrowLeft size={14} className={accountStyles.omniArrow} />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {omniResults.matchedIdentities.length > 0 && (
                          <div className={accountStyles.omniGroup}>
                            <div className={accountStyles.omniGroupHeader}>
                              <span>طلبات توثيق الهوية</span>
                              <small>{omniResults.matchedIdentities.length}</small>
                            </div>
                            <div className={accountStyles.omniList}>
                              {omniResults.matchedIdentities.map((idReq, i) => {
                                const idx = idOffset + i;
                                return (
                                  <button
                                    key={idReq.id}
                                    type="button"
                                    onMouseEnter={() => setOmniActiveIndex(idx)}
                                    onClick={() => flatOmniActions[idx]?.run()}
                                    className={`w-full bg-transparent text-start cursor-pointer ${accountStyles.omniItem} ${
                                      omniActiveIndex === idx ? accountStyles.omniItemActive : ''
                                    }`}
                                  >
                                    <span className={accountStyles.omniItemIcon}>
                                      <ShieldCheck size={15} />
                                    </span>
                                    <span className={accountStyles.omniItemBody}>
                                      <strong>{idReq.full_name}</strong>
                                      <small>
                                        {idReq.city} · {idReq.phone}
                                      </small>
                                    </span>
                                    <ArrowLeft size={14} className={accountStyles.omniArrow} />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {omniResults.matchedRecords.length > 0 && (
                          <div className={accountStyles.omniGroup}>
                            <div className={accountStyles.omniGroupHeader}>
                              <span>سجلات ومحتوى مطابق</span>
                              <small>{omniResults.matchedRecords.length}</small>
                            </div>
                            <div className={accountStyles.omniList}>
                              {omniResults.matchedRecords.map((rec, i) => {
                                const idx = recordOffset + i;
                                return (
                                  <button
                                    key={rec.id}
                                    type="button"
                                    onMouseEnter={() => setOmniActiveIndex(idx)}
                                    onClick={() => flatOmniActions[idx]?.run()}
                                    className={`w-full bg-transparent text-start cursor-pointer ${accountStyles.omniItem} ${
                                      omniActiveIndex === idx ? accountStyles.omniItemActive : ''
                                    }`}
                                  >
                                    <span className={accountStyles.omniItemIcon}>
                                      <FileText size={15} />
                                    </span>
                                    <span className={accountStyles.omniItemBody}>
                                      <strong>{rec.title}</strong>
                                      <small>
                                        {rec.badge} · {rec.subtitle}
                                      </small>
                                    </span>
                                    <ArrowLeft size={14} className={accountStyles.omniArrow} />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {omniResults.matchedNav.length > 0 && (
                          <div className={accountStyles.omniGroup}>
                            <div className={accountStyles.omniGroupHeader}>
                              <span>{omniQuery.trim() ? 'أقسام لوحة التحكم' : 'وصول سريع لأقسام الإدارة'}</span>
                            </div>
                            <div className={accountStyles.omniList}>
                              {omniResults.matchedNav.map((item, i) => {
                                const idx = navOffset + i;
                                const Icon = item.icon;
                                return (
                                  <button
                                    key={item.key}
                                    type="button"
                                    onMouseEnter={() => setOmniActiveIndex(idx)}
                                    onClick={() => flatOmniActions[idx]?.run()}
                                    className={`w-full bg-transparent text-start cursor-pointer ${accountStyles.omniItem} ${
                                      omniActiveIndex === idx ? accountStyles.omniItemActive : ''
                                    }`}
                                  >
                                    <span className={accountStyles.omniItemIcon}>
                                      <Icon size={15} />
                                    </span>
                                    <span className={accountStyles.omniItemBody}>
                                      <strong>{item.label}</strong>
                                      <small>{item.subtitle}</small>
                                    </span>
                                    <ArrowLeft size={14} className={accountStyles.omniArrow} />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
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

              {/* Admin Avatar Pill - Clickable to open Admin Profile */}
              <button
                type="button"
                onClick={() => navigateSection('profile')}
                className={accountStyles.userPill}
                title="الملف الإداري وتعديل الحساب"
                aria-label="الملف الإداري"
              >
                <span className={accountStyles.avatar}>{data.viewer.displayName.charAt(0) || 'أ'}</span>
                <span className={accountStyles.userName}>{data.viewer.displayName || 'الإدارة'}</span>
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
              key={`verifications-${sectionSearch?.key === 'verifications' ? sectionSearch.nonce : 0}`}
              data={data}
              initialQuery={sectionSearch?.key === 'verifications' ? sectionSearch.query : undefined}
              onNavigate={navigateSection}
              onNotify={notify}
              onRequireMfa={() => setMfaModalOpen(true)}
              onRefresh={refreshData}
            />
          )}

          {section === 'plates' && (
            <PlatesSection
              key={`plates-${sectionSearch?.key === 'plates' ? sectionSearch.nonce : 0}`}
              data={data}
              initialQuery={sectionSearch?.key === 'plates' ? sectionSearch.query : undefined}
              onNavigate={navigateSection}
              onNotify={notify}
              onRequireMfa={() => setMfaModalOpen(true)}
              onRefresh={refreshData}
            />
          )}

          {(section === 'auctions' || section === 'live') && (
            <AuctionsSection
              key={`${section}-${sectionSearch?.key === section ? sectionSearch.nonce : 0}`}
              data={data}
              liveOnly={section === 'live'}
              initialQuery={sectionSearch?.key === section ? sectionSearch.query : undefined}
              preselectedPlateId={preselectedPlateId}
              onClearPreselectedPlate={() => setPreselectedPlateId(null)}
              onNotify={notify}
              onRequireMfa={() => setMfaModalOpen(true)}
              onRefresh={refreshData}
            />
          )}

          {section === 'profile' && (
            <ProfileSection
              data={data}
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
              key={`${section}-${sectionSearch?.key === section ? sectionSearch.nonce : 0}`}
              section={section}
              data={{
                ...data,
                viewer: { ...data.viewer, mfaVerified: mfaVerifiedLocal },
              }}
              initialQuery={sectionSearch?.key === section ? sectionSearch.query : undefined}
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
              key={`${section}-${sectionSearch?.key === section ? sectionSearch.nonce : 0}`}
              section={section}
              data={data}
              initialQuery={sectionSearch?.key === section ? sectionSearch.query : undefined}
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
