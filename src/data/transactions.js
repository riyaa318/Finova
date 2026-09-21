import { addDays, daysInMonth, startOfToday, toISODate } from "../utils/dates";

export const SEED = 26;
export const TARGET_BALANCE = 248650;

export const WINDOW_TARGETS = {
  Food: 8240,
  Shopping: 8650,
  Transport: 3410,
  Entertainment: 2860,
  Bills: 19880,
  Healthcare: 1180,
  Education: 1999,
};

const CATALOG = {
  Food: {
    merchants: [
      "Swiggy",
      "Zomato",
      "Blinkit",
      "BigBasket",
      "Starbucks",
      "Third Wave Coffee",
      "Domino's Pizza",
      "Barbeque Nation",
      "Chaayos",
    ],
    notes: [
      "Dinner order",
      "Weekly groceries",
      "Coffee with friends",
      "Lunch at office",
      "Late-night snack",
      "",
    ],
    methods: ["UPI", "UPI", "Credit Card", "Debit Card"],
  },
  Shopping: {
    merchants: [
      "Amazon",
      "Flipkart",
      "Myntra",
      "Nykaa",
      "Decathlon",
      "Croma",
      "IKEA",
    ],
    notes: [
      "Home essentials",
      "Sale purchase",
      "Gift",
      "Workspace upgrade",
      "",
    ],
    methods: ["Credit Card", "Credit Card", "UPI", "Debit Card"],
  },
  Transport: {
    merchants: ["Uber", "Ola", "Rapido", "Indian Oil", "Namma Metro", "IRCTC"],
    notes: ["Ride to office", "Fuel", "Metro card top-up", "Weekend trip", ""],
    methods: ["UPI", "UPI", "Wallet", "Debit Card"],
  },
  Entertainment: {
    merchants: [
      "Netflix",
      "Spotify",
      "BookMyShow",
      "Amazon Prime",
      "PVR Cinemas",
      "Steam",
      "YouTube Premium",
    ],
    notes: ["Monthly subscription", "Movie night", "Game purchase", ""],
    methods: ["Credit Card", "UPI", "Credit Card"],
  },
  Bills: {
    merchants: [
      "BESCOM Electricity",
      "Airtel Broadband",
      "Jio Postpaid",
      "Tata Play",
      "BWSSB Water",
      "HDFC Credit Card Bill",
    ],
    notes: ["Monthly bill", "Auto-pay", ""],
    methods: ["Net Banking", "UPI", "Debit Card"],
  },
  Healthcare: {
    merchants: [
      "Apollo Pharmacy",
      "PharmEasy",
      "Practo",
      "Cult.fit",
      "Dr. Lal PathLabs",
    ],
    notes: ["Prescription refill", "Consultation", "Gym membership", ""],
    methods: ["UPI", "Debit Card", "Credit Card"],
  },
  Education: {
    merchants: [
      "Coursera",
      "Udemy",
      "Frontend Masters",
      "O'Reilly Learning",
      "Amazon Kindle",
    ],
    notes: ["Course purchase", "Learning subscription", "E-book", ""],
    methods: ["Credit Card", "UPI"],
  },
};

const FLEX_PLAN = [
  { category: "Food", base: 9400, jitter: 0.14, count: [13, 17] },
  { category: "Shopping", base: 6900, jitter: 0.35, count: [2, 4] },
  { category: "Transport", base: 3700, jitter: 0.15, count: [7, 11] },
  { category: "Entertainment", base: 2700, jitter: 0.2, count: [3, 5] },
  { category: "Bills", base: 5600, jitter: 0.1, count: [3, 4] },
  { category: "Healthcare", base: 1300, jitter: 0.6, count: [1, 2] },
  {
    category: "Education",
    base: 2000,
    jitter: 0.5,
    count: [1, 2],
    chance: 0.7,
  },
];

const FREELANCE_SOURCES = [
  "Fiverr Payout",
  "Upwork Escrow Release",
  "Client Payment - Design Project",
];
const DIVIDEND_SOURCES = [
  "Dividend - HDFC Bank",
  "Dividend - Infosys",
  "Dividend - ITC",
];

