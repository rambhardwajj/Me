/* Small building blocks for the explainer page. Server-safe: no hooks, just markup and CSS variables. */
import type { CSSProperties, ReactNode } from 'react';

/** A timing window for a piece: it gets its own --t from the chapter's --p. */
export const win = (a: number, b: number, extra?: Record<string, string | number>) => ({ '--a': a, '--b': b, ...extra }) as CSSProperties;

/** Highlighter swipe over a phrase. */
export function Mark({ a, b, children }: { a: number; b: number; children: ReactNode }) {
  return (
    <mark className="vx-hl k" style={win(a, b)}>
      {children}
    </mark>
  );
}

/** Red marker circle that draws itself around its parent. */
export function Ring({ a, b }: { a: number; b: number }) {
  return <span className="vx-ring k" style={win(a, b)} aria-hidden />;
}

/** A strip of masking tape. */
export function Tape({ n = 1, className = '', style }: { n?: 1 | 2 | 3; className?: string; style?: CSSProperties }) {
  return <span className={`vx-tape ${className}`} style={{ backgroundImage: `url(/vox/tape-${n}.webp)`, ...style }} aria-hidden />;
}

/** A tall chapter: the section's height is how long it plays, the sticky stage is what you watch. */
export function Chapter({ id, len, className = '', card, children }: { id: string; len: number; className?: string; card?: { n: string; word: string; color: string; ink: string }; children: ReactNode }) {
  return (
    <section id={id} className={`vx-chap ${className}`} data-chapter style={{ '--len': len } as CSSProperties}>
      <div className="vx-stage">
        {card && (
          <div className="vx-card k" style={win(0.05, 0.13, { '--c': card.color, '--ci': card.ink })} aria-hidden>
            <span className="vx-card-n">{card.n}</span>
            <span className="vx-card-w">{card.word}</span>
          </div>
        )}
        {card && <h2 className="vx-sr">{card.word}</h2>}
        {children}
      </div>
    </section>
  );
}
