import { useId } from 'react';
import { ChevronDown } from 'lucide-react';

/** Compact labelled <select> used in filter bars. `allLabel` is the "no filter" option. */
export default function FilterDropdown({ label, value, onChange, options, allLabel, className = '' }) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-caption font-semibold text-muted">
        {label}
      </label>
      <div className="relative">
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="field-control h-10 cursor-pointer appearance-none py-0 pr-9">
          {allLabel !== undefined && <option value="">{allLabel}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
      </div>
    </div>
  );
}
