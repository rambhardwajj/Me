'use client';

import { motion } from 'framer-motion';
import { CAPABILITIES } from '@/lib/data';
import { EASE, Lines, Reveal } from './Motion';

/** Compact toolkit: each group's skills pop in as pills, one after another. */
export default function Skills() {
  return (
    <section className="sec" id="skills">
      <div className="wrap">
        <header className="sec-head">
          <div>
            <span className="label kicker">Skills</span>
            <h2>
              <Lines inView lines={['My toolkit']} />
            </h2>
          </div>
          <Reveal delay={0.15}>
            <p>Strategy to decide what to build, the technical depth to build it, and the automation to run it without me.</p>
          </Reveal>
        </header>

        <div className="skills">
          {CAPABILITIES.map((c, g) => (
            <Reveal key={c.group} className="skill-group" delay={g * 0.1}>
              <h3>
                <span>{String(g + 1).padStart(2, '0')}</span> {c.group}
              </h3>
              <ul>
                {c.items.map((it, i) => (
                  <motion.li key={it} initial={{ opacity: 0, y: 10, scale: 0.94 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.45, ease: EASE, delay: 0.2 + g * 0.1 + i * 0.05 }}>
                    {it}
                  </motion.li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
