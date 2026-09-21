import { useId } from 'react';
import { FieldLabel, FieldMessage } from './TextField';

export default function TextArea({ label, error, hint, id, maxLength, value = '', className = '', ...props }) {
  const autoId = useId();
  const areaId = id ?? autoId;
  const messageId = `${areaId}-message`;
  return (
    <div className={className}>
      <div className="flex items-end justify-between">
        <FieldLabel htmlFor={areaId}>{label}</FieldLabel>
        {maxLength && (
          <span aria-hidden="true" className="mb-1.5 text-caption tabular-nums text-subtle">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        id={areaId}
        rows={3}
        value={value}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? messageId : undefined}
        className="field-control resize-none"
        {...props}
      />
      <FieldMessage id={messageId} error={error} hint={hint} />
    </div>
  );
}
