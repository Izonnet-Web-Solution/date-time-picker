import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

export type IconType =
  | 'chevron-left'
  | 'chevron-right'
  | 'close'
  | 'calendar'
  | 'keyboard'
  | 'check';

export interface IconButtonProps {
  icon: IconType;
  onPress: () => void;
  size?: number;
  color?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 20,
  color = '#2563EB',
  disabled = false,
  style,
  accessibilityLabel,
}) => {
  const renderIcon = () => {
    switch (icon) {
      case 'chevron-left':
        return (
          <View
            style={[
              styles.chevron,
              {
                width: size * 0.45,
                height: size * 0.45,
                borderColor: color,
                borderLeftWidth: 2,
                borderBottomWidth: 2,
                transform: [{ rotate: '45deg' }, { translateX: 1 }],
              },
            ]}
          />
        );
      case 'chevron-right':
        return (
          <View
            style={[
              styles.chevron,
              {
                width: size * 0.45,
                height: size * 0.45,
                borderColor: color,
                borderTopWidth: 2,
                borderRightWidth: 2,
                transform: [{ rotate: '45deg' }, { translateX: -1 }],
              },
            ]}
          />
        );
      case 'close':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            <View
              style={[
                styles.crossLine,
                {
                  width: size * 0.7,
                  backgroundColor: color,
                  transform: [{ rotate: '45deg' }],
                },
              ]}
            />
            <View
              style={[
                styles.crossLine,
                {
                  width: size * 0.7,
                  backgroundColor: color,
                  transform: [{ rotate: '-45deg' }],
                },
              ]}
            />
          </View>
        );
      case 'calendar':
        return (
          <View
            style={[
              styles.calendarBox,
              {
                width: size * 0.9,
                height: size * 0.9,
                borderColor: color,
              },
            ]}
          >
            <View style={[styles.calendarTop, { backgroundColor: color }]} />
            <View style={styles.calendarGrid}>
              <View style={[styles.calendarDot, { backgroundColor: color }]} />
              <View style={[styles.calendarDot, { backgroundColor: color }]} />
              <View style={[styles.calendarDot, { backgroundColor: color }]} />
            </View>
          </View>
        );
      case 'keyboard':
        return (
          <View
            style={[
              styles.keyboardBox,
              {
                width: size,
                height: size * 0.7,
                borderColor: color,
              },
            ]}
          >
            <View style={styles.keyboardRow}>
              <View style={[styles.keyDot, { backgroundColor: color }]} />
              <View style={[styles.keyDot, { backgroundColor: color }]} />
              <View style={[styles.keyDot, { backgroundColor: color }]} />
            </View>
            <View
              style={[
                styles.spacebar,
                {
                  backgroundColor: color,
                  width: size * 0.5,
                },
              ]}
            />
          </View>
        );
      case 'check':
        return (
          <Text style={{ color, fontSize: size, fontWeight: '700' }}>✓</Text>
        );
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || icon}
      accessibilityState={{ disabled }}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      style={[
        styles.button,
        {
          width: Math.max(size * 1.6, 36),
          height: Math.max(size * 1.6, 36),
          opacity: disabled ? 0.4 : 1,
        },
        style,
      ]}
    >
      {renderIcon()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: {
    borderRadius: 1,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossLine: {
    position: 'absolute',
    height: 2,
    borderRadius: 1,
  },
  calendarBox: {
    borderWidth: 1.5,
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'space-between',
    paddingBottom: 2,
  },
  calendarTop: {
    height: '25%',
    width: '100%',
  },
  calendarGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 2,
  },
  calendarDot: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1,
  },
  keyboardBox: {
    borderWidth: 1.5,
    borderRadius: 3,
    padding: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  keyDot: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1,
  },
  spacebar: {
    height: 1.5,
    borderRadius: 1,
  },
});
