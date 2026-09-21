import { useId } from 'react';

/** Switch with a visible label + description; announced as role="switch". */
export default function Toggle({ label, description, checked, onChange, disabled = false, className = '' }) {
  const labelId = useId();
  const descId = useId();
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div className="min-w-0">
        <p id={labelId} className="text-small font-semibold text-ink">
          {label}
        </p>
        {description && (
          <p id={descId} className="mt-0.5 text-caption text-muted">
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        aria-describedby={description ? descId : undefined}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors duration-200 disabled:opacity-50 ${checked ? 'bg-accent' : 'bg-line-strong'}`}
      >
        <span aria-hidden="true" className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-surface shadow transition-transform duration-200 ${checked ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  );
}
