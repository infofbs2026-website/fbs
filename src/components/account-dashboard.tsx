'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ArrowUpLeft, Bell, Bookmark, Car, Clock, Compass,
  CreditCard, Crown, FileQuestion, Gavel, Globe, Headphones, Home, KeyRound, Layers,
  LayoutDashboard, LockKeyhole, LogOut, Mail, Moon, PanelRightClose, PanelRightOpen,
  Plus, Search, ShieldCheck, ShoppingBag, Smartphone, Sun, UserRound, Wallet, X
} from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { MfaSetup } from '@/components/mfa';
import { IdentityVerification } from '@/components/identity-verification';
import { FbsStageWatermark, PlateCard, PlateVisualizer } from '@/components/ui';
import { SarSymbol, formatEnglishAmount } from '@/components/sar-symbol';
import { matchesPlateSearch, parsePlateSearch } from '@/modules/marketplace/plate-search';
import type { MarketplacePlate } from '@/modules/marketplace/types';
import styles from './account-dashboard.module.css';

export interface UserViewer {
  id: string;
  email: string;
  displayName?: string;
  role?: string;
}

type DataState = 'ready' | 'unavailable';
type AccountCounts = { auctions: number | null; plates: number | null; favorites: number | null };

export interface AccountDashboardProps {
  user: UserViewer;
  activeSectionKey: string;
  rowsData: Record<string, unknown>[];
  columns?: string[];
  initialTheme?: 'light' | 'dark';
  dataState: DataState;
  featuredPlates: MarketplacePlate[];
  marketplaceSource?: 'database' | 'demo';
  counts: AccountCounts;
  profilePhone: string | null;
  profileEditable: boolean;
}

const marketplaceNavLinks = [
  { key: 'overview', href: '/account', label: 'نظرة عامة', icon: LayoutDashboard, countKey: null },
  { key: 'auctions', href: '/account/auctions', label: 'مزاداتي', icon: Gavel, countKey: 'auctions' as const },
  { key: 'bids', href: '/account/bids', label: 'مزايداتي', icon: Clock, countKey: null },
  { key: 'plates', href: '/account/plates', label: 'لوحاتي', icon: Car, countKey: 'plates' as const },
  { key: 'favorites', href: '/account/favorites', label: 'المفضلة', icon: Bookmark, countKey: 'favorites' as const }
] as const;

const financeSecurityNavLinks = [
  { key: 'deposits', href: '/account/deposits', label: 'التأمين والضمان', icon: Wallet },
  { key: 'payments', href: '/account/payments', label: 'المدفوعات', icon: CreditCard },
  { key: 'security', href: '/account/security', label: 'الأمان', icon: ShieldCheck }
] as const;

const sectionDetails: Record<string, { title: string; splitTitle?: [string, string]; description: string; action?: { label: string; href: string } }> = {
  overview: { title: 'نظرة عامة', splitTitle: ['نظرة', 'عامة'], description: 'إدارة متكاملة للوحاتك ومشاركاتك في المزادات المباشرة من مكان واحد.' },
  auctions: { title: 'مزاداتي', splitTitle: ['سجل', 'مزاداتي'], description: 'المزادات التي سجّلت للمشاركة فيها.', action: { label: 'تصفح المزادات', href: '/auctions' } },
  bids: { title: 'مزايداتي', splitTitle: ['سجل', 'مزايداتي'], description: 'سجل المزايدات المرتبطة بحسابك.', action: { label: 'تصفح المزادات', href: '/auctions' } },
  plates: { title: 'لوحاتي', splitTitle: ['محفظة', 'لوحاتي'], description: 'تابع اللوحات المسجلة في حسابك.', action: { label: 'اعرض لوحتك', href: '/sell-your-plate' } },
  favorites: { title: 'المفضلة', splitTitle: ['اللوحات', 'المفضلة'], description: 'اللوحات التي حفظتها في حسابك.', action: { label: 'مفضلة المتجر', href: '/plates?drawer=wishlist' } },
  deposits: { title: 'التأمين والضمان', splitTitle: ['التأمين', 'والضمان'], description: 'تفاصيل التأمينات المرتبطة بمشاركاتك.', action: { label: 'المدفوعات', href: '/account/payments' } },
  payments: { title: 'المدفوعات', splitTitle: ['سجل', 'المدفوعات'], description: 'سجل المدفوعات والتأمينات في حسابك.', action: { label: 'التأمين والضمان', href: '/account/deposits' } },
  notifications: { title: 'الإشعارات', splitTitle: ['مركز', 'الإشعارات'], description: 'آخر تحديثات حسابك ومشاركاتك.' },
  profile: { title: 'الملف الشخصي', splitTitle: ['الملف', 'الشخصي'], description: 'بيانات حسابك وطرق التواصل المعتمدة.' },
  security: { title: 'الأمان', splitTitle: ['إعدادات', 'الأمان'], description: 'إعدادات حماية حسابك والتحقق بخطوتين.' }
};

interface SearchDestination {
  id: string;
  category: 'account' | 'site';
  title: string;
  subtitle: string;
  href: string;
  keywords: string;
  icon: typeof Home;
}

