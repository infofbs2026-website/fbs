'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Menu,
  Phone,
  PlusCircle,
  Search,
  ShieldCheck,
  UserRound,
  ChevronDown,
  ChevronLeft,
  LogOut,
  LayoutDashboard,
  Gavel,
  Store,
  Bookmark,
  Crown,
  X
} from 'lucide-react';
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from '@/lib/site-settings-types';

/* ============================================================== */
/* BESPOKE SVG ICONS FOR HEADER NAVIGATION TABS                    */
/* ============================================================== */

/**
 * 3. عن FBS (About FBS):
 * Royal Heritage Crest & Authenticity Shield:
 * Faceted shield with royal crown apex and authentic crossed swords & palm.
 */
export function AboutFbsNavIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Royal Crest / Shield */}
      <path
        d="M12 2.5 19 5.5v6.2c0 5-3.3 9.2-7 10.3-3.7-1.1-7-5.3-7-10.3V5.5L12 2.5Z"
        fill="currentColor"
        fillOpacity="0.12"
        strokeWidth="1.75"
      />
      {/* Inner Royal Crown at Top */}
      <path d="M9 8.5 10.2 10.5 12 7.5 13.8 10.5 15 8.5v3H9v-3Z" fill="currentColor" fillOpacity="0.3" strokeWidth="1.2" />
      {/* Saudi Palm & Swords Motif / Star of Heritage */}
      <path d="M12 13v4.5" strokeWidth="1.5" />
      <path d="M10 14.5l4 2.5" strokeWidth="1.2" />
      <path d="M14 14.5l-4 2.5" strokeWidth="1.2" />
      <circle cx="12" cy="12.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * 4. اعرض لوحتك (Sell Your Plate - Mobile Drawer):
 */
export function SellPlateNavIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="6" width="15" height="12" rx="2" fill="currentColor" fillOpacity="0.08" />
      <path d="M6 10h7M6 14h4" strokeWidth="1.3" />
      <circle cx="18" cy="16" r="4.5" fill="currentColor" fillOpacity="0.2" strokeWidth="1.75" />
      <path d="M18 13.5v5M15.5 16h5" strokeWidth="1.75" />
    </svg>
  );
}

/**
 * 5. استوديو 3D (3D Car Showroom):
 */
export function Studio3DNavIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" fill="currentColor" fillOpacity="0.08" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" y1="22" x2="12" y2="12" />
      <circle cx="12" cy="7" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

const primaryNav = [
  { href: '/auctions', label: 'المزادات', icon: Gavel },
  { href: '/plates', label: 'المتجر', icon: Store },
  { href: '/about', label: 'عن FBS', icon: AboutFbsNavIcon }
];

const allNav = [
  { href: '/auctions', label: 'المزادات', icon: Gavel },
  { href: '/plates', label: 'المتجر', icon: Store },
  { href: '/sell-your-plate', label: 'اعرض لوحتك', icon: SellPlateNavIcon },
  { href: '/about', label: 'عن FBS', icon: AboutFbsNavIcon }
];

export function Brand({
  variant = 'gold',
  compact = false,
  className = '',
}: {
  variant?: 'gold' | 'white';
  compact?: boolean;
  className?: string;
}) {
  const isWhite = variant === 'white';
  return (
    <Link
      href="/"
      className={`group inline-flex items-center ${compact ? 'gap-2' : 'gap-[clamp(0.45rem,0.35rem+0.35vw,0.75rem)]'} transition-transform duration-200 active:scale-[0.98] shrink-0 ${className}`}
      aria-label="فارس بن سعود للوحات المميزة، الرئيسية"
    >
      {/* 1. X12: FBS Plate Emblem SVG */}
      <img
        src="/brand/X12.svg"
        alt="FBS - لوحة المركبة"
        className={`${
          compact
            ? 'h-[1.9rem] sm:h-[2.15rem]'
            : 'h-[clamp(2.125rem,1.85rem+0.75vw,2.75rem)]'
        } w-auto object-contain transition-transform group-hover:scale-[1.02] ${
          isWhite ? 'brightness-0 invert' : ''
        }`}
      />

      {/* 2 & 3. Typography: Calligraphy (logo.svg) & Subtitle (X14.svg) */}
      <div className="flex flex-col items-center justify-center gap-0.5 sm:gap-1">
        <img
          src="/brand/logo.svg"
          alt="فارس بن سعود"
          className={`${
            compact
              ? 'h-[1rem] sm:h-[1.15rem]'
              : 'h-[clamp(1.125rem,0.95rem+0.55vw,1.625rem)]'
          } w-auto object-contain transition-transform group-hover:scale-[1.02] ${
            isWhite ? 'brightness-0 invert' : ''
          }`}
        />
        <img
          src="/brand/X14.svg"
          alt="اللوحات المميزة"
          className={`${
            compact
              ? 'h-[0.44rem] sm:h-[0.5rem]'
              : 'h-[clamp(0.5rem,0.42rem+0.25vw,0.75rem)]'
          } w-auto object-contain transition-transform group-hover:scale-[1.02] ${
            isWhite ? 'brightness-0 invert' : ''
          }`}
        />
      </div>
    </Link>
  );
}

