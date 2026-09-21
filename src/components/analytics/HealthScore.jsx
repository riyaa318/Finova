import { useRef } from "react";
import { CircleAlert, CircleCheck, CircleMinus } from "lucide-react";
import AnimatedNumber from "../../motion/AnimatedNumber";
import { gsap, useGSAP } from "../../motion/gsap";
import { useReveal } from "../../motion/hooks";
import { EASE } from "../../motion/tokens";
import { prefersReducedMotion } from "../../motion/reducedMotion";
import Badge from "../ui/Badge";
import ProgressBar from "../ui/ProgressBar";

const RADIUS = 58;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const STATUS = {
  good: {
    label: "Good",
    tone: "success",
    icon: CircleCheck,
    bar: "success",
  },

  fair: {
    label: "Fair",
    tone: "warning",
    icon: CircleMinus,
    bar: "warning",
  },

  poor: {
    label: "Needs work",
    tone: "danger",
    icon: CircleAlert,
    bar: "danger",
  },
};
const scoreStroke = (score) =>
  score >= 75
    ? "rgb(var(--success))"
    : score >= 50
      ? "rgb(var(--warning))"
      : "rgb(var(--danger))";
const showScore = (n) => String(n);

function describe(indicator) {
  if (indicator.value == null) return "Not enough data";
  return indicator.unit === "months"
    ? `${indicator.value.toFixed(1)} months`
    : `${Math.round(indicator.value)}%`;
}

export default function HealthScore({ health, className = "" }) {
  const ref = useRef(null);
  const ringRef = useRef(null);
  const first = useRef(true);
  useReveal(ref);

  useGSAP(
    () => {
      const offset = CIRCUMFERENCE * (1 - health.score / 100);
      if (prefersReducedMotion()) {
        gsap.set(ringRef.current, { strokeDashoffset: offset });
        return;
      }
      if (first.current) {
        gsap.fromTo(
          ringRef.current,
          { strokeDashoffset: CIRCUMFERENCE },
          {
            strokeDashoffset: offset,
            duration: 1.4,
            ease: EASE.emphasis,
            scrollTrigger: {
              trigger: ref.current,
              start: "top 90%",
              once: true,
            },
          },
        );
        first.current = false;
      } else {
        gsap.to(ringRef.current, {
          strokeDashoffset: offset,
          duration: 0.9,
          ease: EASE.out,
          overwrite: true,
        });
      }
    },
    { dependencies: [health.score], scope: ref },
  );

  return (
    <section ref={ref} className={`card p-5 ${className}`}>
      <h2 className="text-h3 text-ink">Financial health</h2>
      <p className="mt-0.5 text-small text-muted">
        A quick read on savings, spending, budgets and cushion
      </p>

      <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div
          className="relative h-[140px] w-[140px] shrink-0"
          role="img"
          aria-label={`Financial health score ${health.score} out of 100, ${health.label}`}
        >
          <svg
            viewBox="0 0 140 140"
            className="h-full w-full -rotate-90"
            aria-hidden="true"
          >
            <circle
              cx="70"
              cy="70"
              r={RADIUS}
              fill="none"
              stroke="rgb(var(--raised))"
              strokeWidth="11"
            />
            <circle
              ref={ringRef}
              cx="70"
              cy="70"
              r={RADIUS}
              fill="none"
              stroke={scoreStroke(health.score)}
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE}
            />
          </svg>
          <div
            aria-hidden="true"
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <span className="text-display leading-none text-ink">
              <AnimatedNumber value={health.score} format={showScore} />
            </span>
            <span className="mt-1 text-caption font-semibold text-muted">
              {health.label}
            </span>
          </div>
        </div>

        <ul className="w-full min-w-0 flex-1 space-y-4">
          {health.indicators.map((indicator) => {
            const status = STATUS[indicator.status];
            return (
              <li key={indicator.id}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-small font-semibold text-ink">
                    {indicator.label}
                  </span>
                  <Badge tone={status.tone} icon={status.icon}>
                    {status.label}
                  </Badge>
                </div>
                <ProgressBar
                  value={indicator.score}
                  tone={status.bar}
                  label={`${indicator.label} score`}
                  size="h-1.5"
                  className="mt-2"
                />
                <p className="mt-1.5 flex justify-between text-caption text-muted">
                  <span className="font-semibold tabular-nums text-ink">
                    {describe(indicator)}
                  </span>
                  <span>Target: {indicator.target}</span>
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
