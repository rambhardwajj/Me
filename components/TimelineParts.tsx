'use client';

import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { Kind, Moment } from '@/lib/data';
import { EASE } from './Motion';

const ICONS: Record<Kind, string> = {
  Education: 'M12 3 1 9l11 6 9-4.9V17h2V9zM5 13.2v4L12 21l7-3.8v-4L12 17z',
  Role: 'M10 4h4a2 2 0 0 1 2 2v1h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4V6a2 2 0 0 1 2-2zm0 3h4V6h-4z',
  Achievement: 'M7 3h10v2h4v3a5 5 0 0 1-4.6 5A5 5 0 0 1 13 15.9V19h4v2H7v-2h4v-3.1A5 5 0 0 1 7.6 13 5 5 0 0 1 3 8V5h4zm10 4v4a3 3 0 0 0 2-3V7zM5 7v1a3 3 0 0 0 2 3V7z',
  Milestone: 'M5 21V4h9l.4 2H20v10h-7l-.4-2H7v7z',
};

export function Icon({ kind, size = 14 }: { kind: Kind; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d={ICONS[kind]} />
    </svg>
  );
}

/** A card's photo (or placeholder). Its wipe-in is driven by the parent card's variants. */
export function Media({ m, fromLeft, onOpen }: { m: Moment; fromLeft: boolean; onOpen?: () => void }) {
  return (
    <motion.div
      className={`tl-media ${m.fullImage ? 'full' : ''}`}
      // driven by the parent card: a fully clipped element never registers as in view
      variants={{ hidden: { clipPath: fromLeft ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)' }, shown: { clipPath: 'inset(0 0% 0 0%)' } }}
      transition={{ duration: 1, ease: EASE, delay: 0.15 }}
    >
      {m.image ? (
        <button className="tl-zoom" onClick={onOpen} aria-label={`Open photo: ${m.title}`}>
          {m.fullImage && <span className="tl-media-bg" style={{ backgroundImage: `url("${m.image}")` }} aria-hidden />}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={m.image} alt={`${m.title}, ${m.org}`} loading="lazy" />
          <span className="tl-zoom-hint" aria-hidden>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
          </span>
        </button>
      ) : (
        <div className={`tl-ph k-${m.kind}`}>
          <Icon kind={m.kind} size={28} />
          <span>Photo: {m.imageHint}</span>
        </div>
      )}
    </motion.div>
  );
}

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * Pins a stage to one screen and turns page scroll into movement of the track inside it,
 * along `axis`. `read` is where the reading line sits in the stage (0..1); every [data-step]
 * inside the track gets `.on` once it has crossed that line.
 */
export function usePinnedTrack(axis: 'x' | 'y', read: number, onCurrent?: (index: number) => void) {
  const pin = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const geo = useRef({ pinTop: 0, stage: 0, track: 0, max: 0 });
  const [pinHeight, setPinHeight] = useState<number>();
  const current = useRef({ index: -1, cb: onCurrent });
  useEffect(() => {
    current.current.cb = onCurrent;
  });

  const { scrollY } = useScroll();
  const raw = useTransform(scrollY, (y) => Math.min(geo.current.max, Math.max(0, y - geo.current.pinTop)));
  const shift = useSpring(raw, { stiffness: 260, damping: 40, mass: 0.4 });
  const offset: MotionValue<number> = useTransform(shift, (v) => -v);
  const fill = useTransform(shift, (v) => (geo.current.track ? Math.min(1, (v + geo.current.stage * read) / geo.current.track) : 0));

  useEffect(() => {
    const measure = () => {
      const p = pin.current,
        s = stage.current,
        t = track.current;
      if (!p || !s || !t) return;
      const stageSize = axis === 'y' ? s.clientHeight : s.clientWidth;
      const trackSize = axis === 'y' ? t.offsetHeight : t.scrollWidth;
      let max: number;
      if (axis === 'y') {
        max = Math.max(0, trackSize - stageSize * read + 24);
      } else {
        // stop once the last step's centre reaches the reading line
        const steps = t.querySelectorAll<HTMLElement>('[data-step]');
        const last = steps[steps.length - 1];
        max = last ? Math.max(0, last.offsetLeft + last.offsetWidth / 2 - stageSize * read) : 0;
      }
      const stickyTop = parseFloat(getComputedStyle(s).top) || 0;
      geo.current = { pinTop: p.getBoundingClientRect().top + window.scrollY - stickyTop, stage: stageSize, track: trackSize, max };
      setPinHeight(s.clientHeight + max);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    ro.observe(document.body); // content above can shift the pin after load
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [axis, read]);

  // light up every step the reading line has passed
  useEffect(() => {
    const steps = Array.from(track.current?.querySelectorAll<HTMLElement>('[data-step]') ?? []);
    let raf = 0;
    const update = () => {
      raf = 0;
      const box = stage.current?.getBoundingClientRect();
      if (!box) return;
      if (axis === 'y') {
        const line = box.top + box.height * read;
        steps.forEach((el) => el.classList.toggle('on', el.getBoundingClientRect().top + 24 < line));
      } else {
        const line = box.left + box.width * read + 1;
        steps.forEach((el) => {
          const r = el.getBoundingClientRect();
          el.classList.toggle('on', r.left + r.width / 2 <= line);
        });
      }
      // the last step past the line is the one in the spotlight
      let now = -1;
      steps.forEach((el, i) => {
        if (el.classList.contains('on')) now = i;
      });
      now = Math.max(0, now);
      steps.forEach((el, i) => el.classList.toggle('now', i === now));
      if (now !== current.current.index) {
        current.current.index = now;
        current.current.cb?.(now);
      }
    };
    const onMove = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    const stop = shift.on('change', onMove);
    window.addEventListener('scroll', onMove, { passive: true });
    window.addEventListener('resize', onMove);
    return () => {
      cancelAnimationFrame(raf);
      stop();
      window.removeEventListener('scroll', onMove);
      window.removeEventListener('resize', onMove);
    };
  }, [shift, axis, read]);

  return { pin, stage, track, pinHeight, offset, fill };
}
