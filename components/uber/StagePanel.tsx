'use client';

import { useState, type ReactNode } from 'react';
import { PROFILE } from '@/lib/data';
import {
  ABOUT,
  ACTIVITY,
  BILLBOARD,
  EXPERIENCE,
  EXPLAIN,
  HERO_FACTS,
  IDEA,
  LOGO,
  TEARDOWN,
  INBOX,
  PERSONAS,
  REROUTES,
  RESERVE,
  RIDE,
  SERVICES,
  SHIPPED,
  STAGE,
  STOPS,
  minLabel,
  minutesAway,
  monthLabel,
  stop,
  trip as getTrip,
  type PersonaId,
  type Stop,
  type StopId,
  type Trip,
  type TripId,
} from '@/lib/uber';
import { PORTRAIT, stopPhoto, stopStory, tripPhotos, type Photo } from '@/lib/uber-photos';
import LifeMap, { routeBetween } from './LifeMap';
import { Icon } from './icons';
import Mark from './Mark';
import { FeeSplit, TabletDemo, TripMeter } from './TabletDemo';
import type { Ride } from './useRide';

/** The reroute note shown above the first stop after a turn in the road. */
const REROUTE: Partial<Record<StopId, string>> = Object.fromEntries(REROUTES.map((r) => [r.before, r.text]));

/** A photo that quietly steps aside if it cannot load. */
export function Shot({ photo, className = '', eager }: { photo: Photo; className?: string; eager?: boolean }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={`ub-shot ${photo.contain ? 'contain' : ''} ${className}`} src={photo.src} alt={photo.alt} loading={eager ? 'eager' : 'lazy'} onError={(e) => (e.currentTarget.style.visibility = 'hidden')} />;
}

const when = (s: Stop) => (s.type === 'you' ? 'Now' : s.monthAssumed ? s.when.slice(0, 4) : monthLabel(s.when, true));
const firstSentence = (text: string) => text.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? text;

type Row = { label: string; value: string };

/**
 * The column beside the map says one thing at a time, with no boxes: a small label, a photo, a name,
 * one sentence, at most three ruled rows and one action. Anything longer lives in the phone's Trip details
 * or in the project's Details dialog.
 */
