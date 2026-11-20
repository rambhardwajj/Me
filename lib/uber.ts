/**
 * Everything the /uber page says lives here: the Billboard, the phone app, the life map and every trip.
 * Edit this file to change a stop, a trip or a receipt.
 *
 * Sources: the approved artboards and the briefs (design-brief.md, ux-brief.md). Where those disagree
 * with lib/data.ts on a number, the briefs win. Nothing here is invented: a field with no source is left out.
 *
 * STILL OWED BY RAM (search for "OWED" below to find the spot each one fills):
 *  1. Inbox quotes: a real quote, name and date from his manager at Newral, the TruCost founder and his manager at Ciena.
 *  2. "Lost and found": what did not work, and what he learned.
 *  3. The promo code and the hidden story it unlocks (the Chicago dance battle). Not built until both exist.
 *  4. unBothrrd: the months it ran, so it can become its own stop on the map (it hangs on Masters' Union for now).
 *  5. Synappses: what he did there and any result. The briefs give only "Co-Founder, Apr 2026 to Jun 2026".
 *  6. Netflix Fraternity: the month, so it can become its own stop (shown inside the Masters' Union trip for now).
 *  7. Exact months for stops placed by year only: 10+ dance wins, the world dance battle, Choreography Head,
 *     rank 1 coder, the EDST award and the CienaGPT hackathon. Their "min" figures come from the approved map.
 *  8. Super 30 Hacker House start: the site says Sep 2025, the resume says Jul 2025. The map uses Sep 2025.
 *  9. St. Dominic's School: the map's 91 min assumes the Class 12 result in Apr 2019.
 * 10. TruCost: the months it went live and was sold (the trip says "by October 2026", the contract's last month on the site).
 */

/** Where the page remembers the chosen theme (the main site uses its own key). */
export const THEME_KEY = 'uber-theme';

/* ------------------------------------------------------------------ time */

/** "Today" on the map. One minute on the map is one month before this. */
export const NOW = '2026-11';
export const NOW_LABEL = 'November 2026';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** Months between a 'YYYY-MM' date and today: the "min away" figure. */
export function minutesAway(when: string): number {
  const [y, m] = when.split('-').map(Number);
  const [ny, nm] = NOW.split('-').map(Number);
  return (ny - y) * 12 + (nm - m);
}
export const minLabel = (n: number) => `${n} min`;
/** '2026-05' → 'May 2026' */
export function monthLabel(when: string, short = false): string {
  const [y, m] = when.split('-').map(Number);
  const name = MONTHS[m - 1];
  return `${short ? name.slice(0, 3) : name} ${y}`;
}

/* ------------------------------------------------------------------ the map */

export type Pt = { x: number; y: number };

/** The one road of Ram's life, on a 1920 × 1200 map. Every stop sits on it. */
export const ROAD: Pt[] = [
  { x: 150, y: 220 },
  { x: 700, y: 220 },
  { x: 700, y: 430 },
  { x: 330, y: 430 },
  { x: 330, y: 700 },
  { x: 900, y: 700 },
  { x: 900, y: 330 },
  { x: 1300, y: 330 },
  { x: 1300, y: 620 },
  { x: 1620, y: 620 },
  { x: 1620, y: 960 },
  { x: 1100, y: 960 },
  { x: 1100, y: 790 },
];

export type StopId =
  | 'st-dominics' | 'ramjas' | 'amity' | 'ciena' | 'newral' | 'trucost' | 'masters-union' | 'you'
  | 'dance-wins' | 'world-battle' | 'choreography' | 'rank-1' | 'full-time' | 'edst' | 'cienagpt'
  | 'super-30' | 'tech-lead' | 'wingathon' | 'synappses' | 'product-manager' | 'leetcase';

export type Stop = {
  id: StopId;
  /** 'place' = a square pin, somewhere Ram belonged. 'dot' = something he did there. */
  type: 'place' | 'dot' | 'you';
  name: string;
  /** Second line on the map label and in lists. */
  note?: string;
  /** 'YYYY-MM'. The "min away" figure is derived from this. */
  when: string;
  /** True when only the year is confirmed and the month comes from the approved map. OWED 7, 8, 9. */
  monthAssumed?: boolean;
  at: Pt;
  /** Where the name tag sits on the map (places only). */
  tag?: Pt;
  /** The trip this stop opens. */
  trip: TripId;
  /** Listed under "Wins" in search. */
  win?: boolean;
};

