import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createAdminClient, createSessionClient } from '@/lib/supabase/server';
import { requireViewer, requirePermission } from '@/lib/auth';
import { assertOrigin, readJson, success, failure } from '@/lib/api';
import { DomainError, errorMessages, type ErrorCode } from '@/lib/errors';
import { rateLimit } from '@/lib/rate-limit';
import { normalizeSiteSettings } from '@/lib/site-settings';
import { projectToRedis, realtimeProvider } from '@/modules/realtime/provider';
import { masterFaqData } from '@/components/faq-view';

const uuid = z.uuid();
const minorStr = z
  .string()
  .regex(/^(0|[1-9]\d*)$/)
  .refine((v) => BigInt(v) <= 9007199254740991n);

function getDb() {
  const db = createAdminClient();
  if (!db) {
    throw new DomainError('SYSTEM_DEGRADED', 'قاعدة البيانات الإدارية غير مهيأة حالياً.', {}, 503);
  }
  return db;
}

async function enforceAdminMfa() {
  const client = await createSessionClient();
  if (!client) {
    throw new DomainError('SYSTEM_DEGRADED', undefined, {}, 503);
  }
  const { data, error } = await client.auth.mfa.getAuthenticatorAssuranceLevel();
  // Enforce 2FA verification whenever an MFA factor is enrolled on the administrator's account
  if (!error && data?.nextLevel === 'aal2' && data?.currentLevel !== 'aal2') {
    throw new DomainError(
      'FORBIDDEN',
      'يلزم تأكيد رمز التحقق بخطوتين (2FA) لتنفيذ إجراءات التعديل الإدارية.',
      { mfaRequired: true },
      403
    );
  }
}

function checkDbError(error: { message: string } | null) {
  if (!error) return;
  const code = error.message as ErrorCode;
  if (code in errorMessages) {
    throw new DomainError(code, undefined, {}, 409);
  }
  throw new DomainError('INVALID_INPUT', `تعذر تنفيذ العملية: ${error.message}`, {}, 400);
}

function revalidateStorefront() {
  try {
    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/plates');
    revalidatePath('/plates/search');
    revalidatePath('/auctions');
    revalidatePath('/about');
    revalidatePath('/how-it-works');
    revalidatePath('/faq');
    revalidatePath('/sell-your-plate');
    revalidatePath('/admin');
  } catch {
    // Ignore revalidation errors in non-Next test contexts
  }
}

async function broadcastAuctionUpdate(db: ReturnType<typeof getDb>, auctionId: string) {
  try {
    const { data: snap } = await db.rpc('fbs_snapshot', { p_auction_id: auctionId });
    if (snap) {
      await projectToRedis(snap).catch(() => {});
      await realtimeProvider().publish(auctionId, 'auction.updated', snap).catch(() => {});
    }
  } catch {
    // Non-fatal realtime projection
  }
}

