'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ABOUT, METRICS, STRIP_WORDS } from '@/lib/data';
import Achievements from './Achievements';
import { CountUp, EASE, Reveal } from './Motion';

/** "I’m …" — the last words swap on their own every couple of seconds. */
function RotatingRole() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % ABOUT.roles.length), 2400);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="role-slot">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={ABOUT.roles[i]} className="role" initial={{ y: '100%', opacity: 0 }} animate={{ y: '0%', opacity: 1 }} exit={{ y: '-100%', opacity: 0 }} transition={{ duration: 0.5, ease: EASE }}>
          {ABOUT.roles[i]}.
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Strip({ reverse = false }: { reverse?: boolean }) {
  const words = [...STRIP_WORDS, ...STRIP_WORDS];
  return (
    <div className={`strip ${reverse ? 'b' : 'a'}`} aria-hidden>
      <div className="strip-track">
        {words.map((w, i) => (
          <span key={i}>
            {w}
            <i />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section className="sec alt about" id="about">
      <div className="wrap">
        <div className="about-top">
          <div>
            <Reveal>
              <span className="label kicker">About me</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="about-title">
                I’m Ram. I’m
                <br />
                <RotatingRole />
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="about-body">{ABOUT.body}</p>
              <a href="#journey" className="more big">
                See the full journey <span aria-hidden>→</span>
              </a>
            </Reveal>
          </div>

          <div className="about-stats">
            {METRICS.map((m, i) => (
              <Reveal key={m.label} className="about-stat" delay={0.15 + i * 0.1}>
                <b>
                  <CountUp value={m.value} decimals={m.decimals} prefix={m.prefix} suffix={m.suffix} />
                </b>
                <span>{m.label}</span>
                <small>{m.note}</small>
              </Reveal>
            ))}
          </div>
        </div>

        <Achievements />
      </div>

      <div className="strips">
        <Strip />
        <Strip reverse />
      </div>
    </section>
  );
}