/** Every stop, in road order from Mathura to today. */
export const STOPS: Stop[] = [
  { id: 'st-dominics', type: 'place', name: 'St. Dominic’s School', note: 'Mathura. Class 12, 91%', when: '2019-04', monthAssumed: true, at: { x: 150, y: 220 }, tag: { x: 240, y: 150 }, trip: 'st-dominics' },
  { id: 'ramjas', type: 'place', name: 'Ramjas College', note: 'Delhi. BSc Physical Sciences', when: '2019-08', at: { x: 343, y: 220 }, tag: { x: 447, y: 300 }, trip: 'ramjas' },
  { id: 'dance-wins', type: 'dot', name: '10+ dance wins', when: '2020-06', monthAssumed: true, at: { x: 700, y: 344 }, trip: 'dance', win: true },
  { id: 'world-battle', type: 'dot', name: 'World dance battle, Top 16', when: '2021-06', monthAssumed: true, at: { x: 330, y: 551 }, trip: 'dance', win: true },
  { id: 'choreography', type: 'dot', name: 'Choreography Head', when: '2021-09', monthAssumed: true, at: { x: 330, y: 696 }, trip: 'dance' },
  { id: 'amity', type: 'place', name: 'Amity University', note: 'Noida. MCA', when: '2022-08', at: { x: 855, y: 700 }, tag: { x: 737, y: 776 }, trip: 'amity' },
  { id: 'rank-1', type: 'dot', name: 'Rank 1 coder of 400+', when: '2023-05', monthAssumed: true, at: { x: 918, y: 330 }, trip: 'amity', win: true },
  { id: 'ciena', type: 'place', name: 'Ciena', note: 'Gurugram. Intern, then engineer', when: '2024-01', at: { x: 1300, y: 334 }, tag: { x: 1326, y: 258 }, trip: 'ciena' },
  { id: 'full-time', type: 'dot', name: 'Full-time engineer', when: '2024-07', at: { x: 1302, y: 620 }, trip: 'ciena' },
  { id: 'edst', type: 'dot', name: 'EDST award, 4 of 14,000', when: '2024-10', monthAssumed: true, at: { x: 1447, y: 620 }, trip: 'ciena', win: true },
  { id: 'cienagpt', type: 'dot', name: 'Top 10, CienaGPT AI hackathon', when: '2024-12', monthAssumed: true, at: { x: 1543, y: 620 }, trip: 'ciena', win: true },
  { id: 'super-30', type: 'dot', name: 'Super 30 Hacker House', when: '2025-09', monthAssumed: true, at: { x: 1604, y: 960 }, trip: 'super-30', win: true },
  { id: 'newral', type: 'place', name: 'Newral', note: 'Noida. Engineer, then product', when: '2025-10', at: { x: 1556, y: 960 }, tag: { x: 1658, y: 1040 }, trip: 'newral' },
  { id: 'tech-lead', type: 'dot', name: 'Tech Lead and Best Employee', when: '2025-12', at: { x: 1459, y: 960 }, trip: 'newral', win: true },
  { id: 'wingathon', type: 'dot', name: 'YC VibeCon Wingathon winner', when: '2026-04', at: { x: 1267, y: 960 }, trip: 'newral', win: true },
  { id: 'synappses', type: 'dot', name: 'Synappses, Co-Founder', when: '2026-04', at: { x: 1243, y: 960 }, trip: 'synappses' },
  { id: 'product-manager', type: 'dot', name: 'Product Manager', when: '2026-05', at: { x: 1219, y: 960 }, trip: 'newral' },
  { id: 'trucost', type: 'place', name: 'TruCost', note: 'Ride-hailing app, built and sold', when: '2026-06', at: { x: 1171, y: 960 }, tag: { x: 1312, y: 1076 }, trip: 'trucost' },
  { id: 'masters-union', type: 'place', name: 'Masters’ Union', note: 'Gurugram. PGP, now', when: '2026-07', at: { x: 1123, y: 960 }, tag: { x: 880, y: 1060 }, trip: 'masters-union' },
  { id: 'leetcase', type: 'dot', name: 'LeetCase launched', when: '2026-09', at: { x: 1100, y: 886 }, trip: 'leetcase' },
  { id: 'you', type: 'you', name: 'You are here', note: `Ram, ${NOW_LABEL}`, when: NOW, at: { x: 1100, y: 790 }, trip: 'story' },
];

export const stop = (id: StopId): Stop => STOPS.find((s) => s.id === id)!;
/** The seven places with square pins, plus "You are here". */
export const PLACES = STOPS.filter((s) => s.type !== 'dot');

/* ------------------------------------------------------------------ trips */

export type TripId =
  | 'trucost' | 'newral' | 'ciena' | 'leetcase' | 'unbothrrd' | 'synappses' | 'super-30' | 'dance'
  | 'st-dominics' | 'ramjas' | 'amity' | 'masters-union'
  | 'idle-minutes' | 'story';

export type Pictogram = 'car' | 'chart' | 'building' | 'doc' | 'bag' | 'cap' | 'code' | 'music' | 'bulb' | 'route' | 'pin';

