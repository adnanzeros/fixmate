
import { requireRole } from '@/lib/session';


export default async function TechnicianLayout({ children }) {
  await requireRole('technician');
  return children;
}
