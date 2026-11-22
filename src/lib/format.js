// fixmath/src/lib/format.js
export function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatMoney(amount) {
  return `$${Number(amount ?? 0).toFixed(2)}`;
}
