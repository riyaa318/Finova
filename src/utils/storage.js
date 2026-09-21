const PREFIX = 'finova:';

function createStore(getBackend) {
  const backend = () => {
    try {
      return getBackend();
    } catch {
      return null;
    }
  };
  return {
    get(key, fallback = null) {
      try {
        const raw = backend()?.getItem(PREFIX + key);
        return raw == null ? fallback : JSON.parse(raw);
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        backend()?.setItem(PREFIX + key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },
    remove(key) {
      try {
        backend()?.removeItem(PREFIX + key);
      } catch {
        /* storage unavailable */
      }
    },
  };
}

/** Persistent storage (survives browser restarts). */
export const storage = createStore(() => window.localStorage);
/** Tab-scoped storage (used for sessions without "remember me"). */
export const sessionStore = createStore(() => window.sessionStorage);
