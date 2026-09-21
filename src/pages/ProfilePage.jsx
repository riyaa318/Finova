import { useRef, useState } from 'react';
import { Briefcase, Calendar, Camera, Mail, MapPin, Phone, Trash2 } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import TextField from '../components/forms/TextField';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import { useAuth, useToast } from '../hooks/useContexts';
import { useFormatters } from '../hooks/useFormatters';
import { useEntrance } from '../motion/hooks';
import { fileToAvatar } from '../utils/image';
import { validateProfile } from '../utils/validators';

const FIELDS = ['name', 'email', 'phone', 'occupation', 'location', 'avatar'];
const pick = (user) => Object.fromEntries(FIELDS.map((f) => [f, user[f] ?? '']));

function Fact({ icon: Icon, children }) {
  if (!children) return null;
  return (
    <li className="flex items-center gap-2.5 text-small text-muted">
      <Icon size={15} className="shrink-0 text-subtle" aria-hidden="true" />
      <span className="min-w-0 truncate">{children}</span>
    </li>
  );
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const { date } = useFormatters();
  const summaryRef = useRef(null);
  const formRef = useRef(null);
  const fileRef = useRef(null);
  useEntrance(summaryRef, { delay: 0.1, y: 18 });
  useEntrance(formRef, { delay: 0.18, y: 18 });

  const saved = pick(user);
  const [values, setValues] = useState(saved);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const dirty = FIELDS.some((f) => values[f] !== saved[f]);

  const change = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };
  const text = (name) => ({ value: values[name], error: errors[name], onChange: (e) => change(name, e.target.value) });

  const chooseAvatar = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast.error('Choose an image file (JPG, PNG or WebP).');
    if (file.size > 5 * 1024 * 1024) return toast.error('That image is larger than 5 MB.');
    try {
      change('avatar', await fileToAvatar(file));
    } catch (error) {
      toast.error(error.message);
    }
    return undefined;
  };

  const submit = async (event) => {
    event.preventDefault();
    const found = validateProfile(values);
    setErrors(found);
    if (Object.keys(found).length) return;
    setSaving(true);
    setSubmitError('');
    try {
      await updateProfile(values);
      toast.success('Profile saved');
    } catch (error) {
      setSubmitError(error.message || 'Could not save your profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <PageHeader title="Profile" description="Your details and how you appear in FINOVA." />

      <div className="grid gap-4 lg:grid-cols-3">
        <aside ref={summaryRef} className="card h-fit p-6 text-center lg:text-left" aria-label="Profile summary">
          <div className="flex flex-col items-center gap-4 lg:items-start">
            <Avatar name={values.name || user.name} src={values.avatar} size={96} />
            <div>
              <h2 className="text-h2 text-ink">{values.name || user.name}</h2>
              <p className="text-small text-muted">{values.occupation || 'Add your occupation'}</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={chooseAvatar} className="sr-only" tabIndex={-1} aria-label="Upload profile photo" />
            <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
              <Button variant="secondary" size="sm" icon={Camera} onClick={() => fileRef.current.click()}>
                {values.avatar ? 'Change photo' : 'Upload photo'}
              </Button>
              {values.avatar && (
                <Button variant="ghost" size="sm" icon={Trash2} onClick={() => change('avatar', '')}>
                  Remove
                </Button>
              )}
            </div>
          </div>
          <ul className="mt-6 space-y-2.5 border-t border-line pt-5 text-left">
            <Fact icon={Mail}>{values.email}</Fact>
            <Fact icon={Phone}>{values.phone}</Fact>
            <Fact icon={Briefcase}>{values.occupation}</Fact>
            <Fact icon={MapPin}>{values.location}</Fact>
            <Fact icon={Calendar}>Member since {date.medium(user.createdAt)}</Fact>
          </ul>
        </aside>

        <form ref={formRef} onSubmit={submit} noValidate className="card p-5 sm:p-6 lg:col-span-2" aria-label="Edit profile">
          <h2 className="text-h3 text-ink">Personal details</h2>
          <p className="mt-0.5 text-small text-muted">Changes apply across the app once you save.</p>
          {submitError && (
            <p role="alert" className="mt-4 rounded-control bg-danger/10 px-3 py-2.5 text-small font-medium text-danger">
              {submitError}
            </p>
          )}
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField label="Full name" required autoComplete="name" {...text('name')} />
            <TextField label="Email" type="email" required autoComplete="email" {...text('email')} />
            <TextField label="Phone" type="tel" autoComplete="tel" placeholder="+91 90000 00000" {...text('phone')} />
            <TextField label="Occupation" autoComplete="organization-title" {...text('occupation')} />
            <TextField label="Location" autoComplete="address-level2" placeholder="City, Country" className="sm:col-span-2" {...text('location')} />
          </div>
          <div className="mt-6 flex flex-col-reverse gap-2 border-t border-line pt-5 sm:flex-row sm:justify-end">
            <Button variant="secondary" disabled={!dirty || saving} onClick={() => { setValues(saved); setErrors({}); setSubmitError(''); }}>
              Discard changes
            </Button>
            <Button type="submit" loading={saving} disabled={!dirty}>
              Save profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