function mulberry32(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = (rand, list) => list[Math.floor(rand() * list.length)];
const between = (rand, min, max) => min + rand() * (max - min);
const int = (rand, min, max) => Math.round(between(rand, min, max));

function splitTotal(rand, total, parts) {
  const weights = Array.from({ length: parts }, () => between(rand, 0.4, 1.6));
  const weightSum = weights.reduce((a, b) => a + b, 0);
  const amounts = weights.map((w) =>
    Math.max(49, Math.round((total * w) / weightSum)),
  );
  amounts[amounts.length - 1] = Math.max(
    49,
    amounts[amounts.length - 1] + (total - amounts.reduce((a, b) => a + b, 0)),
  );
  return amounts;
}

function expenseFor(rand, category, date, amount, extra = {}) {
  const entry = CATALOG[category];
  return {
    type: "expense",
    category,
    merchant: pick(rand, entry.merchants),
    notes: pick(rand, entry.notes),
    paymentMethod: pick(rand, entry.methods),
    amount,
    date,
    status: "completed",
    ...extra,
  };
}

function fitWindow(rand, items, today) {
  const start = toISODate(addDays(today, -29));
  const end = toISODate(today);
  for (const [category, target] of Object.entries(WINDOW_TARGETS)) {
    const inWindow = (t) =>
      t.type === "expense" &&
      t.category === category &&
      t.date >= start &&
      t.date <= end &&
      t.status !== "failed";
    let flex = items.filter((t) => inWindow(t) && !t.fixed);
    if (!flex.length) {
      const created = expenseFor(
        rand,
        category,
        toISODate(addDays(today, -int(rand, 3, 24))),
        500,
      );
      items.push(created);
      flex = [created];
    }
    const fixedTotal = items
      .filter((t) => inWindow(t) && t.fixed)
      .reduce((a, t) => a + t.amount, 0);
    const flexTarget = Math.max(target - fixedTotal, flex.length * 60);
    const current = flex.reduce((a, t) => a + t.amount, 0);
    flex.forEach((t) => {
      t.amount = Math.max(49, Math.round((t.amount * flexTarget) / current));
    });
    const drift = flexTarget - flex.reduce((a, t) => a + t.amount, 0);
    const largest = flex.reduce((a, b) => (b.amount > a.amount ? b : a));
    largest.amount += drift;
  }
}

export function generateTransactions(today = startOfToday(), seed = SEED) {
  const rand = mulberry32(seed);
  const earliest = toISODate(addDays(today, -395));
  const todayIso = toISODate(today);
  const items = [];
  const add = (date, entry) => {
    const iso = toISODate(date);
    if (iso > todayIso || iso < earliest) return;
    items.push({ status: "completed", notes: "", ...entry, date: iso });
  };

  for (let back = 13; back >= 0; back -= 1) {
    const first = new Date(today.getFullYear(), today.getMonth() - back, 1);
    const length = daysInMonth(first);
    const lastDay = back === 0 ? today.getDate() : length;
    const fraction = lastDay / length;
    const dayOf = (n) =>
      new Date(first.getFullYear(), first.getMonth(), Math.min(n, length));
    const randomDay = (min, max) =>
      new Date(
        first.getFullYear(),
        first.getMonth(),
        Math.min(Math.max(1, int(rand, min, Math.min(max, lastDay))), lastDay),
      );

    add(dayOf(1), {
      type: "income",
      category: "Salary",
      merchant: "Northwind Technologies",
      amount: back <= 3 ? 72500 : 68000,
      paymentMethod: "Bank Transfer",
      notes: "Monthly salary credit",
    });
    add(dayOf(5), {
      type: "expense",
      category: "Bills",
      merchant: "Rent - Lakeview Residency",
      amount: 14000,
      paymentMethod: "Net Banking",
      notes: "Monthly rent",
      fixed: true,
    });
    add(dayOf(7), {
      type: "expense",
      category: "Investment",
      merchant: "Zerodha Coin SIP",
      amount: 10000,
      paymentMethod: "Net Banking",
      notes: "Monthly index fund SIP",
      fixed: true,
    });
    if (back % 2 === 0) {
      add(randomDay(9, 22), {
        type: "income",
        category: "Freelance",
        merchant: pick(rand, FREELANCE_SOURCES),
        amount: Math.round(between(rand, 6000, 14000) / 500) * 500,
        paymentMethod: "Bank Transfer",
        notes: "Freelance project payout",
      });
    }
    if (back % 3 === 1) {
      add(dayOf(15), {
        type: "income",
        category: "Investment",
        merchant: pick(rand, DIVIDEND_SOURCES),
        amount: int(rand, 1200, 2600),
        paymentMethod: "Bank Transfer",
        notes: "Dividend payout",
      });
    }

    for (const plan of FLEX_PLAN) {
      if (plan.chance && rand() > plan.chance) continue;
      const total = Math.round(
        plan.base * (1 + between(rand, -plan.jitter, plan.jitter)) * fraction,
      );
      const count = Math.max(
        1,
        Math.round(int(rand, plan.count[0], plan.count[1]) * fraction),
      );
      splitTotal(rand, total, count).forEach((amount) => {
        add(randomDay(1, length), expenseFor(rand, plan.category, "", amount));
      });
    }
  }

  items.sort((a, b) => b.date.localeCompare(a.date));

  const recentFlex = items.filter((t) => t.type === "expense" && !t.fixed);
  recentFlex[0].status = "pending";
  recentFlex[1].status = "pending";
  const failed =
    recentFlex.slice(4, 30).find((t) => t.category === "Food") ?? recentFlex[6];
  if (failed) {
    failed.status = "failed";
    failed.notes = "Payment declined by bank";
  }

  fitWindow(rand, items, today);
  items.sort((a, b) => b.date.localeCompare(a.date));

  return items.map((t, index) => {
    const { fixed: _fixed, ...rest } = t;
    const hour = String(8 + ((index * 7) % 14)).padStart(2, "0");
    const minute = String((index * 13) % 60).padStart(2, "0");
    const id = `TXN-${Math.floor(rand() * 0xffffffff)
      .toString(16)
      .toUpperCase()
      .padStart(8, "0")}`;
    return { id, ...rest, createdAt: `${t.date}T${hour}:${minute}:00` };
  });
}
