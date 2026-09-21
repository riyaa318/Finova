import { useRef } from "react";
import { Link } from "react-router-dom";
import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useAuth, useUI } from "../../hooks/useContexts";
import { gsap, useGSAP } from "../../motion/gsap";
import { EASE } from "../../motion/tokens";
import { prefersReducedMotion } from "../../motion/reducedMotion";
import Avatar from "../ui/Avatar";
import IconButton from "../ui/IconButton";
import Logo from "../ui/Logo";
import NavList from "../navigation/NavList";
import ThemeToggle from "../navigation/ThemeToggle";

const EXPANDED = 264;
const COLLAPSED = 76;

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { sidebarCollapsed, toggleSidebar } = useUI();
  const ref = useRef(null);
  const placed = useRef(false);

  useGSAP(
    () => {
      const width = sidebarCollapsed ? COLLAPSED : EXPANDED;
      if (!placed.current || prefersReducedMotion())
        gsap.set(ref.current, { width });
      else gsap.to(ref.current, { width, duration: 0.5, ease: EASE.strong });
      placed.current = true;
    },
    { dependencies: [sidebarCollapsed], scope: ref },
  );

  return (
    <aside
      ref={ref}
      aria-label="Sidebar"
      className="sticky top-0 hidden h-dvh shrink-0 flex-col overflow-hidden border-r border-line bg-surface lg:flex"
    >
      <div className="flex h-16 shrink-0 items-center justify-between gap-2 px-[22px]">
        <Link
          to="/dashboard"
          aria-label="FINOVA dashboard"
          className="flex items-center gap-3"
        >
          <Logo size={32} />
          <span
            className="text-h2 tracking-tight text-ink transition-opacity duration-200"
            style={{ opacity: sidebarCollapsed ? 0 : 1 }}
          >
            FINOVA
          </span>
        </Link>
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto px-[10px] pt-3">
        <NavList collapsed={sidebarCollapsed} />
      </div>

      <div className="shrink-0 space-y-1 border-t border-line p-[10px]">
        <Link
          to="/profile"
          aria-label="Your profile"
          title={sidebarCollapsed ? user.name : undefined}
          className="flex h-14 items-center gap-3 rounded-control px-[9px] transition-colors hover:bg-raised"
        >
          <Avatar name={user.name} src={user.avatar} size={36} />
          <span
            className="min-w-0 leading-tight transition-opacity duration-200"
            style={{ opacity: sidebarCollapsed ? 0 : 1 }}
          >
            <span className="block truncate text-small font-semibold text-ink">
              {user.name}
            </span>
            <span className="block truncate text-caption text-muted">
              {user.email}
            </span>
          </span>
        </Link>
        <div
          className={`flex gap-1 ${sidebarCollapsed ? "flex-col items-center" : "items-center"}`}
        >
          <ThemeToggle
            showLabel={!sidebarCollapsed}
            className={sidebarCollapsed ? "" : "flex-1 justify-start"}
          />
          <IconButton label="Sign out" icon={LogOut} onClick={logout} />
          <IconButton
            label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            icon={sidebarCollapsed ? PanelLeftOpen : PanelLeftClose}
            onClick={toggleSidebar}
            aria-expanded={!sidebarCollapsed}
          />
        </div>
      </div>
    </aside>
  );
}
