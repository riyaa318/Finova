import { useId, useRef } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";
import AnimatedNumber from "../../motion/AnimatedNumber";
import { useEntrance, useHoverLift } from "../../motion/hooks";
import { formatPercent } from "../../utils/format";
import Badge from "../ui/Badge";

const COLORS = {
  accent: "rgb(var(--accent))",
  chart2: "rgb(var(--chart-2))",
  chart3: "rgb(var(--chart-3))",
  chart5: "rgb(var(--chart-5))",
};

function Sparkline({ data, color }) {
  const gradientId = `spark-${useId().replace(/:/g, "")}`;
  return (
    <div className="h-10 w-full" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function StatCard({
  label,
  icon: Icon,
  value,
  format,
  change,
  positiveIsGood = true,
  comparisonLabel,
  sparkline,
  sparkColor = "accent",
  footer,
  index = 0,
  featured = false,
}) {
  const ref = useRef(null);
  useEntrance(ref, { delay: index * 0.08, y: 22 });
  useHoverLift(ref);

  const direction =
    change == null || Math.abs(change) < 0.05
      ? "flat"
      : change > 0
        ? "up"
        : "down";
  const good =
    direction === "flat" ? null : (direction === "up") === positiveIsGood;
  const tone = good == null ? "neutral" : good ? "success" : "danger";
  const TrendIcon = direction === "down" ? TrendingDown : TrendingUp;
  const spoken =
    change == null
      ? "No previous data to compare"
      : `${direction === "flat" ? "Unchanged" : direction === "up" ? "Up" : "Down"} ${Math.abs(change).toFixed(1)} percent ${comparisonLabel}`;

  return (
    <article
      ref={ref}
      className={`card flex flex-col p-5 ${featured ? "border-accent/30 bg-gradient-to-b from-accent/[0.07] to-surface" : ""}`}
    >
      <header className="flex items-center gap-2 text-small font-semibold text-muted">
        <span
          className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${featured ? "bg-accent text-accent-fg" : "bg-raised text-ink"}`}
        >
          <Icon size={15} aria-hidden="true" />
        </span>
        {label}
      </header>
      <p className="mt-4 text-figure text-ink">
        <AnimatedNumber value={value} format={format} />
      </p>
      <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1">
        {change != null && (
          <Badge tone={tone} icon={TrendIcon}>
            {formatPercent(change, { sign: true })}
          </Badge>
        )}
        <span className="text-caption text-muted">
          <span className="sr-only">{spoken}. </span>
          <span aria-hidden="true">{comparisonLabel}</span>
        </span>
      </div>
      {footer && <p className="mt-3 text-small text-muted">{footer}</p>}
      {sparkline && (
        <div className="mt-auto pt-4">
          <Sparkline data={sparkline} color={COLORS[sparkColor]} />
        </div>
      )}
    </article>
  );
}
