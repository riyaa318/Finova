import { useCallback, useMemo, useState } from "react";
import ToastViewport from "../components/ui/ToastViewport";
import { ToastContext } from "./contexts";

const MAX_VISIBLE = 4;
let counter = 0;

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((tone, message, duration = 4200) => {
    counter += 1;
    setToasts((prev) =>
      [...prev, { id: counter, tone, message, duration }].slice(-MAX_VISIBLE),
    );
  }, []);
  const remove = useCallback(
    (id) => setToasts((prev) => prev.filter((t) => t.id !== id)),
    [],
  );

  const api = useMemo(
    () => ({
      success: (message) => push("success", message),
      error: (message) => push("error", message, 6000),
      info: (message) => push("info", message),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onRemove={remove} />
    </ToastContext.Provider>
  );
}
