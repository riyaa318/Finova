import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Plus, Receipt } from "lucide-react";
import { useUI } from "../../hooks/useContexts";
import { useReveal } from "../../motion/hooks";
import TransactionListItem from "../transactions/TransactionListItem";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";

export default function RecentTransactions({ transactions, className = "" }) {
  const ref = useRef(null);
  const { openTransactionModal } = useUI();
  useReveal(ref);
  return (
    <section ref={ref} className={`card p-5 ${className}`}>
      <header className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-h3 text-ink">Recent transactions</h2>
          <p className="mt-0.5 text-small text-muted">Your latest activity</p>
        </div>
        <Button
          as={Link}
          to="/transactions"
          variant="ghost"
          size="sm"
          iconRight={ArrowRight}
        >
          View all
        </Button>
      </header>
      {transactions.length ? (
        <ul className="-mx-2">
          {transactions.slice(0, 6).map((t) => (
            <TransactionListItem key={t.id} transaction={t} />
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={Receipt}
          title="No transactions yet"
          description="Add your first income or expense to start tracking."
          action={
            <Button icon={Plus} onClick={() => openTransactionModal()}>
              Add transaction
            </Button>
          }
        />
      )}
    </section>
  );
}
