export type BadgeTone = 'gold' | 'emerald' | 'amber' | 'rose' | 'sky' | 'slate';

export const VERIFICATION_LABELS: Record<string, { label: string; tone: BadgeTone }> = {
  DRAFT: { label: 'مسودة أولية', tone: 'slate' },
  DOCUMENTS_PENDING: { label: 'بانتظار المستندات', tone: 'amber' },
  SUBMITTED: { label: 'طلب جديد للمراجعة', tone: 'gold' },
  UNDER_REVIEW: { label: 'قيد التدقيق', tone: 'sky' },
  CHANGES_REQUIRED: { label: 'مطلوب استكمال', tone: 'amber' },
  VERIFIED: { label: 'تم التحقق', tone: 'emerald' },
  APPROVED: { label: 'معتمدة رسمياً', tone: 'emerald' },
  REJECTED: { label: 'مرفوضة', tone: 'rose' },
};

export const LISTING_LABELS: Record<string, { label: string; tone: BadgeTone }> = {
  DRAFT: { label: 'مخفية / مسودة', tone: 'slate' },
  PUBLISHED: { label: 'منشورة في الموقع', tone: 'emerald' },
  SOLD: { label: 'تم البيع', tone: 'gold' },
  ARCHIVED: { label: 'مؤرشفة', tone: 'rose' },
};

export const SALE_MODE_LABELS: Record<string, string> = {
  FIXED_PRICE: 'بيع مباشر (متجر)',
  AUCTION: 'مزاد تنافسي',
  AUCTION_WITH_BUY_NOW: 'مزاد + شراء فوري',
};

export const AUCTION_STATUS_LABELS: Record<string, { label: string; tone: BadgeTone }> = {
  DRAFT: { label: 'مسودة', tone: 'slate' },
  PENDING_APPROVAL: { label: 'بانتظار الاعتماد', tone: 'amber' },
  SCHEDULED: { label: 'مجدول', tone: 'sky' },
  REGISTRATION_OPEN: { label: 'التسجيل مفتوح', tone: 'gold' },
  WAITING_ROOM: { label: 'غرفة الانتظار', tone: 'gold' },
  LIVE: { label: 'مباشر الآن', tone: 'emerald' },
  ENDING: { label: 'لحظات الإغلاق', tone: 'emerald' },
  PAUSED: { label: 'متوقف مؤقتاً', tone: 'amber' },
  ENDED: { label: 'انتهى المزاد', tone: 'slate' },
  SETTLEMENT: { label: 'قيد التسوية', tone: 'gold' },
  COMPLETED: { label: 'مكتمل', tone: 'emerald' },
  RESERVE_NOT_MET: { label: 'لم يبلغ الحد الأدنى', tone: 'amber' },
  CANCELLED: { label: 'ملغي', tone: 'rose' },
  SUSPENDED: { label: 'معلّق', tone: 'rose' },
  DISPUTED: { label: 'نزاع قيد المعالجة', tone: 'rose' },
};

export const SETTLEMENT_STATUS_LABELS: Record<string, { label: string; tone: BadgeTone }> = {
  WINNER_CONFIRMED: { label: 'تأكيد الفائز', tone: 'gold' },
  PARTIES_CONTACTED: { label: 'تم التواصل مع الأطراف', tone: 'sky' },
  TRANSFER_IN_PROGRESS: { label: 'نقل الملكية عبر أبشر جارٍ', tone: 'amber' },
  TRANSFER_CONFIRMED: { label: 'تم تأكيد نقل الملكية', tone: 'emerald' },
  COMPLETED: { label: 'مكتملة وتم الصرف', tone: 'emerald' },
  DISPUTED: { label: 'نزاع مفتوح', tone: 'rose' },
  CANCELLED: { label: 'ملغاة', tone: 'rose' },
};

export const ROLE_LABELS: Record<string, string> = {
  super_admin: 'المدير التنفيذي الأعلى',
  auction_manager: 'مدير المزادات واللوحات',
  finance_admin: 'المدير المالي والتسويات',
  content_admin: 'مدير المحتوى والصفحات',
  support_admin: 'مسؤول الدعم والتوثيق',
  seller: 'بائع معتمد',
  bidder: 'مزايد مؤهل',
  user: 'عضو عام',
};

