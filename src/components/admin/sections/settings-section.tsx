'use client';

import { useState } from 'react';
import {
  BellRing,
  Globe,
  Phone,
  Save,
  Share2,
  Sliders,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import type { SiteSettings } from '@/lib/site-settings-types';
import styles from '../admin-dashboard.module.css';
import { callAdminManage } from '../helpers';
import type { AdminDashboardData } from '../types';

interface SettingsProps {
  data: AdminDashboardData;
  onNotify: (msg: string, kind?: 'success' | 'error') => void;
  onRequireMfa: () => void;
  onRefresh: () => void;
}

const STANDARD_FLAGS: Array<{ key: string; label: string; description: string }> = [
  {
    key: 'live_bidding_enabled',
    label: 'تفعيل المزايدة الحية الفورية',
    description: 'السماح للمزايدين المؤهلين بتقديم العطاءات المباشرة في صالات المزاد النشطة.',
  },
  {
    key: 'direct_store_enabled',
    label: 'تفعيل متجر الشراء المباشر',
    description: 'إتاحة طلبات الشراء المباشر وحفظ السلة في متجر اللوحات المميزة.',
  },
  {
    key: 'plate_submissions_enabled',
    label: 'استقبال طلبات عرض اللوحات من الملاك',
    description: 'فتح نموذج «اعرض لوحتك الآن» لاستقبال لوحات البائعين ومستندات الملكية.',
  },
  {
    key: 'whatsapp_concierge_enabled',
    label: 'زر التواصل العائم عبر واتساب',
    description: 'إظهار أيقونة التواصل الفوري مع المكتب الخاص في صفحات الموقع.',
  },
  {
    key: 'kyc_required_for_bidding',
    label: 'إلزامية توثيق الهوية الوطنية للمزايدة',
    description: 'اشتراط حالة هوية موثقة قبل السماح بدخول المزايدة الحية.',
  },
];

export function SettingsSection({ data, onNotify, onRequireMfa, onRefresh }: SettingsProps) {
  const [form, setForm] = useState<SiteSettings>(() => ({
    ...data.siteSettings,
    socialLinks: { ...data.siteSettings.socialLinks },
  }));
  const [reason, setReason] = useState('تحديث إعدادات الهوية والتواصل العامة للمنصة');
  const [saving, setSaving] = useState(false);
  const [flagBusy, setFlagBusy] = useState<string | null>(null);

  function updateField<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateSocial(key: keyof SiteSettings['socialLinks'], value: string) {
    setForm((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [key]: value,
      },
    }));
  }

  async function saveAllSettings() {
    if (reason.trim().length < 3) {
      onNotify('يرجى كتابة سبب التحديث لحفظه في سجل التدقيق.', 'error');
      return;
    }
    setSaving(true);
    const res = await callAdminManage({
      action: 'settings.save',
      settings: form,
      reason: reason.trim(),
    });
    setSaving(false);

    if (!res.ok) {
      if (res.mfaRequired) onRequireMfa();
      onNotify(res.error || 'تعذر حفظ إعدادات الموقع.', 'error');
      return;
    }
    onNotify(res.message || 'تم حفظ إعدادات الموقع وتحديث كافة الصفحات بنجاح.');
    onRefresh();
  }

  async function toggleFeatureFlag(key: string, enabled: boolean, description: string) {
    setFlagBusy(key);
    const res = await callAdminManage({
      action: 'feature_flag.toggle',
      key,
      enabled,
      description,
      reason: `${enabled ? 'تفعيل' : 'إيقاف'} مفتاح (${key}) من إعدادات الإدارة`,
    });
    setFlagBusy(null);

    if (!res.ok) {
      if (res.mfaRequired) onRequireMfa();
      onNotify(res.error || 'تعذر تحديث مفتاح الميزة.', 'error');
      return;
    }
    onNotify(res.message || 'تم تحديث الميزة.');
    onRefresh();
  }

  return (
    <div className="space-y-5">
      {/* 1. Top Announcement Banner & Brand Identity */}
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>الهوية الرسمية وشريط الإعلانات العلوي</h2>
            <p className={styles.panelDesc}>
              تتحكم هذه الإعدادات مباشرة في الهيدر والفوتر والصفحة الرئيسية على كامل الموقع.
            </p>
          </div>
          <Globe size={18} className="text-[var(--adm-gold)]" />
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[var(--adm-border)] bg-[var(--adm-surface-soft)] p-4 space-y-3">
            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={form.announcementEnabled}
                onChange={(e) => updateField('announcementEnabled', e.target.checked)}
              />
              <BellRing size={15} className="text-[var(--adm-gold)]" />
              <span>إظهار شريط إعلان ذهبي أعلى جميع صفحات الموقع</span>
            </label>

            {form.announcementEnabled && (
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>نص الإعلان العلوي</label>
                  <input
                    type="text"
                    value={form.announcementText}
                    onChange={(e) => updateField('announcementText', e.target.value)}
                    className={styles.input}
                    placeholder="مثال: انطلاق المزاد الملكي للوحات الأحادية الليلة الساعة 9 مساءً"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>الرابط عند الضغط على الإعلان</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={form.announcementHref}
                    onChange={(e) => updateField('announcementHref', e.target.value)}
                    className={styles.input}
                    placeholder="/auctions"
                  />
                </div>
              </div>
            )}
          </div>

          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>اسم المنصة الرسمي</label>
              <input
                type="text"
                value={form.siteName}
                onChange={(e) => updateField('siteName', e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>الشعار اللفظي (Tagline)</label>
              <input
                type="text"
                value={form.siteTagline}
                onChange={(e) => updateField('siteTagline', e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>رقم السجل التجاري في الفوتر</label>
              <input
                type="text"
                dir="ltr"
                value={form.crNumber}
                onChange={(e) => updateField('crNumber', e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>النبذة التنفيذية في أسفل الموقع (Footer Summary)</label>
            <textarea
              rows={3}
              value={form.footerSummary}
              onChange={(e) => updateField('footerSummary', e.target.value)}
              className={styles.textarea}
            />
          </div>

          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>عنوان بانر الكونسيرج في الرئيسية</label>
              <input
                type="text"
                value={form.conciergeTitle}
                onChange={(e) => updateField('conciergeTitle', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>وصف بانر الكونسيرج في الرئيسية</label>
              <input
                type="text"
                value={form.conciergeSubtitle}
                onChange={(e) => updateField('conciergeSubtitle', e.target.value)}
                className={styles.input}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Contact Channels & WhatsApp */}
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>قنوات التواصل، الواتساب، والعنوان الرسمي</h2>
            <p className={styles.panelDesc}>
              تُحدّث تلقائياً أزرار الواتساب العائمة، الفوتر، صفحة تواصل معنا، وصفحة الأسئلة الشائعة.
            </p>
          </div>
          <Phone size={18} className="text-[var(--adm-gold)]" />
        </div>

        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>رقم واتساب الرسمي (بصيغة دولية بدون +)</label>
            <input
              type="text"
              dir="ltr"
              value={form.whatsappNumber}
              onChange={(e) => updateField('whatsappNumber', e.target.value)}
              className={styles.input}
              placeholder="966500000000"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>رقم الخط الساخن المعروض</label>
            <input
              type="text"
              dir="ltr"
              value={form.phoneDisplay}
              onChange={(e) => updateField('phoneDisplay', e.target.value)}
              className={styles.input}
              placeholder="+966 50 000 0000"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>الرقم الموحد</label>
            <input
              type="text"
              dir="ltr"
              value={form.unifiedNumber}
              onChange={(e) => updateField('unifiedNumber', e.target.value)}
              className={styles.input}
              placeholder="9200 00000"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>البريد الإلكتروني الرسمي</label>
            <input
              type="email"
              dir="ltr"
              value={form.contactEmail}
              onChange={(e) => updateField('contactEmail', e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>عنوان المقر الرئيسي</label>
            <input
              type="text"
              value={form.addressAr}
              onChange={(e) => updateField('addressAr', e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>ساعات العمل الرسمية</label>
            <input
              type="text"
              value={form.workingHoursAr}
              onChange={(e) => updateField('workingHoursAr', e.target.value)}
              className={styles.input}
            />
          </div>
        </div>
      </section>

      {/* 3. Social Media & Default Auction Timing Rules */}
      <div className="grid gap-5 lg:grid-cols-2">
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>روابط منصات التواصل الاجتماعي</h2>
              <p className={styles.panelDesc}>اترك الحقل فارغاً لإخفاء أيقونة المنصة من الفوتر.</p>
            </div>
            <Share2 size={18} className="text-[var(--adm-gold)]" />
          </div>

          <div className="space-y-3">
            {(
              [
                ['x', 'حساب منصة X (تويتر)'],
                ['instagram', 'حساب إنستغرام (Instagram)'],
                ['snapchat', 'حساب سناب شات (Snapchat)'],
                ['tiktok', 'حساب تيك توك (TikTok)'],
                ['youtube', 'قناة يوتيوب (YouTube)'],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className={styles.field}>
                <label className={styles.fieldLabel}>{label}</label>
                <input
                  type="url"
                  dir="ltr"
                  value={form.socialLinks[key]}
                  onChange={(e) => updateSocial(key, e.target.value)}
                  className={styles.input}
                  placeholder={`https://${key}.com/...`}
                />
              </div>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>القيم الافتراضية لمنع القنص في المزادات</h2>
              <p className={styles.panelDesc}>تُعبّأ تلقائياً عند إنشاء أي مزاد جديد من لوحة الإدارة.</p>
            </div>
            <Sliders size={18} className="text-[var(--adm-gold)]" />
          </div>

          <div className="space-y-3">
            <div className={styles.field}>
              <label className={styles.fieldLabel}>نافذة المراقبة قبل الإغلاق (بالثواني)</label>
              <input
                type="number"
                min={10}
                dir="ltr"
                value={form.defaultExtensionWindowSeconds}
                onChange={(e) => updateField('defaultExtensionWindowSeconds', Number(e.target.value))}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>مدة التمديد التلقائي لكل مزايدة أخيرة (بالثواني)</label>
              <input
                type="number"
                min={10}
                dir="ltr"
                value={form.defaultExtensionDurationSeconds}
                onChange={(e) => updateField('defaultExtensionDurationSeconds', Number(e.target.value))}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>أقصى عدد تمديدات افتراضي</label>
              <input
                type="number"
                min={0}
                dir="ltr"
                value={form.defaultMaxExtensions}
                onChange={(e) => updateField('defaultMaxExtensions', Number(e.target.value))}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>سبب حفظ الإعدادات للسجل الرقابي</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className={styles.input}
              />
            </div>

            <button type="button" disabled={saving} className={`${styles.btnPrimary} w-full mt-2`} onClick={saveAllSettings}>
              <Save size={16} />
              <span>{saving ? 'جارٍ الحفظ وتحديث الموقع…' : 'حفظ وتطبيق كافة إعدادات الموقع الآن'}</span>
            </button>
          </div>
        </section>
      </div>

      {/* 4. Feature Flags */}
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>مفاتيح التحكم التشغيلي بالميزات (Feature Flags)</h2>
            <p className={styles.panelDesc}>تفعيل أو إيقاف فوري لخصائص المنصة الحيوية مع توثيق كل تغيير في سجل التدقيق.</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {STANDARD_FLAGS.map((flagDef) => {
            const dbFlag = data.featureFlags.find((f) => f.key === flagDef.key);
            const isEnabled = dbFlag ? dbFlag.enabled : true;

            return (
              <div
                key={flagDef.key}
                className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--adm-border)] bg-[var(--adm-surface-soft)] p-4"
              >
                <div>
                  <div className="text-sm font-black">{flagDef.label}</div>
                  <div className="text-xs opacity-75 mt-0.5">{flagDef.description}</div>
                  <div className="font-mono text-[10.5px] opacity-55 mt-1" dir="ltr">
                    {flagDef.key}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={flagBusy === flagDef.key}
                  onClick={() => toggleFeatureFlag(flagDef.key, !isEnabled, flagDef.description)}
                  className={isEnabled ? styles.btnSuccess : styles.btnSecondary}
                >
                  {isEnabled ? <ToggleRight size={17} /> : <ToggleLeft size={17} />}
                  <span>{isEnabled ? 'مفعّل' : 'متوقف'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