export type Trip = {
  id: TripId;
  name: string;
  /** One line under the name in search and on cards. */
  sub: string;
  icon: Pictogram;
  /** Where the route starts and ends on the map. Most trips start at "You are here". */
  from: StopId;
  to: StopId;
  /** Shown instead of the derived minutes when the dates are not known (OWED 4). */
  noMinutes?: boolean;
  /** The line Ram held, for "Meet Ram at the pickup point: …". */
  pickup: string;
  /** One paragraph for the "Now showing" panel and the top of the full story. */
  blurb: string;
  /** The two ends of the trip, shown in the route box of Trip details. */
  leg?: [{ title: string; when: string }, { title: string; when: string }];
  /** The blue row. */
  result?: { sub: string; value: string };
  /** The row under it: a headline, an optional green badge and a grey line. */
  proof?: { title: string; badge?: string; note?: string };
  /** Full story only. */
  problem?: string;
  /** What Ram did. Also the three ticks in "Now showing". */
  did?: string[];
  /** Ruled receipt rows. "Distance from today" is added automatically when the minutes are known. */
  receipt?: { label: string; value: string }[];
  /** Activity tab: the grey line above the name, and the date tile. */
  activity?: { role: string; when: string; line: string };
  /** One of the five chapters counted in Account › Chapters explored. */
  chapter?: boolean;
};

