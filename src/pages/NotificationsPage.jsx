import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BellOff, CheckCheck } from "lucide-react";
import PageHeader from "../components/layout/PageHeader";
import NotificationItem from "../components/notifications/NotificationItem";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import { ListSkeleton } from "../components/ui/LoadingState";
import SegmentedControl from "../components/ui/SegmentedControl";
import { useNotifications, useToast } from "../hooks/useContexts";

export default function NotificationsPage() {
  const {
    status,
    items,
    unreadCount,
    error,
    reload,
    markAsRead,
    markAllAsRead,
  } = useNotifications();
  const toast = useToast();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const visible = useMemo(
    () => (filter === "unread" ? items.filter((n) => !n.read) : items),
    [items, filter],
  );
  const options = [
    { value: "all", label: `All (${items.length})` },
    { value: "unread", label: `Unread (${unreadCount})` },
  ];

  const safely = async (action) => {
    try {
      await action();
    } catch {
      toast.error("Could not update notifications. Please try again.");
    }
  };

  const open = (notification) => {
    if (!notification.read) safely(() => markAsRead(notification.id));
    if (notification.link) navigate(notification.link);
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Notifications"
        description="Budget warnings, payments and goal milestones."
        meta={unreadCount ? `${unreadCount} unread` : "You are all caught up"}
        actions={
          <Button
            variant="secondary"
            icon={CheckCheck}
            disabled={!unreadCount}
            onClick={() => safely(markAllAsRead)}
          >
            Mark all as read
          </Button>
        }
      />

      {status === "loading" && <ListSkeleton rows={6} />}
      {status === "error" && (
        <ErrorState message={error ?? undefined} onRetry={reload} />
      )}
      {status === "ready" && (
        <>
          <SegmentedControl
            label="Filter notifications"
            options={options}
            value={filter}
            onChange={setFilter}
            className="mb-4"
          />
          {visible.length === 0 ? (
            <div className="card">
              <EmptyState
                icon={BellOff}
                title={
                  filter === "unread"
                    ? "No unread notifications"
                    : "No notifications yet"
                }
                description={
                  filter === "unread"
                    ? "Everything has been read."
                    : "Alerts about budgets, payments and goals will appear here."
                }
              />
            </div>
          ) : (
            <ul
              className="card divide-y divide-line overflow-hidden"
              aria-label="Notifications"
            >
              {visible.map((n, index) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  index={index}
                  onOpen={open}
                  onMarkRead={(id) => safely(() => markAsRead(id))}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
