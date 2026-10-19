'use client';

import { motion, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { PROFILE } from '@/lib/data';

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
    <motion.header className={`nav ${scrolled ? 'scrolled' : ''}`} initial={{ y: -76 }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
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
        <a href={`mailto:${PROFILE.email}`} className="nav-cta">
          Get in touch
        </a>
      </div>
      <motion.div className="nav-bar" style={{ scaleX: scrollYProgress, opacity: scrolled ? 1 : 0 }} />
    </motion.header>
  );
}
