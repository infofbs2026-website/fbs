'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Bell, Bookmark, Car, ChevronDown, Clock, CreditCard, Gavel,
  Headphones, Home, LayoutDashboard, LogOut, Menu, Moon, Plus, Search,
  ShieldCheck, Sun, UserRound, Wallet, X
} from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { MfaSetup } from '@/components/mfa';
import { PlateCard, PlateVisualizer } from '@/components/ui';
import { SarSymbol, formatEnglishAmount } from '@/components/sar-symbol';
import type { MarketplacePlate } from '@/modules/marketplace/types';
import styles from './account-dashboard.module.css';

export interface UserViewer {
  id: string;
  email: string;
  displayName?: string;
  role?: string;
}

type DataState = 'ready' | 'demo' | 'unavailable';
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

const primaryLinks = [
  { key: 'overview', href: '/account', label: 'نظرة عامة', icon: LayoutDashboard },
  { key: 'auctions', href: '/account/auctions', label: 'مزاداتي', icon: Gavel },
  { key: 'bids', href: '/account/bids', label: 'مزايداتي', icon: Clock },
  { key: 'plates', href: '/account/plates', label: 'لوحاتي', icon: Car },
  { key: 'favorites', href: '/account/favorites', label: 'المفضلة', icon: Bookmark },
  { key: 'deposits', href: '/account/deposits', label: 'التأمين والضمان', icon: Wallet },
  { key: 'payments', href: '/account/payments', label: 'المدفوعات', icon: CreditCard },
  { key: 'security', href: '/account/security', label: 'الأمان', icon: ShieldCheck }
] as const;

const sectionDetails: Record<string, { title: string; description: string; action?: { label: string; href: string } }> = {
  overview: { title: 'نظرة عامة', description: 'كل ما يخص لوحاتك ومزاداتك في مكان واحد.' },
  auctions: { title: 'مزاداتي', description: 'المزادات التي سجّلت للمشاركة فيها.', action: { label: 'تصفح المزادات', href: '/auctions' } },
  bids: { title: 'مزايداتي', description: 'سجل المزايدات المرتبطة بحسابك.', action: { label: 'تصفح المزادات', href: '/auctions' } },
  plates: { title: 'لوحاتي', description: 'تابع اللوحات المسجلة في حسابك.', action: { label: 'اعرض لوحتك', href: '/sell-your-plate' } },
  favorites: { title: 'المفضلة', description: 'اللوحات التي حفظتها في حسابك.', action: { label: 'مفضلة المتجر', href: '/plates?drawer=wishlist' } },
  deposits: { title: 'التأمين والضمان', description: 'تفاصيل التأمينات المرتبطة بمشاركاتك.', action: { label: 'المدفوعات', href: '/account/payments' } },
  payments: { title: 'المدفوعات', description: 'سجل المدفوعات والتأمينات في حسابك.', action: { label: 'التأمين والضمان', href: '/account/deposits' } },
  notifications: { title: 'الإشعارات', description: 'آخر تحديثات حسابك ومشاركاتك.' },
  profile: { title: 'الملف الشخصي', description: 'بيانات حسابك وطرق التواصل.' },
  security: { title: 'الأمان', description: 'إعدادات حماية حسابك والتحقق بخطوتين.' }
};

