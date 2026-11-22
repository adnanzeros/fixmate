// fixmath/src/app/dashboard/admin/layout.js
import { requireRole } from '@/lib/session';

// Logged-out -> /sign-in. Another role -> redirected to their own dashboard.
export default async function AdminLayout({ children }) {
  await requireRole('admin');
  return children;
}
