import React, { useRef, useState, useMemo } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
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
import { getPlaceholderForFormat } from '../../utils/dateFormatting';
import { parseDateStrict } from '../../utils/dateParsing';

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
  const [activeSplitField, setActiveSplitField] = useState<'D' | 'M' | 'Y' | null>(null);

  // Split inputs refs
  const dayRef = useRef<TextInput>(null);
  const monthRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);

  const defaultPlaceholder = placeholder || getPlaceholderForFormat(format);
  const separator = format.includes('-') ? '-' : '/';

  // Compute live validation feedback
  const parseResult = useMemo(() => {
    if (!value || !value.trim()) return null;
    return parseDateStrict(value, format, locale);
  }, [value, format, locale]);

  const isValidDate = parseResult?.validation.isValid === true;
  const hasError = isError || (Boolean(value && value.trim()) && !isValidDate);

  const getBorderColor = () => {
    if (hasError) return theme.errorColor;
    if (isFocused || activeSplitField !== null) return theme.primaryColor;
    return theme.borderColor;
  };

  // --- SPLIT MODE IMPLEMENTATION ---
  if (type === 'split') {
    const rawParts = value.split(separator);
    const formatParts = format.split(separator);

    // Determine ordering of Day ('D'), Month ('M'), Year ('Y') from format
    const fieldOrder = (formatParts.length === 3 ? formatParts : ['DD', 'MM', 'YYYY']).map((p) => {
      const u = p.trim().toUpperCase();
      if (u.startsWith('Y')) return 'Y';
      if (u.startsWith('M')) return 'M';
      return 'D';
    }) as ('D' | 'M' | 'Y')[];

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

    const renderSplitPod = (fType: 'D' | 'M' | 'Y', index: number) => {
      const isActive = activeSplitField === fType;
      const ref = fType === 'D' ? dayRef : (fType === 'M' ? monthRef : yearRef);
      const val = fType === 'D' ? dayVal : (fType === 'M' ? monthVal : yearVal);
      const onChangeHandler = fType === 'D' ? handleDayChange : (fType === 'M' ? handleMonthChange : handleYearChange);
      const titleLabel = fType === 'D' ? (locale.dayLabel || 'DAY') : (fType === 'M' ? (locale.monthLabel || 'MONTH') : (locale.yearLabel || 'YEAR'));
      const maxLen = fType === 'Y' ? 4 : 2;
      const placeHolderStr = fType === 'Y' ? 'YYYY' : (fType === 'M' ? 'MM' : 'DD');

      return (
        <React.Fragment key={fType}>
          {index > 0 && (
            <View style={styles.separatorContainer}>
              <Text style={[styles.separatorText, { color: theme.secondaryTextColor }]}>
                {separator}
              </Text>
            </View>
          )}

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => ref.current?.focus()}
            style={[
              styles.splitPodCard,
              {
                backgroundColor: isActive ? `${theme.primaryColor}0C` : theme.cardColor,
                borderColor: isActive ? theme.primaryColor : (hasError ? theme.errorColor : theme.borderColor),
                shadowColor: isActive ? theme.primaryColor : '#000',
                shadowOpacity: isActive ? 0.18 : 0.04,
                flex: fType === 'Y' ? 1.35 : 1,
              },
            ]}
          >
            {/* Mini Segment Badge */}
            <View
              style={[
                styles.splitPodBadge,
                {
                  backgroundColor: isActive ? theme.primaryColor : `${theme.textColor}08`,
                },
              ]}
            >
              <Text
                style={[
                  styles.splitPodBadgeText,
                  {
                    color: isActive ? '#FFFFFF' : theme.secondaryTextColor,
                  },
                ]}
              >
                {titleLabel.toUpperCase()}
              </Text>
            </View>

            {/* Large Prominent Digits Input */}
            <TextInput
              ref={ref}
              value={val}
              onChangeText={onChangeHandler}
              onFocus={() => setActiveSplitField(fType)}
              onBlur={() => setActiveSplitField(null)}
              keyboardType="number-pad"
              maxLength={maxLen}
              placeholder={placeHolderStr}
              placeholderTextColor={theme.disabledTextColor}
              style={[
                styles.splitPodInput,
                {
                  color: isActive ? theme.primaryColor : theme.textColor,
                },
                inputStyle,
              ]}
              editable={editable}
            />
          </TouchableOpacity>
        </React.Fragment>
      );
    };

    return (
      <View style={[styles.container, style]}>
        {/* Sleek Top Status & Label Bar */}
        <View style={styles.topStatusRow}>
          <View style={styles.topBadgeGroup}>
            <View style={[styles.pillBadge, { backgroundColor: `${theme.primaryColor}14` }]}>
              <Text style={[styles.pillBadgeText, { color: theme.primaryColor }]}>
                📑 SPLIT PODS
              </Text>
            </View>
          </View>

          {value.length > 0 && (
            <View
              style={[
                styles.statusIndicator,
                {
                  backgroundColor: isValidDate ? '#10B98118' : '#EF444418',
                  borderColor: isValidDate ? '#10B98140' : '#EF444440',
                },
              ]}
            >
              <Text
                style={[
                  styles.statusIndicatorText,
                  { color: isValidDate ? '#10B981' : '#EF4444' },
                ]}
              >
                {isValidDate ? '✓ Complete' : '⚠ Incomplete'}
              </Text>
            </View>
          )}
        </View>

        {label && (
          <Text style={[styles.fieldLabel, { color: theme.textColor }]}>
            {label}
          </Text>
        )}

        {/* The 3 Modern Split Pods */}
        <View style={styles.splitRowContainer}>
          {fieldOrder.map((fType, idx) => renderSplitPod(fType, idx))}
        </View>
      </View>
    );
  }

  // --- SINGLE BOX MODE IMPLEMENTATION (UNIQUE MODERN HERO CARD) ---
  return (
    <View style={[styles.container, style]}>
      {/* Sleek Top Header Badge Bar */}
      <View style={styles.topStatusRow}>
        <View style={styles.topBadgeGroup}>
          <View style={[styles.pillBadge, { backgroundColor: `${theme.primaryColor}14` }]}>
            <Text style={[styles.pillBadgeText, { color: theme.primaryColor }]}>
              ⌨️ SINGLE BOX
            </Text>
          </View>
        </View>

        {value.length > 0 && (
          <View
            style={[
              styles.statusIndicator,
              {
                backgroundColor: isValidDate ? '#10B98118' : '#EF444418',
                borderColor: isValidDate ? '#10B98140' : '#EF444440',
              },
            ]}
          >
            <Text
              style={[
                styles.statusIndicatorText,
                { color: isValidDate ? '#10B981' : '#EF4444' },
              ]}
            >
              {isValidDate ? '✓ Valid Date' : '⚠ Invalid'}
            </Text>
          </View>
        )}
      </View>

      {label && (
        <Text style={[styles.fieldLabel, { color: theme.textColor }]}>
          {label}
        </Text>
      )}

      {/* Hero Interactive Input Frame */}
      <View
        style={[
          styles.heroInputFrame,
          {
            backgroundColor: isFocused ? `${theme.primaryColor}06` : theme.cardColor,
            borderColor: getBorderColor(),
            shadowColor: isFocused ? theme.primaryColor : '#000',
            shadowOpacity: isFocused ? 0.16 : 0.04,
          },
        ]}
      >
        <View style={[styles.heroInputIconBadge, { backgroundColor: `${theme.primaryColor}12` }]}>
          <Text style={styles.heroInputIcon}>📅</Text>
        </View>

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
            styles.heroDigitsInput,
            {
              color: isFocused ? theme.primaryColor : theme.textColor,
            },
            inputStyle,
          ]}
          accessibilityLabel={label || defaultPlaceholder}
        />

        {value.length > 0 && editable && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onChangeText('')}
            style={[styles.heroClearBtn, { backgroundColor: `${theme.textColor}12` }]}
          >
            <Text style={[styles.heroClearText, { color: theme.secondaryTextColor }]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 0,
  },
  topStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  topBadgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pillBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusIndicatorText: {
    fontSize: 10,
    fontWeight: '700',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  heroInputFrame: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    // elevation: 2,
  },
  heroInputIconBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  heroInputIcon: {
    fontSize: 15,
  },
  heroDigitsInput: {
    flex: 1,
    height: '100%',
    padding: 0,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
  },
  heroClearBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  heroClearText: {
    fontSize: 11,
    fontWeight: '800',
  },
  splitRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  splitPodCard: {
    borderRadius: 12,
    borderWidth: 1.5,
    paddingVertical: 6,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    minHeight: 62,
  },
  splitPodBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    marginBottom: 2,
  },
  splitPodBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  splitPodInput: {
    width: '100%',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
    padding: 0,
    letterSpacing: 1,
  },
  separatorContainer: {
    paddingHorizontal: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separatorText: {
    fontSize: 20,
    fontWeight: '300',
    opacity: 0.6,
  },
});
