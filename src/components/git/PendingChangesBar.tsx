import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from '@/components/common';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '@/constants';
import { useFileTree } from '@/contexts';

interface PendingChangesBarProps {
  onCreatePR: () => void;
}

export function PendingChangesBar({ onCreatePR }: PendingChangesBarProps) {
  const { pendingChanges } = useFileTree();

  if (pendingChanges.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Icon name="alert-circle" size={14} color={COLORS.warning} />
      <Text style={styles.text}>
        {pendingChanges.length} pending change{pendingChanges.length > 1 ? 's' : ''}
      </Text>
      <TouchableOpacity onPress={onCreatePR}>
        <Text style={styles.link}>/pr</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: RADIUS.lg,
    gap: SPACING.sm,
  },
  text: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.warning,
    fontFamily: TYPOGRAPHY.fontFamily.mono,
  },
  link: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.warning,
    fontFamily: TYPOGRAPHY.fontFamily.mono,
    textDecorationLine: 'underline',
  },
});

export default PendingChangesBar;
