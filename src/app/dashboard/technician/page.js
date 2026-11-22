// fixmath/src/app/dashboard/technician/page.js
'use client';

import Link from 'next/link';
import { Inbox, Wallet, Wrench, BadgeCheck } from 'lucide-react';
import { StatusBars } from '@/components/dashboard/Charts';
import { ErrorBox, Loading } from '@/components/dashboard/DataState';
import PageHeader from '@/components/dashboard/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import { formatMoney } from '@/lib/format';
import { useApi } from '@/lib/use-api';

export default function TechnicianOverview() {
  const { data, loading, error, reload } = useApi('/api/stats/technician');

  return (
    <>
      <PageHeader title="Overview" subtitle="Your services and incoming jobs.">
        <Link
          href="/dashboard/technician/add-service"
          className="btn btn-primary"
        >
          Add a service
        </Link>
      </PageHeader>

      {loading && <Loading />}
      {error && <ErrorBox message={error} onRetry={reload} />}

      {data && (
        <>
          <div className="stats-grid">
            <StatCard
              icon={Wrench}
              label="Total Services"
              value={data.totalServices}
            />
            <StatCard
              icon={BadgeCheck}
              label="Approved Services"
              value={data.approvedServices}
            />
            <StatCard
              icon={Inbox}
              label="Pending Requests"
              value={data.pendingRequests}
            />
            <StatCard
              icon={Wallet}
              label="Total Earned"
              value={formatMoney(data.totalEarned)}
            />
          </div>

          <div className="card panel">
            <h2 className="panel-title">Jobs by status</h2>
            <StatusBars data={data.byStatus} />
          </div>
        </>
      )}
    </>
  );
}
