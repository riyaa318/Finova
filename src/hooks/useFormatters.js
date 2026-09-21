import { useMemo } from 'react';
import { makeDateFormatter, makeMoneyFormatter } from '../utils/format';
import { useSettings } from './useContexts';

/** Currency + date formatters bound to the user's Preferences. Components re-render when those change. */
export function useFormatters() {
  const { settings } = useSettings();
  return useMemo(
    () => ({ ...makeMoneyFormatter(settings.currency), date: makeDateFormatter(settings.language) }),
    [settings.currency, settings.language],
  );
}
