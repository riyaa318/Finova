import { ANALYTICS_RANGES } from '../../utils/constants';
import SegmentedControl from '../ui/SegmentedControl';

const OPTIONS = ANALYTICS_RANGES.map((r) => ({ value: r.value, label: r.label }));

export default function RangeSelector({ value, onChange }) {
  return <SegmentedControl label="Time range" options={OPTIONS} value={value} onChange={onChange} size="sm" />;
}
