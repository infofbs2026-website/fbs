'use client';

import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  KeyRound,
  Lock,
  Mail,
  Send,
  ShieldCheck,
  Trash2,
  UserCog,
  UserPlus,
  X,
} from 'lucide-react';
import { IdentityReview } from '@/components/identity-review';
import { SarPrice } from '@/components/sar-symbol';
import styles from '../admin-dashboard.module.css';
import {
  KYC_LABELS,
  MESSAGE_STATUS_LABELS,
  ROLE_LABELS,
  callAdminManage,
  formatAdminDate,
} from '../helpers';
import type { AdminDashboardData, AdminSectionKey, AdminUserRecord } from '../types';

interface PeopleOpsProps {
  section: Extract<AdminSectionKey, 'identities' | 'users' | 'registrations' | 'messages' | 'notifications'>;
  data: AdminDashboardData;
  onNotify: (msg: string, kind?: 'success' | 'error') => void;
  onRequireMfa: () => void;
  onRefresh: () => void;
}

const ALL_ROLES = [
  'super_admin',
  'auction_manager',
  'finance_admin',
  'content_admin',
  'support_admin',
  'seller',
  'bidder',
] as const;

const ADMIN_ROLE_CODES = new Set([
  'super_admin',
  'auction_manager',
  'finance_admin',
  'content_admin',
  'support_admin',
]);

const ROLE_DESCRIPTIONS: Record<string, { title: string; subtitle: string; category: 'admin' | 'member' }> = {
  super_admin: {
    title: 'المدير التنفيذي الأعلى (Full Admin)',
    subtitle: 'صلاحيات كاملة لإدارة المنصة، المزادات، الأعضاء، المالية، والإعدادات.',
    category: 'admin',
  },
  auction_manager: {
    title: 'مشرف المزادات واللوحات (تحت الأدمن)',
    subtitle: 'إدارة اللوحات، المزادات الحية، التحكم بالوقت، وتأهيل المسجلين.',
    category: 'admin',
  },
  finance_admin: {
    title: 'مشرف المالية والتسويات (تحت الأدمن)',
    subtitle: 'إدارة التسويات والضمان، التأمينات البنكية، المدفوعات، وتقارير الترسية.',
    category: 'admin',
  },
  content_admin: {
    title: 'مشرف المحتوى والصفحات (تحت الأدمن)',
    subtitle: 'تحرير صفحات الموقع، اللوائح القانونية، الأسئلة الشائعة، والمدن.',
    category: 'admin',
  },
  support_admin: {
    title: 'مشرف الدعم وتوثيق الهويات (تحت الأدمن)',
    subtitle: 'مراجعة واعتماد الهويات الوطنية (KYC)، رسائل التواصل، وإرسال الإشعارات.',
    category: 'admin',
  },
  seller: {
    title: 'بائع لوحات معتمد',
    subtitle: 'إمكانية إدراج اللوحات وعرضها للبيع أو بالمزاد في المنصة.',
    category: 'member',
  },
  bidder: {
    title: 'مزايد مؤهل',
    subtitle: 'إمكانية التسجيل والمزايدة المباشرة في صالات المزاد.',
    category: 'member',
  },
  user: {
    title: 'عضو عادي',
    subtitle: 'حساب عضو قياسي لتصفح اللوحات ومتابعة المزادات وتقديم طلبات الشراء.',
    category: 'member',
  },
};

