-- FBS durable auction ledger. Generated migration name is assigned with the Supabase CLI.
-- All amounts are SAR halalas. The bound keeps PostgREST JSON numbers lossless.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to service_role;

create domain public.money_minor as bigint check (value >= 0 and value <= 9007199254740991);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete restrict,
  display_name text not null default '' check (length(display_name) <= 120),
  phone text check (phone is null or phone ~ '^\+[1-9][0-9]{7,14}$'),
  status text not null default 'ACTIVE' check (status in ('ACTIVE','SUSPENDED','CLOSED')),
  kyc_status text not null default 'NOT_STARTED' check (kyc_status in ('NOT_STARTED','PENDING','VERIFIED','REJECTED')),
  locale text not null default 'ar' check (locale in ('ar','en')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.roles (code text primary key, label text not null);
create table public.permissions (code text primary key, description text not null);
create table public.role_permissions (
  role_code text references public.roles(code) on delete cascade,
  permission_code text references public.permissions(code) on delete cascade,
  primary key(role_code,permission_code)
);
create table public.user_roles (
  user_id uuid references public.profiles(id) on delete restrict,
  role_code text references public.roles(code) on delete restrict,
  assigned_by uuid references public.profiles(id) on delete restrict,
  assigned_at timestamptz not null default now(), primary key(user_id,role_code)
);
create table public.plate_letters (
  id smallint primary key, arabic text not null unique, latin text not null unique,
  normalized_code text not null unique, sort_order smallint not null, active boolean not null default true
);
create table public.plate_types (
  id uuid primary key default gen_random_uuid(), code text not null unique,
  name_ar text not null, name_en text not null, active boolean not null default true, sort_order integer not null default 0
);
create table public.regions (
  id uuid primary key default gen_random_uuid(), code text not null unique, name_ar text not null, name_en text not null, active boolean not null default true
);
create table public.cities (
  id uuid primary key default gen_random_uuid(), region_id uuid not null references public.regions(id),
  name_ar text not null, name_en text not null, active boolean not null default true, unique(region_id,name_ar)
);
create table public.plates (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.profiles(id),
  slug text not null unique default gen_random_uuid()::text, type_id uuid not null references public.plate_types(id),
  letter_1_id smallint not null references public.plate_letters(id), letter_2_id smallint not null references public.plate_letters(id),
  letter_3_id smallint not null references public.plate_letters(id), digits text not null check(digits ~ '^[0-9]{1,4}$' and digits !~ '^0+$'),
  digits_count smallint generated always as (length(digits)) stored,
  city_id uuid references public.cities(id), description text not null default '' check(length(description) <= 5000),
  verification_status text not null default 'DRAFT' check(verification_status in ('DRAFT','SUBMITTED','DOCUMENTS_PENDING','UNDER_REVIEW','CHANGES_REQUIRED','REJECTED','VERIFIED','APPROVED')),
  listing_status text not null default 'DRAFT' check(listing_status in ('DRAFT','PUBLISHED','ARCHIVED','SOLD')),
  sale_mode text not null default 'AUCTION' check(sale_mode in ('AUCTION','FIXED_PRICE','AUCTION_WITH_BUY_NOW')),
  asking_price_minor public.money_minor, featured boolean not null default false,
  views_count bigint not null default 0 check(views_count >= 0), favorites_count bigint not null default 0 check(favorites_count >= 0),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (listing_status <> 'PUBLISHED' or verification_status = 'APPROVED')
);
create table public.plate_media (
  id uuid primary key default gen_random_uuid(), plate_id uuid not null references public.plates(id),
  object_path text not null unique, alt_ar text not null default '', sort_order integer not null default 0,
  is_primary boolean not null default false, created_at timestamptz not null default now()
);
create unique index plate_media_one_primary on public.plate_media(plate_id) where is_primary;
create table public.plate_documents (
  id uuid primary key default gen_random_uuid(), plate_id uuid not null references public.plates(id),
  owner_id uuid not null references public.profiles(id), object_path text not null unique,
  document_type text not null check(document_type in ('OWNERSHIP','IDENTITY','SUPPORTING')),
  mime_type text not null check(mime_type in ('application/pdf','image/jpeg','image/png')),
  size_bytes integer not null check(size_bytes > 0 and size_bytes <= 10485760),
  created_at timestamptz not null default now(), check(split_part(object_path,'/',1) = owner_id::text),
  check(split_part(object_path,'/',2) = plate_id::text)
);
create table public.plate_submissions (
  id uuid primary key default gen_random_uuid(), plate_id uuid not null references public.plates(id),
  user_id uuid not null references public.profiles(id), submitted_at timestamptz not null default now(),
  status text not null default 'SUBMITTED', note text
);
create table public.plate_verification_events (
  id uuid primary key default gen_random_uuid(), plate_id uuid not null references public.plates(id),
  actor_id uuid not null references public.profiles(id), previous_status text not null, status text not null,
  reason text not null check(length(trim(reason)) >= 3), created_at timestamptz not null default now()
);

create table public.auctions (
  id uuid primary key default gen_random_uuid(), plate_id uuid not null references public.plates(id), slug text not null unique default gen_random_uuid()::text,
  status text not null default 'DRAFT' check(status in ('DRAFT','PENDING_APPROVAL','SCHEDULED','REGISTRATION_OPEN','WAITING_ROOM','LIVE','ENDING','ENDED','SETTLEMENT','COMPLETED','PAUSED','SUSPENDED','CANCELLED','DISPUTED','RESERVE_NOT_MET')),
  starting_price public.money_minor not null, current_price public.money_minor not null,
  reserve_price public.money_minor, increment_mode text not null check(increment_mode in ('FIXED','TIERED')),
  minimum_increment public.money_minor not null check(minimum_increment > 0), custom_higher_bids boolean not null default true,
  deposit_type text not null check(deposit_type in ('NONE','FIXED','PERCENTAGE')),
  deposit_amount public.money_minor, deposit_percentage integer check(deposit_percentage between 1 and 10000),
  require_kyc boolean not null default false,
  registration_start_at timestamptz not null, registration_end_at timestamptz not null,
  start_at timestamptz not null, scheduled_end_at timestamptz not null, effective_end_at timestamptz not null,
  anti_sniping_enabled boolean not null, extension_window_seconds integer, extension_duration_seconds integer, max_extensions integer,
  extension_count integer not null default 0 check(extension_count >= 0), public_bid_history boolean not null default true,
  sequence_no bigint not null default 0 check(sequence_no between 0 and 9007199254740991),
  version bigint not null default 0 check(version between 0 and 9007199254740991),
  highest_bidder_id uuid references public.profiles(id), winner_id uuid references public.profiles(id), winning_bid_id uuid,
  winning_amount public.money_minor, finalized_at timestamptz,
  commission_type text not null check(commission_type in ('NONE','FIXED','PERCENTAGE')), commission_value public.money_minor,
  cancellation_reason text, paused_at timestamptz, paused_from_status text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check(current_price >= starting_price), check(reserve_price is null or reserve_price >= starting_price),
  check(registration_start_at < registration_end_at and registration_end_at <= start_at and start_at < scheduled_end_at and scheduled_end_at <= effective_end_at),
  check(not anti_sniping_enabled or (extension_window_seconds is not null and extension_window_seconds > 0 and extension_duration_seconds is not null and extension_duration_seconds > 0 and max_extensions is not null and max_extensions >= 0)),
  check(deposit_type <> 'FIXED' or (deposit_amount is not null and deposit_amount > 0)), check(deposit_type <> 'PERCENTAGE' or (deposit_percentage is not null and deposit_percentage > 0)),
  check(commission_type = 'NONE' or commission_value is not null), check(commission_type <> 'PERCENTAGE' or commission_value <= 10000)
);
create unique index auctions_one_active_plate on public.auctions(plate_id) where status not in ('COMPLETED','CANCELLED','ENDED','RESERVE_NOT_MET');
create table public.auction_increment_rules (
  id uuid primary key default gen_random_uuid(), auction_id uuid not null references public.auctions(id),
  from_price_minor public.money_minor not null, increment_minor public.money_minor not null check(increment_minor > 0), unique(auction_id,from_price_minor)
);
create table public.auction_registrations (
  id uuid primary key default gen_random_uuid(), auction_id uuid not null references public.auctions(id), user_id uuid not null references public.profiles(id),
  status text not null default 'PENDING' check(status in ('PENDING','PAYMENT_PENDING','AUTHORIZED','QUALIFIED','REJECTED','CANCELLED','EXPIRED','SUSPENDED')),
  bidder_alias text not null default ('مزايد ' || substr(replace(gen_random_uuid()::text,'-',''),1,8)),
  required_deposit_minor public.money_minor not null, deposit_authorization_id uuid,
  terms_version text not null, accepted_terms_at timestamptz not null default now(),
  qualified_at timestamptz, created_at timestamptz not null default now(), unique(auction_id,user_id)
);
create table public.bids (
  id uuid primary key default gen_random_uuid(), auction_id uuid not null references public.auctions(id), user_id uuid not null references public.profiles(id),
  amount_minor public.money_minor not null check(amount_minor > 0), sequence_no bigint not null check(sequence_no > 0),
  bid_request_id uuid not null unique, server_received_at timestamptz not null, accepted_at timestamptz not null,
  status text not null default 'ACCEPTED' check(status = 'ACCEPTED'), created_at timestamptz not null default now(), unique(auction_id,sequence_no)
);
alter table public.auctions add constraint auctions_winning_bid_fkey foreign key(winning_bid_id) references public.bids(id);
create table public.bid_requests (
  bid_request_id uuid primary key, auction_id uuid not null, user_id uuid not null references public.profiles(id),
  amount_minor bigint not null, expected_sequence bigint, response jsonb not null, created_at timestamptz not null default now()
);
create table public.auction_results (
  id uuid primary key default gen_random_uuid(), auction_id uuid not null unique references public.auctions(id),
  outcome text not null check(outcome in ('SOLD','NO_BIDS','RESERVE_NOT_MET','CANCELLED')),
  winner_id uuid references public.profiles(id), winning_bid_id uuid references public.bids(id), winning_amount_minor public.money_minor,
  final_sequence bigint not null, finalized_at timestamptz not null default now(),
  check((outcome = 'SOLD' and winner_id is not null and winning_bid_id is not null and winning_amount_minor is not null) or (outcome <> 'SOLD' and winner_id is null and winning_bid_id is null and winning_amount_minor is null))
);
create table public.auction_state_snapshots (
  auction_id uuid references public.auctions(id), version bigint not null, sequence_no bigint not null, payload jsonb not null,
  created_at timestamptz not null default now(), primary key(auction_id,version)
);
create table public.payment_authorizations (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id), auction_id uuid not null references public.auctions(id),
  registration_id uuid not null references public.auction_registrations(id), provider text not null,
  provider_authorization_id text, idempotency_key uuid not null unique, amount_minor public.money_minor not null check(amount_minor > 0),
  currency text not null default 'SAR' check(currency = 'SAR'),
  status text not null check(status in ('CREATED','AUTH_PENDING','AUTHORIZED','AUTH_FAILED','AUTH_EXPIRED','CAPTURE_PENDING','CAPTURED','CAPTURE_FAILED','VOID_PENDING','VOIDED','VOID_FAILED','REFUND_PENDING','REFUNDED','REFUND_FAILED','REQUIRES_REVIEW')),
  authorized_at timestamptz, expires_at timestamptz, captured_amount_minor public.money_minor not null default 0,
  refunded_amount_minor public.money_minor not null default 0, last_provider_event_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(provider,provider_authorization_id), check(captured_amount_minor <= amount_minor and refunded_amount_minor <= captured_amount_minor)
);
alter table public.auction_registrations add constraint registration_deposit_fkey foreign key(deposit_authorization_id) references public.payment_authorizations(id);
create table public.payment_transactions (
  id uuid primary key default gen_random_uuid(), authorization_id uuid not null references public.payment_authorizations(id),
  operation text not null check(operation in ('AUTHORIZE','CAPTURE','VOID','REFUND','RECONCILE')),
  idempotency_key uuid not null unique, amount_minor public.money_minor not null,
  status text not null check(status in ('PENDING','SUCCEEDED','FAILED','UNKNOWN')),
  actor_id uuid references public.profiles(id), reason text, provider_transaction_id text, error_code text,
  created_at timestamptz not null default now(), completed_at timestamptz
);
-- Financial operations alias table for an explicit resumable provider command ledger.
create table public.payment_operations (
  id uuid primary key default gen_random_uuid(), transaction_id uuid not null unique references public.payment_transactions(id),
  attempt_count integer not null default 0, next_attempt_at timestamptz not null default now(),
  lease_until timestamptz, status text not null default 'PENDING' check(status in ('PENDING','PROCESSING','SUCCEEDED','RETRY','DEAD_LETTER')),
  last_error_code text, created_at timestamptz not null default now()
);
create table public.payment_events (
  id uuid primary key default gen_random_uuid(), provider text not null, provider_event_id text not null,
  authorization_id uuid references public.payment_authorizations(id), event_type text not null, provider_created_at timestamptz,
  payload jsonb not null, received_at timestamptz not null default now(), processed_at timestamptz,
  processing_status text not null default 'RECEIVED' check(processing_status in ('RECEIVED','PROCESSED','IGNORED','REQUIRES_REVIEW')),
  unique(provider,provider_event_id)
);
create table public.settlements (
  id uuid primary key default gen_random_uuid(), auction_id uuid not null unique references public.auctions(id),
  result_id uuid not null unique references public.auction_results(id), seller_id uuid not null references public.profiles(id), winner_id uuid not null references public.profiles(id),
  winning_amount_minor public.money_minor not null, commission_minor public.money_minor not null,
  remaining_amount_minor public.money_minor not null, status text not null default 'WINNER_CONFIRMED'
  check(status in ('WINNER_CONFIRMED','PARTIES_CONTACTED','TRANSFER_IN_PROGRESS','TRANSFER_CONFIRMED','COMPLETED','DISPUTED','CANCELLED')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.favorites (
  user_id uuid references public.profiles(id), plate_id uuid references public.plates(id), created_at timestamptz not null default now(), primary key(user_id,plate_id)
);
create table public.saved_searches (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id), name text not null,
  filters jsonb not null, alert_enabled boolean not null default false, created_at timestamptz not null default now()
);
create table public.notifications (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id), type text not null,
  title text not null, body text not null, href text, deduplication_key text unique, read_at timestamptz, created_at timestamptz not null default now()
);
create table public.notification_preferences (
  user_id uuid primary key references public.profiles(id), email_enabled boolean not null default true,
  auction_updates boolean not null default true, marketing_enabled boolean not null default false, updated_at timestamptz not null default now()
);
create table public.cms_pages (
  slug text primary key, title_ar text not null, title_en text, body_ar text not null, body_en text,
  published boolean not null default false, updated_by uuid references public.profiles(id), updated_at timestamptz not null default now()
);
create table public.faqs (
  id uuid primary key default gen_random_uuid(), question_ar text not null, answer_ar text not null,
  question_en text, answer_en text, sort_order integer not null default 0, published boolean not null default false
);
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(), user_id uuid references public.profiles(id), name text not null, email text not null,
  subject text not null, message text not null check(length(message) <= 5000), status text not null default 'NEW', created_at timestamptz not null default now()
);
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(), actor_id uuid references public.profiles(id), action text not null, entity_type text not null,
  entity_id uuid, reason text, before_data jsonb, after_data jsonb, request_id uuid, created_at timestamptz not null default now()
);
create table public.system_settings (
  key text primary key, value jsonb not null, description text not null, updated_by uuid references public.profiles(id), updated_at timestamptz not null default now()
);
create table public.feature_flags (
  key text primary key, enabled boolean not null default false, description text not null, updated_at timestamptz not null default now()
);
create table public.outbox_events (
  id uuid primary key default gen_random_uuid(), aggregate_id uuid not null, event_type text not null,
  deduplication_key text not null unique, payload jsonb not null, created_at timestamptz not null default now(),
  available_at timestamptz not null default now(), processed_at timestamptz, attempt_count integer not null default 0,
  lease_until timestamptz, lease_token uuid, last_error text
);
create table public.jobs (
  id uuid primary key default gen_random_uuid(), type text not null, deduplication_key text not null unique, payload jsonb not null,
  status text not null default 'PENDING' check(status in ('PENDING','PROCESSING','SUCCEEDED','RETRY','DEAD_LETTER')),
  available_at timestamptz not null default now(), lease_until timestamptz, lease_token uuid,
  attempt_count integer not null default 0, last_error text, created_at timestamptz not null default now(), completed_at timestamptz
);

