'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { PROFILE } from '@/lib/data';
import {
  ACCOUNT,
  ACTIVITY,
  CHAPTERS,
  HOME,
  INBOX,
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
  monthLabel,
  stop,
  trip as getTrip,
  tripMinutes,
  type PersonaId,
  type Stop,
  type StopId,
  type Trip,
  type TripId,
} from '@/lib/uber';
import LifeMap, { routeBetween } from './LifeMap';
import { Icon, Pict, Solid } from './icons';

type Tab = 'home' | 'services' | 'activity' | 'account';
type HomeTab = 'ram' | 'shipped' | 'journey';
type Mode = 'quick' | 'full';
type Screen = { s: 'tab'; tab: Tab } | { s: 'search' } | { s: 'inbox' } | { s: 'choose'; trip: TripId } | { s: 'finding'; trip: TripId; mode: Mode } | { s: 'details'; trip: TripId; mode: Mode };
type Sheet = null | 'switch' | 'reserve' | 'lost';

export type PhoneHandle = {
  /** Open the Reserve Ram sheet. */
  reserve: () => void;
  /** Start the ride flow for a trip, at "Choose a trip". */
  ride: (id: TripId) => void;
  /** Move keyboard focus into the app. */
  focus: () => void;
};

type Props = {
  persona: PersonaId;
  onPersona: (p: PersonaId) => void;
  dark: boolean;
  onDark: (dark: boolean) => void;
  /** Tells the page which trip the phone is showing, for the "Now showing" panel. */
  onShow: (id: TripId) => void;
  reducedMotion: boolean;
};

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'services', label: 'Services', icon: 'grid' },
  { id: 'activity', label: 'Activity', icon: 'receipt' },
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

/** The two ends of a trip as a route box: a dot, a line and a square. */
function Ends({ a, b }: { a: ReactNode; b: ReactNode }) {
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
    </div>
  );
}

