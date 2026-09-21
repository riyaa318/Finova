import { useCallback, useState } from "react";

export function useModalState(initialOpen = false) {
  const [state, setState] = useState({
    open: initialOpen,
    payload: null,
    session: initialOpen ? 1 : 0,
  });
  const openWith = useCallback(
    (payload = null) =>
      setState((prev) => ({ open: true, payload, session: prev.session + 1 })),
    [],
  );
  const close = useCallback(
    () => setState((prev) => ({ ...prev, open: false })),
    [],
  );
  return { ...state, openWith, close };
}
