'use client';

import { AnimatePresence, motion, useInView, useScroll, useSpring } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { EXPERIENCE, PROFILE, type Job } from '@/lib/data';
import { CountUp, EASE, Lines, Reveal } from './Motion';
import { useMediaQuery } from './TimelineParts';

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
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12.5 10 17 19 7" />
  </svg>
);

/** Ingenious: three blocks of a chain; on hover each one locks in turn and the chain verifies. */
function ChainArt() {
  return (
    <span className="art art-chain" aria-hidden>
      <span className="chain">
        {[0, 1, 2].map((k) => (
          <span className="chain-seg" key={k} style={{ ['--i' as string]: k }}>
            {k > 0 && (
              <span className="chain-link">
                <i />
              </span>
            )}
            <span className="blk">
              <svg className="blk-lock" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path className="shk" d="M8 11V8a4 4 0 0 1 8 0v3" />
                <rect x="5" y="11" width="14" height="10" rx="2.5" />
              </svg>
              <code>block {k + 1}</code>
              <span className="sk" />
              <span className="sk s" />
            </span>
          </span>
        ))}
      </span>
      <span className="art-status">
        <span className="st-idle">ISRO · blockchain prototype</span>
        <span className="st-hot">{CHECK} Distributed data secured</span>
      </span>
    </span>
  );
}


const AUDIT = [false, true, false, true];

/** Ciena: a licence audit; on hover the unused seats are de-provisioned and the savings land. */
function AuditArt() {
  return (
    <span className="art art-audit" aria-hidden>
      <span className="audit">
        <span className="audit-head">
          <code>Licence audit</code>
          <small>
            <span className="t-idle">Scanning</span>
            <span className="t-hot">Done</span>
          </small>
        </span>
        {AUDIT.map((unused, k) => (
          <span className={`audit-row ${unused ? 'unused' : ''}`} key={k} style={{ ['--i' as string]: k }}>
            <i className="av" />
            <span className="sk" />
            <em>
              <span className="t-idle">{unused ? 'Unused' : 'Active'}</span>
              <span className="t-hot">{unused ? 'Removed' : 'Active'}</span>
            </em>
          </span>
        ))}
        <span className="audit-foot">
          <span>Saved / year</span>
          <b>
            <span className="t-idle">—</span>
            <span className="t-hot">$30K+</span>
          </b>
        </span>
      </span>
    </span>
  );
}

/** Newral: on hover the highlight climbs the promotion ladder and the award pops. */
function LadderArt({ job }: { job: Job }) {
  const steps = [...job.roles].reverse();
  return (
    <span className="art art-ladder" aria-hidden>
      <span className="lad-card">
        <span className="lad-head">
          <Logo job={job} size={20} />
          <code>{job.company} · role history</code>
        </span>
        <span className="lad-rows">
          {steps.map((r) => (
            <span className="lad-row" key={r.title}>
              {r.title}
              <small>{label(r.start)}</small>
            </span>
          ))}
          <span className="lad-hl" />
        </span>
      </span>
      {job.highlights?.[0] && <span className="lad-award">★ {job.highlights[0]}</span>}
    </span>
  );
}

/** TruCost: the driver's phone pairs with the in-cab tablet over Bluetooth; rides flow, ads play. */
function PairArt() {
  return (
    <span className="art art-pair" aria-hidden>
      <span className="pair">
        <span className="dev phone">
          <span className="scr">
            <span className="route">
              <i className="car" />
            </span>
            <span className="sk" />
          </span>
        </span>
        <span className="bt">
          <span className="bt-line">
            <i />
            <i />
            <i />
          </span>
          <span className="bt-ico">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 7l10 10-5 5V2l5 5L7 17" />
            </svg>
          </span>
        </span>
        <span className="dev tab">
          <span className="scr">
            <span className="ad">
              <code>Ad</code>
            </span>
            <span className="sk" />
            <span className="paired">{CHECK} Paired</span>
          </span>
        </span>
      </span>
      <span className="stores">
        <span>{CHECK} Play Store</span>
        <span>{CHECK} App Store</span>
      </span>
    </span>
  );
}

