import { isValidISODate, todayISO } from "./dates";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  PAYMENT_METHODS,
} from "./constants";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const MAX_AMOUNT = 100_000_000;

export const isEmail = (value) => EMAIL_RE.test(String(value).trim());

export function amountError(value, { label = "Amount" } = {}) {
  const raw = String(value ?? "").trim();
  if (!raw) return `${label} is required`;
  if (!/^\d+(\.\d{1,2})?$/.test(raw))
    return `Enter a valid ${label.toLowerCase()} (up to 2 decimals)`;
  const n = Number(raw);
  if (n <= 0) return `${label} must be greater than zero`;
  if (n > MAX_AMOUNT) return `${label} is too large`;
  return null;
}

const compact = (errors) =>
  Object.fromEntries(Object.entries(errors).filter(([, v]) => v));

export function validateTransaction(values, { toBase = (n) => n } = {}) {
  const categories =
    values.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  return compact({
    merchant: !values.merchant?.trim()
      ? "Merchant or source is required"
      : values.merchant.trim().length > 60
        ? "Keep this under 60 characters"
        : null,
    amount:
      amountError(values.amount) ??
      (toBase(Number(values.amount)) > MAX_AMOUNT
        ? "Amount is too large"
        : null),
    category: !values.category
      ? "Choose a category"
      : !categories.includes(values.category)
        ? "Invalid category for this type"
        : null,
    date: !values.date
      ? "Date is required"
      : !isValidISODate(values.date)
        ? "Enter a valid date"
        : values.date > todayISO()
          ? "Date cannot be in the future"
          : null,
    paymentMethod: PAYMENT_METHODS.includes(values.paymentMethod)
      ? null
      : "Choose a payment method",
    notes:
      (values.notes ?? "").length > 200
        ? "Notes are limited to 200 characters"
        : null,
  });
}

export function validateBudget(values, { takenCategories = [] } = {}) {
  return compact({
    category: !values.category
      ? "Choose a category"
      : takenCategories.includes(values.category)
        ? "A budget for this category already exists"
        : null,
    limit: amountError(values.limit, { label: "Budget limit" }),
  });
}

export function validateGoal(values) {
  return compact({
    title: !values.title?.trim()
      ? "Give your goal a name"
      : values.title.trim().length > 50
        ? "Keep this under 50 characters"
        : null,
    targetAmount: amountError(values.targetAmount, { label: "Target amount" }),
    currentAmount:
      values.currentAmount === "" ||
      values.currentAmount == null ||
      Number(values.currentAmount) === 0
        ? null
        : amountError(values.currentAmount, { label: "Saved amount" }),
    deadline: !values.deadline
      ? "Pick a deadline"
      : !isValidISODate(values.deadline)
        ? "Enter a valid date"
        : values.deadline < todayISO()
          ? "Deadline must be today or later"
          : null,
  });
}

export function validateLogin({ email, password }) {
  return compact({
    email: !email?.trim()
      ? "Email is required"
      : !isEmail(email)
        ? "Enter a valid email address"
        : null,
    password: !password ? "Password is required" : null,
  });
}

export const passwordStrength = (pw = "") => {
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score += 1;
  if (/\d/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) score += 1;
  return score; // 0-4
};

const passwordRuleError = (pw) => {
  if (!pw) return "Password is required";
  if (pw.length < 8) return "Use at least 8 characters";
  if (!/[A-Za-z]/.test(pw) || !/\d/.test(pw))
    return "Include at least one letter and one number";
  return null;
};

export function validateSignup({ name, email, password, confirmPassword }) {
  return compact({
    name: !name?.trim()
      ? "Your name is required"
      : name.trim().length < 2
        ? "Name is too short"
        : null,
    email: !email?.trim()
      ? "Email is required"
      : !isEmail(email)
        ? "Enter a valid email address"
        : null,
    password: passwordRuleError(password),
    confirmPassword: !confirmPassword
      ? "Confirm your password"
      : confirmPassword !== password
        ? "Passwords do not match"
        : null,
  });
}

export function validatePasswordChange({
  currentPassword,
  newPassword,
  confirmPassword,
}) {
  return compact({
    currentPassword: currentPassword ? null : "Enter your current password",
    newPassword:
      passwordRuleError(newPassword) ??
      (newPassword === currentPassword ? "Choose a different password" : null),
    confirmPassword: !confirmPassword
      ? "Confirm your new password"
      : confirmPassword !== newPassword
        ? "Passwords do not match"
        : null,
  });
}

export function validateProfile({ name, email, phone, occupation, location }) {
  return compact({
    name: !name?.trim()
      ? "Name is required"
      : name.trim().length < 2
        ? "Name is too short"
        : null,
    email: !email?.trim()
      ? "Email is required"
      : !isEmail(email)
        ? "Enter a valid email address"
        : null,
    phone:
      phone && !/^[+\d][\d\s()-]{6,17}$/.test(phone.trim())
        ? "Enter a valid phone number"
        : null,
    occupation:
      (occupation ?? "").length > 60 ? "Keep this under 60 characters" : null,
    location:
      (location ?? "").length > 60 ? "Keep this under 60 characters" : null,
  });
}
