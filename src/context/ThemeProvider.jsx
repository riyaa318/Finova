import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { gsap } from '../motion/gsap';
import { prefersReducedMotion } from '../motion/reducedMotion';
import { storage } from '../utils/storage';
import { ThemeContext } from './contexts';

const DARK_QUERY = '(prefers-color-scheme: dark)';
const subscribeSystem = (cb) => {
  const media = window.matchMedia(DARK_QUERY);
  media.addEventListener('change', cb);
  return () => media.removeEventListener('change', cb);
};
const systemPrefersDark = () => window.matchMedia(DARK_QUERY).matches;

/** `preference` is what the user chose (light | dark | system); `theme` is what is actually applied. */
export default function ThemeProvider({ children }) {
  const [preference, setPreferenceState] = useState(() => storage.get('theme', 'system'));
  const systemDark = useSyncExternalStore(subscribeSystem, systemPrefersDark, () => false);
  const theme = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#080b0a' : '#f3f5f2');
  }, [theme]);

  const setPreference = useCallback((next) => {
    const root = document.documentElement;
    if (!prefersReducedMotion()) {
      root.classList.add('theme-transition');
      gsap.delayedCall(0.45, () => root.classList.remove('theme-transition'));
    }
    storage.set('theme', next);
    setPreferenceState(next);
  }, []);

  const toggleTheme = useCallback(() => setPreference(theme === 'dark' ? 'light' : 'dark'), [setPreference, theme]);
  const value = useMemo(() => ({ preference, theme, setPreference, toggleTheme }), [preference, theme, setPreference, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
