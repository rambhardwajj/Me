'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { BILLBOARD, PERSONAS, THEME_KEY, TRIBUTE_LONG, type PersonaId } from '@/lib/uber';
import PhoneApp, { type PhoneHandle } from './PhoneApp';
import ProjectDialog from './ProjectDialog';
import StagePanel from './StagePanel';
import ThoughtCloud from './ThoughtCloud';
import { Icon } from './icons';
import { useRide } from './useRide';

/** The stage is drawn on a 1440 × 900 canvas, like the artboards, and scaled to fit the window. */
const CANVAS = { w: 1440, h: 900 };
/** Laptop layout from this size up; below it the page is an intro followed by the app, full screen. */
const DESK = '(min-width: 1024px) and (min-height: 560px)';
/** How far the page can scroll: the phone travels from the Billboard to the stage over exactly this distance. */
const maxScroll = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

/** A media query as state. On the server, and until hydration, it reads as `onServer`. */
function useMedia(query: string, onServer: boolean) {
  return useSyncExternalStore(
    (notify) => {
      const m = window.matchMedia(query);
      m.addEventListener('change', notify);
      return () => m.removeEventListener('change', notify);
    },
    () => window.matchMedia(query).matches,
    () => onServer,
  );
}

/** The saved theme. Light unless the visitor chose dark in Account › Appearance. */
const THEME_EVENT = 'uber-theme-change';
function useDark(): [boolean, (dark: boolean) => void] {
  const dark = useSyncExternalStore(
    (notify) => {
      window.addEventListener(THEME_EVENT, notify);
      window.addEventListener('storage', notify);
      return () => {
        window.removeEventListener(THEME_EVENT, notify);
        window.removeEventListener('storage', notify);
      };
    },
    () => {
      try {
        return localStorage.getItem(THEME_KEY) === 'dark';
      } catch {
        return false;
      }
    },
    () => false,
  );
  const set = (v: boolean) => {
    try {
      localStorage.setItem(THEME_KEY, v ? 'dark' : 'light');
    } catch {}
    window.dispatchEvent(new Event(THEME_EVENT));
  };
  return [dark, set];
}

