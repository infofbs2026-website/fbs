import { DomainError } from "./errors";

/** PostgreSQL BIGINT upper bound. Money is never stored or calculated as a float. */
export const MAX_MONEY_MINOR = 9_223_372_036_854_775_807n;
export const CURRENCY = "SAR" as const;

export function minorMoney(value: string | bigint | number): bigint {
  if (typeof value === "number" && !Number.isSafeInteger(value)) {
    throw new DomainError("INVALID_INPUT", "Money must be a safe integer or decimal string.");
  }
  if (typeof value === "string" && !/^(0|[1-9]\d*)$/.test(value)) {
    throw new DomainError("INVALID_INPUT", "Money must be an unsigned integer decimal string.");
  }
  const result = BigInt(value);
  if (result < 0n || result > MAX_MONEY_MINOR) {
    throw new DomainError("INVALID_INPUT", "Money is outside the supported range.");
  }
  return result;
}

export function parseSar(value: string): bigint {
  if (!/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(value)) {
    throw new DomainError("INVALID_INPUT", "Enter a SAR amount with at most two decimal places.");
  }
  const [whole, fraction = ""] = value.split(".");
  return minorMoney(BigInt(whole) * 100n + BigInt(fraction.padEnd(2, "0")));
}

export function addMoney(...values: readonly bigint[]): bigint {
  return minorMoney(values.reduce((total, amount) => total + minorMoney(amount), 0n));
}

export function subtractMoney(amount: bigint, deduction: bigint): bigint {
  return minorMoney(minorMoney(amount) - minorMoney(deduction));
}

/** Explicit rounding; integer basis points (10000 = 100%). */
export function percentageMoney(amount: bigint, basisPoints: number, rounding: "up" | "down"): bigint {
  minorMoney(amount);
  if (!Number.isSafeInteger(basisPoints) || basisPoints < 0 || basisPoints > 10_000) {
    throw new DomainError("INVALID_INPUT", "Percentage must be 0–10000 basis points.");
  }
  const numerator = amount * BigInt(basisPoints);
  return minorMoney((numerator + (rounding === "up" ? 9_999n : 0n)) / 10_000n);
}

export function moneyToJSON(amount: bigint): string {
  return minorMoney(amount).toString();
}

/** Formats numeric part in English numerals (e.g. 750,000). */
export function formatSarNumber(value: bigint | string | number): string {
  const amount = minorMoney(value);
  const whole = amount / 100n;
  return new Intl.NumberFormat("en-US").format(whole);
}

/** BigInt formatting preserves halalas even beyond Number.MAX_SAFE_INTEGER. Default to en-US numerals for prestige clarity. */
export function formatSar(value: bigint | string | number, locale = "en-US"): string {
  const amount = minorMoney(value);
  const whole = amount / 100n;
  const fraction = Number(amount % 100n);
  const currency = new Intl.NumberFormat(locale, { style: "currency", currency: CURRENCY, minimumFractionDigits: 2 });
  const fractionDigits = new Intl.NumberFormat(locale, { minimumIntegerDigits: 2, useGrouping: false }).format(fraction);
  return currency.formatToParts(whole).map((part) => part.type === "fraction" ? fractionDigits : part.value).join("");
}
