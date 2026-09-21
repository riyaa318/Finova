import { Check, Clock, X } from 'lucide-react';
import Badge from '../ui/Badge';

const STATUS = {
  completed: { tone: 'success', icon: Check, label: 'Completed' },
  pending: { tone: 'warning', icon: Clock, label: 'Pending' },
  failed: { tone: 'danger', icon: X, label: 'Failed' },
};

export default function StatusBadge({ status }) {
  const { tone, icon, label } = STATUS[status] ?? STATUS.completed;
  return (
    <Badge tone={tone} icon={icon}>
      {label}
    </Badge>
  );
}
