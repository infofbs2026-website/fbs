-- Admin Full-Control Operations: Plates CRUD/Archive/Delete, Seller Approval Publishing,
-- Flexible Auction Creation/Editing/Timing Controls, and Seeded Reference Cities & Policies.
-- All RPCs are service_role-only, enforce private.fbs_has_permission, and write immutable audit_logs.

-- 1. Seed additional Saudi regions & cities (idempotent) so SellerForm and Admin Plate Editor have valid UUIDs.
insert into public.regions(code, name_ar, name_en) values
  ('riyadh', 'الرياض', 'Riyadh'),
  ('makkah', 'مكة المكرمة', 'Makkah'),
  ('eastern', 'الشرقية', 'Eastern'),
  ('madinah', 'المدينة المنورة', 'Madinah'),
  ('qassim', 'القصيم', 'Qassim'),
  ('asir', 'عسير', 'Asir'),
  ('tabuk', 'تبوك', 'Tabuk'),
  ('hail', 'حائل', 'Hail'),
  ('northern', 'الحدود الشمالية', 'Northern Borders'),
  ('jazan', 'جازان', 'Jazan'),
  ('najran', 'نجران', 'Najran'),
  ('al_bahah', 'الباحة', 'Al Bahah'),
  ('al_jawf', 'الجوف', 'Al Jawf')
on conflict(code) do nothing;

insert into public.cities(region_id, name_ar, name_en)
select r.id, c.ar, c.en
from (values
  ('riyadh', 'الرياض', 'Riyadh'),
  ('riyadh', 'الخرج', 'Al Kharj'),
  ('makkah', 'جدة', 'Jeddah'),
  ('makkah', 'مكة المكرمة', 'Makkah'),
  ('makkah', 'الطائف', 'Taif'),
  ('eastern', 'الدمام', 'Dammam'),
  ('eastern', 'الخبر', 'Khobar'),
  ('eastern', 'الظهران', 'Dhahran'),
  ('eastern', 'الجبيل', 'Jubail'),
  ('eastern', 'الأحساء', 'Al Ahsa'),
  ('madinah', 'المدينة المنورة', 'Madinah'),
  ('madinah', 'ينبع', 'Yanbu'),
  ('qassim', 'بريدة', 'Buraidah'),
  ('qassim', 'عنيزة', 'Unaizah'),
  ('asir', 'أبها', 'Abha'),
  ('asir', 'خميس مشيط', 'Khamis Mushait'),
  ('tabuk', 'تبوك', 'Tabuk'),
  ('hail', 'حائل', 'Hail'),
  ('northern', 'عرعر', 'Arar'),
  ('jazan', 'جازان', 'Jazan'),
  ('najran', 'نجران', 'Najran'),
  ('al_bahah', 'الباحة', 'Al Bahah'),
  ('al_bahah', 'قلوة', 'Qilwah'),
  ('al_jawf', 'سكاكا', 'Sakaka')
) as c(region_code, ar, en)
join public.regions r on r.code = c.region_code
on conflict(region_id, name_ar) do nothing;

-- 2. Seed core legal CMS pages (idempotent, does not overwrite admin edits) so auction registration termsVersion works immediately.
insert into public.cms_pages(slug, title_ar, body_ar, published)
values
  (
    'auction-policy',
    'سياسة وضوابط المزادات',
    E'المادة الأولى: انعقاد المزاد وإدارته\nتُدار جميع المزادات إلكترونياً وبشكل مباشر وفوري بنظام التسلسل الرقمي المعتمد، ويتم تحديد السعر الافتتاحي ومقدار الزيادة الأدنى لكل مزاد مسبقاً.\n\nالمادة الثانية: نظام مكافحة القنص (Anti-Sniping)\nلحماية المنافسة العادلة، يُفعل النظام تمديداً تلقائياً للمزاد عند تقديم أي مزايدة مقبولة خلال الثواني الأخيرة من وقت الإغلاق.\n\nالمادة الثالثة: الإلزام القانوني للمزايدة\nتعد أي مزايدة يتقدم بها العضو التزاماً قانونياً ومالياً لا رجعة فيه وفق الأنظمة السارية في المملكة العربية السعودية.',
    true
  ),
  (
    'terms',
    'الشروط والأحكام العامة',
    E'أولاً: نطاق الخدمة والتعريفات\nتعد منصة «فارس بن سعود للوحات المميزة» وسيطاً تقنياً وتنظيمياً معتمداً لعرض لوحات المركبات المميزة وتنظيم المزادات الحية الإلكترونية بين الملاك والمشترين.\n\nثانياً: شروط الأهلية والتسجيل\nيشترط للمشاركة في المزادات أن يكون العضو ذا أهلية شرعية وقانونية كاملة، وأن يوثق هويته الوطنية أو سجله التجاري المعتمد.\n\nثالثاً: نقل الملكية والمسؤوليات\nتتم كافة إجراءات نقل الملكية وفق الأنظمة الصادرة عن الإدارة العامة للمرور في المملكة العربية السعودية وعبر منصة «أبشر».',
    true
  ),
  (
    'privacy',
    'سياسة الخصوصية وحماية البيانات',
    E'1. التزامنا بالخصوصية\nتلتزم منصة فارس بن سعود بحماية البيانات الشخصية والمستندات الرسمية لعملائها وفقاً لنظام حماية البيانات الشخصية في المملكة العربية السعودية.\n\n2. سرية مستندات الملكية والهوية\nتُحفظ مستندات إثبات الملكية والهوية في مساحات تخزين سحابية خاصة ومشفرة، ولا يتم نشرها للعامة بأي حال من الأحوال.',
    true
  ),
  (
    'deposit-policy',
    'سياسة التأمين المالي والاسترداد',
    E'1. الغرض من تأمين المزاد\nيهدف تأمين المزاد إلى ضمان جدية المشاركة ومنع المزايدات الوهمية وحماية حقوق الملاك والمزايدين.\n\n2. استرداد التأمين لغير الفائزين\nيتم فك الحجز وإعادة مبلغ التأمين بالكامل بنسبة 100% لغير الفائزين فور إغلاق المزاد واعتماد النتيجة دون أي رسوم إدارية.',
    true
  )
