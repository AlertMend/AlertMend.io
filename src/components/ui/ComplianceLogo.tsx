import type { CSSProperties } from 'react';

type Standard = 'soc2' | 'iso27001' | 'gdpr';

type Props = {
  standard: Standard;
  size?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Stylized, brand-safe inline SVG marks for the most common security/privacy
 * standards. Modeled after the public AICPA SOC, ISO and EU GDPR seals but
 * drawn from scratch so we are not redistributing trademarked artwork.
 */
export default function ComplianceLogo({ standard, size = 36, className, style }: Props) {
  const props = { width: size, height: size, className, style, 'aria-hidden': true } as const;

  if (standard === 'soc2') {
    return (
      <svg {...props} viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="soc2-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill="url(#soc2-bg)" />
        <circle cx="32" cy="32" r="30" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
        <circle cx="32" cy="32" r="25" fill="none" stroke="#fbbf24" strokeWidth="0.6" opacity="0.6" />
        <text
          x="32" y="27"
          textAnchor="middle"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontWeight="800"
          fontSize="13"
          fill="#fbbf24"
          letterSpacing="1"
        >SOC</text>
        <text
          x="32" y="44"
          textAnchor="middle"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontWeight="900"
          fontSize="16"
          fill="#ffffff"
        >2</text>
        <text
          x="32" y="55"
          textAnchor="middle"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontWeight="700"
          fontSize="5"
          fill="#fbbf24"
          letterSpacing="0.6"
        >TYPE II</text>
      </svg>
    );
  }

  if (standard === 'iso27001') {
    return (
      <svg {...props} viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="iso-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>
        </defs>
        {/* Shield */}
        <path
          d="M32 3 L58 11 V32 C58 47 47 56 32 61 C17 56 6 47 6 32 V11 Z"
          fill="url(#iso-bg)"
          stroke="#ffffff"
          strokeWidth="1.2"
        />
        <path
          d="M32 3 L58 11 V32 C58 47 47 56 32 61 C17 56 6 47 6 32 V11 Z"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="0.6"
          transform="scale(0.92) translate(2.8, 3)"
        />
        <text
          x="32" y="26"
          textAnchor="middle"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontWeight="900"
          fontSize="13"
          fill="#ffffff"
          letterSpacing="1.2"
        >ISO</text>
        <text
          x="32" y="42"
          textAnchor="middle"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontWeight="800"
          fontSize="11"
          fill="#ffffff"
          letterSpacing="0.4"
        >27001</text>
        <line x1="14" y1="48" x2="50" y2="48" stroke="#ffffff" strokeWidth="0.8" opacity="0.5" />
        <text
          x="32" y="55"
          textAnchor="middle"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontWeight="700"
          fontSize="5"
          fill="#ffffff"
          letterSpacing="0.5"
        >INFOSEC</text>
      </svg>
    );
  }

  // GDPR — EU-blue circle with ring of yellow stars and "GDPR" wordmark
  const stars = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const r = 25;
    const cx = 32 + Math.cos(angle) * r;
    const cy = 32 + Math.sin(angle) * r;
    return (
      <Star key={i} cx={cx} cy={cy} size={2.6} fill="#fde047" />
    );
  });

  return (
    <svg {...props} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="gdpr-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#gdpr-bg)" />
      <circle cx="32" cy="32" r="30" fill="none" stroke="#fde047" strokeWidth="1" />
      {stars}
      <text
        x="32" y="36"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight="900"
        fontSize="13"
        fill="#ffffff"
        letterSpacing="1"
      >GDPR</text>
    </svg>
  );
}

function Star({ cx, cy, size, fill }: { cx: number; cy: number; size: number; fill: string }) {
  // 5-point star
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? size : size / 2.4;
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    pts.push(`${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`);
  }
  return <polygon points={pts.join(' ')} fill={fill} />;
}
