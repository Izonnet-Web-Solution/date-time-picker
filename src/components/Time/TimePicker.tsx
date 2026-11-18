import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ScrollView,
} from 'react-native';
import type {
  DatePickerTheme,
  DatePickerLocale,
  TimePeriod,
  TimePickerLayout,
  ValidationResult,
  DateFormat,
} from '../../types';
import {
  padZero,
  convert12To24,
  setTimeOnDate,
  getTimeFromDate,
  validateTime,
  is24HourFormat,
  TimeValidationOptions,
} from '../../utils/timeUtils';
import { WheelTimePicker } from './WheelTimePicker';
import { ClockDial } from './ClockDial';
import { Button } from '../common/Button';
import { DateValidationMessage } from '../ManualDateInput/DateValidationMessage';

export interface TimePickerProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  is24Hour?: boolean;
  minuteInterval?: number;
  minimumTime?: string | Date;
  maximumTime?: string | Date;
  selectedDate?: Date | null;
  minimumDate?: Date;
  maximumDate?: Date;
  showSeconds?: boolean;
  timePickerLayout?: TimePickerLayout;
  format?: DateFormat;
  theme: DatePickerTheme;
  locale: DatePickerLocale;
  showActionButtons?: boolean;
  showNowButton?: boolean;
  showClearButton?: boolean;
  onConfirm?: (date: Date | null) => void;
  onCancel?: () => void;
  onClear?: () => void;
  style?: StyleProp<ViewStyle>;
}

type ActiveTimeUnit = 'hours' | 'minutes';

