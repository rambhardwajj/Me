import { IDEA } from '@/lib/uber';
import { OG_SIZE, ogImage } from '@/lib/uber-og';

export const alt = 'The 20 idle minutes: a proposal for Uber, by Ram Bhardwaj';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return ogImage({ kicker: 'A concept, not an Uber programme', title: IDEA.title, value: '20 min', label: 'idle in the back seat, per ride (estimate)' });
}
