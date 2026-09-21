import { Navigate, Outlet, useLocation } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import FinanceProvider from '../context/FinanceProvider';
import NotificationProvider from '../context/NotificationProvider';
import SettingsProvider from '../context/SettingsProvider';
import UIProvider from '../context/UIProvider';
import { useAuth } from '../hooks/useContexts';

/** Auth guard: anonymous visitors are sent to /login and returned to where they were headed after signing in. */
export function ProtectedRoute() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return (
    <SettingsProvider key={user.id}>
      <NotificationProvider>
        <FinanceProvider>
          <UIProvider>
            <AppShell />
          </UIProvider>
        </FinanceProvider>
      </NotificationProvider>
    </SettingsProvider>
  );
}

/** Login / signup are only for signed-out visitors. */
export function PublicOnlyRoute() {
  const { user } = useAuth();
  const from = useLocation().state?.from;
  return user ? <Navigate to={from ? `${from.pathname}${from.search ?? ''}` : '/dashboard'} replace /> : <Outlet />;
}
