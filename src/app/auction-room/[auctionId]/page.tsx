import type { Metadata } from 'next';
import { z } from 'zod';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Gavel, Radio, ShieldCheck, Trophy } from 'lucide-react';
import { FbsStageWatermark, PlateVisualizer } from '@/components/ui';
import { LiveRoom } from '@/components/live-room';
import { createAdminClient } from '@/lib/supabase/server';
import { getViewer } from '@/lib/auth';
import { mapPlate } from '@/modules/marketplace/service';

export const metadata: Metadata = { title: 'غرفة المزاد المباشر', robots: { index: false, follow: false } };

export default async function Room({ params }: { params: Promise<{ auctionId: string }> }) {
  const { auctionId } = await params;

  let plate = null;
  const db = createAdminClient();

  if (db && z.uuid().safeParse(auctionId).success) {
    try {
      const { data: a } = await db.from('public_auctions').select('plate_id').eq('id', auctionId).maybeSingle();
      if (a) {
        const { data: p } = await db.from('public_plates').select('*').eq('id', a.plate_id).single();
        if (p) {
          plate = mapPlate(p);
        }
      }
    } catch {
      plate = null;
    }
  }

  if (!plate) notFound();

  const viewer = await getViewer();

  return (
    <>
      {/* Luxury Ambient Header Banner */}
      <section className="hero-luxury-ambient relative overflow-hidden border-b border-[#D9BB81]/30 pt-26 sm:pt-30 pb-10 sm:pb-14 text-white">
        <div className="container-fbs relative z-10">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-gold-light mb-3">
            <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
            <span>/</span>
            <Link href="/auctions" className="hover:text-white transition-colors">المزادات</Link>
            <span>/</span>
            <span className="text-white">غرفة المزاد المباشر</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400 mb-3 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-live shadow-[0_0_8px_#34d399]" />
                <span>جلسة مزايدة حية وتفاعلية</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                المزاد المباشر: لوحة {plate.lettersAr.join(' ')} {plate.numbers}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold text-slate-200 backdrop-blur-md">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>نظام مزايدة رسمي معتمد</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Room Stage */}
      <div className="container-fbs py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
          {/* Plate Showcase Pedestal */}
          <div className="space-y-6">
            <div className="luxury-card p-6 sm:p-10 text-center relative overflow-hidden">
              <div className="plate-tray-recessed relative overflow-hidden rounded-3xl p-8 sm:p-14 flex items-center justify-center"><FbsStageWatermark />
                <div className="relative z-10 w-full max-w-[460px]">
                  <PlateVisualizer
                    lettersAr={plate.lettersAr}
                    lettersEn={plate.lettersEn}
                    numbers={plate.numbers}
                    plateType={plate.type}
                    large
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between text-xs text-slate-500 px-2 border-t border-slate-100 pt-4">
                <span className="font-semibold text-slate-700">
                  {plate.type || 'خصوصي'} · {plate.city || 'الرياض'}
                </span>
                <span className="font-norwester font-bold text-gold-dark" dir="ltr">
                  {plate.slug.toLowerCase().startsWith('fbs-') ? plate.slug.toUpperCase() : `FBS-${plate.slug.toUpperCase()}`}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 text-xs text-slate-600 leading-relaxed shadow-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-navy">
                <Gavel size={15} className="text-gold-accent" />
                <span>إرشادات المزايدة في الجلسة:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-500 text-[11px] leading-5">
                <li>المزايدة مُلزمة نظامياً ولا يجوز التراجع عنها بعد تأكيد الخادم.</li>
                <li>تُحدّث الأسعار والوقت تلقائياً في الوقت الفعلي لكل المشتركين.</li>
                <li>يتم تمديد وقت المزاد تلقائياً عند تسجيل مزايدات في اللحظات الأخيرة.</li>
              </ul>
            </div>
          </div>

          {/* Interactive Bidding Command Module */}
          <LiveRoom auctionId={auctionId} signedIn={Boolean(viewer)} />
        </div>
      </div>
    </>
  );
}

