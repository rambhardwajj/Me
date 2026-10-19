'use client';

import { useEffect, useRef } from 'react';
import { GLOBE_POINTS } from '@/lib/globe-points';

/** Land dots as unit vectors, computed once. */
const VECTORS = (() => {
  const v = new Float32Array((GLOBE_POINTS.length / 2) * 3);
  for (let i = 0, j = 0; i < GLOBE_POINTS.length; i += 2, j += 3) {
    const lat = (GLOBE_POINTS[i] * Math.PI) / 180;
    const lon = (GLOBE_POINTS[i + 1] * Math.PI) / 180;
    v[j] = Math.cos(lat) * Math.sin(lon);
    v[j + 1] = Math.sin(lat);
    v[j + 2] = Math.cos(lat) * Math.cos(lon);
  }
  return v;
})();

const COLOR = '103, 198, 255'; // cyan-blue dots

/**
 * A slowly rotating globe made of continent dots, drawn in two layers around `children`:
 * the whole sphere behind them, and the near-side dots faintly in front, like a hologram.
 */
export default function Globe({ children }: { children?: React.ReactNode }) {
  const backRef = useRef<HTMLCanvasElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = backRef.current;
    const fcv = frontRef.current;
    if (!cv || !fcv) return;
    const ctx = cv.getContext('2d');
    const fctx = fcv.getContext('2d');
    if (!ctx || !fctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

    // pointer nudges spin and tilt a little
    let px = 0,
      py = 0;
    const onMove = (e: PointerEvent) => {
      px = (e.clientX / window.innerWidth) * 2 - 1;
      py = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const tilt = 0.32;
    let rot = -1.2, // start facing India (the facing longitude is −rot)
      nx = 0,
      ny = 0,
      raf = 0,
      last = performance.now(),
      visible = true;

    const draw = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      fctx.clearRect(0, 0, fcv.width, fcv.height);
      const R = Math.min(w, h) * 0.48 * dpr;
      const cx = (w * dpr) / 2,
        cy = (h * dpr) / 2;
      const cr = Math.cos(rot + nx),
        sr = Math.sin(rot + nx);
      const t = tilt + ny;
      const ct = Math.cos(t),
        st = Math.sin(t);
      for (let j = 0; j < VECTORS.length; j += 3) {
        const x0 = VECTORS[j],
          y0 = VECTORS[j + 1],
          z0 = VECTORS[j + 2];
        // spin around the vertical axis, then tilt towards the viewer
        const x1 = x0 * cr + z0 * sr;
        const z1 = -x0 * sr + z0 * cr;
        const y2 = y0 * ct - z1 * st;
        const z2 = y0 * st + z1 * ct;
        const front = z2 > 0;
        const a = front ? 0.5 + 0.5 * z2 : 0.08 + 0.1 * (1 + z2);
        const s = (front ? 1.4 + 1.0 * z2 : 0.9) * dpr;
        const X = cx + x1 * R - s / 2,
          Y = cy - y2 * R - s / 2;
        ctx.fillStyle = `rgba(${COLOR}, ${a.toFixed(3)})`;
        ctx.fillRect(X, Y, s, s);
        if (z2 > 0.15) {
          fctx.fillStyle = `rgba(${COLOR}, ${(0.5 * z2).toFixed(3)})`;
          fctx.fillRect(X, Y, s, s);
        }
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      rot -= dt * 0.12; // west to east, like the real Earth
      nx += (px * 0.35 - nx) * 0.04;
      ny += (py * 0.12 - ny) * 0.04;
      draw();
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

    if (reduce) draw();
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div className="globe-stage">
      <canvas ref={backRef} className="globe globe-back" aria-hidden />
      {children}
      <canvas ref={frontRef} className="globe globe-front" aria-hidden />
    </div>
  );
}
