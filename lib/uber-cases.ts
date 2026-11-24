import { EXPERIENCE, THEME_KEY, trip, type Job, type Trip, type TripId } from './uber';
import { tripPhotos, type Photo } from './uber-photos';

/**
 * Case studies at /uber/work/<slug>: one page each, in one format.
 *   Problem · My role · What I did · Result (with a number) · What I would do differently
 * Everything comes from the trip (lib/uber.ts, where the briefs' numbers win). A part with no source is not shown:
 * nothing here is invented to fill a heading.
 *
 * TODO(Ram), the gaps. Each one is hidden on the page until it is filled:
 *  - "What I would do differently": not written for ANY case. Fill `differently` below, in your own words.
 *  - Problem: missing for Newral, Ciena, Synappses, Super 30 and Ingenious (add `problem` to the trip in lib/uber.ts).
 *  - What I did: missing for Synappses and Super 30 (add `did` to the trip).
 *  - Result with a number: missing for Synappses (add `result` to the trip). Ingenious has no number, only "ISRO".
 *  - A screenshot or photo: missing for Ingenious (add one to TRIP_SOURCES in lib/uber-photos.ts).
 *  - Dance is not a case study here; its text still says "Chicago" although the battle was in Delhi. Confirm the wording.
 */
const DIFFERENTLY: Partial<Record<TripId, string>> = {
  // trucost: '',
  // newral: '',
  // leetcase: '',
};

/** The cases, in the order a hiring manager should meet them. */
export const CASE_IDS: TripId[] = ['trucost', 'newral', 'leetcase', 'ciena', 'unbothrrd', 'synappses', 'super-30', 'ingenious'];

export type CaseStudy = {
  slug: TripId;
  t: Trip;
  job?: Job;
  /** The role line when the place is not in the experience list. */
  role: { title: string; when: string }[];
  visual: Photo | null;
  differently: string;
};

/** Roles for the products that are not jobs: the trip's own line, split into title and year. */
const ownRole = (t: Trip) => {
  const [title, when] = t.pickup.split(', ');
  // Synappses: Ram confirmed the dates himself (lib/uber.ts, OWED 5)
  return [{ title, when: t.id === 'synappses' ? 'Oct 2025 to Jun 2026' : (when ?? '') }];
};

export function getCase(slug: string): CaseStudy | null {
  if (!CASE_IDS.includes(slug as TripId)) return null;
  const t = trip(slug as TripId);
  const job = EXPERIENCE.find((j) => j.trip === t.id);
  const photos = tripPhotos(t.id);
  return { slug: t.id, t, job, role: job ? job.roles : ownRole(t), visual: photos.find((p) => p.contain) ?? photos[0] ?? null, differently: DIFFERENTLY[t.id]?.trim() ?? '' };
}

export const caseHref = (id: TripId) => `/uber/work/${id}`;
export const hasCase = (id: TripId) => CASE_IDS.includes(id);
export const PROPOSAL_HREF = '/uber/proposal';
export const WORK_HREF = '/uber/work';

/** Applies a saved dark theme before first paint, on every /uber page. Light is the default whatever the OS says. */
export const THEME_SCRIPT = `try{if(localStorage.getItem('${THEME_KEY}')==='dark'){var e=document.querySelector('.ub');e.dataset.theme='dark';e.classList.add('vox-dark')}}catch(e){}`;
