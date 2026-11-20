'use client';

import { useCallback, useRef, useState } from 'react';
import { stop, trip as getTrip, type ScreenKey, type StopId, type TripId } from '@/lib/uber';

export type Tab = 'home' | 'services' | 'activity' | 'account';
export type HomeTab = 'ram' | 'shipped' | 'journey';
export type Mode = 'quick' | 'full';
export type Screen = { s: 'tab'; tab: Tab } | { s: 'search' } | { s: 'inbox' } | { s: 'choose'; trip: TripId } | { s: 'finding'; trip: TripId; mode: Mode } | { s: 'details'; trip: TripId; mode: Mode };
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
  const [journey, setJourney] = useState<{ from: StopId; to: StopId }>({ from: 'st-dominics', to: 'you' });
  /** The stop the pointer is on, in the map or in a list, so each can light up the other. */
  const [hot, setHot] = useState<StopId | null>(null);
  /** Counts moves between screens, so the keyboard can follow each one. */
  const [moves, setMoves] = useState(0);
  const opener = useRef<HTMLElement | null>(null);

  const step = useCallback(() => setMoves((n) => n + 1), []);
  const screen = stack[stack.length - 1];

  const push = (sc: Screen) => {
    step();
    setStack((st) => [...st, sc]);
  };
  const back = () => {
    step();
    setStack((st) => (st.length > 1 ? st.slice(0, -1) : st));
  };
  const goTab = (tab: Tab, home?: HomeTab) => {
    step();
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
      setHot(null);
      setStack((st) => [...st.filter((sc) => sc.s === 'tab' || sc.s === 'search').slice(0, 2), { s: 'choose', trip: id }]);
    },
    [step],
  );

  /** Set one end of the Journey route; picking the place already at the other end swaps the two. */
  const setEnd = (end: 'from' | 'to', id: StopId) =>
    setJourney((j) => {
      const other = end === 'from' ? 'to' : 'from';
      return j[other] === id ? { from: j.to, to: j.from } : { ...j, [end]: id };
    });

  // what the panel beside the phone should show for this moment
  const onTrip = screen.s === 'choose' || screen.s === 'finding' || screen.s === 'details' ? getTrip(screen.trip) : null;
  const onJourney = screen.s === 'tab' && screen.tab === 'home' && homeTab === 'journey';
  const where: ScreenKey = sheet ?? (screen.s === 'tab' ? (screen.tab === 'home' ? (homeTab === 'ram' ? 'home' : homeTab) : screen.tab) : screen.s);
  /** The trip a Journey selection opens. */
  const journeyTrip: TripId = stop(journey.to).type === 'you' ? (journey.from === 'st-dominics' ? 'story' : stop(journey.from).trip) : stop(journey.to).trip;
  const route = onTrip ? { from: onTrip.from, to: onTrip.to } : onJourney ? journey : null;
  const tripMode: Mode = screen.s === 'finding' || screen.s === 'details' ? screen.mode : mode;

  return {
    stack, setStack, screen, homeTab, setHomeTab, sheet, mode, setMode, journey, setJourney, setEnd, hot, setHot, moves, step,
    push, back, goTab, openSheet, closeSheet, ride,
    where, onTrip, onJourney, journeyTrip, route, tripMode,
  };
}

export type Ride = ReturnType<typeof useRide>;
