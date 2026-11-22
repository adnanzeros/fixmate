// src/lib/use-api.js
'use client';

import { useCallback, useEffect, useState } from 'react';
import { authFetch } from './auth-fetch';

/**
 * Loads data from a protected Express API (token is attached automatically).
 * Changing `path` loads again, so filters can simply change the query string.
 */
export function useApi(path) {
  const [state, setState] = useState({ key: '', data: null, error: '' });
  const [version, setVersion] = useState(0);

  const key = `${path}#${version}`;

  useEffect(() => {
    let cancelled = false;
    authFetch(path)
      .then(data => !cancelled && setState({ key, data, error: '' }))
      .catch(
        err =>
          // keep the last data on screen when a reload fails
          !cancelled &&
          setState(prev => ({ key, data: prev.data, error: err.message })),
      );
    return () => {
      cancelled = true;
    };
  }, [path, key]);

  const reload = useCallback(async () => setVersion(v => v + 1), []);

  // lets pages update the list locally (toggle, delete, role change) without a reload
  const setData = useCallback(
    next =>
      setState(prev => ({
        ...prev,
        data: typeof next === 'function' ? next(prev.data) : next,
      })),
    [],
  );

  return {
    data: state.data,
    loading: state.key !== key,
    error: state.key === key ? state.error : '',
    reload,
    setData,
  };
}
