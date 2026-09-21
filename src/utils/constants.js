export const APP_NAME = "FINOVA";

export const DEMO_CREDENTIALS = Object.freeze({
  email: "demo@finova.app",
  password: "Finova@123",
});

export const EXPENSE_CATEGORIES = [
  "Food",
  "Shopping",
  "Transport",
  "Entertainment",
  "Bills",
  "Healthcare",
  "Education",
  "Investment",
];
export const INCOME_CATEGORIES = ["Salary", "Freelance", "Investment"];
export const ALL_CATEGORIES = [
  ...new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]),
];

export const CATEGORY_META = {
  Food: { icon: "Utensils", chart: 3 },
  Shopping: { icon: "ShoppingBag", chart: 2 },
  Transport: { icon: "Car", chart: 5 },
  Entertainment: { icon: "Clapperboard", chart: 6 },
  Bills: { icon: "Zap", chart: 8 },
  Healthcare: { icon: "HeartPulse", chart: 4 },
  Education: { icon: "GraduationCap", chart: 7 },
  Investment: { icon: "TrendingUp", chart: 1 },
  Salary: { icon: "Landmark", chart: 1 },
  Freelance: { icon: "Briefcase", chart: 2 },
};

export const PAYMENT_METHODS = [
  "UPI",
  "Credit Card",
  "Debit Card",
  "Net Banking",
  "Bank Transfer",
  "Cash",
  "Wallet",
];
export const TRANSACTION_STATUSES = ["completed", "pending", "failed"];
export const TRANSACTION_TYPES = ["income", "expense"];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "highest", label: "Highest amount" },
  { value: "lowest", label: "Lowest amount" },
  { value: "merchant", label: "Merchant A-Z" },
];

export const DATE_RANGE_OPTIONS = [
  { value: "all", label: "All time" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "year", label: "This year" },
  { value: "custom", label: "Custom range" },
];

export const ANALYTICS_RANGES = [
  {
    value: "7d",
    label: "7 days",
    days: 7,
    bucket: "day",
    caption: "last 7 days",
  },
  {
    value: "30d",
    label: "30 days",
    days: 30,
    bucket: "day",
    caption: "last 30 days",
  },
  {
    value: "3m",
    label: "3 months",
    days: 91,
    bucket: "week",
    caption: "last 3 months",
  },
  {
    value: "6m",
    label: "6 months",
    months: 6,
    bucket: "month",
    caption: "last 6 months",
  },
  {
    value: "1y",
    label: "1 year",
    months: 12,
    bucket: "month",
    caption: "last 12 months",
  },
];

export const PAGE_SIZE = 10;
export const BUDGET_WARNING_RATIO = 0.8;
export const LARGE_TRANSACTION_THRESHOLD = 25000;
export const GOAL_MILESTONES = [25, 50, 75, 100];

export const DEFAULT_CURRENCY = "INR";
export const DEFAULT_LANGUAGE = "en-IN";

export const CURRENCIES = {
  INR: {
    code: "INR",
    label: "Indian Rupee",
    symbol: "\u20B9",
    locale: "en-IN",
    rate: 1,
  },
  USD: {
    code: "USD",
    label: "US Dollar",
    symbol: "$",
    locale: "en-US",
    rate: 0.012,
  },
  EUR: {
    code: "EUR",
    label: "Euro",
    symbol: "\u20AC",
    locale: "en-IE",
    rate: 0.011,
  },
  GBP: {
    code: "GBP",
    label: "British Pound",
    symbol: "\u00A3",
    locale: "en-GB",
    rate: 0.0094,
  },
};

export const LANGUAGES = [
  { value: "en-IN", label: "English (India)" },
  { value: "en-US", label: "English (United States)" },
  { value: "en-GB", label: "English (United Kingdom)" },
];

export const DEFAULT_SETTINGS = Object.freeze({
  emailNotifications: true,
  pushNotifications: false,
  weeklySummary: true,
  budgetAlerts: true,
  largeTransactionAlerts: true,
  twoFactor: false,
  loginAlerts: true,
  currency: DEFAULT_CURRENCY,
  language: DEFAULT_LANGUAGE,
  simulateErrors: false,
});
