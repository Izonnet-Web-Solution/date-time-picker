import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { DatePickerTheme, TimePeriod } from '../../types';
import { padZero, isHourDisabled, isMinuteDisabled, TimeValidationOptions } from '../../utils/timeUtils';

export interface ClockDialProps {
  mode: 'hours' | 'minutes';
  value: number; // current hours (1..12 or 0..23) or minutes (0..59)
  is24Hour?: boolean;
  period?: TimePeriod;
  onSelect: (value: number) => void;
  theme: DatePickerTheme;
  validationOptions?: TimeValidationOptions;
  size?: number;
}

export const ClockDial: React.FC<ClockDialProps> = ({
  mode,
  value,
  is24Hour = false,
  period = 'AM',
  onSelect,
  theme,
  validationOptions,
  size = 240,
}) => {
  const center = size / 2;
  const radius = size / 2 - 28;
  const innerRadius = radius - 36; // for 24h secondary circle

  // Numbers to display
  const items = useMemo(() => {
    if (mode === 'hours') {
      if (is24Hour) {
        // Outer: 00..11, Inner: 12..23
        const outer = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h, i) => {
          const actualH = h === 12 ? 0 : h;
          const disabled = isHourDisabled(actualH, true, undefined, validationOptions);
          return { num: actualH, label: padZero(actualH), index: i, isInner: false, disabled };
        });
        const inner = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map((h, i) => {
          const disabled = isHourDisabled(h, true, undefined, validationOptions);
          return { num: h, label: String(h), index: i, isInner: true, disabled };
        });
        return [...outer, ...inner];
      } else {
        // 1..12 in outer ring
        return [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h, i) => {
          const disabled = isHourDisabled(h, false, period, validationOptions);
          return { num: h, label: String(h), index: i, isInner: false, disabled };
        });
      }
    } else {
      // Minutes: 00, 05, 10, 15... 55
      return [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m, i) => {
        const disabled = isMinuteDisabled(m, value, is24Hour, period, validationOptions);
        return { num: m, label: padZero(m), index: i, isInner: false, disabled };
      });
    }
  }, [mode, is24Hour, period, value, validationOptions]);

  // Selected item position for clock hand indicator
  const selectedItem = items.find((it) => it.num === value);
  const currentR = selectedItem?.isInner ? innerRadius : radius;

  return (
    <View
      style={[
        styles.clockContainer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: `${theme.primaryColor}06`,
          borderColor: `${theme.primaryColor}18`,
        },
      ]}
    >
      {/* Center Pivot Point */}
      <View
        style={[
          styles.centerPivot,
          {
            left: center - 4,
            top: center - 4,
            backgroundColor: theme.primaryColor,
          },
        ]}
      />

      {/* Clock Hand Line */}
      {selectedItem && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: center,
            top: center,
            width: currentR,
            height: 2,
            backgroundColor: theme.primaryColor,
            transformOrigin: 'left center',
            transform: [
              { rotate: `${selectedItem.index * 30 - 90}deg` },
            ],
          }}
        />
      )}

      {/* Clock Numbers */}
      {items.map((item) => {
        const r = item.isInner ? innerRadius : radius;
        const angle = (item.index * 30 - 90) * (Math.PI / 180);
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        const isSelected = item.num === value;
        const btnSize = item.isInner ? 28 : 34;

        return (
          <TouchableOpacity
            key={`${item.num}-${item.isInner}`}
            activeOpacity={0.7}
            disabled={item.disabled}
            onPress={() => onSelect(item.num)}
            style={[
              styles.numberNode,
              {
                left: x - btnSize / 2,
                top: y - btnSize / 2,
                width: btnSize,
                height: btnSize,
                borderRadius: btnSize / 2,
                backgroundColor: isSelected
                  ? theme.primaryColor
                  : 'transparent',
                opacity: item.disabled ? 0.3 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.numberText,
                {
                  color: isSelected
                    ? '#FFFFFF'
                    : item.isInner
                    ? theme.secondaryTextColor
                    : theme.textColor,
                  fontSize: item.isInner ? 11 : 13,
                  fontWeight: isSelected ? '800' : '600',
                },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  clockContainer: {
    borderWidth: 1.5,
    position: 'relative',
    alignSelf: 'center',
    marginVertical: 12,
  },
  centerPivot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    zIndex: 5,
  },
  numberNode: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  numberText: {
    textAlign: 'center',
  },
});
