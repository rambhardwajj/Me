'use client';

import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { PROFILE } from '@/lib/data';
import { ThemeToggle } from './Theme';

const LINKS = [
  { id: 'top', label: 'Home' },
  { id: 'personas', label: 'About' },
  { id: 'journey', label: 'Journey' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
];

export default function Nav() {
  const { scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('top');
  const [menu, setMenu] = useState(false);

  // the phone menu closes on Esc
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menu]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const mid = window.innerHeight * 0.4;
      let current = 'top';
      for (const l of LINKS) {
        const el = document.getElementById(l.id);
        if (el && el.getBoundingClientRect().top <= mid) current = l.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header className={`nav ${scrolled || menu ? 'scrolled' : ''}`} initial={{ y: -68 }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
      <div className="wrap nav-in">
        <a href="#top" className="nav-name">
          <i aria-hidden>RB</i> {PROFILE.name}
        </a>
        <nav className="nav-links" aria-label="Sections">
          {LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} className={active === l.id ? 'on' : ''}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav-right">
          <ThemeToggle />
          <a href={`mailto:${PROFILE.email}`} className="nav-cta">
            Get in touch
          </a>
          <button className={`nav-burger ${menu ? 'on' : ''}`} onClick={() => setMenu((m) => !m)} aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} aria-controls="nav-sheet">
            <i />
            <i />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {menu && (
          <motion.nav
            id="nav-sheet"
            className="nav-sheet"
            aria-label="Sections"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <div className="wrap">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.id}
                  href={`#${l.id}`}
                  className={active === l.id ? 'on' : ''}
                  onClick={() => setMenu(false)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * i, duration: 0.3 }}
                >
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {l.label}
                </motion.a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
      <motion.div className="nav-bar" style={{ scaleX: scrollYProgress, opacity: scrolled ? 1 : 0 }} />
    </motion.header>
  );
}