create index plates_owner on public.plates(owner_id,created_at desc);
create index plates_catalog on public.plates(listing_status,verification_status,featured,created_at desc);
create index plates_letters on public.plates(letter_1_id,letter_2_id,letter_3_id);
create index plates_digits on public.plates(digits text_pattern_ops);
create index plates_type_city on public.plates(type_id,city_id);
create index plate_documents_owner on public.plate_documents(owner_id,plate_id);
create index plate_media_plate on public.plate_media(plate_id,sort_order);
create index plate_submissions_plate on public.plate_submissions(plate_id,submitted_at desc);
create index plate_verification_plate on public.plate_verification_events(plate_id,created_at desc);
create index auctions_status_time on public.auctions(status,start_at,effective_end_at);
create index registrations_user on public.auction_registrations(user_id,created_at desc);
create index registrations_status on public.auction_registrations(auction_id,status);
create index bids_user on public.bids(user_id,accepted_at desc);
create index bids_auction_latest on public.bids(auction_id,sequence_no desc);
create index bid_requests_user on public.bid_requests(user_id,created_at desc);
create index authorizations_auction_status on public.payment_authorizations(auction_id,status);
create index authorizations_user on public.payment_authorizations(user_id,created_at desc);
create index payment_transactions_authorization on public.payment_transactions(authorization_id,created_at desc);
create index payment_events_authorization on public.payment_events(authorization_id,received_at desc);
create index settlements_parties on public.settlements(winner_id,seller_id);
create index notifications_user on public.notifications(user_id,created_at desc);
create index audit_entity on public.audit_logs(entity_type,entity_id,created_at desc);
create index outbox_pending on public.outbox_events(available_at,created_at) where processed_at is null;
create index jobs_pending on public.jobs(status,available_at) where status in ('PENDING','RETRY','PROCESSING');
create index favorites_plate on public.favorites(plate_id);
create index saved_searches_user on public.saved_searches(user_id);
create index cities_region on public.cities(region_id);

