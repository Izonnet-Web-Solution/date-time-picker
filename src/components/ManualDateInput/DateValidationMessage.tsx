import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ValidationResult, DatePickerTheme } from '../../types';

export interface DateValidationMessageProps {
  validation: ValidationResult;
  theme: DatePickerTheme;
}

export const DateValidationMessage: React.FC<DateValidationMessageProps> = ({
  validation,
  theme,
}) => {
  if (validation.isValid || !validation.error) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.errorBackgroundColor,
          borderColor: theme.errorColor,
          borderRadius: Math.max(theme.borderRadius - 4, 6),
        },
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      <Text style={[styles.icon, { color: theme.errorColor }]}>⚠</Text>
      <Text
        style={[
          styles.text,
          {
            color: theme.errorColor,
            fontSize: theme.fontSize.small,
          },
        ]}
      >
        {validation.error}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    marginTop: 6,
    marginBottom: 2,
  },
  icon: {
    fontSize: 13,
    marginRight: 6,
  },
  text: {
    flex: 1,
    fontWeight: '600',
  },
});
