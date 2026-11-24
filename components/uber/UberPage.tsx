'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { PROFILE } from '@/lib/data';
import { BILLBOARD, RESERVE, THEME_KEY, TRIBUTE_LONG, type PersonaId } from '@/lib/uber';
import { PROPOSAL_HREF, WORK_HREF, caseHref } from '@/lib/uber-cases';
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

/** The theme: the visitor's own choice once they have made one, and until then what their system asks for. */
const THEME_EVENT = 'uber-theme-change';
function useDark(): [boolean, (dark: boolean) => void] {
  const dark = useSyncExternalStore(
    (notify) => {
      const system = window.matchMedia('(prefers-color-scheme: dark)');
      window.addEventListener(THEME_EVENT, notify);
      window.addEventListener('storage', notify);
      system.addEventListener('change', notify);
      return () => {
        window.removeEventListener(THEME_EVENT, notify);
        window.removeEventListener('storage', notify);
        system.removeEventListener('change', notify);
      };
    },
    () => {
      try {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === 'dark' || saved === 'light') return saved === 'dark';
      } catch {}
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
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

  // at phone size there is no map beside the app to drive on: the trip opens, then the place's details
  const { arrive, landed } = ride;
  const onDetails = ride.screen.s === 'details';
  useEffect(() => {
    // the request plays first (finding, connecting, confirmed); the details follow once the trip has opened
    if (desk || !arrive || !onDetails) return;
    const t = window.setTimeout(() => landed(arrive), reduced ? 0 : 900);
    return () => window.clearTimeout(t);
  }, [desk, arrive, landed, reduced, onDetails]);

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
  const askMiniRam = () => window.dispatchEvent(new Event('mini-ram:open'));

  const mailto = `mailto:${PROFILE.email}?subject=${encodeURIComponent(RESERVE.subject)}`;
  const tick = <Icon name="check" size={28} w={2.5} />;

  return (
    <div className={`ub ${fonts} ${dark ? 'vox-dark' : ''}`} data-theme={dark ? 'dark' : 'light'} suppressHydrationWarning>
      <a className="ub-skip" href="#main">
        Skip to the content
      </a>
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
                {PROFILE.resume && (
                  <a href={PROFILE.resume} download>
                    {BILLBOARD.resume}
                  </a>
                )}
                {/* no prefetch: fetching the main site ahead of time also pulled its 200 KB portrait into this page */}
                <Link href="/" prefetch={false}>
                  Main site
                </Link>
                <button type="button" className="ub-theme" role="switch" aria-checked={dark} aria-label="Dark theme" title={dark ? 'Switch to light' : 'Switch to dark'} onClick={() => chooseDark(!dark)}>
                  <Icon name={dark ? 'sun' : 'moon'} size={18} />
                </button>
              </nav>
            </header>

            <main id="main" className="ub-main" tabIndex={-1}>
            {/* first screen: who Ram is, what he did, one number, and the four things a visitor came for, one tap each */}
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
                <p className="ub-sub">{BILLBOARD.pitch}</p>
                <p className="ub-proof1">
                  <b>{BILLBOARD.proof.value}</b>
                  <span>{BILLBOARD.proof.label}</span>
                </p>
                <div className="ub-acts">
                  <Link className="ub-btn solid" href={caseHref('trucost')}>
                    {BILLBOARD.caseStudy}
                  </Link>
                  <Link className="ub-btn line" href={PROPOSAL_HREF}>
                    {BILLBOARD.proposal}
                  </Link>
                </div>
                <nav className="ub-quick" aria-label="Shortcuts">
                  {PROFILE.resume && (
                    <a className="ub-link" href={PROFILE.resume} download>
                      {BILLBOARD.resume}
                    </a>
                  )}
                  <a className="ub-link" href={mailto}>
                    {BILLBOARD.contact}
                  </a>
                  <Link className="ub-link" href={WORK_HREF}>
                    All work
                  </Link>
                  <button type="button" className="ub-link" onClick={start}>
                    {BILLBOARD.ride}
                  </button>
                </nav>
              </div>
            </section>

            {/* after the scroll: the phone crosses to the left; beside it the context, then the map */}
            <div className="ub-arrived" inert={desk && !arrived ? true : undefined}>
              {desk && <StagePanel app={ride} persona={persona} onPersona={setPersona} reducedMotion={reduced} />}
            </div>

            {/* the cloud is for screens without the map; on the map, the place's own card opens instead */}
            {desk && arrived && ride.peek && !ride.sheet && !ride.route && ride.where !== 'search' && <ThoughtCloud trip={ride.peek.trip} x={ride.peek.x} y={ride.peek.y} />}

            <div className="ub-phone" ref={app}>
              {/* phone widths: the app starts here, and the way past it is said first */}
              <div className="ub-frame">
                <div className="ub-glass" inert={desk && !arrived ? true : undefined}>
                  <PhoneApp ref={phone} persona={persona} onPersona={setPersona} dark={dark} onDark={chooseDark} app={ride} reducedMotion={reduced} />
                </div>
                {desk && !arrived && (
                  <button type="button" className="ub-phone-open" onClick={open} aria-label="Open the phone: it is Ram's portfolio" />
                )}
              </div>
            </div>

            </main>

            {/* phone widths only: the same four ways out, after the app. On a laptop they are on the first screen and in the panel */}
            <footer className="ub-foot">
              <nav aria-label="Shortcuts, again">
                <Link href={caseHref('trucost')}>TruCost case study</Link>
                <Link href={PROPOSAL_HREF}>{BILLBOARD.proposal}</Link>
                {PROFILE.resume && (
                  <a href={PROFILE.resume} download>
                    {BILLBOARD.resume}
                  </a>
                )}
                <a href={mailto}>Contact</a>
              </nav>
              <small>{TRIBUTE_LONG}</small>
            </footer>
          </div>
        </div>
      </div>
      <ProjectDialog
        id={ride.project}
        arrived={!!ride.project && ride.arrivedAt === ride.project}
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
