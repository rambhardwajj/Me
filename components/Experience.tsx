'use client';

import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { EXPERIENCE, PROFILE, type Job } from '@/lib/data';
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
const range = (start: string, end?: string) => (end === start ? label(start) : `${label(start)} – ${label(end)}`);
const span = (job: Job) => {
  const first = job.roles[job.roles.length - 1],
    latest = job.roles[0];
  return { text: `${label(first.start)} – ${label(latest.end)}`, length: duration(first.start, latest.end) };
};

function Logo({ job, size = 34 }: { job: Job; size?: number }) {
  return (
    <span className="exp-logo" style={{ background: job.logo.src ? '#fff' : job.logo.bg, color: job.logo.fg ?? '#fff', width: size, height: size, fontSize: size * 0.4 }} aria-hidden>
      {job.logo.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={job.logo.src} alt="" />
      ) : (
        job.logo.text
      )}
    </span>
  );
}

/** Everything done at one company: every role, grouped highlights and recognition. */
function JobModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    close.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);
  const s = span(job);

  return (
    <motion.div className="xm" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
      <motion.div
        className="xm-panel"
        role="dialog"
        aria-modal="true"
        aria-label={`${job.company}: experience details`}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <header className="xm-head">
          <Logo job={job} size={48} />
          <div>
            <h3>{job.company}</h3>
            <p>
              {job.type} · {job.location} · {s.text} · {s.length}
            </p>
          </div>
          <button ref={close} className="xm-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        <div className="xm-body">
          {job.highlights && (
            <div className="xm-highlights">
              {job.highlights.map((h) => (
                <span key={h}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="m12 2 2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7z" />
                  </svg>
                  {h}
                </span>
              ))}
            </div>
          )}

          <ol className="xm-roles">
            {job.roles.map((r, i) => (
              <li key={r.title} className={i === 0 ? 'latest' : ''}>
                <div className="xm-role-head">
                  <b>{r.title}</b>
                  <span>
                    {range(r.start, r.end)} · {duration(r.start, r.end)}
                  </span>
                </div>
                {r.groups.map((g, k) => (
                  <div className="xm-group" key={k}>
                    {g.heading && <span className="label">{g.heading}</span>}
                    <ul>
                      {g.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </li>
            ))}
          </ol>

          {job.url && (
            <a className="xm-link" href={job.url} target="_blank" rel="noreferrer">
              Visit {job.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')} ↗
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Jobs and internships as compact tiles on a centre line; click one for the full story. */
export default function Experience() {
  const list = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 70%', 'end 60%'] });
  const [open, setOpen] = useState<Job | null>(null);
  const closeModal = useCallback(() => setOpen(null), []);

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
            const side = i % 2 === 0 ? 'left' : 'right';
            const s = span(job);
            return (
              <div key={job.company} className={`exp-row ${side}`}>
                <span className={`exp-node ${i === 0 ? 'now' : ''}`} aria-hidden />
                <motion.button
                  className="exp-card"
                  onClick={() => setOpen(job)}
                  aria-label={`${job.company}, ${job.roles[0].title}. Show details`}
                  initial={{ opacity: 0, x: side === 'left' ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  <Logo job={job} />
                  <span className="exp-main">
                    <b>{job.company}</b>
                    <span className="exp-role">
                      {job.roles[0].title}
                      {job.roles.length > 1 && <em> · {job.roles.length} roles</em>}
                    </span>
                    <span className="exp-when">
                      {s.text} · {s.length}
                    </span>
                  </span>
                  <span className="exp-open" aria-hidden>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                  </span>
                </motion.button>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>{open && <JobModal job={open} onClose={closeModal} />}</AnimatePresence>
    </section>
  );
}