function getHeaderFirstName(fullName?: string): string {
  if (!fullName) return 'عضو معتمد';
  const trimmed = fullName.trim();
  if (!trimmed) return 'عضو معتمد';
  const parts = trimmed.split(/\s+/);
  if (parts.length === 0) return 'عضو معتمد';
  // Handle compound Arabic names like "عبد الله" or "أبو فهد"
  if (parts.length >= 2 && ['عبد', 'أبو', 'ابو', 'أم', 'ام', 'آل', 'بن'].includes(parts[0])) {
    return `${parts[0]} ${parts[1]}`;
  }
  return parts[0];
}

export function Header({ siteSettings }: { siteSettings?: SiteSettings } = {}) {
  const settings = siteSettings ?? DEFAULT_SITE_SETTINGS;
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{
    id: string;
    email: string;
    displayName?: string;
    role?: string;
    isAdmin?: boolean;
  } | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [heroRevealed, setHeroRevealed] = useState(() => {
    if (typeof window !== 'undefined') {
      if ((window as { __fbsHeroRevealed?: boolean }).__fbsHeroRevealed) return true;
      if (window.location.pathname !== '/') return true;
    }
    return false;
  });

  useEffect(() => {
    let active = true;
    fetch('/api/v1/auth/session')
      .then((r) => r.json())
      .then((d) => {
        if (active && d?.data?.user) {
          setUser(d.data.user);
        } else if (active) {
          setUser(null);
        }
      })
      .catch(() => {
        if (active) setUser(null);
      });
    return () => {
      active = false;
    };
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#header-user-menu-root')) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Keyboard accessibility: Escape key closes menus
  useEffect(() => {
    if (!mobileMenuOpen && !userMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (mobileMenuOpen) setMobileMenuOpen(false);
        if (userMenuOpen) setUserMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen, userMenuOpen]);

  const handleLogout = async () => {
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
    setUser(null);
    setUserMenuOpen(false);
    window.location.href = '/';
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (pathname !== '/') {
      setHeroRevealed(true);
      return;
    }

    const onReveal = () => setHeroRevealed(true);
    window.addEventListener('fbs-hero-revealed', onReveal);
    return () => window.removeEventListener('fbs-hero-revealed', onReveal);
  }, [pathname]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const isAuthPage =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password' ||
    pathname === '/verify';

  const isAccountPage = pathname.startsWith('/account');
  const isAdminPage = pathname.startsWith('/fbs-console');
  const isStudioPage = pathname.startsWith('/studio-3d');

  if (isAuthPage || isAccountPage || isAdminPage || isStudioPage) {
    return null;
  }

  const isTransparent = !scrolled;
  const isHiddenByIntro = pathname === '/' && !heroRevealed;
  const hasAnnouncement = Boolean(settings.announcementEnabled && settings.announcementText.trim());

  return (
    <>
      <header
        className={`fixed top-0 start-0 end-0 z-50 transition-all duration-700 ease-out ${
          isHiddenByIntro
            ? 'opacity-0 -translate-y-8 pointer-events-none'
            : 'opacity-100 translate-y-0'
        } ${
          isTransparent
            ? 'border-b border-transparent bg-transparent text-white shadow-none backdrop-blur-none'
            : 'border-b border-white/10 bg-[#060b17]/95 backdrop-blur-2xl text-white shadow-[0_10px_35px_-10px_rgba(0,0,0,0.8)]'
        }`}
      >
        {hasAnnouncement && (
          <div className="border-b border-[#D9BB81]/30 bg-gradient-to-r from-[#0a1428] via-[#132445] to-[#0a1428] px-4 py-1.5 text-center text-[11px] sm:text-xs font-bold text-[#E6C98F]">
            <Link
              href={settings.announcementHref || '/auctions'}
              className="inline-flex items-center justify-center gap-2 hover:text-white transition-colors"
            >
              <Crown size={13} className="text-[#D9BB81] shrink-0" />
              <span>{settings.announcementText}</span>
              <ArrowLeft size={12} className="shrink-0" />
            </Link>
          </div>
        )}

        <div className="container-fbs flex h-[clamp(3.75rem,3.25rem+1.25vw,5rem)] items-center justify-between gap-[clamp(0.75rem,1.5vw,2rem)]">
          {/* Brand Logo */}
          <Brand />

          {/* Clean Centered Desktop Navigation */}
          <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-[clamp(0.85rem,0.4rem+1vw,1.6rem)] lg:flex">
            {primaryNav.map((item) => {
              const isActive = item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(item.href);
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-2 py-1.5 px-[clamp(0.35rem,0.45vw,0.625rem)] text-[clamp(0.8125rem,0.75rem+0.2vw,0.9375rem)] font-semibold transition-all duration-200 rounded-lg hover:bg-white/[0.04] ${
                    isActive ? 'text-gold font-bold' : 'text-slate-200 hover:text-gold'
                  }`}
                >
                  <span
                    className={`flex items-center justify-center transition-all duration-200 group-hover:scale-115 shrink-0 ${
                      isActive
                        ? 'text-gold filter drop-shadow-[0_0_8px_rgba(217,184,127,0.55)]'
                        : 'text-slate-400 group-hover:text-gold'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 transition-colors" />
                  </span>
                  <span>{item.label}</span>
                  <span
                    className={`absolute bottom-0 start-0 h-0.5 rounded-full bg-gradient-to-r from-gold via-gold-light to-gold transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Refined Luxury Action Controls with Fluid Targets */}
          <div className="flex items-center gap-[clamp(0.35rem,0.25rem+0.35vw,0.75rem)]">
            {/* Minimal Search Trigger - Rounded Full */}
            <Link
              href="/plates/search"
              aria-label="البحث عن لوحة"
              title="البحث عن لوحة"
              className="flex h-[clamp(2.25rem,2rem+0.5vw,2.5rem)] w-[clamp(2.25rem,2rem+0.5vw,2.5rem)] items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-300 backdrop-blur-md transition-all hover:border-gold/50 hover:bg-gold/15 hover:text-gold active:scale-[0.98] shrink-0"
            >
              <Search size={16} />
            </Link>

            {/* Concierge Plate Listing CTA - Visible from sm upwards */}
            <Link
              href="/sell-your-plate"
              className="group hidden sm:inline-flex h-[clamp(2.25rem,2rem+0.5vw,2.5rem)] items-center gap-[clamp(0.35rem,0.25rem+0.2vw,0.625rem)] rounded-full border border-gold/40 bg-gold/10 ps-1.5 pe-[clamp(0.65rem,0.5rem+0.4vw,1rem)] text-[clamp(0.6875rem,0.65rem+0.12vw,0.75rem)] font-bold text-gold-light backdrop-blur-md transition-all duration-200 hover:border-gold hover:bg-gold/20 hover:text-white hover:shadow-[0_0_15px_rgba(217,184,127,0.25)] active:scale-[0.98] shrink-0"
            >
              <span className="flex h-[clamp(1.5rem,1.4rem+0.2vw,1.75rem)] w-[clamp(1.5rem,1.4rem+0.2vw,1.75rem)] items-center justify-center rounded-full bg-gradient-to-tr from-[#141d33] to-[#0a1020] border border-gold/40 text-gold shadow-xs group-hover:border-gold group-hover:shadow-[0_0_8px_rgba(217,184,127,0.4)] transition-all shrink-0">
                <PlusCircle size={13} />
              </span>
              <span className="whitespace-nowrap">اعرض لوحتك</span>
            </Link>

            {/* User State: If Signed In -> Royal Avatar Dropdown, Else -> Sign In Button */}
            {user ? (
              <div id="header-user-menu-root" className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                  className="group flex h-[clamp(2.25rem,2rem+0.5vw,2.5rem)] items-center gap-[clamp(0.35rem,0.25rem+0.2vw,0.5rem)] rounded-full border border-gold/50 bg-[#0d1629]/90 ps-1.5 pe-[clamp(0.625rem,0.5rem+0.3vw,0.75rem)] text-[clamp(0.6875rem,0.65rem+0.12vw,0.75rem)] font-bold text-gold-light backdrop-blur-md transition-all duration-200 hover:border-gold hover:bg-gold/15 hover:text-white hover:shadow-[0_0_20px_rgba(217,184,127,0.35)] active:scale-[0.98] cursor-pointer shrink-0"
                  title={`حسابك: ${user.displayName || user.email}`}
                >
                  <span className="flex h-[clamp(1.5rem,1.4rem+0.2vw,1.75rem)] w-[clamp(1.5rem,1.4rem+0.2vw,1.75rem)] items-center justify-center rounded-full bg-gradient-to-tr from-[#9e7838] via-[#e6c587] to-[#d9b87f] text-navy font-black text-xs shadow-sm ring-1 ring-gold/60 shrink-0">
                    {user.displayName ? user.displayName.trim().charAt(0) : <UserRound size={13} className="text-navy" />}
                  </span>
                  <span className="max-w-[clamp(4.5rem,7vw,8.5rem)] truncate text-slate-100 font-bold">
                    {getHeaderFirstName(user.displayName)}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-gold transition-transform duration-200 ${
                      userMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Luxury Floating Glass Dropdown Menu */}
                {userMenuOpen && (
                  <div
                    role="menu"
                    aria-label="قائمة المستخدم"
                    className="absolute end-0 top-full mt-2.5 z-50 w-[min(16rem,calc(100vw-2rem))] rounded-2xl border border-gold/40 bg-[#070d1a]/95 p-2 shadow-2xl backdrop-blur-2xl animate-fade-in text-start"
                  >
                    <div className="border-b border-white/10 p-3 pb-3.5 mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-gold via-gold-light to-gold-dark text-navy font-black text-sm shadow-md ring-2 ring-gold/40 shrink-0">
                          {user.displayName ? user.displayName.trim().charAt(0) : 'VIP'}
                        </span>
                        <div className="min-w-0">
                          <div className="truncate text-xs font-black text-white">
                            {user.displayName || 'عضو النخبة'}
                          </div>
                          <div className="truncate text-[11px] text-slate-400 font-medium" dir="ltr">
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                        <ShieldCheck size={11} />
                        <span>{user.isAdmin ? 'الإدارة التنفيذية · FBS' : 'عضو موثق · صالة النخبة'}</span>
                      </div>
                    </div>

                    <div className="space-y-0.5 text-xs font-bold text-slate-200">
                      {user.isAdmin && (
                        <Link
                          href="/fbs-console"
                          role="menuitem"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl border border-gold/40 bg-gold/15 px-3 py-2.5 text-gold-light hover:bg-gold/25 hover:text-white transition-colors mb-1"
                        >
                          <Crown size={15} className="text-gold" />
                          <span>لوحة تحكم الإدارة</span>
                        </Link>
                      )}
                      <Link
                        href="/account"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 hover:bg-gold/15 hover:text-gold transition-colors"
                      >
                        <LayoutDashboard size={15} className="text-gold" />
                        <span>لوحة التحكم الرئيسية</span>
                      </Link>
                      <Link
                        href="/account/bids"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 hover:bg-gold/15 hover:text-gold transition-colors"
                      >
                        <Gavel size={15} className="text-gold" />
                        <span>مزايداتي النشطة</span>
                      </Link>
                      <Link
                        href="/account/plates"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 hover:bg-gold/15 hover:text-gold transition-colors"
                      >
                        <Bookmark size={15} className="text-gold" />
                        <span>لوحاتي المعروضة</span>
                      </Link>
                      <Link
                        href="/account/security"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 hover:bg-gold/15 hover:text-gold transition-colors"
                      >
                        <ShieldCheck size={15} className="text-gold" />
                        <span>الأمان وتوثيق الهوية</span>
                      </Link>
                    </div>

                    <div className="border-t border-white/10 pt-1.5 mt-1.5">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/15 transition-colors cursor-pointer"
                      >
                        <LogOut size={15} />
                        <span>تسجيل الخروج</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="group hidden sm:inline-flex h-[clamp(2.25rem,2rem+0.5vw,2.5rem)] items-center gap-[clamp(0.35rem,0.25rem+0.2vw,0.625rem)] rounded-full border border-gold/40 bg-gold/10 ps-1.5 pe-[clamp(0.65rem,0.5rem+0.4vw,1rem)] text-[clamp(0.6875rem,0.65rem+0.12vw,0.75rem)] font-bold text-gold-light backdrop-blur-md transition-all duration-200 hover:border-gold hover:bg-gold/20 hover:text-white hover:shadow-[0_0_15px_rgba(217,184,127,0.25)] active:scale-[0.98] shrink-0"
                title="تسجيل الدخول إلى حسابك"
              >
                <span className="flex h-[clamp(1.5rem,1.4rem+0.2vw,1.75rem)] w-[clamp(1.5rem,1.4rem+0.2vw,1.75rem)] items-center justify-center rounded-full bg-gradient-to-tr from-[#141d33] to-[#0a1020] border border-gold/40 text-gold shadow-xs group-hover:border-gold group-hover:shadow-[0_0_8px_rgba(217,184,127,0.4)] transition-all shrink-0">
                  <UserRound size={13} />
                </span>
                <span className="whitespace-nowrap">تسجيل الدخول</span>
              </Link>
            )}

            {/* Mobile Navigation Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="فتح القائمة الرئيسية"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              className="flex h-[clamp(2.25rem,2rem+0.5vw,2.5rem)] w-[clamp(2.25rem,2rem+0.5vw,2.5rem)] items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-200 transition-colors hover:border-gold/40 hover:text-gold lg:hidden active:scale-95 shrink-0"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Full-Height Mobile Slide-Over Side Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="fixed inset-0 z-[100] lg:hidden"
          aria-modal="true"
          role="dialog"
          aria-label="قائمة التنقل للجوال"
        >
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Full-Height Side Drawer (Slides in along height) */}
          <div
            className="fixed inset-y-0 start-0 w-[min(86vw,22rem)] bg-[#070c18] border-e border-gold/30 shadow-2xl flex flex-col justify-between p-[clamp(1rem,4vw,1.5rem)] z-[101] overflow-y-auto"
            style={{
              backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(217,184,127,0.14) 0%, transparent 65%)'
            }}
          >
            <div>
              {/* Drawer Topbar: Logo + Close Button */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 gap-3">
                <Brand />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="إغلاق القائمة"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-300 hover:text-white hover:border-gold/40 transition-colors active:scale-90 shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Navigation Links with Home Link */}
              <nav className="mt-5 space-y-1.5" aria-label="قائمة الجوال">
                {allNav.map((item) => {
                  const isActive = item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(item.href);
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-[clamp(0.875rem,0.825rem+0.2vw,0.9375rem)] font-bold transition-all duration-200 ${
                        isActive
                          ? 'bg-gold/15 text-gold border border-gold/30 shadow-xs'
                          : 'text-slate-200 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex items-center justify-center shrink-0 ${
                            isActive ? 'text-gold filter drop-shadow-[0_0_6px_rgba(217,184,127,0.4)]' : 'text-slate-400'
                          }`}
                        >
                          <IconComponent className="w-[18px] h-[18px]" />
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {isActive && <span className="h-2 w-2 rounded-full bg-gold shadow-[0_0_8px_#d9b87f]" />}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Bottom Actions: Plate Listing & Login or User Profile */}
            <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
              <Link
                href="/sell-your-plate"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-gold via-gold-light to-gold-dark text-navy font-black py-[clamp(0.65rem,1.5vh,0.8rem)] text-[clamp(0.8125rem,0.78rem+0.15vw,0.875rem)] shadow-md shadow-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <PlusCircle size={16} />
                <span>اعرض لوحتك الآن</span>
              </Link>

              {user ? (
                <div className="rounded-2xl border border-gold/30 bg-white/5 p-3 space-y-2.5 backdrop-blur-md">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-gold via-gold-light to-gold-dark text-navy font-black text-sm shadow-md ring-2 ring-gold/40 shrink-0">
                      {user.displayName ? user.displayName.trim().charAt(0) : 'VIP'}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-xs font-black text-white">{user.displayName || 'عضو النخبة'}</div>
                      <div className="truncate text-[10px] text-slate-400" dir="ltr">{user.email}</div>
                    </div>
                  </div>

                  {user.isAdmin && (
                    <Link
                      href="/fbs-console"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-gold/50 bg-gold/20 py-2 text-xs font-black text-gold-light hover:bg-gold/30 transition-colors"
                    >
                      <Crown size={14} className="text-gold" />
                      <span>لوحة تحكم الإدارة</span>
                    </Link>
                  )}

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 text-xs font-bold">
                    <Link
                      href="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-gold/40 bg-gold/15 py-2 text-gold-light hover:bg-gold/25 transition-colors"
                    >
                      <LayoutDashboard size={14} />
                      <span>لوحة التحكم</span>
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 py-2 text-rose-300 hover:bg-rose-500/20 transition-colors cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>خروج</span>
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full rounded-xl border border-gold/40 bg-gold/10 py-[clamp(0.65rem,1.5vh,0.8rem)] text-[clamp(0.8125rem,0.78rem+0.15vw,0.875rem)] font-bold text-gold-light hover:text-white hover:border-gold transition-all"
                >
                  <UserRound size={16} className="text-gold" />
                  <span>تسجيل الدخول</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function Footer({ siteSettings }: { siteSettings?: SiteSettings } = {}) {
  const settings = siteSettings ?? DEFAULT_SITE_SETTINGS;
  const pathname = usePathname();
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password' ||
    pathname === '/verify';

  const isAccountPage = pathname.startsWith('/account');
  const isAdminPage = pathname.startsWith('/fbs-console');
  const isStudioPage = pathname.startsWith('/studio-3d');

  if (isAuthPage || isAccountPage || isAdminPage || isStudioPage) {
    return null;
  }

  const cleanWa = settings.whatsappNumber.replace(/[^0-9]/g, '') || DEFAULT_SITE_SETTINGS.whatsappNumber;
  const waHref = `https://wa.me/${cleanWa}`;

  return (
    <footer className="relative overflow-hidden border-t border-[#D9BB81]/25 bg-[#081324] text-white">
      {/* Top Specular Edge Line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D9BB81]/50 to-transparent pointer-events-none" />

      {/* Main Fluid Framed Container (~13.5vw side-whitespace on PC) */}
      <div className="w-[min(calc(100%-2.5rem),76rem)] lg:w-[min(73vw,76rem)] mx-auto relative z-10 pt-8 sm:pt-10 pb-5 sm:pb-6 antialiased">
        {/* Main Navigation & Links Grid (4-Column Layout with Balanced Compact Spacing) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_1fr] gap-6 md:gap-8 pb-5 sm:pb-6">
          {/* Column 1: Brand & Executive Summary */}
          <div className="space-y-2.5">
            <Brand compact />
            <p className="text-[max(0.72rem,11px)] leading-[1.65] text-slate-300/85 font-normal max-w-[17rem]">
              {settings.footerSummary || DEFAULT_SITE_SETTINGS.footerSummary}
            </p>
          </div>

          {/* Column 2: عالم المزادات */}
          <div>
            <h3 className="mb-2.5 sm:mb-3 text-[max(0.75rem,11.5px)] font-semibold text-gold-light flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gold inline-block shrink-0" />
              عالم المزادات
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 text-[max(0.72rem,11px)] font-normal">
              {[
                { label: 'سوق اللوحات المميزة', href: '/plates' },
                { label: 'دليل وخطوات المشاركة', href: '/how-it-works' },
                { label: 'عن منصة FBS', href: '/about' }
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-1.5 text-slate-300/90 font-normal transition-colors duration-200 hover:text-white whitespace-nowrap"
                  >
                    <ChevronLeft
                      size={11}
                      className="text-gold/70 transition-transform duration-200 group-hover:-translate-x-1 group-hover:text-gold shrink-0"
                    />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: اللوائح والسياسات */}
          <div>
            <h3 className="mb-2.5 sm:mb-3 text-[max(0.75rem,11.5px)] font-semibold text-gold-light flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gold inline-block shrink-0" />
              اللوائح والسياسات
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 text-[max(0.72rem,11px)] font-normal">
              {[
                { label: 'الشروط والأحكام العامة', href: '/terms' },
                { label: 'سياسة الخصوصية والسرية', href: '/privacy' },
                { label: 'سياسة التأمين وحساب الضمان', href: '/deposit-policy' }
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-1.5 text-slate-300/90 font-normal transition-colors duration-200 hover:text-white whitespace-nowrap"
                  >
                    <ChevronLeft
                      size={11}
                      className="text-gold/70 transition-transform duration-200 group-hover:-translate-x-1 group-hover:text-gold shrink-0"
                    />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: المساعدة والدعم */}
          <div>
            <h3 className="mb-2.5 sm:mb-3 text-[max(0.75rem,11.5px)] font-semibold text-gold-light flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gold inline-block shrink-0" />
              المساعدة والدعم
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 text-[max(0.72rem,11px)] font-normal">
              {[
                { label: 'مركز الأسئلة الشائعة', href: '/faq' },
                { label: 'تواصل مع الإدارة التنفيذية', href: '/contact' },
                { label: 'طلب استشارة كونسيرج خاصة', href: waHref, external: true }
              ].map((item, idx) => (
                <li key={idx}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 text-slate-300/90 font-normal transition-colors duration-200 hover:text-white whitespace-nowrap"
                    >
                      <ChevronLeft
                        size={11}
                        className="text-gold/70 transition-transform duration-200 group-hover:-translate-x-1 group-hover:text-gold shrink-0"
                      />
                      <span>{item.label}</span>
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-1.5 text-slate-300/90 font-normal transition-colors duration-200 hover:text-white whitespace-nowrap"
                    >
                      <ChevronLeft
                        size={11}
                        className="text-gold/70 transition-transform duration-200 group-hover:-translate-x-1 group-hover:text-gold shrink-0"
                      />
                      <span>{item.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact details & Social Channels (Balanced Horizontal Ribbon) */}
        <div className="flex flex-col items-start justify-between gap-3.5 border-t border-white/10 pt-4 sm:pt-5 text-start md:flex-row md:items-center md:gap-6">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 transition-all duration-200 hover:border-gold/50 hover:bg-gold/10"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/15 text-gold shrink-0">
                <Phone size={11} />
              </span>
              <span className="text-[11px] font-normal text-slate-400">الخط الساخن:</span>
              <span className="font-norwester text-[0.8125rem] font-semibold tracking-wider text-white group-hover:text-gold transition-colors" dir="ltr">
                {settings.phoneDisplay || DEFAULT_SITE_SETTINGS.phoneDisplay}
              </span>
            </a>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-slate-300">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/15 text-gold shrink-0">
                <MapPin size={11} />
              </span>
              <span className="text-[11px] font-normal text-slate-400">المقر الرئيسي:</span>
              <span className="text-[0.72rem] font-medium text-white">{settings.addressAr || DEFAULT_SITE_SETTINGS.addressAr}</span>
            </div>
          </div>

          {/* Social Media Channels */}
          <nav className="flex flex-wrap items-center gap-2.5" aria-label="روابط التواصل الاجتماعي">
            {settings.socialLinks.x && (
              <a
                href={settings.socialLinks.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gold/25 bg-gradient-to-b from-white/[0.09] to-white/[0.03] text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_4px_10px_rgba(0,0,0,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/70 hover:bg-gold/15 hover:text-gold-light hover:shadow-[0_6px_16px_rgba(217,187,129,0.18)] active:scale-95"
              >
                <svg className="h-[16px] w-[16px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            )}
            {settings.socialLinks.instagram && (
              <a
                href={settings.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gold/25 bg-gradient-to-b from-white/[0.09] to-white/[0.03] text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_4px_10px_rgba(0,0,0,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/70 hover:bg-gold/15 hover:text-gold-light hover:shadow-[0_6px_16px_rgba(217,187,129,0.18)] active:scale-95"
              >
                <svg className="h-[17px] w-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="20" height="20" x="2" y="2" rx="5.5" ry="5.5"/>
                  <circle cx="12" cy="12" r="4.2"/>
                  <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/>
                </svg>
              </a>
            )}
            {settings.socialLinks.snapchat && (
              <a
                href={settings.socialLinks.snapchat}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Snapchat"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gold/25 bg-gradient-to-b from-white/[0.09] to-white/[0.03] text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_4px_10px_rgba(0,0,0,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/70 hover:bg-gold/15 hover:text-gold-light hover:shadow-[0_6px_16px_rgba(217,187,129,0.18)] active:scale-95"
              >
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3c-3.1 0-5.2 2.25-5.2 5.2 0 .85.18 1.68.38 2.24-.52.28-1.08.35-1.56.25-.44-.1-.85.18-.85.62 0 .52.52.86 1.08 1.04.58.18.92.42.84.88-.25 1.38-1.38 2.34-2.82 2.86-.38.14-.55.52-.36.86.24.44.82.78 1.62.92.34.06.56.28.68.58.16.42.54.68 1.02.58.78-.16 1.54.02 2.28.38.78.38 1.82.58 2.89.58s2.11-.2 2.89-.58c.74-.36 1.5-.54 2.28-.38.48.1.86-.16 1.02-.58.12-.3.34-.52.68-.58.8-.14 1.38-.48 1.62-.92.19-.34.02-.72-.36-.86-1.44-.52-2.57-1.48-2.82-2.86-.08-.46.26-.7.84-.88.56-.18 1.08-.52 1.08-1.04 0-.44-.41-.72-.85-.62-.48.1-1.04.03-1.56-.25.2-.56.38-1.39.38-2.24C17.2 5.25 15.1 3 12 3z" fill="currentColor" fillOpacity="0.14"/>
                </svg>
              </a>
            )}
            {settings.socialLinks.tiktok && (
              <a
                href={settings.socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gold/25 bg-gradient-to-b from-white/[0.09] to-white/[0.03] text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_4px_10px_rgba(0,0,0,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/70 hover:bg-gold/15 hover:text-gold-light hover:shadow-[0_6px_16px_rgba(217,187,129,0.18)] active:scale-95"
              >
                <svg className="h-[17px] w-[17px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.4a6.33 6.33 0 0 0-.85-.06A6.34 6.34 0 0 0 3.1 15.68a6.34 6.34 0 0 0 10.74 4.49 6.27 6.27 0 0 0 1.94-4.5V8.87a8.28 8.28 0 0 0 5.25 1.83V7.27a4.82 4.82 0 0 1-1.44-.58z"/>
                </svg>
              </a>
            )}
            {settings.socialLinks.youtube && (
              <a
                href={settings.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gold/25 bg-gradient-to-b from-white/[0.09] to-white/[0.03] text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_4px_10px_rgba(0,0,0,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/70 hover:bg-gold/15 hover:text-gold-light hover:shadow-[0_6px_16px_rgba(217,187,129,0.18)] active:scale-95"
              >
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            )}
          </nav>
        </div>
      </div>

      {/* Centered Legal Copyright Bar (With Mobile Floating Action Clearance) */}
      <div className="border-t border-white/10 bg-[#040914]/90 backdrop-blur-md pt-3.5 pb-[clamp(4.75rem,10dvh,6rem)] md:py-3 text-center px-4 antialiased">
        <p className="w-[min(calc(100%-2rem),76rem)] lg:w-[min(73vw,76rem)] mx-auto text-[11px] text-slate-400/90 font-normal leading-relaxed">
          © {new Date().getFullYear()} {settings.siteName || 'فارس بن سعود للوحات المميزة'} (FBS) • س.ت: {settings.crNumber || '1010884920'} • جميع الحقوق محفوظة
        </p>
      </div>
    </footer>
  );
}
