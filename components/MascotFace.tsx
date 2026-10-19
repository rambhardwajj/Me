import { useId } from 'react';

/**
 * Mini Ram: a shaded, Memoji-style Ram (curly hair, glossy eyes, big grin, dark suit) that breaks out
 * of a round portal. Pupils follow --px/--py set by the parent; blink, brows and wave are CSS.
 */
export function MascotFace({ size = 84 }: { size?: number }) {
  const id = useId().replace(/:/g, '');
  const u = (n: string) => `${id}-${n}`;
  const url = (n: string) => `url(#${u(n)})`;

  const curlsBack: [number, number, number][] = [
    [62, 84, 16], [70, 64, 18], [88, 50, 19], [110, 47, 19], [129, 57, 18], [141, 76, 15], [58, 100, 9], [143, 97, 9],
  ];
  const curlsFront: [number, number, number][] = [
    [68, 76, 12], [83, 66, 13], [100, 62, 13.5], [117, 64, 13], [131, 74, 11.5], [76, 56, 9], [124, 53, 9],
  ];
  const eye = (cx: number, side: 'l' | 'r') => (
    <g key={side}>
      <clipPath id={u(`eye-${side}`)}>
        <ellipse cx={cx} cy="106" rx="9.2" ry="8.4" />
      </clipPath>
      <ellipse cx={cx} cy="106" rx="9.2" ry="8.4" fill={url('sclera')} />
      <g clipPath={url(`eye-${side}`)}>
        <g className="mf-pupil">
          <circle cx={cx} cy="106.5" r="5.8" fill={url('iris')} />
          <circle cx={cx} cy="106.5" r="2.7" fill="#120a06" />
          <circle cx={cx + 2} cy="104.2" r="1.7" fill="#fff" />
          <circle cx={cx - 1.6} cy="108.6" r="0.8" fill="#fff" opacity="0.8" />
        </g>
        <ellipse className="mf-lid" cx={cx} cy="97" rx="10.5" ry="17.5" fill="#d39168" />
      </g>
      <path d={`M${cx - 9.6} 104.5 Q${cx} 95.5 ${cx + 9.6} 104.5`} stroke="#1a110d" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d={`M${side === 'l' ? cx - 9 : cx + 9} 103.8 l${side === 'l' ? -2.6 : 2.6} -1.8`} stroke="#1a110d" strokeWidth="1.6" strokeLinecap="round" />
    </g>
  );

  return (
    <svg className="mface" width={size} height={size} viewBox="0 0 200 200" aria-hidden>
      <defs>
        <radialGradient id={u('skin')} cx="45%" cy="38%" r="70%">
          <stop offset="0" stopColor="#ecb48e" />
          <stop offset="0.6" stopColor="#d5966c" />
          <stop offset="1" stopColor="#b2714b" />
        </radialGradient>
        <radialGradient id={u('hair')} cx="40%" cy="30%" r="75%">
          <stop offset="0" stopColor="#4a3329" />
          <stop offset="0.55" stopColor="#24170f" />
          <stop offset="1" stopColor="#0f0906" />
        </radialGradient>
        <linearGradient id={u('suit')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a4a52" />
          <stop offset="1" stopColor="#1c1c21" />
        </linearGradient>
        <radialGradient id={u('iris')} cx="50%" cy="40%" r="60%">
          <stop offset="0" stopColor="#8a5a34" />
          <stop offset="1" stopColor="#2b1609" />
        </radialGradient>
        <radialGradient id={u('sclera')} cx="50%" cy="35%" r="70%">
          <stop offset="0.6" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e3dcd6" />
        </radialGradient>
        <radialGradient id={u('portal')} cx="50%" cy="30%" r="75%">
          <stop offset="0" style={{ stopColor: 'var(--accent)', stopOpacity: 0.35 }} />
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
          {/* suit, open collar */}
          <path d="M26 206C28 176 58 158 100 158s72 18 74 48z" fill={url('suit')} />
          <path d="M84 158l16 30 16-30z" fill="#f7f7f8" />
          <path d="M84 158l-8 12 14 10zM116 158l8 12-14 10z" fill="#e4e4e8" />
          <path d="M68 163l32 43H86L60 170zM132 163l-32 43h14l26-36z" fill="#2c2c33" />
          <path d="M68 163l-8 7 4 3z" fill="#5a5a63" />
          <rect x="86" y="136" width="28" height="26" rx="11" fill="#b9774f" />
          <ellipse cx="100" cy="146" rx="15" ry="6" fill="#8e5434" opacity="0.45" />
        </g>

        <g className="mf-head">
          {/* hair behind the head */}
          <g fill={url('hair')}>{curlsBack.map(([x, y, r], k) => <circle key={k} cx={x} cy={y} r={r} />)}</g>

          {/* ears and face */}
          <ellipse cx="57" cy="108" rx="7.5" ry="10.5" fill="#c4825a" />
          <ellipse cx="143" cy="108" rx="7.5" ry="10.5" fill="#c4825a" />
          <path d="M60 108c-1-3 3-6 4-2" stroke="#9c5d39" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M140 108c1-3-3-6-4-2" stroke="#9c5d39" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M59 102C59 72 77 60 100 60s41 12 41 42c0 28-17 50-41 50S59 130 59 102z" fill={url('skin')} />
          <ellipse cx="88" cy="84" rx="16" ry="7" fill="#fff" opacity="0.13" />
          {/* light stubble around the mouth and chin */}
          <path d="M76 126c4 16 14 24 24 24s20-8 24-24c-6 6-14 8-24 8s-18-2-24-8z" fill="#3a271d" opacity="0.14" />
          <path d="M88 122q12-5 24 0" stroke="#3a271d" strokeWidth="3.4" strokeLinecap="round" opacity="0.22" fill="none" />

          {/* hair in front: curls along the hairline, with shine */}
          <g fill={url('hair')}>{curlsFront.map(([x, y, r], k) => <circle key={k} cx={x} cy={y} r={r} />)}</g>
          <g stroke="#7a5747" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.55">
            <path d="M80 62q4-5 9-3" />
            <path d="M96 57q5-5 10-2" />
            <path d="M113 59q5-4 9-1" />
            <path d="M64 72q3-5 8-4" />
            <path d="M127 68q4-3 8 0" />
            <path d="M86 46q5-5 11-3" />
          </g>

          {/* brows */}
          <g className="mf-brows" stroke="#1a110d" strokeWidth="4.4" strokeLinecap="round" fill="none">
            <path d="M74 92q10-7 20-1" />
            <path d="M106 91q10-6 20 1" />
          </g>

          {/* eyes */}
          {eye(84, 'l')}
          {eye(116, 'r')}

          {/* nose */}
          <path d="M101 108q-2 9-6 13q5 3 10 0" stroke="#9c5d39" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.8" />
          <ellipse cx="103" cy="114" rx="2" ry="3.5" fill="#fff" opacity="0.18" />

          {/* cheeks */}
          <ellipse cx="73" cy="122" rx="7" ry="4" fill="#e8705a" opacity="0.22" />
          <ellipse cx="127" cy="122" rx="7" ry="4" fill="#e8705a" opacity="0.22" />

          {/* big grin */}
          <path d="M84 128q16 20 32 0q-16 5-32 0z" fill="#5c1d15" />
          <path d="M86.5 129q13.5 4.5 27 0l-1.4 4q-12 3.5-24.2 0z" fill="#fff" />
          <ellipse cx="100" cy="136.2" rx="6" ry="2.2" fill="#d8605a" />
          <path d="M83 127.5q17 6 34 0" stroke="#7a3b2c" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.6" />
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
