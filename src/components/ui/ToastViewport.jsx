import { useCallback, useRef } from "react";
import { CircleAlert, CircleCheck, Info, X } from "lucide-react";
import { gsap, useGSAP } from "../../motion/gsap";
import { EASE } from "../../motion/tokens";
import { prefersReducedMotion } from "../../motion/reducedMotion";

const TONES = {
  success: { icon: CircleCheck, className: "text-success" },
  error: { icon: CircleAlert, className: "text-danger" },
  info: { icon: Info, className: "text-info" },
};

function Toast({ toast, onRemove }) {
  const ref = useRef(null);
  const { icon: Icon, className } = TONES[toast.tone] ?? TONES.info;

  const dismiss = useCallback(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) {
      onRemove(toast.id);
      return;
    }
    gsap.to(el, {
      opacity: 0,
      x: 28,
      duration: 0.25,
      ease: EASE.in,
      overwrite: true,
      onComplete: () => onRemove(toast.id),
    });
  }, [onRemove, toast.id]);

  useGSAP(
    () => {
      if (!prefersReducedMotion())
        gsap.from(ref.current, {
          opacity: 0,
          y: 18,
          scale: 0.96,
          duration: 0.4,
          ease: EASE.out,
        });
      gsap.delayedCall(toast.duration / 1000, dismiss);
    },
    { scope: ref, dependencies: [dismiss] },
  );

  return (
    <div
      ref={ref}
      className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-card border border-line bg-surface p-3.5 shadow-pop"
    >
      <Icon
        size={18}
        className={`mt-0.5 shrink-0 ${className}`}
        aria-hidden="true"
      />
      <p className="min-w-0 flex-1 text-small font-medium text-ink">
        {toast.message}
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss notification"
        className="-m-1 rounded p-1 text-subtle transition-colors hover:text-ink"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}

export default function ToastViewport({ toasts, onRemove }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-20 z-[60] flex flex-col items-center gap-2 md:inset-x-auto md:bottom-6 md:right-6 md:items-end"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}
