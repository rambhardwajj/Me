'use client';

import { useEffect, useRef } from 'react';
import { GLOBE_POINTS } from '@/lib/globe-points';

type Vec = [number, number, number];
export type GlobeStop = { lat: number; lon: number };

const toVec = (lat: number, lon: number): Vec => {
  const la = (lat * Math.PI) / 180,
    lo = (lon * Math.PI) / 180;
  return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)];
};

/** Land dots as unit vectors, computed once. */
const VECTORS = (() => {
  const v = new Float32Array((GLOBE_POINTS.length / 2) * 3);
  for (let i = 0, j = 0; i < GLOBE_POINTS.length; i += 2, j += 3) {
    const [x, y, z] = toVec(GLOBE_POINTS[i], GLOBE_POINTS[i + 1]);
    v[j] = x;
    v[j + 1] = y;
    v[j + 2] = z;
  }
  return v;
})();


const DWELL = 3.2; // seconds at each stop (including the flight)
const FLY = 1.4; // seconds to fly to the next stop
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

/** Point along the great circle between a and b, lifted above the surface in the middle. */
function arcPoint(a: Vec, b: Vec, t: number): Vec {
  const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const om = Math.acos(dot);
  let p: Vec;
  if (om < 1e-4) p = a;
  else {
    const s = Math.sin(om),
      k1 = Math.sin((1 - t) * om) / s,
      k2 = Math.sin(t * om) / s;
    p = [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2];
  }
  const lift = 1 + Math.min(0.17, 0.06 + om * 0.1) * Math.sin(Math.PI * t);
  return [p[0] * lift, p[1] * lift, p[2] * lift];
}

/**
 * A globe of continent dots that tours `stops`: it flies to each one, draws a glowing arc from
 * the previous stop and leaves a pulsing marker behind. Drag to spin it; the tour resumes after.
 * Drawn behind `children` (the portrait), so dots never cross the face; a clear layer on top only catches drags.
 */
