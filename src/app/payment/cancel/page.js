
import Link from 'next/link';
import { CircleX } from 'lucide-react';

export const metadata = { title: 'Payment cancelled' };


export default function PaymentCancelPage() {
  return (
    <div className="card pay-card">
      <CircleX size={52} className="pay-icon-warn" />
      <h1>Payment cancelled</h1>
      <p>
        No money was taken and your booking is unchanged. You can pay whenever
        you are ready.
      </p>
      <div style={{ marginTop: 24 }}>
        <Link
          href="/dashboard/customer/bookings"
          className="btn btn-primary btn-block"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}
