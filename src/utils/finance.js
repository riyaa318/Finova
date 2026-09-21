/**
 * Pure finance calculations. No storage, no React - everything is derived from
 * plain arrays so it is trivial to test and to move behind a real API later.
 */
import { ANALYTICS_RANGES, BUDGET_WARNING_RATIO } from './constants';
import { diffInDays, monthKey, parseISODate, shiftISO, startOfMonth, toISODate } from './dates';

const ROLLING_DAYS = 30;
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const sum = (list, fn) => list.reduce((acc, item) => acc + fn(item), 0);

/** Failed transactions never move money, so they are excluded from every total. */
export const isCounted = (t) => t.status !== 'failed';
export const signedAmount = (t) => (t.type === 'income' ? t.amount : -t.amount);
export const percentChange = (current, previous) => (previous === 0 ? null : ((current - previous) / Math.abs(previous)) * 100);

export function totalsBetween(transactions, from, to) {
  let income = 0;
  let expenses = 0;
  for (const t of transactions) {
    if (!isCounted(t) || t.date < from || t.date > to) continue;
    if (t.type === 'income') income += t.amount;
    else expenses += t.amount;
  }
  return { income, expenses, savings: income - expenses };
}

export function rollingWindows(today, days = ROLLING_DAYS) {
  const currentFrom = shiftISO(today, -(days - 1));
  const previousTo = shiftISO(currentFrom, -1);
  return {
    current: [currentFrom, today],
    previous: [shiftISO(previousTo, -(days - 1)), previousTo],
  };
}

export function categoryBreakdown(transactions, from, to, type = 'expense') {
  const totals = new Map();
  for (const t of transactions) {
    if (!isCounted(t) || t.type !== type || t.date < from || t.date > to) continue;
    totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount);
  }
  const total = [...totals.values()].reduce((a, b) => a + b, 0);
  return [...totals]
    .map(([name, value]) => ({ name, value, share: total ? (value / total) * 100 : 0 }))
    .sort((a, b) => b.value - a.value);
}

export function bucketByDays(transactions, endISO, count, size) {
  return Array.from({ length: count }, (_, i) => {
    const to = shiftISO(endISO, -(count - 1 - i) * size);
    const from = shiftISO(to, -(size - 1));
    return { from, to, date: from, ...totalsBetween(transactions, from, to) };
  });
}

export function monthlySeries(transactions, today, count) {
  const now = parseISODate(today);
  return Array.from({ length: count }, (_, i) => {
    const first = startOfMonth(now, -(count - 1 - i));
    const last = new Date(first.getFullYear(), first.getMonth() + 1, 0);
    const from = toISODate(first);
    const to = i === count - 1 ? today : toISODate(last);
    return { key: monthKey(first), from, to, date: from, granularity: 'month', ...totalsBetween(transactions, from, to) };
  });
}

export function dailySpending(transactions, today, days = ROLLING_DAYS) {
  const series = bucketByDays(transactions, today, days, 1).map((b) => ({
    key: b.from,
    date: b.from,
    granularity: 'day',
    amount: b.expenses,
    income: b.income,
  }));
  return series.map((point, i) => {
    const window = series.slice(Math.max(0, i - 6), i + 1);
    return { ...point, average: Math.round(sum(window, (p) => p.amount) / window.length) };
  });
}

export function computeBudgetUsage(budgets, transactions, today) {
  const [from, to] = rollingWindows(today).current;
  const spentBy = {};
  for (const t of transactions) {
    if (!isCounted(t) || t.type !== 'expense' || t.date < from || t.date > to) continue;
    spentBy[t.category] = (spentBy[t.category] ?? 0) + t.amount;
  }
  return budgets.map((budget) => {
    const spent = spentBy[budget.category] ?? 0;
    const ratio = budget.limit > 0 ? spent / budget.limit : 0;
    const status = ratio >= 1 ? 'exceeded' : ratio >= BUDGET_WARNING_RATIO ? 'warning' : 'healthy';
    return { ...budget, spent, remaining: budget.limit - spent, percent: ratio * 100, status };
  });
}

