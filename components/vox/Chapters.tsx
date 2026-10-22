import Link from 'next/link';
import Journey from '@/components/Journey';
import { Upto } from '@/components/ProductScreens';
import { ABOUT, ABOUT_HEADING, CHAPTERS_V, CONTACT, DOORS, EXPERIENCE_STOPS, TITLE, WORK } from '@/lib/explained';
import { Chapter, Mark, Ring, Tape, win } from './parts';

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

/* ------------------------------------------------------------------ 3 · work */
export function WorkChapter() {
  return (
    <Chapter id="work" len={5} card={CHAPTERS_V.work} className="vx-work">
      <div className="vx-pan k" style={win(0.14, 0.94)}>
        {WORK.map((p, i) => (
          <article className="vx-pol k slap" key={p.id} style={win(0.04 + i * 0.07, 0.1 + i * 0.07, { '--r': `${[-3, 2, -1.5, 3, -2, 1.5][i % 6]}deg` })}>
            <Tape n={((i % 3) + 1) as 1 | 2 | 3} className="vx-pol-tape" />
            <div className={`vx-pol-shot ${p.shot ? '' : 'coded'}`}>
              {p.shot ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.shot} alt={`${p.name} screenshot`} loading="lazy" />
              ) : (
                <div className="vx-pol-phone">
                  <Upto />
                </div>
              )}
            </div>
            <div className="vx-pol-cap">
              <span className="vx-pol-meta">
                {String(i + 1).padStart(2, '0')}
                {p.period ? ` · ${p.period}` : ''}
              </span>
              <h3>{p.name}</h3>
              <p>{p.brief}</p>
              <div className="vx-pol-links">
                {p.url ? (
                  <a href={p.url} target="_blank" rel="noreferrer">
                    Visit live ↗
                  </a>
                ) : (
                  <span className="vx-soon">Case study coming soon</span>
                )}
                {p.caseStudy && <Link href={`/work/${p.id}`}>Read case study →</Link>}
              </div>
            </div>
          </article>
        ))}
      </div>
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
