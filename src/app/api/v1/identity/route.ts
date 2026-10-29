import { z } from 'zod';
import { assertOrigin, failure, success } from '@/lib/api';
import { requireViewer } from '@/lib/auth';
import { DomainError } from '@/lib/errors';
import { rateLimit } from '@/lib/rate-limit';
import { createAdminClient, createSessionClient } from '@/lib/supabase/server';

const MAX_IMAGE = 1572864;
const fields = z.object({
  fullName: z.string().trim().min(3).max(120),
  nationalId: z.string().regex(/^[0-9]{10}$/),
  birthDate: z.iso.date().refine((value) => value <= new Date().toISOString().slice(0, 10)),
  phone: z.string().trim().min(7).max(20),
  email: z.email().max(254),
  city: z.string().trim().min(2).max(100)
});

async function verifiedImage(value: FormDataEntryValue | null) {
  if (!(value instanceof File) || !value.size || value.size > MAX_IMAGE) {
    throw new DomainError('INVALID_INPUT', 'اختر صورة JPG أو PNG لا يزيد حجمها عن ١٫٥ ميجابايت.');
  }
  const bytes = new Uint8Array(await value.arrayBuffer());
  const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const png = [137, 80, 78, 71, 13, 10, 26, 10].every((byte, i) => bytes[i] === byte);
  if ((!jpeg && !png) || (jpeg && value.type !== 'image/jpeg') || (png && value.type !== 'image/png')) {
    throw new DomainError('INVALID_INPUT', 'صيغة الصورة غير مدعومة. استخدم JPG أو PNG.');
  }
  return { bytes, type: jpeg ? 'image/jpeg' : 'image/png', extension: jpeg ? 'jpg' : 'png' };
}

function adminClient() {
  const db = createAdminClient();
  if (!db) throw new DomainError('SYSTEM_DEGRADED', undefined, {}, 503);
  return db;
}

export async function GET() {
  try {
    const viewer = await requireViewer();
    const client = await createSessionClient();
    if (!client) throw new DomainError('SYSTEM_DEGRADED', undefined, {}, 503);
    const { data: profile, error } = await client.from('profiles').select('kyc_status').eq('id', viewer.id).single();
    if (error || !profile) throw new DomainError('SYSTEM_DEGRADED', undefined, {}, 503);
    let reason: string | null = null;
    if (profile.kyc_status === 'REJECTED') {
      const result = await adminClient().from('identity_verification_requests').select('review_reason').eq('user_id', viewer.id).eq('status', 'REJECTED').order('reviewed_at', { ascending: false }).limit(1).maybeSingle();
      if (result.error) throw new DomainError('SYSTEM_DEGRADED', undefined, {}, 503);
      reason = result.data?.review_reason ?? null;
    }
    return success({ status: profile.kyc_status, reason });
  } catch (error) { return failure(error); }
}

export async function POST(request: Request) {
  let uploaded: string[] = [];
  let submissionAttempted = false;
  const db = createAdminClient();
  try {
    assertOrigin(request);
    const viewer = await requireViewer();
    if (!viewer.verified) throw new DomainError('AUTH_REQUIRED', 'فعّل البريد الإلكتروني أولًا.', {}, 403);
    if (!db) throw new DomainError('SYSTEM_DEGRADED', undefined, {}, 503);
    await rateLimit('write', `${viewer.id}:identity`);
    const length = Number(request.headers.get('content-length') || 0);
    if (length > 3400000) throw new DomainError('INVALID_INPUT', 'يجب ألا يزيد حجم كل صورة عن ١٫٥ ميجابايت.');
    if (!request.headers.get('content-type')?.startsWith('multipart/form-data')) throw new DomainError('INVALID_INPUT');
    const form = await request.formData();
    const values = fields.parse(Object.fromEntries(['fullName','nationalId','birthDate','phone','email','city'].map(key => [key, form.get(key)])));
    const [front, back] = await Promise.all([verifiedImage(form.get('front')), verifiedImage(form.get('back'))]);
    const requestId = crypto.randomUUID();
    const prefix = `${viewer.id}/${requestId}`;
    const frontPath = `${prefix}/front.${front.extension}`;
    const backPath = `${prefix}/back.${back.extension}`;
    const bucket = db.storage.from('identity-documents');
    const first = await bucket.upload(frontPath, front.bytes, { contentType: front.type, upsert: false });
    if (first.error) throw new DomainError('SYSTEM_DEGRADED', undefined, {}, 503);
    uploaded.push(frontPath);
    const second = await bucket.upload(backPath, back.bytes, { contentType: back.type, upsert: false });
    if (second.error) throw new DomainError('SYSTEM_DEGRADED', undefined, {}, 503);
    uploaded.push(backPath);
    submissionAttempted = true;
    const { data, error } = await db.rpc('fbs_submit_identity', { p_id: requestId, p_user_id: viewer.id, p_data: values, p_front_path: frontPath, p_back_path: backPath });
    if (error?.message === 'INVALID_TRANSITION') { submissionAttempted = false; throw new DomainError('INVALID_TRANSITION', 'يوجد طلب قيد المراجعة أو هوية معتمدة بالفعل.', {}, 409); }
    if (error || !data) throw new DomainError('SYSTEM_DEGRADED', undefined, {}, 503);
    uploaded = [];
    return success(data, 201);
  } catch (error) {
    if (db && uploaded.length && !submissionAttempted) await db.storage.from('identity-documents').remove(uploaded).catch(() => {});
    return failure(error);
  }
}