on conflict(slug) do nothing;

-- 3. Ensure non-interactive platform catalog owner exists (for separation of duties vs logged-in admin).
create function public.fbs_ensure_catalog_owner()
returns uuid language plpgsql set search_path = '' as $$
declare
  v_owner uuid;
begin
  select id into v_owner
  from auth.users
  where raw_app_meta_data->>'fbs_catalog_owner' = 'true'
  limit 1;

  if v_owner is null then
    v_owner := gen_random_uuid();
    insert into auth.users(id, raw_app_meta_data, raw_user_meta_data)
    values(
      v_owner,
      '{"fbs_catalog_owner":true,"provider":"none","providers":[]}'::jsonb,
      '{"display_name":"مخزون منصة FBS"}'::jsonb
    );
  end if;

  insert into public.profiles(id, display_name, status)
  values(v_owner, 'مخزون منصة FBS', 'ACTIVE')
  on conflict(id) do nothing;

  return v_owner;
end; $$;

-- 4. Admin Plate Upsert (Create or Full Edit of Plate Details, Pricing, Sale Mode, Visibility & Status).
create function public.fbs_admin_upsert_plate(
  p_actor_id uuid,
  p_plate_id uuid,
  p_payload jsonb,
  p_reason text
) returns jsonb language plpgsql set search_path = '' as $$
declare
  v_old public.plates;
  v_new public.plates;
  v_owner uuid;
  v_slug text;
  v_ver_status text;
  v_list_status text;
  v_sale_mode text;
  v_price bigint;
  v_city uuid;
