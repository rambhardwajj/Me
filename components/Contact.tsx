'use client';

import { useEffect, useState } from 'react';
import { PROFILE } from '@/lib/data';
import { Arrow, Lines, Reveal } from './Motion';

function LocalTime() {
  const [t, setT] = useState('');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: PROFILE.timezone });
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return <>{t || '—'} IST</>;
}

export default function Contact() {
  const elsewhere = [
    { label: 'LinkedIn', href: PROFILE.linkedin },
    { label: 'GitHub', href: PROFILE.github },
    { label: 'X / Twitter', href: PROFILE.x },
    { label: 'Instagram', href: PROFILE.instagram },
    ...(PROFILE.resume ? [{ label: 'Résumé (PDF)', href: PROFILE.resume }] : []),
  ];

  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <span className="label kicker">Contact</span>
        <h2>
          <Lines inView lines={['Let’s build', <em key="e">what’s next.</em>]} />
        </h2>
        <Reveal delay={0.15}>
          <a className="contact-mail" href={`mailto:${PROFILE.email}`}>
            <span className="link">{PROFILE.email}</span>
            <Arrow size={26} diagonal />
          </a>
        </Reveal>

        <Reveal className="contact-grid" delay={0.1}>
          <div>
            <span className="label">Looking for</span>
            <p>{PROFILE.status}</p>
          </div>
          <div>
            <span className="label">Based in</span>
            <p>{PROFILE.location}</p>
          </div>
          <div>
            <span className="label">Local time</span>
            <p>
              <LocalTime />
            </p>
          </div>
          <div>
            <span className="label">Elsewhere</span>
            <ul>
              {elsewhere.map((l) => (
                <li key={l.label}>
                  <a className="link" href={l.href} target="_blank" rel="noreferrer">
                    {l.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <footer className="foot">
          <span>
            © {new Date().getFullYear()} {PROFILE.name}
          </span>
          <a href="#top" className="link">
            Back to top ↑
          </a>
        </footer>
      </div>
    </section>
  );
}
