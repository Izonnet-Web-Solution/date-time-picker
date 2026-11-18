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
      {/* Top Header Row with Title, 12h/24h toggle badge, and Layout Switcher */}
      <View style={styles.topBar}>
        <View style={styles.titleBlock}>
          <Text style={[styles.mainTitle, { color: theme.textColor }]}>
            {locale.selectTime || 'Time Picker'}
          </Text>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setIs24Hour(!is24Hour)}
            style={[
              styles.modeBadge,
              {
                backgroundColor: `${theme.primaryColor}14`,
                borderColor: `${theme.primaryColor}30`,
              },
            ]}
          >
            <Text style={[styles.modeBadgeText, { color: theme.primaryColor }]}>
              {is24Hour ? '24H ⇄' : '12H (AM/PM) ⇄'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* View Mode Segmented Capsule */}
        <View
          style={[
            styles.layoutPillsContainer,
            {
              backgroundColor: `${theme.textColor}0A`,
              borderColor: theme.borderColor,
            },
          ]}
        >
          {(['wheel', 'spinner', 'segmented'] as TimePickerLayout[]).map((modeKey) => {
            const isSel = layout === modeKey;
            const label = modeKey === 'wheel' ? 'Wheel' : modeKey === 'spinner' ? 'Dial' : 'Stepper';
            return (
              <TouchableOpacity
                key={modeKey}
                activeOpacity={0.8}
                onPress={() => setLayout(modeKey)}
                style={[
                  styles.layoutPill,
                  isSel && {
                    backgroundColor: theme.primaryColor,
                    shadowColor: theme.primaryColor,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3,
                    elevation: 2,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.layoutPillText,
                    {
                      color: isSel ? '#FFFFFF' : theme.secondaryTextColor,
                      fontWeight: isSel ? '800' : '600',
                    },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Sleek Compact Hero Time Display */}
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
          {/* Hour Unit Box */}
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
                    shadowOpacity: 0.18,
                    shadowRadius: 5,
                    elevation: 3,
                  }
                : {
                    borderColor: 'transparent',
                    backgroundColor: `${theme.textColor}06`,
                  },
            ]}
          >
            <Text
              style={[
                styles.heroDigitText,
                {
                  color: activeUnit === 'hours' ? theme.primaryColor : theme.textColor,
                  fontSize: 34,
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

          {/* Minute Unit Box */}
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
                    shadowOpacity: 0.18,
                    shadowRadius: 5,
                    elevation: 3,
                  }
                : {
                    borderColor: 'transparent',
                    backgroundColor: `${theme.textColor}06`,
                  },
            ]}
          >
            <Text
              style={[
                styles.heroDigitText,
                {
                  color: activeUnit === 'minutes' ? theme.primaryColor : theme.textColor,
                  fontSize: 34,
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

          {/* Optional Seconds */}
          {showSeconds && (
            <>
              <Text style={[styles.heroColon, { color: theme.textColor }]}>:</Text>
              <View
                style={[
                  styles.heroDigitBox,
                  {
                    borderColor: 'transparent',
                    backgroundColor: `${theme.textColor}06`,
                    minWidth: 54,
                  },
                ]}
              >
                <Text style={[styles.heroDigitText, { color: theme.textColor, fontSize: 34 }]}>
                  {padZero(seconds)}
                </Text>
                <Text style={[styles.heroUnitSubtext, { color: theme.secondaryTextColor }]}>
                  SEC
                </Text>
              </View>
            </>
          )}

          {/* AM / PM Segmented Capsule (for 12h) */}
          {!is24Hour && (
            <View
              style={[
                styles.heroPeriodPill,
                {
                  backgroundColor: `${theme.textColor}0A`,
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
                    shadowRadius: 2,
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
                    shadowRadius: 2,
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
        <View style={styles.dialContainer}>
          <ClockDial
            size={228}
            mode={activeUnit}
            value={activeUnit === 'hours' ? hours : minutes}
            is24Hour={is24Hour}
            period={period}
            onSelect={(selectedVal) => {
              if (activeUnit === 'hours') {
                applyTimeChange(selectedVal, minutes, seconds, period);
                setActiveUnit('minutes'); // Smoothly advance to minutes
              } else {
                applyTimeChange(hours, selectedVal, seconds, period);
              }
            }}
            theme={theme}
            validationOptions={validationOptions}
          />

          {/* Compact Precision Minute Controls */}
          {activeUnit === 'minutes' && (
            <View
              style={[
                styles.fineMinuteContainer,
                { backgroundColor: theme.cardColor, borderColor: theme.borderColor },
              ]}
            >
              <View style={styles.fineMinuteHeaderRow}>
                <Text style={[styles.fineMinuteTitle, { color: theme.secondaryTextColor }]}>
                  MINUTE PRECISION:
                </Text>
                <View style={styles.fineMinuteStepper}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => stepMinute(-5)}
                    style={[styles.fineStepBtn, { backgroundColor: `${theme.primaryColor}12` }]}
                  >
                    <Text style={[styles.fineStepText, { color: theme.primaryColor }]}>−5m</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => stepMinute(-1)}
                    style={[styles.fineStepBtn, { backgroundColor: `${theme.primaryColor}18` }]}
                  >
                    <Text style={[styles.fineStepText, { color: theme.primaryColor }]}>−1m</Text>
                  </TouchableOpacity>
                  <View
                    style={[
                      styles.fineMinuteDisplayBox,
                      { backgroundColor: `${theme.primaryColor}15`, borderColor: `${theme.primaryColor}40` },
                    ]}
                  >
                    <Text style={[styles.fineMinuteDisplay, { color: theme.primaryColor }]}>
                      :{padZero(minutes)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => stepMinute(1)}
                    style={[styles.fineStepBtn, { backgroundColor: `${theme.primaryColor}18` }]}
                  >
                    <Text style={[styles.fineStepText, { color: theme.primaryColor }]}>+1m</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => stepMinute(5)}
                    style={[styles.fineStepBtn, { backgroundColor: `${theme.primaryColor}12` }]}
                  >
                    <Text style={[styles.fineStepText, { color: theme.primaryColor }]}>+5m</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Dynamic nearby minutes based on current value (e.g. 25 -> :25, :26, :27, :28, :29, :30) */}
              <View style={styles.minutePillsRow}>
                {(() => {
                  const base5 = Math.floor(minutes / 5) * 5;
                  const nearby = [base5, (base5 + 1) % 60, (base5 + 2) % 60, (base5 + 3) % 60, (base5 + 4) % 60, (base5 + 5) % 60];
                  return nearby.map((mVal) => {
                    const isCurrent = minutes === mVal;
                    return (
                      <TouchableOpacity
                        key={`nearby-m-${mVal}`}
                        activeOpacity={0.75}
                        onPress={() => applyTimeChange(hours, mVal, seconds, period)}
                        style={[
                          styles.minutePillChip,
                          {
                            backgroundColor: isCurrent ? theme.primaryColor : `${theme.primaryColor}10`,
                            borderColor: isCurrent ? theme.primaryColor : `${theme.primaryColor}24`,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.minutePillChipText,
                            { color: isCurrent ? '#FFFFFF' : theme.primaryColor, fontWeight: isCurrent ? '900' : '700' },
                          ]}
                        >
                          :{padZero(mVal)}
                        </Text>
                      </TouchableOpacity>
                    );
                  });
                })()}
              </View>
            </View>
          )}
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

      {/* Quick Jump Shortcuts Strip */}
      <View style={styles.presetsRow}>
        <Text style={[styles.presetsTitle, { color: theme.secondaryTextColor }]}>
          QUICK:
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.presetsScroll}
        >
          {[
            { label: is24Hour ? '09:00' : '09:00 AM', h: 9, m: 0, p: 'AM' as TimePeriod },
            { label: is24Hour ? '12:00' : '12:00 PM', h: 12, m: 0, p: 'PM' as TimePeriod },
            { label: is24Hour ? '15:00' : '03:00 PM', h: is24Hour ? 15 : 3, m: 0, p: 'PM' as TimePeriod },
            { label: is24Hour ? '18:00' : '06:00 PM', h: is24Hour ? 18 : 6, m: 0, p: 'PM' as TimePeriod },
            { label: is24Hour ? '21:00' : '09:00 PM', h: is24Hour ? 21 : 9, m: 0, p: 'PM' as TimePeriod },
          ].map((preset) => {
            const isMatch =
              (is24Hour ? hours === preset.h : hours === preset.h && period === preset.p) &&
              minutes === preset.m;
            return (
              <TouchableOpacity
                key={preset.label}
                activeOpacity={0.75}
                onPress={() => applyTimeChange(preset.h, preset.m, 0, preset.p)}
                style={[
                  styles.presetPill,
                  {
                    borderColor: isMatch ? theme.primaryColor : theme.borderColor,
                    backgroundColor: isMatch ? `${theme.primaryColor}18` : theme.cardColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.presetPillText,
                    {
                      color: isMatch ? theme.primaryColor : theme.textColor,
                      fontWeight: isMatch ? '800' : '600',
                    },
                  ]}
                >
                  {preset.label}
                </Text>
              </TouchableOpacity>
            );
          })}
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
    padding: 14,
    borderWidth: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  modeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  modeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  layoutPillsContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 2,
    borderWidth: 1,
  },
  layoutPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  layoutPillText: {
    fontSize: 11,
  },
  heroCard: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  heroCenterBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroDigitBox: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    minWidth: 72,
  },
  heroDigitText: {
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  heroUnitSubtext: {
    fontSize: 9,
    fontWeight: '800',
    marginTop: -2,
    letterSpacing: 0.6,
  },
  heroColon: {
    fontSize: 30,
    fontWeight: '900',
    marginHorizontal: 5,
    marginTop: -8,
  },
  heroPeriodPill: {
    marginLeft: 12,
    borderRadius: 10,
    borderWidth: 1,
    padding: 2,
    gap: 3,
  },
  heroPeriodBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  heroPeriodText: {
    fontSize: 11,
  },
  viewContainer: {
    paddingVertical: 2,
  },
  dialContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  fineMinuteContainer: {
    width: '100%',
    marginTop: 8,
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  fineMinuteHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  fineMinuteTitle: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  fineMinuteStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fineStepBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  fineStepText: {
    fontSize: 11,
    fontWeight: '800',
  },
  fineMinuteDisplayBox: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  fineMinuteDisplay: {
    fontSize: 12,
    fontWeight: '800',
    minWidth: 24,
    textAlign: 'center',
  },
  minutePillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  minutePillChip: {
    flex: 1,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  minutePillChipText: {
    fontSize: 10,
  },
  stepperRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  stepperUnitCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  stepperCardTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepperCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperCircleText: {
    fontSize: 20,
    fontWeight: '800',
  },
  stepperValueText: {
    fontSize: 24,
    fontWeight: '900',
    minWidth: 38,
    textAlign: 'center',
  },
  presetsRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  presetsTitle: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginRight: 6,
  },
  presetsScroll: {
    gap: 6,
    paddingRight: 6,
  },
  presetPill: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  presetPillText: {
    fontSize: 11,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
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
