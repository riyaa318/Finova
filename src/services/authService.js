import { DEMO_USER, DEMO_PROFILE, EMPTY_PROFILE } from '../data/users';
import { DEMO_CREDENTIALS } from '../utils/constants';
import { sessionStore, storage } from '../utils/storage';
import { ApiError, makeId, respond } from './api';

const USERS_KEY = 'users';
const SESSION_KEY = 'session';
const profileKey = (userId) => `u:${userId}:profile`;
const normalizeEmail = (email) => email.trim().toLowerCase();

/**
 * Passwords are hashed before they touch localStorage. This is a *simulation* of auth for a
 * frontend-only demo - a real backend would hash with bcrypt/argon2 server-side.
 */
async function hashPassword(password) {
  const input = `finova::${password}`;
  if (globalThis.crypto?.subtle) {
    const digest = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
    return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
  }
  let h = 2166136261; // FNV-1a fallback for non-secure contexts
  for (let i = 0; i < input.length; i += 1) h = Math.imul(h ^ input.charCodeAt(i), 16777619);
  return `fnv-${(h >>> 0).toString(16)}`;
}

const readUsers = () => storage.get(USERS_KEY, []);
const writeUsers = (users) => storage.set(USERS_KEY, users);

async function ensureDemoUser() {
  const users = readUsers();
  if (users.some((u) => u.id === DEMO_USER.id)) return;
  writeUsers([...users, { ...DEMO_USER, passwordHash: await hashPassword(DEMO_CREDENTIALS.password) }]);
  storage.set(profileKey(DEMO_USER.id), DEMO_PROFILE);
}

const publicUser = (record) => {
  const { passwordHash: _hash, ...user } = record;
  return { ...user, ...storage.get(profileKey(record.id), EMPTY_PROFILE) };
};

function readSession() {
  const session = storage.get(SESSION_KEY) ?? sessionStore.get(SESSION_KEY);
  return session?.userId ? session : null;
}

function startSession(userId, remember) {
  const session = { userId, token: makeId('sess'), remember, createdAt: new Date().toISOString() };
  storage.remove(SESSION_KEY);
  sessionStore.remove(SESSION_KEY);
  (remember ? storage : sessionStore).set(SESSION_KEY, session);
}

export const getCurrentUserId = () => readSession()?.userId ?? null;

/** Synchronous so the app can decide between the app and /login on first render. */
export function getCurrentUser() {
  const session = readSession();
  if (!session) return null;
  const record = readUsers().find((u) => u.id === session.userId);
  return record ? publicUser(record) : null;
}

export async function login({ email, password, remember = false }) {
  await ensureDemoUser();
  return respond(
    async () => {
      const record = readUsers().find((u) => u.email === normalizeEmail(email));
      const valid = record && record.passwordHash === (await hashPassword(password));
      if (!valid) throw new ApiError('Incorrect email or password.', 401);
      startSession(record.id, remember);
      return publicUser(record);
    },
    { latency: [650, 900], canFail: false },
  );
}

export async function signup({ name, email, password }) {
  await ensureDemoUser();
  return respond(
    async () => {
      const normalized = normalizeEmail(email);
      const users = readUsers();
      if (users.some((u) => u.email === normalized)) throw new ApiError('An account with this email already exists.', 409);
      const record = { id: makeId('usr'), name: name.trim(), email: normalized, createdAt: new Date().toISOString(), passwordHash: await hashPassword(password) };
      writeUsers([...users, record]);
      storage.set(profileKey(record.id), EMPTY_PROFILE);
      startSession(record.id, true);
      return publicUser(record);
    },
    { latency: [700, 950], canFail: false },
  );
}

export function logout() {
  storage.remove(SESSION_KEY);
  sessionStore.remove(SESSION_KEY);
}

export async function updateProfile(userId, { name, email, phone, occupation, location, avatar }) {
  return respond(() => {
    const users = readUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) throw new ApiError('Account not found.', 404);
    const nextEmail = normalizeEmail(email);
    if (users.some((u) => u.id !== userId && u.email === nextEmail)) throw new ApiError('That email is already used by another account.', 409);
    users[index] = { ...users[index], name: name.trim(), email: nextEmail };
    writeUsers(users);
    storage.set(profileKey(userId), { phone: phone.trim(), occupation: occupation.trim(), location: location.trim(), avatar: avatar ?? '' });
    return publicUser(users[index]);
  });
}

export async function changePassword(userId, { currentPassword, newPassword }) {
  return respond(
    async () => {
      const users = readUsers();
      const index = users.findIndex((u) => u.id === userId);
      if (index === -1) throw new ApiError('Account not found.', 404);
      if (users[index].passwordHash !== (await hashPassword(currentPassword))) throw new ApiError('Your current password is incorrect.', 403);
      users[index] = { ...users[index], passwordHash: await hashPassword(newPassword) };
      writeUsers(users);
      return true;
    },
    { latency: [500, 750], canFail: false },
  );
}
