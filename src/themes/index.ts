import { lightTheme } from './light';
import { darkTheme } from './dark';
import type { DatePickerTheme } from '../types';

export const themes: Record<'light' | 'dark', DatePickerTheme> = {
  light: lightTheme,
  dark: darkTheme,
};

export interface ThemeOverrides {
  accentColor?: string;
  textColor?: string;
  backgroundColor?: string;
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

  if (overrides?.accentColor) {
    resolved.primaryColor = overrides.accentColor;
    resolved.selectedDayBackgroundColor = overrides.accentColor;
    resolved.todayBorderColor = overrides.accentColor;
    resolved.todayTextColor = overrides.accentColor;
  }

  if (overrides?.textColor) {
    resolved.textColor = overrides.textColor;
  }

  if (overrides?.backgroundColor) {
    resolved.backgroundColor = overrides.backgroundColor;
    resolved.cardColor = overrides.backgroundColor;
  }

  if (overrides?.borderRadius !== undefined) {
    resolved.borderRadius = overrides.borderRadius;
  }

  return resolved;
};

export { lightTheme, darkTheme };
