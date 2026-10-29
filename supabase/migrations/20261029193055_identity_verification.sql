-- Sensitive identity records and documents are accessible only to the server.
create table public.identity_verification_requests (
  id uuid primary key,
  user_id uuid not null references public.profiles(id),
  full_name text not null check (length(trim(full_name)) between 3 and 120),
  national_id text not null check (national_id ~ '^[0-9]{10}$'),
  birth_date date not null check (birth_date <= current_date),
  phone text not null check (length(phone) between 7 and 20),
  email text not null check (length(email) between 3 and 254),
  city text not null check (length(trim(city)) between 2 and 100),
  front_path text not null unique,
  back_path text not null unique,
  status text not null default 'PENDING' check (status in ('PENDING','VERIFIED','REJECTED')),
  review_reason text,
  reviewed_by uuid references public.profiles(id),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  check (split_part(front_path,'/',1)=user_id::text and split_part(front_path,'/',2)=id::text),
  check (split_part(back_path,'/',1)=user_id::text and split_part(back_path,'/',2)=id::text)
);
create unique index identity_one_pending_per_user on public.identity_verification_requests(user_id) where status='PENDING';
create index identity_by_user on public.identity_verification_requests(user_id, submitted_at desc);
create index identity_review_queue on public.identity_verification_requests(status, submitted_at desc);
alter table public.identity_verification_requests enable row level security;
revoke all on public.identity_verification_requests from public, anon, authenticated;
grant all on public.identity_verification_requests to service_role;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('identity-documents','identity-documents',false,1572864,array['image/jpeg','image/png']);

create function public.fbs_submit_identity(p_id uuid,p_user_id uuid,p_data jsonb,p_front_path text,p_back_path text)
returns jsonb language plpgsql set search_path='' as $$
declare v_status text;
begin
  select kyc_status into v_status from public.profiles where id=p_user_id and status='ACTIVE' for update;
  if not found then raise exception 'AUTH_REQUIRED'; end if;
  if v_status in ('PENDING','VERIFIED') then raise exception 'INVALID_TRANSITION'; end if;
  insert into public.identity_verification_requests(id,user_id,full_name,national_id,birth_date,phone,email,city,front_path,back_path)
  values(p_id,p_user_id,p_data->>'fullName',p_data->>'nationalId',(p_data->>'birthDate')::date,p_data->>'phone',p_data->>'email',p_data->>'city',p_front_path,p_back_path);
  update public.profiles set kyc_status='PENDING',updated_at=now() where id=p_user_id;
  insert into public.audit_logs(actor_id,action,entity_type,entity_id,after_data)
  values(p_user_id,'identity.submit','identity_request',p_id,jsonb_build_object('status','PENDING'));
  return jsonb_build_object('status','PENDING');
end; $$;

create function public.fbs_review_identity(p_id uuid,p_actor_id uuid,p_status text,p_reason text)
returns jsonb language plpgsql set search_path='' as $$
declare r public.identity_verification_requests;
begin
  if not private.fbs_has_permission(p_actor_id,'identity.review') then raise exception 'FORBIDDEN'; end if;
  select * into r from public.identity_verification_requests where id=p_id for update;
  if not found then raise exception 'INVALID_INPUT'; end if;
  if r.user_id=p_actor_id then raise exception 'FORBIDDEN'; end if;
  if r.status <> 'PENDING' or p_status not in ('VERIFIED','REJECTED') then raise exception 'INVALID_TRANSITION'; end if;
  if p_status='REJECTED' and length(trim(coalesce(p_reason,'')))<3 then raise exception 'INVALID_INPUT'; end if;
  update public.identity_verification_requests set status=p_status,review_reason=nullif(trim(p_reason),''),reviewed_by=p_actor_id,reviewed_at=now() where id=p_id;
  update public.profiles set kyc_status=p_status,updated_at=now() where id=r.user_id;
  insert into public.audit_logs(actor_id,action,entity_type,entity_id,reason,before_data,after_data)
  values(p_actor_id,'identity.review','identity_request',p_id,nullif(trim(p_reason),''),jsonb_build_object('status',r.status),jsonb_build_object('status',p_status));
  return jsonb_build_object('status',p_status);