begin
  if not (private.fbs_has_permission(p_actor_id, 'plate.verify') or private.fbs_has_permission(p_actor_id, 'auction.edit')) then
    raise exception 'FORBIDDEN';
  end if;
  if length(trim(coalesce(p_reason, ''))) < 3 then
    raise exception 'INVALID_INPUT';
  end if;

  v_sale_mode := coalesce(nullif(p_payload->>'saleMode', ''), 'FIXED_PRICE');
  v_ver_status := coalesce(nullif(p_payload->>'verificationStatus', ''), 'APPROVED');
  v_list_status := coalesce(nullif(p_payload->>'listingStatus', ''), 'PUBLISHED');
  if v_list_status = 'PUBLISHED' and v_ver_status <> 'APPROVED' then
    v_ver_status := 'APPROVED';
  end if;
  v_price := nullif(trim(coalesce(p_payload->>'askingPriceMinor', '')), '')::bigint;
  v_city := nullif(trim(coalesce(p_payload->>'cityId', '')), '')::uuid;
  v_slug := lower(regexp_replace(trim(coalesce(p_payload->>'slug', '')), '[^a-z0-9-]+', '-', 'g'));
  v_slug := regexp_replace(v_slug, '(^-+|-+$)', '', 'g');

  if p_plate_id is null then
    v_owner := coalesce(nullif(trim(coalesce(p_payload->>'ownerId', '')), '')::uuid, public.fbs_ensure_catalog_owner());
    if v_slug = '' then
      v_slug := 'plate-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8);
    end if;
    if exists(select 1 from public.plates where slug = v_slug) then
      v_slug := v_slug || '-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 4);
    end if;

    insert into public.plates(
      owner_id, slug, type_id, letter_1_id, letter_2_id, letter_3_id, digits,
      city_id, description, verification_status, listing_status, sale_mode, asking_price_minor, featured
    ) values (
      v_owner,
      v_slug,
      (p_payload->>'typeId')::uuid,
      (p_payload->>'letter1Id')::smallint,
      (p_payload->>'letter2Id')::smallint,
      (p_payload->>'letter3Id')::smallint,
      trim(p_payload->>'digits'),
      v_city,
      coalesce(p_payload->>'description', ''),
      v_ver_status,
      v_list_status,
      v_sale_mode,
      v_price,
      coalesce((p_payload->>'featured')::boolean, false)
    ) returning * into v_new;

    insert into public.audit_logs(actor_id, action, entity_type, entity_id, reason, after_data)
    values(p_actor_id, 'plate.admin_create', 'plate', v_new.id, trim(p_reason), to_jsonb(v_new));

    return jsonb_build_object('id', v_new.id, 'slug', v_new.slug, 'listingStatus', v_new.listing_status);
  else
    select * into v_old from public.plates where id = p_plate_id for update;
    if not found then
      raise exception 'INVALID_INPUT';
    end if;

    if v_slug = '' then
      v_slug := v_old.slug;
    elsif v_slug <> v_old.slug and exists(select 1 from public.plates where slug = v_slug and id <> v_old.id) then
      raise exception 'INVALID_INPUT';
    end if;

    update public.plates set
      slug = v_slug,
      type_id = coalesce(nullif(p_payload->>'typeId', '')::uuid, v_old.type_id),
      letter_1_id = coalesce(nullif(p_payload->>'letter1Id', '')::smallint, v_old.letter_1_id),
      letter_2_id = coalesce(nullif(p_payload->>'letter2Id', '')::smallint, v_old.letter_2_id),
      letter_3_id = coalesce(nullif(p_payload->>'letter3Id', '')::smallint, v_old.letter_3_id),
      digits = coalesce(nullif(trim(p_payload->>'digits'), ''), v_old.digits),
      city_id = case when p_payload ? 'cityId' then v_city else v_old.city_id end,
      description = case when p_payload ? 'description' then coalesce(p_payload->>'description', '') else v_old.description end,
      verification_status = case when p_payload ? 'verificationStatus' or v_list_status = 'PUBLISHED' then v_ver_status else v_old.verification_status end,
      listing_status = case when p_payload ? 'listingStatus' then v_list_status else v_old.listing_status end,
      sale_mode = case when p_payload ? 'saleMode' then v_sale_mode else v_old.sale_mode end,
      asking_price_minor = case when p_payload ? 'askingPriceMinor' then v_price else v_old.asking_price_minor end,
      featured = case when p_payload ? 'featured' then coalesce((p_payload->>'featured')::boolean, false) else v_old.featured end,
      updated_at = clock_timestamp()
    where id = v_old.id
    returning * into v_new;

    insert into public.audit_logs(actor_id, action, entity_type, entity_id, reason, before_data, after_data)
    values(p_actor_id, 'plate.admin_update', 'plate', v_new.id, trim(p_reason), to_jsonb(v_old), to_jsonb(v_new));

    return jsonb_build_object('id', v_new.id, 'slug', v_new.slug, 'listingStatus', v_new.listing_status);
  end if;
end; $$;

-- 5. Admin Delete / Archive Plate (Hard-deletes clean plates; safely archives plates tied to append-only ledgers).
create function public.fbs_admin_delete_plate(
  p_actor_id uuid,
  p_plate_id uuid,
  p_archive_only boolean,
  p_reason text
) returns jsonb language plpgsql set search_path = '' as $$
declare
  v_plate public.plates;
  v_has_ledger boolean;
