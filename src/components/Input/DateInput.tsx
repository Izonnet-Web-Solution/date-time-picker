import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import type {
  DatePickerTheme,
  DatePickerLocale,
  DateFormat,
  DisabledDateCheck,
} from '../../types';
import { useDatePicker } from '../../hooks/useDatePicker';
import { CalendarPopup } from './CalendarPopup';
import { IconButton } from '../common/IconButton';
import { DateValidationMessage } from '../ManualDateInput/DateValidationMessage';
import { getPlaceholderForFormat } from '../../utils/dateFormatting';

export interface DateInputProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  onConfirm?: (date: Date | null) => void;
  onCancel?: () => void;
  onClear?: () => void;
  format?: DateFormat;
  theme: DatePickerTheme;
  locale: DatePickerLocale;
  minimumDate?: Date;
  maximumDate?: Date;
  disabledDates?: (Date | string)[] | DisabledDateCheck;
  disabledWeekdays?: number[];
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  allowManualEntry?: boolean;
  manualEntryType?: 'single' | 'split';
  placeholder?: string;
  label?: string;
  editable?: boolean;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
}

export const DateInput: React.FC<DateInputProps> = ({
  value,
  defaultValue,
  onChange,
  onConfirm,
  onCancel,
  onClear,
  format = 'DD/MM/YYYY',
  theme,
  locale,
  minimumDate,
  maximumDate,
  disabledDates,
  disabledWeekdays,
  firstDayOfWeek = 0,
  allowManualEntry = true,
  manualEntryType = 'single',
  placeholder,
  label,
  editable = true,
  style,
  inputStyle,
  inputContainerStyle,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const {
    selectedDate,
    manualText,
    isManualMode,
    validationResult,
    selectDate,
    handleManualInputChange,
    toggleManualMode,
    clear,
  } = useDatePicker({
    value,
    defaultValue,
    onChange: (d) => {
      onChange?.(d);
    },
    format,
    locale,
    minimumDate,
    maximumDate,
    disabledDates,
    disabledWeekdays,
    allowManualEntry,
  });

  const defaultPlaceholder = placeholder || getPlaceholderForFormat(format);

  const handleFieldPress = () => {
    if (!allowManualEntry && editable) {
      setIsPopupOpen(true);
    }
  };

  const handleClearPress = () => {
    clear();
    onClear?.();
  };

  const handleConfirmPopup = (confirmedDate: Date | null) => {
    selectDate(confirmedDate);
    onChange?.(confirmedDate);
    onConfirm?.(confirmedDate);
  };

  const getBorderColor = () => {
    if (!validationResult.isValid) return theme.errorColor;
    if (isFocused) return theme.primaryColor;
    return theme.borderColor;
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text
          style={[
            styles.label,
            { color: theme.textColor, fontSize: theme.fontSize.small },
          ]}
        >
          {label}
        </Text>
      )}

      <TouchableOpacity
        activeOpacity={allowManualEntry ? 1 : 0.7}
        onPress={handleFieldPress}
        style={[
          styles.inputRow,
          {
            backgroundColor: theme.cardColor || theme.surfaceColor,
            borderColor: getBorderColor(),
            borderRadius: Math.max(theme.borderRadius, 14),
            shadowColor: isFocused ? theme.primaryColor : '#000',
            shadowOpacity: isFocused ? 0.12 : 0.03,
          },
          inputContainerStyle,
        ]}
      >
        <TextInput
          value={manualText}
          onChangeText={handleManualInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={defaultPlaceholder}
          placeholderTextColor={theme.disabledTextColor}
          editable={editable && allowManualEntry}
          keyboardType="numeric"
          maxLength={10}
          style={[
            styles.textInput,
            {
              color: theme.textColor,
              fontSize: theme.fontSize.medium,
            },
            inputStyle,
          ]}
          accessibilityLabel={label || defaultPlaceholder}
        />

        {manualText.length > 0 && editable && (
          <IconButton
            icon="close"
            size={16}
            color={theme.secondaryTextColor}
            onPress={handleClearPress}
            accessibilityLabel={locale.clear}
            style={styles.actionIcon}
          />
        )}

        <IconButton
          icon="calendar"
          size={18}
          color={theme.primaryColor}
          onPress={() => setIsPopupOpen(true)}
          disabled={!editable}
          accessibilityLabel={locale.selectDate}
          style={styles.actionIcon}
        />
      </TouchableOpacity>

      <DateValidationMessage validation={validationResult} theme={theme} />

      <CalendarPopup
        visible={isPopupOpen}
        onClose={() => {
          setIsPopupOpen(false);
          onCancel?.();
        }}
        selectedDate={selectedDate}
        onSelectDate={(d) => {
          selectDate(d);
          onChange?.(d);
        }}
        onConfirm={handleConfirmPopup}
        theme={theme}
        locale={locale}
        format={format}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        disabledDates={disabledDates}
        disabledWeekdays={disabledWeekdays}
        firstDayOfWeek={firstDayOfWeek}
        allowManualEntry={allowManualEntry}
        manualEntryType={manualEntryType}
        manualText={manualText}
        isManualMode={isManualMode}
        validationResult={validationResult}
        onManualTextChange={handleManualInputChange}
        onToggleManualMode={toggleManualMode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 52,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    height: '100%',
    padding: 0,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  actionIcon: {
    marginLeft: 8,
  },
});
