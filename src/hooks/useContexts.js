import { useContext } from 'react';
import { AuthContext, FinanceContext, NotificationContext, SettingsContext, ThemeContext, ToastContext, UIContext } from '../context/contexts';

function useRequiredContext(context, name) {
  const value = useContext(context);
  if (value === null) throw new Error(`${name} must be used inside its provider`);
  return value;
}

export const useAuth = () => useRequiredContext(AuthContext, 'useAuth');
export const useTheme = () => useRequiredContext(ThemeContext, 'useTheme');
export const useSettings = () => useRequiredContext(SettingsContext, 'useSettings');
export const useFinance = () => useRequiredContext(FinanceContext, 'useFinance');
export const useNotifications = () => useRequiredContext(NotificationContext, 'useNotifications');
export const useToast = () => useRequiredContext(ToastContext, 'useToast');
export const useUI = () => useRequiredContext(UIContext, 'useUI');
