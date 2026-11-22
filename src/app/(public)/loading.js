
export default function Loading() {
  return (
    <div
      className="container"
      style={{ padding: '48px 20px 72px' }}
      aria-busy="true"
    >
      <div className="skeleton sk-title" />
      <div className="skeleton sk-line" />
      <div className="service-grid service-grid-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton sk-card" />
        ))}
      </div>
    </div>
  );
}
