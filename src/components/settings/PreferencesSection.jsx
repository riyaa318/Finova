import { useSettings, useToast } from "../../hooks/useContexts";
import { CURRENCIES, LANGUAGES } from "../../utils/constants";
import SelectField from "../forms/SelectField";
import Toggle from "../forms/Toggle";
import SettingsSection from "./SettingsSection";

const CURRENCY_OPTIONS = Object.values(CURRENCIES).map((c) => ({
  value: c.code,
  label: `${c.label} (${c.symbol})`,
}));

export default function PreferencesSection() {
  const { settings, updateSettings } = useSettings();
  const toast = useToast();
  const save = (patch) => {
    updateSettings(patch);
    toast.success("Settings saved");
  };
  return (
    <div className="space-y-4">
      <SettingsSection
        title="Preferences"
        description="Amounts are stored in rupees and converted for display, using fixed demo rates."
      >
        <div className="grid max-w-xl gap-4 sm:grid-cols-2">
          <SelectField
            label="Currency"
            options={CURRENCY_OPTIONS}
            value={settings.currency}
            onChange={(e) => save({ currency: e.target.value })}
          />
          <SelectField
            label="Language and date format"
            options={LANGUAGES}
            value={settings.language}
            onChange={(e) => save({ language: e.target.value })}
          />
        </div>
      </SettingsSection>
      <SettingsSection
        title="Developer"
        description="Handy for testing how the app behaves when things go wrong."
      >
        <Toggle
          label="Simulate network errors"
          description="Some requests to the mock API will fail at random, so you can see the error messages and retry buttons."
          checked={settings.simulateErrors}
          onChange={(value) => save({ simulateErrors: value })}
        />
      </SettingsSection>
    </div>
  );
}
