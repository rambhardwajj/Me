'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { PROFILE } from '@/lib/data';
import {
  ABOUT,
  ACCOUNT,
  EXPERIENCE,
  ACTIVITY,
  CHAPTERS,
  HOME,
  IDEA,
  INBOX,
  LOGO,
  NOW_LABEL,
  PERSONAS,
  PLACES,
  REROUTES,
  RESERVE,
  RIDE,
  SEARCH,
  SERVICES,
  SHIPPED,
  STOPS,
  TEARDOWN,
  TILES,
  TRIBUTE,
  TRIPS,
  minLabel,
  minutesAway,
  stop,
  trip as getTrip,
  tripMinutes,
  type PersonaId,
  type Stop,
  type StopId,
  type Trip,
  type TripId,
} from '@/lib/uber';
import { routeBetween } from './LifeMap';
import { Icon, Pict, Solid } from './icons';
import Mark from './Mark';
import { IdeaGraphic } from './IdeaGraphics';
import StreetMap from './StreetMap';
import { requestMs, useRideStep } from './useRideStep';

/** The parts of the written teardown that the chapters do not already cover. */
const IDEA_MORE = ['What I saw', 'Why me', 'What exists already'];
import type { HomeTab, Mode, Ride, Sheet, Tab } from './useRide';
import { PORTRAIT, stopPhoto, tripPhotos, type Photo } from '@/lib/uber-photos';


export type PhoneHandle = {
  /** Move keyboard focus into the app. */
  focus: () => void;
};

type Props = {
  persona: PersonaId;
  onPersona: (p: PersonaId) => void;
  dark: boolean;
  onDark: (dark: boolean) => void;
  /** Where the visitor is in the app. The page owns it, so the panel beside the phone shows the same moment. */
  app: Ride;
  reducedMotion: boolean;
};

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'services', label: 'Services', icon: 'grid' },
  { id: 'activity', label: 'Experience', icon: 'receipt' },
  { id: 'account', label: 'Account', icon: 'user' },
];

/**
 * The not-affiliated line, on every screen. It also carries a small "Reserve Ram" link,
 * so the one action that counts is never more than a tap away.
 */
function Tribute({ className = 'rp-tribute', onReserve }: { className?: string; onReserve?: () => void }) {
  return (
    <p className={className}>
      {TRIBUTE}
      {onReserve && (
        <>
          {' '}
          <button type="button" className="rp-tribute-reserve" onClick={onReserve}>
            {RESERVE.title}
          </button>
        </>
      )}
    </p>
  );
}

