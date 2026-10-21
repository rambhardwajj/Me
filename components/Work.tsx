'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { PROJECTS } from '@/lib/data';
import { EASE, Lines, Reveal } from './Motion';
import type { Project } from '@/lib/data';
import { ProductDevice } from './ProductScreens';
import Link from 'next/link';
import { hasCase } from '@/lib/cases';

/** The device doubles as a link to the project when it has one. */
function DeviceLink({ p }: { p: Project }) {
  if (!p.url) return <ProductDevice p={p} />;
  return (
    <a className="pj-open" href={p.url} target="_blank" rel="noreferrer" aria-label={`Open ${p.name}`}>
      <ProductDevice p={p} />
      <span className="pj-open-hint" aria-hidden>
        Open {p.name} <span>↗</span>
      </span>
    </a>
  );
}

/**
 * Selected work as products on the device they live on. A sticky stage on the left swaps
 * device + screen as the story on the right scrolls; the ambient glow takes each product's colour.
 */
export default function Work() {
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const jump = (i: number) => items.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  const p = PROJECTS[active];

  return (
    <section className="sec alt work" id="work">
      <motion.div className="work-glow" aria-hidden animate={{ backgroundColor: p.accent }} transition={{ duration: 0.9, ease: EASE }} />
      <div className="wrap">
        <header className="sec-head">
          <div>
            <span className="label kicker">Selected work</span>
            <h2>
              <Lines inView lines={['Products I’ve shipped,', 'on the screens they live on']} />
            </h2>
          </div>
          <Reveal delay={0.15}>
            <p>Six products across EdTech, mobility, social, voice and D2C. Scroll through them like a launch reel.</p>
          </Reveal>
        </header>

        <div className="pj">
          {/* sticky stage: the device morphs from product to product */}
          <div className="pj-stage">
            <div className="pj-stage-in">
              <div className="pj-device">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={p.id}
                    className={`pj-device-in ${p.device}`}
                    initial={{ opacity: 0, rotateY: -18, y: 40, scale: 0.92 }}
                    animate={{ opacity: 1, rotateY: 0, y: 0, scale: 1 }}
                    exit={{ opacity: 0, rotateY: 18, y: -30, scale: 0.94 }}
                    transition={{ duration: 0.7, ease: EASE }}
                  >
                    <DeviceLink p={p} />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="pj-rail">
                {PROJECTS.map((x, i) => (
                  <button key={x.id} className={i === active ? 'on' : ''} onClick={() => jump(i)} style={{ ['--a' as string]: x.accent }}>
                    <i />
                    <span>
                      {String(i + 1).padStart(2, '0')} {x.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* the stories */}
          <div className="pj-list">
            {PROJECTS.map((x, i) => (
              <article
                key={x.id}
                className={`pj-item ${i === active ? 'on' : ''}`}
                data-i={i}
                ref={(el) => {
                  items.current[i] = el;
                }}
                style={{ ['--a' as string]: x.accent }}
              >
                <div className="pj-mobile-device">
                  <DeviceLink p={x} />
                </div>

                <Reveal>
                  <div className="pj-meta">
                    <span className="pj-no">{String(i + 1).padStart(2, '0')}</span>
                    {x.period && <span>{x.period}</span>}
                    {x.client && <span>{x.client}</span>}
                  </div>
                  <h3 className="pj-name">{x.name}</h3>
                  <p className="pj-pitch">{x.pitch}</p>
                  <p className="pj-role">{x.role}</p>
                </Reveal>

                <Reveal delay={0.1}>
                  <div className="pj-metrics">
                    {x.metrics.map((m) => (
                      <div key={m.label}>
                        <b>{m.value}</b>
                        <span>{m.label}</span>
                      </div>
                    ))}
                  </div>
                </Reveal>

                <Reveal delay={0.15}>
                  <div className="pj-story">
                    <div>
                      <span className="label">What I did</span>
                      <ul>
                        {x.did.map((d) => (
                          <li key={d}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="pj-foot">
                    <div className="pj-stack">
                      {x.stack.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                    <div className="pj-links">
                      {hasCase(x.id) && (
                        <Link className="pj-case" href={`/work/${x.id}`}>
                          Read case study <span aria-hidden>→</span>
                        </Link>
                      )}
                      {x.url ? (
                        <a className="pj-live" href={x.url} target="_blank" rel="noreferrer">
                          Visit live <span aria-hidden>↗</span>
                        </a>
                      ) : (
                        <span className="pj-soon">Case study coming soon</span>
                      )}
                    </div>
                  </div>
                </Reveal>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
