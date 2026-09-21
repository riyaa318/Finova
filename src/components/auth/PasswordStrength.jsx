import { passwordStrength } from '../../utils/validators';

const LEVELS = [
  { label: 'Too short', bar: 'bg-line-strong', text: 'text-muted' },
  { label: 'Weak', bar: 'bg-danger', text: 'text-danger' },
  { label: 'Fair', bar: 'bg-warning', text: 'text-warning' },
  { label: 'Good', bar: 'bg-accent', text: 'text-accent' },
  { label: 'Strong', bar: 'bg-success', text: 'text-success' },
];

/** Four-segment meter. The label is always spelled out, so strength is never conveyed by colour alone. */
export default function PasswordStrength({ password }) {
  if (!password) return null;
  const score = passwordStrength(password);
  const level = LEVELS[score];
  return (
    <div className="-mt-1" aria-live="polite">
      <div className="flex gap-1.5" aria-hidden="true">
        {[1, 2, 3, 4].map((segment) => (
          <span key={segment} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${segment <= score ? level.bar : 'bg-raised'}`} />
        ))}
      </div>
      <p className={`mt-1.5 text-caption font-semibold ${level.text}`}>Password strength: {level.label}</p>
    </div>
  );
}
