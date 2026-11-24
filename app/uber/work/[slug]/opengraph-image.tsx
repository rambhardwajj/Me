import { CASE_IDS, getCase } from '@/lib/uber-cases';
import { OG_SIZE, ogImage } from '@/lib/uber-og';

export const alt = 'A case study by Ram Bhardwaj';
export const size = OG_SIZE;
export const contentType = 'image/png';

export function generateStaticParams() {
  return CASE_IDS.map((slug) => ({ slug }));
}

/** One share image per case: its name and its headline number. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) return ogImage({ kicker: 'Case study', title: 'Work' });
  return ogImage({ kicker: 'Case study', title: c.t.name, value: c.t.result?.value, label: c.t.result?.sub });
}
