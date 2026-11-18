import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  AccessibilityRole,
} from 'react-native';
import type { DatePickerTheme } from '../../types';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  theme: DatePickerTheme;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  theme,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityRole = 'button',
}) => {
  const isSmall = size === 'small';

  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? theme.disabledTextColor : theme.primaryColor,
          borderColor: 'transparent',
        };
      case 'secondary':
        return {
          backgroundColor: theme.surfaceColor,
          borderColor: theme.borderColor,
          borderWidth: 1,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: disabled ? theme.disabledTextColor : theme.primaryColor,
          borderWidth: 1,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        };
    }
  };

  const getTextColor = (): string => {
    if (disabled) return theme.disabledTextColor;
    switch (variant) {
      case 'primary':
        return theme.primaryTextColor;
      case 'secondary':
        return theme.textColor;
      case 'outline':
      case 'text':
        return theme.primaryColor;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={onPress}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled }}
      style={[
        styles.base,
        {
          borderRadius: Math.max(theme.borderRadius - 4, 8),
          paddingVertical: isSmall ? 6 : 10,
          paddingHorizontal: isSmall ? 12 : 16,
        },
        getContainerStyle(),
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: getTextColor(),
            fontSize: isSmall ? theme.fontSize.small : theme.fontSize.medium,
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
