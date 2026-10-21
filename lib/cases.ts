import { PROJECTS, type Project } from './data';

/**
 * Short case studies. Problem, role, actions and outcomes come from data.ts; the decisions restate
 * what Ram did, and each trade-off line says what that choice cost. Edit freely.
 */
export type Case = {
  slug: string;
  context: string;
  role: string;
  decisions: { title: string; choice: string; tradeoff: string }[];
  image: string;
};

export const CASES: Case[] = [
  {
    slug: 'leetcase',
    context: 'Case and guesstimate prep for MBA aspirants, built and launched at Masters’ Union.',
    role: 'Founder & Product Manager. Ran the user research, wrote the PRD, took it to MVP and owned growth.',
    image: '/images/leetcase.webp',
    decisions: [
      {
        title: 'Practice, not another PDF library',
        choice: 'Built a guided solve flow, with structured problem sets and hints, instead of a static bank of solutions.',
        tradeoff: 'More to design and build before launch, in exchange for practice that is repeatable and measurable.',
      },
      {
        title: 'Launch inside one community first',
        choice: 'Shipped the MVP to Masters’ Union communities and grew it there to 150+ users.',
        tradeoff: 'A narrow first audience, in exchange for fast, direct feedback from exactly the people it is for.',
      },
      {
        title: 'Optimise for retention, not sign-ups',
        choice: 'Tracked activation, retention and DAU/MAU, and used A/B tests and feedback loops to decide what to build next.',
        tradeoff: 'Slower-looking headline growth, but a clearer read on whether the product is genuinely useful.',
      },
    ],
  },
  {
    slug: 'trucost',
    context: 'An Uber-style ride-hailing service with a headrest tablet paired to the driver’s phone, running ads and surveys during the ride.',
    role: 'Contract Product Manager for Skyex AI Mobility. Single point of contact for scope, priorities and sign-offs; hired and led the dev team.',
    image: '/images/trucost.webp',
    decisions: [
      {
        title: 'Pair the tablet to the driver’s phone',
        choice: 'Designed a Bluetooth connectivity architecture linking the driver’s phone with the headrest tablet.',
        tradeoff: 'Pairing has to work reliably in every cab, but it keeps the tablet tied to the live ride.',
      },
      {
        title: 'Make the screen pay for the ride',
        choice: 'Monetised through in-cab tablet advertising and pricing strategy.',
        tradeoff: 'Ad revenue had to be balanced against a good rider experience.',
      },
      {
        title: 'Ship both platforms on schedule',
        choice: 'Hired and led the dev team and ran sprints to launch Android and iOS, both live on the stores.',
        tradeoff: 'Two platforms at once stretches a small team, so scope and sign-offs ran through one owner.',
      },
    ],
  },
];

export function getCase(slug: string): { c: Case; p: Project } | null {
  const c = CASES.find((x) => x.slug === slug);
  const p = PROJECTS.find((x) => x.id === slug);
  return c && p ? { c, p } : null;
}

export const hasCase = (id: string) => CASES.some((c) => c.slug === id);
