import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans_Arabic, Noto_Naskh_Arabic, Barlow_Semi_Condensed } from 'next/font/google';
import Script from 'next/script';
import { Header, Footer } from '@/components/shell';
import { GlobalAtmosphere } from '@/components/global-atmosphere';
import { FloatingSiteActions } from '@/components/floating-site-actions';
import { getSiteSettings } from '@/lib/site-settings';
import './globals.css';

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-arabic',
  display: 'swap',
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['600', '700'],
  variable: '--font-plate-naskh',
  display: 'swap',
});

const barlowSemiCondensed = Barlow_Semi_Condensed({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-plate-din',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#08162b',
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: { default: 'FBS | فارس بن سعود للوحات المميزة', template: '%s | FBS' },
  description: 'لوحتك المميزة تبدأ من هنا. اكتشف لوحات المركبات المميزة والمزادات لدى فارس بن سعود.',
  ...(process.env.NEXT_PUBLIC_SITE_URL ? { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL) } : {}),
  openGraph: { locale: 'ar_SA', type: 'website', siteName: 'FBS | فارس بن سعود' },
  robots: { index: process.env.APP_ENV === 'production', follow: true }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const siteSettings = await getSiteSettings();

  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${ibmPlexSansArabic.variable} ${notoNaskhArabic.variable} ${barlowSemiCondensed.variable}`}
      suppressHydrationWarning
    >
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
    var seen = new WeakMap();
    var cleanAttr = function(el) {
      if (!el || !el.hasAttribute || !el.hasAttribute('data-pdffiller-skip')) return;
      var c = (seen.get(el) || 0) + 1;
      if (c <= 4) {
        seen.set(el, c);
        el.removeAttribute('data-pdffiller-skip');
      }
    };
    var sweep = function() {
      var nodes = document.querySelectorAll('[data-pdffiller-skip]');
      for (var i = 0; i < nodes.length; i++) cleanAttr(nodes[i]);
    };
    sweep();
    var obs = new MutationObserver(function(list) {
      for (var i = 0; i < list.length; i++) {
        var rec = list[i];
        if (rec.type === 'attributes') cleanAttr(rec.target);
        else if (rec.addedNodes) {
          for (var j = 0; j < rec.addedNodes.length; j++) {
            var n = rec.addedNodes[j];
            if (n && n.nodeType === 1) {
              cleanAttr(n);
              if (n.querySelectorAll) {
                var inner = n.querySelectorAll('[data-pdffiller-skip]');
                for (var k = 0; k < inner.length; k++) cleanAttr(inner[k]);
              }
            }
          }
        }
      }
    });
    obs.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-pdffiller-skip'] });
    document.addEventListener('DOMContentLoaded', sweep, { once: true });
    setTimeout(function() { obs.disconnect(); }, 5000);
  } catch(e) {}
})();`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="font-sans antialiased text-[#14243C] bg-[#F7F6F3] overflow-x-clip selection:bg-gold/30 selection:text-[#14243C]"
      >
        <GlobalAtmosphere />
        <a href="#main" className="fixed start-4 top-2 z-50 -translate-y-24 rounded bg-gold p-3 text-navy focus:translate-y-0">
          تخطي إلى المحتوى
        </a>
        <Header siteSettings={siteSettings} />
        <main id="main" className="relative z-10 min-h-[65vh] bg-transparent overflow-x-clip">
          {children}
        </main>
        <Footer siteSettings={siteSettings} />
        <FloatingSiteActions whatsappNumber={siteSettings.whatsappNumber} />
      </body>
    </html>
  );
}
