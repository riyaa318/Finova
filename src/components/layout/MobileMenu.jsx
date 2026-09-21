import { Link } from "react-router-dom";
import { LogOut, X } from "lucide-react";
import { useAuth } from "../../hooks/useContexts";
import Avatar from "../ui/Avatar";
import Drawer from "../ui/Drawer";
import IconButton from "../ui/IconButton";
import Logo from "../ui/Logo";
import NavList from "../navigation/NavList";
import ThemeToggle from "../navigation/ThemeToggle";

export default function MobileMenu({ open, onClose }) {
  const { user, logout } = useAuth();
  return (
    <Drawer open={open} onClose={onClose} label="Navigation menu">
      <div
        data-stagger
        className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5"
      >
        <div className="flex items-center gap-3">
          <Logo size={30} />
          <span className="text-h2 tracking-tight text-ink">FINOVA</span>
        </div>
        <IconButton label="Close menu" icon={X} onClick={onClose} />
      </div>
      <div className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4">
        <NavList onNavigate={onClose} />
      </div>
      <div data-stagger className="shrink-0 space-y-1 border-t border-line p-3">
        <Link
          to="/profile"
          onClick={onClose}
          className="flex items-center gap-3 rounded-control p-2 transition-colors hover:bg-raised"
        >
          <Avatar name={user.name} src={user.avatar} size={38} />
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-small font-semibold text-ink">
              {user.name}
            </span>
            <span className="block truncate text-caption text-muted">
              {user.email}
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle showLabel className="flex-1 justify-start" />
          <IconButton label="Sign out" icon={LogOut} onClick={logout} />
        </div>
      </div>
    </Drawer>
  );
}
