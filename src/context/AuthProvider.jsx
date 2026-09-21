import { useCallback, useMemo, useState } from 'react';
import * as authService from '../services/authService';
import { AuthContext } from './contexts';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());

  /** Verifies credentials and stores the session, but leaves the UI signed-out so the form can show a success state. */
  const authenticate = useCallback((credentials) => authService.login(credentials), []);
  const register = useCallback((details) => authService.signup(details), []);
  /** Flips the app into its signed-in state (route guards react to this). */
  const activate = useCallback((nextUser) => setUser(nextUser), []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (data) => {
      const next = await authService.updateProfile(user.id, data);
      setUser(next);
      return next;
    },
    [user],
  );

  const changePassword = useCallback((data) => authService.changePassword(user.id, data), [user]);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), authenticate, register, activate, logout, updateProfile, changePassword }),
    [user, authenticate, register, activate, logout, updateProfile, changePassword],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
