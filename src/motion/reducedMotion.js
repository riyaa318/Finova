import { useSyncExternalStore } from 'react';
import { storage } from '../utils/storage';

const QUERY = '(prefers-reduced-motion: reduce)';
const CHANGE_EVENT = 'finova:motion-change';

export const getMotionPreference = () => storage.get('motion', 'system');

/** In-app override ("system" | "reduced") on top of the OS-level setting. */
export function setMotionPreference(preference) {
  storage.set('motion', preference);
  document.documentElement.classList.toggle('reduce-motion', preference === 'reduced');
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export const prefersReducedMotion = () => getMotionPreference() === 'reduced' || window.matchMedia(QUERY).matches;

function subscribe(callback) {
  const media = window.matchMedia(QUERY);
  media.addEventListener('change', callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    media.removeEventListener('change', callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

export const useReducedMotion = () => useSyncExternalStore(subscribe, prefersReducedMotion, () => false);
