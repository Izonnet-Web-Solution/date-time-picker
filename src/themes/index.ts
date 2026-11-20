import { lightTheme } from './light';
import { darkTheme } from './dark';
import type { DatePickerTheme } from '../types';

export const themes: Record<'light' | 'dark', DatePickerTheme> = {
  light: lightTheme,
  dark: darkTheme,
};

export interface ThemeOverrides {
  accentColor?: string;
  primaryColor?: string;
  textColor?: string;
  backgroundColor?: string;
  cardColor?: string;
  modalBackgroundColor?: string;
  borderRadius?: number;
}

export const resolveTheme = (
  themeInput?: 'light' | 'dark' | Partial<DatePickerTheme>,
  overrides?: ThemeOverrides
): DatePickerTheme => {
  let baseTheme = lightTheme;

  if (themeInput === 'dark') {
    baseTheme = darkTheme;
  } else if (themeInput === 'light') {
    baseTheme = lightTheme;
  } else if (themeInput && typeof themeInput === 'object') {
    baseTheme = {
      ...lightTheme,
      ...themeInput,
      fontSize: {
        ...lightTheme.fontSize,
        ...(themeInput.fontSize || {}),
      },
    };
  }

  const resolved: DatePickerTheme = { ...baseTheme };

  const accent = overrides?.accentColor || overrides?.primaryColor;
  if (accent) {
    resolved.primaryColor = accent;
    resolved.selectedDayBackgroundColor = accent;
    resolved.todayBorderColor = accent;
    resolved.todayTextColor = accent;
    resolved.rangeBetweenBackgroundColor = `${accent}20`;
    resolved.rangeBetweenTextColor = accent;
  }

  if (overrides?.textColor) {
    resolved.textColor = overrides.textColor;
  }

  if (overrides?.backgroundColor) {
    resolved.backgroundColor = overrides.backgroundColor;
    resolved.cardColor = overrides.backgroundColor;
  }

  if (overrides?.cardColor || overrides?.modalBackgroundColor) {
    resolved.cardColor = (overrides.cardColor || overrides.modalBackgroundColor)!;
  }

  if (overrides?.borderRadius !== undefined) {
    resolved.borderRadius = overrides.borderRadius;
  }

  return resolved;
};

export { lightTheme, darkTheme };
