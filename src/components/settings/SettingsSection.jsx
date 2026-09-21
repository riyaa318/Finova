import { useId } from "react";

export default function SettingsSection({
  title,
  description,
  children,
  className = "",
}) {
  const id = useId();
  return (
    <section aria-labelledby={id} className={`card p-5 sm:p-6 ${className}`}>
      <h2 id={id} className="text-h3 text-ink">
        {title}
      </h2>
      {description && (
        <p className="mt-0.5 text-small text-muted">{description}</p>
      )}
      <div className="mt-5">{children}</div>
    </section>
  );
}
