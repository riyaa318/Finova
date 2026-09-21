import { useRef } from "react";
import { gsap, useGSAP } from "../../motion/gsap";
import { EASE } from "../../motion/tokens";
import { prefersReducedMotion } from "../../motion/reducedMotion";

export default function PulseDot({ cx, cy, stroke }) {
  const ref = useRef(null);
  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      gsap.from(ref.current, {
        scale: 0.2,
        opacity: 0,
        svgOrigin: `${cx} ${cy}`,
        duration: 0.3,
        ease: EASE.pop,
      });
    },
    { scope: ref },
  );
  if (cx == null || cy == null) return null;
  return (
    <circle
      ref={ref}
      cx={cx}
      cy={cy}
      r={5}
      fill="rgb(var(--surface))"
      stroke={stroke}
      strokeWidth={2.5}
    />
  );
}
