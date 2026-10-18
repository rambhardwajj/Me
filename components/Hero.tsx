'use client';

import { motion } from 'framer-motion';
import { COMPANIES, HERO_BADGES, PROFILE } from '@/lib/data';
import { Arrow, EASE, Lines } from './Motion';
import { Socials } from './Socials';

const BADGE_ICONS = [
  'M7 3h10v2h4v3a5 5 0 0 1-4.6 5A5 5 0 0 1 13 15.9V19h4v2H7v-2h4v-3.1A5 5 0 0 1 7.6 13 5 5 0 0 1 3 8V5h4zm10 4v4a3 3 0 0 0 2-3V7zM5 7v1a3 3 0 0 0 2 3V7z',
  'm12 2 2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7z',
  'M12 3 1 9l11 6 9-4.9V17h2V9zM5 13.2v4L12 21l7-3.8v-4L12 17z',
];

const fade = (delay: number) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.8, ease: EASE } });

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <motion.span className="hero-pill" {...fade(0.2)}>
            <i aria-hidden /> {PROFILE.availability} · {PROFILE.location}
          </motion.span>

          <h1>
            <Lines delay={0.3} lines={['I take products', <span key="g" className="hero-grad">from zero to revenue.</span>]} />
          </h1>

          <motion.p className="hero-pitch" {...fade(0.6)}>
            {PROFILE.pitch}
          </motion.p>

          <motion.div className="hero-cta" {...fade(0.75)}>
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

        <motion.div className="hero-visual" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25, duration: 1, ease: EASE }}>
          <div className="hero-ring" aria-hidden />
          <div className="hero-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PROFILE.portrait} alt={PROFILE.name} />
          </div>
          {HERO_BADGES.map((b, i) => (
            <motion.div key={b.title} className={`hero-badge b${i}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 + i * 0.15, duration: 0.7, ease: EASE }}>
              <span className="hero-badge-icon" aria-hidden>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d={BADGE_ICONS[i % BADGE_ICONS.length]} />
                </svg>
              </span>
              <span>
                <b>{b.title}</b>
                <small>{b.note}</small>
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div className="wrap hero-logos" {...fade(1.1)}>
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
