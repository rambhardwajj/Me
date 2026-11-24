/* Device frames and the mini product screens shown inside them. Pure markup + CSS. */

import type { Project } from '@/lib/data';

const TRUCOST_SHOT = '/images/trucost.webp';
const STALL_PHOTO = '/images/ram-photo.jpg';
const UNBOTHRRD_SHOT = 'https://res.cloudinary.com/ewpg7mfj/image/upload/w_1400/f_auto,q_auto/v1792334117/Screenshot_2026-10-18_at_8.04.50_PM_qodm99.png';
const SYNAPPSES_SHOT = 'https://res.cloudinary.com/ewpg7mfj/image/upload/w_1400/f_auto,q_auto/v1792334002/Screenshot_2026-10-18_at_8.02.57_PM_fhkljn.png';

export function Browser({ domain, children }: { domain: string; children: React.ReactNode }) {
  return (
    <div className="dv-browser">
      <div className="dv-bar">
        <span className="dv-dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="dv-url">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2a5 5 0 0 1 5 5v3h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h1V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v3h6V7a3 3 0 0 0-3-3z" />
          </svg>
          {domain}
        </span>
      </div>
      <div className="dv-screen">{children}</div>
    </div>
  );
}

export function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="dv-phone">
      <span className="dv-island" aria-hidden />
      <div className="dv-screen">{children}</div>
    </div>
  );
}

/* ---------- screens ---------- */

function LeetCase() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="sc-shot" src="/images/leetcase.webp" alt="LeetCase problem dashboard" />;
}

function TruCost() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="sc-shot top" src={TRUCOST_SHOT} alt="TruCost ride booking screen" />;
}

function Synappses() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="sc-shot top" src={SYNAPPSES_SHOT} alt="Synappses homepage" />;
}

function Unbothered() {
  return (
    <div className="sc-ub">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="sc-shot top" src={UNBOTHRRD_SHOT} alt="unBothrrd storefront" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ub-polaroid" src={STALL_PHOTO} alt="Our pop-up stall at Masters’ Union" />
    </div>
  );
}

/** SortifyStays has no screenshot yet: its name and what it is, with the numbers from the résumé. Not a drawing of its screens. */
function Sortify() {
  return (
    <div className="sc-plain">
      <b>SortifyStays</b>
      <span>PG and hostel discovery</span>
      <small>110 listings · 187 properties onboarded</small>
    </div>
  );
}

const SCREENS: Record<Project['screen'], () => React.ReactElement> = {
  leetcase: LeetCase,
  trucost: TruCost,
  synappses: Synappses,
  unbothered: Unbothered,
  sortify: Sortify,
};

/** Screens drawn in code (not real screenshots) carry a small label so they aren't mistaken for real data. */
const ILLUSTRATIVE: Project['screen'][] = [];

export function ProductDevice({ p }: { p: Project }) {
  const Screen = SCREENS[p.screen];
  const screen = (
    <>
      <Screen />
      {ILLUSTRATIVE.includes(p.screen) && <span className="sc-tag">Illustrative UI</span>}
    </>
  );
  return p.device === 'phone' ? <Phone>{screen}</Phone> : <Browser domain={p.domain}>{screen}</Browser>;
}
