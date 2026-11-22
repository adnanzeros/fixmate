
'use client';


import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  ArrowLeft,
  BadgeCheck,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Receipt,
  UserRoundCog,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import Logo from '@/components/Logo';
import { signOut, useSession } from '@/lib/auth-client';
import { ROLE_LABEL } from '@/lib/constants';

// The sidebar menu changes with the role of the logged-in user
const MENUS = {
  customer: [
    {
      href: '/dashboard/customer',
      label: 'Overview',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: '/dashboard/customer/bookings',
      label: 'My Bookings',
      icon: CalendarCheck,
    },
    {
      href: '/dashboard/customer/payments',
      label: 'Payment History',
      icon: CreditCard,
    },
  ],
  technician: [
    {
      href: '/dashboard/technician',
      label: 'Overview',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: '/dashboard/technician/add-service',
      label: 'Add Service',
      icon: Plus,
    },
    {
      href: '/dashboard/technician/my-services',
      label: 'My Services',
      icon: Wrench,
    },
    { href: '/dashboard/technician/requests', label: 'Requests', icon: Inbox },
  ],
  admin: [
    {
      href: '/dashboard/admin',
      label: 'Overview',
      icon: LayoutDashboard,
      exact: true,
    },
    { href: '/dashboard/admin/users', label: 'Manage Users', icon: Users },
    {
      href: '/dashboard/admin/services',
      label: 'Service Approval',
      icon: BadgeCheck,
    },
    {
      href: '/dashboard/admin/bookings',
      label: 'All Bookings',
      icon: ClipboardList,
    },
    {
      href: '/dashboard/admin/transactions',
      label: 'Transactions',
      icon: Receipt,
    },
  ],
};

const PROFILE_LINK = {
  href: '/dashboard/profile',
  label: 'Update Profile',
  icon: UserRoundCog,
};

function Avatar({ name, image }) {
  if (image) return <img src={image} alt={name} className="avatar" />;
  return <span className="avatar">{name.charAt(0).toUpperCase()}</span>;
}

export default function DashboardShell({ initialUser, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  // live session first, so a new name / photo shows up without logging out
  const user = session?.user ?? initialUser;
  const role = user.role ?? 'customer';
  const items = [...(MENUS[role] ?? MENUS.customer), PROFILE_LINK];

  const isActive = item =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  async function handleSignOut() {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success('Signed out successfully');
          router.push('/');
          router.refresh();
        },
      },
    });
  }

  return (
    <div className="dash">
      {open && <div className="dash-overlay" onClick={() => setOpen(false)} />}

      <aside
        className={`dash-side ${open ? 'open' : ''}`}
        aria-label="Dashboard menu"
      >
        <div className="side-top">
          <Logo light />
          <button
            className="side-close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="side-nav">
          {items.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(item) ? 'page' : undefined}
              className={`side-link ${isActive(item) ? 'active' : ''}`}
            >
              <item.icon size={18} /> {item.label}
            </Link>
          ))}
        </nav>

        <button className="side-link side-signout" onClick={handleSignOut}>
          <LogOut size={18} /> Sign Out
        </button>
      </aside>

      <div className="dash-main">
        <header className="dash-top">
          <div className="dash-top-left">
            <button
              className="menu-btn"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <Link href="/" className="back-home">
              <ArrowLeft size={16} /> Back to Home
            </Link>
          </div>

          <div className="top-user">
            <div className="top-user-text">
              <strong>{user.name}</strong>
              <span className={`role-badge role-${role}`}>
                {ROLE_LABEL[role]}
              </span>
            </div>
            <Avatar name={user.name} image={user.image} />
          </div>
        </header>

        <main className="dash-content">{children}</main>
      </div>
    </div>
  );
}