function Brief({ label, bar, photo, meta, name, text, big, rows = [], children }: { label: string; bar?: number; photo?: Photo | null; meta?: string; name: string; text?: string; big?: { value: string; sub: string }; rows?: Row[]; children?: ReactNode }) {
  return (
    <div className="ub-brief">
      <p className="ub-kicker">{label}</p>
      {bar !== undefined && (
        <span className="ub-bar" aria-hidden="true">
          <i style={{ width: `${Math.round(bar * 100)}%` }} />
        </span>
      )}
      <div className="ub-brief-body" key={name}>
        {photo && (
          <span className="ub-brief-art">
            <Shot photo={photo} eager />
          </span>
        )}
        {meta && <p className="ub-brief-meta">{meta}</p>}
        <h3 className={name.length > 26 ? 'long' : ''}>{name}</h3>
        {text && <p className="ub-brief-p">{text}</p>}
        {big && (
          <p className="ub-brief-big">
            <b>{big.value}</b>
            <span>{big.sub}</span>
          </p>
        )}
        {rows.length > 0 && (
          <dl className="ub-receipt">
            {rows.slice(0, 3).map((r) => (
              <div key={r.label}>
                <dt>{r.label}</dt>
                <i aria-hidden="true" />
                <dd>{r.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
      {children && <div className="ub-brief-act">{children}</div>}
    </div>
  );
}

/** The stops a full story visits: the trip's own, in the order they happened. */
const ownStops = (t: Trip): Stop[] => (t.id === 'idle-minutes' ? [] : STOPS.filter((x) => x.type !== 'you' && (t.id === 'story' || x.trip === t.id)));

/** One trip as a tile in a grid: its photo, name and one line. */
function Tile({ t, onOpen, onInfo, i }: { t: Trip; onOpen: (id: TripId) => void; onInfo?: (id: TripId) => void; i: number }) {
  const photo = tripPhotos(t.id)[0];
  return (
    <div className="ub-tile" style={{ ['--i' as string]: i }}>
      <button type="button" onClick={() => onOpen(t.id)}>
        <span className="ub-tile-art">{photo && <Shot photo={photo} />}</span>
        <b>{t.name}</b>
        <small>{t.result ? `${t.result.value} · ${t.result.sub}` : t.sub}</small>
      </button>
      {onInfo && (
        <button type="button" className="ub-link" onClick={() => onInfo(t.id)}>
          Details
        </button>
      )}
    </div>
  );
}

/**
 * What opens beside a place on the map: its photo and logo, where and when it was, the headline number,
 * what happened there, and the way into the whole story.
 */
function PlaceCard({ s, onDetails, onRide }: { s: Stop; onDetails: (id: TripId) => void; onRide?: (id: TripId) => void }) {
  const t = getTrip(s.trip);
  const own = s.name !== t.name && s.type === 'dot' ? s : null;
  const tell = own ? stopStory(own.id) : null;
  const photo = own ? (stopPhoto(own.id) ?? tripPhotos(t.id)[0]) : tripPhotos(t.id)[0];
  const marks = own ? [] : STOPS.filter((x) => x.type === 'dot' && x.trip === t.id).slice(0, 3);
  return (
    <div className="ub-pc" key={s.id}>
      <span className="ub-pc-art">
        {photo && <Shot photo={photo} eager />}
        <span className="ub-pc-away">{minLabel(minutesAway(s.when))} away</span>
      </span>
      <div className="ub-pc-head">
        <span className={`ub-pc-mark ${LOGO[t.id] ? 'logo' : ''}`}>
          <Mark id={t.id} size={LOGO[t.id] ? 44 : 30} />
        </span>
        <div>
          <p className="ub-pc-kick">{own ? `${when(own)} · at ${t.name}` : `${when(s)}${s.note ? ` · ${s.note.split('.')[0]}` : ''}`}</p>
          <h3>{tell ? tell.title : t.name}</h3>
        </div>
      </div>
      <p className="ub-pc-p">{tell ? (tell.body ? firstSentence(tell.body) : t.sub) : t.blurb}</p>
      {!own && t.result && (
        <p className="ub-pc-big">
          <b>{t.result.value}</b>
          <span>{t.result.sub}</span>
        </p>
      )}
      {marks.length > 0 && (
        <ul className="ub-pc-marks">
          {marks.map((m) => (
            <li key={m.id}>
              <i aria-hidden="true" />
              <span>{m.name}</span>
              <small>{when(m)}</small>
            </li>
          ))}
        </ul>
      )}
      <div className="ub-pc-act">
        <button type="button" className="ub-btn solid" onClick={() => onDetails(t.id)}>
          What Ram did here
        </button>
        {onRide && (
          <button type="button" className="ub-link" onClick={() => onRide(t.id)}>
            Ride there
          </button>
        )}
      </div>
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
 * The panel beside the phone. It shows the phone's current moment at full size, and never repeats
 * what the phone is already saying.
 */
export default function StagePanel({ app, persona, onPersona, reducedMotion }: Props) {
  const { where, onTrip, route, screen, hot, setHot, ride, openSheet, tripMode, setStack, facet, setFacet, setProject } = app;
  /** The car's drive on the Quick ride: how many times it has been replayed, the stop it is passing, and whether it has arrived. */
  const [replay, setReplay] = useState(0);
  const [pass, setPass] = useState<{ key: string; stop: StopId }>({ key: '', stop: 'you' });
  const [done, setDone] = useState('');
  /** The drive that is paused, by its key, so a new ride never starts paused. */
  const [pausedKey, setPausedKey] = useState('');
  const [skip, setSkip] = useState('');
  /** Where the reader is in a full story, by trip. */
  const [story, setStory] = useState<{ trip: string; i: number }>({ trip: '', i: 0 });
  const [copied, setCopied] = useState(false);
  const ex = EXPLAIN[where];
  const reserve = () => openSheet('reserve');

  let body;
  const browsing = where === 'search';
  // a sheet open in the phone (Reserve Ram, Riding with, Lost and found) takes over the panel, whatever is behind it
  const onMap = app.sheet ? null : (route ?? (browsing ? { from: 'st-dominics' as StopId, to: 'you' as StopId } : null));

  if (onMap) {
    /* ---------------------------------------------------------------- a map, and one thing said beside it */
    const { between, minutes } = routeBetween(onMap.from, onMap.to);
    const stops = [stop(onMap.from), ...between, stop(onMap.to)];
    const inDetails = screen.s === 'details' && !!onTrip;
    const quick = inDetails && tripMode === 'quick' && onTrip!.id !== 'idle-minutes';
    const own = inDetails && tripMode === 'full' ? ownStops(onTrip!) : [];
    const tale = own.length > 0;
    const driveKey = quick ? `${onTrip!.id}:${replay}` : null;
    const arrived = !!driveKey && done === driveKey;
    const paused = !!driveKey && pausedKey === driveKey;
    const passing = quick && pass.key === driveKey ? stop(pass.stop) : null;
    // the full story: step 0 is the start of the trip, then one step for each of its own stops
    const at = tale ? (story.trip === onTrip!.id ? Math.min(story.i, own.length) : 0) : 0;
    const go = (n: number) => setStory({ trip: onTrip!.id, i: Math.max(0, Math.min(own.length, n)) });
    const carAt = tale ? own[Math.max(0, at - 1)].id : null;
    const mapFrom = tale ? own[0].id : onMap.from;
    const mapTo = tale ? own[own.length - 1].id : onMap.to;
    const setMode = (m: 'quick' | 'full') => onTrip && setStack((st) => [...st.slice(0, -1), { s: 'details', trip: onTrip.id, mode: m }]);

    // what is docked on the map (a ride or a story in progress), and what opens beside a place being pointed at
    let side: ReactNode = null;
    let pop: ReactNode = null;
    if (quick && !arrived) {
      // Quick ride, driving: the stop the car is passing
      const s = passing ?? stops[0];
      const n = stops.findIndex((x) => x.id === s.id) + 1;
      const tell = stopStory(s.id);
      side = (
        <Brief label={`Now passing · ${n} of ${stops.length}`} bar={n / stops.length} photo={stopPhoto(s.id)} meta={s.type === 'you' ? 'Now' : `${when(s)} · ${minLabel(minutesAway(s.when))} away`} name={tell.title} text={tell.body ? firstSentence(tell.body) : undefined}>
          <button type="button" className="ub-link" onClick={() => setPausedKey(paused ? '' : (driveKey ?? ''))} aria-pressed={paused}>
            {paused ? 'Resume' : 'Pause'}
          </button>
          <button type="button" className="ub-link" onClick={() => driveKey && setSkip(driveKey)}>
            Skip to the end
          </button>
        </Brief>
      );
    } else if (quick) {
      // Quick ride, arrived: where the car is, and the way into the longer story
      side = (
        <Brief label="Arrived" photo={tripPhotos(onTrip!.id)[0]} name={onTrip!.name} text={onTrip!.blurb}>
          <button type="button" className="ub-btn solid" onClick={() => setMode('full')}>
            Read the full story
          </button>
          <button
            type="button"
            className="ub-link"
            onClick={() => {
              setPausedKey('');
              setReplay((x) => x + 1);
            }}
          >
            Replay the ride
          </button>
        </Brief>
      );
    } else if (tale) {
      // Full story: the car is parked at one stop, and this tells that stop
      const s = at > 0 ? own[at - 1] : null;
      const tell = s ? stopStory(s.id) : null;
      const last = at === own.length;
      side = (
        <Brief
          label={`The full story · ${at} of ${own.length}`}
          bar={at / own.length}
          photo={s ? stopPhoto(s.id) : tripPhotos(onTrip!.id)[0]}
          meta={s ? `${REROUTE[s.id] ? `${REROUTE[s.id]} · ` : ''}${when(s)} · ${minLabel(minutesAway(s.when))} away` : undefined}
          name={tell ? tell.title : onTrip!.name}
          text={tell ? tell.body || undefined : `${own.length} ${own.length === 1 ? 'stop' : 'stops'}, in the order they happened. The car drives to each one and waits while you read.`}
        >
          {last ? (
            <button type="button" className="ub-btn solid" onClick={reserve}>
              Reserve Ram
            </button>
          ) : (
            <button type="button" className="ub-btn solid" onClick={() => go(at + 1)}>
              {at === 0 ? 'Start' : 'Next stop'}
              <Icon name="arrow" size={16} />
            </button>
          )}
          {at > 0 && (
            <button type="button" className="ub-link" onClick={() => go(at - 1)}>
              Back
            </button>
          )}
        </Brief>
      );
    } else if (onTrip && inDetails) {
      // a trip with no stops of its own to drive through: the phone has the whole story
      side = <Brief label={tripMode === 'full' ? 'The full story' : 'Your destination'} name={onTrip.name} text={tripMode === 'full' ? 'The whole story is in the phone: the problem, the work and the receipt.' : onTrip.blurb} />;
    }

    // pointing at a place, on the map or in the phone's list: a card opens beside it, and closes when the pointer leaves
    const ps = hot && hot !== 'you' && !(quick && !arrived) ? stop(hot) : null;
    if (ps) {
      pop = <PlaceCard s={ps} onDetails={setProject} onRide={onTrip?.id !== ps.trip ? ride : undefined} />;
    }

    body = (
      <div className="ub-three">
        <div className="ub-mapbox">
          <LifeMap
            from={mapFrom}
            to={mapTo}
            carAt={carAt}
            hoverCard={pop}
            dock={side}
            pad={side ? { left: 300 } : undefined}
            detail
            controls
            fit="all"
            noBadge={browsing}
            hot={hot}
            onHot={setHot}
            onPick={(id) => setProject(stop(id).trip)}
            drive={driveKey}
            paused={paused}
            skip={skip}
            onPass={(id) => driveKey && setPass({ key: driveKey, stop: id })}
            onDone={() => driveKey && setDone(driveKey)}
            searching={screen.s === 'finding'}
            reducedMotion={reducedMotion}
          />
          {!tale && (
            <p className="ub-mapbox-sum">
              {browsing ? (
                'Point at any place to see what it was. Click it to read what Ram did there.'
              ) : (
                <>
                  <b>{minLabel(minutes)}</b>
                  {between.length} {between.length === 1 ? 'stop' : 'stops'} on the way
                </>
              )}
            </p>
          )}
        </div>
      </div>
    );
  } else if (where === 'home') {
    /* ---------------------------------------------------------------- nothing tapped yet: the arrival, Ram, and three results */
    body = (
      <div className="ub-home">
        <div className="ub-home-copy">
          <p className="ub-status sm">
            <Icon name="check" size={24} w={2.6} />
            {STAGE.status}
          </p>
          <h3>{STAGE.headline}</h3>
          <p>{STAGE.body}</p>
          <div className="ub-home-acts">
            <button type="button" className="ub-btn solid tall" onClick={() => ride('story')}>
              {BILLBOARD.start}
            </button>
            <button type="button" className="ub-btn line tall" onClick={reserve}>
              {BILLBOARD.reserve}
            </button>
          </div>
        </div>
        <span className="ub-face">
          <Shot photo={PORTRAIT} eager />
        </span>
        <dl className="ub-proofs">
          {HERO_FACTS.map((f) => (
            <div key={f.trip}>
              <dt>
                <button type="button" onClick={() => ride(f.trip)}>
                  {f.label}
                  <Icon name="arrow" size={15} />
                </button>
              </dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  } else if (where === 'idea') {
    /* ---------------------------------------------------------------- the idea for Uber: a tablet to try, and what it does to one trip */
    const photo = tripPhotos('idle-minutes')[0];
    const part = (h: string) => TEARDOWN.parts.find((x) => x.heading === h)?.text;
    body = (
      <div className="ub-idea">
        <div className="ub-idea-try">
          <p className="ub-kicker">The rider’s tablet. Try it</p>
          <TabletDemo step={app.survey} onStep={app.setSurvey} />
          <p className="ub-kicker">
            The driver’s trip <span className="ub-idea-tag">{IDEA.notes.label}</span>
          </p>
          <TripMeter step={app.survey} />
          <p className="ub-idea-note">
            {IDEA.notes.fare}. {IDEA.notes.driver}.
          </p>
        </div>
        <div className="ub-idea-say">
          <p className="ub-kicker">{IDEA.kicker}</p>
          <h3>{IDEA.line}</h3>
          <p className="ub-idea-p">{part('The problem')}</p>
          <p className="ub-idea-p">{part('The insight')}</p>
          <FeeSplit />
          {IDEA.research.length > 0 && (
            <dl className="ub-idea-res">
              {IDEA.research.map((r) => (
                <div key={r.label}>
                  <dd>{r.value}</dd>
                  <dt>
                    {r.label} <small>{r.source}</small>
                  </dt>
                </div>
              ))}
            </dl>
          )}
          {photo && (
            <figure className="ub-idea-fig">
              <span>
                <Shot photo={photo} eager />
              </span>
              <figcaption>{IDEA.evidence.caption}</figcaption>
            </figure>
          )}
        </div>
      </div>
    );
  } else if (where === 'reserve') {
    body = (
      <div className="ub-home">
        <div className="ub-home-copy">
          <h3>{RESERVE.title}</h3>
          <p>{RESERVE.line}</p>
          <p className="ub-mail">{PROFILE.email}</p>
          <a className="ub-btn solid tall" href={`mailto:${PROFILE.email}?subject=${encodeURIComponent(RESERVE.subject)}`}>
            {RESERVE.email}
          </a>
          <p className="ub-links">
            <a className="ub-link" href={PROFILE.linkedin} target="_blank" rel="noreferrer">
              {RESERVE.linkedin}
            </a>
            <button
              type="button"
              className="ub-link"
              onClick={() =>
                navigator.clipboard
                  .writeText(PROFILE.email)
                  .then(() => setCopied(true))
                  .catch(() => {})
              }
            >
              <span aria-live="polite">{copied ? RESERVE.copied : `${RESERVE.copy} the address`}</span>
            </button>
          </p>
        </div>
        <span className="ub-face">
          <Shot photo={PORTRAIT} eager />
        </span>
      </div>
    );
  } else if (where === 'account') {
    /* ---------------------------------------------------------------- About Ram */
    const f = ABOUT.facets.find((x) => x.id === facet) ?? ABOUT.facets[0];
    const fp = stopPhoto(f.photo);
    body = (
      <div className="ub-abt">
        <h3>{ABOUT.lede}</h3>
        <div className="ub-tabs" role="tablist" aria-label="The sides of Ram">
          {ABOUT.facets.map((x) => (
            <button key={x.id} type="button" role="tab" aria-selected={x.id === f.id} className={x.id === f.id ? 'on' : ''} onClick={() => setFacet(x.id)}>
              {x.label}
            </button>
          ))}
        </div>
        <div className="ub-abt-side" key={f.id} role="tabpanel">
          {fp && (
            <span className="ub-abt-art">
              <Shot photo={fp} eager />
            </span>
          )}
          <div>
            <h4>{f.title}</h4>
            <p>{f.text}</p>
            <button type="button" className="ub-btn solid" onClick={() => ride(f.trip)}>
              Ride to {getTrip(f.trip).name}
              <Icon name="arrow" size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  } else if (where === 'switch') {
    body = (
      <div className="ub-plist" role="radiogroup" aria-label="Riding with">
        {PERSONAS.map((p) => (
          <button key={p.id} type="button" role="radio" aria-checked={p.id === persona} className={p.id === persona ? 'on' : ''} onClick={() => onPersona(p.id)}>
            <b>{p.label}</b>
            <span>{p.card.line}</span>
            {p.id === persona && <Icon name="check" size={22} w={2.6} />}
          </button>
        ))}
      </div>
    );
  } else {
    /* ---------------------------------------------------------------- a grid of trips for this screen */
    const lists: Partial<Record<typeof where, TripId[]>> = {
      shipped: SHIPPED,
      services: [...new Set([...SERVICES.main, ...SERVICES.more].map((x) => x.trip))],
      activity: [...EXPERIENCE.flatMap((j) => (j.trip ? [j.trip] : [])), ACTIVITY.upcomingTrip],
      inbox: ['newral', 'trucost', 'ciena'],
    };
    const ids = lists[where] ?? [];
    body = (
      <>
        {where === 'inbox' && (
          <blockquote className="ub-say">
            <p>{INBOX[0].text}</p>
            <footer>
              {INBOX[0].from}, {INBOX[0].when.toLowerCase()}. Three more messages are waiting on real quotes from the people he worked with here.
            </footer>
          </blockquote>
        )}
        {where === 'lost' && (
          <blockquote className="ub-say">
            <p>This chapter is still being written.</p>
          </blockquote>
        )}
        <div className="ub-grid">
          {ids.map((id, i) => (
            <Tile key={id} t={getTrip(id)} onOpen={ride} onInfo={where === 'shipped' ? setProject : undefined} i={i} />
          ))}
        </div>
      </>
    );
  }

  return (
    <section className="ub-panel" aria-label="What the phone is showing">
      {!(where === 'home' && !app.sheet) && (
        <>
      <header className="ub-cap">
        <div className="ub-cap-top">
          <p className="ub-kicker">{STAGE.nowShowing}</p>
          <span className="ub-cap-acts">
            {(where !== 'home' || app.sheet) && (
              <button
                type="button"
                className="ub-link"
                onClick={() => {
                  app.closeSheet();
                  app.goTab('home', 'ram');
                }}
              >
                Home
              </button>
            )}
            <button type="button" className="ub-cap-reserve" onClick={reserve}>
              {RIDE.reserve}
            </button>
          </span>
        </div>
        <div className="ub-cap-row" key={where}>
          <h2 aria-live="polite">
            {ex.title}
            {onTrip && !app.sheet && <span> · {onTrip.name}</span>}
          </h2>
          <p className="ub-cap-say">
            <b>In Uber:</b> {ex.uber}. <b>Here:</b> {ex.here}
          </p>
        </div>
      </header>
        </>
      )}
      <div className={`ub-panel-body w-${where}`} key={!app.sheet && (route || where === 'search') ? 'map' : where}>
        {body}
      </div>
    </section>
  );
}
