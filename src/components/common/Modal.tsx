import React from 'react';
import {
  Modal as RNModal,
  View,
  ScrollView,
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
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        {/* Backdrop touchable overlay to close when tapped outside */}
        <TouchableWithoutFeedback
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close modal"
        >
          <View
            style={[
              StyleSheet.absoluteFillObject,
              { backgroundColor: `rgba(0, 0, 0, ${backdropOpacity})` },
            ]}
          />
        </TouchableWithoutFeedback>

        {/* Modal content dialog */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoid}
          pointerEvents="box-none"
        >
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.cardColor || theme.backgroundColor,
                borderRadius: Math.max(theme.borderRadius ?? 20, 24),
                borderColor: theme.borderColor,
              },
              contentStyle,
            ]}
          >
            {/* Top Drag / Sheet Handle Indicator */}
            <View
              style={[
                styles.handleIndicator,
                { backgroundColor: theme.borderColor },
              ]}
            />

            {/* Scrollable Container to prevent overflow on small screens */}
            <ScrollView
              bounces={false}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}
            >
              {children}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  keyboardAvoid: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '95%',
    maxWidth: 440,
    minHeight: 450,
    maxHeight: '94%',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 16,
    overflow: 'hidden',
  },
  handleIndicator: {
    width: 42,
    height: 4.5,
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 8,
    opacity: 0.5,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingBottom: 14,
    justifyContent: 'space-between',
  },
});
