import 'server-only';
import { cache } from 'react';
import { createSessionClient,createAdminClient } from './supabase/server';
import { DomainError } from './errors';
export const getViewer=cache(async()=>{
  const client=await createSessionClient(); if(!client)return null;
  const {data:{user},error}=await client.auth.getUser();if(error||!user)return null;
  const {data:profile,error:profileError}=await client.from('profiles').select('display_name,status').eq('id',user.id).single();
  if(profileError||!profile||profile.status!=='ACTIVE')return null;
  return {id:user.id,email:user.email??'',displayName:String(profile.display_name),role:String(user.app_metadata.role??'user'),verified:Boolean(user.email_confirmed_at)};
});
export async function requireViewer(){const viewer=await getViewer();if(!viewer)throw new DomainError('AUTH_REQUIRED',undefined,{},401);return viewer;}
export async function requirePermission(permission:string){
  const viewer=await requireViewer();const db=createAdminClient();if(!db)throw new DomainError('SYSTEM_DEGRADED',undefined,{},503);
  const {data:roles,error}=await db.from('user_roles').select('role_code').eq('user_id',viewer.id);
  if(error)throw new DomainError('SYSTEM_DEGRADED',undefined,{},503);
  const {data:grants,error:grantError}=await db.from('role_permissions').select('permission_code').in('role_code',[viewer.role,...(roles??[]).map(r=>String(r.role_code))]).eq('permission_code',permission).limit(1);
  if(grantError||!grants?.length)throw new DomainError('FORBIDDEN',undefined,{},403);
  return viewer;
}
export async function requireMfa(){const client=await createSessionClient();if(!client)throw new DomainError('SYSTEM_DEGRADED',undefined,{},503);const {data,error}=await client.auth.mfa.getAuthenticatorAssuranceLevel();if(error||data?.currentLevel!=='aal2')throw new DomainError('FORBIDDEN','يلزم التحقق بخطوتين لتنفيذ هذا الإجراء.',{},403);}
