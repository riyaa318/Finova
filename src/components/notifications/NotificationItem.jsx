import { useRef } from "react";
import {
  ArrowDownLeft,
  Banknote,
  FileText,
  Target,
  TriangleAlert,
} from "lucide-react";
import { useFormatters } from "../../hooks/useFormatters";
import { useEntrance } from "../../motion/hooks";
import { timeAgo } from "../../utils/format";
import Button from "../ui/Button";

const TYPES = {
  budget: {
    icon: TriangleAlert,
    chip: "bg-warning/10 text-warning",
    label: "Budget warning",
  },
  payment: {
    icon: ArrowDownLeft,
    chip: "bg-success/10 text-success",
    label: "Payment received",
  },
  goal: {
    icon: Target,
    chip: "bg-accent/10 text-accent",
    label: "Goal milestone",
  },
  large: {
    icon: Banknote,
    chip: "bg-info/10 text-info",
    label: "Large transaction",
  },
  report: { icon: FileText, chip: "bg-raised text-ink", label: "Report" },
};

export default function NotificationItem({
  notification: n,
  index = 0,
  onOpen,
  onMarkRead,
}) {
  const ref = useRef(null);
  const { date } = useFormatters();
  useEntrance(ref, {
    delay: Math.min(index, 8) * 0.045,
    y: 12,
    duration: 0.45,
  });
  const { icon: Icon, chip, label } = TYPES[n.type] ?? TYPES.report;

  return (
    <li
      ref={ref}
      className={`relative flex items-start gap-3.5 px-4 py-4 transition-colors sm:px-5 ${n.read ? "" : "bg-accent/[0.05]"}`}
    >
      <span
        className={`mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-control ${chip}`}
      >
        <Icon size={18} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <button
            type="button"
            onClick={() => onOpen(n)}
            className="min-w-0 text-left after:absolute after:inset-0 after:content-['']"
          >
            <span className="sr-only">
              {n.read ? "Read. " : "Unread. "}
              {label}.{" "}
            </span>
            <span
              className={`block text-small text-ink ${n.read ? "font-semibold" : "font-bold"}`}
            >
              {n.title}
            </span>
          </button>
          <time
            dateTime={n.createdAt}
            title={date.medium(n.createdAt)}
            className="shrink-0 pt-0.5 text-caption text-subtle"
          >
            {timeAgo(n.createdAt)}
          </time>
        </div>
        <p className="mt-0.5 text-small text-muted">{n.message}</p>
        {!n.read && (
          <div className="relative z-10 mt-2 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-caption font-semibold text-accent">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-accent"
              />
              Unread
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkRead(n.id)}
              className="-my-1"
            >
              Mark as read
            </Button>
          </div>
        )}
      </div>
    </li>
  );
}
