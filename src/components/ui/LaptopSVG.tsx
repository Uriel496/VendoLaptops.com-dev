/* ── Laptop SVG Component ── */
export function LaptopSVG({ w = 340, h = 220, bg = "#1a0a00", glow = "#e8632a" }: { w?: number; h?: number; bg?: string; glow?: string }) {
  const id = `g${glow.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg viewBox="0 0 340 220" width={w} height={h}>
      <rect x="20" y="10" width="300" height="185" rx="12" fill="#c8c8c8" />
      <rect x="24" y="14" width="292" height="177" rx="10" fill="#111" />
      <rect x="28" y="18" width="284" height="169" rx="8" fill={bg} />
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={glow} stopOpacity="0.9" />
          <stop offset="60%" stopColor={glow} stopOpacity="0.3" />
          <stop offset="100%" stopColor={bg} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="170" cy="103" rx="120" ry="80" fill={`url(#${id})`} />
      <ellipse cx="170" cy="103" rx="55" ry="45" fill={glow} opacity="0.2" />
      <rect x="5" y="197" width="330" height="14" rx="4" fill="#b0b0b0" />
      <rect x="130" y="200" width="80" height="7" rx="3" fill="#999" />
    </svg>
  );
}

export function SmallLaptop({ bg = "#1a0a00", glow = "#e8632a", w = 80, h = 52 }: { bg?: string; glow?: string; w?: number; h?: number }) {
  const id = `sg${glow.replace(/[^a-z0-9]/gi, "")}${w}`;
  return (
    <svg viewBox="0 0 340 220" width={w} height={h}>
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={glow} stopOpacity="0.8" />
          <stop offset="100%" stopColor={bg} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="20" y="10" width="300" height="185" rx="12" fill="#c8c8c8" />
      <rect x="24" y="14" width="292" height="177" rx="10" fill="#111" />
      <rect x="28" y="18" width="284" height="169" rx="8" fill={bg} />
      <ellipse cx="170" cy="103" rx="110" ry="75" fill={`url(#${id})`} />
      <rect x="5" y="197" width="330" height="14" rx="4" fill="#b0b0b0" />
    </svg>
  );
}
