import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { Catalog } from '@/components/catalog';
import { createAdminClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'المزادات' };

export default async function Auctions({
  params,
  searchParams
}: {
  params: Promise<{ filter?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { filter } = await params;
  const f = filter?.[0]?.toLowerCase();
  if (filter && filter.length > 1) notFound();

  // If someone accesses /auctions/all, redirect cleanly to /auctions preserving search params
  if (f === 'all') {
    const sp = await searchParams;
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(sp)) {
      if (typeof v === 'string') q.set(k, v);
      else if (Array.isArray(v)) q.set(k, v.join(','));
    }
    const qs = q.toString();
    redirect(qs ? `/auctions?${qs}` : '/auctions');
  }

  const mapping: Record<string, string> = {
    live: 'LIVE',
    upcoming: 'UPCOMING',
    completed: 'COMPLETED'
  };

  if (f && !mapping[f]) {
    const db = createAdminClient();
    const result = db
      ? await db
          .from('public_auctions')
          .select('plate_id')
          .eq('slug', f)
          .maybeSingle()
      : null;
    if (!result?.data) notFound();
    const p = await db!
      .from('public_plates')
      .select('slug')
      .eq('id', result.data.plate_id)
      .single();
    if (!p.data) notFound();
    redirect(`/plates/${p.data.slug}`);
  }

  return <Catalog query={await searchParams} auctionFilter={f ? mapping[f] : 'ALL'} />;
}
