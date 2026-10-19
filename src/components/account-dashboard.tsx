'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Gavel,
  Car,
  Bookmark,
  Wallet,
  ShieldCheck,
  Headphones,
  ChevronLeft,
  Sun,
  Moon,
  Bell,
  Crown,
  Plus,
  BadgeCheck,
  ArrowUpLeft,
  ArrowLeft,
  Check,
  Lock,
  X,
  Palmtree,
  CreditCard,
  User,
  Home,
  TrendingUp,
  Gem,
  Award,
  Zap,
  Truck,
  UserCheck,
  Search,
  Radio,
  Users,
  Camera,
  Building2,
  FileCheck2,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { MfaSetup } from '@/components/mfa';

export interface UserViewer {
  id: string;
  email: string;
  displayName?: string;
  role?: string;
}

export interface SectionMeta {
  key: string;
  label: string;
  icon: typeof LayoutDashboard;
  description: string;
}

export const DASHBOARD_SECTIONS: Record<string, SectionMeta> = {
  overview: {
    key: 'overview',
    label: 'نظرة عامة',
    icon: LayoutDashboard,
    description: 'ملخص شامل لحسابك ومزاداتك وتأميناتك'
  },
  auctions: {
    key: 'auctions',
    label: 'مزاداتي',
    icon: Gavel,
    description: 'المزادات التي تأهلت وسجلت للمشاركة فيها'
  },
  plates: {
    key: 'plates',
    label: 'لوحاتي',
    icon: Car,
    description: 'اللوحات المسجلة باسمك والمعروضة للمزاد'
  },
  favorites: {
    key: 'favorites',
    label: 'المفضلة',
    icon: Bookmark,
    description: 'اللوحات المميزة التي قمت بحفظها للمتابعة'
  },
  deposits: {
    key: 'deposits',
    label: 'المحفظة والضمان',
    icon: Wallet,
    description: 'التأمين المعتمد وحساب الضمان Escrow'
  },
  security: {
    key: 'security',
    label: 'الأمان',
    icon: ShieldCheck,
    description: 'إعدادات الحماية وكلمة المرور والمصادقة'
  },
  profile: {
    key: 'profile',
    label: 'الملف الشخصي',
    icon: User,
    description: 'بيانات الهوية الوطنية المعتمدة'
  },
  notifications: {
    key: 'notifications',
    label: 'الإشعارات',
    icon: Bell,
    description: 'تنبيهات المزايدة والتحديثات الرسمية'
  }
};

interface HeroLotItem {
  id: string;
  code: string;
  lotBadge: string;
  rarity: string;
  numAr: string;
  numEn: string;
  letAr: string;
  letEn: string;
  headline: string;
  desc: string;
  price: number;
  bidders: number;
  lastBidder: string;
  city: string;
  category: string;
  saved: boolean;
}

const INITIAL_HERO_LOTS: HeroLotItem[] = [
  {
    id: 'lot-111',
    code: 'EXCLUSIVE LOT / 111',
    lotBadge: 'لوط استثنائي رقم ١١١',
    rarity: 'مؤشر الندرة: 99.4%',
    numAr: '١١١',
    numEn: '111',
    letAr: 'ف ب س',
    letEn: 'FBS',
    headline: 'أرقام استثنائية <span>وحضور لا يتكرر</span>',
    desc: 'لوحة سعودية ثلاثية متماثلة من الفئة الأولى (ف ب س ١١١ · خصوصي · الرياض). مسجّلة بسجل مروري خالٍ تماماً من الملاحظات، ومؤهلة للإفراغ الفوري عبر خدمة أبشر للوحات المميزة مع تسليم مصفّح.',
    price: 750000,
    bidders: 14,
    lastBidder: 'مقتنٍ سيادي #409',
    city: 'الرياض',
    category: 'ثلاثية متطابقة · فئة النخبة',
    saved: false
  },
  {
    id: 'lot-001',
    code: 'SOVEREIGN LOT / 001',
    lotBadge: 'لوط سيادي رقم ٠٠١',
    rarity: 'ندرة ملكية مطلقة: 99.9%',
    numAr: '١',
    numEn: '1',
    letAr: 'م ل ك',
    letEn: 'MLK',
    headline: 'الرقم الأول <span>تاج المقتنيات الملكية</span>',
    desc: 'لوحة أحادية سيادية فائقة الندرة (م ل ك ١ · خصوصي · الرياض). من أندر التشكيلات الحرفية والرقمية المتاحة للاقتناء الخاص مع ضمان نقل الملكية الفوري عبر المكتب السيادي.',
    price: 4250000,
    bidders: 23,
    lastBidder: 'مكتب عائلي خاص #102',
    city: 'الرياض',
    category: 'أحادية ملكية · Sovereign Tier',
    saved: true
  },
  {
    id: 'lot-007',
    code: 'ROYAL PRESTIGE / 007',
    lotBadge: 'لوط استثنائي رقم ٠٠٧',
    rarity: 'مؤشر الندرة: 99.7%',
    numAr: '٧',
    numEn: '7',
    letAr: 'س م و',
    letEn: 'SMW',
    headline: 'رمزية الفخامة <span>توقيع النخبة على الطرقات</span>',
    desc: 'لوحة أحادية ذات دلالة رفيعة (س م و ٧ · خصوصي · الرياض). موثّقة بشهادة أصالة كاملة ومؤهلة للتسليم الخاص عبر ناقل أمني مصفّح.',
    price: 2150000,
    bidders: 19,
    lastBidder: 'مقتنٍ سيادي #812',
    city: 'الرياض',
    category: 'أحادية نخبوية · Royal Tier',
    saved: true
  },
  {
    id: 'lot-888',
    code: 'SYMMETRY LOT / 888',
    lotBadge: 'لوط متطابق رقم ٨٨٨',
    rarity: 'مؤشر الندرة: 98.6%',
    numAr: '٨٨٨',
    numEn: '888',
    letAr: 'ن خ ب',
    letEn: 'NKB',
    headline: 'تناغم هندسي <span>هيبة الثلاثيات المتطابقة</span>',
    desc: 'لوحة ثلاثية متطابقة بحروف متناغمة (ن خ ب ٨٨٨ · خصوصي · جدة). مثالية لأساطيل السيارات الفارهة والكلاسيكية مع جاهزية كاملة للإفراغ الفوري.',
    price: 540000,
    bidders: 11,
    lastBidder: 'مقتنٍ خاص #305',
    city: 'جدة',
    category: 'ثلاثية متطابقة · Prestige',
    saved: false
  }
];

interface OwnedPlateItem {
  id: string;
  numAr: string;
  numEn: string;
  letAr: string;
  letEn: string;
  title: string;
  subtitle: string;
  valuation: string;
  status: string;
}

const INITIAL_OWNED_PLATES: OwnedPlateItem[] = [
  {
    id: 'own-1',
    numAr: '١٠',
    numEn: '10',
    letAr: 'ك ر م',
    letEn: 'K R M',
    title: 'لوحة ك ر م ١٠ · صك ملكية موثّق',
    subtitle: 'خصوصي · الرياض · رقم الصك #KSA-99410',
    valuation: '1,650,000 ر.س',
    status: 'مملوكة وموثّقة عبر أبشر'
  },
  {
    id: 'own-2',
    numAr: '٥٥٥',
    numEn: '555',
    letAr: 'س ع د',
    letEn: 'S A D',
    title: 'لوحة س ع د ٥٥٥ · قيد التوثيق النهائي',
    subtitle: 'خصوصي · الرياض · المرحلة 3 من 4 (تثمين الندرة)',
    valuation: '830,000 ر.س (تقديري)',
    status: 'جاهزة للعرض خلال 24 ساعة'
  }
];

interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  icon: 'check' | 'car' | 'award';
}

const INITIAL_ACTIVITY: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'اعتماد الضمان المصرفي السيادي (SAB Private Escrow)',
    subtitle: 'تم تفعيل القوة الشرائية الفورية حتى 2,500,000 ر.س للمزادات الملكية',
    time: 'منذ ساعتين',
    icon: 'check'
  },
  {
    id: 'act-2',
    title: 'لوحتك (س ع د ٥٥٥) في المرحلة النهائية للتوثيق والتثمين',
    subtitle: 'اكتملت مطابقة السجل المروري عبر أبشر · التقييم المبدئي: 830,000 ر.س',
    time: 'أمس',
    icon: 'car'
  },
  {
    id: 'act-3',
    title: 'دعوة خاصة لحضور مزاد "نوادر الدرعية" المغلق',
    subtitle: 'تم تأكيد مقعدك الافتراضي بصفتك عضو النخبة',
    time: 'قبل يومين',
    icon: 'award'
  }
];

export interface AccountDashboardProps {
  user: UserViewer;
  activeSectionKey: string;
  rowsData: Record<string, unknown>[];
  columns?: string[];
  initialTheme?: 'light' | 'dark';
}

