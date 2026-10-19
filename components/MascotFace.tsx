import { useId } from 'react';

/**
 * Mini Ram: a polished, professional portrait of Ram (styled curls, light beard, calm smile, suit and tie)
 * that breaks out of a round portal. Pupils follow --px/--py set by the parent; blink, brows and wave are CSS.
 */
export function MascotFace({ size = 84 }: { size?: number }) {
  const id = useId().replace(/:/g, '');
  const u = (n: string) => `${id}-${n}`;
  const url = (n: string) => `url(#${u(n)})`;

  // tight, tidy curls: a dense crown that sits close to the head
  const crownBack: [number, number, number][] = [
    [70, 74, 13], [80, 60, 14], [94, 52, 15], [108, 51, 15], [121, 57, 14], [131, 70, 12.5], [66, 88, 8], [135, 86, 8],
  ];
  const crownFront: [number, number, number][] = [
    [72, 72, 8.5], [82, 65, 9], [93, 61, 9.5], [104, 60, 9.5], [115, 62, 9], [125, 67, 8.5], [87, 53, 7.5], [100, 50, 8], [113, 52, 7.5], [76, 82, 6], [128, 79, 6],
  ];

  const eye = (cx: number, side: 'l' | 'r') => {
    const almond = `M${cx - 8} 104 Q${cx} 97 ${cx + 8} 104 Q${cx} 109.6 ${cx - 8} 104Z`;
    return (
      <g key={side}>
        <clipPath id={u(`eye-${side}`)}>
          <path d={almond} />
        </clipPath>
        <path d={almond} fill="#f7f3ef" />
        <g clipPath={url(`eye-${side}`)}>
          <g className="mf-pupil">
            <circle cx={cx} cy="103.6" r="4.1" fill={url('iris')} />
            <circle cx={cx} cy="103.6" r="1.9" fill="#100804" />
            <circle cx={cx + 1.4} cy="102.2" r="1.1" fill="#fff" />
          </g>
          <ellipse className="mf-lid" cx={cx} cy="96" rx="9.5" ry="14" fill="#d2946b" />
        </g>
        {/* upper lid line, crease and a faint lower lid */}
        <path d={`M${cx - 8.4} 104 Q${cx} 96.6 ${cx + 8.4} 104`} stroke="#22140d" strokeWidth="1.9" strokeLinecap="round" fill="none" />
        <path d={`M${cx - 6.5} 99.6 Q${cx} 95.6 ${cx + 6.5} 99.6`} stroke="#9a5d3a" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.55" />
        <path d={`M${cx - 6} 107.6 Q${cx} 110 ${cx + 6} 107.6`} stroke="#9a5d3a" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.45" />
      </g>
    );
  };

  return (
    <svg className="mface" width={size} height={size} viewBox="0 0 200 200" aria-hidden>
      <defs>
        <radialGradient id={u('skin')} cx="46%" cy="36%" r="72%">
          <stop offset="0" stopColor="#e6ab84" />
          <stop offset="0.6" stopColor="#cf9067" />
          <stop offset="1" stopColor="#a8694a" />
        </radialGradient>
        <radialGradient id={u('hair')} cx="42%" cy="28%" r="78%">
          <stop offset="0" stopColor="#3d2b22" />
          <stop offset="0.55" stopColor="#1d130d" />
          <stop offset="1" stopColor="#0c0705" />
        </radialGradient>
        <linearGradient id={u('suit')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b3f4a" />
          <stop offset="1" stopColor="#191b21" />
        </linearGradient>
        <linearGradient id={u('tie')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#24406b" />
          <stop offset="1" stopColor="#152741" />
        </linearGradient>
        <radialGradient id={u('iris')} cx="50%" cy="40%" r="60%">
          <stop offset="0" stopColor="#7a4d2b" />
          <stop offset="1" stopColor="#2a1509" />
        </radialGradient>
        <radialGradient id={u('portal')} cx="50%" cy="30%" r="75%">
          <stop offset="0" style={{ stopColor: 'var(--accent)', stopOpacity: 0.3 }} />
          <stop offset="0.7" style={{ stopColor: 'var(--surface-2)' }} />
          <stop offset="1" style={{ stopColor: 'var(--surface)' }} />
        </radialGradient>
        <linearGradient id={u('ring')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--accent)' }} />
          <stop offset="1" style={{ stopColor: 'var(--accent-2)' }} />
        </linearGradient>
        {/* everything above the portal's centre line may break out of the frame */}
        <clipPath id={u('frame')}>
          <path d="M0 0H200V124H0Z" />
          <circle cx="100" cy="124" r="74" />
        </clipPath>
      </defs>

      {/* the portal */}
      <circle cx="100" cy="124" r="74" fill={url('portal')} />
      <circle className="mf-orbit" cx="100" cy="124" r="74" fill="none" stroke={url('ring')} strokeWidth="3" strokeDasharray="70 395" strokeLinecap="round" />
      <circle cx="100" cy="124" r="74" fill="none" style={{ stroke: 'var(--accent)', strokeOpacity: 0.35 }} strokeWidth="1.5" />

      <g clipPath={url('frame')}>
        <g className="mf-body">
          {/* suit, shirt and tie */}
          <path d="M24 206c2-30 32-46 76-46s74 16 76 46z" fill={url('suit')} />
          <path d="M83 160l17 34 17-34z" fill="#f6f7f9" />
          <path d="M83 160l-7 11 15 9zM117 160l7 11-15 9z" fill="#e2e5ea" />
          <path d="M96 166h8l2 5-3 3h-6l-3-3z" fill={url('tie')} />
          <path d="M97 174h6l5 30h-16z" fill={url('tie')} />
          <path d="M98.5 178l3 0" stroke="#3d5f93" strokeWidth="1" opacity="0.6" />
          <path d="M66 164l34 42H86L58 172zM134 164l-34 42h14l28-34z" fill="#2a2d35" />
          <path d="M66 164l-8 8 4 3z" fill="#555a66" />
          <path d="M134 164l8 8-4 3z" fill="#555a66" />
          <rect x="87" y="138" width="26" height="26" rx="10" fill="#b5754f" />
          <ellipse cx="100" cy="148" rx="14" ry="6" fill="#7f472b" opacity="0.4" />
        </g>

        <g className="mf-head">
          {/* hair behind */}
          <g fill={url('hair')}>{crownBack.map(([x, y, r], k) => <circle key={k} cx={x} cy={y} r={r} />)}</g>

          {/* ears */}
          <ellipse cx="62" cy="106" rx="5.6" ry="8.6" fill="#c3825b" />
          <ellipse cx="138" cy="106" rx="5.6" ry="8.6" fill="#c3825b" />
          <path d="M64 104c-1-2 2-4 3-1" stroke="#97583a" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          <path d="M136 104c1-2-2-4-3-1" stroke="#97583a" strokeWidth="1.3" fill="none" strokeLinecap="round" />

          {/* face: an oval with a defined jaw */}
          <path d="M64 98c0-24 15-36 36-36s36 12 36 36c0 18-5 32-14 42-7 8-14 12-22 12s-15-4-22-12c-9-10-14-24-14-42z" fill={url('skin')} />
          {/* temples fade into short sides */}
          <path d="M64 96c0-10 3-18 8-23l-2 24z" fill="#1d130d" opacity="0.55" />
          <path d="M136 96c0-10-3-18-8-23l2 24z" fill="#1d130d" opacity="0.55" />
          <ellipse cx="90" cy="80" rx="14" ry="6" fill="#fff" opacity="0.1" />
          {/* side shading for depth */}
          <path d="M126 92c4 14 2 30-6 42 6-4 12-14 13-28 1-6-2-11-7-14z" fill="#8f5333" opacity="0.18" />

          {/* light beard along the jaw, and a moustache */}
          <path d="M68 116c3 14 10 24 18 30 4 3 9 5 14 5s10-2 14-5c8-6 15-16 18-30-3 6-8 12-12 14-3 1-6 0-8-2-3 2-7 3-12 3s-9-1-12-3c-2 2-5 3-8 2-4-2-9-8-12-14z" fill="#2a1a12" opacity="0.22" />
          <path d="M88 122.5q12-6.5 24 0q-5 1.5-12 1.5t-12-1.5z" fill="#24160f" opacity="0.6" />

          {/* hair in front: styled curls along the hairline, with soft shine */}
          <g fill={url('hair')}>{crownFront.map(([x, y, r], k) => <circle key={k} cx={x} cy={y} r={r} />)}</g>
          <g stroke="#6b4c3d" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6">
            <path d="M88 60q3-3 7-2" />
            <path d="M99 56q4-3 8-1" />
            <path d="M111 58q3-3 7-1" />
            <path d="M78 66q3-3 6-2" />
            <path d="M121 64q3-2 6 0" />
            <path d="M95 46q4-3 8-1" />
          </g>

          {/* brows: straighter, confident */}
          <g className="mf-brows" stroke="#1d120c" strokeLinecap="round" fill="none">
            <path d="M77 92.5q8-4 17-1.5" strokeWidth="3.4" />
            <path d="M106 91q9-2.5 17 1.5" strokeWidth="3.4" />
          </g>

          {/* eyes */}
          {eye(86, 'l')}
          {eye(114, 'r')}

          {/* nose */}
          <path d="M101 104q1 8 3 13" stroke="#9a5d3a" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.55" />
          <path d="M95 117.5q2 2.5 5 2.5t5-2.5" stroke="#8a4f31" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.8" />
          <ellipse cx="101" cy="111" rx="1.6" ry="3.4" fill="#fff" opacity="0.16" />

          {/* calm, confident smile */}
          <path d="M90 128.5q10 7.5 20 0q-10 2.2-20 0z" fill="#5a2318" />
          <path d="M91.6 129q8.4 2 16.8 0l-0.8 1.7q-7.6 1.6-15.2 0z" fill="#fbf7f2" />
          <path d="M89 128q11 8.5 22 0" stroke="#7d3b2a" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <path d="M94 135.5q6 2 12 0" stroke="#a8583f" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.45" />
        </g>

        {/* waving hand */}
        <g className="mf-wave">
          <g transform="translate(-26 -2)">
            <path d="M160 206c-2-22 2-40 8-52" stroke={url('suit')} strokeWidth="18" strokeLinecap="round" fill="none" />
            <path d="M162 150c-2-8 0-20 3-26 2-4 7-3 7 2l-1 14 2-20c0-5 7-5 7 0l-1 20 3-17c1-5 8-4 7 1l-3 19 4-11c2-4 8-2 6 3l-7 20c-3 7-9 11-17 10-6-1-9-7-10-15z" fill={url('skin')} />
          </g>
        </g>
      </g>
    </svg>
  );
}
