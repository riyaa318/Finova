import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeftRight,
  ChartColumn,
  LayoutDashboard,
  Menu,
  PiggyBank,
} from "lucide-react";
import { useUI } from "../../hooks/useContexts";
import { isActivePath } from "../navigation/navItems";

const ITEMS = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/transactions", label: "Activity", icon: ArrowLeftRight },
  { to: "/budgets", label: "Budgets", icon: PiggyBank },
  { to: "/analytics", label: "Analytics", icon: ChartColumn },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const { setMobileMenuOpen } = useUI();
  const base =
    "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-caption font-semibold transition-colors";
  return (
    <nav
      aria-label="Quick navigation"
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      {ITEMS.map(({ to, label, icon: Icon }) => {
        const active = isActivePath(pathname, to);
        return (
          <Link
            key={to}
            to={to}
            aria-current={active ? "page" : undefined}
            className={`${base} ${active ? "text-accent" : "text-muted"}`}
          >
            <Icon size={20} strokeWidth={active ? 2.4 : 2} aria-hidden="true" />
            {label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={() => setMobileMenuOpen(true)}
        className={`${base} text-muted`}
        aria-haspopup="dialog"
      >
        <Menu size={20} aria-hidden="true" />
        More
      </button>
    </nav>
  );
}
