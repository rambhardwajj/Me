'use client';

import { useEffect } from 'react';

/** Clicking a browser tab in the Work chapter scrolls to that product. Renders nothing. */
export default function WorkJump() {
  useEffect(() => {
    const sec = document.getElementById('work');
    if (!sec) return;
    const onClick = (e: MouseEvent) => {
      const tab = (e.target as HTMLElement).closest<HTMLElement>('[data-go]');
      if (!tab) return;
      const i = Number(tab.dataset.go);
      const card = sec.querySelectorAll<HTMLElement>('.vx-wk')[i];
      const stacked = card && getComputedStyle(card).position !== 'absolute';
      const top = sec.getBoundingClientRect().top + window.scrollY;
      const y = stacked ? card.getBoundingClientRect().top + window.scrollY - 70 : top + Number(tab.dataset.p) * (sec.offsetHeight - window.innerHeight);
      window.scrollTo({ top: y, behavior: 'smooth' });
    };
    sec.addEventListener('click', onClick);
    return () => sec.removeEventListener('click', onClick);
  }, []);
  return null;
}
