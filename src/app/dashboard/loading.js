
export default function DashboardLoading() {
  return (
    <div className="dash-loading" aria-busy="true">
      <div className="skeleton" style={{ height: 40, width: 260 }} />
      <div className="stats-grid" style={{ marginTop: 12 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="skeleton" style={{ height: 96 }} />
        ))}
      </div>
      <div className="skeleton" style={{ height: 240 }} />
    </div>
  );
}