function Art({ job }: { job: Job }) {
  if (job.slug === 'ingenious') return <ChainArt />;
  if (job.slug === 'ciena') return <AuditArt />;
  if (job.slug === 'newral') return <LadderArt job={job} />;
  return <PairArt />;
}

/** One stop on the timeline: a big year on one side, the card on the other, a node on the rail between. */
function Stop({ job, i, onOpen }: { job: Job; i: number; onOpen: (j: Job) => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const item = useRef<HTMLLIElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const reached = useInView(item, { once: true, margin: '0px 0px -45% 0px' });
  const canHover = useMediaQuery('(hover: hover)');
  const [hover, setHover] = useState(false);
  const hot = canHover ? hover : seen;
  const first = job.roles[job.roles.length - 1];
  const kpi = job.metrics[0];
  const side = i % 2 === 0 ? 'left' : 'right';

  return (
    <motion.li
      ref={item}
      className={`xp-item ${side} xp-${job.slug} ${reached ? 'on' : ''} ${hot ? 'hot' : ''}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <span className="xp-side" aria-hidden>
        <b className="xp-big">{first.start.slice(0, 4)}</b>
        <span className="xp-type">
          {job.type} · {job.location}
        </span>
      </span>
      <span className="xp-node" aria-hidden>
        <i />
      </span>
      <button
        ref={ref}
        className="xp-card"
        onClick={() => onOpen(job)}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
          e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
        }}
        aria-label={`${job.company}, ${job.roles[0].title}. Show details`}
      >
        <span className="xp-glow" aria-hidden />
        <Art job={job} />
        <span className="xp-body">
          <span className="xp-meta">
            <span className="xp-step">{String(TIMELINE.length - i).padStart(2, '0')}</span>
            {span(job).text}
          </span>
          <span className="xp-co">
            <Logo job={job} size={22} />
            <b>{job.company}</b>
          </span>
          <span className="xp-role">
            {job.roles[0].title}
            {job.roles.length > 1 && <em> · {job.roles.length} roles</em>}
          </span>
          <span className="xp-sum">{job.summary}</span>
          <span className="xp-kpi">
            <span>
              <b>{typeof kpi.value === 'number' ? <CountUp value={kpi.value} decimals={kpi.value % 1 ? 1 : 0} prefix={kpi.prefix} suffix={kpi.suffix} /> : kpi.value}</b>
              <small>{kpi.label}</small>
            </span>
            <span className="xp-go" aria-hidden>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </span>
          </span>
        </span>
      </button>
    </motion.li>
  );
}

/** Newest first; the step numbers count down to where it started. */
const TIMELINE = EXPERIENCE;

/** Jobs and internships on one rail; each card opens everything done there. */
export default function Experience() {
  const [open, setOpen] = useState<Job | null>(null);
  const closeModal = useCallback(() => setOpen(null), []);
  const list = useRef<HTMLDivElement>(null);
  // the rail fills as the timeline scrolls past the middle of the screen
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 60%', 'end 60%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

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
            <p>Latest first, back to where it started. Hover a card to see the work; open it for the full story.</p>
          </Reveal>
          {PROFILE.resume && (
            <Reveal delay={0.1}>
              <a className="exp-resume" href={PROFILE.resume} target="_blank" rel="noreferrer">
                Download résumé
              </a>
            </Reveal>
          )}
        </header>

        <div className="xp" ref={list}>
          <span className="xp-rail" aria-hidden>
            <motion.i className="xp-fill" style={{ scaleY: fill }} />
          </span>
          <ol className="xp-list">
            {TIMELINE.map((job, i) => (
              <Stop key={job.slug} job={job} i={i} onOpen={setOpen} />
            ))}
          </ol>
        </div>
      </div>

      <AnimatePresence>{open && <JobModal job={open} onClose={closeModal} />}</AnimatePresence>
    </section>
  );
}
