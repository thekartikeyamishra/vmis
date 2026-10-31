/**
 * Original, lightweight SVG illustrations in the VMIS emblem's visual language (sun, lotus, water, sky).
 * They are artwork — never presented as photographs of the school.
 */
type P = { className?: string; title?: string };

function Frame({ title, className, children, viewBox = "0 0 400 300" }: P & { children: React.ReactNode; viewBox?: string }) {
  return (
    <svg viewBox={viewBox} className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} xmlns="http://www.w3.org/2000/svg">
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function Sun({ cx, cy, r, spin = false }: { cx: number; cy: number; r: number; spin?: boolean }) {
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6;
    const x1 = cx + Math.cos(a) * (r + 6), y1 = cy + Math.sin(a) * (r + 6);
    const x2 = cx + Math.cos(a + 0.18) * (r + 22), y2 = cy + Math.sin(a + 0.18) * (r + 22);
    const x3 = cx + Math.cos(a + 0.36) * (r + 6), y3 = cy + Math.sin(a + 0.36) * (r + 6);
    return `M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)} L${x3.toFixed(1)} ${y3.toFixed(1)}Z`;
  });
  return (
    <g>
      <g className={spin ? "sun-spin" : undefined} fill="#F28C19">{rays.map((d) => <path key={d} d={d} />)}</g>
      <circle cx={cx} cy={cy} r={r} fill="#F28C19" />
      <circle cx={cx - r / 3} cy={cy - r / 3} r={r / 3} fill="#FFB65C" opacity=".6" />
    </g>
  );
}

export function Lotus({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 C-40 -10 -62 -40 -58 -58 C-38 -50 -16 -30 0 0Z" fill="#F4B6D2" />
      <path d="M0 0 C40 -10 62 -40 58 -58 C38 -50 16 -30 0 0Z" fill="#F4B6D2" />
      <path d="M0 0 C-28 -20 -34 -60 -22 -80 C-6 -62 2 -30 0 0Z" fill="#E98EBA" />
      <path d="M0 0 C28 -20 34 -60 22 -80 C6 -62 -2 -30 0 0Z" fill="#E98EBA" />
      <path d="M0 0 C-12 -30 -10 -72 0 -92 C10 -72 12 -30 0 0Z" fill="#F7C6DD" />
      <ellipse cx="0" cy="-6" rx="18" ry="6" fill="#F6D365" />
    </g>
  );
}

function Water({ y, w = 400 }: { y: number; w?: number }) {
  return (
    <g fill="none" stroke="#287EBA" strokeWidth="2.5" strokeLinecap="round" opacity=".55">
      <path d={`M10 ${y} q25 -8 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0`} />
      <path d={`M40 ${y + 16} q25 -8 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0`} opacity=".7" />
      <rect x="0" y={y + 4} width={w} height="200" fill="#70C9E8" stroke="none" opacity=".18" />
    </g>
  );
}

function Fish({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <ellipse cx="0" cy="0" rx="12" ry="5" fill="#2AA39A" />
      <path d="M10 0 L20 -6 L20 6Z" fill="#2AA39A" />
      <circle cx="-6" cy="-1" r="1.3" fill="#17324A" />
    </g>
  );
}

export function HeroArt(p: P) {
  return (
    <Frame {...p} viewBox="0 0 400 360">
      <defs>
        <radialGradient id="hsky" cx="50%" cy="40%" r="65%">
          <stop offset="0" stopColor="#E4F5FC" />
          <stop offset="1" stopColor="#9AD8EE" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="180" r="176" fill="#145B98" />
      <circle cx="200" cy="180" r="150" fill="url(#hsky)" />
      <Sun cx={200} cy={92} r={30} spin />
      <clipPath id="hclip"><circle cx="200" cy="180" r="150" /></clipPath>
      <g clipPath="url(#hclip)">
        <Water y={238} />
        <path d="M150 300 C150 270 160 250 170 238" stroke="#3E9A4B" strokeWidth="4" fill="none" />
        <Lotus x={175} y={242} s={0.95} />
        <Lotus x={262} y={250} s={0.5} />
        <Fish x={120} y={282} />
        <Fish x={290} y={296} flip />
        <Fish x={230} y={316} />
      </g>
    </Frame>
  );
}

