import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { FullPageLoader } from "../components/ui/LoadingState";
import { ProtectedRoute, PublicOnlyRoute } from "./guards";
import {
  AnalyticsPage,
  BudgetsPage,
  DashboardPage,
  GoalsPage,
  LoginPage,
  NotFoundPage,
  NotificationsPage,
  ProfilePage,
  SettingsPage,
  SignupPage,
  TransactionDetailPage,
  TransactionsPage,
} from "./pages";

export default function AppRoutes() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/transactions/:id" element={<TransactionDetailPage />} />
          <Route path="/budgets" element={<BudgetsPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
