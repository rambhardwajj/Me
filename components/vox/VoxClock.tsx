'use client';

import { useEffect, useRef } from 'react';

type Key = [number, number, number, number, number]; // [p, x%, y%, scale, rotate deg]
type Cam = { el: HTMLElement; keys: Key[]; pan: boolean };
type Beat = { el: HTMLElement; p: number; written: number; cams: Cam[] };

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Camera pose at progress p: hold before the first key and after the last, smoothstep between. */
function poseAt(keys: Key[], p: number): Key {
  if (p <= keys[0][0]) return keys[0];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1],
      b = keys[i];
    if (p <= b[0]) {
      const s = smooth((p - a[0]) / (b[0] - a[0] || 1));
      return [p, a[1] + (b[1] - a[1]) * s, a[2] + (b[2] - a[2]) * s, a[3] + (b[3] - a[3]) * s, a[4] + (b[4] - a[4]) * s];
    }
  }
  return keys[keys.length - 1];
}

/** 0 when the chapter's sticky stage pins, 1 when it lets go. */
function targetOf(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const len = el.offsetHeight - window.innerHeight;
  if (len <= 0) return r.top <= 0 ? 1 : 0;
  return clamp01(-r.top / len);
}

/**
 * The page's one clock. Each [data-chapter] gets --p, eased toward scroll every frame;
 * [data-cam] wrappers inside it follow their keyframes. Texture (ink wobble, grain) steps at 12fps.
 */
export default function VoxClock() {
  const turb = useRef<SVGFETurbulenceElement>(null);
  const grain = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.vox');
    if (!root) return;
    const chapters = Array.from(root.querySelectorAll<HTMLElement>('[data-chapter]'));

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.classList.add('vox-still');
      chapters.forEach((c) => c.style.setProperty('--p', '1'));
      return;
    }
    root.classList.add('vox-live');

    const beats: Beat[] = chapters.map((el) => ({
      el,
      p: targetOf(el), // start where the page already is, no glide on load
      written: -1,
      cams: Array.from(el.querySelectorAll<HTMLElement>('[data-cam]')).map((c) => ({ el: c, keys: JSON.parse(c.dataset.cam || '[]') as Key[], pan: c.hasAttribute('data-cam-pan') })),
    }));

    let raf = 0,
      last = performance.now(),
      lastTexture = 0,
      frame = 0;

    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const follow = 1 - Math.exp(-dt * 9);
      const vh = window.innerHeight;
      const phone = window.innerWidth < 640;

      for (const b of beats) {
        const r = b.el.getBoundingClientRect();
        if (r.bottom < -vh || r.top > 2 * vh) continue; // more than a screen away
        const target = targetOf(b.el);
        b.p += (target - b.p) * follow;
        if (Math.abs(target - b.p) < 0.0003) b.p = target;
        const v = Math.round(b.p * 10000) / 10000;
        if (v === b.written) continue;
        b.written = v;
        b.el.style.setProperty('--p', String(v));
        for (const c of b.cams) {
          if (!c.keys.length) continue;
          const [, x, y, s, rot] = poseAt(c.keys, v);
          // on phones zoom, drift and rotation shrink to ~35%; whole-panel pans do not
          const k = phone ? 0.35 : 1;
          const tx = c.pan ? x : x * k;
          c.el.style.transform = `translate(${tx.toFixed(3)}%, ${(y * k).toFixed(3)}%) scale(${(1 + (s - 1) * k).toFixed(4)}) rotate(${(rot * k).toFixed(3)}deg)`;
        }
      }

      // texture on twos: wobble reseeds every other texture frame, grain jumps every one
      if (now - lastTexture > 1000 / 12) {
        lastTexture = now;
        frame++;
        if (frame % 2 === 0) turb.current?.setAttribute('seed', String(frame % 7));
        if (grain.current) grain.current.style.backgroundPosition = `${(frame * 37) % 240}px ${(frame * 53) % 240}px`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <svg className="vx-defs" width="0" height="0" aria-hidden>
        <filter id="vx-wobble">
          <feTurbulence ref={turb} type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={1} />
          <feDisplacementMap in="SourceGraphic" scale={4} />
        </filter>
      </svg>
      <div className="vx-grain" ref={grain} aria-hidden />
    </>
  );
}
