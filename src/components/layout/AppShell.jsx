import { useEffect } from "react";
import { useUI } from "../../hooks/useContexts";
import PageTransition from "../../motion/PageTransition";
import { preloadPages } from "../../routes/pages";
import TransactionModal from "../transactions/TransactionModal";
import BottomNav from "./BottomNav";
import MobileMenu from "./MobileMenu";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell() {
  const {
    mobileMenuOpen,
    setMobileMenuOpen,
    transactionModal,
    closeTransactionModal,
  } = useUI();

  useEffect(() => {
    const id = setTimeout(preloadPages, 1500);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="flex min-h-dvh">
      <a
        href="#main"
        className="sr-only rounded-control bg-accent px-4 py-2 text-small font-semibold text-accent-fg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70]"
      >
        Skip to content
      </a>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main
          id="main"
          tabIndex={-1}
          className="flex-1 pb-20 outline-none md:pb-0"
        >
          <PageTransition />
        </main>
      </div>
      <BottomNav />
      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      {transactionModal.session > 0 && (
        <TransactionModal
          key={transactionModal.session}
          open={transactionModal.open}
          transaction={transactionModal.transaction}
          defaultType={transactionModal.type}
          onClose={closeTransactionModal}
        />
      )}
    </div>
  );
}
