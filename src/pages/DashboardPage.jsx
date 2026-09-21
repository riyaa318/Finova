import {
  Database,
  PiggyBank,
  Plus,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import PageHeader from "../components/layout/PageHeader";
import StatCard from "../components/cards/StatCard";
import ChartCard from "../components/cards/ChartCard";
import ChartLegend from "../components/charts/ChartLegend";
import CategoryDonut from "../components/charts/CategoryDonut";
import IncomeExpenseChart, {
  EXPENSE_COLOR,
  INCOME_COLOR,
} from "../components/charts/IncomeExpenseChart";
import { SpendingAreaChart } from "../components/charts/TimeSeriesCharts";
import BudgetOverview from "../components/dashboard/BudgetOverview";
import GoalsOverview from "../components/dashboard/GoalsOverview";
import QuickActions from "../components/dashboard/QuickActions";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import {
  CardGridSkeleton,
  ChartSkeleton,
  ListSkeleton,
  StatGridSkeleton,
} from "../components/ui/LoadingState";
import { useAuth, useFinance, useUI } from "../hooks/useContexts";
import { useFormatters } from "../hooks/useFormatters";
import { greetingFor } from "../utils/format";

const PERIOD = "vs previous 30 days";

function DashboardSkeleton() {
  return (
    <>
      <StatGridSkeleton />
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <ChartSkeleton className="lg:col-span-2" />
        <ChartSkeleton />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <ListSkeleton rows={6} className="lg:col-span-2" />
        <ListSkeleton rows={5} />
      </div>
      <div className="mt-4">
        <CardGridSkeleton />
      </div>
    </>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { status, stats, transactions, budgets, goals, reload, resetData } =
    useFinance();
  const { openTransactionModal } = useUI();
  const { money, date } = useFormatters();
  const firstName = user.name.trim().split(/\s+/)[0];

  return (
    <div className="page-container">
      <PageHeader
        title={`${greetingFor()}, ${firstName}`}
        description="Here's your financial overview."
        meta={`${date.weekdayDay(new Date())}. Figures compare the last 30 days with the 30 days before.`}
      />

      {status === "loading" && <DashboardSkeleton />}
      {status === "error" && <ErrorState onRetry={reload} />}
      {status === "ready" && stats && (
        <>
          <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 xl:grid-cols-4">
            <StatCard
              index={0}
              featured
              label="Total balance"
              icon={Wallet}
              value={stats.totalBalance}
              format={money}
              change={stats.balance.change}
              comparisonLabel={PERIOD}
              sparkline={stats.sparklines.balance}
              footer={`${money(Math.max(0, stats.availableBalance))} available after goals`}
            />
            <StatCard
              index={1}
              label="Monthly income"
              icon={TrendingUp}
              value={stats.income.value}
              format={money}
              change={stats.income.change}
              comparisonLabel={PERIOD}
              sparkline={stats.sparklines.income}
              sparkColor="chart2"
            />
            <StatCard
              index={2}
              label="Monthly expenses"
              icon={TrendingDown}
              value={stats.expenses.value}
              format={money}
              change={stats.expenses.change}
              positiveIsGood={false}
              comparisonLabel={PERIOD}
              sparkline={stats.sparklines.expenses}
              sparkColor="chart3"
            />
            <StatCard
              index={3}
              label="Savings"
              icon={PiggyBank}
              value={stats.savings.value}
              format={money}
              change={stats.savings.change}
              comparisonLabel={PERIOD}
              sparkline={stats.sparklines.savings}
              sparkColor="chart5"
              footer={`Savings rate ${Math.round(stats.savingsRate)}% of income`}
            />
          </div>

          {transactions.length === 0 && (
            <div className="card mt-4">
              <EmptyState
                icon={Database}
                title="Your dashboard is empty"
                description="Add your first transaction to start seeing charts, or load the sample dataset to explore how everything works."
                action={
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button icon={Plus} onClick={() => openTransactionModal()}>
                      Add a transaction
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => resetData("reset")}
                    >
                      Load sample data
                    </Button>
                  </div>
                }
              />
            </div>
          )}

          {transactions.length > 0 && (
            <>
              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                <ChartCard
                  className="lg:col-span-2"
                  index={0}
                  title="Income vs expenses"
                  description="Last 6 months"
                  bodyClassName="flex flex-col"
                  legend={
                    <ChartLegend
                      items={[
                        { label: "Income", color: INCOME_COLOR },
                        { label: "Expenses", color: EXPENSE_COLOR },
                      ]}
                    />
                  }
                >
                  <IncomeExpenseChart
                    data={stats.charts.incomeVsExpense}
                    grow
                  />
                </ChartCard>
                <ChartCard
                  title="Spending by category"
                  description="Last 30 days"
                  reveal="scale"
                  index={1}
                >
                  {stats.charts.categories.length ? (
                    <CategoryDonut data={stats.charts.categories} />
                  ) : (
                    <EmptyState
                      title="No spending yet"
                      description="Expenses from the last 30 days will appear here."
                      className="py-10"
                    />
                  )}
                </ChartCard>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                <ChartCard
                  className="lg:col-span-2"
                  title="Spending trend"
                  description="Daily spending, last 30 days"
                  bodyClassName="flex flex-col"
                  legend={
                    <ChartLegend
                      items={[
                        {
                          label: "Daily spending",
                          color: "rgb(var(--chart-3))",
                        },
                        {
                          label: "7-day average",
                          color: "rgb(var(--chart-2))",
                          shape: "dashed",
                        },
                      ]}
                    />
                  }
                >
                  <SpendingAreaChart
                    data={stats.charts.spendingTrend}
                    averageKey="average"
                    height={260}
                    grow
                    summary="Daily spending over the last 30 days with a 7-day average"
                  />
                </ChartCard>
                <QuickActions />
              </div>
            </>
          )}

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <RecentTransactions
              transactions={transactions}
              className="lg:col-span-2"
            />
            <BudgetOverview budgets={budgets} />
          </div>

          <div className="mt-4">
            <GoalsOverview goals={goals} />
          </div>
        </>
      )}
    </div>
  );
}
