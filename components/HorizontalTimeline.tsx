'use client';

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { CHAPTERS, JOURNEY, type Moment } from '@/lib/data';
import { EASE } from './Motion';
import { Icon } from './TimelineParts';

/** Degrees between neighbouring milestones on the arc. */
const STEP = 17;
/** Page scroll (px) that moves the dial by one milestone. */
const PER_ITEM = 300;
const N = JOURNEY.length;

type Geo = { w: number; h: number; cx: number; cy: number; r: number; apexY: number };

/** One milestone riding the arc: its angle is (index − progress) × STEP; 0° is the apex. */
function ArcItem({ m, i, progress, geo, onPick }: { m: Moment; i: number; progress: MotionValue<number>; geo: Geo; onPick: (i: number) => void }) {
  const angle = useTransform(progress, (p) => (i - p) * STEP);
  const x = useTransform(angle, (a) => geo.cx + geo.r * Math.sin((a * Math.PI) / 180));
  const y = useTransform(angle, (a) => geo.cy - geo.r * Math.cos((a * Math.PI) / 180));
  const focus = useTransform(angle, (a) => Math.max(0, 1 - Math.abs(a) / STEP)); // 1 at the apex
  const scale = useTransform(focus, (f) => 0.62 + f * 0.58);
  const opacity = useTransform(angle, (a) => (Math.abs(a) > 98 ? 0 : 1 - Math.max(0, Math.abs(a) - STEP) / 110));
  // dates show for the neighbours; the item at the apex is described by the featured card instead
  const labelOpacity = useTransform(angle, (a) => Math.min(1, Math.abs(a) / (STEP * 0.7)) * Math.max(0, 1 - Math.max(0, Math.abs(a) - STEP) / (STEP * 1.4)));
  const glow = useTransform(focus, (f) => `0 0 0 ${1 + f * 2}px color-mix(in srgb, var(--text) ${Math.round(18 + f * 62)}%, transparent), 0 0 ${f * 40}px ${f * 4}px color-mix(in srgb, var(--text) ${Math.round(f * 18)}%, transparent)`);

  return (
    <motion.button className={`arc-item k-${m.kind}`} style={{ x, y, opacity }} onClick={() => onPick(i)} aria-label={`${m.date}: ${m.title}`}>
      <motion.span className="arc-thumb" style={{ scale, boxShadow: glow }}>
        {m.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={m.image} alt="" loading="lazy" />
        ) : (
          <Icon kind={m.kind} size={18} />
        )}
      </motion.span>
      <motion.span className="arc-label" style={{ opacity: labelOpacity }}>
        {m.date}
      </motion.span>
    </motion.button>
  );
}

/**
 * Desktop timeline as a dial: milestones ride a big arc from bottom-left to bottom-right.
 * Scrolling turns the dial; whatever sits at the apex is the featured milestone, shown in full inside the arc.
 */
