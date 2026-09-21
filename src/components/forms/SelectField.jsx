import { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { FieldLabel, FieldMessage } from './TextField';

/** Native <select> (best keyboard + mobile behaviour) with the app's styling. */
export default function SelectField({ label, options, placeholder, error, hint, id, className = '', ...selectProps }) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const messageId = `${selectId}-message`;
  return (
    <div className={className}>
      <FieldLabel htmlFor={selectId} required={selectProps.required}>
        {label}
      </FieldLabel>
      <div className="relative">
        <select
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
          className="field-control cursor-pointer appearance-none pr-9"
          {...selectProps}
        >
          {placeholder && (
            <option value="" disabled={selectProps.required}>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
      </div>
      <FieldMessage id={messageId} error={error} hint={hint} />
    </div>
  );
}
