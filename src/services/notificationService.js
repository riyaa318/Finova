import { makeId, respond, ApiError } from './api';
import { db } from './db';

const sortNewest = (list) => [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export const getNotifications = (options) => respond(() => sortNewest(db.notifications.read()), options);

export const createNotification = ({ type, title, message, link }, options) =>
  respond(
    () => {
      const notification = { id: makeId('ntf'), type, title, message, link, read: false, createdAt: new Date().toISOString() };
      db.notifications.write([notification, ...db.notifications.read()]);
      return notification;
    },
    { latency: 0, canFail: false, ...options },
  );

export const markNotificationRead = (id, options) =>
  respond(
    () => {
      const list = db.notifications.read();
      if (!list.some((n) => n.id === id)) throw new ApiError('Notification not found.', 404);
      db.notifications.write(list.map((n) => (n.id === id ? { ...n, read: true } : n)));
      return { id };
    },
    { latency: 120, canFail: false, ...options },
  );

export const markAllNotificationsRead = (options) =>
  respond(
    () => {
      db.notifications.write(db.notifications.read().map((n) => ({ ...n, read: true })));
      return true;
    },
    { latency: 160, canFail: false, ...options },
  );
