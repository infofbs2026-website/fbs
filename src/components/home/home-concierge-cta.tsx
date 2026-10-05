import Link from 'next/link';
import { ArrowLeft, Headphones } from 'lucide-react';
import { ScrollReveal } from '@/components/home-motion';

export function HomeConciergeCta() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#edf2f8] to-[#e4ebf5] pb-20 sm:pb-28">
      <div className="container-fbs relative z-10">
        <ScrollReveal
          direction="up"
          delay={120}
          className="relative overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-br from-[#0c1527] via-[#09101f] to-[#040812] p-8 sm:p-12 lg:p-14 text-white shadow-2xl flex flex-col justify-center"
        >
          {/* Top gold accent line */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#d9b87f]/80 to-transparent pointer-events-none" />

          {/* Ambient background glows & aerospace grid */}
          <div className="absolute -top-28 end-0 h-80 w-80 rounded-full bg-gold/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-28 start-0 h-80 w-80 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 start-1/3 -translate-y-1/2 h-64 w-64 rounded-full bg-amber-500/5 blur-[90px] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12">
            <div className="max-w-xl flex flex-col items-center lg:items-start text-center lg:text-start">
              {/* Expanded Luxury Concierge Tag with Generous Padding */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-gold/45 bg-gradient-to-r from-gold/25 via-gold/15 to-amber-500/10 px-5 py-2 text-xs sm:text-sm font-black text-gold-light backdrop-blur-md shadow-[0_2px_14px_rgba(217,184,127,0.25)] mb-3.5 sm:mb-4 mx-auto lg:mx-0">
                <Headphones size={16} className="text-gold shrink-0" />
                <span className="tracking-wide">خدمة كونسيرج ومستشاري النخبة</span>
              </div>

              {/* Refined Balanced 2-Part Headline with Royal Gold Gradient */}
              <h3 className="text-xl sm:text-2xl lg:text-[28px] font-black text-white leading-snug tracking-tight text-center lg:text-start">
                هل ترغب في عرض لوحتك بالمزاد؟
                <span className="block mt-1.5 sm:mt-2 bg-gradient-to-r from-[#e7cb97] via-[#f7e6c4] to-[#cb9b48] bg-clip-text text-transparent">
                  أو تحتاج مساعدة استشارية متخصصة؟
                </span>
              </h3>
            </div>

            {/* 2 Buttons on Top, 1 Wide Full-Width Button on Bottom with Custom SVGs */}
            <div className="flex flex-col gap-3.5 sm:gap-4 w-full lg:w-[440px] shrink-0">
              {/* Top Row: 2 Buttons Side-by-Side */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                {/* Button 1: اعرض لوحتك الآن */}
                <Link
                  href="/sell-your-plate"
                  className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d9b87f] via-[#ecd5a5] to-[#cb9b48] px-3 sm:px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-black text-navy-deep shadow-[0_4px_20px_rgba(217,184,127,0.35)] transition-all duration-300 hover:shadow-[0_6px_28px_rgba(217,184,127,0.55)] hover:scale-[1.02] whitespace-nowrap"
                >
                  <svg
                    className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 text-navy-deep"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="5" width="20" height="14" rx="3" />
                    <line x1="8" y1="5" x2="8" y2="19" strokeDasharray="2 2" />
                    <path d="M14 9.5v5M11.5 12h5" />
                  </svg>
                  <span className="whitespace-nowrap">اعرض لوحتك</span>
                  <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1 shrink-0" />
                </Link>

                {/* Button 2: تحدث مع مستشار FBS */}
                <a
                  href="https://wa.me/966500000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 sm:px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:border-gold/60 hover:bg-gold/15 hover:text-gold-light hover:scale-[1.02] whitespace-nowrap"
                >
                  <svg
                    className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 text-[#25D366] transition-transform group-hover:scale-110"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span className="whitespace-nowrap">تحدث مع المستشار</span>
                </a>
              </div>

              {/* Bottom Row: 1 Button Spanning Combined Width - Streamlined Single Line */}
              <Link
                href="/faq"
                className="group flex items-center justify-center gap-2.5 rounded-xl border border-[#d9b87f]/35 bg-gradient-to-r from-[#0f172a] via-[#162238] to-[#0f172a] px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-black text-slate-200 shadow-md backdrop-blur-md transition-all duration-300 hover:border-gold/70 hover:text-gold-light hover:shadow-[0_4px_22px_rgba(217,184,127,0.22)]"
              >
                <svg
                  className="w-4.5 h-4.5 shrink-0 text-gold transition-transform group-hover:scale-110"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                  <path d="M6 6h10M6 10h10M6 14h6" />
                </svg>
                <span className="whitespace-nowrap">المركز المعرفي واللوائح المنظمة</span>
                <ArrowLeft size={15} className="text-gold/80 transition-transform group-hover:-translate-x-1 shrink-0" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
