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
  RESERVE,
  RIDE,
  SERVICES,
  SHIPPED,
  STAGE,
  TEARDOWN,
  minLabel,
  minutesAway,
  monthLabel,
  stop,
  trip as getTrip,
  tripMinutes,
  type PersonaId,
  STOPS,
  type Stop,
  type StopId,
  type Trip,
  type TripId,
} from '@/lib/uber';
import { PORTRAIT, stopPhoto, stopStory, tripPhotos, type Photo } from '@/lib/uber-photos';
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

/** One stop beside the map: its photo, when it was, and what happened there in the journey's own words. */
function SideStop({ s, small }: { s: Stop; small?: boolean }) {
  const photo = stopPhoto(s.id);
  const story = stopStory(s.id);
  return (
    <div className={`ub-sstop ${small ? 'small' : ''}`} style={{ ['--acc' as string]: ACCENT[s.trip] }}>
      {photo && (
        <span className="ub-sstop-art">
          <Shot photo={photo} />
        </span>
      )}
      <small>
        {when(s)}
        {s.type !== 'you' && <> · {minLabel(minutesAway(s.when))} away</>}
      </small>
      <b>{story.title}</b>
      {story.org && <span className="org">{story.org}</span>}
      {story.body && <p>{story.body}</p>}
      {story.points.length > 0 && (
        <ul>
          {story.points.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      )}
      {story.stat && <span className="ub-sstop-stat">{story.stat}</span>}
    </div>
  );
}

/** One trip beside the map: photo, what it was, what Ram did, and the receipt. `bare` leaves out the photo and text. */
function SideTrip({ t, bare }: { t: Trip; bare?: boolean }) {
  const photo = tripPhotos(t.id)[0];
  const min = tripMinutes(t);
  const receipt = [...(t.receipt ?? []), ...(min !== null && t.id !== 'idle-minutes' ? [{ label: 'Distance from today', value: minLabel(min) }] : [])];
  return (
    <div className="ub-strip" style={{ ['--acc' as string]: ACCENT[t.id] }}>
      {!bare && photo && (
        <span className="ub-sstop-art big">
          <Shot photo={photo} />
        </span>
      )}
      {!bare && <h3 className="ub-side-h">{t.name}</h3>}
      {!bare && <p className="ub-side-p">{t.blurb}</p>}
      {t.result && (
        <p className="ub-bigstat">
          <b>{t.result.value}</b>
          <span>{t.result.sub}</span>
        </p>
      )}
      {!bare && t.did && (
        <ul className="ub-ticks">
          {t.did.map((x) => (
            <li key={x}>
              <i aria-hidden="true">
                <Icon name="check" size={12} w={3.2} />
              </i>
              <span>{x}</span>
            </li>
          ))}
        </ul>
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
  const { where, onTrip, route, screen, hot, setHot, look, ride, openSheet, journeyTrip, tripMode, setStack } = app;
  /** The car's drive on the Quick ride: how many times it has been replayed, the stop it is passing, and whether it has arrived. */
  const [replay, setReplay] = useState(0);
  const [pass, setPass] = useState<{ key: string; stop: StopId }>({ key: '', stop: 'you' });
  const [done, setDone] = useState('');
  const [copied, setCopied] = useState(false);
  const ex = EXPLAIN[where];
  const t = onTrip ?? (route ? getTrip(journeyTrip) : null);
  const accent = t ? ACCENT[t.id] : look && where === 'search' ? ACCENT[look.trip] : ACCENT[PERSONAS.find((p) => p.id === persona)!.lead];
  const reserve = () => openSheet('reserve');

  /* ---------------------------------------------------------------- a route is on the map */
  let body;
  const browsing = where === 'search';
  const onMap = route ?? (browsing ? { from: 'st-dominics' as StopId, to: 'you' as StopId } : null);
  if (onMap) {
    const { between, minutes } = routeBetween(onMap.from, onMap.to);
    const stops = [stop(onMap.from), ...between, stop(onMap.to)];
    const inDetails = screen.s === 'details' && !!onTrip;
    const quick = inDetails && tripMode === 'quick' && onTrip!.id !== 'idle-minutes';
    const full = inDetails && tripMode === 'full';
    const driveKey = quick ? `${onTrip!.id}:${replay}` : null;
    const arrived = !!driveKey && done === driveKey;
    const passing = quick && pass.key === driveKey ? stop(pass.stop) : null;
    const setMode = (m: 'quick' | 'full') => onTrip && setStack((st) => [...st.slice(0, -1), { s: 'details', trip: onTrip.id, mode: m }]);

    /* the column beside the map */
    let side;
    if (quick) {
      // Quick ride: the map does the talking; this column names the stop the car is passing
      const at = passing ?? stops[0];
      const n = stops.findIndex((x) => x.id === at.id) + 1;
      side = arrived ? (
        <div className="ub-side-in" key="arrived">
          <p className="ub-side-k">Arrived</p>
          <SideTrip t={onTrip!} />
          <div className="ub-side-btns">
            <button type="button" className="ub-btn solid" onClick={() => setMode('full')}>
              Read the full story
            </button>
            <button type="button" className="ub-btn line" onClick={() => setReplay((x) => x + 1)}>
              Replay the ride
            </button>
          </div>
        </div>
      ) : (
        <div className="ub-side-in">
          <p className="ub-side-k">
            Now passing · stop {n} of {stops.length}
          </p>
          <SideStop s={at} key={at.id} />
          <p className="ub-side-hint">The car is driving the whole route. Each stop shows its photo as it passes.</p>
        </div>
      );
    } else if (full) {
      // Full story: every event on the route, described
      side = (
        <div className="ub-side-in scroll" tabIndex={0} role="group" aria-label={`Every event on the way to ${onTrip!.name}`}>
          <p className="ub-side-k">The full story</p>
          <h3 className="ub-side-h">{onTrip!.name}</h3>
          <p className="ub-side-p">{onTrip!.blurb}</p>
          {onTrip!.problem && (
            <>
              <p className="ub-side-k sub">The problem</p>
              <p className="ub-side-p">{onTrip!.problem}</p>
            </>
          )}
          {onTrip!.id === 'idle-minutes' &&
            TEARDOWN.parts.map((x) => (
              <div key={x.heading}>
                <p className="ub-side-k sub">{x.heading}</p>
                <p className="ub-side-p">{x.text}</p>
              </div>
            ))}
          {[
            { title: `What happened at ${onTrip!.name}`, list: stops.filter((x) => x.type !== 'you' && x.trip === onTrip!.id).sort((a, b) => minutesAway(b.when) - minutesAway(a.when)) },
            { title: onTrip!.id === 'story' ? 'Stop by stop' : 'Also on the way there', list: stops.filter((x) => x.type !== 'you' && x.trip !== onTrip!.id) },
          ].map(
            (g) =>
              g.list.length > 0 && (
                <div key={g.title} className="ub-events-group">
                  <p className="ub-side-k sub">{g.title}</p>
                  <ol className="ub-events">
                    {g.list.map((x) => (
                      <li key={x.id} className={hot === x.id ? 'hot' : ''} onMouseEnter={() => setHot(x.id)} onMouseLeave={() => setHot(null)}>
                        <SideStop s={x} small />
                      </li>
                    ))}
                  </ol>
                </div>
              ),
          )}
          {onTrip!.result && <SideTrip t={onTrip!} bare />}
        </div>
      );
    } else if (look) {
      // browsing: everything about the place last pointed at
      const lt = getTrip(look.trip);
      const ls = look.stop ? stop(look.stop) : null;
      side = (
        <div className="ub-side-in scroll" key={`${look.stop ?? ''}${look.trip}`} tabIndex={0} role="group" aria-label={`About ${ls?.name ?? lt.name}`}>
          <p className="ub-side-k">{browsing || !onTrip ? 'You are pointing at' : 'Your destination'}</p>
          {ls && ls.name !== lt.name && <SideStop s={ls} />}
          <SideTrip t={lt} />
          {(browsing || app.onJourney) && (
            <div className="ub-side-btns">
              <button type="button" className="ub-btn solid" onClick={() => ride(lt.id)}>
                Ride to {lt.name}
              </button>
            </div>
          )}
        </div>
      );
    } else {
      side = (
        <div className="ub-side-in">
          <p className="ub-side-k">The whole map</p>
          <h3 className="ub-side-h">Point at any place.</h3>
          <p className="ub-side-p">Everything about it shows up here: what it was, the photos, and what came out of it. Click a place to ride there.</p>
          <ul className="ub-legend">
            <li>
              <i className="sq" />
              Square pins are places Ram belonged to
            </li>
            <li>
              <i className="dot" />
              Dots are what he did there
            </li>
            <li>
              <i className="you" />
              The blue dot is today
            </li>
          </ul>
        </div>
      );
    }

    body = (
      <div className="ub-three">
        <div className="ub-mapbox">
          <LifeMap
            from={onMap.from}
            to={onMap.to}
            detail
            controls
            fit="all"
            noBadge={browsing}
            hot={hot}
            onHot={setHot}
            onPick={(id) => ride(stop(id).trip)}
            drive={driveKey}
            onPass={(id) => driveKey && setPass({ key: driveKey, stop: id })}
            onDone={() => driveKey && setDone(driveKey)}
            searching={screen.s === 'finding'}
            reducedMotion={reducedMotion}
          />
          <p className="ub-mapbox-sum">
            {browsing ? (
              <>
                <b>{STOPS.filter((x) => x.type === 'place').length} places</b>
                {STOPS.filter((x) => x.type === 'dot').length} stops between them · 1 min is 1 month of Ram’s life
              </>
            ) : (
              <>
                <b>{minLabel(minutes)}</b>
                {between.length} {between.length === 1 ? 'stop' : 'stops'} on the way · 1 min is 1 month
              </>
            )}
          </p>
        </div>
        <aside className="ub-side" style={{ ['--acc' as string]: accent }}>
          {side}
        </aside>
      </div>
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
      <div className={`ub-panel-body w-${where}`} key={route || where === 'search' ? 'map' : where}>
        {body}
      </div>
    </section>
  );
}
