'use client';

interface FactIllustrationProps {
  category: string;
  className?: string;
  size?: number;
}

const categoryColors: Record<string, string> = {
  crise: '#EF4444',
  politique: '#5B5EF4',
  commerce: '#F59E0B',
  monetaire: '#0EA5E9',
  social: '#EC4899',
  histoire: '#8B5CF6',
};

function HistoireIcon({ color }: { color: string }) {
  return (
    <>
      {/* Ancient column / pillar */}
      <rect x="18" y="12" width="24" height="3" rx="1" fill={color} />
      <rect x="19" y="45" width="22" height="3" rx="1" fill={color} />
      <rect x="21" y="15" width="4" height="30" rx="1" fill={color} opacity={0.85} />
      <rect x="28" y="15" width="4" height="30" rx="1" fill={color} opacity={0.85} />
      <rect x="35" y="15" width="4" height="30" rx="1" fill={color} opacity={0.85} />
      <rect x="16" y="9" width="28" height="3" rx="1.5" fill={color} opacity={0.6} />
      <rect x="17" y="48" width="26" height="3" rx="1.5" fill={color} opacity={0.6} />
    </>
  );
}

function CriseIcon({ color }: { color: string }) {
  return (
    <>
      {/* Downward crash chart */}
      <polyline
        points="10,18 18,22 24,16 32,28 38,26 44,42 50,48"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arrow head pointing down-right */}
      <polyline
        points="44,48 50,48 50,42"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Subtle grid lines */}
      <line x1="10" y1="50" x2="52" y2="50" stroke={color} strokeWidth="1" opacity={0.3} />
      <line x1="10" y1="14" x2="10" y2="50" stroke={color} strokeWidth="1" opacity={0.3} />
    </>
  );
}

function PolitiqueIcon({ color }: { color: string }) {
  return (
    <>
      {/* Parliament building */}
      {/* Roof / triangle */}
      <polygon points="30,10 12,24 48,24" fill={color} opacity={0.7} />
      {/* Main body */}
      <rect x="14" y="24" width="32" height="3" rx="1" fill={color} />
      {/* Columns */}
      <rect x="17" y="27" width="3" height="16" rx="1" fill={color} opacity={0.85} />
      <rect x="24" y="27" width="3" height="16" rx="1" fill={color} opacity={0.85} />
      <rect x="33" y="27" width="3" height="16" rx="1" fill={color} opacity={0.85} />
      <rect x="40" y="27" width="3" height="16" rx="1" fill={color} opacity={0.85} />
      {/* Base */}
      <rect x="12" y="43" width="36" height="4" rx="1.5" fill={color} />
      {/* Dome circle */}
      <circle cx="30" cy="14" r="3" fill={color} opacity={0.5} />
    </>
  );
}

function CommerceIcon({ color }: { color: string }) {
  return (
    <>
      {/* Cargo ship */}
      {/* Hull */}
      <path
        d="M8,38 L14,46 L46,46 L52,38 Z"
        fill={color}
        opacity={0.85}
      />
      {/* Deck */}
      <rect x="16" y="32" width="28" height="6" rx="1" fill={color} opacity={0.7} />
      {/* Containers */}
      <rect x="18" y="22" width="8" height="10" rx="1" fill={color} opacity={0.5} />
      <rect x="28" y="25" width="8" height="7" rx="1" fill={color} opacity={0.6} />
      <rect x="38" y="28" width="5" height="4" rx="1" fill={color} opacity={0.4} />
      {/* Mast */}
      <line x1="22" y1="14" x2="22" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Water line */}
      <path d="M4,50 Q15,46 26,50 Q37,54 48,50 Q53,48 56,50" fill="none" stroke={color} strokeWidth="1.5" opacity={0.3} />
    </>
  );
}

function MonetaireIcon({ color }: { color: string }) {
  return (
    <>
      {/* Coin */}
      <circle cx="30" cy="30" r="18" fill="none" stroke={color} strokeWidth="2.5" />
      <circle cx="30" cy="30" r="14" fill="none" stroke={color} strokeWidth="1.5" opacity={0.4} />
      {/* Euro-like symbol */}
      <path
        d="M35,20 Q24,20 22,30 Q24,40 35,40"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line x1="19" y1="27" x2="33" y2="27" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="19" y1="33" x2="33" y2="33" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

function SocialIcon({ color }: { color: string }) {
  return (
    <>
      {/* People / group */}
      {/* Center person */}
      <circle cx="30" cy="18" r="5" fill={color} />
      <path d="M20,38 Q20,28 30,28 Q40,28 40,38" fill={color} opacity={0.85} />
      {/* Left person */}
      <circle cx="16" cy="22" r="4" fill={color} opacity={0.6} />
      <path d="M8,38 Q8,30 16,30 Q22,30 22,36" fill={color} opacity={0.5} />
      {/* Right person */}
      <circle cx="44" cy="22" r="4" fill={color} opacity={0.6} />
      <path d="M52,38 Q52,30 44,30 Q38,30 38,36" fill={color} opacity={0.5} />
      {/* Base line */}
      <line x1="6" y1="42" x2="54" y2="42" stroke={color} strokeWidth="1.5" opacity={0.3} />
    </>
  );
}

const illustrationMap: Record<string, React.ComponentType<{ color: string }>> = {
  histoire: HistoireIcon,
  crise: CriseIcon,
  politique: PolitiqueIcon,
  commerce: CommerceIcon,
  monetaire: MonetaireIcon,
  social: SocialIcon,
};

export function FactIllustration({ category, className, size = 60 }: FactIllustrationProps) {
  // Normalize: remove accents for lookup
  const normalizedCategory = category
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  const color = categoryColors[normalizedCategory] || '#8B5CF6';
  const Illustration = illustrationMap[normalizedCategory] || HistoireIcon;

  return (
    <svg
      viewBox="0 0 60 60"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <circle cx="30" cy="30" r="28" fill={color} opacity={0.1} />
      <Illustration color={color} />
    </svg>
  );
}
