import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import type {
  DateFormat,
  DatePickerTheme,
  DatePickerLocale,
} from '../../types';
import { IconButton } from '../common/IconButton';
import { getPlaceholderForFormat } from '../../utils/dateFormatting';

export interface DateInputFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  format?: DateFormat;
  theme: DatePickerTheme;
  locale: DatePickerLocale;
  isError?: boolean;
  type?: 'single' | 'split';
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  placeholder?: string;
  label?: string;
  editable?: boolean;
}

export const DateInputField: React.FC<DateInputFieldProps> = ({
  value,
  onChangeText,
  format = 'DD/MM/YYYY',
  theme,
  locale,
  isError = false,
  type = 'single',
  style,
  inputStyle,
  placeholder,
  label,
  editable = true,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Split inputs refs
  const dayRef = useRef<TextInput>(null);
  const monthRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);

  const defaultPlaceholder = placeholder || getPlaceholderForFormat(format);

  const getBorderColor = () => {
    if (isError) return theme.errorColor;
    if (isFocused) return theme.primaryColor;
    return theme.borderColor;
  };

  if (type === 'split') {
    const separator = format.includes('-') ? '-' : '/';
    const rawParts = value.split(separator);
    const formatParts = format.split(separator);

    // Determine ordering of Day ('D'), Month ('M'), Year ('Y') from format
    const fieldOrder = (formatParts.length === 3 ? formatParts : ['DD', 'MM', 'YYYY']).map((p) => {
      const u = p.trim().toUpperCase();
      if (u.startsWith('Y')) return 'Y';
      if (u.startsWith('M')) return 'M';
      return 'D';
    }) as ('D' | 'M' | 'Y')[];

    // Map current values based on fieldOrder
    let dayVal = '';
    let monthVal = '';
    let yearVal = '';

    fieldOrder.forEach((fType, idx) => {
      const v = rawParts[idx] || '';
      if (fType === 'D') dayVal = v;
      if (fType === 'M') monthVal = v;
      if (fType === 'Y') yearVal = v;
    });

    const updateCombined = (newD: string, newM: string, newY: string) => {
      const combined = fieldOrder.map((fType) => {
        if (fType === 'D') return newD;
        if (fType === 'M') return newM;
        return newY;
      });
      onChangeText(combined.join(separator));
    };

    const handleDayChange = (d: string) => {
      const clean = d.replace(/\D/g, '').slice(0, 2);
      updateCombined(clean, monthVal, yearVal);
      if (clean.length === 2) {
        const nextIdx = fieldOrder.indexOf('D') + 1;
        if (nextIdx < 3) {
          if (fieldOrder[nextIdx] === 'M') monthRef.current?.focus();
          else if (fieldOrder[nextIdx] === 'Y') yearRef.current?.focus();
        }
      }
    };

    const handleMonthChange = (m: string) => {
      const clean = m.replace(/\D/g, '').slice(0, 2);
      updateCombined(dayVal, clean, yearVal);
      if (clean.length === 2) {
        const nextIdx = fieldOrder.indexOf('M') + 1;
        if (nextIdx < 3) {
          if (fieldOrder[nextIdx] === 'D') dayRef.current?.focus();
          else if (fieldOrder[nextIdx] === 'Y') yearRef.current?.focus();
        }
      }
    };

    const handleYearChange = (y: string) => {
      const clean = y.replace(/\D/g, '').slice(0, 4);
      updateCombined(dayVal, monthVal, clean);
      if (clean.length === 4) {
        const nextIdx = fieldOrder.indexOf('Y') + 1;
        if (nextIdx < 3) {
          if (fieldOrder[nextIdx] === 'D') dayRef.current?.focus();
          else if (fieldOrder[nextIdx] === 'M') monthRef.current?.focus();
        }
      }
    };

    const renderSplitBox = (fType: 'D' | 'M' | 'Y') => {
      if (fType === 'D') {
        return (
          <View
            key="day-box"
            style={[
              styles.splitBox,
              {
                borderColor: getBorderColor(),
                backgroundColor: theme.surfaceColor,
                borderRadius: Math.max(theme.borderRadius - 4, 8),
              },
            ]}
          >
            <Text style={[styles.splitLabel, { color: theme.secondaryTextColor }]}>
              {locale.dayLabel}
            </Text>
            <TextInput
              ref={dayRef}
              value={dayVal}
              onChangeText={handleDayChange}
              keyboardType="number-pad"
              maxLength={2}
              placeholder="DD"
              placeholderTextColor={theme.disabledTextColor}
              style={[
                styles.splitInput,
                { color: theme.textColor, fontSize: theme.fontSize.medium },
                inputStyle,
              ]}
              editable={editable}
            />
          </View>
        );
      }
      if (fType === 'M') {
        return (
          <View
            key="month-box"
            style={[
              styles.splitBox,
              {
                borderColor: getBorderColor(),
                backgroundColor: theme.surfaceColor,
                borderRadius: Math.max(theme.borderRadius - 4, 8),
              },
            ]}
          >
            <Text style={[styles.splitLabel, { color: theme.secondaryTextColor }]}>
              {locale.monthLabel}
            </Text>
            <TextInput
              ref={monthRef}
              value={monthVal}
              onChangeText={handleMonthChange}
              keyboardType="number-pad"
              maxLength={2}
              placeholder="MM"
              placeholderTextColor={theme.disabledTextColor}
              style={[
                styles.splitInput,
                { color: theme.textColor, fontSize: theme.fontSize.medium },
                inputStyle,
              ]}
              editable={editable}
            />
          </View>
        );
      }
      return (
        <View
          key="year-box"
          style={[
            styles.splitBox,
            {
              flex: 1.4,
              borderColor: getBorderColor(),
              backgroundColor: theme.surfaceColor,
              borderRadius: Math.max(theme.borderRadius - 4, 8),
            },
          ]}
        >
          <Text style={[styles.splitLabel, { color: theme.secondaryTextColor }]}>
            {locale.yearLabel}
          </Text>
          <TextInput
            ref={yearRef}
            value={yearVal}
            onChangeText={handleYearChange}
            keyboardType="number-pad"
            maxLength={4}
            placeholder="YYYY"
            placeholderTextColor={theme.disabledTextColor}
            style={[
              styles.splitInput,
              { color: theme.textColor, fontSize: theme.fontSize.medium },
              inputStyle,
            ]}
            editable={editable}
          />
        </View>
      );
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
        <View style={styles.splitRow}>
          {fieldOrder.map((fType) => renderSplitBox(fType))}
        </View>
      </View>
    );
  }

  // Single formatted input
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
      <View
        style={[
          styles.singleInputContainer,
          {
            backgroundColor: theme.surfaceColor,
            borderColor: getBorderColor(),
            borderRadius: Math.max(theme.borderRadius - 4, 8),
          },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={defaultPlaceholder}
          placeholderTextColor={theme.disabledTextColor}
          keyboardType="numeric"
          maxLength={10}
          editable={editable}
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

        {value.length > 0 && editable && (
          <IconButton
            icon="close"
            size={16}
            color={theme.secondaryTextColor}
            onPress={() => onChangeText('')}
            accessibilityLabel={locale.clear}
            style={styles.clearButton}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 4,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
  },
  singleInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    paddingHorizontal: 12,
    height: 48,
  },
  textInput: {
    flex: 1,
    height: '100%',
    padding: 0,
    fontWeight: '500',
  },
  clearButton: {
    marginLeft: 6,
  },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  splitBox: {
    flex: 1,
    marginHorizontal: 3,
    borderWidth: 1.5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
  splitLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  splitInput: {
    width: '100%',
    textAlign: 'center',
    paddingVertical: 2,
    fontWeight: '600',
  },
});
