import { useMemo } from 'react';
import { FilterX, Plus, Receipt, SearchX } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import Pagination from '../components/transactions/Pagination';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionTable from '../components/transactions/TransactionTable';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import { TableSkeleton } from '../components/ui/LoadingState';
import { useFinance, useUI } from '../hooks/useContexts';
import { useFormatters } from '../hooks/useFormatters';
import { useTransactionFilters } from '../hooks/useTransactionFilters';
import { PAGE_SIZE } from '../utils/constants';
import { isCounted } from '../utils/finance';
import { filterTransactions, paginate, sortTransactions } from '../utils/transactions';

export default function TransactionsPage() {
  const { status, transactions, lastAddedId, reload } = useFinance();
  const { openTransactionModal } = useUI();
  const { money } = useFormatters();
  const { filters, page, setFilters, setPage, clear } = useTransactionFilters();

  const filtered = useMemo(() => sortTransactions(filterTransactions(transactions, filters), filters.sort), [transactions, filters]);
  const paged = useMemo(() => paginate(filtered, page, PAGE_SIZE), [filtered, page]);
  const totals = useMemo(
    () =>
      filtered.filter(isCounted).reduce(
        (acc, t) => {
          acc[t.type] += t.amount;
          return acc;
        },
        { income: 0, expense: 0 },
      ),
    [filtered],
  );
  const viewKey = JSON.stringify([filters, paged.page]);

  return (
    <div className="page-container">
      <PageHeader
        title="Transactions"
        description="Search, filter and manage everything that moves through your account."
      />

      {status === 'error' && <ErrorState onRetry={reload} />}
      {status === 'loading' && <TableSkeleton />}
      {status === 'ready' && (
        <>
          <TransactionFilters filters={filters} onChange={setFilters} onClear={clear} />

          {transactions.length === 0 ? (
            <div className="card">
              <EmptyState
                icon={Receipt}
                title="No transactions yet"
                description="Add your first transaction and it will show up here, in your dashboard and in your charts."
                action={
                  <Button icon={Plus} onClick={() => openTransactionModal()}>
                    Add transaction
                  </Button>
                }
              />
            </div>
          ) : filtered.length === 0 ? (
            <div className="card">
              <EmptyState
                icon={SearchX}
                title="No matching transactions"
                description="Nothing fits the current search and filters. Try broadening them."
                action={
                  <Button variant="secondary" icon={FilterX} onClick={clear}>
                    Clear filters
                  </Button>
                }
              />
            </div>
          ) : (
            <>
              <p className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-small text-muted" aria-live="polite">
                <span>
                  <span className="font-semibold tabular-nums text-ink">{filtered.length}</span> {filtered.length === 1 ? 'transaction' : 'transactions'}
                </span>
                <span>
                  Money in <span className="font-semibold tabular-nums text-success">+{money(totals.income)}</span>
                </span>
                <span>
                  Money out <span className="font-semibold tabular-nums text-ink">{'\u2212'}{money(totals.expense)}</span>
                </span>
              </p>
              <TransactionTable rows={paged.items} viewKey={viewKey} lastAddedId={lastAddedId} onEdit={(transaction) => openTransactionModal({ transaction })} />
              <Pagination {...paged} onChange={setPage} />
            </>
          )}
        </>
      )}
    </div>
  );
}
