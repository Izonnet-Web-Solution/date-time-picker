import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import type {
  DateFormat,
  DatePickerTheme,
  DatePickerLocale,
  ValidationResult,
} from '../../types';
import { DateInputField } from './DateInputField';
import { DateValidationMessage } from './DateValidationMessage';

export interface ManualDateInputProps {
  value: string;
  onChangeText: (text: string) => void;
  validation: ValidationResult;
  format?: DateFormat;
  theme: DatePickerTheme;
  locale: DatePickerLocale;
  type?: 'single' | 'split';
  label?: string;
  placeholder?: string;
  editable?: boolean;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export const ManualDateInput: React.FC<ManualDateInputProps> = ({
  value,
  onChangeText,
  validation,
  format = 'DD/MM/YYYY',
  theme,
  locale,
  type = 'single',
  label,
  placeholder,
  editable = true,
  style,
  inputStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      <DateInputField
        value={value}
        onChangeText={onChangeText}
        format={format}
        theme={theme}
        locale={locale}
        isError={!validation.isValid}
        type={type}
        label={label}
        placeholder={placeholder}
        editable={editable}
        inputStyle={inputStyle}
      />
      <DateValidationMessage validation={validation} theme={theme} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 4,
  },
});
