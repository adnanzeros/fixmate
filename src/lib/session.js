
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { ROLE_DASHBOARD } from '@/lib/constants';

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}


export async function requireRole(role) {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  const current = session.user.role ?? 'customer';
  if (current !== role) redirect(ROLE_DASHBOARD[current] ?? '/');
  return session;
}
