'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const LINKS = [
  { id: 'numbers', label: 'Numbers' },
  { id: 'experience', label: 'Experience' },
  { id: 'journey', label: 'Journey' },
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

/** Minimal paper bar: name, chapter jumps, the classic site, and a button that opens Mini Ram. */
export default function TopBar() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  const ask = () => {
    setOpen(false);
    window.dispatchEvent(new Event('mini-ram:open'));
  };

  return (
    <header className={`vx-bar ${open ? 'open' : ''}`}>
      <a href="#top" className="vx-bar-name">
        Ram Bhardwaj <i>explained</i>
      </a>
      <nav className="vx-bar-links" aria-label="Chapters">
        {LINKS.map((l) => (
          <a key={l.id} href={`#${l.id}`} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <Link href="/old" className="vx-bar-old">
          Classic site
        </Link>
      </nav>
      <button className="vx-bar-ask" onClick={ask}>
        Ask Mini Ram
      </button>
      <button className="vx-bar-menu" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'}>
        <i />
        <i />
      </button>
    </header>
  );
}
