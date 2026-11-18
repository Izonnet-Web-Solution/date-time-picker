import React from 'react';
import {
  Modal as RNModal,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import type { DatePickerTheme } from '../../types';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  theme: DatePickerTheme;
  contentStyle?: StyleProp<ViewStyle>;
  backdropOpacity?: number;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  children,
  theme,
  contentStyle,
  backdropOpacity = 0.5,
}) => {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={[
            styles.backdrop,
            { backgroundColor: `rgba(0, 0, 0, ${backdropOpacity})` },
          ]}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardAvoid}
          >
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.backgroundColor,
                    borderRadius: theme.borderRadius,
                    borderColor: theme.borderColor,
                  },
                  contentStyle,
                ]}
              >
                {children}
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  keyboardAvoid: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
});
