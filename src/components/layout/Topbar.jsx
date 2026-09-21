import { Link, useLocation } from "react-router-dom";
import { Bell, Menu, Plus } from "lucide-react";
import { useAuth, useNotifications, useUI } from "../../hooks/useContexts";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";
import Logo from "../ui/Logo";
import GlobalSearch from "./GlobalSearch";

export default function Topbar() {
  const { user } = useAuth();
  const { setMobileMenuOpen, openTransactionModal } = useUI();
  const { unreadCount } = useNotifications();
  const { pathname } = useLocation();
  const showSearch = !pathname.startsWith("/transactions");

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-line bg-canvas/85 px-3 backdrop-blur-md sm:gap-3 sm:px-6 lg:px-8">
      <IconButton
        label="Open menu"
        icon={Menu}
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden"
        aria-haspopup="dialog"
      />
      <Link
        to="/dashboard"
        aria-label="FINOVA dashboard"
        className="hidden shrink-0 max-lg:sm:inline-flex lg:hidden"
      >
        <Logo size={28} />
      </Link>
      <div className="flex min-w-0 flex-1 items-center">
        {showSearch ? (
          <GlobalSearch />
        ) : (
          <span className="hidden text-small font-semibold text-muted sm:inline">
            Transactions
          </span>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <Button
          icon={Plus}
          onClick={() => openTransactionModal()}
          className="hidden sm:inline-flex"
        >
          Add transaction
        </Button>
        <Button
          icon={Plus}
          aria-label="Add transaction"
          onClick={() => openTransactionModal()}
          className="!w-10 !px-0 sm:hidden"
        />
        <IconButton
          as={Link}
          to="/notifications"
          label={
            unreadCount
              ? `Notifications, ${unreadCount} unread`
              : "Notifications"
          }
          icon={Bell}
          badge={unreadCount > 0}
        />
        <Link
          to="/profile"
          aria-label="Your profile"
          className="ml-1 rounded-full lg:hidden"
        >
          <Avatar name={user.name} src={user.avatar} size={34} />
        </Link>
      </div>
    </header>
  );
}
