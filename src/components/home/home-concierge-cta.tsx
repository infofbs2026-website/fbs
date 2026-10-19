import Link from 'next/link';
import { ArrowLeft, Headphones, MessageSquare, ShieldCheck, Zap } from 'lucide-react';
import { ScrollReveal } from '@/components/home-motion';

function SvgLuxuryPlateCrest({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="5" width="20" height="14" rx="3.5" stroke="currentColor" strokeWidth="2" />
      <line x1="8" y1="5" x2="8" y2="19" strokeDasharray="2 2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 9.5v5M11.5 12h5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function HomeConciergeCta() {
  return (
    <section className="relative overflow-hidden bg-[#050914] pt-6 pb-20 sm:pb-28">
      <div className="container-fbs relative z-10">
        <ScrollReveal
          direction="up"
          delay={120}
          className="relative overflow-hidden rounded-3xl border-2 border-gold/45 bg-gradient-to-br from-[#0e1830]/98 via-[#091122]/98 to-[#040814]/99 p-6 sm:p-10 lg:p-14 text-white shadow-[0_30px_70px_-15px_rgba(0,0,0,0.7),0_0_40px_rgba(217,184,127,0.15)] flex flex-col justify-center"
        >
          {/* Top Gold Shimmer Horizon Line */}
          <div className="absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#d9b87f] to-transparent pointer-events-none" />

          {/* Ambient Lighting & Glows */}
          <div className="absolute -top-32 end-0 h-96 w-96 rounded-full bg-gold/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 start-0 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-gold/5 blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-14">
            
            {/* Right Side (RTL Start): Commanding Headline & Executive Subtitle */}
            <div className="max-w-2xl flex flex-col items-center lg:items-start text-center lg:text-start">
              {/* Executive Concierge Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gradient-to-r from-gold/25 via-gold/15 to-transparent px-4 py-1.5 text-xs sm:text-sm font-black text-gold-light backdrop-blur-md shadow-[0_2px_14px_rgba(217,184,127,0.25)] mb-3.5 mx-auto lg:mx-0">
                <Headphones size={15} className="text-gold shrink-0" />
                <span className="tracking-wide">خدمة كونسيرج ومستشاري النخبة</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              </div>

              {/* High-Impact Royal Headline - White line on 1 line on mobile, Gold line compact */}
              <h2 className="leading-tight tracking-tight text-center lg:text-start w-full">
                <span className="block text-xl sm:text-3xl lg:text-[2.35rem] font-black text-white">
                  هل ترغب في عرض لوحتك بالمزاد؟
                </span>
                <span className="block mt-2 text-sm sm:text-lg lg:text-2xl font-bold bg-gradient-to-r from-[#faecd0] via-[#dfbe84] to-[#c79a49] bg-clip-text text-transparent leading-snug">
                  أو تبحث عن استشارة خاصة لاقتناء لوحة نادرة؟
                </span>
              </h2>

              {/* Sub-text emphasizing confidence and executive speed */}
              <p className="mt-3.5 text-xs sm:text-base text-slate-300 max-w-xl leading-relaxed font-medium text-center lg:text-start mx-auto lg:mx-0">
                مستشارو منصة FBS متاحون على مدار الساعة لتقديم الدعم التنفيذي المباشر، التقييم الاحترافي للقيمة السوقية، وتسهيل إجراءات التوثيق والإفراغ بأعلى درجات السرية والأمان.
              </p>

              {/* Trust Indicators Pill Row - Free from unverified Absher/Nafath claims */}
              <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-xs text-slate-300 font-bold">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.06] border border-white/10 px-3 py-1">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  توثيق رسمي وإشراف تنفيذي فوري
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.06] border border-white/10 px-3 py-1">
                  <Zap size={14} className="text-gold" />
                  حماية بنكية كاملة للضمان
                </span>
              </div>
            </div>

            {/* Left Side (RTL End): 2 High-Contrast, Dominant Action Buttons */}
            <div className="flex flex-col gap-4 w-full sm:w-[420px] lg:w-[380px] xl:w-[400px] shrink-0 mx-auto lg:mx-0">
              {/* Primary Action Button: اعرض لوحتك في المزاد الملكي */}
              <Link
                href="/sell-your-plate"
                className="group btn btn-gold h-14 sm:h-[58px] px-6 rounded-2xl flex items-center justify-center gap-3 text-sm sm:text-base font-black text-navy-deep shadow-[0_10px_30px_rgba(217,184,127,0.4)] hover:shadow-[0_15px_40px_rgba(217,184,127,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <SvgLuxuryPlateCrest className="w-5 h-5 text-navy-deep shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span className="whitespace-nowrap">اعرض لوحتك في المزاد الملكي</span>
                <ArrowLeft size={16} className="text-navy-deep transition-transform duration-300 group-hover:-translate-x-1 shrink-0" />
              </Link>

              {/* Secondary VIP Direct Line: تحدث مع مستشار FBS الخاص */}
              <a
                href="https://wa.me/966500000000"
                target="_blank"
                rel="noopener noreferrer"
                className="group h-14 sm:h-[58px] px-6 rounded-2xl border-2 border-gold/45 bg-gradient-to-r from-[#142038]/95 via-[#0e172a]/95 to-[#0a1222]/95 text-white hover:border-gold hover:bg-gold/20 hover:text-gold-light flex items-center justify-center gap-3 text-xs sm:text-sm font-black shadow-xl backdrop-blur-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <MessageSquare size={18} className="text-emerald-400 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span className="whitespace-nowrap">تحدث مع مستشار FBS الخاص</span>
                <ArrowLeft size={16} className="text-gold/80 transition-transform duration-300 group-hover:-translate-x-1 shrink-0" />
              </a>
            </div>

          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