const siteSearchDirectory: SearchDestination[] = [
  // Account Dashboard Sections
  { id: 'acc-overview', category: 'account', title: 'نظرة عامة على الحساب', subtitle: 'ملخص اللوحات والمشاركات والمزادات', href: '/account', keywords: 'حسابي نظرة عامة رئيسية ملخص dashboard overview', icon: LayoutDashboard },
  { id: 'acc-auctions', category: 'account', title: 'مزاداتي المسجلة', subtitle: 'إدارة ومتابعة المزادات المشترك بها', href: '/account/auctions', keywords: 'مزاداتي اشتراكاتي تسجيل مزاد auctions', icon: Gavel },
  { id: 'acc-bids', category: 'account', title: 'سجل مزايداتي', subtitle: 'جميع عروض المزايدة السابقة والحالية', href: '/account/bids', keywords: 'مزايداتي عروض سومات مزايدة bids history', icon: Clock },
  { id: 'acc-plates', category: 'account', title: 'لوحاتي المسجلة', subtitle: 'اللوحات المملوكة والمعروضة عبر حسابك', href: '/account/plates', keywords: 'لوحاتي لوحة مركباتي ملكية plates my', icon: Car },
  { id: 'acc-favorites', category: 'account', title: 'اللوحات المفضلة', subtitle: 'قائمة اللوحات المحفوظة للمتابعة السريعة', href: '/account/favorites', keywords: 'المفضلة محفوظات اعجاب wishlist favorites saved', icon: Bookmark },
  { id: 'acc-deposits', category: 'account', title: 'التأمين والضمان البنكي', subtitle: 'مبالغ الضمان المحجوزة لدخول المزادات', href: '/account/deposits', keywords: 'التأمين الضمان عربون محفظة حجز escrow deposit wallet', icon: Wallet },
  { id: 'acc-payments', category: 'account', title: 'سجل المدفوعات والعمليات', subtitle: 'الفواتير والتحويلات المالية المعتمدة', href: '/account/payments', keywords: 'المدفوعات فواتير دفع تحويل سداد ريال payments transactions', icon: CreditCard },
  { id: 'acc-notifications', category: 'account', title: 'الإشعارات والتنبيهات', subtitle: 'تنبيهات المزايدات وتحديثات الحساب', href: '/account/notifications', keywords: 'اشعارات تنبيهات رسائل جرس notifications alerts', icon: Bell },
  { id: 'acc-profile', category: 'account', title: 'الملف الشخصي وإثبات الهوية', subtitle: 'تحديث الاسم ورقم الجوال وتوثيق الهوية', href: '/account/profile', keywords: 'الملف الشخصي اسم جوال بريد ايميل هوية توثيق ابشر profile identity kyc', icon: UserRound },
  { id: 'acc-security', category: 'account', title: 'الأمان والتحقق بخطوتين', subtitle: 'كلمة المرور وتطبيق المصادقة الثنائية', href: '/account/security', keywords: 'الامان كلمة المرور باسورد تحقق خطوتين مصادقة حماية security password mfa 2fa', icon: ShieldCheck },

  // Public Website Pages & Services
  { id: 'site-home', category: 'site', title: 'الصفحة الرئيسية — فارس بن سعود', subtitle: 'الواجهة الرئيسية للمنصة وأبرز المزادات', href: '/', keywords: 'الرئيسية البداية موقع فارس بن سعود home fbs', icon: Home },
  { id: 'site-live-auctions', category: 'site', title: 'المزادات المباشرة الآن', subtitle: 'شارك في المزايدة الفورية على اللوحات النشطة', href: '/auctions/live', keywords: 'مزادات مباشرة الان حية نشطة live auctions', icon: Gavel },
  { id: 'site-all-auctions', category: 'site', title: 'جميع المزادات (القادمة والمنتهية)', subtitle: 'استعراض شامل لكافة مزادات المنصة', href: '/auctions', keywords: 'كل جميع المزادات قادمة منتهية سجل المزادات all upcoming completed auctions', icon: Layers },
  { id: 'site-store', category: 'site', title: 'متجر اللوحات للبيع المباشر', subtitle: 'شراء فوري للوحات المميزة بسعر محدد', href: '/plates', keywords: 'المتجر بيع مباشر شراء فوري سوق اللوحات store shop plates', icon: ShoppingBag },
  { id: 'site-search', category: 'site', title: 'البحث المتقدم عن لوحة', subtitle: 'فلترة بالأحرف والأرقام والمدينة والفئة والسعر', href: '/plates/search', keywords: 'بحث متقدم فلتر احرف ارقام خصوصي نقل صغيرة search filter', icon: Search },
  { id: 'site-sell', category: 'site', title: 'اعرض لوحتك للبيع أو المزاد', subtitle: 'ارفع بيانات لوحتك لعرضها أمام نخبة المشترين', href: '/sell-your-plate', keywords: 'اعرض لوحتك بيع لوحة اضافة عرض تسويق sell list plate', icon: Plus },
  { id: 'site-how', category: 'site', title: 'كيف تعمل المنصة وآلية الضمان', subtitle: 'خطوات التسجيل والمزايدة ونقل الملكية الرسمي', href: '/how-it-works', keywords: 'كيف تعمل المنصة شرح خطوات طريقة نقل ملكية ضمان how it works', icon: Compass },
  { id: 'site-about', category: 'site', title: 'عن فارس بن سعود (FBS)', subtitle: 'رؤية المنصة ومعايير الموثوقية والاعتماد', href: '/about', keywords: 'عن المنصة من نحن فارس بن سعود الشركة about fbs', icon: Globe },
  { id: 'site-faq', category: 'site', title: 'الأسئلة الشائعة ومركز المساعدة', subtitle: 'إجابات وافية حول المزايدة والتأمين والدعم', href: '/faq', keywords: 'الاسئلة الشائعة مساعدة دعم فني تواصل استفسار faq help support', icon: FileQuestion }
];

function normalizeQueryText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .trim();
}

/**
 * Deeply Engraved / Debossed FBS Architectural Crest Watermark.
 * Uses directional inner top shadow + crisp bottom specular catchlight
 * to look physically chiseled into creamy alabaster or midnight obsidian.
 */
