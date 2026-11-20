import type { ReactNode } from 'react';
import type { Pictogram } from '@/lib/uber';

/** Small UI icons: 2px line, round caps. Own drawings, never Uber's artwork. */
const LINE: Record<string, ReactNode> = {
  chevDown: <path d="M6 9l6 6 6-6" />,
  chevRight: <path d="M9 6l6 6-6 6" />,
  back: <path d="M19 12H5M11 6l-6 6 6 6" />,
  bell: (
    <>
      <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z" />
      <path d="M10 21h4" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.500 2 8 6" />
    </>
  ),
  x: <path d="M6 6l12 12M18 6L6 18" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5h6v2" />
    </>
  ),
  star: <path d="M12 3.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 17l-5.4 3 1.2-6L3.300 9.8l6.1-.7z" />,
  pin: (
    <>
      <circle cx="12" cy="11" r="2.5" />
      <path d="M12 21c5-4.5 7-7.5 7-10.5a7 7 0 0 0-14 0c0 3 2 6 7 10.5z" />
    </>
  ),
  trend: <path d="M4 20V5M4 20h16M8 16l4-5 3 3 5-7" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 7.5l8.5 6 8.5-6" />
    </>
  ),
  link: <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />,
  code: <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
    </>
  ),
  again: <path d="M4.5 12a7.5 7.5 0 1 0 2.6-5.7M4.5 4.5v4h4" />,
  bulb: <path d="M9 18h6M10 21h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 2H9s0-1-1-2z" />,
  map: <path d="M9 4.5L3.5 6.5v13L9 17.5l6 2 5.5-2v-13L15 6.500l-6-2zM9 4.5v13M15 6.5v13" />,
  out: <path d="M14 5h5v5M19 5l-8 8M11 6H6a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-5" />,
  chat: <path d="M4.5 6.500a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H11l-4.5 3.5V16a2 2 0 0 1-2-2z" />,
  share: <path d="M12 15V4M8 7.500l4-4 4 4M5 12.500V18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5.500" />,
  copy: (
    <>
      <rect x="8.5" y="8.5" width="11" height="11" rx="2" />
      <path d="M15.5 8.5v-2a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2" />
    </>
  ),
  pause: <path d="M8 5v14M16 5v14" />,
  play: <path d="M7 4.500v15l12-7.500z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  fit: <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  moon: <path d="M19.500 14.200A8 8 0 0 1 9.800 4.500a8 8 0 1 0 9.700 9.700z" />,
};

export function Icon({ name, size = 20, w = 2 }: { name: keyof typeof LINE | string; size?: number; w?: number }) {
  return (
    <svg className="ui" aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
      {LINE[name]}
    </svg>
  );
}

