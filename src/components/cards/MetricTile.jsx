import { useRef } from 'react';
import AnimatedNumber from '../../motion/AnimatedNumber';
import { useEntrance } from '../../motion/hooks';

/** Small summary figure used above lists (budgets, goals, analytics). */
export default function MetricTile({ label, value, format, hint, index = 0, children }) {
  const ref = useRef(null);
  useEntrance(ref, { delay: index * 0.07, y: 16 });
  return (
    <div ref={ref} className="card px-4 py-3.5">
      <p className="text-small font-medium text-muted">{label}</p>
      <p className="mt-1 text-h2 tabular-nums text-ink">
        <AnimatedNumber value={value} format={format} duration={0.9} />
      </p>
      {hint && <p className="mt-0.5 text-caption text-muted">{hint}</p>}
      {children}
    </div>
  );
}