export default function Globe({ stops = [], onStop, children }: { stops?: GlobeStop[]; onStop?: (i: number) => void; children?: React.ReactNode }) {
  const backRef = useRef<HTMLCanvasElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);
  const cb = useRef(onStop);
  useEffect(() => {
    cb.current = onStop;
  });

  useEffect(() => {
    const cv = backRef.current;
    const fcv = frontRef.current;
    if (!cv || !fcv) return;
    const ctx = cv.getContext('2d');
    const fctx = fcv.getContext('2d');
    if (!ctx || !fctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const S = stops.map((s) => ({ ...s, v: toVec(s.lat, s.lon) }));

    // colours come from the theme tokens ("r, g, b"), re-read whenever the theme flips
    let DOT = '228, 228, 231',
      HOT = '255, 255, 255';
    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      DOT = cs.getPropertyValue('--globe-dot').trim() || DOT;
      HOT = cs.getPropertyValue('--accent-rgb').trim() || HOT;
    };
    readColors();
    const themeWatch = new MutationObserver(() => {
      readColors();
      if (reduce) draw(0);
    });
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    let w = 0,
      h = 0,
      dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = fcv.width = Math.round(w * dpr);
      cv.height = fcv.height = Math.round(h * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);

    // aim so the stop lands in the upper-left of the globe, clear of the portrait in the middle
    const OFFSET_LON = 40,
      OFFSET_LAT = 34;
    const toTarget = (i: number) => ({
      r: -((S[i].lon + OFFSET_LON) * Math.PI) / 180,
      t: Math.max(-0.9, Math.min(0.7, ((S[i].lat - OFFSET_LAT) * Math.PI) / 180)),
    });

    // camera: rot spins around the vertical axis (facing longitude is −rot), tilt leans the pole towards us
    let rot = S.length ? toTarget(0).r : -1.2;
    let tilt = S.length ? toTarget(0).t : 0.32;

    // tour state
    let stop = 0,
      clock = 0,
      stopStart = performance.now(), // tour timing uses the wall clock, so throttled frames don't slow it down
      fromRot = rot,
      fromTilt = tilt,
      dragging = false,
      resumeAt = 0,
      lastX = 0,
      lastY = 0,
      raf = 0,
      last = performance.now(),
      visible = true;
    cb.current?.(0);

    // drag to spin
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      fcv.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      rot += (e.clientX - lastX) * 0.008;
      tilt = Math.max(-0.9, Math.min(0.9, tilt + (e.clientY - lastY) * 0.006));
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      resumeAt = performance.now() + 2500;
      fromRot = rot;
      fromTilt = tilt;
      clock = 0;
      stopStart = resumeAt;
    };
    fcv.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    const project = (v: Vec, R: number, cx: number, cy: number, cr: number, sr: number, ct: number, st: number) => {
      const x1 = v[0] * cr + v[2] * sr;
      const z1 = -v[0] * sr + v[2] * cr;
      const y2 = v[1] * ct - z1 * st;
      const z2 = v[1] * st + z1 * ct;
      return { x: cx + x1 * R, y: cy - y2 * R, z: z2 };
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      fctx.clearRect(0, 0, fcv.width, fcv.height);
      const R = Math.min(w, h) * 0.42 * dpr; // leaves room for arcs lifted above the surface
      const cx = (w * dpr) / 2,
        cy = (h * dpr) / 2;
      const cr = Math.cos(rot),
        sr = Math.sin(rot),
        ct = Math.cos(tilt),
        st = Math.sin(tilt);

      // land dots
      for (let j = 0; j < VECTORS.length; j += 3) {
        const p = project([VECTORS[j], VECTORS[j + 1], VECTORS[j + 2]], R, cx, cy, cr, sr, ct, st);
        const front = p.z > 0;
        const a = front ? 0.45 + 0.5 * p.z : 0.07 + 0.09 * (1 + p.z);
        const s = (front ? 1.3 + 1.0 * p.z : 0.9) * dpr;
        ctx.fillStyle = `rgba(${DOT}, ${a.toFixed(3)})`;
        ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
      }
      if (!S.length) return;

      // arcs between stops visited so far; the newest one draws in as we fly
      const flyT = Math.min(1, clock / FLY);
      ctx.lineCap = 'round';
      for (let i = 1; i <= stop; i++) {
        const a = S[i - 1].v,
          b = S[i].v;
        const end = i === stop ? ease(flyT) : 1;
        const steps = 48;
        ctx.lineWidth = (i === stop ? 2.2 : 1.3) * dpr;
        let prev: { x: number; y: number; z: number } | null = null;
        for (let k = 0; k <= steps * end; k++) {
          const p = project(arcPoint(a, b, k / steps), R, cx, cy, cr, sr, ct, st);
          if (prev && (p.z > -0.05 || prev.z > -0.05)) {
            const alpha = (i === stop ? 0.95 : 0.35) * (p.z > 0 ? 1 : 0.35);
            ctx.strokeStyle = `rgba(${HOT}, ${i === stop ? alpha : alpha * 0.8})`;
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
          prev = p;
        }
      }

      // markers at visited stops, the current one pulsing
      for (let i = 0; i <= stop; i++) {
        const p = project(S[i].v, R, cx, cy, cr, sr, ct, st);
        if (p.z < 0) continue;
        const current = i === stop;
        const r = (current ? 4.2 : 2.6) * dpr;
        ctx.fillStyle = `rgba(${current ? HOT : DOT}, ${current ? 1 : 0.6})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        if (current) {
          const pulse = ((now / 1000) % 1.6) / 1.6;
          ctx.strokeStyle = `rgba(${HOT}, ${0.7 * (1 - pulse)})`;
          ctx.lineWidth = 1.5 * dpr;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r + pulse * 18 * dpr, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!dragging && now > resumeAt && S.length) {
        clock = (now - stopStart) / 1000;
        const target = toTarget(stop);
        const k = ease(Math.min(1, clock / FLY));
        rot = fromRot + wrap(target.r - fromRot) * k;
        tilt = fromTilt + (target.t - fromTilt) * k;
        if (clock >= DWELL) {
          stop = (stop + 1) % S.length;
          clock = 0;
          stopStart = now;
          fromRot = rot;
          fromTilt = tilt;
          cb.current?.(stop);
        }
      } else if (!dragging && !S.length) {
        rot -= dt * 0.12;
      }
      draw(now);
      raf = visible ? requestAnimationFrame(loop) : 0;
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf && !reduce) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    });
    io.observe(cv);

    if (reduce) {
      stop = S.length - 1;
      clock = FLY;
      draw(0);
    } else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      themeWatch.disconnect();
      fcv.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [stops]);

  return (
    <div className="globe-stage">
      <canvas ref={backRef} className="globe globe-back" aria-hidden />
      {children}
      <canvas ref={frontRef} className="globe globe-front" aria-hidden />
    </div>
  );
}
