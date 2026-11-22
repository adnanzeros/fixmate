// lib/auth-fetch.js
'use client';

import { API_URL } from './api';
import { authClient } from './auth-client';

/**
 * Calls a protected Express API with the BetterAuth JWT in the Authorization header.
 * Throws an Error with the server's message when the request fails.
 */
export async function authFetch(path, options = {}) {
  const { data } = await authClient.token();
  const token = data?.token;

  if (!token)
    throw new Error('Your session has expired. Please sign in again.');

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.message || 'Something went wrong. Please try again.');
  }
  return body;
}
