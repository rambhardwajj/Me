/**
 * All site content lives here. Edit this file to update the portfolio.
 * SOURCE OF TRUTH: Ram's résumé, the copy he sent on 24 Nov 2026. Every number here matches it; where an older
 * note or brief disagrees, the résumé wins. Lines marked TODO need a check.
 */

import { FIG } from './figures';

export const PROFILE = {
  name: 'Ram Bhardwaj',
  firstName: 'Ram',
  role: 'Product Manager',
  headline: 'Product Manager',
  // Hero photo, cropped around the face to a 4:5 portrait.
  portrait: 'https://res.cloudinary.com/ewpg7mfj/image/upload/c_fill,g_face,ar_4:5,w_900,z_0.7/f_auto,q_auto/v1792300638/P1182901_nwx7t6.jpg',
  availability: 'Open to Product Manager roles',
  pitch:
    `I’m Ram, a Product Manager and former software engineer. I’ve scaled an AI SaaS LMS from ${FIG.users} users and from ${FIG.mrr} MRR, shipped iOS and Android ride-hailing apps with ${FIG.drivers} drivers onboarded, and built a D2C brand to ${FIG.sales} in sales.`,
  location: 'Gurugram, India',
  timezone: 'Asia/Kolkata',
  status: 'Open to product leadership, founder’s office & strategy roles', // TODO: confirm target roles
  current: 'PGP in Technology & Business Management, Masters’ Union',
  intro:
    'Product Manager and former software engineer who builds and scales SaaS and mobile products from 0 → 100, owning the full lifecycle from user research and PRDs to Android and iOS releases.',
  email: 'ram.bhardwaj2027@mastersunion.org',
  linkedin: 'https://www.linkedin.com/in/bhardwajram',
  github: 'https://github.com/bhardwajram',
  x: 'https://x.com/ram_101001',
  instagram: 'https://www.instagram.com/likwid_z/',
  resume: '', // set to '/Ram_Bhardwaj_Resume.pdf' once that file is in public/; the hero, nav and menu buttons appear automatically
};

export type Metric = { prefix?: string; value: number; suffix?: string; decimals?: number; label: string; note: string };

export const METRICS: Metric[] = [
  { prefix: '$', value: 10, suffix: 'K', label: `MRR, up from ${FIG.mrrFrom}`, note: 'Synappses, in 4 months' },
  { value: 70, suffix: 'K', label: 'Users, up from 5K', note: 'Synappses AI SaaS LMS' },
  { prefix: '₹', value: 7.2, suffix: 'L', decimals: 1, label: 'D2C sales in 2 months', note: 'unBothrrd' },
  { value: 4, suffix: '/14K', label: 'Global award winners', note: 'Ciena’s annual award' },
];

export const ABOUT = {
  // the headline cycles through these: "I’m Ram. I’m …"
  roles: ['a Product Manager', 'an international dancer', 'a hackathon winner', 'a builder of anything code can make', 'a former software engineer'],
  body: 'I work closely with design, engineering, QA and third parties, and I’m at my best aligning a team around clear priorities and shipping fast without dropping quality. Engineer at heart, performer by training, operator by habit.',
};

export type AchievementTag = 'Product' | 'Tech' | 'Leadership' | 'Stage' | 'Academics';

