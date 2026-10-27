'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileCheck,
  Headphones,
  HelpCircle,
  Landmark,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Phone,
  PlusCircle,
  Radio,
  Search,
  ShieldCheck,
  UserRound,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Gavel,
  Bookmark,
  Crown,
  X
} from 'lucide-react';

/* ============================================================== */
/* BESPOKE SVG ICONS FOR HEADER NAVIGATION TABS                    */
/* ============================================================== */

/**
 * 1. المزادات (Auctions):
 * Luxury Auction Gavel at 45° angle resting above a sound pedestal,
 * accented with dynamic live auction radiance sparks.
 */
export function AuctionsNavIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Sound Block / Anvil Pedestal */}
      <path d="M2.5 20.5h9" strokeWidth="2" />
      <path d="M4 20.5v-1.8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1.8" fill="currentColor" fillOpacity="0.2" />
      {/* Luxury Gavel Head at 45 deg */}
      <path d="m13.8 6.2 4 4-2.4 2.4-4-4 2.4-2.4Z" fill="currentColor" fillOpacity="0.25" />
      <path d="m12.2 4.6 2.8 2.8" />
      <path d="m16.6 9 2.8 2.8" />
      {/* Gavel Handle */}
      <path d="m11.4 11.4-6.2 6.2a1.4 1.4 0 0 1-2-2l6.2-6.2" />
      {/* Dynamic Live Bid Radiance */}
      <path d="M19.5 4.5v3" strokeWidth="1.5" />
      <path d="M18 6h3" strokeWidth="1.5" />
      <circle cx="20.5" cy="15.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * 2. المتجر (Plates Store):
 * Authentic Saudi Vehicle License Plate silhouette:
 * Embossed perimeter, Kingdom Pillar divider with palm/swords,
 * security seal dot, and embossed character rows.
 */
export function PlatesStoreNavIcon({ className = 'w-4 h-4' }: { className?: string }) {
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
      {/* Outer Plate Frame */}
      <rect x="1.5" y="5.5" width="21" height="13" rx="2.5" fill="currentColor" fillOpacity="0.1" strokeWidth="1.75" />
      {/* Vertical Kingdom Pillar Divider */}
      <line x1="17.5" y1="5.5" x2="17.5" y2="18.5" strokeWidth="1.5" />
      {/* Horizontal Divider Line in main section */}
      <line x1="1.5" y1="12" x2="17.5" y2="12" strokeWidth="1.2" strokeDasharray="1 1" />
      {/* Saudi Palm & Crossed Swords motif in pillar */}
      <path d="M19.8 8.5v2" strokeWidth="1.2" />
      <path d="M18.8 9.5h2" strokeWidth="1.2" />
      {/* Hologram / Security Seal Dot in pillar */}
      <circle cx="19.8" cy="15" r="0.9" fill="currentColor" stroke="none" />
      {/* Embossed Characters Bars (Arabic Top, Latin Bottom) */}
      <rect x="4.5" y="8" width="3" height="1.8" rx="0.5" fill="currentColor" stroke="none" />
      <rect x="10.5" y="8" width="4.5" height="1.8" rx="0.5" fill="currentColor" stroke="none" />
      <rect x="4.5" y="14" width="3" height="1.8" rx="0.5" fill="currentColor" stroke="none" />
      <rect x="10.5" y="14" width="4.5" height="1.8" rx="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

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
  { href: '/auctions', label: 'المزادات', icon: AuctionsNavIcon },
  { href: '/plates', label: 'المتجر', icon: PlatesStoreNavIcon },
  { href: '/about', label: 'عن FBS', icon: AboutFbsNavIcon }
];

const allNav = [
  { href: '/auctions', label: 'المزادات', icon: AuctionsNavIcon },
  { href: '/plates', label: 'المتجر', icon: PlatesStoreNavIcon },
  { href: '/sell-your-plate', label: 'اعرض لوحتك', icon: SellPlateNavIcon },
  { href: '/about', label: 'عن FBS', icon: AboutFbsNavIcon }
];

