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

export default function Hero() {
  const [stop, setStop] = useState(0);
  const s = GLOBE_STOPS[stop];

  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden />
      <div className="wrap hero-grid">
        <motion.div className="hero-visual" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 1.2, ease: EASE }}>
          <Globe stops={GLOBE_STOPS} onStop={setStop}>
            <div className="hero-cutout">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/ram-cutout.webp" alt={PROFILE.name} />
              <span className="hero-scan" aria-hidden />
            </div>
          </Globe>

          {/* what the globe is showing right now */}
          <div className="tour" aria-live="polite">
            <motion.div key={stop} className="tour-chip" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE }}>
              <i aria-hidden />
              <b>
                {s.year} · {s.place}
              </b>
              <span>{s.text}</span>
            </motion.div>
            <div className="tour-dots" aria-hidden>
              {GLOBE_STOPS.map((_, i) => (
                <span key={i} className={i === stop ? 'on' : i < stop ? 'done' : ''} />
              ))}
            </div>
            <small className="tour-hint">Drag the globe to explore</small>
          </div>
        </motion.div>

        <div className="hero-copy">
          <motion.p className="hero-kicker" {...fade(0.3)}>
            <i aria-hidden /> {PROFILE.role} · ex-Software Engineer
          </motion.p>
          <motion.h1 {...fade(0.4)}>{PROFILE.name}</motion.h1>
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

          <motion.div className="hero-proof" {...fade(0.7)}>
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

          <motion.div className="hero-cta" {...fade(0.85)}>
            <a href="#work" className="btn-primary">
              View my work <Arrow />
            </a>
            <a href={`mailto:${PROFILE.email}`} className="btn-ghost">
              Get in touch
            </a>
            <span className="hero-socials">
              <Socials />
            </span>
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
