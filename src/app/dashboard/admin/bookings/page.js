
'use client';

import { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { ErrorBox, Loading } from '@/components/dashboard/DataState';
import PageHeader from '@/components/dashboard/PageHeader';
import { PaymentBadge, StatusBadge } from '@/components/dashboard/StatusBadge';
import { formatDate, formatMoney } from '@/lib/format';
import { useApi } from '@/lib/use-api';

const FILTERS = [
  { value: '', label: 'All statuses' },
  { value: 'requested', label: 'Requested' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function AllBookingsPage() {
  const [filter, setFilter] = useState('');
  const { data, loading, error, reload } = useApi(
    `/api/admin/bookings${filter ? `?status=${filter}` : ''}`,
  );

  return (
    <>
      <PageHeader
        title="All Bookings"
        subtitle="Read-only view of every job on the platform."
      >
        <select
          className="input"
          aria-label="Filter by status"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          {FILTERS.map(f => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </PageHeader>

      {loading && <Loading />}
      {error && <ErrorBox message={error} onRetry={reload} />}

      {data && data.length === 0 && (
        <div className="empty">
          <ClipboardList size={40} />
          <h3>No bookings found</h3>
          <p>No bookings match this filter.</p>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="card table-card">
          <div className="table-wrap">
            <table className="dt">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Customer</th>
                  <th>Technician</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.map(b => (
                  <tr key={b._id}>
                    <td data-label="Service">
                      <strong>{b.serviceTitle}</strong>
                    </td>
                    <td data-label="Customer">
                      {b.customerName}
                      <small>{b.customerEmail}</small>
                    </td>
                    <td data-label="Technician">
                      {b.technicianName}
                      <small>{b.technicianEmail}</small>
                    </td>
                    <td data-label="Date">{formatDate(b.preferredDate)}</td>
                    <td data-label="Status">
                      <StatusBadge status={b.status} />
                    </td>
                    <td data-label="Payment">
                      <PaymentBadge status={b.paymentStatus} />
                    </td>
                    <td data-label="Amount">
                      <span className="money">
                        {formatMoney(
                          b.status === 'completed'
                            ? b.finalAmount
                            : b.basePrice,
                        )}
                      </span>
                    </td>
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
