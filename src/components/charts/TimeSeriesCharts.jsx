import { useId } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useBucketLabels } from "../../hooks/useBucketLabels";
import { useFormatters } from "../../hooks/useFormatters";
import ChartTooltip from "./ChartTooltip";
import PulseDot from "./PulseDot";

const MARGIN = { top: 6, right: 4, left: 0, bottom: 0 };
const gradientKey = (id) => `grad-${id.replace(/:/g, "")}`;

export function SpendingAreaChart({
  data,
  dataKey = "amount",
  name = "Spending",
  color = "rgb(var(--chart-3))",
  averageKey,
  averageName = "7-day average",
  height = 280,
  summary,
  grow = false,
}) {
  const { compact, money } = useFormatters();
  const labelled = useBucketLabels(data);
  const gradient = gradientKey(useId());
  return (
    <div
      role="img"
      aria-label={summary ?? `${name} over time`}
      className={grow ? "flex-1" : ""}
      style={grow ? { minHeight: height } : { height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={labelled} margin={MARGIN}>
          <defs>
            <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            minTickGap={28}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={54}
            tickFormatter={compact}
            tickCount={5}
          />
          <Tooltip
            cursor={{ stroke: "rgb(var(--line-strong))" }}
            content={
              <ChartTooltip
                formatValue={(v) => money(v)}
                formatLabel={(p) => p.fullLabel}
              />
            }
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            name={name}
            stroke={color}
            strokeWidth={2.25}
            fill={`url(#${gradient})`}
            isAnimationActive={false}
            activeDot={<PulseDot stroke={color} />}
          />
          {averageKey && (
            <Line
              type="monotone"
              dataKey={averageKey}
              name={averageName}
              stroke="rgb(var(--chart-2))"
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={false}
              isAnimationActive={false}
              activeDot={<PulseDot stroke="rgb(var(--chart-2))" />}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function IncomeBarChart({
  data,
  height = 240,
  color = "rgb(var(--chart-1))",
}) {
  const { compact, money } = useFormatters();
  const labelled = useBucketLabels(data);
  return (
    <div role="img" aria-label="Income over time" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={labelled} margin={MARGIN} barCategoryGap="24%">
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            minTickGap={16}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={54}
            tickFormatter={compact}
            tickCount={5}
          />
          <Tooltip
            cursor={{ fill: "rgb(var(--raised) / 0.7)" }}
            content={
              <ChartTooltip
                formatValue={(v) => money(v)}
                formatLabel={(p) => p.fullLabel}
              />
            }
          />
          <Bar
            dataKey="income"
            name="Income"
            fill={color}
            radius={[4, 4, 0, 0]}
            maxBarSize={30}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SavingsRateChart({ data, height = 240 }) {
  const labelled = useBucketLabels(data);
  const color = "rgb(var(--chart-2))";
  return (
    <div role="img" aria-label="Savings rate over time" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={labelled} margin={MARGIN}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            minTickGap={16}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={44}
            tickFormatter={(v) => `${v}%`}
            domain={[0, "auto"]}
            tickCount={5}
          />
          <ReferenceLine y={20} strokeDasharray="4 4" />
          <Tooltip
            cursor={{ stroke: "rgb(var(--line-strong))" }}
            content={
              <ChartTooltip
                formatValue={(v) => `${Math.round(v)}%`}
                formatLabel={(p) => p.fullLabel}
              />
            }
          />
          <Line
            type="monotone"
            dataKey="savingsRate"
            name="Savings rate"
            stroke={color}
            strokeWidth={2.5}
            dot={{ r: 3, fill: color, strokeWidth: 0 }}
            activeDot={<PulseDot stroke={color} />}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}