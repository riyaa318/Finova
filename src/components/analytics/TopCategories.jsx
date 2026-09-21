import { useRef } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useFormatters } from '../../hooks/useFormatters';
import { useReveal } from '../../motion/hooks';
import { formatPercent } from '../../utils/format';
import Badge from '../ui/Badge';
import CategoryIcon from '../ui/CategoryIcon';
import EmptyState from '../ui/EmptyState';
import ProgressBar from '../ui/ProgressBar';

/** Biggest expense categories in the selected range, with the change against the previous range. */
export default function TopCategories({ categories, caption, className = '' }) {
  const ref = useRef(null);
  const { money } = useFormatters();
  useReveal(ref);
  const max = categories[0]?.value ?? 0;

  return (
    <section ref={ref} className={`card p-5 ${className}`}>
      <h2 className="text-h3 text-ink">Top spending categories</h2>
      <p className="mt-0.5 text-small text-muted">Where most of your money went, {caption}</p>
      {categories.length ? (
        <ol className="mt-5 space-y-4">
          {categories.map((c) => {
            const rising = c.change != null && c.change > 0.5;
            const falling = c.change != null && c.change < -0.5;
            return (
              <li key={c.name}>
                <div className="flex items-center gap-3">
                  <CategoryIcon category={c.name} size={34} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-small font-semibold text-ink">{c.name}</span>
                      <span className="text-small font-semibold tabular-nums text-ink">{money(c.value)}</span>
                    </div>
                    <ProgressBar value={max ? (c.value / max) * 100 : 0} label={`${c.name} share of top spending`} size="h-1.5" className="mt-1.5" />
                  </div>
                </div>
                <p className="ml-[46px] mt-1.5 flex items-center gap-2 text-caption text-muted">
                  <span className="tabular-nums">{formatPercent(c.share, { digits: 0 })} of spending</span>
                  {c.change != null && (rising || falling) ? (
                    <Badge tone={rising ? 'warning' : 'success'} icon={rising ? TrendingUp : TrendingDown}>
                      {formatPercent(c.change, { sign: true, digits: 0 })} vs previous
                    </Badge>
                  ) : (
                    <span>{c.change == null ? 'New this period' : 'About the same as before'}</span>
                  )}
                </p>
              </li>
            );
          })}
        </ol>
      ) : (
        <EmptyState title="No spending in this range" description="Pick a longer range to see more." className="py-10" />
      )}
    </section>
  );
}
