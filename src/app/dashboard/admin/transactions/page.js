// fixmath/src/app/dashboard/admin/transactions/page.js
'use client';

import { Receipt } from 'lucide-react';
import { ErrorBox, Loading } from '@/components/dashboard/DataState';
import PageHeader from '@/components/dashboard/PageHeader';
import { formatDate, formatMoney } from '@/lib/format';
import { useApi } from '@/lib/use-api';

export default function TransactionsPage() {
  const { data, loading, error, reload } = useApi('/api/admin/payments');

  return (
    <>
      <PageHeader
        title="Transactions"
        subtitle="Every payment collected through Stripe."
      />

      {loading && <Loading />}
      {error && <ErrorBox message={error} onRetry={reload} />}

      {data && (
        <>
          <div className="revenue-banner">
            <span>Total revenue</span>
            <strong>{formatMoney(data.totalRevenue)}</strong>
          </div>

          {data.payments.length === 0 ? (
            <div className="empty">
              <Receipt size={40} />
              <h3>No transactions yet</h3>
              <p>
                Payments will be listed here once customers pay for completed
                jobs.
              </p>
            </div>
          ) : (
            <div className="card table-card">
              <div className="table-wrap">
                <table className="dt">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Technician</th>
                      <th>Service</th>
                      <th>Amount</th>
                      <th>Transaction ID</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.payments.map(p => (
                      <tr key={p._id}>
                        <td data-label="Customer">
                          {p.customerName}
                          <small>{p.customerEmail}</small>
                        </td>
                        <td data-label="Technician">{p.technicianName}</td>
                        <td data-label="Service">{p.serviceTitle}</td>
                        <td data-label="Amount">
                          <span className="money">{formatMoney(p.amount)}</span>
                        </td>
                        <td data-label="Transaction ID">
                          <span className="cell-mono">{p.transactionId}</span>
                        </td>
                        <td data-label="Date">{formatDate(p.paidAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
