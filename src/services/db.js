import { DEFAULT_BUDGETS } from "../data/budgets";
import { generateGoals } from "../data/goals";
import { generateNotifications } from "../data/notifications";
import { generateTransactions, TARGET_BALANCE } from "../data/transactions";
import { DEMO_USER } from "../data/users";
import { storage } from "../utils/storage";
import { currentBalance } from "../utils/finance";
import { formatINR as inr } from "../utils/format";
import { ApiError, makeId } from "./api";
import { getCurrentUserId } from "./authService";

const COLLECTIONS = [
  "transactions",
  "budgets",
  "goals",
  "notifications",
  "account",
];

const keyFor = (name) => {
  const userId = getCurrentUserId();
  if (!userId) throw new ApiError("You are not signed in.", 401);
  return `u:${userId}:${name}`;
};

function readOrSeed(name, seed) {
  const key = keyFor(name);
  const stored = storage.get(key);
  if (stored != null) return stored;
  const value = seed();
  storage.set(key, value);
  return value;
}

const write = (name, value) => {
  storage.set(keyFor(name), value);
  return value;
};

const seedNotifications = () => {
  const salary = db.transactions.read().find((t) => t.category === "Salary");
  return generateNotifications({
    salaryAmount: salary && inr(salary.amount),
    salaryId: salary?.id,
  }).map(({ hoursAgo, ...rest }) => ({
    id: makeId("ntf"),
    createdAt: new Date(Date.now() - hoursAgo * 3_600_000).toISOString(),
    ...rest,
  }));
};

const isDemoUser = () => getCurrentUserId() === DEMO_USER.id;

export const db = {
  transactions: {
    read: () =>
      readOrSeed("transactions", () =>
        isDemoUser() ? generateTransactions() : [],
      ),
    write: (v) => write("transactions", v),
  },
  budgets: {
    read: () =>
      readOrSeed("budgets", () => (isDemoUser() ? DEFAULT_BUDGETS : [])),
    write: (v) => write("budgets", v),
  },
  goals: {
    read: () =>
      readOrSeed("goals", () => (isDemoUser() ? generateGoals() : [])),
    write: (v) => write("goals", v),
  },
  notifications: {
    read: () =>
      readOrSeed("notifications", () =>
        isDemoUser() ? seedNotifications() : [],
      ),
    write: (v) => write("notifications", v),
  },
  account: {
    read: () =>
      readOrSeed("account", () => ({
        openingBalance: isDemoUser()
          ? TARGET_BALANCE - currentBalance(0, db.transactions.read())
          : 0,
      })),
    write: (v) => write("account", v),
  },
  reset() {
    const transactions = generateTransactions();
    write("transactions", transactions);
    write("budgets", DEFAULT_BUDGETS);
    write("goals", generateGoals());
    write("account", {
      openingBalance: TARGET_BALANCE - currentBalance(0, transactions),
    });
    write("notifications", seedNotifications());
  },
  clear() {
    write("transactions", []);
    write("budgets", []);
    write("goals", []);
    write("notifications", []);
    write("account", { openingBalance: 0 });
  },
};
