import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Runs an async loader whenever `deps` change and keeps the previous data on screen
 * while the next request is in flight (no flash of skeletons when a filter changes).
 */
export function useAsyncData(loader, deps) {
  const [state, setState] = useState({ data: null, status: 'loading', error: null });
  const loaderRef = useRef(loader);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    loaderRef.current = loader;
  });

  useEffect(() => {
    let active = true;
    loaderRef
      .current()
      .then((data) => active && setState({ data, status: 'ready', error: null }))
      .catch((error) => active && setState((prev) => ({ ...prev, status: 'error', error: error.message })));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const retry = useCallback(() => {
    setState((prev) => ({ ...prev, status: 'loading', error: null }));
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, loading: state.status === 'loading', retry };
}
