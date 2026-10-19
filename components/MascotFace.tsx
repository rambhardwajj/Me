/** Mini Ram: a chibi Ram (curly hair, big smile, dark suit). Eyes blink and a hand waves via CSS. */
export function MascotFace({ size = 64 }: { size?: number }) {
  return (
    <svg className="mface" width={size} height={size} viewBox="0 0 120 120" aria-hidden>
      <defs>
        <linearGradient id="mf-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9a07a" />
          <stop offset="1" stopColor="#c48660" />
        </linearGradient>
        <linearGradient id="mf-suit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3a40" />
          <stop offset="1" stopColor="#1f1f24" />
        </linearGradient>
      </defs>

      {/* suit, shirt and collar */}
      <path d="M18 120c2-20 16-31 42-31s40 11 42 31z" fill="url(#mf-suit)" />
      <path d="M50 90h20l-10 20z" fill="#f4f4f5" />
      <path d="M50 90l10 20-14-6-4-12zM70 90l-10 20 14-6 4-12z" fill="#2a2a30" />
      <rect x="53" y="80" width="14" height="12" rx="5" fill="#c48660" />

      {/* waving hand */}
      <g className="mf-wave">
        <path d="M96 98c2-8 1-16 4-22" stroke="#2a2a30" strokeWidth="9" strokeLinecap="round" fill="none" />
        <circle cx="101" cy="72" r="7.5" fill="url(#mf-skin)" />
      </g>

      {/* ears and head */}
      <ellipse cx="32" cy="58" rx="5" ry="7" fill="#c48660" />
      <ellipse cx="88" cy="58" rx="5" ry="7" fill="#c48660" />
      <ellipse cx="60" cy="56" rx="28" ry="30" fill="url(#mf-skin)" />

      {/* curly hair */}
      <g fill="#1b1513">
        <circle cx="38" cy="38" r="11" />
        <circle cx="50" cy="29" r="12" />
        <circle cx="64" cy="26" r="12.5" />
        <circle cx="77" cy="31" r="11.5" />
        <circle cx="85" cy="42" r="9" />
        <circle cx="33" cy="49" r="7" />
        <circle cx="57" cy="35" r="9" />
        <circle cx="71" cy="38" r="8" />
        <circle cx="44" cy="40" r="7" />
      </g>
      <g fill="#2c2320">
        <circle cx="52" cy="25" r="3" />
        <circle cx="68" cy="22" r="3" />
        <circle cx="80" cy="30" r="2.5" />
        <circle cx="39" cy="34" r="2.5" />
      </g>

      {/* brows, eyes, cheeks, smile */}
      <path d="M43 50q6-4 11 0M66 50q6-4 11 0" stroke="#1b1513" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <g className="mf-eyes">
        <ellipse cx="48.5" cy="59" rx="4.2" ry="5" fill="#1b1513" />
        <ellipse cx="71.5" cy="59" rx="4.2" ry="5" fill="#1b1513" />
        <circle cx="50" cy="57" r="1.4" fill="#fff" />
        <circle cx="73" cy="57" r="1.4" fill="#fff" />
      </g>
      <ellipse cx="41" cy="68" rx="4.5" ry="2.6" fill="#e07a6a" opacity="0.35" />
      <ellipse cx="79" cy="68" rx="4.5" ry="2.6" fill="#e07a6a" opacity="0.35" />
      <path d="M49 70q11 11 22 0z" fill="#3b1714" />
      <path d="M51 70.5h18q-1 3-2 3.6h-14q-1-.6-2-3.6z" fill="#fff" />
    </svg>
  );
}
