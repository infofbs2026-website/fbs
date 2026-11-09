'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, Download, Search, Trash2, X } from 'lucide-react';
import { SarPrice, formatEnglishAmount } from '@/components/sar-symbol';
import styles from '../admin-dashboard.module.css';
import {
  SETTLEMENT_STATUS_LABELS,
  callAdminManage,
  exportRowsToCsv,
  formatAdminDate,
} from '../helpers';
import type { AdminDashboardData, AdminSectionKey } from '../types';

interface FinanceAuditProps {
  section: Extract<AdminSectionKey, 'bids' | 'deposits' | 'payments' | 'settlements' | 'reports' | 'audit'>;
  data: AdminDashboardData;
  onNotify: (msg: string, kind?: 'success' | 'error') => void;
  onRequireMfa: () => void;
  onRefresh: () => void;
}

const SETTLEMENT_STAGES = [
  { value: 'WINNER_CONFIRMED', label: '1. تأكيد الفائز' },
  { value: 'PARTIES_CONTACTED', label: '2. التواصل مع البائع والمشتري' },
  { value: 'TRANSFER_IN_PROGRESS', label: '3. نقل الملكية عبر أبشر جارٍ' },
  { value: 'TRANSFER_CONFIRMED', label: '4. تأكيد نقل الاستمارة' },
  { value: 'COMPLETED', label: '5. مكتملة وصرف المستحقات' },
  { value: 'DISPUTED', label: 'نزاع قيد المعالجة' },
  { value: 'CANCELLED', label: 'إلغاء التسوية' },
] as const;

