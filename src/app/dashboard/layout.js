// fixmath/src/app/dashboard/layout.js
import { redirect } from 'next/navigation';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { getSession } from '@/lib/session';
import './dashboard.css';

export const metadata = { title: 'Dashboard' };

// Separate Dashboard Layout (sidebar + top bar, no public footer)
export default async function DashboardLayout({ children }) {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  const { name, email, image, role } = session.user;
  return (
    <DashboardShell
      initialUser={{
        name,
        email,
        image: image ?? '',
        role: role ?? 'customer',
      }}
    >
      {children}
    </DashboardShell>
  );
}