export function computeGoalProgress(goal, today) {
  const percent = goal.targetAmount > 0 ? clamp((goal.currentAmount / goal.targetAmount) * 100, 0, 100) : 0;
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
  const daysLeft = diffInDays(parseISODate(today), parseISODate(goal.deadline));
  const status = remaining === 0 ? 'achieved' : daysLeft < 0 ? 'overdue' : 'active';
  const monthsLeft = Math.max(1, Math.ceil(daysLeft / 30));
  return {
    ...goal,
    percent,
    remaining,
    daysLeft,
    status,
    suggestedMonthly: status === 'active' ? Math.ceil(remaining / monthsLeft) : 0,
  };
}

export const currentBalance = (openingBalance, transactions) =>
  openingBalance + sum(transactions.filter(isCounted), signedAmount);

export function computeDashboardStats({ transactions, goals, openingBalance, today }) {
  const { current, previous } = rollingWindows(today);
  const cur = totalsBetween(transactions, ...current);
  const prev = totalsBetween(transactions, ...previous);
  const totalBalance = currentBalance(openingBalance, transactions);
  const balanceThen = totalBalance - cur.savings;
  const allocated = sum(goals, (g) => g.currentAmount);

  const weekly = bucketByDays(transactions, today, 8, 7);
  const balances = [];
  let running = totalBalance;
  for (let i = weekly.length - 1; i >= 0; i -= 1) {
    balances.unshift(running);
    running -= weekly[i].savings;
  }
  const line = (values) => values.map((value) => ({ value }));

  const metric = (value, previousValue) => ({ value, previous: previousValue, change: percentChange(value, previousValue) });

  return {
    asOf: today,
    totalBalance,
    availableBalance: totalBalance - allocated,
    allocatedToGoals: allocated,
    balance: metric(totalBalance, balanceThen),
    income: metric(cur.income, prev.income),
    expenses: metric(cur.expenses, prev.expenses),
    savings: metric(cur.savings, prev.savings),
    savingsRate: cur.income ? (cur.savings / cur.income) * 100 : 0,
    sparklines: {
      balance: line(balances),
      income: line(weekly.map((w) => w.income)),
      expenses: line(weekly.map((w) => w.expenses)),
      savings: line(weekly.map((w) => w.savings)),
    },
    charts: {
      incomeVsExpense: monthlySeries(transactions, today, 6),
      categories: categoryBreakdown(transactions, ...current),
      spendingTrend: dailySpending(transactions, today),
    },
  };
}

function rangeWindows(cfg, today) {
  if (cfg.bucket === 'month') {
    const now = parseISODate(today);
    const from = toISODate(startOfMonth(now, -(cfg.months - 1)));
    const previousTo = shiftISO(from, -1);
    const previousFrom = toISODate(startOfMonth(parseISODate(from), -cfg.months));
    return { current: [from, today], previous: [previousFrom, previousTo] };
  }
  return rollingWindows(today, cfg.days);
}

function rangeBuckets(transactions, cfg, today) {
  if (cfg.bucket === 'month') return monthlySeries(transactions, today, cfg.months);
  if (cfg.bucket === 'week') {
    return bucketByDays(transactions, today, Math.ceil(cfg.days / 7), 7).map((b) => ({ ...b, key: b.from, granularity: 'week' }));
  }
  return bucketByDays(transactions, today, cfg.days, 1).map((b) => ({ ...b, key: b.from, granularity: 'day' }));
}

const statusFor = (value, good, fair, higherIsBetter = true) => {
  if (value == null) return 'fair';
  if (higherIsBetter) return value >= good ? 'good' : value >= fair ? 'fair' : 'poor';
  return value <= good ? 'good' : value <= fair ? 'fair' : 'poor';
};

