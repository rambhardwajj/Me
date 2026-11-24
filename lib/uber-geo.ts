import { STOPS, stop, type Stop, type StopId, type Trip, type TripId } from './uber';
import ROUTES from './uber-routes.json';

/**
 * Ram's road on a real street map.
 *
 * A pin on a real map is a factual claim, so each place is where its public address is, or marked `area` when only
 * the locality or the city is known:
 * - St. Dominic's School: Basantar Marg, Mathura Cantt (CBSE record). Placed at the city.
 * - Ramjas College and Amity University, Noida: coordinates from OpenStreetMap.
 * - Ciena: Tower 04, India Intellion Park, near Sector 59, Gurugram (from Ram; he worked remotely). Placed at Sector 59.
 * - Super 30 Hacker House (100xSchool): a residential campus in Noida (from Ram). Placed at the city.
 * - Newral: Sector 62, Noida.
 * - TruCost: based in Delhi (from Ram). Placed at the city.
 * - Masters' Union: DLF Cyberpark, Udyog Vihar, Gurugram (its own contact page).
 * - "Ram, today": Gurugram city centre, Ram's choice on 24 Nov 2026. Not a home address.
 * - YC VibeCon Wingathon: Bangalore (from Ram). It is one of Newral's events on the road, and has a pin of its own far to the south.
 *
 * Projects sit with the institute they came out of (Ram, 24 Nov 2026): LeetCase and unBothrrd with Masters' Union,
 * Synappses with Newral, Dance with Ramjas College.
 *
 * The roads are real driving routes over OpenStreetMap, worked out once with OSRM (router.project-osrm.org) and saved in
 * uber-routes.json: the legs between one place and the next in the order Ram lived them, and a direct ride from
 * "Ram, today" to each place. Nothing is asked of a routing service when the page runs.
 *
 * The events between two places (a dance win, an award) are dots spaced along the road that leaves the place they
 * belong to, in the order they happened. Their spots are a timeline, not locations.
 */
export type GeoPoint = { lng: number; lat: number };
export type GeoPlace = GeoPoint & { city: string; area?: boolean };
export type XY = { x: number; y: number };

type PlaceId = 'st-dominics' | 'ramjas' | 'amity' | 'ciena' | 'super-30' | 'newral' | 'trucost' | 'masters-union' | 'you';

export const PLACE_GEO: Record<PlaceId, GeoPlace> = {
  'st-dominics': { lng: 77.6856, lat: 27.4956, city: 'Mathura', area: true },
  ramjas: { lng: 77.2066, lat: 28.6855, city: 'Delhi' },
  amity: { lng: 77.3327, lat: 28.5432, city: 'Noida' },
  ciena: { lng: 77.1067, lat: 28.403, city: 'Gurugram', area: true },
  'super-30': { lng: 77.3272, lat: 28.5706, city: 'Noida', area: true },
  newral: { lng: 77.3643, lat: 28.6211, city: 'Noida', area: true },
  trucost: { lng: 77.209, lat: 28.6139, city: 'Delhi', area: true },
  'masters-union': { lng: 77.0898, lat: 28.503, city: 'Gurugram' },
  you: { lng: 77.0299, lat: 28.4646, city: 'Gurugram', area: true },
};
export const GEO_HOME = PLACE_GEO.you;
/** An event with a pin of its own, far from the rest. */
export const FAR = { stop: 'wingathon' as StopId, lng: 77.59, lat: 12.9768, city: 'Bangalore' };

/** The order Ram lived the places in. The road runs through them in this order and ends at "Ram, today". */
const ORDER: PlaceId[] = ['st-dominics', 'ramjas', 'amity', 'ciena', 'super-30', 'newral', 'trucost', 'masters-union', 'you'];

/** The institute a ride ends at. A project rides to the institute it came out of. */
const INSTITUTE: Partial<Record<TripId, PlaceId>> = {
  'st-dominics': 'st-dominics',
  ramjas: 'ramjas',
  dance: 'ramjas',
  amity: 'amity',
  ciena: 'ciena',
  'super-30': 'super-30',
  newral: 'newral',
  synappses: 'newral',
  trucost: 'trucost',
  'masters-union': 'masters-union',
  leetcase: 'masters-union',
  unbothrrd: 'masters-union',
};

export const merc = (p: GeoPoint): XY => ({ x: (p.lng + 180) / 360, y: (1 - Math.log(Math.tan((p.lat * Math.PI) / 180) + 1 / Math.cos((p.lat * Math.PI) / 180)) / Math.PI) / 2 });
export const unmerc = (m: XY): [number, number] => [m.x * 360 - 180, (Math.atan(Math.sinh(Math.PI * (1 - 2 * m.y))) * 180) / Math.PI];

