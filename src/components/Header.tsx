import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon, CircleIcon } from '@/components/common';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '@/constants';
import { useAuth, useFileTree } from '@/contexts';
import { AuthState } from '@/types';

interface HeaderProps {
  onToggleFiles: () => void;
  onOpenSettings: () => void;
  showFileBrowser: boolean;
}

export function Header({ onToggleFiles, onOpenSettings, showFileBrowser }: HeaderProps) {
  const { authState, authMethod, user } = useAuth();
  const { connectedRepo } = useFileTree();

  const isAuthenticated = authState === AuthState.AUTHENTICATED;
  const isPending = authState === AuthState.OAUTH_PENDING;

  const getStatusText = () => {
    if (isAuthenticated) {
      return authMethod === 'oauth' ? user?.email : 'API Key';
    }
    if (isPending) {
      return 'Waiting for auth...';
    }
    return 'Not authenticated';
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.logo}>
          <Icon name="sparkles" size={18} color={COLORS.text} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>SimiCode IDE</Text>
          <View style={styles.statusRow}>
            {isAuthenticated ? (
              <CircleIcon size={6} color={COLORS.success} filled />
            ) : isPending ? (
              <Icon name="loader" size={10} color={COLORS.warning} />
            ) : (
              <CircleIcon size={6} color={COLORS.textMuted} />
            )}
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.right}>
        {isAuthenticated && (
          <TouchableOpacity
            style={[styles.iconButton, showFileBrowser && styles.iconButtonActive]}
            onPress={onToggleFiles}
          >
            <Icon
              name="folder"
              size={18}
              color={showFileBrowser ? COLORS.primary : COLORS.textSecondary}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.iconButton} onPress={onOpenSettings}>
          <Icon name="settings" size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
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
    paddingVertical: SPACING.md,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    gap: 2,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statusText: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconButton: {
    padding: SPACING.sm,
    borderRadius: RADIUS.lg,
  },
  iconButtonActive: {
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
  },
});

export default Header;