/** Every key achievement, newest first. `photo` borrows the picture from that journey milestone (by id). */
export const ACHIEVEMENTS: { year: string; title: string; context: string; metric: string; tag: AchievementTag; photo?: string }[] = [
  { year: '2026', title: 'Won the YC VibeCon Wingathon', context: 'National hackathon in Bangalore: built and pitched the best product in 24 hours', metric: 'Top 10 of 30,000', tag: 'Tech', photo: 'wingathon' },
  { year: '2026', title: 'First core member, Netflix Fraternity', context: 'Masters’ Union', metric: '4 of 430', tag: 'Leadership', photo: 'masters-union' },
  { year: '2026', title: `Built unBothrrd to ${FIG.sales} in sales`, context: 'D2C lifestyle brand: dropshipping campaigns, sourcing, suppliers and pricing, in 2 months', metric: `${FIG.sales} in sales`, tag: 'Product', photo: 'masters-union' },
  { year: '2026', title: 'Scaled Synappses', context: 'AI-powered SaaS LMS, owning positioning, pricing and segments', metric: `5K → ${FIG.usersTo} users · ${FIG.mrrFrom} → ${FIG.mrrTo} MRR`, tag: 'Product' },
  { year: '2026', title: 'Shipped TruCost to both app stores', context: 'Ride-hailing with an in-cab tablet, plus a contract closed', metric: `${FIG.drivers} drivers onboarded`, tag: 'Product', photo: 'trucost' },
  { year: '2026', title: 'Launched LeetCase from PRD to MVP', context: 'Case and guesstimate practice for MBA aspirants', metric: `${FIG.leetUsers} users`, tag: 'Product', photo: 'leetcase' },
  { year: '2026', title: 'Mentored students for Google Summer of Code', context: 'Students Affairs Head, 100xSchool Super 30', metric: '30+ students', tag: 'Leadership' },
  { year: '2025', title: 'Best Employee of the year', context: 'Newral, recognised within my first three months', metric: '#1 in the company', tag: 'Leadership', photo: 'best-employee' },
  { year: '2025', title: 'Cut Newral’s cloud bill and raised retention', context: 'AWS and GCP migration to ACE Cloud with zero downtime; gamification and daily engagement', metric: '−30% cloud cost · +18% retention', tag: 'Product', photo: 'newral-pm' },
  { year: '2025', title: 'Selected for the Super 30 Hacker House', context: '100xSchool, funded by YC, alongside a full-time job', metric: '1 of 30 nationwide', tag: 'Tech', photo: 'hacker-house' },
  { year: '2024', title: 'EDST Customer’s First Award', context: 'Ciena: the first new grad ever to win its annual award', metric: '4 of 14,000', tag: 'Leadership', photo: 'ciena-award' },
  { year: '2024', title: 'Top 10, CienaGPT AI Hackathon', context: 'Company-wide agentic AI hackathon at Ciena', metric: 'Top 10 of 800', tag: 'Tech', photo: 'cienagpt' },
  { year: '2024', title: 'Cut $30K+ in annual software spend', context: 'Ciena: licence audit and de-provisioning across the company', metric: '$30K+ saved / year', tag: 'Product', photo: 'ciena-fte' },
  { year: '2023', title: 'Rank 1 coder of the MCA batch', context: 'Amity University, plus a Day-0 placement at Ciena', metric: '1 of 400+', tag: 'Academics', photo: 'rank-1' },
  { year: '2021', title: 'Represented India at a world dance battle', context: 'Chicago Footworkology World Final', metric: 'Top 16 worldwide', tag: 'Stage', photo: 'world-battle' },
  { year: '2021', title: 'President, Ramjas Dance Society', context: 'Coordinated 10+ outstation fests: travel, slots and accommodation', metric: '10+ fests', tag: 'Leadership', photo: 'choreographer' },
  { year: '2020', title: 'Won 10+ inter-college dance competitions', context: 'Across Delhi University and beyond', metric: '10+ titles', tag: 'Stage', photo: 'dance-wins' },
  { year: '2019', title: 'Scored 91% in Class 12', context: 'All-batch top 10%, House Captain and a badminton gold medallist', metric: 'Top 10%', tag: 'Academics', photo: 'class-12' },
];

/** Words running along the strips in the About section. */
export const STRIP_WORDS = ['Product Manager', 'Represented India', 'Super 30 Hacker House', 'YC VibeCon Wingathon winner', '0 → 1 builder', '4 of 14,000 at Ciena', 'International dancer', 'iOS · Android · AI', 'Masters’ Union'];

export type Persona = { id: 'instagram' | 'x' | 'linkedin'; platform: string; handle: string; url: string; name: string; tagline: string; chips: string[]; photo: string };

/** "Pick a Ram": the three sides of me, one per platform. */
export const PERSONAS: Persona[] = [
  {
    id: 'instagram',
    platform: 'Instagram',
    handle: '@likwid_z',
    url: 'https://www.instagram.com/likwid_z/',
    name: 'World Finalist Footwork Dance Artist',
    tagline: 'Represented India on a world stage. Off the clock, chasing new cities and new stages.',
    chips: ['Top 16 worldwide', '10+ dance titles', 'Night-city wanderer'],
    photo: 'https://res.cloudinary.com/ewpg7mfj/image/upload/c_fill,g_face,ar_3:4,w_900,z_0.6/f_auto,q_auto/v1792300037/profilePic_cytsgf.png',
  },
  {
    id: 'x',
    platform: 'X',
    handle: '@ram_101001',
    url: 'https://x.com/ram_101001',
    name: 'The Core Software Engineer',
    tagline: 'If it can be done with code, I can build it: AI agents, voice platforms, iOS, Android and everything in between.',
    chips: ['AI agents', 'iOS & Android', 'Hackathon winner'],
    photo: 'https://res.cloudinary.com/ewpg7mfj/image/upload/c_thumb,g_face,ar_3:4,w_900,z_0.4/f_auto,q_auto/v1792314234/Tech_Lead_Presenting_Product_Vision_xwaod8.png',
  },
  {
    id: 'linkedin',
    platform: 'LinkedIn',
    handle: 'in/bhardwajram',
    url: 'https://www.linkedin.com/in/bhardwajram',
    name: 'The Leader & MBA',
    tagline: 'Product Manager taking products from zero to revenue. Now sharpening the business side at Masters’ Union.',
    chips: ['Product Manager', 'Masters’ Union PGP', '4 of 14,000 at Ciena'],
    photo: 'https://res.cloudinary.com/ewpg7mfj/image/upload/c_fill,g_face,ar_3:4,w_900,z_0.6/f_auto,q_auto/v1792300638/P1182901_nwx7t6.jpg',
  },
];

