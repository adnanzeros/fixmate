
export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
).replace(/\/+$/, '');

const EMPTY = { services: [], total: 0, page: 1, totalPages: 1 };


async function fetchWithRetry(url, tries = 2) {
  let lastError;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, {
        cache: 'no-store',
        signal: AbortSignal.timeout(25000),
      });
      if (res.status < 500) return res; // 2xx / 4xx are real answers
      lastError = new Error(`Server returned ${res.status}`);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}


export async function getServices(query = {}) {
  const qs = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '')
      qs.set(key, String(value));
  });

  try {
    const res = await fetchWithRetry(
      `${API_URL}/api/services?${qs.toString()}`,
    );
    if (!res.ok) return EMPTY;
    return await res.json();
  } catch {
    return EMPTY;
  }
}

/**
 * GET /api/services/:id  (server returns 404 if not approved / not available)
 * The response should include `technician: { name, image, area, bio }`.
 */
export async function getService(id) {
  try {
    const res = await fetchWithRetry(
      `${API_URL}/api/services/${encodeURIComponent(id)}`,
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
