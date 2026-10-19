/**
 * All site content lives here. Edit this file to update the portfolio.
 * Source: Ram's résumé (Oct 2026) and his own account of the timeline. Lines marked TODO need a check.
 */

export const PROFILE = {
  name: 'Ram Bhardwaj',
  firstName: 'Ram',
  role: 'Product Manager',
  headline: 'Product Manager',
  // Hero photo, cropped around the face to a 4:5 portrait.
  portrait: 'https://res.cloudinary.com/ewpg7mfj/image/upload/c_fill,g_face,ar_4:5,w_900,z_0.7/f_auto,q_auto/v1792300638/P1182901_nwx7t6.jpg',
  availability: 'Open to Product Manager roles',
  pitch:
    'I’m Ram, a Product Manager and former software engineer. I’ve scaled an AI SaaS from $0 to $6K MRR, shipped iOS and Android apps used by 100+ drivers, and grown revenue 75% through pricing and GTM.',
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
  resume: '', // TODO: add public/resume.pdf and set this to '/resume.pdf'
};

export type Metric = { prefix?: string; value: number; suffix?: string; decimals?: number; label: string; note: string };

export const METRICS: Metric[] = [
  { prefix: '$', value: 6, suffix: 'K', label: 'MRR from zero', note: 'Synappses AI SaaS LMS' },
  { value: 75, suffix: '%', label: 'Revenue growth', note: 'Pricing & GTM at Newral' },
  { prefix: '₹', value: 11.2, suffix: 'L', decimals: 1, label: 'D2C revenue', note: 'Venture built at Masters’ Union' },
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
  { year: '2026', title: 'Locked core member, Netflix Fraternity', context: 'Masters’ Union', metric: '4 of 430', tag: 'Leadership', photo: 'masters-union' },
  { year: '2026', title: 'Built a ₹11.2L dropshipping business', context: 'Real customers, ad spend and P&L at Masters’ Union', metric: '₹11.2L revenue', tag: 'Product', photo: 'masters-union' },
  { year: '2026', title: 'Scaled Synappses from zero', context: 'AI SaaS LMS for coaching centres, leading a 20-member team', metric: '$0 → $6K MRR', tag: 'Product' },
  { year: '2026', title: 'Shipped TruCost to both app stores', context: 'Ride-hailing with an in-cab tablet, plus a ₹2.5L contract closed', metric: '100 drivers onboarded', tag: 'Product', photo: 'trucost' },
  { year: '2026', title: 'Launched LeetCase from PRD to MVP', context: 'Case and guesstimate practice for MBA aspirants', metric: '150+ users', tag: 'Product', photo: 'leetcase' },
  { year: '2026', title: 'Mentored students for Google Summer of Code', context: 'Students Affairs Head, 100xSchool Super 30', metric: '30+ students', tag: 'Leadership' },
  { year: '2025', title: 'Best Employee of the year', context: 'Newral, recognised within my first three months', metric: '#1 in the company', tag: 'Leadership', photo: 'best-employee' },
  { year: '2025', title: 'Grew Newral’s revenue and cut its cloud bill', context: 'Pricing, GTM and a zero-downtime migration to ACE Cloud', metric: '+75% revenue · −50% cost', tag: 'Product', photo: 'newral-pm' },
  { year: '2025', title: 'Selected for the Super 30 Hacker House', context: '100xSchool, funded by YC, alongside a full-time job', metric: '1 of 30 nationwide', tag: 'Tech', photo: 'hacker-house' },
  { year: '2024', title: 'EDST Customer’s First Award', context: 'Ciena: the first new grad ever to win its annual award', metric: '4 of 14,000', tag: 'Leadership', photo: 'ciena-award' },
  { year: '2024', title: 'Top 10, CienaGPT AI Hackathon', context: 'Company-wide agentic AI hackathon at Ciena', metric: 'Top 10 of 800+', tag: 'Tech', photo: 'cienagpt' },
  { year: '2024', title: 'Cut $30K+ in annual software spend', context: 'Ciena: licence audit and de-provisioning across the company', metric: '$30K+ saved / year', tag: 'Product', photo: 'ciena-fte' },
  { year: '2023', title: 'Rank 1 coder of the MCA batch', context: 'Amity University, plus a Day-0 placement at Ciena', metric: '1 of 400+', tag: 'Academics', photo: 'rank-1' },
  { year: '2021', title: 'Represented India at a world dance battle', context: 'Chicago Footworkology World Final', metric: 'Top 16 worldwide', tag: 'Stage', photo: 'world-battle' },
  { year: '2021', title: 'Choreography Head, Ramjas Dance Society', context: 'Led the crew and coordinated 10+ outstation fests', metric: '10+ fests', tag: 'Leadership', photo: 'choreographer' },
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
    name: 'The Dancer & Traveller',
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
  { place: 'United States', lat: 37.77, lon: -122.42, year: '2026', text: 'Shipped Upto, an iOS app, for a US client' },
  { place: 'Gurugram', lat: 28.46, lon: 77.03, year: '2026', text: 'PGP at Masters’ Union · building LeetCase' },
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
    title: 'Choreography Head',
    org: 'Ramjas Dance Society',
    body: 'Led the society’s creative direction and its logistics: choreographing sets, running practice, and coordinating 10+ outstation fests.',
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
    points: ['Resolved 100+ product support requests', 'Built a Python automation saving 3+ hours a day across 180 employees and 9 teams'],
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
    body: 'Built an AI agent that placed in the top 10 of Ciena’s company-wide agentic AI hackathon, out of 800+ participants.',
    stat: 'Top 10 of 800+',
    image: 'https://res.cloudinary.com/ewpg7mfj/image/upload/f_auto,q_auto,w_1000/v1792310877/10ai_jvbvz9.jpg',
    fullImage: true,
    imageHint: 'Hackathon team / demo photo',
  },
  {
    id: 'hacker-house',
    year: '2025',
    date: 'Sep 2025', // TODO: résumé says Jul 2025
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
    points: ['Cut operational costs 30% by migrating AWS and GCP to ACE Cloud with zero downtime', 'Built the company’s first KPI-driven performance framework', 'Improved sprint efficiency 20%'],
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
    title: 'Promoted to Product Manager',
    org: 'Newral · until 31 May 2026',
    body: 'Owned product positioning, pricing and go-to-market alongside the founder.',
    points: ['Drove 75% revenue growth', 'Doubled user engagement through product experiments', 'Cut cloud costs 50% by moving to a cost-efficient platform'],
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
    points: ['Shipped Android and iOS apps, live on both stores, with 100 drivers onboarded', 'Negotiated and closed a ₹2.5L contract', 'Hired and led the development team'],
    stat: '₹2.5L contract',
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
    body: 'Learning business by running one: a ₹11.2L dropshipping venture, a locked seat in the Netflix Fraternity, and a 150+ member builder community.',
    stat: 'Netflix Fraternity · 4 of 430',
    image: '/images/ram-photo.jpg',
    imageHint: 'Masters’ Union venture stall',
  },
  {
    id: 'leetcase',
    year: '2026',
    date: 'Sep 2026',
    kind: 'Milestone',
    title: 'Launched LeetCase',
    org: 'For MBA aspirants · guesstimates & case prep',
    body: 'Took it from PRD to MVP and scaled it to 150+ users across Masters’ Union communities.',
    stat: '150+ users',
    image: '/images/leetcase.webp',
    imageHint: 'LeetCase product screenshot',
  },
];

