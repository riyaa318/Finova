import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PiggyBank, Plus } from 'lucide-react';
import BudgetCard from '../components/budgets/BudgetCard';
import BudgetFormModal from '../components/budgets/BudgetFormModal';
import MetricTile from '../components/cards/MetricTile';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import { CardGridSkeleton } from '../components/ui/LoadingState';
import { useFinance } from '../hooks/useContexts';
import { useFormatters } from '../hooks/useFormatters';
import { useModalState } from '../hooks/useModalState';

const SEVERITY = { exceeded: 0, warning: 1, healthy: 2 };
const asCount = (n) => String(n);

export default function BudgetsPage() {
  const { status, budgets, reload, removeBudget } = useFinance();
  const { money } = useFormatters();
  const location = useLocation();
  const navigate = useNavigate();
  const form = useModalState(Boolean(location.state?.openForm));
  const [pendingDelete, setPendingDelete] = useState(null);

  // Quick actions link here with { openForm: true }; clear it so a refresh does not reopen the dialog.
  useEffect(() => {
    if (location.state?.openForm) navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  const sorted = useMemo(() => [...budgets].sort((a, b) => SEVERITY[a.status] - SEVERITY[b.status] || b.percent - a.percent), [budgets]);
  const totals = useMemo(() => {
    const limit = budgets.reduce((s, b) => s + b.limit, 0);
    const spent = budgets.reduce((s, b) => s + b.spent, 0);
    return { limit, spent, remaining: limit - spent, attention: budgets.filter((b) => b.status !== 'healthy').length };
  }, [budgets]);

  return (
    <div className="page-container">
      <PageHeader
        title="Budgets"
        description="Monthly spending limits, tracked against your last 30 days."
        actions={
          <Button icon={Plus} onClick={() => form.openWith()}>
            Add budget
          </Button>
        }
      />

      {status === 'loading' && <CardGridSkeleton count={6} />}
      {status === 'error' && <ErrorState onRetry={reload} />}
      {status === 'ready' && (
        <>
          {budgets.length === 0 ? (
            <div className="card">
              <EmptyState
                icon={PiggyBank}
                title="No budgets created"
                description="Pick a category and set a monthly limit. FINOVA will warn you as you get close."
                action={
                  <Button icon={Plus} onClick={() => form.openWith()}>
                    Create your first budget
                  </Button>
                }
              />
            </div>
          ) : (
            <>
              <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <MetricTile index={0} label="Total budgeted" value={totals.limit} format={money} />
                <MetricTile index={1} label="Spent so far" value={totals.spent} format={money} />
                <MetricTile index={2} label={totals.remaining < 0 ? 'Over budget by' : 'Remaining'} value={Math.abs(totals.remaining)} format={money} />
                <MetricTile index={3} label="Need attention" value={totals.attention} format={asCount} hint={totals.attention ? 'Warning or exceeded' : 'All within limits'} />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {sorted.map((budget, index) => (
                  <BudgetCard key={budget.id} budget={budget} index={index} onEdit={form.openWith} onDelete={setPendingDelete} />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {form.session > 0 && <BudgetFormModal key={`form-${form.session}`} open={form.open} budget={form.payload} existingCategories={budgets.map((b) => b.category)} onClose={form.close} />}
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={pendingDelete ? `Delete ${pendingDelete.category} budget?` : 'Delete budget?'}
        message="Your transactions stay untouched. Only the spending limit is removed."
        confirmLabel="Delete budget"
        onConfirm={() => removeBudget(pendingDelete.id)}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}
