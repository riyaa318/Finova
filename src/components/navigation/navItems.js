import { ArrowLeftRight, Bell, ChartColumn, LayoutDashboard, PiggyBank, Settings, Target } from 'lucide-react';

export const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/budgets', label: 'Budgets', icon: PiggyBank },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/analytics', label: 'Analytics', icon: ChartColumn },
  { to: '/notifications', label: 'Notifications', icon: Bell, showUnread: true },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export const isActivePath = (pathname, to) => pathname === to || pathname.startsWith(`${to}/`);
