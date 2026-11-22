// fixmath/src/app/(auth)/layout.js
import Link from 'next/link';
import { CircleCheck } from 'lucide-react';
import Logo from '@/components/Logo';

const POINTS = [
  'Verified technicians with reviewed services',
  'Track every repair from request to completion',
  'Pay only after the job is done',
];

export default function AuthLayout({ children }) {
  return (
    <div className="auth-shell">
      <aside className="auth-side">
        <Logo light />
        <div>
          <h2>Get your device fixed without the guesswork.</h2>
          <ul>
            {POINTS.map(p => (
              <li key={p}>
                <CircleCheck size={20} /> {p}
              </li>
            ))}
          </ul>
        </div>
        <small>© {new Date().getFullYear()} FixMate</small>
        <div className="auth-ring" />
      </aside>

      <main className="auth-main">
        <div className="auth-top">
          <Logo />
          <Link href="/" className="auth-back">
            Back to home
          </Link>
        </div>
        {children}
      </main>
    </div>
  );
}
