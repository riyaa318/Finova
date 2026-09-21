import { useCallback, useRef, useState } from 'react';
import { useFinance } from '../../hooks/useContexts';
import { gsap, useGSAP } from '../../motion/gsap';
import { EASE } from '../../motion/tokens';
import { prefersReducedMotion } from '../../motion/reducedMotion';
import ConfirmDialog from '../ui/ConfirmDialog';
import TransactionRow, { ROW_GRID } from './TransactionRow';

const HEADERS = ['Merchant', 'Category', 'Date', 'Payment method', 'Amount', 'Status'];

/**
 * Accessible grid-based table (role=table). Rows stagger in whenever the view (filters, sort, page) changes,
 * a freshly added row slides in from the top, and a deleted row animates out *before* it is removed.
 */
export default function TransactionTable({ rows, viewKey, lastAddedId, onEdit }) {
  const { removeTransaction } = useFinance();
  const bodyRef = useRef(null);
  const rowEls = useRef(new Map());
  const [pendingDelete, setPendingDelete] = useState(null);

  const registerRow = useCallback((id, el) => {
    if (el) rowEls.current.set(id, el);
    else rowEls.current.delete(id);
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !bodyRef.current) return;
      const targets = gsap.utils.toArray('[data-row]', bodyRef.current).filter((el) => el.dataset.rowNew !== 'true');
      if (!targets.length) return;
      gsap.fromTo(targets, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.38, stagger: 0.035, ease: EASE.out, clearProps: 'opacity,transform' });
    },
    { dependencies: [viewKey], scope: bodyRef },
  );

  useGSAP(
    () => {
      const el = lastAddedId && rowEls.current.get(lastAddedId);
      if (!el || prefersReducedMotion()) return;
      gsap.fromTo(el, { opacity: 0, y: -22, scale: 0.985 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: EASE.out, clearProps: 'opacity,transform' });
    },
    { dependencies: [lastAddedId], scope: bodyRef },
  );

  const animateOut = (id) =>
    new Promise((resolve) => {
      const el = rowEls.current.get(id);
      if (!el || prefersReducedMotion()) {
        resolve();
        return;
      }
      gsap
        .timeline({ onComplete: resolve })
        .to(el, { opacity: 0, x: -28, duration: 0.25, ease: EASE.in })
        .to(el, { height: 0, paddingTop: 0, paddingBottom: 0, borderBottomWidth: 0, duration: 0.25, ease: EASE.inOut });
    });

  const confirmDelete = async () => {
    const id = pendingDelete.id;
    try {
      await animateOut(id);
      await removeTransaction(id);
    } catch (error) {
      // put the row back so the list matches reality
      const el = rowEls.current.get(id);
      if (el) gsap.set(el, { clearProps: 'all' });
      throw error;
    }
  };

  return (
    <>
      <div role="table" aria-label="Transactions" className="card overflow-hidden">
        <div role="row" className={`hidden border-b border-line bg-raised/50 px-4 py-2.5 text-caption font-semibold text-muted md:grid ${ROW_GRID}`}>
          {HEADERS.map((h) => (
            <div key={h} role="columnheader" className={h === 'Amount' ? 'text-right' : ''}>
              {h}
            </div>
          ))}
          <div role="columnheader" className="sr-only">
            Actions
          </div>
        </div>
        <div role="rowgroup" ref={bodyRef}>
          {rows.map((t) => (
            <TransactionRow key={t.id} transaction={t} isNew={t.id === lastAddedId} registerRow={registerRow} onEdit={onEdit} onDelete={setPendingDelete} />
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this transaction?"
        message={pendingDelete ? `${pendingDelete.merchant} (${pendingDelete.id}) will be removed and your balance and budgets will update. This cannot be undone.` : ''}
        confirmLabel="Delete transaction"
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </>
  );
}