begin
  if not private.fbs_has_permission(p_actor_id, 'plate.verify') then
    raise exception 'FORBIDDEN';
  end if;
  if length(trim(coalesce(p_reason, ''))) < 3 then
    raise exception 'INVALID_INPUT';
  end if;

  select * into v_plate from public.plates where id = p_plate_id for update;
  if not found then
    raise exception 'INVALID_INPUT';
  end if;

  if exists(
    select 1 from public.auctions
    where plate_id = v_plate.id and status in ('LIVE', 'ENDING')
  ) then
    raise exception 'INVALID_TRANSITION';
  end if;

  v_has_ledger := exists(select 1 from public.plate_verification_events where plate_id = v_plate.id)
    or exists(select 1 from public.bids b join public.auctions a on a.id = b.auction_id where a.plate_id = v_plate.id)
    or exists(select 1 from public.auction_results r join public.auctions a on a.id = r.auction_id where a.plate_id = v_plate.id)
    or exists(select 1 from public.payment_authorizations pa join public.auctions a on a.id = pa.auction_id where a.plate_id = v_plate.id)
    or exists(select 1 from public.settlements s join public.auctions a on a.id = s.auction_id where a.plate_id = v_plate.id);

  if p_archive_only or v_has_ledger then
    update public.auctions
    set status = 'CANCELLED',
        cancellation_reason = trim(p_reason),
        version = version + 1,
        updated_at = clock_timestamp()
    where plate_id = v_plate.id
      and status not in ('COMPLETED', 'CANCELLED', 'ENDED', 'RESERVE_NOT_MET');

    update public.plates
    set listing_status = 'ARCHIVED',
        featured = false,
        updated_at = clock_timestamp()
    where id = v_plate.id;

    insert into public.audit_logs(actor_id, action, entity_type, entity_id, reason, before_data, after_data)
    values(p_actor_id, 'plate.admin_archive', 'plate', v_plate.id, trim(p_reason), to_jsonb(v_plate), jsonb_build_object('listing_status', 'ARCHIVED'));

    return jsonb_build_object('id', v_plate.id, 'mode', 'ARCHIVED');
  else
    delete from public.auction_increment_rules where auction_id in (select id from public.auctions where plate_id = v_plate.id);
    delete from public.auction_state_snapshots where auction_id in (select id from public.auctions where plate_id = v_plate.id);
    delete from public.auction_registrations where auction_id in (select id from public.auctions where plate_id = v_plate.id);
    delete from public.auctions where plate_id = v_plate.id;
    delete from public.favorites where plate_id = v_plate.id;
    delete from public.plate_media where plate_id = v_plate.id;
    delete from public.plate_documents where plate_id = v_plate.id;
    delete from public.plate_submissions where plate_id = v_plate.id;
    delete from public.plates where id = v_plate.id;

    insert into public.audit_logs(actor_id, action, entity_type, entity_id, reason, before_data, after_data)
    values(p_actor_id, 'plate.admin_delete', 'plate', v_plate.id, trim(p_reason), to_jsonb(v_plate), jsonb_build_object('deleted', true));

    return jsonb_build_object('id', v_plate.id, 'mode', 'DELETED');
  end if;
end; $$;

-- 6. Seller Plate Submission Review & Direct-Publish Workflow.
create function public.fbs_admin_review_submission(
  p_plate_id uuid,
  p_actor_id uuid,
  p_status text,
  p_reason text,
  p_publish_config jsonb default '{}'::jsonb
) returns jsonb language plpgsql set search_path = '' as $$
declare
  p public.plates;
  v_sale_mode text;
  v_price bigint;
  v_featured boolean;
  v_listing text;
  v_notif_title text;
begin
  if not private.fbs_has_permission(p_actor_id, 'plate.verify') then
    raise exception 'FORBIDDEN';
  end if;
  if p_status not in ('UNDER_REVIEW', 'CHANGES_REQUIRED', 'REJECTED', 'APPROVED') or length(trim(coalesce(p_reason, ''))) < 3 then
    raise exception 'INVALID_INPUT';
  end if;

  select * into p from public.plates where id = p_plate_id for update;
  if not found or p.owner_id = p_actor_id then
    raise exception 'FORBIDDEN';
  end if;

  v_sale_mode := coalesce(nullif(p_publish_config->>'saleMode', ''), p.sale_mode);
  v_price := case
    when p_publish_config ? 'askingPriceMinor' then nullif(trim(coalesce(p_publish_config->>'askingPriceMinor', '')), '')::bigint
    else p.asking_price_minor
  end;
  v_featured := coalesce((p_publish_config->>'featured')::boolean, p.featured);
  v_listing := case
    when p_status = 'APPROVED' then coalesce(nullif(p_publish_config->>'listingStatus', ''), 'PUBLISHED')
    else 'DRAFT'
  end;

  update public.plates set
    verification_status = p_status,
    listing_status = v_listing,
    sale_mode = v_sale_mode,
    asking_price_minor = v_price,
    featured = case when p_status = 'APPROVED' then v_featured else false end,
    updated_at = clock_timestamp()
  where id = p.id;

  update public.plate_submissions
  set status = p_status
  where plate_id = p.id;

  insert into public.plate_verification_events(plate_id, actor_id, previous_status, status, reason)
  values(p.id, p_actor_id, p.verification_status, p_status, trim(p_reason));

  insert into public.audit_logs(actor_id, action, entity_type, entity_id, reason, before_data, after_data)
  values(
    p_actor_id,
    'plate.verify',
    'plate',
    p.id,
    trim(p_reason),
    jsonb_build_object('verification_status', p.verification_status, 'listing_status', p.listing_status),
    jsonb_build_object('verification_status', p_status, 'listing_status', v_listing, 'sale_mode', v_sale_mode, 'asking_price_minor', v_price)
  );

  v_notif_title := case p_status
    when 'APPROVED' then 'تم اعتماد ونشر لوحتك بنجاح'
    when 'REJECTED' then 'قرار مراجعة طلب عرض لوحتك'
    when 'CHANGES_REQUIRED' then 'مطلوب استكمال بيانات لوحتك'
    else 'لوحتك قيد المراجعة لدى فريق الاعتماد'
  end;

  insert into public.notifications(user_id, type, title, body, href)
  values(p.owner_id, 'plate.review', v_notif_title, trim(p_reason), '/account/plates');

  return jsonb_build_object('id', p.id, 'status', p_status, 'listingStatus', v_listing);
