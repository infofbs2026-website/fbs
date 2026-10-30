import { PGlite } from '@electric-sql/pglite';
import { readFile, readdir } from 'node:fs/promises';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
let db: PGlite;
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth; create table auth.users(id uuid primary key, aud text, role text, encrypted_password text, raw_user_meta_data jsonb default '{}', raw_app_meta_data jsonb default '{}', email_confirmed_at timestamptz,created_at timestamptz,updated_at timestamptz,banned_until timestamptz);
    create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
    grant usage on schema auth to anon,authenticated,service_role;grant execute on function auth.uid() to anon,authenticated,service_role;grant select on auth.users to service_role;
    create schema storage;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
    create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text);alter table storage.objects enable row level security;grant usage on schema storage to authenticated,service_role;grant select,insert on storage.objects to authenticated;`);
  for (const file of (await readdir('supabase/migrations')).filter(file => file.endsWith('.sql')).sort()) await db.exec(await readFile(`supabase/migrations/${file}`, 'utf8'));
  await db.exec(await readFile('supabase/seed.sql','utf8'));
}, 60000);
afterAll(async () => { await db.close(); });
describe('optional catalog database data', () => {
  it('creates real, private-owner catalog records and can be reapplied safely', async () => {
    const sql = await readFile('supabase/manual/restore_catalog_data.sql','utf8');
    await db.exec(sql);
    await db.exec(sql);
    const totals = await db.query<{plates:number;auctions:number;direct:number;owners:number;bids:number}>(`select
      (select count(*)::int from public.public_plates) plates,
      (select count(*)::int from public.public_auctions) auctions,
      (select count(*)::int from public.plates where sale_mode='FIXED_PRICE') direct,
      (select count(*)::int from auth.users where raw_app_meta_data->>'fbs_catalog_owner'='true') owners,
      (select count(*)::int from public.bids) bids`);
    expect(totals.rows[0]).toEqual({plates:18,auctions:9,direct:9,owners:1,bids:0});
    const f = await db.query<{active:boolean}>("select active from public.plate_letters where arabic='ف'");
    expect(f.rows[0].active).toBe(false);
    const auction = await db.query<{current_price:string;starting_price:string;sequence_no:string}>("select current_price,starting_price,sequence_no from public.auctions where slug='auction-fbs-1'");
    expect(String(auction.rows[0].current_price)).toBe(String(auction.rows[0].starting_price));
    expect(Number(auction.rows[0].sequence_no)).toBe(0);
  });
});
