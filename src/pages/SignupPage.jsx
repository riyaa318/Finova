import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import PasswordField from '../components/auth/PasswordField';
import PasswordStrength from '../components/auth/PasswordStrength';
import TextField from '../components/forms/TextField';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useContexts';
import { validateSignup } from '../utils/validators';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function SignupPage() {
  const { register, activate } = useAuth();
  const [values, setValues] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [phase, setPhase] = useState('idle');

  const change = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormError('');
  };
  const field = (name) => ({ value: values[name], error: errors[name], onChange: (e) => change(name, e.target.value) });

  const submit = async (event) => {
    event.preventDefault();
    const found = validateSignup(values);
    setErrors(found);
    if (Object.keys(found).length) return;
    setPhase('loading');
    try {
      const user = await register({ name: values.name, email: values.email, password: values.password });
      setPhase('success');
      await wait(700);
      activate(user);
    } catch (error) {
      setPhase('idle');
      if (error.status === 409) setErrors({ email: error.message });
      else setFormError(error.message || 'Could not create your account. Please try again.');
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Set up in under a minute. Your data stays in this browser."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-accent underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        {formError && (
          <p role="alert" className="rounded-control bg-danger/10 px-3.5 py-3 text-small font-medium text-danger">
            {formError}
          </p>
        )}
        <TextField label="Full name" autoComplete="name" placeholder="Your name" required {...field('name')} />
        <TextField label="Email" type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" required {...field('email')} />
        <PasswordField label="Password" autoComplete="new-password" placeholder="At least 8 characters" required hint="Use a letter and a number." {...field('password')} />
        <PasswordStrength password={values.password} />
        <PasswordField label="Confirm password" autoComplete="new-password" placeholder="Repeat your password" required {...field('confirmPassword')} />
        <Button type="submit" size="lg" fullWidth loading={phase === 'loading'} disabled={phase === 'success'} icon={phase === 'success' ? Check : undefined} iconRight={phase === 'idle' ? ArrowRight : undefined}>
          {phase === 'success' ? 'Account created' : phase === 'loading' ? 'Creating account' : 'Create account'}
        </Button>
      </form>
    </AuthLayout>
  );
}
