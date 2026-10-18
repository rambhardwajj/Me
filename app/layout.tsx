import type { Metadata, Viewport } from 'next';
import '@fontsource/be-vietnam-pro/400.css';
import '@fontsource/be-vietnam-pro/500.css';
import '@fontsource/be-vietnam-pro/600.css';
import '@fontsource/be-vietnam-pro/700.css';
import './globals.css';
import { PROFILE } from '@/lib/data';

export const metadata: Metadata = {
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
  themeColor: '#1b1d23',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
