'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The clock behind a car's drive: 0 at the start, 1 on arrival.
 * `drive` names the drive; a new string starts a new one, null means no drive (the clock reads 1).
 * It always arrives: time only counts while not paused, a slow timer keeps it moving if animation frames stop
 * (a hidden tab), and with `ms` of 0 it arrives at once. `onDone` fires exactly once for each drive.
 */
export function useDriveClock(drive: string | null, ms: number, { paused, skip, onDone }: { paused?: boolean; skip?: string | null; onDone?: () => void }): number {
  const [run, setRun] = useState({ key: '', p: 1 });
  const calls = useRef({ onDone, paused: !!paused });
  const end = useRef<(() => void) | null>(null);
  useEffect(() => {
    calls.current = { onDone, paused: !!paused };
  });
  useEffect(() => {
    if (!drive) return;
    let done = false;
    let raf = 0;
    const finish = () => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      setRun({ key: drive, p: 1 });
      calls.current.onDone?.();
    };
    end.current = finish;
    if (!ms) {
      const id = window.setTimeout(finish, 0);
      return () => window.clearTimeout(id);
    }
    let driven = 0;
    let seen = performance.now();
    const advance = (now: number) => {
      // a frame's own timestamp can be a moment earlier than the clock read just before it, so never count backwards
      const dt = Math.max(0, Math.min(now - seen, 600));
      seen = now;
      if (!calls.current.paused) driven += dt;
      const at = Math.max(0, Math.min(1, driven / ms));
      if (at >= 1) return finish();
      setRun({ key: drive, p: at });
    };
    const tick = (now: number) => {
      advance(now);
      if (!done) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const backup = window.setInterval(() => {
      if (!done && performance.now() - seen > 700) advance(performance.now());
    }, 500);
    return () => {
      done = true;
      cancelAnimationFrame(raf);
      window.clearInterval(backup);
      end.current = null;
    };
  }, [drive, ms]);
  useEffect(() => {
    if (skip && skip === drive) end.current?.();
  }, [skip, drive]);
  return drive ? (run.key === drive ? run.p : 0) : 1;
}
