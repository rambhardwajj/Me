'use client';

import { useCallback, useRef, useState } from 'react';
import { minutesAway, stop, trip as getTrip, type FacetId, type ScreenKey, type StopId, type TripId } from '@/lib/uber';

type Ends = { from: StopId; to: StopId };
/** A Journey route runs forward in time, from the older place to the newer one, until the visitor swaps its ends. */
const forward = (j: Ends): Ends => (minutesAway(stop(j.from).when) >= minutesAway(stop(j.to).when) ? j : { from: j.to, to: j.from });
const flip = (j: Ends): Ends => ({ from: j.to, to: j.from });

export type Tab = 'home' | 'services' | 'activity' | 'account';
export type HomeTab = 'ram' | 'shipped' | 'journey';
export type Mode = 'quick' | 'full';
export type Screen = { s: 'tab'; tab: Tab } | { s: 'search' } | { s: 'inbox' } | { s: 'idea' } | { s: 'choose'; trip: TripId } | { s: 'finding'; trip: TripId; mode: Mode } | { s: 'details'; trip: TripId; mode: Mode };
export type Sheet = null | 'switch' | 'reserve' | 'lost';

/**
 * Where the visitor is in Ram's app. One copy of this state drives two things:
 * the phone, and the panel beside it that shows the same moment at full size.
 */
