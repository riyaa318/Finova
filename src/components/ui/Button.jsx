import { useRef } from "react";
import { Loader2 } from "lucide-react";
import { useButtonMotion } from "../../motion/hooks";

const VARIANTS = {
  primary: "bg-accent text-accent-fg hover:bg-accent-strong",
  secondary: "border border-line-strong bg-surface text-ink hover:bg-raised",
  ghost: "text-muted hover:bg-raised hover:text-ink",
  danger: "bg-danger text-canvas hover:brightness-110",
  "danger-outline": "border border-danger/40 text-danger hover:bg-danger/10",
};

const SIZES = {
  sm: "h-8 gap-1.5 px-3 text-caption",
  md: "h-10 gap-2 px-4 text-small",
  lg: "h-11 gap-2 px-5 text-body",
};

export default function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  fullWidth = false,
  className = "",
  children,
  disabled,
  ...rest
}) {
  const ref = useRef(null);
  const iconRef = useRef(null);
  const sheenRef = useRef(null);
  useButtonMotion(ref, {
    iconRef: IconRight ? undefined : iconRef,
    sheenRef: variant === "primary" ? sheenRef : undefined,
  });

  const isNative = Component === "button";
  return (
    <Component
      ref={ref}
      {...(isNative
        ? { type: rest.type ?? "button", disabled: disabled || loading }
        : {})}
      aria-busy={loading || undefined}
      className={`relative inline-flex select-none items-center justify-center overflow-hidden whitespace-nowrap rounded-control font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-55 ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {variant === "primary" && (
        <span
          ref={sheenRef}
          aria-hidden="true"
          style={{ opacity: 0 }}
          className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />
      )}
      {loading ? (
        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
      ) : (
        Icon && (
          <span ref={iconRef} className="inline-flex" aria-hidden="true">
            <Icon size={16} strokeWidth={2.25} />
          </span>
        )
      )}
      {children}
      {IconRight && !loading && (
        <IconRight size={16} strokeWidth={2.25} aria-hidden="true" />
      )}
    </Component>
  );
}
