export type BadgeTone = 'gold' | 'emerald' | 'amber' | 'rose' | 'sky' | 'slate';

export const VERIFICATION_LABELS: Record<string, { label: string; tone: BadgeTone }> = {
  DRAFT: { label: 'مسودة', tone: 'slate' },
  DOCUMENTS_PENDING: { label: 'بانتظار المستندات', tone: 'amber' },
  SUBMITTED: { label: 'طلب جديد', tone: 'gold' },
  UNDER_REVIEW: { label: 'قيد المراجعة', tone: 'sky' },
  CHANGES_REQUIRED: { label: 'مطلوب تعديل', tone: 'amber' },
  VERIFIED: { label: 'موثقة', tone: 'emerald' },
  APPROVED: { label: 'معتمدة', tone: 'emerald' },
  REJECTED: { label: 'مرفوضة', tone: 'rose' },
};

export const LISTING_LABELS: Record<string, { label: string; tone: BadgeTone }> = {
  DRAFT: { label: 'مسودة', tone: 'slate' },
  PUBLISHED: { label: 'منشورة', tone: 'emerald' },
  SOLD: { label: 'مباعة', tone: 'gold' },
  ARCHIVED: { label: 'مؤرشفة', tone: 'rose' },
};

export const SALE_MODE_LABELS: Record<string, string> = {
  FIXED_PRICE: 'بيع مباشر',
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
    return new Intl.DateTimeFormat('ar-SA-u-nu-latn', {
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
import accountStyles from '@/components/account-dashboard.module.css';

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
    <div aria-hidden="true" className={`${accountStyles.engravedWatermarkWrap} ${className}`}>
      <svg
        viewBox="4 -18 252 168"
        className={accountStyles.engravedWatermarkSvg}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={filterId} x="-14%" y="-14%" width="128%" height="132%" colorInterpolationFilters="sRGB">
            {/* 1. Recessed Groove Base Floor */}
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

            {/* 3. Deep Overhead Inner Cut Shadow */}
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

            {/* 4. Specular Catchlight Lip */}
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
