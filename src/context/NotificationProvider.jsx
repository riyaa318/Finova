import { useCallback, useEffect, useMemo, useState } from 'react';
import * as notificationService from '../services/notificationService';
import { NotificationContext } from './contexts';

export default function NotificationProvider({ children }) {
  const [state, setState] = useState({ status: 'loading', items: [], error: null });

  useEffect(() => {
    let active = true;
    notificationService
      .getNotifications({ latency: [180, 320] })
      .then((items) => active && setState({ status: 'ready', items, error: null }))
      .catch((error) => active && setState({ status: 'error', items: [], error: error.message }));
    return () => {
      active = false;
    };
  }, []);

  const reload = useCallback(async () => {
    const items = await notificationService.getNotifications({ latency: 0, canFail: false });
    setState({ status: 'ready', items, error: null });
  }, []);

  const markAsRead = useCallback(async (id) => {
    setState((prev) => ({ ...prev, items: prev.items.map((n) => (n.id === id ? { ...n, read: true } : n)) }));
    await notificationService.markNotificationRead(id);
  }, []);

  const markAllAsRead = useCallback(async () => {
    setState((prev) => ({ ...prev, items: prev.items.map((n) => ({ ...n, read: true })) }));
    await notificationService.markAllNotificationsRead();
  }, []);

  const push = useCallback(async (payload) => {
    const created = await notificationService.createNotification(payload);
    setState((prev) => ({ ...prev, items: [created, ...prev.items] }));
    return created;
  }, []);

  const unreadCount = useMemo(() => state.items.filter((n) => !n.read).length, [state.items]);
  const value = useMemo(
    () => ({ ...state, unreadCount, reload, markAsRead, markAllAsRead, push }),
    [state, unreadCount, reload, markAsRead, markAllAsRead, push],
  );
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
