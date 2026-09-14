import type { ThemePreference } from '../modules/theme/theme';

const LABELS: Readonly<Record<ThemePreference, string>> = {
  system: 'Follow system',
  light: 'Light',
  dark: 'Dark',
};

export interface ThemeToggleProps {
  readonly preference: ThemePreference;
}

export function renderThemeToggle({ preference }: ThemeToggleProps): string {
  return `
    <button class="theme-toggle"
            type="button"
            data-preference="${preference}"
            aria-label="Theme: ${LABELS[preference]}. Activate to change.">
      <span class="theme-toggle__label">${LABELS[preference]}</span>
    </button>`;
}
