// fixmath/src/app/dashboard/admin/users/page.js
'use client';

/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { toast } from 'sonner';
import { ErrorBox, Loading } from '@/components/dashboard/DataState';
import PageHeader from '@/components/dashboard/PageHeader';
import { useSession } from '@/lib/auth-client';
import { authFetch } from '@/lib/auth-fetch';
import { formatDate } from '@/lib/format';
import { useApi } from '@/lib/use-api';

const ROLES = ['customer', 'technician', 'admin'];

export default function ManageUsersPage() {
  const { data: session } = useSession();
  const { data, setData, loading, error, reload } = useApi('/api/admin/users');
  const [busyId, setBusyId] = useState('');

  async function changeRole(user, role) {
    if (role === user.role) return;
    setBusyId(user._id);
    try {
      await authFetch(`/api/admin/users/${user._id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      });
      setData(list => list.map(u => (u._id === user._id ? { ...u, role } : u)));
      toast.success(`${user.name} is now a ${role}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId('');
    }
  }

  return (
    <>
      <PageHeader
        title="Manage Users"
        subtitle="Change roles for customers and technicians."
      />

      {loading && <Loading />}
      {error && <ErrorBox message={error} onRetry={reload} />}

      {data && (
        <div className="card table-card">
          <div className="table-wrap">
            <table className="dt">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {data.map(u => {
                  const isSelf = u.email === session?.user?.email;
                  return (
                    <tr key={u._id}>
                      <td data-label="User">
                        <div className="cell-service">
                          {u.image ? (
                            <img
                              src={u.image}
                              alt=""
                              className="thumb"
                              style={{ borderRadius: '50%' }}
                            />
                          ) : (
                            <span
                              className="avatar"
                              style={{ width: 40, height: 40 }}
                            >
                              {u.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                          <strong>{u.name}</strong>
                        </div>
                      </td>
                      <td data-label="Email">{u.email}</td>
                      <td data-label="Role">
                        <select
                          className="input select-role"
                          aria-label={`Role of ${u.name}`}
                          value={u.role ?? 'customer'}
                          disabled={isSelf || busyId === u._id}
                          title={
                            isSelf
                              ? 'You cannot change your own role'
                              : undefined
                          }
                          onChange={e => changeRole(u, e.target.value)}
                        >
                          {ROLES.map(r => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td data-label="Joined">{formatDate(u.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
