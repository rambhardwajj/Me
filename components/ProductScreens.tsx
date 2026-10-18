/* Device frames and the mini product screens shown inside them. Pure markup + CSS. */

import type { Project } from '@/lib/data';

const TRUCOST_SHOT = '/images/trucost.webp';
const STALL_PHOTO = '/images/ram-photo.jpg';
const UNBOTHRRD_SHOT = 'https://res.cloudinary.com/ewpg7mfj/image/upload/w_1400/f_auto,q_auto/v1792334117/Screenshot_2026-10-18_at_8.04.50_PM_qodm99.png';
const SYNAPPSES_SHOT = 'https://res.cloudinary.com/ewpg7mfj/image/upload/w_1400/f_auto,q_auto/v1792334002/Screenshot_2026-10-18_at_8.02.57_PM_fhkljn.png';
const SUJHAAV_SHOT = '/images/sujhaavmarg.webp';

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

function Upto() {
  const plans = [
    { who: 'Aanya', where: 'Sunset at Hauz Khas', when: 'Fri · 6:00 PM', going: 12, tone: '#f472b6' },
    { who: 'Kabir', where: 'Weekend in Rishikesh', when: 'Sat → Sun', going: 7, tone: '#60a5fa' },
    { who: 'Meera', where: 'Hackathon night', when: 'Tue · 9:00 PM', going: 4, tone: '#34d399' },
  ];
  return (
    <div className="sc-upto">
      <div className="up-head">
        <b>upto</b>
        <span className="up-new">+ Post</span>
      </div>
      <div className="up-cal">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <span key={i} className={i === 4 ? 'on' : ''}>
            <small>{d}</small>
            {14 + i}
            {[1, 4, 5].includes(i) && <i />}
          </span>
        ))}
      </div>
      {plans.map((p) => (
        <div className="up-card" key={p.where}>
          <div className="up-who">
            <span className="up-av" style={{ background: p.tone }}>
              {p.who[0]}
            </span>
            <span>
              <b>{p.who}</b> is going
            </span>
          </div>
          <p className="up-where">{p.where}</p>
          <p className="up-when">
            {p.when} · {p.going} going
          </p>
          <div className="up-act">
            <span className="yes">I’m in</span>
            <span>Not interested</span>
          </div>
        </div>
      ))}
      <div className="up-tabs" aria-hidden>
        <i className="on" />
        <i />
        <i />
        <i />
      </div>
    </div>
  );
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

function SujhaavMarg() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="sc-shot top" src={SUJHAAV_SHOT} alt="SujhaavMarg call screen" />;
}

const SCREENS: Record<Project['screen'], () => React.ReactElement> = {
  leetcase: LeetCase,
  upto: Upto,
  trucost: TruCost,
  synappses: Synappses,
  unbothered: Unbothered,
  sujhaav: SujhaavMarg,
};

/** Screens drawn in code (not real screenshots) carry a small label so they aren't mistaken for real data. */
const ILLUSTRATIVE: Project['screen'][] = ['upto'];

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
