import { useState } from "react";
import { useTheme } from "../../hooks/useContexts";
import {
  getMotionPreference,
  setMotionPreference,
} from "../../motion/reducedMotion";
import Toggle from "../forms/Toggle";
import SegmentedControl from "../ui/SegmentedControl";
import SettingsSection from "./SettingsSection";

const THEMES = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "Match device" },
];

export default function AppearanceSection() {
  const { preference, setPreference } = useTheme();
  const [reduced, setReduced] = useState(
    () => getMotionPreference() === "reduced",
  );
  return (
    <SettingsSection
      title="Appearance"
      description="Applies on this device straight away."
    >
      <div className="space-y-6">
        <div>
          <p className="mb-2 text-small font-semibold text-ink">Theme</p>
          <SegmentedControl
            label="Theme"
            options={THEMES}
            value={preference}
            onChange={setPreference}
          />
        </div>
        <Toggle
          label="Reduce motion"
          description="Turns off page transitions, number counters and chart reveals. FINOVA also follows your device's reduced-motion setting automatically."
          checked={reduced}
          onChange={(value) => {
            setReduced(value);
            setMotionPreference(value ? "reduced" : "system");
          }}
        />
      </div>
    </SettingsSection>
  );
}
