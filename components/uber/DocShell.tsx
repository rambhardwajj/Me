import Link from 'next/link';
import type { ReactNode } from 'react';
import { FONTS } from '@/app/uber/fonts';
import { PROFILE } from '@/lib/data';
import { BILLBOARD, RESERVE, TRIBUTE_LONG } from '@/lib/uber';
import { PROPOSAL_HREF, THEME_SCRIPT, WORK_HREF } from '@/lib/uber-cases';

export const MAILTO = `mailto:${PROFILE.email}?subject=${encodeURIComponent(RESERVE.subject)}`;

/**
 * The plain pages of /uber: a case study, the list of work, the proposal. Each has its own address, loads with no
 * ride and no animation in the way, and carries the same four ways out: work, the proposal, the resume and contact.
 * The resume link appears by itself once PROFILE.resume (lib/data.ts) names a file in public/.
 */
export default function DocShell({ here, children }: { here: 'work' | 'proposal'; children: ReactNode }) {
  const links = (
    <>
      <Link href={WORK_HREF} aria-current={here === 'work' ? 'page' : undefined}>
        Work
      </Link>
      <Link href={PROPOSAL_HREF} aria-current={here === 'proposal' ? 'page' : undefined}>
        Uber proposal
      </Link>
      {PROFILE.resume && (
        <a href={PROFILE.resume} download>
          {BILLBOARD.resume}
        </a>
      )}
      <a href={MAILTO}>Contact</a>
    </>
  );
  return (
    <>
      <div className={`ub ub-doc ${FONTS}`} data-theme="light" suppressHydrationWarning>
        <a className="ub-skip" href="#main">
          Skip to the content
        </a>
        <header className="ub-doc-head">
          <Link className="ub-mark" href="/uber" aria-label="Ram: back to the first screen">
            {BILLBOARD.wordmark}
          </Link>
          <nav aria-label="Pages">{links}</nav>
        </header>
        <main id="main" className="ub-doc-main">
          {children}
        </main>
        <footer className="ub-doc-foot">
          <nav aria-label="Pages, again">
            {links}
            <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <Link href="/uber">The app, with the ride</Link>
          </nav>
          <p>
            {PROFILE.email}
            <br />
            <small>{TRIBUTE_LONG}</small>
          </p>
        </footer>
      </div>
      <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
    </>
  );
}
