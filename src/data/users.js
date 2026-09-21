import { DEMO_CREDENTIALS } from '../utils/constants';

export const DEMO_USER = Object.freeze({
  id: 'usr_demo',
  name: 'Riya Sharma',
  email: DEMO_CREDENTIALS.email,
  createdAt: '2025-01-15T09:00:00.000Z',
});

export const DEMO_PROFILE = Object.freeze({
  phone: '+91 90000 12345',
  occupation: 'Frontend Developer',
  location: 'Bengaluru, India',
  avatar: '',
});

export const EMPTY_PROFILE = Object.freeze({ phone: '', occupation: '', location: '', avatar: '' });
