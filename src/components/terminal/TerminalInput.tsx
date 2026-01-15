import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Icon } from '@/components/common';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '@/constants';
import { AuthState } from '@/types';
import { useAuth } from '@/contexts';

interface TerminalInputProps {
  onSubmit: (value: string) => void;
  isProcessing: boolean;
}

export function TerminalInput({ onSubmit, isProcessing }: TerminalInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<TextInput>(null);
  const { authState } = useAuth();

  const isAuthenticated = authState === AuthState.AUTHENTICATED;

  const handleSubmit = () => {
    if (!value.trim() || isProcessing) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSubmit(value);
    setValue('');
    Keyboard.dismiss();
  };

  const placeholder = isAuthenticated
    ? 'Ask Claude or type /help'
    : 'Type /login or /auth <key>';

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <View style={styles.promptContainer}>
          <View style={styles.prompt}>
            <Icon name="terminal" size={16} color={COLORS.primary} />
          </View>
        </View>

        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          value={value}
          onChangeText={setValue}
          onSubmitEditing={handleSubmit}
          returnKeyType="send"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isProcessing}
          multiline={false}
        />

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!value.trim() || isProcessing) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!value.trim() || isProcessing}
        >
          <Icon
            name="arrow-up"
            size={18}
            color={!value.trim() || isProcessing ? COLORS.textMuted : COLORS.text}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.base,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  promptContainer: {
    paddingLeft: SPACING.base,
    paddingRight: SPACING.sm,
  },
  prompt: {
    opacity: 0.8,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingRight: SPACING.base,
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.fontFamily.mono,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  submitButton: {
    margin: SPACING.sm,
    padding: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.surfaceLight,
  },
});

export default TerminalInput;
