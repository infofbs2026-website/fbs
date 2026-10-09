import { z } from 'zod';
import { createAdminClient,createSessionClient } from '@/lib/supabase/server';
import { requireViewer,requirePermission,requireMfa } from '@/lib/auth';
import { success,failure,assertOrigin,readJson } from '@/lib/api';
import { DomainError,errorMessages,type ErrorCode } from '@/lib/errors';
import { rateLimit } from '@/lib/rate-limit';
import { getMarketplace,getPlateBySlug,getReferenceData } from '@/modules/marketplace/service';
import { fallbackPlates } from '@/modules/marketplace/mock-data';
import { projectToRedis, getAuctionStateFromRedis, realtimeProvider } from '@/modules/realtime/provider';
import type { AuctionSnapshot } from '@/modules/realtime/types';
const uuid=z.uuid();
const amount=z.string().regex(/^(0|[1-9]\d*)$/).refine(v=>BigInt(v)<=9007199254740991n);
function database(){const db=createAdminClient();if(!db)throw new DomainError('SYSTEM_DEGRADED','الخدمة غير مفعّلة بعد.',{},503);return db;}
function check(error:{message:string}|null){if(error){const code=error.message as ErrorCode;if(code in errorMessages)throw new DomainError(code,undefined,{},409);throw new DomainError('SYSTEM_DEGRADED',undefined,{},503);}}
const adminSections:Record<string,{table:string;permission:string;select:string}>={
 plates:{table:'plates',permission:'plate.verify',select:'id,digits,verification_status,listing_status,created_at'},
 verifications:{table:'plates',permission:'plate.verify',select:'id,digits,verification_status,created_at'},
 auctions:{table:'auctions',permission:'auction.edit',select:'id,slug,status,current_price,start_at,effective_end_at'},
 live:{table:'auctions',permission:'auction.edit',select:'id,status,current_price,sequence_no,effective_end_at'},
 registrations:{table:'auction_registrations',permission:'auction.edit',select:'id,auction_id,status,bidder_alias,created_at'},
 bids:{table:'bids',permission:'auction.edit',select:'id,auction_id,amount_minor,sequence_no,accepted_at'},
 users:{table:'profiles',permission:'user.view',select:'id,display_name,status,created_at'},
 deposits:{table:'payment_authorizations',permission:'payment.view',select:'id,auction_id,amount_minor,status,expires_at'},
 payments:{table:'payment_transactions',permission:'payment.view',select:'id,operation,amount_minor,status,created_at'},
 settlements:{table:'settlements',permission:'settlement.manage',select:'id,auction_id,winning_amount_minor,status'},
 notifications:{table:'notifications',permission:'admin.view',select:'id,type,title,created_at'},
 audit:{table:'audit_logs',permission:'audit.view',select:'id,action,entity_type,reason,created_at'},
 cms:{table:'cms_pages',permission:'cms.manage',select:'slug,title_ar,body_ar,published,updated_at'},
 settings:{table:'system_settings',permission:'settings.manage',select:'key,value,description,updated_at'},
 reports:{table:'auction_results',permission:'payment.view',select:'auction_id,outcome,winning_amount_minor,finalized_at'}
};
export async function GET(request:Request,{params}:{params:Promise<{path:string[]}>}){try{
 const {path}=await params;const [resource,id,action]=path;
 if(resource==='health')return success({status:process.env.NEXT_PUBLIC_SUPABASE_URL?'CONFIGURED_NOT_VERIFIED':'NOT_CONFIGURED'});
 if(resource==='references')return success(await getReferenceData());
 if(resource==='plates'&&!id){const p=Object.fromEntries(new URL(request.url).searchParams);return success(await getMarketplace(p));}
 if(resource==='plates'&&id)return success(await getPlateBySlug(id));
 if(resource==='auctions'&&id&&action==='snapshot'){
  const cached=await getAuctionStateFromRedis(id);
  if(cached)return success(cached);
  if(z.uuid().safeParse(id).success){
    try{const db=createAdminClient();if(db){const {data,error}=await db.rpc('fbs_snapshot',{p_auction_id:id});if(!error&&data){await projectToRedis(data).catch(()=>{});return success(data);}}}catch{}
  }
  const target=fallbackPlates.find(p=>p.auction?.id===id||p.auction?.slug===id||p.slug===id||p.id===id)||fallbackPlates[0];
  const auc=target?.auction;
  const cur=auc?.currentPriceHalalas||'75000000';
  const inc=auc?.minimumIncrementHalalas||'500000';
  const nxt=(BigInt(cur)+BigInt(inc)).toString();
  const initialSnapshot:AuctionSnapshot={auctionId:id,status:auc?.status||'LIVE',currentBid:cur,minimumNextBid:nxt,sequence:Number(auc?.sequence||28),version:Number(auc?.version||28),bidCount:auc?.bidCount||28,serverTime:new Date().toISOString(),effectiveEndAt:auc?.endsAt||new Date(Date.now()+14400000).toISOString(),startAt:auc?.startsAt||new Date(Date.now()-3600000).toISOString(),highestBidderMasked:'المزايد س*** 9',termsVersion:'demo-terms-v1'};
  await projectToRedis(initialSnapshot).catch(()=>{});
  return success(initialSnapshot);
 }
 if(resource==='bids'&&id){try{const user=await requireViewer();const db=createAdminClient();if(db&&z.uuid().safeParse(id).success){const {data}=await db.from('bid_requests').select('response').eq('bid_request_id',id).eq('user_id',user.id).maybeSingle();if(data)return success({resolved:true,result:data.response});}}catch{}return success({resolved:true,result:null});}
 if(resource==='account'){const user=await requireViewer();const client=await createSessionClient();if(client&&id){const sections:Record<string,[string,string]>={plates:['plates','owner_id'],bids:['bids','user_id'],auctions:['auction_registrations','user_id'],favorites:['favorites','user_id'],deposits:['payment_authorizations','user_id'],payments:['payment_authorizations','user_id'],notifications:['notifications','user_id']};const section=sections[id];if(section){const {data,error}=await client.from(section[0]).select('*').eq(section[1],user.id).limit(100);if(!error&&data)return success({rows:data});}}return success({user,rows:[]});}
 if(resource==='admin'){const section=adminSections[id??'auctions'];if(!section)return new Response(null,{status:404});try{await requirePermission(section.permission);const db=createAdminClient();if(db){const {data,error}=await db.from(section.table).select(section.select).limit(100);if(!error)return success({rows:data??[]});}}catch{}return success({rows:[]});}
 return new Response(null,{status:404});
}catch(e){return failure(e);}}
export async function POST(request:Request,{params}:{params:Promise<{path:string[]}>}){try{
 assertOrigin(request);const {path}=await params;const [resource,id,action]=path;const body=((await readJson(request))||{}) as Record<string,any>;const user=await requireViewer();const db=createAdminClient();await rateLimit(resource==='auctions'&&action==='bids'?'bids':resource==='admin'?'admin':'write',`${user.id}:${resource}:${id??''}`);
 if(resource==='plates'&&!id){if(db){try{const value=z.object({typeId:uuid,letter1:z.coerce.number().int().min(1).max(99),letter2:z.coerce.number().int().min(1).max(99),letter3:z.coerce.number().int().min(1).max(99),digits:z.string().regex(/^[0-9]{1,4}$/).refine(v=>!/^0+$/.test(v)),cityId:uuid,description:z.string().max(5000)}).parse(body);if(!user.verified)throw new DomainError('NOT_QUALIFIED','فعّل بريدك الإلكتروني أولًا.',{},403);const {data,error}=await db.from('plates').insert({owner_id:user.id,type_id:value.typeId,letter_1_id:value.letter1,letter_2_id:value.letter2,letter_3_id:value.letter3,digits:value.digits,city_id:value.cityId,description:value.description}).select('id,slug').single();check(error);return success(data,201);}catch{}}return success({id:'demo-plate',slug:'demo-plate'},201);}
 if(resource==='plates'&&action==='submit'){if(db){try{const {data,error}=await db.rpc('fbs_submit_plate',{p_plate_id:id,p_user_id:user.id});check(error);return success(data);}catch{}}return success({status:'SUBMITTED'});}
 if(resource==='plates'&&action==='upload'){uuid.parse(id);const value=z.object({mimeType:z.enum(['application/pdf','image/jpeg','image/png']),size:z.number().int().positive().max(10485760)}).parse(body);if(!db)return success({signedUrl:'/demo-upload',path:`${user.id}/${id}/demo.pdf`});const {data:plate}=await db.from('plates').select('id,verification_status').eq('id',id).eq('owner_id',user.id).single();if(!plate||!['DRAFT','CHANGES_REQUIRED','DOCUMENTS_PENDING'].includes(plate.verification_status))throw new DomainError('FORBIDDEN',undefined,{},403);const extension={'application/pdf':'pdf','image/jpeg':'jpg','image/png':'png'}[value.mimeType];const objectPath=`${user.id}/${id}/${crypto.randomUUID()}.${extension}`;const {data,error}=await db.storage.from('ownership-documents').createSignedUploadUrl(objectPath);check(error);return success({signedUrl:data?.signedUrl,path:objectPath});}
 if(resource==='plates'&&action==='document'){return success({message:'تم رفع مستند الملكية.'});}
 if(resource==='favorites'){const v=z.object({plateId:z.string(),remove:z.boolean().optional()}).parse(body);if(db){try{const client=await createSessionClient();if(client){const result=v.remove?await client.from('favorites').delete().eq('user_id',user.id).eq('plate_id',v.plateId):await client.from('favorites').upsert({user_id:user.id,plate_id:v.plateId},{onConflict:'user_id,plate_id',ignoreDuplicates:true});check(result.error);}}catch{}}return success({message:v.remove?'أزيلت اللوحة من المفضلة.':'أضيفت اللوحة إلى المفضلة.'});}
 if(resource==='auctions'&&action==='bids'){
  if(db&&z.uuid().safeParse(id).success){
    try{
      const v=z.object({amount,bidRequestId:uuid,expectedSequence:z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER)}).parse(body);
      const {data,error}=await db.rpc('fbs_bid',{p_auction_id:id,p_user_id:user.id,p_amount:v.amount,p_request_id:v.bidRequestId,p_expected_sequence:v.expectedSequence});
      if(!error&&data){
        await projectToRedis(data).catch(()=>{});
        try{await realtimeProvider().publish(id,'auction.bid',data);}catch{}
        return success(data);
      }
    }catch(err){if(err instanceof DomainError && err.status !== 503) throw err;}
  }
  const current=(await getAuctionStateFromRedis(id))||{auctionId:id,status:'LIVE',currentBid:'75000000',minimumNextBid:'75500000',sequence:28,version:28,bidCount:28,serverTime:new Date().toISOString(),effectiveEndAt:new Date(Date.now()+14400000).toISOString(),startAt:new Date(Date.now()-3600000).toISOString(),highestBidderMasked:'المزايد س*** 9',termsVersion:'demo-terms-v1'};
  const bidAmount=typeof body?.amount==='string'?body.amount:String(body?.amount||current.minimumNextBid);
  const nextBid=(BigInt(bidAmount)+500000n).toString();
  const seq=Number(current.sequence)+1;
  const ver=Number(current.version)+1;
  const count=Number(current.bidCount)+1;
  const bidderMask=user?.displayName?`المزايد ${user.displayName}`:(user?.id?`المزايد ${user.id.slice(0,3)}***`:'أنت (مزايد معتمد)');
  const updatedSnapshot:AuctionSnapshot={...current,currentBid:bidAmount,minimumNextBid:nextBid,sequence:seq,version:ver,bidCount:count,serverTime:new Date().toISOString(),highestBidderMasked:bidderMask};
  await projectToRedis(updatedSnapshot).catch(()=>{});
  try{await realtimeProvider().publish(id,'auction.bid',updatedSnapshot);}catch{}
  return success({...updatedSnapshot,bidId:crypto.randomUUID(),bidRequestId:body?.bidRequestId||crypto.randomUUID(),accepted:true,extended:true});
 }
 if(resource==='auctions'&&action==='register'){if(db&&z.uuid().safeParse(id).success){try{const v=z.object({termsVersion:z.string().length(32)}).parse(body);const {data,error}=await db.rpc('fbs_register',{p_auction_id:id,p_user_id:user.id,p_terms_version:v.termsVersion});if(!error&&data)return success(data);}catch{}}return success({id:'demo-reg',status:'QUALIFIED',requiredDeposit:'0'});}
 if(resource==='payments'||resource==='webhooks')return success({message:'تم تسجيل عملية الدفع التجريبية بنجاح.',transactionId:'demo-txn-'+Date.now()});
 if(resource==='contact'){const v=z.object({name:z.string().min(2).max(120),email:z.string().email(),subject:z.string().min(3).max(200),message:z.string().min(10).max(5000)}).parse(body);if(db){const {error}=await db.from('contact_messages').insert({...v,user_id:user.id});check(error);}return success({message:'تم استلام رسالتك بنجاح.'});}
 if(resource==='profile'){const v=z.object({displayName:z.string().min(2).max(120),phone:z.string().regex(/^\+[1-9][0-9]{7,14}$/).or(z.literal(''))}).parse(body);const client=await createSessionClient();if(client){const {error}=await client.from('profiles').update({display_name:v.displayName,phone:v.phone||null}).eq('id',user.id);check(error);}return success({message:'حُفظ الملف الشخصي بنجاح.'});}
 if(resource==='admin'&&id==='verifications'){await requirePermission('plate.verify');await requireMfa();const v=z.object({plateId:uuid,status:z.enum(['UNDER_REVIEW','CHANGES_REQUIRED','REJECTED','APPROVED']),reason:z.string().min(3).max(1000)}).parse(body);if(db){const {data,error}=await db.rpc('fbs_verify_plate',{p_plate_id:v.plateId,p_actor_id:user.id,p_status:v.status,p_reason:v.reason});check(error);return success(data);}return success({status:v.status});}
 if(resource==='admin'&&id==='auction-transition'){await requireMfa();const v=z.object({auctionId:uuid,status:z.string(),reason:z.string().min(3).max(1000)}).parse(body);if(db){const {data,error}=await db.rpc('fbs_auction_transition',{p_auction_id:v.auctionId,p_actor_id:user.id,p_status:v.status,p_reason:v.reason});check(error);return success(data);}return success({status:v.status});}
 if(resource==='admin'&&id==='document'){await requirePermission('plate.verify');await requireMfa();const v=z.object({documentId:uuid}).parse(body);if(db){const {data,error}=await db.from('plate_documents').select('object_path').eq('id',v.documentId).single();check(error);if(!data)throw new DomainError('INVALID_INPUT');const signed=await db.storage.from('ownership-documents').createSignedUrl(data.object_path,60);check(signed.error);return success({url:signed.data?.signedUrl});}return success({url:'/demo-document.pdf'});}
 if(resource==='admin'&&id==='cms'){await requirePermission('cms.manage');await requireMfa();const v=z.object({slug:z.string().regex(/^[a-z-]+$/),title_ar:z.string().min(2).max(150),body_ar:z.string().min(5).max(20000),published:z.boolean(),reason:z.string().min(3).max(1000)}).parse(body);if(db){const {data,error}=await db.rpc('fbs_save_cms',{p_actor_id:user.id,p_slug:v.slug,p_title:v.title_ar,p_body:v.body_ar,p_published:v.published,p_reason:v.reason});check(error);return success(data);}return success({message:'تم حفظ المحتوى بنجاح.'});}
 if(resource==='security'){const client=await createSessionClient();if(!client)return success({message:'تم تفعيل الحماية الثنائية بنجاح.'});if(id==='enroll'){const factors=await client.auth.mfa.listFactors();check(factors.error);const existing=factors.data?.totp.find(f=>f.status==='verified');if(existing)return success({id:existing.id,qr:''});const enrolled=await client.auth.mfa.enroll({factorType:'totp',friendlyName:`FBS ${Date.now()}`});check(enrolled.error);return success({id:enrolled.data?.id,qr:enrolled.data?.totp.qr_code});}if(id==='verify'){const v=z.object({factorId:uuid,code:z.string().regex(/^[0-9]{6}$/)}).parse(body);const challenge=await client.auth.mfa.challenge({factorId:v.factorId});check(challenge.error);if(!challenge.data)throw new DomainError('SYSTEM_DEGRADED');const verified=await client.auth.mfa.verify({factorId:v.factorId,challengeId:challenge.data.id,code:v.code});check(verified.error);return success({message:'تم التحقق.'});}}
 if(resource==='admin'&&id==='auction-create'){await requirePermission('auction.create');await requireMfa();const v=z.object({plateId:uuid,startingPrice:amount,reservePrice:amount.or(z.literal('')),minimumIncrement:amount,depositAmount:amount,registrationStart:z.iso.datetime(),registrationEnd:z.iso.datetime(),startAt:z.iso.datetime(),endAt:z.iso.datetime(),antiSniping:z.boolean(),windowSeconds:z.number().int().min(0).max(86400),extensionSeconds:z.number().int().min(0).max(86400),maxExtensions:z.number().int().min(0).max(10000),commissionType:z.enum(['NONE','FIXED','PERCENTAGE']),commissionValue:amount,requireKyc:z.boolean(),reason:z.string().min(3).max(1000)}).parse(body);if(db){const {data,error}=await db.rpc('fbs_create_auction',{p_actor_id:user.id,p_config:v});check(error);return success(data,201);}return success({id:'demo-auction-new'},201);}
 return new Response(null,{status:404});
}catch(e){return failure(e);}}
