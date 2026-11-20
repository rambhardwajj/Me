'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { ROAD, STOPS, minLabel, minutesAway, stop, type Pt, type StopId } from '@/lib/uber';

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

type Pad = { top?: number; right?: number; bottom?: number; left?: number };

/**
 * The life map, zoomed to the route between two stops.
 * `pad` is the part of the box covered by other things (a sheet, floating buttons), in pixels.
 * With `onPick`, every square pin is a button.
 */
export default function LifeMap({ from, to, pad = {}, onPick, label }: { from: StopId; to: StopId; pad?: Pad; onPick?: (id: StopId) => void; label?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 390, h: 440 });
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const read = () => setSize((s) => (s.w === el.clientWidth && s.h === el.clientHeight ? s : { w: el.clientWidth || 390, h: el.clientHeight || 440 }));
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { points, between, minutes } = routeBetween(from, to);
  const A = stop(from);
  const B = stop(to);

  // zoom so the route fills the free part of the box
  const pt = (pad.top ?? 0) + 46;
  const pr = (pad.right ?? 0) + 44;
  const pb = (pad.bottom ?? 0) + 40;
  const pl = (pad.left ?? 0) + 44;
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const bx = Math.min(...xs);
  const by = Math.min(...ys);
  const bw = Math.max(Math.max(...xs) - bx, 1);
  const bh = Math.max(Math.max(...ys) - by, 1);
  const freeW = Math.max(size.w - pl - pr, 80);
  const freeH = Math.max(size.h - pt - pb, 60);
  const k = Math.min(freeW / bw, freeH / bh, 0.85);
  const vx = bx + bw / 2 - (pl + freeW / 2) / k;
  const vy = by + bh / 2 - (pt + freeH / 2) / k;
  const sx = (p: Pt) => (p.x - vx) * k;
  const sy = (p: Pt) => (p.y - vy) * k;

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
  const inv = 1 / k;
  // name tags sit above their pin (below when there is no room), kept inside the box.
  // "You are here" needs no tag: the blue dot says it.
  const tags = [A, B]
    .filter((s, i, all) => s.type !== 'you' && all.findIndex((o) => o.id === s.id) === i)
    .map((s) => {
      const w = s.name.length * 8.3 + 24;
      const left = Math.max(8, Math.min(size.w - w - 8, sx(s.at) - w / 2));
      const above = sy(s.at) - 50 > (pad.top ?? 0) + 4;
      return { id: s.id, text: s.name, left, top: above ? sy(s.at) - 50 : sy(s.at) + 18, w };
    });

  // the minutes badge sits on the middle of the route, nudged aside if a name tag is already there
  const badge = (() => {
    const hits = (x: number, y: number) => tags.some((t) => x + 35 > t.left - 4 && x - 35 < t.left + t.w + 4 && y + 17 > t.top - 4 && y - 17 < t.top + 36);
    const mx = sx(mid);
    const my = sy(mid);
    const tries = [[0, 0], [0, 40], [0, -40], [-84, 0], [84, 0], [-84, 40], [84, 40], [0, 80]];
    const [dx, dy] = tries.find(([x, y]) => !hits(mx + x, my + y) && mx + x > 40 && mx + x < size.w - 40) ?? [0, 0];
    return { x: mid.x + dx / k, y: mid.y + dy / k };
  })();

  return (
    <div className="lm" ref={box}>
      <svg
        role="img"
        aria-label={label ?? `Map of Ram's life. The route runs from ${A.name} to ${B.name}: ${minutes} minutes, one minute for each month, with ${between.length} ${between.length === 1 ? 'stop' : 'stops'} on the way.`}
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
        {k > 0.17 &&
          CITIES.map((c) => (
          <text key={c.name} className="lm-city" transform={`translate(${c.x} ${c.y}) scale(${inv})`}>
            {c.name}
          </text>
        ))}
        <path className="lm-route" d={d(points)} vectorEffect="non-scaling-stroke" />
        {k > 0.3 &&
          YEARS.map((s) => (
            <g key={s.y} transform={`translate(${s.at.x} ${s.at.y}) scale(${inv})`}>
              <rect className="lm-shield" x={-17} y={-9} width={34} height={18} rx={5} />
              <text className="lm-shield-t" y={3.6} textAnchor="middle">
                {s.y}
              </text>
            </g>
          ))}
        {dots.map((s) => (
          <circle key={s.id} className={`lm-dot ${onRoute.has(s.id) ? 'on' : ''}`} cx={s.at.x} cy={s.at.y} r={(s.id === from || s.id === to ? 6.5 : 4) * inv} vectorEffect="non-scaling-stroke" />
        ))}
        {places.map((s) => (
          <g key={s.id} className={`lm-pin ${onRoute.has(s.id) ? 'on' : ''}`} transform={`translate(${s.at.x} ${s.at.y}) scale(${inv})`}>
            <rect x={-10} y={-10} width={20} height={20} rx={4} />
            <rect className="lm-pin-eye" x={-3} y={-3} width={6} height={6} />
          </g>
        ))}
        <g transform={`translate(${you.at.x} ${you.at.y}) scale(${inv})`}>
          <circle className="lm-you-halo" r={17} />
          <circle className="lm-you" r={8} />
        </g>
        {minutes > 0 && (
          <g transform={`translate(${badge.x} ${badge.y}) scale(${inv})`}>
            <rect className="lm-badge" x={-35} y={-17} width={70} height={34} rx={8} />
            <text className="lm-badge-t" y={5.5} textAnchor="middle">
              {minLabel(minutes)}
            </text>
          </g>
        )}
      </svg>

      {tags.map((t) => (
        <span key={t.id} className="lm-tag" style={{ left: t.left, top: t.top }} aria-hidden="true">
          {t.text}
        </span>
      ))}

      {onPick &&
        places.map((s) => (
          <button key={s.id} type="button" className="lm-hit" style={{ left: sx(s.at), top: sy(s.at) }} onClick={() => onPick(s.id)} aria-label={`${s.name}, ${minLabel(minutesAway(s.when))} away. Set as the destination`} aria-pressed={s.id === to} />
        ))}
    </div>
  );
}
