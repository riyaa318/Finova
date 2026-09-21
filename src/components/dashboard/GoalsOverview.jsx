import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Target } from "lucide-react";
import { useFormatters } from "../../hooks/useFormatters";
import { useReveal } from "../../motion/hooks";
import Button from "../ui/Button";
import GoalGlyph from "../ui/GoalGlyph";
import EmptyState from "../ui/EmptyState";
import ProgressBar from "../ui/ProgressBar";

export default function GoalsOverview({ goals }) {
  const ref = useRef(null);
  const { money } = useFormatters();
  useReveal(ref);
  const shown = goals.filter((g) => g.status !== "achieved").slice(0, 3);
  return (
    <section ref={ref} className="card p-5">
      <header className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-h3 text-ink">Financial goals</h2>
          <p className="mt-0.5 text-small text-muted">
            Progress toward what matters
          </p>
        </div>
        <Button
          as={Link}
          to="/goals"
          variant="ghost"
          size="sm"
          iconRight={ArrowRight}
        >
          View all
        </Button>
      </header>
      {shown.length ? (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {shown.map((g) => (
            <li key={g.id} className="rounded-control border border-line p-4">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <GoalGlyph name={g.icon} size={16} />
                </span>
                <span className="truncate text-small font-semibold text-ink">
                  {g.title}
                </span>
                <span className="ml-auto text-small font-semibold tabular-nums text-ink">
                  {Math.round(g.percent)}%
                </span>
              </div>
              <ProgressBar
                value={g.percent}
                label={`${g.title} progress`}
                className="mt-3"
                size="h-1.5"
              />
              <p className="mt-2 text-caption tabular-nums text-muted">
                {money(g.currentAmount)} of {money(g.targetAmount)}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={Target}
          title="No goals created"
          description="Give your savings a target and a deadline."
          className="py-8"
          action={
            <Button as={Link} to="/goals" state={{ openForm: true }}>
              Create a goal
            </Button>
          }
        />
      )}
    </section>
  );
}