-- Auth-trigger user metadata is display data only. Authorization never reads it.
create function private.fbs_create_profile() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id,display_name) values(new.id,left(coalesce(new.raw_user_meta_data->>'display_name',''),120)) on conflict(id) do nothing;
  insert into public.notification_preferences(user_id) values(new.id) on conflict(user_id) do nothing;
  return new;
end; $$;
create trigger fbs_auth_user_created after insert on auth.users for each row execute function private.fbs_create_profile();

create function private.fbs_has_permission(p_actor_id uuid,p_permission text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(
    select 1 from public.profiles p join auth.users u on u.id=p.id
    where p.id=p_actor_id and p.status='ACTIVE' and exists(
      select 1 from public.role_permissions rp where rp.permission_code=p_permission and
        (rp.role_code = u.raw_app_meta_data->>'role' or exists(select 1 from public.user_roles ur where ur.user_id=p.id and ur.role_code=rp.role_code))
    )
  );
$$;

create function private.fbs_immutable_ledger() returns trigger language plpgsql set search_path = '' as $$
begin raise exception using errcode='42501', message='APPEND_ONLY_LEDGER'; end; $$;
create trigger bids_immutable before update or delete on public.bids for each row execute function private.fbs_immutable_ledger();
create trigger bid_requests_immutable before update or delete on public.bid_requests for each row execute function private.fbs_immutable_ledger();
create trigger results_immutable before update or delete on public.auction_results for each row execute function private.fbs_immutable_ledger();
create trigger audit_immutable before update or delete on public.audit_logs for each row execute function private.fbs_immutable_ledger();
create trigger verification_immutable before update or delete on public.plate_verification_events for each row execute function private.fbs_immutable_ledger();

-- Every table has RLS; grants are explicit instead of relying on Supabase defaults.
do $$ declare t record; begin
  for t in select tablename from pg_tables where schemaname='public' loop
    execute format('alter table public.%I enable row level security',t.tablename);
    execute format('revoke all on table public.%I from anon,authenticated',t.tablename);
    execute format('grant all on table public.%I to service_role',t.tablename);
  end loop;
end; $$;
grant select on public.plate_letters,public.plate_types,public.regions,public.cities,public.cms_pages,public.faqs to anon,authenticated;
create policy letters_public on public.plate_letters for select to anon,authenticated using(active);
create policy types_public on public.plate_types for select to anon,authenticated using(active);
create policy regions_public on public.regions for select to anon,authenticated using(active);
create policy cities_public on public.cities for select to anon,authenticated using(active);
create policy pages_public on public.cms_pages for select to anon,authenticated using(published);
create policy faqs_public on public.faqs for select to anon,authenticated using(published);
grant select on public.profiles,public.plates,public.plate_documents,public.plate_submissions,public.plate_verification_events,
  public.auction_registrations,public.bids,public.bid_requests,public.payment_authorizations,public.settlements,
  public.favorites,public.saved_searches,public.notifications,public.notification_preferences to authenticated;
grant update(display_name,phone,locale) on public.profiles to authenticated;
create policy profile_read on public.profiles for select to authenticated using(id=(select auth.uid()));
create policy profile_update on public.profiles for update to authenticated using(id=(select auth.uid())) with check(id=(select auth.uid()));
create policy plates_owner on public.plates for select to authenticated using(owner_id=(select auth.uid()));
create policy docs_owner on public.plate_documents for select to authenticated using(owner_id=(select auth.uid()));
create policy submissions_owner on public.plate_submissions for select to authenticated using(user_id=(select auth.uid()));
create policy verifications_owner on public.plate_verification_events for select to authenticated using(exists(select 1 from public.plates p where p.id=plate_id and p.owner_id=(select auth.uid())));
create policy registrations_owner on public.auction_registrations for select to authenticated using(user_id=(select auth.uid()));
create policy bids_owner on public.bids for select to authenticated using(user_id=(select auth.uid()));
create policy bid_requests_owner on public.bid_requests for select to authenticated using(user_id=(select auth.uid()));
create policy payments_owner on public.payment_authorizations for select to authenticated using(user_id=(select auth.uid()));
create policy settlements_party on public.settlements for select to authenticated using(winner_id=(select auth.uid()) or seller_id=(select auth.uid()));
grant insert,delete on public.favorites to authenticated;
create policy favorites_read on public.favorites for select to authenticated using(user_id=(select auth.uid()));
create policy favorites_insert on public.favorites for insert to authenticated with check(user_id=(select auth.uid()));
create policy favorites_delete on public.favorites for delete to authenticated using(user_id=(select auth.uid()));
grant insert,update,delete on public.saved_searches to authenticated;
create policy searches_owned on public.saved_searches for all to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
grant update(read_at) on public.notifications to authenticated;
create policy notifications_read on public.notifications for select to authenticated using(user_id=(select auth.uid()));
create policy notifications_update on public.notifications for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
grant update(email_enabled,auction_updates,marketing_enabled) on public.notification_preferences to authenticated;
create policy preferences_read on public.notification_preferences for select to authenticated using(user_id=(select auth.uid()));
create policy preferences_update on public.notification_preferences for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));

