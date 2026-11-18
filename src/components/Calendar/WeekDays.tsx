import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { DatePickerTheme } from '../../types';

export interface WeekDaysProps {
  weekdays: { index: number; name: string; short: string; min: string }[];
  theme: DatePickerTheme;
}

export const WeekDays: React.FC<WeekDaysProps> = ({ weekdays, theme }) => {
  return (
    <View style={styles.container}>
      {weekdays.map((day) => (
        <View key={day.index} style={styles.cell}>
          <Text
            style={[
              styles.text,
              {
                color: theme.secondaryTextColor,
                fontSize: theme.fontSize.small,
              },
            ]}
          >
            {day.min || day.short}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
