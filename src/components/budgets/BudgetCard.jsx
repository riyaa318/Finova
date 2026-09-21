import { useRef } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useFormatters } from "../../hooks/useFormatters";
import { useHoverLift, useReveal } from "../../motion/hooks";
import Badge from "../ui/Badge";
import CategoryIcon from "../ui/CategoryIcon";
import IconButton from "../ui/IconButton";
import ProgressBar from "../ui/ProgressBar";
import { BUDGET_STATUS } from "./budgetStatus";

export default function BudgetCard({ budget, index = 0, onEdit, onDelete }) {
  const ref = useRef(null);
  const { money } = useFormatters();
  useReveal(ref, { delay: (index % 3) * 0.06 });
  useHoverLift(ref);
  const status = BUDGET_STATUS[budget.status];
  const over = budget.remaining < 0;

  return (
    <article ref={ref} className="card flex flex-col p-5">
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <CategoryIcon category={budget.category} size={42} />
          <div className="min-w-0">
            <h3 className="truncate text-h3 text-ink">{budget.category}</h3>
            <Badge tone={status.tone} icon={status.icon} className="mt-1">
              {status.label}
            </Badge>
          </div>
        </div>
        <div className="-mr-1.5 flex shrink-0">
          <IconButton
            label={`Edit ${budget.category} budget`}
            icon={Pencil}
            size="sm"
            onClick={() => onEdit(budget)}
          />
          <IconButton
            label={`Delete ${budget.category} budget`}
            icon={Trash2}
            size="sm"
            tone="danger"
            onClick={() => onDelete(budget)}
          />
        </div>
      </header>

      <p className="mt-5 flex flex-wrap items-baseline gap-x-1.5 tabular-nums">
        <span className="text-h2 text-ink">{money(budget.spent)}</span>
        <span className="text-small text-muted">of {money(budget.limit)}</span>
      </p>

      <ProgressBar
        value={budget.percent}
        tone={status.bar}
        label={`${budget.category} budget used`}
        className="mt-3"
      />

      <footer className="mt-3 flex items-center justify-between text-small">
        <span
          className={`font-semibold tabular-nums ${over ? "text-danger" : "text-muted"}`}
        >
          {Math.round(budget.percent)}% used
        </span>
        <span
          className={`tabular-nums ${over ? "font-semibold text-danger" : "text-muted"}`}
        >
          {over
            ? `${money(-budget.remaining)} over budget`
            : `${money(budget.remaining)} left`}
        </span>
      </footer>
    </article>
  );
}