export function Brand({ variant = 'gold', className = '' }: { variant?: 'gold' | 'white'; className?: string }) {
  const isWhite = variant === 'white';
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-[clamp(0.45rem,0.35rem+0.35vw,0.75rem)] transition-transform duration-200 active:scale-[0.98] shrink-0 ${className}`}
      aria-label="فارس بن سعود للوحات المميزة، الرئيسية"
    >
      {/* 1. X12: FBS Plate Emblem SVG */}
      <img
        src="/brand/X12.svg"
        alt="FBS - لوحة المركبة"
        className={`h-[clamp(2.125rem,1.85rem+0.75vw,2.75rem)] w-auto object-contain transition-transform group-hover:scale-[1.02] ${
          isWhite ? 'brightness-0 invert' : ''
        }`}
      />

      {/* 2 & 3. Typography: Calligraphy (logo.svg) & Subtitle (X14.svg) */}
      <div className="flex flex-col items-center justify-center gap-0.5 sm:gap-1">
        <img
          src="/brand/logo.svg"
          alt="فارس بن سعود"
          className={`h-[clamp(1.125rem,0.95rem+0.55vw,1.625rem)] w-auto object-contain transition-transform group-hover:scale-[1.02] ${
            isWhite ? 'brightness-0 invert' : ''
          }`}
        />
        <img
          src="/brand/X14.svg"
          alt="اللوحات المميزة"
          className={`h-[clamp(0.5rem,0.42rem+0.25vw,0.75rem)] w-auto object-contain transition-transform group-hover:scale-[1.02] ${
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

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string; displayName?: string; role?: string } | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [heroRevealed, setHeroRevealed] = useState(() => {
    if (typeof window !== 'undefined') {
      if ((window as any).__fbsHeroRevealed) return true;
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
      await fetch('/api/v1/auth/logout', { method: 'POST' });
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
  const isStudioPage = pathname.startsWith('/studio-3d');

  if (isAuthPage || isAccountPage || isStudioPage) {
    return null;
  }

  const isTransparent = !scrolled;
  const isHiddenByIntro = pathname === '/' && !heroRevealed;

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
        <div className="container-fbs flex h-[clamp(3.75rem,3.25rem+1.25vw,5rem)] items-center justify-between gap-[clamp(0.75rem,1.5vw,2rem)]">
          {/* Brand Logo */}
          <Brand />

          {/* Clean Centered Desktop Navigation with Fluid Spacing & Custom Bespoke SVGs */}
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
                        <span>عضو موثق · صالة النخبة</span>
                      </div>
                    </div>

                    <div className="space-y-0.5 text-xs font-bold text-slate-200">
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

export function Footer() {
  const pathname = usePathname();
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password' ||
    pathname === '/verify';

  const isAccountPage = pathname.startsWith('/account');
  const isStudioPage = pathname.startsWith('/studio-3d');

  if (isAuthPage || isAccountPage || isStudioPage) {
    return null;
  }

  return (
    <footer className="relative overflow-hidden border-t border-[#D9BB81]/30 bg-[#08162B] text-white">
      {/* Top Specular Edge Line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D9BB81]/60 to-transparent pointer-events-none" />

      <div className="container-fbs relative z-10 pt-16 sm:pt-20">
        {/* Main Navigation & Links Grid (Cleaned & Streamlined 4-Column Layout) */}
        <div className="grid gap-8 lg:gap-8 xl:gap-10 pb-8 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          {/* Column 1: Brand & Executive Summary */}
          <div className="space-y-4">
            <Brand />
            <p className="text-sm leading-relaxed text-slate-200 font-normal max-w-sm">
              المنصة السعودية الأولى المعتمدة لتنظيم وإدارة مزادات لوحات المركبات النادرة، وساطة موثوقة تضمن أعلى معايير الأمان المالي والتنظيمي بين نخبة المزايدين والملاك.
            </p>
          </div>

          {/* Column 2: عالم المزادات */}
          <div>
            <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-gold-light flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gold inline-block" />
              عالم المزادات
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-[13px]">
              {[
                { label: 'سوق اللوحات المميزة', href: '/plates' },
                { label: 'دليل وخطوات المشاركة', href: '/how-it-works' },
                { label: 'عن منصة FBS', href: '/about' }
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-slate-200 font-medium transition-all duration-200 hover:text-gold-light whitespace-nowrap"
                  >
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-md bg-white/5 border border-white/10 text-gold text-[10px] transition-transform duration-200 group-hover:-translate-x-1 group-hover:bg-gold/20 group-hover:border-gold/50">
                      ←
                    </span>
                    <span className="group-hover:translate-x-[-2px] transition-transform whitespace-nowrap">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: اللوائح والسياسات */}
          <div>
            <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-gold-light flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gold inline-block" />
              اللوائح والسياسات
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-[13px]">
              {[
                { label: 'الشروط والأحكام العامة', href: '/terms' },
                { label: 'سياسة الخصوصية والسرية', href: '/privacy' },
                { label: 'سياسة التأمين وحساب الضمان', href: '/deposit-policy' }
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-slate-200 font-medium transition-all duration-200 hover:text-gold-light whitespace-nowrap"
                  >
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-md bg-white/5 border border-white/10 text-gold text-[10px] transition-transform duration-200 group-hover:-translate-x-1 group-hover:bg-gold/20 group-hover:border-gold/50">
                      ←
                    </span>
                    <span className="group-hover:translate-x-[-2px] transition-transform whitespace-nowrap">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: المساعدة والدعم */}
          <div>
            <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-gold-light flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gold inline-block" />
              المساعدة والدعم
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-[13px]">
              {[
                { label: 'مركز الأسئلة الشائعة', href: '/faq' },
                { label: 'تواصل مع الإدارة التنفيذية', href: '/contact' },
                { label: 'طلب استشارة كونسيرج خاصة', href: 'https://wa.me/966500000000', external: true }
              ].map((item, idx) => (
                <li key={idx}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 text-slate-200 font-medium transition-all duration-200 hover:text-gold-light whitespace-nowrap"
                    >
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-md bg-white/5 border border-white/10 text-gold text-[10px] transition-transform duration-200 group-hover:-translate-x-1 group-hover:bg-gold/20 group-hover:border-gold/50">
                        ←
                      </span>
                      <span className="group-hover:translate-x-[-2px] transition-transform whitespace-nowrap">
                        {item.label}
                      </span>
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-2 text-slate-200 font-medium transition-all duration-200 hover:text-gold-light whitespace-nowrap"
                    >
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-md bg-white/5 border border-white/10 text-gold text-[10px] transition-transform duration-200 group-hover:-translate-x-1 group-hover:bg-gold/20 group-hover:border-gold/50">
                        ←
                      </span>
                      <span className="group-hover:translate-x-[-2px] transition-transform whitespace-nowrap">
                        {item.label}
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact details and social links belong directly to the footer. */}
        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 py-5 text-start md:flex-row md:items-center md:gap-6 sm:py-6">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-3">
            <a
              href="https://wa.me/966500000000"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-8 items-center gap-2 text-slate-300 transition-colors hover:text-gold"
            >
              <Phone size={16} className="shrink-0 text-gold" aria-hidden="true" />
              <span className="text-xs font-medium">الخط الساخن</span>
              <span className="font-norwester text-base font-bold tracking-wide text-white group-hover:text-gold" dir="ltr">
                +966 50 000 0000
              </span>
            </a>
            <div className="inline-flex min-h-8 items-center gap-2 text-xs text-slate-300 sm:text-[13px]">
              <MapPin size={16} className="shrink-0 text-gold" aria-hidden="true" />
              <span className="font-medium">المقر الرئيسي:</span>
              <span className="font-semibold text-white">الرياض • برج المملكة المالي</span>
            </div>
          </div>

          {/* Social Media Channels */}
          <nav className="flex flex-wrap items-center gap-2" aria-label="روابط التواصل الاجتماعي">
            {/* X */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 transition-colors hover:border-gold/50 hover:bg-gold/15 hover:text-gold"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 transition-colors hover:border-gold/50 hover:bg-gold/15 hover:text-gold"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            {/* Snapchat */}
            <a
              href="https://snapchat.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Snapchat"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 transition-colors hover:border-gold/50 hover:bg-gold/15 hover:text-gold"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.29 2c-3.67 0-6.19 2.76-6.19 5.86 0 .86.26 1.74.45 2.37.07.24.12.43.1.53-.06.22-.44.47-.89.65-.67.28-1.28.66-1.28 1.48 0 .85.74 1.34 1.5 1.57.34.1.66.14.93.18.06.01.12.02.16.03.35.08.47.37.38.74-.26 1.05-.98 1.4-1.8 1.73-.39.15-.81.33-1.07.65-.29.35-.38.8-.24 1.25.17.54.68.85 1.29.85.34 0 .73-.1 1.15-.28.84-.36 1.83-.78 3.25-.19.46.19.98.3 1.54.3.56 0 1.08-.11 1.54-.3 1.42-.59 2.41-.17 3.25.19.42.18.81.28 1.15.28.61 0 1.12-.31 1.29-.85.14-.45.05-.9-.24-1.25-.26-.32-.68-.5-1.07-.65-.82-.33-1.54-.68-1.8-1.73-.09-.37.03-.66.38-.74.04-.01.1-.02.16-.03.27-.04.59-.08.93-.18.76-.23 1.5-.72 1.5-1.57 0-.82-.61-1.2-1.28-1.48-.45-.18-.83-.43-.89-.65-.02-.1.03-.29.1-.53.19-.63.45-1.51.45-2.37C18.48 4.76 15.96 2 12.29 2z"/>
              </svg>
            </a>
            {/* TikTok */}
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 transition-colors hover:border-gold/50 hover:bg-gold/15 hover:text-gold"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.4a6.33 6.33 0 0 0-.85-.06A6.34 6.34 0 0 0 3.1 15.68a6.34 6.34 0 0 0 10.74 4.49 6.27 6.27 0 0 0 1.94-4.5V8.87a8.28 8.28 0 0 0 5.25 1.83V7.27a4.82 4.82 0 0 1-1.44-.58z"/>
              </svg>
            </a>
            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 transition-colors hover:border-gold/50 hover:bg-gold/15 hover:text-gold"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </nav>
        </div>
      </div>

      {/* 4. Centered Legal Copyright Bar */}
      <div className="border-t border-white/10 bg-black/60 backdrop-blur-md py-5 text-center">
        <p className="container-fbs text-xs sm:text-[12.5px] text-slate-400 font-medium leading-relaxed">
          © {new Date().getFullYear()} شركة فارس بن سعود للوحات المميزة (FBS). س.ت: 1010884920. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}

