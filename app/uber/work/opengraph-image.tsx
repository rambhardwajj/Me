import { CASE_IDS } from '@/lib/uber-cases';
import { OG_SIZE, ogImage } from '@/lib/uber-og';

export const alt = 'Work: case studies by Ram Bhardwaj';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return ogImage({ kicker: 'Product manager', title: 'Work', value: String(CASE_IDS.length), label: 'case studies, one page each' });
}
