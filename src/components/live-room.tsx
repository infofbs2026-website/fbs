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
  Play,
  Trophy,
  UserCheck,
  Volume2,
  VolumeX,
  TrendingUp,
  History
} from 'lucide-react';
import { formatSar } from '@/lib/money';
import { SarSymbol, formatEnglishAmount } from '@/components/sar-symbol';
import type { AuctionSnapshot } from '@/modules/realtime/types';
import { sendJson, ApiError } from './forms';
import { statusLabels } from './ui';

type Pending = { amount: string; bidRequestId: string; expectedSequence: number };

interface BidHistoryItem {
  id: string;
  bidder: string;
  amount: string;
  timeAgo: string;
  isYou?: boolean;
}

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

  const [priceFlash, setPriceFlash] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [demoBiddingUnlocked, setDemoBiddingUnlocked] = useState(false);
  const [isEndedSimulated, setIsEndedSimulated] = useState(false);
  const [bidHistory, setBidHistory] = useState<BidHistoryItem[]>([
    {
      id: 'b-1',
      bidder: 'المزايد س*** 9',
      amount: '75000000',
      timeAgo: 'قبل 4 دقائق'
    },
    {
      id: 'b-2',
      bidder: 'المزايد ن*** 2',
      amount: '74500000',
      timeAgo: 'قبل 9 دقائق'
    },
    {
      id: 'b-3',
      bidder: 'المزايد ف*** 5',
      amount: '74000000',
      timeAgo: 'قبل 15 دقيقة'
    }
  ]);

  const sync = useRef({ at: 0, remaining: 0 });

  // Web Audio API Synthesizer (Crystal Chime)
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  const playVictoryFanfare = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.12);
        gain.gain.setValueAtTime(0.18, ctx.currentTime + index * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.12 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + index * 0.12);
        osc.stop(ctx.currentTime + index * 0.12 + 0.4);
      });
    } catch {}
  };

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
            /* Retry metadata is optional */
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
    const polling = setInterval(() => void refresh(), 1500);
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

  // Synchronize incoming bids from server across all connected browsers
  const prevBidRef = useRef<string | null>(null);
  useEffect(() => {
    if (!snapshot) return;
    if (prevBidRef.current && prevBidRef.current !== snapshot.currentBid) {
      setPriceFlash(true);
      setTimeout(() => setPriceFlash(false), 2000);
      playChime();
      setBidHistory((old) => [
        {
          id: `b-${snapshot.version || Date.now()}`,
          bidder: snapshot.highestBidderMasked || 'مزايد معتمد',
          amount: snapshot.currentBid,
          timeAgo: 'الآن',
          isYou: snapshot.highestBidderMasked?.includes('أنت')
        },
        ...old.filter((b) => b.amount !== snapshot.currentBid).slice(0, 4)
      ]);
    }
    prevBidRef.current = snapshot.currentBid;
  }, [snapshot?.currentBid, snapshot?.version, snapshot?.highestBidderMasked, soundEnabled]);

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

      setPriceFlash(true);
      setTimeout(() => setPriceFlash(false), 2500);
      playChime();

      setBidHistory((old) => [
        {
          id: `b-${Date.now()}`,
          bidder: 'أنت (مزايد معتمد)',
          amount: command.amount,
          timeAgo: 'الآن',
          isYou: true
        },
        ...old.slice(0, 4)
      ]);
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
        setMessage('تعذر التحقق من نتيجة الطلب. أعد المحاولة بنفس رقم الطلب.');
      }
    } finally {
      setBusy(false);
    }
  }

  const isEligibleToBid = signedIn || demoBiddingUnlocked;
  const canBid = Boolean(snapshot && snapshot.status === 'LIVE' && connected && isEligibleToBid && !pending);
  const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');

  // Quick increments options based on current minimum next bid
  const quickIncrements = [
    { label: 'الحد الأدنى', addMinor: 0n },
    { label: '+5,000', addMinor: 500000n },
    { label: '+10,000', addMinor: 1000000n },
    { label: '+25,000', addMinor: 2500000n }
  ];

  return (
    <section className="luxury-card p-6 sm:p-8 border-gold/40 shadow-2xl relative overflow-hidden">
      {/* Top Ambient Highlight */}
      <div className="pointer-events-none absolute -top-20 start-1/2 -translate-x-1/2 h-40 w-80 rounded-full bg-gold/15 blur-3xl" />

      {/* Header Status Bar: Connection, Audio Toggle & Auction State */}
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

          {/* Sound Toggle Button */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-600 hover:text-navy transition-colors text-[11px] font-bold"
            title={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
          >
            {soundEnabled ? (
              <>
                <Volume2 size={13} className="text-emerald-600" />
                <span className="hidden sm:inline">الصوت مفعل</span>
              </>
            ) : (
              <>
                <VolumeX size={13} className="text-slate-400" />
                <span className="hidden sm:inline">الصوت معطل</span>
              </>
            )}
          </button>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-lg bg-navy text-white px-3 py-1 font-bold text-[11px] shadow-xs">
          <Gavel size={12} className="text-gold" />
          <span>{snapshot ? statusLabels[snapshot.status] ?? snapshot.status : 'جارٍ المزامنة'}</span>
        </span>
      </div>

      {/* Main Bid Board: Highest Recorded Bid with Pulse Flash */}
      <div className={`rounded-2xl border transition-all duration-300 p-5 sm:p-6 text-center ${
        priceFlash
          ? 'border-gold bg-amber-50/90 shadow-[0_0_20px_rgba(217,184,127,0.4)]'
          : 'border-slate-200/90 bg-slate-50/90 shadow-[inset_0_2px_4px_rgba(15,23,42,0.04)]'
      }`}>
        <span className="block text-xs font-semibold text-slate-500">أعلى مزايدة مسجلة حاليًا</span>
        <div className="my-2 flex items-baseline justify-center gap-2 text-4xl sm:text-5xl font-black text-navy" dir="ltr">
          <span className="tabular-nums tracking-tight font-norwester font-black text-slate-950">
            {snapshot ? formatEnglishAmount(snapshot.currentBid) : '—'}
          </span>
          <SarSymbol className="w-7 h-7 text-gold-accent inline-block self-center" />
        </div>

        {snapshot?.highestBidderMasked && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1 text-xs font-bold text-gold-dark shadow-xs animate-fade-in">
            <UserCheck size={14} className="text-gold-accent" />
            <span>صاحب أعلى عرض: <strong className="font-norwester font-bold">{snapshot.highestBidderMasked}</strong></span>
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
            <span className={`rounded-md bg-slate-100 px-2 py-0.5 ${seconds < 600 ? 'text-red-600 animate-pulse' : 'text-gold-dark'}`}>
              {secs}
            </span>
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

      {/* Action Zone: Bid Submission or Registration or Demo Unlock */}
      {!signedIn && !demoBiddingUnlocked ? (
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-6 text-center space-y-3">
          <Lock size={28} className="mx-auto text-gold-accent" />
          <h3 className="text-sm font-bold text-navy">يلزم تسجيل الدخول للمشاركة في المزاد</h3>
          <p className="text-xs text-slate-500">سجّل دخولك لتفويض التأمين وتقديم مزايداتك المباشرة.</p>
          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <Link href="/login" className="btn btn-navy flex-1 text-xs font-bold py-3 shadow-md">
              تسجيل الدخول للمشاركة
            </Link>
            <button
              type="button"
              onClick={() => setDemoBiddingUnlocked(true)}
              className="btn btn-gold flex-1 text-xs font-black py-3 shadow-md flex items-center justify-center gap-1.5"
            >
              <Play size={14} />
              <span>تجربة المزايدة (وضع المعاينة)</span>
            </button>
          </div>
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
            disabled={!terms || !snapshot?.termsVersion || busy}
            onClick={async () => {
              setBusy(true);
              try {
                const r = await sendJson(`/api/v1/auctions/${auctionId}/register`, {
                  termsVersion: snapshot?.termsVersion ?? 'demo-terms'
                });
                setMessage(
                  r?.status === 'QUALIFIED'
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
      ) : isEndedSimulated ? (
        <div className="rounded-3xl border-2 border-gold/70 bg-gradient-to-b from-[#0a1224] via-[#060b17] to-[#0a1224] p-6 sm:p-8 text-center text-white shadow-[0_20px_60px_rgba(217,184,127,0.25)] relative overflow-hidden space-y-5 animate-fade-in">
          {/* Golden Ambient Glow */}
          <div className="pointer-events-none absolute -top-16 start-1/2 -translate-x-1/2 h-36 w-72 rounded-full bg-gold/20 blur-3xl" />

          <div className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/10 px-4 py-1.5 text-xs font-bold text-gold-light shadow-sm">
            <Trophy size={16} className="text-gold animate-bounce" />
            <span>جلسة المزاد اكتملت بنجاح · تمت الترسية الرسمية</span>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#fff3db] via-[#e2bd78] to-[#be903e]">
              👑 مبارك للفائز باللوحة الاستثنائية!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              رست اللوحة رسمياً على صاحب العرض الأعلى:{' '}
              <strong className="text-gold font-norwester text-sm sm:text-base">
                {snapshot?.highestBidderMasked || 'أنت (المزايد الفائز)'}
              </strong>
            </p>
          </div>

          {/* Final Winning Price Card */}
          <div className="rounded-2xl border border-gold/40 bg-white/5 p-4 max-w-sm mx-auto backdrop-blur-md shadow-inner">
            <span className="text-[11px] text-slate-400 block font-medium">سعر الترسية النهائي</span>
            <div className="mt-1 flex items-baseline justify-center gap-2 text-3xl sm:text-4xl font-black text-white" dir="ltr">
              <span className="font-norwester text-gold-light">
                {snapshot ? formatEnglishAmount(snapshot.currentBid) : '75,000,000'}
              </span>
              <SarSymbol className="w-6 h-6 text-gold inline-block self-center" />
            </div>
          </div>

          {/* Settlement & Absher Next Steps */}
          <div className="rounded-xl border border-slate-700/60 bg-[#0e172a]/70 p-4 text-start space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <ShieldCheck size={16} />
              <span>إجراءات التسوية ونقل الملكية الضامنة (Escrow):</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-300 list-disc list-inside leading-relaxed">
              <li>تم حجز وتأكيد محضر الترسية الإلكتروني برقم مرجعي معتمد.</li>
              <li>يُسدد المتبقي عبر الحساب البنكي الضامن المعتمد للمنصة خلال 48 ساعة.</li>
              <li>يتم نقل ملكية اللوحة فورياً وسلاسة عبر منصة أبشر المرور وإصدار رخصة السير.</li>
            </ul>
          </div>

          {/* Reset Demo Simulation Button */}
          <button
            type="button"
            onClick={() => {
              setIsEndedSimulated(false);
              setSeconds(3600);
            }}
            className="btn btn-gold w-full py-3.5 text-xs font-black shadow-lg flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} />
            <span>إعادة تشغيل المحاكاة والمزايدة مجدداً 🔄</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Simulation Notice Tag with Crown Winner Instant Trigger */}
          {demoBiddingUnlocked && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs font-bold text-amber-800">
              <span className="flex items-center gap-1.5">
                <Radio size={13} className="text-amber-600 animate-pulse" />
                <span>وضع المحاكاة المباشر نشط</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsEndedSimulated(true);
                  playVictoryFanfare();
                }}
                className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-black shadow-sm transition-all hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer"
              >
                <Trophy size={13} className="text-gold-light" />
                <span>إنهاء المزاد وتتويج الفائز الآن 🏆</span>
              </button>
            </div>
          )}

          {/* Next Minimum Bid Pill */}
          <div className="flex items-center justify-between rounded-xl bg-slate-100 p-3.5 text-xs font-semibold text-slate-700">
            <span>الحد الأدنى للمزايدة القادمة:</span>
            <div className="flex items-baseline gap-1 text-navy font-norwester text-sm font-black" dir="ltr">
              <span>{snapshot ? formatEnglishAmount(snapshot.minimumNextBid) : '—'}</span>
              <SarSymbol className="w-3.5 h-3.5 text-gold-accent inline-block self-center" />
            </div>
          </div>

          {/* Quick Bid Increments Grid */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-500 block">اختر قيمة المزايدة السريعة:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {quickIncrements.map((inc, idx) => {
                const targetAmount = snapshot
                  ? (BigInt(snapshot.minimumNextBid) + inc.addMinor).toString()
                  : '0';
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={!canBid || busy}
                    onClick={() => {
                      if (snapshot) {
                        void submit({
                          amount: targetAmount,
                          bidRequestId: crypto.randomUUID(),
                          expectedSequence: snapshot.sequence
                        });
                      }
                    }}
                    className={`rounded-xl border py-2.5 px-2 text-center transition-all cursor-pointer font-bold ${
                      idx === 0
                        ? 'border-gold bg-gold/15 text-navy hover:bg-gold/25 ring-1 ring-gold/40'
                        : 'border-slate-200 bg-white text-slate-800 hover:border-gold/60 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block text-[11px] text-slate-500 font-sans">{inc.label}</span>
                    <span className="font-norwester text-xs font-black text-navy" dir="ltr">
                      {formatEnglishAmount(targetAmount)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Big Confirm Bid Button */}
          <button
            className="btn btn-gold w-full py-4 text-sm font-black shadow-lg shadow-gold/25 hover:shadow-gold/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
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
            <Gavel size={16} />
            <span>{busy ? 'جارٍ تسجيل المزايدة…' : 'تأكيد المزايدة بالحد الأدنى الآن ⚡'}</span>
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

      {/* Live Public Bid Feed */}
      <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-3 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-navy">
            <History size={14} className="text-gold-accent" />
            <span>سجل آخر المزايدات المباشرة</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>تحديث فوري</span>
          </span>
        </div>

        <div className="space-y-2">
          {bidHistory.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between rounded-xl p-2.5 text-xs transition-all ${
                item.isYou
                  ? 'bg-emerald-500/10 border border-emerald-500/30 font-bold text-emerald-900'
                  : 'bg-white border border-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${item.isYou ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <span>{item.bidder}</span>
                {item.isYou && (
                  <span className="rounded-md bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-black text-emerald-800">
                    أنت
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-400 font-medium">{item.timeAgo}</span>
                <span className="font-norwester font-black text-navy text-xs" dir="ltr">
                  {formatEnglishAmount(item.amount)} ر.س
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status or Alert Feedback Toast */}
      {message && (
        <div
          role="status"
          className="mt-5 flex items-start gap-2.5 rounded-xl border border-gold/40 bg-gold/10 p-4 text-xs font-semibold leading-relaxed text-navy shadow-xs animate-fade-in"
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

      {/* Mobile Sticky Bid Bar for seamless smartphone UX */}
      {canBid && (
        <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0d1629]/95 border-t border-gold/40 p-3 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 animate-fade-in">
          <div>
            <span className="block text-[10px] text-slate-400">أعلى مزايدة</span>
            <div className="flex items-baseline gap-1 text-white font-norwester font-black text-base" dir="ltr">
              <span>{snapshot ? formatEnglishAmount(snapshot.currentBid) : '—'}</span>
              <SarSymbol className="w-3.5 h-3.5 text-gold inline-block self-center" />
            </div>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              if (snapshot) {
                void submit({
                  amount: snapshot.minimumNextBid,
                  bidRequestId: crypto.randomUUID(),
                  expectedSequence: snapshot.sequence
                });
              }
            }}
            className="btn btn-gold py-2.5 px-5 text-xs font-black shadow-md flex items-center gap-1.5"
          >
            <Gavel size={14} />
            <span>مزايدة {snapshot ? formatEnglishAmount(snapshot.minimumNextBid) : ''}</span>
          </button>
        </div>
      )}
    </section>
  );
}
