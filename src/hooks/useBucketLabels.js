import { useMemo } from 'react';
import { useFormatters } from './useFormatters';

/** Adds axis (`label`) and tooltip (`fullLabel`) text to time-bucketed chart data. */
export function useBucketLabels(buckets = []) {
  const { date } = useFormatters();
  return useMemo(
    () =>
      buckets.map((b) => {
        if (b.granularity === 'month') return { ...b, label: date.month(b.date), fullLabel: date.monthYear(b.date) };
        if (b.granularity === 'week') return { ...b, label: date.short(b.date), fullLabel: `Week of ${date.short(b.date)}` };
        return { ...b, label: date.short(b.date), fullLabel: date.medium(b.date) };
      }),
    [buckets, date],
  );
}
