import { useEffect, useState } from 'react';
import { FilterX, SlidersHorizontal } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { ALL_CATEGORIES, DATE_RANGE_OPTIONS, PAYMENT_METHODS, SORT_OPTIONS } from '../../utils/constants';
import { activeFilterCount } from '../../utils/transactions';
import FilterDropdown from '../forms/FilterDropdown';
import SearchInput from '../forms/SearchInput';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const asOptions = (list) => list.map((v) => ({ value: v, label: v }));
const TYPE_OPTIONS = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
];

export default function TransactionFilters({ filters, onChange, onClear }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [text, setText] = useState(filters.q);
  const [seenQuery, setSeenQuery] = useState(filters.q);
  const debounced = useDebounce(text, 300);
  const count = activeFilterCount(filters);

  // Adopt outside changes to ?q= (top bar search, "clear filters") without fighting the user's typing.
  if (filters.q !== seenQuery) {
    setSeenQuery(filters.q);
    if (filters.q !== debounced) setText(filters.q);
  }

  useEffect(() => {
    if (debounced !== filters.q) onChange({ q: debounced });
    // only react to the debounced value; `filters.q` changes are handled above
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return (
    <section aria-label="Filter transactions" className="card mb-4 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput value={text} onChange={setText} placeholder="Search transactions" label="Search transactions" className="flex-1" />
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon={SlidersHorizontal} onClick={() => setPanelOpen((v) => !v)} aria-expanded={panelOpen} aria-controls="filter-panel" className="lg:hidden">
            Filters
            {count > 0 && <Badge tone="accent">{count}</Badge>}
          </Button>
          {count > 0 && (
            <Button variant="ghost" icon={FilterX} onClick={onClear}>
              Clear filters
            </Button>
          )}
        </div>
      </div>

      <div id="filter-panel" className={`mt-4 grid-cols-2 gap-3 md:grid-cols-3 lg:grid lg:grid-cols-6 ${panelOpen ? 'grid' : 'hidden'}`}>
        <FilterDropdown label="Category" allLabel="All categories" value={filters.category} onChange={(category) => onChange({ category })} options={asOptions(ALL_CATEGORIES)} />
        <FilterDropdown label="Type" allLabel="All types" value={filters.type} onChange={(type) => onChange({ type })} options={TYPE_OPTIONS} />
        <FilterDropdown label="Date" value={filters.range} onChange={(range) => onChange({ range })} options={DATE_RANGE_OPTIONS} />
        <FilterDropdown label="Payment method" allLabel="All methods" value={filters.method} onChange={(method) => onChange({ method })} options={asOptions(PAYMENT_METHODS)} />
        <FilterDropdown label="Sort by" value={filters.sort} onChange={(sort) => onChange({ sort })} options={SORT_OPTIONS} className="col-span-2 md:col-span-1 lg:col-span-2" />
        {filters.range === 'custom' && (
          <div className="col-span-2 grid grid-cols-2 gap-3 md:col-span-3 lg:col-span-6 lg:max-w-md">
            <label className="text-caption font-semibold text-muted">
              From
              <input type="date" value={filters.from} max={filters.to || undefined} onChange={(e) => onChange({ from: e.target.value })} className="field-control mt-1 h-10 py-0" />
            </label>
            <label className="text-caption font-semibold text-muted">
              To
              <input type="date" value={filters.to} min={filters.from || undefined} onChange={(e) => onChange({ to: e.target.value })} className="field-control mt-1 h-10 py-0" />
            </label>
          </div>
        )}
      </div>
    </section>
  );
}
