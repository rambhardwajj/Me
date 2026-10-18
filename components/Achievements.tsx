'use client';

import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { useState } from 'react';
import { ACHIEVEMENTS, JOURNEY, type AchievementTag } from '@/lib/data';
import { EASE } from './Motion';

const TAGS: ('All' | AchievementTag)[] = ['All', 'Product', 'Tech', 'Leadership', 'Stage', 'Academics'];
const photoOf = (id?: string) => (id ? JOURNEY.find((m) => m.id === id)?.image : undefined);

/**
 * Every key achievement as a ledger of big rows. Rows draw in as you scroll;
 * on desktop, hovering a row floats its photo beside the cursor.
 */
export default function Achievements() {
  const [tag, setTag] = useState<(typeof TAGS)[number]>('All');
  const [hover, setHover] = useState<number | null>(null);
  const rows = ACHIEVEMENTS.map((a, i) => ({ ...a, i, src: photoOf(a.photo) })).filter((a) => tag === 'All' || a.tag === tag);

  // floating preview follows the cursor, softly
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 300, damping: 30, mass: 0.5 });
  const y = useSpring(my, { stiffness: 300, damping: 30, mass: 0.5 });
  const preview = hover !== null ? ACHIEVEMENTS[hover] : null;
  const previewSrc = preview ? photoOf(preview.photo) : undefined;

  return (
    <div className="ach">
      <div className="ach-head">
        <div>
          <span className="label">Achievements</span>
          <h3>
            <b>{ACHIEVEMENTS.length}</b> things I’m proud of
          </h3>
        </div>
        <div className="ach-tabs" role="tablist" aria-label="Filter achievements">
          {TAGS.map((t) => (
            <button key={t} role="tab" aria-selected={tag === t} className={tag === t ? 'on' : ''} onClick={() => setTag(t)}>
              {tag === t && <motion.span layoutId="ach-tab" className="ach-tab-bg" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <span>{t}</span>
            </button>
          ))}
        </div>
      </div>

      <div
        className="ach-list"
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set(e.clientX - r.left);
          my.set(e.clientY - r.top);
        }}
        onPointerLeave={() => setHover(null)}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {rows.map((a, n) => (
            <motion.div
              key={a.title}
              layout
              className={`ach-row ${hover === a.i ? 'on' : ''}`}
              onPointerEnter={() => setHover(a.i)}
              initial="hidden"
              whileInView="shown"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ layout: { duration: 0.45, ease: EASE } }}
            >
              <motion.i className="ach-line" variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1 } }} transition={{ duration: 0.9, ease: EASE, delay: (n % 6) * 0.06 }} />
              <span className="ach-mask">
                <motion.span className="ach-inner" variants={{ hidden: { y: '110%' }, shown: { y: '0%' } }} transition={{ duration: 0.8, ease: EASE, delay: 0.15 + (n % 6) * 0.06 }}>
                  <span className="ach-year">{a.year}</span>
                  {a.src && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="ach-thumb" src={a.src} alt="" loading="lazy" />
                  )}
                  <span className="ach-main">
                    <b>{a.title}</b>
                    <small>{a.context}</small>
                  </span>
                  <span className="ach-tag">{a.tag}</span>
                  <span className="ach-metric">{a.metric}</span>
                </motion.span>
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.div className="ach-preview" style={{ x, y }} aria-hidden>
          <AnimatePresence>
            {previewSrc && (
              <motion.div key={previewSrc} className="ach-preview-in" initial={{ opacity: 0, scale: 0.85, rotate: -4 }} animate={{ opacity: 1, scale: 1, rotate: -2 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, ease: EASE }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewSrc} alt="" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
