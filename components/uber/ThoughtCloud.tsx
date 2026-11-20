import { ACCENT, trip as getTrip, type TripId } from '@/lib/uber';
import { tripPhotos } from '@/lib/uber-photos';

/** Where the phone's screen starts on the stage's 1440 × 900 canvas (the frame at 56, 16 plus its 12px bezel). */
const SCREEN = { x: 68, y: 28 };
/** The cloud floats just right of the phone. */
const CLOUD = { x: 516, w: 400, h: 290 };

/**
 * A cartoon thought cloud: point at a destination in the phone and its photos float up beside the phone,
 * with a trail of bubbles running from the icon to the cloud.
 * `x` and `y` are the icon's centre in the phone's own pixels.
 */
export default function ThoughtCloud({ trip, x, y }: { trip: TripId; x: number; y: number }) {
  const t = getTrip(trip);
  const photos = tripPhotos(trip).slice(0, 3);
  if (!photos.length) return null;
  const from = { x: SCREEN.x + x, y: SCREEN.y + y };
  const top = Math.max(86, Math.min(900 - CLOUD.h - 40, from.y - CLOUD.h / 2 - 30));
  // the trail ends at the cloud's lower-left lobe
  const to = { x: CLOUD.x + 36, y: top + CLOUD.h - 70 };
  const trail = [0.3, 0.55, 0.8].map((f, i) => ({ x: from.x + (to.x - from.x) * f, y: from.y + (to.y - from.y) * f - Math.sin(f * Math.PI) * 26, r: 7 + i * 5 }));
  return (
    <div className="ub-cloud" aria-hidden="true" style={{ ['--acc' as string]: ACCENT[trip] }}>
      {trail.map((b, i) => (
        <i key={i} className="ub-cloud-dot" style={{ left: b.x - b.r, top: b.y - b.r, width: b.r * 2, height: b.r * 2, ['--i' as string]: i }} />
      ))}
      <div className="ub-cloud-body" key={trip} style={{ left: CLOUD.x, top, width: CLOUD.w, height: CLOUD.h }}>
        {/* the puffs that make the cloud's outline */}
        <i className="puff a" />
        <i className="puff b" />
        <i className="puff c" />
        <i className="puff d" />
        <i className="puff e" />
        <div className="ub-cloud-in">
          <div className={`ub-cloud-photos n${photos.length}`}>
            {photos.map((p, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={p.src} className={p.contain ? 'contain' : ''} src={p.src} alt="" style={{ ['--i' as string]: i }} />
            ))}
          </div>
          <b>{t.name}</b>
          <small>{t.sub}</small>
        </div>
      </div>
    </div>
  );
}
