'use client';

import { motion, useScroll } from 'framer-motion';
import { useRef } from 'react';
import { EXPERIENCE, PROFILE } from '@/lib/data';
import { EASE, Lines, Reveal } from './Motion';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const parse = (ym: string) => {
  const [y, m] = ym.split('-').map(Number);
  return { y, m };
};
const label = (ym?: string) => {
  if (!ym) return 'Present';
  const { y, m } = parse(ym);
  return `${MONTHS[m - 1]} ${y}`;
};
/** Inclusive length, e.g. Jul 2024 – Oct 2025 → "1 yr 4 mos". */
const duration = (start: string, end?: string) => {
  const a = parse(start);
  const now = new Date();
  const b = end ? parse(end) : { y: now.getFullYear(), m: now.getMonth() + 1 };
  const months = (b.y - a.y) * 12 + (b.m - a.m) + 1;
  const yrs = Math.floor(months / 12),
    mos = months % 12;
  return [yrs ? `${yrs} yr${yrs > 1 ? 's' : ''}` : '', mos ? `${mos} mo${mos > 1 ? 's' : ''}` : ''].filter(Boolean).join(' ');
};

/** Jobs and internships on a centre line that draws in as you scroll; cards alternate sides. */
export default function Experience() {
  const list = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 70%', 'end 60%'] });

  return (
    <section className="sec exp" id="experience">
      <div className="wrap">
        <header className="exp-head">
          <div>
            <span className="label kicker">Experience</span>
            <h2>
              <Lines inView lines={['The path so far']} />
            </h2>
          </div>
          {PROFILE.resume && (
            <Reveal delay={0.1}>
              <a className="exp-resume" href={PROFILE.resume} target="_blank" rel="noreferrer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" />
                </svg>
                Download résumé
              </a>
            </Reveal>
          )}
        </header>

        <div className="exp-list" ref={list}>
          <div className="exp-line" aria-hidden>
            <motion.i style={{ scaleY: scrollYProgress }} />
          </div>

          {EXPERIENCE.map((job, i) => {
            const first = job.roles[job.roles.length - 1];
            const latest = job.roles[0];
            const side = i % 2 === 0 ? 'left' : 'right';
            const span = `${label(first.start)} – ${label(latest.end)}`;
            return (
              <div key={job.company} className={`exp-row ${side}`}>
                <span className={`exp-node ${i === 0 ? 'now' : ''}`} aria-hidden />
                <motion.article
                  className="exp-card"
                  initial={{ opacity: 0, x: side === 'left' ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, ease: EASE }}
                >
                  <div className="exp-top">
                    <span className="exp-logo" style={{ background: job.logo.bg, color: job.logo.fg ?? '#fff' }} aria-hidden>
                      {job.logo.text}
                    </span>
                    <span className="exp-type">{job.type}</span>
                  </div>
                  <h3>{job.url ? <a href={job.url} target="_blank" rel="noreferrer">{job.company}</a> : job.company}</h3>
                  <p className="exp-role">{latest.title}</p>
                  <p className="exp-when">
                    {span} · {duration(first.start, latest.end)} · {job.location}
                  </p>
                  {job.roles.length > 1 && (
                    <ol className="exp-steps">
                      {job.roles.map((r) => (
                        <li key={r.title}>
                          <b>{r.title}</b>
                          <span>
                            {label(r.start)}
                            {r.end && r.end !== r.start ? ` – ${label(r.end)}` : ''}
                          </span>
                        </li>
                      ))}
                    </ol>
                  )}
                  <p className="exp-summary">{job.summary}</p>
                </motion.article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
