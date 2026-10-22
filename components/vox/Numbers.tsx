import { CHAPTERS_V, THE_NUMBERS } from '@/lib/explained';
import { Chapter, Mark, Ring, Tape, win } from './parts';

/** Each highlighted phrase gets its own window: the line's start, then 0.06 later for a second phrase. */
function windows(parts: (string | { mark: string })[], start: number) {
  let n = 0;
  return parts.map((p) => (typeof p === 'string' ? null : start + 0.06 * n++));
}

/** Chapter 1: the record as a highlighted document; the camera reads it line by line, then pulls out. */
export default function Numbers() {
  const { lines } = THE_NUMBERS;
  const keys = [[0.1, 0, 30, 1.2, -2], ...lines.map((l) => l.cam), [0.9, 0, 0, 1, 0]];

  return (
    <Chapter id="numbers" len={5.4} card={CHAPTERS_V.numbers} className="vx-numbers">
      <div className="vx-doc-frame">
        <div className="vx-cam" data-cam={JSON.stringify(keys)}>
          <article className="vx-doc">
            <Tape n={1} className="vx-doc-t1" />
            <Tape n={3} className="vx-doc-t2" />
            <header className="vx-doc-head">
              <span>{THE_NUMBERS.meta}</span>
              <b>{THE_NUMBERS.heading}</b>
            </header>
            {lines.map((l, i) => {
              const at = windows(l.parts, l.cam[0]);
              return (
                <p className="vx-line" key={i}>
                  {l.parts.map((part, j) =>
                    typeof part === 'string' ? (
                      part
                    ) : (
                      <Mark key={j} a={at[j]!} b={at[j]! + 0.09}>
                        {part.mark}
                      </Mark>
                    ),
                  )}
                </p>
              );
            })}
            <footer className="vx-doc-foot">{THE_NUMBERS.source}</footer>

            {/* stat stickers slap in beside their line, alternating sides */}
            {lines.map((l, i) => (
              <div key={i} className={`vx-stat k slap ${i % 2 ? 'left' : 'right'}`} style={win(l.cam[0] + 0.04, l.cam[0] + 0.1, { '--r': `${i % 2 ? -4 : 3}deg`, '--row': i })}>
                <b>
                  {l.stat.value}
                  {i === 0 && <Ring a={0.26} b={0.34} />}
                </b>
                <span>{l.stat.label}</span>
              </div>
            ))}
          </article>
        </div>
      </div>
    </Chapter>
  );
}
