'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { PROFILE } from '@/lib/data';
import { MascotFace } from './MascotFace';
import { EASE } from './Motion';

/** What Mini Ram says as each section scrolls into view (once each). */
const COMMENTS: Record<string, string> = {
  top: 'Hey! I’m Mini Ram 👋 Drag that globe, it’s Ram’s journey.',
  personas: 'Three Rams, one person. Hover a side to meet him.',
  journey: 'Scroll to spin the dial: Mathura → Chicago → product.',
  experience: 'Hover a card. Each one replays what Ram did there.',
  work: 'Tap any device to open the live product ↗',
  contact: 'Still curious? Click me and ask anything about Ram.',
};

const SUGGESTIONS = ['What is Ram doing now?', 'What are his biggest wins?', 'Tell me about LeetCase', 'Why hire Ram as a PM?'];

type Msg = { role: 'user' | 'assistant'; content: string };

const GREETING: Msg = { role: 'assistant', content: `Hi! I’m Mini Ram, Ram’s AI sidekick. Ask me about his experience, products, wins or how to reach him.` };

export default function Mascot() {
  const [open, setOpen] = useState(false);
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

  // pop a comment as each section arrives
  useEffect(() => {
    const say = (id: string) => {
      if (openRef.current || said.current.has(id)) return;
      said.current.add(id);
      setBubble(COMMENTS[id]);
      clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setBubble(null), 5200);
    };
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && say(e.target.id)),
      { rootMargin: '-35% 0px -45% 0px' },
    );
    const first = setTimeout(() => {
      Object.keys(COMMENTS).forEach((id) => {
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

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    const next: Msg[] = [...messages, { role: 'user', content: q }];
    setMessages([...next, { role: 'assistant', content: '' }]);
    setInput('');
    setBusy(true);
    const write = (content: string) =>
      setMessages((m) => {
        const copy = m.slice();
        copy[copy.length - 1] = { role: 'assistant', content };
        return copy;
      });
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: next.filter((m) => m !== GREETING) }),
      });
      if (res.status === 503) return write(`My brain isn’t plugged in yet 🔌 Meanwhile, Ram is one email away: ${PROFILE.email}`);
      if (res.status === 429) return write('I’m getting a lot of questions right now 😅 Give me a minute and ask again.');
      if (!res.ok || !res.body) return write(`Something went wrong on my side. You can always email Ram at ${PROFILE.email}.`);
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let out = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        out += dec.decode(value, { stream: true });
        write(out);
      }
      if (!out) write(`Hmm, I drew a blank. Try rephrasing, or email Ram at ${PROFILE.email}.`);
    } catch {
      write(`I couldn’t reach my brain just now. Ram’s email: ${PROFILE.email}`);
    } finally {
      setBusy(false);
    }
  };

  return (
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
                <div key={i} className={`mmsg ${m.role}`}>
                  {m.content || (
                    <span className="mtyping" aria-label="Typing">
                      <i />
                      <i />
                      <i />
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
  );
}