end; $$;
revoke all on function public.fbs_submit_identity(uuid,uuid,jsonb,text,text),public.fbs_review_identity(uuid,uuid,text,text) from public,anon,authenticated;
grant execute on function public.fbs_submit_identity(uuid,uuid,jsonb,text,text),public.fbs_review_identity(uuid,uuid,text,text) to service_role;
insert into public.roles(code,label) values('super_admin','مدير أعلى') on conflict do nothing;
insert into public.permissions(code,description) values('identity.review','Review private identity documents') on conflict do nothing;
insert into public.role_permissions(role_code,permission_code) values('super_admin','identity.review') on conflict do nothing;

-- Apply the identity requirement to every auction, including older registrations.
create function private.fbs_require_verified_identity() returns trigger language plpgsql set search_path='' as $$
begin
  if not exists(select 1 from public.profiles where id=new.user_id and status='ACTIVE' and kyc_status='VERIFIED') then
    raise exception 'IDENTITY_REQUIRED';
  end if;
  return new;
end; $$;
create trigger registration_identity_required before insert on public.auction_registrations for each row execute function private.fbs_require_verified_identity();
create trigger bid_identity_required before insert on public.bids for each row execute function private.fbs_require_verified_identity();

-- Check eligibility before returning an existing registration or accepting a new bid.
create or replace function public.fbs_bid(p_auction_id uuid,p_user_id uuid,p_amount bigint,p_request_id uuid,p_expected_sequence bigint)
returns jsonb language plpgsql set search_path='' as $$
declare a public.auctions; reg public.auction_registrations; dep public.payment_authorizations;
 old public.bid_requests; v_now timestamptz; v_end timestamptz; v_next bigint; v_inc bigint; v_bid uuid:=gen_random_uuid(); v_result jsonb; v_extended boolean:=false;
begin
 perform pg_advisory_xact_lock(hashtextextended(p_request_id::text,0));
 select * into old from public.bid_requests where bid_request_id=p_request_id;
 if found then
   if old.user_id<>p_user_id or old.auction_id<>p_auction_id or old.amount_minor<>p_amount then raise exception 'IDEMPOTENCY_CONFLICT'; end if;
   return old.response;
 end if;
 select * into a from public.auctions where id=p_auction_id for update;
 if not found then raise exception 'AUCTION_NOT_FOUND'; end if;
 v_now:=clock_timestamp();
 if not exists(select 1 from public.profiles p join auth.users u on u.id=p.id where p.id=p_user_id and p.status='ACTIVE' and u.email_confirmed_at is not null) then raise exception 'AUTH_REQUIRED'; end if;
 if exists(select 1 from public.plates where id=a.plate_id and owner_id=p_user_id) then raise exception 'FORBIDDEN'; end if;
 if not exists(select 1 from public.plates where id=a.plate_id and verification_status='APPROVED' and listing_status='PUBLISHED') then raise exception 'PLATE_NOT_VERIFIED'; end if;
 if a.status in ('PAUSED','SUSPENDED') then raise exception 'AUCTION_PAUSED'; end if;
 if a.status<>'LIVE' or v_now<a.start_at then raise exception 'AUCTION_NOT_LIVE'; end if;
 if v_now>=a.effective_end_at then raise exception 'AUCTION_ENDED'; end if;
 select * into reg from public.auction_registrations where auction_id=a.id and user_id=p_user_id for update;
 if not found or reg.status<>'QUALIFIED' then raise exception 'NOT_QUALIFIED'; end if;
 if not exists(select 1 from public.profiles where id=p_user_id and kyc_status='VERIFIED') then raise exception 'IDENTITY_REQUIRED'; end if;
 if p_expected_sequence<>a.sequence_no then raise exception 'STALE_BID'; end if;
 v_inc:=a.minimum_increment;
 if a.increment_mode='TIERED' then
   select increment_minor into v_inc from public.auction_increment_rules where auction_id=a.id and from_price_minor<=a.current_price order by from_price_minor desc limit 1;
   if v_inc is null then raise exception 'SYSTEM_DEGRADED'; end if;
 end if;
 v_next:=case when a.sequence_no=0 then a.starting_price else a.current_price+v_inc end;
 if p_amount is null or p_amount<=0 or p_amount<v_next or p_amount>9007199254740991 then raise exception 'BID_TOO_LOW'; end if;
 if not a.custom_higher_bids and p_amount<>v_next then raise exception 'INVALID_INPUT'; end if;
 v_end:=a.effective_end_at;
 if a.anti_sniping_enabled and v_end-v_now<=make_interval(secs=>a.extension_window_seconds) and a.extension_count<a.max_extensions then
   v_end:=v_end+make_interval(secs=>a.extension_duration_seconds);v_extended:=true;
 end if;
 if a.deposit_type<>'NONE' then
   select * into dep from public.payment_authorizations where id=reg.deposit_authorization_id for update;
   if not found or dep.status<>'AUTHORIZED' or dep.user_id<>p_user_id or dep.auction_id<>a.id or dep.amount_minor<reg.required_deposit_minor then raise exception 'DEPOSIT_REQUIRED'; end if;
   if dep.expires_at is null or dep.expires_at<=v_end then raise exception 'DEPOSIT_EXPIRED'; end if;
 end if;
 insert into public.bids(id,auction_id,user_id,amount_minor,sequence_no,bid_request_id,server_received_at,accepted_at)
 values(v_bid,a.id,p_user_id,p_amount,a.sequence_no+1,p_request_id,v_now,v_now);
 update public.auctions set current_price=p_amount,highest_bidder_id=p_user_id,sequence_no=sequence_no+1,version=version+1,
 effective_end_at=v_end,extension_count=extension_count+case when v_extended then 1 else 0 end,updated_at=v_now where id=a.id;
 v_result:=public.fbs_snapshot(a.id)||jsonb_build_object('bidId',v_bid,'bidRequestId',p_request_id,'accepted',true,'extended',v_extended);
 insert into public.bid_requests(bid_request_id,auction_id,user_id,amount_minor,expected_sequence,response) values(p_request_id,a.id,p_user_id,p_amount,p_expected_sequence,v_result);
 insert into public.outbox_events(aggregate_id,event_type,deduplication_key,payload) values(a.id,'bid.accepted','bid:'||v_bid,v_result);
 return v_result;
