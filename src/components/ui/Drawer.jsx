import { useId } from 'react';
import { createPortal } from 'react-dom';
import { useDialogBehavior } from '../../hooks/useDialogBehavior';
import { useOverlayMotion } from '../../motion/useOverlayMotion';

/** Side sheet used for the mobile navigation. Overlay fades, panel slides, children stagger; closing reverses it. */
export default function Drawer({ open, onClose, label, side = 'left', children }) {
  const labelId = useId();
  const { mounted, rootRef, overlayRef, panelRef } = useOverlayMotion({ open, variant: side === 'left' ? 'drawer-left' : 'drawer-right' });
  useDialogBehavior({ active: mounted && open, panelRef, onClose });

  if (!mounted) return null;
  return createPortal(
    <div ref={rootRef} className="fixed inset-0 z-50">
      <div ref={overlayRef} aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-scrim/55 backdrop-blur-[2px]" />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        tabIndex={-1}
        className={`absolute inset-y-0 flex w-[86%] max-w-xs flex-col border-line bg-surface shadow-pop outline-none ${side === 'left' ? 'left-0 border-r' : 'right-0 border-l'}`}
      >
        <h2 id={labelId} className="sr-only">
          {label}
        </h2>
        {children}
      </aside>
    </div>,
    document.body,
  );
}
