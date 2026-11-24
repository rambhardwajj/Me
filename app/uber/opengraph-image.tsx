import { ImageResponse } from 'next/og';
import { BILLBOARD, TRIBUTE } from '@/lib/uber';

/** The picture a link to /uber unfurls with on WhatsApp and LinkedIn: the first screen's own words. No Uber marks. */
export const alt = 'Ram Bhardwaj, product manager. I built and sold a ride-hailing app. 100 drivers onboarded at TruCost.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  const { headline: h, proof } = BILLBOARD;
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '56px 72px', background: '#ffffff', color: '#000000', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 30 }}>
          <span style={{ fontSize: 44, fontWeight: 800 }}>Ram Bhardwaj</span>
          <span style={{ color: '#5e5e5e' }}>Product manager</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', fontSize: 98, fontWeight: 800, lineHeight: 1.08, letterSpacing: -2 }}>
          <span style={{ marginRight: 24 }}>{h.before}</span>
          <span style={{ display: 'flex', padding: '0 26px 8px', marginRight: 24, borderRadius: 24, background: '#000000', color: '#ffffff' }}>{h.badge}</span>
          <span>{h.after}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 84, fontWeight: 800, color: '#276ef1', marginRight: 18 }}>{proof.value}</span>
            <span style={{ fontSize: 34 }}>{proof.label}</span>
          </div>
          <span style={{ marginTop: 14, fontSize: 20, color: '#5e5e5e' }}>{TRIBUTE}</span>
        </div>
      </div>
    ),
    size,
  );
}
