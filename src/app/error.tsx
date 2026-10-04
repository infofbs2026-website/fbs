'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <div className="container-fbs py-24 text-center"><h1 className="text-2xl font-bold">تعذر تحميل الصفحة</h1><p className="my-5 text-muted">حدث خطأ مؤقت. يرجى إعادة المحاولة.</p><button onClick={reset} className="btn btn-navy">إعادة المحاولة</button></div>;}
