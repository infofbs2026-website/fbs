-- Optional catalog data for the current review environment.
-- This is deliberately outside migrations and is not applied automatically on a new server.
-- It is additive and does not modify existing listings with the same slug.
do $$
declare
  v_owner uuid;
  v_plate uuid;
  v_f smallint;
  item record;
begin
  -- The inventory owner has no email, phone, password, identity, or sign-in access.
  select id into v_owner from auth.users where raw_app_meta_data->>'fbs_catalog_owner'='true' limit 1;
  if v_owner is null then
    v_owner := gen_random_uuid();
    insert into auth.users(id,aud,role,encrypted_password,raw_app_meta_data,raw_user_meta_data,created_at,updated_at,banned_until)
    values(v_owner,'authenticated','authenticated',null,
      '{"fbs_catalog_owner":true,"provider":"none","providers":[]}'::jsonb,
      '{"display_name":"مالك اللوحات"}'::jsonb,now(),now(),'infinity'::timestamptz);
  end if;

  -- The FBS brand plate uses a display-only ف/F glyph. It remains unavailable in the official alphabet selector.
  select id into v_f from public.plate_letters where arabic='ف';
  if v_f is null then
    select coalesce(max(id),0)+1 into v_f from public.plate_letters;
    insert into public.plate_letters(id,arabic,latin,normalized_code,sort_order,active)
      values(v_f,'ف','F','F',v_f,false);
  end if;

  insert into public.regions(code,name_ar,name_en) values
    ('madinah','المدينة المنورة','Madinah'),('asir','عسير','Asir'),('al_bahah','الباحة','Al Bahah')
    on conflict(code) do nothing;
  insert into public.cities(region_id,name_ar,name_en)
    select r.id,c.ar,c.en from (values
      ('makkah','مكة المكرمة','Makkah'),('eastern','الخبر','Khobar'),
      ('madinah','المدينة المنورة','Madinah'),('asir','أبها','Abha'),('al_bahah','قلوة','Qilwah')
    ) as c(region_code,ar,en) join public.regions r on r.code=c.region_code
    on conflict(region_id,name_ar) do nothing;

  for item in select * from (values
    (1,'fbs-1','ف','ب','س','1','الرياض','private',75000000::bigint,true,'لوحة ماسية فردية تمثل هوية المنصة الأيقونية بتناسق الحروف الفخمة.','LIVE',500000::bigint),
    (2,'rgz-7','ر','ق','م','7','جدة','private',52000000::bigint,true,'لوحة فردية استثنائية بحروف ذات دلالة ورقم مميز.','LIVE',500000::bigint),
    (3,'sed-777','س','ع','د','777','الرياض','private',38000000::bigint,true,'لوحة ثلاثية متميزة بحروف اسم سعد وأرقام متطابقة.','LIVE',250000::bigint),
    (4,'knj-99','ك','ن','ح','99','الدمام','private',29000000::bigint,true,'لوحة ثنائية برقمين متطابقين 99.','SCHEDULED',250000::bigint),
    (5,'zta-966','ا','ط','م','966','الرياض','transport',24000000::bigint,true,'لوحة نقل مميزة تحمل الرقم 966 والشريط الأزرق.','LIVE',250000::bigint),
    (6,'hba-5333','ه','ب','ا','5333','قلوة','transport',17500000::bigint,false,'لوحة نقل مميزة بتكرار ثلاثي للرقم 333 وشريط أزرق.','DIRECT',0::bigint),
    (7,'tza-300','ط','م','ا','300','أبها','small',45000000::bigint,true,'لوحة صغيرة بحروف متناسقة ورقم ثلاثي.','LIVE',500000::bigint),
    (8,'sbd-911','س','ب','د','911','جدة','small',68000000::bigint,true,'لوحة صغيرة للسيارات الرياضية برقم 911.','LIVE',500000::bigint),
    (9,'tug-100','ط','و','ق','100','الرياض','transport',18500000::bigint,false,'لوحة نقل برقم 100 وشريط أزرق.','DIRECT',0::bigint),
    (10,'ajd-1','ا','ح','د','1','المدينة المنورة','private',92000000::bigint,true,'لوحة أحادية بحروف متناسقة ورقم واحد.','REGISTRATION_OPEN',1000000::bigint),
    (11,'aaa-7777','ا','ا','ا','7777','الرياض','private',120000000::bigint,true,'ثلاثة حروف متطابقة وأربعة أرقام متطابقة.','LIVE',1000000::bigint),
    (12,'gxg-1001','ق','ص','ق','1001','جدة','private',8500000::bigint,false,'لوحة متناظرة بحرفين وأرقام متقابلة.','DIRECT',0::bigint),
    (13,'bss-123','ب','س','س','123','الدمام','private',3500000::bigint,false,'لوحة بحرفين متطابقين وتسلسل رقمي 123.','DIRECT',0::bigint),
    (14,'dla-444','د','ل','ا','444','مكة المكرمة','private',1200000::bigint,false,'لوحة بثلاثة أرقام متطابقة.','DIRECT',0::bigint),
    (15,'jjd-1234','ح','ح','د','1234','الخبر','transport',4500000::bigint,false,'لوحة نقل بحرفين متطابقين وتسلسل رقمي 1234.','DIRECT',0::bigint),
    (16,'exu-505','ع','ص','و','505','أبها','small',6500000::bigint,true,'لوحة صغيرة برقم متناظر وحروف متناسقة.','DIRECT',0::bigint),
    (17,'zlk-5','م','ل','ك','5','الرياض','private',48000000::bigint,true,'لوحة أحادية بحروف م ل ك ورقم 5.','DIRECT',0::bigint),
    (18,'njb-22','ن','ح','ب','22','جدة','small',26000000::bigint,true,'لوحة ثنائية متطابقة بقياس رياضي.','DIRECT',0::bigint)
  ) as x(ord,slug,l1,l2,l3,digits,city,type_code,price,featured,description,auction_status,increment)
  loop
    insert into public.plates(owner_id,slug,type_id,letter_1_id,letter_2_id,letter_3_id,digits,city_id,description,verification_status,listing_status,sale_mode,asking_price_minor,featured,created_at)
    select v_owner,item.slug,t.id,a.id,b.id,c.id,item.digits,city.id,item.description,'APPROVED','PUBLISHED',
      case when item.auction_status='DIRECT' then 'FIXED_PRICE' else 'AUCTION' end,
      case when item.auction_status='DIRECT' then item.price else null end,item.featured,now()-item.ord*interval '1 second'
    from public.plate_types t cross join public.plate_letters a cross join public.plate_letters b cross join public.plate_letters c
      left join public.cities city on city.name_ar=item.city
    where t.code=item.type_code and a.arabic=item.l1 and b.arabic=item.l2 and c.arabic=item.l3
    on conflict(slug) do nothing;

    if item.auction_status <> 'DIRECT' then
      select id into v_plate from public.plates where slug=item.slug and owner_id=v_owner;
      if v_plate is not null then
        insert into public.auctions(plate_id,slug,status,starting_price,current_price,increment_mode,minimum_increment,
          deposit_type,require_kyc,registration_start_at,registration_end_at,start_at,scheduled_end_at,effective_end_at,
          anti_sniping_enabled,extension_window_seconds,extension_duration_seconds,max_extensions,commission_type)
        values(v_plate,'auction-'||item.slug,item.auction_status,item.price,item.price,'FIXED',item.increment,
          'NONE',true,
          case when item.auction_status='SCHEDULED' then now()+interval '1 day' else now()-interval '1 day' end,
          case when item.auction_status='LIVE' then now()-interval '2 hours' else now()+interval '7 days' end,
          case when item.auction_status='LIVE' then now()-interval '1 hour' else now()+interval '7 days' end,
          now()+interval '30 days',now()+interval '30 days',true,300,300,3,'NONE')
        on conflict(slug) do nothing;
      end if;
    end if;
  end loop;
end; $$;
