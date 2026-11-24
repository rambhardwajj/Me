'use client';

import { useEffect, useState } from 'react';
import { RIDE } from '@/lib/uber';

/** How long the whole request takes before the car sets off. With reduced motion there is one short step. */
export const requestMs = (reduced: boolean) => (reduced ? 700 : RIDE.steps.reduce((n, s) => n + s.ms, 0));

/**
 * Where a ride request has got to: 0 finding a driver, 1 connecting, 2 confirmed.
 * `key` names the request; the phone and the panel beside it pass the same key, so they step together.
 */
export function useRideStep(key: string | null, reduced: boolean): number {
  const [at, setAt] = useState({ key: '', i: 0 });
  useEffect(() => {
    if (!key) return;
    if (reduced) {
      const id = window.setTimeout(() => setAt({ key, i: RIDE.steps.length - 1 }), 0);
      return () => window.clearTimeout(id);
    }
    let sum = 0;
    const ids = RIDE.steps.slice(0, -1).map((s, i) => {
      sum += s.ms;
      return window.setTimeout(() => setAt({ key, i: i + 1 }), sum);
    });
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [key, reduced]);
  return key && at.key === key ? at.i : 0;
}
