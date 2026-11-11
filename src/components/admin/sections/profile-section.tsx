'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  Crown,
  KeyRound,
  Lock,
  Mail,
  Phone,
  Save,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User,
  UserCheck,
} from 'lucide-react';
import accountStyles from '@/components/account-dashboard.module.css';
import styles from '../admin-dashboard.module.css';
import type { AdminDashboardData } from '../types';

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
    <div className="space-y-6">
      {/* 1. Executive Monogram & Status Overview */}
      <div className={accountStyles.greeting}>
        <div className={accountStyles.greetingInner}>
          <div className="flex flex-col sm:flex-row items-center gap-5 z-10 w-full sm:w-auto">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#edd08d] via-[#d4a64f] to-[#b88428] text-navy-deep font-black text-2xl shadow-lg border-2 border-white/80">
              <span>{name.charAt(0) || 'أ'}</span>
              <span
                className="absolute -bottom-1 -start-1 h-5 w-5 rounded-full border-2 border-white bg-emerald-500"
                title="جلسة إدارية نشطة"
              />
            </div>

            <div className="text-center sm:text-start min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-0.5 text-xs font-bold text-gold border border-gold/30">
                  <Crown size={12} />
                  <span>حساب الإدارة والقيادة التنفيذية</span>
                </span>
                {viewer.mfaVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200">
                    <ShieldCheck size={12} className="text-emerald-600" />
                    <span>2FA مفعّل</span>
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-black text-navy-deep">{name || 'الإدارة'}</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5" dir="ltr">
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
              <KeyRound size={15} />
              <span>أمان الحساب (2FA)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Grid: Edit Profile Form + Security & Roles Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Editable Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-5 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
              <UserCheck size={18} className="text-gold" />
              <h3 className="text-sm sm:text-base font-black text-navy-deep">
                تعديل البيانات الشخصية للإدارة
              </h3>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    الاسم الكامل / الاسم الإداري
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="كارم محمد سالم"
                      required
                      minLength={2}
                      maxLength={120}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50/70 px-3.5 py-2.5 text-xs font-bold text-navy-deep focus:bg-white focus:border-gold focus:outline-none transition-all"
                    />
                    <User size={15} className="absolute inset-inline-end-3 top-3 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    رقم الجوال الإداري (اختياري)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+966500000000"
                      dir="ltr"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50/70 px-3.5 py-2.5 text-xs font-bold text-navy-deep focus:bg-white focus:border-gold focus:outline-none transition-all"
                    />
                    <Phone size={15} className="absolute inset-inline-end-3 top-3 text-slate-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  البريد الإلكتروني المسجل (معتمد رسمياً)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={viewer.email}
                    readOnly
                    disabled
                    dir="ltr"
                    className="w-full rounded-xl border border-slate-200 bg-slate-100/80 px-3.5 py-2.5 text-xs font-bold text-slate-500 cursor-not-allowed"
                  />
                  <Mail size={15} className="absolute inset-inline-end-3 top-3 text-slate-400" />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  لتعديل البريد الإلكتروني الإداري، يرجى مراجعة إدارة النظام المركزية.
                </p>
              </div>

              <div className="pt-3 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className={accountStyles.goldButton}
                >
                  <Save size={15} />
                  <span>{saving ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right 1 Col: Security, Roles & Privileges */}
        <div className="space-y-6">
          {/* Security Card */}
          <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <ShieldCheck size={18} className="text-emerald-600" />
              <h3 className="text-xs sm:text-sm font-black text-navy-deep">أمان الجلسة والتوثيق</h3>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600">التحقق بخطوتين (2FA)</span>
                {viewer.mfaVerified ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    <span>مفعّل ونشط</span>
                  </span>
                ) : (
                  <span className="text-amber-700 flex items-center gap-1">
                    <ShieldAlert size={13} />
                    <span>غير مفعل بالجلسة</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                التحقق بخطوتين يوفر حماية مصرفية لجلسات الإدارة ويطلب إدخال رمز التحقق عند تنفيذ العمليات الحساسة.
              </p>
            </div>

            <button
              type="button"
              onClick={onRequireMfa}
              className="w-full rounded-xl border border-gold/30 bg-gold/10 hover:bg-gold/20 py-2.5 text-xs font-bold text-navy-deep transition-colors flex items-center justify-center gap-1.5"
            >
              <KeyRound size={14} className="text-gold" />
              <span>إدارة مفاتيح الأمان 2FA</span>
            </button>
          </div>

          {/* Assigned Roles & Privileges */}
          <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Crown size={18} className="text-gold" />
              <h3 className="text-xs sm:text-sm font-black text-navy-deep">الأدوار والصلاحيات الممنوحة</h3>
            </div>

            <div className="space-y-2">
              {(viewer.roles && viewer.roles.length > 0 ? viewer.roles : ['مدير تنفيذي']).map(
                (role, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-gold/20 bg-gold/5 text-xs font-bold text-navy-deep"
                  >
                    <span>{role}</span>
                    <span className="text-[10px] text-gold font-semibold">صلاحية معتمدة</span>
                  </div>
                ),
              )}
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              تتيح لك هذه الصلاحيات الإشراف على المزادات، إدارة اللوحات والمخزون، واعتماد طلبات الملاك والتحويلات المالية.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

