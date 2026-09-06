import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { AnalyticsConsent } from '@/components/store/AnalyticsConsent';
import { siteUrl, seoTitle, seoDescription } from '@/lib/seo';
const nunito = Nunito({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
export const metadata: Metadata = {
 metadataBase: siteUrl ? new URL(siteUrl) : undefined,
 title: seoTitle, description: seoDescription,
 icons: { icon: '/images/tendyperu-logo.png', apple: '/images/tendyperu-logo.png' },
 robots: { index: Boolean(siteUrl), follow: true },
 openGraph: { title: seoTitle, description: seoDescription, type: 'website', locale: 'es_PE', siteName: 'Tendy Perú', images: siteUrl ? [{ url: '/images/tendy-avatar.webp', width: 760, height: 760, alt: 'Tendy, el avatar del Club Tendy Perú' }] : [] },
 twitter: { card: 'summary_large_image', title: seoTitle, description: seoDescription, images: siteUrl ? ['/images/tendy-avatar.webp'] : [] },
 verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
 return <html lang="es-PE" className={nunito.variable}><body className="font-sans"><a className="skip-link" href="#contenido">Saltar al contenido</a>{children}<AnalyticsConsent /></body></html>;
}