export const TRIPS: Trip[] = [
  {
    id: 'trucost',
    name: 'TruCost',
    sub: 'Ride-hailing app, built and sold',
    icon: 'car',
    from: 'you',
    to: 'trucost',
    pickup: 'Product Manager, 2026',
    blurb: 'A ride-hailing app with an in-cab tablet that earns from advertisers during the ride.',
    leg: [
      { title: 'Took the contract as Product Manager', when: 'June 2026' },
      { title: 'Both apps live on the App Store and Play Store', when: 'By October 2026' }, // the contract's last month; OWED 10: the launch and sale months
    ],
    result: { sub: 'Sold to the founder', value: '₹2.5L' },
    proof: { title: '100 drivers onboarded', badge: 'Live on both app stores', note: 'Hired and led the development team' },
    problem: 'Ride margins are thin, and the rider’s attention during a ride goes unused.',
    did: ['Built the app for iOS and Android', 'Ran advertiser outreach and deals', 'Designed rider fares and offers'],
    receipt: [
      { label: 'Drivers onboarded', value: '100' },
      { label: 'Sold to the founder for', value: '₹2.5L' },
    ],
    activity: { role: 'Built and sold', when: '2026-06', line: '100 drivers, sold for ₹2.5L' },
    chapter: true,
  },
  {
    id: 'newral',
    name: 'Newral',
    sub: 'From $0 to $6K monthly revenue',
    icon: 'chart',
    from: 'you',
    to: 'newral',
    pickup: 'Product Lead, 2025',
    blurb: 'An early-stage AI startup in Noida. Ram joined as an engineer and left owning go-to-market and pricing.',
    leg: [
      { title: 'Joined as a software engineer', when: 'October 2025' },
      { title: 'Product Lead, owning GTM and pricing', when: 'May 2026' },
    ],
    result: { sub: 'Monthly revenue, from zero', value: '$6K' },
    proof: { title: 'Doubled user engagement', badge: '+25% platform traffic', note: 'Best Employee within three months' },
    did: ['Owned positioning, pricing and go-to-market with the founder', 'Shipped features and experiments that doubled engagement', 'Moved the platform to a cheaper cloud with zero downtime'],
    receipt: [
      { label: 'Monthly revenue, from zero', value: '$6K' },
      { label: 'Platform traffic', value: '+25%' },
    ],
    activity: { role: 'Product Lead', when: '2026-05', line: '$0 to $6K monthly revenue' },
    chapter: true,
  },
  {
    id: 'ciena',
    name: 'Ciena',
    sub: '4 of 14,000 to win the annual award',
    icon: 'building',
    from: 'you',
    to: 'ciena',
    pickup: 'Solutions Engineer, 2024',
    blurb: 'A NYSE-listed networking company. Ram ran enterprise automation and tool adoption, and won its annual award as a new grad.',
    leg: [
      { title: 'Joined as an IT/Ops intern', when: 'January 2024' },
      { title: 'IT Applications Solutions Engineer', when: 'July 2024 to October 2025' },
    ],
    result: { sub: 'Annual award winners, of 14,000', value: '4' },
    proof: { title: 'Cut $30K+ in yearly software spend', badge: '35% fewer SLA breaches', note: 'First new grad to win the EDST Customer’s First Award' },
    did: ['Saved 4+ hours a day across 5+ global teams', 'Cut SLA breaches by 35% with new workflows', 'Audited licences and removed $30K+ of yearly cost'],
    receipt: [
      { label: 'Annual award', value: '4 of 14,000' },
      { label: 'CienaGPT AI hackathon', value: 'Top 10 of 800+' },
    ],
    activity: { role: 'Solutions Engineer', when: '2024-01', line: '4 of 14,000 won the annual award' },
    chapter: true,
  },
  {
    id: 'leetcase',
    name: 'LeetCase',
    sub: 'Case practice for MBA aspirants',
    icon: 'doc',
    from: 'you',
    to: 'leetcase',
    pickup: 'Founder, 2026',
    blurb: 'Case and guesstimate practice for MBA aspirants, taken from a PRD to a live product.',
    leg: [
      { title: 'Launched, from a PRD to an MVP', when: 'September 2026' },
      { title: '150 users across Masters’ Union communities', when: 'Now' },
    ],
    result: { sub: 'Users', value: '150' },
    proof: { title: '70% activation', badge: '124 problems', note: 'PRD to MVP in under two months' },
    problem: 'Case and guesstimate prep is scattered across PDFs and group chats, with no structured way to practise, get hints or track progress.',
    did: ['Ran research with MBA aspirants to shape the roadmap', 'Built problem sets, hints and a guided solve flow', 'Grew it with A/B tests and feedback loops'],
    receipt: [
      { label: 'Users', value: '150' },
      { label: 'Activation', value: '70%' },
    ],
    activity: { role: 'Founder', when: '2026-09', line: '150 users, 70% activation' },
    chapter: true,
  },
  {
    id: 'unbothrrd',
    name: 'unBothrrd',
    sub: 'D2C brand, ₹7.2L revenue',
    icon: 'bag',
    from: 'you',
    to: 'masters-union', // OWED 4: its own stop, once the months are known
    noMinutes: true,
    pickup: 'Founder, 2026',
    blurb: 'A D2C brand built offline and online, from zero, as a Masters’ Union venture.',
    result: { sub: 'D2C revenue', value: '₹7.2L' },
    proof: { title: 'Owned the P&L end to end', note: 'Pop-up stalls and an own web store' },
    problem: 'No brand, no audience and a fixed window to find product and channel fit before the money ran out.',
    did: ['Ran pop-up stalls to test products and pricing face to face', 'Sold online through an own storefront', 'Automated fulfilment, inventory and support'],
    receipt: [
      { label: 'D2C revenue', value: '₹7.2L' },
      { label: 'Channels', value: 'Stalls and web' },
    ],
  },
  {
    id: 'synappses',
    name: 'Synappses',
    sub: 'Co-Founder, April to June 2026',
    icon: 'cap',
    from: 'you',
    to: 'synappses',
    pickup: 'Co-Founder, 2026',
    blurb: 'An AI-native LMS for coaching centres. Ram was a co-founder from April to June 2026.', // OWED 5: what he did and the result
    leg: [
      { title: 'Co-Founder', when: 'April 2026' },
      { title: 'Co-Founder', when: 'June 2026' },
    ],
    receipt: [{ label: 'Role', value: 'Co-Founder' }],
  },
  {
    id: 'super-30',
    name: 'Super 30',
    sub: '1 of 30 builders, 100xSchool',
    icon: 'code',
    from: 'you',
    to: 'super-30',
    pickup: 'Builder, 2025',
    blurb: 'The Super 30 Hacker House at 100xSchool, funded by YC. Ram was one of 30 builders picked nationwide, while working full-time.',
    leg: [
      { title: 'Selected for the Hacker House', when: '2025' }, // OWED 8: Sep or Jul 2025
      { title: 'Students Affairs Head', when: '2026' },
    ],
    result: { sub: 'Builders picked nationwide', value: '1 of 30' },
    proof: { title: 'Mentored 30+ students for Google Summer of Code', note: 'Alongside a full-time job' },
    receipt: [
      { label: 'Selected', value: '1 of 30' },
      { label: 'Students mentored', value: '30+' },
    ],
  },
  {
    id: 'dance',
    name: 'Dance',
    sub: 'Represented India at a world final',
    icon: 'music',
    from: 'you',
    to: 'world-battle',
    pickup: 'Dancer, 2021',
    blurb: 'Before code and product, Ram danced. He represented India at the Chicago Footworkology World Final.',
    leg: [
      { title: 'Won 10+ inter-college competitions', when: '2020' },
      { title: 'Chicago Footworkology World Final', when: '2021' },
    ],
    result: { sub: 'Worldwide, representing India', value: 'Top 16' },
    proof: { title: 'Choreography Head, Ramjas Dance Society', badge: 'Top 4 in India', note: 'Coordinated 10+ outstation fests' },
    receipt: [
      { label: 'World final', value: 'Top 16' },
      { label: 'Inter-college titles', value: '10+' },
    ],
  },
  {
    id: 'st-dominics',
    name: 'St. Dominic’s School',
    sub: 'Mathura, where it started',
    icon: 'pin',
    from: 'you',
    to: 'st-dominics',
    pickup: 'Student, 2019',
    blurb: 'Where the road starts: St. Dominic’s Sr. Sec. School in Mathura.',
    result: { sub: 'Class 12, all-batch top 10%', value: '91%' },
    proof: { title: 'House Captain', note: 'Badminton gold medallist' },
    receipt: [
      { label: 'Class 12', value: '91%' },
      { label: 'In the batch', value: 'Top 10%' },
    ],
  },
  {
    id: 'ramjas',
    name: 'Ramjas College',
    sub: 'Physical Sciences and the dance years',
    icon: 'pin',
    from: 'you',
    to: 'ramjas',
    pickup: 'Student, 2019',
    blurb: 'BSc Physical Sciences at the University of Delhi, where the stage became a second classroom.',
    leg: [
      { title: 'Joined BSc Physical Sciences', when: 'August 2019' },
      { title: 'Choreography Head, Ramjas Dance Society', when: '2021' },
    ],
    result: { sub: 'Inter-college dance titles', value: '10+' },
    proof: { title: 'Represented India at a world dance battle', badge: 'Top 16 worldwide', note: 'Chicago Footworkology World Final, 2021' },
    receipt: [
      { label: 'Dance titles', value: '10+' },
      { label: 'World final', value: 'Top 16' },
    ],
  },
  {
    id: 'amity',
    name: 'Amity University',
    sub: 'MCA, rank 1 coder of 400+',
    icon: 'pin',
    from: 'you',
    to: 'amity',
    pickup: 'Student, 2022',
    blurb: 'The switch from the stage to software: an MCA in Noida.',
    leg: [
      { title: 'Started the MCA', when: '2022' },
      { title: 'Day-0 placement at Ciena', when: '2023' },
    ],
    result: { sub: 'Coder of the batch, of 400+', value: 'Rank 1' },
    proof: { title: 'Graduated with an 8.04 CGPA', note: 'Day-0 placement at Ciena' },
    receipt: [
      { label: 'Batch rank in coding', value: '1 of 400+' },
      { label: 'CGPA', value: '8.04' },
    ],
  },
  {
    id: 'masters-union',
    name: 'Masters’ Union',
    sub: 'PGP in Technology and Business, Gurugram',
    icon: 'pin',
    from: 'you',
    to: 'masters-union',
    pickup: 'PGP student, 2026',
    blurb: 'Where Ram is now: a PGP in Technology and Business Management, learning business by running one.',
    leg: [
      { title: 'Joined the PGP', when: 'July 2026' },
      { title: 'Building LeetCase and unBothrrd', when: 'Now' },
    ],
    result: { sub: 'D2C revenue from unBothrrd', value: '₹7.2L' },
    proof: { title: 'Locked core member, Netflix Fraternity', badge: '4 of 430', note: 'Launched LeetCase to 150 users' }, // OWED 6
    receipt: [
      { label: 'D2C revenue', value: '₹7.2L' },
      { label: 'Netflix Fraternity', value: '4 of 430' },
    ],
  },
  {
    id: 'idle-minutes',
    name: 'The 20 idle minutes',
    sub: 'What I would build at Uber',
    icon: 'bulb',
    from: 'trucost',
    to: 'you',
    pickup: 'Product Manager, 2026',
    blurb: 'One idea for Uber, grounded in what Ram ran at TruCost: let riders top up their driver’s earnings.',
    did: ['A back-seat tablet shows a short brand survey', 'The rider completes it during the ride', 'Most of the fee goes to that driver, on that trip'],
    receipt: [
      { label: 'Idle time per trip, about', value: '20 min' },
      { label: 'Advertisers quoted, per survey', value: '₹25' },
    ],
    chapter: true,
  },
  {
    id: 'story',
    name: 'Ride through Ram’s story',
    sub: 'Mathura to today',
    icon: 'route',
    from: 'st-dominics',
    to: 'you',
    pickup: 'St. Dominic’s School, 2019',
    blurb: 'One road from a school in Mathura to today. Two reroutes on the way: from the stage to software, and from engineering to product.',
    did: ['Physical Sciences, then dance', 'Code: rank 1 of the batch, then Ciena', 'Product: Newral, TruCost, Masters’ Union'],
    receipt: [
      { label: 'Places on the road', value: '7' },
      { label: 'Reroutes', value: '2' },
    ],
  },
];

