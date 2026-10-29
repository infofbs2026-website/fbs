import { z } from 'zod';
import { requireMfa, requirePermission } from '@/lib/auth';
import { failure } from '@/lib/api';
import { DomainError } from '@/lib/errors';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string; side: string }> }) {
  try {
    await requirePermission('identity.review');
    await requireMfa();
    const { id: rawId, side: rawSide } = await params;
    const id = z.uuid().parse(rawId);
    const side = z.enum(['front', 'back']).parse(rawSide);
    const db = createAdminClient();
    if (!db) throw new DomainError('SYSTEM_DEGRADED', undefined, {}, 503);
    const { data, error } = await db.from('identity_verification_requests').select('front_path,back_path').eq('id', id).maybeSingle();
    if (error || !data) throw new DomainError('INVALID_INPUT', undefined, {}, 404);
    const path = side === 'front' ? data.front_path : data.back_path;
    const image = await db.storage.from('identity-documents').download(path);
    if (image.error || !image.data) throw new DomainError('SYSTEM_DEGRADED', undefined, {}, 503);
    return new Response(image.data, { headers: { 'Content-Type': path.endsWith('.png') ? 'image/png' : 'image/jpeg', 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', 'Content-Disposition': 'inline' } });
  } catch (error) { return failure(error); }
}
