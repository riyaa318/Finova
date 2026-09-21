import { lazy } from 'react';

const loaders = {
  dashboard: () => import('../pages/DashboardPage'),
  transactions: () => import('../pages/TransactionsPage'),
  transactionDetail: () => import('../pages/TransactionDetailPage'),
  budgets: () => import('../pages/BudgetsPage'),
  goals: () => import('../pages/GoalsPage'),
  analytics: () => import('../pages/AnalyticsPage'),
  notifications: () => import('../pages/NotificationsPage'),
  profile: () => import('../pages/ProfilePage'),
  settings: () => import('../pages/SettingsPage'),
  login: () => import('../pages/LoginPage'),
  signup: () => import('../pages/SignupPage'),
  notFound: () => import('../pages/NotFoundPage'),
};

export const DashboardPage = lazy(loaders.dashboard);
export const TransactionsPage = lazy(loaders.transactions);
export const TransactionDetailPage = lazy(loaders.transactionDetail);
export const BudgetsPage = lazy(loaders.budgets);
export const GoalsPage = lazy(loaders.goals);
export const AnalyticsPage = lazy(loaders.analytics);
export const NotificationsPage = lazy(loaders.notifications);
export const ProfilePage = lazy(loaders.profile);
export const SettingsPage = lazy(loaders.settings);
export const LoginPage = lazy(loaders.login);
export const SignupPage = lazy(loaders.signup);
export const NotFoundPage = lazy(loaders.notFound);

/** Warm the route chunks after sign-in so later navigations never flash a loading state. */
export const preloadPages = () => Promise.all(Object.values(loaders).map((load) => load()));