export const trip = (id: TripId): Trip => TRIPS.find((t) => t.id === id)!;
/** Minutes from today to where the trip ends, or null when its dates are not known. */
export function tripMinutes(t: Trip): number | null {
  if (t.noMinutes) return null;
  const end = t.to === 'you' ? t.from : t.to;
  return minutesAway(stop(end).when);
}

/** Where the road turns: shown as "Rerouted" in the story ride. The stop named is the first one after the turn. */
export const REROUTES: { before: StopId; text: string }[] = [
  { before: 'amity', text: 'Rerouted: from the stage to software' },
  { before: 'product-manager', text: 'Rerouted: from engineering to product' },
];

/* ------------------------------------------------------------------ the teardown (Activity › Upcoming) */

/** "The 20 idle minutes", from the interview with Ram on 20 Nov 2026 (ux-brief.md). `quick` parts show in the Quick ride. */
export const TEARDOWN: { title: string; parts: { heading: string; text: string; quick?: boolean; label?: string }[] } = {
  title: 'The 20 idle minutes: let riders top up their driver’s earnings',
  parts: [
    { heading: 'The problem', text: 'Drivers ask for the destination first, then cancel or ask for extra cash, because the fare often does not justify the distance. Riders feel it as cancellations.', quick: true },
    { heading: 'What I saw', text: 'Drivers work out what a trip is worth before they accept. In Pune, drivers formed groups that refuse app fares and charge more. By my field estimate, a cab driver nets about ₹15 per km, close to a Delhi auto fare.' },
    { heading: 'The insight', text: 'A rider sits idle for about 20 minutes per trip. Brands pay for a city consumer’s focused attention: advertisers quoted me ₹25 per completed survey during TruCost deals.' },
    { heading: 'The idea', text: 'A back-seat tablet from Uber shows a short brand survey. When the rider completes it, most of the fee goes to that driver, on that trip.', quick: true },
    { heading: 'Why it helps', text: 'The driver earns more per trip without the rider paying more, so a low fare is less of a reason to cancel.', quick: true },
    { heading: 'Why me', text: 'I ran in-cab tablet advertising and advertiser deals at TruCost. Drivers there got a share of the ad money, and I saw it motivate them.' },
    { heading: 'An example', label: 'Illustration, not data', text: 'An 8 km trip at ₹15 per km is ₹120 for the driver. If ₹15 of a ₹25 survey goes to the driver, that trip pays 12% more. The ₹15 share is my assumption.' },
    { heading: 'Risks I would test', text: 'Not every rider will opt in, so test the opt-in rate and reward the rider too. The tablet asks, never the driver, to avoid pressure and rating damage. The money arrives after the trip while the driver decides before it, so show the driver a likely bonus before they accept.' },
    { heading: 'What exists already', text: 'Uber has run Journey Ads in India since June 2023 and has piloted in-car tablets. The new part is paid surveys with the money going to the driver. I have not confirmed the current status of the tablet pilot.' },
  ],
};

