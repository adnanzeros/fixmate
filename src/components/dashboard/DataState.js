// fixmath/src/components/dashboard/DataState.js
export function Loading() {
  return (
    <div className="dash-loading" aria-busy="true">
      {[0, 1, 2, 3].map(i => (
        <div key={i} className="skeleton" style={{ height: 56 }} />
      ))}
    </div>
  );
}

export function ErrorBox({ message, onRetry }) {
  return (
    <div className="error-box" role="alert">
      <p>{message || 'Could not load data.'}</p>
      {onRetry && (
        <button className="btn btn-outline btn-sm" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
