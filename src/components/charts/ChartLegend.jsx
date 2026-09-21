export default function ChartLegend({ items }) {
  return (
    <ul
      className="flex flex-wrap items-center gap-x-4 gap-y-1"
      aria-label="Chart legend"
    >
      {items.map((item) => (
        <li
          key={item.label}
          className="flex items-center gap-1.5 text-caption font-medium text-muted"
        >
          <span
            aria-hidden="true"
            className={
              item.shape === "line"
                ? "h-0.5 w-3.5 rounded-full"
                : "h-2.5 w-2.5 rounded-[3px]"
            }
            style={{
              backgroundColor: item.color,
              ...(item.shape === "dashed"
                ? {
                    backgroundColor: "transparent",
                    borderTop: `2px dashed ${item.color}`,
                    height: 0,
                    width: 14,
                  }
                : {}),
            }}
          />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
