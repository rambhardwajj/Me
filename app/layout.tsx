import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import './globals.css';
import { PROFILE } from '@/lib/data';

/**
 * Where the site lives, so link previews (WhatsApp, LinkedIn) get absolute addresses for the page and its share image.
 * Vercel names the production domain itself; rambhardwaj.in is the site's own domain (lib/data.ts) for anywhere else.
 */
const SITE = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://rambhardwaj.in';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: `${PROFILE.name} · ${PROFILE.role}`,
  description: PROFILE.intro,
  openGraph: {
    title: `${PROFILE.name} · ${PROFILE.role}`,
    description: PROFILE.intro,
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
  ],
};

/** Applies the saved theme (or the OS preference) before first paint, so there is no flash. */
const THEME_SCRIPT = `try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='dark'}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Script id="theme" strategy="beforeInteractive">
          {THEME_SCRIPT}
        </Script>
        {children}
      </body>
    </html>
  );
}