/** Stops the hero globe flies through, in order. */
export const GLOBE_STOPS: { place: string; lat: number; lon: number; year: string; text: string }[] = [
  { place: 'Mathura', lat: 27.49, lon: 77.67, year: '2019', text: 'Scored 91% in Class 12' },
  { place: 'Delhi', lat: 28.68, lon: 77.21, year: '2019', text: 'Joined Ramjas College, University of Delhi' },
  { place: 'Chicago', lat: 41.88, lon: -87.63, year: '2021', text: 'Represented India at a world dance battle · Top 16 worldwide' },
  { place: 'Noida', lat: 28.54, lon: 77.33, year: '2022', text: 'MCA at Amity · Rank 1 coder of the batch' },
  { place: 'Gurugram', lat: 28.46, lon: 77.03, year: '2024', text: 'Ciena · 4 of 14,000 to win its annual award' },
  { place: 'Noida', lat: 28.62, lon: 77.37, year: '2025', text: 'Newral · engineer to Product Manager' },
  { place: 'Bangalore', lat: 12.97, lon: 77.59, year: '2026', text: 'Won the YC VibeCon Wingathon' },
  { place: 'Gurugram', lat: 28.46, lon: 77.03, year: '2026', text: 'PGP at Masters’ Union · building LeetCase' },
];

export type Job = {
  slug: 'trucost' | 'newral' | 'ciena' | 'ingenious';
  accent: string;
  /** Headline numbers for the bento tile. `value` counts up when numeric. */
  metrics: { prefix?: string; value: number | string; suffix?: string; label: string }[];
  company: string;
  logo: { text: string; bg: string; fg?: string; src?: string };
  type: 'Full-time' | 'Contract' | 'Internship';
  location: string;
  url?: string;
  summary: string;
  /** Recognition earned there, shown in the details modal. */
  highlights?: string[];
  /** Newest first; a company with promotions lists every role. Dates are 'YYYY-MM'; end omitted = present. */
  roles: { title: string; start: string; end?: string; groups: { heading?: string; points: string[] }[] }[];
};