/* ------------------------------------------------------------------ the page around the phone */

export const TRIBUTE = 'A fan-made portfolio. Not affiliated with Uber.';
export const TRIBUTE_LONG = 'A fan-made portfolio by Ram Bhardwaj. Not affiliated with Uber.';

export const BILLBOARD = {
  wordmark: 'Ram',
  statuses: ['Finding your product manager', 'Ram accepted your request'],
  headline: { before: 'Your product manager is', badge: '2 min', after: 'away.' },
  pitch: 'I’m Ram. I built and sold a ride-hailing app. Tap the phone; it’s my portfolio.',
  start: 'Start the ride',
  reserve: 'Reserve Ram',
  chooseTitle: 'Choose a Ram',
};

export const STAGE = {
  status: 'Ram accepted your request',
  headline: 'Your product manager has arrived.',
  body: 'This phone is my portfolio. Tap anything in it. Every screen is a part of my story.',
  nowShowing: 'Now showing from the phone',
};

/* ------------------------------------------------------------------ personas: "Choose a Ram" and "Riding with" */

export type PersonaId = 'pm' | 'engineer' | 'founder' | 'dancer';

export type Persona = {
  id: PersonaId;
  /** In the phone: the switch at the top of Home and the "Riding with" sheet. */
  label: string;
  proof: string;
  icon: Pictogram;
  /** On the Billboard strip. The names differ from the phone's on the approved artboards. */
  card: { name: string; time: string; line: string };
  /** The recent place on Home, and the tiles moved to the front of "For you". */
  lead: TripId;
  first: TripId[];
};

export const PERSONAS: Persona[] = [
  { id: 'pm', label: 'Ram, Product Manager', proof: 'Newral, TruCost, LeetCase', icon: 'chart', card: { name: 'Ram PM', time: '2 min', line: 'Took Newral from $0 to $6K monthly revenue' }, lead: 'trucost', first: [] },
  { id: 'engineer', label: 'Ram, Engineer', proof: 'Ciena, Super 30, rank 1 coder', icon: 'code', card: { name: 'Ram Engineer', time: '2 min', line: 'Built TruCost for iOS and Android; 100 drivers onboarded' }, lead: 'ciena', first: ['ciena', 'super-30'] },
  { id: 'founder', label: 'Ram, Founder', proof: 'unBothrrd, Synappses', icon: 'bag', card: { name: 'Ram Growth', time: '2 min', line: 'Ran a D2C brand to ₹7.2L revenue' }, lead: 'unbothrrd', first: ['unbothrrd', 'synappses'] },
  { id: 'dancer', label: 'Ram, Dancer', proof: 'India at a world final', icon: 'music', card: { name: 'Ram Performer', time: '2 min', line: 'Represented India at a world dance battle' }, lead: 'dance', first: ['dance'] },
];

/* ------------------------------------------------------------------ Home */

/** "For you": eight tiles. `badge` is the red result badge. */
export const TILES: { trip: TripId; badge?: string }[] = [
  { trip: 'trucost', badge: 'Sold ₹2.5L' },
  { trip: 'newral', badge: '$0 to $6K' },
  { trip: 'ciena' },
  { trip: 'leetcase' },
  { trip: 'unbothrrd', badge: '₹7.2L' },
  { trip: 'synappses' },
  { trip: 'super-30' },
  { trip: 'dance' },
];

export const HOME = {
  where: 'Where to?',
  reserve: 'Reserve',
  forYou: 'For you',
  elevate: 'Elevate your team',
  cards: ['idle-minutes', 'story'] as TripId[],
  availability: 'Open to PM roles',
  tabs: { ram: 'Ram', shipped: 'Shipped', journey: 'Journey' },
};

/** The Shipped tab: products Ram built or co-founded, newest first. */
export const SHIPPED: TripId[] = ['leetcase', 'trucost', 'unbothrrd', 'newral', 'synappses'];

/* ------------------------------------------------------------------ Search */

