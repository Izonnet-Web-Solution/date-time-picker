import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import type { CalendarDayCell, DatePickerTheme, DatePickerLocale } from '../../types';
import { formatDate } from '../../utils/dateFormatting';

export interface RangeDateCellProps {
  cell: CalendarDayCell;
  theme: DatePickerTheme;
  locale: DatePickerLocale;
  onPress: (date: Date) => void;
  size?: number;
}

export const RangeDateCell: React.FC<RangeDateCellProps> = ({
  cell,
  theme,
  locale,
  onPress,
  size = 40,
}) => {
  const {
    date,
    dayNumber,
    isCurrentMonth,
    isToday,
    isRangeStart,
    isRangeEnd,
    isInRange,
    isDisabled,
  } = cell;

  const accessibleDateLabel = formatDate(date, 'DD MMMM YYYY', locale);

  const getTextColor = (): string => {
    if (isDisabled) return theme.disabledTextColor;
    if (isRangeStart || isRangeEnd) return theme.selectedDayTextColor;
    if (isInRange) return theme.rangeBetweenTextColor;
    if (isToday) return theme.todayTextColor;
    if (!isCurrentMonth) return theme.secondaryTextColor;
    return theme.textColor;
  };

  const isEdge = isRangeStart || isRangeEnd;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={isDisabled}
      onPress={() => onPress(date)}
      accessibilityRole="button"
      accessibilityLabel={accessibleDateLabel}
      accessibilityState={{
        selected: isEdge || isInRange,
        disabled: isDisabled,
      }}
      style={[
        styles.cellWrapper,
        {
          width: `${100 / 7}%`,
          height: size,
        },
      ]}
    >
      {/* Background connector for range */}
      {isInRange && !isEdge && (
        <View
          style={[
            styles.rangeRibbon,
            {
              backgroundColor: theme.rangeBetweenBackgroundColor,
              height: size * 0.85,
            },
          ]}
        />
      )}

      {/* Half connector for Start date */}
      {isRangeStart && cell.isRangeEnd === false && (
        <View
          style={[
            styles.rangeRibbon,
            styles.ribbonRightHalf,
            {
              backgroundColor: theme.rangeBetweenBackgroundColor,
              height: size * 0.85,
            },
          ]}
        />
      )}

      {/* Half connector for End date */}
      {isRangeEnd && cell.isRangeStart === false && (
        <View
          style={[
            styles.rangeRibbon,
            styles.ribbonLeftHalf,
            {
              backgroundColor: theme.rangeBetweenBackgroundColor,
              height: size * 0.85,
            },
          ]}
        />
      )}

      {/* Circle pill */}
      <View
        style={[
          styles.cellCircle,
          {
            width: size * 0.85,
            height: size * 0.85,
            borderRadius: (size * 0.85) / 2,
            backgroundColor: isEdge
              ? theme.selectedDayBackgroundColor
              : 'transparent',
            borderWidth: isToday && !isEdge ? 1.5 : 0,
            borderColor: isToday && !isEdge ? theme.todayBorderColor : 'transparent',
            opacity: !isCurrentMonth ? 0.45 : 1,
          },
        ]}
      >
        <Text
          style={[
            styles.dayText,
            {
              color: getTextColor(),
              fontSize: theme.fontSize.medium,
              fontWeight: isEdge || isToday ? '700' : '400',
            },
          ]}
        >
          {dayNumber}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cellWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 2,
  },
  rangeRibbon: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '7.5%',
    zIndex: 0,
  },
  ribbonRightHalf: {
    left: '50%',
    right: 0,
  },
  ribbonLeftHalf: {
    left: 0,
    right: '50%',
  },
  cellCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  dayText: {
    textAlign: 'center',
  },
});
