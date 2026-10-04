-- Invoker RPCs are service-role only. HTTP handlers authenticate and rate-limit first.
-- The auction row serializes bids and finalization across ALL application instances.
create function public.fbs_snapshot(p_auction_id uuid) returns jsonb language sql volatile set search_path='' as $$
 select jsonb_build_object('auctionId',a.id,'status',a.status,'currentBid',a.current_price::text,
 'minimumNextBid',(case when a.sequence_no=0 then a.starting_price else a.current_price+coalesce((select r.increment_minor from public.auction_increment_rules r where r.auction_id=a.id and r.from_price_minor<=a.current_price and a.increment_mode='TIERED' order by r.from_price_minor desc limit 1),a.minimum_increment) end)::text,
 'sequence',a.sequence_no,'version',a.version,'bidCount',a.sequence_no,'serverTime',clock_timestamp(),
 'effectiveEndAt',a.effective_end_at,'startAt',a.start_at,'highestBidderMasked',r.bidder_alias,
 'publicBidHistory',a.public_bid_history,'termsVersion',(select md5(body_ar) from public.cms_pages where slug='auction-policy' and published))
 from public.auctions a join public.plates p on p.id=a.plate_id left join public.auction_registrations r on r.auction_id=a.id and r.user_id=a.highest_bidder_id
 where a.id=p_auction_id and p.verification_status='APPROVED' and p.listing_status in ('PUBLISHED','SOLD') and a.status not in ('DRAFT','PENDING_APPROVAL');
$$;
create function public.fbs_bid(p_auction_id uuid,p_user_id uuid,p_amount bigint,p_request_id uuid,p_expected_sequence bigint)
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
 if a.require_kyc and not exists(select 1 from public.profiles where id=p_user_id and kyc_status='VERIFIED') then raise exception 'NOT_QUALIFIED'; end if;
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
create function public.fbs_register(p_auction_id uuid,p_user_id uuid,p_terms_version text) returns jsonb language plpgsql set search_path='' as $$
declare a public.auctions;r public.auction_registrations;v_deposit bigint;v_now timestamptz;
begin
 select * into a from public.auctions where id=p_auction_id for update;if not found then raise exception 'AUCTION_NOT_FOUND';end if;
 v_now:=clock_timestamp();
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
create function public.fbs_finalize(p_auction_id uuid) returns jsonb language plpgsql set search_path='' as $$
declare a public.auctions;r public.auction_results;b public.bids;v_outcome text;v_now timestamptz;v_seller uuid;v_fee bigint;
begin
 select * into a from public.auctions where id=p_auction_id for update;if not found then raise exception 'AUCTION_NOT_FOUND';end if;
 select * into r from public.auction_results where auction_id=a.id;if found then return to_jsonb(r);end if;
 v_now:=clock_timestamp();if a.status not in ('LIVE','ENDING') or v_now<a.effective_end_at then raise exception 'INVALID_TRANSITION';end if;
 select * into b from public.bids where auction_id=a.id order by sequence_no desc limit 1;
 if a.sequence_no>0 and (b.id is null or b.sequence_no<>a.sequence_no or b.amount_minor<>a.current_price or b.user_id<>a.highest_bidder_id) then raise exception 'SYSTEM_DEGRADED';end if;
 v_outcome:=case when a.sequence_no=0 then 'NO_BIDS' when a.reserve_price is not null and a.current_price<a.reserve_price then 'RESERVE_NOT_MET' else 'SOLD' end;
 insert into public.auction_results(auction_id,outcome,winner_id,winning_bid_id,winning_amount_minor,final_sequence,finalized_at)
 values(a.id,v_outcome,case when v_outcome='SOLD' then b.user_id end,case when v_outcome='SOLD' then b.id end,case when v_outcome='SOLD' then b.amount_minor end,a.sequence_no,v_now) returning * into r;
 update public.auctions set status=case when v_outcome='RESERVE_NOT_MET' then 'RESERVE_NOT_MET' else 'ENDED' end,winner_id=r.winner_id,winning_bid_id=r.winning_bid_id,winning_amount=r.winning_amount_minor,finalized_at=v_now,version=version+1 where id=a.id;
 if v_outcome='SOLD' then
   select owner_id into v_seller from public.plates where id=a.plate_id;
   v_fee:=case when a.commission_type='NONE' then 0 when a.commission_type='FIXED' then a.commission_value else ceil(b.amount_minor::numeric*a.commission_value/10000)::bigint end;
   insert into public.settlements(auction_id,result_id,seller_id,winner_id,winning_amount_minor,commission_minor,remaining_amount_minor) values(a.id,r.id,v_seller,b.user_id,b.amount_minor,v_fee,b.amount_minor);
 end if;
 insert into public.jobs(type,deduplication_key,payload)
 select case when p.user_id=r.winner_id then 'capture_winner' else 'release_deposit' end,'finalize:'||a.id||':'||p.id,jsonb_build_object('authorizationId',p.id,'auctionId',a.id)
 from public.payment_authorizations p where p.auction_id=a.id and p.status='AUTHORIZED' on conflict(deduplication_key) do nothing;
 insert into public.outbox_events(aggregate_id,event_type,deduplication_key,payload) values(a.id,'auction.ended','ended:'||a.id,public.fbs_snapshot(a.id));
 return to_jsonb(r);
