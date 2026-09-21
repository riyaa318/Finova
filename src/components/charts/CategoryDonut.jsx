import { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from 'recharts';
import { useFormatters } from '../../hooks/useFormatters';
import { CATEGORY_META } from '../../utils/constants';
import { chartColor, formatPercent } from '../../utils/format';

const colorOf = (name) => chartColor(CATEGORY_META[name]?.chart ?? 8);
const growSector = (props) => <Sector {...props} outerRadius={props.outerRadius + 6} />;

/** Donut with a live centre readout, plus a legend list that highlights the matching slice on hover/focus. */
export default function CategoryDonut({ data, height = 220, limit = 6, centerLabel = 'Total spent' }) {
  const { money } = useFormatters();
  const [active, setActive] = useState(null);

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const top = data.slice(0, limit);
  const rest = data.slice(limit);
  const items = rest.length ? [...top, { name: 'Other', value: rest.reduce((s, d) => s + d.value, 0), share: rest.reduce((s, d) => s + d.share, 0) }] : top;
  const focused = active != null ? items[active] : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="relative mx-auto w-full max-w-[210px] shrink-0" style={{ height }} role="img" aria-label={`Spending by category, total ${money(total)}`}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={items}
              dataKey="value"
              nameKey="name"
              innerRadius="66%"
              outerRadius="92%"
              paddingAngle={2}
              stroke="none"
              isAnimationActive={false}
              activeIndex={active ?? undefined}
              activeShape={growSector}
              onMouseEnter={(_, index) => setActive(index)}
              onMouseLeave={() => setActive(null)}
            >
              {items.map((item) => (
                <Cell key={item.name} fill={item.name === 'Other' ? chartColor(8) : colorOf(item.name)} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-caption font-medium text-muted">{focused ? focused.name : centerLabel}</span>
          <span className="text-h3 tabular-nums text-ink">{money(focused ? focused.value : total)}</span>
          {focused && <span className="text-caption tabular-nums text-muted">{formatPercent(focused.share, { digits: 0 })} of spending</span>}
        </div>
      </div>

      <ul className="min-w-0 flex-1 space-y-1" aria-label="Category breakdown">
        {items.map((item, index) => (
          <li key={item.name}>
            <button
              type="button"
              onMouseEnter={() => setActive(index)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(index)}
              onBlur={() => setActive(null)}
              className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors ${active === index ? 'bg-raised' : ''}`}
            >
              <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ backgroundColor: item.name === 'Other' ? chartColor(8) : colorOf(item.name) }} />
              <span className="min-w-0 flex-1 truncate text-small font-medium text-ink">{item.name}</span>
              <span className="text-small tabular-nums text-muted">{formatPercent(item.share, { digits: 0 })}</span>
              <span className="min-w-[4.5rem] text-right text-small font-semibold tabular-nums text-ink">{money(item.value)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