export type Project = {
  id: string;
  name: string;
  device: 'browser' | 'phone';
  screen: 'leetcase' | 'upto' | 'trucost' | 'synappses' | 'unbothered' | 'sujhaav';
  url?: string; // live link, if public
  domain: string; // shown in the browser bar / under the name
  accent: string;
  role: string;
  period?: string;
  client?: string;
  pitch: string;
  problem: string;
  did: string[];
  metrics: { value: string; label: string }[];
  stack: string[];
};

/** Selected work, shown as products on the device they live on. */
// TODO: period and link for Upto.
export const PROJECTS: Project[] = [
  {
    id: 'leetcase',
    name: 'LeetCase',
    device: 'browser',
    screen: 'leetcase',
    url: 'https://leetcase.rambhardwaj.in/',
    domain: 'leetcase.rambhardwaj.in',
    accent: '#14b8a6',
    role: 'Founder & Product Manager',
    period: 'Sep – Oct 2026',
    pitch: 'LeetCode, but for MBA case interviews.',
    problem: 'Case and guesstimate prep is scattered across PDFs and group chats, with no structured way to practise, get hints or track progress.',
    did: ['Ran research with MBA aspirants to shape the vision and roadmap', 'Took it from PRD to MVP: problem sets, hints and a guided solve flow', 'Tracked activation, retention and DAU/MAU, and grew it with A/B tests and feedback loops'],
    metrics: [
      { value: '150+', label: 'users across MU communities' },
      { value: '124', label: 'case & guesstimate problems' },
      { value: 'PRD → MVP', label: 'in under two months' },
    ],
    stack: ['0 → 1', 'User research', 'A/B testing', 'Gemini AI'],
  },
  {
    id: 'upto',
    name: 'Upto',
    device: 'phone',
    screen: 'upto',
    domain: 'iOS app · US client',
    accent: '#a78bfa',
    role: 'Product Manager',
    period: '2026',
    client: 'US client',
    pitch: 'Plans are better when friends can tag along.',
    problem: 'College students make plans in scattered group chats, so friends miss out and nobody knows who is going where.',
    did: ['Designed the core loop: post an “Upto”, friends subscribe and mark interested or not', 'Built a shared calendar so everyone sees who is going where, day to day', 'Shipped the iOS app end to end for a US client'],
    metrics: [
      { value: 'iOS', label: 'native app, shipped' },
      { value: '3-step', label: 'post → join → calendar loop' },
      { value: 'US', label: 'client, remote delivery' },
    ],
    stack: ['Social', 'iOS', 'Shared calendar', 'Consumer'],
  },
  {
    id: 'trucost',
    name: 'TruCost',
    device: 'phone',
    screen: 'trucost',
    url: 'https://trucostrides.com/',
    domain: 'trucostrides.com',
    accent: '#8b5cf6',
    role: 'Contractor, Product Manager',
    period: 'Jun – Oct 2026',
    client: 'Skyex AI Mobility Technologies',
    pitch: 'Ride more, pay less, with a screen that pays for the ride.',
    problem: 'Ride margins are thin, and the passenger’s attention during a ride goes unused.',
    did: ['Designed Bluetooth pairing between the driver’s phone and an in-cab headrest tablet', 'Shipped Android and iOS apps, live on both stores', 'Drove monetisation through in-cab ads and pricing; hired and led the dev team'],
    metrics: [
      { value: '100', label: 'drivers onboarded' },
      { value: '₹2.5L', label: 'contract negotiated & closed' },
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
    role: 'Founding Manager',
    period: 'Oct 2025 – Jun 2026',
    pitch: 'An AI-native LMS for coaching centres.',
    problem: 'Coaching centres run on paper, WhatsApp and manual grading, and generic LMS tools were not built for how they teach or sell.',
    did: ['Led a 20-member cross-functional team across product, sales and operations', 'Shipped AI assessment and content workflows for institutes', 'Built the investor pitch: vision, market opportunity and growth strategy'],
    metrics: [
      { value: '$0 → $6K', label: 'monthly recurring revenue' },
      { value: '20', label: 'person team led' },
      { value: 'B2B', label: 'coaching institutes' },
    ],
    stack: ['B2B SaaS', 'AI', 'EdTech', 'Fundraising'],
  },
  {
    id: 'unbothered',
    name: 'unBothrrd',
    device: 'browser',
    screen: 'unbothered',
    url: 'https://unbothrrd.shop/',
    domain: 'unbothrrd.shop',
    accent: '#c8b8a6',
    role: 'Founder',
    period: '2026',
    client: 'Masters’ Union venture',
    pitch: 'A D2C brand built offline and online, from zero.',
    problem: 'No brand, no audience and a fixed window to find product–channel fit before the money ran out.',
    did: ['Ran pop-up stalls to test products and pricing face to face', 'Sold online through our own storefront, iterating creatives on conversion data', 'Automated fulfilment, inventory and support'],
    metrics: [
      { value: '₹11.2L', label: 'revenue' },
      { value: 'Offline + online', label: 'stalls and web store' },
      { value: 'P&L', label: 'owned end to end' },
    ],
    stack: ['D2C', 'Growth', 'P&L', 'Ops automation'],
  },
  {
    id: 'sujhaavmarg',
    name: 'SujhaavMarg',
    device: 'phone',
    screen: 'sujhaav',
    url: 'https://play.google.com/store/apps/details?id=com.user.sujhaav',
    domain: 'Google Play',
    accent: '#d39b6a',
    role: 'Product Owner',
    client: 'Client project',
    pitch: 'Pay-per-minute voice consultations with domain experts.',
    // TODO: period, and the problem statement in your own words
    problem: 'Getting advice from a domain expert usually means slow bookings and fixed fees, even for a five-minute question.',
    did: ['Built a voice consultation Android app connecting users with domain experts over real-time calls', 'Designed the end-to-end architecture, including call routing to the client’s team of agents', 'Built per-minute billing, and took the app live on the Play Store'],
    metrics: [
      { value: 'Live', label: 'on Google Play' },
      { value: 'Per-minute', label: 'billing for consultations' },
      { value: 'Real-time', label: 'voice calls with experts' },
    ],
    stack: ['Android', 'Voice calls', 'Billing', 'Marketplace'],
  },
];

export const CAPABILITIES = [
  { group: 'Strategy', items: ['Product management', 'Business diagnosis', 'GTM strategy', 'Competitive benchmarking', 'Program management'] },
  { group: 'Technical', items: ['AWS & GCP', 'Python & SQL', 'Jira', 'AI & automation agents', 'App Store releases', 'UI/UX design'] },
  { group: 'Automation', items: ['MS365 Copilot', 'n8n & Make', 'Power Automate', 'Power BI', 'Claude & Claude Cowork'] },
];
