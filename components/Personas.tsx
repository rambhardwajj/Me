'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { PERSONAS, type Persona } from '@/lib/data';
import { EASE, Lines, Reveal } from './Motion';

const GLYPHS: Record<Persona['id'], string> = {
  instagram:
    'M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3c1.2-.1 1.6-.1 4.8-.1zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.6 6.8 7 7 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9z',
  x: 'M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77zm-1.08 16.2h1.7L7.4 4.73H5.58z',
  linkedin:
    'M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3 9.75h4V21H3zM9.5 9.75h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-4.95c0-1.18-.02-2.7-1.65-2.7-1.65 0-1.9 1.29-1.9 2.62V21h-4z',
};

function Glyph({ id, size = 18 }: { id: Persona['id']; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d={GLYPHS[id]} />
    </svg>
  );
}

/** "Pick a Ram": three tall avatars; the one you point at widens, turns full colour and tells its story. */
export default function Personas() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="sec alt personas" id="personas">
      <div className="wrap">
        <header className="sec-head">
          <div>
            <span className="label kicker">Three sides of me</span>
            <h2>
              <Lines inView lines={['Pick a Ram.']} />
            </h2>
          </div>
          <Reveal delay={0.15}>
            <p>Same person, three feeds. Hover over a side to meet him, then follow the one you like.</p>
          </Reveal>
        </header>

        <div className={`pp ${active !== null ? 'has-active' : ''}`} onPointerLeave={() => setActive(null)}>
          {PERSONAS.map((p, i) => (
            <motion.a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className={`pp-panel pp-${p.id} ${active === i ? 'on' : ''}`}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onPointerMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
              }}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: EASE, delay: i * 0.12 }}
              aria-label={`${p.name}: follow on ${p.platform}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="pp-photo" src={p.photo} alt="" loading="lazy" />
              <span className="pp-tint" aria-hidden />
              <span className="pp-shade" aria-hidden />
              <span className="pp-glow" aria-hidden />

              <span className="pp-top">
                <span className="pp-badge">
                  <Glyph id={p.id} />
                </span>
                <span className="pp-no">0{i + 1}</span>
              </span>

              <span className="pp-bottom">
                <span className="pp-platform">
                  {p.platform} · {p.handle}
                </span>
                <span className="pp-name">{p.name}</span>
                <span className="pp-more">
                  <span className="pp-tagline">{p.tagline}</span>
                  <span className="pp-chips">
                    {p.chips.map((c) => (
                      <span key={c}>{c}</span>
                    ))}
                  </span>
                  <span className="pp-cta">
                    <Glyph id={p.id} size={15} /> Follow on {p.platform} <span aria-hidden>↗</span>
                  </span>
                </span>
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
