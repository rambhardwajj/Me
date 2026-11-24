'use client';

import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { PROFILE } from '@/lib/data';
import { localAnswer } from '@/lib/faq';
import { MascotFace } from './MascotFace';
import { EASE } from './Motion';

/** What Mini Ram can say as a section scrolls into view; only the first one reached shows, once per session. */
const COMMENTS: Record<string, string> = {
  top: 'Hey! I’m Mini Ram 👋 Drag that globe, it’s Ram’s journey.',
  personas: 'Three Rams, one person. Hover a side to meet him.',
  journey: 'Scroll to spin the dial: Mathura → Chicago → product.',
  experience: 'Hover a card. Each one replays what Ram did there.',
  work: 'Tap any device to open the live product ↗',
  contact: 'Still curious? Click me and ask anything about Ram.',
};

/** One comment per browser session. */
const MAX_BUBBLES = 1;

const SUGGESTIONS = ['What is Ram doing now?', 'What are his biggest wins?', 'Tell me about LeetCase', 'Why hire Ram as a PM?'];

/** `failed` holds the question an answer could not be fetched for, so it can be asked again. */
type Msg = { role: 'user' | 'assistant'; content: string; failed?: string };

/** How long Mini Ram may stay silent, before the first word or between two words, until it gives up and says so. */
const PATIENCE_MS = 10_000;
const SLOW = 'Sorry, that took too long. I gave up after 10 seconds rather than keep you waiting.';
const BROKEN = 'Sorry, I could not reach my answers just now. Your connection or my server may be having a moment.';

const GREETING: Msg = { role: 'assistant', content: `Hi! I’m Mini Ram, Ram’s AI sidekick. Ask me about his experience, products, wins or how to reach him.` };

