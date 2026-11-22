// components/Footer.js
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import Logo from './Logo';

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}

const SOCIALS = [
  { label: 'X (formerly Twitter)', href: 'https://x.com', icon: <XIcon /> },
  { label: 'Facebook', href: 'https://facebook.com', icon: <FacebookIcon /> },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: <LinkedInIcon /> },
];

const QUICK_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'How It Works' },
];

const POPULAR = ['Smartphone', 'Laptop & PC', 'AC', 'Refrigerator', 'TV'];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Logo light />
          <p className="footer-text">
            Verified technicians, a clear job status at every step, and payment
            only after your device is fixed.
          </p>
          <div className="footer-social">
            {SOCIALS.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-list">
            {QUICK_LINKS.map(l => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="footer-title">Popular Categories</h3>
          <ul className="footer-list">
            {POPULAR.map(c => (
              <li key={c}>
                <Link href={`/services?category=${encodeURIComponent(c)}`}>
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="footer-title">Contact</h3>
          <ul className="footer-list footer-contact">
            <li>
              <Mail size={16} /> support@fixmate.com
            </li>
            <li>
              <Phone size={16} /> +880 1700-000000
            </li>
            <li>
              <MapPin size={16} /> House 12, Road 5, Mirpur, Dhaka
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          © {new Date().getFullYear()} FixMate. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
