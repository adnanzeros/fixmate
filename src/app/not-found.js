// fixmath/src/app/not-found.js
import Link from 'next/link';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <div className="nf">
      {/* Crossed wrench and screwdriver */}
      <svg className="nf-art" viewBox="0 0 200 200" aria-hidden="true">
        <circle cx="100" cy="100" r="92" fill="#FDF2F3" />
        <g transform="translate(100 100) rotate(45)">
          <rect x="-8" y="-74" width="16" height="54" rx="8" fill="#C8102E" />
          <rect
            x="-3.5"
            y="-22"
            width="7"
            height="82"
            rx="3.5"
            fill="#3B0A10"
          />
          <path d="M-3.5 60 L0 74 L3.5 60 Z" fill="#3B0A10" />
        </g>
        <g transform="translate(100 100) rotate(-45) translate(-40 -40) scale(3.33)">
          <path
            d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
            fill="#fff"
            stroke="#9B1B30"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </g>
      </svg>

      <p className="nf-code">404</p>
      <h1>This page needs a repair</h1>
      <p>
        We could not find the page you were looking for. It may have been moved,
        or the link may be wrong.
      </p>
      <div className="nf-actions">
        <Link href="/" className="btn btn-primary">
          Back to Home
        </Link>
        <Link href="/services" className="btn btn-outline">
          Browse services
        </Link>
      </div>
    </div>
  );
}
