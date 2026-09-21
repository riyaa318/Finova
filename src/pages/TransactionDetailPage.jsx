import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Copy, Pencil, SearchX, Trash2 } from "lucide-react";
import PageHeader from "../components/layout/PageHeader";
import AmountText from "../components/transactions/AmountText";
import StatusBadge from "../components/transactions/StatusBadge";
import TransactionListItem from "../components/transactions/TransactionListItem";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import CategoryIcon from "../components/ui/CategoryIcon";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import { ChartSkeleton } from "../components/ui/LoadingState";
import { useFinance, useToast, useUI } from "../hooks/useContexts";
import { useFormatters } from "../hooks/useFormatters";
import AnimatedNumber from "../motion/AnimatedNumber";
import { useEntrance } from "../motion/hooks";

function Detail({ label, children }) {
  return (
    <div className="border-b border-line py-3.5 last:border-b-0 sm:grid sm:grid-cols-[180px_1fr] sm:gap-4">
      <dt className="text-small font-medium text-muted">{label}</dt>
      <dd className="mt-1 text-small font-semibold text-ink sm:mt-0">
        {children}
      </dd>
    </div>
  );
}

export default function TransactionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { status, transactions, removeTransaction, reload } = useFinance();
  const { openTransactionModal } = useUI();
  const { money, date } = useFormatters();
  const [confirming, setConfirming] = useState(false);
  const summaryRef = useRef(null);
  const relatedRef = useRef(null);
  useEntrance(summaryRef, { delay: 0.12, y: 18 });
  useEntrance(relatedRef, { delay: 0.2, y: 18 });

  const transaction = transactions.find((t) => t.id === id);
  const related = transaction
    ? transactions
        .filter(
          (t) =>
            t.id !== id &&
            (t.merchant === transaction.merchant ||
              t.category === transaction.category),
        )
        .sort(
          (a, b) =>
            Number(b.merchant === transaction.merchant) -
            Number(a.merchant === transaction.merchant),
        )
        .slice(0, 4)
    : [];

  const back = (
    <Button
      as={Link}
      to="/transactions"
      variant="ghost"
      size="sm"
      icon={ArrowLeft}
      className="-ml-3 mb-2"
    >
      Back to transactions
    </Button>
  );

  if (status === "error")
    return (
      <div className="page-container">
        {back}
        <ErrorState onRetry={reload} />
      </div>
    );
  if (status === "loading")
    return (
      <div className="page-container">
        {back}
        <ChartSkeleton height={220} />
      </div>
    );
  if (!transaction) {
    return (
      <div className="page-container">
        {back}
        <div className="card">
          <EmptyState
            icon={SearchX}
            title="Transaction not found"
            description="It may have been deleted, or the link is incorrect."
            action={
              <Button as={Link} to="/transactions">
                View all transactions
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(transaction.id);
      toast.success("Transaction ID copied");
    } catch {
      toast.error("Could not copy. Select the ID and copy it manually.");
    }
  };

  const income = transaction.type === "income";

  return (
    <div className="page-container">
      <PageHeader
        backLink={back}
        title={transaction.merchant}
        description={`${transaction.category}, ${date.long(transaction.date)}`}
        actions={
          <>
            <Button
              variant="secondary"
              icon={Pencil}
              onClick={() => openTransactionModal({ transaction })}
            >
              Edit
            </Button>
            <Button
              variant="danger-outline"
              icon={Trash2}
              onClick={() => setConfirming(true)}
            >
              Delete
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <section
          ref={summaryRef}
          className="card p-5 sm:p-6 lg:col-span-2"
          aria-label="Transaction details"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
            <div className="flex items-center gap-4">
              <CategoryIcon category={transaction.category} size={52} />
              <div>
                <p
                  className={`text-figure tabular-nums ${income ? "text-success" : "text-ink"}`}
                >
                  <span className="sr-only">
                    {income ? "Income" : "Expense"} of{" "}
                  </span>
                  <span aria-hidden="true">{income ? "+" : "\u2212"}</span>
                  <AnimatedNumber value={transaction.amount} format={money} />
                </p>
                <p className="mt-1 text-small text-muted">
                  {income ? "Money received" : "Money spent"}
                </p>
              </div>
            </div>
            <StatusBadge status={transaction.status} />
          </div>

          <dl>
            <Detail label="Merchant">{transaction.merchant}</Detail>
            <Detail label="Amount">
              <AmountText transaction={transaction} />
            </Detail>
            <Detail label="Category">
              <Badge tone="neutral">{transaction.category}</Badge>
            </Detail>
            <Detail label="Date">{date.long(transaction.date)}</Detail>
            <Detail label="Payment method">{transaction.paymentMethod}</Detail>
            <Detail label="Transaction ID">
              <span className="inline-flex items-center gap-2">
                <span className="tabular-nums">{transaction.id}</span>
                <button
                  type="button"
                  onClick={copyId}
                  aria-label="Copy transaction ID"
                  className="rounded p-1 text-muted transition-colors hover:bg-raised hover:text-ink"
                >
                  <Copy size={14} aria-hidden="true" />
                </button>
              </span>
            </Detail>
            <Detail label="Status">
              <StatusBadge status={transaction.status} />
            </Detail>
            <Detail label="Notes">
              {transaction.notes ? (
                <span className="font-medium">{transaction.notes}</span>
              ) : (
                <span className="font-normal text-subtle">No notes added</span>
              )}
            </Detail>
          </dl>
        </section>

        <aside
          ref={relatedRef}
          className="card h-fit p-5"
          aria-label="Related transactions"
        >
          <h2 className="text-h3 text-ink">Related activity</h2>
          <p className="mt-0.5 text-small text-muted">
            Same merchant or category
          </p>
          {related.length ? (
            <ul className="-mx-2 mt-3">
              {related.map((t) => (
                <TransactionListItem key={t.id} transaction={t} />
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-small text-muted">Nothing related yet.</p>
          )}
        </aside>
      </div>

      <ConfirmDialog
        open={confirming}
        title="Delete this transaction?"
        message={`${transaction.merchant} (${transaction.id}) will be removed and your balance and budgets will update. This cannot be undone.`}
        confirmLabel="Delete transaction"
        onClose={() => setConfirming(false)}
        onConfirm={async () => {
          await removeTransaction(transaction.id);
          navigate("/transactions", { replace: true });
        }}
      />
    </div>
  );
}
