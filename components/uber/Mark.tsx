import { LOGO, trip as getTrip, type TripId } from '@/lib/uber';
import { Pict } from './icons';

/** A trip's mark: the organisation's own logo where there is a file for it, the pictogram where there is not. */
export default function Mark({ id, size = 48 }: { id: TripId; size?: number }) {
  const src = LOGO[id];
  if (!src) return <Pict name={getTrip(id).icon} size={size} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="ub-logo" src={src} alt="" width={size} height={size} loading="lazy" decoding="async" />;
}
