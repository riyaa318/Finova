import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import AuthLayout from "../components/auth/AuthLayout";
import PasswordField from "../components/auth/PasswordField";
import Checkbox from "../components/forms/Checkbox";
import TextField from "../components/forms/TextField";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useContexts";
import { DEMO_CREDENTIALS } from "../utils/constants";
import { validateLogin } from "../utils/validators";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function LoginPage() {
  const { authenticate, activate } = useAuth();
  const [values, setValues] = useState({
    email: "",
    password: "",
    remember: true,
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [phase, setPhase] = useState("idle");
  const busy = phase !== "idle";

  const change = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormError("");
  };

  const attempt = async (credentials) => {
    setPhase("loading");
    setFormError("");
    try {
      const user = await authenticate(credentials);
      setPhase("success");
      await wait(650);
      activate(user);
    } catch (error) {
      setPhase("idle");
      setFormError(error.message || "Could not sign you in. Please try again.");
    }
  };

  const submit = (event) => {
    event.preventDefault();
    const found = validateLogin(values);
    setErrors(found);
    if (Object.keys(found).length) return;
    attempt(values);
  };

  const useDemo = () => {
    setValues({ ...DEMO_CREDENTIALS, remember: true });
    setErrors({});
    attempt({ ...DEMO_CREDENTIALS, remember: true });
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to see where your money went this month."
      footer={
        <>
          New to FINOVA?{" "}
          <Link
            to="/signup"
            className="font-semibold text-accent underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        {formError && (
          <p
            role="alert"
            className="rounded-control bg-danger/10 px-3.5 py-3 text-small font-medium text-danger"
          >
            {formError}
          </p>
        )}
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          required
          value={values.email}
          error={errors.email}
          onChange={(e) => change("email", e.target.value)}
        />
        <PasswordField
          label="Password"
          autoComplete="current-password"
          placeholder="Your password"
          required
          value={values.password}
          error={errors.password}
          onChange={(e) => change("password", e.target.value)}
        />
        <Checkbox
          label="Keep me signed in on this device"
          checked={values.remember}
          onChange={(e) => change("remember", e.target.checked)}
        />
        <Button
          type="submit"
          size="lg"
          fullWidth
          loading={phase === "loading"}
          disabled={phase === "success"}
          icon={phase === "success" ? Check : undefined}
          iconRight={phase === "idle" ? ArrowRight : undefined}
        >
          {phase === "success"
            ? "Signed in"
            : phase === "loading"
              ? "Signing in"
              : "Sign in"}
        </Button>
      </form>

      <div
        className="my-6 flex items-center gap-3 text-caption text-subtle"
        aria-hidden="true"
      >
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="card bg-raised/50 p-4">
        <p className="text-small font-semibold text-ink">
          Just looking around?
        </p>
        <p className="mt-0.5 text-small text-muted">
          Use the demo account: {DEMO_CREDENTIALS.email} with password{" "}
          {DEMO_CREDENTIALS.password}.
        </p>
        <Button
          variant="secondary"
          fullWidth
          disabled={busy}
          onClick={useDemo}
          className="mt-3"
        >
          Explore with the demo account
        </Button>
      </div>
    </AuthLayout>
  );
}
