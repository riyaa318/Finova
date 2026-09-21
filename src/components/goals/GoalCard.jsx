import { useRef } from 'react';
import { CalendarClock, CircleCheck, Pencil, Plus, Trash2, TriangleAlert } from 'lucide-react';
import { useFormatters } from '../../hooks/useFormatters';
import { useHoverLift, useReveal } from '../../motion/hooks';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import GoalGlyph from '../ui/GoalGlyph';
import IconButton from '../ui/IconButton';
import ProgressBar from '../ui/ProgressBar';

function statusBadge(goal) {
  if (goal.status === 'achieved') return { tone: 'success', icon: CircleCheck, text: 'Achieved' };
  if (goal.status === 'overdue') return { tone: 'danger', icon: TriangleAlert, text: 'Past deadline' };
  const days = goal.daysLeft;
  return { tone: days <= 30 ? 'warning' : 'neutral', icon: CalendarClock, text: days === 0 ? 'Due today' : days < 60 ? `${days} days left` : `${Math.round(days / 30)} months left` };
}

export default function GoalCard({ goal, index = 0, onAddMoney, onEdit, onDelete }) {
  const ref = useRef(null);
  const { money, date } = useFormatters();
  useReveal(ref, { delay: (index % 3) * 0.06 });
  useHoverLift(ref);
  const badge = statusBadge(goal);

  return (
    <article ref={ref} className="card flex flex-col p-5">
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-accent/10 text-accent">
            <GoalGlyph name={goal.icon} size={20} />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-h3 text-ink">{goal.title}</h3>
            <Badge tone={badge.tone} icon={badge.icon} className="mt-1">
              {badge.text}
            </Badge>
          </div>
        </div>
        <div className="-mr-1.5 flex shrink-0">
          <IconButton label={`Edit ${goal.title}`} icon={Pencil} size="sm" onClick={() => onEdit(goal)} />
          <IconButton label={`Delete ${goal.title}`} icon={Trash2} size="sm" tone="danger" onClick={() => onDelete(goal)} />
        </div>
      </header>

      <p className="mt-5 flex flex-wrap items-baseline gap-x-1.5 tabular-nums">
        <span className="text-h2 text-ink">{money(goal.currentAmount)}</span>
        <span className="text-small text-muted">of {money(goal.targetAmount)}</span>
      </p>

      <ProgressBar value={goal.percent} tone={goal.status === 'achieved' ? 'success' : 'accent'} label={`${goal.title} progress`} className="mt-3" />

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-small">
        <dt className="text-muted">Progress</dt>
        <dd className="text-right font-semibold tabular-nums text-ink">{Math.round(goal.percent)}%</dd>
        <dt className="text-muted">Remaining</dt>
        <dd className="text-right font-semibold tabular-nums text-ink">{money(goal.remaining)}</dd>
        <dt className="text-muted">Deadline</dt>
        <dd className="text-right tabular-nums text-ink">{date.medium(goal.deadline)}</dd>
      </dl>

      <div className="mt-4 flex flex-1 flex-col justify-end gap-2.5 border-t border-line pt-4">
        {goal.status === 'active' && goal.suggestedMonthly > 0 && <p className="text-caption text-muted">Save about {money(goal.suggestedMonthly)} a month to reach this on time.</p>}
        <Button variant={goal.status === 'achieved' ? 'secondary' : 'primary'} icon={goal.remaining === 0 ? undefined : Plus} fullWidth disabled={goal.remaining === 0} onClick={() => onAddMoney(goal)}>
          {goal.remaining === 0 ? 'Goal complete' : 'Add money'}
        </Button>
      </div>
    </article>
  );
}
