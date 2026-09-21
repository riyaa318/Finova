import { useSettings, useToast } from "../../hooks/useContexts";
import Toggle from "../forms/Toggle";
import SettingsSection from "./SettingsSection";

const ITEMS = [
  {
    key: "budgetAlerts",
    label: "Budget alerts",
    description:
      "Notify me when a budget reaches its warning level or is exceeded.",
  },
  {
    key: "largeTransactionAlerts",
    label: "Large transaction alerts",
    description: "Notify me about unusually large payments and credits.",
  },
  {
    key: "weeklySummary",
    label: "Weekly summary",
    description: "A short recap of income, spending and goal progress.",
  },
  {
    key: "emailNotifications",
    label: "Email notifications",
    description: "Receive alerts by email.",
  },
  {
    key: "pushNotifications",
    label: "Push notifications",
    description: "Receive alerts on this device.",
  },
];

export default function NotificationSection() {
  const { settings, updateSettings } = useSettings();
  const toast = useToast();
  return (
    <SettingsSection
      title="Notifications"
      description="Budget and large-transaction alerts appear in your notification centre straight away. Email, push and the weekly summary are saved as preferences only, because this build has no backend to send them."
    >
      <div className="space-y-5">
        {ITEMS.map(({ key, label, description }) => (
          <Toggle
            key={key}
            label={label}
            description={description}
            checked={settings[key]}
            onChange={(value) => {
              updateSettings({ [key]: value });
              toast.success("Settings saved");
            }}
          />
        ))}
      </div>
    </SettingsSection>
  );
}
