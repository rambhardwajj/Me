'use client';

import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react';
import type { Map as GlMap } from 'maplibre-gl';
import { GEO_HOME, type GeoPlace, type GeoPoint } from '@/lib/uber-geo';
import { useDriveClock } from './useDriveClock';

/**
 * A ride on a real street map: one leg from "Ram, today" to one real place.
 *
 * The streets are OpenStreetMap data, drawn by MapLibre from OpenFreeMap's tiles (free, no key; their attribution stays on the map).
 * The camera, the route, the pins and the car are worked out here in plain Web Mercator, and the street map is only told where to look.
 * So if the tiles or the library never load, the ride still runs on a plain background, and the car always arrives.
 * The route is a real road route when one is given (see realRoute in lib/uber-geo.ts), and a plain arc otherwise.
 * The events of the place are spaced along it in the order they happened, so the car passes them on the way:
 * their spots on the road are a timeline, not locations. No distance or driving time is shown.
 */

const STYLE = { light: 'https://tiles.openfreemap.org/styles/positron', dark: 'https://tiles.openfreemap.org/styles/dark' };
/** A copy of node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs. It must match the installed version, which package.json pins: copy it again when upgrading. */
const WORKER = '/vendor/maplibre-gl-worker-6.19.0.mjs';
const TILE = 512;
const merc = (p: GeoPoint) => ({ x: (p.lng + 180) / 360, y: (1 - Math.log(Math.tan((p.lat * Math.PI) / 180) + 1 / Math.cos((p.lat * Math.PI) / 180)) / Math.PI) / 2 });
const unmerc = (m: { x: number; y: number }): [number, number] => [m.x * 360 - 180, (Math.atan(Math.sinh(Math.PI * (1 - 2 * m.y))) * 180) / Math.PI];

/** The arc from a to b in Mercator space: a gentle curve, so the line reads as a trip and never as a road. */
function arc(a: GeoPoint, b: GeoPoint, n = 56) {
  const A = merc(a);
  const B = merc(b);
  const mx = (A.x + B.x) / 2 - (B.y - A.y) * 0.16;
  const my = (A.y + B.y) / 2 + (B.x - A.x) * 0.16;
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    return { x: (1 - t) * (1 - t) * A.x + 2 * (1 - t) * t * mx + t * t * B.x, y: (1 - t) * (1 - t) * A.y + 2 * (1 - t) * t * my + t * t * B.y };
  });
}

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

type Props = {
  to: GeoPlace;
  name: string;
  /** The road to follow, as [lng, lat] points. Without it the route is an arc. */
  route?: [number, number][] | null;
  /** What happened at this place, in order. Each is a dot on the way; the car passes them one by one. */
  events?: { id: string; name: string }[];
  /** The car has just passed the event at this index. */
  onPass?: (i: number) => void;
  /** The logo or pictogram on the destination pin. */
  mark?: ReactNode;
  /** Space covered by other things (a sheet, a dock), kept clear of the route. */
  pad?: { top?: number; bottom?: number; left?: number; right?: number };
  drive?: string | null;
  paused?: boolean;
  skip?: string | null;
  onDone?: () => void;
  dock?: ReactNode;
  reducedMotion?: boolean;
};

