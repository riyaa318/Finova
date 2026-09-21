export default function ChartTooltip({
  active,
  payload,
  label,
  formatValue,
  formatLabel,
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  const title = formatLabel ? formatLabel(point, label) : label;
  return (
    <div className="min-w-[160px] rounded-control border border-line bg-surface px-3 py-2.5 shadow-pop">
      {title && (
        <p className="mb-1.5 text-caption font-semibold text-muted">{title}</p>
      )}
      <ul className="space-y-1">
        {payload.map((item) => (
          <li
            key={item.dataKey ?? item.name}
            className="flex items-center justify-between gap-5 text-small"
          >
            <span className="flex items-center gap-1.5 text-muted">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-[3px]"
                style={{
                  backgroundColor: item.color ?? item.stroke ?? item.fill,
                }}
              />
              {item.name}
            </span>
            <span className="font-semibold tabular-nums text-ink">
              {formatValue(item.value, item)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