export function PeopleOpsSection({
  section,
  data,
  onNotify,
  onRequireMfa,
  onRefresh,
}: PeopleOpsProps) {
  const [query, setQuery] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'admins' | 'active' | 'suspended'>('all');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);
  const [userReason, setUserReason] = useState('تحديث صلاحيات وحالة المستخدم من الإدارة التنفيذية');

  // Create User / Admin Modal State
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [newUserForm, setNewUserForm] = useState<{
    displayName: string;
    email: string;
    phone: string;
    password: string;
    roleCode: 'user' | 'bidder' | 'seller' | 'support_admin' | 'content_admin' | 'finance_admin' | 'auction_manager' | 'super_admin';
    additionalRoles: string[];
    kycVerified: boolean;
    mfaVerified: boolean;
  }>({
    displayName: '',
    email: '',
    phone: '',
    password: '',
    roleCode: 'user',
    additionalRoles: [],
    kycVerified: true,
    mfaVerified: true,
  });

  // Delete User Confirmation Modal State
  const [deletingUser, setDeletingUser] = useState<AdminUserRecord | null>(null);
  const [deleteReason, setDeleteReason] = useState('حذف الحساب بقرار إداري من لوحة التحكم');

  // Notification Sender State
  const [notifTarget, setNotifTarget] = useState<string>('ALL');
  const [notifTitle, setNotifTitle] = useState('');
  const [notifBody, setNotifBody] = useState('');
  const [notifHref, setNotifHref] = useState('/auctions');
  const [sendingNotif, setSendingNotif] = useState(false);

  const userCounts = useMemo(() => {
    const admins = data.users.filter((u) => u.roles.some((r) => ADMIN_ROLE_CODES.has(r))).length;
    const active = data.users.filter((u) => u.status === 'ACTIVE').length;
    const suspended = data.users.filter((u) => u.status !== 'ACTIVE').length;
    return { all: data.users.length, admins, active, suspended };
  }, [data.users]);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.users.filter((u) => {
      if (userFilter === 'admins' && !u.roles.some((r) => ADMIN_ROLE_CODES.has(r))) return false;
      if (userFilter === 'active' && u.status !== 'ACTIVE') return false;
      if (userFilter === 'suspended' && u.status === 'ACTIVE') return false;
      if (!q) return true;
      return [u.display_name, u.phone ?? '', u.id, u.roles.map((r) => ROLE_LABELS[r] || r).join(' '), u.roles.join(' ')]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [data.users, query, userFilter]);

  async function updateUserStatus(
    userId: string,
    patch: { status?: 'ACTIVE' | 'SUSPENDED' | 'CLOSED'; kycStatus?: 'NOT_STARTED' | 'PENDING' | 'VERIFIED' | 'REJECTED' },
  ) {
    setBusyId(userId);
    const res = await callAdminManage({
      action: 'user.status',
      userId,
      ...patch,
      reason: userReason.trim() || 'تحديث حالة المستخدم',
    });
    setBusyId(null);
    if (!res.ok) {
      if (res.mfaRequired) onRequireMfa();
      onNotify(res.error || 'تعذر تحديث حالة المستخدم.', 'error');
      return;
    }
    onNotify(res.message || 'تم التحديث.');
    setSelectedUser((prev) =>
      prev && prev.id === userId
        ? {
            ...prev,
            status: patch.status ?? prev.status,
            kyc_status: patch.kycStatus ?? prev.kyc_status,
          }
        : prev,
    );
    onRefresh();
  }

  async function createNewUser() {
    if (newUserForm.displayName.trim().length < 2) {
      onNotify('يرجى إدخال اسم المستخدم أو المشرف (حرفين على الأقل).', 'error');
      return;
    }
    if (!newUserForm.email.trim().includes('@')) {
      onNotify('يرجى إدخال بريد إلكتروني صحيح.', 'error');
      return;
    }
    if (newUserForm.password.length < 8) {
      onNotify('يجب أن تتكون كلمة المرور من 8 خانات على الأقل.', 'error');
      return;
    }

    setCreatingUser(true);
    const res = await callAdminManage({
      action: 'user.create',
      displayName: newUserForm.displayName.trim(),
      email: newUserForm.email.trim(),
      phone: newUserForm.phone.trim(),
      password: newUserForm.password,
      roleCode: newUserForm.roleCode,
      additionalRoles: newUserForm.additionalRoles,
      kycStatus: newUserForm.kycVerified ? 'VERIFIED' : 'NOT_STARTED',
      mfaVerified: newUserForm.mfaVerified,
      reason: `إضافة حساب جديد (${ROLE_LABELS[newUserForm.roleCode] || newUserForm.roleCode}) من لوحة الإدارة`,
    });
    setCreatingUser(false);

    if (!res.ok) {
      if (res.mfaRequired) onRequireMfa();
      onNotify(res.error || 'تعذر إنشاء الحساب الجديد.', 'error');
      return;
    }

    onNotify(res.message || 'تم إنشاء حساب المستخدم وتعيين صلاحياته بنجاح.');
    setCreateUserOpen(false);
    setNewUserForm({
      displayName: '',
      email: '',
      phone: '',
      password: '',
      roleCode: 'user',
      additionalRoles: [],
      kycVerified: true,
      mfaVerified: true,
    });
    onRefresh();
  }

  async function toggleUserMfa(user: AdminUserRecord) {
    const nextEnabled = !user.mfa_enabled;
    setBusyId(`mfa:${user.id}`);
    const res = await callAdminManage({
      action: 'user.mfa',
      userId: user.id,
      enabled: nextEnabled,
      reason: userReason.trim() || `${nextEnabled ? 'تفعيل' : 'إيقاف'} التحقق بخطوتين (2FA) من لوحة الإدارة`,
    });
    setBusyId(null);
    if (!res.ok) {
      if (res.mfaRequired) onRequireMfa();
      onNotify(res.error || 'تعذر تحديث حالة التحقق بخطوتين (2FA).', 'error');
      return;
    }
    onNotify(res.message || 'تم تحديث حالة التحقق بخطوتين (2FA).');
    setSelectedUser((prev) =>
      prev && prev.id === user.id ? { ...prev, mfa_enabled: nextEnabled } : prev,
    );
    onRefresh();
  }

  async function confirmDeleteUser() {
    if (!deletingUser) return;
    setBusyId(deletingUser.id);
    const res = await callAdminManage({
      action: 'user.delete',
      userId: deletingUser.id,
      reason: deleteReason.trim() || 'حذف الحساب بقرار إداري',
    });
    setBusyId(null);
    if (!res.ok) {
      if (res.mfaRequired) onRequireMfa();
      onNotify(res.error || 'تعذر حذف المستخدم.', 'error');
      return;
    }
    onNotify(res.message || 'تم حذف المستخدم نهائياً.');
    if (selectedUser?.id === deletingUser.id) {
      setSelectedUser(null);
    }
    setDeletingUser(null);
    onRefresh();
  }

  async function toggleUserRole(user: AdminUserRecord, roleCode: string) {
    const hasRole = user.roles.includes(roleCode);
    setBusyId(`${user.id}:${roleCode}`);
    const res = await callAdminManage({
      action: 'user.role',
      userId: user.id,
      roleCode,
      grant: !hasRole,
      reason: `${!hasRole ? 'منح' : 'سحب'} صلاحية (${roleCode}) من لوحة الإدارة`,
    });
    setBusyId(null);
    if (!res.ok) {
      if (res.mfaRequired) onRequireMfa();
      onNotify(res.error || 'تعذر تعديل الدور.', 'error');
      return;
    }
    onNotify(res.message || 'تم تحديث الصلاحيات.');
    setSelectedUser((prev) =>
      prev && prev.id === user.id
        ? {
            ...prev,
            roles: !hasRole ? [...prev.roles, roleCode] : prev.roles.filter((r) => r !== roleCode),
          }
        : prev,
    );
    onRefresh();
  }

  async function updateRegStatus(regId: string, status: 'QUALIFIED' | 'REJECTED' | 'SUSPENDED') {
    setBusyId(regId);
    const res = await callAdminManage({
      action: 'registration.status',
      registrationId: regId,
      status,
      reason: `تحديث حالة التسجيل إلى (${status}) من قسم التسجيلات`,
    });
    setBusyId(null);
    if (!res.ok) {
      if (res.mfaRequired) onRequireMfa();
      onNotify(res.error || 'تعذر تحديث التسجيل.', 'error');
      return;
    }
    onNotify(res.message || 'تم تحديث التسجيل.');
    onRefresh();
  }

  async function updateMessageStatus(messageId: string, status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'ARCHIVED') {
    setBusyId(messageId);
    const res = await callAdminManage({
      action: 'message.status',
      messageId,
      status,
      reason: `تحديث حالة الرسالة إلى ${status}`,
    });
    setBusyId(null);
    if (!res.ok) {
      if (res.mfaRequired) onRequireMfa();
      onNotify(res.error || 'تعذر تحديث الرسالة.', 'error');
      return;
    }
    onNotify(res.message || 'تم تحديث حالة الرسالة.');
    onRefresh();
  }

  async function sendNotification() {
    if (notifTitle.trim().length < 2 || notifBody.trim().length < 3) {
      onNotify('يرجى كتابة عنوان الإشعار ونصه.', 'error');
      return;
    }
    setSendingNotif(true);
    const res = await callAdminManage({
      action: 'notification.send',
      userId: notifTarget,
      title: notifTitle.trim(),
      body: notifBody.trim(),
      href: notifHref.trim() || '/account',
      reason: 'إرسال إشعار رسمي من لوحة الإدارة',
    });
    setSendingNotif(false);
    if (!res.ok) {
      if (res.mfaRequired) onRequireMfa();
      onNotify(res.error || 'تعذر إرسال الإشعار.', 'error');
      return;
    }
    setNotifTitle('');
    setNotifBody('');
    onNotify(res.message || 'تم إرسال الإشعار بنجاح.');
    onRefresh();
  }

  /* 1. IDENTITIES (KYC) */
  if (section === 'identities') {
    if (!data.viewer.mfaVerified) {
      return (
        <section className={styles.panel}>
          <div className={styles.emptyBox}>
            <Lock size={30} className="mx-auto mb-2 text-amber-400" />
            <h3 className="text-base font-black m-0">صور الهوية الوطنية محمية بالتحقق الثنائي (2FA)</h3>
            <p className="text-xs mt-1 max-w-md mx-auto">
              لأغراض الامتثال الأمني، يلزم تفعيل جلسة التحقق بخطوتين لعرض ومراجعة صور الهوية الوطنية الخاصة بالمشتركين.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4">
              <button
                type="button"
                disabled={busyId === 'self-mfa'}
                className={styles.btnPrimary}
                onClick={async () => {
                  setBusyId('self-mfa');
                  const res = await callAdminManage({
                    action: 'user.mfa',
                    userId: data.viewer.id,
                    enabled: true,
                    reason: 'تفعيل التحقق بخطوتين لحساب الإدارة لفتح قسم توثيق الهويات',
                  });
                  setBusyId(null);
                  if (res.ok) {
                    onNotify(res.message || 'تم تفعيل التحقق بخطوتين (2FA) وفتح قسم الهويات.');
                    onRefresh();
                  } else {
                    onRequireMfa();
                  }
                }}
              >
                <KeyRound size={15} />
                <span>{busyId === 'self-mfa' ? 'جارٍ التفعيل…' : 'تفعيل التحقق بخطوتين فوراً وفتح الهويات'}</span>
              </button>
              <button type="button" className={styles.btnSecondary} onClick={onRequireMfa}>
                <span>ربط تطبيق مصادقة (QR Code)</span>
              </button>
            </div>
          </div>
        </section>
      );
    }

    return (
      <div className="space-y-4">
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>طلبات توثيق الهوية الوطنية (KYC)</h2>
              <p className={styles.panelDesc}>مراجعة بيانات الهوية والوجهين الأمامي والخلفي لاعتماد المزايدين والبائعين.</p>
            </div>
          </div>

          {data.identities.length === 0 ? (
            <div className={styles.emptyBox}>لا توجد طلبات هوية مرسلة حالياً.</div>
          ) : (
            <div className="space-y-4">
              {data.identities.map((req) => (
                <IdentityReview key={req.id} request={req} />
              ))}
            </div>
          )}
        </section>
      </div>
    );
  }

  /* 2. USERS & RBAC ROLES */
  if (section === 'users') {
    return (
      <div className="space-y-4">
        <div className={styles.toolbar}>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setUserFilter('all')}
              className={`${styles.filterPill} ${userFilter === 'all' ? styles.filterPillActive : ''}`}
            >
              <span>الكل</span>
              <span dir="ltr" className="tabular-nums opacity-75">
                ({userCounts.all})
              </span>
            </button>
            <button
              type="button"
              onClick={() => setUserFilter('admins')}
              className={`${styles.filterPill} ${userFilter === 'admins' ? styles.filterPillActive : ''}`}
            >
              <span>الإدارة والمشرفون</span>
              <span dir="ltr" className="tabular-nums opacity-75">
                ({userCounts.admins})
              </span>
            </button>
            <button
              type="button"
              onClick={() => setUserFilter('active')}
              className={`${styles.filterPill} ${userFilter === 'active' ? styles.filterPillActive : ''}`}
            >
              <span>الأعضاء النشطون</span>
              <span dir="ltr" className="tabular-nums opacity-75">
                ({userCounts.active})
              </span>
            </button>
            <button
              type="button"
              onClick={() => setUserFilter('suspended')}
              className={`${styles.filterPill} ${userFilter === 'suspended' ? styles.filterPillActive : ''}`}
            >
              <span>الموقوفون مؤقتاً</span>
              <span dir="ltr" className="tabular-nums opacity-75">
                ({userCounts.suspended})
              </span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className={styles.searchBox}>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث بالاسم أو الجوال أو الدور…"
                className={styles.searchInput}
              />
            </div>

            <button
              type="button"
              onClick={() => setCreateUserOpen(true)}
              className={styles.btnPrimary}
            >
              <UserPlus size={15} />
              <span>+ إضافة مستخدم أو مشرف</span>
            </button>
          </div>
        </div>

        <section className={styles.panel}>
          {filteredUsers.length === 0 ? (
            <div className={styles.emptyBox}>لا توجد حسابات مطابقة للبحث أو الفلتر المحدد.</div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>العضو</th>
                    <th>الجوال</th>
                    <th>حالة الحساب</th>
                    <th>توثيق الهوية</th>
                    <th>الدور والصلاحيات</th>
                    <th>النشاط</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => {
                    const kyc = KYC_LABELS[u.kyc_status] ?? { label: u.kyc_status, tone: 'slate' as const };
                    const isActive = u.status === 'ACTIVE';
                    const isSelf = u.id === data.viewer.id;
                    const visibleRoles = u.roles.filter((r) => r !== 'user');
                    const initial = (u.display_name || 'ع').trim().charAt(0).toUpperCase();

                    return (
                      <tr key={u.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <span
                              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--adm-border)] bg-[var(--adm-surface-soft)] text-xs font-black text-[var(--adm-gold)]"
                              aria-hidden="true"
                            >
                              {initial}
                            </span>
                            <div className="min-w-0 text-right">
                              <div className="font-black text-[13px] flex items-center gap-1.5">
                                <span className="truncate">{u.display_name || 'عضو مسجل'}</span>
                                {isSelf && (
                                  <span className={`${styles.badge} ${styles.tone_gold} !min-h-[20px] !px-2 !text-[10px]`}>
                                    أنت
                                  </span>
                                )}
                              </div>
                              <div className="text-[10.5px] opacity-55 text-right">
                                <span dir="ltr" className="font-mono tabular-nums">
                                  #{u.id.slice(0, 8)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span dir="ltr" className="font-mono text-xs tabular-nums">
                            {u.phone || '—'}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={isActive}
                            disabled={busyId === u.id || isSelf}
                            title={isSelf ? 'لا يمكن إيقاف حسابك الشخصي الحالي' : isActive ? 'انقر لإيقاف الحساب مؤقتاً' : 'انقر لتفعيل الحساب'}
                            onClick={() => updateUserStatus(u.id, { status: isActive ? 'SUSPENDED' : 'ACTIVE' })}
                            className={`${styles.engravedToggle} ${isActive ? styles.engravedToggleActive : ''}`}
                          >
                            <span className={styles.engravedToggleLabel}>
                              {isActive ? 'نشط' : 'موقوف مؤقتاً'}
                            </span>
                            <span className={styles.engravedToggleTrack} aria-hidden="true">
                              <span className={styles.engravedToggleThumb} />
                            </span>
                          </button>
                        </td>
                        <td>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={`${styles.badge} ${styles[`tone_${kyc.tone}`]}`}>{kyc.label}</span>
                            {u.mfa_enabled && (
                              <span className={`${styles.badge} ${styles.tone_emerald}`} title="التحقق بخطوتين مفعل لهذا الحساب">
                                2FA مفعل
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {visibleRoles.length === 0 ? (
                              <span className={`${styles.badge} ${styles.tone_slate}`}>عضو عام</span>
                            ) : (
                              visibleRoles.map((r) => {
                                const tone =
                                  r === 'super_admin'
                                    ? styles.tone_gold
                                    : ADMIN_ROLE_CODES.has(r)
                                      ? styles.tone_sky
                                      : styles.tone_emerald;
                                return (
                                  <span key={r} className={`${styles.badge} ${tone}`}>
                                    {ROLE_LABELS[r] || r}
                                  </span>
                                );
                              })
                            )}
                          </div>
                        </td>
                        <td className="text-xs whitespace-nowrap">
                          <span dir="ltr" className="font-black tabular-nums">
                            {u.plates_count}
                          </span>{' '}
                          لوحات •{' '}
                          <span dir="ltr" className="font-black tabular-nums">
                            {u.bids_count}
                          </span>{' '}
                          مزايدات
                        </td>
                        <td>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedUser(u)}
                              className={styles.btnSecondary}
                              title="إدارة الدور والصلاحيات وحالة الحساب"
                            >
                              <UserCog size={14} />
                              <span>إدارة الدور</span>
                            </button>
                            {!isSelf && (
                              <button
                                type="button"
                                onClick={() => setDeletingUser(u)}
                                className={`${styles.iconBtn} !text-rose-500 hover:!border-rose-500/40 hover:!bg-rose-500/10`}
                                title="حذف المستخدم"
                                aria-label="حذف المستخدم"
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Centered Wide User Roles & Status Studio Modal */}
        {selectedUser && (
          <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="إدارة العضو والصلاحيات">
            <div className={styles.drawer}>
              <div className={styles.drawerHeader}>
                <div>
                  <h3 className="text-base font-black m-0">
                    إدارة الحساب والصلاحيات — {selectedUser.display_name || 'عضو مسجل'}
                  </h3>
                  <p className="text-xs opacity-70 m-0 mt-0.5 text-right">
                    تحكم بحالة الحساب، توثيق الهوية، ومنح أو سحب صلاحيات الإدارة والمشرفين.
                  </p>
                </div>
                <button type="button" className={styles.iconBtn} onClick={() => setSelectedUser(null)} aria-label="إغلاق">
                  <X size={17} />
                </button>
              </div>

              <div className={styles.drawerBody}>
                {/* Status & KYC Row */}
                <div className={styles.formRow}>
                  <div className="rounded-2xl border border-[var(--adm-border)] bg-[var(--adm-surface-soft)] p-3.5 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-black">حالة الحساب في المنصة</div>
                      <div className="text-[11px] opacity-65 mt-0.5">
                        {selectedUser.status === 'ACTIVE'
                          ? 'الحساب مفعل ويمكنه الدخول والتفاعل.'
                          : 'الحساب موقوف مؤقتاً ولا يمكنه المزايدة أو الإدراج.'}
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={selectedUser.status === 'ACTIVE'}
                      disabled={busyId !== null || selectedUser.id === data.viewer.id}
                      onClick={() =>
                        updateUserStatus(selectedUser.id, {
                          status: selectedUser.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE',
                        })
                      }
                      className={`${styles.engravedToggle} ${
                        selectedUser.status === 'ACTIVE' ? styles.engravedToggleActive : ''
                      }`}
                    >
                      <span className={styles.engravedToggleLabel}>
                        {selectedUser.status === 'ACTIVE' ? 'نشط' : 'موقوف مؤقتاً'}
                      </span>
                      <span className={styles.engravedToggleTrack} aria-hidden="true">
                        <span className={styles.engravedToggleThumb} />
                      </span>
                    </button>
                  </div>

                  <div className="rounded-2xl border border-[var(--adm-border)] bg-[var(--adm-surface-soft)] p-3.5 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-black">اعتماد توثيق الهوية الوطنية (KYC)</div>
                      <div className="text-[11px] opacity-65 mt-0.5">
                        {selectedUser.kyc_status === 'VERIFIED'
                          ? 'الهوية الوطنية معتمدة وموثقة رسمياً.'
                          : 'يمكنك اعتماد توثيق الهوية يدوياً لهذا العضو.'}
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={selectedUser.kyc_status === 'VERIFIED'}
                      disabled={busyId !== null}
                      onClick={() =>
                        updateUserStatus(selectedUser.id, {
                          kycStatus: selectedUser.kyc_status === 'VERIFIED' ? 'PENDING' : 'VERIFIED',
                        })
                      }
                      className={`${styles.engravedToggle} ${
                        selectedUser.kyc_status === 'VERIFIED' ? styles.engravedToggleActive : ''
                      }`}
                    >
                      <span className={styles.engravedToggleLabel}>
                        {selectedUser.kyc_status === 'VERIFIED' ? 'موثق رسمياً' : 'غير موثق'}
                      </span>
                      <span className={styles.engravedToggleTrack} aria-hidden="true">
                        <span className={styles.engravedToggleThumb} />
                      </span>
                    </button>
                  </div>

                  <div className="rounded-2xl border border-[var(--adm-border)] bg-[var(--adm-surface-soft)] p-3.5 flex items-center justify-between gap-3 sm:col-span-2">
                    <div>
                      <div className="text-xs font-black">التحقق بخطوتين وتوثيق الحساب بطريقتين (2FA)</div>
                      <div className="text-[11px] opacity-65 mt-0.5">
                        {selectedUser.mfa_enabled
                          ? 'التحقق بخطوتين (2FA) مفعل وموثق لهذا الحساب (مراجعة الهويات والإجراءات الحساسة مفعلة).'
                          : 'فعّل هذا الخيار لتوثيق الحساب بخطوتين وتمكينه من الإجراءات المحمية ومراجعة الهويات.'}
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={Boolean(selectedUser.mfa_enabled)}
                      disabled={busyId !== null}
                      onClick={() => toggleUserMfa(selectedUser)}
                      className={`${styles.engravedToggle} ${
                        selectedUser.mfa_enabled ? styles.engravedToggleActive : ''
                      }`}
                    >
                      <span className={styles.engravedToggleLabel}>
                        {selectedUser.mfa_enabled ? '2FA مفعل' : 'غير مفعل'}
                      </span>
                      <span className={styles.engravedToggleTrack} aria-hidden="true">
                        <span className={styles.engravedToggleThumb} />
                      </span>
                    </button>
                  </div>
                </div>

                {/* Admin & Sub-Admin Roles */}
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>
                    صلاحيات الإدارة والمشرفين المفوضين (تحت الأدمن)
                  </span>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {ALL_ROLES.filter((r) => ROLE_DESCRIPTIONS[r]?.category === 'admin').map((role) => {
                      const active = selectedUser.roles.includes(role);
                      const info = ROLE_DESCRIPTIONS[role];
                      return (
                        <div
                          key={role}
                          className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--adm-border)] bg-[var(--adm-surface-soft)] px-3.5 py-3 text-xs"
                        >
                          <div className="min-w-0">
                            <div className="font-black text-[12.5px]">{info?.title || ROLE_LABELS[role] || role}</div>
                            <div className="text-[11px] opacity-65 mt-0.5 leading-relaxed">
                              {info?.subtitle}
                            </div>
                          </div>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={active}
                            disabled={busyId !== null}
                            onClick={() => toggleUserRole(selectedUser, role)}
                            className={`${styles.engravedToggle} ${active ? styles.engravedToggleActive : ''} shrink-0`}
                          >
                            <span className={styles.engravedToggleLabel}>{active ? 'ممنوح' : 'غير ممنوح'}</span>
                            <span className={styles.engravedToggleTrack} aria-hidden="true">
                              <span className={styles.engravedToggleThumb} />
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Member Roles (Seller / Bidder) */}
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>صلاحيات البيع والمزايدة في المنصة</span>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {ALL_ROLES.filter((r) => ROLE_DESCRIPTIONS[r]?.category === 'member').map((role) => {
                      const active = selectedUser.roles.includes(role);
                      const info = ROLE_DESCRIPTIONS[role];
                      return (
                        <div
                          key={role}
                          className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--adm-border)] bg-[var(--adm-surface-soft)] px-3.5 py-3 text-xs"
                        >
                          <div className="min-w-0">
                            <div className="font-black text-[12.5px]">{info?.title || ROLE_LABELS[role] || role}</div>
                            <div className="text-[11px] opacity-65 mt-0.5 leading-relaxed">
                              {info?.subtitle}
                            </div>
                          </div>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={active}
                            disabled={busyId !== null}
                            onClick={() => toggleUserRole(selectedUser, role)}
                            className={`${styles.engravedToggle} ${active ? styles.engravedToggleActive : ''} shrink-0`}
                          >
                            <span className={styles.engravedToggleLabel}>{active ? 'ممنوح' : 'غير ممنوح'}</span>
                            <span className={styles.engravedToggleTrack} aria-hidden="true">
                              <span className={styles.engravedToggleThumb} />
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel}>ملاحظة السجل الرقابي (Audit Log)</label>
                  <input
                    type="text"
                    value={userReason}
                    onChange={(e) => setUserReason(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={`${styles.drawerFooter} justify-between`}>
                <button type="button" className={styles.btnSecondary} onClick={() => setSelectedUser(null)}>
                  إغلاق النافذة
                </button>
                {selectedUser.id !== data.viewer.id && (
                  <button
                    type="button"
                    className={styles.btnDanger}
                    onClick={() => setDeletingUser(selectedUser)}
                  >
                    <Trash2 size={14} />
                    <span>حذف المستخدم نهائياً</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Centered Wide Create User / Admin / Sub-Admin Modal */}
        {createUserOpen && (
          <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="إضافة مستخدم أو مشرف جديد">
            <div className={styles.drawer}>
              <div className={styles.drawerHeader}>
                <div>
                  <h3 className="text-base font-black m-0">إضافة مستخدم أو مشرف جديد</h3>
                  <p className="text-xs opacity-70 m-0 mt-0.5">
                    أنشئ حساب عضو جديد، أو مدير أعلى (Admin)، أو مشرف بصلاحيات محددة تحت الأدمن.
                  </p>
                </div>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => !creatingUser && setCreateUserOpen(false)}
                  aria-label="إغلاق"
                >
                  <X size={17} />
                </button>
              </div>

              <div className={styles.drawerBody}>
                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>الاسم الكامل</label>
                    <input
                      type="text"
                      value={newUserForm.displayName}
                      onChange={(e) => setNewUserForm((f) => ({ ...f, displayName: e.target.value }))}
                      placeholder="مثال: فهد بن عبدالله"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>رقم الجوال (اختياري)</label>
                    <input
                      type="tel"
                      dir="ltr"
                      value={newUserForm.phone}
                      onChange={(e) => setNewUserForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="+966500000000"
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>البريد الإلكتروني لتسجيل الدخول</label>
                    <input
                      type="email"
                      dir="ltr"
                      value={newUserForm.email}
                      onChange={(e) => setNewUserForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="user@fbs-plates.sa"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>كلمة المرور الأولية (8 خانات فأكثر)</label>
                    <input
                      type="password"
                      dir="ltr"
                      value={newUserForm.password}
                      onChange={(e) => setNewUserForm((f) => ({ ...f, password: e.target.value }))}
                      placeholder="••••••••"
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel}>نوع الحساب ومستوى الصلاحيات</label>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {(
                      [
                        'user',
                        'bidder',
                        'seller',
                        'auction_manager',
                        'finance_admin',
                        'content_admin',
                        'support_admin',
                        'super_admin',
                      ] as const
                    ).map((rCode) => {
                      const info = ROLE_DESCRIPTIONS[rCode];
                      const selected = newUserForm.roleCode === rCode;
                      return (
                        <button
                          key={rCode}
                          type="button"
                          onClick={() => setNewUserForm((f) => ({ ...f, roleCode: rCode }))}
                          className={`text-right rounded-2xl border p-3.5 transition-all ${
                            selected
                              ? 'border-[var(--adm-gold)] bg-[var(--adm-gold-soft)] shadow-sm'
                              : 'border-[var(--adm-border)] bg-[var(--adm-surface-soft)] hover:border-[var(--adm-gold)]/40'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-black">{info?.title || ROLE_LABELS[rCode]}</span>
                            <span
                              className={`${styles.badge} !min-h-[20px] !px-2 !text-[10px] ${
                                rCode === 'super_admin'
                                  ? styles.tone_gold
                                  : ADMIN_ROLE_CODES.has(rCode)
                                    ? styles.tone_sky
                                    : styles.tone_slate
                              }`}
                            >
                              {rCode === 'super_admin'
                                ? 'Admin كامل'
                                : ADMIN_ROLE_CODES.has(rCode)
                                  ? 'تحت الأدمن'
                                  : 'عضو منصة'}
                            </span>
                          </div>
                          <p className="text-[11px] opacity-70 m-0 mt-1 leading-relaxed">{info?.subtitle}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className="rounded-2xl border border-[var(--adm-border)] bg-[var(--adm-surface-soft)] p-3.5 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-black">اعتماد توثيق الهوية تلقائياً (KYC)</div>
                      <div className="text-[11px] opacity-65 mt-0.5">
                        يجعل هوية الحساب موثقة رسمياً وجاهزة للمزايدة أو الإدراج فوراً.
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={newUserForm.kycVerified}
                      onClick={() => setNewUserForm((f) => ({ ...f, kycVerified: !f.kycVerified }))}
                      className={`${styles.engravedToggle} ${
                        newUserForm.kycVerified ? styles.engravedToggleActive : ''
                      }`}
                    >
                      <span className={styles.engravedToggleLabel}>
                        {newUserForm.kycVerified ? 'موثق رسمياً' : 'غير موثق'}
                      </span>
                      <span className={styles.engravedToggleTrack} aria-hidden="true">
                        <span className={styles.engravedToggleThumb} />
                      </span>
                    </button>
                  </div>

                  <div className="rounded-2xl border border-[var(--adm-border)] bg-[var(--adm-surface-soft)] p-3.5 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-black">تفعيل التحقق بخطوتين تلقائياً (2FA)</div>
                      <div className="text-[11px] opacity-65 mt-0.5">
                        يمنح المشرف أو العضو توثيق الحساب بطريقتين (2FA) فور إنشائه.
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={newUserForm.mfaVerified}
                      onClick={() => setNewUserForm((f) => ({ ...f, mfaVerified: !f.mfaVerified }))}
                      className={`${styles.engravedToggle} ${
                        newUserForm.mfaVerified ? styles.engravedToggleActive : ''
                      }`}
                    >
                      <span className={styles.engravedToggleLabel}>
                        {newUserForm.mfaVerified ? '2FA مفعل' : 'غير مفعل'}
                      </span>
                      <span className={styles.engravedToggleTrack} aria-hidden="true">
                        <span className={styles.engravedToggleThumb} />
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.drawerFooter}>
                <button
                  type="button"
                  disabled={creatingUser}
                  onClick={createNewUser}
                  className={styles.btnPrimary}
                >
                  <UserPlus size={15} />
                  <span>{creatingUser ? 'جارٍ إنشاء الحساب…' : 'إنشاء الحساب وتعيين الصلاحيات'}</span>
                </button>
                <button
                  type="button"
                  disabled={creatingUser}
                  onClick={() => setCreateUserOpen(false)}
                  className={styles.btnSecondary}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Delete User Confirmation Modal */}
        {deletingUser && (
          <div
            className={styles.modalBackdrop}
            role="dialog"
            aria-modal="true"
            aria-label="تأكيد حذف المستخدم"
            onClick={() => setDeletingUser(null)}
          >
            <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <div className={`${styles.modalIconWrap} ${styles.modalIconWrapDanger}`}>
                  <Trash2 size={19} />
                </div>
                <div className={styles.modalTitleGroup}>
                  <h3 className={styles.modalTitle}>حذف حساب المستخدم نهائياً</h3>
                  <p className={styles.modalSubtitle}>
                    أنت على وشك حذف حساب «{deletingUser.display_name || 'عضو مسجل'}» وسحب كافة أدواره وصلاحياته من المنصة.
                  </p>
                </div>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => setDeletingUser(null)}
                  aria-label="إغلاق"
                >
                  <X size={16} />
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className="rounded-2xl border border-[var(--adm-border)] bg-[var(--adm-surface-soft)] p-3.5 flex items-center justify-between gap-3">
                  <div className="text-right">
                    <div className="text-sm font-black">{deletingUser.display_name || 'عضو مسجل'}</div>
                    <div className="text-xs opacity-65 mt-0.5 text-right">
                      <span dir="ltr" className="font-mono tabular-nums">
                        {deletingUser.phone || `#${deletingUser.id.slice(0, 8)}`}
                      </span>
                    </div>
                  </div>
                  <span className={`${styles.badge} ${styles.tone_rose}`}>
                    <span dir="ltr" className="tabular-nums">{deletingUser.plates_count}</span> لوحات •{' '}
                    <span dir="ltr" className="tabular-nums">{deletingUser.bids_count}</span> مزايدات
                  </span>
                </div>

                {(deletingUser.plates_count > 0 || deletingUser.bids_count > 0) && (
                  <div className="rounded-xl border border-amber-500/35 bg-amber-500/10 px-3.5 py-2.5 text-xs font-bold text-amber-800 flex items-start gap-2 leading-relaxed">
                    <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-600" />
                    <span>
                      تنبيه: هذا المستخدم يملك{' '}
                      <strong dir="ltr" className="tabular-nums">{deletingUser.plates_count}</strong> لوحات و
                      <strong dir="ltr" className="tabular-nums">{deletingUser.bids_count}</strong> مزايدات؛ عند تأكيد الحذف سيتم حذف جميع لوحاته ومزاداتها وكافة بياناته المرتبطة تلقائياً.
                    </span>
                  </div>
                )}

                <div className={styles.field}>
                  <label className={styles.fieldLabel}>سبب الحذف للسجل الرقابي</label>
                  <input
                    type="text"
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  disabled={busyId === deletingUser.id}
                  className={styles.btnDanger}
                  onClick={confirmDeleteUser}
                >
                  <Trash2 size={14} />
                  <span>{busyId === deletingUser.id ? 'جارٍ الحذف…' : 'تأكيد حذف المستخدم'}</span>
                </button>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setDeletingUser(null)}
                >
                  تراجع
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* 3. AUCTION REGISTRATIONS */
  if (section === 'registrations') {
    return (
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>سجل المشاركين المسجلين في المزادات ({data.registrations.length})</h2>
            <p className={styles.panelDesc}>متابعة تأهيل المزايدين وحالة التأمينات البنكية الخاصة بهم.</p>
          </div>
        </div>

        {data.registrations.length === 0 ? (
          <div className={styles.emptyBox}>لا توجد تسجيلات مزايدين حالياً.</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>اللوحة</th>
                  <th>المزايد</th>
                  <th>اللقب بالصالة</th>
                  <th>التأمين المطلوب</th>
                  <th>الحالة</th>
                  <th>التاريخ</th>
                  <th>الإجراء</th>
                </tr>
              </thead>
              <tbody>
                {data.registrations.map((reg) => (
                  <tr key={reg.id}>
                    <td className="font-bold">{reg.plate_label}</td>
                    <td>{reg.user_name}</td>
                    <td>{reg.bidder_alias}</td>
                    <td>
                      <SarPrice amount={reg.required_deposit_minor} />
                    </td>
                    <td>
                      <span
                        className={`${styles.badge} ${
                          reg.status === 'QUALIFIED' ? styles.tone_emerald : styles.tone_amber
                        }`}
                      >
                        {reg.status}
                      </span>
                    </td>
                    <td className="text-xs opacity-75">{formatAdminDate(reg.created_at)}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        {reg.status !== 'QUALIFIED' && (
                          <button
                            type="button"
                            disabled={busyId === reg.id}
                            onClick={() => updateRegStatus(reg.id, 'QUALIFIED')}
                            className={styles.btnSuccess}
                          >
                            <CheckCircle2 size={12} />
                            <span>تأهيل فوري</span>
                          </button>
                        )}
                        {reg.status === 'QUALIFIED' && (
                          <button
                            type="button"
                            disabled={busyId === reg.id}
                            onClick={() => updateRegStatus(reg.id, 'SUSPENDED')}
                            className={styles.btnDanger}
                          >
                            تعليق
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    );
  }

  /* 4. CONTACT MESSAGES INBOX */
  if (section === 'messages') {
    return (
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>صندوق رسائل تواصل معنا وطلبات الوساطة ({data.messages.length})</h2>
            <p className={styles.panelDesc}>جميع الرسائل المرسلة من صفحة «تواصل معنا» والمكتب الخاص.</p>
          </div>
        </div>

        {data.messages.length === 0 ? (
          <div className={styles.emptyBox}>
            <Mail size={28} className="mx-auto mb-2 opacity-60" />
            <p className="text-sm font-bold">صندوق الوارد فارغ حالياً</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.messages.map((msg) => {
              const mst = MESSAGE_STATUS_LABELS[msg.status] ?? { label: msg.status, tone: 'slate' as const };
              return (
                <div
                  key={msg.id}
                  className="rounded-2xl border border-[var(--adm-border)] bg-[var(--adm-surface-soft)] p-4 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className={`${styles.badge} ${styles[`tone_${mst.tone}`]}`}>{mst.label}</span>
                      <strong className="text-sm">{msg.subject}</strong>
                    </div>
                    <span className="text-xs opacity-70">{formatAdminDate(msg.created_at)}</span>
                  </div>

                  <div className="text-xs opacity-80">
                    المرسل: <strong>{msg.name}</strong> •{' '}
                    <a href={`mailto:${msg.email}`} className="underline" dir="ltr">
                      {msg.email}
                    </a>
                  </div>

                  <p className="text-xs leading-relaxed whitespace-pre-wrap m-0 pt-1">{msg.message}</p>

                  <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[var(--adm-border-subtle)]">
                    <button
                      type="button"
                      disabled={busyId === msg.id}
                      onClick={() => updateMessageStatus(msg.id, 'IN_PROGRESS')}
                      className={styles.btnChip}
                    >
                      قيد المتابعة
                    </button>
                    <button
                      type="button"
                      disabled={busyId === msg.id}
                      onClick={() => updateMessageStatus(msg.id, 'RESOLVED')}
                      className={styles.btnSuccess}
                    >
                      تم الحل والرد
                    </button>
                    <button
                      type="button"
                      disabled={busyId === msg.id}
                      onClick={() => updateMessageStatus(msg.id, 'ARCHIVED')}
                      className={styles.btnChip}
                    >
                      أرشفة
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    );
  }

  /* 5. NOTIFICATIONS SENDER & LOG */
  return (
    <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>إرسال إشعار رسمي للأعضاء</h2>
            <p className={styles.panelDesc}>يصل فوراً إلى صندوق إشعارات الأعضاء داخل حساباتهم.</p>
          </div>
          <Bell size={18} className="text-[var(--adm-gold)]" />
        </div>

        <div className="space-y-3">
          <div className={styles.field}>
            <label className={styles.fieldLabel}>المستلم</label>
            <select value={notifTarget} onChange={(e) => setNotifTarget(e.target.value)} className={styles.select}>
              <option value="ALL">تعميم لجميع الأعضاء النشطين</option>
              {data.users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.display_name || u.id.slice(0, 8)}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>عنوان الإشعار</label>
            <input
              type="text"
              value={notifTitle}
              onChange={(e) => setNotifTitle(e.target.value)}
              className={styles.input}
              placeholder="مثال: انطلاق المزاد الملكي الليلة"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>نص الرسالة</label>
            <textarea
              rows={4}
              value={notifBody}
              onChange={(e) => setNotifBody(e.target.value)}
              className={styles.textarea}
              placeholder="تفاصيل التنبيه أو الدعوة…"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>رابط التوجيه عند الضغط</label>
            <input
              type="text"
              dir="ltr"
              value={notifHref}
              onChange={(e) => setNotifHref(e.target.value)}
              className={styles.input}
              placeholder="/auctions"
            />
          </div>

          <button
            type="button"
            disabled={sendingNotif}
            onClick={sendNotification}
            className={`${styles.btnPrimary} w-full`}
          >
            <Send size={15} />
            <span>{sendingNotif ? 'جارٍ الإرسال…' : 'إرسال الإشعار الآن'}</span>
          </button>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>أحدث الإشعارات المرسلة بالنظام</h2>
          </div>
        </div>

        {data.notifications.length === 0 ? (
          <div className={styles.emptyBox}>لا توجد إشعارات مسجلة بعد.</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>التاريخ</th>
                  <th>المستخدم</th>
                  <th>العنوان</th>
                  <th>النص</th>
                </tr>
              </thead>
              <tbody>
                {data.notifications.map((n) => (
                  <tr key={n.id}>
                    <td className="text-xs opacity-75 whitespace-nowrap">{formatAdminDate(n.created_at)}</td>
                    <td className="text-xs font-bold">{n.user_name}</td>
                    <td className="font-bold text-xs">{n.title}</td>
                    <td className="text-xs opacity-85 max-w-sm truncate">{n.body}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
