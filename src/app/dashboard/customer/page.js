// fixmath/src/app/dashboard/customer/page.js
'use client';

import Link from 'next/link';
import {
  CalendarCheck,
  CircleCheck,
  ClipboardList,
  Wallet,
} from 'lucide-react';
import { StatusBars } from '@/components/dashboard/Charts';
import { ErrorBox, Loading } from '@/components/dashboard/DataState';
import PageHeader from '@/components/dashboard/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import { formatMoney } from '@/lib/format';
import { useApi } from '@/lib/use-api';

export default function CustomerOverview() {
  const { data, loading, error, reload } = useApi('/api/stats/customer');

  return (
    <>
      <PageHeader title="Overview" subtitle="Your repair requests at a glance.">
        <Link href="/services" className="btn btn-primary">
          Browse services
        </Link>
      </PageHeader>

      {loading && <Loading />}
      {error && <ErrorBox message={error} onRetry={reload} />}

      {data && (
        <>
          <div className="stats-grid">
            <StatCard
              icon={ClipboardList}
              label="Total Requests"
              value={data.totalRequests}
            />
            <StatCard
              icon={CalendarCheck}
              label="Active Jobs"
              value={data.activeJobs}
            />
            <StatCard
              icon={CircleCheck}
              label="Completed Jobs"
              value={data.completedJobs}
            />
            <StatCard
              icon={Wallet}
              label="Total Paid"
              value={formatMoney(data.totalSpent)}
            />
          </div>

          <div className="card panel">
            <h2 className="panel-title">Requests by status</h2>
            <StatusBars data={data.byStatus} />
          </div>
        </>
      )}
    </>
  );
}
