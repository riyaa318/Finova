import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useBucketLabels } from '../../hooks/useBucketLabels';
import { useFormatters } from '../../hooks/useFormatters';
import ChartTooltip from './ChartTooltip';

export const INCOME_COLOR = 'rgb(var(--chart-1))';
export const EXPENSE_COLOR = 'rgb(var(--chart-3))';

/** Grouped income vs expense bars for any bucket size (months on the dashboard, days/weeks/months in analytics). */
export default function IncomeExpenseChart({ data, height = 280, grow = false }) {
  const { compact, money } = useFormatters();
  const labelled = useBucketLabels(data);
  const summary = `Income versus expenses across ${labelled.length} periods.`;
  return (
    <div role="img" aria-label={summary} className={grow ? 'flex-1' : ''} style={grow ? { minHeight: height } : { height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={labelled} margin={{ top: 6, right: 4, left: 0, bottom: 0 }} barGap={4} barCategoryGap="22%">
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={10} minTickGap={12} />
          <YAxis tickLine={false} axisLine={false} width={54} tickFormatter={compact} tickCount={5} />
          <Tooltip cursor={{ fill: 'rgb(var(--raised) / 0.7)' }} content={<ChartTooltip formatValue={(v) => money(v)} formatLabel={(p) => p.fullLabel} />} />
          <Bar dataKey="income" name="Income" fill={INCOME_COLOR} radius={[4, 4, 0, 0]} maxBarSize={26} isAnimationActive={false} />
          <Bar dataKey="expenses" name="Expenses" fill={EXPENSE_COLOR} radius={[4, 4, 0, 0]} maxBarSize={26} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