/** Solid icons for the tab bar and the top tabs. */
const SOLID: Record<string, ReactNode> = {
  home: <path d="M12 3.2l9 7.6V21h-6v-6.5H9V21H3V10.800z" />,
  grid: (
    <>
      {[6, 12, 18].map((y) => [6, 12, 18].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.7" />))}
    </>
  ),
  receipt: <path d="M6 3h12v18.5l-3-1.8-3 1.8-3-1.8-3 1.8zM9 8h6v1.800H9zM9 12h6v1.800H9z" fillRule="evenodd" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4.2" />
      <path d="M3.5 21c1.300-4.300 4.6-6.500 8.500-6.500s7.200 2.200 8.500 6.500z" />
    </>
  ),
  car: (
    <path
      d="M5.2 6.5h13.600l2.200 5.200V19h-3v-2H6v2H3v-7.300zM6.700 8.500l-1.300 3.200h13.200l-1.300-3.200zM6.500 15.300a1.300 1.300 0 1 0 0-2.600 1.300 1.300 0 0 0 0 2.600zm11 0a1.300 1.300 0 1 0 0-2.600 1.300 1.300 0 0 0 0 2.600z"
      fillRule="evenodd"
    />
  ),
  box: <path d="M12 2.5l9 4.5v10l-9 4.500L3 17V7zM12 4.700L6.300 7.500 12 10.300l5.700-2.800zM5 9.100v6.700l6 3v-6.700zm14 0l-6 3v6.700l6-3z" fillRule="evenodd" />,
  road: <path d="M8 3h2.200L7.500 21H4zM13.800 3H16l4 18h-3.500zM11.200 4h1.600v3.500h-1.600zM11.200 10h1.600v3.500h-1.600zM11.200 16h1.600v3.500h-1.600z" />,
  calendar: <path d="M7 2.5h2V5h6V2.500h2V5h2.500a1.500 1.500 0 0 1 1.500 1.500v13a1.500 1.500 0 0 1-1.500 1.500h-15A1.500 1.500 0 0 1 3 19.500v-13A1.500 1.500 0 0 1 4.500 5H7zM5 10v9h14v-9z" fillRule="evenodd" />,
};

export function Solid({ name, size = 22 }: { name: keyof typeof SOLID | string; size?: number }) {
  return (
    <svg className="ui" aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      {SOLID[name]}
    </svg>
  );
}

/**
 * Two-tone pictograms on a 40 grid: near-black plus one colour.
 * `.k` = ink, `.c` = the surface behind it (a cut-out), `.g` = mid grey; the accents are fixed colours.
 */
const PICT: Record<Pictogram, ReactNode> = {
  car: (
    <>
      <path className="k" d="M6 21h28v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z" />
      <path className="k" d="M10 13h18l4 8H7z" />
      <path d="M12 15h7v5h-9zM21 15h6l2.5 5H21z" fill="#CFE0FF" />
      <circle className="k cx" cx="12" cy="29" r="3.6" strokeWidth="2" />
      <circle className="k cx" cx="28" cy="29" r="3.6" strokeWidth="2" />
      <rect x="29" y="23" width="4" height="2.4" rx="1" fill="#FFC043" />
    </>
  ),
  chart: (
    <>
      <rect className="k" x="7" y="23" width="6" height="9" rx="1.5" />
      <rect className="k" x="17" y="17" width="6" height="15" rx="1.5" />
      <rect x="27" y="10" width="6" height="22" rx="1.5" fill="#276EF1" />
      <path className="ks" d="M8 15l8-6 5 3 8-7" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  building: (
    <>
      <rect className="k" x="9" y="8" width="15" height="25" rx="2" />
      <rect className="g" x="24" y="16" width="8" height="17" rx="1.5" />
      <g fill="#FFC043">
        <rect x="12.5" y="12" width="3" height="3" />
        <rect x="18" y="12" width="3" height="3" />
        <rect x="12.5" y="18" width="3" height="3" />
        <rect x="18" y="18" width="3" height="3" />
      </g>
      <rect className="c" x="14.5" y="26" width="4" height="7" />
    </>
  ),
  doc: (
    <>
      <rect className="k" x="8" y="8" width="20" height="25" rx="3" />
      <path className="cx" d="M12 14h12M12 19h12M12 24h7" strokeWidth="2.2" strokeLinecap="round" />
      <circle className="cx" cx="27" cy="26" r="5.5" fill="#0E8345" strokeWidth="2" />
      <path d="M24.5 26l1.800 1.800 3.200-3.400" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  bag: (
    <>
      <path d="M9 14h22l-1.5 19h-19z" fill="#FF7A45" />
      <path className="ks" d="M15 16v-3a5 5 0 0 1 10 0v3" fill="none" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="15" cy="18" r="1.5" fill="#111" />
      <circle cx="25" cy="18" r="1.5" fill="#111" />
    </>
  ),
  cap: (
    <>
      <path className="k" d="M20 9l15 7-15 7-15-7z" />
      <path className="g" d="M10 20v7c3 3.5 17 3.5 20 0v-7l-10 4.600z" />
      <path d="M33 17v9" stroke="#276EF1" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="33" cy="28" r="2" fill="#276EF1" />
    </>
  ),
  code: (
    <>
      <rect className="k" x="6" y="9" width="28" height="22" rx="3.5" />
      <path d="M15 16l-4 4 4 4M25 16l4 4-4 4" fill="none" stroke="#7DE2A0" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path className="cx" d="M21.5 14.500l-3 11" strokeWidth="2.2" strokeLinecap="round" />
    </>
  ),
  music: (
    <>
      <path className="ks" d="M16 28V11l15-3v17" fill="none" strokeWidth="3" strokeLinejoin="round" />
      <ellipse className="k" cx="12.5" cy="28" rx="4.5" ry="3.6" />
      <ellipse className="k" cx="27.5" cy="25" rx="4.5" ry="3.6" />
      <path d="M16 15.5l15-3" stroke="#B46BFF" strokeWidth="3" />
    </>
  ),
  bulb: (
    <>
      <path d="M20 6a10 10 0 0 0-6 18c1.500 1.200 2 2.500 2 4h8c0-1.500.5-2.800 2-4a10 10 0 0 0-6-18z" fill="#FFC043" />
      <rect className="k" x="15.5" y="29.500" width="9" height="3" rx="1.5" />
      <rect className="k" x="17" y="33.500" width="6" height="2.500" rx="1.250" />
      <path className="ks" d="M17.500 17l2.500 3 2.500-3" fill="none" strokeWidth="2.200" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  route: (
    <>
      <path className="ks" d="M9 31V20h13V9h9" fill="none" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle className="k cx" cx="9" cy="31" r="4" strokeWidth="2" />
      <rect x="27" y="5" width="8" height="8" rx="2" fill="#276EF1" />
    </>
  ),
  pin: (
    <>
      <path className="k" d="M20 5c-6.100 0-10.500 4.500-10.500 10.300C9.500 22.800 20 34.500 20 34.500s10.500-11.700 10.500-19.200C30.500 9.500 26.100 5 20 5z" />
      <rect x="15.500" y="11" width="9" height="9" rx="2" fill="#FFC043" />
    </>
  ),
};

export function Pict({ name, size = 46 }: { name: Pictogram; size?: number }) {
  return (
    <svg className="pict" aria-hidden="true" width={size} height={size} viewBox="0 0 40 40">
      {PICT[name]}
    </svg>
  );
}
