import {
  ANALYTICS_RANGES,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
} from "../utils/constants";
import { nowLocalISO, todayISO } from "../utils/dates";
import {
  computeAnalytics,
  computeBudgetUsage,
  computeDashboardStats,
  computeGoalProgress,
} from "../utils/finance";
import { sortTransactions } from "../utils/transactions";
import { amountError, validateTransaction } from "../utils/validators";
import { formatINR as inr } from "../utils/format";
import { ApiError, makeId, makeTransactionId, respond } from "./api";
import { db } from "./db";

const round2 = (n) => Math.round(Number(n) * 100) / 100;
const fail = (message, status = 422) => {
  throw new ApiError(message, status);
};

export const getTransactions = (options) =>
  respond(() => sortTransactions(db.transactions.read()), options);

export const getTransaction = (id, options) =>
  respond(
    () =>
      db.transactions.read().find((t) => t.id === id) ??
      fail("Transaction not found.", 404),
    options,
  );

function assertValidTransaction(data) {
  const errors = validateTransaction(data);
  const first = Object.values(errors)[0];
  if (first) fail(first);
}

export const createTransaction = (data, options) =>
  respond(() => {
    assertValidTransaction(data);
    const transaction = {
      id: makeTransactionId(),
      type: data.type,
      merchant: data.merchant.trim(),
      amount: round2(data.amount),
      category: data.category,
      date: data.date,
      paymentMethod: data.paymentMethod,
      status: data.status ?? "completed",
      notes: (data.notes ?? "").trim(),
      createdAt: nowLocalISO(),
    };
    db.transactions.write([transaction, ...db.transactions.read()]);
    return transaction;
  }, options);

export const updateTransaction = (id, data, options) =>
  respond(() => {
    const list = db.transactions.read();
    const index = list.findIndex((t) => t.id === id);
    if (index === -1) fail("Transaction not found.", 404);
    const merged = { ...list[index], ...data };
    assertValidTransaction(merged);
    const next = {
      ...merged,
      merchant: merged.merchant.trim(),
      amount: round2(merged.amount),
      notes: (merged.notes ?? "").trim(),
    };
    list[index] = next;
    db.transactions.write(list);
    return next;
  }, options);

export const deleteTransaction = (id, options) =>
  respond(() => {
    const list = db.transactions.read();
    if (!list.some((t) => t.id === id)) fail("Transaction not found.", 404);
    db.transactions.write(list.filter((t) => t.id !== id));
    return { id };
  }, options);

const assertBudget = ({ category, limit }, others) => {
  if (!EXPENSE_CATEGORIES.includes(category))
    fail("Choose a valid expense category.");
  const problem = amountError(limit, { label: "Budget limit" });
  if (problem) fail(problem);
  if (others.some((b) => b.category === category))
    fail("A budget for this category already exists.", 409);
};

export const getBudgets = (options) =>
  respond(
    () =>
      computeBudgetUsage(db.budgets.read(), db.transactions.read(), todayISO()),
    options,
  );

export const createBudget = (data, options) =>
  respond(() => {
    const budgets = db.budgets.read();
    assertBudget(data, budgets);
    const budget = {
      id: makeId("bud"),
      category: data.category,
      limit: round2(data.limit),
    };
    db.budgets.write([...budgets, budget]);
    return budget;
  }, options);

export const updateBudget = (id, data, options) =>
  respond(() => {
    const budgets = db.budgets.read();
    const index = budgets.findIndex((b) => b.id === id);
    if (index === -1) fail("Budget not found.", 404);
    const merged = { ...budgets[index], ...data };
    assertBudget(
      merged,
      budgets.filter((b) => b.id !== id),
    );
    budgets[index] = { ...merged, limit: round2(merged.limit) };
    db.budgets.write(budgets);
    return budgets[index];
  }, options);

export const deleteBudget = (id, options) =>
  respond(() => {
    const budgets = db.budgets.read();
    if (!budgets.some((b) => b.id === id)) fail("Budget not found.", 404);
    db.budgets.write(budgets.filter((b) => b.id !== id));
    return { id };
  }, options);