-- Public DTO projections contain no owner IDs, private documents or reserve prices.
-- Deliberately server-only: the invoker view must not grant SELECT on private base tables to visitors.
create view public.public_plates with(security_invoker=true) as
select p.id,p.slug,array[l1.arabic,l2.arabic,l3.arabic] as letters_ar,array[l1.latin,l2.latin,l3.latin] as letters_en,
  p.digits as numbers,c.name_ar as city,t.name_ar as type,p.asking_price_minor as price_minor,
  p.listing_status as status,p.featured,p.description,(p.verification_status='APPROVED') as verified,p.created_at,
  concat_ws(' ',p.digits,l1.arabic,l2.arabic,l3.arabic,l1.latin,l2.latin,l3.latin) as search_text,
  p.digits_count,p.type_id,p.city_id,p.letter_1_id,p.letter_2_id,p.letter_3_id
from public.plates p join public.plate_letters l1 on l1.id=p.letter_1_id join public.plate_letters l2 on l2.id=p.letter_2_id
join public.plate_letters l3 on l3.id=p.letter_3_id join public.plate_types t on t.id=p.type_id left join public.cities c on c.id=p.city_id
where p.listing_status in ('PUBLISHED','SOLD') and p.verification_status='APPROVED';
create view public.public_auctions with(security_invoker=true) as
select a.id,a.slug,a.plate_id,a.status,a.start_at as starts_at,a.effective_end_at as ends_at,a.current_price as current_price_minor,
  a.starting_price as starting_price_minor,a.sequence_no as bid_count,a.minimum_increment as minimum_increment_minor,
  a.registration_end_at as registration_ends_at,
  case when a.deposit_type='NONE' then 0 when a.deposit_type='FIXED' then a.deposit_amount else ceil(a.starting_price::numeric*a.deposit_percentage/10000)::bigint end as deposit_amount_minor,
  a.sequence_no as sequence,a.version,a.anti_sniping_enabled,a.extension_count,a.public_bid_history