function Countdown({ endsAt }: { endsAt?: string }) {
  const [now, setNow] = useState<number | null>(null);
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
  if (!endsAt || now === null || !Number.isFinite(Date.parse(endsAt))) return <span dir="ltr">— : — : —</span>;
  const seconds = Math.max(0, Math.floor((Date.parse(endsAt) - now) / 1000));
  const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const remainder = String(seconds % 60).padStart(2, '0');
  return <span dir="ltr">{hours} : {minutes} : {remainder}</span>;
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

export function AccountDashboard({
  user, activeSectionKey, rowsData, columns, initialTheme = 'light', dataState,
  featuredPlates, marketplaceSource, counts, profilePhone, profileEditable
}: AccountDashboardProps) {
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const details = sectionDetails[activeSectionKey] ?? sectionDetails.overview;
  const name = user.displayName?.trim() || '';
  const initial = (user.displayName?.trim() || user.email || 'ح').charAt(0);
  const featured = featuredPlates[0];
  const isDemoMarket = marketplaceSource === 'demo';

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

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

  return (
    <div className={styles.dashboard} data-account-theme={theme} dir="rtl">
      {menuOpen && <button className={styles.backdrop} type="button" aria-label="إغلاق القائمة" onClick={() => setMenuOpen(false)} />}
      <aside id="account-navigation" className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ''}`} aria-label="التنقل في الحساب">
        <div className={styles.sidebarInner}>
          <Link href="/" className={styles.brand} onClick={() => setMenuOpen(false)} aria-label="FBS، العودة للرئيسية">
            <Image src="/brand/fbs-logo-official.svg" alt="فارس بن سعود للوحات المميزة" width={170} height={45} priority />
          </Link>
          <span className={styles.navCaption}>حسابك في FBS</span>
          <nav className={styles.navigation} aria-label="أقسام الحساب">
            {primaryLinks.map(({ key, href, label, icon: Icon }) => (
              <Link key={key} href={href} aria-current={activeSectionKey === key ? 'page' : undefined} onClick={() => setMenuOpen(false)}>
                <Icon size={19} strokeWidth={1.7} aria-hidden="true" /><span>{label}</span>
              </Link>
            ))}
          </nav>
          <div className={styles.sidebarBottom}>
            <Link href="/account/profile" onClick={() => setMenuOpen(false)} aria-current={activeSectionKey === 'profile' ? 'page' : undefined}><UserRound size={19} aria-hidden="true" /><span>الملف الشخصي</span></Link>
            <Link href="/faq" onClick={() => setMenuOpen(false)}><Headphones size={19} aria-hidden="true" /><span>المساعدة</span></Link>
            <button type="button" onClick={logout}><LogOut size={19} aria-hidden="true" /><span>تسجيل الخروج</span></button>
            {logoutError && <p role="alert" className={styles.logoutError}>{logoutError}</p>}
          </div>
        </div>
      </aside>

      <div className={styles.workspace}>
        <header className={styles.header}>
          <div className={styles.headerStart}>
            <button type="button" className={`${styles.iconButton} ${styles.mobileMenu}`} aria-label={menuOpen ? 'إغلاق القائمة' : 'فتح القائمة'} aria-expanded={menuOpen} aria-controls="account-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
            <Link href="/" className={styles.homeLink}><Home size={16} aria-hidden="true" /><span>الرئيسية</span></Link>
            <span className={styles.headerDivider} />
            <span className={styles.headerTitle}>حسابي <span>/ {details.title}</span></span>
          </div>
          <div className={styles.headerEnd}>
            <Link href="/plates/search" className={styles.searchLink} aria-label="البحث عن لوحة"><Search size={17} aria-hidden="true" /><span>ابحث عن لوحة</span></Link>
            <div className={styles.themeControl} role="group" aria-label="مظهر الداشبورد">
              <button type="button" aria-label="الوضع الفاتح" aria-pressed={theme === 'light'} onClick={() => changeTheme('light')}><Sun size={16} aria-hidden="true" /><span>فاتح</span></button>
              <button type="button" aria-label="الوضع الداكن" aria-pressed={theme === 'dark'} onClick={() => changeTheme('dark')}><Moon size={16} aria-hidden="true" /><span>داكن</span></button>
            </div>
            <Link href="/account/notifications" className={styles.iconButton} aria-label="الإشعارات"><Bell size={19} aria-hidden="true" /></Link>
            <Link href="/account/profile" className={styles.userLink} aria-label="الملف الشخصي"><span className={styles.avatar}>{initial}</span><span className={styles.userName}>{name || 'حسابي'}</span><ChevronDown size={14} aria-hidden="true" /></Link>
          </div>
        </header>

        <div className={styles.content}>
          <div className={styles.greeting}>
            <div>
              <p className={styles.eyebrow}>حسابك في فارس بن سعود</p>
              <h1>{activeSectionKey === 'overview' ? (name ? `مرحبًا، ${name}` : 'مرحبًا بك') : details.title}</h1>
              <p className={styles.intro}>{details.description}</p>
            </div>
            <Link href={details.action?.href ?? '/sell-your-plate'} className={styles.primaryButton}>
              {details.action?.href ? <ArrowLeft size={16} aria-hidden="true" /> : <Plus size={17} aria-hidden="true" />}
              <span>{details.action?.label ?? 'اعرض لوحتك'}</span>
            </Link>
          </div>

          {dataState === 'demo' && <div className={styles.notice} role="status">وضع المعاينة: بيانات الحساب الظاهرة أمثلة توضيحية.</div>}

          {activeSectionKey === 'overview' ? (
            <>
              <section className={styles.metrics} aria-label="ملخص الحساب">
                {[
                  { label: 'مشاركاتي', value: counts.auctions, href: '/account/auctions', icon: Gavel },
                  { label: 'لوحاتي', value: counts.plates, href: '/account/plates', icon: Car },
                  { label: 'المفضلة', value: counts.favorites, href: '/account/favorites', icon: Bookmark },
                  { label: 'التأمين والضمان', value: null, href: '/account/deposits', icon: Wallet }
                ].map(({ label, value, href, icon: Icon }) => (
                  <Link href={href} className={styles.metric} key={href}>
                    <span className={styles.metricIcon}><Icon size={20} strokeWidth={1.7} aria-hidden="true" /></span>
                    <span className={styles.metricCopy}><span>{label}</span><strong>{value === null ? 'عرض التفاصيل' : value}</strong></span>
                    <ArrowLeft className={styles.metricArrow} size={15} aria-hidden="true" />
                  </Link>
                ))}
              </section>

              <section className={styles.auctionSection} aria-label="لوحة مميزة في المزاد">
                {featured ? (
                  <>
                    <div className={styles.auctionInfo}>
                      <span className={styles.liveBadge}><span />{isDemoMarket ? 'لوحة تجريبية' : 'لوحة في المزاد'}</span>
                      <h2>لوحة مميزة في المزاد</h2>
                      <p>{featured.type} · {featured.city}</p>
                      <div className={styles.auctionStats}>
                        <div><span>{isDemoMarket ? 'سعر توضيحي' : 'المزايدة الحالية'}</span><strong dir="ltr">{featured.auction?.currentPriceHalalas ? formatEnglishAmount(featured.auction.currentPriceHalalas) : '—'} <SarSymbol className={styles.riyal} /></strong></div>
                        <div><span>الوقت المتبقي</span><strong><Countdown endsAt={isDemoMarket ? undefined : featured.auction?.endsAt} /></strong></div>
                      </div>
                      <Link href={`/plates/${featured.slug}`} className={styles.goldButton}>{isDemoMarket ? 'تفاصيل اللوحة' : 'عرض المزاد'} <ArrowLeft size={17} aria-hidden="true" /></Link>
                    </div>
                    <div className={styles.auctionVisual}>
                      <span className={styles.visualLabel}>معاينة اللوحة</span>
                      <div className={styles.heroPlate}><PlateVisualizer lettersAr={featured.lettersAr} lettersEn={featured.lettersEn} numbers={featured.numbers} plateType={featured.type} large dark /></div>
                    </div>
                  </>
                ) : (
                  <div className={styles.noAuction}><h2>اكتشف اللوحات المميزة</h2><p>تصفح اللوحات والمزادات المتاحة على المنصة.</p><Link href="/auctions" className={styles.goldButton}>تصفح المزادات <ArrowLeft size={17} /></Link></div>
                )}
              </section>

              <section className={styles.listSection} aria-labelledby="featured-plates-title">
                <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>اكتشف المزيد</p><h2 id="featured-plates-title">لوحات مميزة</h2>{isDemoMarket && <p className={styles.sectionHint}>نماذج توضيحية للعرض</p>}</div><Link href="/auctions" className={styles.textLink}>عرض جميع المزادات <ArrowLeft size={15} aria-hidden="true" /></Link></div>
                {featuredPlates.length ? <div className={styles.plateGrid}>{featuredPlates.slice(0, 4).map((plate) => <PlateCard key={plate.id} plate={plate} mode="auction" demo={isDemoMarket} />)}</div> : <div className={styles.empty}>لا توجد لوحات للعرض حاليًا.</div>}
              </section>
            </>
          ) : activeSectionKey === 'profile' ? (
            <section className={styles.panel}><div className={styles.panelHeading}><span className={styles.panelIcon}><UserRound size={19} /></span><div><h2>البيانات الشخصية</h2><p>راجع بياناتك وحدّث طرق التواصل.</p></div></div><ProfileForm user={user} phone={profilePhone} editable={profileEditable} /></section>
          ) : activeSectionKey === 'security' ? (
            <section className={styles.securityArea}><div className={styles.panel}><div className={styles.panelHeading}><span className={styles.panelIcon}><ShieldCheck size={19} /></span><div><h2>كلمة المرور</h2><p>يمكنك استعادة كلمة المرور عبر البريد الإلكتروني.</p></div></div><Link href="/forgot-password" className={styles.outlineButton}>استعادة كلمة المرور <ArrowLeft size={15} aria-hidden="true" /></Link></div>{dataState === 'ready' ? <MfaSetup theme={theme} /> : <div className={`${styles.panel} ${styles.securityNotice}`}>إعداد التحقق بخطوتين غير متاح في وضع المعاينة.</div>}</section>
          ) : (
            <section className={styles.panel}><div className={styles.sectionHeading}><div><h2>{details.title}</h2><p className={styles.sectionHint}>{details.description}</p></div></div>{dataState === 'unavailable' ? <div className={styles.empty} role="alert">تعذر تحميل البيانات حاليًا. حاول مرة أخرى لاحقًا.</div> : <DataTable rows={rowsData} columns={columns} theme={theme} />}</section>
          )}
          <footer className={styles.footer}>فارس بن سعود للوحات المميزة <span>FBS</span></footer>
        </div>
      </div>
    </div>
  );
}
