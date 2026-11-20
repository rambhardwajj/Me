'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AREA_NAMES, ROAD, ROAD_NAMES, STOPS, minLabel, minutesAway, monthLabel, stop, type Pt, type StopId } from '@/lib/uber';
import { stopPhoto } from '@/lib/uber-photos';
import { Icon } from './icons';

/* ---------------------------------------------------------------- geometry: every stop sits on one road */

const SEGS = ROAD.slice(1).map((b, i) => ({ a: ROAD[i], b, len: Math.hypot(b.x - ROAD[i].x, b.y - ROAD[i].y) }));
const STARTS = SEGS.reduce<number[]>((acc, s, i) => [...acc, i ? acc[i - 1] + SEGS[i - 1].len : 0], []);

/** How far along the road a point is, measured from St. Dominic's School. */
export function along(p: Pt): number {
  let best = 0;
  let bestGap = Infinity;
  SEGS.forEach((s, i) => {
    const t = Math.max(0, Math.min(1, ((p.x - s.a.x) * (s.b.x - s.a.x) + (p.y - s.a.y) * (s.b.y - s.a.y)) / (s.len * s.len)));
    const gap = Math.hypot(p.x - (s.a.x + (s.b.x - s.a.x) * t), p.y - (s.a.y + (s.b.y - s.a.y) * t));
    if (gap < bestGap - 0.01) {
      bestGap = gap;
      best = STARTS[i] + t * s.len;
    }
  });
  return best;
}

function pointAt(d: number): Pt {
  const i = Math.max(0, STARTS.findLastIndex((s) => s <= d));
  const s = SEGS[i];
  const t = Math.min(1, (d - STARTS[i]) / s.len);
  return { x: s.a.x + (s.b.x - s.a.x) * t, y: s.a.y + (s.b.y - s.a.y) * t };
}

/** The piece of road between two stops, the stops passed on the way (in travel order) and the minutes between the ends. */
export function routeBetween(from: StopId, to: StopId) {
  const a = along(stop(from).at);
  const b = along(stop(to).at);
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  const corners = ROAD.filter((_, i) => i > 0 && STARTS[i - 1] + SEGS[i - 1].len > lo + 0.5 && STARTS[i - 1] + SEGS[i - 1].len < hi - 0.5);
  const points = [pointAt(lo), ...corners, pointAt(hi)];
  const between = STOPS.filter((s) => s.id !== from && s.id !== to && along(s.at) > lo && along(s.at) < hi);
  if (a > b) {
    points.reverse();
    between.reverse();
  }
  const minutes = Math.abs(minutesAway(stop(from).when) - minutesAway(stop(to).when));
  return { points, between, minutes };
}

