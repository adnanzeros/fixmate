// components/Logo.js
import Link from 'next/link';

export function LogoMark({ className = 'logo-mark' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="fm-logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E11D48" />
          <stop offset=".55" stopColor="#B0122B" />
          <stop offset="1" stopColor="#3B0A10" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#fm-logo-g)" />
      <g
        transform="translate(14 14) scale(1.5)"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </g>
    </svg>
  );
}

/** Same size and style on every page. Use `light` on dark backgrounds. */
export default function Logo({ light = false, href = '/' }) {
  return (
    <Link
      href={href}
      className={`logo ${light ? 'logo-light' : ''}`}
      aria-label="FixMate home"
    >
      <LogoMark />
      <span className="logo-text">
        Fix<span>Mate</span>
      </span>
    </Link>
  );
}