export const SEARCH = {
  title: 'Plan your ride',
  chips: ['From today', 'For Uber'],
  from: `Ram, ${NOW_LABEL}`,
  placeholder: 'Where to?',
  shortcuts: { experience: 'Experience', wins: 'Wins' },
  /** The companies listed under "Experience". */
  experience: ['trucost', 'newral', 'ciena'] as TripId[],
  empty: 'No place by that name on Ram’s map.',
};

/* ------------------------------------------------------------------ ride flow */

export const RIDE = {
  choose: 'Choose a trip',
  quick: { name: 'Quick ride', time: '30 sec', line: '30 seconds. The headline numbers', badge: 'Faster' },
  full: { name: 'Full story', time: '2 min', line: '2 minutes. Problem, work, results', badge: 'Recommended' },
  free: 'Free. It costs only your time',
  requested: 'Ride requested',
  finding: 'Finding your experience',
  freeRide: 'Free ride',
  details: 'Trip details',
  result: 'The result',
  share: 'Share trip with a colleague',
  back: 'Back to the map',
  reserve: 'Reserve Ram',
  /** Milliseconds on the "Finding your experience" screen: the first time, and after that. Skipped for reduced motion. */
  findingMs: { first: 1000, later: 450 },
};

/* ------------------------------------------------------------------ Services */

export const SERVICES = {
  title: 'Services',
  book: 'Book Ram for',
  main: [
    { name: '0 to 1 launches', line: 'TruCost, LeetCase', icon: 'car', trip: 'trucost' },
    { name: 'Go to market', line: 'Newral, $0 to $6K', icon: 'chart', trip: 'newral' },
    { name: 'Pricing', line: 'Fares and offers at TruCost', icon: 'bag', trip: 'trucost' },
    { name: 'Growth', line: '+25% traffic at Newral', icon: 'doc', trip: 'newral' },
  ] as { name: string; line: string; icon: Pictogram; trip: TripId }[],
  also: 'Also on board',
  more: [
    { name: 'iOS and Android', icon: 'code', trip: 'trucost' },
    { name: 'SOPs and process', icon: 'building', trip: 'ciena' },
    { name: 'Mentoring', icon: 'cap', trip: 'super-30' },
    { name: 'Stage and pitch', icon: 'music', trip: 'dance' },
  ] as { name: string; icon: Pictogram; trip: TripId }[],
};

/* ------------------------------------------------------------------ Activity */

export const ACTIVITY = {
  title: 'Activity',
  upcoming: 'Upcoming',
  past: 'Past',
  again: 'Ride again',
  upcomingTrip: 'idle-minutes' as TripId,
  /** Past trips, newest first. */
  pastTrips: ['leetcase', 'trucost', 'newral', 'ciena'] as TripId[],
  filters: {
    category: { label: 'Category', options: ['All', 'Products', 'Companies'] },
    role: { label: 'Role', options: ['All', 'Founder', 'Product', 'Engineer'] },
  },
  /** Which filter values each past trip answers to. */
  tags: {
    leetcase: ['Products', 'Founder', 'Product'],
    trucost: ['Products', 'Product'],
    newral: ['Companies', 'Product', 'Engineer'],
    ciena: ['Companies', 'Engineer'],
  } as Partial<Record<TripId, string[]>>,
  none: 'No trips match these filters.',
};

/* ------------------------------------------------------------------ Inbox */

export type Message = { from: string; when: string; text: string; placeholder?: boolean };

/** OWED 1: the three quotes are placeholders, and are shown as placeholders. Never fill them with invented words. */
export const INBOX: Message[] = [
  { from: 'Ram', when: 'Now', text: 'Hi Uber. I built and sold a ride-hailing app. I would like to build yours next.' },
  { from: '[NAME, Newral]', when: '[DATE]', text: '[QUOTE FROM YOUR MANAGER AT NEWRAL]', placeholder: true },
  { from: '[NAME, TruCost]', when: '[DATE]', text: '[QUOTE FROM THE TRUCOST FOUNDER]', placeholder: true },
  { from: '[NAME, Ciena]', when: '[DATE]', text: '[QUOTE FROM YOUR MANAGER AT CIENA]', placeholder: true },
];

/* ------------------------------------------------------------------ Account */

export const ACCOUNT = {
  name: 'Ram Bhardwaj',
  status: 'Open to PM roles',
  chapters: { title: 'Chapters explored' },
  dance: { title: 'The dance side', line: 'Represented India at a world final in Chicago', trip: 'dance' as TripId },
  /** OWED 2: the card is drawn on the artboard; its story is not written yet, and the sheet says so. */
  lost: { title: 'Lost and found', line: 'What did not work, and what I learned', pending: '[TO COME FROM RAM: what did not work, and what he learned]' },
  appearance: 'Appearance',
  mainSite: { title: 'Open the main site', line: 'rambhardwaj.in, the full portfolio' },
  miniRam: { title: 'Ask Mini Ram', line: 'An AI that answers from Ram’s portfolio' },
  share: { title: 'Share this page', line: 'Send it to a colleague' },
};

/** The trips counted by "Chapters explored". */
export const CHAPTERS = TRIPS.filter((t) => t.chapter).map((t) => t.id);

