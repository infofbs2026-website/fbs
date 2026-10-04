import Link from 'next/link';
export default function NotFound(){return <div className="container-fbs py-24 text-center"><p className="mb-4 font-mono text-5xl text-gold">404</p><h1 className="text-2xl font-bold">الصفحة غير موجودة</h1><p className="my-5 text-muted">قد يكون الرابط غير صحيح أو لم يعد المحتوى متاحًا.</p><Link href="/" className="btn btn-navy">العودة إلى الرئيسية</Link></div>;}
