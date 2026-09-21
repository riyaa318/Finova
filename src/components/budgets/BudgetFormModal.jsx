import { useState } from 'react';
import { useFinance } from '../../hooks/useContexts';
import { useFormatters } from '../../hooks/useFormatters';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import { validateBudget } from '../../utils/validators';
import SelectField from '../forms/SelectField';
import TextField from '../forms/TextField';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

const FORM_ID = 'budget-form';

export default function BudgetFormModal({ open, budget, existingCategories, onClose }) {
  const { addBudget, editBudget } = useFinance();
  const { symbol, code, toBase, toDisplay } = useFormatters();
  const isEdit = Boolean(budget);
  const taken = existingCategories.filter((c) => c !== budget?.category);
  const available = EXPENSE_CATEGORIES.filter((c) => !taken.includes(c));

  const [values, setValues] = useState({ category: budget?.category ?? '', limit: budget ? String(toDisplay(budget.limit)) : '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const change = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const found = validateBudget(values, { takenCategories: taken });
    setErrors(found);
    if (Object.keys(found).length) return;
    setSubmitting(true);
    setSubmitError('');
    const payload = { category: values.category, limit: toBase(Number(values.limit)) };
    try {
      if (isEdit) await editBudget(budget.id, payload);
      else await addBudget(payload);
      onClose();
    } catch (error) {
      setSubmitError(error.message || 'Could not save this budget.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={submitting ? undefined : onClose}
      size="sm"
      title={isEdit ? 'Edit budget' : 'Add budget'}
      description="Limits reset on a rolling 30-day window."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} loading={submitting}>
            {isEdit ? 'Save budget' : 'Add budget'}
          </Button>
        </>
      }
    >
      {submitError && (
        <p role="alert" className="mb-4 rounded-control bg-danger/10 px-3 py-2.5 text-small font-medium text-danger">
          {submitError}
        </p>
      )}
      <form id={FORM_ID} onSubmit={submit} noValidate className="space-y-4">
        <div data-stagger>
          <SelectField
            label="Category"
            required
            placeholder={available.length ? 'Choose a category' : 'Every category already has a budget'}
            options={available.map((c) => ({ value: c, label: c }))}
            value={values.category}
            error={errors.category}
            onChange={(e) => change('category', e.target.value)}
            data-autofocus
          />
        </div>
        <div data-stagger>
          <TextField
            label={`Monthly limit (${code})`}
            required
            inputMode="decimal"
            prefix={symbol}
            placeholder="0.00"
            value={values.limit}
            error={errors.limit}
            onChange={(e) => change('limit', e.target.value.replace(/[^\d.]/g, ''))}
          />
        </div>
      </form>
    </Modal>
  );
}
