import { Inbox } from "lucide-react";
import { useRef } from "react";
import { useEntrance } from "../../motion/hooks";

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className = "",
}) {
  const ref = useRef(null);
  useEntrance(ref, { y: 10, duration: 0.45 });
  return (
    <div
      ref={ref}
      className={`flex flex-col items-center justify-center px-6 py-14 text-center ${className}`}
    >
      <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-raised text-muted">
        <Icon size={22} aria-hidden="true" />
      </span>
      <h3 className="text-h3 text-ink">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-small text-muted">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
