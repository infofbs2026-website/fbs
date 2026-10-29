import { z } from 'zod';
import { assertOrigin, failure, readJson, success } from '@/lib/api';
import { requireMfa, requirePermission } from '@/lib/auth';
import { DomainError } from '@/lib/errors';
import { rateLimit } from '@/lib/rate-limit';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertOrigin(request);
    const viewer = await requirePermission('identity.review');
    await requireMfa();
    await rateLimit('admin', `${viewer.id}:identity-review`);
    const id = z.uuid().parse((await params).id);
    const value = z.object({ status: z.enum(['VERIFIED', 'REJECTED']), reason: z.string().trim().max(1000) }).refine(v => v.status !== 'REJECTED' || v.reason.length >= 3).parse(await readJson(request));
    const db = createAdminClient();
    if (!db) throw new DomainError('SYSTEM_DEGRADED', undefined, {}, 503);
    const { data, error } = await db.rpc('fbs_review_identity', { p_id: id, p_actor_id: viewer.id, p_status: value.status, p_reason: value.reason });
    if (error?.message === 'FORBIDDEN') throw new DomainError('FORBIDDEN', 'لا يمكنك مراجعة طلب الهوية الخاص بك.', {}, 403);
    if (error?.message === 'INVALID_TRANSITION') throw new DomainError('INVALID_TRANSITION', 'تمت مراجعة هذا الطلب بالفعل.', {}, 409);
    if (error || !data) throw new DomainError('SYSTEM_DEGRADED', undefined, {}, 503);
    return success(data);
  } catch (error) { return failure(error); }
}
