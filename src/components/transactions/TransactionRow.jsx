import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { useFormatters } from "../../hooks/useFormatters";
import CategoryIcon from "../ui/CategoryIcon";
import IconButton from "../ui/IconButton";
import AmountText from "./AmountText";
import StatusBadge from "./StatusBadge";

export const ROW_GRID =
  "grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 md:grid-cols-[minmax(0,2.3fr)_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1.3fr)_minmax(0,1fr)_76px] md:gap-x-4";

export default function TransactionRow({
  transaction: t,
  isNew,
  registerRow,
  onEdit,
  onDelete,
}) {
  const { date } = useFormatters();
  return (
    <div
      ref={(el) => registerRow(t.id, el)}
      role="row"
      data-row
      data-row-new={isNew ? "true" : undefined}
      className={`group relative items-center overflow-hidden border-b border-line px-4 py-3 transition-colors duration-700 last:border-b-0 hover:bg-raised/60 ${ROW_GRID} ${isNew ? "bg-accent/10" : ""}`}
    >
      <div role="cell" className="flex min-w-0 items-center gap-3">
        <CategoryIcon category={t.category} size={38} />
        <div className="min-w-0">
          <Link
            to={`/transactions/${t.id}`}
            className="block truncate text-small font-semibold text-ink after:absolute after:inset-0 after:content-['']"
          >
            {t.merchant}
          </Link>
          <p className="truncate text-caption text-muted md:hidden">
            {t.category}, {date.short(t.date)}, {t.paymentMethod}
          </p>
          <p className="hidden truncate text-caption text-subtle md:block">
            {t.notes || t.id}
          </p>
        </div>
      </div>

      <div role="cell" className="hidden text-small text-ink md:block">
        {t.category}
      </div>
      <div role="cell" className="hidden text-small text-muted md:block">
        {date.medium(t.date)}
      </div>
      <div
        role="cell"
        className="hidden truncate text-small text-muted md:block"
      >
        {t.paymentMethod}
      </div>

      <div
        role="cell"
        className="flex flex-col items-end gap-1 md:block md:text-right"
      >
        <AmountText transaction={t} className="text-small" />
        <span className="md:hidden">
          <StatusBadge status={t.status} />
        </span>
      </div>

      <div role="cell" className="hidden md:block">
        <StatusBadge status={t.status} />
      </div>

      <div
        role="cell"
        className="relative z-10 hidden justify-end gap-0.5 md:flex"
      >
        <IconButton
          label={`Edit ${t.merchant}`}
          icon={Pencil}
          size="sm"
          onClick={() => onEdit(t)}
        />
        <IconButton
          label={`Delete ${t.merchant}`}
          icon={Trash2}
          size="sm"
          tone="danger"
          onClick={() => onDelete(t)}
        />
      </div>
    </div>
  );
}
