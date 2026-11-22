// fixmath/src/app/dashboard/technician/layout.js
import { requireRole } from '@/lib/session';

// Logged-out -> /sign-in. Another role -> redirected to their own dashboard.
export default async function TechnicianLayout({ children }) {
  await requireRole('technician');
  return children;
}
