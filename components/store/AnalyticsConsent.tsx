'use client';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import { shouldLoadGA, shouldLoadGTM, shouldLoadPixel } from '@/lib/analytics';
import { UtmCapture } from '@/components/ui/UtmCapture';
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
export function AnalyticsConsent() {
 const [consent, setConsent] = useState<string | null>(null);
 useEffect(() => { try { setConsent(localStorage.getItem('tendy_consent')); } catch {} }, []);
 const enabled = shouldLoadGTM(GTM_ID) || shouldLoadGA(GA_ID) || shouldLoadPixel(PIXEL_ID);
 if (!enabled) return null;
 function choose(value: string) { try { localStorage.setItem('tendy_consent', value); } catch {} setConsent(value); if (consent === 'accepted' && value === 'rejected') window.location.reload(); }
 return <>
 {consent === 'accepted' && <><UtmCapture />
        {shouldLoadGTM(GTM_ID) && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}
        {shouldLoadGA(GA_ID) && !shouldLoadGTM(GTM_ID) && (
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

</>}
 {consent === null ? <aside className="cookie-banner" aria-label="Preferencias de analítica"><p>Nos ayudas a mejorar Tendy. Con tu permiso usamos Google y, si está configurado, Meta para medir visitas e interacciones. <a href="/privacidad">Más información</a></p><div><button onClick={() => choose('rejected')}>Solo necesarias</button><button onClick={() => choose('accepted')}>Aceptar analítica</button></div></aside> : <button className="cookie-settings" onClick={() => choose(consent === 'accepted' ? 'rejected' : 'accepted')}>{consent === 'accepted' ? 'Desactivar analítica' : 'Activar analítica'}</button>}
 </>;
}