export const KYC_LABELS: Record<string, { label: string; tone: BadgeTone }> = {
  NOT_STARTED: { label: 'لم يبدأ', tone: 'slate' },
  PENDING: { label: 'قيد المراجعة', tone: 'amber' },
  VERIFIED: { label: 'موثق رسمياً', tone: 'emerald' },
  REJECTED: { label: 'مرفوض', tone: 'rose' },
};

export const MESSAGE_STATUS_LABELS: Record<string, { label: string; tone: BadgeTone }> = {
  NEW: { label: 'جديدة', tone: 'gold' },
  IN_PROGRESS: { label: 'قيد المتابعة', tone: 'sky' },
  RESOLVED: { label: 'تم الحل', tone: 'emerald' },
  ARCHIVED: { label: 'مؤرشفة', tone: 'slate' },
};

/**
 * Convert human SAR string/number (e.g. "75,000" or "12500.5") to integer halalas string ("7500000").
 */
export function sarToMinor(sarInput: string | number | null | undefined): string {
  if (sarInput === null || sarInput === undefined) return '';
  const cleaned = String(sarInput)
    .replace(/[,،\s]/g, '')
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .trim();
  if (!cleaned) return '';
  const num = Number(cleaned);
  if (!Number.isFinite(num) || num < 0) return '';
  const halalas = Math.round(num * 100);
  return String(halalas);
}

/**
 * Convert halalas minor value to clean SAR input string (e.g. "7500000" -> "75000").
 */
export function minorToSarInput(minor: string | number | bigint | null | undefined): string {
  if (minor === null || minor === undefined || minor === '') return '';
  try {
    const big = BigInt(String(minor));
    if (big <= 0n) return '0';
    const whole = big / 100n;
    const rem = Number(big % 100n);
    if (rem === 0) return whole.toString();
    return `${whole.toString()}.${String(rem).padStart(2, '0')}`;
  } catch {
    return '';
  }
}

export function normalizeDigitsInput(value: string): string {
  return value
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/[^0-9]/g, '')
    .slice(0, 4);
}

