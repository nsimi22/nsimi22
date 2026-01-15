import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from '@/components/common';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants';
import { useAuth, useFileTree } from '@/contexts';
import { AuthState } from '@/types';

export function StatusBar() {
  const { authState, authMethod } = useAuth();
  const { connectedRepo } = useFileTree();

  const isAuthenticated = authState === AuthState.AUTHENTICATED;

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {isAuthenticated ? (
          <View style={styles.item}>
            <Icon name="lock" size={10} color={COLORS.success} />
            <Text style={styles.textSuccess}>
              {authMethod === 'oauth' ? 'OAuth' : 'API Key'}
            </Text>
          </View>
        ) : (
          <View style={styles.item}>
            <Icon name="unlock" size={10} color={COLORS.textMuted} />
            <Text style={styles.text}>Not authenticated</Text>
          </View>
        )}
      </View>

      <View style={styles.right}>
        {connectedRepo && (
          <View style={styles.item}>
            <Icon name="git-branch" size={12} color={COLORS.textMuted} />
            <Text style={styles.text}>{connectedRepo.branch}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  text: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    fontFamily: TYPOGRAPHY.fontFamily.mono,
  },
  textSuccess: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.success,
    fontFamily: TYPOGRAPHY.fontFamily.mono,
  },
});

export default StatusBar;
