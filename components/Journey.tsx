'use client';

import { motion } from 'framer-motion';
import { Fragment, useCallback, useState } from 'react';
import { CHAPTERS, JOURNEY } from '@/lib/data';
import HorizontalTimeline from './HorizontalTimeline';
import Lightbox, { type Photo } from './Lightbox';
import { EASE, Lines, Reveal } from './Motion';
import { Icon, Media, useMediaQuery, usePinnedTrack } from './TimelineParts';

/** Where the reading line sits in the pinned frame (0 = top, 1 = bottom). */
const READ_LINE = 0.55;

/** Phone / tablet timeline: pinned to one screen, cards rise through a reading line. */
function VerticalTimeline({ onOpen }: { onOpen: (id: string) => void }) {
  const { pin, stage, track, pinHeight, offset, fill } = usePinnedTrack('y', READ_LINE);

  return (
    <div className="tl-pin" ref={pin} style={{ height: pinHeight }}>
      <div className="tl-stage" ref={stage}>
        <div className="wrap tl-viewport">
          <motion.div className="tl" ref={track} style={{ y: offset }}>
            <div className="tl-track" aria-hidden>
              <motion.i className="tl-fill" style={{ scaleY: fill }} />
            </div>

            {JOURNEY.map((m, i) => {
              const newYear = i === 0 || JOURNEY[i - 1].year !== m.year;
              const left = i % 2 === 0;
              return (
                <Fragment key={m.id}>
                  {newYear && (
                    <div className="tl-year" data-step>
                      <motion.div className="tl-year-pill" initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6, ease: EASE }}>
                        <b>{m.year}</b>
                        <span>{CHAPTERS[m.year]}</span>
                      </motion.div>
                    </div>
                  )}

                  <div className={`tl-row ${left ? 'left' : 'right'}`} data-step>
                    <span className={`tl-node k-${m.kind}`} aria-hidden>
                      <Icon kind={m.kind} size={11} />
                    </span>
                    <span className="tl-conn" aria-hidden />

                    <motion.div className="tl-date" initial={{ opacity: 0, x: left ? 32 : -32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}>
                      <b>{m.date}</b>
                      <span className={`tl-kind k-${m.kind}`}>{m.kind}</span>
                    </motion.div>

                    <motion.article
                      className="tl-card"
                      initial="hidden"
                      whileInView="shown"
                      variants={{ hidden: { opacity: 0, x: left ? -48 : 48, rotate: left ? -1.5 : 1.5 }, shown: { opacity: 1, x: 0, rotate: 0 } }}
                      viewport={{ once: true, amount: 0.25 }}
                      transition={{ duration: 0.8, ease: EASE }}
                    >
                      <Media m={m} fromLeft={!left} onOpen={() => onOpen(m.id)} />
                      <div className="tl-body">
                        <span className="tl-mobile-date label">{m.date}</span>
                        <h3>{m.title}</h3>
                        <p className="tl-org">{m.org}</p>
                        <p className="tl-text">{m.body}</p>
                        {m.points && (
                          <ul className="tl-points">
                            {m.points.map((p) => (
                              <li key={p}>{p}</li>
                            ))}
                          </ul>
                        )}
                        {m.stat && (
                          <span className={`tl-stat k-${m.kind}`}>
                            <Icon kind={m.kind} size={12} /> {m.stat}
                          </span>
                        )}
                      </div>
                    </motion.article>
                  </div>
                </Fragment>
              );
            })}

            <div className="tl-end" data-step>
              <span>To be continued</span>
            </div>
          </motion.div>
          <span className="tl-head" aria-hidden />
        </div>
      </div>
    </div>
  );
}

export default function Journey() {
  // wide, tall-enough screens get the horizontal film strip; phones and small screens stay vertical
  const horizontal = useMediaQuery('(min-width: 1024px) and (min-height: 620px)');

  // every timeline photo, in order, for the full-screen viewer (with the milestone's full story)
  const withPhoto = JOURNEY.filter((m) => m.image);
  const photos: Photo[] = withPhoto.map((m) => ({ src: m.image!, title: m.title, caption: `${m.org} · ${m.date}`, body: m.body, points: m.points }));
  const [viewing, setViewing] = useState<number | null>(null);
  const closeOrStep = useCallback((i: number | null) => setViewing(i), []);
  const open = (id: string) => setViewing(withPhoto.findIndex((m) => m.id === id));

  return (
    <section className="sec" id="journey">
      <div className="wrap">
        <header className="sec-head">
          <div>
            <span className="label kicker">My journey</span>
            <h2>
              <Lines inView lines={['From a classroom in Mathura', 'to building products']} />
            </h2>
          </div>
          <Reveal delay={0.15}>
            <p>School toppers’ lists, world dance battles, enterprise awards and startup launches. Every chapter added a skill the next one needed.</p>
          </Reveal>
        </header>
      </div>

      {horizontal ? <HorizontalTimeline onOpen={open} /> : <VerticalTimeline onOpen={open} />}
      <Lightbox photos={photos} index={viewing} onChange={closeOrStep} />
    </section>
  );
}
