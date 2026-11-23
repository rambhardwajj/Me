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
 * From Ram, 23 Nov 2026:
 * - Ciena: its India office is Tower 04, India Intellion Park, near Sector 59, Gurugram (he worked remotely). Placed at Sector 59, marked `area`.
 * - TruCost: based in Delhi. No address, so it is placed at the city, marked `area`.
 * - Super 30 Hacker House (100xSchool): a residential campus in Noida. No address, so it is placed at the city, marked `area`.
 *
 * Not here, so these rides stay on the drawn road:
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
  ciena: { lng: 77.1067, lat: 28.403, city: 'Gurugram', area: true },
  trucost: { lng: 77.209, lat: 28.6139, city: 'Delhi', area: true },
  'super-30': { lng: 77.3272, lat: 28.5706, city: 'Noida', area: true },
};

/** The real place a ride ends at, when the whole ride is one leg from "Ram, today" to a place with a known address. */
export function realLeg(t: Trip): GeoPlace | null {
  return t.from === 'you' ? (GEO[t.id] ?? null) : null;
}