function EngravedFbsCrest({
  filterId,
  tone,
  className = ''
}: {
  filterId: string;
  tone: 'light' | 'dark';
  className?: string;
}) {
  const isLight = tone === 'light';
  return (
    <div aria-hidden="true" className={`${styles.engravedWatermarkWrap} ${className}`}>
      <svg
        viewBox="4 -18 252 168"
        className={styles.engravedWatermarkSvg}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={filterId} x="-14%" y="-14%" width="128%" height="132%" colorInterpolationFilters="sRGB">
            {/* 1. Recessed Groove Base Floor (Light: Soft Sculpted Travertine / Dark: Gentle Luminous Slate) */}
            <feFlood
              floodColor={isLight ? '#C5B9A8' : '#1C3656'}
              floodOpacity={isLight ? '0.68' : '0.72'}
              result="grooveBaseColor"
            />
            <feComposite in="grooveBaseColor" in2="SourceAlpha" operator="in" result="grooveBase" />

            {/* 2. All-Around Sunken Inner Wall Depth */}
            <feMorphology in="SourceAlpha" operator="erode" radius="0.9" result="erodedAlpha" />
            <feComposite in="SourceAlpha" in2="erodedAlpha" operator="out" result="innerPerimeterRaw" />
            <feGaussianBlur in="innerPerimeterRaw" stdDeviation="0.85" result="innerPerimeterBlur" />
            <feFlood
              floodColor={isLight ? '#9E8E78' : '#12243C'}
              floodOpacity={isLight ? '0.42' : '0.50'}
              result="innerWallColor"
            />
            <feComposite in="innerWallColor" in2="innerPerimeterBlur" operator="in" result="innerWallRaw" />
            <feComposite in="innerWallRaw" in2="SourceAlpha" operator="in" result="innerWallDepth" />

            {/* 3. Deep Overhead Inner Cut Shadow (Crisp Chiseled Shadow in Light / Controlled Obsidian Shadow in Dark) */}
            <feOffset in="SourceAlpha" dx="0" dy={isLight ? '2.4' : '3.4'} result="shiftedDown" />
            <feComposite in="SourceAlpha" in2="shiftedDown" operator="out" result="topInnerCutRaw" />
            <feGaussianBlur in="topInnerCutRaw" stdDeviation={isLight ? '1.2' : '1.5'} result="topInnerCutBlur" />
            <feFlood
              floodColor={isLight ? '#52432F' : '#081424'}
              floodOpacity={isLight ? '0.45' : '0.60'}
              result="cutShadowColor"
            />
            <feComposite in="cutShadowColor" in2="topInnerCutBlur" operator="in" result="cutShadow" />
            <feComposite in="cutShadow" in2="SourceAlpha" operator="in" result="innerTopShadow" />

            {/* 4. Specular Catchlight Lip (Pure Brilliant White in Light / Luminous Platinum Silver in Dark) */}
            <feOffset in="SourceAlpha" dx="0" dy="1.4" result="lipOffset" />
            <feComposite in="lipOffset" in2="SourceAlpha" operator="out" result="bottomLipRaw" />
            <feGaussianBlur in="bottomLipRaw" stdDeviation="0.4" result="bottomLipSoft" />
            <feFlood
              floodColor={isLight ? '#FFFFFF' : '#CBD5E1'}
              floodOpacity={isLight ? '0.95' : '0.80'}
              result="lipHighlightColor"
            />
            <feComposite in="lipHighlightColor" in2="bottomLipSoft" operator="in" result="bottomHighlightLip" />

            <feMerge>
              <feMergeNode in="bottomHighlightLip" />
              <feMergeNode in="grooveBase" />
              <feMergeNode in="innerWallDepth" />
              <feMergeNode in="innerTopShadow" />
            </feMerge>
          </filter>
        </defs>

        <g filter={`url(#${filterId})`}>
          <g fill="#000000" transform="translate(0, -10)">
            <path d="M 10,25.5 C 21,29 33,27.5 50,22 C 78,12.5 103,7.5 127,8.2 C 149,8.8 168,15.5 188,26.8 L 183.5,28.2 C 164,18.5 146,13.2 126.5,12.8 C 103,12.2 79,17 51,26.5 C 34,32 21,33.5 10,25.5 Z" />
            <path d="M 22,33.2 C 42,27.8 66,26.8 98,30.5 C 70,31.2 46,31.5 27,36.2 C 23,37 19.5,35.5 22,33.2 Z" />
            <path d="M 65,25.8 C 105,30.8 147,31.4 185,32 C 213,32.5 234,38 250,49.5 C 232,42.5 212,37.8 184.5,37 C 145,36 103,35 65,27.6 Z" />
            <path d="M 94,46.2 C 127,40.2 165,39.8 202,42.6 C 166,44 128,44.6 94,46.2 Z" />
            <path d="M 212,42.2 C 221,41.8 233,45.5 242,51.6 C 231,50.8 221,48.2 215,44.8 Z" />
            <path d="M 39,62.5 C 40.2,49.2 48,43 57.5,43 C 67,43 74.8,49.2 76,62.5 C 73.2,52.2 66.2,47.5 57.5,47.5 C 48.8,47.5 41.8,52.2 39,62.5 Z" />
            <path d="M 180,65 C 181.2,51.8 189,45.6 198.5,45.6 C 208,45.6 215.8,51.8 217,65 C 214.2,54.8 207.2,50.1 198.5,50.1 C 189.8,50.1 182.8,54.8 180,65 Z" />
            <path d="M 83,62.5 C 113,64.2 144,65 173,64.8 C 144,67.6 113,66.6 83,62.5 Z" />
          </g>

          <g fill="#000000" transform="translate(0, -14)">
            <path
              fillRule="evenodd"
              d="M 22,79 H 131 C 142.2,79 149.8,86 149.8,96.5 C 149.8,103.6 145.6,109.2 139,111.6 C 147.2,114.2 152.2,120.8 152.2,129.4 C 152.2,139 144.2,145.5 133,145.5 H 90 V 98.2 H 110 V 104.8 H 130 C 133.6,104.8 135.8,102.3 135.8,99.4 C 135.8,96.5 133.6,94 130,94 H 42 V 104.8 H 83 L 72,119.8 H 42 V 145.5 H 22 Z M 110,119.8 H 131.5 C 135.6,119.8 138.2,122.4 138.2,125.2 C 138.2,128.1 135.6,130.5 131.5,130.5 H 110 Z"
            />
            <path d="M 182,79 H 238 L 227,94 H 183 C 178.4,94 176,96.5 176,99.4 C 176,102.3 178.4,104.8 183,104.8 H 214 C 228.2,104.8 238.2,113.4 238.2,125.2 C 238.2,137 228.2,145.5 214,145.5 H 165.5 C 161,145.5 158,142.1 158,138 C 158,133.9 161,130.5 165.5,130.5 H 213 C 217.6,130.5 220.2,128.1 220.2,125.2 C 220.2,122.4 217.6,119.8 213,119.8 H 182 C 167.8,119.8 158,111.2 158,99.4 C 158,87.6 167.8,79 182,79 Z" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Countdown({ endsAt }: { endsAt?: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    if (!endsAt || !Number.isFinite(Date.parse(endsAt))) return;
    const end = Date.parse(endsAt);
    const initial = window.setTimeout(() => setNow(Date.now()), 0);
    const timer = window.setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= end) window.clearInterval(timer);
    }, 1000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, [endsAt]);

  const valid = Boolean(endsAt && now !== null && Number.isFinite(Date.parse(endsAt)));
  const totalSeconds =
    valid && endsAt && now !== null ? Math.max(0, Math.floor((Date.parse(endsAt) - now) / 1000)) : null;

  const units = [
    {
      key: 'days',
      label: 'يوم',
      value: totalSeconds === null ? '—' : String(Math.floor(totalSeconds / 86400)).padStart(2, '0')
    },
    {
      key: 'hours',
      label: 'ساعة',
      value: totalSeconds === null ? '—' : String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, '0')
    },
    {
      key: 'minutes',
      label: 'دقيقة',
      value: totalSeconds === null ? '—' : String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
    },
    {
      key: 'seconds',
      label: 'ثانية',
      value: totalSeconds === null ? '—' : String(totalSeconds % 60).padStart(2, '0')
    }
  ];

  return (
    <div className={styles.countdownUnits} dir="ltr">
      {units.map((unit) => (
        <div key={unit.key} className={styles.countdownUnitBox}>
          <span className={styles.countdownNum} dir="ltr">{unit.value}</span>
          <small className={styles.countdownLabel}>{unit.label}</small>
        </div>
      ))}
    </div>
  );
}

function ProfileForm({ user, phone, editable }: { user: UserViewer; phone: string | null; editable: boolean }) {
  const router = useRouter();
  const [name, setName] = useState(user.displayName ?? '');
  const [phoneValue, setPhoneValue] = useState(phone ?? '');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editable || busy) return;
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/v1/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: name.trim(), phone: phoneValue.trim() })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || 'تعذر حفظ البيانات.');
      setFailed(false);
      setMessage('تم حفظ بياناتك.');
      router.refresh();
    } catch (error) {
      setFailed(true);
      setMessage(error instanceof Error ? error.message : 'تعذر حفظ البيانات.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className={styles.profileForm} onSubmit={save}>
      <div className={styles.formGrid}>
        <label className={styles.field}>
          <span>الاسم</span>
          <input value={name} onChange={(event) => setName(event.target.value)} minLength={2} maxLength={120} required disabled={!editable || busy} />
        </label>
        <label className={styles.field}>
          <span>البريد الإلكتروني</span>
          <input value={user.email} readOnly dir="ltr" />
        </label>
        <label className={styles.field}>
          <span>رقم الجوال</span>
          <input type="tel" value={phoneValue} onChange={(event) => setPhoneValue(event.target.value)} placeholder="+966…" pattern="\+[1-9][0-9]{7,14}" dir="ltr" disabled={!editable || busy} />
        </label>
      </div>
      {!editable && <p className={styles.formHint}>تعذر تحميل بيانات الملف للتعديل حاليًا.</p>}
      <button className={styles.primaryButton} type="submit" disabled={!editable || busy}>{busy ? 'جارٍ الحفظ…' : 'حفظ التغييرات'}</button>
      {message && <p className={failed ? styles.error : styles.success} role={failed ? 'alert' : 'status'}>{message}</p>}
    </form>
  );
}

