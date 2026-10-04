'use client';

import { useState, useMemo, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { PlateVisualizer } from './ui';
import { sendJson } from './forms';
import {
  CheckCircle2,
  ShieldCheck,
  UploadCloud,
  FileCheck,
  ArrowLeft,
  AlertCircle,
  Clock,
  Sparkles,
  FileText,
  Car,
  Lock
} from 'lucide-react';

type Ref = {
  id: string | number;
  name_ar?: string;
  arabic?: string;
  latin?: string;
};

export function SellerForm({
  letters,
  types,
  cities,
  isLoggedIn = true
}: {
  letters: Ref[];
  types: Ref[];
  cities: Ref[];
  isLoggedIn?: boolean;
}) {
  const [plateId, setPlateId] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState(false);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  // Live Visualizer State
  const [letter1, setLetter1] = useState<string>('');
  const [letter2, setLetter2] = useState<string>('');
  const [letter3, setLetter3] = useState<string>('');
  const [digits, setDigits] = useState<string>('');
  const [typeId, setTypeId] = useState<string>(types[0]?.id ? String(types[0].id) : '');
  const [cityId, setCityId] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>(null);

  // Derived plate representation for live preview
  const l1 = useMemo(() => letters.find((l) => String(l.id) === letter1), [letters, letter1]);
  const l2 = useMemo(() => letters.find((l) => String(l.id) === letter2), [letters, letter2]);
  const l3 = useMemo(() => letters.find((l) => String(l.id) === letter3), [letters, letter3]);

  const selectedTypeName = useMemo(() => {
    const found = types.find((t) => String(t.id) === typeId);
    return found?.name_ar || 'خصوصي';
  }, [types, typeId]);

  const previewLettersAr = useMemo(
    () => [l1?.arabic || 'ـ', l2?.arabic || 'ـ', l3?.arabic || 'ـ'],
    [l1, l2, l3]
  );
  const previewLettersEn = useMemo(
    () => [l1?.latin || '•', l2?.latin || '•', l3?.latin || '•'],
    [l1, l2, l3]
  );
  const previewNumbers = digits.trim() || '••••';

  // Rarity badge calculation
  const plateClassification = useMemo(() => {
    if (!digits) return null;
    if (digits.length === 1) return { label: 'لوحة أحادية ملكية (نخبة)', color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' };
    if (digits.length === 2 && digits[0] === digits[1]) return { label: 'لوحة ثنائية مكررة (VIP)', color: 'text-amber-400 bg-amber-400/10 border-amber-400/30' };
    if (digits.length === 2) return { label: 'لوحة ثنائية نادرة', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' };
    if (digits.length === 3 && digits[0] === digits[1] && digits[1] === digits[2]) return { label: 'لوحة ثلاثية متطابقة', color: 'text-blue-500 bg-blue-500/10 border-blue-500/30' };
    if (digits.length === 4 && digits[0] === digits[1] && digits[1] === digits[2] && digits[2] === digits[3]) return { label: 'لوحة رباعية متطابقة بالكامل', color: 'text-purple-500 bg-purple-500/10 border-purple-500/30' };
    return { label: 'لوحة سعودية مميزة', color: 'text-slate-600 bg-slate-100 border-slate-200' };
  }, [digits]);

  const currentStep = sent ? 3 : uploaded ? 3 : plateId ? 2 : 1;

  async function handleStep1Submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isLoggedIn) {
      setStatus('تسجيل الدخول مطلوب لحفظ مسودة اللوحة ورفع إثبات الملكية.');
      return;
    }
    setBusy(true);
    setStatus('');
    try {
      const data = await sendJson(
        '/api/v1/plates',
        Object.fromEntries(new FormData(e.currentTarget))
      );
      setPlateId(data.id);
      setStatus('تم حفظ مسودة اللوحة بنجاح. يرجى رفع مستند إثبات الملكية للمتابعة.');
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'تعذر حفظ بيانات اللوحة. يرجى مراجعة المدخلات.');
    } finally {
      setBusy(false);
    }
  }

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10485760) {
      setStatus('حجم المستند يتجاوز الحد المسموح (10 ميجابايت).');
      return;
    }
    setSelectedFile({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
    });
    setBusy(true);
    setStatus('جارٍ تأمين ورفع المستند إلى الخادم المشفر…');
    try {
      const upload = await sendJson(`/api/v1/plates/${plateId}/upload`, {
        mimeType: file.type,
        size: file.size
      });
      const response = await fetch(upload.signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file
      });
      if (!response.ok) throw new Error('تعذر رفع الملف إلى التخزين الآمن. أعد المحاولة.');
      await sendJson(`/api/v1/plates/${plateId}/document`, { path: upload.path });
      setUploaded(true);
      setStatus('تم رفع مستند الملكية وتأمينه بنجاح. يمكنك الآن مراجعة الطلب وإرساله.');
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'تعذر رفع المستند. يرجى التحقق من الاتصال.');
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmitReview() {
    setBusy(true);
    setStatus('');
    try {
      await sendJson(`/api/v1/plates/${plateId}/submit`, {});
      setSent(true);
      setStatus('أُرسل طلبك بنجاح للمراجعة والاعتماد. يمكنك متابعة حالته في لوحاتي.');
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'تعذر إرسال الطلب. حاول مجددًا.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* 3-Step Prestige Progress Bar */}
      <div className="rounded-3xl border-2 border-gold/40 bg-gradient-to-r from-[#18253f]/88 via-[#141f35]/90 to-[#101a2d]/88 backdrop-blur-xl p-5 sm:p-6 shadow-[0_15px_35px_-5px_rgba(16,23,40,0.18)]">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div
              className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full font-bold text-xs sm:text-sm transition-all ${
                plateId
                  ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : currentStep === 1
                  ? 'bg-gold text-[#101a2d] font-black shadow-md ring-4 ring-gold/25'
                  : 'bg-white/10 text-slate-400 border border-white/10'
              }`}
            >
              {plateId ? <CheckCircle2 size={18} /> : '1'}
            </div>
            <span
              className={`mt-2 text-[11px] sm:text-xs font-semibold ${
                currentStep >= 1 ? 'text-white font-black' : 'text-slate-400'
              }`}
            >
              بيانات اللوحة
            </span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div
              className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full font-bold text-xs sm:text-sm transition-all ${
                uploaded
                  ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : currentStep === 2
                  ? 'bg-gold text-[#101a2d] font-black shadow-md ring-4 ring-gold/25'
                  : 'bg-white/10 text-slate-400 border border-white/10'
              }`}
            >
              {uploaded ? <CheckCircle2 size={18} /> : '2'}
            </div>
            <span
              className={`mt-2 text-[11px] sm:text-xs font-semibold ${
                currentStep >= 2 ? 'text-white font-black' : 'text-slate-400'
              }`}
            >
              إثبات الملكية
            </span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div
              className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full font-bold text-xs sm:text-sm transition-all ${
                sent
                  ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : currentStep === 3
                  ? 'bg-gold text-[#101a2d] font-black shadow-md ring-4 ring-gold/25'
                  : 'bg-white/10 text-slate-400 border border-white/10'
              }`}
            >
              {sent ? <CheckCircle2 size={18} /> : '3'}
            </div>
            <span
              className={`mt-2 text-[11px] sm:text-xs font-semibold ${
                currentStep >= 3 ? 'text-white font-black' : 'text-slate-400'
              }`}
            >
              المراجعة والاعتماد
            </span>
          </div>
        </div>

        {/* Progress track line */}
        <div className="relative mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-gold via-gold-accent to-emerald-500 transition-all duration-500 ease-out"
            style={{
              width: sent ? '100%' : uploaded ? '70%' : plateId ? '40%' : '15%'
            }}
          />
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid gap-8 lg:grid-cols-12 items-stretch">
        {/* Left: Live Plate Visualizer Card (Equal Height & Twilight Royal Navy Styling with Glassmorphism) */}
        <div className="lg:col-span-5 order-first lg:order-last flex flex-col">
          <div className="rounded-3xl border-2 border-gold/40 bg-gradient-to-br from-[#18253f]/88 via-[#141f35]/90 to-[#101a2d]/88 backdrop-blur-xl p-6 sm:p-7 shadow-[0_20px_50px_-10px_rgba(16,23,40,0.22)] hover:border-gold/70 transition-all h-full flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-black text-gold">
                  <Sparkles size={15} />
                  <span>معاينة فورية حية للوحة</span>
                </span>
                {plateClassification && (
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${plateClassification.color}`}
                  >
                    {plateClassification.label}
                  </span>
                )}
              </div>

              {/* Skeuomorphic Die-Stamped Preview Pedestal */}
              <div className="rounded-2xl border border-white/10 bg-[#0c1322]/80 backdrop-blur-md p-5 sm:p-6 shadow-inner flex items-center justify-center">
                <PlateVisualizer
                  lettersAr={previewLettersAr}
                  lettersEn={previewLettersEn}
                  numbers={previewNumbers}
                  large={true}
                  plateType={selectedTypeName}
                />
              </div>

              {/* High-Contrast Specifications List */}
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-xs font-bold text-slate-300">فئة ونوع اللوحة:</span>
                  <span className="rounded-full bg-gold/20 border border-gold/40 px-3 py-0.5 text-xs font-black text-gold">
                    {selectedTypeName}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-xs font-bold text-slate-300">الحروف المعتمدة:</span>
                  <span className="text-base font-black text-white tracking-widest" dir="rtl">
                    {l1 && l2 && l3 ? `${l1.arabic}  ${l2.arabic}  ${l3.arabic}` : 'بانتظار التحديد…'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-xs font-bold text-slate-300">الأرقام:</span>
                  <span className="font-norwester text-xl font-black text-gold tracking-wider">
                    {digits || 'بانتظار الإدخال…'}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Luxury Features & Trust Indicators to Perfectly Balance Form Height */}
            <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 space-y-1.5 backdrop-blur-xs">
                <div className="flex items-center gap-2 text-xs font-black text-white">
                  <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                  <span>معايير الاعتماد المروري الرسمي</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300 font-medium">
                  يتم التحقق الفوري من صحة بيانات اللوحة وسجل المركبة عبر الأنظمة المعتمدة لضمان حقوق الملكية ونقلها بأمان عبر أبشر.
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium px-1">
                <span className="flex items-center gap-1.5">
                  <Lock size={12} className="text-gold" />
                  <span>تشفير المستندات 100%</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Car size={12} className="text-gold" />
                  <span>قياسات معتمدة 52×11 سم</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Left / Bottom: Step Content Forms */}
        <div className="lg:col-span-7">
          {!plateId ? (
            /* STEP 1: Form Fields */
            <div className="rounded-3xl border-2 border-gold/40 bg-gradient-to-br from-[#18253f]/88 via-[#141f35]/90 to-[#101a2d]/88 backdrop-blur-xl p-6 sm:p-9 shadow-[0_20px_50px_-10px_rgba(16,23,40,0.22)] hover:border-gold/70 transition-all h-full flex flex-col justify-between">
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-black text-white sm:text-2xl">1. بيانات ومواصفات اللوحة</h2>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-300 font-medium">
                    حدد الحروف والأرقام بدقة كما هي مدونة في رخصة السير الرسمية (الاستمارة).
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleStep1Submit}>
                  {/* 3 Letter Selectors */}
                  <div>
                    <label className="mb-2 flex items-center justify-between text-xs font-bold text-slate-200">
                      <span>حروف اللوحة بالترتيب (من اليمين إلى اليسار)</span>
                      <span className="text-[11px] text-slate-400 font-normal">3 حروف معتمدة</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { n: 1, val: letter1, set: setLetter1, label: 'الحرف الأول (يمين)' },
                        { n: 2, val: letter2, set: setLetter2, label: 'الحرف الثاني (وسط)' },
                        { n: 3, val: letter3, set: setLetter3, label: 'الحرف الثالث (يسار)' }
                      ].map(({ n, val, set, label }) => (
                        <div key={n} className="relative">
                          <select
                            name={`letter${n}`}
                            aria-label={label}
                            required
                            value={val}
                            onChange={(e) => set(e.target.value)}
                            className="w-full rounded-xl border-2 border-slate-700/80 bg-[#0c1424] px-3.5 py-3 text-sm font-semibold text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                          >
                            <option value="" disabled className="bg-[#141f35] text-slate-400">
                              {`الحرف ${n}`}
                            </option>
                            {letters.map((l) => (
                              <option value={l.id} key={l.id} className="bg-[#141f35] text-white">
                                {l.arabic} / {l.latin}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Digits & Type Grid */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="digits" className="mb-2 flex items-center justify-between text-xs font-bold text-slate-200">
                        <span>أرقام اللوحة</span>
                        <span className="text-[11px] text-slate-400 font-normal">1 – 4 أرقام</span>
                      </label>
                      <input
                        id="digits"
                        name="digits"
                        inputMode="numeric"
                        pattern="[0-9]{1,4}"
                        maxLength={4}
                        value={digits}
                        onChange={(e) => setDigits(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="مثال: 1 أو 77"
                        required
                        className="w-full rounded-xl border-2 border-slate-700/80 bg-[#0c1424] px-4 py-2.5 text-center font-mono text-base font-bold text-white tracking-wider placeholder-slate-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                        dir="ltr"
                      />
                      <p className="mt-1.5 text-[11px] text-slate-400">
                        أدخل الأرقام الإنجليزية (0-9).
                      </p>
                    </div>

                    <div>
                      <label htmlFor="typeId" className="mb-2 block text-xs font-bold text-slate-200">
                        نوع اللوحة
                      </label>
                      <select
                        name="typeId"
                        id="typeId"
                        required
                        value={typeId}
                        onChange={(e) => setTypeId(e.target.value)}
                        className="w-full rounded-xl border-2 border-slate-700/80 bg-[#0c1424] px-3.5 py-2.5 text-sm font-semibold text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                      >
                        <option value="" disabled className="bg-[#141f35] text-slate-400">
                          اختر نوع اللوحة
                        </option>
                        {types.map((t) => (
                          <option key={t.id} value={t.id} className="bg-[#141f35] text-white">
                            {t.name_ar}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* City & Description */}
                  <div>
                    <label htmlFor="cityId" className="mb-2 block text-xs font-bold text-slate-200">
                      المدينة المسجل بها المركبة
                    </label>
                    <select
                      name="cityId"
                      id="cityId"
                      required
                      value={cityId}
                      onChange={(e) => setCityId(e.target.value)}
                      className="w-full rounded-xl border-2 border-slate-700/80 bg-[#0c1424] px-3.5 py-2.5 text-sm font-semibold text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                    >
                      <option value="" disabled className="bg-[#141f35] text-slate-400">
                        اختر المدينة
                      </option>
                      {cities.map((c) => (
                        <option value={c.id} key={c.id} className="bg-[#141f35] text-white">
                          {c.name_ar}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="description" className="mb-2 flex items-center justify-between text-xs font-bold text-slate-200">
                      <span>ملاحظات إضافية أو وصف اللوحة (اختياري)</span>
                      <span className="text-[11px] text-slate-400">{description.length}/5000</span>
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      rows={3}
                      maxLength={5000}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="مثال: لوحة خصوصي نادرة برقم أحادي، جاهزة للنقل الفوري عبر منصة أبشر…"
                      className="w-full rounded-xl border-2 border-slate-700/80 bg-[#0c1424] p-3 text-sm leading-relaxed text-white placeholder-slate-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                    />
                  </div>

                  {/* Action CTA */}
                  {!isLoggedIn ? (
                    <div className="space-y-3">
                      <div className="rounded-xl border border-gold/30 bg-gold/10 p-3.5 text-xs text-gold-light leading-relaxed">
                        💡 يمكنك تجربة محاكي اللوحة واختيار الحروف والأرقام بحرية. لحفظ اللوحة ورفع مستندات الملكية، يلزم تسجيل الدخول.
                      </div>
                      <Link
                        href="/login?redirect=/sell-your-plate"
                        className="btn btn-gold w-full py-3.5 text-sm font-black shadow-lg"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <span>تسجيل الدخول لحفظ واعتماد اللوحة</span>
                          <ArrowLeft size={16} />
                        </span>
                      </Link>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-gold w-full py-3.5 text-sm font-black shadow-lg"
                      disabled={busy || !letters.length}
                    >
                      {busy ? (
                        <span className="flex items-center gap-2">
                          <Clock size={16} className="animate-spin" />
                          جارٍ حفظ المسودة…
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <span>حفظ والمتابعة إلى إثبات الملكية</span>
                          <ArrowLeft size={16} />
                        </span>
                      )}
                    </button>
                  )}
                </form>
              </div>
            </div>
          ) : !sent ? (
            /* STEP 2: Document Proof Upload */
            <div className="rounded-3xl border-2 border-gold/40 bg-gradient-to-br from-[#18253f]/88 via-[#141f35]/90 to-[#101a2d]/88 backdrop-blur-xl p-6 sm:p-9 shadow-[0_20px_50px_-10px_rgba(16,23,40,0.22)] hover:border-gold/70 transition-all h-full flex flex-col justify-between">
              <div>
                <div className="mb-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-3 py-1 text-xs font-bold text-gold">
                    <ShieldCheck size={14} />
                    توثيق أمني معتمد
                  </span>
                  <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">
                    2. مستند إثبات الملكية الرسمي
                  </h2>
                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-300 font-medium">
                    ارفع صورة واضحة من رخصة السير (الاستمارة) أو برنت منصة أبشر الذي يثبت ملكيتك
                    للوحة. هذا المستند مشفر وخاص باللجنة المختصة فقط ولن يتم عرضه للعامة إطلاقًا.
                  </p>
                </div>

                {/* Upload Dropzone */}
                <div className="space-y-5">
                  <div
                    className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                      uploaded
                        ? 'border-emerald-400 bg-emerald-500/10'
                        : 'border-slate-600 bg-white/5 hover:border-gold hover:bg-white/10'
                    }`}
                  >
                    {uploaded ? (
                      <div className="flex flex-col items-center">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
                          <FileCheck size={28} />
                        </span>
                        <h3 className="mt-3 text-sm font-bold text-white">
                          تم استلام المستند والتحقق المبدئي
                        </h3>
                        {selectedFile && (
                          <p className="mt-1 text-xs text-slate-300">
                            {selectedFile.name} ({selectedFile.size})
                          </p>
                        )}
                        <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                          <CheckCircle2 size={14} />
                          جاهز للمراجعة والاعتماد
                        </span>
                      </div>
                    ) : (
                      <label className="flex w-full cursor-pointer flex-col items-center justify-center">
                        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/20 text-gold transition-transform hover:scale-105">
                          <UploadCloud size={28} />
                        </span>
                        <span className="mt-3 text-sm font-bold text-white">
                          اضغط هنا لرفع المستند أو اسحبه إلى هذا المربع
                        </span>
                        <span className="mt-1 text-xs text-slate-400">
                          الملفات المدعومة: PDF, JPG, PNG (الحد الأقصى 10 ميجابايت)
                        </span>
                        <input
                          aria-label="مستند إثبات الملكية"
                          type="file"
                          accept="application/pdf,image/jpeg,image/png"
                          disabled={busy || uploaded}
                          onChange={handleFileUpload}
                          className="sr-only"
                        />
                      </label>
                    )}
                  </div>

                  {/* Security Guarantee Note */}
                  <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-slate-300 shadow-xs">
                    <Lock size={16} className="mt-0.5 shrink-0 text-gold" />
                    <p>
                      تلتزم منصة فارس بن سعود بحماية بياناتك وفق معايير الأمن السيبراني السعودية. لا
                      تتم مشاركة المستندات إلا مع فريق التدقيق المرخص للتحقق من مطابقة الملكية.
                    </p>
                  </div>

                  {/* Submit Final Action */}
                  <button
                    disabled={!uploaded || busy}
                    onClick={handleSubmitReview}
                    className="btn btn-gold w-full py-3.5 text-sm font-black shadow-lg disabled:opacity-40"
                  >
                    {busy ? (
                      <span className="flex items-center gap-2">
                        <Clock size={16} className="animate-spin" />
                        جارٍ اعتماد الطلب…
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <span>إرسال الطلب للاعتماد والمراجعة</span>
                        <ArrowLeft size={16} />
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* STEP 3: Royal Submission Success State */
            <div className="rounded-3xl border-2 border-emerald-400/50 bg-gradient-to-br from-[#18253f]/88 via-[#141f35]/90 to-[#101a2d]/88 backdrop-blur-xl p-8 sm:p-12 text-center shadow-2xl">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl ring-8 ring-emerald-500/20">
                <CheckCircle2 size={36} />
              </span>
              <h2 className="mt-5 text-2xl font-black text-white sm:text-3xl">
                تم استلام طلب لوحتك بنجاح!
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-200 font-medium">
                طلبك الآن قيد الفحص والتدقيق من قبل فريق الخبراء المعتمد. ستصلك إشعارات حالة
                المراجعة وتحديد موعد فتح المزاد في لوحة تحكم حسابك.
              </p>

              <div className="my-6 inline-flex items-center gap-2 rounded-xl border border-gold/30 bg-gold/10 px-4 py-2.5 text-xs font-semibold text-gold shadow-sm">
                <Clock size={15} className="text-gold" />
                <span>متوسط وقت المراجعة والاعتماد: أقل من 24 ساعة عمل</span>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link
                  className="btn btn-gold text-sm font-black shadow-md"
                  href="/account/plates"
                >
                  <span>متابعة لوحاتي في الحساب</span>
                  <ArrowLeft size={16} />
                </Link>
                <Link
                  className="btn border border-white/20 bg-white/10 text-white text-sm font-bold hover:bg-white/20"
                  href="/catalog"
                >
                  تصفح المزادات الحالية
                </Link>
              </div>
            </div>
          )}

          {/* Dynamic Status / Feedback Message */}
          {status && (
            <div
              role="status"
              className="mt-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs sm:text-sm leading-relaxed text-red-200 shadow-sm"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-400" />
              <span>{status}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
