import { useState } from 'react';
import { useFinance } from '../../hooks/useContexts';
import { useFormatters } from '../../hooks/useFormatters';
import { amountError } from '../../utils/validators';
import TextField from '../forms/TextField';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

const FORM_ID = 'add-money-form';
const QUICK_AMOUNTS = [1000, 5000, 10000];

export default function AddMoneyModal({ open, goal, onClose }) {
  const { contributeToGoal, stats } = useFinance();
  const { money, symbol, code, toBase, toDisplay } = useFormatters();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const available = Math.max(0, stats?.availableBalance ?? 0);
  const cap = Math.min(goal.remaining, available);

  const submit = async (event) => {
    event.preventDefault();
    const problem = amountError(amount);
    if (problem) return setError(problem);
    const base = toBase(Number(amount));
    if (base > goal.remaining + 0.005) return setError(`Only ${money(goal.remaining)} is needed to complete this goal.`);
    if (base > available + 0.005) return setError(`Not enough available balance. You have ${money(available)} available.`);
    setSubmitting(true);
    setError('');
    try {
      await contributeToGoal(goal.id, base);
      onClose();
    } catch (err) {
      setError(err.message || 'Could not add money to this goal.');
    } finally {
      setSubmitting(false);
    }
    return undefined;
  };

  const chips = [...QUICK_AMOUNTS.filter((v) => v < cap), cap].filter((v, i, list) => v > 0 && list.indexOf(v) === i);

  return (
    <Modal
      open={open}
      onClose={submitting ? undefined : onClose}
      size="sm"
      title={`Add money to ${goal.title}`}
      description={`${money(goal.remaining)} to go. ${money(available)} available in your account.`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} loading={submitting} disabled={cap <= 0}>
            Add money
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={submit} noValidate>
        <div data-stagger>
          <TextField
            label={`Amount (${code})`}
            required
            inputMode="decimal"
            prefix={symbol}
            placeholder="0.00"
            value={amount}
            error={error}
            onChange={(e) => {
              setAmount(e.target.value.replace(/[^\d.]/g, ''));
              setError('');
            }}
            data-autofocus
          />
        </div>
        {chips.length > 0 && (
          <div data-stagger className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Quick amounts">
            {chips.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setAmount(String(toDisplay(value)));
                  setError('');
                }}
                className="rounded-full border border-line-strong px-3 py-1 text-caption font-semibold tabular-nums text-muted transition-colors hover:border-accent hover:text-accent"
              >
                {value === cap && cap === goal.remaining ? `Complete (${money(value)})` : value === cap ? `Max (${money(value)})` : `+${money(value)}`}
              </button>
            ))}
          </div>
        )}
      </form>
    </Modal>
  );
}