end;$$;
create function public.fbs_verify_plate(p_plate_id uuid,p_actor_id uuid,p_status text,p_reason text) returns jsonb language plpgsql set search_path='' as $$
declare p public.plates;
begin
 if not private.fbs_has_permission(p_actor_id,'plate.verify') then raise exception 'FORBIDDEN';end if;
 if p_status not in ('UNDER_REVIEW','CHANGES_REQUIRED','REJECTED','APPROVED') or length(trim(p_reason))<3 then raise exception 'INVALID_INPUT';end if;
 select * into p from public.plates where id=p_plate_id for update;if not found or p.owner_id=p_actor_id then raise exception 'FORBIDDEN';end if;
 if p.verification_status not in ('SUBMITTED','UNDER_REVIEW','DOCUMENTS_PENDING','CHANGES_REQUIRED','VERIFIED') then raise exception 'INVALID_TRANSITION';end if;
 if p_status='APPROVED' and not exists(select 1 from public.plate_documents where plate_id=p.id and document_type='OWNERSHIP') then raise exception 'INVALID_INPUT';end if;
 update public.plates set verification_status=p_status,listing_status=case when p_status='APPROVED' then 'PUBLISHED' else 'DRAFT' end,updated_at=clock_timestamp() where id=p.id;
 insert into public.plate_verification_events(plate_id,actor_id,previous_status,status,reason) values(p.id,p_actor_id,p.verification_status,p_status,p_reason);
 insert into public.audit_logs(actor_id,action,entity_type,entity_id,reason,before_data,after_data) values(p_actor_id,'plate.verify','plate',p.id,p_reason,jsonb_build_object('status',p.verification_status),jsonb_build_object('status',p_status));
 insert into public.notifications(user_id,type,title,body,href) values(p.owner_id,'plate.review','تحديث حالة لوحتك',p_reason,'/account/plates');
 return jsonb_build_object('status',p_status);
end;$$;
create function public.fbs_auction_transition(p_auction_id uuid,p_actor_id uuid,p_status text,p_reason text) returns jsonb language plpgsql set search_path='' as $$
declare a public.auctions;v_now timestamptz;v_permission text;
begin
 v_permission:=case when p_status='PAUSED' then 'auction.pause' when p_status='LIVE' then 'auction.resume' when p_status='CANCELLED' then 'auction.cancel' else 'auction.edit' end;
 if not private.fbs_has_permission(p_actor_id,v_permission) then raise exception 'FORBIDDEN';end if;
 if length(trim(p_reason))<3 then raise exception 'INVALID_INPUT';end if;
 select * into a from public.auctions where id=p_auction_id for update;if not found then raise exception 'AUCTION_NOT_FOUND';end if;v_now:=clock_timestamp();
 if not ((a.status='DRAFT' and p_status='PENDING_APPROVAL') or (a.status='PENDING_APPROVAL' and p_status='SCHEDULED') or
 (a.status='SCHEDULED' and p_status='REGISTRATION_OPEN' and v_now>=a.registration_start_at and v_now<a.registration_end_at) or
 (a.status='REGISTRATION_OPEN' and p_status='WAITING_ROOM' and v_now>=a.registration_end_at) or
 (a.status in ('WAITING_ROOM','PAUSED') and p_status='LIVE' and v_now>=a.start_at and (a.status='PAUSED' or v_now<a.effective_end_at)) or
 (a.status='LIVE' and p_status='PAUSED' and v_now<a.effective_end_at) or
 (a.status in ('DRAFT','PENDING_APPROVAL','SCHEDULED','REGISTRATION_OPEN','WAITING_ROOM','LIVE','PAUSED','SUSPENDED') and p_status='CANCELLED')) then raise exception 'INVALID_TRANSITION';end if;
 if not exists(select 1 from public.plates where id=a.plate_id and verification_status='APPROVED') then raise exception 'PLATE_NOT_VERIFIED';end if;
 if p_status='LIVE' and a.deposit_type<>'NONE' and exists(select 1 from public.auction_registrations r left join public.payment_authorizations d on d.id=r.deposit_authorization_id where r.auction_id=a.id and r.status='QUALIFIED' and (d.id is null or d.status<>'AUTHORIZED' or d.expires_at is null or d.expires_at<=a.effective_end_at+case when a.status='PAUSED' then v_now-a.paused_at else interval '0' end)) then raise exception 'DEPOSIT_EXPIRED';end if;
 update public.auctions set status=p_status,version=version+1,paused_at=case when p_status='PAUSED' then v_now else null end,effective_end_at=case when a.status='PAUSED' and p_status='LIVE' then effective_end_at+(v_now-a.paused_at) else effective_end_at end,cancellation_reason=case when p_status='CANCELLED' then p_reason else cancellation_reason end where id=a.id;
 if p_status='CANCELLED' then
   insert into public.jobs(type,deduplication_key,payload) select 'release_deposit','cancel:'||a.id||':'||id,jsonb_build_object('authorizationId',id,'auctionId',a.id) from public.payment_authorizations where auction_id=a.id and status='AUTHORIZED' on conflict(deduplication_key) do nothing;
 end if;
 insert into public.audit_logs(actor_id,action,entity_type,entity_id,reason,before_data,after_data) values(p_actor_id,'auction.transition','auction',a.id,p_reason,jsonb_build_object('status',a.status),jsonb_build_object('status',p_status));
 insert into public.outbox_events(aggregate_id,event_type,deduplication_key,payload) values(a.id,'auction.updated','transition:'||a.id||':'||(a.version+1),public.fbs_snapshot(a.id));
 return jsonb_build_object('status',p_status);
