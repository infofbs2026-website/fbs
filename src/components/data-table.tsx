import { statusLabels, EmptyState } from './ui';

const labels: Record<string, string> = {
  id: 'المرجع',
  slug: 'الرابط',
  digits: 'الأرقام',
  verification_status: 'التحقق',
  listing_status: 'العرض',
  status: 'الحالة',
  amount_minor: 'المبلغ بالهللة',
  current_price: 'السعر بالهللة',
  sequence_no: 'التسلسل',
  created_at: 'تاريخ الإنشاء',
  accepted_at: 'وقت القبول',
  effective_end_at: 'النهاية',
  start_at: 'البداية',
  title: 'العنوان',
  body: 'التفاصيل',
  display_name: 'الاسم',
  auction_id: 'المزاد',
  plate_id: 'اللوحة',
  operation: 'العملية',
  bidder_alias: 'المزايد',
  expires_at: 'الصلاحية',
  action: 'الإجراء',
  entity_type: 'النوع',
  reason: 'السبب',
  key: 'المفتاح',
  value: 'القيمة',
  description: 'الوصف',
  title_ar: 'العنوان',
  body_ar: 'المحتوى',
  published: 'منشور',
  updated_at: 'آخر تحديث',
  outcome: 'النتيجة',
  winning_amount_minor: 'قيمة الفوز بالهللة',
  finalized_at: 'وقت الإغلاق'
};

export function DataTable({
  rows,
  columns,
  theme = 'light'
}: {
  rows: Record<string, unknown>[];
  columns?: string[];
  theme?: 'light' | 'dark';
}) {
  const isDark = theme === 'dark';

  if (!rows.length) {
    if (isDark) {
      return (
        <div className="flex min-h-60 flex-col items-center justify-center rounded-2xl border border-[#D9BB81]/28 bg-[#060E1B] p-8 text-center shadow-[inset_0_4px_10px_rgba(0,0,0,0.82),0_1px_0_rgba(255,255,255,0.08)]">
          <p className="text-base font-bold text-white">لا توجد سجلات مسجلة حتى الآن</p>
          <p className="mt-1.5 text-xs font-medium text-slate-300">ستظهر هنا تفاصيلك فور بدء النشاط أو التوثيق.</p>
        </div>
      );
    }
    return (
      <EmptyState
        title="لا توجد سجلات حتى الآن"
        description="ستظهر هنا سجلاتك الفعلية عند بدء الاستخدام."
      />
    );
  }

  const keys = columns ?? Object.keys(rows[0]);

  return (
    <div
      className={
        isDark
          ? 'max-w-full overflow-x-auto rounded-2xl border border-[#D9BB81]/30 bg-[#08162B] shadow-[inset_0_3px_8px_rgba(0,0,0,0.78),0_1px_0_rgba(255,255,255,0.08)]'
          : 'max-w-full overflow-x-auto rounded-2xl border border-[#E7E4DC] bg-white'
      }
    >
      <table className="w-full text-start text-sm">
        <thead
          className={
            isDark
              ? 'bg-[#14243C] border-b border-[#D9BB81]/28 text-[#FAEBD0]'
              : 'bg-paper text-navy'
          }
        >
          <tr>
            {keys.map((k) => (
              <th
                key={k}
                className="whitespace-nowrap p-4 text-start font-bold text-xs tracking-wider"
              >
                {labels[k] ?? k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={isDark ? 'divide-y divide-white/10 text-slate-100' : ''}>
          {rows.map((r, i) => (
            <tr
              key={String(r.id ?? r.key ?? i)}
              className={
                isDark
                  ? 'hover:bg-[#14243C]/65 transition-colors'
                  : 'border-t border-line hover:bg-slate-50/50'
              }
            >
              {keys.map((k) => (
                <td key={k} className="max-w-xs break-words p-4 text-xs leading-6">
                  {r[k] === null
                    ? '—'
                    : typeof r[k] === 'object'
                    ? JSON.stringify(r[k])
                    : typeof r[k] === 'boolean'
                    ? r[k]
                      ? 'نعم'
                      : 'لا'
                    : statusLabels[String(r[k])] ?? String(r[k] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