from public.auctions a join public.plates p on p.id=a.plate_id
where a.status not in ('DRAFT','PENDING_APPROVAL') and p.verification_status='APPROVED' and p.listing_status in ('PUBLISHED','SOLD');
revoke all on public.public_plates,public.public_auctions from anon,authenticated;
grant select on public.public_plates,public.public_auctions to service_role;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
  ('ownership-documents','ownership-documents',false,10485760,array['application/pdf','image/jpeg','image/png']),
  ('plate-media','plate-media',true,10485760,array['image/jpeg','image/png','image/webp'])
on conflict(id) do nothing;
create policy fbs_private_document_read on storage.objects for select to authenticated
using(bucket_id='ownership-documents' and split_part(name,'/',1)=(select auth.uid())::text and exists(
  select 1 from public.plates p where p.id::text=split_part(name,'/',2) and p.owner_id=(select auth.uid())
));
create policy fbs_private_document_upload on storage.objects for insert to authenticated
with check(bucket_id='ownership-documents' and split_part(name,'/',1)=(select auth.uid())::text and exists(
  select 1 from public.plates p where p.id::text=split_part(name,'/',2) and p.owner_id=(select auth.uid()) and p.verification_status in ('DRAFT','CHANGES_REQUIRED','DOCUMENTS_PENDING')
));
-- No UPDATE/DELETE storage policy: immutable evidence cannot be replaced while under review.
revoke all on all functions in schema private from public,anon,authenticated;
grant execute on all functions in schema private to service_role;