end; $$;

-- 7. Admin Save Auction (Flexible Create or Edit: prices, status, start/end times, anti-sniping, deposit, commission).
create function public.fbs_admin_save_auction(
  p_actor_id uuid,
  p_auction_id uuid,
  p_config jsonb,
  p_reason text
) returns jsonb language plpgsql set search_path = '' as $$
declare
  p public.plates;
  a public.auctions;
  v_new public.auctions;
  v_now timestamptz := clock_timestamp();
  v_status text;
  v_start_price bigint;
  v_curr_price bigint;
  v_reserve bigint;
  v_min_inc bigint;
  v_dep_type text;
  v_dep_amount bigint;
  v_reg_start timestamptz;
  v_reg_end timestamptz;
  v_start_at timestamptz;
  v_sched_end timestamptz;
  v_eff_end timestamptz;
  v_anti boolean;
  v_win_sec int;
  v_ext_sec int;
  v_max_ext int;
  v_comm_type text;
  v_comm_val bigint;
  v_slug text;
begin
  if length(trim(coalesce(p_reason, ''))) < 3 then
    raise exception 'INVALID_INPUT';
  end if;

  if p_auction_id is null then
    if not private.fbs_has_permission(p_actor_id, 'auction.create') then
      raise exception 'FORBIDDEN';
    end if;

    select * into p from public.plates where id = (p_config->>'plateId')::uuid for update;
    if not found or p.verification_status <> 'APPROVED' then
      raise exception 'PLATE_NOT_VERIFIED';
    end if;
    if p.listing_status <> 'PUBLISHED' then
      update public.plates set listing_status = 'PUBLISHED', sale_mode = 'AUCTION', updated_at = v_now where id = p.id;
    else
      update public.plates set sale_mode = 'AUCTION', updated_at = v_now where id = p.id;
    end if;

    v_status := coalesce(nullif(p_config->>'status', ''), 'LIVE');
    v_start_price := (p_config->>'startingPrice')::bigint;
    v_reserve := nullif(trim(coalesce(p_config->>'reservePrice', '')), '')::bigint;
    v_min_inc := (p_config->>'minimumIncrement')::bigint;
    v_dep_amount := coalesce(nullif(trim(coalesce(p_config->>'depositAmount', '')), '')::bigint, 0);
    v_dep_type := case when v_dep_amount > 0 then 'FIXED' else 'NONE' end;

    v_start_at := coalesce(nullif(p_config->>'startAt', '')::timestamptz, v_now);
    v_eff_end := (p_config->>'endAt')::timestamptz;

    if v_status = 'LIVE' and v_start_at > v_now then
      v_start_at := v_now - interval '1 minute';
    end if;
    if v_eff_end <= v_start_at then
      v_eff_end := v_start_at + interval '24 hours';
    end if;
    v_sched_end := v_eff_end;
    v_reg_end := coalesce(nullif(p_config->>'registrationEnd', '')::timestamptz, v_start_at);
    if v_reg_end > v_start_at then
      v_reg_end := v_start_at;
    end if;
    v_reg_start := coalesce(nullif(p_config->>'registrationStart', '')::timestamptz, v_reg_end - interval '1 day');
    if v_reg_start >= v_reg_end then
      v_reg_start := v_reg_end - interval '1 hour';
    end if;

    v_anti := coalesce((p_config->>'antiSniping')::boolean, true);
    v_win_sec := case when v_anti then greatest(coalesce((p_config->>'windowSeconds')::int, 300), 10) else null end;
    v_ext_sec := case when v_anti then greatest(coalesce((p_config->>'extensionSeconds')::int, 300), 10) else null end;
    v_max_ext := case when v_anti then greatest(coalesce((p_config->>'maxExtensions')::int, 3), 0) else null end;
    v_comm_type := coalesce(nullif(p_config->>'commissionType', ''), 'NONE');
    v_comm_val := case when v_comm_type = 'NONE' then null else coalesce(nullif(p_config->>'commissionValue', '')::bigint, 0) end;
    v_slug := 'auction-' || p.slug || '-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 4);

    insert into public.auctions(
      plate_id, slug, status, starting_price, current_price, reserve_price,
      increment_mode, minimum_increment, deposit_type, deposit_amount, require_kyc,
      registration_start_at, registration_end_at, start_at, scheduled_end_at, effective_end_at,
      anti_sniping_enabled, extension_window_seconds, extension_duration_seconds, max_extensions,
      commission_type, commission_value
    ) values (
      p.id, v_slug, v_status, v_start_price, v_start_price, v_reserve,
      'FIXED', v_min_inc, v_dep_type, case when v_dep_type = 'FIXED' then v_dep_amount else null end,
      coalesce((p_config->>'requireKyc')::boolean, true),
      v_reg_start, v_reg_end, v_start_at, v_sched_end, v_eff_end,
      v_anti, v_win_sec, v_ext_sec, v_max_ext,
      v_comm_type, v_comm_val
    ) returning * into v_new;

    insert into public.audit_logs(actor_id, action, entity_type, entity_id, reason, after_data)
    values(p_actor_id, 'auction.admin_create', 'auction', v_new.id, trim(p_reason), to_jsonb(v_new));

    if v_new.status not in ('DRAFT', 'PENDING_APPROVAL') then
      insert into public.outbox_events(aggregate_id, event_type, deduplication_key, payload)
      values(v_new.id, 'auction.updated', 'admin-create:' || v_new.id, coalesce(public.fbs_snapshot(v_new.id), '{}'::jsonb));
    end if;

    return jsonb_build_object('id', v_new.id, 'status', v_new.status, 'slug', v_new.slug);
  else
    if not private.fbs_has_permission(p_actor_id, 'auction.edit') then
      raise exception 'FORBIDDEN';
    end if;

    select * into a from public.auctions where id = p_auction_id for update;
    if not found then
      raise exception 'AUCTION_NOT_FOUND';
    end if;

    v_status := coalesce(nullif(p_config->>'status', ''), a.status);
    v_start_price := coalesce(nullif(p_config->>'startingPrice', '')::bigint, a.starting_price);
    if a.sequence_no > 0 and v_start_price > a.current_price then
      raise exception 'INVALID_INPUT';
    end if;
    v_curr_price := case when a.sequence_no = 0 then v_start_price else a.current_price end;
    v_reserve := case
      when p_config ? 'reservePrice' then nullif(trim(coalesce(p_config->>'reservePrice', '')), '')::bigint
      else a.reserve_price
    end;
    v_min_inc := coalesce(nullif(p_config->>'minimumIncrement', '')::bigint, a.minimum_increment);

    if p_config ? 'depositAmount' then
      v_dep_amount := coalesce(nullif(trim(coalesce(p_config->>'depositAmount', '')), '')::bigint, 0);
      v_dep_type := case when v_dep_amount > 0 then 'FIXED' else 'NONE' end;
    else
      v_dep_type := a.deposit_type;
      v_dep_amount := a.deposit_amount;
    end if;

    v_start_at := coalesce(nullif(p_config->>'startAt', '')::timestamptz, a.start_at);
    v_eff_end := coalesce(nullif(p_config->>'endAt', '')::timestamptz, a.effective_end_at);
    if v_status = 'LIVE' and v_start_at > v_now then
      v_start_at := v_now - interval '1 minute';
    end if;
    if v_eff_end <= v_start_at then
      raise exception 'INVALID_INPUT';
    end if;
    v_sched_end := least(greatest(a.scheduled_end_at, v_start_at + interval '1 second'), v_eff_end);
    v_reg_end := coalesce(nullif(p_config->>'registrationEnd', '')::timestamptz, least(a.registration_end_at, v_start_at));
    if v_reg_end > v_start_at then
      v_reg_end := v_start_at;
    end if;
    v_reg_start := coalesce(nullif(p_config->>'registrationStart', '')::timestamptz, least(a.registration_start_at, v_reg_end - interval '1 minute'));
    if v_reg_start >= v_reg_end then
      v_reg_start := v_reg_end - interval '1 minute';
    end if;

    v_anti := coalesce((p_config->>'antiSniping')::boolean, a.anti_sniping_enabled);
    v_win_sec := case when v_anti then greatest(coalesce((p_config->>'windowSeconds')::int, a.extension_window_seconds, 300), 10) else null end;
    v_ext_sec := case when v_anti then greatest(coalesce((p_config->>'extensionSeconds')::int, a.extension_duration_seconds, 300), 10) else null end;
    v_max_ext := case when v_anti then greatest(coalesce((p_config->>'maxExtensions')::int, a.max_extensions, 3), 0) else null end;
    v_comm_type := coalesce(nullif(p_config->>'commissionType', ''), a.commission_type);
    v_comm_val := case when v_comm_type = 'NONE' then null else coalesce(nullif(p_config->>'commissionValue', '')::bigint, a.commission_value, 0) end;

    update public.auctions set
      status = v_status,
      starting_price = v_start_price,
      current_price = v_curr_price,
      reserve_price = v_reserve,
      minimum_increment = v_min_inc,
      deposit_type = v_dep_type,
      deposit_amount = case when v_dep_type = 'FIXED' then v_dep_amount else null end,
      require_kyc = coalesce((p_config->>'requireKyc')::boolean, a.require_kyc),
      registration_start_at = v_reg_start,
      registration_end_at = v_reg_end,
      start_at = v_start_at,
      scheduled_end_at = v_sched_end,
      effective_end_at = v_eff_end,
      anti_sniping_enabled = v_anti,
      extension_window_seconds = v_win_sec,
      extension_duration_seconds = v_ext_sec,
      max_extensions = v_max_ext,
      commission_type = v_comm_type,
      commission_value = v_comm_val,
      paused_at = case when v_status = 'PAUSED' then coalesce(a.paused_at, v_now) else null end,
      version = a.version + 1,
      updated_at = v_now
    where id = a.id
    returning * into v_new;

    insert into public.audit_logs(actor_id, action, entity_type, entity_id, reason, before_data, after_data)
    values(p_actor_id, 'auction.admin_update', 'auction', v_new.id, trim(p_reason), to_jsonb(a), to_jsonb(v_new));

    if v_new.status not in ('DRAFT', 'PENDING_APPROVAL') then
      insert into public.outbox_events(aggregate_id, event_type, deduplication_key, payload)
      values(v_new.id, 'auction.updated', 'admin-edit:' || v_new.id || ':' || v_new.version, coalesce(public.fbs_snapshot(v_new.id), '{}'::jsonb));
    end if;

    return jsonb_build_object('id', v_new.id, 'status', v_new.status, 'effectiveEndAt', v_new.effective_end_at);
  end if;
