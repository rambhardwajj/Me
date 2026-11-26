import { ACCENT, trip as getTrip, type TripId } from '@/lib/uber';
import { tripPhotos } from '@/lib/uber-photos';

/** Where the phone's screen starts on the stage's 1440 × 900 canvas (the frame at 56, 16 plus its 12px bezel). */
const SCREEN = { x: 68, y: 28 };
/** The tip sits just right of the phone's frame. */
const TIP = { x: 492, w: 316, h: 94 };

/**
 * Point at a destination in the phone and a small card opens beside the phone, level with it:
 * one photo, the name and one line. A tooltip, nothing to press.
 * `y` is the icon's centre in the phone's own pixels.
 */
export default function HoverTip({ trip, y }: { trip: TripId; y: number }) {
  const t = getTrip(trip);
  const photo = tripPhotos(trip)[0];
  const at = SCREEN.y + y;
  const top = Math.max(96, Math.min(900 - TIP.h - 24, at - TIP.h / 2));
  return (
    <div className="ub-tip" key={trip} aria-hidden="true" style={{ left: TIP.x, top, width: TIP.w, ['--acc' as string]: ACCENT[trip], ['--caret' as string]: `${Math.max(18, Math.min(TIP.h - 18, at - top))}px` }}>
      {photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={photo.contain ? 'contain' : ''} src={photo.src} alt="" width={144} height={144} decoding="async" />
      )}
      <span className="ub-tip-text">
        <b>{t.name}</b>
        <small>{t.sub}</small>
      </span>
    </div>
  );
}