const d = (pts: Pt[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${Math.round(p.x)} ${Math.round(p.y)}`).join(' ');
const ROAD_D = d(ROAD);

/* ---------------------------------------------------------------- the fixed city under the road */

const PARKS = [
  [380, 470, 250, 180],
  [960, 400, 280, 170],
  [1360, 690, 200, 210],
  [160, 760, 130, 300],
  [1000, 60, 300, 170],
  [1700, 120, 160, 380],
  [520, 860, 300, 240],
];
const CITIES = [
  { name: 'Mathura', x: 70, y: 400 },
  { name: 'Delhi', x: 800, y: 150 },
  { name: 'Noida', x: 640, y: 935 },
  { name: 'Gurugram', x: 1400, y: 440 },
];
const YEARS = [
  { y: '2020', at: { x: 583, y: 220 } },
  { y: '2021', at: { x: 449, y: 430 } },
  { y: '2022', at: { x: 518, y: 700 } },
  { y: '2023', at: { x: 900, y: 504 } },
  { y: '2025', at: { x: 1591, y: 620 } },
  { y: '2026', at: { x: 1411, y: 960 } },
];

/* ---------------------------------------------------------------- the camera */

/** Where the map is looking: the map point at the middle of the free area, and pixels per map unit. */
type View = { cx: number; cy: number; k: number };

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Flies the camera to a new view: it pulls back a little in the middle of the move, like a map app.
 * The end state never depends on animation frames arriving: a timer lands the view if they stop.
 */
function useFlight(target: View, ms: number): View {
  const [view, setView] = useState(target);
  const at = useRef(target);
  const { cx, cy, k } = target;
  useEffect(() => {
    const end = { cx, cy, k };
    const start = at.current;
    const land = () => {
      at.current = end;
      setView(end);
    };
    if (ms <= 0 || (start.cx === cx && start.cy === cy && start.k === k)) {
      const id = window.setTimeout(land, 0);
      return () => window.clearTimeout(id);
    }
    // the farther the move, the more the camera pulls back
    const far = Math.min(1, Math.hypot(cx - start.cx, cy - start.cy) / 900 + Math.abs(Math.log(k / start.k)));
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / ms);
      const e = ease(t);
      const next = {
        cx: start.cx + (cx - start.cx) * e,
        cy: start.cy + (cy - start.cy) * e,
        k: Math.exp(Math.log(start.k) + (Math.log(k) - Math.log(start.k)) * e) * (1 - 0.22 * far * Math.sin(Math.PI * t)),
      };
      at.current = next;
      setView(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const safety = window.setTimeout(() => {
      cancelAnimationFrame(raf);
      land();
    }, ms + 300);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(safety);
    };
  }, [cx, cy, k, ms]);
  return view;
}

type Pad = { top?: number; right?: number; bottom?: number; left?: number };

type Props = {
  from: StopId;
  to: StopId;
  /** The part of the box covered by other things (a sheet, floating buttons), in pixels. */
  pad?: Pad;
  /** With this, every square pin in view is a button. */
  onPick?: (id: StopId) => void;
  /** The big map beside the phone: every place is named, with its minutes, plus road and area names. */
  detail?: boolean;
  /** Zoom in, zoom out and fit buttons, and dragging to move the map. */
  controls?: boolean;
  /** The stop the pointer is on. With `onHot`, stops show a photo card when pointed at. */
  hot?: StopId | null;
  onHot?: (id: StopId | null) => void;
  /** 'all' keeps the whole road in view whatever the route; 'route' zooms to the route. */
  fit?: 'route' | 'all';
  /** Hide the minutes badge (when the map is only being browsed). */
  noBadge?: boolean;
  /**
   * Start a drive: a car runs the route from its first stop to its last, and each stop's photo pops up as it passes.
   * Change the string to drive again; null for no drive.
   */
  drive?: string | null;
  onPass?: (id: StopId) => void;
  onDone?: () => void;
  /** Pulse the destination, while a ride is being found. */
  searching?: boolean;
  reducedMotion?: boolean;
};

/**
 * The life map. It flies to the route between two stops, draws the route, and can be zoomed and dragged.
 */
export default function LifeMap({ from, to, pad = {}, onPick, detail, controls, hot, onHot, fit = 'route', noBadge, drive = null, onPass, onDone, searching, reducedMotion }: Props) {
  const box = useRef<HTMLDivElement>(null);
  // `n` counts measurements: until the box has been measured once, the camera does not animate
  const [size, setSize] = useState({ w: 390, h: 440, n: 0 });
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const read = () => setSize((s) => (s.n && s.w === el.clientWidth && s.h === el.clientHeight ? s : { w: el.clientWidth || 390, h: el.clientHeight || 440, n: s.n + 1 }));
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { points, between, minutes } = routeBetween(from, to);
  const A = stop(from);
  const B = stop(to);

  // the view that fits the route into the free part of the box
  const pt = (pad.top ?? 0) + (detail ? 60 : 46);
  const pr = (pad.right ?? 0) + (detail ? 56 : 44);
  const pb = (pad.bottom ?? 0) + (detail ? 70 : 40);
  const pl = (pad.left ?? 0) + (detail ? 76 : 44);
  const fitPts = fit === 'all' ? ROAD : points;
  const xs = fitPts.map((p) => p.x);
  const ys = fitPts.map((p) => p.y);
  const bx = Math.min(...xs);
  const by = Math.min(...ys);
  const bw = Math.max(Math.max(...xs) - bx, 1);
  const bh = Math.max(Math.max(...ys) - by, 1);
  const freeW = Math.max(size.w - pl - pr, 80);
  const freeH = Math.max(size.h - pt - pb, 60);
  const fitK = Math.min(freeW / bw, freeH / bh, detail ? 1.1 : 0.85);

  // the visitor's own zoom and drag, forgotten when the route changes
  const routeKey = `${from}>${to}`;
  const [own, setOwn] = useState({ key: routeKey, z: 1, dx: 0, dy: 0 });
  const [dragging, setDragging] = useState(false);
  const mine = own.key === routeKey ? own : { key: routeKey, z: 1, dx: 0, dy: 0 };
  const clampPan = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
  const target: View = {
    cx: clampPan(bx + bw / 2 + mine.dx, 0, 1920),
    cy: clampPan(by + bh / 2 + mine.dy, 0, 1200),
    k: fitK * mine.z,
  };

  /* the drive: a car runs the route, and each stop's photo pops up as it passes */
  const aFrom = along(A.at);
  const aTo = along(B.at);
  const span = Math.abs(aTo - aFrom) || 1;
  const order = [A, ...between, B];
  const fracOf = (p: Pt) => Math.abs(along(p) - aFrom) / span;
  const [run, setRun] = useState({ key: '', p: 1 });
  const p = drive ? (run.key === drive ? run.p : 0) : 1;
  const driving = !!drive && p < 1;
  const calls = useRef({ onPass, onDone });
  useEffect(() => {
    calls.current = { onPass, onDone };
  });
  useEffect(() => {
    if (!drive) return;
    const r = routeBetween(from, to);
    const a0 = along(stop(from).at);
    const len = Math.abs(along(stop(to).at) - a0) || 1;
    const stops = [stop(from), ...r.between, stop(to)];
    const fr = stops.map((s) => Math.abs(along(s.at) - a0) / len);
    const ms = reducedMotion ? 0 : Math.max(5000, Math.min(16000, stops.length * 1100));
    let last = -1;
    const mark = (at: number) => {
      let i = -1;
      fr.forEach((f, j) => {
        if (f <= at + 0.001) i = j;
      });
      if (i !== last) {
        last = i;
        if (i >= 0) calls.current.onPass?.(stops[i].id);
      }
    };
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setRun({ key: drive, p: 1 });
      mark(1);
      calls.current.onDone?.();
    };
    if (!ms) {
      const id = window.setTimeout(finish, 0);
      return () => window.clearTimeout(id);
    }
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const at = Math.min(1, (now - t0) / ms);
      if (at >= 1) return finish();
      setRun({ key: drive, p: at });
      mark(at);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // the drive always arrives, even if animation frames stop coming
    const safety = window.setTimeout(() => {
      cancelAnimationFrame(raf);
      finish();
    }, ms + 500);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(safety);
    };
  }, [drive, from, to, reducedMotion]);
  const car = pointAt(aFrom + (aTo - aFrom) * p);

  const flown = useFlight(target, reducedMotion || dragging || size.n < 2 ? 0 : mine.z !== 1 || mine.dx || mine.dy ? 320 : 900);
  // while driving, the camera eases in on the car, follows it, and eases back out at the end
  const soft = (t: number) => t * t * (3 - 2 * t);
  const near = driving ? soft(Math.min(p / 0.07, 1)) * (1 - soft(Math.max(0, (p - 0.93) / 0.07))) : 0;
  const followK = Math.max(target.k, detail ? 0.82 : 0.7);
  const view: View = driving ? { cx: target.cx + (car.x - target.cx) * near, cy: target.cy + (car.y - target.cy) * near, k: target.k * Math.pow(followK / target.k, near) } : flown;
  const k = view.k;
  const vx = view.cx - (pl + freeW / 2) / k;
  const vy = view.cy - (pt + freeH / 2) / k;
  const sx = (p: Pt) => (p.x - vx) * k;
  const sy = (p: Pt) => (p.y - vy) * k;
  const inv = 1 / k;

  const zoom = (f: number) => setOwn({ ...mine, z: Math.max(0.5, Math.min(5, mine.z * f)) });
  const refit = () => setOwn({ key: routeKey, z: 1, dx: 0, dy: 0 });
  const grab = useRef<{ x: number; y: number; dx: number; dy: number } | null>(null);
  const onDown = (e: React.PointerEvent) => {
    if (!controls || !detail || (e.target as HTMLElement).closest('button')) return;
    grab.current = { x: e.clientX, y: e.clientY, dx: mine.dx, dy: mine.dy };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };
  const onMove = (e: React.PointerEvent) => {
    const g = grab.current;
    if (!g) return;
    // the box may itself be scaled (the page scales its canvas), so measure the real pixel size
    const scale = (box.current?.getBoundingClientRect().width ?? size.w) / size.w || 1;
    setOwn({ ...mine, dx: g.dx - (e.clientX - g.x) / scale / k, dy: g.dy - (e.clientY - g.y) / scale / k });
  };
  const onUp = () => {
    grab.current = null;
    setDragging(false);
  };

  // the minutes badge sits on the middle of the route
  const lens = points.slice(1).map((p, i) => Math.hypot(p.x - points[i].x, p.y - points[i].y));
  let half = lens.reduce((s, l) => s + l, 0) / 2;
  let mid = points[0];
  for (let i = 0; i < lens.length; i++) {
    if (half <= lens[i]) {
      const t = lens[i] ? half / lens[i] : 0;
      mid = { x: points[i].x + (points[i + 1].x - points[i].x) * t, y: points[i].y + (points[i + 1].y - points[i].y) * t };
      break;
    }
    half -= lens[i];
  }

  const onRoute = new Set<StopId>([from, to, ...between.map((s) => s.id)]);
  const places = STOPS.filter((s) => s.type === 'place');
  const dots = STOPS.filter((s) => s.type === 'dot');
  const you = stop('you');
  const inBox = (p: Pt, m = 20) => sx(p) > m && sx(p) < size.w - m && sy(p) > m && sy(p) < size.h - m;

  // name tags: on the small map only the two ends, above their pin; on the big map every place, at its own anchor
  const tags = (detail ? places : [A, B].filter((s, i, all) => s.type === 'place' && all.findIndex((o) => o.id === s.id) === i)).map((s) => {
    const w = detail ? s.name.length * 7.3 + 20 : s.name.length * 8.3 + 24;
    if (detail && s.tag) return { s, w, left: sx(s.tag) - w / 2, top: sy(s.tag) - 13 };
    const left = Math.max(8, Math.min(size.w - w - 8, sx(s.at) - w / 2));
    const above = sy(s.at) - 50 > (pad.top ?? 0) + 4;
    return { s, w, left, top: above ? sy(s.at) - 50 : sy(s.at) + 18 };
  });

  // the minutes badge is nudged aside if a name tag is already there
  const badge = (() => {
    const hits = (x: number, y: number) => tags.some((t) => x + 35 > t.left - 4 && x - 35 < t.left + t.w + 4 && y + 17 > t.top - 4 && y - 17 < t.top + 36);
    const mx = sx(mid);
    const my = sy(mid);
    const tries = [[0, 0], [0, 40], [0, -40], [-84, 0], [84, 0], [-84, 40], [84, 40], [0, 80]];
    const [ox, oy] = tries.find(([x, y]) => !hits(mx + x, my + y) && mx + x > 40 && mx + x < size.w - 40) ?? [0, 0];
    return { x: mid.x + ox / k, y: mid.y + oy / k };
  })();

  // the photo card for the stop the pointer is on
  const hotStop = hot && onHot ? STOPS.find((s) => s.id === hot) : undefined;
  const card = hotStop && inBox(hotStop.at, 0) ? { s: hotStop, photo: stopPhoto(hotStop.id), x: sx(hotStop.at), y: sy(hotStop.at) } : null;
  const cardLeft = card ? Math.max(8, Math.min(size.w - 228, card.x - 110)) : 0;
  const cardBelow = card ? card.y < 250 : false;

  return (
    <div className={`lm ${detail ? 'detail' : ''} ${controls && detail ? 'movable' : ''} ${dragging ? 'dragging' : ''}`} ref={box} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
      <svg
        role="img"
        aria-label={`Map of Ram's life. The route runs from ${A.name} to ${B.name}: ${minutes} minutes, one minute for each month, with ${between.length} ${between.length === 1 ? 'stop' : 'stops'} on the way.`}
        width={size.w}
        height={size.h}
        viewBox={`${vx} ${vy} ${size.w / k} ${size.h / k}`}
      >
        <rect className="lm-land" x={-4000} y={-4000} width={10000} height={10000} />
        {PARKS.map(([x, y, w, h]) => (
          <rect key={`${x}-${y}`} className="lm-park" x={x} y={y} width={w} height={h} rx={26} />
        ))}
        <path className="lm-water" d="M-40 60C200 20 420 110 520 40S860-40 980 20" strokeWidth={64} />
        <path className="lm-water" d="M-40 420C60 520 40 700 100 820S60 1100 140 1240" strokeWidth={54} />
        <path className="lm-street" d="M40 -4000V5000M278 -4000V5000M516 -4000V5000M772 -4000V5000M956 -4000V5000M1048 -4000V5000M1194 -4000V5000M1414 -4000V5000M1524 -4000V5000M1780 -4000V5000M1890 -4000V5000M-4000 50H6000M-4000 168H6000M-4000 268H6000M-4000 906H6000M-4000 1024H6000M-4000 1142H6000" strokeWidth={7} />
        <path className="lm-street" d="M-20 1120L760 760M1180 -20L1940 520M420 1220L1040 1000M1460 1220L1940 880" strokeWidth={12} />
        <path className="lm-casing" d={ROAD_D} />
        <path className="lm-road" d={ROAD_D} />
        {detail &&
          k > 0.6 &&
          ROAD_NAMES.map((r) => (
            <text key={r.name} className="lm-roadname" textAnchor="middle" transform={`translate(${r.x} ${r.y}) rotate(${r.turn ?? 0}) scale(${inv})`}>
              {r.name}
            </text>
          ))}
        {detail &&
          k > 0.6 &&
          AREA_NAMES.map((a) => (
            <text key={a.name} className="lm-area" transform={`translate(${a.x} ${a.y}) scale(${inv})`}>
              {a.name}
            </text>
          ))}
        {k > 0.17 &&
          CITIES.map((c) => (
            <text key={c.name} className="lm-city" transform={`translate(${c.x} ${c.y}) scale(${inv})`}>
              {c.name}
            </text>
          ))}
        {detail && places.map((s) => s.tag && <path key={s.id} className="lm-leader" d={`M${s.at.x} ${s.at.y}L${s.tag.x} ${s.tag.y}`} strokeWidth={2.5 * inv} />)}
        {/* the route draws itself each time it changes */}
        <path key={routeKey} className="lm-route" d={d(points)} pathLength={1} strokeWidth={(detail ? 6 : 5) * inv} />
        {drive && <path className="lm-driven" d={d(points)} pathLength={1} strokeDasharray={`${p} 1`} strokeWidth={(detail ? 6 : 5) * inv} />}
        {k > (detail ? 0.5 : 0.3) &&
          YEARS.map((s) => (
            <g key={s.y} transform={`translate(${s.at.x} ${s.at.y}) scale(${inv})`}>
              <rect className="lm-shield" x={-17} y={-9} width={34} height={18} rx={5} />
              <text className="lm-shield-t" y={3.6} textAnchor="middle">
                {s.y}
              </text>
            </g>
          ))}
        {dots.map((s) => (
          <circle key={s.id} className={`lm-dot ${onRoute.has(s.id) ? 'on' : ''} ${hot === s.id ? 'hot' : ''}`} cx={s.at.x} cy={s.at.y} r={(hot === s.id ? 8 : s.id === from || s.id === to ? 6.5 : detail ? 5 : 4) * inv} strokeWidth={(onRoute.has(s.id) ? 2.5 : 2) * inv} />
        ))}
        {places.map((s) => (
          <g key={s.id} className={`lm-pin ${onRoute.has(s.id) ? 'on' : ''} ${hot === s.id ? 'hot' : ''}`} transform={`translate(${s.at.x} ${s.at.y}) scale(${inv * (hot === s.id ? 1.25 : 1)})`}>
            <rect x={-10} y={-10} width={20} height={20} rx={4} />
            <rect className="lm-pin-eye" x={-3} y={-3} width={6} height={6} />
          </g>
        ))}
        {searching && B.type !== 'you' && (
          <g transform={`translate(${B.at.x} ${B.at.y}) scale(${inv})`}>
            <circle className="lm-ping" r={14} />
            <circle className="lm-ping late" r={14} />
          </g>
        )}
        <g transform={`translate(${you.at.x} ${you.at.y}) scale(${inv})`}>
          <circle className="lm-you-halo" r={17} />
          <circle className="lm-you" r={8} />
        </g>
        {driving && (
          <g transform={`translate(${car.x} ${car.y}) scale(${inv})`}>
            <circle className="lm-car-glow" r={22} />
            <rect className="lm-car" x={-15} y={-15} width={30} height={30} rx={9} />
            <path className="lm-car-ico" d="M-8.500 1.500h17v4a1.200 1.200 0 0 1-1.200 1.200h-14.600a1.200 1.200 0 0 1-1.200-1.200zM-6 -4h11l2.500 5.500h-15.500z" />
            <circle className="lm-car-wheel" cx={-5} cy={6.500} r={2.200} />
            <circle className="lm-car-wheel" cx={5} cy={6.500} r={2.200} />
          </g>
        )}
        {minutes > 0 && !noBadge && !driving && (
          <g transform={`translate(${badge.x} ${badge.y}) scale(${inv})`}>
            <rect className="lm-badge" x={-35} y={-17} width={70} height={34} rx={8} />
            <text className="lm-badge-t" y={5.5} textAnchor="middle">
              {minLabel(minutes)}
            </text>
          </g>
        )}
      </svg>

      {tags.map(({ s, left, top }) => (
        <span key={s.id} className={`lm-tag ${onRoute.has(s.id) ? '' : 'off'} ${hot === s.id ? 'hot' : ''}`} style={{ left, top }} aria-hidden="true">
          {s.name}
        </span>
      ))}
      {detail && inBox(you.at, 0) && (
        <span className="lm-here" style={{ left: sx(you.at), top: sy(you.at) }} aria-hidden="true">
          You are here
        </span>
      )}

      {/* photos of the stops the car has passed; once it has arrived, only the places keep theirs */}
      {drive &&
        order
          .filter((s) => s.type !== 'you' && fracOf(s.at) <= p + 0.001 && (driving || s.type === 'place' || s.id === from || s.id === to) && inBox(s.at, 0))
          .map((s) => {
            const photo = stopPhoto(s.id);
            return (
              photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={s.id} className={`lm-thumb ${photo.contain ? 'contain' : ''}`} style={{ left: sx(s.at), top: sy(s.at) }} src={photo.src} alt="" onError={(e) => (e.currentTarget.style.display = 'none')} />
              )
            );
          })}

      {/* pointing at a stop shows its photo; these are for the pointer only, the lists reach every stop by keyboard */}
      {onHot &&
        STOPS.filter((s) => s.type !== 'you' && inBox(s.at, 6)).map((s) => (
          <span key={s.id} className={`lm-spot ${onPick ? 'pick' : ''}`} style={{ left: sx(s.at), top: sy(s.at) }} onMouseEnter={() => onHot(s.id)} onMouseLeave={() => onHot(null)} onClick={() => onPick?.(s.id)} aria-hidden="true" />
        ))}
      {onHot &&
        detail &&
        tags.map(({ s, left, top, w }) => (
          <span key={s.id} className={`lm-spot tag ${onPick ? 'pick' : ''}`} style={{ left, top, width: w }} onMouseEnter={() => onHot(s.id)} onMouseLeave={() => onHot(null)} onClick={() => onPick?.(s.id)} aria-hidden="true" />
        ))}

      {/* pins outside the box are not buttons: the From and To lists reach every place */}
      {onPick &&
        !onHot &&
        places
          .filter((s) => inBox(s.at))
          .map((s) => (
            <button key={s.id} type="button" className="lm-hit" style={{ left: sx(s.at), top: sy(s.at) }} onClick={() => onPick(s.id)} aria-label={`${s.name}, ${minLabel(minutesAway(s.when))} away. Set as the destination`} aria-pressed={s.id === to} />
          ))}

      {card && (
        <div className={`lm-card ${cardBelow ? 'below' : ''}`} style={{ left: cardLeft, top: card.y }} aria-hidden="true">
          {card.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className={card.photo.contain ? 'contain' : ''} src={card.photo.src} alt="" loading="lazy" onError={(e) => (e.currentTarget.style.display = 'none')} />
          )}
          <b>{card.s.name}</b>
          <small>
            {card.s.monthAssumed ? card.s.when.slice(0, 4) : monthLabel(card.s.when)} · {minLabel(minutesAway(card.s.when))} away
          </small>
        </div>
      )}

      {controls && (
        <div className="lm-ctl">
          <button type="button" onClick={() => zoom(1.5)} aria-label="Zoom in">
            <Icon name="plus" size={18} w={2.4} />
          </button>
          <button type="button" onClick={() => zoom(1 / 1.5)} aria-label="Zoom out">
            <Icon name="minus" size={18} w={2.4} />
          </button>
          <button type="button" onClick={refit} aria-label="Fit the route" disabled={mine.z === 1 && !mine.dx && !mine.dy}>
            <Icon name="fit" size={18} w={2.2} />
          </button>
        </div>
      )}
    </div>
  );
}
