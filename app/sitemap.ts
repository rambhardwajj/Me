import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { CASE_IDS, PROPOSAL_HREF, WORK_HREF, caseHref } from '@/lib/uber-cases';

/** The pages worth finding: the main site, the Uber page, the proposal and every case study. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['/', '/uber', WORK_HREF, PROPOSAL_HREF, ...CASE_IDS.map(caseHref)];
  return paths.map((p) => ({ url: `${SITE}${p}`, changeFrequency: 'monthly', priority: p === '/uber' || p === '/' ? 1 : 0.7 }));
}
