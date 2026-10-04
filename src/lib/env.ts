import "server-only";

export function publicSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try { if (!['https:', 'http:'].includes(new URL(url).protocol)) return null; } catch { return null; }
  return { url, key };
}

export function backendConfigured() {
  return Boolean(publicSupabaseEnv() && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function siteOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return new URL(configured).origin;
  if (process.env.NODE_ENV !== 'production') return 'http://localhost:3000';
  return null;
}