end;$$;
create or replace function public.fbs_register(p_auction_id uuid,p_user_id uuid,p_terms_version text) returns jsonb language plpgsql set search_path='' as $$
declare a public.auctions;r public.auction_registrations;v_deposit bigint;v_now timestamptz;
begin
 select * into a from public.auctions where id=p_auction_id for update;if not found then raise exception 'AUCTION_NOT_FOUND';end if;
 v_now:=clock_timestamp();
 if not exists(select 1 from public.profiles where id=p_user_id and kyc_status='VERIFIED') then raise exception 'IDENTITY_REQUIRED'; end if;
 select * into r from public.auction_registrations where auction_id=a.id and user_id=p_user_id;
 if found then return jsonb_build_object('id',r.id,'status',r.status);end if;
 if a.status<>'REGISTRATION_OPEN' or v_now<a.registration_start_at or v_now>=a.registration_end_at then raise exception 'INVALID_TRANSITION';end if;
 if exists(select 1 from public.plates where id=a.plate_id and owner_id=p_user_id) then raise exception 'FORBIDDEN';end if;
 if not exists(select 1 from public.profiles p join auth.users u on u.id=p.id where p.id=p_user_id and p.status='ACTIVE' and u.email_confirmed_at is not null and (not a.require_kyc or p.kyc_status='VERIFIED')) then raise exception 'NOT_QUALIFIED';end if;
 if not exists(select 1 from public.cms_pages where slug='auction-policy' and published and md5(body_ar)=p_terms_version) then raise exception 'INVALID_INPUT';end if;
 v_deposit:=case when a.deposit_type='NONE' then 0 when a.deposit_type='FIXED' then a.deposit_amount else ceil(a.starting_price::numeric*a.deposit_percentage/10000)::bigint end;
 insert into public.auction_registrations(auction_id,user_id,status,required_deposit_minor,terms_version,qualified_at)
 values(a.id,p_user_id,case when v_deposit=0 then 'QUALIFIED' else 'PAYMENT_PENDING' end,v_deposit,p_terms_version,case when v_deposit=0 then v_now end) returning * into r;
 return jsonb_build_object('id',r.id,'status',r.status,'requiredDeposit',v_deposit::text);
end;$$;