/** `comments` maps section ids to what Mini Ram says there; defaults to the classic site's sections. */
/** `startOpen` opens the chat on arrival: for pages that load Mini Ram only once a visitor has asked for it. */
export default function Mascot({ comments = COMMENTS, startOpen = false }: { comments?: Record<string, string>; startOpen?: boolean }) {
  const notes = useRef(comments);
  const [open, setOpen] = useState(startOpen);
  const [bubble, setBubble] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const said = useRef(new Set<string>());
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const openRef = useRef(open);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // the eyes follow the cursor around the page
  useEffect(() => {
    let raf = 0,
      x = 0,
      y = 0;
    const update = () => {
      raf = 0;
      const b = btnRef.current;
      if (!b) return;
      const r = b.getBoundingClientRect();
      const dx = x - (r.left + r.width / 2),
        dy = y - (r.top + r.height * 0.45);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 260) * 2.4;
      b.style.setProperty('--px', `${((dx / d) * k).toFixed(2)}px`);
      b.style.setProperty('--py', `${((dy / d) * k * 0.45).toFixed(2)}px`);
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  // other parts of the page can open the chat: window.dispatchEvent(new Event('mini-ram:open'))
  useEffect(() => {
    const onOpen = () => {
      setBubble(null);
      setOpen(true);
    };
    window.addEventListener('mini-ram:open', onOpen);
    return () => window.removeEventListener('mini-ram:open', onOpen);
  }, []);

  // pop a comment as each section arrives
  useEffect(() => {
    // one comment per browser session, never over the hero buttons or the footer
    const seen = () => {
      try {
        return JSON.parse(sessionStorage.getItem('mini-ram-said') || '[]') as string[];
      } catch {
        return [...said.current];
      }
    };
    const remember = (ids: string[]) => {
      try {
        sessionStorage.setItem('mini-ram-said', JSON.stringify(ids));
      } catch {}
    };
    const coversCta = () => {
      const cta = document.querySelector('.hero-cta')?.getBoundingClientRect();
      const foot = document.querySelector('.foot')?.getBoundingClientRect();
      const onCta = !!cta && cta.bottom > 0 && cta.top < window.innerHeight && (cta.bottom > window.innerHeight - 240 || window.innerWidth < 900);
      // on phones the hero is one long column, so wait until it has scrolled away entirely
      const hero = document.getElementById('top')?.getBoundingClientRect();
      const inHero = window.innerWidth < 900 && !!hero && hero.bottom > 80;
      return onCta || inHero || (!!foot && foot.top < window.innerHeight);
    };
    const say = (id: string) => {
      const ids = seen();
      if (openRef.current || said.current.has(id) || ids.includes(id) || ids.length >= MAX_BUBBLES || coversCta()) return;
      said.current.add(id);
      remember([...ids, id]);
      setBubble(notes.current[id]);
      clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setBubble(null), 5000);
    };
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && say(e.target.id)),
      { rootMargin: '-35% 0px -45% 0px' },
    );
    const first = setTimeout(() => {
      Object.keys(notes.current).forEach((id) => {
        const el = document.getElementById(id);
        if (el) io.observe(el);
      });
    }, 1800);
    return () => {
      clearTimeout(first);
      clearTimeout(hideTimer.current);
      io.disconnect();
    };
  }, []);

  // open/close behaviour: hide the bubble, focus the input, Esc closes
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const show = (v: boolean) => {
    setBubble(null);
    setOpen(v);
  };

  /** Ask a question. `retry` is the index of a failed answer to replace, when the visitor asks the same thing again. */
  const send = async (text: string, retry?: number) => {
    const q = text.trim();
    if (!q || busy) return;
    // the conversation up to this question; a retry drops the failed answer and re-uses the question above it
    const before = retry === undefined ? [...messages, { role: 'user' as const, content: q }] : messages.slice(0, retry);
    setMessages([...before, { role: 'assistant', content: '' }]);
    setInput('');
    setBusy(true);
    const write = (content: string, failed?: string) =>
      setMessages((m) => {
        const copy = m.slice();
        copy[copy.length - 1] = { role: 'assistant', content, failed };
        return copy;
      });
    // one clock for the whole answer: it is wound back each time a word arrives, and stops the request when it runs out
    const ctl = new AbortController();
    let timedOut = false;
    let clock: ReturnType<typeof setTimeout> | undefined;
    const wind = () => {
      clearTimeout(clock);
      clock = setTimeout(() => {
        timedOut = true;
        ctl.abort();
      }, PATIENCE_MS);
    };
    let out = '';
    try {
      wind();
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: before.filter((m) => m !== GREETING && !m.failed).map(({ role, content }) => ({ role, content })) }),
        signal: ctl.signal,
      });
      if (res.status === 429) return write('I’m getting a lot of questions right now 😅 Give me a minute and ask again.', q);
      if (!res.ok || !res.body) return write(localAnswer(q));
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      while (true) {
        wind();
        const { done, value } = await reader.read();
        if (done) break;
        out += dec.decode(value, { stream: true });
        write(out);
      }
      if (!out) write(localAnswer(q));
    } catch {
      // keep whatever already arrived; otherwise say what happened, and offer to try again
      if (out) write(out);
      else write(timedOut ? SLOW : BROKEN, q);
    } finally {
      clearTimeout(clock);
      setBusy(false);
    }
  };

  return (
    // reducedMotion="user": the chat appears without sliding or scaling for visitors who ask for less motion
    <MotionConfig reducedMotion="user">
    <div className="mascot">
      <AnimatePresence>
        {open && (
          <motion.div
            className="mchat"
            role="dialog"
            aria-label="Chat with Mini Ram"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <header className="mchat-head">
              <span className="mchat-av">
                <MascotFace size={44} />
              </span>
              <span>
                <b>Mini Ram</b>
                <small>
                  <i /> AI · knows Ram’s whole story
                </small>
              </span>
              <button className="mchat-x" onClick={() => show(false)} aria-label="Close chat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </header>

            <div className="mchat-list" ref={listRef} aria-live="polite">
              {messages.map((m, i) => (
                <div key={i} className={`mmsg ${m.role} ${m.failed ? 'failed' : ''}`} role={m.failed ? 'alert' : undefined}>
                  {m.content || (
                    <span className="mtyping" role="status" aria-label="Mini Ram is typing">
                      <i />
                      <i />
                      <i />
                    </span>
                  )}
                  {m.failed && (
                    <span className="mretry">
                      <button type="button" onClick={() => send(m.failed!, i)} disabled={busy}>
                        Retry
                      </button>
                      <a href={`mailto:${PROFILE.email}`}>Email Ram instead</a>
                    </span>
                  )}
                </div>
              ))}
              {messages.length === 1 && (
                <div className="mchat-sugg">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => send(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              className="mchat-form"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything about Ram…" maxLength={600} aria-label="Your question" />
              <button type="submit" disabled={busy || !input.trim()} aria-label="Send">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>
            <p className="mchat-note">AI answers from Ram’s portfolio. It can make mistakes.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {bubble && !open && (
          <motion.button
            key={bubble}
            className="mbubble"
            onClick={() => show(true)}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            {bubble}
          </motion.button>
        )}
      </AnimatePresence>

      <motion.button
        ref={btnRef}
        className={`mbtn ${open ? 'open' : ''} ${busy ? 'thinking' : ''}`}
        onClick={() => show(!open)}
        aria-label={open ? 'Close chat with Mini Ram' : 'Chat with Mini Ram, Ram’s AI sidekick'}
        aria-expanded={open}
        initial={{ opacity: 0, y: 40, scale: 0.6 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.7, ease: EASE }}
      >
        <MascotFace size={88} />
        <span className="mbtn-dot" aria-hidden />
      </motion.button>
    </div>
    </MotionConfig>
  );
}
