
'use client';

import Link from 'next/link';
import { Receipt } from 'lucide-react';
import { ErrorBox, Loading } from '@/components/dashboard/DataState';
import PageHeader from '@/components/dashboard/PageHeader';
import { formatDate, formatMoney } from '@/lib/format';
import { useApi } from '@/lib/use-api';

export default function PaymentHistoryPage() {
  const { data, loading, error, reload } = useApi('/api/payments/my');

  return (
    <>
      <PageHeader
        title="Payment History"
        subtitle="Every job you have paid for."
      />

      {loading && <Loading />}
      {error && <ErrorBox message={error} onRetry={reload} />}

      {data && data.length === 0 && (
        <div className="empty">
          <Receipt size={40} />
          <h3>No payments yet</h3>
          <p>Payments appear here after you pay for a completed job.</p>
          <Link href="/dashboard/customer/bookings" className="btn btn-primary">
            Go to My Bookings
          </Link>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="card table-card">
          <div className="table-wrap">
            <table className="dt">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Technician</th>
                  <th>Amount</th>
                  <th>Transaction ID</th>
                  <th>Payment date</th>
                </tr>
              </thead>
              <tbody>
                {data.map(p => (
                  <tr key={p._id}>
                    <td data-label="Service">
                      <strong>{p.serviceTitle}</strong>
                    </td>
                    <td data-label="Technician">{p.technicianName}</td>
                    <td data-label="Amount">
                      <span className="money">{formatMoney(p.amount)}</span>
                    </td>
                    <td data-label="Transaction ID">
                      <span className="cell-mono">{p.transactionId}</span>
                    </td>
                    <td data-label="Payment date">{formatDate(p.paidAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