end;$$;
revoke all on function public.fbs_snapshot(uuid),public.fbs_bid(uuid,uuid,bigint,uuid,bigint),public.fbs_register(uuid,uuid,text),public.fbs_finalize(uuid),public.fbs_verify_plate(uuid,uuid,text,text),public.fbs_auction_transition(uuid,uuid,text,text) from public,anon,authenticated;
grant execute on function public.fbs_snapshot(uuid),public.fbs_bid(uuid,uuid,bigint,uuid,bigint),public.fbs_register(uuid,uuid,text),public.fbs_finalize(uuid),public.fbs_verify_plate(uuid,uuid,text,text),public.fbs_auction_transition(uuid,uuid,text,text) to service_role;

create function public.fbs_submit_plate(p_plate_id uuid,p_user_id uuid) returns jsonb language plpgsql set search_path='' as $$
declare p public.plates;
begin
 select * into p from public.plates where id=p_plate_id and owner_id=p_user_id for update;
 if not found then raise exception 'FORBIDDEN';end if;
 if p.verification_status='SUBMITTED' then return jsonb_build_object('status','SUBMITTED');end if;
 if p.verification_status not in ('DRAFT','CHANGES_REQUIRED','DOCUMENTS_PENDING') then raise exception 'INVALID_TRANSITION';end if;
 if not exists(select 1 from public.plate_documents where plate_id=p.id and owner_id=p_user_id and document_type='OWNERSHIP') then raise exception 'INVALID_INPUT';end if;
 update public.plates set verification_status='SUBMITTED',updated_at=clock_timestamp() where id=p.id;
 insert into public.plate_submissions(plate_id,user_id) values(p.id,p_user_id);
 insert into public.audit_logs(actor_id,action,entity_type,entity_id,after_data) values(p_user_id,'plate.submit','plate',p.id,jsonb_build_object('status','SUBMITTED'));
 return jsonb_build_object('status','SUBMITTED');
end;$$;
create function public.fbs_save_cms(p_actor_id uuid,p_slug text,p_title text,p_body text,p_published boolean,p_reason text) returns jsonb language plpgsql set search_path='' as $$
begin
 if not private.fbs_has_permission(p_actor_id,'cms.manage') then raise exception 'FORBIDDEN';end if;
 if length(trim(p_reason))<3 or p_slug !~ '^[a-z-]+$' then raise exception 'INVALID_INPUT';end if;
 insert into public.cms_pages(slug,title_ar,body_ar,published,updated_by) values(p_slug,p_title,p_body,p_published,p_actor_id)
 on conflict(slug) do update set title_ar=excluded.title_ar,body_ar=excluded.body_ar,published=excluded.published,updated_by=excluded.updated_by,updated_at=clock_timestamp();
 insert into public.audit_logs(actor_id,action,entity_type,reason,after_data) values(p_actor_id,'cms.update','cms',p_reason,jsonb_build_object('slug',p_slug,'title',p_title,'body',p_body,'published',p_published));
 return jsonb_build_object('slug',p_slug);
