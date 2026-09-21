import { useCallback, useState } from 'react';

/**
 * Open/close state for form modals. `session` changes on every open, so using it as a React `key`
 * gives each opening a fresh form while still letting the close animation finish on the same instance.
 */
export function useModalState(initialOpen = false) {
  const [state, setState] = useState({ open: initialOpen, payload: null, session: initialOpen ? 1 : 0 });
  const openWith = useCallback((payload = null) => setState((prev) => ({ open: true, payload, session: prev.session + 1 })), []);
  const close = useCallback(() => setState((prev) => ({ ...prev, open: false })), []);
  return { ...state, openWith, close };
}
