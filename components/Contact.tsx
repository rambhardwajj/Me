'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { PROFILE } from '@/lib/data';
import { EASE } from './Motion';
import { Socials } from './Socials';

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

/** Copies the address; the label flips to "Copied" for a moment. */
function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };
  return (
    <button className={`ct-copy ${copied ? 'done' : ''}`} onClick={copy} aria-label="Copy email address">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {copied ? <path d="M5 12.5 10 17 19 7" /> : <path d="M9 9h10v10H9zM5 15V5h10" />}
      </svg>
      <span>{copied ? 'Copied' : 'Copy email'}</span>
    </button>
  );
}

/** One compact card: the ask on the left, the essentials on the right; a slim footer below. */
export default function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <motion.div className="ct" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: EASE }}>
          <div className="ct-main">
            <span className="label kicker">Contact</span>
            <h2>
              Let’s build <em>what’s next.</em>
            </h2>
            <p>{PROFILE.status}.</p>
            <div className="ct-actions">
              <a className="btn-primary" href={`mailto:${PROFILE.email}`}>
                Email me
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </a>
              <CopyEmail />
            </div>
          </div>

          <dl className="ct-meta">
            <div>
              <dt>Email</dt>
              <dd>
                <a className="link" href={`mailto:${PROFILE.email}`}>
                  {PROFILE.email}
                </a>
              </dd>
            </div>
            <div>
              <dt>Based in</dt>
              <dd>{PROFILE.location}</dd>
            </div>
            <div>
              <dt>Local time</dt>
              <dd>
                <i className="ct-live" aria-hidden /> <LocalTime />
              </dd>
            </div>
            <div>
              <dt>Elsewhere</dt>
              <dd>
                <Socials />
              </dd>
            </div>
          </dl>
        </motion.div>

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
