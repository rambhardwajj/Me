'use client';

import { motion } from 'framer-motion';
import { COMPANIES, PROFILE } from '@/lib/data';
import Globe from './Globe';
import { Arrow, EASE } from './Motion';
import { Socials } from './Socials';

const fade = (delay: number) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.8, ease: EASE } });

/** Company name with a dotted underline, linked when it has a site. */
function Org({ href, children }: { href?: string; children: React.ReactNode }) {
  return href ? (
    <a className="org" href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  ) : (
    <span className="org">{children}</span>
  );
}

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden />
      <div className="wrap hero-grid">
        <motion.div className="hero-visual" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 1.2, ease: EASE }}>
          <Globe>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="hero-cutout" src="/images/ram-cutout.webp" alt={PROFILE.name} />
          </Globe>
        </motion.div>

        <div className="hero-copy">
          <motion.p className="hero-kicker" {...fade(0.3)}>
            {PROFILE.role}
          </motion.p>
          <motion.h1 {...fade(0.4)}>{PROFILE.name}</motion.h1>
          <motion.p className="hero-story" {...fade(0.55)}>
            Product Manager and former software engineer who takes products from zero to revenue. Most recently, I shipped <Org href="https://trucostrides.com/">TruCost</Org>’s iOS and
            Android apps to 100 drivers. Before that I led product at <Org>Newral</Org>, growing revenue 75%, and scaled <Org href="https://synappses.in/">Synappses</Org>, an AI SaaS, from $0
            to $6K MRR. Earlier, I automated enterprise operations at <Org href="https://www.ciena.com">Ciena</Org>, where I was one of 4 out of 14,000 people to win its annual award. Now doing a
            PGP at <Org href="https://mastersunion.org">Masters’ Union</Org> and building <Org href="https://leetcase.rambhardwaj.in/">LeetCase</Org>. Open to Product Manager roles.
          </motion.p>
          <motion.div className="hero-cta" {...fade(0.7)}>
            <a href={`mailto:${PROFILE.email}`} className="btn-primary">
              Get in touch
            </a>
            {PROFILE.resume ? (
              <a href={PROFILE.resume} className="btn-ghost" target="_blank" rel="noreferrer">
                Download résumé
              </a>
            ) : (
              <a href="#work" className="btn-ghost">
                View my work <Arrow />
              </a>
            )}
            <span className="hero-socials">
              <Socials />
            </span>
          </motion.div>
        </div>
      </div>

      <motion.div className="wrap hero-logos" {...fade(0.9)}>
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
