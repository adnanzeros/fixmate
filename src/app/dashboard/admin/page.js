// fixmath/src/app/dashboard/admin/page.js
'use client';

import { BadgeCheck, Users, UserRoundCog, Wallet } from 'lucide-react';
import { RevenueBars, StatusBars } from '@/components/dashboard/Charts';
import { ErrorBox, Loading } from '@/components/dashboard/DataState';
import PageHeader from '@/components/dashboard/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import { formatMoney } from '@/lib/format';
import { useApi } from '@/lib/use-api';

export default function AdminOverview() {
  const { data, loading, error, reload } = useApi('/api/stats/admin');

  return (
    <>
      <PageHeader
        title="Overview"
        subtitle="Everything happening on FixMate."
      />

      {loading && <Loading />}
      {error && <ErrorBox message={error} onRetry={reload} />}

      {data && (
        <>
          <div className="stats-grid">
            <StatCard
              icon={Users}
              label="Total Users"
              value={data.totalUsers}
            />
            <StatCard
              icon={UserRoundCog}
              label="Total Technicians"
              value={data.totalTechnicians}
            />
            <StatCard
              icon={BadgeCheck}
              label="Pending Services"
              value={data.pendingServices}
            />
            <StatCard
              icon={Wallet}
              label="Total Revenue"
              value={formatMoney(data.totalRevenue)}
            />
          </div>

          <div className="two-col">
            <div className="card panel">
              <h2 className="panel-title">All jobs by status</h2>
              <StatusBars data={data.byStatus} />
            </div>
            <div className="card panel">
              <h2 className="panel-title">Revenue, last 6 months</h2>
              <RevenueBars data={data.monthlyRevenue} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
