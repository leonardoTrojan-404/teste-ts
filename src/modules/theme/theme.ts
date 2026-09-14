export type ThemeName = 'light' | 'dark';
export type ThemePreference = ThemeName | 'system';

export const DEFAULT_PREFERENCE: ThemePreference = 'system';

export function resolveTheme(preference: ThemePreference, prefersDark: boolean): ThemeName {
  if (preference === 'system') {
    return prefersDark ? 'dark' : 'light';
  }
  return preference;
}

export function nextPreference(current: ThemePreference): ThemePreference {
  const cycle: readonly ThemePreference[] = ['system', 'light', 'dark'];
  const index = cycle.indexOf(current);
  return cycle[(index + 1) % cycle.length] ?? DEFAULT_PREFERENCE;
}

export function applyTheme(root: { dataset: Record<string, string> }, theme: ThemeName): void {
  root.dataset.theme = theme;
}
