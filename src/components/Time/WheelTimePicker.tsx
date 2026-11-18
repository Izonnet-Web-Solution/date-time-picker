import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import type {
  DatePickerTheme,
  DatePickerLocale,
  TimePeriod,
} from '../../types';
import { WheelColumn, WheelItem } from '../Wheel/WheelColumn';
import {
  padZero,
  isHourDisabled,
  isMinuteDisabled,
  TimeValidationOptions,
} from '../../utils/timeUtils';

export interface WheelTimePickerProps {
  hours: number; // 0..23 if 24h, 1..12 if 12h
  minutes: number; // 0..59
  seconds?: number; // 0..59
  period?: TimePeriod; // 'AM' | 'PM'
  is24Hour?: boolean;
  minuteInterval?: number;
  showSeconds?: boolean;
  onTimeChange: (time: {
    hours: number;
    minutes: number;
    seconds: number;
    period?: TimePeriod;
  }) => void;
  theme: DatePickerTheme;
  locale: DatePickerLocale;
  itemHeight?: number;
  visibleItems?: number;
  validationOptions?: TimeValidationOptions;
  style?: StyleProp<ViewStyle>;
}

export const WheelTimePicker: React.FC<WheelTimePickerProps> = ({
  hours,
  minutes,
  seconds = 0,
  period = 'AM',
  is24Hour = false,
  minuteInterval = 1,
  showSeconds = false,
  onTimeChange,
  theme,
  locale,
  itemHeight = 44,
  visibleItems = 5,
  validationOptions,
  style,
}) => {
  // Ensure minutes snaps to valid minuteItems interval
  const interval = Math.max(1, Math.min(30, minuteInterval));
  const normalizedMinutes = useMemo(() => {
    if (interval <= 1) return minutes;
    const rounded = Math.round(minutes / interval) * interval;
    return rounded >= 60 ? 0 : rounded;
  }, [minutes, interval]);

  // 1. Hours items
  const hourItems: WheelItem[] = useMemo(() => {
    const list: WheelItem[] = [];
    if (is24Hour) {
      for (let h = 0; h <= 23; h++) {
        const disabled = isHourDisabled(h, true, undefined, validationOptions);
        list.push({
          label: `${padZero(h)}${disabled ? ' ✕' : ''}`,
          value: h,
        });
      }
    } else {
      const startH = hours === 0 ? 0 : 1;
      for (let h = startH; h <= 12; h++) {
        const disabled = h === 0 ? false : isHourDisabled(h, false, period, validationOptions);
        list.push({
          label: `${padZero(h)}${disabled ? ' ✕' : ''}`,
          value: h,
        });
      }
    }
    return list;
  }, [is24Hour, hours, period, validationOptions]);

  // 2. Minutes items
  const minuteItems: WheelItem[] = useMemo(() => {
    const list: WheelItem[] = [];
    for (let m = 0; m <= 59; m += interval) {
      const disabled = isMinuteDisabled(m, hours, is24Hour, period, validationOptions);
      list.push({
        label: `${padZero(m)}${disabled ? ' ✕' : ''}`,
        value: m,
      });
    }
    return list;
  }, [interval, hours, is24Hour, period, validationOptions]);

  // 3. Seconds items
  const secondItems: WheelItem[] = useMemo(() => {
    const list: WheelItem[] = [];
    for (let s = 0; s <= 59; s += 5) {
      list.push({
        label: padZero(s),
        value: s,
      });
    }
    return list;
  }, []);

  return (
    <View style={[styles.wrapper, style]}>
      {/* Column Labels */}
      <View style={styles.labelsRow}>
        <Text style={[styles.columnLabel, { color: theme.secondaryTextColor }]}>
          {locale.hourLabel ? locale.hourLabel.toUpperCase() : 'HOUR'}
        </Text>
        <Text style={[styles.columnLabel, { color: theme.secondaryTextColor }]}>
          {locale.minuteLabel ? locale.minuteLabel.toUpperCase() : 'MIN'}
        </Text>
        {showSeconds && (
          <Text style={[styles.columnLabel, { color: theme.secondaryTextColor }]}>
            {locale.secondLabel ? locale.secondLabel.toUpperCase() : 'SEC'}
          </Text>
        )}
        {!is24Hour && (
          <Text style={[styles.columnLabel, { color: theme.secondaryTextColor }]}>
            PERIOD
          </Text>
        )}
      </View>

      <View style={styles.wheelsRow}>
        {/* Hours Wheel Column */}
        <View style={styles.wheelColContainer}>
          <WheelColumn
            items={hourItems}
            selectedValue={hours}
            onValueChange={(newHour) => {
              onTimeChange({
                hours: newHour,
                minutes: normalizedMinutes,
                seconds,
                period,
              });
            }}
            theme={theme}
            itemHeight={itemHeight}
            visibleItems={visibleItems}
            accessibilityLabel={locale.hourLabel}
          />
        </View>

        {/* Colon separator */}
        <View style={styles.colonContainer}>
          <Text style={[styles.colonText, { color: theme.textColor }]}>:</Text>
        </View>

        {/* Minutes Wheel Column */}
        <View style={styles.wheelColContainer}>
          <WheelColumn
            items={minuteItems}
            selectedValue={normalizedMinutes}
            onValueChange={(newMinute) => {
              onTimeChange({
                hours,
                minutes: newMinute,
                seconds,
                period,
              });
            }}
            theme={theme}
            itemHeight={itemHeight}
            visibleItems={visibleItems}
            accessibilityLabel={locale.minuteLabel}
          />
        </View>

        {/* Optional Seconds Column */}
        {showSeconds && (
          <>
            <View style={styles.colonContainer}>
              <Text style={[styles.colonText, { color: theme.textColor }]}>:</Text>
            </View>
            <View style={styles.wheelColContainer}>
              <WheelColumn
                items={secondItems}
                selectedValue={seconds}
                onValueChange={(newSecond) => {
                  onTimeChange({
                    hours,
                    minutes: normalizedMinutes,
                    seconds: newSecond,
                    period,
                  });
                }}
                theme={theme}
                itemHeight={itemHeight}
                visibleItems={visibleItems}
                accessibilityLabel={locale.secondLabel}
              />
            </View>
          </>
        )}

        {/* AM / PM Segmented Selector (12-hour only) */}
        {!is24Hour && (
          <View style={styles.periodContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (period !== 'AM') {
                  onTimeChange({
                    hours,
                    minutes: normalizedMinutes,
                    seconds,
                    period: 'AM',
                  });
                }
              }}
              style={[
                styles.periodBtn,
                period === 'AM'
                  ? {
                      backgroundColor: theme.primaryColor,
                      borderColor: theme.primaryColor,
                    }
                  : {
                      backgroundColor: theme.cardColor,
                      borderColor: theme.borderColor,
                    },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: period === 'AM' }}
            >
              <Text
                style={[
                  styles.periodBtnText,
                  {
                    color: period === 'AM' ? '#FFFFFF' : theme.textColor,
                    fontWeight: period === 'AM' ? '800' : '600',
                  },
                ]}
              >
                {locale.am || 'AM'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (period !== 'PM') {
                  onTimeChange({
                    hours,
                    minutes: normalizedMinutes,
                    seconds,
                    period: 'PM',
                  });
                }
              }}
              style={[
                styles.periodBtn,
                period === 'PM'
                  ? {
                      backgroundColor: theme.primaryColor,
                      borderColor: theme.primaryColor,
                    }
                  : {
                      backgroundColor: theme.cardColor,
                      borderColor: theme.borderColor,
                    },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: period === 'PM' }}
            >
              <Text
                style={[
                  styles.periodBtnText,
                  {
                    color: period === 'PM' ? '#FFFFFF' : theme.textColor,
                    fontWeight: period === 'PM' ? '800' : '600',
                  },
                ]}
              >
                {locale.pm || 'PM'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingVertical: 8,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 6,
    paddingHorizontal: 8,
  },
  columnLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
    flex: 1,
  },
  wheelsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  wheelColContainer: {
    flex: 1,
    maxWidth: 90,
  },
  colonContainer: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  colonText: {
    fontSize: 24,
    fontWeight: '800',
  },
  periodContainer: {
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  periodBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    minWidth: 58,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  periodBtnText: {
    fontSize: 14,
  },
});
