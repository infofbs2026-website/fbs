import { z } from 'zod';
import { createSessionClient } from '@/lib/supabase/server';
import { assertOrigin,readJson,success,failure } from '@/lib/api';
import { rateLimit } from '@/lib/rate-limit';
import { siteOrigin } from '@/lib/env';
import { DomainError } from '@/lib/errors';
const credentials=z.object({email:z.email().max(254),password:z.string().min(12).max(128),displayName:z.string().min(2).max(120).optional()});
export async function POST(request:Request,{params}:{params:Promise<{action:string}>}){try{
  assertOrigin(request);const {action}=await params;const client=await createSessionClient();
  if(!client){
    if(action==='logout')return success({redirect:'/'});
    if(action==='login'||action==='register')return success({redirect:'/account'});
    return success({message:'تمت العملية بنجاح (وضع المعاينة).'});
  }
  const body=await readJson(request);await rateLimit('auth',request.headers.get('x-forwarded-for')?.split(',')[0]??'unknown');
  if(action==='logout'){const {error}=await client.auth.signOut();if(error)throw error;return success({redirect:'/'});}
  if(action==='login'){const values=z.object({email:z.email().max(254),password:z.string().min(1).max(128)}).parse(body);const {error}=await client.auth.signInWithPassword(values);if(error)throw new DomainError('AUTH_REQUIRED','البريد أو كلمة المرور غير صحيحة، أو لم يتم تفعيل الحساب.',{},401);return success({redirect:'/account'});}
  if(action==='register'){const values=credentials.parse(body);const {error}=await client.auth.signUp({email:values.email,password:values.password,options:{data:{display_name:values.displayName??''},emailRedirectTo:`${siteOrigin()}/auth/callback`}});if(error)throw new DomainError('INVALID_INPUT','تعذر إنشاء الحساب. راجع البيانات أو حاول لاحقًا.');return success({message:'تحقق من بريدك الإلكتروني لإكمال تفعيل الحساب.'});}
  if(action==='forgot-password'){const {email}=z.object({email:z.email().max(254)}).parse(body);await client.auth.resetPasswordForEmail(email,{redirectTo:`${siteOrigin()}/auth/callback?next=/reset-password`});return success({message:'إذا كان البريد مسجلًا، ستصلك رسالة استعادة كلمة المرور.'});}
  if(action==='reset-password'){const {password}=z.object({password:z.string().min(12).max(128)}).parse(body);const {data:{user}}=await client.auth.getUser();if(!user)throw new DomainError('AUTH_REQUIRED',undefined,{},401);const {error}=await client.auth.updateUser({password});if(error)throw error;return success({message:'تم تغيير كلمة المرور.'});}
  if(action==='verify'){const {email}=z.object({email:z.email().max(254)}).parse(body);await client.auth.resend({type:'signup',email,options:{emailRedirectTo:`${siteOrigin()}/auth/callback`}});return success({message:'تحقق من بريدك الإلكتروني إذا كان الحساب ينتظر التفعيل.'});}
  return new Response(null,{status:404});
}catch(e){return failure(e);}}
