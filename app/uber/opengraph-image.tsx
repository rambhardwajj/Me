import { BILLBOARD } from '@/lib/uber';
import { OG_SIZE, ogImage } from '@/lib/uber-og';

/** The picture a link to /uber unfurls with: the first screen's own words and its one number. */
export const alt = 'Ram Bhardwaj, product manager. I built and sold a ride-hailing app. 100 drivers onboarded at TruCost.';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  const { headline: h, proof } = BILLBOARD;
  return ogImage({ kicker: 'Product manager', title: `${h.before} ${h.badge} ${h.after}`, value: proof.value, label: proof.label });
}
