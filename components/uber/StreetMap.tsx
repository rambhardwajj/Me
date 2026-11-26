'use client';

import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react';
import type { Map as GlMap } from 'maplibre-gl';
import { stop, type Stop, type StopId, type Trip } from '@/lib/uber';
import { FAR, GEO_HOME, PLACE_STOPS, merc, placeGeo, ridePath, roadPath, stopXY, unmerc, type XY } from '@/lib/uber-geo';
import { Icon } from './icons';
import Mark from './Mark';
import { useDriveClock } from './useDriveClock';

/**
 * Ram's road on a real street map. It replaces the drawn map everywhere.
 *
 * Two kinds of view:
 * - a ride (`ride`): one real road from "Ram, today" to one place, with that trip's events on the way;
 * - the road (`from`, `to`): the stretch of Ram's whole road between two stops, every stop on it in the order it happened.
 *
 * The streets are OpenStreetMap data, drawn by MapLibre from OpenFreeMap's tiles (free, no key; their credit stays on the map).
 * The camera, the route, the pins and the car are worked out here in plain Web Mercator, and the street map is only told
 * where to look. So if the tiles or the library never load, everything still shows on a plain background and the car arrives.
 * No distance or driving time is shown.
 */

const STYLE = { light: 'https://tiles.openfreemap.org/styles/positron', dark: 'https://tiles.openfreemap.org/styles/dark' };
/** A copy of node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs. It must match the installed version, which package.json pins: copy it again when upgrading. */
const WORKER = '/vendor/maplibre-gl-worker-6.19.0.mjs';
const TILE = 512;
const FAR_XY = merc(FAR);
/** South of this line (about 50 km below Delhi) a point is on the way to Mathura. Mercator y grows southwards. */
const DELHI_SOUTH = merc({ lng: 77, lat: 28.2 }).y;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

function useTheme(el: React.RefObject<HTMLElement | null>): 'light' | 'dark' {
  return useSyncExternalStore(
    (cb) => {
      const root = el.current?.closest('.ub');
      if (!root) return () => {};
      const mo = new MutationObserver(cb);
      mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
      return () => mo.disconnect();
    },
    () => (el.current?.closest<HTMLElement>('.ub')?.dataset.theme === 'dark' ? 'dark' : 'light'),
    () => 'light',
  );
}

/** A number that glides to its target instead of jumping: the parked car moving from one stop to the next. */
function useGlide(target: number | null, ms: number): number | null {
  const [v, setV] = useState<{ at: number; live: boolean }>({ at: target ?? 0, live: target !== null });
  const cur = useRef(target ?? 0);
  useEffect(() => {
    if (target === null) return;
    const from = cur.current;
    if (!ms || from === target) {
      cur.current = target;
      const id = window.setTimeout(() => setV({ at: target, live: true }), 0);
      return () => window.clearTimeout(id);
    }
    const t0 = performance.now();
    let raf = 0;
    let done = false;
    const step = () => {
      const t = Math.min(1, (performance.now() - t0) / ms);
      cur.current = lerp(from, target, ease(t));
      setV({ at: cur.current, live: true });
      if (t < 1) raf = requestAnimationFrame(step);
      else done = true;
    };
    raf = requestAnimationFrame(step);
    // a hidden tab gets no frames: land on the target anyway
    const backup = window.setTimeout(() => {
      if (done) return;
      cancelAnimationFrame(raf);
      cur.current = target;
      setV({ at: target, live: true });
    }, ms + 400);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(backup);
    };
  }, [target, ms]);
  return target === null ? null : v.live ? v.at : target;
}