export function EarlyYearsArt(p: P) {
  return (
    <Frame {...p}>
      <rect width="400" height="300" rx="28" fill="#FDF1F7" />
      <Sun cx={330} cy={62} r={22} />
      <g>
        <rect x="60" y="190" width="56" height="56" rx="8" fill="#F28C19" />
        <text x="88" y="230" textAnchor="middle" fontSize="30" fontWeight="800" fill="#fff" fontFamily="sans-serif">A</text>
        <rect x="120" y="190" width="56" height="56" rx="8" fill="#287EBA" />
        <text x="148" y="230" textAnchor="middle" fontSize="30" fontWeight="800" fill="#fff" fontFamily="sans-serif">B</text>
        <rect x="90" y="130" width="56" height="56" rx="8" fill="#E98EBA" />
        <text x="118" y="170" textAnchor="middle" fontSize="30" fontWeight="800" fill="#fff" fontFamily="sans-serif">C</text>
      </g>
      <circle cx="240" cy="210" r="34" fill="#70C9E8" />
      <path d="M290 246 l30 -56 l30 56z" fill="#F6D365" />
      <rect x="216" y="110" width="64" height="44" rx="6" fill="#fff" stroke="#145B98" strokeWidth="3" />
      <path d="M248 112 v40" stroke="#145B98" strokeWidth="3" />
      <g fill="#145B98" opacity=".8">
        <circle cx="70" cy="70" r="5" /><circle cx="96" cy="58" r="3.5" /><circle cx="120" cy="76" r="4" />
      </g>
      <path d="M40 268 h320" stroke="#E98EBA" strokeWidth="4" strokeLinecap="round" />
    </Frame>
  );
}

export function PrimaryArt(p: P) {
  return (
    <Frame {...p}>
      <rect width="400" height="300" rx="28" fill="#E9F6FC" />
      <Sun cx={70} cy={66} r={20} />
      <g transform="translate(110 120)">
        <path d="M0 20 L90 0 L90 120 L0 140Z" fill="#287EBA" />
        <path d="M180 20 L90 0 L90 120 L180 140Z" fill="#145B98" />
        <path d="M12 30 L84 14 M12 50 L84 34 M12 70 L84 54" stroke="#fff" strokeWidth="3" opacity=".7" />
        <path d="M168 30 L96 14 M168 50 L96 34 M168 70 L96 54" stroke="#fff" strokeWidth="3" opacity=".5" />
      </g>
      <g transform="translate(300 90) rotate(25)">
        <rect width="16" height="120" rx="3" fill="#F28C19" />
        <path d="M0 120 L8 140 L16 120Z" fill="#F6D365" />
      </g>
      <text x="300" y="250" fontSize="34" fontWeight="800" fill="#E98EBA" fontFamily="sans-serif">1 2 3</text>
      <text x="40" y="250" fontSize="34" fontWeight="800" fill="#F28C19" fontFamily="sans-serif">क ख ग</text>
    </Frame>
  );
}

export function UpperPrimaryArt(p: P) {
  return (
    <Frame {...p}>
      <rect width="400" height="300" rx="28" fill="#EAF0F8" />
      <circle cx="120" cy="140" r="62" fill="#70C9E8" />
      <path d="M78 120 q20 -20 40 -6 t36 10 M70 156 q30 8 50 -4 t50 6" stroke="#2AA39A" strokeWidth="9" fill="none" strokeLinecap="round" />
      <ellipse cx="120" cy="140" rx="62" ry="22" fill="none" stroke="#145B98" strokeWidth="3" opacity=".5" />
      <rect x="112" y="202" width="16" height="30" fill="#145B98" />
      <rect x="84" y="230" width="72" height="12" rx="6" fill="#145B98" />
      <g transform="translate(240 80)">
        <path d="M30 0 h40 v60 l36 90 a10 10 0 0 1 -9 14 h-94 a10 10 0 0 1 -9 -14 l36 -90z" fill="#fff" stroke="#145B98" strokeWidth="4" />
        <path d="M14 118 h72 l14 32 a6 6 0 0 1 -6 8 h-88 a6 6 0 0 1 -6 -8z" fill="#E98EBA" />
        <circle cx="46" cy="132" r="5" fill="#fff" /><circle cx="62" cy="144" r="3.5" fill="#fff" />
      </g>
      <Sun cx={340} cy={52} r={16} />
    </Frame>
  );
}

export function EmptyArt(p: P) {
  return (
    <Frame {...p} viewBox="0 0 240 160">
      <rect width="240" height="160" rx="20" fill="#F2F9FD" />
      <Lotus x={120} y={120} s={0.7} />
      <path d="M40 124 q20 -6 40 0 t40 0 t40 0 t40 0" stroke="#287EBA" strokeWidth="2.5" fill="none" opacity=".5" />
    </Frame>
  );
}

export const StageArt = { "early-years": EarlyYearsArt, primary: PrimaryArt, "upper-primary": UpperPrimaryArt } as const;
