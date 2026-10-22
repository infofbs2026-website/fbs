import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import Script from 'next/script';
import { Header, Footer } from '@/components/shell';
import { GlobalAtmosphere } from '@/components/global-atmosphere';
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
    <html lang="ar" dir="rtl" className={ibmPlexSansArabic.variable} suppressHydrationWarning>
      <head>
        <link rel="preload" as="image" href="/videos/fbs-hero-poster.webp" type="image/webp" />
        <Script
          id="fbs-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){
  try {
    var m = document.cookie.match(/(?:^|; )fbs_signature_theme=([^;]+)/);
    var t = (m && m[1]) || localStorage.getItem('fbs_signature_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', 'dark');
  } catch(e) {}
})();`,
          }}
        />
      </head>
      <body className="font-sans antialiased text-[#14243C] bg-[#F7F6F3] overflow-x-clip selection:bg-gold/30 selection:text-[#14243C]">
        <GlobalAtmosphere />
        <a href="#main" className="fixed start-4 top-2 z-50 -translate-y-24 rounded bg-gold p-3 text-navy focus:translate-y-0">
          تخطي إلى المحتوى
        </a>
        <Header />
        <main id="main" className="relative z-10 min-h-[65vh] bg-transparent overflow-x-clip">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
