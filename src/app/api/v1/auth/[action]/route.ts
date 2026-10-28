import { z } from 'zod';
import { createSessionClient, createAdminClient } from '@/lib/supabase/server';
import { assertOrigin,readJson,success,failure } from '@/lib/api';
import { rateLimit } from '@/lib/rate-limit';
import { siteOrigin } from '@/lib/env';
import { DomainError } from '@/lib/errors';
import { getViewer } from '@/lib/auth';
import { sendOtpEmail } from '@/lib/email';

const credentials=z.object({
  email:z.email().max(254),
  password:z.string().min(8).max(128),
  displayName:z.string().min(2).max(120).optional(),
  phone:z.string().optional()
});

export async function GET(request:Request,{params}:{params:Promise<{action:string}>}){
  try{
    const {action}=await params;
    if(action==='session'){
      const viewer=await getViewer();
      return success({user:viewer});
    }
    return new Response(null,{status:404});
  }catch(e){return failure(e);}
}

export async function POST(request:Request,{params}:{params:Promise<{action:string}>}){try{
  assertOrigin(request);
  const {action}=await params;
  const client=await createSessionClient();
  if(!client){
    if(action==='logout')return success({redirect:'/'});
    if(action==='login')return success({redirect:'/account'});
    if(['register','verify','verify-otp','resend-otp','forgot-password','reset-password-otp'].includes(action)){
      throw new DomainError('SYSTEM_DEGRADED','خدمة المصادقة غير متاحة حالياً. يرجى المحاولة لاحقاً.',{},503);
    }
    return success({message:'تمت العملية بنجاح (وضع المعاينة).'});
  }

  const body=await readJson(request);
  await rateLimit('auth',request.headers.get('x-forwarded-for')?.split(',')[0]??'unknown');

  if(action==='logout'){
    const {error}=await client.auth.signOut();
    if(error)throw error;
    return success({redirect:'/'});
  }

  if(action==='login'){
    const values=z.object({email:z.string().min(1).max(254),password:z.string().min(1).max(128)}).parse(body);
    const isEmail=values.email.includes('@');
    const {error}=await client.auth.signInWithPassword(isEmail?{email:values.email,password:values.password}:{phone:values.email.startsWith('+')?values.email:`+966${values.email.replace(/^0/,'')}`,password:values.password});
    if(error){
      const msg = error.message?.toLowerCase() ?? '';
      if(msg.includes('email not confirmed')){
        throw new DomainError('AUTH_REQUIRED','لم يتم تفعيل الحساب بعد. يرجى إدخال رمز التحقق (OTP) أو طلب إعادة الإرسال.',{},401);
      }
      throw new DomainError('AUTH_REQUIRED','بيانات الدخول أو كلمة المرور غير صحيحة، أو لم يتم تفعيل الحساب.',{},401);
    }
    return success({redirect:'/account'});
  }

  if(action==='register'){
    const values=credentials.parse(body);
    const displayName=(values.displayName??'').trim();
    const admin=createAdminClient();

    // 1. Enforce unique display name
    if(displayName && admin){
      const {data:existingProfile}=await admin.from('profiles').select('id').ilike('display_name',displayName).maybeSingle();
      if(existingProfile){
        throw new DomainError('INVALID_INPUT','هذا الاسم مسجل بالفعل، يرجى استخدام اسم آخر.');
      }
    }

    // 2. Perform signUp in Supabase
    const {data,error}=await client.auth.signUp({
      email:values.email,
      password:values.password,
      options:{data:{display_name:displayName},emailRedirectTo:`${siteOrigin()}/auth/callback`}
    });

    if(error) throw new DomainError('INVALID_INPUT', error.message || 'تعذر إنشاء الحساب. راجع البيانات أو حاول لاحقًا.');

    // If user already exists in Supabase
    if(data?.user && Array.isArray(data.user.identities) && data.user.identities.length===0){
      throw new DomainError('INVALID_INPUT','هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول مباشرة أو استعادة كلمة المرور.');
    }

    // Supabase sends the signup code through the confirmation template. Creating
    // another token here can invalidate that email before the user receives it.
    if(data.session)return success({redirect:'/account'});

    return success({
      step:'otp',
      email:values.email,
      message:'تحقق من بريدك الإلكتروني وأدخل رمز التفعيل لإكمال التسجيل.'
    });
  }

  if(action==='verify-otp'){
    const values=z.object({
      email:z.email().max(254),
      token:z.string().min(4).max(16),
      type:z.enum(['signup','recovery']).default('signup')
    }).parse(body);

    const {data,error}=await client.auth.verifyOtp({
      email:values.email,
      token:values.token.trim(),
      type:values.type
    });

    if(error || !data.session){
      throw new DomainError('INVALID_INPUT','رمز التحقق غير صحيح أو منتهي الصلاحية. يرجى التأكد وإعادة المحاولة.');
    }

    return success({
      redirect:'/account',
      message:'تم تأكيد الحساب وتسجيل الدخول بنجاح!'
    });
  }

  if(action==='forgot-password'){
    const {email}=z.object({email:z.email().max(254)}).parse(body);
    const admin=createAdminClient();
    if(!admin) throw new DomainError('SYSTEM_DEGRADED','خدمة المصادقة غير متاحة حالياً.');

    // Generate recovery link & OTP
    const linkRes=await admin.auth.admin.generateLink({type:'recovery',email});
    if(linkRes.error){
      if((linkRes.error as {code?:string}).code==='user_not_found'){
        throw new DomainError('INVALID_INPUT','هذا البريد الإلكتروني غير مسجل لدينا.');
      }
      throw new DomainError('INVALID_INPUT','تعذر إرسال رمز الاستعادة. تأكد من صحة البريد وحاول مجددًا.');
    }

    const otp=linkRes.data.properties.email_otp;
    const emailRes=await sendOtpEmail({email,otp,type:'recovery'});
    if(!emailRes.sent&&!emailRes.devOtp)throw new DomainError('SYSTEM_DEGRADED','تعذر إرسال رمز الاستعادة. يرجى المحاولة لاحقاً.',{},503);

    return success({
      step:'reset',
      email,
      devOtp:emailRes.devOtp,
      message:'تم إرسال رمز التحقق إلى بريدك الإلكتروني بنجاح.'
    });
  }

  if(action==='reset-password-otp'){
    const values=z.object({
      email:z.email().max(254),
      token:z.string().min(4).max(16),
      password:z.string().min(8).max(128)
    }).parse(body);

    // 1. Verify recovery OTP to establish session
    const {data,error}=await client.auth.verifyOtp({
      email:values.email,
      token:values.token.trim(),
      type:'recovery'
    });

    if(error || !data.session){
      throw new DomainError('INVALID_INPUT','رمز التحقق غير صحيح أو منتهي الصلاحية. يرجى طلب رمز جديد.');
    }

    // 2. Update password for authenticated user
    const updateRes=await client.auth.updateUser({password:values.password});
    if(updateRes.error) throw new DomainError('INVALID_INPUT','تعذر تحديث كلمة المرور. حاول مجددًا.');

    return success({
      redirect:'/account',
      message:'تم تعيين كلمة المرور الجديدة وتسجيل الدخول بنجاح!'
    });
  }

  if(action==='resend-otp'){
    const values=z.object({
      email:z.email().max(254),
      type:z.enum(['signup','recovery']).default('signup')
    }).parse(body);

    if(values.type==='signup'){
      const {error}=await client.auth.resend({type:'signup',email:values.email,options:{emailRedirectTo:`${siteOrigin()}/auth/callback`}});
      if(error)throw new DomainError('INVALID_INPUT','تعذر إعادة إرسال رمز التفعيل. يرجى الانتظار قليلاً والمحاولة مجدداً.');
      return success({message:'إذا كان الحساب بانتظار التفعيل، فسيصلك رمز جديد على بريدك الإلكتروني.'});
    }

    const admin=createAdminClient();
    if(!admin) throw new DomainError('SYSTEM_DEGRADED','خدمة المصادقة غير متاحة حالياً.');

    const linkRes=await admin.auth.admin.generateLink({type:'recovery',email:values.email});

    if(linkRes.error) throw new DomainError('INVALID_INPUT','تعذر إعادة إرسال الرمز حاليًا. حاول لاحقًا.');

    const otp=linkRes.data.properties.email_otp;
    const emailRes=await sendOtpEmail({email:values.email,otp,type:values.type});
    if(!emailRes.sent&&!emailRes.devOtp)throw new DomainError('SYSTEM_DEGRADED','تعذر إرسال رمز الاستعادة. يرجى المحاولة لاحقاً.',{},503);

    return success({
      devOtp:emailRes.devOtp,
      message:'تمت إعادة إرسال رمز التحقق بنجاح.'
    });
  }

  if(action==='reset-password'){
    const {password}=z.object({password:z.string().min(12).max(128)}).parse(body);
    const {data:{user}}=await client.auth.getUser();
    if(!user)throw new DomainError('AUTH_REQUIRED',undefined,{},401);
    const {error}=await client.auth.updateUser({password});
    if(error)throw error;
    return success({message:'تم تغيير كلمة المرور.'});
  }

  if(action==='verify'){
    const {email}=z.object({email:z.email().max(254)}).parse(body);
    const {error}=await client.auth.resend({type:'signup',email,options:{emailRedirectTo:`${siteOrigin()}/auth/callback`}});
    if(error) throw new DomainError('INVALID_INPUT','تعذر إعادة إرسال رمز التفعيل. يرجى الانتظار قليلاً والمحاولة مجدداً.');
    return success({step:'otp',email,message:'إذا كان الحساب بانتظار التفعيل، فسيصلك رمز جديد على بريدك الإلكتروني.'});
  }

  return new Response(null,{status:404});
}catch(e){return failure(e);}}
