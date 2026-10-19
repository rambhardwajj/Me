'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
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

/** Ciena: a licence audit; on hover the unused seats get de-provisioned and the savings land. */
function AuditArt() {
  return (
    <span className="art art-audit" aria-hidden>
      <span className="award-chip">★ EDST award · 4 of 14,000</span>
      <span className="audit">
        <span className="audit-head">
          <code>Licence audit</code>
          <small>Enterprise apps</small>
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
          <span>Annual spend</span>
          <b>
            <span className="t-idle">Auditing…</span>
            <span className="t-hot">−$30K+ / yr</span>
          </b>
        </span>
      </span>
    </span>
  );
}

/** Newral: the promotion ladder replays on hover while the revenue line draws in. */
function LadderArt({ job }: { job: Job }) {
  const steps = [...job.roles].reverse();
  return (
    <span className="art art-ladder" aria-hidden>
      <span className="lad-card">
        <span className="lad-head">
          <Logo job={job} size={30} />
          <code>Career at {job.company}</code>
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
        {job.highlights?.[0] && <span className="lad-foot">★ {job.highlights[0]}</span>}
      </span>
      <span className="chart-card">
        <span className="chart-head">
          <code>Revenue</code>
          <b>+75%</b>
        </span>
        <svg viewBox="0 0 160 64" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="currentColor" stopOpacity="0.28" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className="chart-area" d="M0 56 C20 54 30 50 46 46 S72 40 86 34 S112 26 124 18 S146 8 160 4 V64 H0Z" fill="url(#chart-fill)" />
          <path className="chart-line" pathLength={100} d="M0 56 C20 54 30 50 46 46 S72 40 86 34 S112 26 124 18 S146 8 160 4" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </span>
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
            <span className="sk s" />
          </span>
        </span>
        <span className="bt">
          <span className="bt-line">
            <i />
            <i />
            <i />
          </span>
          <span className="bt-ico">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            <span className="sk s" />
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

function Metric({ m }: { m: Job['metrics'][number] }) {
  return (
    <span className="bx-metric">
      <b>{typeof m.value === 'number' ? <CountUp value={m.value} decimals={m.value % 1 ? 1 : 0} prefix={m.prefix} suffix={m.suffix} /> : m.value}</b>
      {m.label}
    </span>
  );
}

/** One bento tile: its mini-interface plays on hover (or once in view on touch screens); click for everything. */
function Tile({ job, step, onOpen, register }: { job: Job; step: number; onOpen: (j: Job) => void; register: (el: HTMLElement | null) => void }) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const canHover = useMediaQuery('(hover: hover)');
  const [hover, setHover] = useState(false);
  const hot = canHover ? hover : seen;
  return (
    <motion.button
      ref={(el) => {
        ref.current = el;
        register(el);
      }}
      className={`bx bx-${job.slug} ${hot ? 'hot' : ''}`}
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
      aria-label={`${String(step).padStart(2, '0')}: ${job.company}, ${job.roles[0].title}. Show details`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: EASE, delay: step * 0.1 }}
    >
      <span className="bx-glow" aria-hidden />
      <span className="bx-in">
        <Art job={job} />
        <span className="bx-copy">
          <span className="bx-title">
            <span className="bx-step">{String(step).padStart(2, '0')}</span>
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
      </span>
      <span className="bx-more" aria-hidden>
        Details
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17 17 7M8 7h9v9" />
        </svg>
      </span>
    </motion.button>
  );
}

type Seg = { d: string; x: number; y: number; dir: 'right' | 'down' | 'left'; year: string };

