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
  Eye,
  FileText,
  Car,
  Lock,
  Sparkles,
  Plus,
  MapPin
} from 'lucide-react';

type Ref = {
  id: string | number;
  name_ar?: string;
  arabic?: string;
  latin?: string;
};

const EXTRA_SAUDI_CITIES: Ref[] = [
  { id: 'riyadh', name_ar: 'الرياض' },
  { id: 'jeddah', name_ar: 'جدة' },
  { id: 'makkah', name_ar: 'مكة المكرمة' },
  { id: 'madinah', name_ar: 'المدينة المنورة' },
  { id: 'dammam', name_ar: 'الدمام' },
  { id: 'khobar', name_ar: 'الخبر' },
  { id: 'dhahran', name_ar: 'الظهران' },
  { id: 'taif', name_ar: 'الطائف' },
  { id: 'buraidah', name_ar: 'بريدة' },
  { id: 'unaizah', name_ar: 'عنيزة' },
  { id: 'tabuk', name_ar: 'تبوك' },
  { id: 'abha', name_ar: 'أبها' },
  { id: 'khamis_mushait', name_ar: 'خميس مشيط' },
  { id: 'hail', name_ar: 'حائل' },
  { id: 'jazan', name_ar: 'جازان' },
  { id: 'najran', name_ar: 'نجران' },
  { id: 'jubail', name_ar: 'الجبيل' },
  { id: 'yanbu', name_ar: 'ينبع' },
  { id: 'ahsa', name_ar: 'الأحساء' },
  { id: 'hafar_albatin', name_ar: 'حفر الباطن' },
  { id: 'kharj', name_ar: 'الخرج' },
  { id: 'qatif', name_ar: 'القطيف' },
  { id: 'baha', name_ar: 'الباحة' },
  { id: 'sakaka', name_ar: 'سكاكا (الجوف)' },
  { id: 'arar', name_ar: 'عرعر' },
  { id: 'qurayyat', name_ar: 'القريات' },
  { id: 'bisha', name_ar: 'بيشة' },
  { id: 'rass', name_ar: 'الرس' },
  { id: 'zulfi', name_ar: 'الزلفي' },
  { id: 'majmaah', name_ar: 'المجمعة' },
  { id: 'dawadmi', name_ar: 'الدوادمي' },
  { id: 'wadi_aldawasir', name_ar: 'وادي الدواسر' },
  { id: 'qunfudhah', name_ar: 'القنفذة' },
  { id: 'rabigh', name_ar: 'رابغ' },
  { id: 'qilwah', name_ar: 'قلوة' }
];

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
  const [cityList, setCityList] = useState<Ref[]>(() => {
    const existingNames = new Set(cities.map((c) => String(c.name_ar ?? '').trim()));
    return [
      ...cities,
      ...EXTRA_SAUDI_CITIES.filter((c) => !existingNames.has(String(c.name_ar ?? '').trim()))
    ];
  });
  const [cityId, setCityId] = useState<string>('');
  const [isAddingCity, setIsAddingCity] = useState<boolean>(false);
  const [customCityName, setCustomCityName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>(null);

  function handleAddCustomCity() {
    const trimmed = customCityName.trim();
    if (!trimmed) return;
    const existing = cityList.find(
      (c) => String(c.name_ar ?? '').trim() === trimmed || String(c.id) === trimmed
    );
    if (existing) {
      setCityId(String(existing.id));
    } else {
      const newCity: Ref = { id: trimmed, name_ar: trimmed };
      setCityList((prev) => [...prev, newCity]);
      setCityId(trimmed);
    }
    setCustomCityName('');
    setIsAddingCity(false);
  }

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

  // Rarity badge calculation using the Personal Luxury warm gold/emerald palette
  const plateClassification = useMemo(() => {
    if (!digits) return null;
    if (digits.length === 1) {
      return {
        label: 'لوحة أحادية ملكية (نخبة)',
        color: 'text-[#8C6B2D] bg-[#FAF7F0] border-[#9E7B35]/50'
      };
    }
    if (digits.length === 2 && digits[0] === digits[1]) {
      return {
        label: 'لوحة ثنائية مكررة (VIP)',
        color: 'text-[#8C6B2D] bg-[#FAF7F0] border-[#D9BB81]/60'
      };
    }
    if (digits.length === 2) {
      return {
        label: 'لوحة ثنائية نادرة',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
      };
    }
    if (digits.length === 3 && digits[0] === digits[1] && digits[1] === digits[2]) {
      return {
        label: 'لوحة ثلاثية متطابقة',
        color: 'text-[#14243C] bg-[#F4F2EC] border-[#D9BB81]/50'
      };
    }
    if (
      digits.length === 4 &&
      digits[0] === digits[1] &&
      digits[1] === digits[2] &&
      digits[2] === digits[3]
    ) {
      return {
        label: 'لوحة رباعية متطابقة بالكامل',
        color: 'text-[#14243C] bg-[#F4F2EC] border-[#D9BB81]/50'
      };
    }
    return {
      label: 'لوحة سعودية مميزة',
      color: 'text-[#526071] bg-[#FAF9F6] border-[#E7E5DF]'
    };
  }, [digits]);

  const currentStep = sent ? 3 : uploaded ? 3 : plateId ? 2 : 1;

  const stepsMeta = [
    {
      num: '01',
      stepLabel: 'الخطوة الأولى',
      title: 'بيانات اللوحة',
      done: Boolean(plateId),
      active: currentStep === 1,
      Icon: Car
    },
    {
      num: '02',
      stepLabel: 'الخطوة الثانية',
      title: 'إثبات الملكية',
      done: Boolean(uploaded),
      active: currentStep === 2,
      Icon: FileText
    },
    {
      num: '03',
      stepLabel: 'الخطوة الثالثة',
      title: 'المراجعة والاعتماد',
      done: Boolean(sent),
      active: currentStep === 3,
      Icon: ShieldCheck
    }
  ];

  async function handleStep1Submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isLoggedIn) {
      setStatus('تسجيل الدخول مطلوب لحفظ مسودة اللوحة ورفع إثبات الملكية.');
      return;
    }
    const payload = Object.fromEntries(new FormData(e.currentTarget));
    if (isAddingCity && customCityName.trim()) {
      const trimmed = customCityName.trim();
      payload.cityId = trimmed;
      handleAddCustomCity();
    }
    if (!payload.cityId) {
      setStatus('يرجى اختيار المدينة المسجل بها المركبة أو إضافة مدينة جديدة.');
      return;
    }
    setBusy(true);
    setStatus('');
    try {
      const data = await sendJson('/api/v1/plates', payload);
      setPlateId(data.id);
      setStatus('تم حفظ مسودة اللوحة بنجاح. يرجى رفع مستند إثبات الملكية للمتابعة.');
    } catch (err) {
      setStatus(
        err instanceof Error ? err.message : 'تعذر حفظ بيانات اللوحة. يرجى مراجعة المدخلات.'
      );
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
    <div className="space-y-7 sm:space-y-8">
      {/* 3-Step Interactive Milestone Track (Modeled after HomeHowItWorks) */}
      <div className="relative mx-auto max-w-3xl pt-1">
        {/* Connecting Rail */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-6 right-[16.66%] left-[16.66%] z-0 h-[2px] overflow-hidden rounded-full bg-[#D9BB81]/35"
        >
          {/* Active Progress Fill */}
          <div
            className="h-full bg-[#9E7B35] transition-all duration-700 ease-out"
            style={{
              width: sent ? '100%' : uploaded ? '100%' : plateId ? '50%' : '0%'
            }}
          />
          {/* Travelling Gold Beam */}
          <div className="animate-travel-beam-rtl absolute inset-y-0 w-1/3 bg-gradient-to-l from-transparent via-[#9E7B35] to-transparent" />
        </div>

        {/* 3 Milestone Nodes */}
        <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-4">
          {stepsMeta.map((step) => {
            const StepIcon = step.Icon;
            return (
              <div key={step.num} className="flex flex-col items-center text-center">
                <div
                  className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-500 ease-out ${
                    step.done
                      ? 'border-emerald-500/70 bg-emerald-50 text-emerald-600 shadow-xs'
                      : step.active
                      ? 'scale-105 border-[#9E7B35] bg-white text-[#8C6B2D] shadow-[0_4px_16px_rgba(158,123,53,0.22)]'
                      : 'border-[#E2E0D8] bg-white text-[#64748B] shadow-xs'
                  }`}
                >
                  {step.done ? (
                    <CheckCircle2 size={20} strokeWidth={2.3} />
                  ) : (
                    <StepIcon size={19} strokeWidth={step.active ? 2.2 : 1.8} />
                  )}
                  {step.active && !step.done && (
                    <span className="pointer-events-none absolute -inset-1.5 rounded-2xl border border-[#9E7B35]/30 animate-pulse" />
                  )}
                </div>

                <span
                  className={`mt-2 pf-type-micro font-bold transition-colors duration-300 ${
                    step.active
                      ? 'text-[#9E7B35]'
                      : step.done
                      ? 'text-emerald-700'
                      : 'text-[#64748B]'
                  }`}
                >
                  {step.stepLabel}
                </span>
                <span
                  className={`mt-0.5 pf-type-caption font-bold transition-colors duration-300 ${
                    step.active || step.done ? 'text-[#14243C]' : 'text-[#526071]'
                  }`}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid gap-6 lg:gap-7 lg:grid-cols-12 items-stretch">
        {/* Live Plate Visualizer Card (HomeHowItWorks White Surface & Warm Ivory Pedestal) */}
        <div
          data-pf-audit="seller-preview-card"
          style={{ containerType: 'inline-size' }}
          className="lg:col-span-5 order-first lg:order-last flex flex-col"
        >
          <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[#E7E5DF] bg-white p-5 sm:p-6 shadow-[0_4px_16px_rgba(20,36,60,0.04)] transition-all duration-300 hover:border-[#D9BB81]/80 hover:shadow-[0_12px_28px_rgba(20,36,60,0.08)]">
            {/* Top Specular Gold Hairline */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-6 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#9E7B35]/60 to-transparent"
            />

            <div>
              {/* Card Header */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#9E7B35]/40 bg-[#FAF7F0] text-[#8C6B2D] shadow-xs">
                    <Eye size={17} strokeWidth={2} />
                  </span>
                  <div>
                    <h3 className="pf-type-h3 font-bold text-[#14243C]">
                      معاينة فورية حية للوحة
                    </h3>
                    <p className="pf-type-micro font-medium text-[#64748B]">
                      محاكاة مطابقة للقياس السعودي الرسمي
                    </p>
                  </div>
                </div>

                {plateClassification && (
                  <span
                    className={`rounded-lg border px-2.5 py-1 pf-type-micro font-bold ${plateClassification.color}`}
                  >
                    {plateClassification.label}
                  </span>
                )}
              </div>

              {/* Warm Ivory Recessed Plate Pedestal */}
              <div className="flex items-center justify-center rounded-2xl border border-[#E5E2D9] bg-gradient-to-b from-[#FAF9F6] via-[#F1EEE7] to-[#E9E5DD] p-4 sm:p-5 shadow-[inset_0_2px_6px_rgba(20,36,60,0.05)]">
                <PlateVisualizer
                  lettersAr={previewLettersAr}
                  lettersEn={previewLettersEn}
                  numbers={previewNumbers}
                  large={true}
                  plateType={selectedTypeName}
                />
              </div>

              {/* Clean Specification Rows */}
              <div className="mt-5 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECE9E2] pb-2.5">
                  <span className="pf-type-caption font-bold text-[#526071]">
                    فئة ونوع اللوحة:
                  </span>
                  <span className="rounded-lg border border-[#D9BB81]/50 bg-[#FAF7F0] px-3 py-0.5 pf-type-micro font-black text-[#8C6B2D]">
                    {selectedTypeName}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECE9E2] pb-2.5">
                  <span className="pf-type-caption font-bold text-[#526071]">
                    الحروف المعتمدة:
                  </span>
                  <span
                    className="pf-type-body font-black tracking-widest text-[#14243C]"
                    dir="rtl"
                  >
                    {l1 && l2 && l3
                      ? `${l1.arabic}  ${l2.arabic}  ${l3.arabic}`
                      : 'بانتظار التحديد…'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECE9E2] pb-2.5">
                  <span className="pf-type-caption font-bold text-[#526071]">الأرقام:</span>
                  <span className="font-norwester pf-type-h3 font-black tracking-wider text-[#9E7B35]">
                    {digits || 'بانتظار الإدخال…'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Guarantee Box & Verification Strip */}
            <div className="mt-5 space-y-3 border-t border-[#ECE9E2] pt-4">
              <div className="space-y-1.5 rounded-xl border border-[#E7E5DF] bg-[#FAF9F6] p-3.5">
                <div className="flex items-center gap-2 pf-type-caption font-bold text-[#14243C]">
                  <ShieldCheck size={16} className="shrink-0 text-emerald-600" />
                  <span>معايير الاعتماد المروري الرسمي</span>
                </div>
                <p className="pf-type-micro font-medium leading-relaxed text-[#526071]">
                  يتم التحقق الفوري من صحة بيانات اللوحة وسجل المركبة عبر الأنظمة المعتمدة لضمان
                  حقوق الملكية ونقلها بأمان عبر منصة أبشر.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 px-1 pf-type-micro font-bold text-[#64748B]">
                <span className="flex items-center gap-1.5">
                  <Lock size={13} className="text-[#9E7B35]" />
                  <span>تشفير المستندات 100%</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Car size={13} className="text-[#9E7B35]" />
                  <span>قياسات معتمدة 52×11 سم</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Step Content Forms (HomeHowItWorks Active Step Card Styling) */}
        <div className="lg:col-span-7">
          {!plateId ? (
            /* STEP 1: Form Fields */
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[#9E7B35]/60 bg-white p-5 sm:p-7 shadow-[0_12px_28px_rgba(20,36,60,0.06)]">
              {/* Top Specular Gold Hairline */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-6 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#9E7B35] to-transparent"
              />

              <div>
                {/* Step Card Header */}
                <div className="mb-6 flex items-start justify-between gap-3 border-b border-[#ECE9E2] pb-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#9E7B35]/40 bg-[#FAF7F0] text-[#8C6B2D] shadow-xs">
                      <Car size={20} strokeWidth={2} />
                    </div>
                    <div>
                      <span className="inline-block rounded-lg border border-[#D9BB81]/50 bg-[#FAF7F0] px-2.5 py-0.5 pf-type-micro font-bold text-[#8C6B2D]">
                        الخطوة الأولى
                      </span>
                      <h2 className="mt-1.5 pf-type-h2 font-black text-[#14243C]">
                        بيانات ومواصفات اللوحة
                      </h2>
                      <p className="mt-1 pf-type-body font-medium text-[#526071]">
                        حدد الحروف والأرقام بدقة كما هي مدونة في رخصة السير الرسمية (الاستمارة).
                      </p>
                    </div>
                  </div>
                  <span className="font-norwester select-none text-2xl font-black tracking-wider text-[#9E7B35]/30">
                    01
                  </span>
                </div>

                <form className="space-y-5" onSubmit={handleStep1Submit}>
                  {/* 3 Letter Selectors */}
                  <div>
                    <label className="mb-2 flex flex-wrap items-center justify-between gap-1 pf-type-caption font-bold text-[#14243C]">
                      <span>حروف اللوحة بالترتيب (من اليمين إلى اليسار)</span>
                      <span className="pf-type-micro font-semibold text-[#8C6B2D]">
                        3 حروف معتمدة
                      </span>
                    </label>
                    <div className="grid grid-cols-1 min-[380px]:grid-cols-3 gap-2.5 sm:gap-3">
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
                            className="w-full rounded-xl border border-[#DFDBD2] bg-[#FAF9F6] px-3.5 py-2.5 text-sm font-bold text-[#14243C] transition-all hover:border-[#D9BB81] hover:bg-white focus:border-[#9E7B35] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D9BB81]/25"
                          >
                            <option value="" disabled className="bg-white text-[#64748B]">
                              {`الحرف ${n}`}
                            </option>
                            {letters.map((l) => (
                              <option value={l.id} key={l.id} className="bg-white text-[#14243C]">
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
                      <label
                        htmlFor="digits"
                        className="mb-2 flex items-center justify-between pf-type-caption font-bold text-[#14243C]"
                      >
                        <span>أرقام اللوحة</span>
                        <span className="pf-type-micro font-semibold text-[#64748B]">
                          1 – 4 أرقام
                        </span>
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
                        className="w-full rounded-xl border border-[#DFDBD2] bg-[#FAF9F6] px-4 py-2.5 text-center font-mono text-base font-bold tracking-wider text-[#14243C] placeholder-[#94A3B8] transition-all hover:border-[#D9BB81] hover:bg-white focus:border-[#9E7B35] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D9BB81]/25"
                        dir="ltr"
                      />
                      <p className="mt-1.5 pf-type-micro font-medium text-[#64748B]">
                        أدخل الأرقام الإنجليزية (0-9).
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="typeId"
                        className="mb-2 block pf-type-caption font-bold text-[#14243C]"
                      >
                        نوع اللوحة
                      </label>
                      <select
                        name="typeId"
                        id="typeId"
                        required
                        value={typeId}
                        onChange={(e) => setTypeId(e.target.value)}
                        className="w-full rounded-xl border border-[#DFDBD2] bg-[#FAF9F6] px-3.5 py-2.5 text-sm font-bold text-[#14243C] transition-all hover:border-[#D9BB81] hover:bg-white focus:border-[#9E7B35] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D9BB81]/25"
                      >
                        <option value="" disabled className="bg-white text-[#64748B]">
                          اختر نوع اللوحة
                        </option>
                        {types.map((t) => (
                          <option key={t.id} value={t.id} className="bg-white text-[#14243C]">
                            {t.name_ar}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* City & Description */}
                  <div>
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <label
                        htmlFor="cityId"
                        className="pf-type-caption font-bold text-[#14243C]"
                      >
                        المدينة المسجل بها المركبة
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsAddingCity((prev) => !prev)}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#D9BB81]/60 bg-[#FAF7F0] px-2.5 py-1 pf-type-micro font-bold text-[#8C6B2D] transition-all hover:border-[#9E7B35] hover:bg-white hover:text-[#14243C]"
                      >
                        <Plus size={13} strokeWidth={2.5} />
                        <span>{isAddingCity ? 'العودة لقائمة المدن' : 'إضافة مدينة أخرى'}</span>
                      </button>
                    </div>

                    <select
                      name="cityId"
                      id="cityId"
                      required={!isAddingCity}
                      value={cityId}
                      onChange={(e) => {
                        if (e.target.value === '__other__') {
                          setIsAddingCity(true);
                        } else {
                          setCityId(e.target.value);
                          setIsAddingCity(false);
                        }
                      }}
                      className="w-full rounded-xl border border-[#DFDBD2] bg-[#FAF9F6] px-3.5 py-2.5 text-sm font-bold text-[#14243C] transition-all hover:border-[#D9BB81] hover:bg-white focus:border-[#9E7B35] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D9BB81]/25"
                    >
                      <option value="" disabled className="bg-white text-[#64748B]">
                        اختر المدينة من القائمة ({cityList.length} مدينة)
                      </option>
                      {cityList.map((c) => (
                        <option value={c.id} key={c.id} className="bg-white text-[#14243C]">
                          {c.name_ar}
                        </option>
                      ))}
                      <option value="__other__" className="bg-[#FAF7F0] font-bold text-[#8C6B2D]">
                        + مدينة أخرى (إدخال مدينة جديدة)...
                      </option>
                    </select>

                    {isAddingCity && (
                      <div className="mt-2.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-xl border border-[#D9BB81]/70 bg-[#FAF7F0] p-3">
                        <div className="relative flex-1">
                          <MapPin
                            size={15}
                            className="pointer-events-none absolute top-1/2 start-3 -translate-y-1/2 text-[#8C6B2D]"
                          />
                          <input
                            type="text"
                            value={customCityName}
                            onChange={(e) => setCustomCityName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddCustomCity();
                              }
                            }}
                            placeholder="أدخل اسم المدينة (مثال: شقراء، العلا، الخفجي...)"
                            className="w-full rounded-lg border border-[#DFDBD2] bg-white ps-9 pe-3 py-2 text-sm font-bold text-[#14243C] placeholder-[#94A3B8] focus:border-[#9E7B35] focus:outline-none focus:ring-2 focus:ring-[#D9BB81]/25"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddCustomCity}
                          disabled={!customCityName.trim()}
                          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#14243C] px-4 py-2 pf-type-micro font-bold text-white shadow-xs transition-all hover:bg-[#08162B] disabled:opacity-45"
                        >
                          <Plus size={14} />
                          <span>إضافة واعتماد المدينة</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="mb-2 flex items-center justify-between pf-type-caption font-bold text-[#14243C]"
                    >
                      <span>ملاحظات إضافية أو وصف اللوحة (اختياري)</span>
                      <span className="pf-type-micro font-medium text-[#64748B]">
                        {description.length}/5000
                      </span>
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      rows={3}
                      maxLength={5000}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="مثال: لوحة خصوصي نادرة برقم أحادي، جاهزة للنقل الفوري عبر منصة أبشر…"
                      className="w-full rounded-xl border border-[#DFDBD2] bg-[#FAF9F6] p-3 text-sm font-medium leading-relaxed text-[#14243C] placeholder-[#94A3B8] transition-all hover:border-[#D9BB81] hover:bg-white focus:border-[#9E7B35] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D9BB81]/25"
                    />
                  </div>

                  {/* Action CTA */}
                  {!isLoggedIn ? (
                    <div className="space-y-3 pt-1">
                      <div className="flex items-start gap-2.5 rounded-xl border border-[#D9BB81]/50 bg-[#FAF7F0] p-3.5 pf-type-micro font-medium leading-relaxed text-[#526071]">
                        <Sparkles size={15} className="mt-0.5 shrink-0 text-[#9E7B35]" />
                        <span>
                          يمكنك تجربة محاكي اللوحة واختيار الحروف والأرقام بحرية. لحفظ اللوحة ورفع
                          مستندات الملكية، يلزم تسجيل الدخول.
                        </span>
                      </div>
                      <Link
                        href="/login?redirect=/sell-your-plate"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#14243C] px-6 py-3.5 pf-type-caption font-bold text-white shadow-[0_6px_18px_rgba(20,36,60,0.16)] transition-all hover:bg-[#08162B]"
                      >
                        <span>تسجيل الدخول لحفظ واعتماد اللوحة</span>
                        <ArrowLeft size={16} />
                      </Link>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#14243C] px-6 py-3.5 pf-type-caption font-bold text-white shadow-[0_6px_18px_rgba(20,36,60,0.16)] transition-all hover:bg-[#08162B] disabled:opacity-50"
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
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[#9E7B35]/60 bg-white p-5 sm:p-7 shadow-[0_12px_28px_rgba(20,36,60,0.06)]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-6 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#9E7B35] to-transparent"
              />

              <div>
                <div className="mb-6 flex items-start justify-between gap-3 border-b border-[#ECE9E2] pb-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#9E7B35]/40 bg-[#FAF7F0] text-[#8C6B2D] shadow-xs">
                      <FileText size={20} strokeWidth={2} />
                    </div>
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#D9BB81]/50 bg-[#FAF7F0] px-2.5 py-0.5 pf-type-micro font-bold text-[#8C6B2D]">
                        <ShieldCheck size={13} />
                        الخطوة الثانية · توثيق أمني معتمد
                      </span>
                      <h2 className="mt-1.5 pf-type-h2 font-black text-[#14243C]">
                        مستند إثبات الملكية الرسمي
                      </h2>
                      <p className="mt-1 pf-type-body font-medium leading-relaxed text-[#526071]">
                        ارفع صورة واضحة من رخصة السير (الاستمارة) أو برنت منصة أبشر الذي يثبت
                        ملكيتك للوحة. المستند مشفر وخاص باللجنة المختصة فقط.
                      </p>
                    </div>
                  </div>
                  <span className="font-norwester select-none text-2xl font-black tracking-wider text-[#9E7B35]/30">
                    02
                  </span>
                </div>

                {/* Upload Dropzone */}
                <div className="space-y-5">
                  <div
                    className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-7 sm:p-8 text-center transition-all ${
                      uploaded
                        ? 'border-emerald-500/60 bg-emerald-50/70'
                        : 'border-[#D9BB81]/70 bg-[#FAF9F6] hover:border-[#9E7B35] hover:bg-[#FAF7F0]'
                    }`}
                  >
                    {uploaded ? (
                      <div className="flex flex-col items-center">
                        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
                          <FileCheck size={28} />
                        </span>
                        <h3 className="mt-3 pf-type-h3 font-bold text-[#14243C]">
                          تم استلام المستند والتحقق المبدئي
                        </h3>
                        {selectedFile && (
                          <p className="mt-1 pf-type-micro font-medium text-[#526071]">
                            {selectedFile.name} ({selectedFile.size})
                          </p>
                        )}
                        <span className="mt-2 inline-flex items-center gap-1 pf-type-micro font-bold text-emerald-700">
                          <CheckCircle2 size={14} />
                          جاهز للمراجعة والاعتماد
                        </span>
                      </div>
                    ) : (
                      <label className="flex w-full cursor-pointer flex-col items-center justify-center">
                        <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#9E7B35]/40 bg-white text-[#8C6B2D] shadow-xs transition-transform hover:scale-105">
                          <UploadCloud size={26} />
                        </span>
                        <span className="mt-3 pf-type-caption font-bold text-[#14243C]">
                          اضغط هنا لرفع المستند أو اسحبه إلى هذا المربع
                        </span>
                        <span className="mt-1 pf-type-micro font-medium text-[#64748B]">
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
                  <div className="flex items-start gap-3 rounded-xl border border-[#E7E5DF] bg-[#FAF9F6] p-4 pf-type-micro font-medium leading-relaxed text-[#526071]">
                    <Lock size={16} className="mt-0.5 shrink-0 text-[#9E7B35]" />
                    <p>
                      تلتزم منصة فارس بن سعود بحماية بياناتك وفق معايير الأمن السيبراني السعودية. لا
                      تتم مشاركة المستندات إلا مع فريق التدقيق المرخص للتحقق من مطابقة الملكية.
                    </p>
                  </div>

                  {/* Submit Final Action */}
                  <button
                    disabled={!uploaded || busy}
                    onClick={handleSubmitReview}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#14243C] px-6 py-3.5 pf-type-caption font-bold text-white shadow-[0_6px_18px_rgba(20,36,60,0.16)] transition-all hover:bg-[#08162B] disabled:opacity-40"
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
            /* STEP 3: Submission Success State */
            <div className="relative overflow-hidden rounded-2xl border border-emerald-500/60 bg-white p-7 sm:p-10 text-center shadow-[0_12px_28px_rgba(20,36,60,0.06)]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-6 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
              />
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md ring-8 ring-emerald-500/15">
                <CheckCircle2 size={34} />
              </span>
              <h2 className="mt-5 pf-type-h2 font-black text-[#14243C]">
                تم استلام طلب لوحتك بنجاح!
              </h2>
              <p className="mx-auto mt-2 max-w-md pf-type-body font-medium leading-relaxed text-[#526071]">
                طلبك الآن قيد الفحص والتدقيق من قبل فريق الخبراء المعتمد. ستصلك إشعارات حالة
                المراجعة وتحديد موعد فتح المزاد في لوحة تحكم حسابك.
              </p>

              <div className="my-6 inline-flex items-center gap-2 rounded-xl border border-[#D9BB81]/50 bg-[#FAF7F0] px-4 py-2.5 pf-type-micro font-bold text-[#8C6B2D]">
                <Clock size={15} className="text-[#9E7B35]" />
                <span>متوسط وقت المراجعة والاعتماد: أقل من 24 ساعة عمل</span>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#14243C] px-6 py-3 pf-type-caption font-bold text-white shadow-sm transition-all hover:bg-[#08162B]"
                  href="/account/plates"
                >
                  <span>متابعة لوحاتي في الحساب</span>
                  <ArrowLeft size={16} />
                </Link>
                <Link
                  className="inline-flex items-center justify-center rounded-xl border border-[#E7E5DF] bg-[#FAF9F6] px-6 py-3 pf-type-caption font-bold text-[#14243C] transition-all hover:border-[#D9BB81] hover:bg-white"
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
              className="mt-5 flex items-start gap-3 rounded-xl border border-[#D9BB81]/60 bg-[#FAF7F0] p-4 pf-type-caption font-medium leading-relaxed text-[#14243C] shadow-xs"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-[#9E7B35]" />
              <span>{status}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
