import { useRef } from 'react';
import { gsap, useGSAP } from './gsap';
import { DURATION, EASE } from './tokens';
import { prefersReducedMotion } from './reducedMotion';

/**
 * Counts up from 0 on first mount and tweens between values afterwards.
 * Text is written straight to the DOM node (no React re-render per frame), and a
 * screen-reader-only copy always holds the final value.
 */
export default function AnimatedNumber({ value, format = (n) => String(n), duration = DURATION.counter, className = '' }) {
  const textRef = useRef(null);
  const state = useRef({ shown: 0, first: true });
  const target = Number.isFinite(value) ? value : 0;

  useGSAP(
    () => {
      const node = textRef.current;
      if (!node) return;
      const store = state.current;
      if (prefersReducedMotion()) {
        store.shown = target;
        node.textContent = format(target);
        return;
      }
      gsap.to(store, {
        shown: target,
        duration: store.first ? duration : DURATION.slow,
        ease: EASE.strong,
        overwrite: true,
        onUpdate: () => {
          node.textContent = format(Math.round(store.shown));
        },
        onComplete: () => {
          node.textContent = format(target);
        },
      });
      store.first = false;
    },
    { dependencies: [target, format], scope: textRef },
  );

  return (
    <span className={`tabular-nums ${className}`}>
      <span ref={textRef} aria-hidden="true" />
      <span className="sr-only">{format(target)}</span>
    </span>
  );
}
