// fixmath/src/components/Navbar.js
'use client';

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { LayoutDashboard, LogOut, Menu, UserRoundCog, X } from 'lucide-react';
import Logo from './Logo';
import { signOut, useSession } from '@/lib/auth-client';
import { ROLE_DASHBOARD, ROLE_LABEL } from '@/lib/constants';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'How It Works' },
];

function Avatar({ name, image }) {
  if (image) {
    return <img src={image} alt={name} className="avatar" />;
  }
  return <span className="avatar">{name.charAt(0).toUpperCase()}</span>;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const user = session?.user;
  const role = user?.role ?? 'customer';

  // close the dropdown when clicking outside
  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const isActive = href =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  async function handleSignOut() {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          setMenuOpen(false);
          setMobileOpen(false);
          toast.success('Signed out successfully');
          router.push('/');
          router.refresh();
        },
      },
    });
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Logo />

        <nav className="nav-links" aria-label="Main">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={`nav-link ${isActive(link.href) ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          {isPending ? (
            <span className="nav-skeleton" />
          ) : user ? (
            <div className="menu-wrap" ref={menuRef}>
              <button
                className="avatar-btn"
                onClick={() => setMenuOpen(o => !o)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="Open account menu"
              >
                <Avatar name={user.name} image={user.image} />
              </button>

              {menuOpen && (
                <div className="dropdown" role="menu">
                  <div className="dropdown-head">
                    <p className="dropdown-name">{user.name}</p>
                    <p className="dropdown-email">{user.email}</p>
                    <span className={`role-badge role-${role}`}>
                      {ROLE_LABEL[role]}
                    </span>
                  </div>
                  <div className="dropdown-body">
                    <Link
                      href={ROLE_DASHBOARD[role] ?? '/dashboard'}
                      onClick={() => setMenuOpen(false)}
                      role="menuitem"
                      className="dropdown-item"
                    >
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setMenuOpen(false)}
                      role="menuitem"
                      className="dropdown-item"
                    >
                      <UserRoundCog size={16} /> Update Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      role="menuitem"
                      className="dropdown-item danger"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="nav-auth">
              <Link href="/sign-in" className="btn btn-outline">
                Sign In
              </Link>
              <Link href="/sign-up" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          )}

          <button
            className="hamburger"
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="mobile-panel">
          <nav className="container mobile-nav" aria-label="Mobile">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`nav-link ${isActive(link.href) ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            {!isPending && !user && (
              <div className="mobile-auth">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="btn btn-outline"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className="btn btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
