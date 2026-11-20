import type { Metadata, Viewport } from 'next';
import { Archivo, Inter } from 'next/font/google';
import './uber.css';
import Mascot from '@/components/Mascot';
import UberPage from '@/components/uber/UberPage';
import { PROFILE } from '@/lib/data';
import { THEME_KEY, TRIBUTE_LONG } from '@/lib/uber';

// Two voices: Archivo (75% width) for page headlines, Inter for everything inside the phone.
const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-archivo', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: `Ram for Uber · ${PROFILE.name}`,
  description: `Your product manager is 2 min away. ${TRIBUTE_LONG}`,
  openGraph: {
    title: `Ram for Uber · ${PROFILE.name}`,
    description: `Your product manager is 2 min away. ${TRIBUTE_LONG}`,
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};

/** Applies a saved dark theme before first paint. Light is the default whatever the OS says. */
const THEME_SCRIPT = `try{if(localStorage.getItem('${THEME_KEY}')==='dark'){var e=document.querySelector('.ub');e.dataset.theme='dark';e.classList.add('vox-dark')}}catch(e){}`;

/** The dream company portfolio: a page made only for Uber, with Ram's story inside an Uber-style app. */
export default function Uber() {
  return (
    <>
      <UberPage fonts={`${archivo.variable} ${inter.variable}`}>
        {/* Mini Ram, unchanged. Its floating button is hidden on this page; "Ask Mini Ram" opens it. */}
        <Mascot comments={{}} />
      </UberPage>
      <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
    </>
  );
}