/** Line between two tiles through the gap: straight when they sit side by side or stacked, an elbow otherwise. */
function link(a: DOMRect, b: DOMRect, o: DOMRect, year: string): Seg {
  const ax = (v: number) => v - o.left,
    ay = (v: number) => v - o.top;
  const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
  const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
  if (b.left >= a.right - 1 && overlapY > 40) {
    const y = ay((Math.max(a.top, b.top) + Math.min(a.bottom, b.bottom)) / 2);
    return { d: `M ${ax(a.right)} ${y} H ${ax(b.left)}`, x: ax((a.right + b.left) / 2), y, dir: 'right', year };
  }
  if (b.top >= a.bottom - 1 && overlapX > 40) {
    const x = ax((Math.max(a.left, b.left) + Math.min(a.right, b.right)) / 2);
    return { d: `M ${x} ${ay(a.bottom)} V ${ay(b.top)}`, x, y: ay((a.bottom + b.top) / 2), dir: 'down', year };
  }
  const x1 = ax(a.left + a.width / 2),
    x2 = ax(b.left + b.width / 2),
    mid = ay((a.bottom + b.top) / 2);
  return { d: `M ${x1} ${ay(a.bottom)} V ${mid} H ${x2} V ${ay(b.top)}`, x: (x1 + x2) / 2, y: mid, dir: x2 > x1 ? 'right' : 'left', year };
}

/** The sequence lines: drawn in order once the grid is in view, with a pulse running along each. */
function Flow({ box, tiles, jobs }: { box: React.RefObject<HTMLDivElement | null>; tiles: React.RefObject<(HTMLElement | null)[]>; jobs: Job[] }) {
  const [segs, setSegs] = useState<Seg[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const seen = useInView(box, { once: true, amount: 0.15 });

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      const o = el.getBoundingClientRect();
      const out: Seg[] = [];
      for (let i = 1; i < jobs.length; i++) {
        const a = tiles.current[i - 1],
          b = tiles.current[i];
        if (!a || !b) continue;
        const r = jobs[i].roles;
        out.push(link(a.getBoundingClientRect(), b.getBoundingClientRect(), o, r[r.length - 1].start.slice(0, 4)));
      }
      setSegs(out);
      setSize({ w: o.width, h: o.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [box, tiles, jobs]);

  return (
    <div className="flow" aria-hidden>
      <svg width={size.w} height={size.h}>
        {segs.map((s, i) => (
          <g key={i}>
            <motion.path d={s.d} className="flow-base" initial={{ pathLength: 0 }} animate={seen ? { pathLength: 1 } : {}} transition={{ delay: 0.4 + i * 0.35, duration: 0.6, ease: EASE }} />
            <path d={s.d} className="flow-pulse" pathLength={100} style={{ animationDelay: `${1.4 + i * 0.5}s` }} />
          </g>
        ))}
      </svg>
      {segs.map((s, i) => (
        <motion.span
          key={i}
          className="flow-node"
          data-dir={s.dir}
          style={{ left: s.x, top: s.y }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={seen ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.7 + i * 0.35, duration: 0.5, ease: EASE }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
          <b className="flow-year">{s.year}</b>
        </motion.span>
      ))}
    </div>
  );
}

/** Oldest first, so the lines read as "what came next". */
const TIMELINE = [...EXPERIENCE].reverse();

/** Jobs and internships as a chronological bento; click a tile for everything done there. */
export default function Experience() {
  const [open, setOpen] = useState<Job | null>(null);
  const closeModal = useCallback(() => setOpen(null), []);
  const box = useRef<HTMLDivElement>(null);
  const tiles = useRef<(HTMLElement | null)[]>([]);

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
            <p>Four teams in order, from research intern to product manager. Hover a card to see the work, open it for the full story.</p>
          </Reveal>
          {PROFILE.resume && (
            <Reveal delay={0.1}>
              <a className="exp-resume" href={PROFILE.resume} target="_blank" rel="noreferrer">
                Download résumé
              </a>
            </Reveal>
          )}
        </header>

        <div className="bento" ref={box}>
          {TIMELINE.map((job, i) => (
            <Tile
              key={job.slug}
              job={job}
              step={i + 1}
              onOpen={setOpen}
              register={(el) => {
                tiles.current[i] = el;
              }}
            />
          ))}
          <Flow box={box} tiles={tiles} jobs={TIMELINE} />
        </div>
      </div>

      <AnimatePresence>{open && <JobModal job={open} onClose={closeModal} />}</AnimatePresence>
    </section>
  );
}
