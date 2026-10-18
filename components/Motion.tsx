'use client';

import { animate, motion, MotionConfig, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Site-wide motion settings: one easing curve, and respect the OS "reduce motion" setting. */
export default function Motion({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: EASE, duration: 0.7 }}>
      {children}
    </MotionConfig>
  );
}

/** Fades and lifts its children in once, when they scroll into view. */
export function Reveal({ children, delay = 0, y = 24, className, as = 'div' }: { children: React.ReactNode; delay?: number; y?: number; className?: string; as?: 'div' | 'li' | 'section' | 'article' }) {
  const Tag = motion[as];
  return (
    <Tag className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.7, delay, ease: EASE }}>
      {children}
    </Tag>
  );
}

/**
 * Each line slides up out of its own mask, staggered. The in-view trigger sits on
 * the wrapper: the lines start clipped by their masks, so they can't be observed themselves.
 */
export function Lines({ lines, delay = 0, inView = false }: { lines: React.ReactNode[]; delay?: number; inView?: boolean }) {
  return (
    <motion.span
      style={{ display: 'block' }}
      initial="hidden"
      {...(inView ? { whileInView: 'shown', viewport: { once: true, amount: 0.4 } } : { animate: 'shown' })}
    >
      {lines.map((l, i) => (
        <span className="mask" key={i}>
          <motion.span variants={{ hidden: { y: '105%' }, shown: { y: '0%' } }} transition={{ duration: 0.8, delay: delay + i * 0.08, ease: EASE }}>
            {l}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/** Counts from 0 to `value` the first time it is seen. */
export function CountUp({ value, decimals = 0, prefix = '', suffix = '' }: { value: number; decimals?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    const c = animate(0, value, { duration: reduce ? 0 : 1.4, ease: EASE, onUpdate: setN });
    return () => c.stop();
  }, [seen, value, reduce]);
  return (
    <span ref={ref}>
      {prefix}
      {n.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function Arrow({ size = 16, diagonal = false }: { size?: number; diagonal?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {diagonal ? <path d="M7 17 17 7M8 7h9v9" /> : <path d="M5 12h14M13 6l6 6-6 6" />}
    </svg>
  );
}
