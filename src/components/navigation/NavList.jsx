import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNotifications } from "../../hooks/useContexts";
import { gsap, useGSAP } from "../../motion/gsap";
import { useIconNudge } from "../../motion/hooks";
import { EASE } from "../../motion/tokens";
import { prefersReducedMotion } from "../../motion/reducedMotion";
import { isActivePath, NAV_ITEMS } from "./navItems";

function NavItem({ item, active, collapsed, unread, onNavigate, registerRef }) {
  const linkRef = useRef(null);
  const iconRef = useRef(null);
  useIconNudge(linkRef, iconRef, { x: 2 });
  const Icon = item.icon;

  return (
    <li data-stagger>
      <Link
        ref={(el) => {
          linkRef.current = el;
          registerRef(item.to, el);
        }}
        to={item.to}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        aria-label={collapsed ? item.label : undefined}
        title={collapsed ? item.label : undefined}
        className={`relative z-10 flex h-11 items-center gap-3 rounded-control px-[13px] text-small font-semibold transition-colors duration-150 ${active ? "text-accent" : "text-muted hover:text-ink"}`}
      >
        <span ref={iconRef} className="relative inline-flex shrink-0">
          <Icon size={20} strokeWidth={active ? 2.4 : 2} aria-hidden="true" />
          {collapsed && unread > 0 && (
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent ring-2 ring-surface"
            />
          )}
        </span>
        <span
          data-nav-label
          className="flex flex-1 items-center justify-between gap-2 whitespace-nowrap"
        >
          {item.label}
          {item.showUnread && unread > 0 && (
            <span
              className="rounded-full bg-accent px-1.5 py-px text-caption font-bold tabular-nums text-accent-fg"
              aria-label={`${unread} unread`}
            >
              {unread}
            </span>
          )}
        </span>
      </Link>
    </li>
  );
}

export default function NavList({ collapsed = false, onNavigate }) {
  const { pathname } = useLocation();
  const { unreadCount } = useNotifications();
  const listRef = useRef(null);
  const indicatorRef = useRef(null);
  const items = useRef({});
  const placed = useRef(false);
  const labelsPlaced = useRef(false);
  const active = NAV_ITEMS.find((item) => isActivePath(pathname, item.to))?.to;

  const place = (animate) => {
    const indicator = indicatorRef.current;
    const target = active && items.current[active]?.closest("li");
    if (!indicator) return;
    if (!target) {
      gsap.to(indicator, { opacity: 0, duration: 0.2, overwrite: true });
      return;
    }
    const props = {
      y: target.offsetTop,
      height: target.offsetHeight,
      opacity: 1,
    };
    if (animate && !prefersReducedMotion())
      gsap.to(indicator, {
        ...props,
        duration: 0.5,
        ease: EASE.strong,
        overwrite: true,
      });
    else gsap.set(indicator, props);
  };

  useGSAP(
    () => {
      place(placed.current);
      placed.current = true;
    },
    { dependencies: [active, collapsed], scope: listRef },
  );

  useGSAP(
    () => {
      const labels = gsap.utils.toArray("[data-nav-label]", listRef.current);
      const props = { autoAlpha: collapsed ? 0 : 1, x: collapsed ? -8 : 0 };
      if (!labelsPlaced.current || prefersReducedMotion())
        gsap.set(labels, props);
      else
        gsap.to(labels, {
          ...props,
          duration: 0.25,
          ease: EASE.soft,
          overwrite: true,
        });
      labelsPlaced.current = true;
    },
    { dependencies: [collapsed], scope: listRef },
  );

  useEffect(() => {
    const onResize = () => place(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  });

  return (
    <nav aria-label="Main">
      <ul ref={listRef} className="relative space-y-1">
        <span
          ref={indicatorRef}
          aria-hidden="true"
          style={{ opacity: 0 }}
          className="pointer-events-none absolute inset-x-0 top-0 rounded-control bg-accent/10"
        >
          <span className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-r-full bg-accent" />
        </span>
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.to}
            item={item}
            active={active === item.to}
            collapsed={collapsed}
            unread={unreadCount}
            onNavigate={onNavigate}
            registerRef={(to, el) => {
              items.current[to] = el;
            }}
          />
        ))}
      </ul>
    </nav>
  );
}
