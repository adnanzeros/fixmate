// PATH: fixmate/src/app/payment/layout.js
import { requireRole } from '@/lib/session';
import '@/app/dashboard/dashboard.css';

// Only customers pay. Logged-out users are sent to /sign-in by proxy.js.
export default async function PaymentLayout({ children }) {
  await requireRole('customer');
  return <div className="pay-wrap">{children}</div>;
}
