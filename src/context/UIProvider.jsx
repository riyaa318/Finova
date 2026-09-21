import { useCallback, useMemo, useState } from "react";
import { storage } from "../utils/storage";
import { UIContext } from "./contexts";

const CLOSED = { open: false, transaction: null, type: "expense", session: 0 };

export default function UIProvider({ children }) {
  const [transactionModal, setTransactionModal] = useState(CLOSED);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() =>
    storage.get("sidebar-collapsed", false),
  );

  const openTransactionModal = useCallback(
    ({ transaction = null, type = "expense" } = {}) =>
      setTransactionModal((prev) => ({
        open: true,
        transaction,
        type,
        session: prev.session + 1,
      })),
    [],
  );
  const closeTransactionModal = useCallback(
    () => setTransactionModal((prev) => ({ ...prev, open: false })),
    [],
  );
  const toggleSidebar = useCallback(
    () =>
      setSidebarCollapsed((prev) => {
        storage.set("sidebar-collapsed", !prev);
        return !prev;
      }),
    [],
  );

  const value = useMemo(
    () => ({
      transactionModal,
      openTransactionModal,
      closeTransactionModal,
      mobileMenuOpen,
      setMobileMenuOpen,
      sidebarCollapsed,
      toggleSidebar,
    }),
    [
      transactionModal,
      openTransactionModal,
      closeTransactionModal,
      mobileMenuOpen,
      sidebarCollapsed,
      toggleSidebar,
    ],
  );
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
