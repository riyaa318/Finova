import { useFormatters } from '../../hooks/useFormatters';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS, TRANSACTION_STATUSES } from '../../utils/constants';
import { todayISO } from '../../utils/dates';
import SegmentedControl from '../ui/SegmentedControl';
import SelectField from '../forms/SelectField';
import TextArea from '../forms/TextArea';
import TextField from '../forms/TextField';

const TYPE_OPTIONS = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
];
const toOptions = (list, format = (v) => v) => list.map((value) => ({ value, label: format(value) }));
const capitalise = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** Each field sits in a `data-stagger` wrapper so the modal can animate them in one after another. */
const Row = ({ children, wide = false }) => (
  <div data-stagger className={wide ? 'sm:col-span-2' : ''}>
    {children}
  </div>
);

/** Controlled fields for adding / editing a transaction. Validation lives in the parent. */
export default function TransactionForm({ values, errors, onChange, isEdit, formId, onSubmit }) {
  const { symbol, code } = useFormatters();
  const categories = values.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const field = (name) => ({ value: values[name], error: errors[name], onChange: (e) => onChange(name, e.target.value) });

  return (
    <form id={formId} onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Row wide>
        <span className="mb-1.5 block text-small font-semibold text-ink">Type</span>
        <SegmentedControl label="Transaction type" options={TYPE_OPTIONS} value={values.type} onChange={(type) => onChange('type', type)} className="w-full [&>button]:flex-1" />
      </Row>

      <Row wide>
        <TextField label="Merchant or source" placeholder={values.type === 'income' ? 'e.g. Northwind Technologies' : 'e.g. Swiggy'} required maxLength={60} data-autofocus {...field('merchant')} />
      </Row>

      <Row>
        <TextField
          label={`Amount (${code})`}
          inputMode="decimal"
          placeholder="0.00"
          prefix={symbol}
          required
          autoComplete="off"
          {...field('amount')}
          onChange={(e) => onChange('amount', e.target.value.replace(/[^\d.]/g, ''))}
        />
      </Row>

      <Row>
        <SelectField label="Category" placeholder="Choose a category" required options={toOptions(categories)} {...field('category')} />
      </Row>

      <Row>
        <TextField label="Date" type="date" required max={todayISO()} {...field('date')} />
      </Row>

      <Row>
        <SelectField label="Payment method" required options={toOptions(PAYMENT_METHODS)} {...field('paymentMethod')} />
      </Row>

      {isEdit && (
        <Row wide>
          <SelectField label="Status" options={toOptions(TRANSACTION_STATUSES, capitalise)} {...field('status')} />
        </Row>
      )}

      <Row wide>
        <TextArea label="Notes" placeholder="Optional - what was this for?" maxLength={200} {...field('notes')} />
      </Row>
    </form>
  );
}
