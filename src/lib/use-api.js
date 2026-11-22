// fixmath/src/lib/use-api.js
'use client';

import { useCallback, useEffect, useState } from 'react';
import { authFetch } from './auth-fetch';

/**
 * Loads data from a protected Express API (token is attached automatically).
 * Changing `path` loads again, so filters can simply change the query string.
 */
export function useApi(path) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await authFetch(path));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load, setData };
}
