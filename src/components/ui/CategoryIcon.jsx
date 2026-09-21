import { Wallet } from "lucide-react";
import { CATEGORY_META } from "../../utils/constants";
import { chartColor, chartColorAlpha } from "../../utils/format";
import { ICONS } from "./iconMap";

export default function CategoryIcon({ category, size = 36 }) {
  const meta = CATEGORY_META[category] ?? { icon: "Wallet", chart: 8 };
  const Icon = ICONS[meta.icon] ?? Wallet;
  const color = chartColor(meta.chart);
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        color,
        backgroundColor: chartColorAlpha(meta.chart, 0.14),
      }}
      className="inline-flex shrink-0 items-center justify-center rounded-control"
    >
      <Icon size={Math.round(size * 0.5)} strokeWidth={2.1} />
    </span>
  );
}