/** Jobs and internships only, newest first (from the résumé). */
export const EXPERIENCE: Job[] = [
  {
    slug: 'trucost',
    accent: '#a855f7',
    metrics: [
      { value: 100, label: 'drivers onboarded' },
      { value: 'Contract', label: 'negotiated & closed' },
      { value: 2, label: 'app stores, live' },
    ],
    company: 'TruCost · Skyex AI Mobility',
    logo: { text: 'T', bg: 'linear-gradient(135deg, #7c3aed, #ec4899)', src: '/images/logos/trucost.png' },
    type: 'Contract',
    location: 'Remote',
    url: 'https://trucostrides.com/',
    summary: `Shipped Android and iOS ride-hailing apps with an in-cab tablet, onboarded ${FIG.drivers} drivers and closed a contract.`,
    roles: [
      {
        title: 'Product Manager',
        start: '2026-06',
        end: '2026-09',
        groups: [
          {
            heading: 'Mobile apps & device connectivity',
            points: [
              `Delivered an Uber-style ride-hailing app on Android and iOS, live on the Play Store and App Store, with ${FIG.drivers} drivers onboarded`,
              'Designed the Bluetooth connectivity architecture pairing the driver’s phone with an in-cab tablet mounted on the seat headrest',
            ],
          },
          {
            heading: 'Delivery, client & monetisation',
            points: [
              'Negotiated and closed the project contract, acting as the single point of contact with the client for scope, priorities and sign-offs',
              'Hired and led the development team, coordinating with the client and running sprints to ship both apps on schedule',
              'Drove monetisation through in-cab tablet advertising and pricing strategy, balancing ad revenue with a good rider experience',
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'newral',
    accent: '#3b82f6',
    metrics: [
      { prefix: '$', value: 10, suffix: 'K', label: `MRR, from ${FIG.mrrFrom} in 4 months` },
      { value: 70, suffix: 'K', label: 'users, from 5K' },
      { prefix: '−', value: 30, suffix: '%', label: 'cloud costs' },
    ],
    company: 'Newral',
    logo: { text: 'N', bg: 'linear-gradient(135deg, #2563eb, #1e3a8a)', src: '/images/logos/newral.png' },
    type: 'Full-time',
    location: 'Noida',
    summary: `Product studio behind Synappses, an AI-powered SaaS LMS: ${FIG.users} users, ${FIG.mrr} MRR in 4 months, 30% lower cloud costs.`,
    highlights: ['Best Employee, 2025', 'Won the YC VibeCon Wingathon, representing Newral'],
    // The résumé gives one span for Newral (Oct 2025 to May 2026) and two titles. The month each role began is from Ram's own timeline.
    roles: [
      {
        title: 'Product Manager, Synappses',
        start: '2026-05',
        end: '2026-05',
        groups: [
          {
            heading: 'Product strategy & go-to-market',
            points: [
              `Scaled Synappses from ${FIG.users} users and from ${FIG.mrr} MRR in 4 months by owning positioning, pricing and segments`,
              'Doubled DAU through A/B-tested feature launches, and raised retention 18% with gamification and daily engagement',
              'Improved CSAT by 21% by building an automated customer feedback system that sped up issue resolution and escalations',
            ],
          },
        ],
      },
      {
        title: 'Product Tech Lead',
        start: '2025-12',
        end: '2026-04',
        groups: [
          {
            heading: 'Process improvement & leadership',
            points: [
              'Cut cloud infrastructure costs 30% by leading the AWS and GCP migration to ACE Cloud with zero business downtime',
              'Led a 20-member cross-functional team and shipped 20% more story points per sprint through structured Jira planning',
              'Designed the company’s first KPI-driven performance framework to establish measurable recognition and accountability',
              'Ran sprint planning for an 11-member team by breaking projects into epics, user stories and tasks with clear owners',
            ],
          },
        ],
      },
      {
        title: 'Software Engineer',
        start: '2025-10',
        end: '2025-11',
        groups: [
          {
            points: [
              'Built AI SaaS products, including an LMS and an AI voice agent platform, for enterprise learning, automation and content delivery',
              'Shipped in-video quizzes that gate lesson playback, through student-persona prototypes, mockups and live user tests',
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'ciena',
    accent: '#ef4444',
    metrics: [
      { value: 4, suffix: ' / 14,000', label: 'won the annual award' },
      { prefix: '$', value: 30, suffix: 'K+', label: 'saved a year' },
    ],
    company: 'Ciena',
    logo: { text: 'C', bg: 'linear-gradient(135deg, #e11d48, #9f1239)', src: '/images/logos/ciena.png' },
    type: 'Full-time',
    location: 'Gurugram',
    url: 'https://www.ciena.com',
    summary: 'Enterprise automation and tool adoption: 4+ hours a day saved, 35% fewer SLA breaches, $30K+ a year cut.',
    highlights: ['EDST Customer’s First Award: first new grad ever, 4 of 14,000', 'Top 10, CienaGPT AI Hackathon (of 800)'],
    roles: [
      {
        title: 'IT Applications Solutions Engineer',
        start: '2024-07',
        end: '2025-10',
        groups: [
          {
            heading: 'Product operations, enterprise automation & adoption',
            points: [
              'Led product automation initiatives, cutting 4+ hours of daily effort across 5+ global teams through workflow redesign',
              'Improved NPS by 2 points by automating the shared calendar flow, enabling event publishing and access across 7 to 8 teams',
              'Produced 30+ promotional videos as a knowledge base, enabling self-learning and driving internal tool adoption at scale',
              'Guided 3 enterprise tool investment decisions by building Power BI dashboards on app usage, page visits and site traffic',
              'Reduced SLA breaches by 35% through new workflows and cross-functional collaboration',
              'Eliminated $30K+ in annual software costs by auditing enterprise licences and de-provisioning unused accounts',
              'Evaluated application performance and ROI to recommend enterprise product investments and procurement decisions',
            ],
          },
        ],
      },
      {
        title: 'IT/Ops Intern',
        start: '2024-01',
        end: '2024-06',
        groups: [
          {
            points: [
              'Supported 300+ enterprise users, resolving 100+ product support requests and improving adoption across 8 platforms',
              'Built a Python workflow automation, removing 3+ hours of daily manual effort across 80 employees and 4 teams',
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'ingenious',
    accent: '#14b8a6',
    metrics: [{ value: 'ISRO', label: 'blockchain research project' }],
    company: 'Ingenious Research Solutions',
    logo: { text: 'IR', bg: 'linear-gradient(135deg, #0d9488, #115e59)', src: '/images/logos/ingenious.png' },
    type: 'Internship',
    location: 'Noida',
    summary: 'Supported an ISRO project on blockchain-based data security for distributed systems.',
    roles: [
      {
        title: 'Research Intern',
        start: '2023-06',
        end: '2023-07',
        groups: [{ points: ['Supported ISRO’s project introducing a blockchain-based prototype to improve data security in distributed systems'] }],
      },
    ],
  },
];

export const COMPANIES = ['Newral', 'Ciena', 'Skyex AI Mobility', 'Masters’ Union', '100xSchool'];

/** Small proof badges floating around the hero photo. */
export const HERO_BADGES = [
  { title: 'YC VibeCon Wingathon', note: 'National winner · 2026' },
  { title: '4 of 14,000', note: 'Ciena annual award' },
  { title: 'Masters’ Union', note: 'PGP in Tech & Business' },
];

export type Kind = 'Education' | 'Role' | 'Achievement' | 'Milestone';

export type Moment = {
  id: string;
  year: string;
  date: string; // shown large beside the node
  kind: Kind;
  title: string;
  org: string;
  body: string;
  stat?: string; // short highlight pill, e.g. "Top 16 worldwide"
  points?: string[];
  image?: string; // Cloudinary URL or /images/... path
  fullImage?: boolean; // show the whole image (posters) instead of a 16:9 crop
  imageHint: string; // what photo belongs here (shown until `image` is set)
};

/** One-line name for each year, shown on the year marker. */
export const CHAPTERS: Record<string, string> = {
  '2019': 'The beginning',
  '2020': 'Finding my stage',
  '2021': 'On the world stage',
  '2022': 'Switching lanes',
  '2023': 'Top of the batch',
  '2024': 'Enterprise',
  '2025': 'Startup mode',
  '2026': 'Builder & MBA',
};

/** The journey, oldest first. */
export const JOURNEY: Moment[] = [
  {
    id: 'class-12',
    year: '2019',
    date: '2019',
    kind: 'Achievement',
    title: 'Scored 91% in Class 12',
    org: 'St. Dominic’s Sr. Sec. School, Mathura',
    body: 'My first real milestone: 91% in the CBSE boards, in the all-batch top 10%. Also House Captain and a badminton gold medallist.',
    stat: 'All-batch top 10%',
    image: 'https://res.cloudinary.com/ewpg7mfj/image/upload/f_auto,q_auto,w_1000/v1792308963/12_o2whts.jpg',
    imageHint: 'School / results day photo',
  },
  {
    id: 'ramjas',
    year: '2019',
    date: 'Aug 2019',
    kind: 'Education',
    title: 'Joined Ramjas College',
    org: 'University of Delhi · B.Sc. Physical Sciences',
    body: 'Admitted to one of Delhi University’s most prestigious colleges, where the stage became my second classroom.',
    image: 'https://dubeat.com/wp-content/uploads/2019/08/SAVE_20190812_195455-scaled-1.jpg',
    imageHint: 'Ramjas College campus or you at Ramjas',
  },
  {
    id: 'dance-wins',
    year: '2020',
    date: '2020',
    kind: 'Achievement',
    title: 'Won 10+ dance competitions',
    org: 'Inter-college circuit, across India',
    body: 'A season of competing almost every weekend, and winning more than ten titles.',
    stat: '10+ titles',
    image: 'https://res.cloudinary.com/ewpg7mfj/image/upload/f_auto,q_auto,w_1000/v1792309121/dance_winner_f6xivs.jpg',
    imageHint: 'Team on stage or holding a trophy',
  },
  {
    id: 'world-battle',
    year: '2021',
    date: '2021',
    kind: 'Achievement',
    title: 'Represented India at a world dance battle',
    org: 'Chicago Footworkology World Final',
    body: 'Competed on an international stage against the best dancers from around the globe.',
    stat: 'Top 16 worldwide · Top 4 in India',
    image: 'https://res.cloudinary.com/ewpg7mfj/image/upload/f_auto,q_auto,w_1000/v1792309906/Ram_India_Footworkology_Camp_Asia_Poster_vd6ysw.png',
    fullImage: true,
    imageHint: 'Battle / performance photo',
  },
  {
    id: 'choreographer',
    year: '2021',
    date: '2021',
    kind: 'Milestone',
    title: 'President, Ramjas Dance Society',
    org: 'Ramjas College',
    body: 'Led the society and its logistics: coordinated 10+ outstation fests, managing travel, slots and accommodation.',
    stat: '10+ fests coordinated',
    image: 'https://res.cloudinary.com/ewpg7mfj/image/upload/f_auto,q_auto,w_1000/v1792309855/University_Park_Friends_Picnic_Gathering_lhwv3k.png',
    imageHint: 'You leading the dance society / rehearsal',
  },
  {
    id: 'mca',
    year: '2022',
    date: '2022',
    kind: 'Education',
    title: 'Started my MCA',
    org: 'Amity University, Noida',
    body: 'Switched lanes from the stage to software, and started building in earnest. Graduated with an 8.04 CGPA.',
    image: 'https://img.collegedunia.com/public/reviewPhotos/274473/IMG_20220727_104016.jpg',
    imageHint: 'Amity campus or classmates',
  },
  {
    id: 'rank-1',
    year: '2023',
    date: '2023',
    kind: 'Achievement',
    title: 'Rank 1 coder of the MCA batch',
    org: 'Amity University',
    body: 'Ranked first in coding across the entire batch, and secured a Day-0 placement at Ciena.',
    stat: '#1 of 400+ · Day-0 placement',
    image: 'https://res.cloudinary.com/ewpg7mfj/image/upload/f_auto,q_auto,w_1000/v1792310259/Screenshot_2026-10-18_at_1.27.19_PM_xuxd8h.png',
    imageHint: 'Award / placement announcement',
  },
  {
    id: 'ciena-intern',
    year: '2024',
    date: 'Jan 2024',
    kind: 'Role',
    title: 'IT/Ops Intern',
    org: 'Ciena · NYSE-listed networking company',
    body: 'Started on the IT team supporting 300+ enterprise users across 8 platforms.',
    points: ['Resolved 100+ product support requests', 'Built a Python automation saving 3+ hours a day across 80 employees and 4 teams'],
    image: 'https://media.licdn.com/dms/image/v2/D5610AQHWgPA-KjVFGA/image-shrink_800/B56ZzbX548GkAg-/0/1773207003093?e=2147483647&v=beta&t=KXmpGivc3NMoA2V0ZjEWFguW00F9Yd_395NpgBtUubc',
    imageHint: 'Ciena office / ID card / first day',
  },
  {
    id: 'ciena-fte',
    year: '2024',
    date: 'Jul 2024',
    kind: 'Role',
    title: 'IT Applications Solutions Engineer',
    org: 'Ciena · Communications & Collaborations',
    body: 'Converted to full-time, leading product initiatives in enterprise automation, internal tool adoption and operational transformation.',
    points: ['Saved 4+ hours a day across 5+ global teams', 'Cut SLA breaches 35% with new workflows', 'Eliminated $30K+ in annual software costs'],
    image: 'https://res.cloudinary.com/ewpg7mfj/image/upload/f_auto,q_auto,w_1000/v1792310606/Ciena_Branded_Gift_Box_Unboxing_ztkjzp.png',
    imageHint: 'You with the Ciena team',
  },
  {
    id: 'ciena-award',
    year: '2024',
    date: '2024',
    kind: 'Achievement',
    title: 'EDST Customer’s First Award',
    org: 'Ciena · annual company-wide award',
    body: 'The first new grad ever to win Ciena’s annual award, given to just four people across the company.',
    stat: '4 of 14,000',
    image: 'https://res.cloudinary.com/ewpg7mfj/image/upload/f_auto,q_auto,w_1000/v1792310796/Customer_First_Recognition_Presentation_bzhoch.png',
    imageHint: 'Award ceremony or certificate',
  },
  {
    id: 'cienagpt',
    year: '2024',
    date: '2024',
    kind: 'Achievement',
    title: 'Top 10 winner, CienaGPT AI Hackathon',
    org: 'Ciena · agentic AI hackathon',
    body: 'Built an AI agent that placed in the top 10 of Ciena’s company-wide agentic AI hackathon, out of 800 employees.',
    stat: 'Top 10 of 800',
    image: 'https://res.cloudinary.com/ewpg7mfj/image/upload/f_auto,q_auto,w_1000/v1792310877/10ai_jvbvz9.jpg',
    fullImage: true,
    imageHint: 'Hackathon team / demo photo',
  },
  {
    id: 'hacker-house',
    year: '2025',
    date: 'Jul 2025',
    kind: 'Milestone',
    title: 'Joined the Super 30 Hacker House',
    org: '100xSchool · funded by YC',
    body: 'Selected as one of 30 builders nationwide, while still working full-time at Ciena. Built and shipped multiple products on nights and weekends, then ran student affairs and mentored 30+ students for GSoC 2026.',
    stat: '1 of 30 nationwide · alongside a full-time job',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXaxI4sl-wuOGG0IWctp_Xd9jPCt4NcdPGFQmWUbAmww&s=10',
    imageHint: 'Hacker house group photo',
  },
  {
    id: 'newral-swe',
    year: '2025',
    date: 'Oct 2025',
    kind: 'Role',
    title: 'Joined Newral as Software Engineer',
    org: 'Newral (CSXExplained Pvt. Ltd.), Noida',
    body: 'Left Ciena for an early-stage AI startup, building AI SaaS products including an LMS and a voice agent platform.',
    image: 'https://images.jdmagicbox.com/v2/comp/delhi/y1/011pxx11.xx11.241022165545.a8y1/catalogue/newral-softwares-noida-sector-62-noida-internet-website-developers-koy0i96baz.jpg',
    imageHint: 'Newral office / team',
  },
  {
    id: 'newral-tpl',
    year: '2025',
    date: 'Dec 2025',
    kind: 'Role',
    title: 'Promoted to Product Tech Lead',
    org: 'Newral',
    body: 'Two months in, moved from engineering into owning the platform: architecture, sprints and delivery.',
    points: ['Cut cloud costs 30% by migrating AWS and GCP to ACE Cloud with zero downtime', 'Built the company’s first KPI-driven performance framework', 'Led a 20-member team and shipped 20% more story points per sprint'],
    image: 'https://res.cloudinary.com/ewpg7mfj/image/upload/c_fill,g_auto,ar_16:9,w_1200/f_auto,q_auto/v1792314234/Tech_Lead_Presenting_Product_Vision_xwaod8.png',
    imageHint: 'You presenting / whiteboard',
  },
  {
    id: 'best-employee',
    year: '2025',
    date: 'Dec 2025',
    kind: 'Achievement',
    title: 'Best Employee, 2025',
    org: 'Newral',
    body: 'Recognised as the company’s best employee within my first three months.',
    stat: 'Within 3 months',
    image: 'https://res.cloudinary.com/ewpg7mfj/image/upload/c_fill,g_auto,ar_16:9,w_1200/f_auto,q_auto/v1792313529/Warm_Professional_Camaraderie_jljp1l.png',
    imageHint: 'Award moment or certificate',
  },
  {
    id: 'wingathon',
    year: '2026',
    date: 'Apr 2026',
    kind: 'Achievement',
    title: 'Won the YC VibeCon Wingathon Hackathon',
    org: 'VibeCon, Bangalore · representing Newral',
    body: 'Built and pitched the best product in 24 hours at a national hackathon, out of 30,000 applicants.',
    stat: 'National winner · Top 10 of 30,000',
    image: 'https://res.cloudinary.com/ewpg7mfj/image/upload/c_crop,x_200,y_830,w_940,h_600/c_fill,ar_16:9,g_auto,w_1200/f_auto,q_auto/v1792311294/IMG_7701_f7hohd.jpg',
    imageHint: 'Stage / winners photo at VibeCon',
  },
  {
    id: 'newral-pm',
    year: '2026',
    date: 'May 2026',
    kind: 'Role',
    title: 'Product Manager, Synappses',
    org: 'Newral · until May 2026',
    body: 'Owned positioning, pricing and segments for Synappses, Newral’s AI-powered SaaS LMS.',
    points: [`Scaled it from ${FIG.users} users and from ${FIG.mrr} MRR in 4 months`, 'Doubled DAU through A/B-tested feature launches', 'Raised retention 18% with gamification and daily engagement'],
    image: 'https://res.cloudinary.com/ewpg7mfj/image/upload/c_fill,g_auto,ar_16:9,w_1200/f_auto,q_auto/v1792314872/Screenshot_2026-10-18_at_2.44.07_PM_bdyrtu.png',
    imageHint: 'You with the Newral team',
  },
  {
    id: 'trucost',
    year: '2026',
    date: 'Jun 2026',
    kind: 'Role',
    title: 'Product Manager, TruCost',
    org: 'Contract · Skyex AI Mobility Technologies Pvt. Ltd.',
    body: 'An Uber-style ride-hailing service with a headrest tablet paired to the driver’s phone, running ads and surveys during the ride.',
    points: [`Shipped Android and iOS apps, live on both stores, with ${FIG.drivers} drivers onboarded`, 'Negotiated and closed a contract', 'Hired and led the development team'],
    stat: 'Contract closed',
    image: 'https://res.cloudinary.com/ewpg7mfj/image/upload/f_auto,q_auto,w_1200/v1792316440/000_mv8c44.png',
    imageHint: 'In-cab tablet / app screens',
  },
  {
    id: 'masters-union',
    year: '2026',
    date: 'Jul 2026',
    kind: 'Education',
    title: 'Joined Masters’ Union',
    org: 'PGP in Technology & Business Management, Gurugram',
    body: `Learning business by running one: unBothrrd, a D2C brand with ${FIG.sales} in sales in 2 months, first core member of the Netflix Fraternity, and rank 3 in dropshipping.`,
    stat: 'Netflix Fraternity · 4 of 430',
    image: '/images/ram-photo.jpg',
    imageHint: 'Masters’ Union venture stall',
  },
  {
    id: 'leetcase',
    year: '2026',
    date: 'Aug 2026',
    kind: 'Milestone',
    title: 'Launched LeetCase',
    org: 'For MBA aspirants · guesstimates & case prep',
    body: `Took it from PRD to MVP and scaled it to ${FIG.leetUsers} users across Masters’ Union communities.`,
    stat: `${FIG.leetUsers} users`,
    image: '/images/leetcase.webp',
    imageHint: 'LeetCase product screenshot',
  },
];

export type Project = {
  id: string;
  name: string;
  device: 'browser' | 'phone';
  screen: 'leetcase' | 'trucost' | 'synappses' | 'unbothered' | 'sortify';
  url?: string; // live link, if public
  domain: string; // shown in the browser bar / under the name
  accent: string;
  role: string;
  period?: string;
  client?: string;
  pitch: string;
  /** Left empty when the résumé does not state one: nothing is written to fill it. */
  problem: string;
  did: string[];
  metrics: { value: string; label: string }[];
  stack: string[];
};

/**
 * Selected work, shown as products on the device they live on. Every line and number is from the résumé (24 Nov 2026).
 * Upto and SujhaavMarg were removed and SortifyStays added on that day, at Ram's request.
 */
export const PROJECTS: Project[] = [
  {
    id: 'leetcase',
    name: 'LeetCase',
    device: 'browser',
    screen: 'leetcase',
    url: 'https://leetcase.rambhardwaj.in/',
    domain: 'leetcase.rambhardwaj.in',
    accent: '#14b8a6',
    role: 'Founder',
    period: 'Aug – Sep 2026',
    pitch: 'An AI-graded practice platform for consulting cases and guesstimates.',
    problem: 'Case and guesstimate prep is scattered across PDFs and group chats, with no structured way to practise, get hints or track progress.',
    did: ['Owned the product from PRD to MVP launch, defining the vision and roadmap from research with MBA aspirants', 'Drove product-market fit by shipping AI Interviews and Flow Chart, and tracking activation, retention and DAU', 'Led go-to-market and growth with user feedback loops and A/B tests'],
    metrics: [
      { value: `${FIG.leetUsers}`, label: 'users across MU communities' },
      { value: 'PRD → MVP', label: 'owned end to end' },
      { value: 'AI-graded', label: 'cases and guesstimates' },
    ],
    stack: ['0 → 1', 'User research', 'A/B testing', 'AI'],
  },
  {
    id: 'trucost',
    name: 'TruCost',
    device: 'phone',
    screen: 'trucost',
    url: 'https://trucostrides.com/',
    domain: 'trucostrides.com',
    accent: '#8b5cf6',
    role: 'Product Manager (Contract)',
    period: 'Jun – Sep 2026',
    client: 'Skyex AI Mobility Technologies',
    pitch: 'An ad-funded ride-hailing app, with a screen that pays for the ride.',
    problem: 'Ride margins are thin, and the passenger’s attention during a ride goes unused.',
    did: ['Designed Bluetooth pairing between the driver’s phone and an in-cab tablet on the seat headrest', 'Shipped Android and iOS apps, live on the Play Store and App Store', 'Drove monetisation through in-cab tablet ads and pricing; hired and led the dev team'],
    metrics: [
      { value: '100', label: 'drivers onboarded' },
      { value: 'Contract', label: 'negotiated & closed' },
      { value: '2', label: 'app stores, live' },
    ],
    stack: ['Mobile', 'Hardware pairing', 'AdTech', 'Monetisation'],
  },
  {
    id: 'synappses',
    name: 'Synappses',
    device: 'browser',
    screen: 'synappses',
    url: 'https://synappses.in/',
    domain: 'synappses.in',
    accent: '#38bdf8',
    role: 'Product Manager, at Newral',
    period: 'Oct 2025 – May 2026',
    pitch: 'An AI-powered SaaS LMS.',
    problem: '',
    did: [`Scaled it from ${FIG.users} users and from ${FIG.mrr} MRR in 4 months by owning positioning, pricing and segments`, 'Doubled DAU through A/B-tested feature launches, and raised retention 18% with gamification and daily engagement', 'Led a 20-member cross-functional team, shipping 20% more story points per sprint'],
    metrics: [
      { value: `5K → ${FIG.usersTo}`, label: 'users' },
      { value: `${FIG.mrrFrom} → ${FIG.mrrTo}`, label: 'MRR in 4 months' },
      { value: '20', label: 'person team led' },
    ],
    stack: ['B2B SaaS', 'AI', 'EdTech', 'Pricing'],
  },
  {
    id: 'unbothered',
    name: 'unBothrrd',
    device: 'browser',
    screen: 'unbothered',
    url: 'https://unbothrrd.shop/',
    domain: 'unbothrrd.shop',
    accent: '#c8b8a6',
    role: 'Co-Founder',
    period: 'Oct – Nov 2026',
    pitch: 'A D2C lifestyle brand with daily drops in apparel and decor.',
    problem: '',
    did: [`Generated ${FIG.sales} in sales in 2 months through dropshipping campaigns, managing sourcing, suppliers and pricing`, 'Set up stalls at 6 community events with a 9-member team, testing products and pricing live', 'Tracked campaign ROI and ad spend on Meta ads, building Excel-based financial models to monitor sales'],
    metrics: [
      { value: `${FIG.sales}`, label: 'sales in 2 months' },
      { value: '6', label: 'community events' },
      { value: '9', label: 'member team' },
    ],
    stack: ['D2C', 'Dropshipping', 'Meta ads', 'Pricing'],
  },
  {
    // TODO(Ram): the résumé dates this "Dec'26 to Present", which is after today (24 Nov 2026), and its one-line description
    // repeats LeetCase's. Until both are corrected no period is shown, and the pitch says only what the bullets say.
    // TODO(Ram): a link and a screenshot, if the site is public.
    id: 'sortifystays',
    name: 'SortifyStays',
    device: 'browser',
    screen: 'sortify',
    domain: 'PG and hostel discovery',
    accent: '#f59e0b',
    role: 'Co-Founder',
    pitch: 'A discovery website for PGs and hostels.',
    problem: '',
    did: ['Shipped the complete PG and hostel discovery website, driving design, development and cross-functional coordination', 'Grew inventory to 110 unique listings by onboarding 187 PG and hostel properties', 'Created 2 revenue models, flatmate and co-sharing, by evaluating subscriptions and revenue streams for PG and hostel users'],
    metrics: [
      { value: '110', label: 'unique listings' },
      { value: '187', label: 'properties onboarded' },
      { value: '2', label: 'revenue models' },
    ],
    stack: ['Marketplace', 'Web', '0 → 1', 'Revenue models'],
  },
];

export const CAPABILITIES = [
  { group: 'Strategy', items: ['Product management', 'Business diagnosis', 'GTM strategy', 'Competitive benchmarking', 'Program management'] },
  { group: 'Technical', items: ['AWS & GCP', 'Python & SQL', 'Jira', 'AI & automation agents', 'App Store releases', 'UI/UX design'] },
  { group: 'Automation', items: ['MS365 Copilot', 'n8n & Make', 'Power Automate', 'Power BI', 'Claude & Claude Cowork'] },
];
