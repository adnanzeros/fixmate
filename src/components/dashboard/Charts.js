// fixmath/src/components/dashboard/Charts.js
const ORDER = [
  'requested',
  'accepted',
  'in-progress',
  'completed',
  'rejected',
  'cancelled',
];
const LABELS = {
  requested: 'Requested',
  accepted: 'Accepted',
  'in-progress': 'In Progress',
  completed: 'Completed',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
};
const COLORS = {
  requested: '#3b82f6',
  accepted: '#6366f1',
  'in-progress': '#f59e0b',
  completed: '#10b981',
  rejected: '#ef4444',
  cancelled: '#9ca3af',
};

/** Horizontal bars: number of jobs per status. data = [{ status, count }] */
export function StatusBars({ data = [] }) {
  const counts = Object.fromEntries(data.map(d => [d.status, d.count]));
  const max = Math.max(1, ...ORDER.map(s => counts[s] ?? 0));

  return (
    <div className="bars">
      {ORDER.map(status => (
        <div key={status} className="bar-row">
          <span>{LABELS[status]}</span>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{
                width: `${((counts[status] ?? 0) / max) * 100}%`,
                background: COLORS[status],
              }}
            />
          </div>
          <strong>{counts[status] ?? 0}</strong>
        </div>
      ))}
    </div>
  );
}

/** Column chart: revenue per month. data = [{ month: '2026-11', revenue }] */
export function RevenueBars({ data = [] }) {
  if (data.length === 0) {
    return <p className="chart-empty">No payments yet. Revenue will appear here.</p>;
  }
  const max = Math.max(1, ...data.map(d => d.revenue));

  return (
    <div className="rev">
      {data.map(d => (
        <div key={d.month} className="rev-col">
          <span>${Math.round(d.revenue)}</span>
          <div
            className="rev-bar"
            style={{ height: `${Math.max(6, (d.revenue / max) * 100)}%` }}
          />
          <span>
            {new Date(`${d.month}-01T00:00:00`).toLocaleString('en-US', {
              month: 'short',
            })}
          </span>
        </div>
      ))}
    </div>
  );
}