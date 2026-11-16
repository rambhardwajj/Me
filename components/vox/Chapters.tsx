import Link from 'next/link';
import Journey from '@/components/Journey';
import { Upto } from '@/components/ProductScreens';
import { ABOUT, ABOUT_HEADING, CHAPTERS_V, CONTACT, DOORS, EXPERIENCE_STOPS, TITLE, WORK } from '@/lib/explained';
import type React from 'react';
import { Chapter, Mark, Ring, Tape, win } from './parts';
import WorkJump from './WorkJump';
import { PROJECTS } from '@/lib/data';

const PROJECTS_ACCENT: Record<string, string> = Object.fromEntries(PROJECTS.map((p) => [p.id, p.accent]));

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ym = (s?: string) => (s ? `${MONTHS[Number(s.slice(5, 7)) - 1]} ${s.slice(0, 4)}` : 'now');

/* ------------------------------------------------------------------ 0 · title card */
export function TitleCard() {
  const h = TITLE.headline;
  return (
    <section className="vx-title" id="top">
      <i className="vx-strip s-blue" aria-hidden />
      <i className="vx-strip s-red" aria-hidden />
      <i className="vx-strip s-yellow" aria-hidden />
      <div className="vx-title-in">
        <div className="vx-title-copy">
          <p className="vx-eyebrow">{TITLE.eyebrow}</p>
          <h1 className="vx-headline">
            {h.before}
            <mark className="vx-hl vx-hl-load">{h.mark}</mark>
            {h.after}
          </h1>
          <p className="vx-title-role">{TITLE.role}</p>
          <p className="vx-title-sub">{TITLE.sub}</p>
          <p className="vx-scroll-cue">
            Scroll to play <span aria-hidden>↓</span>
          </p>
        </div>
        <figure className="vx-me">
          <Tape n={2} className="vx-me-tape" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={TITLE.portrait} alt={`${TITLE.name}, halftone cut-out`} />
          <figcaption>{TITLE.name}</figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 2 · experience */
/** Panel windows: each stop holds while its pieces land, then the camera pans to the next. */
const PANEL_AT = [0.13, 0.43, 0.73];

export function ExperienceChapter() {
  const keys = [
    [0.12, 0, 0, 1, 0],
    [0.36, 0, 0, 1, 0],
    [0.44, -33.3333, 0, 1, 0],
    [0.66, -33.3333, 0, 1, 0],
    [0.74, -66.6667, 0, 1, 0],
    [1, -66.6667, 0, 1, 0],
  ];
  return (
    <Chapter id="experience" len={6} card={CHAPTERS_V.experience} className="vx-exp">
      <div className="vx-exp-cam" data-cam={JSON.stringify(keys)} data-cam-pan>
        {EXPERIENCE_STOPS.map((s, i) => {
          const a = PANEL_AT[i];
          return (
            <article className={`vx-panel vx-panel-${s.slug}`} key={s.slug}>
              <div className="vx-panel-year k slap" style={win(a, a + 0.04, { '--r': '-2deg' })}>
                {ym(s.from)} – {ym(s.to)}
              </div>
              <div className="vx-panel-grid">
                <figure className="vx-snap k slap" style={win(a + 0.01, a + 0.06, { '--r': i % 2 ? '2deg' : '-3deg' })}>
                  <Tape n={((i % 3) + 1) as 1 | 2 | 3} className="vx-snap-tape" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.photo} alt={s.caption} loading="lazy" />
                  <figcaption>{s.caption}</figcaption>
                  <span className="vx-pin k" style={win(a + 0.05, a + 0.09)} aria-hidden />
                </figure>
                <div className="vx-panel-copy">
                  <div className="vx-co k slap" style={win(a + 0.03, a + 0.07)}>
                    {s.logo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.logo} alt="" />
                    )}
                    <div>
                      <b>{s.company}</b>
                      <span>
                        {s.type} · {s.location}
                      </span>
                    </div>
                  </div>
                  <ol className="vx-roles k slap" style={win(a + 0.05, a + 0.09)}>
                    {s.roles.map((r) => (
                      <li key={r.title}>
                        <b>{r.title}</b>
                        <span>
                          {ym(r.start)}
                          {r.end !== r.start ? ` – ${ym(r.end)}` : ''}
                        </span>
                      </li>
                    ))}
                  </ol>
                  {s.promotions && (
                    <p className="vx-promo k slap" style={win(a + 0.08, a + 0.11, { '--r': '-3deg' })}>
                      {s.promotions}
                    </p>
                  )}
                  <p className="vx-panel-sum k slap" style={win(a + 0.07, a + 0.1)}>
                    {s.summary}
                  </p>
                  <div className="vx-cards">
                    <div className="vx-card-stat lead k slap" style={win(a + 0.09, a + 0.13, { '--r': '-2deg' })}>
                      <b>
                        {s.lead.prefix}
                        {s.lead.value}
                        {s.lead.suffix}
                        <Ring a={a + 0.13} b={a + 0.2} />
                      </b>
                      <span>{s.lead.label}</span>
                    </div>
                    {s.more.map((m, k) => (
                      <div className="vx-card-stat k slap" key={m.label} style={win(a + 0.11 + k * 0.02, a + 0.15 + k * 0.02, { '--r': `${k % 2 ? -1.5 : 2}deg` })}>
                        <b>
                          {m.prefix}
                          {m.value}
                          {m.suffix}
                        </b>
                        <span>{m.label}</span>
                      </div>
                    ))}
                  </div>
                  {s.highlight && <p className="vx-award">★ {s.highlight}</p>}
                </div>
              </div>
            </article>
          );
        })}
        <div className="vx-rail" aria-hidden>
          {EXPERIENCE_STOPS.map((s) => (
            <span key={s.slug}>
              <i />
              {s.from.slice(0, 4)}
            </span>
          ))}
        </div>
      </div>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ journey: the untouched dark chapter */
export function JourneyChapter() {
  return (
    <div className="vx-journey">
      <span className="vx-tear top" aria-hidden />
      {/* 03: the card tears away to reveal the dark chapter; Journey itself is untouched */}
      <Chapter id="journey-card" len={1.6} card={CHAPTERS_V.journey} cardAt={[0.15, 0.7]} className="vx-jcard" />
      <Journey />
      <span className="vx-tear bottom" aria-hidden />
    </div>
  );
}

/* ------------------------------------------------------------------ 3 · work: one browser, six tabs, a receipt per product */
const W_START = 0.12;
const W_STEP = (0.995 - W_START) / WORK.length;

export function WorkChapter() {
  const n = WORK.length;
  const pad = (i: number) => String(i).padStart(2, '0');
  return (
    <Chapter id="work" len={10} card={CHAPTERS_V.work} className="vx-work">
      <header className="vx-work-mhead">
        <span>{CHAPTERS_V.work.n}</span> {CHAPTERS_V.work.word}
      </header>
      <WorkJump />
      {WORK.map((p, i) => {
        const a = W_START + i * W_STEP;
        // a beat inside this product's slot: f0..f1 are fractions of the slot
        const at = (f0: number, f1: number, extra?: Record<string, string | number>) => win(a + f0 * W_STEP, a + f1 * W_STEP, extra);
        const show = {
          '--ia': i === 0 ? -1 : a - 0.012,
          '--ib': i === 0 ? 0 : a + 0.004,
          '--oa': i === n - 1 ? 2 : a + W_STEP - 0.012,
          '--ob': i === n - 1 ? 3 : a + W_STEP + 0.004,
        } as React.CSSProperties;
        const [lead, ...rest] = p.metrics;
        return (
          <article className={`vx-wk vx-wk-${p.id}`} key={p.id} style={show} aria-label={p.name}>
            <div className="vx-wk-left">
              <div className="vx-wk-head">
                <p className="vx-wk-kicker k slap" style={at(0, 0.1, { '--r': '-1deg' })}>
                  Tab {pad(i + 1)} of {pad(n)}
                  {p.period ? ` · ${p.period}` : ''}
                </p>
                <h3 className="vx-wk-name k slap" style={at(0.01, 0.12)}>
                  {p.name}
                </h3>
                <p className="vx-wk-pitch k slap" style={at(0.04, 0.15)}>
                  <span className="vx-wk-lbl">
                    <mark className="vx-hl k" style={at(0.1, 0.2)}>
                      What it is
                    </mark>
                  </span>{' '}
                  {p.pitch}
                </p>
              </div>

              <div className="vx-wk-browser">
                <div className="vx-wk-tabs" role="tablist" aria-label="Products">
                  {WORK.map((q, j) => (
                    <button
                      type="button"
                      role="tab"
                      aria-selected={j === i}
                      key={q.id}
                      className={`vx-wk-tab ${j === i ? 'on' : ''}`}
                      data-go={j}
                      data-p={(W_START + j * W_STEP + 0.8 * W_STEP).toFixed(4)}
                      style={{ '--dot': PROJECTS_ACCENT[q.id] ?? '#999' } as React.CSSProperties}
                    >
                      <i aria-hidden />
                      {q.name}
                    </button>
                  ))}
                </div>
                <div className="vx-wk-bar">
                  <span className="vx-wk-lights" aria-hidden>
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="vx-wk-url">
                    <span className="vx-wk-lock" aria-hidden>
                      {p.url ? '🔒' : '⌁'}
                    </span>
                    <span className="vx-wk-type k" style={at(0.02, 0.17, { '--n': p.domain.length })}>
                      {p.domain}
                    </span>
                    <i className="vx-wk-caret" aria-hidden />
                  </span>
                </div>
                <div className="vx-wk-view">
                  <span className="vx-wk-load k" style={at(0.12, 0.24)} aria-hidden />
                  <div className={`vx-wk-page k ${p.shot ? '' : 'coded'}`} style={at(0.2, 0.32)}>
                    {p.shot ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.shot} alt={`${p.name}, ${p.domain}`} loading="lazy" />
                    ) : (
                      <div className="vx-pol-phone">
                        <Upto />
                      </div>
                    )}
                  </div>
                  <span className="vx-wk-stamp k" style={at(0.72, 0.8)} aria-hidden>
                    {p.url ? 'Live' : 'Shipped'}
                  </span>
                </div>
              </div>
            </div>

            <div className="vx-wk-right">
              <span className="vx-wk-slot" aria-hidden />
              <div className="vx-wk-receipt k" style={at(0.24, 0.7)}>
                <div className="vx-wk-rhead">
                  <b>RAM BHARDWAJ · PRODUCT WORKS</b>
                  <span>
                    Receipt #{pad(i + 1)} · {p.name}
                  </span>
                  <span>
                    {p.role}
                    {p.client ? ` · ${p.client}` : ''}
                  </span>
                </div>
                <div className="vx-wk-rsec">
                  <span className="vx-wk-rlbl">The problem</span>
                  <p className="vx-wk-problem">{p.problem}</p>
                </div>
                <div className="vx-wk-rsec">
                  <span className="vx-wk-rlbl">What I did</span>
                  <ol className="vx-wk-did">
                    {p.did.map((d, k) => (
                      <li key={d}>
                        <span className="vx-wk-tick k" style={at(0.4 + k * 0.07, 0.46 + k * 0.07)} aria-hidden>
                          ✓
                        </span>
                        {d}
                      </li>
                    ))}
                  </ol>
                </div>
                <dl className="vx-wk-sub">
                  {rest.map((m) => (
                    <div key={m.label}>
                      <dt>{m.label}</dt>
                      <dd>{m.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="vx-wk-total">
                  <span>
                    Total
                    <small>{lead.label}</small>
                  </span>
                  <b>
                    {lead.value}
                    <Ring a={a + 0.7 * W_STEP} b={a + 0.82 * W_STEP} />
                  </b>
                </div>
                <p className="vx-wk-tags">{p.stack.join(' · ')}</p>
                <span className="vx-wk-code" aria-hidden />
                <div className="vx-wk-links">
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noreferrer">
                      Visit live ↗
                    </a>
                  ) : (
                    <span className="vx-soon">Not public yet</span>
                  )}
                  {p.caseStudy && <Link href={`/work/${p.id}`}>Read case study →</Link>}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </Chapter>
  );
}

/* ------------------------------------------------------------------ 4 · about */
export function AboutChapter() {
  return (
    <Chapter id="about" len={3.6} card={CHAPTERS_V.about} className="vx-about">
      <h3 className="vx-about-h k slap" style={win(0.1, 0.17, { '--r': '-1deg' })}>
        {ABOUT_HEADING.before}
        <Mark a={0.16} b={0.26}>
          {ABOUT_HEADING.mark}
        </Mark>
        {ABOUT_HEADING.after}
      </h3>
      <div className="vx-pan vx-cards3 k" style={win(0.2, 0.9)}>
        {ABOUT.map((p, i) => (
          <article className="vx-index k slap" key={p.id} style={win(0.14 + i * 0.1, 0.22 + i * 0.1, { '--r': `${[-2.5, 1.5, -1][i]}deg` })}>
            <Tape n={((i % 3) + 1) as 1 | 2 | 3} className="vx-index-tape" />
            <div className="vx-index-top">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.photo} alt="" loading="lazy" />
              <span>
                {p.platform}
                <b>{p.handle}</b>
              </span>
            </div>
            <h3>{p.name}</h3>
            <p>{p.tagline}</p>
            <ul>
              {p.chips.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <a href={p.url} target="_blank" rel="noreferrer">
              Follow on {p.platform} ↗
            </a>
          </article>
        ))}
      </div>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ end card */
export function EndCard() {
  const doors = DOORS.filter((d) => d.href);
  return (
    <section className="vx-end" id="contact">
      <div className="vx-end-in">
        <p className="vx-eyebrow">The end</p>
        <h2 className="vx-end-h">
          Let’s build <mark className="vx-hl vx-hl-static">what’s next.</mark>
        </h2>
        <nav className="vx-doors" aria-label="Where to next">
          {doors.map((d, i) => (
            <a key={d.label} className="vx-door" href={d.href} style={{ ['--c' as string]: d.color, ['--r' as string]: `${[-1.5, 1, -0.5][i % 3]}deg` }} {...(d.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>
              <b>{d.label}</b>
              <span>{d.note} →</span>
            </a>
          ))}
        </nav>
        <div className="vx-end-meta">
          <a className="vx-end-mail" href={`mailto:${CONTACT.email}`}>
            {CONTACT.email}
          </a>
          <ul>
            {CONTACT.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer">
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
        <footer className="foot vx-foot">
          <span>© {new Date().getFullYear()} Ram Bhardwaj</span>
          <Link href="/old">Classic site →</Link>
        </footer>
      </div>
    </section>
  );
}