end; $$;

-- 8. Instant Live Auction Time & Lifecycle Control RPC.
create function public.fbs_admin_auction_control(
  p_auction_id uuid,
  p_actor_id uuid,
  p_command text,
  p_minutes integer,
  p_end_at timestamptz,
  p_reason text
) returns jsonb language plpgsql set search_path = '' as $$
declare
  a public.auctions;
  v_now timestamptz := clock_timestamp();
  v_perm text;
  v_new_end timestamptz;
  v_new_sched timestamptz;
  v_new_start timestamptz;
  v_new_reg_end timestamptz;
  v_new_reg_start timestamptz;
  v_final jsonb;
begin
  if length(trim(coalesce(p_reason, ''))) < 3 then
    raise exception 'INVALID_INPUT';
  end if;

  v_perm := case p_command
    when 'PAUSE' then 'auction.pause'
    when 'RESUME' then 'auction.resume'
    when 'CANCEL' then 'auction.cancel'
    else 'auction.edit'
  end;

  if not private.fbs_has_permission(p_actor_id, v_perm) then
    raise exception 'FORBIDDEN';
  end if;

  select * into a from public.auctions where id = p_auction_id for update;
  if not found then
    raise exception 'AUCTION_NOT_FOUND';
  end if;
  if a.status in ('ENDED', 'COMPLETED', 'CANCELLED', 'RESERVE_NOT_MET') then
    raise exception 'INVALID_TRANSITION';
  end if;

  if p_command = 'EXTEND_MINUTES' then
    v_new_end := a.effective_end_at + make_interval(mins => coalesce(p_minutes, 15));
    if v_new_end <= a.start_at + interval '10 seconds' then
      raise exception 'INVALID_INPUT';
    end if;
    v_new_sched := least(a.scheduled_end_at, v_new_end);
    update public.auctions
    set effective_end_at = v_new_end,
        scheduled_end_at = v_new_sched,
        version = version + 1,
        updated_at = v_now
    where id = a.id;

  elsif p_command = 'SET_END_TIME' then
    if p_end_at is null or p_end_at <= a.start_at + interval '10 seconds' then
      raise exception 'INVALID_INPUT';
    end if;
    v_new_sched := least(a.scheduled_end_at, p_end_at);
    update public.auctions
    set effective_end_at = p_end_at,
        scheduled_end_at = v_new_sched,
        version = version + 1,
        updated_at = v_now
    where id = a.id;

  elsif p_command = 'GO_LIVE_NOW' then
    v_new_start := least(a.start_at, v_now - interval '5 seconds');
    v_new_reg_end := least(a.registration_end_at, v_new_start);
    v_new_reg_start := least(a.registration_start_at, v_new_reg_end - interval '1 hour');
    v_new_end := greatest(a.effective_end_at, v_now + interval '2 hours');
    v_new_sched := least(greatest(a.scheduled_end_at, v_new_start + interval '1 minute'), v_new_end);
    update public.auctions
    set status = 'LIVE',
        registration_start_at = v_new_reg_start,
        registration_end_at = v_new_reg_end,
        start_at = v_new_start,
        scheduled_end_at = v_new_sched,
        effective_end_at = v_new_end,
        paused_at = null,
        version = version + 1,
        updated_at = v_now
    where id = a.id;

  elsif p_command = 'OPEN_REGISTRATION_NOW' then
    v_new_reg_start := least(a.registration_start_at, v_now - interval '5 seconds');
    v_new_reg_end := greatest(a.registration_end_at, v_now + interval '2 hours');
    v_new_start := greatest(a.start_at, v_new_reg_end);
    v_new_sched := greatest(a.scheduled_end_at, v_new_start + interval '2 hours');
    v_new_end := greatest(a.effective_end_at, v_new_sched);
    update public.auctions
    set status = 'REGISTRATION_OPEN',
        registration_start_at = v_new_reg_start,
        registration_end_at = v_new_reg_end,
        start_at = v_new_start,
        scheduled_end_at = v_new_sched,
        effective_end_at = v_new_end,
        paused_at = null,
        version = version + 1,
        updated_at = v_now
    where id = a.id;

  elsif p_command = 'PAUSE' then
    if a.status <> 'LIVE' then
      raise exception 'INVALID_TRANSITION';
    end if;
    update public.auctions
    set status = 'PAUSED',
        paused_at = v_now,
        paused_from_status = a.status,
        version = version + 1,
        updated_at = v_now
    where id = a.id;

  elsif p_command = 'RESUME' then
    if a.status not in ('PAUSED', 'SUSPENDED') then
      raise exception 'INVALID_TRANSITION';
    end if;
    v_new_end := greatest(
      a.effective_end_at + coalesce(v_now - a.paused_at, interval '0'),
      v_now + interval '5 minutes'
    );
    update public.auctions
    set status = 'LIVE',
        paused_at = null,
        effective_end_at = v_new_end,
        version = version + 1,
        updated_at = v_now
    where id = a.id;

  elsif p_command = 'FINALIZE_NOW' then
    v_new_end := v_now - interval '1 second';
    v_new_start := least(a.start_at, v_now - interval '2 minutes');
    v_new_reg_end := least(a.registration_end_at, v_new_start);
    v_new_reg_start := least(a.registration_start_at, v_new_reg_end - interval '1 hour');
    v_new_sched := least(greatest(a.scheduled_end_at, v_new_start + interval '10 seconds'), v_new_end);

    update public.auctions
    set status = 'LIVE',
        registration_start_at = v_new_reg_start,
        registration_end_at = v_new_reg_end,
        start_at = v_new_start,
        scheduled_end_at = v_new_sched,
        effective_end_at = v_new_end,
        paused_at = null,
        updated_at = v_now
    where id = a.id;

    v_final := public.fbs_finalize(a.id);

    insert into public.audit_logs(actor_id, action, entity_type, entity_id, reason, before_data, after_data)
    values(p_actor_id, 'auction.admin_finalize_now', 'auction', a.id, trim(p_reason), to_jsonb(a), v_final);

    return jsonb_build_object('id', a.id, 'command', p_command, 'result', v_final);

  elsif p_command = 'CANCEL' then
    update public.auctions
    set status = 'CANCELLED',
        cancellation_reason = trim(p_reason),
        paused_at = null,
        version = version + 1,
        updated_at = v_now
    where id = a.id;

    insert into public.jobs(type, deduplication_key, payload)
    select 'release_deposit', 'cancel:' || a.id || ':' || id, jsonb_build_object('authorizationId', id, 'auctionId', a.id)
    from public.payment_authorizations
    where auction_id = a.id and status = 'AUTHORIZED'
    on conflict(deduplication_key) do nothing;
  else
    raise exception 'INVALID_INPUT';
  end if;

  insert into public.audit_logs(actor_id, action, entity_type, entity_id, reason, before_data, after_data)
  values(
    p_actor_id,
    'auction.control.' || lower(p_command),
    'auction',
    a.id,
    trim(p_reason),
    jsonb_build_object('status', a.status, 'effective_end_at', a.effective_end_at),
    (select jsonb_build_object('status', status, 'effective_end_at', effective_end_at) from public.auctions where id = a.id)
  );

  insert into public.outbox_events(aggregate_id, event_type, deduplication_key, payload)
  select x.id, 'auction.updated', 'ctrl:' || x.id || ':' || x.version, coalesce(public.fbs_snapshot(x.id), '{}'::jsonb)
  from public.auctions x
  where x.id = a.id and x.status not in ('DRAFT', 'PENDING_APPROVAL')
  on conflict(deduplication_key) do nothing;

  return (
    select jsonb_build_object('id', x.id, 'status', x.status, 'effectiveEndAt', x.effective_end_at, 'startAt', x.start_at)
    from public.auctions x
    where x.id = a.id
  );
end; $$;

revoke all on function
  public.fbs_ensure_catalog_owner(),
  public.fbs_admin_upsert_plate(uuid, uuid, jsonb, text),
  public.fbs_admin_delete_plate(uuid, uuid, boolean, text),
  public.fbs_admin_review_submission(uuid, uuid, text, text, jsonb),
  public.fbs_admin_save_auction(uuid, uuid, jsonb, text),
  public.fbs_admin_auction_control(uuid, uuid, text, integer, timestamptz, text)
from public, anon, authenticated;

grant execute on function
  public.fbs_ensure_catalog_owner(),
  public.fbs_admin_upsert_plate(uuid, uuid, jsonb, text),
  public.fbs_admin_delete_plate(uuid, uuid, boolean, text),
  public.fbs_admin_review_submission(uuid, uuid, text, text, jsonb),
  public.fbs_admin_save_auction(uuid, uuid, jsonb, text),
  public.fbs_admin_auction_control(uuid, uuid, text, integer, timestamptz, text)
to service_role;
