import type { Metadata, Viewport } from 'next';
import './uber.css';
import LazyMiniRam from '@/components/uber/LazyMiniRam';
import UberPage from '@/components/uber/UberPage';
import { PROFILE } from '@/lib/data';
import { BILLBOARD, TRIBUTE_LONG } from '@/lib/uber';
import { THEME_SCRIPT } from '@/lib/uber-cases';
import { FONTS } from './fonts';

const title = `${PROFILE.name}, product manager · Ram for Uber`;
/** Who, what and one number, for search results and link previews. */
const description = `${BILLBOARD.headline.before} ${BILLBOARD.headline.badge} ${BILLBOARD.headline.after} ${BILLBOARD.pitch} ${TRIBUTE_LONG}`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/uber' },
  openGraph: { title, description, type: 'website', url: '/uber' },
  twitter: { card: 'summary_large_image', title, description },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};

/** The dream company portfolio: a page made only for Uber, with Ram's story inside an Uber-style app. */
export default function Uber() {
  return (
    <>
      <UberPage fonts={FONTS}>
        {/* Mini Ram. Its floating button is hidden on this page; "Ask Mini Ram" opens it. Loaded after the page itself. */}
        <LazyMiniRam />
      </UberPage>
      <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
    </>
  );
}
