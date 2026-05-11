interface MjLogoProps {
  size?: number;
  gradientId?: string;
  glowClass?: string;
}

export function MjLogo({
  size = 44,
  gradientId = "mjGrad",
  glowClass = "drop-shadow-[0_0_10px_rgba(0,119,255,0.4)]",
}: MjLogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={glowClass}
      role="img"
      aria-label="Mj Player logo"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--theme-400)" />
          <stop offset="100%" stopColor="var(--theme-600)" />
        </linearGradient>
      </defs>
      <path
        d="M 15 65 C 15 40, 25 25, 40 25 C 50 25, 55 40, 55 40 C 55 40, 60 25, 75 25 C 85 25, 90 35, 90 50"
        stroke={`url(#${gradientId})`}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 90 50 C 90 75, 75 90, 60 90 C 45 90, 35 80, 35 70"
        stroke={`url(#${gradientId})`}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M 55 40 L 55 70 L 80 55 Z" fill="white" />
    </svg>
  );
}
