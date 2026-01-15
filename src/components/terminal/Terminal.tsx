import React, { useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTerminal } from '@/contexts';
import { TerminalMessageView } from './TerminalMessage';
import { TerminalInput } from './TerminalInput';
import { COLORS, SPACING } from '@/constants';

export function Terminal() {
  const { history, isProcessing, handleInput, initializeTerminal } = useTerminal();
  const scrollViewRef = useRef<ScrollView>(null);

  // Initialize terminal on mount
  useEffect(() => {
    initializeTerminal();
  }, [initializeTerminal]);

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [history]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {history.map((message) => (
          <TerminalMessageView key={message.id} message={message} />
        ))}
      </ScrollView>

      <TerminalInput onSubmit={handleInput} isProcessing={isProcessing} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.sm,
  },
});

export default Terminal;
