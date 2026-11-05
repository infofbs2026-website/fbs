'use client';

import { useMemo, useState } from 'react';
import {
  Bell,
  CheckCircle2,
  KeyRound,
  Lock,
  Mail,
  Send,
  ShieldCheck,
  UserCog,
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

export function PeopleOpsSection({
  section,
  data,
  onNotify,
  onRequireMfa,
  onRefresh,
}: PeopleOpsProps) {
  const [query, setQuery] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);
  const [userReason, setUserReason] = useState('تحديث صلاحيات وحالة المستخدم من الإدارة التنفيذية');

  // Notification Sender State
  const [notifTarget, setNotifTarget] = useState<string>('ALL');
  const [notifTitle, setNotifTitle] = useState('');
  const [notifBody, setNotifBody] = useState('');
  const [notifHref, setNotifHref] = useState('/auctions');
  const [sendingNotif, setSendingNotif] = useState(false);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data.users;
    return data.users.filter((u) =>
      [u.display_name, u.phone ?? '', u.id, u.roles.join(' ')].join(' ').toLowerCase().includes(q),
    );
  }, [data.users, query]);

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
            <button type="button" className={`${styles.btnPrimary} mt-4`} onClick={onRequireMfa}>
              <KeyRound size={15} />
              <span>تفعيل التحقق بخطوتين الآن</span>
            </button>
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
          <div>
            <h2 className="text-sm font-black m-0">الأعضاء والصلاحيات الإدارية ({data.users.length})</h2>
          </div>
          <div className={styles.searchBox}>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث بالاسم أو الجوال أو الدور…"
              className={styles.searchInput}
            />
          </div>
        </div>

        <section className={styles.panel}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>العضو</th>
                  <th>الجوال</th>
                  <th>حالة الحساب</th>
                  <th>توثيق الهوية</th>
                  <th>الأدوار والصلاحيات</th>
                  <th>النشاط</th>
                  <th>تحكم</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const kyc = KYC_LABELS[u.kyc_status] ?? { label: u.kyc_status, tone: 'slate' as const };
                  return (
                    <tr key={u.id}>
                      <td>
                        <div className="font-bold">{u.display_name || 'عضو مسجل'}</div>
                        <div className="font-mono text-[10.5px] opacity-60" dir="ltr">
                          {u.id.slice(0, 8)}…
                        </div>
                      </td>
                      <td className="font-mono text-xs" dir="ltr">
                        {u.phone || '—'}
                      </td>
                      <td>
                        <span
                          className={`${styles.badge} ${
                            u.status === 'ACTIVE' ? styles.tone_emerald : styles.tone_rose
                          }`}
                        >
                          {u.status === 'ACTIVE' ? 'نشط' : u.status === 'SUSPENDED' ? 'موقوف' : 'مغلق'}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${styles[`tone_${kyc.tone}`]}`}>{kyc.label}</span>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {u.roles.length === 0 ? (
                            <span className="text-xs opacity-60">عضو عام</span>
                          ) : (
                            u.roles.map((r) => (
                              <span key={r} className={`${styles.badge} ${styles.tone_gold}`}>
                                {ROLE_LABELS[r] || r}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="text-xs">
                        {u.plates_count} لوحات • {u.bids_count} مزايدات
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => setSelectedUser(u)}
                          className={styles.btnSecondary}
                        >
                          <UserCog size={14} />
                          <span>إدارة الحساب والأدوار</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* User Roles & Status Drawer */}
        {selectedUser && (
          <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="إدارة العضو">
            <div className={styles.drawer}>
              <div className={styles.drawerHeader}>
                <div>
                  <h3 className="text-base font-black m-0">{selectedUser.display_name || 'عضو مسجل'}</h3>
                  <p className="text-xs opacity-70 m-0 mt-0.5 font-mono" dir="ltr">
                    {selectedUser.id}
                  </p>
                </div>
                <button type="button" className={styles.iconBtn} onClick={() => setSelectedUser(null)} aria-label="إغلاق">
                  <X size={17} />
                </button>
              </div>

              <div className={styles.drawerBody}>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>حالة الحساب</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busyId !== null}
                      onClick={() => updateUserStatus(selectedUser.id, { status: 'ACTIVE' })}
                      className={styles.btnSuccess}
                    >
                      تفعيل الحساب (ACTIVE)
                    </button>
                    <button
                      type="button"
                      disabled={busyId !== null}
                      onClick={() => updateUserStatus(selectedUser.id, { status: 'SUSPENDED' })}
                      className={styles.btnDanger}
                    >
                      إيقاف الحساب مؤقتاً (SUSPENDED)
                    </button>
                  </div>
                </div>

                <div className={styles.field}>
                  <span className={styles.fieldLabel}>اعتماد توثيق الهوية يدوياً (KYC Override)</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busyId !== null}
                      onClick={() => updateUserStatus(selectedUser.id, { kycStatus: 'VERIFIED' })}
                      className={styles.btnSecondary}
                    >
                      <ShieldCheck size={14} />
                      <span>تعيين كموثق رسمياً</span>
                    </button>
                    <button
                      type="button"
                      disabled={busyId !== null}
                      onClick={() => updateUserStatus(selectedUser.id, { kycStatus: 'PENDING' })}
                      className={styles.btnSecondary}
                    >
                      إعادة لقيد المراجعة
                    </button>
                  </div>
                </div>

                <div className={styles.field}>
                  <span className={styles.fieldLabel}>الأدوار والصلاحيات الإدارية (RBAC)</span>
                  <div className="space-y-2">
                    {ALL_ROLES.map((role) => {
                      const active = selectedUser.roles.includes(role);
                      return (
                        <div
                          key={role}
                          className="flex items-center justify-between rounded-xl border border-[var(--adm-border)] bg-[var(--adm-surface-soft)] px-3.5 py-2.5 text-xs"
                        >
                          <div>
                            <div className="font-bold">{ROLE_LABELS[role] || role}</div>
                            <div className="font-mono text-[10.5px] opacity-60" dir="ltr">
                              {role}
                            </div>
                          </div>
                          <button
                            type="button"
                            disabled={busyId !== null}
                            onClick={() => toggleUserRole(selectedUser, role)}
                            className={active ? styles.btnSuccess : styles.btnChip}
                          >
                            {active ? 'ممنوح ✓ (اضغط للسحب)' : '+ منح الدور'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel}>سبب التعديل للسجل الرقابي</label>
                  <input
                    type="text"
                    value={userReason}
                    onChange={(e) => setUserReason(e.target.value)}
                    className={styles.input}
                  />
                </div>
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
