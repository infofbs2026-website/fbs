import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';

export const MFA_COOKIE_NAME = 'fbs_mfa_verified';
export const MFA_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function secret(): string {
  const value =
    process.env.FBS_MFA_COOKIE_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY;
  if (!value) throw new Error('MFA cookie secret is not configured');
  return value;
}

function sign(userId: string): string {
  return createHmac('sha256', secret()).update(`mfa:${userId}`).digest('base64url');
}

/** Builds a tamper-proof cookie value bound to the given user id. */
export function createMfaCookieValue(userId: string): string {
  return `${userId}.${sign(userId)}`;
}

/** Returns true only when the cookie was issued by the server for this exact user. */
export function isValidMfaCookie(value: string | undefined, userId: string): boolean {
  if (!value) return false;
  const dot = value.lastIndexOf('.');
  if (dot <= 0) return false;
  const id = value.slice(0, dot);
  const mac = value.slice(dot + 1);
  if (id !== userId) return false;
  try {
    const expected = Buffer.from(sign(userId));
    const given = Buffer.from(mac);
    return expected.length === given.length && timingSafeEqual(expected, given);
  } catch {
    return false;
  }
}

export const mfaCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: MFA_COOKIE_MAX_AGE,
};