export function computeAnalytics({ transactions, budgets, goals, openingBalance, range, today }) {
  const cfg = ANALYTICS_RANGES.find((r) => r.value === range) ?? ANALYTICS_RANGES[1];
  const windows = rangeWindows(cfg, today);
  const [from, to] = windows.current;

  const buckets = rangeBuckets(transactions, cfg, today).map((b) => ({
    ...b,
    savingsRate: b.income ? clamp((b.savings / b.income) * 100, -100, 100) : 0,
  }));

  const totals = totalsBetween(transactions, from, to);
  const previous = totalsBetween(transactions, ...windows.previous);
  const savingsRate = totals.income ? (totals.savings / totals.income) * 100 : 0;
  const previousRate = previous.income ? (previous.savings / previous.income) * 100 : 0;

  const categories = categoryBreakdown(transactions, from, to);
  const previousCategories = new Map(categoryBreakdown(transactions, ...windows.previous).map((c) => [c.name, c.value]));
  const topCategories = categories.slice(0, 5).map((c) => ({
    ...c,
    previous: previousCategories.get(c.name) ?? 0,
    change: percentChange(c.value, previousCategories.get(c.name) ?? 0),
  }));

  const spanDays = diffInDays(parseISODate(from), parseISODate(to)) + 1;
  const avgMonthlyExpenses = totals.expenses / Math.max(spanDays / 30, 1);
  const balance = currentBalance(openingBalance, transactions);
  const runwayMonths = avgMonthlyExpenses > 0 ? balance / avgMonthlyExpenses : null;
  const usage = computeBudgetUsage(budgets, transactions, today);
  const adherence = usage.length ? (usage.filter((u) => u.status !== 'exceeded').length / usage.length) * 100 : null;
  const spendRatio = totals.income ? (totals.expenses / totals.income) * 100 : totals.expenses ? 100 : 0;

  const indicators = [
    {
      id: 'savings-rate',
      label: 'Savings rate',
      value: savingsRate,
      unit: 'percent',
      target: '20% or more',
      status: statusFor(savingsRate, 20, 10),
      score: clamp((savingsRate / 25) * 100, 0, 100),
    },
    {
      id: 'spend-ratio',
      label: 'Spending vs income',
      value: spendRatio,
      unit: 'percent',
      target: 'Below 80%',
      status: statusFor(spendRatio, 80, 95, false),
      score: clamp(100 - (spendRatio - 60) * 2, 0, 100),
    },
    {
      id: 'budgets',
      label: 'Budgets within limit',
      value: adherence,
      unit: 'percent',
      target: 'At least 85%',
      status: statusFor(adherence, 85, 60),
      score: adherence ?? 60,
    },
    {
      id: 'runway',
      label: 'Cash runway',
      value: runwayMonths,
      unit: 'months',
      target: '6 months or more',
      status: statusFor(runwayMonths, 6, 3),
      score: runwayMonths == null ? 60 : clamp((runwayMonths / 6) * 100, 0, 100),
    },
  ];
  const score = Math.round(sum(indicators, (i) => i.score) / indicators.length);
  const goalProgress = goals.length ? sum(goals, (g) => computeGoalProgress(g, today).percent) / goals.length : null;

  return {
    range: cfg.value,
    caption: cfg.caption,
    from,
    to,
    buckets,
    totals: { ...totals, savingsRate },
    previous: { ...previous, savingsRate: previousRate },
    changes: {
      income: percentChange(totals.income, previous.income),
      expenses: percentChange(totals.expenses, previous.expenses),
      savings: percentChange(totals.savings, previous.savings),
      savingsRate: savingsRate - previousRate,
    },
    categories,
    incomeSources: categoryBreakdown(transactions, from, to, 'income'),
    topCategories,
    health: {
      score,
      label: score >= 75 ? 'Strong' : score >= 50 ? 'Steady' : 'Needs attention',
      indicators,
      goalProgress,
    },
  };
}
