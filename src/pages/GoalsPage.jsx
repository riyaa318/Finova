import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Target } from 'lucide-react';
import MetricTile from '../components/cards/MetricTile';
import AddMoneyModal from '../components/goals/AddMoneyModal';
import GoalCard from '../components/goals/GoalCard';
import GoalFormModal from '../components/goals/GoalFormModal';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import { CardGridSkeleton } from '../components/ui/LoadingState';
import { useFinance } from '../hooks/useContexts';
import { useFormatters } from '../hooks/useFormatters';
import { useModalState } from '../hooks/useModalState';

const asPercent = (n) => `${n}%`;

export default function GoalsPage() {
  const { status, goals, reload, removeGoal } = useFinance();
  const { money } = useFormatters();
  const location = useLocation();
  const navigate = useNavigate();
  const form = useModalState(Boolean(location.state?.openForm));
  const addMoney = useModalState();
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    if (location.state?.openForm) navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  // Goals still in progress first (closest deadline on top), completed ones last.
  const sorted = useMemo(() => [...goals].sort((a, b) => Number(a.status === 'achieved') - Number(b.status === 'achieved') || a.deadline.localeCompare(b.deadline)), [goals]);
  const totals = useMemo(() => {
    const saved = goals.reduce((s, g) => s + g.currentAmount, 0);
    const target = goals.reduce((s, g) => s + g.targetAmount, 0);
    return { saved, target, percent: target ? Math.round((saved / target) * 100) : 0, achieved: goals.filter((g) => g.status === 'achieved').length };
  }, [goals]);

  return (
    <div className="page-container">
      <PageHeader
        title="Goals"
        description="Give your savings a target and a deadline, then watch them fill up."
        actions={
          <Button icon={Plus} onClick={() => form.openWith()}>
            Add goal
          </Button>
        }
      />

      {status === 'loading' && <CardGridSkeleton count={6} />}
      {status === 'error' && <ErrorState onRetry={reload} />}
      {status === 'ready' && (
        <>
          {goals.length === 0 ? (
            <div className="card">
              <EmptyState
                icon={Target}
                title="No goals created"
                description="An emergency fund, a new laptop, a trip. Start with one and add money whenever you can."
                action={
                  <Button icon={Plus} onClick={() => form.openWith()}>
                    Create your first goal
                  </Button>
                }
              />
            </div>
          ) : (
            <>
              <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <MetricTile index={0} label="Total saved" value={totals.saved} format={money} />
                <MetricTile index={1} label="Combined target" value={totals.target} format={money} />
                <MetricTile index={2} label="Overall progress" value={totals.percent} format={asPercent} />
                <MetricTile index={3} label="Goals achieved" value={totals.achieved} format={String} hint={`of ${goals.length}`} />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {sorted.map((goal, index) => (
                  <GoalCard key={goal.id} goal={goal} index={index} onAddMoney={addMoney.openWith} onEdit={form.openWith} onDelete={setPendingDelete} />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {form.session > 0 && <GoalFormModal key={`form-${form.session}`} open={form.open} goal={form.payload} onClose={form.close} />}
      {addMoney.session > 0 && addMoney.payload && <AddMoneyModal key={`money-${addMoney.session}`} open={addMoney.open} goal={addMoney.payload} onClose={addMoney.close} />}
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={pendingDelete ? `Delete "${pendingDelete.title}"?` : 'Delete goal?'}
        message="The saved amount goes back to your available balance. This cannot be undone."
        confirmLabel="Delete goal"
        onConfirm={() => removeGoal(pendingDelete.id)}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}