/**
 * Full-Featured Site-Wide Omni-Search Bar:
 * Searches live catalog plates (Arabic/English letters, digits, cities, types),
 * account dashboard sections, and all website pages/services with keyboard navigation.
 */
function GlobalOmniSearch({
  initialPlates
}: {
  initialPlates: MarketplacePlate[];
}) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const catalogLoadedRef = useRef(false);

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [loadingPlates, setLoadingPlates] = useState(false);
  const [catalogPlates, setCatalogPlates] = useState<MarketplacePlate[]>(initialPlates);
  const [queriedPlates, setQueriedPlates] = useState<MarketplacePlate[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Merge unique plates from initial props, preloaded catalog, and targeted API queries
  const allKnownPlates = useMemo(() => {
    const map = new Map<string, MarketplacePlate>();
    for (const p of initialPlates) map.set(p.id || p.slug, p);
    for (const p of catalogPlates) map.set(p.id || p.slug, p);
    for (const p of queriedPlates) map.set(p.id || p.slug, p);
    return Array.from(map.values());
  }, [initialPlates, catalogPlates, queriedPlates]);

  function ensureCatalogPreloaded() {
    if (catalogLoadedRef.current) return;
    catalogLoadedRef.current = true;
    setLoadingPlates(true);
    fetch('/api/v1/plates?pageSize=48')
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        const fetched = payload?.data?.plates;
        if (Array.isArray(fetched) && fetched.length > 0) {
          setCatalogPlates(fetched);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingPlates(false));
  }

  // Targeted debounced API query when user types valid plate letters/digits
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const parsed = parsePlateSearch(trimmed);
    if (!parsed.valid) return;

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      fetch(`/api/v1/plates?q=${encodeURIComponent(trimmed)}&pageSize=8`, { signal: controller.signal })
        .then((res) => (res.ok ? res.json() : null))
        .then((payload) => {
          const fetched = payload?.data?.plates;
          if (Array.isArray(fetched)) {
            setQueriedPlates(fetched);
          }
        })
        .catch(() => {});
    }, 200);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Global Ctrl+K / Cmd+K shortcut & click-outside dismissal
  useEffect(() => {
    function onWindowKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        ensureCatalogPreloaded();
        setOpen(true);
      } else if (event.key === 'Escape') {
        setOpen(false);
      }
    }
    function onPointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener('keydown', onWindowKeyDown);
    window.addEventListener('mousedown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onWindowKeyDown);
      window.removeEventListener('mousedown', onPointerDown);
    };
  }, []);

  const matchedPlates = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return allKnownPlates.slice(0, 3);

    const parsedPlate = parsePlateSearch(trimmed);
    const norm = normalizeQueryText(trimmed);
    const tokens = norm.split(/\s+/).filter(Boolean);

    return allKnownPlates
      .filter((plate) => {
        if (parsedPlate.valid && matchesPlateSearch(plate, parsedPlate)) return true;
        const searchable = normalizeQueryText(
          `${plate.lettersAr.join(' ')} ${plate.lettersAr.join('')} ${plate.lettersEn.join(' ')} ${plate.lettersEn.join('')} ${plate.numbers} ${plate.city} ${plate.type} ${plate.slug} ${plate.auction ? 'مزاد مباشر' : 'متجر بيع'}`
        );
        return tokens.every((tk) => searchable.includes(tk));
      })
      .slice(0, 5);
  }, [query, allKnownPlates]);

  const matchedAccountItems = useMemo(() => {
    const trimmed = query.trim();
    const accountItems = siteSearchDirectory.filter((item) => item.category === 'account');
    if (!trimmed) return accountItems.slice(0, 3);
    const tokens = normalizeQueryText(trimmed).split(/\s+/).filter(Boolean);
    return accountItems
      .filter((item) => {
        const hay = normalizeQueryText(`${item.title} ${item.subtitle} ${item.keywords}`);
        return tokens.every((tk) => hay.includes(tk));
      })
      .slice(0, 4);
  }, [query]);

  const matchedSiteItems = useMemo(() => {
    const trimmed = query.trim();
    const siteItems = siteSearchDirectory.filter((item) => item.category === 'site');
    if (!trimmed) return siteItems.slice(0, 3);
    const tokens = normalizeQueryText(trimmed).split(/\s+/).filter(Boolean);
    return siteItems
      .filter((item) => {
        const hay = normalizeQueryText(`${item.title} ${item.subtitle} ${item.keywords}`);
        return tokens.every((tk) => hay.includes(tk));
      })
      .slice(0, 4);
  }, [query]);

  const flatOptions = useMemo(() => {
    const list: { href: string; key: string }[] = [];
    for (const p of matchedPlates) list.push({ href: `/plates/${p.slug}`, key: `plate-${p.id || p.slug}` });
    for (const a of matchedAccountItems) list.push({ href: a.href, key: a.id });
    for (const s of matchedSiteItems) list.push({ href: s.href, key: s.id });
    if (query.trim()) {
      list.push({ href: `/plates/search?q=${encodeURIComponent(query.trim())}`, key: 'advanced-plate-search' });
    }
    return list;
  }, [matchedPlates, matchedAccountItems, matchedSiteItems, query]);

  function navigateTo(href: string) {
    setOpen(false);
    router.push(href);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (open && flatOptions[activeIndex]) {
      navigateTo(flatOptions[activeIndex].href);
      return;
    }
    if (trimmed) {
      navigateTo(`/plates/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigateTo('/plates/search');
    }
  }

  function onInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      setOpen(true);
      return;
    }
    if (!flatOptions.length) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % flatOptions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => (prev - 1 + flatOptions.length) % flatOptions.length);
    }
  }

  const accountOffset = matchedPlates.length;
  const siteOffset = accountOffset + matchedAccountItems.length;
  const deepSearchIdx = siteOffset + matchedSiteItems.length;

  return (
    <div ref={rootRef} className={styles.omniSearchRoot}>
      <form className={styles.omniSearchForm} role="search" aria-label="البحث الشامل في الموقع" onSubmit={onSubmit}>
        <span className={styles.omniSearchIcon} aria-hidden="true">
          <Search size={17} strokeWidth={2.2} />
        </span>

        <input
          ref={inputRef}
          type="search"
          value={query}
          onFocus={() => {
            ensureCatalogPreloaded();
            setOpen(true);
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            ensureCatalogPreloaded();
            setOpen(true);
          }}
          onKeyDown={onInputKeyDown}
          placeholder="ابحث في الموقع كله: لوحة، رقم، مدينة، مزاد، أو قسم بحسابك..."
          aria-label="ابحث في الموقع كله"
          autoComplete="off"
          className={styles.omniSearchInput}
        />

        {query ? (
          <button
            type="button"
            className={styles.omniClearBtn}
            aria-label="مسح البحث"
            onClick={() => {
              setQuery('');
              setActiveIndex(0);
              inputRef.current?.focus();
            }}
          >
            <X size={14} />
          </button>
        ) : (
          <kbd className={styles.omniShortcut} aria-hidden="true" dir="ltr">Ctrl K</kbd>
        )}

        <button type="submit" className={styles.omniSubmitBtn}>
          <span>بحث</span>
        </button>
      </form>

      {open && (
        <div
          id="fbs-omni-search-results"
          role="region"
          aria-label="نتائج البحث الفوري"
          className={styles.omniDropdown}
        >
          {/* 1. Plates & Auctions */}
          {matchedPlates.length > 0 && (
            <div className={styles.omniGroup}>
              <div className={styles.omniGroupHeader}>
                <span>{query.trim() ? 'اللوحات والمزادات المطابقة' : 'أبرز اللوحات والمزادات النشطة'}</span>
                {loadingPlates && <small>جارٍ التحديث…</small>}
              </div>
              <div className={styles.omniList}>
                {matchedPlates.map((plate, plateIdx) => {
                  const idx = plateIdx;
                  const rawPrice = plate.auction?.currentPriceHalalas ?? plate.priceHalalas;
                  const isLive = plate.auction?.status === 'LIVE';
                  return (
                    <Link
                      key={plate.id || plate.slug}
                      href={`/plates/${plate.slug}`}
                      onClick={() => setOpen(false)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`${styles.omniItem} ${activeIndex === idx ? styles.omniItemActive : ''}`}
                    >
                      <span className={styles.omniPlateTag} dir="ltr">
                        <strong>{plate.lettersEn.join(' ')}</strong>
                        <span>{plate.numbers}</span>
                      </span>
                      <span className={styles.omniItemBody}>
                        <strong>
                          لوحة {plate.lettersAr.join(' ')} · {plate.numbers}
                        </strong>
                        <small>
                          {plate.type} · {plate.city} {isLive ? '· مزاد مباشر' : ''}
                        </small>
                      </span>
                      {rawPrice && rawPrice !== '0' ? (
                        <span className={styles.omniPriceTag} dir="rtl">
                          <span dir="ltr">{formatEnglishAmount(rawPrice)}</span>
                          <SarSymbol className={styles.omniRiyal} />
                        </span>
                      ) : (
                        <ArrowLeft size={14} className={styles.omniArrow} />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Account Sections */}
          {matchedAccountItems.length > 0 && (
            <div className={styles.omniGroup}>
              <div className={styles.omniGroupHeader}>
                <span>أقسام لوحة التحكم</span>
              </div>
              <div className={styles.omniList}>
                {matchedAccountItems.map((item, accIdx) => {
                  const idx = accountOffset + accIdx;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`${styles.omniItem} ${activeIndex === idx ? styles.omniItemActive : ''}`}
                    >
                      <span className={styles.omniItemIcon}><Icon size={16} /></span>
                      <span className={styles.omniItemBody}>
                        <strong>{item.title}</strong>
                        <small>{item.subtitle}</small>
                      </span>
                      <ArrowLeft size={14} className={styles.omniArrow} />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Website Pages & Services */}
          {matchedSiteItems.length > 0 && (
            <div className={styles.omniGroup}>
              <div className={styles.omniGroupHeader}>
                <span>صفحات وخدمات المنصة</span>
              </div>
              <div className={styles.omniList}>
                {matchedSiteItems.map((item, siteIdx) => {
                  const idx = siteOffset + siteIdx;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`${styles.omniItem} ${activeIndex === idx ? styles.omniItemActive : ''}`}
                    >
                      <span className={styles.omniItemIcon}><Icon size={16} /></span>
                      <span className={styles.omniItemBody}>
                        <strong>{item.title}</strong>
                        <small>{item.subtitle}</small>
                      </span>
                      <ArrowLeft size={14} className={styles.omniArrow} />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {query.trim() && (
            <div className={styles.omniFooter}>
              <Link
                href={`/plates/search?q=${encodeURIComponent(query.trim())}`}
                onClick={() => setOpen(false)}
                onMouseEnter={() => setActiveIndex(deepSearchIdx)}
                className={`${styles.omniDeepSearchLink} ${activeIndex === deepSearchIdx ? styles.omniItemActive : ''}`}
              >
                <Search size={15} />
                <span>فتح البحث المتقدم في الكتالوج عن «{query.trim()}»</span>
                <ArrowLeft size={14} />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AccountDashboard({
  user, activeSectionKey, rowsData, columns, initialTheme = 'light', dataState,
  featuredPlates, counts, profilePhone, profileEditable
}: AccountDashboardProps) {
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const details = sectionDetails[activeSectionKey] ?? sectionDetails.overview;
  const name = user.displayName?.trim() || '';
  const initial = (user.displayName?.trim() || user.email || 'ح').charAt(0);
  const featured = featuredPlates[0];

  // Hydrate persisted desktop sidebar collapse preference without SSR mismatch
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        if (window.localStorage.getItem('fbs_account_sidebar_collapsed') === '1') {
          setSidebarCollapsed(true);
        }
      } catch {}
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  function handleSidebarToggle() {
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 960px)').matches) {
      setMenuOpen((prev) => !prev);
      return;
    }
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem('fbs_account_sidebar_collapsed', next ? '1' : '0');
      } catch {}
      return next;
    });
  }

  function changeTheme(nextTheme: 'light' | 'dark') {
    setTheme(nextTheme);
    try {
      window.localStorage.setItem('fbs_signature_theme', nextTheme);
    } catch {
      // The current session can still use the selected theme if storage is unavailable.
    }
    document.cookie = `fbs_signature_theme=${nextTheme}; path=/; max-age=31536000; SameSite=Lax`;
  }

  async function logout() {
    setLogoutError('');
    try {
      const response = await fetch('/api/v1/auth/logout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}'
      });
      if (!response.ok) throw new Error('تعذر تسجيل الخروج، حاول مرة أخرى.');
      router.push('/');
      router.refresh();
    } catch {
      setLogoutError('تعذر تسجيل الخروج، حاول مرة أخرى.');
    }
  }

  const sidebarToggleLabel = menuOpen
    ? 'إغلاق القائمة الجانبية'
    : sidebarCollapsed
      ? 'فتح القائمة الجانبية'
      : 'طي القائمة الجانبية';

  return (
    <div
      className={styles.dashboard}
      data-account-theme={theme}
      data-sidebar-collapsed={sidebarCollapsed ? 'true' : 'false'}
      dir="rtl"
    >
      {menuOpen && <button className={styles.backdrop} type="button" aria-label="إغلاق القائمة" onClick={() => setMenuOpen(false)} />}

      {/* Collapsible, Theme-Adaptive Sculpted Concierge Sidebar */}
      <aside
        id="account-navigation"
        className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ''} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}
        aria-label="التنقل في الحساب"
      >
        <div className={styles.sidebarInner}>
          <div className={styles.brandPlaque}>
            <Link href="/" className={styles.brand} onClick={() => setMenuOpen(false)} aria-label="FBS، العودة للرئيسية" title="فارس بن سعود — الرئيسية">
              <div className={styles.brandMark}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/X12.svg" alt="" className={styles.brandEmblem} />
                <div className={styles.brandWords}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/brand/logo.svg" alt="فارس بن سعود" className={styles.brandCalligraphy} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/brand/X14.svg" alt="اللوحات المميزة" className={styles.brandSubtitle} />
                </div>
              </div>
            </Link>
          </div>

          <Link
            href="/account/profile"
            className={styles.sidebarMember}
            onClick={() => setMenuOpen(false)}
            aria-current={activeSectionKey === 'profile' ? 'page' : undefined}
            title={name ? `${name} (${user.email})` : user.email}
          >
            <span className={styles.memberMonogram}>
              {initial}
              <span className={styles.memberPulse} aria-hidden="true" />
            </span>
            <span className={styles.memberMeta}>
              <strong>{name || 'عضو النخبة'}</strong>
              <small dir="ltr">{user.email}</small>
            </span>
          </Link>

          <nav className={styles.navigation} aria-label="أقسام الحساب">
            <div className={styles.navSection}>
              <span className={styles.navCaption}>المزادات والمقتنيات</span>
              <div className={styles.navTrack}>
                {marketplaceNavLinks.map(({ key, href, label, icon: Icon, countKey }) => {
                  const countVal = countKey ? counts[countKey] : null;
                  return (
                    <Link
                      key={key}
                      href={href}
                      data-tooltip={label}
                      title={sidebarCollapsed ? label : undefined}
                      aria-current={activeSectionKey === key ? 'page' : undefined}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className={styles.navIconWrap}><Icon size={17} strokeWidth={1.9} aria-hidden="true" /></span>
                      <span className={styles.navLabel}>{label}</span>
                      {countVal !== null && <span className={styles.navBadge}>{countVal}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className={styles.navSection}>
              <span className={styles.navCaption}>المحفظة والحماية</span>
              <div className={styles.navTrack}>
                {financeSecurityNavLinks.map(({ key, href, label, icon: Icon }) => (
                  <Link
                    key={key}
                    href={href}
                    data-tooltip={label}
                    title={sidebarCollapsed ? label : undefined}
                    aria-current={activeSectionKey === key ? 'page' : undefined}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className={styles.navIconWrap}><Icon size={17} strokeWidth={1.9} aria-hidden="true" /></span>
                    <span className={styles.navLabel}>{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <div className={styles.sidebarBottom}>
            <div className={styles.dockTray} role="group" aria-label="الحساب والمساعدة">
              <Link
                href="/account/profile"
                onClick={() => setMenuOpen(false)}
                aria-current={activeSectionKey === 'profile' ? 'page' : undefined}
                aria-label="الملف الشخصي"
                title="الملف الشخصي"
              >
                <UserRound size={16} aria-hidden="true" />
                <span>ملفي</span>
              </Link>
              <Link
                href="/faq"
                onClick={() => setMenuOpen(false)}
                aria-label="المساعدة"
                title="مركز المساعدة"
              >
                <Headphones size={16} aria-hidden="true" />
                <span>المساعدة</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className={styles.dockLogout}
                aria-label="تسجيل الخروج"
                title="تسجيل الخروج"
              >
                <LogOut size={16} aria-hidden="true" />
                <span>خروج</span>
              </button>
            </div>
            {logoutError && <p role="alert" className={styles.logoutError}>{logoutError}</p>}
          </div>
        </div>
      </aside>

      <div className={styles.workspace}>
        <div className={styles.content}>
          {/* Seamless Page Header with ONE Fixed Sidebar Toggle Button, Prominent 3D Controls & Site-Wide Omni-Search */}
          <header className={styles.header}>
            <div className={styles.headerStart}>
              <button
                type="button"
                className={styles.sidebarToggleBtn}
                aria-label={sidebarToggleLabel}
                aria-expanded={menuOpen || !sidebarCollapsed}
                aria-controls="account-navigation"
                title={sidebarToggleLabel}
                onClick={handleSidebarToggle}
              >
                {menuOpen || !sidebarCollapsed ? (
                  <PanelRightClose size={18} strokeWidth={2.1} aria-hidden="true" />
                ) : (
                  <PanelRightOpen size={18} strokeWidth={2.1} aria-hidden="true" />
                )}
              </button>
              <Link href="/" className={styles.homePill}>
                <span className={styles.homePillIcon}><Home size={15} aria-hidden="true" /></span>
                <span>الرئيسية</span>
              </Link>
            </div>

            <GlobalOmniSearch initialPlates={featuredPlates} />

            <div className={styles.headerEnd}>
              <div className={styles.themeControl} role="group" aria-label="مظهر الداشبورد">
                <button type="button" aria-label="الوضع الفاتح" aria-pressed={theme === 'light'} onClick={() => changeTheme('light')}>
                  <Sun size={14} aria-hidden="true" />
                  <span>فاتح</span>
                </button>
                <button type="button" aria-label="الوضع الداكن" aria-pressed={theme === 'dark'} onClick={() => changeTheme('dark')}>
                  <Moon size={14} aria-hidden="true" />
                  <span>داكن</span>
                </button>
              </div>

              <Link
                href="/account/notifications"
                className={styles.raisedIconBtn}
                aria-label="الإشعارات"
                aria-current={activeSectionKey === 'notifications' ? 'page' : undefined}
                title="الإشعارات"
              >
                <Bell size={17} aria-hidden="true" />
              </Link>

              <Link href="/account/profile" className={styles.userPill} aria-label="الملف الشخصي">
                <span className={styles.avatar}>{initial}</span>
                <span className={styles.userName}>{name || 'حسابي'}</span>
              </Link>
            </div>
          </header>

          {/* Sculpted 3D Welcome Banner with Chiseled Title & Deeply Debossed Crest Watermark */}
          <section className={styles.greeting} aria-label="ترحيب الحساب">
            <div className={styles.greetingInner}>
              <div className={styles.greetingCopy}>
                <p className={styles.eyebrowPill}>
                  <Crown size={13} aria-hidden="true" />
                  <span>بوابة النخبة · فارس بن سعود</span>
                </p>
                <h1 className={styles.engravedHeading}>
                  {activeSectionKey === 'overview' ? (
                    name ? (
                      <>
                        <span className={styles.carvedInk}>مرحبًا، </span>
                        <span className={styles.carvedGold}>{name}</span>
                      </>
                    ) : (
                      <>
                        <span className={styles.carvedInk}>مرحبًا </span>
                        <span className={styles.carvedGold}>بك</span>
                      </>
                    )
                  ) : details.splitTitle ? (
                    <>
                      <span className={styles.carvedInk}>{details.splitTitle[0]} </span>
                      <span className={styles.carvedGold}>{details.splitTitle[1]}</span>
                    </>
                  ) : (
                    <span className={styles.carvedInk}>{details.title}</span>
                  )}
                </h1>
                <p className={styles.intro}>{details.description}</p>
              </div>

              <div className={styles.greetingActions}>
                {activeSectionKey === 'overview' && (
                  <Link href="/auctions" className={styles.secondaryHeroButton}>
                    <Gavel size={15} aria-hidden="true" />
                    <span>المزادات المباشرة</span>
                  </Link>
                )}
                <Link href={details.action?.href ?? '/sell-your-plate'} className={styles.primaryButton}>
                  {details.action?.href ? <ArrowLeft size={16} aria-hidden="true" /> : <Plus size={17} aria-hidden="true" />}
                  <span>{details.action?.label ?? 'اعرض لوحتك'}</span>
                </Link>
              </div>

              <EngravedFbsCrest
                filterId="fbs-greeting-deboss"
                tone={theme}
                className={styles.greetingWatermark}
              />
            </div>
          </section>

          {activeSectionKey === 'overview' ? (
            <>
              <div className={styles.summaryHeading}>
                <span className={styles.headingOrnament} aria-hidden="true" />
                <h2 className={styles.engravedSubheading}>
                  <span className={styles.carvedInk}>حسابك </span>
                  <span className={styles.carvedGold}>في لمحة</span>
                </h2>
                <span className={styles.headingRule} aria-hidden="true" />
              </div>

              <section className={styles.metrics} aria-label="ملخص الحساب">
                {[
                  { label: 'مشاركاتي', sub: 'المزادات المسجّل بها', value: counts.auctions, href: '/account/auctions', icon: Gavel },
                  { label: 'لوحاتي', sub: 'اللوحات المرتبطة بحسابك', value: counts.plates, href: '/account/plates', icon: Car },
                  { label: 'المفضلة', sub: 'اللوحات المحفوظة للمتابعة', value: counts.favorites, href: '/account/favorites', icon: Bookmark },
                  { label: 'التأمين والضمان', sub: 'الضمانات البنكية والمحفظة', value: null, href: '/account/deposits', icon: Wallet }
                ].map(({ label, sub, value, href, icon: Icon }) => (
                  <Link href={href} className={styles.metric} key={href}>
                    <div className={styles.metricTop}>
                      <span className={styles.metricIcon}><Icon size={19} strokeWidth={1.85} aria-hidden="true" /></span>
                      <span className={styles.metricArrow}><ArrowUpLeft size={15} aria-hidden="true" /></span>
                    </div>
                    <div className={styles.metricVault}>
                      <strong className={value === null ? styles.metricActionText : styles.metricNumber}>
                        {value === null ? 'عرض التفاصيل' : value}
                      </strong>
                      <span className={styles.metricTitle}>{label}</span>
                      <small className={styles.metricSub}>{sub}</small>
                    </div>
                  </Link>
                ))}
              </section>

              {/* Executive Asymmetric Bento: Deep Sculpted Auction Stage + Recessed Quick Command */}
              <div className={styles.bentoGrid}>
                <section className={styles.auctionSection} aria-label="لوحة مميزة في المزاد">
                  {featured ? (
                    <>
                      <div className={styles.auctionTopline}>
                        <span className={styles.spotlightLabel}>
                          <Gavel size={14} strokeWidth={2.1} aria-hidden="true" />
                          <span>اختيار من المزادات</span>
                        </span>
                        <Link href="/auctions" className={styles.spotlightLink}>
                          <span>جميع المزادات</span>
                          <ArrowLeft size={14} aria-hidden="true" />
                        </Link>
                      </div>

                      <div className={styles.auctionBody}>
                        <div className={styles.auctionInfo}>
                          <h2 className={styles.auctionCarvedTitle}>
                            <span className={styles.carvedInk}>لوحة مميزة </span>
                            <span className={styles.carvedGold}>في المزاد</span>
                          </h2>
                          <p className={styles.auctionLead}>
                            متاحة الآن للمزايدة الإلكترونية المباشرة وفق ضوابط المنصة المعتمدة.
                          </p>

                          <div className={styles.auctionTimerChamber}>
                            <Countdown endsAt={featured.auction?.endsAt} />
                          </div>

                          <div className={styles.auctionActionRow}>
                            <div className={styles.auctionPriceInline}>
                              <span className={styles.auctionInlinePriceLabel}>المزايدة الحالية</span>
                              <strong className={styles.auctionPriceValue} dir="rtl">
                                <span dir="ltr">
                                  {featured.auction?.currentPriceHalalas ? formatEnglishAmount(featured.auction.currentPriceHalalas) : '—'}
                                </span>
                                <SarSymbol className={styles.riyal} />
                              </strong>
                            </div>

                            <Link href={`/plates/${featured.slug}`} className={styles.goldButton}>
                              <span>دخول المزاد والمزايدة</span>
                              <ArrowLeft size={16} aria-hidden="true" />
                            </Link>
                          </div>
                        </div>

                        <div className={styles.auctionVisualCol}>
                          <p className={styles.visualPlateInfo}>
                            <span>{featured.type} · {featured.city}</span>
                            <span className={styles.visualInfoDivider} aria-hidden="true">—</span>
                            <span>لوحة {featured.lettersAr.join(' ')} {featured.numbers}</span>
                          </p>
                          <div className={styles.auctionVisual}>
                            <FbsStageWatermark className={styles.auctionStageWatermark} />
                            <div className={styles.heroPlate}>
                              <PlateVisualizer
                                lettersAr={featured.lettersAr}
                                lettersEn={featured.lettersEn}
                                numbers={featured.numbers}
                                plateType={featured.type}
                                large
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className={styles.noAuction}>
                      <h2 className={styles.auctionCarvedTitle}>
                        <span className={styles.carvedInk}>اكتشف اللوحات </span>
                        <span className={styles.carvedGold}>المميزة</span>
                      </h2>
                      <p>تصفح اللوحات والمزادات المتاحة على المنصة.</p>
                      <Link href="/auctions" className={styles.goldButton}>
                        <span>تصفح المزادات</span>
                        <ArrowLeft size={17} />
                      </Link>
                    </div>
                  )}
                </section>

                <section className={styles.quickBar} aria-label="وصول سريع">
                  <div className={styles.quickIntro}>
                    <span className={styles.quickIntroIcon}><Compass size={19} aria-hidden="true" /></span>
                    <div>
                      <h2 className={styles.engravedSubheading}>
                        <span className={styles.carvedInk}>وصول </span>
                        <span className={styles.carvedGold}>سريع</span>
                      </h2>
                      <p>انتقل مباشرةً إلى خدمات المنصة الأساسية</p>
                    </div>
                  </div>

                  <div className={styles.quickLinks}>
                    {[
                      { href: '/plates/search', label: 'ابحث عن لوحة', desc: 'تصفية دقيقة بالأحرف والأرقام والفئة', icon: Search },
                      { href: '/auctions', label: 'استكشف المزادات', desc: 'تابع المزايدات الحية وشارك فورًا', icon: Gavel },
                      { href: '/sell-your-plate', label: 'اعرض لوحتك', desc: 'تقييم معتمد وعرض مباشر أمام النخبة', icon: Plus }
                    ].map(({ href, label, desc, icon: Icon }) => (
                      <Link key={href} href={href}>
                        <span className={styles.quickIcon}><Icon size={18} aria-hidden="true" /></span>
                        <span className={styles.quickText}>
                          <strong>{label}</strong>
                          <small>{desc}</small>
                        </span>
                        <ArrowLeft size={15} aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                </section>
              </div>

              <section className={styles.listSection} aria-labelledby="featured-plates-title">
                <div className={styles.sectionHeading}>
                  <div>
                    <p className={styles.eyebrowPill}>
                      <Compass size={13} strokeWidth={2.1} aria-hidden="true" />
                      <span>اكتشف المزيد</span>
                    </p>
                    <h2 id="featured-plates-title" className={styles.engravedSectionTitle}>
                      <span className={styles.carvedInk}>لوحات </span>
                      <span className={styles.carvedGold}>مميزة</span>
                    </h2>
                  </div>
                  <Link href="/auctions" className={styles.sectionActionPill}>
                    <span>جميع المزادات</span>
                    <ArrowLeft size={14} aria-hidden="true" />
                  </Link>
                </div>
                {featuredPlates.length ? (
                  <div className={styles.plateGrid}>
                    {featuredPlates.slice(0, 4).map((plate) => (
                      <PlateCard key={plate.id} plate={plate} mode="auction" />
                    ))}
                  </div>
                ) : (
                  <div className={styles.empty}>لا توجد لوحات للعرض حاليًا.</div>
                )}
              </section>
            </>
          ) : activeSectionKey === 'profile' ? (
            <div className={styles.profileArea}>
              <section className={styles.panel}>
                <div className={styles.panelHeading}>
                  <span className={styles.panelIcon}><UserRound size={19} aria-hidden="true" /></span>
                  <div>
                    <h2 className={styles.engravedSubheading}>
                      <span className={styles.carvedInk}>البيانات </span>
                      <span className={styles.carvedGold}>الشخصية</span>
                    </h2>
                    <p>راجع بياناتك وحدّث طرق التواصل.</p>
                  </div>
                </div>
                <ProfileForm user={user} phone={profilePhone} editable={profileEditable} />
              </section>
              <section className={`${styles.panel} ${styles.profilePassword}`} aria-labelledby="profile-password-heading">
                <span className={styles.panelIcon}><LockKeyhole size={19} aria-hidden="true" /></span>
                <div>
                  <h2 id="profile-password-heading" className={styles.engravedSubheading}>
                    <span className={styles.carvedInk}>كلمة المرور </span>
                    <span className={styles.carvedGold}>والأمان</span>
                  </h2>
                  <p>استعد كلمة المرور أو راجع إعدادات الأمان.</p>
                </div>
                <Link href="/forgot-password" className={styles.outlineButton}>
                  <span>استعادة كلمة المرور</span>
                  <ArrowLeft size={15} aria-hidden="true" />
                </Link>
                <Link href="/account/security" className={styles.textLink}>
                  <span>إعدادات الأمان</span>
                  <ArrowLeft size={15} aria-hidden="true" />
                </Link>
              </section>
              <IdentityVerification email={user.email} phone={profilePhone} />
            </div>
          ) : activeSectionKey === 'security' ? (
            <div className={styles.securityArea}>
              <section className={`${styles.panel} ${styles.securityCard}`} aria-labelledby="security-password-heading">
                <div className={styles.panelHeading}>
                  <span className={styles.panelIcon}><LockKeyhole size={20} aria-hidden="true" /></span>
                  <div>
                    <h2 id="security-password-heading" className={styles.engravedSubheading}>
                      <span className={styles.carvedInk}>كلمة </span>
                      <span className={styles.carvedGold}>المرور</span>
                    </h2>
                    <p>حافظ على أمان تسجيل الدخول.</p>
                  </div>
                </div>
                <p className={styles.securityDescription}>إذا نسيت كلمة المرور، يمكنك استعادتها باستخدام بريد حسابك.</p>
                <div className={styles.securityDetail}>
                  <Mail size={18} aria-hidden="true" />
                  <span>
                    <small>البريد المرتبط بالحساب</small>
                    <strong dir="ltr">{user.email || 'غير متاح'}</strong>
                  </span>
                </div>
                <div className={styles.securityAction}>
                  <Link href="/forgot-password" className={styles.outlineButton}>
                    <span>استعادة كلمة المرور</span>
                    <ArrowLeft size={15} aria-hidden="true" />
                  </Link>
                </div>
              </section>

              {dataState === 'ready' ? (
                <MfaSetup />
              ) : (
                <section className={`${styles.panel} ${styles.securityCard}`} aria-labelledby="security-mfa-unavailable-heading">
                  <div className={styles.panelHeading}>
                    <span className={styles.panelIcon}><KeyRound size={20} aria-hidden="true" /></span>
                    <div>
                      <h2 id="security-mfa-unavailable-heading" className={styles.engravedSubheading}>
                        <span className={styles.carvedInk}>التحقق </span>
                        <span className={styles.carvedGold}>بخطوتين</span>
                      </h2>
                      <p>إعداد تطبيق المصادقة.</p>
                    </div>
                  </div>
                  <p className={styles.securityDescription}>تعذر تحميل إعدادات التحقق بخطوتين حاليًا. حاول مرة أخرى لاحقًا.</p>
                </section>
              )}

              <section className={`${styles.panel} ${styles.securityTips}`} aria-labelledby="security-tips-heading">
                <div className={styles.securityTipsHeading}>
                  <span className={styles.panelIcon}><ShieldCheck size={20} aria-hidden="true" /></span>
                  <div>
                    <h2 id="security-tips-heading" className={styles.engravedSubheading}>
                      <span className={styles.carvedInk}>نصائح لحماية حسابك</span>
                    </h2>
                    <p>خطوات بسيطة تحافظ على بياناتك.</p>
                  </div>
                  <Link href="/faq" className={styles.textLink}>
                    <span>مركز المساعدة</span>
                    <ArrowLeft size={15} aria-hidden="true" />
                  </Link>
                </div>
                <ul className={styles.securityTipsList}>
                  <li><LockKeyhole size={18} aria-hidden="true" /><span>استخدم كلمة مرور فريدة لحسابك.</span></li>
                  <li><KeyRound size={18} aria-hidden="true" /><span>لا تشارك رموز التحقق مع أي شخص.</span></li>
                  <li><Smartphone size={18} aria-hidden="true" /><span>احتفظ بالوصول إلى بريدك وتطبيق المصادقة.</span></li>
                </ul>
              </section>
            </div>
          ) : (
            <section className={styles.panel}>
              <div className={styles.sectionHeading}>
                <div>
                  <h2 className={styles.engravedSectionTitle}>
                    <span className={styles.carvedInk}>{details.title}</span>
                  </h2>
                  <p className={styles.sectionHint}>{details.description}</p>
                </div>
              </div>
              {dataState === 'unavailable' ? (
                <div className={styles.empty} role="alert">تعذر تحميل البيانات حاليًا. حاول مرة أخرى لاحقًا.</div>
              ) : (
                <DataTable rows={rowsData} columns={columns} theme={theme} />
              )}
            </section>
          )}

          <footer className={styles.footer}>
            <span>فارس بن سعود للوحات المميزة</span>
            <strong>FBS</strong>
          </footer>
        </div>
      </div>
    </div>
  );
}
