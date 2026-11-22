
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { ROLE_DASHBOARD } from '@/lib/constants';

export default async function DashboardIndex() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/sign-in?redirect=/dashboard');

  const role = session.user.role ?? 'customer';
  redirect(ROLE_DASHBOARD[role] ?? ROLE_DASHBOARD.customer);
}
