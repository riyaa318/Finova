import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useFormatters } from '../../hooks/useFormatters';

/**
 * Income vs expense never relies on colour alone: income carries a "+" and a down-left arrow,
 * expenses a minus sign and an up-right arrow. Failed payments are struck through.
 */
export default function AmountText({ transaction, className = '', showIcon = true }) {
  const { signed } = useFormatters();
  const income = transaction.type === 'income';
  const Icon = income ? ArrowDownLeft : ArrowUpRight;
  return (
    <span className={`inline-flex items-center gap-1 font-semibold tabular-nums ${income ? 'text-success' : 'text-ink'} ${transaction.status === 'failed' ? 'line-through opacity-60' : ''} ${className}`}>
      {showIcon && <Icon size={14} strokeWidth={2.5} aria-hidden="true" />}
      <span className="sr-only">{income ? 'Income' : 'Expense'}: </span>
      {signed(income ? transaction.amount : -transaction.amount)}
    </span>
  );
}
