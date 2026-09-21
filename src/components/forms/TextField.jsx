import { useId } from "react";
import { CircleAlert } from "lucide-react";

export function FieldMessage({ id, error, hint }) {
  if (error) {
    return (
      <p
        id={id}
        className="mt-1.5 flex items-start gap-1 text-caption font-medium text-danger"
      >
        <CircleAlert size={13} className="mt-px shrink-0" aria-hidden="true" />
        {error}
      </p>
    );
  }
  return hint ? (
    <p id={id} className="mt-1.5 text-caption text-subtle">
      {hint}
    </p>
  ) : null;
}

export function FieldLabel({ htmlFor, required, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-small font-semibold text-ink"
    >
      {children}
      {required && (
        <span className="text-danger" aria-hidden="true">
          {" "}
          *
        </span>
      )}
    </label>
  );
}

export default function TextField({
  label,
  error,
  hint,
  prefix,
  suffix,
  id,
  className = "",
  ...inputProps
}) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const messageId = `${inputId}-message`;
  return (
    <div className={className}>
      <FieldLabel htmlFor={inputId} required={inputProps.required}>
        {label}
      </FieldLabel>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-small font-semibold text-muted">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
          className={`field-control ${prefix ? "pl-8" : ""} ${suffix ? "pr-11" : ""}`}
          {...inputProps}
        />
        {suffix && (
          <span className="absolute inset-y-0 right-1 flex items-center">
            {suffix}
          </span>
        )}
      </div>
      <FieldMessage id={messageId} error={error} hint={hint} />
    </div>
  );
}
