import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "../../motion/gsap";
import { EASE } from "../../motion/tokens";
import { prefersReducedMotion } from "../../motion/reducedMotion";

export default function SegmentedControl({
  options,
  value,
  onChange,
  label,
  size = "md",
  className = "",
}) {
  const groupRef = useRef(null);
  const pillRef = useRef(null);
  const buttons = useRef({});
  const first = useRef(true);

  const place = (animate) => {
    const target = buttons.current[value];
    if (!target || !pillRef.current) return;
    const props = { x: target.offsetLeft, width: target.offsetWidth };
    if (animate && !prefersReducedMotion())
      gsap.to(pillRef.current, {
        ...props,
        duration: 0.4,
        ease: EASE.strong,
        overwrite: true,
      });
    else gsap.set(pillRef.current, props);
  };

  useGSAP(
    () => {
      place(!first.current);
      first.current = false;
    },
    { dependencies: [value, options.length], scope: groupRef },
  );

  useEffect(() => {
    const onResize = () => place(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  });

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label={label}
      className={`relative inline-flex max-w-full overflow-x-auto rounded-control bg-raised p-1 scrollbar-thin ${className}`}
    >
      <span
        ref={pillRef}
        aria-hidden="true"
        className="absolute inset-y-1 left-0 rounded-[8px] bg-surface shadow-card ring-1 ring-line"
      />
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            ref={(el) => {
              buttons.current[option.value] = el;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={`relative z-10 whitespace-nowrap rounded-[8px] font-semibold transition-colors duration-150 ${size === "sm" ? "px-3 py-1 text-caption" : "px-3.5 py-1.5 text-small"} ${selected ? "text-ink" : "text-muted hover:text-ink"}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
