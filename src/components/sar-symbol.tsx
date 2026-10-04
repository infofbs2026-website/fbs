import React from 'react';
import { minorMoney } from '@/lib/money';

/**
 * Official Saudi Riyal Symbol (رمز الريال السعودي الرسمي - SAMA)
 * Based on the official SAMA vector guidelines.
 */
export function SarSymbol({
  className = 'w-[0.95em] h-[0.95em] inline-block align-[-0.1em]',
  ariaHidden = true
}: {
  className?: string;
  ariaHidden?: boolean;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1124.14 1256.39"
      className={className}
      fill="currentColor"
      aria-hidden={ariaHidden}
      role={ariaHidden ? undefined : 'img'}
      aria-label={ariaHidden ? undefined : 'ريال سعودي'}
    >
      <path d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z" />
      <path d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z" />
    </svg>
  );
}

/**
 * Format halalas to formatted English numerals (e.g. 750,000)
 */
export function formatEnglishAmount(
  value: bigint | string | number,
  showDecimals = false
): string {
  try {
    const minor = minorMoney(value);
    const whole = minor / 100n;
    const fraction = Number(minor % 100n);

    // Format whole number in English (en-US)
    const formattedWhole = new Intl.NumberFormat('en-US').format(whole);

    if (showDecimals && fraction > 0) {
      const formattedFraction = fraction.toString().padStart(2, '0');
      return `${formattedWhole}.${formattedFraction}`;
    }

    return formattedWhole;
  } catch {
    return '0';
  }
}

/**
 * High-end price display with English numerals and official SAMA Saudi Riyal symbol
 */
export function SarPrice({
  amount,
  className = '',
  symbolClassName = 'w-[0.9em] h-[0.9em] inline-block align-[-0.08em] opacity-85',
  showDecimals = false
}: {
  amount: bigint | string | number;
  className?: string;
  symbolClassName?: string;
  showDecimals?: boolean;
}) {
  const formatted = formatEnglishAmount(amount, showDecimals);

  return (
    <span className={`inline-flex items-center gap-1.5 font-bold ${className}`} dir="ltr">
      <span className="tabular-nums tracking-tight">{formatted}</span>
      <SarSymbol className={symbolClassName} />
    </span>
  );
}
