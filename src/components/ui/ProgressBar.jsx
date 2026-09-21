import { useRef } from 'react';
import { gsap, useGSAP } from '../../motion/gsap';
import { EASE } from '../../motion/tokens';
import { prefersReducedMotion } from '../../motion/reducedMotion';

const FILLS = { accent: 'bg-accent', success: 'bg-success', warning: 'bg-warning', danger: 'bg-danger' };

/**
 * Animated progress bar. GSAP owns the fill width: 0 -> value on first view (ScrollTrigger),
 * then old -> new whenever `value` changes. Exceeded bars get one gentle halo pulse.
 */
export default function ProgressBar({ value, tone = 'accent', label, className = '', delay = 0, size = 'h-2' }) {
  const trackRef = useRef(null);
  const fillRef = useRef(null);
  const first = useRef(true);
  const pct = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));

  useGSAP(
    () => {
      const fill = fillRef.current;
      const track = trackRef.current;
      if (!fill || !track) return;
      if (prefersReducedMotion()) {
        gsap.set(fill, { width: `${pct}%` });
        first.current = false;
        return;
      }
      const pulse = () => {
        if (tone !== 'danger') return;
        gsap.fromTo(track, { boxShadow: '0 0 0 0 rgba(239,68,68,0)' }, { boxShadow: '0 0 0 4px rgba(239,68,68,0.2)', duration: 0.9, yoyo: true, repeat: 1, ease: 'sine.inOut' });
      };
      if (first.current) {
        gsap.fromTo(
          fill,
          { width: '0%' },
          { width: `${pct}%`, duration: 1, delay, ease: EASE.emphasis, onComplete: pulse, scrollTrigger: { trigger: track, start: 'top 96%', once: true } },
        );
        first.current = false;
      } else {
        gsap.to(fill, { width: `${pct}%`, duration: 0.8, ease: EASE.out, overwrite: true, onComplete: pulse });
      }
    },
    { dependencies: [pct, tone], scope: trackRef },
  );

  return (
    <div
      ref={trackRef}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      className={`w-full overflow-hidden rounded-full bg-raised ${size} ${className}`}
    >
      <div ref={fillRef} className={`h-full w-0 rounded-full ${FILLS[tone]}`} />
    </div>
  );
}
