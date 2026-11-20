'use client';

import { useState } from 'react';
import { PROFILE } from '@/lib/data';
import {
  ACCENT,
  ACTIVITY,
  BILLBOARD,
  EXPLAIN,
  HERO_FACTS,
  INBOX,
  PERSONAS,
  REROUTES,
  RESERVE,
  RIDE,
  SERVICES,
  SHIPPED,
  STAGE,
  TEARDOWN,
  TRIPS,
  minLabel,
  minutesAway,
  monthLabel,
  stop,
  trip as getTrip,
  tripMinutes,
  type PersonaId,
  type Stop,
  type Trip,
  type TripId,
} from '@/lib/uber';
import { PORTRAIT, stopPhoto, tripPhotos, type Photo } from '@/lib/uber-photos';
import LifeMap, { routeBetween } from './LifeMap';
import { Icon, Pict } from './icons';
import type { Ride } from './useRide';

/** A photo that quietly steps aside if it cannot load, leaving the coloured tile behind it. */
export function Shot({ photo, className = '' }: { photo: Photo; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={`ub-shot ${photo.contain ? 'contain' : ''} ${className}`} src={photo.src} alt={photo.alt} loading="lazy" onError={(e) => (e.currentTarget.style.visibility = 'hidden')} />;
}

const when = (s: Stop) => (s.type === 'you' ? 'Now' : s.monthAssumed ? s.when.slice(0, 4) : monthLabel(s.when, true));

/** One trip as a card: its photo (or its pictogram on its colour), name, one line and the result. */
function TripCard({ t, onOpen, i }: { t: Trip; onOpen: (id: TripId) => void; i: number }) {
  const photo = tripPhotos(t.id)[0];
  return (
    <button type="button" className="ub-tcard" style={{ ['--acc' as string]: ACCENT[t.id], ['--i' as string]: i }} onClick={() => onOpen(t.id)}>
      <span className="ub-tcard-art">
        <Pict name={t.icon} size={54} />
        {photo && <Shot photo={photo} />}
        {t.result && <span className="ub-tcard-val">{t.result.value}</span>}
      </span>
      <b>{t.name}</b>
      <small>{t.sub}</small>
    </button>
  );
}

type Props = {
  app: Ride;
  persona: PersonaId;
  onPersona: (p: PersonaId) => void;
  reducedMotion: boolean;
};

/**
 * The panel beside the phone. It shows the same moment as the phone at full size:
 * what the screen stands for, the map flying to the chosen route, the photos and the receipt.
 */
export default function StagePanel({ app, persona, onPersona, reducedMotion }: Props) {
  const { where, onTrip, route, screen, hot, setHot, ride, openSheet, journeyTrip } = app;
  const [pick, setPick] = useState<{ trip: string; i: number }>({ trip: '', i: 0 });
  const [copied, setCopied] = useState(false);
  const ex = EXPLAIN[where];
  const t = onTrip ?? (route ? getTrip(journeyTrip) : null);
  const accent = t ? ACCENT[t.id] : ACCENT[PERSONAS.find((p) => p.id === persona)!.lead];
  const reserve = () => openSheet('reserve');

  /* ---------------------------------------------------------------- a route is on the map */
  let body;
  if (route) {
    const { between, minutes } = routeBetween(route.from, route.to);
    const timeline = !onTrip || onTrip.id === 'story';
    const stops = [stop(route.from), ...between, stop(route.to)];
    const forward = minutesAway(stop(route.from).when) >= minutesAway(stop(route.to).when);
    const photos = onTrip ? tripPhotos(onTrip.id) : [];
    const shown = photos[pick.trip === onTrip?.id ? Math.min(pick.i, photos.length - 1) : 0];
    const min = onTrip ? tripMinutes(onTrip) : null;
    const receipt = onTrip ? [...(onTrip.receipt ?? []), ...(min !== null && onTrip.id !== 'idle-minutes' ? [{ label: 'Distance from today', value: minLabel(min) }] : [])] : [];
    body = (
      <>
        <div className={`ub-mapbox ${timeline ? 'tall' : ''}`}>
          <LifeMap from={route.from} to={route.to} detail controls hot={hot} onHot={setHot} onPick={(id) => ride(stop(id).trip)} searching={screen.s === 'finding'} reducedMotion={reducedMotion} />
          <p className="ub-mapbox-sum">
            <b>{minLabel(minutes)}</b>
            {between.length} {between.length === 1 ? 'stop' : 'stops'} on the way · 1 min is 1 month of Ram’s life
          </p>
        </div>
        {timeline ? (
          <div className="ub-line" tabIndex={0} role="group" aria-label="The stops on this route, in order. Scroll sideways to see them all.">
            {stops.map((s, i) => {
              const photo = stopPhoto(s.id);
              const turn = forward ? REROUTES.find((r) => r.before === s.id) : undefined;
              return (
                <div key={s.id} className="ub-line-item" style={{ ['--i' as string]: Math.min(i, 12) }}>
                  {turn && <span className="ub-turn">{turn.text}</span>}
                  <div className={`ub-stopcard ${s.type} ${hot === s.id ? 'hot' : ''}`} style={{ ['--acc' as string]: ACCENT[s.trip] }} onMouseEnter={() => setHot(s.id)} onMouseLeave={() => setHot(null)} onClick={() => s.type !== 'you' && ride(s.trip)}>
                    <span className="ub-stopcard-art">
                      {s.type === 'you' ? <i className="ub-youdot" /> : <Pict name={getTrip(s.trip).icon} size={44} />}
                      {photo && <Shot photo={photo} />}
                    </span>
                    <small>
                      {when(s)}
                      {s.type !== 'you' && <> · {minLabel(minutesAway(s.when))}</>}
                    </small>
                    <b>{s.name}</b>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          onTrip && (
            <div className="ub-trip" key={onTrip.id}>
              <div className="ub-trip-copy">
                <div className="ub-trip-head">
                  <h3 className={onTrip.name.length > 14 ? 'long' : ''}>{onTrip.name}</h3>
                  {onTrip.result && (
                    <p className="ub-bigstat">
                      <b>{onTrip.result.value}</b>
                      <span>{onTrip.result.sub}</span>
                    </p>
                  )}
                </div>
                <p>{onTrip.blurb}</p>
                {onTrip.id === 'idle-minutes' ? (
                  <p className="ub-trip-idea">{TEARDOWN.parts.find((p) => p.heading === 'The idea')?.text}</p>
                ) : (
                  onTrip.did && (
                    <ul className="ub-ticks">
                      {onTrip.did.map((x) => (
                        <li key={x}>
                          <i aria-hidden="true">
                            <Icon name="check" size={12} w={3.2} />
                          </i>
                          <span>{x}</span>
                        </li>
                      ))}
                    </ul>
                  )
                )}
              </div>
              <div className="ub-trip-side">
                {shown && (
                  <figure className="ub-gallery">
                    <span className="ub-gallery-main" key={shown.src}>
                      <Shot photo={shown} />
                    </span>
                    <figcaption>{shown.caption}</figcaption>
                    {photos.length > 1 && (
                      <span className="ub-thumbs">
                        {photos.map((p, i) => (
                          <button key={p.src} type="button" className={p === shown ? 'on' : ''} onClick={() => setPick({ trip: onTrip.id, i })} aria-label={`Show photo: ${p.caption}`} aria-pressed={p === shown}>
                            <Shot photo={{ ...p, alt: '' }} />
                          </button>
                        ))}
                      </span>
                    )}
                  </figure>
                )}
                {receipt.length > 0 && (
                  <dl className="ub-receipt">
                    {receipt.map((r) => (
                      <div key={r.label}>
                        <dt>{r.label}</dt>
                        <i aria-hidden="true" />
                        <dd>{r.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </div>
          )
        )}
      </>
    );
  } else if (where === 'home') {
    /* ---------------------------------------------------------------- nothing tapped yet */
    body = (
      <div className="ub-hero">
        <div className="ub-hero-copy">
          <p className="ub-status sm">
            <Icon name="check" size={24} w={2.6} />
            {STAGE.status}
          </p>
          <h3>{STAGE.headline}</h3>
          <p>{STAGE.body}</p>
          <div className="ub-hero-btns">
            <button type="button" className="ub-btn solid tall" onClick={() => ride('story')}>
              {BILLBOARD.start}
            </button>
            <button type="button" className="ub-btn line tall" onClick={reserve}>
              {BILLBOARD.reserve}
            </button>
          </div>
        </div>
        <div className="ub-hero-photo">
          <Shot photo={PORTRAIT} />
          <span className="ub-hero-chip">
            <i aria-hidden="true" />
            {PROFILE.availability}
          </span>
        </div>
        <div className="ub-facts">
          {HERO_FACTS.map((f, i) => (
            <button key={f.trip} type="button" style={{ ['--acc' as string]: ACCENT[f.trip], ['--i' as string]: i }} onClick={() => ride(f.trip)}>
              <b>{f.value}</b>
              <span>{f.label}</span>
              <Icon name="arrow" size={18} />
            </button>
          ))}
        </div>
      </div>
    );
  } else if (where === 'reserve') {
    body = (
      <div className="ub-reserve">
        <div className="ub-hero-photo small">
          <Shot photo={PORTRAIT} />
        </div>
        <div>
          <h3>{RESERVE.title}</h3>
          <p>{RESERVE.line}</p>
          <p className="ub-reserve-mail">{PROFILE.email}</p>
          <div className="ub-hero-btns">
            <a className="ub-btn solid tall" href={`mailto:${PROFILE.email}?subject=${encodeURIComponent(RESERVE.subject)}`}>
              {RESERVE.email}
            </a>
            <a className="ub-btn line tall" href={PROFILE.linkedin} target="_blank" rel="noreferrer">
              {RESERVE.linkedin}
            </a>
            <button
              type="button"
              className="ub-btn line tall"
              onClick={() =>
                navigator.clipboard
                  .writeText(PROFILE.email)
                  .then(() => setCopied(true))
                  .catch(() => {})
              }
            >
              <span aria-live="polite">{copied ? RESERVE.copied : `${RESERVE.copy} address`}</span>
            </button>
          </div>
        </div>
      </div>
    );
  } else if (where === 'switch') {
    body = (
      <div className="ub-wall cols-2" role="radiogroup" aria-label="Riding with">
        {PERSONAS.map((p, i) => {
          const lead = getTrip(p.lead);
          const photo = tripPhotos(p.lead)[0];
          return (
            <button key={p.id} type="button" role="radio" aria-checked={p.id === persona} className={`ub-who ${p.id === persona ? 'on' : ''}`} style={{ ['--acc' as string]: ACCENT[p.lead], ['--i' as string]: i }} onClick={() => onPersona(p.id)}>
              <span className="ub-tcard-art">
                <Pict name={p.icon} size={54} />
                {photo && <Shot photo={photo} />}
              </span>
              <b>{p.label}</b>
              <small>{p.card.line}</small>
              <small className="dim">Starts at {lead.name}</small>
            </button>
          );
        })}
      </div>
    );
  } else {
    /* ---------------------------------------------------------------- a wall of trips for this screen */
    const lists: Partial<Record<typeof where, TripId[]>> = {
      shipped: SHIPPED,
      search: TRIPS.map((x) => x.id),
      services: [...new Set([...SERVICES.main, ...SERVICES.more].map((x) => x.trip))],
      activity: [ACTIVITY.upcomingTrip, ...ACTIVITY.pastTrips],
      account: ['dance', 'masters-union', 'story'],
      inbox: ['newral', 'trucost', 'ciena'],
      lost: [],
    };
    const ids = lists[where] ?? [];
    body = (
      <>
        {where === 'inbox' && (
          <blockquote className="ub-quote">
            <p>{INBOX[0].text}</p>
            <footer>
              {INBOX[0].from}, {INBOX[0].when.toLowerCase()}
            </footer>
          </blockquote>
        )}
        {where === 'inbox' && <p className="ub-wall-note">Three more messages are waiting on real quotes from the people Ram worked with here:</p>}
        {where === 'lost' && <p className="ub-wall-note">This chapter is still being written by Ram.</p>}
        <div className={`ub-wall ${ids.length > 6 ? 'dense' : ''}`}>
          {ids.map((id, i) => (
            <TripCard key={id} t={getTrip(id)} onOpen={ride} i={i} />
          ))}
        </div>
      </>
    );
  }

  return (
    <section className="ub-panel" aria-label="What the phone is showing" style={{ ['--acc' as string]: accent }}>
      <header className="ub-cap">
        <div className="ub-cap-top">
          <p className="ub-now-k">
            <i aria-hidden="true" />
            {STAGE.nowShowing}
          </p>
          <button type="button" className="ub-cap-reserve" onClick={reserve}>
            {RIDE.reserve}
          </button>
        </div>
        <div className="ub-cap-row" key={where}>
          <h2 aria-live="polite">
            {ex.title}
            {onTrip && <span> · {onTrip.name}</span>}
          </h2>
          <p>
            <span className="ub-cap-tag">In Uber</span>
            {ex.uber}
            <Icon name="arrow" size={16} />
            <span className="ub-cap-tag here">Here</span>
            {ex.here}
          </p>
        </div>
      </header>
      <div className={`ub-panel-body w-${where}`} key={route ? 'map' : where}>
        {body}
      </div>
    </section>
  );
}
