import { Target } from 'lucide-react';
import { ICONS } from './iconMap';

export default function GoalGlyph({ name, size = 18 }) {
  const Icon = ICONS[name] ?? Target;
  return <Icon size={size} aria-hidden="true" />;
}