export default function UberPage({ fonts, children }: { fonts: string; children?: ReactNode }) {
  const [dark, chooseDark] = useDark();
  const [persona, setPersona] = useState<PersonaId>('pm');
  /** Where the visitor is in the app: the phone and the panel beside it both read this. */
  const ride = useRide();
  const desk = useMedia(DESK, true);
  const reduced = useMedia('(prefers-reduced-motion: reduce)', false);
  /** True once the scroll has carried the phone to the centre of the stage. */
  const [scrolled, setScrolled] = useState(false);
  /** On phones the app is always live. */
  const arrived = !desk || scrolled;

  const stage = useRef<HTMLDivElement>(null);
  const app = useRef<HTMLDivElement>(null);
  const phone = useRef<PhoneHandle>(null);
  const pending = useRef<null | (() => void)>(null);

  // scroll drives the phone from the Billboard's tilt to the centre of the stage
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    if (!desk) {
      el.style.removeProperty('--p');
      return;
    }
    // scroll events already arrive once per frame, so this runs straight from the listener
    const update = () => {
      const max = maxScroll();
      // arrived means the page is at (or within a pixel of) the end of its scroll, whatever the rounding
      const atEnd = window.scrollY >= max - 1;
      const raw = max <= 0 || atEnd ? 1 : Math.min(1, Math.max(0, window.scrollY / max));
      // reduced motion: no in-between frames, the same two end states
      const p = reduced ? (raw > 0.5 ? 1 : 0) : raw;
      el.style.setProperty('--p', p.toFixed(4));
      el.style.setProperty('--cs', Math.min(1.3, window.innerWidth / CANVAS.w, window.innerHeight / CANVAS.h).toFixed(4));
      const there = p >= 1;
      setScrolled(there);
      if (there && pending.current) {
        const run = pending.current;
        pending.current = null;
        run();
      }
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [desk, reduced]);

  /** Bring the phone into view, then run something in it. */
  const toPhone = useCallback(
    (then: () => void) => {
      const behavior: ScrollBehavior = reduced ? 'instant' : 'smooth';
      if (!desk) {
        app.current?.scrollIntoView({ behavior, block: 'start' });
        then();
        return;
      }
      const top = maxScroll();
      if (window.scrollY >= top - 1) {
        then();
        return;
      }
      pending.current = then;
      window.scrollTo({ top, behavior });
      // if the smooth scroll is interrupted or throttled, finish the trip anyway
      window.setTimeout(() => pending.current === then && window.scrollTo({ top, behavior: 'instant' }), 1400);
    },
    [desk, reduced],
  );

  const start = () => toPhone(() => ride.ride('story'));
  const open = () => toPhone(() => phone.current?.focus());
  const reserve = () => toPhone(() => ride.openSheet('reserve'));
  const pick = (id: PersonaId) => {
    setPersona(id);
    open();
  };
  const askMiniRam = () => window.dispatchEvent(new Event('mini-ram:open'));

  const tick = <Icon name="check" size={28} w={2.5} />;

  return (
    <div className={`ub ${fonts} ${dark ? 'vox-dark' : ''}`} data-theme={dark ? 'dark' : 'light'} suppressHydrationWarning>
      <div className="ub-scroll">
        <div className="ub-stage" ref={stage}>
          <div className="ub-canvas">
            <header className="ub-head">
              <a
                className="ub-mark"
                href="#top"
                aria-label="Ram: back to the first screen"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' });
                }}
              >
                {BILLBOARD.wordmark}
              </a>
              <span className="ub-tribute">{TRIBUTE_LONG}</span>
              <nav className="ub-head-links" aria-label="Elsewhere">
                <button type="button" onClick={askMiniRam}>
                  Ask Mini Ram
                </button>
                <Link href="/">Main site</Link>
                <button type="button" className="ub-theme" role="switch" aria-checked={dark} aria-label="Dark theme" title={dark ? 'Switch to light' : 'Switch to dark'} onClick={() => chooseDark(!dark)}>
                  <Icon name={dark ? 'sun' : 'moon'} size={18} />
                </button>
              </nav>
            </header>

            {/* first screen: the Billboard */}
            <section className="ub-bill" aria-label="Introduction" inert={desk && arrived ? true : undefined}>
              <div className="ub-bill-copy">
                {BILLBOARD.statuses.map((s) => (
                  <p key={s} className="ub-status">
                    {tick}
                    {s}
                  </p>
                ))}
                <h1 className="ub-h1">
                  {BILLBOARD.headline.before} <span className="ub-2min">{BILLBOARD.headline.badge}</span> {BILLBOARD.headline.after}
                </h1>
              </div>
              <div className="ub-pitch">
                <p>{BILLBOARD.pitch}</p>
                <button type="button" className="ub-btn solid" onClick={start}>
                  {BILLBOARD.start}
                </button>
                <button type="button" className="ub-btn line" onClick={reserve}>
                  {BILLBOARD.reserve}
                </button>
              </div>
              <div className="ub-choose">
                <h2>{BILLBOARD.chooseTitle}</h2>
                <div role="radiogroup" aria-label={BILLBOARD.chooseTitle}>
                  {PERSONAS.map((p) => (
                    <button key={p.id} type="button" role="radio" aria-checked={p.id === persona} className={p.id === persona ? 'on' : ''} onClick={() => pick(p.id)}>
                      <span>
                        <b>{p.card.name}</b>
                        <small>{p.card.time}</small>
                      </span>
                      <span>{p.card.line}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* after the scroll: the phone on the left, and beside it the same moment at full size */}
            <div className="ub-arrived" inert={desk && !arrived ? true : undefined}>
              {desk && <StagePanel app={ride} persona={persona} onPersona={setPersona} reducedMotion={reduced} />}
            </div>

            {desk && arrived && ride.peek && !ride.sheet && <ThoughtCloud trip={ride.peek.trip} x={ride.peek.x} y={ride.peek.y} />}

            <div className="ub-phone" ref={app}>
              <div className="ub-frame">
                <div className="ub-glass" inert={desk && !arrived ? true : undefined}>
                  <PhoneApp ref={phone} persona={persona} onPersona={setPersona} dark={dark} onDark={chooseDark} app={ride} reducedMotion={reduced} />
                </div>
                {desk && !arrived && (
                  <button type="button" className="ub-phone-open" onClick={open} aria-label="Open the phone: it is Ram's portfolio" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProjectDialog
        id={ride.project}
        onClose={() => ride.setProject(null)}
        onRide={(id) => {
          ride.setProject(null);
          toPhone(() => ride.ride(id));
        }}
        onReserve={() => {
          ride.setProject(null);
          toPhone(() => ride.openSheet('reserve'));
        }}
      />
      {children}
    </div>
  );
}
