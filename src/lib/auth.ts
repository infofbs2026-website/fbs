import 'server-only';
import { cache } from 'react';
import { createSessionClient,createAdminClient } from './supabase/server';
import { DomainError } from './errors';
export const getViewer=cache(async()=>{
  const client=await createSessionClient();
  if(!client)return null;
  const {data:{user},error}=await client.auth.getUser();if(error||!user)return null;
  const {data:profile,error:profileError}=await client.from('profiles').select('display_name,status').eq('id',user.id).single();
  if(profileError||!profile||profile.status!=='ACTIVE')return null;
  return {id:user.id,email:user.email??'',displayName:String(profile.display_name),role:String(user.app_metadata.role??'user'),verified:Boolean(user.email_confirmed_at)};
});
export async function requireViewer(){const viewer=await getViewer();if(!viewer)throw new DomainError('AUTH_REQUIRED',undefined,{},401);return viewer;}
export async function requirePermission(permission:string){
  const viewer=await requireViewer();const db=createAdminClient();
  if(!db)throw new DomainError('SYSTEM_DEGRADED',undefined,{},503);
  const {data:roles,error}=await db.from('user_roles').select('role_code').eq('user_id',viewer.id);
  if(error)throw new DomainError('SYSTEM_DEGRADED',undefined,{},503);
  const {data:grants,error:grantError}=await db.from('role_permissions').select('permission_code').in('role_code',[viewer.role,...(roles??[]).map(r=>String(r.role_code))]).eq('permission_code',permission).limit(1);
  if(grantError||!grants?.length)throw new DomainError('FORBIDDEN',undefined,{},403);
  return viewer;
}
export async function requireMfa(){
  const client=await createSessionClient();
  if(!client)throw new DomainError('SYSTEM_DEGRADED',undefined,{},503);
  const {data,error}=await client.auth.mfa.getAuthenticatorAssuranceLevel();
  if(error||data?.currentLevel!=='aal2')throw new DomainError('FORBIDDEN','يلزم التحقق بخطوتين لتنفيذ هذا الإجراء.',{},403);
}
export const getViewerAdminAccess=cache(async()=>{
  const viewer=await getViewer();
  if(!viewer)return {viewer:null,roles:[] as string[],permissions:[] as string[],isAdmin:false,mfaVerified:false,mfaFactorId:null as string|null};
  const [db,sessionClient]=await Promise.all([Promise.resolve(createAdminClient()),createSessionClient()]);
  let roles=[viewer.role];
  let permissions:string[]=[];
  if(db){
    const {data:userRoles}=await db.from('user_roles').select('role_code').eq('user_id',viewer.id);
    roles=Array.from(new Set([viewer.role,...(userRoles??[]).map(r=>String(r.role_code))]));
    const {data:grants}=await db.from('role_permissions').select('permission_code').in('role_code',roles);
    permissions=Array.from(new Set((grants??[]).map(g=>String(g.permission_code))));
  }
  let mfaVerified=false;
  let mfaFactorId:string|null=null;
  if(sessionClient){
    try{
      const [aal,factors]=await Promise.all([sessionClient.auth.mfa.getAuthenticatorAssuranceLevel(),sessionClient.auth.mfa.listFactors()]);
      mfaVerified=aal.data?.currentLevel==='aal2';
      mfaFactorId=factors.data?.totp?.find(f=>f.status==='verified')?.id??null;
    }catch{}
  }
  return {viewer,roles,permissions,isAdmin:permissions.includes('admin.view')||permissions.length>0,mfaVerified,mfaFactorId};
});
