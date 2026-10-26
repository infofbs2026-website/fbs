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
    <section className="relative z-10 bg-paper py-16 sm:py-20 text-navy">
      <div className="container-fbs pf-cq-root space-y-8">
        {/* Crisp Single-Line Executive Header (Centered on Mobile, Start on Desktop) */}
        <div className="min-w-0 flex flex-col items-center text-center lg:items-start lg:text-start">
          <div className="pf-type-micro inline-flex items-center gap-2 rounded-full border border-gold/50 bg-white px-3.5 py-1 font-bold text-navy shadow-xs">
            <Compass size={13} className="text-gold-dark shrink-0" />
            <span>نطاق العمل</span>
          </div>

          <h2 className="pf-type-h2 mt-3 font-black text-navy tracking-tight">
            منظومة العرض والوساطة
          </h2>

          <p className="pf-type-body mt-2 text-slate-600 font-normal">
            وسيط تنظيمي محايد يدير التحقق والتسوية المالية إلكترونياً دون امتلاك اللوحات أو المضاربة فيها.
          </p>
        </div>

        {/* 3 Sculpted Operational Channels */}
        <div className="pf-cq-grid-3 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {CHANNELS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <article
                key={item.num}
                data-pf-audit={idx === 0 ? 'about-channel-card' : undefined}
                className="luxury-card group relative min-w-0 flex flex-col items-center text-center sm:items-stretch sm:text-start justify-between rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 overflow-hidden"
              >
                {/* Top 1px Specular Gold Hairline */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />

                <div className="w-full flex flex-col items-center sm:items-stretch">
                  <div className="w-full flex items-center justify-center sm:justify-between gap-3 mb-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy text-gold border border-gold/30 shadow-sm">
                      <Icon size={19} />
                    </span>
                    <span
                      dir="ltr"
                      className="hidden sm:inline font-norwester text-2xl font-black text-slate-300 group-hover:text-gold-dark transition-colors select-none"
                    >
                      {item.num}
                    </span>
                  </div>

                  <h3 className="pf-type-h3 font-bold text-navy">{item.title}</h3>

                  <p className="pf-type-body mt-2 text-slate-600 font-normal">{item.desc}</p>
                </div>

                <div className="mt-6 pt-4 w-full border-t border-slate-100 flex justify-center sm:justify-start">
                  <Link
                    href={item.href}
                    className="pf-type-caption inline-flex min-h-8 items-center gap-2 font-bold text-navy group-hover:text-gold-dark transition-colors"
                  >
                    <span>{item.cta}</span>
                    <ArrowLeft
                      size={15}
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