export function FinanceAuditSection({
  section,
  data,
  onNotify,
  onRequireMfa,
  onRefresh,
}: FinanceAuditProps) {
  const [query, setQuery] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  async function clearAuditLogs() {
    setClearing(true);
    const res = await callAdminManage({ action: 'audit.clear' });
    setClearing(false);
    if (!res.ok) {
      if (res.mfaRequired) onRequireMfa();
      onNotify(res.error || 'تعذر مسح سجل التدقيق.', 'error');
      return;
    }
    setClearConfirmOpen(false);
    onNotify(res.message || 'تم مسح سجل التدقيق بالكامل.');
    onRefresh();
  }

  async function updateSettlement(settlementId: string, status: string) {
    setBusyId(settlementId);
    const res = await callAdminManage({
      action: 'settlement.status',
      settlementId,
      status,
      reason: `تحديث مرحلة التسوية إلى (${status}) من الإدارة المالية`,
    });
    setBusyId(null);
    if (!res.ok) {
      if (res.mfaRequired) onRequireMfa();
      onNotify(res.error || 'تعذر تحديث التسوية.', 'error');
      return;
    }
    onNotify(res.message || 'تم تحديث مرحلة التسوية.');
    onRefresh();
  }

  const filteredAudit = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data.auditLogs;
    return data.auditLogs.filter((l) =>
      [l.action, l.entity_type, l.reason ?? '', l.actor_name].join(' ').toLowerCase().includes(q),
    );
  }, [data.auditLogs, query]);

  /* 1. SETTLEMENTS (ESCROW & OWNERSHIP TRANSFER) */
  if (section === 'settlements') {
    return (
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>إدارة التسويات المالية ونقل الملكية عبر أبشر ({data.settlements.length})</h2>
            <p className={styles.panelDesc}>
              تتبع مراحل الحساب الضامن (Escrow) من ترسية المزاد وحتى اكتمال نقل رخصة السير وتحويل مستحقات البائع.
            </p>
          </div>
        </div>

        {data.settlements.length === 0 ? (
          <div className={styles.emptyBox}>لا توجد تسويات مفتوحة حالياً؛ تُنشأ التسوية تلقائياً فور ترسية أي مزاد فائز.</div>
        ) : (
          <div className="space-y-3.5">
            {data.settlements.map((s) => {
              const st = SETTLEMENT_STATUS_LABELS[s.status] ?? { label: s.status, tone: 'slate' as const };
              return (
                <div
                  key={s.id}
                  className="rounded-2xl border border-[var(--adm-border)] bg-[var(--adm-surface-soft)] p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`${styles.badge} ${styles[`tone_${st.tone}`]}`}>{st.label}</span>
                        <strong className="text-sm">اللوحة: {s.plate_label}</strong>
                      </div>
                      <div className="text-xs opacity-75 mt-1">
                        البائع: <strong>{s.seller_name}</strong> • المشتري الفائز: <strong>{s.winner_name}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <div className="opacity-65">قيمة الترسية</div>
                        <div className="font-black text-sm">
                          <SarPrice amount={s.winning_amount_minor} />
                        </div>
                      </div>
                      <div>
                        <div className="opacity-65">عمولة المنصة</div>
                        <div className="font-bold">
                          <SarPrice amount={s.commission_minor} />
                        </div>
                      </div>
                      <div>
                        <div className="opacity-65">المتبقي للسداد</div>
                        <div className="font-bold">
                          <SarPrice amount={s.remaining_amount_minor} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 flex-wrap pt-2.5 border-t border-[var(--adm-border-subtle)]">
                    <span className="text-xs font-bold opacity-75">تحديث المرحلة التنفيذية:</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {SETTLEMENT_STAGES.map((stage) => (
                        <button
                          key={stage.value}
                          type="button"
                          disabled={busyId === s.id || s.status === stage.value}
                          onClick={() => updateSettlement(s.id, stage.value)}
                          className={`${styles.btnChip} ${
                            s.status === stage.value ? '!border-[#d9bb81] !text-[var(--adm-gold)]' : ''
                          }`}
                        >
                          {stage.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    );
  }

  /* 2. BIDS LEDGER */
  if (section === 'bids') {
    return (
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>دفتر المزايدات المالي غير القابل للتعديل ({data.bids.length})</h2>
            <p className={styles.panelDesc}>جميع العطاءات المسجلة بتسلسل رقمي صارم وتوقيت الخادم.</p>
          </div>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() =>
              exportRowsToCsv(
                'fbs-bids.csv',
                ['التسلسل', 'اللوحة', 'المزايد', 'المبلغ بالريال', 'وقت القبول'],
                data.bids.map((b) => [
                  b.sequence_no,
                  b.plate_label,
                  b.user_name,
                  formatEnglishAmount(b.amount_minor, true),
                  b.accepted_at,
                ]),
              )
            }
          >
            <Download size={14} />
            <span>تصدير CSV</span>
          </button>
        </div>

        {data.bids.length === 0 ? (
          <div className={styles.emptyBox}>لا توجد مزايدات مسجلة حتى الآن.</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>التسلسل</th>
                  <th>اللوحة</th>
                  <th>المزايد</th>
                  <th>قيمة العطاء</th>
                  <th>وقت القبول الرسمي</th>
                </tr>
              </thead>
              <tbody>
                {data.bids.map((b) => (
                  <tr key={b.id}>
                    <td className="font-mono font-bold">#{b.sequence_no}</td>
                    <td className="font-bold">{b.plate_label}</td>
                    <td>{b.user_name}</td>
                    <td className="font-black">
                      <SarPrice amount={b.amount_minor} />
                    </td>
                    <td className="text-xs opacity-75">{formatAdminDate(b.accepted_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    );
  }

  /* 3. DEPOSITS (PAYMENT AUTHORIZATIONS) */
  if (section === 'deposits') {
    return (
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>تفويضات التأمينات البنكية ({data.deposits.length})</h2>
            <p className={styles.panelDesc}>حجوزات مبالغ التأمين (Pre-Authorization Holds) وحالات الفك أو المصادرة.</p>
          </div>
        </div>

        {data.deposits.length === 0 ? (
          <div className={styles.emptyBox}>لا توجد تفويضات تأمين مسجلة حالياً.</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>العضو</th>
                  <th>اللوحة</th>
                  <th>المزوّد</th>
                  <th>مبلغ التفويض</th>
                  <th>المحصّل</th>
                  <th>الحالة</th>
                  <th>انتهاء الصلاحية</th>
                </tr>
              </thead>
              <tbody>
                {data.deposits.map((d) => (
                  <tr key={d.id}>
                    <td className="font-bold">{d.user_name}</td>
                    <td>{d.plate_label}</td>
                    <td className="font-mono text-xs">{d.provider}</td>
                    <td className="font-black">
                      <SarPrice amount={d.amount_minor} />
                    </td>
                    <td>
                      <SarPrice amount={d.captured_amount_minor} />
                    </td>
                    <td>
                      <span className={`${styles.badge} ${styles.tone_gold}`}>{d.status}</span>
                    </td>
                    <td className="text-xs opacity-75">{formatAdminDate(d.expires_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    );
  }

  /* 4. PAYMENT TRANSACTIONS */
  if (section === 'payments') {
    return (
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>سجل العمليات المالية المصرفية ({data.payments.length})</h2>
            <p className={styles.panelDesc}>عمليات التفويض، التحصيل، الإلغاء، والاسترداد عبر بوابة الدفع.</p>
          </div>
        </div>

        {data.payments.length === 0 ? (
          <div className={styles.emptyBox}>لا توجد حركات دفع مسجلة حتى الآن.</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>التاريخ</th>
                  <th>نوع العملية</th>
                  <th>المبلغ</th>
                  <th>الحالة</th>
                  <th>مرجع المزود</th>
                  <th>البيان</th>
                </tr>
              </thead>
              <tbody>
                {data.payments.map((tx) => (
                  <tr key={tx.id}>
                    <td className="text-xs opacity-75">{formatAdminDate(tx.created_at)}</td>
                    <td className="font-mono font-bold text-xs">{tx.operation}</td>
                    <td className="font-black">
                      <SarPrice amount={tx.amount_minor} />
                    </td>
                    <td>
                      <span
                        className={`${styles.badge} ${
                          tx.status === 'SUCCEEDED' ? styles.tone_emerald : styles.tone_amber
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="font-mono text-xs" dir="ltr">
                      {tx.provider_transaction_id || '—'}
                    </td>
                    <td className="text-xs opacity-80">{tx.reason || tx.error_code || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    );
  }

  /* 5. REPORTS (AUCTION RESULTS) */
  if (section === 'reports') {
    return (
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>تقارير نتائج المزادات المغلقة ({data.reports.length})</h2>
            <p className={styles.panelDesc}>ملخص ختامي لنتائج المزادات المنتهية وقيم الترسية المعتمدة.</p>
          </div>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() =>
              exportRowsToCsv(
                'fbs-auction-reports.csv',
                ['اللوحة', 'النتيجة', 'الفائز', 'مبلغ الترسية بالريال', 'عدد المزايدات', 'تاريخ الإغلاق'],
                data.reports.map((r) => [
                  r.plate_label,
                  r.outcome,
                  r.winner_name || '—',
                  r.winning_amount_minor ? formatEnglishAmount(r.winning_amount_minor, true) : '0',
                  r.final_sequence,
                  r.finalized_at,
                ]),
              )
            }
          >
            <Download size={14} />
            <span>تصدير التقرير CSV</span>
          </button>
        </div>

        {data.reports.length === 0 ? (
          <div className={styles.emptyBox}>لا توجد تقارير ختامية لمزادات مغلقة بعد.</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>اللوحة</th>
                  <th>النتيجة النهائية</th>
                  <th>الفائز</th>
                  <th>قيمة الترسية</th>
                  <th>إجمالي العطاءات</th>
                  <th>تاريخ الترسية</th>
                </tr>
              </thead>
              <tbody>
                {data.reports.map((r) => (
                  <tr key={r.id}>
                    <td className="font-bold">{r.plate_label}</td>
                    <td>
                      <span
                        className={`${styles.badge} ${
                          r.outcome === 'SOLD' ? styles.tone_emerald : styles.tone_amber
                        }`}
                      >
                        {r.outcome}
                      </span>
                    </td>
                    <td>{r.winner_name || '—'}</td>
                    <td className="font-black">
                      {r.winning_amount_minor ? <SarPrice amount={r.winning_amount_minor} /> : '—'}
                    </td>
                    <td className="font-mono">{r.final_sequence}</td>
                    <td className="text-xs opacity-75">{formatAdminDate(r.finalized_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    );
  }

  /* 6. IMMUTABLE AUDIT TRAIL */
  return (
    <div className="space-y-4">
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={15} className="opacity-60 shrink-0" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="بحث في سجل التدقيق حسب الإجراء أو المنفذ أو السبب…"
            className={styles.searchInput}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() =>
              exportRowsToCsv(
                'fbs-audit-log.csv',
                ['التاريخ', 'المنفذ', 'الإجراء', 'الكيان', 'السبب'],
                filteredAudit.map((l) => [l.created_at, l.actor_name, l.action, l.entity_type, l.reason || '']),
              )
            }
          >
            <Download size={14} />
            <span>تصدير CSV</span>
          </button>

          {data.auditLogs.length > 0 && (
            <button
              type="button"
              className={styles.btnDanger}
              onClick={() => setClearConfirmOpen(true)}
              title="مسح وتفريغ سجل التدقيق بالكامل"
            >
              <Trash2 size={14} />
              <span>مسح السجل</span>
            </button>
          )}
        </div>
      </div>

      <section className={styles.panel}>
        {filteredAudit.length === 0 ? (
          <div className={styles.emptyBox}>لا توجد سجلات في سجل التدقيق حالياً.</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>التاريخ والوقت</th>
                  <th>المنفّذ</th>
                  <th>الإجراء</th>
                  <th>الكيان</th>
                  <th>السبب الموثّق</th>
                </tr>
              </thead>
              <tbody>
                {filteredAudit.map((log) => (
                  <tr key={log.id}>
                    <td className="text-xs opacity-75 whitespace-nowrap">{formatAdminDate(log.created_at)}</td>
                    <td className="font-bold text-xs">{log.actor_name}</td>
                    <td>
                      <span className="font-mono text-xs font-extrabold text-[var(--gold)]">{log.action}</span>
                    </td>
                    <td className="font-mono text-xs">{log.entity_type}</td>
                    <td className="text-xs max-w-md truncate">{log.reason || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {clearConfirmOpen && (
        <div
          className={styles.modalBackdrop}
          role="dialog"
          aria-modal="true"
          aria-label="تأكيد مسح سجل التدقيق"
          onClick={() => !clearing && setClearConfirmOpen(false)}
        >
          <div
            className={styles.modalCard}
            style={{ maxWidth: 460 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleGroup}>
                <span className={`${styles.modalIconWrap} ${styles.modalIconWrapDanger}`}>
                  <AlertTriangle size={20} />
                </span>
                <div>
                  <h3 className={styles.modalTitle}>مسح سجل التدقيق بالكامل</h3>
                  <p className={styles.modalSubtitle}>
                    هل أنت متأكد من مسح جميع السجلات الحالية ({data.auditLogs.length} سجل)؟
                  </p>
                </div>
              </div>
              <button
                type="button"
                className={styles.iconBtn}
                disabled={clearing}
                onClick={() => setClearConfirmOpen(false)}
                aria-label="إغلاق"
              >
                <X size={16} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <p className="text-xs leading-relaxed text-[var(--muted)] m-0">
                سيتم تفريغ جدول سجل التدقيق الحالي وبدء التسجيل من جديد للعمليات القادمة فقط. يمكنك تصدير نسخة CSV قبل المسح إن رغبت.
              </p>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                disabled={clearing}
                className={styles.btnSecondary}
                onClick={() => setClearConfirmOpen(false)}
              >
                تراجع
              </button>
              <button
                type="button"
                disabled={clearing}
                className={styles.btnDanger}
                onClick={clearAuditLogs}
              >
                <Trash2 size={14} />
                <span>{clearing ? 'جارٍ المسح…' : 'تأكيد مسح السجل'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