/** Every stop on the road between two places, in travel order. `full` adds the achievements between the places. */
function StopList({ from, to, full, onOpen }: { from: StopId; to: StopId; full: boolean; onOpen?: (id: TripId) => void }) {
  const { between } = routeBetween(from, to);
  const all = [stop(from), ...between, stop(to)].filter((s) => full || s.type !== 'dot');
  const forward = minutesAway(stop(from).when) >= minutesAway(stop(to).when);
  return (
    <ol className="rp-stops">
      {all.map((s) => {
        const turn = forward ? REROUTES.find((r) => r.before === s.id) : undefined;
        const body = (
          <>
            <span className={`rp-stop-mark ${s.type}`} aria-hidden="true" />
            <span className="rp-stop-text">
              <b>{s.name}</b>
              {s.note && <small>{s.note}</small>}
            </span>
            <span className="rp-stop-min">{s.type === 'you' ? 'Now' : minLabel(minutesAway(s.when))}</span>
          </>
        );
        return (
          <li key={s.id}>
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

const PhoneApp = forwardRef<PhoneHandle, Props>(function PhoneApp({ persona, onPersona, dark, onDark, onShow, reducedMotion }, ref) {
  const [stack, setStack] = useState<Screen[]>([{ s: 'tab', tab: 'home' }]);
  const [homeTab, setHomeTab] = useState<HomeTab>('ram');
  const [sheet, setSheet] = useState<Sheet>(null);
  const [mode, setMode] = useState<Mode>('quick');
  const [query, setQuery] = useState('');
  const [shortcut, setShortcut] = useState<null | 'experience' | 'wins'>(null);
  const [journey, setJourney] = useState<{ from: StopId; to: StopId }>({ from: 'st-dominics', to: 'you' });
  const [filters, setFilters] = useState({ category: 'All', role: 'All' });
  const [seen, setSeen] = useState<TripId[]>([]);
  const [inboxRead, setInboxRead] = useState(false);
  const [strip, setStrip] = useState(true);
  const [toast, setToast] = useState('');
  const [copied, setCopied] = useState(false);
  /** True once "Finding your experience" has played in full; later rides find faster. */
  const [found, setFound] = useState(false);
  /** Counts moves between screens, so the keyboard can follow each one. */
  const [moves, setMoves] = useState(0);
  const step = () => setMoves((n) => n + 1);

  const root = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const screen = stack[stack.length - 1];
  const who = PERSONAS.find((p) => p.id === persona)!;

  const push = (sc: Screen) => {
    step();
    setStack((st) => [...st, sc]);
  };
  const back = () => {
    step();
    setStack((st) => (st.length > 1 ? st.slice(0, -1) : st));
  };
  const openInbox = () => {
    setInboxRead(true);
    push({ s: 'inbox' });
  };
  const goTab = (tab: Tab, home?: HomeTab) => {
    step();
    if (home) setHomeTab(home);
    setStack([{ s: 'tab', tab }]);
  };

  const openSheet = (s: Exclude<Sheet, null>) => {
    opener.current = document.activeElement as HTMLElement | null;
    setCopied(false);
    setSheet(s);
  };
  const reserveHere = () => openSheet('reserve');
  const closeSheet = useCallback(() => {
    setSheet(null);
    const el = opener.current;
    // wait for the screen under the sheet to lose `inert`
    requestAnimationFrame(() => el?.isConnected && el.focus());
  }, []);

  /** Any place or tile: Choose a trip → Finding your experience → Trip details. */
  const ride = useCallback(
    (id: TripId) => {
      step();
      onShow(id);
      setMode('quick');
      setSheet(null);
      setStack((st) => [...st.filter((sc) => sc.s === 'tab' || sc.s === 'search').slice(0, 2), { s: 'choose', trip: id }]);
    },
    [onShow],
  );

  const confirm = (id: TripId) => {
    step();
    setSeen((v) => (v.includes(id) ? v : [...v, id]));
    setStack((st) => [...st.slice(0, -1), reducedMotion ? { s: 'details', trip: id, mode } : { s: 'finding', trip: id, mode }]);
  };

  useImperativeHandle(
    ref,
    () => ({
      reserve: () => openSheet('reserve'),
      ride,
      focus: () => root.current?.querySelector<HTMLElement>('[data-first]')?.focus({ preventScroll: true }),
    }),
    [ride],
  );

  // "Finding your experience…": about a second the first time, shorter after that
  useEffect(() => {
    if (screen.s !== 'finding') return;
    const { trip, mode: m } = screen;
    const t = setTimeout(
      () => {
        setFound(true);
        step();
        setStack((st) => [...st.slice(0, -1), { s: 'details', trip, mode: m }]);
      },
      found ? RIDE.findingMs.later : RIDE.findingMs.first,
    );
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  // after a screen change the keyboard continues from the new screen's first control
  const key = screen.s === 'tab' ? `tab-${screen.tab}` : screen.s === 'search' || screen.s === 'inbox' ? screen.s : `${screen.s}-${screen.trip}`;
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

  const tiles = [...TILES].sort((a, b) => Number(who.first.includes(b.trip)) - Number(who.first.includes(a.trip)));
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

      <button type="button" className="rp-recent" onClick={() => ride(lead.id)}>
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
        {tiles.map(({ trip: id, badge }) => {
          const t = getTrip(id);
          return (
            <button key={id} type="button" className="rp-tile" onClick={() => ride(id)}>
              <span className="rp-tile-art">
                {badge && <span className="rp-badge">{badge}</span>}
                <Pict name={t.icon} />
              </span>
              <span className="rp-tile-name">{t.name}</span>
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
      <p className="rp-lede">Products Ram built or co-founded, newest first.</p>
      <div className="rp-rows">
        {SHIPPED.map((id) => {
          const t = getTrip(id);
          return (
            <button key={id} type="button" className="rp-prod" onClick={() => ride(id)}>
              <span className="rp-prod-art">
                <Pict name={t.icon} size={40} />
              </span>
              <span className="rp-prod-text">
                <b>{t.name}</b>
                <small>{t.sub}</small>
              </span>
              {t.result && <span className="rp-pill">{t.result.value}</span>}
            </button>
          );
        })}
      </div>
    </>
  );

  const jr = routeBetween(journey.from, journey.to);
  const jTrip = stop(journey.to).type === 'you' ? (journey.from === 'st-dominics' ? 'story' : stop(journey.from).trip) : stop(journey.to).trip;
  const setEnd = (end: 'from' | 'to', id: StopId) =>
    setJourney((j) => {
      const other = end === 'from' ? 'to' : 'from';
      // picking the place already at the other end swaps the two
      return j[other] === id ? { from: j.to, to: j.from } : { ...j, [end]: id };
    });

  const homeJourney = (
    <>
      <div className="rp-jmap">
        <LifeMap from={journey.from} to={journey.to} onPick={(id) => setEnd('to', id)} />
      </div>
      <div className="rp-jcard">
        <p className="rp-kicker">Trip selected</p>
        <Ends
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
        <StopList from={journey.from} to={journey.to} full onOpen={ride} />
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
  let rows: Row[] = placeRows;
  if (q) {
    const hit = (s: string) => s.toLowerCase().includes(q);
    rows = [...TRIPS.filter((t) => hit(t.name) || hit(t.sub)).map(tripRow), ...STOPS.filter((s) => s.type === 'dot' && hit(s.name) && !TRIPS.some((t) => t.to === s.id && hit(t.name))).map(stopRow)];
  } else if (shortcut === 'experience') rows = SEARCH.experience.map((id) => tripRow(getTrip(id)));
  else if (shortcut === 'wins')
    rows = STOPS.filter((s) => s.win)
      .reverse()
      .map(stopRow);

  const search = (
    <>
      <Tribute onReserve={reserveHere} />
      <header className="rp-bar">
        <button type="button" className="rp-back" aria-label="Back" onClick={back}>
          <Icon name="back" size={24} w={2.2} />
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
          a={<span className="rp-plan-from">{SEARCH.from}</span>}
          b={
            <label>
              <span className="sr">Destination</span>
              <input type="text" data-first value={query} onChange={(e) => setQuery(e.target.value)} placeholder={SEARCH.placeholder} autoComplete="off" enterKeyHint="search" />
            </label>
          }
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
          <button key={r.key} type="button" className="rp-place" onClick={() => ride(r.trip)}>
            <span className="rp-place-when">
              <Icon name="clock" w={1.8} />
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

  const rideMap = (t: Trip, covered: number, top = 76) => (
    <div className="rp-map">
      <LifeMap from={t.from} to={t.to} pad={{ top, bottom: covered }} />
    </div>
  );

  const choose = (t: Trip) => (
    <>
      {rideMap(t, 420)}
      <button type="button" className="rp-float back" aria-label="Back" onClick={back}>
        <Icon name="back" size={22} w={2.2} />
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
      <button type="button" className="rp-float share" onClick={share}>
        <Icon name="pin" size={18} />
        Share
      </button>
      <section className="rp-sheet finding" aria-labelledby="rp-finding-h">
        <span className="rp-grab" aria-hidden="true" />
        <h1 id="rp-finding-h" className="rp-sheet-h big">
          {RIDE.requested}
        </h1>
        <p className="rp-finding-line">
          {RIDE.finding} at {t.name}
        </p>
        <div className="rp-progress" role="progressbar" aria-label={RIDE.finding}>
          <span style={{ animationDuration: `${found ? RIDE.findingMs.later : RIDE.findingMs.first}ms` }} />
        </div>
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
        {rideMap(t, 592, 0)}
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
            {t.id === 'idle-minutes' ? (
              <article className="rp-idea">
                <h2>{TEARDOWN.title}</h2>
                {TEARDOWN.parts
                  .filter((p) => full || p.quick)
                  .map((p) => (
                    <section key={p.heading}>
                      <h3>
                        {p.heading}
                        {p.label && <span className="rp-tag grey">{p.label}</span>}
                      </h3>
                      <p>{p.text}</p>
                    </section>
                  ))}
              </article>
            ) : t.id === 'story' ? (
              <div className="rp-story">
                <p className="rp-about">{t.blurb}</p>
                <StopList from={t.from} to={t.to} full={full} onOpen={ride} />
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
            <button key={s.name} type="button" onClick={() => ride(s.trip)}>
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
            <button key={s.name} type="button" onClick={() => ride(s.trip)}>
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

  const past = ACTIVITY.pastTrips.filter((id) => {
    const tags = ACTIVITY.tags[id] ?? [];
    return (filters.category === 'All' || tags.includes(filters.category)) && (filters.role === 'All' || tags.includes(filters.role));
  });
  const up = getTrip(ACTIVITY.upcomingTrip);

  const activity = (
    <>
      <Tribute onReserve={reserveHere} />
      <h1 className="rp-title" tabIndex={-1} data-first>
        {ACTIVITY.title}
      </h1>
      <div className="rp-chips under-title">
        {(['category', 'role'] as const).map((f) => (
          <label key={f} className={`rp-chip select ${filters[f] !== 'All' ? 'on' : ''}`}>
            <span className="sr">{ACTIVITY.filters[f].label}</span>
            <select value={filters[f]} onChange={(e) => setFilters((v) => ({ ...v, [f]: e.target.value }))}>
              {ACTIVITY.filters[f].options.map((o) => (
                <option key={o} value={o}>
                  {o === 'All' ? ACTIVITY.filters[f].label : o}
                </option>
              ))}
            </select>
            <Icon name="chevDown" size={14} w={2.2} />
          </label>
        ))}
      </div>
      <div className="rp-scroll activity">
        <h2 className="rp-h2 sm first">{ACTIVITY.upcoming}</h2>
        <button type="button" className="rp-upcoming" onClick={() => ride(up.id)}>
          <span className="art">
            <Icon name="bulb" size={26} w={1.8} />
          </span>
          <span>
            <b>{up.name}</b>
            <small>{up.sub}</small>
          </span>
        </button>
        <h2 className="rp-h2 sm">{ACTIVITY.past}</h2>
        {past.length === 0 && <p className="rp-empty">{ACTIVITY.none}</p>}
        {past.map((id) => {
          const t = getTrip(id);
          const [mon, year] = monthLabel(t.activity!.when, true).split(' ');
          return (
            <div key={id} className="rp-past">
              <span className="rp-date">
                <span>{mon}</span>
                <span>{year}</span>
              </span>
              <div className="rp-past-card">
                <div className="rp-past-top">
                  <span className="art">
                    <Pict name={t.icon} />
                  </span>
                  <span>
                    <small>{t.activity!.role}</small>
                    <b>{t.name}</b>
                    <small>{t.activity!.line}</small>
                  </span>
                </div>
                <button type="button" className="rp-again" onClick={() => ride(id)} aria-label={`${ACTIVITY.again}: ${t.name}`}>
                  <Icon name="again" size={16} />
                  {ACTIVITY.again}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {tabBar('activity')}
    </>
  );

  const inbox = (
    <>
      <Tribute onReserve={reserveHere} />
      <header className="rp-bar">
        <button type="button" className="rp-back" aria-label="Back" data-first onClick={back}>
          <Icon name="back" size={24} w={2.2} />
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
          <span className="rp-me-photo" aria-hidden="true">
            <Solid name="user" size={30} />
          </span>
        </div>
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
        <button type="button" className="rp-acard" onClick={() => ride(ACCOUNT.dance.trip)}>
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
