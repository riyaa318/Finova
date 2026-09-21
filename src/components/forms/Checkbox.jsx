import { useId } from "react";

export default function Checkbox({ label, id, className = "", ...props }) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <label
      htmlFor={inputId}
      className={`inline-flex cursor-pointer items-center gap-2 text-small font-medium text-muted ${className}`}
    >
      <input
        id={inputId}
        type="checkbox"
        className="h-4 w-4 cursor-pointer rounded border-line-strong accent-[rgb(var(--accent))]"
        {...props}
      />
      {label}
    </label>
  );
}