const assertGoal = (goal) => {
  if (!goal.title?.trim()) fail("Give your goal a name.");
  const problem = amountError(goal.targetAmount, { label: "Target amount" });
  if (problem) fail(problem);
  if (!goal.deadline) fail("Pick a deadline.");
};

export const getGoals = (options) =>
  respond(() => {
    const today = todayISO();
    const order = { active: 0, overdue: 1, achieved: 2 };
    return db.goals
      .read()
      .map((g) => computeGoalProgress(g, today))
      .sort(
        (a, b) =>
          order[a.status] - order[b.status] ||
          a.deadline.localeCompare(b.deadline),
      );
  }, options);

export const createGoal = (data, options) =>
  respond(() => {
    assertGoal(data);
    const goal = {
      id: makeId("goal"),
      title: data.title.trim(),
      icon: data.icon ?? "Target",
      targetAmount: round2(data.targetAmount),
      currentAmount: round2(
        Math.min(Number(data.currentAmount) || 0, Number(data.targetAmount)),
      ),
      deadline: data.deadline,
      createdAt: todayISO(),
    };
    db.goals.write([...db.goals.read(), goal]);
    return goal;
  }, options);

export const updateGoal = (id, data, options) =>
  respond(() => {
    const goals = db.goals.read();
    const index = goals.findIndex((g) => g.id === id);
    if (index === -1) fail("Goal not found.", 404);
    const merged = { ...goals[index], ...data };
    assertGoal(merged);
    goals[index] = {
      ...merged,
      title: merged.title.trim(),
      targetAmount: round2(merged.targetAmount),
      currentAmount: round2(
        Math.min(Number(merged.currentAmount), Number(merged.targetAmount)),
      ),
    };
    db.goals.write(goals);
    return goals[index];
  }, options);

export const deleteGoal = (id, options) =>
  respond(() => {
    const goals = db.goals.read();
    if (!goals.some((g) => g.id === id)) fail("Goal not found.", 404);
    db.goals.write(goals.filter((g) => g.id !== id));
    return { id };
  }, options);

export const addMoneyToGoal = (id, amount, options) =>
  respond(() => {
    const problem = amountError(amount);
    if (problem) fail(problem);
    const goals = db.goals.read();
    const index = goals.findIndex((g) => g.id === id);
    if (index === -1) fail("Goal not found.", 404);
    const goal = goals[index];
    const remaining = goal.targetAmount - goal.currentAmount;
    if (remaining <= 0) fail("This goal is already fully funded.");
    if (Number(amount) > remaining)
      fail(`Only ${inr(remaining)} is needed to complete this goal.`);
    const stats = computeDashboardStats({
      transactions: db.transactions.read(),
      goals,
      openingBalance: db.account.read().openingBalance,
      today: todayISO(),
    });
    if (Number(amount) > stats.availableBalance)
      fail(
        `Not enough available balance. You have ${inr(Math.max(0, stats.availableBalance))} available.`,
      );
    goals[index] = {
      ...goal,
      currentAmount: round2(goal.currentAmount + Number(amount)),
    };
    db.goals.write(goals);
    return goals[index];
  }, options);

export const getDashboardStats = (options) =>
  respond(
    () =>
      computeDashboardStats({
        transactions: db.transactions.read(),
        goals: db.goals.read(),
        openingBalance: db.account.read().openingBalance,
        today: todayISO(),
      }),
    options,
  );

export const getAnalytics = (range, options) =>
  respond(() => {
    if (!ANALYTICS_RANGES.some((r) => r.value === range))
      fail("Unknown time range.", 400);
    return computeAnalytics({
      transactions: db.transactions.read(),
      budgets: db.budgets.read(),
      goals: db.goals.read(),
      openingBalance: db.account.read().openingBalance,
      range,
      today: todayISO(),
    });
  }, options);

export const resetDemoData = (options) =>
  respond(() => (db.reset(), true), options);
export const clearAllData = (options) =>
  respond(() => (db.clear(), true), options);

export const CATEGORY_LISTS = {
  income: INCOME_CATEGORIES,
  expense: EXPENSE_CATEGORIES,
};
