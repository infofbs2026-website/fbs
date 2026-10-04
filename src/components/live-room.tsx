'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Gavel,
  Info,
  Lock,
  Radio,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserCheck
} from 'lucide-react';
import { formatSar } from '@/lib/money';
import { SarSymbol } from '@/components/sar-symbol';
import type { AuctionSnapshot } from '@/modules/realtime/types';
import { sendJson, ApiError } from './forms';
import { statusLabels } from './ui';

type Pending = { amount: string; bidRequestId: string; expectedSequence: number };

export function LiveRoom({
  auctionId,
  signedIn
}: {
  auctionId: string;
  signedIn: boolean;
}) {
  const [snapshot, setSnapshot] = useState<AuctionSnapshot | null>(null);
  const [connected, setConnected] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [terms, setTerms] = useState(false);
  const [pending, setPending] = useState<Pending | null>(null);

  const sync = useRef({ at: 0, remaining: 0 });

  useEffect(() => {
    let stopped = false;
    const controller = new AbortController();
    let fetching = false;
    let restored = false;

    const refresh = async () => {
      if (fetching) return;
      fetching = true;
      const start = performance.now();
      try {
        const r = await fetch(`/api/v1/auctions/${auctionId}/snapshot`, {
          cache: 'no-store',
          signal: controller.signal
        });
        const j = await r.json();
        if (!stopped && !restored) {
          restored = true;
          try {
            const saved = sessionStorage.getItem(`fbs:pending:${auctionId}`);
            if (saved) {
              const data = JSON.parse(saved);
              if (
                typeof data.amount === 'string' &&
                typeof data.bidRequestId === 'string' &&
                Number.isInteger(data.expectedSequence)
              ) {
                setPending(data);
              }
            }
          } catch {
            /* Retry metadata is optional, never auction authority. */
          }
        }
        if (!r.ok || !j.data) throw new Error('unavailable');
        if (!stopped) {
          const s = j.data as AuctionSnapshot;
          setSnapshot((old) => (old && old.version > s.version ? old : s));
          sync.current = {
            at: performance.now(),
            remaining: Math.max(
              0,
              new Date(s.effectiveEndAt).getTime() -
                new Date(s.serverTime).getTime() -
                (performance.now() - start) / 2
            )
          };
          setConnected(true);
        }
      } catch {
        if (!stopped) setConnected(false);
      } finally {
        fetching = false;
      }
    };

    void refresh();
    const polling = setInterval(() => void refresh(), 5000);
    const tick = setInterval(() => {
      setSeconds(
        Math.ceil(
          Math.max(0, sync.current.remaining - (performance.now() - sync.current.at)) / 1000
        )
      );
      if (performance.now() - sync.current.at > 10000) setConnected(false);
    }, 1000);

    return () => {
      stopped = true;
      controller.abort();
      clearInterval(polling);
      clearInterval(tick);
    };
  }, [auctionId]);

  async function submit(command: Pending) {
    setBusy(true);
    setMessage('جارٍ التحقق من المزايدة وتوثيقها على الخادم…');
    setPending(command);
    try {
      sessionStorage.setItem(`fbs:pending:${auctionId}`, JSON.stringify(command));
    } catch {}
    try {
      const result = await sendJson(`/api/v1/auctions/${auctionId}/bids`, command);
      setSnapshot(result);
      setMessage('تهانينا! قُبلت مزايدتك بنجاح وسُجلت على سجل المزاد الرسمي.');
      setPending(null);
      sessionStorage.removeItem(`fbs:pending:${auctionId}`);
    } catch (error) {
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        setPending(null);
        sessionStorage.removeItem(`fbs:pending:${auctionId}`);
        setMessage(error.message);
        return;
      }
      try {
        const r = await fetch(`/api/v1/bids/${command.bidRequestId}`);
        const j = await r.json();
        if (r.ok && j.data?.resolved) {
          setSnapshot(j.data.result);
          setPending(null);
          sessionStorage.removeItem(`fbs:pending:${auctionId}`);
          setMessage('تم التحقق: المزايدة مقبولة ومسجلة.');
        } else {
          setMessage(
            `${error instanceof Error ? error.message : 'انقطع الاتصال.'} يمكنك إعادة التحقق بنفس رقم الطلب.`
          );
        }
      } catch {
        setMessage('تعذر التحقق من نتيجة الطلب. لا نفترض نجاحه أو فشله. أعد المحاولة بنفس رقم الطلب.');
      }
    } finally {
      setBusy(false);
    }
  }

  const canBid = Boolean(snapshot && snapshot.status === 'LIVE' && connected && signedIn && !pending);
  const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');

  return (
    <section className="luxury-card p-6 sm:p-8 border-gold/40 shadow-2xl relative overflow-hidden">
      {/* Top Ambient Highlight */}
      <div className="pointer-events-none absolute -top-20 start-1/2 -translate-x-1/2 h-40 w-80 rounded-full bg-gold/15 blur-3xl" />

      {/* Header Status Bar: Connection & Auction State */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 text-xs">
        <div className="flex items-center gap-2">
          {connected ? (
            <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse-live shadow-[0_0_6px_#10b981]" />
              <span>متصل بالخادم · بث مباشر</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-500/20">
              <RefreshCw size={13} className="animate-spin text-amber-600" />
              <span>جارٍ مزامنة الوقت…</span>
            </span>
          )}
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-lg bg-navy text-white px-3 py-1 font-bold text-[11px] shadow-xs">
          <Gavel size={12} className="text-gold" />
          <span>{snapshot ? statusLabels[snapshot.status] ?? snapshot.status : 'جارٍ المزامنة'}</span>
        </span>
      </div>

      {/* Main Bid Board: Highest Recorded Bid */}
      <div className="rounded-2xl border border-slate-200/90 bg-slate-50/90 p-5 sm:p-6 text-center shadow-[inset_0_2px_4px_rgba(15,23,42,0.04)]">
        <span className="block text-xs font-semibold text-slate-500">أعلى مزايدة مسجلة حاليًا</span>
        <div className="my-2 flex items-baseline justify-center gap-2 text-4xl sm:text-5xl font-black text-navy" dir="ltr">
          <span className="tabular-nums tracking-tight font-norwester font-black text-slate-950">
            {snapshot ? formatSar(snapshot.currentBid) : '—'}
          </span>
          <SarSymbol className="w-7 h-7 text-gold-accent inline-block self-center" />
        </div>

        {snapshot?.highestBidderMasked && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1 text-xs font-bold text-gold-dark shadow-xs">
            <UserCheck size={14} className="text-gold-accent" />
            <span>صاحب أعلى عرض: <strong className="font-norwester">{snapshot.highestBidderMasked}</strong></span>
          </div>
        )}
      </div>

      {/* Countdown Clock & Bid Count Bar */}
      <div className="my-6 grid grid-cols-2 gap-4 rounded-2xl border border-slate-100 bg-white p-4 text-center">
        <div>
          <span className="block text-[11px] font-medium text-slate-400">الوقت المتبقي للجلسة</span>
          <div className="mt-1 flex items-center justify-center gap-1 font-norwester text-2xl font-black text-slate-900" dir="ltr">
            <span className="rounded-md bg-slate-100 px-2 py-0.5">{hours}</span>
            <span>:</span>
            <span className="rounded-md bg-slate-100 px-2 py-0.5">{minutes}</span>
            <span>:</span>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-gold-dark">{secs}</span>
          </div>
        </div>

        <div>
          <span className="block text-[11px] font-medium text-slate-400">إجمالي المزايدات</span>
          <div className="mt-1 flex items-center justify-center gap-1.5 text-2xl font-black text-navy font-norwester">
            <Gavel size={18} className="text-gold-accent" />
            <span>{snapshot?.bidCount ?? '—'}</span>
            <span className="text-xs font-semibold text-slate-400 font-sans">مزايدة</span>
          </div>
        </div>
      </div>

      {/* Action Zone: Bid Submission or Registration */}
      {!signedIn ? (
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-6 text-center space-y-3">
          <Lock size={28} className="mx-auto text-gold-accent" />
          <h3 className="text-sm font-bold text-navy">يلزم تسجيل الدخول للمشاركة في المزاد</h3>
          <p className="text-xs text-slate-500">سجّل دخولك لتفويض التأمين وتقديم مزايداتك المباشرة.</p>
          <Link href="/login" className="btn btn-navy w-full text-xs font-bold py-3 mt-2 shadow-md">
            تسجيل الدخول للمشاركة
          </Link>
        </div>
      ) : snapshot?.status === 'REGISTRATION_OPEN' ? (
        <div className="rounded-2xl border border-gold/30 bg-gold/5 p-6 space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-navy">
            <Trophy size={18} className="text-gold-accent" />
            <span>التسجيل مفتوح لهذا المزاد</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            للتأهيل والمشاركة في الجلسة المباشرة، يُرجى الاطلاع على الشروط وتفويض مبلغ التأمين.
          </p>
          <label className="flex items-start gap-3 text-xs leading-6 text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-gold focus:ring-gold"
            />
            <span>
              اطلعت على{' '}
              <Link className="underline font-bold text-navy hover:text-gold" href="/auction-policy">
                شروط وسياسة المزادات
              </Link>{' '}
              وأوافق عليها وألتزم بالسداد عند الفوز.
            </span>
          </label>

          <button
            className="btn btn-gold w-full text-xs font-black py-3.5 shadow-md shadow-gold/25"
            disabled={!terms || !snapshot.termsVersion || busy}
            onClick={async () => {
              setBusy(true);
              try {
                const r = await sendJson(`/api/v1/auctions/${auctionId}/register`, {
                  termsVersion: snapshot.termsVersion
                });
                setMessage(
                  r.status === 'QUALIFIED'
                    ? 'تم التسجيل بنجاح! أنت الآن مؤهل للمزايدة الحية.'
                    : 'حُفظ التسجيل. التأهيل ينتظر استكمال التأمين عند تفعيل بوابة الدفع.'
                );
              } catch (e) {
                setMessage(e instanceof Error ? e.message : 'تعذر التسجيل.');
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? 'جارٍ التسجيل…' : 'تأكيد التسجيل ودخول المزاد'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Next Minimum Bid Pill */}
          <div className="flex items-center justify-between rounded-xl bg-slate-100 p-3.5 text-xs font-semibold text-slate-700">
            <span>الحد الأدنى للمزايدة القادمة:</span>
            <strong className="text-navy font-norwester text-sm">
              {snapshot ? formatSar(snapshot.minimumNextBid) : '—'}
            </strong>
          </div>

          {/* Confirm Bid Button */}
          <button
            className="btn btn-gold w-full py-4 text-sm font-black shadow-lg shadow-gold/25 hover:shadow-gold/40 active:scale-[0.98] transition-all"
            disabled={!canBid || busy}
            onClick={() => {
              if (
                snapshot &&
                window.confirm(`هل تؤكد المزايدة بمبلغ ${formatSar(snapshot.minimumNextBid)}؟`)
              ) {
                void submit({
                  amount: snapshot.minimumNextBid,
                  bidRequestId: crypto.randomUUID(),
                  expectedSequence: snapshot.sequence
                });
              }
            }}
          >
            {busy ? 'جارٍ تسجيل المزايدة…' : 'تأكيد المزايدة الآن ⚡'}
          </button>

          {pending && (
            <button
              disabled={busy}
              className="w-full text-center text-xs font-bold text-amber-700 underline hover:text-amber-900"
              onClick={() => void submit(pending)}
            >
              إعادة التحقق من الطلب المعلق بنفس الرقم
            </button>
          )}
        </div>
      )}

      {/* Status or Alert Feedback Toast */}
      {message && (
        <div
          role="status"
          className="mt-5 flex items-start gap-2.5 rounded-xl border border-gold/40 bg-gold/10 p-4 text-xs font-semibold leading-relaxed text-navy shadow-xs"
        >
          <Info size={16} className="shrink-0 text-gold-accent mt-0.5" />
          <span>{message}</span>
        </div>
      )}

      {/* Safety & Anti-Sniping Footnote */}
      <div className="mt-6 border-t border-slate-100 pt-4 flex items-start gap-2 text-[11px] leading-relaxed text-slate-400">
        <ShieldCheck size={16} className="shrink-0 text-emerald-600 mt-0.5" />
        <span>
          نظام مزايدة محمي ومسجل على الخادم. ميزة منع القنص نشطة: المزايدات في اللحظات الأخيرة تمدد وقت المزاد تلقائيًا لضمان عدالة المنافسة.
        </span>
      </div>
    </section>
  );
}

