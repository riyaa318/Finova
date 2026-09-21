import { useState } from "react";
import { useFinance } from "../../hooks/useContexts";
import { useFormatters } from "../../hooks/useFormatters";
import { todayISO } from "../../utils/dates";
import { validateGoal } from "../../utils/validators";
import TextField from "../forms/TextField";
import Button from "../ui/Button";
import GoalGlyph from "../ui/GoalGlyph";
import { GOAL_ICON_OPTIONS } from "../ui/iconMap";
import Modal from "../ui/Modal";

const FORM_ID = "goal-form";

export default function GoalFormModal({ open, goal, onClose }) {
  const { addGoal, editGoal } = useFinance();
  const { symbol, code, toBase, toDisplay } = useFormatters();
  const isEdit = Boolean(goal);

  const [values, setValues] = useState({
    title: goal?.title ?? "",
    icon: goal?.icon ?? "Target",
    targetAmount: goal ? String(toDisplay(goal.targetAmount)) : "",
    currentAmount: "",
    deadline: goal?.deadline ?? "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const change = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };
  const money = (name) => (e) =>
    change(name, e.target.value.replace(/[^\d.]/g, ""));

  const submit = async (event) => {
    event.preventDefault();
    const found = validateGoal(values);
    if (
      isEdit &&
      found.deadline === "Deadline must be today or later" &&
      values.deadline === goal.deadline
    )
      delete found.deadline;
    setErrors(found);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    setSubmitError("");
    const payload = {
      title: values.title.trim(),
      icon: values.icon,
      targetAmount: toBase(Number(values.targetAmount)),
      deadline: values.deadline,
    };
    if (!isEdit)
      payload.currentAmount = values.currentAmount
        ? toBase(Number(values.currentAmount))
        : 0;
    try {
      if (isEdit) await editGoal(goal.id, payload);
      else await addGoal(payload);
      onClose();
    } catch (error) {
      setSubmitError(error.message || "Could not save this goal.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={submitting ? undefined : onClose}
      title={isEdit ? "Edit goal" : "Add goal"}
      description="Set a target and a deadline, then add money as you save."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} loading={submitting}>
            {isEdit ? "Save goal" : "Add goal"}
          </Button>
        </>
      }
    >
      {submitError && (
        <p
          role="alert"
          className="mb-4 rounded-control bg-danger/10 px-3 py-2.5 text-small font-medium text-danger"
        >
          {submitError}
        </p>
      )}
      <form
        id={FORM_ID}
        onSubmit={submit}
        noValidate
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <div data-stagger className="sm:col-span-2">
          <TextField
            label="Goal name"
            required
            maxLength={50}
            placeholder="e.g. Emergency Fund"
            value={values.title}
            error={errors.title}
            onChange={(e) => change("title", e.target.value)}
            data-autofocus
          />
        </div>
        <div data-stagger className="sm:col-span-2">
          <span className="mb-1.5 block text-small font-semibold text-ink">
            Icon
          </span>
          <div
            role="radiogroup"
            aria-label="Goal icon"
            className="flex flex-wrap gap-2"
          >
            {GOAL_ICON_OPTIONS.map((name) => (
              <button
                key={name}
                type="button"
                role="radio"
                aria-checked={values.icon === name}
                aria-label={name}
                onClick={() => change("icon", name)}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-control border transition-colors ${values.icon === name ? "border-accent bg-accent/10 text-accent" : "border-line-strong text-muted hover:bg-raised"}`}
              >
                <GoalGlyph name={name} />
              </button>
            ))}
          </div>
        </div>
        <div data-stagger>
          <TextField
            label={`Target amount (${code})`}
            required
            inputMode="decimal"
            prefix={symbol}
            placeholder="0.00"
            value={values.targetAmount}
            error={errors.targetAmount}
            onChange={money("targetAmount")}
          />
        </div>
        {!isEdit && (
          <div data-stagger>
            <TextField
              label={`Already saved (${code})`}
              inputMode="decimal"
              prefix={symbol}
              placeholder="0.00"
              value={values.currentAmount}
              error={errors.currentAmount}
              onChange={money("currentAmount")}
              hint="Optional"
            />
          </div>
        )}
        <div data-stagger className={isEdit ? "" : "sm:col-span-2"}>
          <TextField
            label="Deadline"
            type="date"
            required
            min={isEdit ? undefined : todayISO()}
            value={values.deadline}
            error={errors.deadline}
            onChange={(e) => change("deadline", e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
}
