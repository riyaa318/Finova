import { useNavigate } from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChartColumn,
  Download,
  PiggyBank,
  Target,
} from "lucide-react";
import { useFinance, useToast, useUI } from "../../hooks/useContexts";
import { transactionsToCSV, downloadTextFile } from "../../utils/csv";
import { todayISO } from "../../utils/dates";
import Button from "../ui/Button";
import ChartCard from "../cards/ChartCard";

export default function QuickActions({ index = 0 }) {
  const navigate = useNavigate();
  const { openTransactionModal } = useUI();
  const { transactions } = useFinance();
  const toast = useToast();

  const exportCsv = () => {
    downloadTextFile(
      `finova-transactions-${todayISO()}.csv`,
      transactionsToCSV(transactions),
    );
    toast.success(`Exported ${transactions.length} transactions`);
  };

  const actions = [
    {
      label: "Add income",
      icon: ArrowDownLeft,
      run: () => openTransactionModal({ type: "income" }),
    },
    {
      label: "Add expense",
      icon: ArrowUpRight,
      run: () => openTransactionModal({ type: "expense" }),
    },
    {
      label: "Create budget",
      icon: PiggyBank,
      run: () => navigate("/budgets", { state: { openForm: true } }),
    },
    {
      label: "New goal",
      icon: Target,
      run: () => navigate("/goals", { state: { openForm: true } }),
    },
    {
      label: "View analytics",
      icon: ChartColumn,
      run: () => navigate("/analytics"),
    },
    { label: "Export CSV", icon: Download, run: exportCsv },
  ];

  return (
    <ChartCard
      title="Quick actions"
      description="Common tasks, one tap away"
      index={index}
      reveal="fade"
    >
      <div className="grid grid-cols-2 gap-2.5">
        {actions.map(({ label, icon, run }) => (
          <Button
            key={label}
            variant="secondary"
            icon={icon}
            onClick={run}
            className="!justify-start"
          >
            {label}
          </Button>
        ))}
      </div>
    </ChartCard>
  );
}