export function AccountDashboard({
  user,
  activeSectionKey,
  rowsData,
  columns,
  initialTheme = 'light'
}: AccountDashboardProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme);
  const [heroLots, setHeroLots] = useState<HeroLotItem[]>(INITIAL_HERO_LOTS);
  const [heroIndex, setHeroIndex] = useState<number>(0);
  const [plateFinish, setPlateFinish] = useState<'official' | 'royal' | 'titanium'>('official');
  const [plateAngle, setPlateAngle] = useState<'perspective' | 'flat' | 'dramatic'>('perspective');
  const [escrowDeposit, setEscrowDeposit] = useState<number>(250000);
  const [tab, setTab] = useState<'active' | 'saved' | 'plates'>('active');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [ownedPlates, setOwnedPlates] = useState<OwnedPlateItem[]>(INITIAL_OWNED_PLATES);
  const [activityList, setActivityList] = useState<ActivityItem[]>(INITIAL_ACTIVITY);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(2 * 3600 + 45 * 60 + 18);

  // Profile comprehensive state
  const [profileName, setProfileName] = useState(user.displayName || 'كارم محمد بن سعود');
  const [profileNationalId, setProfileNationalId] = useState('1088492001');
  const [profilePhone, setProfilePhone] = useState('+966 50 884 9200');
  const [profileEmail, setProfileEmail] = useState(user.email || 'karim@fbs.sa');
  const [profileCity, setProfileCity] = useState('الرياض · حي الخزامى · شارع الأمير سلطان');
  const [profileIban, setProfileIban] = useState('SA84 2000 0001 0108 8492 0001');

  // Form states for Add Plate modal
  const [newPlateLetAr, setNewPlateLetAr] = useState('ع ر ب');
  const [newPlateLetEn, setNewPlateLetEn] = useState('A R B');
  const [newPlateNumEn, setNewPlateNumEn] = useState('77');
  const [newPlateVal, setNewPlateVal] = useState('950,000 ر.س');

  // Form state for Bid Increment modal
  const [modalBidInc, setModalBidInc] = useState<number>(25000);
  const [modalEscrowChoice, setModalEscrowChoice] = useState<number>(250000);

  // Lock body/html scroll to ensure internal-only scroll
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, []);

  // Theme persistence across tabs and sessions
  useEffect(() => {
    try {
      const stored = localStorage.getItem('fbs_signature_theme');
      if (stored === 'dark' || stored === 'light') {
        if (stored !== theme) {
          setTheme(stored);
        }
        document.cookie = `fbs_signature_theme=${stored}; path=/; max-age=31536000; SameSite=Lax`;
        document.documentElement.setAttribute('data-theme', stored);
      } else {
        localStorage.setItem('fbs_signature_theme', theme);
        document.cookie = `fbs_signature_theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
        document.documentElement.setAttribute('data-theme', theme);
      }
    } catch {}
  }, []);

  // Countdown timer interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const switchTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    try {
      localStorage.setItem('fbs_signature_theme', newTheme);
      document.cookie = `fbs_signature_theme=${newTheme}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.setAttribute('data-theme', newTheme);
      const sig = document.getElementById('fbs-signature');
      if (sig) sig.setAttribute('data-theme', newTheme);
    } catch {}
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currentHero = heroLots[heroIndex] || heroLots[0];

  const formatNumber = (n: number) => {
    return Number(n).toLocaleString('en-US');
  };

  const handleQuickBid = (increment: number) => {
    const maxLimit = escrowDeposit * 10;
    const nextBid = currentHero.price + increment;
    if (nextBid > maxLimit) {
      showToast(`قيمة المزايدة تتجاوز سقف الضمان المصرفي الحالي (${formatNumber(maxLimit)} ر.س). يرجى رفع السقف من إدارة التأمين.`);
      return;
    }

    setHeroLots(prev => {
      const updated = [...prev];
      updated[heroIndex] = {
        ...updated[heroIndex],
        price: nextBid,
        bidders: updated[heroIndex].bidders + 1,
        lastBidder: `أنت (${userName} · VIP)`
      };
      return updated;
    });

    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      title: `تم اعتماد مزايدتك على اللوحة (${currentHero.letAr} ${currentHero.numAr})`,
      subtitle: `القيمة المسجلة: ${formatNumber(nextBid)} ر.س · موثقة عبر SAB Escrow`,
      time: 'الآن',
      icon: 'check'
    };
    setActivityList(prev => [newAct, ...prev]);
    showToast(`تم اعتماد مزايدتك بقيمة ${formatNumber(nextBid)} ر.س بنجاح في المزاد المباشر`);
  };

  const toggleBookmarkCurrent = () => {
    const nextSaved = !currentHero.saved;
    setHeroLots(prev => {
      const updated = [...prev];
      updated[heroIndex] = {
        ...updated[heroIndex],
        saved: nextSaved
      };
      return updated;
    });
    showToast(nextSaved ? `أُضيفت اللوحة (${currentHero.letAr} ${currentHero.numAr}) إلى المحفوظات` : `أُزيلت اللوحة من المحفوظات`);
  };

  const handleToggleLotBookmark = (id: string) => {
    setHeroLots(prev =>
      prev.map(l => (l.id === id ? { ...l, saved: !l.saved } : l))
    );
  };

  const handleAddPlateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const arDigits = newPlateNumEn.replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
    const newItem: OwnedPlateItem = {
      id: `own-${Date.now()}`,
      numAr: arDigits,
      numEn: newPlateNumEn,
      letAr: newPlateLetAr,
      letEn: newPlateLetEn,
      title: `لوحة ${newPlateLetAr} ${arDigits} · طلب تثمين رسمي`,
      subtitle: 'خصوصي · الرياض · تم الإرسال لمكتب التوثيق',
      valuation: newPlateVal,
      status: 'قيد مطابقة أبشر الفورية'
    };
    setOwnedPlates(prev => [newItem, ...prev]);
    setTab('plates');
    setActiveModal(null);
    showToast('تمت إضافة اللوحة بنجاح وبدء إجراءات التوثيق والتثمين عبر أبشر');
  };

  const handleEscrowUpdate = () => {
    setEscrowDeposit(modalEscrowChoice);
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      title: 'تحديث سقف الضمان المصرفي (SAB Private)',
      subtitle: `القوة الشرائية الجديدة: ${formatNumber(modalEscrowChoice * 10)} ر.س`,
      time: 'الآن',
      icon: 'check'
    };
    setActivityList(prev => [newAct, ...prev]);
    setActiveModal(null);
    showToast(`تم رفع سقف الضمان المصرفي إلى ${formatNumber(modalEscrowChoice)} ر.س بنجاح`);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('تم حفظ وتحديث بيانات الملف الشخصي واعتماد التوثيق بنجاح');
  };

  const avatarInitial = (profileName || user.displayName || user.email || 'ك').trim().charAt(0).toUpperCase();
  const userName = profileName || user.displayName || 'كارم محمد';
  const isOverview = activeSectionKey === 'overview';

  const savedCount = heroLots.filter(l => l.saved).length;

  const filteredLots = heroLots.filter(lot => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    return (
      lot.letAr.includes(q) ||
      lot.letEn.toLowerCase().includes(q) ||
      lot.numAr.includes(q) ||
      lot.numEn.includes(q) ||
      lot.city.includes(q)
    );
  });

  const hrs = String(Math.floor(countdownSeconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((countdownSeconds % 3600) / 60)).padStart(2, '0');
  const secs = String(countdownSeconds % 60).padStart(2, '0');

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        #fbs-signature {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          margin: 0;
          padding: 0;
          border: none;
          border-radius: 0;
          overflow: hidden;
          z-index: 40;
          color: var(--q-ink);
          background: var(--q-bg);
          font-family: 'IBM Plex Sans Arabic', -apple-system, BlinkMacSystemFont, sans-serif;
          direction: rtl;
          color-scheme: light dark;
        }

        html[data-theme="light"] #fbs-signature,
        #fbs-signature[data-theme="light"] {
          --q-bg: #f4f6fa;
          --q-paper: #ffffff;
          --q-paper-strong: #ffffff;
          --q-white: #ffffff;
          --q-ink: #1a2541;
          --q-muted: #64748b;
          --q-line: #e2e8f0;
          --q-gold: #b89248;
          --q-gold-soft: #fef7ea;
          --q-rail-bg: #ffffff;
          --q-rail-border: #e2e8f0;
          --q-topbar-bg: rgba(255, 255, 255, 0.96);
          --q-topbar-border: #e2e8f0;
          --q-workspace-bg: radial-gradient(ellipse at 2% 0%, rgba(184, 146, 72, 0.06), transparent 40%), #f4f6fa;
          --q-scrollbar-thumb: rgba(184, 146, 72, 0.25);
          --q-good: #10b981;
          --q-good-bg: #ecfdf5;
          --card-shadow: 0 4px 18px -2px rgba(26, 37, 65, 0.05), 0 1px 3px rgba(26, 37, 65, 0.03);
          --btn-shadow: 0 1px 3px rgba(26, 37, 65, 0.05);
          --nav-active-bg: #ffffff;
          --nav-active-color: #b89248;
          --nav-active-border: rgba(184, 146, 72, 0.35);
          --nav-active-shadow: 0 4px 12px rgba(26, 37, 65, 0.06);
          --q-chart-wrap-bg: #ffffff;
          color-scheme: light;
        }

        html[data-theme="dark"] #fbs-signature,
        #fbs-signature[data-theme="dark"] {
          --q-bg: #060911;
          --q-paper: #121927;
          --q-paper-strong: #172133;
          --q-white: #1a253a;
          --q-ink: #f8fafc;
          --q-muted: #94a3b8;
          --q-line: #223145;
          --q-gold: #e5c180;
          --q-gold-soft: rgba(229, 193, 128, 0.12);
          --q-rail-bg: linear-gradient(180deg, #162232 0%, #0d1522 100%);
          --q-rail-border: #233347;
          --q-topbar-bg: linear-gradient(110deg, rgba(22, 34, 50, 0.98), rgba(13, 21, 34, 0.98));
          --q-topbar-border: #233347;
          --q-workspace-bg: radial-gradient(ellipse at 5% 0%, rgba(229, 193, 128, 0.08), transparent 45%), #060911;
          --q-scrollbar-thumb: rgba(229, 193, 128, 0.25);
          --q-good: #34d399;
          --q-good-bg: rgba(16, 185, 129, 0.12);
          --card-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
          --btn-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          --nav-active-bg: linear-gradient(135deg, #1f2e43, #162232);
          --nav-active-color: #f1d7a7;
          --nav-active-border: #3b506e;
          --nav-active-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
          --q-chart-wrap-bg: rgba(0, 0, 0, 0.25);
          color-scheme: dark;
        }

        #fbs-signature *, #fbs-signature *::before, #fbs-signature *::after {
          box-sizing: border-box;
        }

        #fbs-signature .q-num {
          font-family: 'Norwester', 'Manrope', -apple-system, sans-serif;
          font-variant-numeric: tabular-nums lining-nums;
          display: inline-block;
          direction: ltr;
          unicode-bidi: isolate;
        }

        /* 100vh Locked App Shell — Sidebar expanded to 125px */
        #fbs-signature .q-shell {
          display: grid;
          grid-template-columns: 125px minmax(0, 1fr);
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          margin: 0;
          padding: 0;
        }

        /* Full-Height Sidebar with breathing room */
        #fbs-signature .q-rail {
          background: var(--q-rail-bg);
          border-inline-end: 1px solid var(--q-rail-border);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 22px 14px 24px;
          height: 100vh;
          overflow-y: auto;
          scrollbar-width: none;
          flex-shrink: 0;
          z-index: 30;
          position: relative;
        }
        #fbs-signature .q-rail::-webkit-scrollbar {
          display: none;
        }

        #fbs-signature .q-logo {
          font: 800 24px/1 'Norwester', 'Manrope', sans-serif;
          letter-spacing: 2px;
          text-align: center;
          color: var(--q-ink);
          user-select: none;
          text-decoration: none;
        }
        #fbs-signature .q-logo small {
          display: block;
          font-size: 10px;
          color: var(--q-gold);
          letter-spacing: 2px;
          margin-top: 4px;
        }
        #fbs-signature .q-logo::after {
          content: '';
          display: block;
          width: 28px;
          height: 1px;
          margin: 16px auto 18px;
          background: var(--q-gold);
        }

        #fbs-signature .q-nav {
          width: 100%;
          display: grid;
          gap: 10px;
        }

        #fbs-signature .q-nav a, #fbs-signature .q-nav button {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          min-height: 66px;
          padding: 10px 4px;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 16px;
          color: var(--q-muted);
          font-size: 11px;
          font-weight: 500;
          white-space: nowrap;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        #fbs-signature .q-nav a[aria-current="page"], #fbs-signature .q-nav button[aria-current="page"] {
          background: var(--nav-active-bg);
          color: var(--nav-active-color);
          border-color: var(--nav-active-border);
          box-shadow: var(--nav-active-shadow);
          font-weight: 700;
        }

        #fbs-signature .q-nav a[aria-current="page"]::after, #fbs-signature .q-nav button[aria-current="page"]::after {
          content: '';
          position: absolute;
          inset-inline-start: -15px;
          width: 4px;
          height: 24px;
          border-radius: 3px;
          background: var(--q-gold);
        }

        #fbs-signature .q-nav a:hover, #fbs-signature .q-nav button:hover {
          color: var(--q-gold);
          background: rgba(184, 146, 72, 0.08);
        }

        #fbs-signature .q-rail-bottom {
          margin-top: auto;
          display: grid;
          gap: 16px;
          justify-items: center;
          padding-top: 20px;
          flex-shrink: 0;
        }

        #fbs-signature .q-icon-button {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          background: var(--q-paper);
          color: var(--q-muted);
          border: 1px solid var(--q-line);
          border-radius: 12px;
          box-shadow: var(--btn-shadow);
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
        }
        #fbs-signature .q-icon-button:hover {
          color: var(--q-gold);
          border-color: var(--q-gold);
        }

        #fbs-signature .q-avatar {
          display: grid;
          place-items: center;
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #d9b87f, #8c6721);
          color: #121824;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 4px 12px rgba(184, 146, 72, 0.25);
        }

        /* Workspace & Scrollable Main */
        #fbs-signature .q-workspace {
          height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: var(--q-workspace-bg);
          position: relative;
        }

        #fbs-signature .q-topbar {
          height: 72px;
          flex-shrink: 0;
          padding: 0 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          background: var(--q-topbar-bg);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--q-topbar-border);
          z-index: 25;
        }

        #fbs-signature .q-topbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        /* Platform Brand Logo Capsule — Always clear and high-contrast */
        #fbs-signature .q-topbar-brand {
          display: flex;
          align-items: center;
          text-decoration: none;
        }
        #fbs-signature .q-topbar-brand-capsule {
          display: flex;
          align-items: center;
          padding: 4px 12px;
          border-radius: 12px;
          background: #0d1522;
          border: 1px solid rgba(217, 184, 127, 0.45);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
          transition: all 0.2s ease;
        }
        #fbs-signature .q-topbar-brand:hover .q-topbar-brand-capsule {
          border-color: #e5c180;
          box-shadow: 0 4px 14px rgba(217, 184, 127, 0.35);
        }
        #fbs-signature .q-topbar-logo-img {
          height: 34px;
          width: auto;
          object-fit: contain;
        }

        #fbs-signature .q-topbar-divider {
          width: 1px;
          height: 24px;
          background: var(--q-line);
        }

        #fbs-signature .q-home-button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 20px;
          background: var(--q-paper);
          border: 1px solid var(--q-line);
          color: var(--q-ink);
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        #fbs-signature .q-home-button:hover {
          border-color: var(--q-gold);
          color: var(--q-gold);
          transform: translateY(-1px);
        }

        #fbs-signature .q-location {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--q-muted);
        }
        #fbs-signature .q-location strong {
          color: var(--q-ink);
          font-weight: 700;
        }

        #fbs-signature .q-top-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        #fbs-signature .q-theme {
          display: flex;
          padding: 4px;
          gap: 3px;
          border-radius: 24px;
          background: var(--q-paper);
          border: 1px solid var(--q-line);
          box-shadow: var(--btn-shadow);
        }
        #fbs-signature .q-theme button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border: 1px solid transparent;
          border-radius: 20px;
          background: transparent;
          color: var(--q-muted);
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        #fbs-signature .q-theme button[aria-pressed="true"] {
          background: var(--q-white);
          color: var(--q-gold);
          border-color: rgba(184, 146, 72, 0.3);
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
        }

        #fbs-signature .q-notification {
          position: relative;
        }
        #fbs-signature .q-notification::after {
          content: '';
          position: absolute;
          top: 9px;
          left: 10px;
          width: 6px;
          height: 6px;
          background: var(--q-gold);
          border: 1px solid var(--q-paper);
          border-radius: 50%;
        }

        #fbs-signature .q-menu {
          display: none;
        }

        /* Main Scrollable Canvas with 1400px Max-Width Centering */
        #fbs-signature .q-main {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 28px 36px 48px;
          scroll-behavior: smooth;
        }
        #fbs-signature .q-main-container {
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        #fbs-signature .q-main::-webkit-scrollbar {
          width: 6px;
        }
        #fbs-signature .q-main::-webkit-scrollbar-thumb {
          background: var(--q-scrollbar-thumb);
          border-radius: 4px;
        }
        #fbs-signature .q-main::-webkit-scrollbar-track {
          background: transparent;
        }

        /* Executive Greeting */
        #fbs-signature .q-greeting {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }

        #fbs-signature .q-eyebrow {
          font: 700 10.5px/1.5 'Norwester', 'Manrope', sans-serif;
          letter-spacing: 2px;
          color: var(--q-gold);
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        #fbs-signature .q-greeting h1 {
          font-size: clamp(22px, 2.5vw, 30px);
          font-weight: 700;
          color: var(--q-ink);
          margin: 0;
        }

        #fbs-signature .q-greeting p {
          color: var(--q-muted);
          font-size: 13px;
          margin: 4px 0 0;
        }

        /* Meticulously Matched Twin Badge & Button in Greeting */
        #fbs-signature .q-greet-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        #fbs-signature .q-vip,
        #fbs-signature .q-button-greet {
          height: 42px;
          padding: 0 20px;
          border-radius: 21px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 12.5px;
          font-weight: 700;
          box-sizing: border-box;
          white-space: nowrap;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        /* Light mode: Both share identical crisp luxury white surface, fine border, deep ink text */
        #fbs-signature:not([data-theme="dark"]) .q-vip,
        #fbs-signature[data-theme="light"] .q-vip,
        #fbs-signature:not([data-theme="dark"]) .q-button-greet,
        #fbs-signature[data-theme="light"] .q-button-greet {
          background: #ffffff;
          border: 1px solid rgba(184, 146, 72, 0.4);
          color: #1a2541;
          box-shadow: 0 2px 8px rgba(26, 37, 65, 0.06);
        }
        #fbs-signature:not([data-theme="dark"]) .q-vip svg,
        #fbs-signature[data-theme="light"] .q-vip svg,
        #fbs-signature:not([data-theme="dark"]) .q-button-greet svg,
        #fbs-signature[data-theme="light"] .q-button-greet svg {
          color: #b89248;
        }
        #fbs-signature:not([data-theme="dark"]) .q-vip:hover,
        #fbs-signature[data-theme="light"] .q-vip:hover,
        #fbs-signature:not([data-theme="dark"]) .q-button-greet:hover,
        #fbs-signature[data-theme="light"] .q-button-greet:hover {
          border-color: #b89248;
          color: #b89248;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(184, 146, 72, 0.16);
        }

        /* Dark mode: Both share deep luxury navy paper, gold border, crisp white text */
        #fbs-signature[data-theme="dark"] .q-vip,
        #fbs-signature[data-theme="dark"] .q-button-greet {
          background: #121927;
          border: 1px solid rgba(229, 193, 128, 0.35);
          color: #f8fafc;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
        }
        #fbs-signature[data-theme="dark"] .q-vip svg,
        #fbs-signature[data-theme="dark"] .q-button-greet svg {
          color: #e5c180;
        }
        #fbs-signature[data-theme="dark"] .q-vip:hover,
        #fbs-signature[data-theme="dark"] .q-button-greet:hover {
          border-color: #e5c180;
          color: #e5c180;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(229, 193, 128, 0.25);
        }

        /* Clean Section Headers with Distinctive SVG Badges (No 01, 02, 03) */
        #fbs-signature .q-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin: 12px 0 6px;
          flex-wrap: wrap;
        }
        #fbs-signature .q-section-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        #fbs-signature .q-section-icon-badge {
          display: inline-grid;
          place-items: center;
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: var(--q-gold-soft);
          border: 1px solid rgba(217, 184, 127, 0.45);
          color: var(--q-gold);
          flex-shrink: 0;
        }
        #fbs-signature .q-section-header h2 {
          font-size: 17px;
          font-weight: 700;
          color: var(--q-ink);
          margin: 0;
        }

        /* 3D Spotlight Stage */
        #fbs-signature .q-spotlight {
          position: relative;
          background: radial-gradient(ellipse at 12% 0%, #71624762, transparent 54%), linear-gradient(125deg, #172331, #101c2c 60%, #243044);
          color: #f4f2ed;
          border: 1px solid #3c4959;
          border-radius: 28px;
          padding: 24px 28px 20px;
          overflow: hidden;
          box-shadow: 0 18px 45px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1);
        }

        #fbs-signature .q-spotlight::before {
          content: '';
          position: absolute;
          width: 480px;
          height: 480px;
          top: -200px;
          left: -120px;
          border: 1px solid rgba(229, 193, 128, 0.16);
          border-radius: 50%;
          box-shadow: 0 0 0 35px rgba(229, 193, 128, 0.04), 0 0 0 70px rgba(229, 193, 128, 0.02);
          pointer-events: none;
        }

        #fbs-signature .q-spot-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          position: relative;
          z-index: 2;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          flex-wrap: nowrap;
          overflow-x: auto;
          scrollbar-width: none;
        }
        #fbs-signature .q-spot-top::-webkit-scrollbar {
          display: none;
        }

        #fbs-signature .q-collection-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 40px;
          padding: 0 16px;
          border-radius: 20px;
          background: rgba(217, 184, 127, 0.18);
          border: 1px solid rgba(217, 184, 127, 0.45);
          font: 700 12px/1 'IBM Plex Sans Arabic', 'Norwester', sans-serif;
          color: #fae5bc;
          letter-spacing: 0.5px;
          box-sizing: border-box;
          white-space: nowrap;
          flex-shrink: 0;
        }

        #fbs-signature .q-lot-switcher {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: nowrap;
          flex-shrink: 0;
        }

        #fbs-signature .q-lot-pill {
          height: 40px;
          padding: 0 14px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.08);
          color: #e2e8f0;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          box-sizing: border-box;
          white-space: nowrap;
          flex-shrink: 0;
        }
        #fbs-signature .q-lot-pill:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
        }
        #fbs-signature .q-lot-pill[aria-pressed="true"] {
          background: linear-gradient(135deg, rgba(229, 193, 128, 0.4), rgba(229, 193, 128, 0.18));
          color: #ffffff;
          border: 1.5px solid #f0d094;
          box-shadow: 0 4px 14px rgba(229, 193, 128, 0.3);
        }

        #fbs-signature .q-live {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 40px;
          padding: 0 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          color: #ffffff;
          background: linear-gradient(135deg, rgba(220, 38, 38, 0.32), rgba(185, 28, 28, 0.2));
          border: 1px solid rgba(239, 68, 68, 0.5);
          box-sizing: border-box;
          white-space: nowrap;
          flex-shrink: 0;
        }
        #fbs-signature .q-live::before {
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ef4444;
          box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.3);
        }

        #fbs-signature .q-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(0, 1.1fr);
          gap: 24px;
          align-items: center;
          position: relative;
          z-index: 2;
          padding: 16px 0 18px;
        }

        #fbs-signature .q-spot-copy {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        #fbs-signature .q-spot-number {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #f0d094;
          font: 700 11px/1.5 'Manrope', sans-serif;
          letter-spacing: 1.5px;
          flex-wrap: wrap;
        }

        #fbs-signature .q-rarity-badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0;
        }
        #fbs-signature:not([data-theme="dark"]) .q-rarity-badge,
        #fbs-signature[data-theme="light"] .q-rarity-badge {
          color: #926417;
          background: #fffbeb;
          border: 1px solid rgba(184, 146, 72, 0.45);
        }
        #fbs-signature[data-theme="dark"] .q-rarity-badge {
          color: #fce8c3;
          background: rgba(229, 193, 128, 0.18);
          border: 1px solid rgba(229, 193, 128, 0.45);
        }

        #fbs-signature .q-spot-headline {
          font-size: clamp(24px, 2.6vw, 36px);
          font-weight: 800;
          line-height: 1.35;
          letter-spacing: -0.6px;
          white-space: nowrap;
          color: #ffffff;
          margin: 2px 0 4px;
        }
        #fbs-signature .q-spot-headline span {
          color: #e7c78c;
          display: inline-block;
          margin-inline-start: 6px;
        }

        #fbs-signature .q-spot-desc {
          color: #afb9c6;
          font-size: 12.5px;
          line-height: 1.7;
          margin: 0;
        }

        #fbs-signature .q-specs-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 4px;
        }

        #fbs-signature .q-spec-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 11px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #e2e8f0;
          font-size: 11px;
          font-weight: 500;
        }

        #fbs-signature .q-qualified {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          color: #6ee7b7;
          padding: 6px 12px;
          border-radius: 12px;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(110, 231, 183, 0.28);
          font-weight: 500;
          width: fit-content;
          margin-top: 2px;
        }

        /* Live Order Book Feed */
        #fbs-signature .q-orderbook {
          margin-top: 8px;
          padding: 10px 14px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: grid;
          gap: 6px;
        }
        #fbs-signature .q-orderbook-head {
          display: flex;
          justify-content: space-between;
          font-size: 10.5px;
          color: #94a3b8;
          font-weight: 600;
        }
        #fbs-signature .q-orderbook-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11.5px;
          padding-top: 4px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        /* 3D Plate Object Display */
        #fbs-signature .q-object {
          position: relative;
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 18px 16px;
          border-radius: 24px;
          background: radial-gradient(circle at 50% 45%, rgba(229, 193, 128, 0.18), rgba(15, 23, 38, 0.45) 75%);
          border: 1px solid rgba(229, 193, 128, 0.24);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
        }

        #fbs-signature .q-vitrine-hud {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          font: 600 11px/1.4 'Manrope', 'IBM Plex Sans Arabic', sans-serif;
          color: #cbd5e1;
        }
        #fbs-signature .q-vitrine-hud span {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
        #fbs-signature .q-vitrine-rarity {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 14px;
          border-radius: 16px;
          background: rgba(229, 193, 128, 0.22);
          border: 1px solid rgba(229, 193, 128, 0.5);
          color: #fff2d6;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.3px;
        }

        /* Authentic Saudi Vehicle Plate */
        #fbs-signature .q-plate {
          width: min(100%, 360px);
          display: grid;
          grid-template-columns: 1.12fr 1fr 48px;
          direction: ltr;
          background: linear-gradient(135deg, #ffffff 0%, #f5f4f0 50%, #e2e0d8 100%);
          padding: 6px;
          border: 4px solid #c2c6ca;
          border-bottom-color: #7a8086;
          border-radius: 14px;
          color: #111822;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.65), inset 0 2px 0 #ffffff;
          transform: perspective(750px) rotateY(10deg) rotateX(3deg) rotateZ(-2.5deg);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease, border-color 0.3s ease, color 0.3s ease;
          position: relative;
          z-index: 2;
          user-select: none;
          margin: 14px 0;
        }
        #fbs-signature .q-plate[data-angle="flat"] {
          transform: perspective(900px) rotateY(0deg) rotateX(0deg) rotateZ(0deg);
        }
        #fbs-signature .q-plate[data-angle="dramatic"] {
          transform: perspective(750px) rotateY(-13deg) rotateX(5deg) rotateZ(2deg);
        }
        #fbs-signature .q-plate:hover {
          transform: perspective(750px) rotateY(2deg) rotateX(1deg) rotateZ(0deg) scale(1.02);
        }

        #fbs-signature .q-plate[data-finish="royal"] {
          background: linear-gradient(135deg, #1b222f 0%, #0e131b 55%, #232c3d 100%);
          border-color: #d4af6a;
          border-bottom-color: #8c6930;
          color: #fae5bc;
          box-shadow: 0 22px 48px rgba(0, 0, 0, 0.8), 0 0 28px rgba(229, 193, 128, 0.22);
        }
        #fbs-signature .q-plate[data-finish="royal"] .q-plate-col {
          border-right-color: rgba(229, 193, 128, 0.45);
        }
        #fbs-signature .q-plate[data-finish="royal"] .q-plate-col span + span {
          border-top-color: rgba(229, 193, 128, 0.45);
        }
        #fbs-signature .q-plate[data-finish="royal"] .q-kingdom {
          color: #f3d69b;
          background: rgba(229, 193, 128, 0.08);
        }

        #fbs-signature .q-plate[data-finish="titanium"] {
          background: linear-gradient(135deg, #e3e7ec 0%, #b8c1cc 50%, #d8dee6 100%);
          border-color: #939ea9;
          color: #0f172a;
        }

        #fbs-signature .q-bolt {
          width: 6px;
          height: 6px;
          border: 1px solid #7d8489;
          border-radius: 50%;
          background: linear-gradient(135deg, #565d63, #e7e9e8);
          position: absolute;
          z-index: 3;
        }
        #fbs-signature .q-bolt-a { top: 5px; left: 6px; }
        #fbs-signature .q-bolt-b { top: 5px; right: 6px; }
        #fbs-signature .q-bolt-c { bottom: 5px; left: 6px; }
        #fbs-signature .q-bolt-d { bottom: 5px; right: 6px; }

        #fbs-signature .q-plate-col {
          display: grid;
          grid-template-rows: 1fr 1fr;
          text-align: center;
          border-right: 2.5px solid #333d47;
          font-size: 32px;
          line-height: 1.4;
          font-weight: 700;
        }
        #fbs-signature .q-plate-col span + span {
          border-top: 2.5px solid #333d47;
          font: 800 22px/1.7 'Manrope', sans-serif;
          letter-spacing: 3px;
        }
        #fbs-signature .q-plate-col .q-letters {
          direction: rtl;
          letter-spacing: 1.5px;
        }

        #fbs-signature .q-kingdom {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 2px;
          color: #14532d;
          background: rgba(22, 101, 52, 0.08);
          border-radius: 0 8px 8px 0;
          font: 800 9px/1.3 'Manrope', sans-serif;
          padding: 4px 2px;
        }
        #fbs-signature .q-kingdom svg {
          width: 20px;
          height: 20px;
          color: #15803d;
        }
        #fbs-signature .q-kingdom span:first-of-type {
          font: 700 8px/1.3 'IBM Plex Sans Arabic', sans-serif;
        }

        /* Stage Finishes & Angle Buttons */
        #fbs-signature .q-stage-controls {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 6px;
          position: relative;
          z-index: 3;
          margin-top: 6px;
        }

        #fbs-signature .q-finish-bar {
          display: flex;
          align-items: center;
          gap: 3px;
          background: rgba(8, 12, 22, 0.72);
          backdrop-filter: blur(14px);
          padding: 3px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.14);
        }

        #fbs-signature .q-finish-btn {
          padding: 4px 10px;
          border-radius: 16px;
          border: 0;
          background: transparent;
          color: #cbd5e1;
          font-size: 10.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        #fbs-signature .q-finish-btn[aria-pressed="true"] {
          background: rgba(229, 193, 128, 0.28);
          color: #fff2d6;
        }

        /* Spotlight Bottom Action Bar */
        #fbs-signature .q-spot-bottom {
          display: grid;
          grid-template-columns: 1.25fr 0.95fr 1.15fr auto;
          gap: 20px;
          align-items: center;
          padding: 18px 24px;
          border-radius: 20px;
          position: relative;
          z-index: 2;
          box-sizing: border-box;
        }

        #fbs-signature:not([data-theme="dark"]) .q-spot-bottom,
        #fbs-signature[data-theme="light"] .q-spot-bottom {
          background: rgba(12, 19, 32, 0.45);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.14);
        }

        #fbs-signature[data-theme="dark"] .q-spot-bottom {
          background: rgba(15, 23, 38, 0.8);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.16);
        }

        #fbs-signature .q-spot-label {
          font-size: 11px;
          color: #b4c2d8;
          margin-bottom: 3px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        #fbs-signature .q-spot-bidder-dot {
          color: rgba(255, 255, 255, 0.35);
          font-weight: 400;
        }
        #fbs-signature .q-spot-bidder-text {
          color: #f3d69b;
          font-weight: 600;
          font-size: 11.5px;
          letter-spacing: 0.3px;
        }
        #fbs-signature .q-spot-price {
          font-size: clamp(24px, 2.5vw, 32px);
          line-height: 1.25;
          font-weight: 800;
          letter-spacing: -0.6px;
          color: #ffffff;
        }
        #fbs-signature .q-spot-price small {
          font: 600 12px 'IBM Plex Sans Arabic', sans-serif;
          color: #f0d094;
          margin-inline-start: 6px;
        }

        #fbs-signature .q-clock {
          border-inline-start: 1px solid rgba(255, 255, 255, 0.12);
          padding-inline-start: 16px;
        }
        #fbs-signature .q-clock .q-num {
          font-size: 19px;
          font-weight: 800;
          color: #fde68a;
          letter-spacing: 1px;
        }

        #fbs-signature .q-quick-bids {
          border-inline-start: 1px solid rgba(255, 255, 255, 0.12);
          padding-inline-start: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        #fbs-signature .q-quick-bid-row {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
        }
        #fbs-signature .q-chip-bid {
          padding: 5px 9px;
          border-radius: 16px;
          border: 1px solid rgba(229, 193, 128, 0.4);
          background: rgba(229, 193, 128, 0.14);
          color: #fce8c3;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        #fbs-signature .q-chip-bid:hover {
          background: rgba(229, 193, 128, 0.28);
          transform: translateY(-1px);
        }

        #fbs-signature .q-spot-action {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        #fbs-signature .q-button-gold {
          height: 42px;
          padding: 0 18px;
          border-radius: 21px;
          background: linear-gradient(135deg, #fbe8c2 0%, #e4be78 52%, #c29243 100%);
          color: #181105;
          border: 1px solid #faeccf;
          font-size: 12.5px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(217, 184, 127, 0.3);
          transition: all 0.2s ease;
        }
        #fbs-signature .q-button-gold:hover {
          background: linear-gradient(135deg, #fff2d6 0%, #ecc985 52%, #cf9e4e 100%);
          transform: translateY(-1px);
        }

        #fbs-signature .q-bookmark {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          padding: 0;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.06);
          color: #e2e8f0;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        #fbs-signature .q-bookmark[aria-pressed="true"] {
          color: #fae5bc;
          border-color: #f0d094;
          background: rgba(229, 193, 128, 0.26);
        }

        /* Landmark 02 Grid */
        #fbs-signature .q-account-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.8fr) minmax(0, 1.05fr);
          gap: 22px;
          align-items: stretch;
          margin-top: 14px;
        }

        #fbs-signature .q-section-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        #fbs-signature .q-section-title h2 {
          font-size: 16.5px;
          font-weight: 700;
          color: var(--q-ink);
          margin: 0;
        }

        #fbs-signature .q-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: var(--q-gold-soft);
          padding: 5px 12px;
          border: 1px solid rgba(217, 184, 127, 0.35);
          border-radius: 20px;
          color: var(--q-gold);
          font-size: 11.5px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
        }

        /* 4-Card Spatial KPI Grid with Generous Breathing Room */
        #fbs-signature .q-overview {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        #fbs-signature .q-stat {
          background: var(--q-paper);
          border: 1px solid var(--q-line);
          border-radius: 22px;
          padding: 22px 20px;
          box-shadow: var(--card-shadow);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 125px;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        #fbs-signature .q-stat:hover {
          transform: translateY(-2px);
          border-color: var(--q-gold);
        }

        #fbs-signature .q-stat-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--q-muted);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        #fbs-signature .q-stat-label svg {
          color: var(--q-gold);
        }

        #fbs-signature .q-stat-value {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-top: 10px;
        }
        #fbs-signature .q-stat-value .q-num {
          font-size: clamp(24px, 2.4vw, 30px);
          font-weight: 800;
          line-height: 1.2;
          color: var(--q-ink);
        }
        #fbs-signature .q-stat-value small {
          font-size: 11.5px;
          color: var(--q-muted);
        }

        #fbs-signature .q-stat-trend {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-top: 8px;
          font-size: 11px;
          color: var(--q-good);
          font-weight: 600;
        }

        /* Sovereign Valuation Growth Curve */
        #fbs-signature .q-analytics-card {
          margin-top: 18px;
          background: var(--q-paper);
          border: 1px solid var(--q-line);
          border-radius: 24px;
          padding: 20px 22px;
          box-shadow: var(--card-shadow);
        }

        #fbs-signature .q-chart-wrap {
          margin-top: 8px;
          padding: 12px;
          border-radius: 16px;
          background: var(--q-chart-wrap-bg);
          border: 1px solid var(--q-line);
        }

        #fbs-signature .q-chart-metrics {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid var(--q-line);
          font-size: 11px;
        }
        #fbs-signature .q-chart-metrics span {
          color: var(--q-muted);
        }
        #fbs-signature .q-chart-metrics strong {
          display: block;
          font-size: 13.5px;
          color: var(--q-gold);
          margin-top: 2px;
        }

        /* Activity Milestones */
        #fbs-signature .q-activity {
          margin-top: 18px;
          background: var(--q-paper);
          border: 1px solid var(--q-line);
          border-radius: 24px;
          padding: 20px 22px;
          box-shadow: var(--card-shadow);
        }

        #fbs-signature .q-event {
          display: grid;
          grid-template-columns: 32px 1fr auto;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
        }
        #fbs-signature .q-event + .q-event {
          border-top: 1px solid var(--q-line);
        }
        #fbs-signature .q-event-mark {
          display: grid;
          place-items: center;
          width: 32px;
          height: 32px;
          border: 1px solid rgba(217, 184, 127, 0.4);
          background: var(--q-gold-soft);
          color: var(--q-gold);
          border-radius: 10px;
        }
        #fbs-signature .q-event p {
          font-size: 12.5px;
          font-weight: 700;
          color: var(--q-ink);
          margin: 0;
        }
        #fbs-signature .q-event small {
          color: var(--q-muted);
          font-size: 11px;
          display: block;
          margin-top: 2px;
        }
        #fbs-signature .q-event-time {
          color: var(--q-muted);
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--q-line);
        }

        /* High-Contrast Luxury Escrow Wallet Card (Adaptive to Light & Dark Modes) */
        #fbs-signature:not([data-theme="dark"]) .q-wallet,
        #fbs-signature[data-theme="light"] .q-wallet {
          position: relative;
          padding: 26px 28px;
          border-radius: 26px;
          background: linear-gradient(150deg, #ffffff 0%, #fbf9f4 55%, #f4ede0 100%);
          border: 1.5px solid rgba(184, 146, 72, 0.45);
          box-shadow: 0 16px 36px rgba(26, 37, 65, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9);
          color: #1a2541;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        #fbs-signature:not([data-theme="dark"]) .q-wallet-top,
        #fbs-signature[data-theme="light"] .q-wallet-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          position: relative;
          z-index: 1;
          font-size: 13.5px;
          font-weight: 700;
          color: #1a2541;
        }
        #fbs-signature:not([data-theme="dark"]) .q-wallet-seal,
        #fbs-signature[data-theme="light"] .q-wallet-seal {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          color: #926417;
          border: 1px solid rgba(184, 146, 72, 0.45);
          background: rgba(184, 146, 72, 0.12);
        }
        #fbs-signature:not([data-theme="dark"]) .q-wallet-caption,
        #fbs-signature[data-theme="light"] .q-wallet-caption {
          font-size: 12.5px;
          color: #64748b;
          margin-top: 18px;
          font-weight: 500;
        }
        #fbs-signature:not([data-theme="dark"]) .q-wallet-amount,
        #fbs-signature[data-theme="light"] .q-wallet-amount {
          font-size: clamp(28px, 3.2vw, 38px);
          font-weight: 800;
          line-height: 1.25;
          letter-spacing: -1px;
          color: #0f172a;
          margin-top: 6px;
        }
        #fbs-signature:not([data-theme="dark"]) .q-wallet-amount small,
        #fbs-signature[data-theme="light"] .q-wallet-amount small {
          font: 700 13px 'IBM Plex Sans Arabic', sans-serif;
          color: #926417;
          margin-inline-start: 6px;
        }
        #fbs-signature:not([data-theme="dark"]) .q-wallet-power,
        #fbs-signature[data-theme="light"] .q-wallet-power {
          margin-top: 16px;
          padding: 12px 16px;
          border-radius: 14px;
          background: rgba(184, 146, 72, 0.08);
          border: 1px solid rgba(184, 146, 72, 0.3);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
          color: #475569;
        }
        #fbs-signature:not([data-theme="dark"]) .q-wallet-power strong,
        #fbs-signature[data-theme="light"] .q-wallet-power strong {
          color: #926417;
          font-size: 14.5px;
        }
        #fbs-signature:not([data-theme="dark"]) .q-wallet-perks,
        #fbs-signature[data-theme="light"] .q-wallet-perks {
          margin-top: 16px;
          display: grid;
          gap: 10px;
          font-size: 12.5px;
          color: #334155;
        }
        #fbs-signature:not([data-theme="dark"]) .q-wallet-perk,
        #fbs-signature[data-theme="light"] .q-wallet-perk {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        #fbs-signature:not([data-theme="dark"]) .q-wallet-perk svg,
        #fbs-signature[data-theme="light"] .q-wallet-perk svg {
          color: #926417;
          flex-shrink: 0;
        }
        #fbs-signature:not([data-theme="dark"]) .q-wallet-status,
        #fbs-signature[data-theme="light"] .q-wallet-status {
          font-size: 12.5px;
          color: #047857;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          padding: 8px 12px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 16px;
          font-weight: 700;
        }
        #fbs-signature:not([data-theme="dark"]) .q-wallet-rule,
        #fbs-signature[data-theme="light"] .q-wallet-rule {
          height: 1px;
          margin: 20px 0 16px;
          background: rgba(184, 146, 72, 0.25);
        }
        #fbs-signature:not([data-theme="dark"]) .q-wallet-serial,
        #fbs-signature[data-theme="light"] .q-wallet-serial {
          font: 700 11px 'Manrope', sans-serif;
          letter-spacing: 2px;
          color: #64748b;
          margin-bottom: 16px;
          display: flex;
          justify-content: space-between;
        }
        #fbs-signature:not([data-theme="dark"]) .q-wallet-serial span:last-child,
        #fbs-signature[data-theme="light"] .q-wallet-serial span:last-child {
          color: #926417;
        }
        #fbs-signature:not([data-theme="dark"]) .q-wallet-btn,
        #fbs-signature[data-theme="light"] .q-wallet-btn {
          width: 100%;
          height: 42px;
          border-radius: 21px;
          background: linear-gradient(135deg, #162438, #0d1522);
          border: 1px solid #162438;
          color: #fae5bc;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(13, 21, 34, 0.2);
        }
        #fbs-signature:not([data-theme="dark"]) .q-wallet-btn:hover,
        #fbs-signature[data-theme="light"] .q-wallet-btn:hover {
          background: linear-gradient(135deg, #1f3350, #131c2b);
          color: #ffffff;
          transform: translateY(-1px);
        }

        /* Dark Mode Escrow Wallet Card */
        #fbs-signature[data-theme="dark"] .q-wallet {
          position: relative;
          padding: 26px 28px;
          border-radius: 26px;
          background: linear-gradient(145deg, #131c2b 0%, #0d1522 55%, #162438 100%);
          border: 1px solid rgba(229, 193, 128, 0.42);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45);
          color: #ffffff;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        #fbs-signature[data-theme="dark"] .q-wallet-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          position: relative;
          z-index: 1;
          font-size: 13.5px;
          font-weight: 700;
          color: #ffffff;
        }
        #fbs-signature[data-theme="dark"] .q-wallet-seal {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          color: #fae5bc;
          border: 1px solid rgba(229, 193, 128, 0.55);
          background: rgba(229, 193, 128, 0.18);
        }
        #fbs-signature[data-theme="dark"] .q-wallet-caption {
          font-size: 12.5px;
          color: #94a3b8;
          margin-top: 18px;
          font-weight: 500;
        }
        #fbs-signature[data-theme="dark"] .q-wallet-amount {
          font-size: clamp(28px, 3.2vw, 38px);
          font-weight: 800;
          line-height: 1.25;
          letter-spacing: -1px;
          color: #ffffff;
          margin-top: 6px;
        }
        #fbs-signature[data-theme="dark"] .q-wallet-amount small {
          font: 700 13px 'IBM Plex Sans Arabic', sans-serif;
          color: #f0d094;
          margin-inline-start: 6px;
        }
        #fbs-signature[data-theme="dark"] .q-wallet-power {
          margin-top: 16px;
          padding: 12px 16px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(229, 193, 128, 0.3);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
          color: #cbd5e1;
        }
        #fbs-signature[data-theme="dark"] .q-wallet-power strong {
          color: #fae5bc;
          font-size: 14.5px;
        }
        #fbs-signature[data-theme="dark"] .q-wallet-perks {
          margin-top: 16px;
          display: grid;
          gap: 10px;
          font-size: 12.5px;
          color: #e2e8f0;
        }
        #fbs-signature[data-theme="dark"] .q-wallet-perk {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        #fbs-signature[data-theme="dark"] .q-wallet-perk svg {
          color: #f0d094;
          flex-shrink: 0;
        }
        #fbs-signature[data-theme="dark"] .q-wallet-status {
          font-size: 12.5px;
          color: #34d399;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          padding: 8px 12px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 16px;
          font-weight: 700;
        }
        #fbs-signature[data-theme="dark"] .q-wallet-rule {
          height: 1px;
          margin: 20px 0 16px;
          background: rgba(255, 255, 255, 0.12);
        }
        #fbs-signature[data-theme="dark"] .q-wallet-serial {
          font: 700 11px 'Manrope', sans-serif;
          letter-spacing: 2px;
          color: #94a3b8;
          margin-bottom: 16px;
          display: flex;
          justify-content: space-between;
        }
        #fbs-signature[data-theme="dark"] .q-wallet-serial span:last-child {
          color: #fae5bc;
        }
        #fbs-signature[data-theme="dark"] .q-wallet-btn {
          width: 100%;
          height: 42px;
          border-radius: 21px;
          background: linear-gradient(135deg, rgba(229, 193, 128, 0.32), rgba(229, 193, 128, 0.14));
          border: 1px solid rgba(229, 193, 128, 0.55);
          color: #fff2d6;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s ease;
        }
        #fbs-signature[data-theme="dark"] .q-wallet-btn:hover {
          background: linear-gradient(135deg, rgba(229, 193, 128, 0.45), rgba(229, 193, 128, 0.22));
          transform: translateY(-1px);
        }

        /* Landmark 03 Showroom Catalog */
        #fbs-signature .q-collections {
          background: var(--q-paper);
          border: 1px solid var(--q-line);
          border-radius: 28px;
          padding: 22px 26px;
          margin-top: 18px;
          box-shadow: var(--card-shadow);
        }

        #fbs-signature .q-catalog-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 18px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--q-line);
        }

        #fbs-signature .q-tabs {
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(0, 0, 0, 0.18);
          padding: 4px;
          border-radius: 24px;
          border: 1px solid var(--q-line);
        }
        #fbs-signature[data-theme="light"] .q-tabs {
          background: rgba(15, 23, 42, 0.05);
        }
        #fbs-signature .q-tabs button {
          background: none;
          border: 1px solid transparent;
          border-radius: 20px;
          padding: 7px 16px;
          color: var(--q-muted);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        #fbs-signature .q-tabs button[aria-selected="true"] {
          color: var(--q-ink);
          background: var(--q-paper-strong);
          border-color: rgba(217, 184, 127, 0.4);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        #fbs-signature .q-search-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 0, 0, 0.18);
          border: 1px solid var(--q-line);
          border-radius: 20px;
          padding: 7px 14px;
          min-width: 250px;
          flex: 1 1 220px;
          max-width: 340px;
        }
        #fbs-signature[data-theme="light"] .q-search-wrap {
          background: #ffffff;
        }
        #fbs-signature .q-search-wrap input {
          border: 0;
          background: transparent;
          color: var(--q-ink);
          font-size: 12.5px;
          width: 100%;
          outline: none;
          font-family: inherit;
        }

        #fbs-signature .q-lots-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        #fbs-signature .q-lot {
          display: grid;
          grid-template-columns: 140px minmax(0, 1fr) auto;
          align-items: center;
          gap: 20px;
          padding: 20px 22px;
          background: var(--q-paper-strong);
          border: 1px solid var(--q-line);
          border-radius: 22px;
          box-shadow: var(--card-shadow);
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        #fbs-signature .q-lot:hover {
          transform: translateY(-2px);
          border-color: var(--q-gold);
        }

        #fbs-signature .q-lot-plate-stack {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          width: 140px;
          flex-shrink: 0;
        }

        #fbs-signature .q-lot-plate-rarity {
          display: block;
          width: 100%;
          text-align: center;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0;
          white-space: nowrap;
        }
        #fbs-signature:not([data-theme="dark"]) .q-lot-plate-rarity,
        #fbs-signature[data-theme="light"] .q-lot-plate-rarity {
          color: #926417;
          background: #fffbeb;
          border: 1px solid rgba(184, 146, 72, 0.45);
          box-shadow: 0 1px 3px rgba(184, 146, 72, 0.1);
        }
        #fbs-signature[data-theme="dark"] .q-lot-plate-rarity {
          color: #fef3c7;
          background: rgba(229, 193, 128, 0.2);
          border: 1px solid rgba(229, 193, 128, 0.5);
        }

        #fbs-signature .q-mini-plate {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          direction: ltr;
          text-align: center;
          min-height: 58px;
          color: #141c26;
          border: 2px solid #a3aab2;
          border-radius: 10px;
          background: linear-gradient(135deg, #ffffff, #e9e7e0);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          font-weight: 800;
          overflow: hidden;
        }
        #fbs-signature .q-mini-plate-col {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 4px;
          font-size: 15px;
          line-height: 1.25;
        }
        #fbs-signature .q-mini-plate-col + .q-mini-plate-col {
          border-left: 1.5px solid #49525b;
        }
        #fbs-signature .q-mini-plate-col small {
          font: 800 10.5px/1.3 'Manrope', sans-serif;
          letter-spacing: 1.5px;
          border-top: 1px solid #49525b;
          margin-top: 2px;
          padding-top: 2px;
        }

        #fbs-signature .q-lot-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        #fbs-signature .q-lot-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--q-ink);
          margin: 0;
        }
        #fbs-signature .q-lot-category {
          font-size: 12px;
          color: var(--q-muted);
          margin: 0;
        }

        #fbs-signature .q-lot-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 8px;
          flex-wrap: wrap;
        }
        #fbs-signature .q-lot-price {
          font-size: 13.5px;
          font-weight: 800;
          color: var(--q-gold);
        }
        #fbs-signature .q-lot-state {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 600;
          color: var(--q-good);
          background: var(--q-good-bg);
          padding: 3px 9px;
          border-radius: 20px;
        }
        #fbs-signature .q-lot-state::before {
          content: '';
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
        }

        #fbs-signature .q-lot-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: flex-end;
        }
        #fbs-signature .q-lot-more {
          width: 38px;
          height: 38px;
          background: var(--q-gold-soft);
          border: 1px solid rgba(217, 184, 127, 0.4);
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: var(--q-gold);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        #fbs-signature .q-lot-more:hover {
          background: var(--q-gold);
          color: #161106;
          transform: scale(1.06);
        }

        #fbs-signature .q-lot-empty {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          padding: 14px 18px;
          border: 1px solid var(--q-line);
          background: rgba(255, 255, 255, 0.04);
          border-radius: 16px;
          color: var(--q-muted);
          font-size: 12px;
          margin-bottom: 14px;
        }

        /* Comprehensive Profile Settings Styles */
        #fbs-signature .q-profile-card {
          background: var(--q-paper);
          border: 1px solid var(--q-line);
          border-radius: 26px;
          padding: 28px;
          box-shadow: var(--card-shadow);
        }
        #fbs-signature .q-profile-avatar-row {
          display: flex;
          align-items: center;
          gap: 20px;
          padding-bottom: 22px;
          border-bottom: 1px solid var(--q-line);
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        #fbs-signature .q-profile-avatar-large {
          width: 76px;
          height: 76px;
          border-radius: 20px;
          background: linear-gradient(135deg, #d9b87f, #8c6721);
          color: #121824;
          display: grid;
          place-items: center;
          font-size: 28px;
          font-weight: 800;
          border: 3px solid rgba(217, 184, 127, 0.4);
          box-shadow: 0 6px 20px rgba(217, 184, 127, 0.3);
        }
        #fbs-signature .q-profile-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }
        #fbs-signature .q-field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        #fbs-signature .q-field-group label {
          font-size: 12px;
          font-weight: 600;
          color: var(--q-muted);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        #fbs-signature .q-field-input {
          padding: 12px 16px;
          border-radius: 14px;
          border: 1px solid var(--q-line);
          background: var(--q-bg);
          color: var(--q-ink);
          font-size: 13px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s ease;
        }
        #fbs-signature .q-field-input:focus {
          border-color: var(--q-gold);
        }
        #fbs-signature .q-status-pill-ok {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: var(--q-good);
          font-weight: 600;
        }

        #fbs-signature .q-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          font-size: 11px;
          color: var(--q-muted);
          margin-top: 26px;
          padding-top: 16px;
          border-top: 1px solid var(--q-line);
        }

        /* Modal Dialog Overlay */
        #fbs-signature .q-overlay {
          position: fixed;
          inset: 0;
          z-index: 60;
          background: rgba(4, 7, 15, 0.75);
          backdrop-filter: blur(16px);
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow-y: auto;
        }

        #fbs-signature .q-dialog {
          width: min(100%, 500px);
          border: 1px solid rgba(217, 184, 127, 0.35);
          border-radius: 26px;
          background: var(--q-paper);
          padding: 24px 26px;
          color: var(--q-ink);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.65);
        }

        #fbs-signature .q-dialog-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--q-line);
        }
        #fbs-signature .q-dialog h2 {
          font-size: 18px;
          font-weight: 700;
          color: var(--q-gold);
          margin: 0;
        }

        #fbs-signature .q-dialog p {
          color: var(--q-muted);
          font-size: 12.5px;
          line-height: 1.65;
          margin: 0 0 14px;
        }

        #fbs-signature .q-detail {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          padding: 10px 0;
          border-bottom: 1px solid var(--q-line);
          font-size: 12.5px;
        }

        #fbs-signature .q-dialog-form {
          display: grid;
          gap: 12px;
          margin-top: 16px;
        }
        #fbs-signature .q-dialog-form label {
          display: grid;
          gap: 5px;
          font-size: 11.5px;
          font-weight: 600;
          color: var(--q-muted);
        }
        #fbs-signature .q-dialog-form input,
        #fbs-signature .q-dialog-form select {
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid var(--q-line);
          background: rgba(0, 0, 0, 0.2);
          color: var(--q-ink);
          font-size: 12.5px;
          font-family: inherit;
        }
        #fbs-signature[data-theme="light"] .q-dialog-form input,
        #fbs-signature[data-theme="light"] .q-dialog-form select {
          background: #ffffff;
        }

        #fbs-signature .q-dialog-note {
          background: var(--q-gold-soft);
          border: 1px solid rgba(217, 184, 127, 0.35);
          border-radius: 12px;
          color: var(--q-gold) !important;
          padding: 10px 12px;
          margin-top: 14px !important;
          font-size: 11px !important;
        }

        #fbs-signature .q-toast {
          position: fixed;
          z-index: 70;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          padding: 11px 22px;
          background: var(--q-paper);
          border: 1px solid var(--q-gold);
          border-radius: 20px;
          box-shadow: 0 12px 36px rgba(0,0,0,0.3);
          color: var(--q-gold);
          font-size: 12px;
          font-weight: 600;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1200px) {
          #fbs-signature .q-hero-grid {
            grid-template-columns: 1fr;
          }
          #fbs-signature .q-account-grid {
            grid-template-columns: 1fr;
          }
          #fbs-signature .q-lots-grid {
            grid-template-columns: 1fr;
          }
          #fbs-signature .q-profile-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 860px) {
          #fbs-signature .q-shell {
            grid-template-columns: 1fr;
          }
          #fbs-signature .q-rail {
            display: none;
          }
          #fbs-signature .q-rail.q-open {
            display: flex;
            position: fixed;
            z-index: 40;
            inset-inline-start: 12px;
            top: 76px;
            width: 140px;
            height: auto;
            max-height: 80vh;
            border-radius: 20px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
          }
          #fbs-signature .q-menu {
            display: grid;
          }
          #fbs-signature .q-overview {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          #fbs-signature .q-spot-bottom {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 640px) {
          #fbs-signature .q-spot-headline {
            white-space: normal;
            font-size: 24px;
          }
          #fbs-signature .q-spot-bottom {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          #fbs-signature .q-clock, #fbs-signature .q-quick-bids {
            border-inline-start: none;
            padding-inline-start: 0;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 10px;
          }
          #fbs-signature .q-lot {
            grid-template-columns: 1fr;
          }
          #fbs-signature .q-chart-metrics {
            grid-template-columns: 1fr;
          }
          #fbs-signature .q-location {
            display: none;
          }
          #fbs-signature .q-topbar {
            padding: 0 16px;
          }
          #fbs-signature .q-main {
            padding: 16px;
          }
        }
      `}} />

      <div id="fbs-signature" data-theme={theme} suppressHydrationWarning aria-label="FBS Signature، لوحة تحكم النخبة للمقتنيات السيادية">
        <div className="q-shell">
          {/* Iconic Navigation Rail (125px with luxury spacing) */}
          <aside className={`q-rail ${mobileMenuOpen ? 'q-open' : ''}`} aria-label="التنقل الرئيسي">
            <Link href="/" className="q-logo">
              FBS
              <small>النخبة</small>
            </Link>

            <nav className="q-nav" aria-label="أقسام الحساب">
              <Link
                href="/account"
                aria-current={activeSectionKey === 'overview' ? 'page' : undefined}
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard size={20} strokeWidth={1.8} />
                <span>نظرة عامة</span>
              </Link>

              <Link
                href="/account/auctions"
                aria-current={activeSectionKey === 'auctions' ? 'page' : undefined}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Gavel size={20} strokeWidth={1.8} />
                <span>مزاداتي</span>
              </Link>

              <Link
                href="/account/plates"
                aria-current={activeSectionKey === 'plates' ? 'page' : undefined}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Car size={20} strokeWidth={1.8} />
                <span>لوحاتي</span>
              </Link>

              <Link
                href="/account/favorites"
                aria-current={activeSectionKey === 'favorites' ? 'page' : undefined}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Bookmark size={20} strokeWidth={1.8} />
                <span>المفضلة</span>
              </Link>

              <Link
                href="/account/deposits"
                aria-current={activeSectionKey === 'deposits' ? 'page' : undefined}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Wallet size={20} strokeWidth={1.8} />
                <span>المحفظة</span>
              </Link>

              <Link
                href="/account/security"
                aria-current={activeSectionKey === 'security' ? 'page' : undefined}
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShieldCheck size={20} strokeWidth={1.8} />
                <span>الأمان</span>
              </Link>
            </nav>

            <div className="q-rail-bottom">
              <button
                type="button"
                className="q-icon-button"
                aria-label="المستشار الخاص"
                title="المستشار الخاص على مدار الساعة"
                onClick={() => setActiveModal('support')}
              >
                <Headphones size={18} strokeWidth={1.8} />
              </button>

              <Link
                href="/account/profile"
                className="q-avatar"
                aria-label={`حساب ${userName}`}
                title="الملف السيادي"
              >
                {avatarInitial}
              </Link>
            </div>
          </aside>

          {/* Main Workspace */}
          <div className="q-workspace">
            {/* Top Bar with Platform Logo, Home Navigation, Breadcrumbs & Theme Switcher */}
            <header className="q-topbar">
              <div className="q-topbar-right">
                <button
                  type="button"
                  className="q-icon-button q-menu"
                  aria-label="فتح القائمة"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <LayoutDashboard size={18} />
                </button>

                {/* Platform Brand Logo in Header inside an elevated high-contrast capsule */}
                <Link href="/" className="q-topbar-brand" title="الرئيسية · دار فارس بن سعود للوحات المميزة">
                  <div className="q-topbar-brand-capsule">
                    <img
                      src="/brand/fbs-logo-official.svg"
                      alt="دار فارس بن سعود للوحات المميزة - FBS"
                      className="q-topbar-logo-img"
                    />
                  </div>
                </Link>

                <div className="q-topbar-divider" />

                {/* Direct Home Navigation Button */}
                <Link href="/" className="q-home-button" title="الانتقال إلى الصفحة الرئيسية">
                  <Home size={14} />
                  <span>الرئيسية</span>
                </Link>

                <div className="q-location">
                  <span className="q-breadcrumb">المساحة السيادية</span>
                  <ChevronLeft size={14} />
                  <strong>لوحة التحكم التنفيذية</strong>
                </div>
              </div>

              <div className="q-top-actions">
                <div className="q-theme" role="group" aria-label="اختر الثيم">
                  <button
                    type="button"
                    aria-label="الثيم الفاتح"
                    aria-pressed={theme === 'light'}
                    onClick={() => switchTheme('light')}
                  >
                    <Sun size={14} />
                    <span>فاتح</span>
                  </button>
                  <button
                    type="button"
                    aria-label="الثيم الغامق"
                    aria-pressed={theme === 'dark'}
                    onClick={() => switchTheme('dark')}
                  >
                    <Moon size={14} />
                    <span>غامق</span>
                  </button>
                </div>

                <Link
                  href="/account/notifications"
                  className="q-icon-button q-notification"
                  aria-label="الإشعارات"
                  title="مركز الإشعارات السيادية"
                >
                  <Bell size={18} />
                </Link>
              </div>
            </header>

            {/* Main Scrollable Content Area with 1400px Max-Width Centered Container */}
            <main className="q-main">
              <div className="q-main-container">
                {/* Executive Welcome Greeting */}
                <div className="q-greeting">
                  <div>
                    <div className="q-eyebrow">
                      <Crown size={13} />
                      SOVEREIGN CONCIERGE · KSA
                    </div>
                    <h1>التميّز السيادي يبدأ من هنا.</h1>
                    <p>أهلاً بك أستاذ {userName} — مساحتك الخاصة لإدارة اللوحات الملكية والمزادات الموثقة عبر النفاذ الوطني وأبشر.</p>
                  </div>
                  <div className="q-greet-actions">
                    <span className="q-vip">
                      <Crown size={15} />
                      عضوية النخبة · Centurion VIP
                    </span>
                    <button
                      type="button"
                      className="q-button-greet"
                      onClick={() => setActiveModal('add')}
                    >
                      <Plus size={15} />
                      <span>اعرض لوحتك</span>
                    </button>
                  </div>
                </div>

                {/* OVERVIEW SECTION (THE SIGNATURE SHOWCASE) */}
                {isOverview && (
                  <>
                    {/* SECTION 1: Sovereign Spotlight Stage (Clean title & SVG Badge without 01) */}
                    <div>
                      <div className="q-section-header">
                        <div className="q-section-title-wrap">
                          <span className="q-section-icon-badge">
                            <Gavel size={16} />
                          </span>
                          <h2>المزاد المباشر</h2>
                        </div>
                      </div>

                      <section className="q-spotlight" aria-label="المزاد السيادي المباشر">
                        <div className="q-spot-top">
                          <div className="q-collection-badge">
                            <Crown size={15} style={{ color: '#d9b87f' }} />
                            <span>المجموعة الملكية الفاخرة · THE ROYAL COLLECTION</span>
                          </div>

                          {/* Interactive Lot Switcher */}
                          <div className="q-lot-switcher" role="group" aria-label="اختيار المقتنى المعروض">
                            {heroLots.map((lot, idx) => (
                              <button
                                key={lot.id}
                                type="button"
                                className="q-lot-pill"
                                aria-pressed={heroIndex === idx}
                                onClick={() => setHeroIndex(idx)}
                              >
                                {lot.letAr} {lot.numAr} · {lot.code.replace('EXCLUSIVE LOT / ', 'LOT ')}
                              </button>
                            ))}
                          </div>

                          <span className="q-live">
                            مزاد حي مباشر · صالة النخبة
                          </span>
                        </div>

                        <div className="q-hero-grid">
                          <div className="q-spot-copy">
                            <div className="q-spot-number">
                              <span>{currentHero.code}</span>
                            </div>

                            <h2 className="q-spot-headline" dangerouslySetInnerHTML={{ __html: currentHero.headline }} />

                            <p className="q-spot-desc">{currentHero.desc}</p>

                            <div className="q-specs-row">
                              <span className="q-spec-tag">
                                <ShieldCheck size={13} style={{ color: '#6ee7b7' }} />
                                شهادة أصالة معتمدة
                              </span>
                              <span className="q-spec-tag">
                                <Zap size={13} style={{ color: '#fde68a' }} />
                                إفراغ فوري (أبشر)
                              </span>
                              <span className="q-spec-tag">
                                <Users size={13} style={{ color: '#93c5fd' }} />
                                <span className="q-num">{currentHero.bidders}</span> مزايداً معتمداً
                              </span>
                            </div>

                            <div className="q-qualified">
                              <BadgeCheck size={16} />
                              <span>أنت مؤهل للمشاركة في هذا المزاد — سقف ضمانك المصرفي يغطي هذا المزاد</span>
                            </div>

                            {/* Live Order Book Feed */}
                            <div className="q-orderbook" aria-label="سجل أحدث العطاءات">
                              <div className="q-orderbook-head">
                                <span>دفتر العطاءات اللحظي (Live Order Book)</span>
                                <span>موثّق عبر SAB Escrow</span>
                              </div>
                              <div className="q-orderbook-row">
                                <span>{currentHero.lastBidder} · {currentHero.city}</span>
                                <strong className="q-num" style={{ color: '#f4d69c' }}>
                                  {formatNumber(currentHero.price)} SAR
                                </strong>
                              </div>
                              <div className="q-orderbook-row">
                                <span>مكتب عائلي خاص #118 · جدة</span>
                                <span className="q-num" style={{ color: 'var(--q-muted)' }}>
                                  {formatNumber(Math.max(100000, currentHero.price - 25000))} SAR
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* 3D Perspective Saudi Vehicle Plate Vitrine */}
                          <div className="q-object">
                            <div className="q-vitrine-hud">
                              <span>
                                <Gem size={14} style={{ color: '#f0d094' }} />
                                معاينة مكانية تفاعلية · 1:1
                              </span>
                              <span className="q-vitrine-rarity">
                                {currentHero.rarity}
                              </span>
                              <span style={{ color: '#6ee7b7' }}>
                                <ShieldCheck size={13} />
                                مُصدّقة من المرور وأبشر
                              </span>
                            </div>

                            <div
                              className="q-plate"
                              data-finish={plateFinish}
                              data-angle={plateAngle}
                              role="img"
                              aria-label={`لوحة سعودية ${currentHero.letAr} ${currentHero.numAr}`}
                            >
                              <span className="q-bolt q-bolt-a" />
                              <span className="q-bolt q-bolt-b" />
                              <span className="q-bolt q-bolt-c" />
                              <span className="q-bolt q-bolt-d" />
                              <div className="q-plate-col">
                                <span>{currentHero.numAr}</span>
                                <span>{currentHero.numEn}</span>
                              </div>
                              <div className="q-plate-col">
                                <span className="q-letters">{currentHero.letAr}</span>
                                <span>{currentHero.letEn}</span>
                              </div>
                              <div className="q-kingdom">
                                <Palmtree size={22} />
                                <span>السعودية</span>
                                <span>KSA</span>
                              </div>
                            </div>

                            {/* Plate Finishes & Angle Controls */}
                            <div className="q-stage-controls">
                              <div className="q-finish-bar" role="group" aria-label="طراز اللوحة">
                                <button
                                  type="button"
                                  className="q-finish-btn"
                                  aria-pressed={plateFinish === 'official'}
                                  onClick={() => setPlateFinish('official')}
                                >
                                  الشعار الرسمي
                                </button>
                                <button
                                  type="button"
                                  className="q-finish-btn"
                                  aria-pressed={plateFinish === 'royal'}
                                  onClick={() => setPlateFinish('royal')}
                                >
                                  الإصدار الملكي
                                </button>
                                <button
                                  type="button"
                                  className="q-finish-btn"
                                  aria-pressed={plateFinish === 'titanium'}
                                  onClick={() => setPlateFinish('titanium')}
                                >
                                  التيتانيوم
                                </button>
                              </div>

                              <div className="q-finish-bar" role="group" aria-label="زاوية العرض">
                                <button
                                  type="button"
                                  className="q-finish-btn"
                                  aria-pressed={plateAngle === 'perspective'}
                                  onClick={() => setPlateAngle('perspective')}
                                >
                                  منظور 3D
                                </button>
                                <button
                                  type="button"
                                  className="q-finish-btn"
                                  aria-pressed={plateAngle === 'flat'}
                                  onClick={() => setPlateAngle('flat')}
                                >
                                  واجهة أمامية
                                </button>
                                <button
                                  type="button"
                                  className="q-finish-btn"
                                  aria-pressed={plateAngle === 'dramatic'}
                                  onClick={() => setPlateAngle('dramatic')}
                                >
                                  سينمائي
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Spotlight Bottom Action Bar */}
                        <div className="q-spot-bottom">
                          <div>
                            <div className="q-spot-label">
                              <span>أعلى مزايدة موثّقة</span>
                              <span className="q-spot-bidder-dot">·</span>
                              <span className="q-spot-bidder-text">{currentHero.lastBidder}</span>
                            </div>
                            <div className="q-spot-price">
                              <span className="q-num">{formatNumber(currentHero.price)}</span>
                              <small>ر.س</small>
                            </div>
                          </div>

                          <div className="q-clock">
                            <div className="q-spot-label">يُغلق المزاد خلال</div>
                            <div className="q-num">{hrs} : {mins} : {secs}</div>
                          </div>

                          {/* Interactive Quick Bids */}
                          <div className="q-quick-bids">
                            <div className="q-spot-label">مزايدة فورية معتمدة</div>
                            <div className="q-quick-bid-row">
                              <button
                                type="button"
                                className="q-chip-bid"
                                onClick={() => handleQuickBid(25000)}
                              >
                                +25,000 ر.س
                              </button>
                              <button
                                type="button"
                                className="q-chip-bid"
                                onClick={() => handleQuickBid(50000)}
                              >
                                +50,000 ر.س
                              </button>
                              <button
                                type="button"
                                className="q-chip-bid"
                                onClick={() => handleQuickBid(100000)}
                              >
                                +100,000 ر.س
                              </button>
                            </div>
                          </div>

                          <div className="q-spot-action">
                            <button
                              type="button"
                              className="q-button-gold"
                              onClick={() => setActiveModal('live')}
                            >
                              <span>دخول المزاد</span>
                              <ArrowUpLeft size={16} />
                            </button>
                            <button
                              type="button"
                              className="q-bookmark"
                              aria-label="حفظ اللوحة"
                              aria-pressed={currentHero.saved}
                              onClick={toggleBookmarkCurrent}
                            >
                              <Bookmark size={18} fill={currentHero.saved ? 'currentColor' : 'none'} />
                            </button>
                          </div>
                        </div>
                      </section>
                    </div>

                    {/* SECTION 2: Wealth & Escrow (Clean title & SVG Badge without 02) */}
                    <div>
                      <div className="q-section-header">
                        <div className="q-section-title-wrap">
                          <span className="q-section-icon-badge">
                            <ShieldCheck size={16} />
                          </span>
                          <h2>المحفظة والضمان المصرفي</h2>
                        </div>
                        <span className="q-vip" style={{ height: '34px', padding: '0 14px' }}>
                          <BadgeCheck size={14} />
                          حساب موثّق عبر النفاذ الوطني وأبشر
                        </span>
                      </div>

                      <div className="q-account-grid">
                        <div>
                          {/* 4-Card Overview */}
                          <section aria-label="حسابك في لمحة">
                            <div className="q-overview">
                              <div className="q-stat">
                                <div className="q-stat-label">
                                  <Gem size={14} />
                                  <span>تقييم المقتنيات</span>
                                </div>
                                <div className="q-stat-value">
                                  <span className="q-num">2.48M</span>
                                  <small>ر.س</small>
                                </div>
                                <div className="q-stat-trend">
                                  <TrendingUp size={12} />
                                  <span className="q-num">+18.4%</span> عائد سنوي
                                </div>
                              </div>

                              <div className="q-stat">
                                <div className="q-stat-label">
                                  <Gavel size={14} />
                                  <span>مزادات مؤهلة</span>
                                </div>
                                <div className="q-stat-value">
                                  <span className="q-num">04</span>
                                  <small>مزادات</small>
                                </div>
                                <div className="q-stat-trend">الفئة الملكية والسيادية</div>
                              </div>

                              <div className="q-stat">
                                <div className="q-stat-label">
                                  <Car size={14} />
                                  <span>لوحاتك</span>
                                </div>
                                <div className="q-stat-value">
                                  <span className="q-num">{String(ownedPlates.length).padStart(2, '0')}</span>
                                  <small>لوحة</small>
                                </div>
                                <div className="q-stat-trend">صكوك ملكية موثّقة</div>
                              </div>

                              <div className="q-stat">
                                <div className="q-stat-label">
                                  <Bookmark size={14} />
                                  <span>المحفوظات</span>
                                </div>
                                <div className="q-stat-value">
                                  <span className="q-num">{String(savedCount).padStart(2, '0')}</span>
                                  <small>لوحة</small>
                                </div>
                                <div className="q-stat-trend">تنبيهات مزايدة فورية</div>
                              </div>
                            </div>
                          </section>

                          {/* Sovereign Market Valuation Curve */}
                          <section className="q-analytics-card" aria-label="مؤشر القيمة السوقية للوحات النادرة">
                            <div className="q-section-title">
                              <h2>مؤشر نمو قيمة اللوحات السيادية (٢٠٢٢ – ٢٠٢٦)</h2>
                              <span className="q-rarity-badge">مؤشر كافد للأصول النادرة</span>
                            </div>
                            <div className="q-chart-wrap">
                              <svg viewBox="0 0 600 130" width="100%" height="130" role="img" aria-label="منحنى صعود قيمة اللوحات الملكية بنسبة 34.2% سنوياً">
                                <defs>
                                  <linearGradient id="qGoldGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#e5c180" stopOpacity="0.45" />
                                    <stop offset="100%" stopColor="#e5c180" stopOpacity="0.0" />
                                  </linearGradient>
                                </defs>
                                <line x1="0" y1="30" x2="600" y2="30" stroke="rgba(255,255,255,0.07)" strokeDasharray="4 4" />
                                <line x1="0" y1="75" x2="600" y2="75" stroke="rgba(255,255,255,0.07)" strokeDasharray="4 4" />
                                <line x1="0" y1="115" x2="600" y2="115" stroke="rgba(255,255,255,0.12)" />
                                <path d="M 20 105 C 120 98, 190 82, 280 68 C 370 54, 450 32, 580 16 L 580 115 L 20 115 Z" fill="url(#qGoldGrad)" />
                                <path d="M 20 105 C 120 98, 190 82, 280 68 C 370 54, 450 32, 580 16" fill="none" stroke="#e5c180" strokeWidth="3" strokeLinecap="round" />
                                <circle cx="20" cy="105" r="4" fill="#e5c180" />
                                <circle cx="160" cy="88" r="4" fill="#e5c180" />
                                <circle cx="310" cy="63" r="4" fill="#e5c180" />
                                <circle cx="450" cy="36" r="4" fill="#e5c180" />
                                <circle cx="580" cy="16" r="6" fill="#fae5bc" stroke="#a67c37" strokeWidth="2" />
                                <text x="25" y="127" fill="#94a3b8" fontSize="10" fontFamily="Manrope">2022</text>
                                <text x="155" y="127" fill="#94a3b8" fontSize="10" fontFamily="Manrope">2023</text>
                                <text x="300" y="127" fill="#94a3b8" fontSize="10" fontFamily="Manrope">2024</text>
                                <text x="440" y="127" fill="#94a3b8" fontSize="10" fontFamily="Manrope">2025</text>
                                <text x="555" y="127" fill="#f0d094" fontSize="10" fontWeight="700" fontFamily="Manrope">2026</text>
                              </svg>
                              <div className="q-chart-metrics">
                                <div>
                                  <span>متوسط نمو الفئة الأحادية</span>
                                  <strong className="q-num">+34.2% سنوياً</strong>
                                </div>
                                <div>
                                  <span>معدل السيولة الفورية</span>
                                  <strong className="q-num">98.7% (طلب مرتفع)</strong>
                                </div>
                                <div>
                                  <span>متوسط زمن الإفراغ (أبشر)</span>
                                  <strong className="q-num">11 دقيقة</strong>
                                </div>
                              </div>
                            </div>
                          </section>

                          {/* Activity Feed */}
                          <section className="q-activity" aria-label="مستجدات الحساب">
                            <div className="q-section-title">
                              <h2>خطوة بخطوة، نحو اقتنائك القادم</h2>
                              <button
                                type="button"
                                className="q-link"
                                onClick={() => setActiveModal('activity')}
                              >
                                <span>السجل الكامل</span>
                                <ArrowLeft size={13} />
                              </button>
                            </div>
                            <div>
                              {activityList.map(act => (
                                <div key={act.id} className="q-event">
                                  <span className="q-event-mark">
                                    {act.icon === 'check' && <Check size={15} />}
                                    {act.icon === 'car' && <Car size={15} />}
                                    {act.icon === 'award' && <Award size={15} />}
                                  </span>
                                  <div>
                                    <p>{act.title}</p>
                                    <small>{act.subtitle}</small>
                                  </div>
                                  <span className="q-event-time">{act.time}</span>
                                </div>
                              ))}
                            </div>
                          </section>
                        </div>

                        {/* High-Contrast Escrow Wallet Card */}
                        <section className="q-wallet" aria-label="الضمان المصرفي">
                          <div>
                            <div className="q-wallet-top">
                              <span>الضمان المصرفي · SAB Private</span>
                              <div className="q-wallet-seal">
                                <ShieldCheck size={20} />
                              </div>
                            </div>

                            <div className="q-wallet-caption">رصيد الضمان المحتجز (قابل للاسترداد الفوري)</div>
                            <div className="q-wallet-amount">
                              <span className="q-num">{formatNumber(escrowDeposit)}</span>
                              <small>ر.س</small>
                            </div>

                            <div className="q-wallet-power">
                              <span>سقف المزايدة المعتمد (10x)</span>
                              <strong className="q-num">{formatNumber(escrowDeposit * 10)} ر.س</strong>
                            </div>

                            <div className="q-wallet-perks">
                              <div className="q-wallet-perk">
                                <Zap size={15} />
                                <span>ترسية فورية وإفراغ إلكتروني عبر منصة أبشر</span>
                              </div>
                              <div className="q-wallet-perk">
                                <Truck size={15} />
                                <span>نقل أمني مصفّح للوحة إلى مقر إقامتك في الرياض</span>
                              </div>
                              <div className="q-wallet-perk">
                                <UserCheck size={15} />
                                <span>إمكانية تفويض المستشار الخاص للمزايدة السرية</span>
                              </div>
                            </div>

                            <div className="q-wallet-status">
                              <BadgeCheck size={16} />
                              <span>تفويض مصرفي سارٍ · مربوط بمنصة أبشر</span>
                            </div>
                          </div>

                          <div>
                            <div className="q-wallet-rule" />
                            <div className="q-wallet-serial">
                              <span>FBS / PRIVATE ESCROW</span>
                              <span className="q-num">SA84 •••• 1101</span>
                            </div>

                            <button
                              type="button"
                              className="q-wallet-btn"
                              onClick={() => setActiveModal('wallet')}
                            >
                              <span>إدارة التأمين والائتمان</span>
                              <ArrowUpLeft size={15} />
                            </button>
                          </div>
                        </section>
                      </div>
                    </div>

                    {/* SECTION 3: Curated Catalog (Clean title & SVG Badge without 03) */}
                    <div>
                      <div className="q-section-header">
                        <div className="q-section-title-wrap">
                          <span className="q-section-icon-badge">
                            <Car size={16} />
                          </span>
                          <h2>كتالوج المقتنيات واللوحات</h2>
                        </div>
                      </div>

                      <section className="q-collections" aria-label="متابعة اللوحات">
                        <div className="q-catalog-controls">
                          <div className="q-tabs" role="tablist" aria-label="قوائم المتابعة">
                            <button
                              type="button"
                              role="tab"
                              aria-selected={tab === 'active'}
                              onClick={() => setTab('active')}
                            >
                              المزادات القادمة
                            </button>
                            <button
                              type="button"
                              role="tab"
                              aria-selected={tab === 'saved'}
                              onClick={() => setTab('saved')}
                            >
                              المحفوظات ({savedCount})
                            </button>
                            <button
                              type="button"
                              role="tab"
                              aria-selected={tab === 'plates'}
                              onClick={() => setTab('plates')}
                            >
                              لوحاتي ({ownedPlates.length})
                            </button>
                          </div>

                          <div className="q-search-wrap">
                            <Search size={14} style={{ color: 'var(--q-muted)' }} />
                            <input
                              type="search"
                              value={searchQuery}
                              onChange={e => setSearchQuery(e.target.value)}
                              placeholder="ابحث بالحروف أو الرقم (مثل: م ل ك، 111)..."
                              aria-label="ابحث في اللوحات"
                            />
                          </div>
                        </div>

                        {/* Tab 1: Active Auctions */}
                        {tab === 'active' && (
                          <div className="q-lots-grid">
                            {filteredLots.map((lot, idx) => (
                              <article key={lot.id} className="q-lot">
                                <div className="q-lot-plate-stack">
                                  <span className="q-lot-plate-rarity">{lot.rarity}</span>
                                  <div className="q-mini-plate" aria-label={`لوحة ${lot.letAr} ${lot.numAr}`}>
                                    <div className="q-mini-plate-col">
                                      <span>{lot.numAr}</span>
                                      <small>{lot.numEn}</small>
                                    </div>
                                    <div className="q-mini-plate-col">
                                      <span>{lot.letAr}</span>
                                      <small>{lot.letEn}</small>
                                    </div>
                                  </div>
                                </div>
                                <div className="q-lot-info">
                                  <h3 className="q-lot-title">
                                    لوحة {lot.letAr} {lot.numAr}
                                  </h3>
                                  <p className="q-lot-category">{lot.category} · إصدار {lot.city}</p>
                                  <div className="q-lot-meta">
                                    <span className="q-lot-price">
                                      <span className="q-num">{formatNumber(lot.price)}</span> ر.س
                                    </span>
                                    <span className="q-lot-state">مؤهل للمزايدة</span>
                                  </div>
                                </div>
                                <div className="q-lot-actions">
                                  <button
                                    type="button"
                                    className="q-lot-more"
                                    aria-label={`معاينة لوحة ${lot.letAr}`}
                                    onClick={() => {
                                      setHeroIndex(heroLots.indexOf(lot));
                                      showToast(`تم نقل لوحة (${lot.letAr} ${lot.numAr}) إلى منصة العرض المباشرة`);
                                    }}
                                    title="معاينة في منصة العرض"
                                  >
                                    <ArrowUpLeft size={16} />
                                  </button>
                                  <button
                                    type="button"
                                    className="q-icon-button"
                                    style={{ width: '34px', height: '34px', borderRadius: '50%' }}
                                    aria-label="حفظ في المفضلة"
                                    onClick={() => handleToggleLotBookmark(lot.id)}
                                  >
                                    <Bookmark size={14} fill={lot.saved ? 'currentColor' : 'none'} />
                                  </button>
                                </div>
                              </article>
                            ))}
                            {filteredLots.length === 0 && (
                              <div className="q-lot-empty" style={{ gridColumn: '1 / -1' }}>
                                لا توجد لوحات مطابقة لبحثك الحالي.
                              </div>
                            )}
                          </div>
                        )}

                        {/* Tab 2: Saved Watchlist */}
                        {tab === 'saved' && (
                          <div>
                            <div className="q-lot-empty">
                              <span>لديك <strong className="q-num">{savedCount}</strong> لوحات نادرة محفوظة في رادار المتابعة الفورية.</span>
                              <Link href="/account/favorites" className="q-link">
                                <span>استعراض المفضلة الكاملة</span>
                                <ArrowLeft size={13} />
                              </Link>
                            </div>
                            <div className="q-lots-grid">
                              {heroLots.filter(l => l.saved).map(lot => (
                                <article key={lot.id} className="q-lot">
                                  <div className="q-lot-plate-stack">
                                    <span className="q-lot-plate-rarity">{lot.rarity}</span>
                                    <div className="q-mini-plate" aria-label={`لوحة ${lot.letAr} ${lot.numAr}`}>
                                      <div className="q-mini-plate-col">
                                        <span>{lot.numAr}</span>
                                        <small>{lot.numEn}</small>
                                      </div>
                                      <div className="q-mini-plate-col">
                                        <span>{lot.letAr}</span>
                                        <small>{lot.letEn}</small>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="q-lot-info">
                                    <h3 className="q-lot-title">
                                      لوحة {lot.letAr} {lot.numAr}
                                    </h3>
                                    <p className="q-lot-category">{lot.category} · إصدار {lot.city}</p>
                                    <div className="q-lot-meta">
                                      <span className="q-lot-price">
                                        <span className="q-num">{formatNumber(lot.price)}</span> ر.س
                                      </span>
                                    </div>
                                  </div>
                                  <div className="q-lot-actions">
                                    <button
                                      type="button"
                                      className="q-lot-more"
                                      onClick={() => {
                                        setHeroIndex(heroLots.indexOf(lot));
                                        showToast(`تم عرض لوحة (${lot.letAr} ${lot.numAr})`);
                                      }}
                                    >
                                      <ArrowUpLeft size={16} />
                                    </button>
                                  </div>
                                </article>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tab 3: Owned Plates */}
                        {tab === 'plates' && (
                          <div>
                            <div className="q-lot-empty">
                              <span>صكوك اللوحات المسجلة باسمك والمربوطة بحسابك في أبشر.</span>
                              <button
                                type="button"
                                className="q-button-gold"
                                style={{ height: '36px', padding: '0 16px', fontSize: '12px' }}
                                onClick={() => setActiveModal('add')}
                              >
                                <Plus size={14} />
                                إضافة لوحة للتثمين
                              </button>
                            </div>
                            <div className="q-lots-grid">
                              {ownedPlates.map(own => (
                                <article key={own.id} className="q-lot">
                                  <div className="q-mini-plate">
                                    <div className="q-mini-plate-col">
                                      <span>{own.numAr}</span>
                                      <small>{own.numEn}</small>
                                    </div>
                                    <div className="q-mini-plate-col">
                                      <span>{own.letAr}</span>
                                      <small>{own.letEn}</small>
                                    </div>
                                  </div>
                                  <div>
                                    <h3>{own.title}</h3>
                                    <p>{own.subtitle}</p>
                                    <div className="q-lot-meta">
                                      <span className="q-lot-price">التقييم: <span className="q-num">{own.valuation}</span></span>
                                      <span className="q-lot-state">{own.status}</span>
                                    </div>
                                  </div>
                                  <div className="q-lot-actions">
                                    <Link href="/account/plates" className="q-lot-more" title="تفاصيل الصك">
                                      <ArrowUpLeft size={16} />
                                    </Link>
                                  </div>
                                </article>
                              ))}
                            </div>
                          </div>
                        )}
                      </section>
                    </div>
                  </>
                )}

                {/* OTHER SUB-SECTIONS (Auctions, Plates, Deposits, Profile, etc.) */}
                {!isOverview && (
                  <div style={{ marginTop: '10px' }}>
                    {/* AUCTIONS VIEW */}
                    {activeSectionKey === 'auctions' && (
                      <div style={{ display: 'grid', gap: '20px' }}>
                        <div className="q-spotlight" style={{ padding: '24px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <h2 style={{ fontSize: '20px', fontWeight: 700 }}>لوحة ف ب س 111 (FBS-111)</h2>
                              <p style={{ color: '#aeb8c7', fontSize: '12px', marginTop: '4px' }}>مزاد النخبة الماسي الأول · صالة الرياض المباشرة</p>
                            </div>
                            <span className="q-live">مؤهل للمزايدة الحية</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px' }}>
                            <div>
                              <span style={{ fontSize: '11px', color: '#bdc5d0' }}>أحدث قيمة مزايدة:</span>
                              <div style={{ fontSize: '26px', fontWeight: 700 }} className="q-num">750,000 ر.س</div>
                            </div>
                            <button
                              type="button"
                              className="q-button-gold"
                              onClick={() => setActiveModal('live')}
                            >
                              <span>دخول الصالة</span>
                              <ArrowUpLeft size={15} />
                            </button>
                          </div>
                        </div>

                        <div style={{ background: 'var(--q-paper)', border: '1px solid var(--q-line)', borderRadius: '24px', padding: '24px' }}>
                          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>سجل العمليات والتدقيق (Audit Trail)</h3>
                          <DataTable rows={rowsData} columns={columns} theme={theme} />
                        </div>
                      </div>
                    )}

                    {/* PLATES VIEW */}
                    {activeSectionKey === 'plates' && (
                      <div style={{ display: 'grid', gap: '20px' }}>
                        <div style={{ background: 'var(--q-paper)', border: '1px solid var(--q-line)', borderRadius: '24px', padding: '24px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                            <div>
                              <h2 style={{ fontSize: '18px', fontWeight: 700 }}>لوحة خاصة ثلاثية مميزة (س ع د ٥٥٥)</h2>
                              <p style={{ color: 'var(--q-muted)', fontSize: '12.5px', marginTop: '4px' }}>
                                الحالة: تحت المراجعة والتوثيق الرسمي عبر نظام أبشر
                              </p>
                            </div>
                            <button
                              type="button"
                              className="q-button-greet"
                              onClick={() => setActiveModal('add')}
                            >
                              <Plus size={15} />
                              <span>إضافة لوحة للتثمين</span>
                            </button>
                          </div>
                        </div>

                        <div style={{ background: 'var(--q-paper)', border: '1px solid var(--q-line)', borderRadius: '24px', padding: '24px' }}>
                          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>تفاصيل اللوحات المسجلة</h3>
                          <DataTable rows={rowsData} columns={columns} theme={theme} />
                        </div>
                      </div>
                    )}

                    {/* FAVORITES VIEW */}
                    {activeSectionKey === 'favorites' && (
                      <div style={{ display: 'grid', gap: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                          <div style={{ background: 'var(--q-paper)', border: '1px solid var(--q-line)', borderRadius: '22px', padding: '22px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>لوحة ف ب س ١١١</h3>
                            <p style={{ color: 'var(--q-muted)', fontSize: '12px', marginTop: '4px' }}>مزاد مباشر نشط الآن</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                              <span className="q-num" style={{ fontSize: '20px', fontWeight: 700 }}>750,000 ر.س</span>
                              <button
                                type="button"
                                className="q-button-gold"
                                style={{ height: '36px', padding: '0 16px' }}
                                onClick={() => setActiveModal('live')}
                              >
                                دخول المزاد
                              </button>
                            </div>
                          </div>

                          <div style={{ background: 'var(--q-paper)', border: '1px solid var(--q-line)', borderRadius: '22px', padding: '22px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>لوحة م ل ك ١</h3>
                            <p style={{ color: 'var(--q-muted)', fontSize: '12px', marginTop: '4px' }}>معروضة في الصالة الخاصة</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                              <span className="q-num" style={{ fontSize: '20px', fontWeight: 700 }}>4,250,000 ر.س</span>
                              <button
                                type="button"
                                className="q-button-greet"
                                style={{ height: '36px', padding: '0 16px' }}
                                onClick={() => setActiveModal('live')}
                              >
                                عرض التفاصيل
                              </button>
                            </div>
                          </div>
                        </div>

                        <div style={{ background: 'var(--q-paper)', border: '1px solid var(--q-line)', borderRadius: '24px', padding: '24px' }}>
                          <DataTable rows={rowsData} columns={columns} theme={theme} />
                        </div>
                      </div>
                    )}

                    {/* DEPOSITS & WALLET VIEW (High-Contrast & Clarity) */}
                    {activeSectionKey === 'deposits' && (
                      <div style={{ display: 'grid', gap: '22px' }}>
                        <div className="q-wallet">
                          <div className="q-wallet-top">
                            <span>حساب الضمان المعتمد (Escrow) · SAB Private</span>
                            <div className="q-wallet-seal">
                              <ShieldCheck size={22} />
                            </div>
                          </div>
                          <div className="q-wallet-caption">حد التأمين المصرفي المفوض (قابل للاسترداد)</div>
                          <div className="q-wallet-amount">
                            <span className="q-num">{formatNumber(escrowDeposit)}</span>
                            <small>ر.س</small>
                          </div>
                          <div className="q-wallet-power">
                            <span>سقف المزايدة المعتمد (10x)</span>
                            <strong className="q-num">{formatNumber(escrowDeposit * 10)} ر.س</strong>
                          </div>
                          <div className="q-wallet-status">
                            <BadgeCheck size={16} />
                            <span>تفويض سارٍ ومحمي لدى البنوك السعودية المعتمدة (SAB Private)</span>
                          </div>
                          <div className="q-wallet-rule" />
                          <button
                            type="button"
                            className="q-wallet-btn"
                            onClick={() => setActiveModal('wallet')}
                          >
                            <span>تعديل حد الضمان المصرفي والائتمان</span>
                            <ArrowUpLeft size={16} />
                          </button>
                        </div>

                        <div style={{ background: 'var(--q-paper)', border: '1px solid var(--q-line)', borderRadius: '24px', padding: '24px' }}>
                          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>سجل التفويضات والحركات المصرفية المعتمدة</h3>
                          <DataTable rows={rowsData} columns={columns} theme={theme} />
                        </div>
                      </div>
                    )}

                    {/* COMPREHENSIVE PROFILE VIEW */}
                    {activeSectionKey === 'profile' && (
                      <div className="q-profile-card">
                        <div className="q-profile-avatar-row">
                          <div className="q-profile-avatar-large">
                            {avatarInitial}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>{profileName}</h2>
                              <span className="q-vip" style={{ height: '30px', padding: '0 12px', fontSize: '11px' }}>
                                <Crown size={13} />
                                عضوية النخبة · Centurion VIP
                              </span>
                            </div>
                            <p style={{ color: 'var(--q-muted)', fontSize: '12.5px', margin: '4px 0 10px' }}>
                              رقم العضوية السيادية: <span className="q-num">FBS-KSA-00941</span> · موثق بالكامل عبر النفاذ الوطني وأبشر
                            </p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button
                                type="button"
                                className="q-button-greet"
                                style={{ height: '34px', padding: '0 14px', fontSize: '11.5px' }}
                                onClick={() => showToast('اختر صورة شخصية بصيغة PNG أو JPG لا تتجاوز 5MB')}
                              >
                                <Camera size={14} />
                                <span>تغيير الصورة</span>
                              </button>
                              <span className="q-status-pill-ok">
                                <BadgeCheck size={16} />
                                تم التحقق من مطابقة البصمة
                              </span>
                            </div>
                          </div>
                        </div>

                        <form onSubmit={handleSaveProfile}>
                          <div className="q-profile-grid">
                            <div className="q-field-group">
                              <label>
                                <User size={14} />
                                <span>الاسم الكامل المعتمد (كما في الهوية الوطنية)</span>
                              </label>
                              <input
                                type="text"
                                className="q-field-input"
                                value={profileName}
                                onChange={e => setProfileName(e.target.value)}
                                required
                              />
                            </div>

                            <div className="q-field-group">
                              <label>
                                <FileCheck2 size={14} />
                                <span>رقم الهوية الوطنية / الإقامة (موثق عبر نفاذ)</span>
                              </label>
                              <input
                                type="text"
                                className="q-field-input"
                                value={profileNationalId}
                                onChange={e => setProfileNationalId(e.target.value)}
                                readOnly
                                style={{ opacity: 0.85, cursor: 'not-allowed' }}
                              />
                            </div>

                            <div className="q-field-group">
                              <label>
                                <Phone size={14} />
                                <span>رقم الجوال للتنبيهات والمزايدة الفورية</span>
                              </label>
                              <input
                                type="tel"
                                className="q-field-input"
                                value={profilePhone}
                                onChange={e => setProfilePhone(e.target.value)}
                                dir="ltr"
                                required
                              />
                            </div>

                            <div className="q-field-group">
                              <label>
                                <Mail size={14} />
                                <span>البريد الإلكتروني المعتمد للإشعارات الرسمية</span>
                              </label>
                              <input
                                type="email"
                                className="q-field-input"
                                value={profileEmail}
                                onChange={e => setProfileEmail(e.target.value)}
                                dir="ltr"
                                required
                              />
                            </div>

                            <div className="q-field-group">
                              <label>
                                <MapPin size={14} />
                                <span>العنوان الوطني المعتمد للتسليم المصفّح</span>
                              </label>
                              <input
                                type="text"
                                className="q-field-input"
                                value={profileCity}
                                onChange={e => setProfileCity(e.target.value)}
                                required
                              />
                            </div>

                            <div className="q-field-group">
                              <label>
                                <Building2 size={14} />
                                <span>الآيبان البنكي المعتمد لاسترداد الضمان والتحويلات</span>
                              </label>
                              <input
                                type="text"
                                className="q-field-input"
                                value={profileIban}
                                onChange={e => setProfileIban(e.target.value)}
                                dir="ltr"
                                required
                              />
                            </div>
                          </div>

                          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button
                              type="submit"
                              className="q-button-gold"
                              style={{ height: '44px', padding: '0 24px' }}
                            >
                              <Check size={16} />
                              <span>حفظ وتحديث بيانات الملف الشخصي</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* SECURITY VIEW */}
                    {activeSectionKey === 'security' && (
                      <div style={{ display: 'grid', gap: '20px' }}>
                        <div style={{ background: 'var(--q-paper)', border: '1px solid var(--q-line)', borderRadius: '24px', padding: '26px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                            <Lock size={20} color="var(--q-gold)" />
                            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>تغيير كلمة المرور واستعادتها</h2>
                          </div>
                          <p style={{ color: 'var(--q-muted)', fontSize: '13px', lineHeight: 1.7, marginBottom: '18px' }}>
                            لأسباب أمنية ولضمان سلامة العمليات والمزايدات المالية، يتم تعيين كلمة المرور الجديدة عبر إرسال رمز تحقق مؤقت (OTP) مشفر إلى بريدك الإلكتروني المعتمد: ({user.email}).
                          </p>
                          <Link href="/forgot-password" className="q-button-gold" style={{ height: '40px', padding: '0 18px', display: 'inline-flex', width: 'fit-content' }}>
                            <span>طلب رمز استعادة كلمة المرور</span>
                            <ArrowLeft size={15} />
                          </Link>
                        </div>

                        <MfaSetup theme={theme} />
                      </div>
                    )}

                    {/* NOTIFICATIONS VIEW */}
                    {activeSectionKey === 'notifications' && (
                      <div style={{ background: 'var(--q-paper)', border: '1px solid var(--q-line)', borderRadius: '24px', padding: '24px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>أرشيف الإشعارات والتنبيهات</h2>
                        <DataTable rows={rowsData} columns={columns} theme={theme} />
                      </div>
                    )}
                  </div>
                )}

                {/* Footer */}
                <footer className="q-footer">
                  <span>
                    <Lock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginInlineEnd: '4px' }} />
                    مساحتك الخاصة. بمعيار النخبة. دار فارس بن سعود للوحات المميزة (FBS). تكامل مباشر مع النفاذ الوطني وأبشر.
                  </span>
                  <span>الرياض · مركز الملك عبدالله المالي (KAFD) · س.ت: 1010884920 🇸🇦</span>
                </footer>
              </div>
            </main>
          </div>
        </div>

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="q-toast" role="status">
            {toastMessage}
          </div>
        )}

        {/* Interactive Modals */}
        {activeModal && (
          <div className="q-overlay" onClick={() => setActiveModal(null)}>
            <div className="q-dialog" onClick={e => e.stopPropagation()}>
              <div className="q-dialog-head">
                <h2>
                  {activeModal === 'live' && `قاعة المزاد السيادي · لوحة ${currentHero.letAr} ${currentHero.numAr}`}
                  {activeModal === 'wallet' && 'إدارة الضمان المصرفي والائتمان السيادي'}
                  {activeModal === 'add' && 'استوديو تثمين وعرض اللوحات النادرة'}
                  {activeModal === 'support' && 'المستشار السيادي الخاص · Private Concierge'}
                  {activeModal === 'activity' && 'السجل الكامل للعمليات والتوثيق'}
                </h2>
                <button
                  type="button"
                  className="q-icon-button"
                  aria-label="إغلاق"
                  onClick={() => setActiveModal(null)}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Bidding Modal */}
              {activeModal === 'live' && (
                <div>
                  <p>أنت متصل الآن بغرفة المزايدة المشفّرة في مركز الملك عبدالله المالي (KAFD). جميع العروض ملزمة ومغطاة بالضمان المصرفي.</p>
                  <div className="q-detail">
                    <span>اللوحة المعروضة</span>
                    <strong>لوحة {currentHero.letAr} {currentHero.numAr} ({currentHero.letEn} {currentHero.numEn})</strong>
                  </div>
                  <div className="q-detail">
                    <span>أعلى عطاء حالي</span>
                    <strong className="q-num" style={{ color: 'var(--q-gold)' }}>{formatNumber(currentHero.price)} ر.س</strong>
                  </div>
                  <div className="q-detail">
                    <span>صاحب أعلى عطاء</span>
                    <strong>{currentHero.lastBidder}</strong>
                  </div>
                  <div className="q-detail">
                    <span>سقف المزايدة المتاح لك</span>
                    <strong className="q-num">{formatNumber(escrowDeposit * 10)} ر.س</strong>
                  </div>
                  <div className="q-dialog-form">
                    <label>
                      اختر قيمة الزيادة الفورية (ر.س)
                      <select
                        value={modalBidInc}
                        onChange={e => setModalBidInc(Number(e.target.value))}
                      >
                        <option value={25000}>+25,000 ر.س (الحد الأدنى للزيادة)</option>
                        <option value={50000}>+50,000 ر.س (مزايدة تنافسية)</option>
                        <option value={100000}>+100,000 ر.س (حسم سيادي)</option>
                        <option value={250000}>+250,000 ر.س (إغلاق جولة)</option>
                      </select>
                    </label>
                    <button
                      type="button"
                      className="q-button-gold"
                      style={{ marginTop: '10px', width: '100%', justifyContent: 'center' }}
                      onClick={() => {
                        handleQuickBid(modalBidInc);
                        setActiveModal(null);
                      }}
                    >
                      تأكيد وإرسال العطاء الموثّق
                    </button>
                  </div>
                  <div className="q-dialog-note">
                    يتم تحديث سجل المزاد وإشعار منصة أبشر فور تأكيد العطاء.
                  </div>
                </div>
              )}

              {/* Wallet Modal */}
              {activeModal === 'wallet' && (
                <div>
                  <p>يتيح لك حساب الضمان الخاص (SAB Private Escrow) قوة شرائية تعادل 10 أضعاف مبلغ التأمين المحتجز للمزايدة الفورية.</p>
                  <div className="q-detail">
                    <span>البنك الضامن</span>
                    <strong>البنك السعودي الأول (SAB Private Banking)</strong>
                  </div>
                  <div className="q-detail">
                    <span>مبلغ التأمين الحالي</span>
                    <strong className="q-num">{formatNumber(escrowDeposit)} ر.س</strong>
                  </div>
                  <div className="q-detail">
                    <span>القوة الشرائية المعتمدة</span>
                    <strong className="q-num" style={{ color: 'var(--q-gold)' }}>{formatNumber(escrowDeposit * 10)} ر.س</strong>
                  </div>
                  <div className="q-dialog-form">
                    <label>
                      تعديل حد التأمين المصرفي (ر.س)
                      <select
                        value={modalEscrowChoice}
                        onChange={e => setModalEscrowChoice(Number(e.target.value))}
                      >
                        <option value={100000}>100,000 ر.س (قوة شرائية: 1,000,000 ر.س)</option>
                        <option value={250000}>250,000 ر.س (قوة شرائية: 2,500,000 ر.س)</option>
                        <option value={500000}>500,000 ر.س (قوة شرائية: 5,000,000 ر.س)</option>
                        <option value={1000000}>1,000,000 ر.س (مفتوح لكافة المزادات الملكية)</option>
                      </select>
                    </label>
                    <button
                      type="button"
                      className="q-button-gold"
                      style={{ marginTop: '10px', width: '100%', justifyContent: 'center' }}
                      onClick={handleEscrowUpdate}
                    >
                      تحديث سقف الضمان الفوري
                    </button>
                  </div>
                  <div className="q-dialog-note">
                    التفويض المصرفي خاضع لمعايير البنك المركزي السعودي (SAMA) وقابل للاسترداد في أي وقت.
                  </div>
                </div>
              )}

              {/* Add Plate Modal */}
              {activeModal === 'add' && (
                <form onSubmit={handleAddPlateSubmit}>
                  <p>أدخل بيانات لوحتك لإجراء تثمين فوري وإدراجها ضمن مزادات النخبة بعد مطابقة صك الملكية عبر أبشر.</p>
                  <div className="q-dialog-form">
                    <label>
                      الحروف العربية (مفصولة بمسافة)
                      <input
                        type="text"
                        value={newPlateLetAr}
                        onChange={e => setNewPlateLetAr(e.target.value)}
                        maxLength={7}
                        required
                      />
                    </label>
                    <label>
                      الحروف الإنجليزية
                      <input
                        type="text"
                        value={newPlateLetEn}
                        onChange={e => setNewPlateLetEn(e.target.value)}
                        maxLength={7}
                        required
                      />
                    </label>
                    <label>
                      الأرقام (بالإنجليزية)
                      <input
                        type="text"
                        value={newPlateNumEn}
                        onChange={e => setNewPlateNumEn(e.target.value)}
                        maxLength={4}
                        required
                      />
                    </label>
                    <label>
                      السعر التقديري المستهدف (ر.س)
                      <input
                        type="text"
                        value={newPlateVal}
                        onChange={e => setNewPlateVal(e.target.value)}
                        required
                      />
                    </label>
                    <button
                      type="submit"
                      className="q-button-gold"
                      style={{ marginTop: '10px', width: '100%', justifyContent: 'center' }}
                    >
                      إرسال اللوحة للتوثيق والتثمين
                    </button>
                  </div>
                  <div className="q-dialog-note">
                    تتم مراجعة الملكية إلكترونياً عبر الربط المباشر مع منصة أبشر دون الحاجة لتسليم المركبة.
                  </div>
                </form>
              )}

              {/* Support Concierge Modal */}
              {activeModal === 'support' && (
                <div>
                  <p>مرحباً أستاذ {userName}، مستشارك الخاص (فيصل بن عبد العزيز) متاح على مدار الساعة لترتيب صفقات الاستحواذ المباشر أو المزادات السرية.</p>
                  <div className="q-detail">
                    <span>المستشار المعتمد</span>
                    <strong>فيصل بن عبد العزيز · مدير محافظ النخبة</strong>
                  </div>
                  <div className="q-detail">
                    <span>المكتب الإقليمي</span>
                    <strong>الرياض — KAFD، برج النخبة، الطابق 42</strong>
                  </div>
                  <div className="q-detail">
                    <span>خط الطوارئ السيادي</span>
                    <strong className="q-num" dir="ltr">+966 11 829 0001</strong>
                  </div>
                  <div className="q-detail">
                    <span>معدل الاستجابة</span>
                    <strong style={{ color: 'var(--q-good)' }}>فوري (أقل من 90 ثانية)</strong>
                  </div>
                  <div className="q-dialog-note">
                    يمكنك تفويض المستشار بالمزايدة بالنيابة عنك (Proxy Bidding) بسقف سري محدد مسبقاً.
                  </div>
                </div>
              )}

              {/* Activity History Modal */}
              {activeModal === 'activity' && (
                <div>
                  <p>سجل العمليات والتدقيق الموثق للحساب المرتبط بالنفاذ الوطني وأبشر.</p>
                  <div style={{ display: 'grid', gap: '8px', maxHeight: '320px', overflowY: 'auto' }}>
                    {activityList.map(act => (
                      <div key={act.id} className="q-detail">
                        <div>
                          <strong>{act.title}</strong>
                          <div style={{ fontSize: '11px', color: 'var(--q-muted)', marginTop: '2px' }}>{act.subtitle}</div>
                        </div>
                        <span className="q-event-time">{act.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
