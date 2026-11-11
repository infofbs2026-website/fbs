import React from 'react';
import Link from 'next/link';
import { Gavel, ShoppingBag, Handshake, ArrowLeft, Compass } from 'lucide-react';

const CHANNELS = [
  {
    num: '01',
    title: 'المزادات الرقمية',
    desc: 'مزايدات علنية موثقة بتأمين جدية مسترد.',
    cta: 'تصفح المزادات',
    href: '/auctions',
    icon: Gavel
  },
  {
    num: '02',
    title: 'المتجر المباشر',
    desc: 'شراء فوري للوحات المفحوصة بتسعير واضح.',
    cta: 'دخول المتجر',
    href: '/plates',
    icon: ShoppingBag
  },
  {
    num: '03',
    title: 'الوساطة الخاصة',
    desc: 'توثيق الصفقات الخارجية بضمان مالي مستقل.',
    cta: 'اطلب وساطة',
    href: '/sell-your-plate',
    icon: Handshake
  }
];

export function AboutManifesto() {
  return (
    <section className="relative z-10 bg-paper py-12 sm:py-16 text-navy">
      <div className="max-w-[1000px] mx-auto px-5 sm:px-8 lg:px-10 space-y-6 sm:space-y-8">
        {/* Crisp Single-Line Executive Header (Centered on Mobile, Start on Desktop) */}
        <div className="min-w-0 flex flex-col items-center text-center lg:items-start lg:text-start">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-white px-3.5 py-1.5 text-[11px] sm:text-[11.5px] font-bold text-navy shadow-xs">
            <Compass size={13} className="text-gold-dark shrink-0" />
            <span>منظومة العرض والوساطة</span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-[26px] font-black text-navy tracking-tight mt-2.5">
            منظومة العرض والوساطة
          </h2>

          <p className="mt-1.5 max-w-3xl text-xs sm:text-[14px] leading-relaxed text-slate-600 font-normal">
            وسيط تنظيمي محايد يدير التحقق والتسوية المالية إلكترونياً دون امتلاك اللوحات أو المضاربة فيها.
          </p>
        </div>

        {/* 3 Sculpted Operational Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {CHANNELS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <article
                key={item.num}
                data-pf-audit={idx === 0 ? 'about-channel-card' : undefined}
                className="luxury-card group relative min-w-0 flex flex-col items-center text-center sm:items-stretch sm:text-start justify-between rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 overflow-hidden shadow-2xs hover:shadow-xs transition-shadow"
              >
                {/* Top 1px Specular Gold Hairline */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />

                <div className="w-full flex flex-col items-center sm:items-stretch">
                  <div className="w-full flex items-center justify-center sm:justify-between gap-3 mb-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy text-gold border border-gold/30 shadow-2xs">
                      <Icon size={18} />
                    </span>
                    <span
                      dir="ltr"
                      className="hidden sm:inline font-norwester text-xl font-black text-slate-300 group-hover:text-gold-dark transition-colors select-none"
                    >
                      {item.num}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-[17px] font-bold text-navy">{item.title}</h3>

                  <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-slate-600 font-normal">{item.desc}</p>
                </div>

                <div className="mt-5 pt-3.5 w-full border-t border-slate-100 flex justify-center sm:justify-start">
                  <Link
                    href={item.href}
                    className="inline-flex min-h-8 items-center gap-1.5 text-xs sm:text-[13px] font-bold text-navy group-hover:text-gold-dark transition-colors"
                  >
                    <span>{item.cta}</span>
                    <ArrowLeft
                      size={13}
                      className="text-gold-dark shrink-0 transition-transform duration-200 group-hover:-translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