export default function HorizontalTimeline({ onOpen }: { onOpen: (id: string) => void }) {
  const pin = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const pinTop = useRef(0);
  const [geo, setGeo] = useState<Geo | null>(null);
  const [now, setNow] = useState(0);

  const { scrollY } = useScroll();
  const raw = useTransform(scrollY, (y) => Math.min(N - 1, Math.max(0, (y - pinTop.current) / PER_ITEM)));
  const progress = useSpring(raw, { stiffness: 200, damping: 34, mass: 0.5 });
  const bar = useTransform(progress, (p) => p / (N - 1));
  useMotionValueEvent(progress, 'change', (p) => {
    const i = Math.round(p);
    setNow((x) => (x === i ? x : i));
  });

  useEffect(() => {
    const measure = () => {
      const s = stage.current,
        p = pin.current;
      if (!s || !p) return;
      const w = s.clientWidth,
        h = s.clientHeight;
      const apexY = h * 0.17;
      const r = Math.min(w * 0.46, h * 0.98 - apexY);
      setGeo({ w, h, cx: w / 2, cy: apexY + r, r, apexY });
      pinTop.current = p.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(s).top) || 0);
    };
    measure();
    // content above (fonts, images) can shift the timeline after load, so re-measure on any layout change
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const pick = (i: number) => window.scrollTo({ top: pinTop.current + i * PER_ITEM + 1, behavior: 'smooth' });
  const m = JOURNEY[now];

  return (
    <div className="arc-pin" ref={pin} style={{ height: geo ? geo.h + (N - 1) * PER_ITEM : undefined }}>
      <div className="arc-stage" ref={stage}>
        {geo && (
          <>
            <svg className="arc-svg" width={geo.w} height={geo.h} aria-hidden>
              <defs>
                <linearGradient id="arc-past" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="currentColor" stopOpacity="0" />
                  <stop offset="0.5" stopColor="currentColor" stopOpacity="0.9" />
                  <stop offset="0.5" stopColor="currentColor" stopOpacity="0.14" />
                  <stop offset="1" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={`M ${geo.cx - geo.r} ${geo.cy} A ${geo.r} ${geo.r} 0 0 1 ${geo.cx + geo.r} ${geo.cy}`} fill="none" stroke="url(#arc-past)" strokeWidth="2" />
              <path d={`M ${geo.cx - geo.r + 48} ${geo.cy} A ${geo.r - 48} ${geo.r - 48} 0 0 1 ${geo.cx + geo.r - 48} ${geo.cy}`} fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" strokeDasharray="2 8" />
            </svg>

            <div className="arc-apex" style={{ top: geo.apexY - 78 }}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={m.year} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: EASE }}>
                  <b>{m.year}</b> · {CHAPTERS[m.year]}
                </motion.span>
              </AnimatePresence>
            </div>

            {JOURNEY.map((item, i) => (
              <ArcItem key={item.id} m={item} i={i} progress={progress} geo={geo} onPick={pick} />
            ))}

            <div className="arc-feature" style={{ top: geo.apexY + 128, width: Math.min(760, geo.r * 1.3) }}>
              {/* keyed remount with an entrance only: no exit queue, so the card can never lag behind the dial */}
              <motion.article key={m.id} className={`arc-card k-${m.kind}`} initial={{ opacity: 0, y: 18, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.4, ease: EASE }}>
                <button className="arc-media" onClick={() => m.image && onOpen(m.id)} disabled={!m.image} aria-label={m.image ? `Open photo: ${m.title}` : undefined}>
                  {m.image ? (
                    <>
                      <span className="tl-media-bg" style={{ backgroundImage: `url("${m.image}")` }} aria-hidden />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.image} alt={`${m.title}, ${m.org}`} />
                      <span className="tl-zoom-hint" aria-hidden>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                        </svg>
                      </span>
                    </>
                  ) : (
                    <span className={`tl-ph k-${m.kind}`}>
                      <Icon kind={m.kind} size={28} />
                      <span>Photo: {m.imageHint}</span>
                    </span>
                  )}
                </button>
                <div className="arc-body">
                  <div className="arc-meta">
                    <span className="arc-kind">
                      <i /> {m.kind}
                    </span>
                    <span>{m.date}</span>
                  </div>
                  <h3>{m.title}</h3>
                  <p className="arc-org">{m.org}</p>
                  <p className="arc-text">{m.body}</p>
                  {m.points && (
                    <ul className="arc-points">
                      {m.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  )}
                  {m.stat && (
                    <span className="arc-stat">
                      <Icon kind={m.kind} size={12} /> {m.stat}
                    </span>
                  )}
                </div>
              </motion.article>
            </div>

            <div className="arc-foot">
              <span className="arc-count">
                <b>{String(now + 1).padStart(2, '0')}</b> / {String(N).padStart(2, '0')}
              </span>
              <span className="arc-bar">
                <motion.i style={{ scaleX: bar }} />
              </span>
              <span className="arc-hint">Scroll to turn the dial · click any photo to jump</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
