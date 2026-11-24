import { ImageResponse } from 'next/og';
import { TRIBUTE } from './uber';

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * The picture a /uber link unfurls with on WhatsApp and LinkedIn: a small label, the page's title, and its one number.
 * Words only, in the page's own black, white and blue. No Uber marks.
 */
export function ogImage({ kicker, title, value, label }: { kicker: string; title: string; value?: string; label?: string }) {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '56px 72px', background: '#ffffff', color: '#000000', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 30 }}>
          <span style={{ fontSize: 44 }}>Ram Bhardwaj</span>
          <span style={{ color: '#5e5e5e' }}>{kicker}</span>
        </div>
        <div style={{ display: 'flex', fontSize: title.length > 22 ? 84 : 112, lineHeight: 1.06, letterSpacing: -2 }}>{title}</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {value && (
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span style={{ fontSize: 84, color: '#276ef1', marginRight: 18 }}>{value}</span>
              <span style={{ fontSize: 34 }}>{label}</span>
            </div>
          )}
          <span style={{ marginTop: 14, fontSize: 20, color: '#5e5e5e' }}>{TRIBUTE}</span>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
