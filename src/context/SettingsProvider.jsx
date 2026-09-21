import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useContexts";
import { setErrorSimulation } from "../services/api";
import { DEFAULT_SETTINGS } from "../utils/constants";
import { storage } from "../utils/storage";
import { SettingsContext } from "./contexts";

export default function SettingsProvider({ children }) {
  const { user } = useAuth();
  const storageKey = `u:${user.id}:settings`;
  const [settings, setSettings] = useState(() => ({
    ...DEFAULT_SETTINGS,
    ...storage.get(storageKey, {}),
  }));

  useEffect(() => {
    storage.set(storageKey, settings);
    setErrorSimulation(settings.simulateErrors);
    document.documentElement.lang = settings.language;
  }, [settings, storageKey]);

  const updateSettings = useCallback(
    (patch) => setSettings((prev) => ({ ...prev, ...patch })),
    [],
  );
  const value = useMemo(
    () => ({ settings, updateSettings }),
    [settings, updateSettings],
  );
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
