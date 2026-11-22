// fixmath/src/app/dashboard/customer/layout.js
import { requireRole } from '@/lib/session';

// Logged-out -> /sign-in. Another role -> redirected to their own dashboard.
export default async function CustomerLayout({ children }) {
  await requireRole('customer');
  return children;
}
