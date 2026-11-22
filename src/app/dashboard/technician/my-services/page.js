// fixmath/src/app/dashboard/technician/my-services/page.js
'use client';

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { PackageOpen } from 'lucide-react';
import ConfirmModal from '@/components/dashboard/ConfirmModal';
import { ErrorBox, Loading } from '@/components/dashboard/DataState';
import Modal from '@/components/dashboard/Modal';
import PageHeader from '@/components/dashboard/PageHeader';
import ServiceForm from '@/components/dashboard/ServiceForm';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { authFetch } from '@/lib/auth-fetch';
import { formatMoney } from '@/lib/format';
import { useApi } from '@/lib/use-api';

export default function MyServicesPage() {
  const { data, setData, loading, error, reload } =
    useApi('/api/services/mine');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState('');

  async function toggleAvailability(service) {
    setBusy(service._id);
    try {
      const updated = await authFetch(`/api/services/${service._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isAvailable: !service.isAvailable }),
      });
      setData(list => list.map(s => (s._id === updated._id ? updated : s)));
      toast.success(
        updated.isAvailable
          ? 'Service is now available'
          : 'Service hidden from public pages',
      );
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy('');
    }
  }

  async function confirmDelete() {
    setBusy(deleting._id);
    try {
      await authFetch(`/api/services/${deleting._id}`, { method: 'DELETE' });
      setData(list => list.filter(s => s._id !== deleting._id));
      toast.success('Service deleted');
      setDeleting(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy('');
    }
  }

  return (
    <>
      <PageHeader
        title="My Services"
        subtitle="Edit, hide or delete the services you offer."
      >
        <Link
          href="/dashboard/technician/add-service"
          className="btn btn-primary"
        >
          Add a service
        </Link>
      </PageHeader>

      {loading && <Loading />}
      {error && <ErrorBox message={error} onRetry={reload} />}

      {data && data.length === 0 && (
        <div className="empty">
          <PackageOpen size={40} />
          <h3>You have not added a service yet</h3>
          <p>List your first repair service so customers can find you.</p>
          <Link
            href="/dashboard/technician/add-service"
            className="btn btn-primary"
          >
            Add a service
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
                  <th>Category</th>
                  <th>Price</th>
                  <th>Approval</th>
                  <th>Available</th>
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
                        <strong>{s.title}</strong>
                      </div>
                    </td>
                    <td data-label="Category">{s.category}</td>
                    <td data-label="Price">
                      <span className="money">{formatMoney(s.basePrice)}</span>
                    </td>
                    <td data-label="Approval">
                      <StatusBadge status={s.approvalStatus} />
                    </td>
                    <td data-label="Available">
                      <button
                        className="switch"
                        role="switch"
                        aria-checked={s.isAvailable}
                        aria-label={`Toggle availability of ${s.title}`}
                        disabled={busy === s._id}
                        onClick={() => toggleAvailability(s)}
                      />
                    </td>
                    <td data-label="Action">
                      <div className="row-actions">
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => setEditing(s)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setDeleting(s)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={Boolean(editing)}
        title="Edit service"
        subtitle="After saving, the service goes back to pending approval."
        width={720}
        onClose={() => setEditing(null)}
      >
        {editing && (
          <ServiceForm
            service={editing}
            onSaved={saved => {
              setData(list => list.map(s => (s._id === saved._id ? saved : s)));
              setEditing(null);
            }}
          />
        )}
      </Modal>

      <ConfirmModal
        open={Boolean(deleting)}
        title="Delete this service?"
        text={`"${deleting?.title}" will be removed permanently. Existing bookings keep their own copy of the details.`}
        confirmLabel="Delete service"
        danger
        loading={Boolean(deleting) && busy === deleting._id}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