export async function POST(request: Request) {
  try {
    assertOrigin(request);
    const raw = ((await readJson(request)) || {}) as Record<string, unknown>;
    const action = typeof raw.action === 'string' ? raw.action : '';
    if (!action) {
      throw new DomainError('INVALID_INPUT', 'نوع الإجراء الإداري غير محدد.');
    }

    const viewer = await requireViewer();
    await rateLimit('admin', `${viewer.id}:manage:${action}`);
    const db = getDb();

    switch (action) {
      case 'plate.save': {
        await requirePermission('plate.verify');
        await enforceAdminMfa();
        const v = z
          .object({
            plateId: uuid.nullable().optional(),
            slug: z.string().max(120).optional(),
            typeId: uuid,
            letter1Id: z.coerce.number().int().min(1).max(99),
            letter2Id: z.coerce.number().int().min(1).max(99),
            letter3Id: z.coerce.number().int().min(1).max(99),
            digits: z
              .string()
              .regex(/^[0-9]{1,4}$/)
              .refine((d) => !/^0+$/.test(d), 'أرقام اللوحة غير صالحة'),
            cityId: uuid.nullable().optional().or(z.literal('')),
            description: z.string().max(5000).default(''),
            saleMode: z.enum(['AUCTION', 'FIXED_PRICE', 'AUCTION_WITH_BUY_NOW']),
            askingPriceMinor: minorStr.or(z.literal('')).optional(),
            featured: z.boolean().default(false),
            verificationStatus: z
              .enum(['DRAFT', 'SUBMITTED', 'DOCUMENTS_PENDING', 'UNDER_REVIEW', 'CHANGES_REQUIRED', 'REJECTED', 'VERIFIED', 'APPROVED'])
              .default('APPROVED'),
            listingStatus: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'SOLD']).default('PUBLISHED'),
            ownerId: uuid.nullable().optional().or(z.literal('')),
            reason: z.string().min(3).max(1000),
          })
          .parse(raw);

        const { data, error } = await db.rpc('fbs_admin_upsert_plate', {
          p_actor_id: viewer.id,
          p_plate_id: v.plateId || null,
          p_payload: {
            slug: v.slug ?? '',
            typeId: v.typeId,
            letter1Id: v.letter1Id,
            letter2Id: v.letter2Id,
            letter3Id: v.letter3Id,
            digits: v.digits,
            cityId: v.cityId || '',
            description: v.description,
            saleMode: v.saleMode,
            askingPriceMinor: v.askingPriceMinor ?? '',
            featured: v.featured,
            verificationStatus: v.verificationStatus,
            listingStatus: v.listingStatus,
            ownerId: v.ownerId || '',
          },
          p_reason: v.reason,
        });
        checkDbError(error);
        revalidateStorefront();
        return success({ result: data, message: v.plateId ? 'تم تحديث بيانات اللوحة بنجاح.' : 'تمت إضافة اللوحة الجديدة بنجاح.' });
      }

      case 'plate.quick_toggle': {
        await requirePermission('plate.verify');
        await enforceAdminMfa();
        const v = z
          .object({
            plateId: uuid,
            featured: z.boolean().optional(),
            listingStatus: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'SOLD']).optional(),
            reason: z.string().min(3).max(1000).default('تحديث سريع من لوحة الإدارة'),
          })
          .parse(raw);

        const payload: Record<string, unknown> = {};
        if (typeof v.featured === 'boolean') payload.featured = v.featured;
        if (v.listingStatus) payload.listingStatus = v.listingStatus;

        const { data, error } = await db.rpc('fbs_admin_upsert_plate', {
          p_actor_id: viewer.id,
          p_plate_id: v.plateId,
          p_payload: payload,
          p_reason: v.reason,
        });
        checkDbError(error);
        revalidateStorefront();
        return success({ result: data, message: 'تم تحديث حالة اللوحة فوراً.' });
      }

      case 'plate.delete': {
        await requirePermission('plate.verify');
        await enforceAdminMfa();
        const v = z
          .object({
            plateId: uuid,
            archiveOnly: z.boolean().default(false),
            reason: z.string().min(3).max(1000),
          })
          .parse(raw);

        const { data, error } = await db.rpc('fbs_admin_delete_plate', {
          p_actor_id: viewer.id,
          p_plate_id: v.plateId,
          p_archive_only: v.archiveOnly,
          p_reason: v.reason,
        });
        checkDbError(error);
        revalidateStorefront();
        const mode = (data as { mode?: string } | null)?.mode;
        return success({
          result: data,
          message:
            mode === 'DELETED'
              ? 'تم حذف اللوحة نهائياً من قاعدة البيانات.'
              : 'تم إخفاء اللوحة وأرشفتها فوراً مع حفظ السجل الرقابي المرتبط بها.',
        });
      }

      case 'submission.review': {
        await requirePermission('plate.verify');
        await enforceAdminMfa();
        const v = z
          .object({
            plateId: uuid,
            status: z.enum(['UNDER_REVIEW', 'CHANGES_REQUIRED', 'REJECTED', 'APPROVED']),
            saleMode: z.enum(['AUCTION', 'FIXED_PRICE', 'AUCTION_WITH_BUY_NOW']).optional(),
            askingPriceMinor: minorStr.or(z.literal('')).optional(),
            featured: z.boolean().optional(),
            listingStatus: z.enum(['DRAFT', 'PUBLISHED']).optional(),
            reason: z.string().min(3).max(1000),
          })
          .parse(raw);

        const publishConfig: Record<string, unknown> = {};
        if (v.saleMode) publishConfig.saleMode = v.saleMode;
        if (v.askingPriceMinor !== undefined) publishConfig.askingPriceMinor = v.askingPriceMinor;
        if (typeof v.featured === 'boolean') publishConfig.featured = v.featured;
        if (v.listingStatus) publishConfig.listingStatus = v.listingStatus;

        const { data, error } = await db.rpc('fbs_admin_review_submission', {
          p_plate_id: v.plateId,
          p_actor_id: viewer.id,
          p_status: v.status,
          p_reason: v.reason,
          p_publish_config: publishConfig,
        });
        checkDbError(error);
        revalidateStorefront();
        return success({ result: data, message: 'تم حفظ قرار المراجعة وإشعار مالك اللوحة.' });
      }

      case 'document.signed_url': {
        await requirePermission('plate.verify');
        await enforceAdminMfa();
        const v = z.object({ documentId: uuid }).parse(raw);
        const { data, error } = await db
          .from('plate_documents')
          .select('object_path,mime_type,document_type')
          .eq('id', v.documentId)
          .single();
        checkDbError(error);
        if (!data) throw new DomainError('INVALID_INPUT', 'لم يتم العثور على المستند المطلوب.');
        const signed = await db.storage.from('ownership-documents').createSignedUrl(data.object_path, 120);
        checkDbError(signed.error);
        return success({ url: signed.data?.signedUrl, mimeType: data.mime_type, documentType: data.document_type });
      }

      case 'auction.save': {
        const v = z
          .object({
            auctionId: uuid.nullable().optional(),
            plateId: uuid.optional(),
            status: z
              .enum(['DRAFT', 'PENDING_APPROVAL', 'SCHEDULED', 'REGISTRATION_OPEN', 'WAITING_ROOM', 'LIVE', 'PAUSED'])
              .optional(),
            startingPrice: minorStr,
            reservePrice: minorStr.or(z.literal('')).default(''),
            minimumIncrement: minorStr,
            depositAmount: minorStr.default('0'),
            registrationStart: z.iso.datetime().optional().or(z.literal('')),
            registrationEnd: z.iso.datetime().optional().or(z.literal('')),
            startAt: z.iso.datetime(),
            endAt: z.iso.datetime(),
            antiSniping: z.boolean().default(true),
            windowSeconds: z.coerce.number().int().min(0).max(86400).default(300),
            extensionSeconds: z.coerce.number().int().min(0).max(86400).default(300),
            maxExtensions: z.coerce.number().int().min(0).max(10000).default(3),
            commissionType: z.enum(['NONE', 'FIXED', 'PERCENTAGE']).default('NONE'),
            commissionValue: minorStr.default('0'),
            requireKyc: z.boolean().default(true),
            reason: z.string().min(3).max(1000),
          })
          .parse(raw);

        await requirePermission(v.auctionId ? 'auction.edit' : 'auction.create');
        await enforceAdminMfa();
        if (!v.auctionId && !v.plateId) {
          throw new DomainError('INVALID_INPUT', 'يرجى اختيار اللوحة لإنشاء المزاد.');
        }

        const { data, error } = await db.rpc('fbs_admin_save_auction', {
          p_actor_id: viewer.id,
          p_auction_id: v.auctionId || null,
          p_config: v,
          p_reason: v.reason,
        });
        checkDbError(error);
        const savedId = (data as { id?: string } | null)?.id;
        if (savedId) {
          await broadcastAuctionUpdate(db, savedId);
        }
        revalidateStorefront();
        return success({ result: data, message: v.auctionId ? 'تم تحديث إعدادات وتوقيت المزاد بنجاح.' : 'تم إنشاء المزاد بنجاح.' });
      }

      case 'auction.control': {
        const v = z
          .object({
            auctionId: uuid,
            command: z.enum([
              'EXTEND_MINUTES',
              'SET_END_TIME',
              'GO_LIVE_NOW',
              'OPEN_REGISTRATION_NOW',
              'PAUSE',
              'RESUME',
              'FINALIZE_NOW',
              'CANCEL',
            ]),
            minutes: z.coerce.number().int().min(-10080).max(43200).optional(),
            endAt: z.iso.datetime().optional().or(z.literal('')),
            reason: z.string().min(3).max(1000),
          })
          .parse(raw);

        const permMap: Record<string, string> = {
          PAUSE: 'auction.pause',
          RESUME: 'auction.resume',
          CANCEL: 'auction.cancel',
        };
        await requirePermission(permMap[v.command] ?? 'auction.edit');
        await enforceAdminMfa();

        const { data, error } = await db.rpc('fbs_admin_auction_control', {
          p_auction_id: v.auctionId,
          p_actor_id: viewer.id,
          p_command: v.command,
          p_minutes: v.minutes ?? 15,
          p_end_at: v.endAt ? v.endAt : null,
          p_reason: v.reason,
        });
        checkDbError(error);
        await broadcastAuctionUpdate(db, v.auctionId);
        revalidateStorefront();
        return success({ result: data, message: 'تم تنفيذ أمر التحكم بالمزاد وتحديث التوقيت مباشرة.' });
      }

      case 'registration.status': {
        await requirePermission('auction.edit');
        await enforceAdminMfa();
        const v = z
          .object({
            registrationId: uuid,
            status: z.enum(['QUALIFIED', 'PENDING', 'PAYMENT_PENDING', 'SUSPENDED', 'REJECTED']),
            reason: z.string().min(3).max(1000),
          })
          .parse(raw);

        const { data: before, error: fetchErr } = await db
          .from('auction_registrations')
          .select('*')
          .eq('id', v.registrationId)
          .single();
        checkDbError(fetchErr);
        if (!before) throw new DomainError('INVALID_INPUT');

        const { error } = await db
          .from('auction_registrations')
          .update({
            status: v.status,
            qualified_at: v.status === 'QUALIFIED' ? new Date().toISOString() : before.qualified_at,
          })
          .eq('id', v.registrationId);
        checkDbError(error);

        await db.from('audit_logs').insert({
          actor_id: viewer.id,
          action: 'registration.status',
          entity_type: 'auction_registration',
          entity_id: v.registrationId,
          reason: v.reason,
          before_data: { status: before.status },
          after_data: { status: v.status },
        });
        await db.from('notifications').insert({
          user_id: before.user_id,
          type: 'auction.registration',
          title: v.status === 'QUALIFIED' ? 'تم تأهيلك للمزايدة' : 'تحديث حالة تسجيلك في المزاد',
          body: v.reason,
          href: '/account/auctions',
        });

        return success({ message: 'تم تحديث أهلية المزايد بنجاح.' });
      }

      case 'settlement.status': {
        await requirePermission('settlement.manage');
        await enforceAdminMfa();
        const v = z
          .object({
            settlementId: uuid,
            status: z.enum([
              'WINNER_CONFIRMED',
              'PARTIES_CONTACTED',
              'TRANSFER_IN_PROGRESS',
              'TRANSFER_CONFIRMED',
              'COMPLETED',
              'DISPUTED',
              'CANCELLED',
            ]),
            reason: z.string().min(3).max(1000),
          })
          .parse(raw);

        const { data: before, error: fetchErr } = await db
          .from('settlements')
          .select('*, auctions(plate_id)')
          .eq('id', v.settlementId)
          .single();
        checkDbError(fetchErr);
        if (!before) throw new DomainError('INVALID_INPUT');

        const { error } = await db
          .from('settlements')
          .update({ status: v.status, updated_at: new Date().toISOString() })
          .eq('id', v.settlementId);
        checkDbError(error);

        if (v.status === 'COMPLETED') {
          await db.from('auctions').update({ status: 'COMPLETED', updated_at: new Date().toISOString() }).eq('id', before.auction_id);
          const plateId = (before.auctions as { plate_id?: string } | null)?.plate_id;
          if (plateId) {
            await db.from('plates').update({ listing_status: 'SOLD', updated_at: new Date().toISOString() }).eq('id', plateId);
          }
        }

        await db.from('audit_logs').insert({
          actor_id: viewer.id,
          action: 'settlement.update',
          entity_type: 'settlement',
          entity_id: v.settlementId,
          reason: v.reason,
          before_data: { status: before.status },
          after_data: { status: v.status },
        });
        revalidateStorefront();
        return success({ message: 'تم تحديث مرحلة التسوية ونقل الملكية بنجاح.' });
      }

      case 'user.status': {
        await requirePermission('user.view');
        await enforceAdminMfa();
        const v = z
          .object({
            userId: uuid,
            status: z.enum(['ACTIVE', 'SUSPENDED', 'CLOSED']).optional(),
            kycStatus: z.enum(['NOT_STARTED', 'PENDING', 'VERIFIED', 'REJECTED']).optional(),
            reason: z.string().min(3).max(1000),
          })
          .parse(raw);

        if (v.userId === viewer.id && v.status && v.status !== 'ACTIVE') {
          throw new DomainError('FORBIDDEN', 'لا يمكنك إيقاف حسابك الإداري الحالي.', {}, 403);
        }

        const { data: before } = await db.from('profiles').select('status,kyc_status').eq('id', v.userId).single();
        const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
        if (v.status) patch.status = v.status;
        if (v.kycStatus) patch.kyc_status = v.kycStatus;

        const { error } = await db.from('profiles').update(patch).eq('id', v.userId);
        checkDbError(error);

        await db.from('audit_logs').insert({
          actor_id: viewer.id,
          action: 'user.admin_update',
          entity_type: 'profile',
          entity_id: v.userId,
          reason: v.reason,
          before_data: before ?? {},
          after_data: patch,
        });
        revalidatePath('/admin');
        return success({ message: 'تم تحديث حالة المستخدم بنجاح.' });
      }

      case 'user.role': {
        await requirePermission('settings.manage');
        await enforceAdminMfa();
        const v = z
          .object({
            userId: uuid,
            roleCode: z.enum([
              'super_admin',
              'auction_manager',
              'finance_admin',
              'content_admin',
              'support_admin',
              'seller',
              'bidder',
              'user',
            ]),
            grant: z.boolean(),
            reason: z.string().min(3).max(1000),
          })
          .parse(raw);

        if (!v.grant && v.userId === viewer.id && v.roleCode === 'super_admin') {
          throw new DomainError('FORBIDDEN', 'لا يمكنك سحب صلاحية المدير الأعلى من حسابك الشخصي.', {}, 403);
        }

        if (v.grant) {
          const { error } = await db.from('user_roles').upsert(
            { user_id: v.userId, role_code: v.roleCode, assigned_by: viewer.id },
            { onConflict: 'user_id,role_code' }
          );
          checkDbError(error);
        } else {
          const { error } = await db
            .from('user_roles')
            .delete()
            .eq('user_id', v.userId)
            .eq('role_code', v.roleCode);
          checkDbError(error);
        }

        await db.from('audit_logs').insert({
          actor_id: viewer.id,
          action: v.grant ? 'user.role_grant' : 'user.role_revoke',
          entity_type: 'profile',
          entity_id: v.userId,
          reason: v.reason,
          after_data: { roleCode: v.roleCode, grant: v.grant },
        });
        revalidatePath('/admin');
        return success({ message: v.grant ? 'تم منح الصلاحية للمستخدم.' : 'تم سحب الصلاحية من المستخدم.' });
      }

      case 'notification.send': {
        await requirePermission('admin.view');
        await enforceAdminMfa();
        const v = z
          .object({
            userId: uuid.optional().or(z.literal('ALL')),
            title: z.string().min(2).max(160),
            body: z.string().min(3).max(2000),
            href: z.string().max(240).optional().default('/account'),
            reason: z.string().min(3).max(1000),
          })
          .parse(raw);

        if (v.userId === 'ALL' || !v.userId) {
          const { data: users, error: usersErr } = await db
            .from('profiles')
            .select('id')
            .eq('status', 'ACTIVE')
            .limit(500);
          checkDbError(usersErr);
          if (users && users.length > 0) {
            const rows = users.map((u) => ({
              user_id: u.id,
              type: 'admin.broadcast',
              title: v.title,
              body: v.body,
              href: v.href || null,
            }));
            const { error } = await db.from('notifications').insert(rows);
            checkDbError(error);
          }
        } else {
          const { error } = await db.from('notifications').insert({
            user_id: v.userId,
            type: 'admin.direct',
            title: v.title,
            body: v.body,
            href: v.href || null,
          });
          checkDbError(error);
        }

        await db.from('audit_logs').insert({
          actor_id: viewer.id,
          action: 'notification.send',
          entity_type: 'notification',
          reason: v.reason,
          after_data: { target: v.userId ?? 'ALL', title: v.title },
        });
        revalidatePath('/admin');
        return success({ message: 'تم إرسال الإشعار بنجاح.' });
      }

      case 'cms.save': {
        await requirePermission('cms.manage');
        await enforceAdminMfa();
        const v = z
          .object({
            slug: z.string().regex(/^[a-z0-9-]+$/).min(2).max(80),
            title_ar: z.string().min(2).max(200),
            body_ar: z.string().min(3).max(30000),
            published: z.boolean(),
            reason: z.string().min(3).max(1000),
          })
          .parse(raw);

        const { data, error } = await db.rpc('fbs_save_cms', {
          p_actor_id: viewer.id,
          p_slug: v.slug,
          p_title: v.title_ar,
          p_body: v.body_ar,
          p_published: v.published,
          p_reason: v.reason,
        });
        checkDbError(error);
        revalidateStorefront();
        revalidatePath(`/${v.slug}`);
        return success({ result: data, message: 'تم حفظ ونشر محتوى الصفحة بنجاح.' });
      }

      case 'faq.save': {
        await requirePermission('cms.manage');
        await enforceAdminMfa();
        const v = z
          .object({
            id: uuid.nullable().optional(),
            question_ar: z.string().min(3).max(500),
            answer_ar: z.string().min(3).max(5000),
            question_en: z.string().max(500).optional().default(''),
            sort_order: z.coerce.number().int().min(0).max(9999).default(0),
            published: z.boolean().default(true),
            reason: z.string().min(3).max(1000).default('تحديث الأسئلة الشائعة'),
          })
          .parse(raw);

        // Store category tag inside question_en if provided (e.g. category label)
        if (v.id) {
          const { error } = await db
            .from('faqs')
            .update({
              question_ar: v.question_ar,
              answer_ar: v.answer_ar,
              question_en: v.question_en || null,
              sort_order: v.sort_order,
              published: v.published,
            })
            .eq('id', v.id);
          checkDbError(error);
        } else {
          const { error } = await db.from('faqs').insert({
            question_ar: v.question_ar,
            answer_ar: v.answer_ar,
            question_en: v.question_en || null,
            sort_order: v.sort_order,
            published: v.published,
          });
          checkDbError(error);
        }

        await db.from('audit_logs').insert({
          actor_id: viewer.id,
          action: v.id ? 'faq.update' : 'faq.create',
          entity_type: 'faq',
          entity_id: v.id ?? null,
          reason: v.reason,
          after_data: { question_ar: v.question_ar, published: v.published },
        });
        revalidateStorefront();
        return success({ message: 'تم حفظ السؤال الشائع بنجاح.' });
      }

      case 'faq.delete': {
        await requirePermission('cms.manage');
        await enforceAdminMfa();
        const v = z.object({ id: uuid, reason: z.string().min(3).max(1000).default('حذف سؤال شائع') }).parse(raw);
        const { error } = await db.from('faqs').delete().eq('id', v.id);
        checkDbError(error);
        await db.from('audit_logs').insert({
          actor_id: viewer.id,
          action: 'faq.delete',
          entity_type: 'faq',
          entity_id: v.id,
          reason: v.reason,
        });
        revalidateStorefront();
        return success({ message: 'تم حذف السؤال الشائع.' });
      }

      case 'faq.seed_defaults': {
        await requirePermission('cms.manage');
        await enforceAdminMfa();
        const { count } = await db.from('faqs').select('*', { count: 'exact', head: true });
        if ((count ?? 0) === 0) {
          const rows = masterFaqData.map((item, idx) => ({
            question_ar: item.q,
            answer_ar: item.a,
            question_en: `${item.catId}|${item.category}|${item.badge}`,
            sort_order: idx + 1,
            published: true,
          }));
          const { error } = await db.from('faqs').insert(rows);
          checkDbError(error);
        }
        await db.from('audit_logs').insert({
          actor_id: viewer.id,
          action: 'faq.seed_defaults',
          entity_type: 'faq',
          reason: 'استيراد الأسئلة الشائعة الافتراضية للتحكم بها من لوحة الإدارة',
        });
        revalidateStorefront();
        return success({ message: 'تم استيراد الأسئلة الشائعة الافتراضية ويمكنك الآن تعديلها أو حذفها.' });
      }

      case 'reference.city_save': {
        await requirePermission('settings.manage');
        await enforceAdminMfa();
        const v = z
          .object({
            cityId: uuid.nullable().optional(),
            name_ar: z.string().min(2).max(100),
            name_en: z.string().min(2).max(100).default('Saudi City'),
            regionId: uuid.optional(),
            active: z.boolean().default(true),
            reason: z.string().min(3).max(1000).default('تحديث قائمة المدن'),
          })
          .parse(raw);

        if (v.cityId) {
          const { error } = await db
            .from('cities')
            .update({ name_ar: v.name_ar, name_en: v.name_en, active: v.active })
            .eq('id', v.cityId);
          checkDbError(error);
        } else {
          let regionId = v.regionId;
          if (!regionId) {
            const { data: r } = await db.from('regions').select('id').limit(1).single();
            regionId = r?.id;
          }
          if (!regionId) throw new DomainError('INVALID_INPUT', 'لا توجد منطقة جغرافية مسجلة.');
          const { error } = await db.from('cities').insert({
            region_id: regionId,
            name_ar: v.name_ar,
            name_en: v.name_en,
            active: v.active,
          });
          checkDbError(error);
        }

        await db.from('audit_logs').insert({
          actor_id: viewer.id,
          action: 'reference.city_save',
          entity_type: 'city',
          reason: v.reason,
          after_data: { name_ar: v.name_ar, active: v.active },
        });
        revalidateStorefront();
        return success({ message: 'تم حفظ بيانات المدينة بنجاح.' });
      }

      case 'reference.type_toggle': {
        await requirePermission('settings.manage');
        await enforceAdminMfa();
        const v = z
          .object({
            typeId: uuid,
            active: z.boolean(),
            name_ar: z.string().min(2).max(80).optional(),
            reason: z.string().min(3).max(1000).default('تحديث فئات اللوحات'),
          })
          .parse(raw);

        const patch: Record<string, unknown> = { active: v.active };
        if (v.name_ar) patch.name_ar = v.name_ar;
        const { error } = await db.from('plate_types').update(patch).eq('id', v.typeId);
        checkDbError(error);
        await db.from('audit_logs').insert({
          actor_id: viewer.id,
          action: 'reference.type_toggle',
          entity_type: 'plate_type',
          entity_id: v.typeId,
          reason: v.reason,
          after_data: patch,
        });
        revalidateStorefront();
        return success({ message: 'تم تحديث فئة اللوحة بنجاح.' });
      }

      case 'settings.save': {
        await requirePermission('settings.manage');
        await enforceAdminMfa();
        const v = z
          .object({
            settings: z.record(z.string(), z.unknown()),
            reason: z.string().min(3).max(1000),
          })
          .parse(raw);

        const normalized = normalizeSiteSettings(v.settings);
        const { error } = await db.from('system_settings').upsert(
          {
            key: 'site_config',
            value: normalized as unknown as Record<string, unknown>,
            description: 'إعدادات الهوية والتواصل والموقع العامة',
            updated_by: viewer.id,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'key' }
        );
        checkDbError(error);

        await db.from('audit_logs').insert({
          actor_id: viewer.id,
          action: 'settings.update',
          entity_type: 'system_settings',
          reason: v.reason,
          after_data: normalized as unknown as Record<string, unknown>,
        });
        revalidateStorefront();
        return success({ settings: normalized, message: 'تم حفظ إعدادات الموقع وتطبيقها على كافة الصفحات فوراً.' });
      }

      case 'feature_flag.toggle': {
        await requirePermission('settings.manage');
        await enforceAdminMfa();
        const v = z
          .object({
            key: z.string().regex(/^[a-z0-9_]+$/).min(2).max(80),
            enabled: z.boolean(),
            description: z.string().max(300).optional(),
            reason: z.string().min(3).max(1000).default('تحديث مفاتيح تشغيل الميزات'),
          })
          .parse(raw);

        const { data: existing } = await db.from('feature_flags').select('description').eq('key', v.key).maybeSingle();
        const { error } = await db.from('feature_flags').upsert(
          {
            key: v.key,
            enabled: v.enabled,
            description: v.description || existing?.description || v.key,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'key' }
        );
        checkDbError(error);

        await db.from('audit_logs').insert({
          actor_id: viewer.id,
          action: 'feature_flag.toggle',
          entity_type: 'feature_flag',
          reason: v.reason,
          after_data: { key: v.key, enabled: v.enabled },
        });
        revalidateStorefront();
        return success({ message: v.enabled ? 'تم تفعيل الميزة بنجاح.' : 'تم إيقاف الميزة بنجاح.' });
      }

      case 'message.status': {
        await requirePermission('admin.view');
        await enforceAdminMfa();
        const v = z
          .object({
            messageId: uuid,
            status: z.enum(['NEW', 'IN_PROGRESS', 'RESOLVED', 'ARCHIVED']),
            reason: z.string().min(3).max(1000).default('تحديث حالة رسالة تواصل'),
          })
          .parse(raw);

        const { error } = await db.from('contact_messages').update({ status: v.status }).eq('id', v.messageId);
        checkDbError(error);
        await db.from('audit_logs').insert({
          actor_id: viewer.id,
          action: 'contact_message.status',
          entity_type: 'contact_message',
          entity_id: v.messageId,
          reason: v.reason,
          after_data: { status: v.status },
        });
        revalidatePath('/admin');
        return success({ message: 'تم تحديث حالة الرسالة بنجاح.' });
      }

      default:
        throw new DomainError('INVALID_INPUT', `الإجراء الإداري غير معروف: ${action}`);
    }
  } catch (e) {
    return failure(e);
  }
}