type Props = {
  /** A single ride: this trip, straight from "Ram, today" to its place. When it has no place, the road between `from` and `to` is shown. */
  ride?: Trip | null;
  from: StopId;
  to: StopId;
  /** Space covered by other things (a sheet, a dock), kept clear of the route. */
  pad?: { top?: number; bottom?: number; left?: number; right?: number };
  /** The big map beside the phone: names on every place. */
  detail?: boolean;
  /** Zoom buttons. */
  controls?: boolean;
  /** Only looking: frame the places around Delhi, whatever the route. */
  browse?: boolean;
  hot?: StopId | null;
  onHot?: (id: StopId | null) => void;
  onPick?: (id: StopId) => void;
  /** A card that opens beside the stop being pointed at. */
  hoverCard?: ReactNode;
  /** A card docked in the top-left corner, for a ride or a story in progress. */
  dock?: ReactNode;
  /** Start a drive: the car runs the route from its first stop to its last. A new string drives again; null for no drive. */
  drive?: string | null;
  paused?: boolean;
  skip?: string | null;
  onPass?: (id: StopId) => void;
  onDone?: () => void;
  /** The stop-by-stop story: park the car at this stop. */
  carAt?: StopId | null;
  /** A ride is being requested: rings pulse out from the pickup point. */
  searching?: boolean;
  /** Close in on the car: from the moment the ride is confirmed, and all through the drive. */
  zoomOnCar?: boolean;
  reducedMotion?: boolean;
};

