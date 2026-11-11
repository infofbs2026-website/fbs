import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { createSessionClient, createAdminClient } from './supabase/server';
import { DomainError } from './errors';
import { MFA_COOKIE_NAME, isValidMfaCookie } from './mfa-cookie';

export const PRIMARY_SUPER_ADMIN_EMAIL = (
  process.env.FBS_SUPER_ADMIN_EMAIL || 'fbs@admin-control.com'
)
  .trim()
  .toLowerCase();

export const ADMIN_CONSOLE_PATH = '/fbs-console';

const RESERVED_ADMIN_EMAILS = new Set([
  PRIMARY_SUPER_ADMIN_EMAIL,
  'fbs@admin-control.com',
  'ceo@fbs.sa',
  'admin@fbs.sa',
  'superadmin@fbs.sa',
  'security@fbs.sa',
]);

export function isReservedAdminEmail(email: string): boolean {
  const clean = email.trim().toLowerCase();
  return (
    RESERVED_ADMIN_EMAILS.has(clean) ||
    clean.endsWith('@fbs.sa') ||
    clean.endsWith('@admin-control.com')
  );
}

export const getViewer = cache(async () => {
  const client = await createSessionClient();
  if (!client) return null;
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  if (error || !user) return null;
  const { data: profile, error: profileError } = await client
    .from('profiles')
    .select('display_name,status')
    .eq('id', user.id)
    .single();
  if (profileError || !profile || profile.status !== 'ACTIVE') return null;
  // Only app_metadata is writable exclusively by the server (service role); user_metadata can be edited by the user from the browser.
  const mfaMetaVerified = Boolean(user.app_metadata?.mfa_verified);
  // Never trust client-modifiable metadata for admin roles; base role is always 'user' until verified against DB user_roles.
  return {
    id: user.id,
    email: (user.email ?? '').trim().toLowerCase(),
    displayName: String(profile.display_name),
    role: 'user',
    verified: Boolean(user.email_confirmed_at),
    mfaMetaVerified,
  };
});

async function resolveVerifiedRoles(
  db: NonNullable<ReturnType<typeof createAdminClient>>,
  viewer: NonNullable<Awaited<ReturnType<typeof getViewer>>>,
): Promise<string[]> {
  const { data: userRoles, error } = await db
    .from('user_roles')
    .select('role_code')
    .eq('user_id', viewer.id);
  if (error) throw new DomainError('SYSTEM_DEGRADED', undefined, {}, 503);

  const dbRoles = new Set<string>(['user', ...(userRoles ?? []).map((r) => String(r.role_code))]);

  // Migrate the existing super_admin account to PRIMARY_SUPER_ADMIN_EMAIL (one-time, server-side only).
  // super_admin is NEVER granted based on email alone — it must already exist in user_roles (DB).
  if (dbRoles.has('super_admin') && viewer.email !== PRIMARY_SUPER_ADMIN_EMAIL) {
    try {
      const { data: updateRes, error: updateErr } = await db.auth.admin.updateUserById(
        viewer.id,
        {
          email: PRIMARY_SUPER_ADMIN_EMAIL,
          email_confirm: true,
        },
      );
      if (!updateErr && updateRes?.user) {
        viewer.email = PRIMARY_SUPER_ADMIN_EMAIL;
      }
    } catch {
      // Keep the DB role untouched; privileges are simply withheld for this request below.
    }
  }

  // Strictly enforce that ONLY PRIMARY_SUPER_ADMIN_EMAIL can exercise super_admin
  if (viewer.email !== PRIMARY_SUPER_ADMIN_EMAIL) {
    dbRoles.delete('super_admin');
  }

  return Array.from(dbRoles);
}

export async function requireViewer() {
  const viewer = await getViewer();
  if (!viewer) throw new DomainError('AUTH_REQUIRED', undefined, {}, 401);
  return viewer;
}

export async function requireSuperAdmin() {
  const viewer = await requireViewer();
  const db = createAdminClient();
  if (!db) throw new DomainError('SYSTEM_DEGRADED', undefined, {}, 503);
  const allRoles = await resolveVerifiedRoles(db, viewer);
  if (!allRoles.includes('super_admin') || viewer.email !== PRIMARY_SUPER_ADMIN_EMAIL) {
    throw new DomainError(
      'FORBIDDEN',
      'هذا الإجراء السيادي حصري لحساب المدير التنفيذي الأعلى (Super Admin) فقط.',
      {},
      403,
    );
  }
  return viewer;
}

