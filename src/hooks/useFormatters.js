import { useMemo } from "react";
import { makeDateFormatter, makeMoneyFormatter } from "../utils/format";
import { useSettings } from "./useContexts";

export function useFormatters() {
  const { settings } = useSettings();
  return useMemo(
    () => ({
      ...makeMoneyFormatter(settings.currency),
      date: makeDateFormatter(settings.language),
    }),
    [settings.currency, settings.language],
  );
}