export default function StreetMap({ ride = null, from, to, pad = {}, detail, controls, browse, hot = null, onHot, onPick, hoverCard, dock, drive = null, paused, skip, onPass, onDone, carAt = null, searching, zoomOnCar, reducedMotion }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const glBox = useRef<HTMLDivElement>(null);
  const map = useRef<GlMap | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [ready, setReady] = useState(false);
  /** The visitor's own zoom on top of the fitted view, and whether they are looking at the far pin. */
  const [mine, setMine] = useState({ key: '', z: 0, far: false });
  const theme = useTheme(box);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    // measured once straight away: a hidden tab never delivers the observer's first call
    const read = () => setSize((z) => (z.w === el.offsetWidth && z.h === el.offsetHeight ? z : { w: el.offsetWidth, h: el.offsetHeight }));
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ------------------------------------------------------------ the path: one ride, or a stretch of the whole road */
  const path = useMemo(() => (ride ? ridePath(ride) : null) ?? roadPath(from, to), [ride, from, to]);
  const { pts, marks } = path;
  const run = useMemo(() => pts.reduce<number[]>((acc, q, i) => [...acc, i ? acc[i - 1] + Math.hypot(q.x - pts[i - 1].x, q.y - pts[i - 1].y) : 0], []), [pts]);
  const total = run[run.length - 1] || 0;
  const spot = (frac: number) => {
    const d = Math.max(0, Math.min(1, frac)) * total;
    let i = 1;
    while (i < pts.length - 1 && run[i] < d) i++;
    const t = (d - run[i - 1]) / (run[i] - run[i - 1] || 1);
    return { i, x: lerp(pts[i - 1].x, pts[i].x, t), y: lerp(pts[i - 1].y, pts[i].y, t) };
  };

  const posIsNear = (frac: number) => spot(frac).y < DELHI_SOUTH;
  // the drive: the car travels from one stop to the next, easing away and easing in, and waits at every stop on the way
  // long enough to be read. Each stretch takes the same time however long the road is, so the run up from Mathura is
  // one stop's worth of the drive, not half of it.
  const stopsOnWay = marks.filter((m) => m.at > 0.0005);
  const knots = [0, ...stopsOnWay.map((m) => m.at)];
  if (knots[knots.length - 1] < 1) knots.push(1);
  const legs = knots.length - 1;
  const TRAVEL = path.ride ? 1700 : legs > 8 ? 850 : 1200;
  const WAIT = 1100;
  const driveMs = legs * TRAVEL + (legs - 1) * WAIT;
  const clock = useDriveClock(drive, reducedMotion ? 0 : driveMs, { paused, skip, onDone });
  const tNow = clock * driveMs;
  const leg = Math.min(legs - 1, Math.floor(tNow / (TRAVEL + WAIT)));
  const inLeg = tNow - leg * (TRAVEL + WAIT);
  const p = clock >= 1 ? 1 : lerp(knots[leg], knots[leg + 1], ease(inLeg / TRAVEL));
  const driving = !!drive && clock < 1;
  const passed = drive ? stopsOnWay.filter((m) => m.at <= p + 0.0005).length : stopsOnWay.length;
  const told = useRef(0);
  const tell = useRef(onPass);
  useEffect(() => {
    tell.current = onPass;
  });
  useEffect(() => {
    if (drive && passed > 0 && passed !== told.current) tell.current?.(stopsOnWay[passed - 1].stop.id);
    told.current = passed;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passed, drive]);

  // the parked car of the stop-by-stop story
  const parkAt = carAt ? (marks.find((m) => m.stop.id === carAt)?.at ?? null) : null;
  const park = useGlide(parkAt, reducedMotion ? 0 : 1100);
  // closing in on the car before it sets off: it waits at the pickup point
  const zoomed = useGlide(zoomOnCar ? 1 : 0, reducedMotion ? 0 : 900) ?? 0;
  const carFrac = driving ? p : !drive && park !== null ? park : !drive && zoomOnCar ? 0 : null;

  /* ------------------------------------------------------------ the camera */
  const viewKey = `${ride?.id ?? ''}:${from}:${to}:${browse ? 'b' : ''}`;
  const own = mine.key === viewKey ? mine : { key: viewKey, z: 0, far: false };
  // Mathura is far south of everything else. A road that runs on from it into Delhi is framed around Delhi, where
  // the places are, and the stretch down to Mathura runs off the edge (a chip points to it, and a drive follows the car)
  const nearDelhi = pts.filter((q) => q.y < DELHI_SOUTH);
  const clipped = !browse && !path.ride && nearDelhi.length > 1 && nearDelhi.length < pts.length && marks.filter((m) => m.pin && posIsNear(m.at)).length > 1;
  // a story with one stop is no stretch of road at all: show where it sits among the places
  const tiny = !path.ride && total * TILE * 2 ** 10 < 40;
  const framed: XY[] = own.far ? [merc(GEO_HOME), FAR_XY] : browse || tiny ? PLACE_STOPS.filter((s) => s.id !== 'st-dominics').map((s) => stopXY(s.id)) : clipped ? nearDelhi : pts;
  const xs = framed.map((q) => q.x);
  const ys = framed.map((q) => q.y);
  const bx = { lo: Math.min(...xs), hi: Math.max(...xs) };
  const by = { lo: Math.min(...ys), hi: Math.max(...ys) };
  const edge = Math.min(84, size.w * 0.14);
  const free = { l: (pad.left ?? 0) + edge, r: (pad.right ?? 0) + edge, t: (pad.top ?? 0) + edge + 20, b: (pad.bottom ?? 0) + edge + (own.far ? 70 : 0) };
  const fw = Math.max(40, size.w - free.l - free.r);
  const fh = Math.max(40, size.h - free.t - free.b);
  const fitZoom = Math.min(path.ride ? 14 : 12.5, Math.log2(Math.min(fw / ((bx.hi - bx.lo || 1e-6) * TILE), fh / ((by.hi - by.lo || 1e-6) * TILE))));
  // where the middle of the free space is, measured from the middle of the map
  const off = { x: free.l + fw / 2 - size.w / 2, y: free.t + fh / 2 - size.h / 2 };
  let zoom = fitZoom + own.z;
  let mid = { x: (bx.lo + bx.hi) / 2, y: (by.lo + by.hi) / 2 };
  // the drive is followed from close in, the way a ride app follows the car: the view closes in when the ride is
  // confirmed, stays on the car, and eases back out to the whole route as it arrives
  const followZoom = path.ride ? Math.max(fitZoom, Math.min(13.2, Math.max(10.6, fitZoom + 1.5))) : Math.max(fitZoom, Math.min(10.4, fitZoom + 2.6));
  const canFollow = !own.far && (clipped || followZoom > fitZoom + 0.3);
  const near = !canFollow ? 0 : driving ? Math.min(Math.max(ease(p / 0.1), zoomed), ease((1 - p) / 0.1)) : drive ? 0 : zoomed;
  if (near > 0) {
    const c = spot(driving ? p : 0);
    zoom = lerp(zoom, followZoom + own.z, near);
    mid = { x: lerp(mid.x, c.x, near), y: lerp(mid.y, c.y, near) };
  }
  const world = TILE * 2 ** zoom;
  const cx = mid.x - off.x / world;
  const cy = mid.y - off.y / world;
  const sx = (q: XY) => (q.x - cx) * world + size.w / 2;
  const sy = (q: XY) => (q.y - cy) * world + size.h / 2;
  const inBox = (q: XY, m = 0) => sx(q) > m && sx(q) < size.w - m && sy(q) > m && sy(q) < size.h - m;

  // the street map follows that camera; it never moves by itself
  const view = useRef({ center: unmerc({ x: cx, y: cy }), zoom, theme });
  useEffect(() => {
    view.current = { center: unmerc({ x: cx, y: cy }), zoom, theme };
  });
  useEffect(() => {
    if (!glBox.current) return;
    let gone = false;
    import('maplibre-gl')
      .then((gl) => {
        if (gone || !glBox.current) return;
        // MapLibre runs its tile work in a worker file of its own, served from /public (see WORKER above)
        gl.setWorkerUrl(WORKER);
        const m = new gl.Map({ container: glBox.current, style: STYLE[view.current.theme], center: view.current.center, zoom: view.current.zoom, interactive: false, fadeDuration: 0, attributionControl: false });
        // the tile host's credit, kept on the map at all times (their terms), in the corner nothing else uses
        m.addControl(new gl.AttributionControl({ compact: false }), 'bottom-left');
        m.on('load', () => !gone && setReady(true));
        // a tile that fails to load is not worth a console error: the map works without it
        m.on('error', () => {});
        map.current = m;
      })
      .catch((e) => console.warn('StreetMap: the street map did not start; everything else works without it.', e));
    return () => {
      gone = true;
      map.current?.remove();
      map.current = null;
    };
  }, []);
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    m.resize();
    m.jumpTo({ center: unmerc({ x: cx, y: cy }), zoom });
  }, [cx, cy, zoom, size.w, size.h, ready]);
  const styled = useRef<'light' | 'dark' | null>(null);
  useEffect(() => {
    const m = map.current;
    if (!m || !ready) return;
    if (styled.current && styled.current !== theme) m.setStyle(STYLE[theme]);
    styled.current = theme;
  }, [theme, ready]);

  /* ------------------------------------------------------------ what is drawn */
  const sized = size.w > 0 && size.h > 0;
  const line = (upTo: number) => {
    const end = spot(upTo);
    return [...pts.slice(0, end.i), end].map((q, i) => `${i ? 'L' : 'M'}${sx(q).toFixed(1)} ${sy(q).toFixed(1)}`).join('');
  };
  const carXY = carFrac === null ? null : spot(carFrac);
  const ahead = carFrac === null ? null : spot(Math.min(1, carFrac + 0.012));
  const behind = carFrac === null ? null : spot(Math.max(0, carFrac - 0.012));
  const turn = ahead && behind ? (Math.atan2(sy(ahead) - sy(behind), sx(ahead) - sx(behind)) * 180) / Math.PI : 0;

  // where each thing sits on screen
  const onPath = new Map(marks.map((m) => [m.stop.id, m]));
  const posOf = (s: Stop): XY => {
    const m = onPath.get(s.id);
    return m ? spot(m.at) : stopXY(s.id);
  };
  // on a ride only its two ends have pins; on the road every place has one
  const places: Stop[] = path.ride ? [stop('you'), path.ride.institute] : PLACE_STOPS;
  const dots = marks.filter((m) => !m.pin);
  const endIds = new Set([marks[0]?.stop.id, marks[marks.length - 1]?.stop.id]);
  const dest = path.ride ? path.ride.institute.id : null;

  // names: the big map names every place it can without two names overlapping; the small one names the ends
  const labels: { s: Stop; text: string; sub?: string; left: boolean; x: number; y: number }[] = [];
  if (sized && !own.far) {
    const taken: { l: number; r: number; t: number; b: number }[] = [];
    const want = places.filter((s) => s.id !== dest && (detail || endIds.has(s.id) || hot === s.id)).sort((a, b) => Number(endIds.has(b.id)) - Number(endIds.has(a.id)));
    for (const s of want) {
      const q = posOf(s);
      if (!inBox(q, 4)) continue;
      const text = s.type === 'you' ? `Ram, today · ${GEO_HOME.city}` : s.name;
      const w = text.length * 7.2 + 20;
      for (const left of [false, true]) {
        const l = left ? sx(q) - 20 - w : sx(q) + 20;
        const box2 = { l, r: l + w, t: sy(q) - 13, b: sy(q) + 13 };
        if (box2.l < 4 || box2.r > size.w - 4) continue;
        if (taken.some((o) => box2.l < o.r + 4 && box2.r > o.l - 4 && box2.t < o.b + 2 && box2.b > o.t - 2)) continue;
        taken.push(box2);
        labels.push({ s, text, left, x: sx(q), y: sy(q) });
        break;
      }
    }
  }
  const lastPassed = driving && passed > 0 ? stopsOnWay[passed - 1] : null;
  const hotStop = hot ? stop(hot) : null;
  const hotXY = hotStop && sized ? (hotStop.id === FAR.stop && own.far ? FAR_XY : posOf(hotStop)) : null;
  // a place that is off the map (Mathura, when only looking around Delhi) gets a chip at the edge it lies beyond
  const beyond = sized && !own.far ? places.filter((s) => !inBox(posOf(s), 0) && s.type !== 'you') : [];
  // zoomed in on one stretch, most places are off the map: chips are for the one or two that lie beyond a full view
  const offMap = beyond.length <= 2 ? beyond : [];
  const zoomBy = (d: number) => setMine({ key: viewKey, z: Math.max(-2, Math.min(4, own.z + d)), far: own.far });

  return (
    <div className={`rm ${ready ? 'ready' : ''} ${detail ? 'detail' : ''}`} ref={box} style={{ '--rm-b': `${pad.bottom ?? 0}px` } as CSSProperties}>
      <div className="rm-gl" ref={glBox} />
      {sized && (
        <>
          <svg
            className="rm-over"
            width={size.w}
            height={size.h}
            role="img"
            aria-label={
              path.ride
                ? `A street map. The route runs from Ram today, in ${GEO_HOME.city}, to ${path.ride.name}, in ${path.ride.place.city}.`
                : `A street map of Ram's road from ${stop(from).name} to ${stop(to).name}, with ${marks.length} stops from start to finish.`
            }
          >
            {total > 0 && !own.far && (
              <>
                <path className="rm-route-case" d={line(1)} />
                <path className="rm-route" d={line(1)} />
                {drive && p > 0 && <path className="rm-driven" d={line(p)} />}
              </>
            )}
            {!own.far &&
              places.map((s) => {
                const g = placeGeo(s.id);
                const q = posOf(s);
                return g?.area && s.type !== 'you' && inBox(q, -40) ? <circle key={s.id} className="rm-area" cx={sx(q)} cy={sy(q)} r={path.ride ? 30 : 20} /> : null;
              })}
            {!own.far &&
              dots.map((m, i) => {
                const q = spot(m.at);
                const on = !!drive && m.at <= p + 0.0005;
                return (
                  <g key={m.stop.id} className={`rm-ev ${on ? 'on' : ''} ${hot === m.stop.id ? 'hot' : ''} ${path.ride ? '' : 'small'}`} transform={`translate(${sx(q)} ${sy(q)})`}>
                    <circle r={path.ride ? 11 : 7} />
                    {path.ride && <text y={4}>{i + 1}</text>}
                  </g>
                );
              })}
            {(() => {
              const q = own.far ? merc(GEO_HOME) : posOf(stop('you'));
              return (
                <>
                  {searching && [0, 1, 2].map((i) => <circle key={i} className="rm-radar" cx={sx(q)} cy={sy(q)} r={64} style={{ animationDelay: `${i * 0.5}s` }} />)}
                  <circle className="lm-you-halo" cx={sx(q)} cy={sy(q)} r={20} />
                  <circle className="lm-you" cx={sx(q)} cy={sy(q)} r={8} />
                </>
              );
            })()}
            {carXY && !own.far && (
              <g className="lm-carbox" transform={`translate(${sx(carXY)} ${sy(carXY)})`}>
                <circle className="lm-car-glow" r={26} />
                <g transform={`rotate(${turn})`}>
                  <rect className="lm-car-shadow" x={-19} y={-9} width={40} height={22} rx={9} />
                  <rect className="lm-car-mirror" x={5} y={-13.5} width={4} height={4} rx={1.5} />
                  <rect className="lm-car-mirror" x={5} y={9.5} width={4} height={4} rx={1.5} />
                  <rect className="lm-car" x={-20} y={-11} width={40} height={22} rx={9} />
                  <path className="lm-car-glass" d="M6 -8h3.5c3.5 0 5 2 5 4.5v7c0 2.5-1.5 4.5-5 4.5H6z" />
                  <rect className="lm-car-glass" x={-14.5} y={-7.5} width={5.5} height={15} rx={2.5} />
                  <rect className="lm-car-roof" x={-7.5} y={-8.5} width={12} height={17} rx={3.5} />
                  <rect className="lm-car-lamp" x={17.5} y={-8.5} width={2.5} height={4.5} rx={1.2} />
                  <rect className="lm-car-lamp" x={17.5} y={4} width={2.5} height={4.5} rx={1.2} />
                  <rect className="lm-car-tail" x={-20} y={-8} width={2} height={4} rx={1} />
                  <rect className="lm-car-tail" x={-20} y={4} width={2} height={4} rx={1} />
                </g>
              </g>
            )}
          </svg>

          {/* the places: a small logo tile each, and the ride's destination as a big one with its name */}
          {!own.far &&
            places
              .filter((s) => s.type !== 'you' && s.id !== dest && inBox(posOf(s), -20))
              .map((s) => {
                const q = posOf(s);
                return (
                  <span key={s.id} className={`rm-pl ${onPath.has(s.id) ? '' : 'off'} ${hot === s.id ? 'hot' : ''}`} style={{ left: sx(q), top: sy(q) }} aria-hidden="true">
                    <Mark id={s.trip} size={detail ? 20 : 18} />
                  </span>
                );
              })}
          {labels.map(({ s, text, left, x, y }) => (
            <span key={s.id} className={`rm-lab ${left ? 'left' : ''} ${onPath.has(s.id) ? '' : 'off'} ${hot === s.id ? 'hot' : ''} ${s.type === 'you' ? 'you' : ''}`} style={{ left: x, top: y }} aria-hidden="true">
              {text}
            </span>
          ))}
          {path.ride &&
            !own.far &&
            (() => {
              const q = spot(1);
              const inst = path.ride.institute;
              const at = path.ride.name === inst.name ? '' : `at ${inst.name}, `;
              return (
                <span className={`rm-pin ${sx(q) > size.w - 200 ? 'left' : ''}`} style={{ left: sx(q), top: sy(q) }} aria-hidden="true">
                  <i>
                    <Mark id={ride!.id} size={30} />
                  </i>
                  <span>
                    <b>{path.ride.name}</b>
                    <small>
                      {at}
                      {path.ride.place.area ? `${path.ride.place.city}, approximate` : path.ride.place.city}
                    </small>
                  </span>
                </span>
              );
            })()}
          {lastPassed && !lastPassed.pin && (
            <span className="rm-ev-tag" style={{ left: sx(spot(lastPassed.at)), top: sy(spot(lastPassed.at)) }} aria-hidden="true">
              {lastPassed.stop.name}
            </span>
          )}

          {/* the far pin: an event that happened a long way south */}
          {own.far && (
            <span className="rm-pin" style={{ left: sx(FAR_XY), top: sy(FAR_XY) }} aria-hidden="true">
              <i>
                <Mark id={stop(FAR.stop).trip} size={30} />
              </i>
              <span>
                <b>{stop(FAR.stop).name}</b>
                <small>{FAR.city}</small>
              </span>
            </span>
          )}
          {own.far && (
            <span className="rm-lab you" style={{ left: sx(merc(GEO_HOME)), top: sy(merc(GEO_HOME)) }} aria-hidden="true">
              Ram, today · {GEO_HOME.city}
            </span>
          )}

          {/* pointing at a stop, on the big map: these are for the pointer only, the lists reach every stop by keyboard */}
          {onHot &&
            !own.far &&
            [...places.filter((s) => s.type !== 'you'), ...dots.map((m) => m.stop)]
              .filter((s) => inBox(posOf(s), 0))
              .map((s) => (
                <span key={s.id} className={`lm-spot ${onPick ? 'pick' : ''}`} style={{ left: sx(posOf(s)), top: sy(posOf(s)) }} onMouseEnter={() => onHot(s.id)} onMouseLeave={() => onHot(null)} onClick={() => onPick?.(s.id)} aria-hidden="true" />
              ))}
          {/* on the small map the places are buttons: tap one to make it the destination */}
          {onPick &&
            !onHot &&
            places
              .filter((s) => inBox(posOf(s), 0))
              .map((s) => (
                <button key={s.id} type="button" className="lm-hit" style={{ left: sx(posOf(s)), top: sy(posOf(s)) }} onClick={() => onPick(s.id)} aria-label={`${s.type === 'you' ? 'Ram, today' : s.name}. Set as the destination`} aria-pressed={s.id === to} />
              ))}

          {/* places beyond the edge of the map */}
          {(detail || browse) && !driving && (
            <div className="rm-chips">
              {/* a map that is only looked at (no onPick: the panel beside the phone) names what is off its edge, and nothing here is pressed */}
              {offMap.map((s) =>
                onPick ? (
                  <button key={s.id} type="button" className="rm-chip" onMouseEnter={() => onHot?.(s.id)} onMouseLeave={() => onHot?.(null)} onClick={() => onPick(s.id)}>
                    <Icon name="arrow" size={13} w={2.6} />
                    {s.name} · {placeGeo(s.id)?.city}
                  </button>
                ) : (
                  <span key={s.id} className="rm-chip" onMouseEnter={() => onHot?.(s.id)} onMouseLeave={() => onHot?.(null)}>
                    <Icon name="arrow" size={13} w={2.6} />
                    {s.name} · {placeGeo(s.id)?.city}
                  </span>
                ),
              )}
              {!path.ride && !onPick && (
                <span className="rm-chip">
                  <Icon name="arrow" size={13} w={2.6} />
                  {stop(FAR.stop).name} · {FAR.city}
                </span>
              )}
              {!path.ride && onPick && (
                <button type="button" className={`rm-chip ${own.far ? 'on' : ''}`} onClick={() => setMine({ key: viewKey, z: 0, far: !own.far })} aria-pressed={own.far}>
                  <Icon name={own.far ? 'back' : 'arrow'} size={13} w={2.6} />
                  {own.far ? 'Back to Delhi' : `${stop(FAR.stop).name} · ${FAR.city}`}
                </button>
              )}
            </div>
          )}

          {hoverCard && hotXY && onHot && inBox(hotXY, -30) && (
            <div
              className="lm-pop"
              style={{ left: sx(hotXY) < size.w / 2 ? sx(hotXY) + 26 : sx(hotXY) - 26 - 300, top: Math.max(12, Math.min(size.h - 500, sy(hotXY) - 190)) }}
              onMouseEnter={() => onHot(hot)}
              onMouseLeave={() => onHot(null)}
            >
              {hoverCard}
            </div>
          )}
        </>
      )}
      {dock && <div className="lm-dock">{dock}</div>}
      {controls && (
        <div className="lm-ctl">
          <button type="button" onClick={() => zoomBy(0.75)} aria-label="Zoom in">
            <Icon name="plus" size={18} w={2.4} />
          </button>
          <button type="button" onClick={() => zoomBy(-0.75)} aria-label="Zoom out">
            <Icon name="minus" size={18} w={2.4} />
          </button>
          <button type="button" onClick={() => setMine({ key: viewKey, z: 0, far: false })} aria-label="Fit the route" disabled={!own.z && !own.far}>
            <Icon name="fit" size={18} w={2.2} />
          </button>
        </div>
      )}
    </div>
  );
}
