'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { EXPERIENCE, PROFILE, type Job } from '@/lib/data';
import { CountUp, EASE, Lines, Reveal } from './Motion';

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

const CHECK = (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12.5 10 17 19 7" />
  </svg>
);

/** Newral: a panel inside a chamfered frame; a highlight climbs the promotion ladder. */
function PromotionArt({ job }: { job: Job }) {
  const steps = [...job.roles].reverse();
  return (
    <span className="art art-promo" aria-hidden>
      <svg className="promo-frame" viewBox="0 0 400 300" preserveAspectRatio="none" fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke">
        <path d="M0 150 H40 L70 120 V70 L100 40 H300 L330 70 V120 L360 150 H400" vectorEffect="non-scaling-stroke" />
        <path d="M0 162 H34 L58 186 V300 M400 162 H366 L342 186 V300" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="promo-card">
        <span className="promo-head">
          <Logo job={job} size={40} />
        </span>
        <span className="promo-rows">
          {steps.map((r) => (
            <span className="promo-row" key={r.title}>
              {r.title}
              <small>{label(r.start)}</small>
            </span>
          ))}
          <span className="promo-hl" />
        </span>
        {job.highlights?.[0] && <span className="promo-foot">{job.highlights[0]}</span>}
      </span>
    </span>
  );
}

/** TruCost: a beam runs down the line through the emblem while both app stores tick live. */
function BeamArt() {
  return (
    <span className="art art-beam" aria-hidden>
      <span className="beam-line">
        <i />
      </span>
      <span className="beam-chip l">{CHECK} Play Store</span>
      <span className="emblem emblem-beam">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 17h14M6.5 17v2M17.5 17v2M4 13l1.6-5A2 2 0 0 1 7.5 6.6h9a2 2 0 0 1 1.9 1.4L20 13M4 13h16v4H4z" />
          <circle cx="7.5" cy="15" r=".6" fill="currentColor" />
          <circle cx="16.5" cy="15" r=".6" fill="currentColor" />
        </svg>
      </span>
      <span className="beam-chip r">{CHECK} App Store</span>
    </span>
  );
}

/** Ciena: the award emblem on a raised plate, rings rippling out. */
function AwardArt() {
  return (
    <span className="art art-plate" aria-hidden>
      <span className="ring" />
      <span className="ring" />
      <span className="ring" />
      <span className="emblem">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5v1.5A3 3 0 0 0 8 10.4M16 6h3v1.5a3 3 0 0 1-3 2.9M12 13v3.5M8.5 20h7M9.5 20l.8-3.5h3.4l.8 3.5" />
        </svg>
      </span>
      <span className="plate" />
      <span className="plate-bar">
        <b>EDST</b> Customer’s First Award
      </span>
    </span>
  );
}

const LOG_STEPS = ['Research', 'Blockchain prototype', 'Data security', 'Distributed systems'];

/** Ingenious: a running job toast that branches into a log of steps, each lighting up in turn. */
function LogArt({ job }: { job: Job }) {
  return (
    <span className="art art-log" aria-hidden>
      <span className="log-toast">
        <svg className="log-spin" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          {Array.from({ length: 8 }, (_, k) => (
            <circle key={k} cx={8 + 6 * Math.cos((k * Math.PI) / 4)} cy={8 + 6 * Math.sin((k * Math.PI) / 4)} r="1.1" opacity={0.25 + (k / 8) * 0.75} />
          ))}
        </svg>
        <code>ISRO · securing distributed data</code>
        <small>{label(job.roles[0].start)}</small>
      </span>
      <svg className="log-branch" viewBox="0 0 60 70" fill="none" stroke="currentColor">
        <path d="M2 0 V22 L29 49 V70" />
      </svg>
      <span className="log-steps">
        {LOG_STEPS.map((t, k) => (
          <span className="log-step" key={t} style={{ ['--i' as string]: k }}>
            <i />
            <code>{t}</code>
          </span>
        ))}
      </span>
    </span>
  );
}

function Art({ job }: { job: Job }) {
  if (job.slug === 'newral') return <PromotionArt job={job} />;
  if (job.slug === 'trucost') return <BeamArt />;
  if (job.slug === 'ciena') return <AwardArt />;
  return <LogArt job={job} />;
}

function Metric({ m }: { m: Job['metrics'][number] }) {
  return (
    <span className="bx-metric">
      <b>{typeof m.value === 'number' ? <CountUp value={m.value} decimals={m.value % 1 ? 1 : 0} prefix={m.prefix} suffix={m.suffix} /> : m.value}</b>
      {m.label}
    </span>
  );
}

/** One bento tile: an animated mini-interface for the company plus the short story; click for everything. */
function Tile({ job, i, onOpen }: { job: Job; i: number; onOpen: (j: Job) => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.35 });
  return (
    <motion.button
      ref={ref}
      className={`bx bx-${job.slug}`}
      data-in={seen ? '' : undefined}
      onClick={() => onOpen(job)}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
      }}
      aria-label={`${job.company}, ${job.roles[0].title}. Show details`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
    >
      <span className="bx-glow" aria-hidden />
      <span className="bx-copy">
        <span className="bx-title">
          <Logo job={job} size={22} />
          <b>{job.company}</b>
          <span className="bx-type">{job.type}</span>
        </span>
        <span className="bx-role">
          {job.roles[0].title}
          {job.roles.length > 1 && <em> · {job.roles.length} roles</em>} <em>· {span(job).text}</em>
        </span>
        <span className="bx-sum">{job.summary}</span>
        <span className="bx-metrics">
          {job.metrics.map((m) => (
            <Metric key={m.label} m={m} />
          ))}
        </span>
      </span>
      <Art job={job} />
      <span className="bx-more" aria-hidden>
        Details
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17 17 7M8 7h9v9" />
        </svg>
      </span>
    </motion.button>
  );
}

/** Jobs and internships as an animated bento grid; click a tile for everything done there. */
export default function Experience() {
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
          <Reveal delay={0.1}>
            <p>Four teams, from research intern to product manager. Open any card for the full story.</p>
          </Reveal>
          {PROFILE.resume && (
            <Reveal delay={0.1}>
              <a className="exp-resume" href={PROFILE.resume} target="_blank" rel="noreferrer">
                Download résumé
              </a>
            </Reveal>
          )}
        </header>

        <div className="bento">
          {EXPERIENCE.map((job, i) => (
            <Tile key={job.slug} job={job} i={i} onOpen={setOpen} />
          ))}
        </div>
      </div>

      <AnimatePresence>{open && <JobModal job={open} onClose={closeModal} />}</AnimatePresence>
    </section>
  );
}