export function useRide() {
  const [stack, setStack] = useState<Screen[]>([{ s: 'tab', tab: 'home' }]);
  const [homeTab, setHomeTab] = useState<HomeTab>('ram');
  const [sheet, setSheet] = useState<Sheet>(null);
  const [mode, setMode] = useState<Mode>('quick');
  const [journey, setJourneyRaw] = useState<Ends>({ from: 'st-dominics', to: 'you' });
  /** True once the visitor has swapped the ends, so the route runs back in time. */
  const [swapped, setSwapped] = useState(false);
  const setJourney = useCallback((j: Ends) => {
    setSwapped(false);
    setJourneyRaw(forward(j));
  }, []);
  /** Swap the two ends, as the button beside them does in a ride app. */
  const swapEnds = useCallback(() => {
    setSwapped((v) => !v);
    setJourneyRaw(flip);
  }, []);
  /** The stop the pointer is on, in the map or in a list, so each can light up the other. */
  const [hot, setHotOnly] = useState<StopId | null>(null);
  /** The last place pointed at. It stays on show beside the map until another one is pointed at. */
  const [look, setLookState] = useState<{ stop?: StopId; trip: TripId } | null>(null);
  /** The destination being pointed at in the phone, and where its icon is (in phone pixels), for the thought cloud. */
  const [peek, setPeek] = useState<{ trip: TripId; x: number; y: number } | null>(null);
  /** The project whose details are open in the modal. */
  const [project, setProject] = useState<TripId | null>(null);
  /** Where the visitor is in the sample survey on the idea page: 0 the ask, 1 to 3 the questions, 4 done, -1 declined. */
  const [survey, setSurvey] = useState(0);
  /** A ride started from a Home tile: when the car gets there, that place's details open by themselves. */
  const [arrive, setArrive] = useState<TripId | null>(null);
  /** Counts those rides, so the same place can be driven to twice. */
  const [driveNo, setDriveNo] = useState(0);
  /** The side of Ram on show in About. */
  const [facet, setFacet] = useState<FacetId>('roots');
  /** Counts moves between screens, so the keyboard can follow each one. */
  const [moves, setMoves] = useState(0);
  const opener = useRef<HTMLElement | null>(null);

  const step = useCallback(() => setMoves((n) => n + 1), []);
  const cool = useRef<number | undefined>(undefined);
  /** Pointing ends a moment after the pointer leaves, so it can travel from a place to the card that opened beside it. */
  const setHot = useCallback((id: StopId | null) => {
    window.clearTimeout(cool.current);
    if (!id) {
      cool.current = window.setTimeout(() => setHotOnly(null), 260);
      return;
    }
    setHotOnly(id);
    if (id !== 'you') setLookState({ stop: id, trip: stop(id).trip });
  }, []);
  /** Point at a whole trip (from a row in the phone): its end stop lights up on the map. */
  const setLook = useCallback((id: TripId | null) => {
    window.clearTimeout(cool.current);
    if (!id) {
      cool.current = window.setTimeout(() => setHotOnly(null), 260);
      return;
    }
    const t = getTrip(id);
    const end = t.to === 'you' ? t.from : t.to;
    setHotOnly(id === 'story' || id === 'idle-minutes' ? null : end);
    setLookState({ trip: id });
  }, []);
  const screen = stack[stack.length - 1];

  const push = (sc: Screen) => {
    step();
    setStack((st) => [...st, sc]);
  };
  const back = () => {
    step();
    setArrive(null);
    setStack((st) => (st.length > 1 ? st.slice(0, -1) : st));
  };
  const goTab = (tab: Tab, home?: HomeTab) => {
    step();
    setArrive(null);
    if (home) setHomeTab(home);
    setStack([{ s: 'tab', tab }]);
  };
  const openSheet = useCallback((s: Exclude<Sheet, null>) => {
    opener.current = document.activeElement as HTMLElement | null;
    setSheet(s);
  }, []);
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
      setMode('quick');
      setSheet(null);
      setProject(null);
      setArrive(null);
      setHotOnly(null);
      setPeek(null);
      // the idea for Uber is not a place on the road: it has a page of its own
      if (id === 'idle-minutes') {
        setLookState(null);
        setSurvey(0);
        setStack((st) => [...st.filter((sc) => sc.s === 'tab' || sc.s === 'search').slice(0, 2), { s: 'idea' }]);
        return;
      }
      setLookState({ trip: id });
      setStack((st) => [...st.filter((sc) => sc.s === 'tab' || sc.s === 'search').slice(0, 2), { s: 'choose', trip: id }]);
    },
    [step],
  );

  /** A Home tile: no choosing. The car drives straight there, and the place's details open when it arrives. */
  const driveTo = useCallback(
    (id: TripId) => {
      step();
      setMode('quick');
      setSheet(null);
      setProject(null);
      setHotOnly(null);
      setPeek(null);
      setLookState({ trip: id });
      setArrive(id);
      setDriveNo((n) => n + 1);
      setStack((st) => [...st.filter((sc) => sc.s === 'tab' || sc.s === 'search').slice(0, 2), { s: 'details', trip: id, mode: 'quick' }]);
    },
    [step],
  );
  /** The car has arrived: open what Ram did there. */
  const landed = useCallback((id: TripId) => {
    setArrive(null);
    setProject(id);
  }, []);

  /** Set one end of the Journey route. The two ends are then put in time order, or the reverse if the visitor swapped them. */
  const setEnd = (end: 'from' | 'to', id: StopId) =>
    setJourneyRaw((j) => {
      const other = end === 'from' ? 'to' : 'from';
      // the same place at both ends makes no route, so that pick is ignored
      if (j[other] === id) return j;
      const f = forward({ ...j, [end]: id });
      return swapped ? flip(f) : f;
    });

  // what the panel beside the phone should show for this moment
  const onTrip = screen.s === 'choose' || screen.s === 'finding' || screen.s === 'details' ? getTrip(screen.trip) : null;
  const onJourney = screen.s === 'tab' && screen.tab === 'home' && homeTab === 'journey';
  const where: ScreenKey = sheet ?? (screen.s === 'tab' ? (screen.tab === 'home' ? (homeTab === 'ram' ? 'home' : homeTab) : screen.tab) : screen.s);
  /** The trip a Journey selection opens. */
  const jf = forward(journey);
  const journeyTrip: TripId = stop(jf.to).type === 'you' ? (jf.from === 'st-dominics' ? 'story' : stop(jf.from).trip) : stop(jf.to).trip;
  const route = onTrip ? { from: onTrip.from, to: onTrip.to } : onJourney ? journey : null;
  const tripMode: Mode = screen.s === 'finding' || screen.s === 'details' ? screen.mode : mode;

  return {
    stack, setStack, screen, homeTab, setHomeTab, sheet, mode, setMode, journey, setJourney, setEnd, swapEnds, hot, setHot, look, setLook, peek, setPeek, project, setProject, survey, setSurvey, facet, setFacet, moves, step,
    push, back, goTab, openSheet, closeSheet, ride, driveTo, landed, arrive, driveNo,
    where, onTrip, onJourney, journeyTrip, route, tripMode,
  };
}

export type Ride = ReturnType<typeof useRide>;
