
'use client';


import { useState } from 'react';
import { toast } from 'sonner';
import { ListChecks } from 'lucide-react';
import { ErrorBox, Loading } from '@/components/dashboard/DataState';
import PageHeader from '@/components/dashboard/PageHeader';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { authFetch } from '@/lib/auth-fetch';
import { formatMoney } from '@/lib/format';
import { useApi } from '@/lib/use-api';

const FILTERS = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: '', label: 'All' },
];

export default function ServiceApprovalPage() {
  // pending services are shown by default so they are easy to find
  const [filter, setFilter] = useState('pending');
  const { data, loading, error, reload } = useApi(
    `/api/admin/services${filter ? `?approvalStatus=${filter}` : ''}`,
  );
  const [busyId, setBusyId] = useState('');

  async function decide(service, approvalStatus) {
    setBusyId(service._id);
    try {
      await authFetch(`/api/admin/services/${service._id}/approval`, {
        method: 'PATCH',
        body: JSON.stringify({ approvalStatus }),
      });
      toast.success(
        approvalStatus === 'approved' ? 'Service approved' : 'Service rejected',
      );
      await reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId('');
    }
  }

  return (
    <>
      <PageHeader
        title="Service Approval"
        subtitle="Review services before customers can see them."
      >
        <select
          className="input"
          aria-label="Filter by approval status"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          {FILTERS.map(f => (
            <option key={f.label} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </PageHeader>

      {loading && <Loading />}
      {error && <ErrorBox message={error} onRetry={reload} />}

      {data && data.length === 0 && (
        <div className="empty">
          <ListChecks size={40} />
          <h3>Nothing to review</h3>
          <p>No services match this filter right now.</p>
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
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map(s => (
                  <tr key={s._id}>
                    <td data-label="Service">
                      <div className="cell-service">
                        {s.image ? (
                          <img src={s.image} alt="" className="thumb" />
                        ) : (
                          <span className="thumb" />
                        )}
                        <div>
                          <strong>{s.title}</strong>
                          <small>{s.serviceMode}</small>
                        </div>
                      </div>
                    </td>
                    <td data-label="Technician">
                      {s.technicianName}
                      <small>{s.technicianEmail}</small>
                    </td>
                    <td data-label="Category">{s.category}</td>
                    <td data-label="Price">
                      <span className="money">{formatMoney(s.basePrice)}</span>
                    </td>
                    <td data-label="Status">
                      <StatusBadge status={s.approvalStatus} />
                    </td>
                    <td data-label="Action">
                      <div className="row-actions">
                        {s.approvalStatus !== 'approved' && (
                          <button
                            className="btn btn-success btn-sm"
                            disabled={busyId === s._id}
                            onClick={() => decide(s, 'approved')}
                          >
                            Approve
                          </button>
                        )}
                        {s.approvalStatus !== 'rejected' && (
                          <button
                            className="btn btn-danger btn-sm"
                            disabled={busyId === s._id}
                            onClick={() => decide(s, 'rejected')}
                          >
                            Reject
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
    </>
  );
}
