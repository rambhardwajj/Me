'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { COMPANIES, GLOBE_STOPS, PROFILE } from '@/lib/data';
import Globe from './Globe';
import { Arrow, CountUp, EASE } from './Motion';
import { Socials } from './Socials';

const fade = (delay: number) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.8, ease: EASE } });

const PROOF = [
  { prefix: '$', value: 6, suffix: 'K', label: 'MRR from zero', note: 'Synappses' },
  { prefix: '+', value: 75, suffix: '%', label: 'revenue growth', note: 'Newral' },
  { prefix: '', value: 4, suffix: '/14K', label: 'won Ciena’s award', note: 'Ciena' },
];

/** Tilted stickers around the portrait, each a fact from the site. */
const STICKERS = [
  { text: '4/14,000 at Ciena', icon: '🏆', cls: 's1' },
  { text: 'Top 16 worldwide · Chicago dance battle', icon: '🕺', cls: 's2' },
  { text: '150+ LeetCase users', icon: '🚀', cls: 's3' },
  { text: 'YC VibeCon Wingathon winner', icon: '⚡', cls: 's4' },
];

export const RESUME_LABEL = 'Download Resume';

export default function Hero() {
  const [stop, setStop] = useState(0);
  const s = GLOBE_STOPS[stop];

  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden />

      <motion.p className="hero-pill" {...fade(0.2)}>
        <span className="hero-pill-tag">Ram v4.0</span>
        <span>now with MBA</span>
        <a href="#journey" className="hero-pill-link">
          What’s new <Arrow size={13} />
        </a>
      </motion.p>

      {/* the stage: globe at the back, the name over it, the portrait in front, stickers around */}
      <motion.div className="hero-stage" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 1.2, ease: EASE }}>
        <Globe stops={GLOBE_STOPS} onStop={setStop}>
          <h1 className="hero-name" aria-label={PROFILE.name}>
            <span aria-hidden>RAM BHARDWAJ</span>
          </h1>
          <div className="hero-cutout">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/ram-cutout.webp" alt={`${PROFILE.name}, ${PROFILE.role}`} />
            <span className="hero-scan" aria-hidden />
          </div>
          <div className="stickers" aria-hidden>
            {STICKERS.map((k, i) => (
              <motion.span
                key={k.cls}
                className={`sticker ${k.cls}`}
                initial={{ opacity: 0, scale: 0.5, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.18, type: 'spring', stiffness: 260, damping: 18 }}
              >
                <i>{k.icon}</i>
                {k.text}
              </motion.span>
            ))}
          </div>
        </Globe>
      </motion.div>

      {/* what the globe is showing right now */}
      <div className="tour" aria-live="polite">
        <motion.div key={stop} className="tour-chip" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE }}>
          <i aria-hidden />
          <b>
            {s.year} · {s.place}
          </b>
          <span>{s.text}</span>
        </motion.div>
        <div className="tour-row">
          <div className="tour-dots" aria-hidden>
            {GLOBE_STOPS.map((_, i) => (
              <span key={i} className={i === stop ? 'on' : i < stop ? 'done' : ''} />
            ))}
          </div>
          <small className="tour-hint">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8l-1.5-1.5a2 2 0 0 0-3 2.6L6 20a4 4 0 0 0 3 1.5h6a5 5 0 0 0 5-5v-5a2 2 0 0 0-4 0" />
            </svg>
            Drag the globe: my journey, stop by stop
          </small>
        </div>
      </div>

      <div className="wrap hero-copy">
        <div className="hero-copy-main">
          <motion.p className="hero-kicker" {...fade(0.4)}>
            <i aria-hidden /> {PROFILE.role} · ex-Software Engineer
          </motion.p>
          <motion.p className="hero-line" {...fade(0.5)}>
            I take products from <span>zero to revenue.</span>
          </motion.p>
          <motion.p className="hero-now" {...fade(0.6)}>
            Now a PGP candidate at{' '}
            <a className="org" href="https://mastersunion.org" target="_blank" rel="noreferrer">
              Masters’ Union
            </a>
            , building{' '}
            <a className="org" href="https://leetcase.rambhardwaj.in/" target="_blank" rel="noreferrer">
              LeetCase
            </a>
            . {PROFILE.availability}.
          </motion.p>
          <motion.div className="hero-cta" {...fade(0.75)}>
            <a href="#work" className="btn-primary">
              View my work <Arrow />
            </a>
            {PROFILE.resume && (
              <a href={PROFILE.resume} className="btn-ghost" download>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
                </svg>
                {RESUME_LABEL}
              </a>
            )}
          </motion.div>
        </div>

        <div className="hero-copy-side">
          <motion.div className="hero-proof" {...fade(0.65)}>
            {PROOF.map((p) => (
              <div key={p.label}>
                <b>
                  <CountUp value={p.value} prefix={p.prefix} suffix={p.suffix} />
                </b>
                <span>{p.label}</span>
                <small>{p.note}</small>
              </div>
            ))}
          </motion.div>
          <motion.div className="hero-socials" {...fade(0.85)}>
            <span className="label">Find me</span>
            <Socials />
          </motion.div>
        </div>
      </div>

      <motion.div className="wrap hero-logos" {...fade(1)}>
        <span className="label">Worked with</span>
        <div>
          {COMPANIES.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
