import { useId } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useDialogBehavior } from "../../hooks/useDialogBehavior";
import { useOverlayMotion } from "../../motion/useOverlayMotion";
import IconButton from "./IconButton";

const SIZES = { sm: "sm:max-w-md", md: "sm:max-w-lg", lg: "sm:max-w-2xl" };

export default function Modal({
  open,
  onClose,
  title,
  description,
  size = "md",
  children,
  footer,
}) {
  const titleId = useId();
  const descriptionId = useId();
  const { mounted, rootRef, overlayRef, panelRef } = useOverlayMotion({
    open,
    variant: "modal",
  });
  useDialogBehavior({ active: mounted && open, panelRef, onClose });

  if (!mounted) return null;
  return createPortal(
    <div
      ref={rootRef}
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
    >
      <div
        ref={overlayRef}
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-scrim/55 backdrop-blur-[2px]"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={`relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-card border border-line bg-surface shadow-pop outline-none sm:rounded-card ${SIZES[size]}`}
      >
        <header
          data-stagger
          className="flex items-start justify-between gap-4 border-b border-line px-5 py-4"
        >
          <div className="min-w-0">
            <h2 id={titleId} className="text-h2 text-ink">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="mt-0.5 text-small text-muted">
                {description}
              </p>
            )}
          </div>
          <IconButton
            label="Close dialog"
            icon={X}
            size="sm"
            onClick={onClose}
          />
        </header>
        <div className="scrollbar-thin flex-1 overflow-y-auto px-5 py-5">
          {children}
        </div>
        {footer && (
          <footer
            data-stagger
            className="flex flex-col-reverse gap-2 border-t border-line bg-raised/50 px-5 py-3.5 sm:flex-row sm:justify-end"
          >
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body,
  );
}