/* ------------------------------------------------------------------ Reserve Ram */

export const RESERVE = {
  title: 'Reserve Ram',
  line: 'Open to Product Manager roles. He replies fastest by email.',
  email: 'Email Ram',
  linkedin: 'Message on LinkedIn',
  copy: 'Copy',
  copied: 'Copied',
  subject: 'Reserve Ram: Product Manager at Uber',
};

/* ------------------------------------------------------------------ the panel beside the phone */

/** One colour per trip, taken from the pictogram colours on the artboards. Used beside the phone, never inside it. */
export const ACCENT: Record<TripId, string> = {
  trucost: '#FFC043',
  newral: '#276EF1',
  ciena: '#7DE2A0',
  leetcase: '#0E8345',
  unbothrrd: '#FF7A45',
  synappses: '#276EF1',
  'super-30': '#7DE2A0',
  dance: '#B46BFF',
  'st-dominics': '#FFC043',
  ramjas: '#B46BFF',
  amity: '#7DE2A0',
  'masters-union': '#FF7A45',
  'idle-minutes': '#FFC043',
  story: '#276EF1',
};

/** Road and area names on the big map (from the approved map artboard). */
export const ROAD_NAMES: { name: string; x: number; y: number; turn?: number }[] = [
  { name: 'Intercity Highway', x: 470, y: 196 },
  { name: 'Footwork Street', x: 304, y: 600, turn: -90 },
  { name: 'Pivot Flyover', x: 560, y: 676 },
  { name: 'Day-0 Road', x: 1080, y: 306 },
  { name: 'Award Row', x: 1520, y: 596 },
  { name: 'Switch Lane', x: 1646, y: 760, turn: 90 },
  { name: 'Zero-to-One Expressway', x: 1440, y: 1000 },
];
export const AREA_NAMES: { name: string; x: number; y: number }[] = [
  { name: 'OLD TOWN', x: 150, y: 330 },
  { name: 'STAGE LANE', x: 400, y: 612 },
  { name: 'CODE QUARTER', x: 600, y: 1100 },
  { name: 'ENTERPRISE ROW', x: 960, y: 470 },
  { name: 'PRODUCT DISTRICT', x: 1350, y: 1150 },
];

/**
 * What each phone screen stands for, shown beside the phone: the Uber feature, and what it means here.
 * Wording follows the mapping bank in ux-brief.md.
 */
export type ScreenKey = 'home' | 'shipped' | 'journey' | 'search' | 'choose' | 'finding' | 'details' | 'services' | 'activity' | 'account' | 'inbox' | 'switch' | 'reserve' | 'lost';
export const EXPLAIN: Record<ScreenKey, { title: string; uber: string; here: string }> = {
  home: { title: 'Home', uber: '“Where to?” and your recent places', here: 'Where do you want to take Ram? The tiles are the places he has already been.' },
  shipped: { title: 'Shipped', uber: 'The second tab of the home screen', here: 'Products Ram built or co-founded. Tap one to ride there.' },
  journey: { title: 'Journey', uber: 'The map, with pickup and drop-off', here: 'One road from Mathura to today. Pick two places and the stops between them appear.' },
  search: { title: 'Plan your ride', uber: 'Search, with saved and recent places', here: 'Every place on Ram’s map, nearest first. One minute away is one month ago.' },
  choose: { title: 'Choose a trip', uber: 'Choose a ride', here: 'Same destination, two ways to get there: the headline numbers, or the full story.' },
  finding: { title: 'Ride requested', uber: 'Finding your ride', here: 'Finding your experience. Ram is already on the way.' },
  details: { title: 'Trip details', uber: 'Fare breakdown and receipt', here: 'What the work was, and what it returned.' },
  services: { title: 'Services', uber: 'The services grid', here: 'What Ram can be booked for: 0 to 1 launches, go to market, pricing and growth.' },
  activity: { title: 'Activity', uber: 'Past and upcoming trips', here: 'Past trips are shipped work. The upcoming trip is what he would build at Uber.' },
  account: { title: 'Account', uber: 'Your profile', here: 'The person: how to reach him, the dance side, and what did not work.' },
  inbox: { title: 'Inbox', uber: 'Ratings and compliments', here: 'Real quotes only. No invented rating.' },
  switch: { title: 'Riding with', uber: 'Switching the rider profile', here: 'Same person, a different vehicle. Each one comes with its own proof.' },
  reserve: { title: 'Reserve Ram', uber: 'Reserve a ride for later', here: 'The one action that counts: send Ram a message.' },
  lost: { title: 'Lost and found', uber: 'Lost and found', here: 'What did not work, and what he learned.' },
};

/** Three proofs on the panel before anything is tapped. Each opens its trip. */
export const HERO_FACTS: { trip: TripId; value: string; label: string }[] = [
  { trip: 'trucost', value: '₹2.5L', label: 'TruCost, built and sold' },
  { trip: 'newral', value: '$6K', label: 'Newral, monthly revenue from zero' },
  { trip: 'ciena', value: '4 of 14,000', label: 'Ciena, annual award' },
];
