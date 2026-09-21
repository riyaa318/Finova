import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "./gsap";
import { EASE } from "./tokens";
import { prefersReducedMotion } from "./reducedMotion";

export function useOverlayMotion({ open, variant = "modal", onExited }) {
  const [mounted, setMounted] = useState(open);
  const rootRef = useRef(null);
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const timeline = useRef(null);
  const exited = useRef(onExited);

  useEffect(() => {
    exited.current = onExited;
  });

  if (open && !mounted) setMounted(true);

  useGSAP(
    () => {
      if (!mounted || !panelRef.current || !overlayRef.current) return;
      const items = gsap.utils.toArray("[data-stagger]", panelRef.current);
      const tl = gsap.timeline({ defaults: { ease: EASE.out } });
      tl.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: "power1.out" },
        0,
      );
      if (variant === "modal") {
        tl.fromTo(
          panelRef.current,
          { opacity: 0, y: 18, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.42 },
          0.03,
        );
      } else {
        const from = variant === "drawer-right" ? 100 : -100;
        tl.fromTo(
          panelRef.current,
          { xPercent: from },
          { xPercent: 0, duration: 0.5, ease: EASE.strong },
          0,
        );
      }
      if (items.length)
        tl.fromTo(
          items,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.04 },
          0.14,
        );
      if (prefersReducedMotion()) tl.progress(1);
      timeline.current = tl;
    },
    { dependencies: [mounted], scope: rootRef, revertOnUpdate: true },
  );

  useEffect(() => {
    const tl = timeline.current;
    if (!mounted) return;
    if (!tl) {
      if (!open) gsap.delayedCall(0, () => setMounted(false));
      return;
    }
    if (open) {
      tl.eventCallback("onReverseComplete", null);
      tl.timeScale(1).play();
    } else {
      tl.eventCallback("onReverseComplete", () => {
        timeline.current = null;
        setMounted(false);
        exited.current?.();
      });
      tl.timeScale(prefersReducedMotion() ? 30 : 1.6).reverse();
    }
  }, [open, mounted]);

  return { mounted, rootRef, overlayRef, panelRef };
}
