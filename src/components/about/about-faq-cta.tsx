import React from 'react';
import Link from 'next/link';
import { Crown, MessageCircle, ArrowLeft } from 'lucide-react';

export function AboutFaqCta() {
  return (
    <section className="relative z-10 bg-paper pt-2 pb-12 sm:pb-16 text-navy">
      <div className="max-w-[1000px] mx-auto px-5 sm:px-8 lg:px-10">
        <div
          data-pf-audit="about-vip-cta"
          className="vip-cta-banner overflow-hidden p-6 sm:p-8 lg:p-9 rounded-2xl text-white"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"
          />

          <div className="relative z-10 flex flex-col items-center text-center lg:flex-row lg:items-center lg:justify-between lg:text-start gap-5 lg:gap-8">
            <div className="min-w-0 flex-1 flex flex-col items-center lg:items-start space-y-1.5 sm:space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/35 bg-gold/15 px-3.5 py-1.5 text-[11px] sm:text-[11.5px] font-bold text-gold-light">
                <Crown size={12} className="text-gold shrink-0" />
                <span>المكتب الخاص والوساطة VIP</span>
              </span>

              <h2 className="text-xl sm:text-2xl lg:text-[25px] font-black text-white tracking-tight">
                اعرض لوحتك أو وثّق صفقتك الخاصة
              </h2>

              <p className="text-xs sm:text-[13.5px] text-slate-300 font-normal">
                إدارة متكاملة للمزادات، العرض المباشر، والوساطة الخارجية بسرية تامة.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2.5 shrink-0">
              <Link
                href="/sell-your-plate"
                className="btn btn-gold text-xs sm:text-[13px] py-2.5 px-4.5 rounded-xl font-black group shadow-xs"
              >
                <span>اعرض لوحتك</span>
                <ArrowLeft
                  size={13}
                  className="shrink-0 transition-transform duration-200 group-hover:-translate-x-1"
                />
              </Link>

              <a
                href="https://wa.me/966500000000"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-vip-whatsapp text-xs sm:text-[13px] py-2.5 px-4.5 rounded-xl font-bold shadow-xs"
              >
                <MessageCircle size={14} className="shrink-0 text-emerald-400" />
                <span>تواصل عبر واتساب</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
