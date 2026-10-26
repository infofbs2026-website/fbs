import React from 'react';
import Link from 'next/link';
import { Crown, MessageCircle, ArrowLeft } from 'lucide-react';

export function AboutFaqCta() {
  return (
    <section className="relative z-10 bg-paper pt-2 pb-16 sm:pb-24 text-navy">
      <div className="container-fbs">
        <div
          data-pf-audit="about-vip-cta"
          className="vip-cta-banner overflow-hidden p-7 sm:p-9 lg:p-10 text-white"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"
          />

          <div className="relative z-10 flex flex-col items-center text-center lg:flex-row lg:items-center lg:justify-between lg:text-start gap-6 lg:gap-8">
            <div className="min-w-0 flex-1 flex flex-col items-center lg:items-start space-y-2">
              <span className="pf-type-micro inline-flex items-center gap-1.5 rounded-full border border-gold/35 bg-gold/15 px-3.5 py-1 font-bold text-gold-light">
                <Crown size={12} className="text-gold shrink-0" />
                <span>المكتب الخاص والوساطة</span>
              </span>

              <h2 className="pf-type-h2 font-black text-white tracking-tight">
                اعرض لوحتك أو وثّق صفقتك الخاصة
              </h2>

              <p className="pf-type-body text-slate-300 font-normal">
                إدارة متكاملة للمزادات، العرض المباشر، والوساطة الخارجية بسرية تامة.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3 shrink-0">
              <Link
                href="/sell-your-plate"
                className="btn btn-gold text-xs sm:text-[13px] py-2.5 px-5 font-black group"
              >
                <span>اعرض لوحتك</span>
                <ArrowLeft
                  size={14}
                  className="shrink-0 transition-transform duration-200 group-hover:-translate-x-1"
                />
              </Link>

              <a
                href="https://wa.me/966500000000"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-vip-whatsapp text-xs sm:text-[13px] py-2.5 px-5 font-bold"
              >
                <MessageCircle size={15} className="shrink-0 text-emerald-400" />
                <span>تواصل عبر واتساب</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
