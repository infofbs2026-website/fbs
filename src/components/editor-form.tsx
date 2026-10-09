'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendJson } from './forms';
import { LoaderCircle, CheckCircle2, AlertCircle } from 'lucide-react';

export type EditorField = {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'textarea' | 'checkbox' | 'number' | 'datetime-local';
  options?: { value: string; label: string }[];
  value?: string;
  required?: boolean;
};

export function EditorForm({
  endpoint,
  fields,
  button = 'حفظ التعديلات',
  confirm = false,
  theme = 'light'
}: {
  endpoint: string;
  fields: EditorField[];
  button?: string;
  confirm?: boolean;
  theme?: 'light' | 'dark';
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  const isDark = theme === 'dark';

  return (
    <form
      className={
        isDark
          ? 'grid gap-5 sm:grid-cols-2 rounded-2xl border border-white/10 bg-[#091122]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl'
          : 'panel grid gap-5 sm:grid-cols-2'
      }
      onSubmit={async (e) => {
        e.preventDefault();
        if (confirm && !window.confirm('هل تؤكد تنفيذ الإجراء وحفظه في سجل التدقيق؟')) return;
        const form = new FormData(e.currentTarget);
        const body: Record<string, unknown> = Object.fromEntries(form);
        for (const f of fields) {
          if (f.type === 'checkbox') body[f.name] = form.get(f.name) === 'on';
          if (f.type === 'number') body[f.name] = Number(form.get(f.name));
          if (f.type === 'datetime-local' && form.get(f.name))
            body[f.name] = new Date(String(form.get(f.name))).toISOString();
        }
        setBusy(true);
        setError(false);
        try {
          const r = await sendJson(endpoint, body);
          setMessage(r?.message ?? 'تم حفظ التعديلات بنجاح.');
          router.refresh();
        } catch (e) {
          setError(true);
          setMessage(e instanceof Error ? e.message : 'تعذر الحفظ.');
        } finally {
          setBusy(false);
        }
      }}
    >
      {fields.map((f) => (
        <div className={f.type === 'textarea' ? 'sm:col-span-2' : ''} key={f.name}>
          <label
            className={
              isDark
                ? 'mb-2 block text-xs font-bold uppercase tracking-wider text-slate-200'
                : 'label'
            }
            htmlFor={f.name}
          >
            {f.label}
          </label>
          {f.options ? (
            <select
              className={
                isDark
                  ? 'w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm text-white focus:border-gold focus:bg-[#0f1d38] focus:outline-none focus:ring-1 focus:ring-gold transition-all'
                  : 'field'
              }
              id={f.name}
              name={f.name}
              required={f.required !== false}
              defaultValue={f.value ?? ''}
            >
              <option value="" disabled className={isDark ? 'bg-navy text-white' : ''}>
                اختر
              </option>
              {f.options.map((o) => (
                <option key={o.value} value={o.value} className={isDark ? 'bg-navy text-white' : ''}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : f.type === 'textarea' ? (
            <textarea
              id={f.name}
              name={f.name}
              className={
                isDark
                  ? 'w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-gold focus:bg-white/[0.1] focus:outline-none focus:ring-1 focus:ring-gold transition-all'
                  : 'field'
              }
              rows={6}
              defaultValue={f.value}
              required={f.required !== false}
            />
          ) : (
            <input
              id={f.name}
              name={f.name}
              type={f.type ?? 'text'}
              defaultValue={f.value}
              required={f.type === 'checkbox' ? false : f.required !== false}
              className={
                f.type === 'checkbox'
                  ? 'h-5 w-5 accent-gold rounded cursor-pointer'
                  : isDark
                  ? 'w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-gold focus:bg-white/[0.1] focus:outline-none focus:ring-1 focus:ring-gold transition-all'
                  : 'field'
              }
              step={f.type === 'number' ? '1' : undefined}
            />
          )}
        </div>
      ))}
      <button
        disabled={busy}
        className={
          isDark
            ? 'btn btn-gold sm:col-span-2 py-3.5 font-black text-navy shadow-lg shadow-gold/20 hover:shadow-gold/35 transition-all'
            : 'btn btn-navy sm:col-span-2'
        }
      >
        {busy ? (
          <span className="flex items-center justify-center gap-2">
            <LoaderCircle size={18} className="animate-spin" />
            <span>جارٍ الحفظ…</span>
          </span>
        ) : (
          button
        )}
      </button>
      {message && (
        <div
          role={error ? 'alert' : 'status'}
          className={`sm:col-span-2 flex items-center gap-2 p-3.5 rounded-xl text-xs sm:text-sm font-semibold border ${
            isDark
              ? error
                ? 'border-red-500/30 bg-red-950/40 text-red-300'
                : 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300'
              : error
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          {error ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{message}</span>
        </div>
      )}
    </form>
  );
}
