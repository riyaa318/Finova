import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import TextField from "../forms/TextField";

export default function PasswordField(props) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;
  return (
    <TextField
      {...props}
      type={visible ? "text" : "password"}
      suffix={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="rounded-lg p-2 text-muted transition-colors hover:bg-raised hover:text-ink"
        >
          <Icon size={17} aria-hidden="true" />
        </button>
      }
    />
  );
}
