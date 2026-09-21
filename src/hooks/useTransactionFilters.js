import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EMPTY_FILTERS } from '../utils/transactions';

const DEFAULTS = EMPTY_FILTERS;

/** Transaction filters live in the URL (?q=&category=&page=...) so views are shareable and survive refresh. */
export function useTransactionFilters() {
  const [params, setParams] = useSearchParams();

  const filters = useMemo(
    () => ({
      q: params.get('q') ?? '',
      category: params.get('category') ?? '',
      type: params.get('type') ?? '',
      method: params.get('method') ?? '',
      range: params.get('range') ?? 'all',
      from: params.get('from') ?? '',
      to: params.get('to') ?? '',
      sort: params.get('sort') ?? 'newest',
    }),
    [params],
  );
  const page = Math.max(1, Number(params.get('page')) || 1);

  const update = useCallback(
    (patch, { keepPage = false } = {}) =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          const merged = { ...patch };
          if (merged.range && merged.range !== 'custom') Object.assign(merged, { from: '', to: '' });
          Object.entries(merged).forEach(([key, value]) => {
            if (value === '' || value == null || value === DEFAULTS[key] || (key === 'page' && Number(value) === 1)) next.delete(key);
            else next.set(key, String(value));
          });
          if (!keepPage) next.delete('page');
          return next;
        },
        { replace: true },
      ),
    [setParams],
  );

  const setPage = useCallback((value) => update({ page: value }, { keepPage: true }), [update]);
  const clear = useCallback(() => setParams({}, { replace: true }), [setParams]);

  return { filters, page, setFilters: update, setPage, clear };
}
