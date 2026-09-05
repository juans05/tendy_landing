import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { content } from '@/lib/content';
import { shouldLoadGA, shouldLoadGTM, shouldLoadPixel } from '@/lib/analytics';
import { UtmCapture } from '@/components/ui/UtmCapture';
import { WhatsAppFloatButton } from '@/components/ui/WhatsAppFloatButton';

const nunito = Nunito({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: content.seo.title,
  description: content.seo.description,
  openGraph: {
    title: content.seo.title,
    description: content.seo.description,
    type: 'website',
    locale: 'es_PE',
  },
};

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-PE" className={nunito.variable}>
      <body className="bg-white font-sans text-gray-900">
        {shouldLoadGTM(GTM_ID) && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}
        {shouldLoadGA(GA_ID) && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${GA_ID}');`}
            </Script>
          </>
        )}
        {shouldLoadPixel(PIXEL_ID) && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${PIXEL_ID}');fbq('track', 'PageView');`}
          </Script>
        )}
        <UtmCapture />
        {children}
        <WhatsAppFloatButton />
      </body>
    </html>
  );
}