/** A photo that steps aside if it cannot load. */
function Thumb({ photo, className = 'rp-thumb' }: { photo: Photo; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={`${className} ${photo.contain ? 'contain' : ''}`} src={photo.src} alt={photo.alt} loading="lazy" onError={(e) => (e.currentTarget.style.display = 'none')} />;
}

/** The photos of a trip, as a strip to swipe through. */
function Photos({ photos }: { photos: Photo[] }) {
  if (!photos.length) return null;
  return (
    <div className="rp-photos" tabIndex={photos.length > 2 ? 0 : undefined} role="group" aria-label="Photos from this trip">
      {photos.map((p) => (
        <figure key={p.src}>
          <Thumb photo={p} className="rp-photo" />
          <figcaption>{p.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}

/** The two ends of a trip as a route box: a dot, a line and a square. */
function Ends({ a, b, onSwap }: { a: ReactNode; b: ReactNode; onSwap?: () => void }) {
  return (
    <div className="rp-ends">
      <div className="rp-ends-rail" aria-hidden="true">
        <i />
        <b />
        <i className="sq" />
      </div>
      <div className="rp-ends-text">
        {a}
        {b}
      </div>
      {onSwap && (
        <button type="button" className="rp-ends-swap" aria-label="Swap start and destination" onClick={onSwap}>
          <Icon name="swap" size={20} w={2} />
        </button>
      )}
    </div>
  );
}

/** Every stop on the road between two places, in travel order. `full` adds the achievements between the places. */
function StopList({ from, to, full, onOpen, onHot }: { from: StopId; to: StopId; full: boolean; onOpen?: (id: TripId) => void; onHot?: (id: StopId | null) => void }) {
  const { between } = routeBetween(from, to);
  const all = [stop(from), ...between, stop(to)].filter((s) => full || s.type !== 'dot');
  const forward = minutesAway(stop(from).when) >= minutesAway(stop(to).when);
  return (
    <ol className="rp-stops">
      {all.map((s) => {
        const turn = forward ? REROUTES.find((r) => r.before === s.id) : undefined;
        const photo = stopPhoto(s.id);
        const body = (
          <>
            <span className={`rp-stop-mark ${s.type}`} aria-hidden="true" />
            <span className="rp-stop-text">
              <b>{s.name}</b>
              {s.note && <small>{s.note}</small>}
            </span>
            <span className="rp-stop-min">{s.type === 'you' ? 'Now' : minLabel(minutesAway(s.when))}</span>
            {photo && <Thumb photo={photo} />}
          </>
        );
        return (
          <li key={s.id} onMouseEnter={() => onHot?.(s.id)} onMouseLeave={() => onHot?.(null)}>
            {turn && <span className="rp-reroute">{turn.text}</span>}
            {onOpen && s.type !== 'you' ? (
              <button type="button" className="rp-stop" onClick={() => onOpen(s.trip)}>
                {body}
              </button>
            ) : (
              <span className="rp-stop">{body}</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

const PhoneApp = forwardRef<PhoneHandle, Props>(function PhoneApp({ persona, onPersona, dark, onDark, app, reducedMotion }, ref) {
  const { stack, setStack, screen, homeTab, setHomeTab, sheet, mode, setMode, journey, setJourney, setEnd, swapEnds, moves, step, push, back, goTab, closeSheet, ride } = app;
  const [query, setQuery] = useState('');
  /** Plan your ride with its two ends swapped: the ride then ends at Ram today. */
  const [flipped, setFlipped] = useState(false);
  const [shortcut, setShortcut] = useState<null | 'experience' | 'wins'>(null);
  const [seen, setSeen] = useState<TripId[]>([]);
  const [inboxRead, setInboxRead] = useState(false);
  const [strip, setStrip] = useState(true);
  const [toast, setToast] = useState('');
  const [copied, setCopied] = useState(false);
  /** True once "Finding your experience" has played in full; later rides find faster. */

  const root = useRef<HTMLDivElement>(null);

  const who = PERSONAS.find((p) => p.id === persona)!;

  const openInbox = () => {
    setInboxRead(true);
    push({ s: 'inbox' });
  };
  const openSheet = (sh: Exclude<Sheet, null>) => {
    setCopied(false);
    app.openSheet(sh);
  };
  const reserveHere = () => openSheet('reserve');
  const confirm = (id: TripId) => {
    step();
    setSeen((v) => (v.includes(id) ? v : [...v, id]));
    setStack((st) => [...st.slice(0, -1), { s: 'finding', trip: id, mode }]);
  };

  useImperativeHandle(ref, () => ({ focus: () => root.current?.querySelector<HTMLElement>('[data-first]')?.focus({ preventScroll: true }) }), []);

  // the request: finding a driver, connecting, confirmed. Then the trip opens and the car sets off
  const rideStep = useRideStep(screen.s === 'finding' ? `${screen.trip}:${app.driveNo}` : null, reducedMotion);
  useEffect(() => {
    if (screen.s !== 'finding') return;
    const { trip, mode: m } = screen;
    const t = setTimeout(() => {
      step();
      setStack((st) => [...st.slice(0, -1), { s: 'details', trip, mode: m }]);
    }, requestMs(reducedMotion));
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  // after a screen change the keyboard continues from the new screen's first control
  const key = screen.s === 'tab' ? `tab-${screen.tab}` : screen.s === 'search' || screen.s === 'inbox' || screen.s === 'idea' ? screen.s : `${screen.s}-${screen.trip}`;
  useEffect(() => {
    if (moves) root.current?.querySelector<HTMLElement>('.rp-screen [data-first]')?.focus({ preventScroll: true });
  }, [moves]);

  useEffect(() => {
    if (sheet) root.current?.querySelector<HTMLElement>('.rp-sheet.modal [data-first]')?.focus({ preventScroll: true });
  }, [sheet]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: 'Ram for Uber: a portfolio', url });
      else {
        await navigator.clipboard.writeText(url);
        setToast('Link copied');
      }
    } catch {
      /* the share sheet was closed */
    }
  };
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
    } catch {
      setToast('Select the address to copy it');
    }
  };

  // pointing at (or tabbing to) a destination tells the page: a thought cloud of its photos opens beside the phone,
  // and the place lights up on the map. The same photos are in every Trip details sheet.
  const peeks = (id: TripId) => {
    const show = (e: React.SyntheticEvent<HTMLElement>) => {
      const box = root.current;
      if (!box) return;
      const icon = e.currentTarget.querySelector('.rp-tile-art, .rp-recent-ico, .rp-prod-art, .rp-place-when') ?? e.currentTarget;
      const r = icon.getBoundingClientRect();
      const b = box.getBoundingClientRect();
      const scale = b.width / box.offsetWidth || 1;
      app.setLook(id);
      if (tripPhotos(id).length) app.setPeek({ trip: id, x: (r.left + r.width / 2 - b.left) / scale, y: (r.top + r.height / 2 - b.top) / scale });
    };
    const hide = () => {
      app.setPeek(null);
      app.setLook(null);
    };
    return { onMouseEnter: show, onMouseLeave: hide, onFocus: show, onBlur: hide };
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Escape') return;
    if (sheet) closeSheet();
    else if (stack.length > 1) back();
  };

  /* ---------------------------------------------------------------- pieces shared by screens */

  const tabBar = (active: Tab) => (
    <nav className="rp-tabbar" aria-label="Main">
      {TABS.map((t) => (
        <button key={t.id} type="button" className={t.id === active ? 'on' : ''} aria-current={t.id === active ? 'page' : undefined} onClick={() => goTab(t.id)}>
          {t.id === 'account' && !inboxRead && <i className="rp-unread" aria-hidden="true" />}
          <Solid name={t.icon} />
          <span>
            {t.label}
            {t.id === 'account' && !inboxRead && <span className="sr"> (1 unread message)</span>}
          </span>
        </button>
      ))}
    </nav>
  );

  const minutesOf = (t: Trip) => {
    const m = tripMinutes(t);
    return m === null ? null : minLabel(m);
  };

  /* ---------------------------------------------------------------- Home */

  // Ram's own order: where he worked on the first row, where he studied on the second
  const tiles = TILES;
  const lead = getTrip(who.lead);

  const homeRam = (
    <>
      <div className="rp-where">
        <button type="button" className="rp-where-go" onClick={() => push({ s: 'search' })}>
          <Icon name="search" size={22} w={2.2} />
          {HOME.where}
        </button>
        <button type="button" className="rp-where-later" onClick={() => openSheet('reserve')} aria-label={RESERVE.title}>
          <Solid name="calendar" size={17} />
          {HOME.reserve}
        </button>
      </div>

      <button type="button" className="rp-recent" onClick={() => app.driveTo(lead.id)} {...peeks(lead.id)}>
        <span className="rp-recent-ico">
          <Icon name="clock" />
        </span>
        <span className="rp-recent-text">
          <b>{lead.name}</b>
          <small>{lead.sub}</small>
        </span>
        <span className="rp-recent-go">
          <Icon name="chevRight" size={16} w={2.2} />
        </span>
      </button>

      <h2 className="rp-h2">{HOME.forYou}</h2>
      <div className="rp-tiles">
        {tiles.map(({ trip: id, badge, label }) => {
          const t = getTrip(id);
          return (
            <button key={id} type="button" className="rp-tile" onClick={() => app.driveTo(id)} {...peeks(id)}>
              <span className="rp-tile-art">
                {badge && <span className="rp-badge">{badge}</span>}
                <Mark id={id} />
              </span>
              <span className="rp-tile-name">{label ?? t.name}</span>
            </button>
          );
        })}
      </div>

      <h2 className="rp-h2 elevate">{HOME.elevate}</h2>
      <div className="rp-cards">
        <button type="button" className="rp-card" onClick={() => ride('idle-minutes')}>
          <span className="rp-card-art">
            <svg aria-hidden="true" viewBox="0 0 268 132">
              <rect className="art-land" width="268" height="132" />
              <path className="art-hill" d="M-10 132C40 60 90 40 134 40s94 20 144 92z" />
              <rect x="100" y="22" width="68" height="96" rx="9" fill="#111" />
              <rect x="106" y="30" width="56" height="80" rx="4" fill="#fff" />
              <path d="M113 44h42M113 56h30M113 68h42" stroke="#C9CED8" strokeWidth="4" strokeLinecap="round" />
              <rect x="113" y="84" width="42" height="16" rx="8" fill="#276EF1" />
              <circle cx="52" cy="96" r="14" fill="#FFC043" />
              <path d="M46 96l4 4 8-9" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <b>{getTrip('idle-minutes').name}</b>
          <small>{getTrip('idle-minutes').sub}</small>
        </button>
        <button type="button" className="rp-card" onClick={() => ride('story')}>
          <span className="rp-card-art">
            <svg aria-hidden="true" viewBox="0 0 268 132">
              <rect className="art-land" width="268" height="132" />
              <path className="art-street" d="M0 40H268M0 92H268M70 0V132M170 0V132" strokeWidth="7" />
              <path className="art-route" d="M-10 108H70V66H170V30H280" strokeWidth="5" fill="none" strokeLinejoin="round" />
              <circle className="art-node" cx="70" cy="108" r="7" strokeWidth="4" />
              <circle className="art-node" cx="170" cy="66" r="7" strokeWidth="4" />
              <rect className="art-pin" x="204" y="20" width="20" height="20" rx="4" />
              <rect className="art-eye" x="211" y="27" width="6" height="6" />
            </svg>
          </span>
          <b>{getTrip('story').name}</b>
          <small>{getTrip('story').sub}</small>
        </button>
      </div>
    </>
  );

  const homeShipped = (
    <>
      <h2 className="rp-h2 first">Shipped</h2>
      <p className="rp-lede">Products Ram built or led, newest first. Tap one to ride there, or open its details.</p>
      <div className="rp-rows">
        {SHIPPED.map((id) => {
          const t = getTrip(id);
          return (
            <div key={id} className="rp-prodrow">
              <button type="button" className="rp-prod" onClick={() => app.driveTo(id)} {...peeks(id)}>
                <span className="rp-prod-art">
                  <Mark id={id} size={40} />
                </span>
                <span className="rp-prod-text">
                  <b>{t.name}</b>
                  <small>{t.sub}</small>
                </span>
                {t.result && <span className="rp-pill">{t.result.value}</span>}
              </button>
              <button type="button" className="rp-prod-info" onClick={() => app.setProject(id)} aria-label={`Everything about ${t.name}`}>
                Details
              </button>
            </div>
          );
        })}
      </div>
    </>
  );

  const jr = routeBetween(journey.from, journey.to);
  const jTrip = app.journeyTrip;

  const homeJourney = (
    <>
      <div className="rp-jmap">
        <StreetMap from={journey.from} to={journey.to} onPick={(id) => setEnd('to', id)} controls hot={app.hot} reducedMotion={reducedMotion} />
      </div>
      <div className="rp-jcard">
        <p className="rp-kicker">Trip selected</p>
        <Ends
          onSwap={swapEnds}
          a={
            <label>
              <span className="sr">From</span>
              <select value={journey.from} onChange={(e) => setEnd('from', e.target.value as StopId)}>
                {PLACES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.type === 'you' ? `Ram, ${NOW_LABEL}` : p.name}
                  </option>
                ))}
              </select>
            </label>
          }
          b={
            <label>
              <span className="sr">To</span>
              <select value={journey.to} onChange={(e) => setEnd('to', e.target.value as StopId)}>
                {PLACES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.type === 'you' ? `Ram, ${NOW_LABEL}` : p.name}
                  </option>
                ))}
              </select>
            </label>
          }
        />
        <p className="rp-jsum" aria-live="polite">
          {jr.minutes} minutes, {jr.between.length} {jr.between.length === 1 ? 'stop' : 'stops'} on the way. One minute on this map is one month of Ram’s life.
        </p>
        <button type="button" className="rp-btn pill" onClick={() => ride(jTrip)}>
          Open {getTrip(jTrip).name}
        </button>
        <h3 className="rp-h3">On the way</h3>
        <StopList from={journey.from} to={journey.to} full onOpen={ride} onHot={app.setHot} />
        <p className="rp-legend">Square pins are places Ram belonged to. Dots are what he did there. Tap a pin to set the destination.</p>
      </div>
    </>
  );

  const home = (
    <>
      <Tribute onReserve={reserveHere} />
      <div className="rp-top">
        <button type="button" className="rp-switch" data-first onClick={() => openSheet('switch')} aria-haspopup="dialog">
          <i className="rp-loc" aria-hidden="true" />
          <span className="sr">Riding with </span>
          {who.label}
          <Icon name="chevDown" size={16} w={2.2} />
        </button>
        <button type="button" className="rp-inboxlink" onClick={() => openInbox()}>
          <Icon name="bell" />
          Inbox
        </button>
      </div>
      <nav className="rp-toptabs" aria-label="Views">
        {(
          [
            ['ram', 'car'],
            ['shipped', 'box'],
            ['journey', 'road'],
          ] as [HomeTab, string][]
        ).map(([id, icon]) => (
          <button key={id} type="button" className={homeTab === id ? 'on' : ''} aria-current={homeTab === id ? 'true' : undefined} onClick={() => setHomeTab(id)}>
            <Solid name={icon} size={26} />
            <span>{HOME.tabs[id]}</span>
          </button>
        ))}
      </nav>
      <div className={`rp-scroll ${homeTab === 'journey' ? 'flush' : ''}`}>{homeTab === 'ram' ? homeRam : homeTab === 'shipped' ? homeShipped : homeJourney}</div>
      {strip && homeTab === 'ram' && (
        <div className="rp-strip">
          <i aria-hidden="true" />
          <span>{HOME.availability}</span>
          <button type="button" aria-label="Dismiss" onClick={() => setStrip(false)}>
            <Icon name="x" size={16} />
          </button>
        </div>
      )}
      {tabBar('home')}
    </>
  );

  /* ---------------------------------------------------------------- Search */

  const q = query.trim().toLowerCase();
  type Row = { key: string; name: string; sub: string; min: string | null; trip: TripId };
  const placeRows: Row[] = PLACES.filter((p) => p.type === 'place')
    .map((p) => ({ key: p.id, name: getTrip(p.trip).name, sub: getTrip(p.trip).sub, min: minLabel(minutesAway(p.when)), trip: p.trip, m: minutesAway(p.when) }))
    .sort((a, b) => a.m - b.m);
  const tripRow = (t: Trip): Row => ({ key: t.id, name: t.name, sub: t.sub, min: minutesOf(t), trip: t.id });
  const stopRow = (s: Stop): Row => ({ key: s.id, name: s.name, sub: `On the way to ${getTrip(s.trip).name}`, min: minLabel(minutesAway(s.when)), trip: s.trip });
  // with nothing typed, every destination is listed, nearest first
  let rows: Row[] = [...placeRows, ...TRIPS.filter((t) => !placeRows.some((r) => r.trip === t.id)).map(tripRow)];
  if (q) {
    const hit = (s: string) => s.toLowerCase().includes(q);
    rows = [...TRIPS.filter((t) => hit(t.name) || hit(t.sub)).map(tripRow), ...STOPS.filter((s) => s.type === 'dot' && hit(s.name) && !TRIPS.some((t) => t.to === s.id && hit(t.name))).map(stopRow)];
  } else if (shortcut === 'experience') rows = SEARCH.experience.map((id) => tripRow(getTrip(id)));
  else if (shortcut === 'wins')
    rows = STOPS.filter((s) => s.win)
      .reverse()
      .map(stopRow);

  const searchHere = <span className="rp-plan-from">{SEARCH.from}</span>;
  const searchBox = (
    <label>
      <span className="sr">{flipped ? 'Start' : 'Destination'}</span>
      <input type="text" data-first value={query} onChange={(e) => setQuery(e.target.value)} placeholder={flipped ? SEARCH.placeholderFrom : SEARCH.placeholder} autoComplete="off" enterKeyHint="search" />
    </label>
  );

  const search = (
    <>
      <Tribute onReserve={reserveHere} />
      <header className="rp-bar">
        <button type="button" className="rp-back" aria-label="Back" onClick={back}>
          <Icon name="back" size={24} w={2.2} />
        </button>
        <button type="button" className="rp-home" aria-label="Home" onClick={() => goTab('home', 'ram')}>
          <Solid name="home" size={20} />
        </button>
        <h1>{SEARCH.title}</h1>
      </header>
      <div className="rp-chips">
        <span className="rp-chip">
          <Icon name="clock" size={17} />
          {SEARCH.chips[0]}
        </span>
        <span className="rp-chip">
          <Icon name="person" size={17} />
          {SEARCH.chips[1]}
        </span>
      </div>
      <div className="rp-plan">
        <Ends
          onSwap={() => setFlipped((v) => !v)}
          a={flipped ? searchBox : searchHere}
          b={flipped ? searchHere : searchBox}
        />
        <button type="button" className="rp-round" aria-label="Open the map" onClick={() => goTab('home', 'journey')}>
          <Icon name="map" />
        </button>
      </div>
      <div className="rp-shortcuts">
        <button type="button" aria-pressed={shortcut === 'experience'} onClick={() => setShortcut((s) => (s === 'experience' ? null : 'experience'))}>
          <Icon name="briefcase" size={22} w={1.8} />
          {SEARCH.shortcuts.experience}
        </button>
        <button type="button" aria-pressed={shortcut === 'wins'} onClick={() => setShortcut((s) => (s === 'wins' ? null : 'wins'))}>
          <Icon name="star" size={22} w={1.8} />
          {SEARCH.shortcuts.wins}
        </button>
      </div>
      <div className="rp-scroll list">
        {rows.length === 0 && <p className="rp-empty">{SEARCH.empty}</p>}
        {rows.map((r) => (
          <button key={r.key} type="button" className="rp-place" onClick={() => app.driveTo(r.trip)} {...peeks(r.trip)}>
            <span className={`rp-place-when ${LOGO[r.trip] ? 'logo' : ''}`}>
              {LOGO[r.trip] ? <Mark id={r.trip} size={34} /> : <Icon name="clock" w={1.8} />}
              {r.min && <small>{r.min}</small>}
            </span>
            <span className="rp-place-text">
              <b>{r.name}</b>
              <small>{r.sub}</small>
            </span>
          </button>
        ))}
      </div>
    </>
  );

  /* ---------------------------------------------------------------- the ride flow */

  /** A ride from "Ram, today" to one place takes the real road straight there; the full story is told along Ram's whole road. */
  const rideMap = (t: Trip, covered: number, top = 76, full = false) => (
    <div className="rp-map">
      <StreetMap ride={full ? null : t} from={t.from} to={t.to} pad={{ top, bottom: covered }} hot={app.hot} searching={screen.s === 'finding' && rideStep === 0} zoomOnCar={screen.s === 'finding' && rideStep === 2} reducedMotion={reducedMotion} />
    </div>
  );

  const choose = (t: Trip) => (
    <>
      {rideMap(t, 420)}
      <button type="button" className="rp-float back" aria-label="Back" onClick={back}>
        <Icon name="back" size={22} w={2.2} />
      </button>
      <button type="button" className="rp-float home" aria-label="Home" onClick={() => goTab('home', 'ram')}>
        <Solid name="home" size={20} />
      </button>
      <div className="rp-float route">
        <span>
          <i aria-hidden="true" />
          {t.from === 'you' ? 'Ram, today' : stop(t.from).name}
        </span>
        <b>{t.to === 'you' ? t.name : t.name}</b>
      </div>
      <section className="rp-sheet choose" aria-labelledby="rp-choose-h">
        <span className="rp-grab" aria-hidden="true" />
        <h1 id="rp-choose-h" className="rp-sheet-h">
          {RIDE.choose}
        </h1>
        <div role="radiogroup" aria-labelledby="rp-choose-h" className="rp-options">
          {(['quick', 'full'] as Mode[]).map((m, i) => (
            <button key={m} type="button" role="radio" aria-checked={mode === m} data-first={mode === m ? '' : undefined} className={`rp-option ${mode === m ? 'on' : ''}`} onClick={() => setMode(m)}>
              <span className="rp-option-art">
                <Pict name={i ? 'doc' : 'car'} />
              </span>
              <span className="rp-option-text">
                <span className="rp-option-top">
                  <b>{RIDE[m].name}</b>
                  <b>{RIDE[m].time}</b>
                </span>
                <small>{RIDE[m].line}</small>
                <span>
                  <span className={`rp-tag ${i ? 'brown' : 'blue'}`}>{RIDE[m].badge}</span>
                </span>
              </span>
            </button>
          ))}
        </div>
        <p className="rp-free">
          <i aria-hidden="true" />
          {RIDE.free}
        </p>
        <button type="button" className="rp-btn pill primary" onClick={() => confirm(t.id)}>
          Choose {RIDE[mode].name}
        </button>
        <Tribute className="rp-tribute in" onReserve={reserveHere} />
      </section>
    </>
  );

  const finding = (t: Trip, m: Mode) => (
    <>
      {rideMap(t, 284)}
      <button type="button" className="rp-float back" aria-label="Cancel and go back" data-first onClick={back}>
        <Icon name="chevDown" size={22} w={2.2} />
      </button>
      <button type="button" className="rp-float home" aria-label="Home" onClick={() => goTab('home', 'ram')}>
        <Solid name="home" size={20} />
      </button>
      <button type="button" className="rp-float share" onClick={share}>
        <Icon name="pin" size={18} />
        Share
      </button>
      <section className="rp-sheet finding" aria-labelledby="rp-finding-h">
        <span className="rp-grab" aria-hidden="true" />
        <h1 id="rp-finding-h" className="rp-sheet-h big" key={rideStep} aria-live="polite">
          {RIDE.steps[rideStep].title}
        </h1>
        <p className="rp-finding-line">{RIDE.steps[rideStep].line.replace('{name}', t.name)}</p>
        <div className="rp-progress" role="progressbar" aria-label={RIDE.requested}>
          <span style={{ animationDuration: `${requestMs(reducedMotion)}ms` }} />
        </div>
        <ol className="rp-steps">
          {RIDE.steps.map((x, i) => (
            <li key={x.short} className={i < rideStep || (i === rideStep && i === RIDE.steps.length - 1) ? 'done' : i === rideStep ? 'now' : ''}>
              <i aria-hidden="true">{i < rideStep || (i === rideStep && i === RIDE.steps.length - 1) ? <Icon name="check" size={13} w={3.2} /> : i + 1}</i>
              {x.short}
            </li>
          ))}
        </ol>
        <div className="rp-pickup">
          <small>{RIDE[m].name} details</small>
          <b>Meet Ram at the pickup point: {t.pickup}</b>
          <span>
            <span className="rp-tag green">{RIDE.freeRide}</span>
          </span>
        </div>
        <Tribute className="rp-tribute in" onReserve={reserveHere} />
      </section>
    </>
  );

  const details = (t: Trip, m: Mode) => {
    const min = minutesOf(t);
    const full = m === 'full';
    const receipt = [...(t.receipt ?? []), ...(min && t.id !== 'idle-minutes' ? [{ label: t.id === 'story' ? 'The whole road' : 'Distance from today', value: min }] : [])];
    return (
      <>
        {rideMap(t, 592, 0, full)}
        <button type="button" className="rp-float back" aria-label="Back" onClick={back}>
          <Icon name="back" size={22} w={2.2} />
        </button>
        <button type="button" className="rp-float home" aria-label="Home" onClick={() => goTab('home', 'ram')}>
          <Solid name="home" size={20} />
        </button>
        <section className="rp-sheet details" aria-labelledby="rp-details-h">
          <div className="rp-details-top">
            <h1 id="rp-details-h" className="rp-details-h" tabIndex={-1} data-first>
              {RIDE.details}
            </h1>
            <button type="button" className="rp-mode" onClick={() => setStack((st) => [...st.slice(0, -1), { s: 'details', trip: t.id, mode: full ? 'quick' : 'full' }])} aria-label={`Switch to the ${full ? RIDE.quick.name : RIDE.full.name}, ${full ? RIDE.quick.time : RIDE.full.time}`}>
              {full ? RIDE.quick.name : RIDE.full.name}
            </button>
          </div>
          <div className="rp-details-body">
            {t.id === 'story' ? (
              <div className="rp-story">
                <p className="rp-about">{t.blurb}</p>
                <StopList from={t.from} to={t.to} full={full} onOpen={ride} onHot={app.setHot} />
              </div>
            ) : (
              <>
                <div className="rp-leg">
                  {t.leg ? (
                    <Ends
                      a={
                        <span>
                          {t.leg[0].title}
                          <small>{t.leg[0].when}</small>
                        </span>
                      }
                      b={
                        <span>
                          {t.leg[1].title}
                          <small>{t.leg[1].when}</small>
                        </span>
                      }
                    />
                  ) : (
                    <p className="rp-about">{t.blurb}</p>
                  )}
                </div>
                {t.result && (
                  <div className="rp-result">
                    <span className="rp-result-ico">
                      <Icon name="trend" size={24} />
                    </span>
                    <span className="rp-result-text">
                      <b>{RIDE.result}</b>
                      <small>{t.result.sub}</small>
                    </span>
                    <span className="rp-result-value">{t.result.value}</span>
                  </div>
                )}
                {t.proof && (
                  <div className="rp-proof">
                    <Icon name="person" size={24} w={1.8} />
                    <span>
                      <b>{t.proof.title}</b>
                      {t.proof.badge && (
                        <span>
                          <span className="rp-tag green">{t.proof.badge}</span>
                        </span>
                      )}
                      {t.proof.note && <small>{t.proof.note}</small>}
                    </span>
                  </div>
                )}
                {full && (
                  <div className="rp-full">
                    {t.leg && <p className="rp-about">{t.blurb}</p>}
                    {t.problem && (
                      <section>
                        <h3>The problem</h3>
                        <p>{t.problem}</p>
                      </section>
                    )}
                    {t.did && (
                      <section>
                        <h3>What Ram did</h3>
                        <ul className="rp-ticks">
                          {t.did.map((x) => (
                            <li key={x}>
                              <i aria-hidden="true">
                                <Icon name="check" size={12} w={3.2} />
                              </i>
                              {x}
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                    {receipt.length > 0 && (
                      <section>
                        <h3>Receipt</h3>
                        <dl className="rp-receipt">
                          {receipt.map((r) => (
                            <div key={r.label}>
                              <dt>{r.label}</dt>
                              <i aria-hidden="true" />
                              <dd>{r.value}</dd>
                            </div>
                          ))}
                        </dl>
                      </section>
                    )}
                  </div>
                )}
              </>
            )}
            <Photos photos={tripPhotos(t.id)} />
            <div className="rp-sharerow">
              <Icon name="pin" size={24} w={1.8} />
              <span>{RIDE.share}</span>
              <button type="button" onClick={share}>
                Share
              </button>
            </div>
          </div>
          <div className="rp-details-foot">
            <button type="button" className="rp-btn" onClick={() => {
              setJourney({ from: t.from, to: t.to });
              goTab('home', 'journey');
            }}>
              {RIDE.back}
            </button>
            <button type="button" className="rp-btn primary" onClick={() => openSheet('reserve')}>
              {RIDE.reserve}
            </button>
            <Tribute className="rp-tribute in" onReserve={reserveHere} />
          </div>
        </section>
      </>
    );
  };

  /* ---------------------------------------------------------------- Services, Activity, Inbox, Account */

  const services = (
    <>
      <Tribute onReserve={reserveHere} />
      <h1 className="rp-title" tabIndex={-1} data-first>
        {SERVICES.title}
      </h1>
      <div className="rp-scroll">
        <h2 className="rp-h2 sm first">{SERVICES.book}</h2>
        <div className="rp-services">
          {SERVICES.main.map((s) => (
            <button key={s.name} type="button" onClick={() => app.driveTo(s.trip)}>
              <Pict name={s.icon} />
              <span>
                <b>{s.name}</b>
                <small>{s.line}</small>
              </span>
            </button>
          ))}
        </div>
        <h2 className="rp-h2 sm">{SERVICES.also}</h2>
        <div className="rp-more-services">
          {SERVICES.more.map((s) => (
            <button key={s.name} type="button" onClick={() => app.driveTo(s.trip)}>
              <span className="art">
                <Pict name={s.icon} />
              </span>
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      </div>
      {tabBar('services')}
    </>
  );

  const up = getTrip(ACTIVITY.upcomingTrip);

  const activity = (
    <>
      <Tribute onReserve={reserveHere} />
      <h1 className="rp-title" tabIndex={-1} data-first>
        {ACTIVITY.title}
      </h1>
      <div className="rp-scroll activity">
        <h2 className="rp-h2 sm first">{ACTIVITY.upcoming}</h2>
        <button type="button" className="rp-upcoming" onClick={() => app.driveTo(up.id)}>
          <span className="art">
            <Icon name="bulb" size={26} w={1.8} />
          </span>
          <span>
            <b>{up.name}</b>
            <small>{up.sub}</small>
          </span>
        </button>
        <h2 className="rp-h2 sm">Where I have worked</h2>
        <ol className="rp-jobs">
          {EXPERIENCE.map((j) => (
            <li key={j.company} className="rp-job">
              <span className="rp-job-rail" aria-hidden="true">
                <i />
              </span>
              <div className="rp-job-card">
                <div className="rp-past-top">
                  {j.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="rp-job-logo" src={j.logo} alt={`${j.company} logo`} width={52} height={52} />
                  ) : (
                    <span className="art">
                      <Pict name={j.icon} />
                    </span>
                  )}
                  <span>
                    <b>{j.company}</b>
                    <small>{j.what}</small>
                  </span>
                </div>
                <ul className="rp-roles">
                  {j.roles.map((r) => (
                    <li key={r.title}>
                      <span>{r.title}</span>
                      <small>{r.when}</small>
                    </li>
                  ))}
                </ul>
                {j.result && <span className="rp-tag green">{j.result}</span>}
                {j.trip && (
                  <button type="button" className="rp-again" onClick={() => app.driveTo(j.trip!)} aria-label={`Ride to ${j.company}`} {...peeks(j.trip)}>
                    <Icon name="again" size={16} />
                    Ride there
                  </button>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
      {tabBar('activity')}
    </>
  );

  /* ---------------------------------------------------------------- The 20 idle minutes: a page of its own */

  const ideaPhoto = tripPhotos('idle-minutes')[0];
  const idea = (
    <>
      <Tribute onReserve={reserveHere} />
      <header className="rp-bar">
        <button type="button" className="rp-back" aria-label="Back" data-first onClick={back}>
          <Icon name="back" size={24} w={2.2} />
        </button>
        <button type="button" className="rp-home" aria-label="Home" onClick={() => goTab('home', 'ram')}>
          <Solid name="home" size={20} />
        </button>
        <h1>{IDEA.title}</h1>
      </header>
      <div className="rp-scroll rp-prog">
        <p className="rp-kicker">{IDEA.kicker}</p>
        <h2>{IDEA.line}</h2>
        <p className="rp-prog-p">{IDEA.pitch}</p>

        <ol className="rp-chaps">
          {IDEA.scenes.map((sc, i) => (
            <li key={sc.id} className={i === app.ideaStep ? 'on' : ''}>
              <button type="button" className="rp-chap" aria-current={i === app.ideaStep ? 'step' : undefined} onClick={() => app.setIdeaStep(i)}>
                <i aria-hidden="true">{i + 1}</i>
                <span>
                  <small>{sc.tab}</small>
                  <b>{sc.title}</b>
                </span>
              </button>
              <div className="rp-chap-g">
                <IdeaGraphic id={sc.id} survey={app.survey} onSurvey={app.setSurvey} />
              </div>
              <p className="rp-chap-p">{sc.text}</p>
              {sc.note && <p className="rp-chap-n">{sc.note}</p>}
            </li>
          ))}
        </ol>

        {TEARDOWN.parts
          .filter((p) => IDEA_MORE.includes(p.heading))
          .map((p) => (
            <section key={p.heading} className="rp-prog-part">
              <h3>{p.heading}</h3>
              <p>{p.text}</p>
            </section>
          ))}

        {ideaPhoto && (
          <figure className="rp-prog-fig">
            <span>
              <Thumb photo={ideaPhoto} className="rp-photo" />
            </span>
            <figcaption>{IDEA.evidence.caption}</figcaption>
          </figure>
        )}
        <button type="button" className="rp-btn primary" onClick={reserveHere}>
          {RIDE.reserve}
        </button>
      </div>
    </>
  );

  const inbox = (
    <>
      <Tribute onReserve={reserveHere} />
      <header className="rp-bar">
        <button type="button" className="rp-back" aria-label="Back" data-first onClick={back}>
          <Icon name="back" size={24} w={2.2} />
        </button>
        <button type="button" className="rp-home" aria-label="Home" onClick={() => goTab('home', 'ram')}>
          <Solid name="home" size={20} />
        </button>
        <h1>Inbox</h1>
      </header>
      <div className="rp-scroll list inbox">
        {INBOX.map((m) => {
          const body = (
            <>
              <span className="rp-avatar">
                <Solid name="user" />
              </span>
              <span className="rp-msg-text">
                <span>
                  <b>{m.from}</b>
                  <small>{m.when}</small>
                </span>
                <span className="rp-msg-body">{m.text}</span>
              </span>
              {!m.placeholder && <i className="rp-msg-new" aria-hidden="true" />}
            </>
          );
          return m.placeholder ? (
            <div key={m.from} className="rp-msg placeholder">
              {body}
              <span className="sr">Placeholder: this quote has not been supplied yet.</span>
            </div>
          ) : (
            <button key={m.from} type="button" className="rp-msg" onClick={() => openSheet('reserve')} aria-label={`${m.from}: ${m.text} Reply to Ram`}>
              {body}
            </button>
          );
        })}
        <p className="rp-note">Quotes in square brackets are placeholders. Real ones are on their way from Ram.</p>
      </div>
      <Tribute className="rp-tribute at-foot" />
    </>
  );

  const explored = CHAPTERS.filter((id) => seen.includes(id)).length;
  const NUM = ['None', 'One', 'Two', 'Three', 'Four', 'Five'];
  const ring = 2 * Math.PI * 23;

  const account = (
    <>
      <Tribute onReserve={reserveHere} />
      <div className="rp-scroll account">
        <div className="rp-me">
          <span>
            <h1 tabIndex={-1} data-first>
              {ACCOUNT.name}
            </h1>
            <span className="rp-status">
              <i aria-hidden="true" />
              {ACCOUNT.status}
            </span>
          </span>
          <span className="rp-me-photo">
            <Thumb photo={PORTRAIT} className="rp-me-img" />
          </span>
        </div>
        <p className="rp-about-lede">{ABOUT.lede}</p>
        <div className="rp-facets" role="tablist" aria-label="The sides of Ram">
          {ABOUT.facets.map((x) => (
            <button key={x.id} type="button" role="tab" aria-selected={x.id === app.facet} className={x.id === app.facet ? 'on' : ''} onClick={() => app.setFacet(x.id)}>
              {x.label}
            </button>
          ))}
        </div>
        {(() => {
          const f = ABOUT.facets.find((x) => x.id === app.facet) ?? ABOUT.facets[0];
          return (
            <div className="rp-facet" role="tabpanel" key={f.id}>
              <b>{f.title}</b>
              <p>{f.text}</p>
              <button type="button" className="rp-again" onClick={() => app.driveTo(f.trip)}>
                <Icon name="again" size={16} />
                Ride to {getTrip(f.trip).name}
              </button>
            </div>
          );
        })()}
        <p className="rp-about-values">{ABOUT.values}</p>
        <div className="rp-links">
          <a href={`mailto:${PROFILE.email}?subject=${encodeURIComponent(RESERVE.subject)}`}>
            <Icon name="mail" size={22} w={1.8} />
            <span>Email</span>
          </a>
          <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">
            <Icon name="link" size={22} w={1.8} />
            <span>LinkedIn</span>
          </a>
          <a href={PROFILE.github} target="_blank" rel="noreferrer">
            <Icon name="code" size={22} w={1.8} />
            <span>GitHub</span>
          </a>
          <button type="button" onClick={() => openInbox()}>
            <Icon name="bell" size={22} w={1.8} />
            <span>Inbox</span>
            {!inboxRead && <i className="rp-dot" aria-hidden="true" />}
          </button>
        </div>
        <button type="button" className="rp-acard" onClick={() => goTab('activity')}>
          <span>
            <b>{ACCOUNT.chapters.title}</b>
            <small>{explored === CHAPTERS.length ? 'All five opened. Reserve Ram next' : `${NUM[explored]} of five opened. ${NUM[CHAPTERS.length - explored]} to go`}</small>
          </span>
          <svg aria-hidden="true" width="60" height="60" viewBox="0 0 60 60">
            <circle className="rp-ring-bg" cx="30" cy="30" r="23" fill="none" strokeWidth="6" />
            {explored > 0 && <circle className="rp-ring" cx="30" cy="30" r="23" fill="none" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${(ring * explored) / CHAPTERS.length} ${ring}`} transform="rotate(-90 30 30)" />}
            <text className="rp-ring-t" x="30" y="35" textAnchor="middle">
              {explored}/{CHAPTERS.length}
            </text>
          </svg>
        </button>
        <button type="button" className="rp-acard" onClick={() => app.driveTo(ACCOUNT.dance.trip)}>
          <span>
            <b>{ACCOUNT.dance.title}</b>
            <small>{ACCOUNT.dance.line}</small>
          </span>
          <Pict name="music" />
        </button>
        <button type="button" className="rp-acard" onClick={() => openSheet('lost')}>
          <span>
            <b>{ACCOUNT.lost.title}</b>
            <small>{ACCOUNT.lost.line}</small>
          </span>
          <Pict name="doc" />
        </button>
        <button type="button" className="rp-arow" role="switch" aria-checked={dark} onClick={() => onDark(!dark)} aria-label={`${ACCOUNT.appearance}: dark theme`}>
          <Icon name={dark ? 'moon' : 'sun'} size={22} w={1.8} />
          <span>{ACCOUNT.appearance}</span>
          <small>{dark ? 'Dark' : 'Light'}</small>
        </button>
        <button type="button" className="rp-arow" onClick={() => window.dispatchEvent(new Event('mini-ram:open'))}>
          <Icon name="chat" size={22} w={1.8} />
          <span>{ACCOUNT.miniRam.title}</span>
          <small>AI</small>
        </button>
        <button type="button" className="rp-arow" onClick={share}>
          <Icon name="share" size={22} w={1.8} />
          <span>{ACCOUNT.share.title}</span>
        </button>
        <Link className="rp-arow" href="/">
          <Icon name="out" size={22} w={1.8} />
          <span>{ACCOUNT.mainSite.title}</span>
          <small>rambhardwaj.in</small>
        </Link>
      </div>
      {tabBar('account')}
    </>
  );

  /* ---------------------------------------------------------------- sheets over a screen */

  const sheets: Record<Exclude<Sheet, null>, ReactNode> = {
    switch: (
      <>
        <h2 id="rp-sheet-h" className="rp-sheet-h">
          Riding with
        </h2>
        <div role="radiogroup" aria-labelledby="rp-sheet-h" className="rp-options tight">
          {PERSONAS.map((p) => (
            <button key={p.id} type="button" role="radio" aria-checked={p.id === persona} data-first={p.id === persona ? '' : undefined} className={`rp-option who ${p.id === persona ? 'on' : ''}`} onClick={() => onPersona(p.id)}>
              <span className="rp-option-art round">
                <Pict name={p.icon} />
              </span>
              <span className="rp-option-text">
                <b>{p.label}</b>
                <small>{p.proof}</small>
              </span>
              {p.id === persona && <Icon name="check" w={2.6} />}
            </button>
          ))}
        </div>
        <button type="button" className="rp-btn pill primary push" onClick={closeSheet}>
          Done
        </button>
      </>
    ),
    reserve: (
      <>
        <h2 id="rp-sheet-h" className="rp-sheet-h">
          {RESERVE.title}
        </h2>
        <p className="rp-sheet-p">{RESERVE.line}</p>
        <div className="rp-address">
          <span>{PROFILE.email}</span>
          <button type="button" onClick={copyEmail} aria-label={`Copy the email address ${PROFILE.email}`}>
            <Icon name={copied ? 'check' : 'copy'} size={16} />
            <span aria-live="polite">{copied ? RESERVE.copied : RESERVE.copy}</span>
          </button>
        </div>
        <a className="rp-btn primary" data-first href={`mailto:${PROFILE.email}?subject=${encodeURIComponent(RESERVE.subject)}`}>
          <Icon name="mail" w={1.8} />
          {RESERVE.email}
        </a>
        <a className="rp-btn" href={PROFILE.linkedin} target="_blank" rel="noreferrer">
          <Icon name="link" w={1.8} />
          {RESERVE.linkedin}
        </a>
        <button type="button" className="rp-btn ghost" onClick={closeSheet}>
          Not now
        </button>
      </>
    ),
    lost: (
      <>
        <h2 id="rp-sheet-h" className="rp-sheet-h">
          {ACCOUNT.lost.title}
        </h2>
        <p className="rp-sheet-p">{ACCOUNT.lost.line}.</p>
        <p className="rp-pending">{ACCOUNT.lost.pending}</p>
        <button type="button" className="rp-btn pill primary push" data-first onClick={closeSheet}>
          Close
        </button>
      </>
    ),
  };

  const body =
    screen.s === 'tab'
      ? { home, services, activity, account }[screen.tab]
      : screen.s === 'search'
        ? search
        : screen.s === 'inbox'
          ? inbox
          : screen.s === 'idea'
            ? idea
          : screen.s === 'choose'
            ? choose(getTrip(screen.trip))
            : screen.s === 'finding'
              ? finding(getTrip(screen.trip), screen.mode)
              : details(getTrip(screen.trip), screen.mode);

  return (
    <div className="rp" ref={root} onKeyDown={onKeyDown}>
      <div className={`rp-screen s-${screen.s}`} key={key} inert={sheet ? true : undefined}>
        {body}
      </div>
      {sheet && (
        <>
          <div className="rp-scrim" onClick={closeSheet} aria-hidden="true" />
          <section className={`rp-sheet modal ${sheet}`} role="dialog" aria-labelledby="rp-sheet-h">
            <span className="rp-grab" aria-hidden="true" />
            {sheets[sheet]}
            <Tribute className="rp-tribute in" onReserve={sheet === 'reserve' ? undefined : reserveHere} />
          </section>
        </>
      )}
      <p className="rp-toast" role="status">
        {toast}
      </p>
      <p className="sr" aria-live="polite">
        {screen.s === 'finding' ? `${RIDE.requested}. ${RIDE.finding} at ${getTrip(screen.trip).name}` : screen.s === 'details' ? `${RIDE.details}: ${getTrip(screen.trip).name}` : ''}
      </p>
    </div>
  );
});

export default PhoneApp;
