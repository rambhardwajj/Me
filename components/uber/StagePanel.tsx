'use client';

import { useState, type ReactNode } from 'react';
import { PROFILE } from '@/lib/data';
import {
  ABOUT,
  ACTIVITY,
  EXPERIENCE,
  EXPLAIN,
  HERO_FACTS,
  IDEA,
  LOGO,
  INBOX,
  LOST_PARTS,
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
  ownStops,
  stop,
  trip as getTrip,
  type PersonaId,
  type Stop,
  type StopId,
  type Trip,
  type TripId,
} from '@/lib/uber';
import { PORTRAIT, stopPhoto, stopStory, tripPhotos, type Photo } from '@/lib/uber-photos';
import { routeBetween } from './LifeMap';
import { Icon, Pict } from './icons';
import Mark from './Mark';
import { IdeaGraphic } from './IdeaGraphics';
import StreetMap from './StreetMap';
import { useRideStep } from './useRideStep';
import { GEO_HOME, PLACE_GEO, rideTo } from '@/lib/uber-geo';
import type { Ride } from './useRide';

/** The reroute note shown above the first stop after a turn in the road. */
const REROUTE: Partial<Record<StopId, string>> = Object.fromEntries(REROUTES.map((r) => [r.before, r.text]));

/** A photo that quietly steps aside if it cannot load. */
export function Shot({ photo, className = '', eager }: { photo: Photo; className?: string; eager?: boolean }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={`ub-shot ${photo.contain ? 'contain' : ''} ${className}`} src={photo.src} alt={photo.alt} width={640} height={400} decoding="async" loading={eager ? 'eager' : 'lazy'} onError={(e) => (e.currentTarget.style.visibility = 'hidden')} />;
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
/** A ride being requested, the way a ride app plays it: finding a driver, connecting, confirmed. */
function PreRide({ step, name }: { step: number; name: string }) {
  const s = RIDE.steps[step];
  const last = RIDE.steps.length - 1;
  return (
    <div className={`ub-pre ${step === last ? 'ok' : ''}`} aria-live="polite">
      <p className="ub-kicker">{step === last ? 'Ride confirmed' : 'Requesting your ride'}</p>
      <h3 key={step}>{s.title}</h3>
      <p className="ub-pre-line">{s.line.replace('{name}', name)}</p>
      <span className="ub-bar" aria-hidden="true">
        <i style={{ width: `${Math.round(((step + 1) / RIDE.steps.length) * 100)}%` }} />
      </span>
      <ol className="ub-pre-steps">
        {RIDE.steps.map((x, i) => {
          const done = i < step || (i === step && i === last);
          return (
            <li key={x.short} className={done ? 'done' : i === step ? 'now' : ''}>
              <i aria-hidden="true">{done ? <Icon name="check" size={13} w={3.2} /> : i + 1}</i>
              {x.short}
            </li>
          );
        })}
      </ol>
      {step >= 1 && (
        <p className="ub-pre-drv">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PORTRAIT.src} alt="" width={46} height={46} loading="lazy" decoding="async" />
          <span>
            <b>Ram Bhardwaj</b>
            <small>Your driver. Product Manager</small>
          </span>
        </p>
      )}
    </div>
  );
}


/** One trip as a tile in a grid: its photo, name and one line. */
function Tile({ t, i }: { t: Trip; i: number }) {
  const photo = tripPhotos(t.id)[0];
  return (
    <div className="ub-tile" style={{ ['--i' as string]: i }}>
      <div className="it">
        <span className="ub-tile-art">{photo && <Shot photo={photo} />}</span>
        <b>{t.name}</b>
        <small>{t.result ? `${t.result.value} · ${t.result.sub}` : t.sub}</small>
      </div>
    </div>
  );
}

/**
 * What opens beside a place on the map: its photo and logo, where and when it was, the headline number,
 * what happened there, and the way into the whole story.
 */
function PlaceCard({ s }: { s: Stop }) {
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
    </div>
  );
}

type Props = {
  app: Ride;
  persona: PersonaId;
  reducedMotion: boolean;
};

/**
 * The panel beside the phone. It shows the phone's current moment at full size, and never repeats
 * what the phone is already saying.
 * It is a display, not a control (Ram, 26 Nov 2026): nothing here can be pressed. Every action lives in the phone,
 * so a visitor is never unsure which side to use. Pointing at a place on the map still shows what it was.
 */
