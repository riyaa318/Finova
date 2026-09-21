const TONES = {
  neutral: "bg-raised text-muted",
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  info: "bg-info/10 text-info",
};

export default function Badge({
  tone = "neutral",
  icon: Icon,
  children,
  className = "",
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-caption font-semibold ${TONES[tone]} ${className}`}
    >
      {Icon && <Icon size={12} strokeWidth={2.5} aria-hidden="true" />}
      {children}
    </span>
  );
}