type Saved = { legs: Record<string, [number, number][]>; rides: Record<string, [number, number][]> };
const saved = ROUTES as unknown as Saved;
const line = (pts: [number, number][] | undefined, a: GeoPoint, b: GeoPoint): XY[] => (pts && pts.length > 1 ? pts.map(([lng, lat]) => merc({ lng, lat })) : [merc(a), merc(b)]);
const lengths = (pts: XY[]) => pts.reduce<number[]>((acc, q, i) => [...acc, i ? acc[i - 1] + Math.hypot(q.x - pts[i - 1].x, q.y - pts[i - 1].y) : 0], []);

/* ------------------------------------------------------------------ the whole road, school to today */

const ROAD: XY[] = [];
/** How far along the road each place is. */
const PLACE_AT = {} as Record<PlaceId, number>;
ORDER.forEach((id, i) => {
  if (!i) {
    PLACE_AT[id] = 0;
    return;
  }
  const prev = ORDER[i - 1];
  const leg = line(saved.legs?.[`${prev}>${id}`], PLACE_GEO[prev], PLACE_GEO[id]);
  const start = ROAD.length ? lengths(ROAD)[ROAD.length - 1] : 0;
  const run = lengths(leg);
  ROAD.push(...(ROAD.length ? leg.slice(1) : leg));
  PLACE_AT[id] = start + run[run.length - 1];
});
const ROAD_RUN = lengths(ROAD);

/** How far along the road every stop is. An event sits between the place before it and the place after it, evenly spaced. */
const STOP_AT = {} as Record<StopId, number>;
{
  let before: PlaceId = ORDER[0];
  let waiting: Stop[] = [];
  const settle = (after: PlaceId) => {
    waiting.forEach((s, i) => {
      STOP_AT[s.id] = PLACE_AT[before] + ((PLACE_AT[after] - PLACE_AT[before]) * (i + 1)) / (waiting.length + 1);
    });
    waiting = [];
  };
  for (const s of STOPS) {
    if (s.type === 'dot') waiting.push(s);
    else {
      const id = s.id as PlaceId;
      settle(id);
      STOP_AT[s.id] = PLACE_AT[id];
      before = id;
    }
  }
}

export type Mark = { stop: Stop; at: number; pin: boolean };
export type Path = {
  pts: XY[];
  /** Every stop on the path, in travel order, with how far along it is (0 to 1). */
  marks: Mark[];
  /** A single ride: straight from "Ram, today" to one place. */
  ride: null | { place: GeoPlace; institute: Stop; name: string };
};

function cut(pts: XY[], run: number[], lo: number, hi: number): XY[] {
  const at = (d: number): XY => {
    let i = 1;
    while (i < pts.length - 1 && run[i] < d) i++;
    const t = Math.max(0, Math.min(1, (d - run[i - 1]) / (run[i] - run[i - 1] || 1)));
    return { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * t, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * t };
  };
  return [at(lo), ...pts.filter((_, i) => run[i] > lo && run[i] < hi), at(hi)];
}

/** The stretch of Ram's road between two stops, in the direction of travel. */
export function roadPath(from: StopId, to: StopId): Path {
  const a = STOP_AT[from];
  const b = STOP_AT[to];
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  const pts = cut(ROAD, ROAD_RUN, lo, hi);
  const span = hi - lo || 1;
  const marks = STOPS.filter((s) => STOP_AT[s.id] >= lo - 1e-12 && STOP_AT[s.id] <= hi + 1e-12).map((s) => ({ stop: s, at: (STOP_AT[s.id] - lo) / span, pin: s.type !== 'dot' }));
  if (a > b) {
    pts.reverse();
    marks.reverse();
    marks.forEach((m) => (m.at = 1 - m.at));
  }
  return { pts, marks, ride: null };
}

/** Where a stop is on the map: its place, or its spot on the road. */
export function stopXY(id: StopId): XY {
  const d = STOP_AT[id];
  return cut(ROAD, ROAD_RUN, d, d)[0];
}

/** The institute a trip rides to, when the trip is one ride from "Ram, today" to a place. */
export function rideTo(t: Trip): PlaceId | null {
  return t.from === 'you' ? (INSTITUTE[t.id] ?? null) : null;
}

/** A single ride: the real road from "Ram, today" to the trip's institute, with the trip's own events on the way. */
export function ridePath(t: Trip): Path | null {
  const id = rideTo(t);
  if (!id) return null;
  const pts = line(saved.rides?.[id], GEO_HOME, PLACE_GEO[id]);
  const institute = stop(id);
  // what happened there, in order. The place itself is the last thing reached
  const events = STOPS.filter((s) => s.type === 'dot' && s.trip === t.id);
  const marks: Mark[] = [{ stop: stop('you'), at: 0, pin: true }, ...events.map((s, i) => ({ stop: s, at: (i + 1) / (events.length + 1), pin: false })), { stop: institute, at: 1, pin: true }];
  return { pts, marks, ride: { place: PLACE_GEO[id], institute, name: t.name } };
}

/** Every place with a pin, for a map that is only being looked at. */
export const PLACE_STOPS: Stop[] = ORDER.map((id) => stop(id));
export const placeGeo = (id: StopId): GeoPlace | null => PLACE_GEO[id as PlaceId] ?? null;
