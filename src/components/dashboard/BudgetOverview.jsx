import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, PiggyBank } from "lucide-react";
import { useFormatters } from "../../hooks/useFormatters";
import { useReveal } from "../../motion/hooks";
import { BUDGET_STATUS } from "../budgets/budgetStatus";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import ProgressBar from "../ui/ProgressBar";

export default function BudgetOverview({ budgets, className = "" }) {
  const ref = useRef(null);
  const { money } = useFormatters();
  useReveal(ref, { delay: 0.05 });
  const top = [...budgets].sort((a, b) => b.percent - a.percent).slice(0, 5);
  return (
    <section ref={ref} className={`card p-5 ${className}`}>
      <header className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-h3 text-ink">Budget overview</h2>
          <p className="mt-0.5 text-small text-muted">
            Highest usage, last 30 days
          </p>
        </div>
        <Button
          as={Link}
          to="/budgets"
          variant="ghost"
          size="sm"
          iconRight={ArrowRight}
        >
          Manage
        </Button>
      </header>
      {top.length ? (
        <ul className="space-y-4">
          {top.map((b) => {
            const status = BUDGET_STATUS[b.status];
            return (
              <li key={b.id}>
                <div className="mb-1.5 flex items-center justify-between gap-2 text-small">
                  <span className="flex min-w-0 items-center gap-1.5 font-semibold text-ink">
                    <status.icon
                      size={14}
                      className={
                        b.status === "healthy"
                          ? "text-success"
                          : b.status === "warning"
                            ? "text-warning"
                            : "text-danger"
                      }
                      aria-label={status.label}
                    />
                    <span className="truncate">{b.category}</span>
                  </span>
                  <span className="shrink-0 tabular-nums text-muted">
                    {money(b.spent)} / {money(b.limit)}
                  </span>
                </div>
                <ProgressBar
                  value={b.percent}
                  tone={status.bar}
                  label={`${b.category} budget used`}
                  size="h-1.5"
                />
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState
          icon={PiggyBank}
          title="No budgets created"
          description="Set limits to see how spending compares."
          className="py-8"
          action={
            <Button as={Link} to="/budgets" state={{ openForm: true }}>
              Create a budget
            </Button>
          }
        />
      )}
    </section>
  );
}
