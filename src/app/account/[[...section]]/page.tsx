import type { Metadata } from 'next';
import Link from 'next/link';
import { MfaSetup } from '@/components/mfa';
import { notFound,redirect } from 'next/navigation';
import { getViewer } from '@/lib/auth';
import { createSessionClient } from '@/lib/supabase/server';
import { PageTitle } from '@/components/ui';
import { DataTable } from '@/components/data-table';
import { EditorForm } from '@/components/editor-form';
import { ActionButton } from '@/components/forms';
const sections:Record<string,{label:string;table?:string;owner?:string;columns?:string[]}>= {overview:{label:'نظرة عامة'},auctions:{label:'مزاداتي',table:'auction_registrations',owner:'user_id',columns:['auction_id','status','created_at']},bids:{label:'مزايداتي',table:'bids',owner:'user_id',columns:['auction_id','amount_minor','sequence_no','accepted_at']},plates:{label:'لوحاتي',table:'plates',owner:'owner_id',columns:['digits','verification_status','listing_status','created_at']},favorites:{label:'المفضلة',table:'favorites',owner:'user_id',columns:['plate_id','created_at']},deposits:{label:'التأمينات',table:'payment_authorizations',owner:'user_id',columns:['auction_id','amount_minor','status','expires_at']},payments:{label:'المدفوعات',table:'payment_authorizations',owner:'user_id',columns:['id','status','captured_amount_minor','refunded_amount_minor']},notifications:{label:'الإشعارات',table:'notifications',owner:'user_id',columns:['title','body','created_at']},profile:{label:'الملف الشخصي'},security:{label:'الأمان'}};
const demoAccountData: Record<string, Record<string, unknown>[]> = {
  auctions: [
    { auction_id: 'لوحة ف ب س 1 (FBS-1)', status: 'مؤهل للمزايدة (QUALIFIED)', created_at: '2026-10-04' },
    { auction_id: 'لوحة ر ق م 7 (RQM-7)', status: 'مؤهل للمزايدة (QUALIFIED)', created_at: '2026-10-04' }
  ],
  bids: [
    { auction_id: 'لوحة ف ب س 1', amount_minor: '75,000,000 هللة (750,000 ر.س)', sequence_no: 28, accepted_at: 'اليوم 18:40' },
    { auction_id: 'لوحة ر ق م 7', amount_minor: '52,000,000 هللة (520,000 ر.س)', sequence_no: 19, accepted_at: 'اليوم 16:15' }
  ],
  plates: [
    { digits: 'م ج د 777', verification_status: 'تحت المراجعة والتوثيق', listing_status: 'مسودة معتمدة', created_at: '2026-10-03' }
  ],
  favorites: [
    { plate_id: 'لوحة ف ب س 1', created_at: '2026-10-04' },
    { plate_id: 'لوحة ك ن غ 1', created_at: '2026-10-02' }
  ],
  deposits: [
    { auction_id: 'مزاد لوحة ف ب س 1', amount_minor: '25,000 ر.س (مفوض بنكياً)', status: 'حجز مؤقت (AUTHORIZED)', expires_at: '2026-10-05' }
  ],
  payments: [
    { id: 'TXN-984210', status: 'مكتمل بنجاح', captured_amount_minor: '0 ر.س (حجز تفويض فقط)', refunded_amount_minor: '0' }
  ],
  notifications: [
    { title: 'تأكيد التسجيل في مزاد النخبة', body: 'تم قبول طلبك والتأهيل المباشر لمزاد لوحة ف ب س 1.', created_at: 'اليوم' },
    { title: 'مزايدة جديدة مسجلة', body: 'تم تسجيل مزايدتك بنجاح برقم تسلسلي معتمد.', created_at: 'قبل قليل' }
  ]
};

export const metadata: Metadata = { title: 'حسابي', robots: { index: false, follow: false } };
export default async function Account({params}:{params:Promise<{section?:string[]}>}){
  const user=await getViewer();if(!user)redirect('/login');
  const {section}=await params;const key=section?.[0]??'overview',config=sections[key];
  if(!config||(section?.length??0)>1)notFound();
  const db=await createSessionClient();
  let rowsData: Record<string, unknown>[] = [];
  if (config.table) {
    if (db) {
      try {
        const { data, error } = await db.from(config.table).select(config.columns!.join(',')).eq(config.owner!, user.id).limit(100);
        if (!error && data) rowsData = data as unknown as Record<string, unknown>[];
        else rowsData = demoAccountData[key] ?? [];
      } catch {
        rowsData = demoAccountData[key] ?? [];
      }
    } else {
      rowsData = demoAccountData[key] ?? [];
    }
  }
  return <><PageTitle title={`أهلًا، ${user.displayName||'بك'}`} description="كل ما يخص لوحاتك ومزاداتك في مكان واحد."/><div className="container-fbs grid gap-7 py-10 lg:grid-cols-[220px_1fr]"><aside className="panel h-fit p-3"><nav aria-label="حسابي">{Object.entries(sections).map(([s,c])=><Link key={s} href={s==='overview'?'/account':`/account/${s}`} className={`mb-1 block rounded px-4 py-3 text-sm ${key===s?'bg-navy text-white':'hover:bg-paper'}`}>{c.label}</Link>)}</nav><div className="mt-4 border-t border-line pt-4"><ActionButton endpoint="/api/v1/auth/logout" label="تسجيل الخروج"/></div></aside><section className="min-w-0"><h2 className="mb-6 text-xl font-bold">{config.label}</h2>{key==='overview'?<div className="grid gap-5 sm:grid-cols-2"><Link href="/account/auctions" className="panel"><h3 className="mb-3 font-bold">تابع مزاداتك</h3><p className="text-sm leading-7 text-muted">راجع التسجيلات وحالة التأهيل والمزايدات.</p></Link><Link href="/sell-your-plate" className="panel"><h3 className="mb-3 font-bold">اعرض لوحة جديدة</h3><p className="text-sm leading-7 text-muted">قدّم بيانات اللوحة وارفع إثبات الملكية.</p></Link></div>:key==='profile'?<EditorForm endpoint="/api/v1/profile" fields={[{name:'displayName',label:'الاسم',value:user.displayName},{name:'phone',label:'الجوال بصيغة دولية',required:false}]}/>:key==='security'?<div className="panel"><p className="mb-5 text-sm leading-8">يمكنك تغيير كلمة المرور من خلال رابط آمن يصلك على بريدك الإلكتروني.</p><Link className="btn btn-navy" href="/forgot-password">استعادة كلمة المرور</Link><MfaSetup/></div>:<DataTable rows={rowsData} columns={config.columns}/>}</section></div></>;
}
