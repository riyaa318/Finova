import { useState } from 'react';
import { PiggyBank, Percent, TrendingDown, TrendingUp } from 'lucide-react';
import RangeSelector from '../components/analytics/RangeSelector';
import HealthScore from '../components/analytics/HealthScore';
import TopCategories from '../components/analytics/TopCategories';
import ChartCard from '../components/cards/ChartCard';
import StatCard from '../components/cards/StatCard';
import CategoryDonut from '../components/charts/CategoryDonut';
import ChartLegend from '../components/charts/ChartLegend';
import IncomeExpenseChart, { EXPENSE_COLOR, INCOME_COLOR } from '../components/charts/IncomeExpenseChart';
import { IncomeBarChart, SavingsRateChart, SpendingAreaChart } from '../components/charts/TimeSeriesCharts';
import PageHeader from '../components/layout/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import { ChartSkeleton, StatGridSkeleton } from '../components/ui/LoadingState';
import { useFinance } from '../hooks/useContexts';
import { useAsyncData } from '../hooks/useAsync';
import { useFormatters } from '../hooks/useFormatters';
import { getAnalytics } from '../services/financeService';
import { formatPercent } from '../utils/format';

const asPercent = (n) => `${n}%`;

function AnalyticsSkeleton() {
  return (
    <>
      <StatGridSkeleton />
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <ChartSkeleton className="lg:col-span-2" />
        <ChartSkeleton />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ChartSkeleton height={220} />
        <ChartSkeleton height={220} />
      </div>
    </>
  );
}

export default function AnalyticsPage() {
  const [range, setRange] = useState('6m');
  const { transactions, budgets, goals } = useFinance();
  const { money } = useFormatters();
  // Re-fetch whenever the underlying data changes so analytics never disagree with the dashboard.
  const { data, status, loading, error, retry } = useAsyncData(() => getAnalytics(range), [range, transactions, budgets, goals]);

  const period = data ? `vs previous ${data.caption.replace('last ', '')}` : '';
  const hasActivity = data && (data.totals.income > 0 || data.totals.expenses > 0);
  const monthly = data?.buckets.some((b) => b.granularity === 'month');

  return (
    <div className="page-container">
      <PageHeader title="Analytics" description="Understand where your money comes from and where it goes." actions={<RangeSelector value={range} onChange={setRange} />} />

      {status === 'error' && !data && <ErrorState message={error} onRetry={retry} />}
      {status === 'loading' && !data && <AnalyticsSkeleton />}
      {data && (
        <div aria-busy={loading} className={loading ? 'opacity-70 transition-opacity' : 'transition-opacity'}>
          {status === 'error' && (
            <div className="mb-4">
              <ErrorState title="Could not refresh analytics" message={error} onRetry={retry} />
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 xl:grid-cols-4">
            <StatCard index={0} label="Income" icon={TrendingUp} value={data.totals.income} format={money} change={data.changes.income} comparisonLabel={period} sparkColor="chart2" />
            <StatCard index={1} label="Expenses" icon={TrendingDown} value={data.totals.expenses} format={money} change={data.changes.expenses} positiveIsGood={false} comparisonLabel={period} />
            <StatCard index={2} label="Net savings" icon={PiggyBank} value={data.totals.savings} format={money} change={data.changes.savings} comparisonLabel={period} />
            <StatCard
              index={3}
              label="Savings rate"
              icon={Percent}
              value={Math.round(data.totals.savingsRate)}
              format={asPercent}
              change={data.changes.savingsRate}
              comparisonLabel={`points ${period}`}
              footer={data.totals.savingsRate >= 20 ? 'At or above the 20% guideline' : 'Below the 20% guideline'}
            />
          </div>

          {!hasActivity ? (
            <div className="card mt-4">
              <EmptyState title="No activity in this range" description={`Nothing was recorded in the ${data.caption}. Try a longer range.`} />
            </div>
          ) : (
            <>
              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                <ChartCard className="lg:col-span-2" title="Spending overview" description={`Expenses, ${data.caption}`} updateKey={range}>
                  <SpendingAreaChart data={data.buckets} dataKey="expenses" name="Expenses" height={270} summary={`Expenses over the ${data.caption}`} />
                </ChartCard>
                <ChartCard title="Category breakdown" description={`Share of spending, ${data.caption}`} reveal="scale" index={1} updateKey={range}>
                  {data.categories.length ? <CategoryDonut data={data.categories} /> : <EmptyState title="No expenses" className="py-10" />}
                </ChartCard>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <ChartCard title="Income overview" description={`Money received, ${data.caption}`} updateKey={range}>
                  <IncomeBarChart data={data.buckets} />
                </ChartCard>
                <ChartCard
                  title="Savings rate"
                  description="Share of income kept, dashed line marks the 20% guideline"
                  index={1}
                  updateKey={range}
                >
                  <SavingsRateChart data={data.buckets} />
                </ChartCard>
              </div>

              <div className="mt-4">
                <ChartCard
                  title={monthly ? 'Monthly comparison' : 'Income vs expenses'}
                  description={`How earning compares with spending, ${data.caption}`}
                  legend={<ChartLegend items={[{ label: 'Income', color: INCOME_COLOR }, { label: 'Expenses', color: EXPENSE_COLOR }]} />}
                  updateKey={range}
                >
                  <IncomeExpenseChart data={data.buckets} height={260} />
                </ChartCard>
              </div>
            </>
          )}

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <TopCategories categories={data.topCategories} caption={data.caption} />
            <HealthScore health={data.health} />
          </div>
          <p className="mt-4 text-caption text-subtle">
            {data.health.goalProgress != null && `Your goals are ${formatPercent(data.health.goalProgress, { digits: 0 })} complete on average. `}
            Pending and failed transactions are excluded from every figure on this page.
          </p>
        </div>
      )}
    </div>
  );
}