end;$$;
create function public.fbs_create_auction(p_actor_id uuid,p_config jsonb) returns jsonb language plpgsql set search_path='' as $$
declare p public.plates;v_id uuid;v_deposit bigint;v_start bigint;
begin
 if not private.fbs_has_permission(p_actor_id,'auction.create') then raise exception 'FORBIDDEN';end if;
 if length(trim(p_config->>'reason'))<3 then raise exception 'INVALID_INPUT';end if;
 select * into p from public.plates where id=(p_config->>'plateId')::uuid for update;
 if not found or p.verification_status<>'APPROVED' or p.listing_status<>'PUBLISHED' then raise exception 'PLATE_NOT_VERIFIED';end if;
 if p.owner_id=p_actor_id then raise exception 'FORBIDDEN';end if;
 v_deposit:=(p_config->>'depositAmount')::bigint;v_start:=(p_config->>'startingPrice')::bigint;
 if v_start<=0 or (p_config->>'registrationStart')::timestamptz<=clock_timestamp() then raise exception 'INVALID_INPUT';end if;
 insert into public.auctions(plate_id,starting_price,current_price,reserve_price,increment_mode,minimum_increment,deposit_type,deposit_amount,require_kyc,
 registration_start_at,registration_end_at,start_at,scheduled_end_at,effective_end_at,anti_sniping_enabled,extension_window_seconds,extension_duration_seconds,max_extensions,commission_type,commission_value)
 values(p.id,v_start,v_start,nullif(p_config->>'reservePrice','')::bigint,'FIXED',(p_config->>'minimumIncrement')::bigint,case when v_deposit=0 then 'NONE' else 'FIXED' end,v_deposit,(p_config->>'requireKyc')::boolean,
 (p_config->>'registrationStart')::timestamptz,(p_config->>'registrationEnd')::timestamptz,(p_config->>'startAt')::timestamptz,(p_config->>'endAt')::timestamptz,(p_config->>'endAt')::timestamptz,
 (p_config->>'antiSniping')::boolean,(p_config->>'windowSeconds')::int,(p_config->>'extensionSeconds')::int,(p_config->>'maxExtensions')::int,p_config->>'commissionType',(p_config->>'commissionValue')::bigint) returning id into v_id;
 insert into public.audit_logs(actor_id,action,entity_type,entity_id,reason,after_data) values(p_actor_id,'auction.create','auction',v_id,p_config->>'reason',p_config);
 return jsonb_build_object('id',v_id,'status','DRAFT');
end;$$;
revoke all on function public.fbs_submit_plate(uuid,uuid),public.fbs_save_cms(uuid,text,text,text,boolean,text),public.fbs_create_auction(uuid,jsonb) from public,anon,authenticated;
grant execute on function public.fbs_submit_plate(uuid,uuid),public.fbs_save_cms(uuid,text,text,text,boolean,text),public.fbs_create_auction(uuid,jsonb) to service_role;

create function public.fbs_claim_outbox(p_token uuid) returns setof public.outbox_events language sql set search_path='' as $$
 update public.outbox_events set lease_token=p_token,lease_until=clock_timestamp()+interval '60 seconds',attempt_count=attempt_count+1
 where id in(select id from public.outbox_events where processed_at is null and available_at<=clock_timestamp() and (lease_until is null or lease_until<clock_timestamp()) and attempt_count<12 order by created_at limit 25 for update skip locked) returning *;
$$;
create function public.fbs_finish_outbox(p_id uuid,p_token uuid,p_success boolean) returns boolean language plpgsql set search_path='' as $$
begin
 update public.outbox_events set processed_at=case when p_success then clock_timestamp() else null end,
 available_at=clock_timestamp()+make_interval(secs=>least(3600,power(2,attempt_count)::int)),lease_until=null,lease_token=null,last_error=case when p_success then null else 'PROVIDER_UNAVAILABLE' end
 where id=p_id and lease_token=p_token and processed_at is null;
 return found;
end;$$;
revoke all on function public.fbs_claim_outbox(uuid),public.fbs_finish_outbox(uuid,uuid,boolean) from public,anon,authenticated;
grant execute on function public.fbs_claim_outbox(uuid),public.fbs_finish_outbox(uuid,uuid,boolean) to service_role;
