import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { gsap } from "../motion/gsap";
import { useNotifications, useSettings, useToast } from "../hooks/useContexts";
import * as finance from "../services/financeService";
import {
  GOAL_MILESTONES,
  LARGE_TRANSACTION_THRESHOLD,
} from "../utils/constants";
import { formatINR } from "../utils/format";
import { FinanceContext } from "./contexts";

const initialState = {
  status: "loading",
  error: null,
  transactions: [],
  budgets: [],
  goals: [],
  stats: null,
  lastAddedId: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "load/start":
      return { ...state, status: "loading", error: null };
    case "load/success":
      return { ...state, ...action.payload, status: "ready", error: null };
    case "load/error":
      return { ...state, status: "error", error: action.error };
    case "tx/added":
      return { ...state, lastAddedId: action.id };
    case "tx/clearAdded":
      return { ...state, lastAddedId: null };
    default:
      return state;
  }
}

const fetchAll = (options) =>
  Promise.all([
    finance.getTransactions(options),
    finance.getBudgets(options),
    finance.getGoals(options),
    finance.getDashboardStats(options),
  ]).then(([transactions, budgets, goals, stats]) => ({
    transactions,
    budgets,
    goals,
    stats,
  }));

const QUIET = { latency: 0, canFail: false };

export default function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const toast = useToast();
  const { settings } = useSettings();
  const { push: pushNotification, reload: reloadNotifications } =
    useNotifications();
  const snapshot = useRef(state);

  useEffect(() => {
    snapshot.current = state;
  });

  useEffect(() => {
    let active = true;
    fetchAll()
      .then((payload) => active && dispatch({ type: "load/success", payload }))
      .catch(
        (error) =>
          active && dispatch({ type: "load/error", error: error.message }),
      );
    return () => {
      active = false;
    };
  }, []);

  const reload = useCallback(() => {
    dispatch({ type: "load/start" });
    return fetchAll()
      .then((payload) => dispatch({ type: "load/success", payload }))
      .catch((error) => dispatch({ type: "load/error", error: error.message }));
  }, []);

  const refresh = useCallback(async () => {
    const payload = await fetchAll(QUIET);
    dispatch({ type: "load/success", payload });
    return payload;
  }, []);

  const addTransaction = useCallback(
    async (data) => {
      const budgetsBefore = snapshot.current.budgets;
      const tx = await finance.createTransaction(data);
      dispatch({ type: "tx/added", id: tx.id });
      const payload = await refresh();
      gsap.delayedCall(1.8, () => dispatch({ type: "tx/clearAdded" }));
      toast.success("Transaction added successfully");

      if (tx.type === "income") {
        pushNotification({
          type: "payment",
          title: "Payment received",
          message: `${formatINR(tx.amount)} from ${tx.merchant} was added to your account.`,
          link: `/transactions/${tx.id}`,
        });
      }
      if (
        tx.amount >= LARGE_TRANSACTION_THRESHOLD &&
        settings.largeTransactionAlerts
      ) {
        pushNotification({
          type: "large",
          title: "Large transaction detected",
          message: `A ${tx.type === "income" ? "credit" : "payment"} of ${formatINR(tx.amount)} ${tx.type === "income" ? "from" : "to"} ${tx.merchant} was recorded.`,
          link: `/transactions/${tx.id}`,
        });
      }
      if (tx.type === "expense" && settings.budgetAlerts) {
        const after = payload.budgets.find((b) => b.category === tx.category);
        const before = budgetsBefore.find((b) => b.category === tx.category);
        if (
          after &&
          before &&
          after.status !== before.status &&
          after.status !== "healthy"
        ) {
          pushNotification({
            type: "budget",
            title:
              after.status === "exceeded"
                ? `${tx.category} budget exceeded`
                : `${tx.category} budget almost used`,
            message: `You have used ${Math.round(after.percent)}% of your ${tx.category} budget in the last 30 days.`,
            link: "/budgets",
          });
        }
      }
      return tx;
    },
    [
      refresh,
      toast,
      pushNotification,
      settings.largeTransactionAlerts,
      settings.budgetAlerts,
    ],
  );

  const editTransaction = useCallback(
    async (id, data) => {
      const tx = await finance.updateTransaction(id, data);
      await refresh();
      toast.success("Transaction updated");
      return tx;
    },
    [refresh, toast],
  );

  const removeTransaction = useCallback(
    async (id) => {
      await finance.deleteTransaction(id);
      await refresh();
      toast.success("Transaction deleted");
    },
    [refresh, toast],
  );

  const addBudget = useCallback(
    async (data) => {
      const budget = await finance.createBudget(data);
      await refresh();
      toast.success("Budget created");
      return budget;
    },
    [refresh, toast],
  );

  const editBudget = useCallback(
    async (id, data) => {
      const budget = await finance.updateBudget(id, data);
      await refresh();
      toast.success("Budget updated");
      return budget;
    },
    [refresh, toast],
  );

  const removeBudget = useCallback(
    async (id) => {
      await finance.deleteBudget(id);
      await refresh();
      toast.success("Budget deleted");
    },
    [refresh, toast],
  );

  const addGoal = useCallback(
    async (data) => {
      const goal = await finance.createGoal(data);
      await refresh();
      toast.success("Goal created");
      return goal;
    },
    [refresh, toast],
  );

  const editGoal = useCallback(
    async (id, data) => {
      const goal = await finance.updateGoal(id, data);
      await refresh();
      toast.success("Goal updated");
      return goal;
    },
    [refresh, toast],
  );

  const removeGoal = useCallback(
    async (id) => {
      await finance.deleteGoal(id);
      await refresh();
      toast.success("Goal deleted");
    },
    [refresh, toast],
  );

  const contributeToGoal = useCallback(
    async (id, amount) => {
      const before = snapshot.current.goals.find((g) => g.id === id);
      const updated = await finance.addMoneyToGoal(id, amount);
      await refresh();
      toast.success("Goal updated");
      const oldPct = before
        ? (before.currentAmount / before.targetAmount) * 100
        : 0;
      const newPct = (updated.currentAmount / updated.targetAmount) * 100;
      const milestone = [...GOAL_MILESTONES]
        .reverse()
        .find((m) => oldPct < m && newPct >= m);
      if (milestone) {
        pushNotification({
          type: "goal",
          title:
            milestone === 100
              ? `${updated.title} completed`
              : "Goal milestone reached",
          message:
            milestone === 100
              ? `You reached your ${updated.title} target. Nicely done.`
              : `${updated.title} is now past ${milestone}% of its target.`,
          link: "/goals",
        });
      }
      return updated;
    },
    [refresh, toast, pushNotification],
  );

  const resetData = useCallback(
    async (mode) => {
      await (mode === "clear"
        ? finance.clearAllData()
        : finance.resetDemoData());
      await Promise.all([refresh(), reloadNotifications()]);
      toast.success(
        mode === "clear" ? "All data cleared" : "Demo data restored",
      );
    },
    [refresh, reloadNotifications, toast],
  );

  const value = useMemo(
    () => ({
      ...state,
      reload,
      addTransaction,
      editTransaction,
      removeTransaction,
      addBudget,
      editBudget,
      removeBudget,
      addGoal,
      editGoal,
      removeGoal,
      contributeToGoal,
      resetData,
    }),
    [
      state,
      reload,
      addTransaction,
      editTransaction,
      removeTransaction,
      addBudget,
      editBudget,
      removeBudget,
      addGoal,
      editGoal,
      removeGoal,
      contributeToGoal,
      resetData,
    ],
  );

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
}
