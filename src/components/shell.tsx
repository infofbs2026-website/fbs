'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  CreditCard,
  FileCheck,
  Headphones,
  HelpCircle,
  Landmark,
  Lock,
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

const primaryNav = [
  ['/', 'الرئيسية'],
  ['/auctions', 'المزادات'],
  ['/plates', 'اللوحات المميزة'],
  ['/how-it-works', 'كيف نعمل'],
  ['/about', 'عن FBS']
];

const allNav = [
  ['/', 'الرئيسية'],
  ['/auctions', 'المزادات'],
  ['/plates', 'اللوحات المميزة'],
  ['/sell-your-plate', 'اعرض لوحتك'],
  ['/how-it-works', 'كيف نعمل'],
  ['/about', 'عن FBS']
];

export function Brand({ variant = 'gold', className = '' }: { variant?: 'gold' | 'white'; className?: string }) {
  const isWhite = variant === 'white';
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 sm:gap-3 transition-transform duration-200 active:scale-[0.98] ${className}`}
      aria-label="فارس بن سعود للوحات المميزة، الرئيسية"
    >
      {/* 1. X12: FBS Plate Emblem SVG */}
      <img
        src="/brand/X12.svg"
        alt="FBS - لوحة المركبة"
        className={`h-9 sm:h-11 w-auto object-contain transition-transform group-hover:scale-[1.02] ${
          isWhite ? 'brightness-0 invert' : ''
        }`}
      />

      {/* 2 & 3. Typography: Calligraphy (logo.svg) & Subtitle (X14.svg) */}
      <div className="flex flex-col items-center justify-center gap-1">
        <img
          src="/brand/logo.svg"
          alt="فارس بن سعود"
          className={`h-5 sm:h-6.5 w-auto object-contain transition-transform group-hover:scale-[1.02] ${
            isWhite ? 'brightness-0 invert' : ''
          }`}
        />
        <img
          src="/brand/X14.svg"
          alt="اللوحات المميزة"
          className={`h-2.5 sm:h-3 w-auto object-contain transition-transform group-hover:scale-[1.02] ${
            isWhite ? 'brightness-0 invert' : ''
          }`}
        />
      </div>
    </Link>
  );
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

  const isTransparent = !isAuthPage && !scrolled;
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
        <div className="container-fbs flex h-20 items-center justify-between gap-4">
          {/* Brand Logo */}
          <Brand />

          {/* Clean Centered Desktop Navigation */}
          <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-7 lg:flex">
            {primaryNav.map(([href, label]) => {
              const isActive = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`group relative py-1.5 text-sm font-semibold transition-colors duration-200 ${
                    isActive ? 'text-gold font-bold' : 'text-slate-200 hover:text-gold'
                  }`}
                >
                  <span>{label}</span>
                  <span
                    className={`absolute bottom-0 start-0 h-0.5 rounded-full bg-gradient-to-r from-gold via-gold-light to-gold transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Refined Luxury Action Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Minimal Search Trigger - Rounded Full */}
            <Link
              href="/plates/search"
              aria-label="البحث عن لوحة"
              title="البحث عن لوحة"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-300 backdrop-blur-md transition-all hover:border-gold/50 hover:bg-gold/15 hover:text-gold active:scale-[0.98]"
            >
              <Search size={16} />
            </Link>

            {/* Concierge Plate Listing CTA - Visible from sm upwards */}
            <Link
              href="/sell-your-plate"
              className="group hidden sm:inline-flex h-10 items-center gap-2.5 rounded-full border border-gold/40 bg-gold/10 ps-2 pe-4 text-xs font-bold text-gold-light backdrop-blur-md transition-all duration-200 hover:border-gold hover:bg-gold/20 hover:text-white hover:shadow-[0_0_15px_rgba(217,184,127,0.25)] active:scale-[0.98]"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-[#141d33] to-[#0a1020] border border-gold/40 text-gold shadow-xs group-hover:border-gold group-hover:shadow-[0_0_8px_rgba(217,184,127,0.4)] transition-all shrink-0">
                <PlusCircle size={14} />
              </span>
              <span>اعرض لوحتك</span>
            </Link>

            {/* User State: If Signed In -> Royal Avatar Dropdown, Else -> Sign In Button */}
            {user ? (
              <div id="header-user-menu-root" className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="group flex h-10 items-center gap-2 rounded-full border border-gold/50 bg-[#0d1629]/90 ps-1.5 pe-3 text-xs font-bold text-gold-light backdrop-blur-md transition-all duration-200 hover:border-gold hover:bg-gold/15 hover:text-white hover:shadow-[0_0_20px_rgba(217,184,127,0.35)] active:scale-[0.98] cursor-pointer"
                  title="حسابك المسجل"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-[#9e7838] via-[#e6c587] to-[#d9b87f] text-navy font-black text-xs shadow-sm ring-1 ring-gold/60 shrink-0">
                    {user.displayName ? user.displayName.trim().charAt(0) : <UserRound size={13} className="text-navy" />}
                  </span>
                  <span className="max-w-[120px] truncate text-slate-100 font-bold">
                    {user.displayName || 'عضو معتمد'}
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
                  <div className="absolute end-0 top-12 z-50 w-64 rounded-2xl border border-gold/40 bg-[#070d1a]/95 p-2 shadow-2xl backdrop-blur-2xl animate-fade-in text-start">
                    <div className="border-b border-white/10 p-3 pb-3.5 mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-gold via-gold-light to-gold-dark text-navy font-black text-sm shadow-md ring-2 ring-gold/40">
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
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 hover:bg-gold/15 hover:text-gold transition-colors"
                      >
                        <LayoutDashboard size={15} className="text-gold" />
                        <span>لوحة التحكم الرئيسية</span>
                      </Link>
                      <Link
                        href="/account/bids"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 hover:bg-gold/15 hover:text-gold transition-colors"
                      >
                        <Gavel size={15} className="text-gold" />
                        <span>مزايداتي النشطة</span>
                      </Link>
                      <Link
                        href="/account/plates"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 hover:bg-gold/15 hover:text-gold transition-colors"
                      >
                        <Bookmark size={15} className="text-gold" />
                        <span>لوحاتي المعروضة</span>
                      </Link>
                      <Link
                        href="/account/security"
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
                className="group hidden sm:inline-flex h-10 items-center gap-2.5 rounded-full border border-gold/40 bg-gold/10 ps-2 pe-4 text-xs font-bold text-gold-light backdrop-blur-md transition-all duration-200 hover:border-gold hover:bg-gold/20 hover:text-white hover:shadow-[0_0_15px_rgba(217,184,127,0.25)] active:scale-[0.98]"
                title="تسجيل الدخول إلى حسابك"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-[#141d33] to-[#0a1020] border border-gold/40 text-gold shadow-xs group-hover:border-gold group-hover:shadow-[0_0_8px_rgba(217,184,127,0.4)] transition-all shrink-0">
                  <UserRound size={14} />
                </span>
                <span>تسجيل الدخول</span>
              </Link>
            )}

            {/* Mobile Navigation Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="فتح القائمة الرئيسية"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-200 transition-colors hover:border-gold/40 hover:text-gold lg:hidden active:scale-95"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Full-Height Mobile Slide-Over Side Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden" aria-modal="true" role="dialog">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Full-Height Side Drawer (Slides in along height) */}
          <div
            className="fixed inset-y-0 start-0 w-[84vw] max-w-[340px] bg-[#070c18] border-e border-gold/30 shadow-2xl flex flex-col justify-between p-6 z-[101] overflow-y-auto"
            style={{
              backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(217,184,127,0.14) 0%, transparent 65%)'
            }}
          >
            <div>
              {/* Drawer Topbar: Logo + Close Button */}
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <Brand />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="إغلاق القائمة"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-300 hover:text-white hover:border-gold/40 transition-colors active:scale-90"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Navigation Links with Home Link */}
              <nav className="mt-6 space-y-1.5" aria-label="قائمة الجوال">
                {allNav.map(([href, label]) => {
                  const isActive = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${
                        isActive
                          ? 'bg-gold/15 text-gold border border-gold/30 shadow-xs'
                          : 'text-slate-200 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span>{label}</span>
                      {isActive && <span className="h-2 w-2 rounded-full bg-gold shadow-[0_0_8px_#d9b87f]" />}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Bottom Actions: Plate Listing & Login or User Profile */}
            <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
              <Link
                href="/sell-your-plate"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-gold via-gold-light to-gold-dark text-navy font-black py-3 text-sm shadow-md shadow-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <PlusCircle size={16} />
                <span>اعرض لوحتك الآن</span>
              </Link>

              {user ? (
                <div className="rounded-2xl border border-gold/30 bg-white/5 p-3.5 space-y-3 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-gold via-gold-light to-gold-dark text-navy font-black text-sm shadow-md ring-2 ring-gold/40">
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
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-gold/40 bg-gold/15 py-2.5 text-gold-light hover:bg-gold/25 transition-colors"
                    >
                      <LayoutDashboard size={14} />
                      <span>لوحة التحكم</span>
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 py-2.5 text-rose-300 hover:bg-rose-500/20 transition-colors"
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
                  className="flex items-center justify-center gap-2 w-full rounded-xl border border-gold/40 bg-gold/10 py-3 text-sm font-bold text-gold-light hover:text-white hover:border-gold transition-all"
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
  return (
    <footer className="relative overflow-hidden border-t border-gold/30 bg-[#050914] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(217,184,127,0.12),rgba(5,9,20,1))] text-white">
      {/* Top Gold Luxury Accent Line */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#d9b87f] to-transparent pointer-events-none" />

      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute -top-32 start-1/2 -translate-x-1/2 h-[450px] w-[950px] rounded-full bg-gradient-to-b from-gold/15 via-amber-500/5 to-transparent blur-[140px]" />
        <div className="absolute bottom-10 end-10 h-[300px] w-[350px] rounded-full bg-blue-600/10 blur-[110px]" />
        <div className="absolute top-1/2 start-0 h-[280px] w-[320px] rounded-full bg-gold/5 blur-[100px]" />
      </div>

      <div className="container-fbs relative z-10 pt-16 sm:pt-20">
        {/* Main Navigation & Links Grid (Balanced Responsive Architecture) */}
        <div className="grid gap-8 lg:gap-7 xl:gap-9 pb-12 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1.2fr_1fr]">
          {/* Column 1: Brand, Corporate Identity & VIP Concierge */}
          <div className="space-y-6">
            <Brand />
            <p className="text-sm leading-relaxed text-slate-100 font-normal max-w-sm">
              المنصة السعودية الرائدة المتخصصة في تنظيم وإدارة مزادات لوحات المركبات الفاخرة والاستثنائية، وساطة موثوقة تضمن أعلى معايير الأمان المالي والتنظيمي بين النخبة من المزايدين والملاك.
            </p>

            {/* VIP Direct Concierge Hotline Card */}
            <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4.5 backdrop-blur-md shadow-xl space-y-3 max-w-sm">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="text-xs font-black text-gold-light flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  كونسيرج المزادات المباشر
                </span>
                <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                  متاح 24/7
                </span>
              </div>

              <a
                href="https://wa.me/966500000000"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-xl bg-gradient-to-r from-gold/15 via-gold/10 to-transparent border border-gold/30 px-3.5 py-2.5 transition-all duration-200 hover:border-gold hover:bg-gold/25"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/20 text-gold-light border border-gold/40">
                    <Phone size={14} />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-300 font-medium">الخط الساخن والمستشار الخاص</div>
                    <div className="font-norwester text-sm font-black text-white tracking-wider" dir="ltr">
                      +966 50 000 0000
                    </div>
                  </div>
                </div>
                <ArrowLeft size={15} className="text-gold transition-transform group-hover:-translate-x-1" />
              </a>

              <div className="flex items-center gap-2.5 text-xs text-slate-200 pt-0.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/10 text-gold">
                  <MapPin size={13} />
                </div>
                <span>الرياض، المملكة العربية السعودية • برج المملكة المالي</span>
              </div>
            </div>
          </div>

          {/* Column 2: عالم المزادات */}
          <div>
            <h3 className="mb-5 text-sm font-black uppercase tracking-wider text-gold-light flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gold inline-block" />
              عالم المزادات
            </h3>
            <ul className="space-y-3 text-xs sm:text-[13px]">
              {[
                { label: 'المزادات الحية النشطة', href: '/auctions' },
                { label: 'فرص اللحظات الأخيرة', href: '/auctions' },
                { label: 'سوق اللوحات المميزة', href: '/plates' },
                { label: 'اعرض لوحتك في المزاد', href: '/sell-your-plate' },
                { label: 'دليل المشاركة خطوة بخطوة', href: '/how-it-works' },
                { label: 'عن منصة فارس بن سعود (FBS)', href: '/about' }
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-slate-100 font-medium transition-all duration-200 hover:text-gold-light whitespace-nowrap"
                  >
                    <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md bg-white/5 border border-white/10 text-gold text-[11px] transition-transform duration-200 group-hover:-translate-x-1 group-hover:bg-gold/20 group-hover:border-gold/50">
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

          {/* Column 3: اللوائح والسياسات (Expanded & Single-Line Enforced) */}
          <div>
            <h3 className="mb-5 text-sm font-black uppercase tracking-wider text-gold-light flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gold inline-block" />
              اللوائح والسياسات
            </h3>
            <ul className="space-y-3 text-xs sm:text-[13px]">
              {[
                { label: 'لائحة مزادات اللوحات', href: '/auction-policy' },
                { label: 'سياسة التأمين وحساب الضمان', href: '/deposit-policy' },
                { label: 'الشروط والأحكام العامة', href: '/terms' },
                { label: 'سياسة الخصوصية والسرية', href: '/privacy' },
                { label: 'ميثاق الشفافية وحماية المزايد', href: '/terms' }
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-slate-100 font-medium transition-all duration-200 hover:text-gold-light whitespace-nowrap"
                  >
                    <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md bg-white/5 border border-white/10 text-gold text-[11px] transition-transform duration-200 group-hover:-translate-x-1 group-hover:bg-gold/20 group-hover:border-gold/50">
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

          {/* Column 4: المساعدة والدعم + شبكة التواصل الاجتماعي */}
          <div className="space-y-6">
            <div>
              <h3 className="mb-5 text-sm font-black uppercase tracking-wider text-gold-light flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold inline-block" />
                المساعدة والدعم
              </h3>
              <ul className="space-y-3 text-xs sm:text-[13px]">
                {[
                  { label: 'مركز الأسئلة الشائعة', href: '/faq' },
                  { label: 'تواصل مع الإدارة التنفيذية', href: '/contact' },
                  { label: 'طلب استشارة كونسيرج خاصة', href: 'https://wa.me/966500000000', external: true },
                  { label: 'الإبلاغ عن مخالفة أو استفسار', href: '/contact' }
                ].map((item, idx) => (
                  <li key={idx}>
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 text-slate-100 font-medium transition-all duration-200 hover:text-gold-light whitespace-nowrap"
                      >
                        <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md bg-white/5 border border-white/10 text-gold text-[11px] transition-transform duration-200 group-hover:-translate-x-1 group-hover:bg-gold/20 group-hover:border-gold/50">
                          ←
                        </span>
                        <span className="group-hover:translate-x-[-2px] transition-transform whitespace-nowrap">
                          {item.label}
                        </span>
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="group inline-flex items-center gap-2 text-slate-100 font-medium transition-all duration-200 hover:text-gold-light whitespace-nowrap"
                      >
                        <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md bg-white/5 border border-white/10 text-gold text-[11px] transition-transform duration-200 group-hover:-translate-x-1 group-hover:bg-gold/20 group-hover:border-gold/50">
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

            {/* Social Media Showcase Card: 2 rows of 3 icons (3 و 3) */}
            <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4.5 backdrop-blur-md shadow-lg">
              <div className="flex items-center justify-between mb-3.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-gold-light">
                  قنواتنا الرسمية الموثقة
                </h4>
                <span className="font-norwester text-[11px] text-slate-300 font-bold" dir="ltr">
                  @FBS_Plates
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {/* Row 1: X (Twitter), Instagram, Snapchat */}
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="منصة إكس X"
                  className="flex h-10 w-full items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] text-slate-100 transition-all duration-200 hover:border-gold hover:bg-gold/20 hover:text-gold hover:scale-105 shadow-md"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="إنستغرام Instagram"
                  className="flex h-10 w-full items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] text-slate-100 transition-all duration-200 hover:border-gold hover:bg-gold/20 hover:text-gold hover:scale-105 shadow-md"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
                <a
                  href="https://snapchat.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="سناب شات Snapchat"
                  className="flex h-10 w-full items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] text-slate-100 transition-all duration-200 hover:border-gold hover:bg-gold/20 hover:text-gold hover:scale-105 shadow-md"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.29 2c-3.67 0-6.19 2.76-6.19 5.86 0 .86.26 1.74.45 2.37.07.24.12.43.1.53-.06.22-.44.47-.89.65-.67.28-1.28.66-1.28 1.48 0 .85.74 1.34 1.5 1.57.34.1.66.14.93.18.06.01.12.02.16.03.35.08.47.37.38.74-.26 1.05-.98 1.4-1.8 1.73-.39.15-.81.33-1.07.65-.29.35-.38.8-.24 1.25.17.54.68.85 1.29.85.34 0 .73-.1 1.15-.28.84-.36 1.83-.78 3.25-.19.46.19.98.3 1.54.3.56 0 1.08-.11 1.54-.3 1.42-.59 2.41-.17 3.25.19.42.18.81.28 1.15.28.61 0 1.12-.31 1.29-.85.14-.45.05-.9-.24-1.25-.26-.32-.68-.5-1.07-.65-.82-.33-1.54-.68-1.8-1.73-.09-.37.03-.66.38-.74.04-.01.1-.02.16-.03.27-.04.59-.08.93-.18.76-.23 1.5-.72 1.5-1.57 0-.82-.61-1.2-1.28-1.48-.45-.18-.83-.43-.89-.65-.02-.1.03-.29.1-.53.19-.63.45-1.51.45-2.37C18.48 4.76 15.96 2 12.29 2z"/>
                  </svg>
                </a>

                {/* Row 2: YouTube, TikTok, Facebook */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="يوتيوب YouTube"
                  className="flex h-10 w-full items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] text-slate-100 transition-all duration-200 hover:border-gold hover:bg-gold/20 hover:text-gold hover:scale-105 shadow-md"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="تيك توك TikTok"
                  className="flex h-10 w-full items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] text-slate-100 transition-all duration-200 hover:border-gold hover:bg-gold/20 hover:text-gold hover:scale-105 shadow-md"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.4a6.33 6.33 0 0 0-.85-.06A6.34 6.34 0 0 0 3.1 15.68a6.34 6.34 0 0 0 10.74 4.49 6.27 6.27 0 0 0 1.94-4.5V8.87a8.28 8.28 0 0 0 5.25 1.83V7.27a4.82 4.82 0 0 1-1.44-.58z"/>
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="فيسبوك Facebook"
                  className="flex h-10 w-full items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] text-slate-100 transition-all duration-200 hover:border-gold hover:bg-gold/20 hover:text-gold hover:scale-105 shadow-md"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Official Accreditation & Payment Channels Strip (High-Definition Divided Luxury Card) */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-gold/35 bg-gradient-to-r from-[#0a1224]/95 via-[#0e1930]/90 to-[#0a1224]/95 p-5 sm:p-6 backdrop-blur-xl mb-10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          {/* Top and Bottom Subtle Gold Lighting Accents */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#d9b87f]/80 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-5 sm:gap-6">
            {/* Division 1: Payment & Bank Transfer Channels */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <CreditCard size={17} className="text-gold shrink-0" />
                <span className="text-white font-black text-xs sm:text-sm tracking-wide">
                  قنوات الدفع والتحويل المعتمدة:
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-xl border border-white/25 bg-black/60 px-3 py-1.5 text-white font-black text-xs tracking-wider shadow-sm transition-transform hover:scale-105">
                  مدى mada
                </span>
                <span className="rounded-xl border border-white/25 bg-black/60 px-3 py-1.5 text-white font-black text-xs tracking-wider shadow-sm transition-transform hover:scale-105">
                  Apple Pay
                </span>
                <span className="rounded-xl border border-white/25 bg-black/60 px-3 py-1.5 text-white font-black text-xs tracking-wider shadow-sm transition-transform hover:scale-105">
                  Visa
                </span>
                <span className="rounded-xl border border-white/25 bg-black/60 px-3 py-1.5 text-white font-black text-xs tracking-wider shadow-sm transition-transform hover:scale-105">
                  Mastercard
                </span>
                <span className="rounded-xl border border-white/25 bg-black/60 px-3 py-1.5 text-white font-black text-xs tracking-wider shadow-sm transition-transform hover:scale-105">
                  سداد SADAD
                </span>
                <span className="rounded-xl border border-white/25 bg-black/60 px-3 py-1.5 text-white font-black text-xs tracking-wider shadow-sm transition-transform hover:scale-105">
                  سريع SARIE
                </span>
              </div>
            </div>

            {/* Vertical Divider on Desktop */}
            <div className="hidden xl:block h-10 w-[1.5px] bg-gradient-to-b from-transparent via-gold/40 to-transparent shrink-0" />

            {/* Division 2: Official Security & Government Integration */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 sm:pt-0 border-t border-white/10 xl:border-t-0">
              <span className="flex items-center gap-2 rounded-xl border border-emerald-500/50 bg-emerald-500/20 px-3.5 py-1.5 text-emerald-200 font-bold text-xs shadow-sm">
                <Lock size={14} className="text-emerald-400" />
                حماية وتشفير 256-Bit SSL
              </span>
              <span className="flex items-center gap-2 rounded-xl border border-gold/50 bg-gold/20 px-3.5 py-1.5 text-gold-light font-bold text-xs shadow-sm">
                <ShieldCheck size={14} className="text-gold" />
                الربط الرسمي: أبشر • نفاذ
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Legal Copyright Bar */}
      <div className="border-t border-white/12 bg-black/80 backdrop-blur-md">
        <div className="container-fbs flex flex-col items-center justify-between gap-3 py-6 text-xs text-slate-200 sm:flex-row">
          <span className="font-medium">
            © {new Date().getFullYear()} شركة فارس بن سعود للوحات المميزة (FBS). س.ت: 1010884920. جميع الحقوق محفوظة.
          </span>
          <span className="font-norwester text-[12px] sm:text-[13px] tracking-widest text-gold-light font-black" dir="ltr">
            FBS • THE SAUDI PREMIER LUXURY AUTOMOTIVE IDENTITY PLATFORM
          </span>
        </div>
      </div>
    </footer>
  );
}