export default function RealMap({ to, name, route, events = [], onPass, mark, pad = {}, drive = null, paused, skip, onDone, dock, reducedMotion }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const glBox = useRef<HTMLDivElement>(null);
  const map = useRef<GlMap | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [ready, setReady] = useState(false);
  const theme = useTheme(box);
  // long enough to read each event as it goes by
  const p = useDriveClock(drive, reducedMotion ? 0 : Math.min(13000, Math.max(6000, (events.length + 1) * 1900)), { paused, skip, onDone });

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

  // the camera: both ends and the arc between them, inside the space that nothing covers
  const pts = route && route.length > 1 ? route.map(([lng, lat]) => merc({ lng, lat })) : arc(GEO_HOME, to);
  const xs = pts.map((q) => q.x);
  const ys = pts.map((q) => q.y);
  const bx = { lo: Math.min(...xs), hi: Math.max(...xs) };
  const by = { lo: Math.min(...ys), hi: Math.max(...ys) };
  const edge = Math.min(84, size.w * 0.14);
  const free = { l: (pad.left ?? 0) + edge, r: (pad.right ?? 0) + edge, t: (pad.top ?? 0) + edge + 20, b: (pad.bottom ?? 0) + edge };
  const fw = Math.max(40, size.w - free.l - free.r);
  const fh = Math.max(40, size.h - free.t - free.b);
  const zoom = Math.min(14.5, Math.log2(Math.min(fw / ((bx.hi - bx.lo || 1e-6) * TILE), fh / ((by.hi - by.lo || 1e-6) * TILE))));
  const world = TILE * 2 ** zoom;
  // the screen centre, in Mercator, once the route sits in the middle of the free space
  const cx = (bx.lo + bx.hi) / 2 - (free.l + fw / 2 - size.w / 2) / world;
  const cy = (by.lo + by.hi) / 2 - (free.t + fh / 2 - size.h / 2) / world;
  const sx = (q: { x: number }) => (q.x - cx) * world + size.w / 2;
  const sy = (q: { y: number }) => (q.y - cy) * world + size.h / 2;

  // the street map follows that camera; it never moves by itself
  const view = useRef({ center: unmerc({ x: cx, y: cy }), zoom, theme });
  useEffect(() => {
    view.current = { center: unmerc({ x: cx, y: cy }), zoom, theme };
  });
  const sized = size.w > 0 && size.h > 0;
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
        // a tile that fails to load is not worth a console error: the ride runs without it
        m.on('error', () => {});
        map.current = m;
      })
      .catch((e) => console.warn('RealMap: the street map did not start; the ride runs without it.', e));
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

  // the route and the car: positions are measured by distance along the road, so the car keeps one speed
  const run: number[] = [0];
  for (let i = 1; i < pts.length; i++) run.push(run[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  const total = run[run.length - 1] || 1;
  const spot = (frac: number) => {
    const d = Math.max(0, Math.min(1, frac)) * total;
    let i = 1;
    while (i < pts.length - 1 && run[i] < d) i++;
    const t = (d - run[i - 1]) / (run[i] - run[i - 1] || 1);
    return { i, x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * t, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * t };
  };
  const line = (upTo: number) => {
    const end = spot(upTo);
    return [...pts.slice(0, end.i), end].map((q, i) => `${i ? 'L' : 'M'}${sx(q).toFixed(1)} ${sy(q).toFixed(1)}`).join('');
  };
  const here = spot(p);
  const car = { x: sx(here), y: sy(here) };
  // the heading looks a little ahead, so the car turns smoothly through a bend
  const ahead = spot(Math.min(1, p + 0.012));
  const behind = spot(Math.max(0, p - 0.012));
  const turn = (Math.atan2(sy(ahead) - sy(behind), sx(ahead) - sx(behind)) * 180) / Math.PI;
  // the events, evenly spaced on the way, with the place itself at the end
  const marks = events.map((e, i) => ({ ...e, at: (i + 1) / (events.length + 1) }));
  const passed = drive ? marks.filter((m) => m.at <= p + 0.0005).length : marks.length;
  const told = useRef(0);
  const tell = useRef(onPass);
  useEffect(() => {
    tell.current = onPass;
  });
  useEffect(() => {
    if (drive && passed > 0 && passed !== told.current) tell.current?.(passed - 1);
    told.current = passed;
  }, [passed, drive]);
  const driving = !!drive && p < 1;
  const A = pts[0];
  const B = pts[pts.length - 1];
  // the name sits on the side of the pin with more room
  const tagLeft = sx(B) > size.w - 190;

  return (
    <div className={`rm ${ready ? 'ready' : ''}`} ref={box} style={{ '--rm-b': `${pad.bottom ?? 0}px` } as CSSProperties}>
      <div className="rm-gl" ref={glBox} />
      {sized && (
        <>
          <svg className="rm-over" width={size.w} height={size.h} role="img" aria-label={`A street map. The route runs from Ram today, in ${GEO_HOME.city}, to ${name}, in ${to.city}.`}>
            <path className="rm-route-case" d={line(1)} />
            <path className="rm-route" d={line(1)} />
            {drive && p > 0 && <path className="rm-driven" d={line(p)} />}
            <circle className="lm-you-halo" cx={sx(A)} cy={sy(A)} r={20} />
            <circle className="lm-you" cx={sx(A)} cy={sy(A)} r={8} />
            {to.area && <circle className="rm-area" cx={sx(B)} cy={sy(B)} r={30} />}
            {marks.map((m, i) => {
              const q = spot(m.at);
              return (
                <g key={m.id} className={`rm-ev ${i < passed ? 'on' : ''}`} transform={`translate(${sx(q)} ${sy(q)})`}>
                  <circle r={11} />
                  <text y={4}>{i + 1}</text>
                </g>
              );
            })}
            {driving && (
              <g className="lm-carbox" transform={`translate(${car.x} ${car.y})`}>
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
          <span className="rm-here" style={{ left: sx(A), top: sy(A) }} aria-hidden="true">
            Ram, today · {GEO_HOME.city}
          </span>
          {driving && passed > 0 && (
            <span className="rm-ev-tag" style={{ left: sx(spot(marks[passed - 1].at)), top: sy(spot(marks[passed - 1].at)) }} aria-hidden="true">
              {marks[passed - 1].name}
            </span>
          )}
          <span className={`rm-pin ${tagLeft ? 'left' : ''}`} style={{ left: sx(B), top: sy(B) }} aria-hidden="true">
            <i>{mark}</i>
            <span>
              <b>{name}</b>
              <small>{to.area ? `${to.city}, approximate` : to.city}</small>
            </span>
          </span>
        </>
      )}
      {dock && <div className="lm-dock">{dock}</div>}
    </div>
  );
}
