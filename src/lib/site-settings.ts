import 'server-only';
import { cache } from 'react';
import { createAdminClient } from '@/lib/supabase/server';
import {
  DEFAULT_SITE_SETTINGS,
  normalizeSiteSettings,
  type SiteSettings,
  type SocialLinksConfig,
} from './site-settings-types';

export { DEFAULT_SITE_SETTINGS, normalizeSiteSettings };
export type { SiteSettings, SocialLinksConfig };

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const db = createAdminClient();
    if (!db) return DEFAULT_SITE_SETTINGS;
    const { data, error } = await db
      .from('system_settings')
      .select('value')
      .eq('key', 'site_config')
      .maybeSingle();
    if (error || !data?.value) return DEFAULT_SITE_SETTINGS;
    return normalizeSiteSettings(data.value);
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
});
