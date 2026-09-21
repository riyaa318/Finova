import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, LogOut, RotateCcw, Trash2 } from 'lucide-react';
import { useAuth, useFinance, useToast } from '../../hooks/useContexts';
import { downloadTextFile, transactionsToCSV } from '../../utils/csv';
import { todayISO } from '../../utils/dates';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import ConfirmDialog from '../ui/ConfirmDialog';
import SettingsSection from './SettingsSection';

const CONFIRMS = {
  reset: {
    title: 'Restore demo data?',
    message: 'Your transactions, budgets, goals and notifications are replaced with the original sample data.',
    label: 'Restore demo data',
    tone: 'primary',
  },
  clear: {
    title: 'Clear all data?',
    message: 'Every transaction, budget, goal and notification is deleted from this browser. This cannot be undone.',
    label: 'Clear everything',
    tone: 'danger',
  },
};

export default function AccountSection() {
  const { user, logout } = useAuth();
  const { transactions, resetData } = useFinance();
  const toast = useToast();
  const [confirm, setConfirm] = useState(null);

  const exportCsv = () => {
    downloadTextFile(`finova-transactions-${todayISO()}.csv`, transactionsToCSV(transactions));
    toast.success(`Exported ${transactions.length} transactions`);
  };
  const active = confirm ? CONFIRMS[confirm] : null;

  return (
    <div className="space-y-4">
      <SettingsSection title="Account" description="The email and name attached to this workspace.">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3.5">
            <Avatar name={user.name} src={user.avatar} size={52} />
            <div className="min-w-0">
              <p className="truncate text-body font-semibold text-ink">{user.name}</p>
              <p className="truncate text-small text-muted">{user.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button as={Link} to="/profile" variant="secondary">
              Edit profile
            </Button>
            <Button variant="ghost" icon={LogOut} onClick={logout}>
              Sign out
            </Button>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Your data" description="Everything is stored in this browser only. Nothing is sent to a server.">
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" icon={Download} onClick={exportCsv}>
            Export transactions (CSV)
          </Button>
          <Button variant="secondary" icon={RotateCcw} onClick={() => setConfirm('reset')}>
            Restore demo data
          </Button>
          <Button variant="danger-outline" icon={Trash2} onClick={() => setConfirm('clear')}>
            Clear all data
          </Button>
        </div>
      </SettingsSection>

      <ConfirmDialog
        open={Boolean(active)}
        title={active?.title ?? ''}
        message={active?.message ?? ''}
        confirmLabel={active?.label}
        tone={active?.tone}
        onConfirm={() => resetData(confirm)}
        onClose={() => setConfirm(null)}
      />
    </div>
  );
}
