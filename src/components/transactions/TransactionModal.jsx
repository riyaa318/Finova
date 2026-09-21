import { useState } from 'react';
import { useFinance } from '../../hooks/useContexts';
import { useFormatters } from '../../hooks/useFormatters';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../utils/constants';
import { todayISO } from '../../utils/dates';
import { validateTransaction } from '../../utils/validators';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import TransactionForm from './TransactionForm';

const FORM_ID = 'transaction-form';

/** Add / edit dialog. Mounted with a fresh `key` per opening so the form always starts clean. */
export default function TransactionModal({ open, transaction, defaultType = 'expense', onClose }) {
  const { addTransaction, editTransaction } = useFinance();
  const { toBase, toDisplay } = useFormatters();
  const isEdit = Boolean(transaction);

  const [values, setValues] = useState(() =>
    transaction
      ? { type: transaction.type, merchant: transaction.merchant, amount: String(toDisplay(transaction.amount)), category: transaction.category, date: transaction.date, paymentMethod: transaction.paymentMethod, status: transaction.status, notes: transaction.notes ?? '' }
      : { type: defaultType, merchant: '', amount: '', category: '', date: todayISO(), paymentMethod: 'UPI', status: 'completed', notes: '' },
  );
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const change = (name, value) => {
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'type') {
        const allowed = value === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
        if (!allowed.includes(prev.category)) next.category = '';
      }
      return next;
    });
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const submit = async (event) => {
    event.preventDefault();
    const found = validateTransaction(values, { toBase });
    setErrors(found);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    setSubmitError('');
    const payload = { ...values, merchant: values.merchant.trim(), amount: toBase(Number(values.amount)) };
    try {
      if (isEdit) await editTransaction(transaction.id, payload);
      else await addTransaction(payload);
      onClose();
    } catch (error) {
      setSubmitError(error.message || 'We could not save this transaction. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={submitting ? undefined : onClose}
      title={isEdit ? 'Edit transaction' : 'Add transaction'}
      description={isEdit ? `Update ${transaction.merchant} (${transaction.id}).` : 'Record income or an expense. Totals, budgets and charts update instantly.'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} loading={submitting}>
            {isEdit ? 'Save changes' : 'Add transaction'}
          </Button>
        </>
      }
    >
      {submitError && (
        <p role="alert" className="mb-4 rounded-control bg-danger/10 px-3 py-2.5 text-small font-medium text-danger">
          {submitError}
        </p>
      )}
      <TransactionForm formId={FORM_ID} values={values} errors={errors} onChange={change} onSubmit={submit} isEdit={isEdit} />
    </Modal>
  );
}