export function toDatetimeLocalValue(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fromDatetimeLocalValue(localValue?: string | null): string {
  if (!localValue) return '';
  const d = new Date(localValue);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString();
}

export function formatAdminDate(iso?: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  try {
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return d.toISOString().slice(0, 16).replace('T', ' ');
  }
}

export function formatCountdownLabel(endIso?: string | null, nowMs?: number): { text: string; expired: boolean; urgent: boolean } {
  if (!endIso || !nowMs) return { text: '—', expired: false, urgent: false };
  const target = Date.parse(endIso);
  if (!Number.isFinite(target)) return { text: '—', expired: false, urgent: false };
  const diffSec = Math.floor((target - nowMs) / 1000);
  if (diffSec <= 0) {
    return { text: 'انتهى الوقت المحدد', expired: true, urgent: false };
  }
  const days = Math.floor(diffSec / 86400);
  const hours = Math.floor((diffSec % 86400) / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);
  const seconds = diffSec % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  const text =
    days > 0
      ? `${days}ي ${pad(hours)}س ${pad(minutes)}د ${pad(seconds)}ث`
      : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return { text, expired: false, urgent: diffSec <= 300 };
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB';
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export interface AdminApiCallResult<T = Record<string, unknown>> {
  ok: boolean;
  data?: T;
  message?: string;
  mfaRequired?: boolean;
  error?: string;
}

export async function callAdminManage<T = Record<string, unknown>>(
  payload: Record<string, unknown>,
): Promise<AdminApiCallResult<T>> {
  try {
    const res = await fetch('/api/v1/admin/manage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      const mfaRequired = Boolean(body?.error?.details?.mfaRequired);
      const errMsg =
        typeof body?.error?.message === 'string'
          ? body.error.message
          : 'تعذر إتمام الإجراء الإداري المطلوب.';
      return { ok: false, mfaRequired, error: errMsg };
    }
    const data = body?.data as T | undefined;
    const message =
      data && typeof data === 'object' && 'message' in data && typeof (data as { message?: unknown }).message === 'string'
        ? ((data as { message: string }).message)
        : 'تم تنفيذ الإجراء بنجاح.';
    return { ok: true, data, message };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'تعذر الاتصال بالخادم، يرجى المحاولة مجدداً.',
    };
  }
}

export function exportRowsToCsv(filename: string, headers: string[], rows: Array<Array<string | number | null | undefined>>) {
  if (typeof window === 'undefined') return;
  const escapeCsv = (val: string | number | null | undefined) => {
    const str = String(val ?? '');
    if (/[",\n\r]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  const lines = [headers.map(escapeCsv).join(','), ...rows.map((r) => r.map(escapeCsv).join(','))];
  const csvContent = `\uFEFF${lines.join('\r\n')}`;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

import React from 'react';

export function EngravedFbsCrest({
  filterId = 'fbs-admin-crest-deboss',
  tone = 'dark',
  className = '',
}: {
  filterId?: string;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const isLight = tone === 'light';
  return (
    <div aria-hidden="true" className={className} style={{ pointerEvents: 'none', userSelect: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        viewBox="4 -18 252 168"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={filterId} x="-14%" y="-14%" width="128%" height="132%" colorInterpolationFilters="sRGB">
            <feFlood
              floodColor={isLight ? '#C5B9A8' : '#1C3656'}
              floodOpacity={isLight ? '0.68' : '0.72'}
              result="grooveBaseColor"
            />
            <feComposite in="grooveBaseColor" in2="SourceAlpha" operator="in" result="grooveBase" />
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
            <feOffset in="SourceAlpha" dx="0" dy="1.6" result="offsetShadow" />
            <feGaussianBlur in="offsetShadow" stdDeviation="1.15" result="blurShadow" />
            <feFlood
              floodColor={isLight ? '#261F17' : '#01050A'}
              floodOpacity={isLight ? '0.52' : '0.96'}
              result="shadowColor"
            />
            <feComposite in="shadowColor" in2="blurShadow" operator="in" result="dropShadowRaw" />
            <feComposite in="dropShadowRaw" in2="SourceAlpha" operator="in" result="innerDropShadow" />
            <feOffset in="SourceAlpha" dx="0" dy="-1.4" result="offsetCatch" />
            <feGaussianBlur in="offsetCatch" stdDeviation="0.75" result="blurCatch" />
            <feFlood
              floodColor={isLight ? '#FFFFFF' : '#88B4E8'}
              floodOpacity={isLight ? '0.95' : '0.62'}
              result="catchColor"
            />
            <feComposite in="catchColor" in2="blurCatch" operator="in" result="catchLightRaw" />
            <feComposite in="catchLightRaw" in2="SourceAlpha" operator="in" result="bottomCatchLight" />
            <feMerge>
              <feMergeNode in="grooveBase" />
              <feMergeNode in="innerWallDepth" />
              <feMergeNode in="innerDropShadow" />
              <feMergeNode in="bottomCatchLight" />
            </feMerge>
          </filter>
        </defs>
        <g filter={`url(#${filterId})`}>
          <g fill="#000000" transform="translate(0, -14)">
            <path d="M 126,1.5 C 130.5,1.5 133,5 133,9.5 C 133,14 130.5,17.5 126,17.5 C 121.5,17.5 119,14 119,9.5 C 119,5 121.5,1.5 126,1.5 Z" />
            <path d="M 77,15.5 C 80.5,15.5 82.5,18.5 82.5,22 C 82.5,25.5 80.5,28.5 77,28.5 C 73.5,28.5 71.5,25.5 71.5,22 C 71.5,18.5 73.5,15.5 77,15.5 Z" />
            <path d="M 175,15.5 C 178.5,15.5 180.5,18.5 180.5,22 C 180.5,25.5 178.5,28.5 175,28.5 C 171.5,28.5 169.5,25.5 169.5,22 C 169.5,18.5 171.5,15.5 175,15.5 Z" />
            <path d="M 39,36 C 42,36 44,38.5 44,41.5 C 44,44.5 42,47 39,47 C 36,47 34,44.5 34,41.5 C 34,38.5 36,36 39,36 Z" />
            <path d="M 213,36 C 216,36 218,38.5 218,41.5 C 218,44.5 216,47 213,47 C 210,47 208,44.5 208,41.5 C 208,38.5 210,36 213,36 Z" />
            <path d="M 126,22 C 129,32 135,46 148,53 C 132,53 126.5,35 126,22 Z" />
            <path d="M 126,22 C 123,32 117,46 104,53 C 120,53 125.5,35 126,22 Z" />
            <path d="M 77,33 C 82,41 91,52 108,55 C 92,57 80,48 77,33 Z" />
            <path d="M 175,33 C 170,41 161,52 144,55 C 160,57 172,48 175,33 Z" />
            <path d="M 40,42.2 C 31,41.8 19,45.5 10,51.6 C 21,50.8 31,48.2 37,44.8 Z" />
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
