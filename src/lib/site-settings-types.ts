export interface SocialLinksConfig {
  x: string;
  instagram: string;
  snapchat: string;
  tiktok: string;
  youtube: string;
}

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  footerSummary: string;
  crNumber: string;
  whatsappNumber: string;
  phoneDisplay: string;
  unifiedNumber: string;
  contactEmail: string;
  addressAr: string;
  workingHoursAr: string;
  announcementEnabled: boolean;
  announcementText: string;
  announcementHref: string;
  heroBadgeText: string;
  heroHeadline: string;
  conciergeTitle: string;
  conciergeSubtitle: string;
  maintenanceBanner: string;
  socialLinks: SocialLinksConfig;
  defaultExtensionWindowSeconds: number;
  defaultExtensionDurationSeconds: number;
  defaultMaxExtensions: number;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: 'فارس بن سعود للوحات المميزة',
  siteTagline: 'لوحتك المميزة تبدأ من هنا',
  footerSummary:
    'المنصة السعودية الأولى المعتمدة لتنظيم وإدارة مزادات لوحات المركبات النادرة، وساطة موثوقة تضمن أعلى معايير الأمان المالي والتنظيمي بين نخبة المزايدين والملاك.',
  crNumber: '1010884920',
  whatsappNumber: '966500000000',
  phoneDisplay: '+966 50 000 0000',
  unifiedNumber: '9200 00000',
  contactEmail: 'concierge@fbs.sa',
  addressAr: 'الرياض • برج المملكة المالي',
  workingHoursAr: 'الأحد – الخميس · 9:00 صباحاً حتى 10:00 مساءً',
  announcementEnabled: false,
  announcementText: '',
  announcementHref: '/auctions',
  heroBadgeText: 'المزاد المباشر الآن',
  heroHeadline: 'نخبة اللوحات السعودية النادرة',
  conciergeTitle: 'هل ترغب في عرض لوحتك أو اقتناء لوحة نادرة؟',
  conciergeSubtitle:
    'مستشارو FBS متاحون لتقديم التقييم المعتمد والدعم التنفيذي الفوري بأعلى درجات الخصوصية.',
  maintenanceBanner: '',
  socialLinks: {
    x: 'https://x.com',
    instagram: 'https://instagram.com',
    snapchat: 'https://snapchat.com',
    tiktok: 'https://tiktok.com',
    youtube: 'https://youtube.com',
  },
  defaultExtensionWindowSeconds: 300,
  defaultExtensionDurationSeconds: 300,
  defaultMaxExtensions: 3,
};

function strOrDefault(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback;
}

function numOrDefault(value: unknown, fallback: number): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export function normalizeSiteSettings(raw: unknown): SiteSettings {
  if (!raw || typeof raw !== 'object') {
    return DEFAULT_SITE_SETTINGS;
  }
  const obj = raw as Record<string, unknown>;
  const social = (obj.socialLinks && typeof obj.socialLinks === 'object'
    ? obj.socialLinks
    : {}) as Record<string, unknown>;

  return {
    siteName: strOrDefault(obj.siteName, DEFAULT_SITE_SETTINGS.siteName),
    siteTagline: strOrDefault(obj.siteTagline, DEFAULT_SITE_SETTINGS.siteTagline),
    footerSummary: strOrDefault(obj.footerSummary, DEFAULT_SITE_SETTINGS.footerSummary),
    crNumber: strOrDefault(obj.crNumber, DEFAULT_SITE_SETTINGS.crNumber),
    whatsappNumber:
      strOrDefault(obj.whatsappNumber, DEFAULT_SITE_SETTINGS.whatsappNumber).replace(/[^0-9]/g, '') ||
      DEFAULT_SITE_SETTINGS.whatsappNumber,
    phoneDisplay: strOrDefault(obj.phoneDisplay, DEFAULT_SITE_SETTINGS.phoneDisplay),
    unifiedNumber: strOrDefault(obj.unifiedNumber, DEFAULT_SITE_SETTINGS.unifiedNumber),
    contactEmail: strOrDefault(obj.contactEmail, DEFAULT_SITE_SETTINGS.contactEmail),
    addressAr: strOrDefault(obj.addressAr, DEFAULT_SITE_SETTINGS.addressAr),
    workingHoursAr: strOrDefault(obj.workingHoursAr, DEFAULT_SITE_SETTINGS.workingHoursAr),
    announcementEnabled: Boolean(obj.announcementEnabled),
    announcementText: strOrDefault(obj.announcementText, DEFAULT_SITE_SETTINGS.announcementText),
    announcementHref: strOrDefault(obj.announcementHref, DEFAULT_SITE_SETTINGS.announcementHref),
    heroBadgeText: strOrDefault(obj.heroBadgeText, DEFAULT_SITE_SETTINGS.heroBadgeText),
    heroHeadline: strOrDefault(obj.heroHeadline, DEFAULT_SITE_SETTINGS.heroHeadline),
    conciergeTitle: strOrDefault(obj.conciergeTitle, DEFAULT_SITE_SETTINGS.conciergeTitle),
    conciergeSubtitle: strOrDefault(obj.conciergeSubtitle, DEFAULT_SITE_SETTINGS.conciergeSubtitle),
    maintenanceBanner: strOrDefault(obj.maintenanceBanner, DEFAULT_SITE_SETTINGS.maintenanceBanner),
    socialLinks: {
      x: strOrDefault(social.x, DEFAULT_SITE_SETTINGS.socialLinks.x),
      instagram: strOrDefault(social.instagram, DEFAULT_SITE_SETTINGS.socialLinks.instagram),
      snapchat: strOrDefault(social.snapchat, DEFAULT_SITE_SETTINGS.socialLinks.snapchat),
      tiktok: strOrDefault(social.tiktok, DEFAULT_SITE_SETTINGS.socialLinks.tiktok),
      youtube: strOrDefault(social.youtube, DEFAULT_SITE_SETTINGS.socialLinks.youtube),
    },
    defaultExtensionWindowSeconds: numOrDefault(
      obj.defaultExtensionWindowSeconds,
      DEFAULT_SITE_SETTINGS.defaultExtensionWindowSeconds,
    ),
    defaultExtensionDurationSeconds: numOrDefault(
      obj.defaultExtensionDurationSeconds,
      DEFAULT_SITE_SETTINGS.defaultExtensionDurationSeconds,
    ),
    defaultMaxExtensions: numOrDefault(
      obj.defaultMaxExtensions,
      DEFAULT_SITE_SETTINGS.defaultMaxExtensions,
    ),
  };
}
