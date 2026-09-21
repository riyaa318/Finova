import { useRef } from "react";
import { gsap, useGSAP } from "../../motion/gsap";
import { EASE } from "../../motion/tokens";
import { prefersReducedMotion } from "../../motion/reducedMotion";

export default function ChartCard({
  title,
  description,
  actions,
  legend,
  children,
  index = 0,
  reveal = "wipe",
  updateKey,
  className = "",
  bodyClassName = "",
}) {
  const cardRef = useRef(null);
  const bodyRef = useRef(null);
  const seen = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !cardRef.current) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 92%",
          once: true,
        },
      });
      tl.from(cardRef.current, {
        opacity: 0,
        y: 22,
        duration: 0.55,
        delay: index * 0.08,
        ease: EASE.out,
        clearProps: "opacity,transform",
      });
      if (reveal === "wipe") {
        tl.fromTo(
          bodyRef.current,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 0.95,
            ease: EASE.emphasis,
            clearProps: "clipPath",
          },
          "-=0.3",
        );
      } else {
        tl.fromTo(
          bodyRef.current,
          { opacity: 0, scale: 0.92 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: EASE.out,
            clearProps: "opacity,transform",
          },
          "-=0.3",
        );
      }
    },
    { scope: cardRef },
  );

  useGSAP(
    () => {
      if (
        seen.current !== null &&
        seen.current !== updateKey &&
        !prefersReducedMotion()
      ) {
        gsap.fromTo(
          bodyRef.current,
          { opacity: 0.35 },
          { opacity: 1, duration: 0.5, ease: EASE.soft, clearProps: "opacity" },
        );
      }
      seen.current = updateKey;
    },
    { dependencies: [updateKey], scope: cardRef },
  );

  return (
    <section ref={cardRef} className={`card flex flex-col p-5 ${className}`}>
      <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <h2 className="text-h3 text-ink">{title}</h2>
          {description && (
            <p className="mt-0.5 text-small text-muted">{description}</p>
          )}
        </div>
        {(legend || actions) && (
          <div className="flex flex-wrap items-center gap-3">
            {legend}
            {actions}
          </div>
        )}
      </header>
      <div ref={bodyRef} className={`mt-5 min-w-0 flex-1 ${bodyClassName}`}>
        {children}
      </div>
    </section>
  );
}
