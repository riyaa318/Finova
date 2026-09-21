import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth, useSettings, useToast } from '../../hooks/useContexts';
import { validatePasswordChange } from '../../utils/validators';
import TextField from '../forms/TextField';
import Toggle from '../forms/Toggle';
import Button from '../ui/Button';
import SettingsSection from './SettingsSection';

const EMPTY = { currentPassword: '', newPassword: '', confirmPassword: '' };

export default function SecuritySection() {
  const { changePassword } = useAuth();
  const { settings, updateSettings } = useSettings();
  const toast = useToast();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [saving, setSaving] = useState(false);
  const [visible, setVisible] = useState(false);

  const field = (name) => ({
    value: values[name],
    error: errors[name],
    type: visible ? 'text' : 'password',
    onChange: (e) => {
      setValues((prev) => ({ ...prev, [name]: e.target.value }));
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    },
  });

  const submit = async (event) => {
    event.preventDefault();
    const found = validatePasswordChange(values);
    setErrors(found);
    if (Object.keys(found).length) return;
    setSaving(true);
    setSubmitError('');
    try {
      await changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword });
      setValues(EMPTY);
      toast.success('Password updated');
    } catch (error) {
      if (error.status === 403) setErrors({ currentPassword: error.message });
      else setSubmitError(error.message || 'Could not update your password.');
    } finally {
      setSaving(false);
    }
  };

  const setting = (key, label, description) => (
    <Toggle
      label={label}
      description={description}
      checked={settings[key]}
      onChange={(value) => {
        updateSettings({ [key]: value });
        toast.success('Settings saved');
      }}
    />
  );

  return (
    <div className="space-y-4">
      <SettingsSection title="Change password" description="Use at least 8 characters with a letter and a number.">
        <form onSubmit={submit} noValidate className="grid max-w-md gap-4">
          {submitError && (
            <p role="alert" className="rounded-control bg-danger/10 px-3 py-2.5 text-small font-medium text-danger">
              {submitError}
            </p>
          )}
          <TextField label="Current password" autoComplete="current-password" required {...field('currentPassword')} />
          <TextField label="New password" autoComplete="new-password" required {...field('newPassword')} />
          <TextField label="Confirm new password" autoComplete="new-password" required {...field('confirmPassword')} />
          <div className="flex flex-wrap items-center gap-2">
            <Button type="submit" loading={saving}>
              Update password
            </Button>
            <Button variant="ghost" icon={visible ? EyeOff : Eye} onClick={() => setVisible((v) => !v)} aria-pressed={visible}>
              {visible ? 'Hide passwords' : 'Show passwords'}
            </Button>
          </div>
        </form>
      </SettingsSection>

      <SettingsSection title="Sign-in protection" description="Saved as preferences. This demo has no server, so nothing extra is enforced at sign-in.">
        <div className="space-y-5">
          {setting('twoFactor', 'Two-factor authentication', 'Ask for a verification code when signing in on a new device.')}
          {setting('loginAlerts', 'Sign-in alerts', 'Get notified when your account is used on a new device.')}
        </div>
      </SettingsSection>
    </div>
  );
}