export async function requirePermission(permission: string) {
  const viewer = await requireViewer();
  const db = createAdminClient();
  if (!db) throw new DomainError('SYSTEM_DEGRADED', undefined, {}, 503);
  const allRoles = await resolveVerifiedRoles(db, viewer);
  if (allRoles.includes('super_admin') && viewer.email === PRIMARY_SUPER_ADMIN_EMAIL) {
    return viewer;
  }
  const { data: grants, error: grantError } = await db
    .from('role_permissions')
    .select('permission_code')
    .in('role_code', allRoles)
    .eq('permission_code', permission)
    .limit(1);
  if (grantError || !grants?.length) {
    throw new DomainError(
      'FORBIDDEN',
      'ليس لديك صلاحية ضمن دورك الوظيفي لتنفيذ هذا الإجراء.',
      {},
      403,
    );
  }
  return viewer;
}

export async function requireMfa() {
  const viewer = await requireViewer();
  if (viewer.mfaMetaVerified) return;
  try {
    const store = await cookies();
    if (isValidMfaCookie(store.get(MFA_COOKIE_NAME)?.value, viewer.id)) return;
  } catch {}
  const client = await createSessionClient();
  if (!client) throw new DomainError('SYSTEM_DEGRADED', undefined, {}, 503);
  const { data, error } = await client.auth.mfa.getAuthenticatorAssuranceLevel();
  if (error || data?.currentLevel !== 'aal2') {
    throw new DomainError('FORBIDDEN', 'يلزم التحقق بخطوتين لتنفيذ هذا الإجراء.', {}, 403);
  }
}

export const getViewerAdminAccess = cache(async () => {
  const viewer = await getViewer();
  if (!viewer) {
    return {
      viewer: null,
      roles: [] as string[],
      permissions: [] as string[],
      isAdmin: false,
      mfaVerified: false,
      mfaFactorId: null as string | null,
    };
  }
  const [db, sessionClient, cookieStore] = await Promise.all([
    Promise.resolve(createAdminClient()),
    createSessionClient(),
    cookies().catch(() => null),
  ]);
  let roles = ['user'];
  let permissions: string[] = [];
  if (db) {
    roles = await resolveVerifiedRoles(db, viewer);
    const { data: grants } = await db
      .from('role_permissions')
      .select('permission_code')
      .in('role_code', roles);
    permissions = Array.from(new Set((grants ?? []).map((g) => String(g.permission_code))));
    if (roles.includes('super_admin') && viewer.email === PRIMARY_SUPER_ADMIN_EMAIL) {
      permissions = Array.from(
        new Set([
          ...permissions,
          'admin.view',
          'plate.verify',
          'auction.create',
          'auction.edit',
          'auction.pause',
          'auction.cancel',
          'user.view',
          'user.suspend',
          'payment.view',
          'deposit.release',
          'deposit.capture',
          'settlement.manage',
          'cms.manage',
          'settings.manage',
          'audit.view',
          'identity.review',
        ]),
      );
    }
  }
  const cookieVerified = isValidMfaCookie(cookieStore?.get(MFA_COOKIE_NAME)?.value, viewer.id);
  let mfaVerified = Boolean(viewer.mfaMetaVerified || cookieVerified);
  let mfaFactorId: string | null = null;
  if (sessionClient) {
    try {
      const [aal, factors] = await Promise.all([
        sessionClient.auth.mfa.getAuthenticatorAssuranceLevel(),
        sessionClient.auth.mfa.listFactors(),
      ]);
      if (aal.data?.currentLevel === 'aal2') mfaVerified = true;
      mfaFactorId = factors.data?.totp?.find((f) => f.status === 'verified')?.id ?? null;
    } catch {}
  }
  const isAdmin =
    (roles.includes('super_admin') && viewer.email === PRIMARY_SUPER_ADMIN_EMAIL) ||
    permissions.includes('admin.view') ||
    permissions.length > 0;
  return {
    viewer,
    roles,
    permissions,
    isAdmin,
    mfaVerified,
    mfaFactorId,
  };
});