export default function StagePanel({ app, persona, reducedMotion }: Props) {
  const { where, onTrip, route, screen, hot, setHot, tripMode, facet } = app;
  /** The stop the car is passing on a ride. */
  const [pass, setPass] = useState<{ key: string; stop: StopId }>({ key: '', stop: 'you' });
  const ex = EXPLAIN[where];
  // a ride being requested: the same three steps the phone is showing
  const rideStep = useRideStep(screen.s === 'finding' ? `${screen.trip}:${app.driveNo}` : null, reducedMotion);

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
    // the ride itself is the phone's: it names the drive, says when to skip it, and is told when the car arrives
    const driveKey = quick ? app.driveKey : null;
    const arrived = !!driveKey && app.driveDone === driveKey;
    const passing = quick && pass.key === driveKey ? stop(pass.stop) : null;
    // the full story: step 0 is the start of the trip, then one step for each of its own stops
    const at = tale ? (app.story.trip === onTrip!.id ? Math.min(app.story.i, own.length) : 0) : 0;
    const carAt = tale ? own[Math.max(0, at - 1)].id : null;
    const mapFrom = tale ? own[0].id : onMap.from;
    const mapTo = tale ? own[own.length - 1].id : onMap.to;

    // what is docked on the map (a ride or a story in progress), and what opens beside a place being pointed at
    let side: ReactNode = null;
    let pop: ReactNode = null;
    // a ride from "Ram, today" to one place takes the real road straight there; anything else is a stretch of Ram's whole road
    const rideId = onTrip && !(inDetails && tripMode === 'full') ? rideTo(onTrip) : null;
    const leg = rideId ? PLACE_GEO[rideId] : null;
    // where the ride ends, in words: a project ends at the institute it came out of
    const legTo = rideId && leg && onTrip ? (stop(rideId).name !== onTrip.name ? `To ${stop(rideId).name}, ${leg.city}` : leg.city === GEO_HOME.city ? `Across ${leg.city}` : `${GEO_HOME.city} to ${leg.city}`) : '';
    // what happened there, in order: the dots on the road to it
    const requesting = screen.s === 'finding' && !!onTrip;
    const legEvents = leg && onTrip ? STOPS.filter((x) => x.type === 'dot' && x.trip === onTrip.id) : [];
    if (requesting) {
      side = <PreRide step={rideStep} name={onTrip!.name} />;
    } else if (leg && quick && !arrived && passing && legEvents.some((x) => x.id === passing.id)) {
      // on a real road, driving: the event the car has just passed
      const n = legEvents.findIndex((x) => x.id === passing.id) + 1;
      const tell = stopStory(passing.id);
      side = (
        <Brief label={`Now passing · ${n} of ${legEvents.length}`} bar={n / (legEvents.length + 1)} photo={stopPhoto(passing.id)} meta={when(passing)} name={tell.title} text={tell.body ? firstSentence(tell.body) : undefined} />
      );
    } else if (leg && quick && !arrived) {
      side = (
        <Brief label="On the way" photo={tripPhotos(onTrip!.id)[0]} meta={legTo} name={onTrip!.name} text={onTrip!.blurb} />
      );
    } else if (quick && !arrived) {
      // Quick ride, driving: the stop the car is passing
      const s = passing ?? stops[0];
      const n = stops.findIndex((x) => x.id === s.id) + 1;
      const tell = stopStory(s.id);
      side = (
        <Brief label={`Now passing · ${n} of ${stops.length}`} bar={n / stops.length} photo={stopPhoto(s.id)} meta={s.type === 'you' ? 'Now' : `${when(s)} · ${minLabel(minutesAway(s.when))} away`} name={tell.title} text={tell.body ? firstSentence(tell.body) : undefined} />
      );
    } else if (quick) {
      // Quick ride, arrived: where the car is, and the way into the longer story
      side = (
        <Brief label="Arrived" photo={tripPhotos(onTrip!.id)[0]} name={onTrip!.name} text={onTrip!.blurb} />
      );
    } else if (tale) {
      // Full story: the car is parked at one stop, and this tells that stop
      const s = at > 0 ? own[at - 1] : null;
      const tell = s ? stopStory(s.id) : null;
      side = (
        <Brief
          label={`The full story · ${at} of ${own.length}`}
          bar={at / own.length}
          photo={s ? stopPhoto(s.id) : tripPhotos(onTrip!.id)[0]}
          meta={s ? (s.type === 'you' ? 'Now' : `${REROUTE[s.id] ? `${REROUTE[s.id]} · ` : ''}${when(s)} · ${minLabel(minutesAway(s.when))} away`) : undefined}
          name={tell ? tell.title : onTrip!.name}
          text={tell ? tell.body || undefined : `${own.length} ${own.length === 1 ? 'stop' : 'stops'}, in the order they happened. Press Start in the phone: the car drives to each one and waits while you read.`}
        />
      );
    } else if (onTrip && inDetails) {
      // a trip with no stops of its own to drive through: the phone has the whole story
      side = <Brief label={tripMode === 'full' ? 'The full story' : 'Your destination'} name={onTrip.name} text={tripMode === 'full' ? 'The whole story is in the phone: the problem, the work and the receipt.' : onTrip.blurb} />;
    }

    // pointing at a place, on the map or in the phone's list: a card opens beside it, and closes when the pointer leaves
    const ps = hot && hot !== 'you' && !(quick && !arrived) ? stop(hot) : null;
    if (ps) {
      pop = <PlaceCard s={ps} />;
    }

    const landed = () => {
      if (!driveKey) return;
      app.setDriveDone(driveKey);
      // a ride started from a tile ends with what Ram did there, opened at full size
      if (onTrip && app.arrive === onTrip.id) app.landed(onTrip.id);
    };
    body = (
      <div className="ub-three">
        <div className="ub-mapbox">
          <StreetMap
            ride={leg ? onTrip : null}
            from={mapFrom}
            to={mapTo}
            carAt={carAt}
            hoverCard={pop}
            dock={side}
            pad={side ? { left: 300 } : undefined}
            detail
            browse={browsing}
            hot={hot}
            onHot={setHot}
            drive={driveKey}
            skip={app.driveSkip}
            onPass={(id) => driveKey && setPass({ key: driveKey, stop: id })}
            onDone={landed}
            searching={requesting && rideStep === 0}
            zoomOnCar={(requesting && rideStep === RIDE.steps.length - 1) || (quick && !arrived)}
            reducedMotion={reducedMotion}
          />
          {!tale && (
            <p className="ub-mapbox-sum">
              {browsing ? (
                'Point at any place to see what it was. To go there, use the phone.'
              ) : leg ? (
                <>
                  <b>Real streets</b>
                  {legTo}
                </>
              ) : (
                <>
                  <b>{minLabel(minutes)}</b>
                  {stops.length} stops, start to finish
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
          <div className="ub-how" aria-label={STAGE.howTitle}>
            <p className="ub-kicker">{STAGE.howTitle}</p>
            <ol>
              {STAGE.how.map((x, i) => (
                <li key={x.title} style={{ ['--i' as string]: i }}>
                  <i aria-hidden="true">{i + 1}</i>
                  <span>
                    <b>{x.title}</b>
                    <small>{x.text}</small>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <p className="ub-home-cue">
            <span className="ub-hand" aria-hidden="true" />
            {STAGE.cue}
          </p>
        </div>
        <span className="ub-face">
          <Shot photo={PORTRAIT} />
        </span>
        <dl className="ub-proofs">
          {HERO_FACTS.map((f) => (
            <div key={f.trip}>
              <dt>
                <span className="it">{f.label}</span>
              </dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  } else if (where === 'idea') {
    /* ---------------------------------------------------------------- the idea for Uber: one chapter at a time, one graphic each */
    const scenes = IDEA.scenes;
    const at = Math.max(0, Math.min(scenes.length - 1, app.ideaStep));
    const sc = scenes[at];
    body = (
      <div className="ub-idea">
        <ol className="ub-idea-tabs" aria-label="Chapters of the idea">
          {scenes.map((x, i) => (
            <li key={x.id} aria-current={i === at ? 'step' : undefined} className={`it ${i === at ? 'on' : i < at ? 'seen' : ''}`}>
              <i aria-hidden="true">{i + 1}</i>
              {x.tab}
            </li>
          ))}
        </ol>
        {/* inert: the tablet is tried in the phone, and this one mirrors it */}
        <div className="ub-idea-stage" key={sc.id} inert>
          <IdeaGraphic id={sc.id} survey={app.survey} onSurvey={app.setSurvey} />
        </div>
        <div className="ub-idea-foot" key={`t-${sc.id}`}>
          <div>
            <p className="ub-kicker">
              {at + 1} of {scenes.length} · {IDEA.kicker}
            </p>
            <h3>{sc.title}</h3>
            <p className="ub-idea-p">{sc.text}</p>
            {sc.note && <p className="ub-idea-note">{sc.note}</p>}
          </div>
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
          <p className="ub-home-cue">
            <Icon name="back" size={20} w={2.4} />
            Email, LinkedIn and copy are in the phone.
          </p>
        </div>
        <span className="ub-face">
          <Shot photo={PORTRAIT} />
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
        <ul className="ub-tabs" aria-label="The sides of Ram">
          {ABOUT.facets.map((x) => (
            <li key={x.id} aria-current={x.id === f.id ? 'true' : undefined} className={`it ${x.id === f.id ? 'on' : ''}`}>
              {x.label}
            </li>
          ))}
        </ul>
        <div className="ub-abt-side" key={f.id}>
          {fp && (
            <span className="ub-abt-art">
              <Shot photo={fp} eager />
            </span>
          )}
          <div>
            <h4>{f.title}</h4>
            <p>{f.text}</p>
          </div>
        </div>
      </div>
    );
  } else if (where === 'switch') {
    body = (
      <ul className="ub-plist" aria-label="Riding with">
        {PERSONAS.map((p) => (
          <li key={p.id} aria-current={p.id === persona ? 'true' : undefined} className={`it ${p.id === persona ? 'on' : ''}`}>
            <b>{p.label}</b>
            <span>{p.card.line}</span>
            {p.id === persona && <Icon name="check" size={22} w={2.6} />}
          </li>
        ))}
      </ul>
    );
  } else if (where === 'activity') {
    /* ---------------------------------------------------------------- Experience: a timeline, newest first, with what comes next on top */
    const next = getTrip(ACTIVITY.upcomingTrip);
    // the whole time at a place, from its oldest role's start to its newest role's end
    const span = (j: (typeof EXPERIENCE)[number]) => {
      const first = j.roles[j.roles.length - 1].when.split(' to ')[0];
      const last = j.roles[0].when.split(' to ').pop()!;
      return first === last ? first : `${first} to ${last}`;
    };
    body = (
      <ol className="ub-tl">
        <li className="next" style={{ ['--i' as string]: 0 }}>
          <span className="ub-tl-when">{ACTIVITY.upcoming}</span>
          <span className="ub-tl-node" aria-hidden="true">
            <Icon name="arrow" size={16} w={2.6} />
          </span>
          <div className="ub-tl-card">
            <span className="ub-tl-main">
              <b>{next.name}</b>
              <small>{next.sub}</small>
            </span>
          </div>
        </li>
        {EXPERIENCE.map((j, i) => (
          <li key={j.company} style={{ ['--i' as string]: i + 1 }}>
            <span className="ub-tl-when">{span(j)}</span>
            <span className="ub-tl-node" aria-hidden="true">
              {j.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={j.logo} alt="" width={44} height={44} loading="lazy" decoding="async" />
              ) : (
                <Pict name={j.icon} size={24} />
              )}
            </span>
            <div className="ub-tl-card">
              <span className="ub-tl-main">
                <b>{j.company}</b>
                <small>{j.what}</small>
                <span className="ub-tl-roles">
                  {j.roles.map((r) => (
                    <span key={r.title}>
                      <i aria-hidden="true" />
                      <b>{r.title}</b>
                      <em>{r.when}</em>
                    </span>
                  ))}
                </span>
              </span>
              <span className="ub-tl-side">
                {j.result && <span className="ub-tl-res">{j.result}</span>}
              </span>
            </div>
          </li>
        ))}
      </ol>
    );
  } else {
    /* ---------------------------------------------------------------- a grid of trips for this screen */
    const lists: Partial<Record<typeof where, TripId[]>> = {
      shipped: SHIPPED,
      services: [...new Set([...SERVICES.main, ...SERVICES.more].map((x) => x.trip))],
      inbox: ['newral', 'trucost', 'ciena'],
    };
    const ids = lists[where] ?? [];
    body = (
      <>
        {where === 'inbox' && (
          <blockquote className="ub-say">
            <p>{INBOX[0].text}</p>
            <footer>
              {INBOX[0].from}, {INBOX[0].when.toLowerCase()}.
            </footer>
          </blockquote>
        )}
        {where === 'lost' &&
          LOST_PARTS.map((x) => (
            <blockquote key={x.heading} className="ub-say">
              <footer>{x.heading}</footer>
              <p>{x.text}</p>
            </blockquote>
          ))}
        <div className="ub-grid">
          {ids.map((id, i) => (
            <Tile key={id} t={getTrip(id)} i={i} />
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
