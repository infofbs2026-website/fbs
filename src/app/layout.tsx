import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import { Header, Footer } from '@/components/shell';
import './globals.css';

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'FBS | فارس بن سعود للوحات المميزة', template: '%s | FBS' },
  description: 'لوحتك المميزة تبدأ من هنا. اكتشف لوحات المركبات المميزة والمزادات لدى فارس بن سعود.',
  ...(process.env.NEXT_PUBLIC_SITE_URL ? { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL) } : {}),
  openGraph: { locale: 'ar_SA', type: 'website', siteName: 'FBS | فارس بن سعود' },
  robots: { index: process.env.APP_ENV === 'production', follow: true }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={ibmPlexSansArabic.variable}>
      <body className="font-sans antialiased text-slate-900 bg-white overflow-x-clip">
        <a href="#main" className="fixed start-4 top-2 z-50 -translate-y-24 rounded bg-gold p-3 text-navy focus:translate-y-0">
          تخطي إلى المحتوى
        </a>
        <Header />
        <main id="main" className="min-h-[65vh] bg-[#fcfcfd] overflow-x-clip">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
