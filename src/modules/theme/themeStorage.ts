import type { ThemePreference } from './theme';
import { DEFAULT_PREFERENCE } from './theme';

const STORAGE_KEY = 'restaurant-os:theme';

const VALID: readonly ThemePreference[] = ['system', 'light', 'dark'];

function isPreference(value: unknown): value is ThemePreference {
  return typeof value === 'string' && (VALID as readonly string[]).includes(value);
}

/**
 * Storage can throw outright in private browsing, and a stale or hand-edited
 * value must not be able to put the UI into an undefined theme.
 */
export function readPreference(storage: Storage): ThemePreference {
  try {
    const stored: unknown = storage.getItem(STORAGE_KEY);
    return isPreference(stored) ? stored : DEFAULT_PREFERENCE;
  } catch {
    return DEFAULT_PREFERENCE;
  }
}

export function writePreference(storage: Storage, preference: ThemePreference): void {
  try {
    storage.setItem(STORAGE_KEY, preference);
  } catch {
    // Preference is a convenience; losing it must never break the app.
  }
}
