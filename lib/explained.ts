/**
 * Everything the "Ram, explained" page shows, in one place. Facts are pulled from data.ts where they
 * already live; the sentences in THE_NUMBERS restate data.ts word for word. Change numbers in data.ts,
 * or here only where a line is written out.
 */
import { EXPERIENCE, JOURNEY, PERSONAS, PROFILE, PROJECTS, type Job } from './data';

const photo = (id: string) => JOURNEY.find((m) => m.id === id)?.image ?? '';
const job = (slug: Job['slug']) => EXPERIENCE.find((j) => j.slug === slug)!;

/** Vox palette plus the site's own accents. */
export const COLORS = {
  ink: '#1b1a17',
  yellow: '#ffd60a',
  red: '#e2362b',
  blue: '#2856e8',
  cyan: '#12b5cf',
  orange: '#f5a043',
};

export const TITLE = {
  eyebrow: 'Ram, explained',
  role: 'Product Manager · ex-Software Engineer',
  headline: { before: 'I take products from ', mark: 'zero to revenue', after: '.' },
  sub: `Now a PGP candidate at Masters’ Union, building LeetCase. ${PROFILE.availability}.`,
  portrait: '/vox/me.webp',
  name: PROFILE.name,
};

/** A line of the highlighted document. `cam` is where the camera sits when its highlight starts: [p, x%, y%, scale, rotate]; stats alternate right/left, so x leans toward the stat. */
export type DocLine = { parts: (string | { mark: string })[]; stat: { value: string; label: string }; cam: [number, number, number, number, number] };

/** Chapter 1: the record, line by line. Windows run in order down the page. */
export const THE_NUMBERS = {
  heading: 'The record',
  meta: 'Ram Bhardwaj · Product Manager',
  source: 'Source: Ram’s résumé and the facts on this site.',
  lines: [
    {
      parts: ['At Ciena, Ram was one of ', { mark: '4 of 14,000' }, ' to win the annual EDST Customer’s First Award, and the first new grad ever.'],
      stat: { value: '4/14,000', label: 'annual award at Ciena' },
      cam: [0.2, -6, 26, 1.5, -1.5],
    },
    {
      parts: ['He represented India at the Chicago Footworkology World Final and finished ', { mark: 'Top 16 worldwide' }, '.'],
      stat: { value: 'Top 16', label: 'worldwide · Chicago dance battle' },
      cam: [0.34, 5, 12, 1.5, 0.5],
    },
    {
      parts: ['He took LeetCase from PRD to MVP and scaled it to ', { mark: '150+ users' }, ' across Masters’ Union communities.'],
      stat: { value: '150+', label: 'LeetCase users' },
      cam: [0.48, -5, -2, 1.5, -0.5],
    },
    {
      parts: ['At Newral he went from engineer to Product Manager in seven months, with ', { mark: '2 promotions' }, ', and drove ', { mark: '75% revenue growth' }, '.'],
      stat: { value: '+75%', label: 'revenue growth at Newral' },
      cam: [0.62, 5, -16, 1.5, 1],
    },
    {
      parts: ['For TruCost he shipped Android and iOS apps, onboarded ', { mark: '100 drivers' }, ' and closed a ', { mark: '₹2.5L contract' }, '.'],
      stat: { value: '100', label: 'TruCost drivers onboarded' },
      cam: [0.76, -5, -30, 1.5, -1],
    },
  ] as DocLine[],
};

/** Chapter 2: one panel per stop, left to right in time. */
export const EXPERIENCE_STOPS = (['ciena', 'newral', 'trucost'] as const).map((slug) => {
  const j = job(slug);
  const roles = [...j.roles].reverse();
  return {
    slug,
    company: j.company,
    logo: j.logo.src,
    type: j.type,
    location: j.location,
    from: roles[0].start,
    to: roles[roles.length - 1].end,
    roles: roles.map((r) => ({ title: r.title, start: r.start, end: r.end })),
    promotions: slug === 'newral' ? '2 promotions' : undefined,
    summary: j.summary,
    highlight: j.highlights?.[0],
    lead: j.metrics[0],
    more: j.metrics.slice(1),
    photo: { ciena: photo('ciena-award'), newral: photo('best-employee'), trucost: photo('trucost') }[slug],
    caption: { ciena: 'EDST Customer’s First Award', newral: 'Best Employee, 2025', trucost: 'TruCost: headrest tablet paired to the driver’s phone' }[slug],
    url: j.url,
  };
});

const SHOTS: Record<string, string | undefined> = {
  leetcase: '/images/leetcase.webp',
  trucost: '/images/trucost.webp',
  sujhaavmarg: '/images/sujhaavmarg.webp',
  synappses: 'https://res.cloudinary.com/ewpg7mfj/image/upload/w_900/f_auto,q_auto/v1792334002/Screenshot_2026-10-18_at_8.02.57_PM_fhkljn.png',
  unbothered: 'https://res.cloudinary.com/ewpg7mfj/image/upload/w_900/f_auto,q_auto/v1792334117/Screenshot_2026-10-18_at_8.04.50_PM_qodm99.png',
};

/** Chapter 3: every project as a polaroid. Upto has no screenshot or link yet, so it shows its coded screen. */
export const WORK = PROJECTS.map((p) => ({
  id: p.id,
  name: p.name,
  brief: p.pitch,
  url: p.url,
  domain: p.domain,
  shot: SHOTS[p.id],
  period: p.period,
  role: p.role,
  stat: p.metrics[0],
  caseStudy: p.id === 'leetcase' || p.id === 'trucost',
}));

/** Chapter 4: the three personas as index cards. */
export const ABOUT = PERSONAS;

/** The end card: torn-strip doors, then email and socials. A door with no href is hidden. */
export const DOORS = [
  { label: 'Contact', note: 'Say hello', href: `mailto:${PROFILE.email}`, color: COLORS.red },
  { label: 'LeetCase', note: 'Try the product', href: 'https://leetcase.rambhardwaj.in/', color: COLORS.blue },
  { label: 'Résumé', note: 'Download the PDF', href: PROFILE.resume, color: COLORS.yellow },
];

export const CONTACT = {
  email: PROFILE.email,
  socials: [
    { label: 'LinkedIn', href: PROFILE.linkedin },
    { label: 'GitHub', href: PROFILE.github },
    { label: 'X', href: PROFILE.x },
    { label: 'Instagram', href: PROFILE.instagram },
  ],
};

/** Chapter cards: number, word and colour. */
export const CHAPTERS_V = {
  numbers: { n: '01', word: 'The numbers', color: COLORS.yellow, ink: COLORS.ink },
  experience: { n: '02', word: 'Experience', color: COLORS.blue, ink: '#fff' },
  work: { n: '03', word: 'Work', color: COLORS.red, ink: '#fff' },
  about: { n: '04', word: 'About', color: COLORS.cyan, ink: COLORS.ink },
};

/** What Mini Ram says as each chapter arrives (only the first one reached shows, once per session). */
export const MINI_RAM_NOTES: Record<string, string> = {
  top: 'Hey! I’m Mini Ram 👋 Scroll, and I’ll play Ram’s story like a video.',
  numbers: 'Watch the highlighter. Every number here is real.',
  experience: 'Three stops, one rising line. Keep scrolling sideways.',
  journey: 'This is the long version, from Mathura to product.',
  work: 'Each polaroid opens the live product.',
  about: 'Three Rams, one person. Pick the feed you like.',
  contact: 'Still curious? Click me and ask anything about Ram.',
};
