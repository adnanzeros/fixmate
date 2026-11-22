
import { requireRole } from '@/lib/session';
import '@/app/dashboard/dashboard.css';


export default async function PaymentLayout({ children }) {
  await requireRole('customer');
  return <div className="pay-wrap">{children}</div>;
}
