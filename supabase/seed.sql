-- Reference data only: no fabricated sellers, auctions, deposits or statistics.
insert into public.plate_letters(id,arabic,latin,normalized_code,sort_order) values
(1,'ا','A','A',1),(2,'ب','B','B',2),(3,'ح','J','J',3),(4,'د','D','D',4),(5,'ر','R','R',5),
(6,'س','S','S',6),(7,'ص','X','X',7),(8,'ط','T','T',8),(9,'ع','E','E',9),(10,'ق','G','G',10),
(11,'ك','K','K',11),(12,'ل','L','L',12),(13,'م','Z','Z',13),(14,'ن','N','N',14),(15,'ه','H','H',15),
(16,'و','U','U',16),(17,'ى','V','V',17) on conflict(id) do nothing;
insert into public.plate_types(code,name_ar,name_en,sort_order) values ('private','خصوصي','Private',1),('transport','نقل','Transport',2),('small','صغيرة','Small / Sports',3) on conflict(code) do nothing;
insert into public.regions(code,name_ar,name_en) values ('riyadh','الرياض','Riyadh'),('makkah','مكة المكرمة','Makkah'),('eastern','الشرقية','Eastern') on conflict(code) do nothing;
insert into public.cities(region_id,name_ar,name_en) select id,'الرياض','Riyadh' from public.regions where code='riyadh' on conflict do nothing;
insert into public.cities(region_id,name_ar,name_en) select id,'جدة','Jeddah' from public.regions where code='makkah' on conflict do nothing;
insert into public.cities(region_id,name_ar,name_en) select id,'الدمام','Dammam' from public.regions where code='eastern' on conflict do nothing;
insert into public.roles(code,label) values ('user','مستخدم'),('bidder','مزايد'),('seller','مالك لوحة'),('auction_manager','مدير مزادات'),('finance_admin','مالية'),('content_admin','إدارة المحتوى'),('support_admin','دعم'),('super_admin','مدير أعلى') on conflict do nothing;
insert into public.permissions(code,description) values ('admin.view','لوحة الإدارة'),('plate.verify','مراجعة الملكية'),('auction.create','إنشاء مزاد'),('auction.edit','إعداد مزاد'),('auction.pause','إيقاف مزاد'),('auction.resume','بدء أو استئناف مزاد'),('auction.cancel','إلغاء مزاد'),('payment.view','عرض المدفوعات'),('payment.capture','تحصيل'),('payment.void','فك حجز'),('payment.refund','استرداد'),('settings.manage','الإعدادات'),('cms.manage','المحتوى'),('audit.view','التدقيق'),('user.view','المستخدمون'),('settlement.manage','التسوية') on conflict do nothing;
insert into public.role_permissions select 'super_admin',code from public.permissions on conflict do nothing;
insert into public.role_permissions select 'auction_manager',code from public.permissions where code in ('admin.view','plate.verify','auction.create','auction.edit','auction.pause','auction.resume','auction.cancel') on conflict do nothing;
insert into public.role_permissions select 'finance_admin',code from public.permissions where code in ('admin.view','payment.view','payment.capture','payment.void','payment.refund','settlement.manage') on conflict do nothing;
insert into public.role_permissions select 'content_admin',code from public.permissions where code in ('admin.view','cms.manage') on conflict do nothing;
insert into public.role_permissions select 'support_admin',code from public.permissions where code in ('admin.view','user.view') on conflict do nothing;
insert into public.feature_flags(key,description) values ('fixed_price_sales','البيع بسعر ثابت'),('buy_now','الشراء الفوري'),('proxy_bidding','المزايدة الآلية'),('phone_otp','التحقق بالجوال'),('advanced_kyc','التحقق المتقدم'),('whatsapp','رسائل واتساب'),('sms','رسائل نصية'),('saved_search_alerts','تنبيهات البحث'),('seller_self_service','خدمة البائع الذاتية') on conflict do nothing;
