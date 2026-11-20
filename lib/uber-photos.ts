/**
 * Photos for the /uber page. Nothing is uploaded here: every photo is read from the site's own
 * journey (lib/data.ts) by its id, or is a product screenshot the main site already shows.
 * A photo is attached to a stop only where the journey ties it to that stop.
 */
import { JOURNEY } from './data';
import type { StopId, TripId } from './uber';

export type Photo = {
  src: string;
  /** Caption and alt text: the journey's own title and place for that photo. */
  alt: string;
  caption: string;
  /** Posters and screenshots are shown whole instead of cropped. */
  contain?: boolean;
};

/** A photo from the journey, by the journey's id. */
function fromJourney(id: string): Photo | null {
  const m = JOURNEY.find((x) => x.id === id);
  return m?.image ? { src: m.image, alt: `${m.title}, ${m.org}`, caption: m.title, contain: m.fullImage } : null;
}

/** Product screenshots, the same files the main site's Work chapter uses. */
const SHOT: Record<string, Photo> = {
  trucost: { src: '/images/trucost.webp', alt: 'TruCost app screen', caption: 'TruCost, the rider app', contain: true },
  leetcase: { src: '/images/leetcase.webp', alt: 'LeetCase product screen', caption: 'LeetCase', contain: true },
  synappses: { src: 'https://res.cloudinary.com/ewpg7mfj/image/upload/w_900/f_auto,q_auto/v1792334002/Screenshot_2026-10-18_at_8.02.57_PM_fhkljn.png', alt: 'Synappses website', caption: 'Synappses', contain: true },
  unbothrrd: { src: 'https://res.cloudinary.com/ewpg7mfj/image/upload/w_900/f_auto,q_auto/v1792334117/Screenshot_2026-10-18_at_8.04.50_PM_qodm99.png', alt: 'unBothrrd storefront', caption: 'unBothrrd, the storefront', contain: true },
};

/** Which journey photo belongs to each stop on the map. */
const STOP_JOURNEY: Partial<Record<StopId, string>> = {
  'st-dominics': 'class-12',
  ramjas: 'ramjas',
  'dance-wins': 'dance-wins',
  'world-battle': 'world-battle',
  choreography: 'choreographer',
  amity: 'mca',
  'rank-1': 'rank-1',
  ciena: 'ciena-intern',
  'full-time': 'ciena-fte',
  edst: 'ciena-award',
  cienagpt: 'cienagpt',
  'super-30': 'hacker-house',
  newral: 'newral-swe',
  'tech-lead': 'best-employee',
  wingathon: 'wingathon',
  'product-manager': 'newral-pm',
  trucost: 'trucost',
  'masters-union': 'masters-union',
  leetcase: 'leetcase',
};

export function stopPhoto(id: StopId): Photo | null {
  if (id === 'synappses') return SHOT.synappses;
  const j = STOP_JOURNEY[id];
  return j ? fromJourney(j) : null;
}

/** The gallery for each trip: Ram's own photos first. Entries starting with "shot:" are product screenshots. */
const TRIP_SOURCES: Record<TripId, string[]> = {
  trucost: ['trucost', 'shot:trucost'],
  newral: ['newral-pm', 'best-employee', 'wingathon', 'newral-tpl'],
  ciena: ['ciena-award', 'cienagpt', 'ciena-fte'],
  leetcase: ['shot:leetcase'],
  unbothrrd: ['shot:unbothrrd'],
  synappses: ['shot:synappses'],
  'super-30': ['hacker-house'],
  dance: ['world-battle', 'dance-wins', 'choreographer'],
  'st-dominics': ['class-12'],
  ramjas: ['dance-wins', 'choreographer', 'ramjas'],
  amity: ['rank-1', 'mca'],
  'masters-union': ['masters-union', 'shot:leetcase', 'shot:unbothrrd'],
  'idle-minutes': ['trucost', 'shot:trucost'],
  story: ['class-12', 'world-battle', 'rank-1', 'ciena-award', 'wingathon', 'trucost'],
};

export function tripPhotos(id: TripId): Photo[] {
  return TRIP_SOURCES[id].map((k) => (k.startsWith('shot:') ? SHOT[k.slice(5)] : fromJourney(k))).filter((p): p is Photo => !!p);
}

/** Ram's portrait, the cut-out the main site uses. */
export const PORTRAIT: Photo = { src: '/images/ram-cutout.webp', alt: 'Ram Bhardwaj', caption: 'Ram Bhardwaj' };
