'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  Crown,
  KeyRound,
  Mail,
  Phone,
  Save,
  ShieldAlert,
  ShieldCheck,
  User,
  UserCheck,
} from 'lucide-react';
import accountStyles from '@/components/account-dashboard.module.css';
import styles from '../admin-dashboard.module.css';
import type { AdminDashboardData } from '../types';

const ROLE_LABELS_AR: Record<string, string> = {
  super_admin: 'المدير التنفيذي الأعلى',
  admin: 'مشرف النظام',
  moderator: 'مراقب المنصة',
  finance: 'المراقبة المالية',
  auditor: 'مدقق السجلات',
  user: 'عضو مسجل',
};

interface ProfileSectionProps {
  data: AdminDashboardData;
  onNotify: (msg: string, kind?: 'success' | 'error') => void;
  onRequireMfa: () => void;
  onRefresh: () => void;
}

export function ProfileSection({
  data,
  onNotify,
  onRequireMfa,
  onRefresh,
}: ProfileSectionProps) {
  const viewer = data.viewer;
  const [name, setName] = useState(viewer.displayName || '');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    const cleanName = name.trim();
    if (cleanName.length < 2) {
      onNotify('يرجى إدخال اسم صحيح مكون من حرفين على الأقل.', 'error');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/v1/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: cleanName,
          phone: phone.trim() ? phone.trim() : '',
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error?.message || 'تعذر حفظ البيانات، حاول مرة أخرى.');
      }
      onNotify('تم تحديث بيانات الملف الشخصي بنجاح.');
      onRefresh();
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'تعذر حفظ البيانات.', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* 1. Executive Monogram & Status Overview */}
      <div className={accountStyles.greeting} style={{ marginBottom: 0 }}>
        <div className={accountStyles.greetingInner}>
          <div className="flex flex-col sm:flex-row items-center gap-4 z-10 w-full sm:w-auto">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#edd08d] via-[#d4a64f] to-[#b88428] text-[#131c2e] font-black text-xl shadow-md border border-white/80">
              <span>{name.charAt(0) || 'أ'}</span>
              <span
                className="absolute -bottom-0.5 -start-0.5 h-4 w-4 rounded-full border-2 border-white bg-emerald-500"
                title="جلسة إدارية نشطة"
              />
            </div>

            <div className="text-center sm:text-start min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${styles.sculptPillGold}`}>
                  <Crown size={11} />
                  <span>حساب الإدارة والقيادة التنفيذية</span>
                </span>
                {viewer.mfaVerified && (
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${styles.sculptPillEmerald}`}>
                    <ShieldCheck size={11} />
                    <span>2FA مفعّل</span>
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-[var(--ink-strong)]">
                {name || 'مدير المنصة'}
              </h2>
              <p className="text-[11px] text-[var(--muted)] font-medium mt-0.5" dir="ltr">
                {viewer.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-center sm:self-auto z-10">
            <button
              type="button"
              onClick={onRequireMfa}
              className={accountStyles.outlineButton}
              title="إعدادات التحقق بخطوتين"
            >
              <KeyRound size={14} />
              <span>أمان الحساب (2FA)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Grid: Edit Profile Form + Security & Roles Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Main Column: Editable Profile Details (stretches flush with stacked side cards) */}
        <div className="lg:col-span-8 flex flex-col">
          <div className={`${styles.sculptCard} flex-1 flex flex-col`}>
            <div className={`${styles.sculptCardInner} flex-1 flex flex-col`}>
              <div className={styles.sculptCardHeader}>
                <span className={styles.sculptIconBadge}>
                  <UserCheck size={16} />
                </span>
                <div>
                  <h3 className={styles.sculptCardTitle}>تعديل البيانات الشخصية للإدارة</h3>
                  <p className={styles.sculptCardSubtitle}>
                    تحديث اسم العرض الإداري وبيانات التواصل المرتبطة بالبوابة التنفيذية.
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleSaveProfile}
                className="flex-1 flex flex-col justify-between gap-5 pt-4"
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={styles.sculptFieldLabel}>الاسم الكامل / الاسم الإداري</label>
                      <div className={styles.sculptInputWrap}>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="مدير المنصة"
                          required
                          minLength={2}
                          maxLength={120}
                          className={`${styles.sculptInput} pe-10 ps-3.5`}
                        />
                        <User
                          size={14}
                          className="absolute text-[var(--muted)] pointer-events-none end-3.5 top-1/2 -translate-y-1/2"
                        />
                      </div>
                    </div>

                    <div>
                      <label className={styles.sculptFieldLabel}>رقم الجوال الإداري (اختياري)</label>
                      <div className={styles.sculptInputWrap} dir="ltr">
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+966500000000"
                          dir="ltr"
                          className={`${styles.sculptInput} pl-3.5 pr-10 text-left`}
                        />
                        <Phone
                          size={14}
                          className="absolute text-[var(--muted)] pointer-events-none right-3.5 top-1/2 -translate-y-1/2"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={styles.sculptFieldLabel}>
                      البريد الإلكتروني المسجل (معتمد رسمياً)
                    </label>
                    <div className={styles.sculptInputWrap} dir="ltr">
                      <input
                        type="email"
                        value={viewer.email}
                        readOnly
                        disabled
                        dir="ltr"
                        className={`${styles.sculptInput} pl-3.5 pr-10 text-left`}
                      />
                      <Mail
                        size={14}
                        className="absolute text-[var(--muted)] pointer-events-none right-3.5 top-1/2 -translate-y-1/2"
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-[var(--muted)]">
                      لتعديل البريد الإلكتروني الإداري، يرجى مراجعة إدارة النظام المركزية.
                    </p>
                  </div>

                  {/* Account Operational Summary Chamber — balances vertical rhythm & removes empty void */}
                  <div className={styles.sculptChamber}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                      <div className="space-y-0.5">
                        <span className="block text-[10px] font-semibold text-[var(--muted)]">
                          تصنيف الحساب
                        </span>
                        <strong className="block font-bold text-[var(--ink-strong)]">
                          إدارة تنفيذية عليا
                        </strong>
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-[10px] font-semibold text-[var(--muted)]">
                          حالة الجلسة الحالية
                        </span>
                        <strong className={`inline-flex items-center gap-1 font-bold ${styles.sculptStatusOk}`}>
                          <CheckCircle2 size={12} />
                          <span>نشطة وموثقة</span>
                        </strong>
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-[10px] font-semibold text-[var(--muted)]">
                          مستوى حماية 2FA
                        </span>
                        <strong
                          className={`inline-flex items-center gap-1 font-bold ${
                            viewer.mfaVerified ? styles.sculptStatusOk : styles.sculptStatusWarn
                          }`}
                        >
                          {viewer.mfaVerified ? (
                            <>
                              <ShieldCheck size={12} />
                              <span>مصادقة ثنائية نشطة</span>
                            </>
                          ) : (
                            <>
                              <ShieldAlert size={12} />
                              <span>يتطلب تفعيل 2FA</span>
                            </>
                          )}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-3.5 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[11px] text-[var(--muted)]">
                    تُطبّق التعديلات فورياً على الهوية الإدارية وسجل المراقبة.
                  </span>
                  <button
                    type="submit"
                    disabled={saving}
                    className={accountStyles.goldButton}
                  >
                    <Save size={14} />
                    <span>{saving ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Side Column: Security, Roles & Privileges */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Security Card */}
          <div className={styles.sculptCard}>
            <div className={`${styles.sculptCardInner} space-y-3.5`}>
              <div className={styles.sculptCardHeader}>
                <span className={styles.sculptIconBadge}>
                  <ShieldCheck size={16} />
                </span>
                <div>
                  <h3 className={styles.sculptCardTitle}>أمان الجلسة والتوثيق</h3>
                  <p className={styles.sculptCardSubtitle}>حماية العمليات الحساسة</p>
                </div>
              </div>

              <div className={`${styles.sculptChamber} space-y-2`}>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[var(--muted)]">التحقق بخطوتين (2FA)</span>
                  {viewer.mfaVerified ? (
                    <span className={`${styles.sculptStatusOk} flex items-center gap-1`}>
                      <CheckCircle2 size={13} />
                      <span>مفعّل ونشط</span>
                    </span>
                  ) : (
                    <span className={`${styles.sculptStatusWarn} flex items-center gap-1`}>
                      <ShieldAlert size={13} />
                      <span>غير مفعل بالجلسة</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                  التحقق بخطوتين يوفر حماية مصرفية لجلسات الإدارة ويطلب إدخال رمز التحقق عند تنفيذ العمليات الحساسة.
                </p>
              </div>

              <button
                type="button"
                onClick={onRequireMfa}
                className={`${styles.btnSecondary} w-full`}
              >
                <KeyRound size={13.5} />
                <span>إدارة مفاتيح الأمان 2FA</span>
              </button>
            </div>
          </div>

          {/* Assigned Roles & Privileges */}
          <div className={`${styles.sculptCard} flex-1 flex flex-col`}>
            <div className={`${styles.sculptCardInner} flex-1 flex flex-col justify-between gap-3.5`}>
              <div className="space-y-3.5">
                <div className={styles.sculptCardHeader}>
                  <span className={styles.sculptIconBadge}>
                    <Crown size={16} />
                  </span>
                  <div>
                    <h3 className={styles.sculptCardTitle}>الأدوار والصلاحيات الممنوحة</h3>
                    <p className={styles.sculptCardSubtitle}>نطاق الاعتماد الإداري</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {(viewer.roles && viewer.roles.length > 0 ? viewer.roles : ['super_admin']).map(
                    (role, idx) => (
                      <div key={idx} className={styles.sculptRoleRow}>
                        <span className="text-xs font-bold text-[var(--ink-strong)]">
                          {ROLE_LABELS_AR[role] ?? role}
                        </span>
                        <span className="text-[10.5px] text-[var(--gold)] font-bold">
                          صلاحية معتمدة
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <p className="text-[11px] text-[var(--muted)] leading-relaxed pt-1 border-t border-[var(--line)]">
                تتيح لك هذه الصلاحيات الإشراف على المزادات، إدارة اللوحات والمخزون، واعتماد طلبات الملاك والتحويلات المالية.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

