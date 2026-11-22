// PATH: fixmate/src/app/dashboard/customer/bookings/page.js
'use client';

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { CalendarX, LoaderCircle } from 'lucide-react';
import ConfirmModal from '@/components/dashboard/ConfirmModal';
import { ErrorBox, Loading } from '@/components/dashboard/DataState';
import PageHeader from '@/components/dashboard/PageHeader';
import { PaymentBadge, StatusBadge } from '@/components/dashboard/StatusBadge';
import { authFetch } from '@/lib/auth-fetch';
import { formatDate, formatMoney } from '@/lib/format';
import { useApi } from '@/lib/use-api';

export default function MyBookingsPage() {
  const { data, loading, error, reload } = useApi('/api/bookings/my');
  const [cancelTarget, setCancelTarget] = useState(null);
  const [busyId, setBusyId] = useState('');

  async function confirmCancel() {
    setBusyId(cancelTarget._id);
    try {
      await authFetch(`/api/bookings/${cancelTarget._id}/cancel`, {
        method: 'PATCH',
      });
      toast.success('Request cancelled');
      setCancelTarget(null);
      await reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId('');
    }
  }

  // The server loads the booking and the amount from the database, only the id is sent
  async function payNow(booking) {
    setBusyId(booking._id);
    try {
      const { url } = await authFetch('/api/payments/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({ bookingId: booking._id }),
      });
      window.location.assign(url); // Stripe Checkout
    } catch (err) {
      toast.error(err.message);
      setBusyId('');
    }
  }

  return (
    <>
      <PageHeader
        title="My Bookings"
        subtitle="Track every repair request. Pay only after the job is completed."
      />

      {data?.some(
        b => b.status === 'completed' && b.paymentStatus === 'unpaid',
      ) && (
        <p className="notice" style={{ marginBottom: 16 }}>
          Test mode: pay with card 4242 4242 4242 4242, any future date, any
          CVC.
        </p>
      )}

      {loading && <Loading />}
      {error && <ErrorBox message={error} onRetry={reload} />}

      {data && data.length === 0 && (
        <div className="empty">
          <CalendarX size={40} />
          <h3>No bookings yet</h3>
          <p>Find a technician and send your first repair request.</p>
          <Link href="/services" className="btn btn-primary">
            Browse services
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
                  <th>Preferred date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map(b => (
                  <tr key={b._id}>
                    <td data-label="Service">
                      <div className="cell-service">
                        {b.serviceImage ? (
                          <img src={b.serviceImage} alt="" className="thumb" />
                        ) : (
                          <span className="thumb" />
                        )}
                        <div>
                          <strong>{b.serviceTitle}</strong>
                          <small>{b.category}</small>
                        </div>
                      </div>
                    </td>
                    <td data-label="Technician">{b.technicianName}</td>
                    <td data-label="Preferred date">
                      {formatDate(b.preferredDate)}
                    </td>
                    <td data-label="Amount">
                      {b.status === 'completed' ? (
                        <span className="money">
                          {formatMoney(b.finalAmount)}
                        </span>
                      ) : (
                        <span>Base {formatMoney(b.basePrice)}</span>
                      )}
                    </td>
                    <td data-label="Status">
                      <StatusBadge status={b.status} />
                    </td>
                    <td data-label="Payment">
                      <PaymentBadge status={b.paymentStatus} />
                    </td>
                    <td data-label="Action">
                      <div className="row-actions">
                        {b.status === 'requested' && (
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => setCancelTarget(b)}
                          >
                            Cancel
                          </button>
                        )}
                        {b.status === 'completed' &&
                          b.paymentStatus === 'unpaid' && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => payNow(b)}
                              disabled={busyId === b._id}
                            >
                              {busyId === b._id && (
                                <LoaderCircle size={14} className="spin" />
                              )}
                              Pay Now
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        open={Boolean(cancelTarget)}
        title="Cancel this request?"
        text={`Your repair request for "${cancelTarget?.serviceTitle}" will be cancelled. This cannot be undone.`}
        confirmLabel="Yes, cancel request"
        danger
        loading={Boolean(cancelTarget) && busyId === cancelTarget._id}
        onConfirm={confirmCancel}
        onClose={() => setCancelTarget(null)}
      />
    </>
  );
}
