// lib/api.js
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

const EMPTY = { services: [], total: 0, page: 1, totalPages: 1 };

/**
 * GET /api/services?search=&category=&mode=&sort=&page=&limit=
 * All searching / filtering / sorting happens on the Express + MongoDB side.
 * Expected response: { services: [], total, page, totalPages }
 */
export async function getServices(query = {}) {
  const qs = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '')
      qs.set(key, String(value));
  });

  try {
    const res = await fetch(`${API_URL}/api/services?${qs.toString()}`, {
      cache: 'no-store',
    });
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
    const res = await fetch(
      `${API_URL}/api/services/${encodeURIComponent(id)}`,
      {
        cache: 'no-store',
      },
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
