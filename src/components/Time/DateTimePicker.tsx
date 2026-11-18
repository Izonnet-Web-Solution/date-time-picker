import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import type {
  DatePickerTheme,
  DatePickerLocale,
  DateFormat,
  DisabledDateCheck,
  TimePickerLayout,
} from '../../types';
import { formatDate } from '../../utils/dateFormatting';
import { setTimeOnDate } from '../../utils/timeUtils';
import { validateDate } from '../../utils/dateValidation';
import { Calendar } from '../Calendar/Calendar';
import { TimePicker } from './TimePicker';
import { Button } from '../common/Button';

export interface DateTimePickerComponentProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  format?: DateFormat;
  is24Hour?: boolean;
  minuteInterval?: number;
  minimumTime?: string | Date;
  maximumTime?: string | Date;
  minimumDate?: Date;
  maximumDate?: Date;
  disabledDates?: (Date | string)[] | DisabledDateCheck;
  disabledWeekdays?: number[];
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  showSeconds?: boolean;
  timePickerLayout?: TimePickerLayout;
  allowManualEntry?: boolean;
  theme: DatePickerTheme;
  locale: DatePickerLocale;
  initialTab?: 'date' | 'time';
  showActionButtons?: boolean;
  onConfirm?: (date: Date | null) => void;
  onCancel?: () => void;
  onClear?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const DateTimePicker: React.FC<DateTimePickerComponentProps> = ({
  value: controlledValue,
  defaultValue = null,
  onChange,
  format,
  is24Hour = false,
  minuteInterval = 1,
  minimumTime,
  maximumTime,
  minimumDate,
  maximumDate,
  disabledDates,
  disabledWeekdays,
  firstDayOfWeek = 0,
  showSeconds = false,
  timePickerLayout = 'wheel',
  allowManualEntry = false,
  theme,
  locale,
  initialTab = 'date',
  showActionButtons = true,
  onConfirm,
  onCancel,
  onClear,
  style,
}) => {
  const [activeTab, setActiveTab] = useState<'date' | 'time'>(initialTab);
  const [currentDate, setCurrentDate] = useState<Date>(
    controlledValue || defaultValue || new Date()
  );

  const displayFormat =
    format || (is24Hour ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY hh:mm A');

  // Handle Date Selection from Calendar
  const handleDateSelect = useCallback(
    (newDate: Date | null) => {
      if (!newDate) {
        onChange?.(null);
        return;
      }
      // Preserve existing hours and minutes
      const combined = setTimeOnDate(
        newDate,
        currentDate.getHours(),
        currentDate.getMinutes(),
        currentDate.getSeconds()
      );
      setCurrentDate(combined);
      onChange?.(combined);
    },
    [currentDate, onChange]
  );

  // Handle Time Selection from TimePicker
  const handleTimeSelect = useCallback(
    (newDateWithTime: Date | null) => {
      if (!newDateWithTime) {
        onChange?.(null);
        return;
      }
      setCurrentDate(newDateWithTime);
      onChange?.(newDateWithTime);
    },
    [onChange]
  );

  // Global validation check
  const isValid = useMemo(() => {
    const val = validateDate(currentDate, {
      minimumDate,
      maximumDate,
      disabledDates,
      disabledWeekdays,
      minimumTime,
      maximumTime,
      is24Hour,
      validateTimeComponent: true,
      locale,
    });
    return val.isValid;
  }, [
    currentDate,
    minimumDate,
    maximumDate,
    disabledDates,
    disabledWeekdays,
    minimumTime,
    maximumTime,
    is24Hour,
    locale,
  ]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surfaceColor,
          borderRadius: 20,
          borderColor: theme.borderColor,
        },
        style,
      ]}
    >
      {/* Top Banner Ticket Display */}
      <View
        style={[
          styles.previewBanner,
          {
            backgroundColor: theme.cardColor,
            borderColor: theme.borderColor,
          },
        ]}
      >
        <View style={styles.previewHeaderRow}>
          <Text style={[styles.previewLabel, { color: theme.secondaryTextColor }]}>
            SCHEDULED DATE & TIME
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: `${theme.primaryColor}15` }]}>
            <Text style={[styles.statusBadgeText, { color: theme.primaryColor }]}>
              {activeTab === 'date' ? 'Step 1: Pick Date' : 'Step 2: Pick Time'}
            </Text>
          </View>
        </View>

        <Text style={[styles.previewValue, { color: theme.textColor }]}>
          {formatDate(currentDate, displayFormat, locale)}
        </Text>
      </View>

      {/* Segmented Tab Switcher: [ 📅 Date ] [ ⏰ Time ] */}
      <View
        style={[
          styles.tabBar,
          {
            backgroundColor: `${theme.textColor}0A`,
            borderColor: theme.borderColor,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab('date')}
          style={[
            styles.tabItem,
            activeTab === 'date' && {
              backgroundColor: theme.cardColor,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 2,
            },
          ]}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'date' ? theme.primaryColor : theme.secondaryTextColor,
                fontWeight: activeTab === 'date' ? '800' : '600',
              },
            ]}
          >
            📅 {locale.selectDate || 'Calendar Date'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab('time')}
          style={[
            styles.tabItem,
            activeTab === 'time' && {
              backgroundColor: theme.cardColor,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 2,
            },
          ]}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'time' ? theme.primaryColor : theme.secondaryTextColor,
                fontWeight: activeTab === 'time' ? '800' : '600',
              },
            ]}
          >
            ⏰ {locale.timeLabel || 'Clock Time'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab 1: Date (Calendar) */}
      {activeTab === 'date' && (
        <Calendar
          selectedDate={currentDate}
          onSelectDate={handleDateSelect}
          theme={theme}
          locale={locale}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          disabledDates={disabledDates}
          disabledWeekdays={disabledWeekdays}
          firstDayOfWeek={firstDayOfWeek}
          allowManualEntry={allowManualEntry}
          showActionButtons={false}
        />
      )}

      {/* Tab 2: Time (TimePicker) */}
      {activeTab === 'time' && (
        <TimePicker
          value={currentDate}
          onChange={handleTimeSelect}
          is24Hour={is24Hour}
          minuteInterval={minuteInterval}
          minimumTime={minimumTime}
          maximumTime={maximumTime}
          selectedDate={currentDate}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          showSeconds={showSeconds}
          timePickerLayout={timePickerLayout}
          theme={theme}
          locale={locale}
          showActionButtons={false}
        />
      )}

      {/* Bottom Action Buttons */}
      {showActionButtons && (
        <View style={styles.actionsRow}>
          <View style={styles.leftActions}>
            <Button
              title="Today/Now"
              onPress={() => {
                const now = new Date();
                setCurrentDate(now);
                onChange?.(now);
              }}
              variant="outline"
              size="small"
              theme={theme}
            />
            {onClear && (
              <Button
                title={locale.clear}
                onPress={() => {
                  onChange?.(null);
                  onClear();
                }}
                variant="text"
                size="small"
                theme={theme}
              />
            )}
          </View>
          <View style={styles.rightActions}>
            {onCancel && (
              <Button
                title={locale.cancel}
                onPress={onCancel}
                variant="text"
                size="small"
                theme={theme}
              />
            )}
            {onConfirm && (
              <Button
                title={locale.confirm}
                onPress={() => onConfirm(currentDate)}
                variant="primary"
                size="small"
                disabled={!isValid}
                theme={theme}
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
  },
  previewBanner: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  previewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  previewLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  previewValue: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginBottom: 14,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  tabText: {
    fontSize: 13,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
