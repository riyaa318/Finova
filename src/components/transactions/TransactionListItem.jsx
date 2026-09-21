import { Link } from 'react-router-dom';
import { useFormatters } from '../../hooks/useFormatters';
import CategoryIcon from '../ui/CategoryIcon';
import AmountText from './AmountText';

/** Compact row used in dashboards and "related transactions" lists. */
export default function TransactionListItem({ transaction }) {
  const { date } = useFormatters();
  return (
    <li>
      <Link to={`/transactions/${transaction.id}`} className="flex items-center gap-3 rounded-control px-2 py-2.5 transition-colors hover:bg-raised">
        <CategoryIcon category={transaction.category} size={38} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-small font-semibold text-ink">{transaction.merchant}</span>
          <span className="block truncate text-caption text-muted">
            {transaction.category}, {date.short(transaction.date)}
            {transaction.status !== 'completed' && `, ${transaction.status}`}
          </span>
        </span>
        <AmountText transaction={transaction} className="text-small" />
      </Link>
    </li>
  );
}