export const TimePicker: React.FC<TimePickerProps> = ({
  value: controlledValue,
  defaultValue = null,
  onChange,
  is24Hour: is24HourProp,
  minuteInterval = 1,
  minimumTime,
  maximumTime,
  selectedDate,
  minimumDate,
  maximumDate,
  showSeconds = false,
  timePickerLayout: layoutProp = 'wheel',
  format,
  theme,
  locale,
  showActionButtons = true,
  showNowButton = true,
  showClearButton = true,
  onConfirm,
  onCancel,
  onClear,
  style,
}) => {
  // Determine 24-hour mode
  const [is24Hour, setIs24Hour] = useState<boolean>(() => {
    if (is24HourProp !== undefined) return is24HourProp;
    if (format) return is24HourFormat(format);
    return false;
  });

  useEffect(() => {
    if (is24HourProp !== undefined) {
      setIs24Hour(is24HourProp);
    }
  }, [is24HourProp]);

  // Layout mode: 'wheel' | 'spinner' (dial/clock) | 'segmented' (steppers)
  const [layout, setLayout] = useState<TimePickerLayout>(layoutProp);

  useEffect(() => {
    setLayout(layoutProp);
  }, [layoutProp]);

  // Active focused unit for Clock Dial
  const [activeUnit, setActiveUnit] = useState<ActiveTimeUnit>('hours');

  // Selected date or baseline
  const activeDate = controlledValue || defaultValue || new Date();

  // Internal time state
  const initialTime = useMemo(() => {
    return getTimeFromDate(activeDate, is24Hour);
  }, [activeDate, is24Hour]);

  const [hours, setHours] = useState<number>(initialTime.hours);
  const [minutes, setMinutes] = useState<number>(initialTime.minutes);
  const [seconds, setSeconds] = useState<number>(initialTime.seconds || 0);
  const [period, setPeriod] = useState<TimePeriod>(initialTime.period || 'AM');
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true });

  // Sync state when controlled value or 24h mode changes
  useEffect(() => {
    if (controlledValue) {
      const parsed = getTimeFromDate(controlledValue, is24Hour);
      setHours(parsed.hours);
      setMinutes(parsed.minutes);
      setSeconds(parsed.seconds || 0);
      if (parsed.period) setPeriod(parsed.period);
    }
  }, [controlledValue, is24Hour]);

  // Validation options
  const validationOptions: TimeValidationOptions = useMemo(
    () => ({
      minimumTime,
      maximumTime,
      selectedDate,
      minimumDate,
      maximumDate,
      minuteInterval,
      locale,
    }),
    [minimumTime, maximumTime, selectedDate, minimumDate, maximumDate, minuteInterval, locale]
  );

  // Apply change callback
  const applyTimeChange = useCallback(
    (newH: number, newM: number, newS: number, newP?: TimePeriod) => {
      setHours(newH);
      setMinutes(newM);
      setSeconds(newS);
      if (newP) setPeriod(newP);

      const valResult = validateTime(
        {
          hours: newH,
          minutes: newM,
          seconds: newS,
          period: newP,
          is24Hour,
        },
        is24Hour,
        validationOptions
      );

      setValidation(valResult);

      if (valResult.isValid) {
        const h24 = is24Hour ? newH : convert12To24(newH, newP || 'AM');
        const base = activeDate || new Date();
        const updatedDate = setTimeOnDate(base, h24, newM, newS);
        onChange?.(updatedDate);
      }
    },
    [is24Hour, validationOptions, activeDate, onChange]
  );

  // Steppers
  const stepHour = (delta: number) => {
    if (is24Hour) {
      const nextH = (hours + delta + 24) % 24;
      applyTimeChange(nextH, minutes, seconds, period);
    } else {
      let nextH = hours + delta;
      let nextP = period;
      if (nextH > 12) {
        nextH = 1;
      } else if (nextH < 1) {
        nextH = 12;
      }
      applyTimeChange(nextH, minutes, seconds, nextP);
    }
  };

  const stepMinute = (delta: number) => {
    const step = delta * (minuteInterval > 1 ? minuteInterval : 1);
    const nextM = (minutes + step + 60) % 60;
    applyTimeChange(hours, nextM, seconds, period);
  };

  const togglePeriod = (newP: TimePeriod) => {
    if (period !== newP) {
      applyTimeChange(hours, minutes, seconds, newP);
    }
  };

  const handleNow = () => {
    const now = new Date();
    const t = getTimeFromDate(now, is24Hour);
    applyTimeChange(t.hours, t.minutes, t.seconds || 0, t.period);
  };

  const handleClear = () => {
    onChange?.(null);
    onClear?.();
  };

  const handleConfirm = () => {
    if (validation.isValid) {
      const h24 = is24Hour ? hours : convert12To24(hours, period);
      const base = activeDate || new Date();
      const finalDate = setTimeOnDate(base, h24, minutes, seconds);
      onConfirm?.(finalDate);
    }
  };

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
      {/* Top Header Row with Title and Layout Toggle */}
      <View style={styles.topBar}>
        <View>
          <Text style={[styles.mainTitle, { color: theme.textColor }]}>
            {locale.selectTime || 'Time Picker'}
          </Text>
          <Text style={[styles.subTitle, { color: theme.secondaryTextColor }]}>
            {is24Hour ? '24 Hours Mode' : '12 Hours (AM / PM)'}
          </Text>
        </View>

        {/* View Mode Segmented Pill */}
        <View
          style={[
            styles.layoutPillsContainer,
            { backgroundColor: `${theme.textColor}0C` },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setLayout('wheel')}
            style={[
              styles.layoutPill,
              layout === 'wheel' && {
                backgroundColor: theme.primaryColor,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.15,
                shadowRadius: 2,
                elevation: 2,
              },
            ]}
          >
            <Text
              style={[
                styles.layoutPillText,
                { color: layout === 'wheel' ? '#FFFFFF' : theme.secondaryTextColor },
              ]}
            >
              Wheel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setLayout('spinner')}
            style={[
              styles.layoutPill,
              layout === 'spinner' && {
                backgroundColor: theme.primaryColor,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.15,
                shadowRadius: 2,
                elevation: 2,
              },
            ]}
          >
            <Text
              style={[
                styles.layoutPillText,
                { color: layout === 'spinner' ? '#FFFFFF' : theme.secondaryTextColor },
              ]}
            >
              Dial
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setLayout('segmented')}
            style={[
              styles.layoutPill,
              layout === 'segmented' && {
                backgroundColor: theme.primaryColor,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.15,
                shadowRadius: 2,
                elevation: 2,
              },
            ]}
          >
            <Text
              style={[
                styles.layoutPillText,
                { color: layout === 'segmented' ? '#FFFFFF' : theme.secondaryTextColor },
              ]}
            >
              Stepper
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero Display Card */}
      <View
        style={[
          styles.heroCard,
          {
            backgroundColor: theme.cardColor,
            borderColor: theme.borderColor,
          },
        ]}
      >
        <View style={styles.heroCenterBlock}>
          {/* Hour Unit Tile */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveUnit('hours')}
            style={[
              styles.heroDigitBox,
              activeUnit === 'hours'
                ? {
                    borderColor: theme.primaryColor,
                    backgroundColor: `${theme.primaryColor}14`,
                    shadowColor: theme.primaryColor,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 6,
                    elevation: 3,
                  }
                : {
                    borderColor: 'transparent',
                    backgroundColor: `${theme.textColor}08`,
                  },
            ]}
          >
            <Text
              style={[
                styles.heroDigitText,
                {
                  color: activeUnit === 'hours' ? theme.primaryColor : theme.textColor,
                  fontSize: 38,
                },
              ]}
            >
              {padZero(hours)}
            </Text>
            <Text
              style={[
                styles.heroUnitSubtext,
                { color: activeUnit === 'hours' ? theme.primaryColor : theme.secondaryTextColor },
              ]}
            >
              {locale.hourLabel ? locale.hourLabel.toUpperCase() : 'HOUR'}
            </Text>
          </TouchableOpacity>

          {/* Colon Separator */}
          <Text style={[styles.heroColon, { color: theme.textColor }]}>:</Text>

          {/* Minute Unit Tile */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveUnit('minutes')}
            style={[
              styles.heroDigitBox,
              activeUnit === 'minutes'
                ? {
                    borderColor: theme.primaryColor,
                    backgroundColor: `${theme.primaryColor}14`,
                    shadowColor: theme.primaryColor,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 6,
                    elevation: 3,
                  }
                : {
                    borderColor: 'transparent',
                    backgroundColor: `${theme.textColor}08`,
                  },
            ]}
          >
            <Text
              style={[
                styles.heroDigitText,
                {
                  color: activeUnit === 'minutes' ? theme.primaryColor : theme.textColor,
                  fontSize: 38,
                },
              ]}
            >
              {padZero(minutes)}
            </Text>
            <Text
              style={[
                styles.heroUnitSubtext,
                { color: activeUnit === 'minutes' ? theme.primaryColor : theme.secondaryTextColor },
              ]}
            >
              {locale.minuteLabel ? locale.minuteLabel.toUpperCase() : 'MIN'}
            </Text>
          </TouchableOpacity>

          {/* AM / PM Segmented Capsule (for 12h) */}
          {!is24Hour && (
            <View
              style={[
                styles.heroPeriodPill,
                {
                  backgroundColor: `${theme.textColor}0E`,
                  borderColor: theme.borderColor,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => togglePeriod('AM')}
                style={[
                  styles.heroPeriodBtn,
                  period === 'AM' && {
                    backgroundColor: theme.primaryColor,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    elevation: 2,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.heroPeriodText,
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
                onPress={() => togglePeriod('PM')}
                style={[
                  styles.heroPeriodBtn,
                  period === 'PM' && {
                    backgroundColor: theme.primaryColor,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    elevation: 2,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.heroPeriodText,
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

        {/* 12h / 24h Toggle Pill */}
        <View style={styles.formatModeRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIs24Hour(!is24Hour)}
            style={[
              styles.formatToggleBtn,
              {
                backgroundColor: `${theme.primaryColor}10`,
                borderColor: `${theme.primaryColor}30`,
              },
            ]}
          >
            <Text style={[styles.formatToggleText, { color: theme.primaryColor }]}>
              {is24Hour ? '⇄ Switch to 12-Hour (AM/PM)' : '⇄ Switch to 24-Hour'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- VIEW 1: WHEEL PICKER --- */}
      {layout === 'wheel' && (
        <View style={styles.viewContainer}>
          <WheelTimePicker
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            period={period}
            is24Hour={is24Hour}
            minuteInterval={minuteInterval}
            showSeconds={showSeconds}
            onTimeChange={(t) => {
              applyTimeChange(t.hours, t.minutes, t.seconds, t.period);
            }}
            theme={theme}
            locale={locale}
            validationOptions={validationOptions}
          />
        </View>
      )}

      {/* --- VIEW 2: CLOCK DIAL PICKER --- */}
      {layout === 'spinner' && (
        <View style={styles.viewContainer}>
          <View style={styles.dialHeaderTabs}>
            <TouchableOpacity
              onPress={() => setActiveUnit('hours')}
              style={[
                styles.dialTabPill,
                activeUnit === 'hours' && { backgroundColor: theme.primaryColor },
              ]}
            >
              <Text
                style={[
                  styles.dialTabText,
                  { color: activeUnit === 'hours' ? '#FFFFFF' : theme.secondaryTextColor },
                ]}
              >
                Hours ({padZero(hours)})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveUnit('minutes')}
              style={[
                styles.dialTabPill,
                activeUnit === 'minutes' && { backgroundColor: theme.primaryColor },
              ]}
            >
              <Text
                style={[
                  styles.dialTabText,
                  { color: activeUnit === 'minutes' ? '#FFFFFF' : theme.secondaryTextColor },
                ]}
              >
                Minutes ({padZero(minutes)})
              </Text>
            </TouchableOpacity>
          </View>

          <ClockDial
            mode={activeUnit}
            value={activeUnit === 'hours' ? hours : minutes}
            is24Hour={is24Hour}
            period={period}
            onSelect={(selectedVal) => {
              if (activeUnit === 'hours') {
                applyTimeChange(selectedVal, minutes, seconds, period);
                setActiveUnit('minutes'); // Auto switch to minutes
              } else {
                applyTimeChange(hours, selectedVal, seconds, period);
              }
            }}
            theme={theme}
            validationOptions={validationOptions}
          />
        </View>
      )}

      {/* --- VIEW 3: PRECISE STEPPERS --- */}
      {layout === 'segmented' && (
        <View style={styles.viewContainer}>
          <View style={styles.stepperRow}>
            {/* Hour Adjuster */}
            <View
              style={[
                styles.stepperUnitCard,
                { backgroundColor: theme.cardColor, borderColor: theme.borderColor },
              ]}
            >
              <Text style={[styles.stepperCardTitle, { color: theme.secondaryTextColor }]}>
                {locale.hourLabel ? locale.hourLabel.toUpperCase() : 'HOURS'}
              </Text>
              <View style={styles.stepperControls}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => stepHour(-1)}
                  style={[styles.stepperCircleBtn, { backgroundColor: `${theme.primaryColor}15` }]}
                >
                  <Text style={[styles.stepperCircleText, { color: theme.primaryColor }]}>−</Text>
                </TouchableOpacity>
                <Text style={[styles.stepperValueText, { color: theme.textColor }]}>
                  {padZero(hours)}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => stepHour(1)}
                  style={[styles.stepperCircleBtn, { backgroundColor: `${theme.primaryColor}15` }]}
                >
                  <Text style={[styles.stepperCircleText, { color: theme.primaryColor }]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Minute Adjuster */}
            <View
              style={[
                styles.stepperUnitCard,
                { backgroundColor: theme.cardColor, borderColor: theme.borderColor },
              ]}
            >
              <Text style={[styles.stepperCardTitle, { color: theme.secondaryTextColor }]}>
                {locale.minuteLabel ? locale.minuteLabel.toUpperCase() : 'MINUTES'}
              </Text>
              <View style={styles.stepperControls}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => stepMinute(-1)}
                  style={[styles.stepperCircleBtn, { backgroundColor: `${theme.primaryColor}15` }]}
                >
                  <Text style={[styles.stepperCircleText, { color: theme.primaryColor }]}>−</Text>
                </TouchableOpacity>
                <Text style={[styles.stepperValueText, { color: theme.textColor }]}>
                  {padZero(minutes)}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => stepMinute(1)}
                  style={[styles.stepperCircleBtn, { backgroundColor: `${theme.primaryColor}15` }]}
                >
                  <Text style={[styles.stepperCircleText, { color: theme.primaryColor }]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Quick Jump Shortcuts */}
      <View style={styles.presetsRow}>
        <Text style={[styles.presetsTitle, { color: theme.secondaryTextColor }]}>QUICK JUMPS:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.presetsScroll}
        >
          <TouchableOpacity
            onPress={() => stepMinute(15)}
            style={[styles.presetPill, { borderColor: theme.borderColor, backgroundColor: theme.cardColor }]}
          >
            <Text style={[styles.presetPillText, { color: theme.textColor }]}>+15m</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => stepMinute(30)}
            style={[styles.presetPill, { borderColor: theme.borderColor, backgroundColor: theme.cardColor }]}
          >
            <Text style={[styles.presetPillText, { color: theme.textColor }]}>+30m</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => stepHour(1)}
            style={[styles.presetPill, { borderColor: theme.borderColor, backgroundColor: theme.cardColor }]}
          >
            <Text style={[styles.presetPillText, { color: theme.textColor }]}>+1h</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => applyTimeChange(hours, 0, 0, period)}
            style={[styles.presetPill, { borderColor: theme.borderColor, backgroundColor: theme.cardColor }]}
          >
            <Text style={[styles.presetPillText, { color: theme.textColor }]}>:00</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => applyTimeChange(9, 0, 0, 'AM')}
            style={[styles.presetPill, { borderColor: theme.borderColor, backgroundColor: theme.cardColor }]}
          >
            <Text style={[styles.presetPillText, { color: theme.textColor }]}>09:00 AM</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => applyTimeChange(12, 0, 0, 'PM')}
            style={[styles.presetPill, { borderColor: theme.borderColor, backgroundColor: theme.cardColor }]}
          >
            <Text style={[styles.presetPillText, { color: theme.textColor }]}>12:00 PM</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Validation Message */}
      <DateValidationMessage validation={validation} theme={theme} />

      {/* Bottom Action Bar */}
      {showActionButtons && (
        <View style={styles.actionsRow}>
          <View style={styles.leftActions}>
            {showNowButton && (
              <Button
                title="Now"
                onPress={handleNow}
                variant="outline"
                size="small"
                theme={theme}
              />
            )}
            {showClearButton && (
              <Button
                title={locale.clear}
                onPress={handleClear}
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
                onPress={handleConfirm}
                variant="primary"
                size="small"
                disabled={!validation.isValid}
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  mainTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subTitle: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  layoutPillsContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
  },
  layoutPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  layoutPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  heroCard: {
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  heroCenterBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroDigitBox: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    minWidth: 84,
  },
  heroDigitText: {
    fontWeight: '900',
    letterSpacing: -1,
  },
  heroUnitSubtext: {
    fontSize: 10,
    fontWeight: '800',
    marginTop: -2,
    letterSpacing: 0.6,
  },
  heroColon: {
    fontSize: 36,
    fontWeight: '900',
    marginHorizontal: 6,
    marginTop: -10,
  },
  heroPeriodPill: {
    marginLeft: 14,
    borderRadius: 12,
    borderWidth: 1,
    padding: 3,
    gap: 4,
  },
  heroPeriodBtn: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 9,
    alignItems: 'center',
  },
  heroPeriodText: {
    fontSize: 12,
  },
  formatModeRow: {
    marginTop: 10,
  },
  formatToggleBtn: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  formatToggleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  viewContainer: {
    paddingVertical: 4,
  },
  dialHeaderTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 8,
  },
  dialTabPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  dialTabText: {
    fontSize: 12,
    fontWeight: '700',
  },
  stepperRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  stepperUnitCard: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  stepperCardTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepperCircleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperCircleText: {
    fontSize: 22,
    fontWeight: '800',
  },
  stepperValueText: {
    fontSize: 26,
    fontWeight: '900',
    minWidth: 42,
    textAlign: 'center',
  },
  presetsRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  presetsTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginRight: 8,
  },
  presetsScroll: {
    gap: 6,
    paddingRight: 10,
  },
  presetPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  presetPillText: {
    fontSize: 11,
    fontWeight: '700',
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
