import type { Trip, TripId } from './uber';

/**
 * Real places, for the rides that are drawn on a real street map.
 *
 * A pin on a real map is a factual claim, so only places with a public address are here:
 * - Masters' Union: DLF Cyberpark, Udyog Vihar, Gurugram (its own contact page). It is where "Ram, today" starts from:
 *   the site says Gurugram and "PGP, now", and a campus is not a home address.
 * - Ramjas College and Amity University, Noida: coordinates from OpenStreetMap.
 * - Newral: Sector 62, Noida. An area, not a building, so it is marked `area`.
 * - St. Dominic's School: Basantar Marg, Mathura Cantt (CBSE record). Placed at the city, marked `area`.
 *
 * Not here, so these rides stay on the drawn road:
 * - Ciena: no Gurugram office address confirmed from Ciena itself.
 * - TruCost and Super 30 Hacker House: Ram has not said where they were.
 * - Masters' Union as a destination: the ride would start and end at the same place.
 * - Anything that is not a place (LeetCase, unBothrrd, dance) and any ride that tells stops on the way (Ram's story, Full story).
 */
export type GeoPoint = { lng: number; lat: number };
export type GeoPlace = GeoPoint & { city: string; area?: boolean };

export const GEO_HOME: GeoPlace = { lng: 77.0898, lat: 28.503, city: 'Gurugram' };

const GEO: Partial<Record<TripId, GeoPlace>> = {
  ramjas: { lng: 77.2066, lat: 28.6855, city: 'Delhi' },
  amity: { lng: 77.3327, lat: 28.5432, city: 'Noida' },
  newral: { lng: 77.3643, lat: 28.6211, city: 'Noida', area: true },
  'st-dominics': { lng: 77.6856, lat: 27.4956, city: 'Mathura', area: true },
};

/** The real place a ride ends at, when the whole ride is one leg from "Ram, today" to a place with a known address. */
export function realLeg(t: Trip): GeoPlace | null {
  return t.from === 'you' ? (GEO[t.id] ?? null) : null;
}
