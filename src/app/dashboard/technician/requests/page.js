// fixmath/src/app/dashboard/technician/requests/page.js
'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Inbox, LoaderCircle } from 'lucide-react';
import ConfirmModal from '@/components/dashboard/ConfirmModal';
import { ErrorBox, Loading } from '@/components/dashboard/DataState';
import Modal from '@/components/dashboard/Modal';
import PageHeader from '@/components/dashboard/PageHeader';
import { PaymentBadge, StatusBadge } from '@/components/dashboard/StatusBadge';
import { authFetch } from '@/lib/auth-fetch';
import { formatDate, formatMoney } from '@/lib/format';
import { useApi } from '@/lib/use-api';

const FILTERS = [
  { value: '', label: 'All' },
  { value: 'requested', label: 'Requested' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export default function RequestsPage() {
  const [filter, setFilter] = useState('');
  const { data, loading, error, reload } = useApi(
    `/api/bookings/technician${filter ? `?status=${filter}` : ''}`,
  );

  const [rejectTarget, setRejectTarget] = useState(null);
  const [completeTarget, setCompleteTarget] = useState(null);
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [busyId, setBusyId] = useState('');

  // The server checks the owner and that this step is allowed in the pipeline
  async function changeStatus(booking, status, extra = {}) {
    setBusyId(booking._id);
    try {
      await authFetch(`/api/bookings/${booking._id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, ...extra }),
      });
      toast.success(
        {
          accepted: 'Request accepted',
          rejected: 'Request rejected',
          'in-progress': 'Work started',
          completed: 'Job marked as completed',
        }[status],
      );
      setRejectTarget(null);
      setCompleteTarget(null);
      await reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId('');
    }
  }

  function openComplete(booking) {
    setAmount(String(booking.basePrice)); // pre-filled with the base price
    setAmountError('');
    setCompleteTarget(booking);
  }

  function submitComplete(e) {
    e.preventDefault();
    const value = Number(amount);
    if (!(value > 0)) {
      setAmountError('Enter a final amount greater than 0');
      return;
    }
    changeStatus(completeTarget, 'completed', { finalAmount: value });
  }

  const busy = id => busyId === id;

  return (
    <>
      <PageHeader
        title="Manage Requests"
        subtitle="Move each job through the repair pipeline."
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
          <Inbox size={40} />
          <h3>No requests {filter ? 'with this status' : 'yet'}</h3>
          <p>
            When customers book your services, their requests will show up here.
          </p>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="card table-card">
          <div className="table-wrap">
            <table className="dt">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Date</th>
                  <th>Problem</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map(b => (
                  <tr key={b._id}>
                    <td data-label="Customer">
                      <strong>{b.customerName}</strong>
                    </td>
                    <td data-label="Phone">{b.customerPhone}</td>
                    <td data-label="Address">
                      <span className="cell-clamp">{b.address}</span>
                    </td>
                    <td data-label="Date">{formatDate(b.preferredDate)}</td>
                    <td data-label="Problem">
                      <span className="cell-clamp">{b.problemDescription}</span>
                    </td>
                    <td data-label="Service">
                      {b.serviceTitle}
                      <small>Base {formatMoney(b.basePrice)}</small>
                    </td>
                    <td data-label="Status">
                      <StatusBadge status={b.status} />
                    </td>
                    <td data-label="Action">
                      <div className="row-actions">
                        {b.status === 'requested' && (
                          <>
                            <button
                              className="btn btn-success btn-sm"
                              disabled={busy(b._id)}
                              onClick={() => changeStatus(b, 'accepted')}
                            >
                              {busy(b._id) && (
                                <LoaderCircle size={14} className="spin" />
                              )}{' '}
                              Accept
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              disabled={busy(b._id)}
                              onClick={() => setRejectTarget(b)}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {b.status === 'accepted' && (
                          <button
                            className="btn btn-primary btn-sm"
                            disabled={busy(b._id)}
                            onClick={() => changeStatus(b, 'in-progress')}
                          >
                            {busy(b._id) && (
                              <LoaderCircle size={14} className="spin" />
                            )}{' '}
                            Start Work
                          </button>
                        )}
                        {b.status === 'in-progress' && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => openComplete(b)}
                          >
                            Mark Completed
                          </button>
                        )}
                        {b.status === 'completed' && (
                          <PaymentBadge status={b.paymentStatus} />
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
        open={Boolean(rejectTarget)}
        title="Reject this request?"
        text={`You are about to reject the request from ${rejectTarget?.customerName}. This is final and cannot be undone.`}
        confirmLabel="Reject request"
        danger
        loading={Boolean(rejectTarget) && busy(rejectTarget._id)}
        onConfirm={() => changeStatus(rejectTarget, 'rejected')}
        onClose={() => setRejectTarget(null)}
      />

      <Modal
        open={Boolean(completeTarget)}
        title="Mark job as completed"
        subtitle={completeTarget?.serviceTitle}
        width={440}
        onClose={() => setCompleteTarget(null)}
      >
        <form onSubmit={submitComplete} noValidate>
          <div className="field">
            <label className="label" htmlFor="final-amount">
              Final amount (USD)
            </label>
            <input
              id="final-amount"
              type="number"
              min="1"
              step="0.01"
              className={`input ${amountError ? 'has-error' : ''}`}
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
            {amountError && <p className="field-error">{amountError}</p>}
            <p className="side-note">
              The customer will pay this amount after the job is completed.
            </p>
          </div>
          <div className="confirm-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setCompleteTarget(null)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={completeTarget && busy(completeTarget._id)}
            >
              {completeTarget && busy(completeTarget._id) && (
                <LoaderCircle size={16} className="spin" />
              )}
              Complete job
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
