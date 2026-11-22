
export function safeRedirect(path) {
  if (!path) return null;
  if (!path.startsWith('/') || path.startsWith('//')) return null;
  return path;
}

export function formatPrice(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Today as YYYY-MM-DD in the user's local time (for date input min) */
export function todayString() {
  return new Date().toLocaleDateString('en-CA');
}
