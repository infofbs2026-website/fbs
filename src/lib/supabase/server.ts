import "server-only";
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { publicSupabaseEnv } from '@/lib/env';

export async function createSessionClient() {
  const env = publicSupabaseEnv();
  if (!env) return null;
  const store = await cookies();
  return createServerClient(env.url, env.key, {
    cookieOptions: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' },
    cookies: {
      getAll: () => store.getAll(),
      setAll: (entries) => {
        try { for (const { name, value, options } of entries) store.set(name, value, options); }
        catch { /* Server Components cannot write; proxy refreshes their sessions. */ }
      },
    },
  });
}

/** Server-only privileged client. Callers must authorize before private queries. */
export function createAdminClient() {
  const env = publicSupabaseEnv();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!env || !key) return null;
  return createClient(env.url, key, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
}
