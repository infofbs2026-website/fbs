import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/server';
import { failure } from '@/lib/api';
import { DomainError } from '@/lib/errors';
import { realtimeProvider } from '@/modules/realtime/provider';
import { rateLimit } from '@/lib/rate-limit';
export async function GET(request:Request){try{const id=z.uuid().parse(new URL(request.url).searchParams.get('auctionId'));await rateLimit('search',request.headers.get('x-forwarded-for')??'unknown');const db=createAdminClient();if(!db)throw new DomainError('SYSTEM_DEGRADED');const {data,error}=await db.rpc('fbs_snapshot',{p_auction_id:id});if(error||!data)throw new DomainError('AUCTION_NOT_FOUND',undefined,{},404);return Response.json(await realtimeProvider().createChannelToken(id),{headers:{'Cache-Control':'private, no-store'}});}catch(e){return failure(e);}}
